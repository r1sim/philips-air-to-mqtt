import { MqttClient } from 'mqtt';
import config from '../config.js';
import { type AirDeviceStatus } from '../philipsTypes.js';
import { handleMqttMessage } from './handleMessage.js';
import { getHomeAssistantAutoDiscoveryHandler } from './homeAssistantAutoDiscovery.js';
import { AirClient } from 'philips-air';

export function getTopics() {
  const topicPrefix = `${config.mqtt.topicPrefix}/${config.airPurifier.deviceName}`;
  return {
    deviceAvailabilityTopic: `${topicPrefix}/$state`,
    onStatusStateTopic: `${topicPrefix}/state`,
    fan: {
      modeStateTopic: `${topicPrefix}/fan/state`,
      modeCommandTopic: `${topicPrefix}/fan/state/set`,
      speedStateTopic: `${topicPrefix}/fan/speed`,
      speedCommandTopic: `${topicPrefix}/fan/speed/set`,
    },
    ledControl: {
      stateTopic: `${topicPrefix}/light/state`,
      commandTopic: `${topicPrefix}/light/state/set`,
      stateTopicBrightness: `${topicPrefix}/light/brightness`,
      commandTopicBrightness: `${topicPrefix}/light/brightness/set`,
    },
    sensors: {
      pm25StateTopic: `${topicPrefix}/sensors/pm25`,
      allergenIndexStateTopic: `${topicPrefix}/sensors/allergenIndex`,
    },
    // childLockControl: {
    //   stateTopic: `${topicPrefix}/childLock`,
    //   commandTopic: `${topicPrefix}/childLock/set`,
    // },
    filters: {
      preFilterRemainingHoursStateTopic: `${topicPrefix}/filters/pre/remainingHours`,
      carbonFilterRemainingHoursStateTopic: `${topicPrefix}/filters/carbon/remainingHours`,
      hepaFilterRemainingHoursStateTopic: `${topicPrefix}/filters/hepa/remainingHours`,
      wickFilterRemainingHoursStateTopic: `${topicPrefix}/filters/wick/remainingHours`,
    },
  };
}

export function getMqttHandler(
  mqttClient: MqttClient,
  airDeviceStatus: AirDeviceStatus,
  airClient: AirClient,
  callbacks: { onRequestUpdate: () => Promise<void> }
) {
  const topics = getTopics();
  const mqttHomeAssistantConf = config.mqtt.homeAssistantAutoDiscovery.enabled
    ? getHomeAssistantAutoDiscoveryHandler(
        {
          name: config.airPurifier.deviceName,
          firmware: {
            name: airDeviceStatus.name,
            version:
              airDeviceStatus.version ?? airDeviceStatus.swversion ?? 'unknown',
          },
        },
        mqttClient
      )
    : undefined;

  mqttClient.on('message', async (topic, message) => {
    try {
      await handleMqttMessage(topic, message, airClient);
      callbacks.onRequestUpdate();
    } catch (error) {
      console.error('Error while handling mqtt message', error);
    }
  });

  const publish = (topic: string, message: unknown) => {
    const messageIsAString = typeof message === 'string';

    try {
      mqttClient.publish(
        topic,
        messageIsAString ? message : JSON.stringify(message),
        { retain: true }
      );
    } catch (error) {
      console.error('Error while publishing mqtt message', error);
    }
  };

  const publishDeviceStatus = (status: AirDeviceStatus) => {
    console.log('Publishing device status', JSON.stringify(status));
    if (!mqttClient?.connected) return;
    const mode =
      status.pwr === '0'
        ? 'off'
        : status.mode === 'P'
        ? 'auto'
        : status.mode === 'B'
        ? 'bacteria'
        : status.mode === 'A'
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
    if (status.aqil !== undefined) {
      publish(topics.ledControl.stateTopicBrightness, status.aqil);
    }
    if (status.aqil !== undefined) {
      publish(topics.ledControl.stateTopic, status.aqil === 0 ? 'OFF' : 'ON');
    }
    if (status.pm25 !== undefined) {
      publish(topics.sensors.pm25StateTopic, status.pm25);
    }
    if (status.iaql !== undefined) {
      publish(topics.sensors.allergenIndexStateTopic, status.iaql);
    }

    // Filter Status
    if (status.wicksts !== undefined) {
      publish(
        topics.filters.wickFilterRemainingHoursStateTopic,
        status.wicksts
      );
    }
    if (status.fltsts0 !== undefined) {
      publish(topics.filters.preFilterRemainingHoursStateTopic, status.fltsts0);
    }
    if (status.fltsts1 !== undefined) {
      publish(
        topics.filters.carbonFilterRemainingHoursStateTopic,
        status.fltsts1
      );
    }
    if (status.fltsts2 !== undefined) {
      publish(
        topics.filters.hepaFilterRemainingHoursStateTopic,
        status.fltsts2
      );
    }

    publish(topics.onStatusStateTopic, status.pwr === '0' ? 'off' : 'on');

    switch (mode) {
      case 'off':
        publish(topics.fan.speedStateTopic, 'None');
        publish(topics.fan.modeStateTopic, 'off');
        break;
      case 'sleep':
        publish(topics.fan.speedStateTopic, 1);
        publish(topics.fan.modeStateTopic, 'sleep');
        break;
      case 'low':
        publish(topics.fan.speedStateTopic, 2);
        publish(topics.fan.modeStateTopic, 'low');
        break;
      case 'medium':
        publish(topics.fan.speedStateTopic, 3);
        publish(topics.fan.modeStateTopic, 'medium');
        break;
      case 'high':
        publish(topics.fan.speedStateTopic, 4);
        publish(topics.fan.modeStateTopic, 'high');
        break;
      case 'max':
        publish(topics.fan.speedStateTopic, 5);
        publish(topics.fan.modeStateTopic, 'turbo');
        break;
      case 'auto':
        publish(topics.fan.speedStateTopic, 'None');
        publish(topics.fan.modeStateTopic, 'auto');
        break;
      case 'bacteria':
        publish(topics.fan.speedStateTopic, 'None');
        publish(topics.fan.modeStateTopic, 'bacteria');
        break;
      case 'allergen':
        publish(topics.fan.speedStateTopic, 'None');
        publish(topics.fan.modeStateTopic, 'allergen');
        break;
    }

    //publish(topics.childLockControl.stateTopic, status.cl ? 'ON' : 'OFF');
    publish(topics.deviceAvailabilityTopic, 'ready');
  };

  const handleShutdown = () => {
    if (
      config.mqtt.homeAssistantAutoDiscovery.enabled &&
      config.mqtt.homeAssistantAutoDiscovery.deleteOnShutdown
    ) {
      mqttHomeAssistantConf?.unpublishAutoDiscovery();
    }
    publishDeviceLost();
    mqttClient.end();
  };

  const publishDeviceLost = () => {
    publish(topics.deviceAvailabilityTopic, 'lost');
  };

  mqttClient.subscribe(topics.fan.modeCommandTopic);
  mqttClient.subscribe(topics.ledControl.commandTopic);
  mqttClient.subscribe(topics.ledControl.commandTopicBrightness);
  mqttClient.subscribe(topics.fan.speedCommandTopic);
  //mqttClient.subscribe(topics.childLockControl.commandTopic);
  mqttHomeAssistantConf?.publishAutoDiscovery(airDeviceStatus);
  publishDeviceStatus(airDeviceStatus);

  return {
    handleShutdown,
    publishDeviceStatus,
    publishDeviceLost,
  };
}
