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
  };
}

export function getMqttHandler(
  firmware: AirDeviceFirmware,
  callbacks: { onRequestUpdate: () => Promise<AirDeviceStatus | undefined> }
) {
  const topics = getTopics();
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
    console.log('mqtt connected');
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
    publish(topics.ledControl.stateTopicBrightness, status.aqil.toString());
    publish(topics.ledControl.stateTopic, status.aqil === 0 ? 'OFF' : 'ON');
    publish(topics.pm25Sensor.stateTopic, status.pm25.toString());
    publish(topics.allergyIndexSensor.stateTopic, status.iaql.toString());
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
