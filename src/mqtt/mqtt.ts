import { connect } from 'mqtt';
import config from '../config.js';
import {
  type AirDeviceFirmware,
  type AirDeviceStatus,
} from '../philipsTypes.js';
import { handleMqttMessage } from './handleMessage.js';
import { getHomeAssistantAutoDiscoveryHandler } from './homeAssistantAutoDiscovery.js';

export function getTopics() {
  const topicPrefix = `${config.mqtt.topicPrefix}/${config.airPurifier.deviceName}`;
  return {
    modeControl: {
      stateTopic: `${topicPrefix}/mode`,
      commandTopic: `${topicPrefix}/mode/set`,
    },
    ledControl: {
      stateTopic: `${topicPrefix}/light`,
      commandTopic: `${topicPrefix}/light/set`,
      stateTopicBrightness: `${topicPrefix}/brightness`,
      commandTopicBrightness: `${topicPrefix}/brightness/set`,
    },
    childLockControl: {
      stateTopic: `${topicPrefix}/childLock`,
      commandTopic: `${topicPrefix}/childLock/set`,
    },
    pm25Sensor: {
      stateTopic: `${topicPrefix}/pm25`,
    },
    allergyIndexSensor: {
      stateTopic: `${topicPrefix}/allergenIndex`,
    },
    filterStatus: {
      preFilterStateTopic: `${topicPrefix}/preFilter`,
      carbonFilterStateTopic: `${topicPrefix}/carbonFilter`,
      hepaFilterStateTopic: `${topicPrefix}/hepaFilter`,
      wickFilterStateTopic: `${topicPrefix}/wickFilter`,
    },
  };
}

export function getMqttHandler(
  firmware: AirDeviceFirmware,
  callbacks: { onRequestUpdate: () => Promise<AirDeviceStatus | undefined> }
) {
  const topics = getTopics();
  console.info('Connecting to MQTT broker');
  const mqttClient = connect({
    host: config.mqtt.connection.host,
    port: config.mqtt.connection.port,
    username: config.mqtt.connection.username,
    password: config.mqtt.connection.password,
  });
  const mqttHomeAssistantConf = getHomeAssistantAutoDiscoveryHandler(
    { name: config.airPurifier.deviceName, firmware },
    mqttClient
  );
  mqttClient.on('connect', () => {
    console.log('MQTT connected');
    mqttClient.subscribe(topics.modeControl.commandTopic);
    mqttClient.subscribe(topics.ledControl.commandTopic);
    mqttClient.subscribe(topics.ledControl.commandTopicBrightness);
    mqttClient.subscribe(topics.childLockControl.commandTopic);
    mqttHomeAssistantConf.publishAutoDiscovery();
    callbacks.onRequestUpdate();
  });
  mqttClient.on('error', err => {
    console.error('mqtt error', err);
  });
  mqttClient.on('disconnect', () => {
    console.error('mqtt disconnected');
  });
  mqttClient.on('message', async (topic, message) => {
    await handleMqttMessage(topic, message, callbacks.onRequestUpdate);
    callbacks.onRequestUpdate();
  });

  const publish = (topic: string, message: unknown) => {
    const messageIsAString = typeof message === 'string';

    mqttClient.publish(
      topic,
      messageIsAString ? message : JSON.stringify(message),
      { retain: true }
    );
  };

  const publishMqttDeviceStatus = (status: AirDeviceStatus) => {
    console.log(JSON.stringify(status));
    if (!mqttClient?.connected) return;
    const mode =
      status.pwr === '0'
        ? 'off'
        : status.mode === 'A'
        ? 'auto'
        : status.mode === 'B'
        ? 'bacteria'
        : status.mode === 'P'
        ? 'allergen'
        : status.om === 's'
        ? 'sleep'
        : status.om === '1'
        ? 'low'
        : status.om === '2'
        ? 'medium'
        : status.om === '3'
        ? 'high'
        : status.om === 't'
        ? 'max'
        : 'off';

    const topics = getTopics();
    publish(topics.modeControl.stateTopic, mode);
    if (status.aqil)
      publish(topics.ledControl.stateTopicBrightness, status.aqil);
    if (status.aqil)
      publish(topics.ledControl.stateTopic, status.aqil === 0 ? 'OFF' : 'ON');
    if (status.pm25) publish(topics.pm25Sensor.stateTopic, status.pm25);
    if (status.iaql) publish(topics.allergyIndexSensor.stateTopic, status.iaql);

    // Filter Status
    if (status.wicksts)
      publish(topics.filterStatus.wickFilterStateTopic, status.wicksts);
    if (status.fltsts0)
      publish(topics.filterStatus.preFilterStateTopic, status.fltsts0);
    if (status.fltsts1)
      publish(topics.filterStatus.carbonFilterStateTopic, status.fltsts1);
    if (status.fltsts2)
      publish(topics.filterStatus.hepaFilterStateTopic, status.fltsts2);

    publish(topics.childLockControl.stateTopic, status.cl ? 'ON' : 'OFF');
    mqttHomeAssistantConf.deviceReady();
  };

  const publishConnectionLost = () => {
    mqttHomeAssistantConf.deviceLost();
  };

  return {
    publishMqttDeviceStatus,
    publishConnectionLost,
  };
}
