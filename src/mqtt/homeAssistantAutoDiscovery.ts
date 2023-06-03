import { type MqttClient } from 'mqtt';
import { getTopics } from './mqtt.js';
import config from '../config.js';

export function getHomeAssistantAutoDiscoveryHandler(
  device: {
    name: string;
    firmware: {
      name: string;
      version: string;
    };
  },
  mqtt: MqttClient
) {
  const getAutoDiscoveryDevice = () => ({
    manufacturer: 'Philips',
    model: device.firmware.name.replace('_', '/'),
    name: config.airPurifier.deviceName,
    identifiers: [device.name],
    sw_version: device.firmware.version,
  });

  const topics = getTopics();
  const deviceAvailabilityTopic = `philips-air/${device.name}/$state`;
  const configTopicModeControl = `homeassistant/select/${device.name}/mode/config`;
  const configTopicLedControl = `homeassistant/light/${device.name}/light/config`;
  const configTopicChildLockControl = `homeassistant/switch/${device.name}/childLock/config`;
  const configTopicPm25Sensor = `homeassistant/sensor/${device.name}/pm25/config`;
  const configTopicAllergyIndexSensor = `homeassistant/sensor/${device.name}/allergenIndex/config`;

  const configPayloadLedControl = {
    state_topic: topics.ledControl.stateTopic,
    brightness_state_topic: topics.ledControl.stateTopicBrightness,
    state_value_template: '{{ value }}',
    command_topic: topics.ledControl.commandTopic,
    brightness_command_topic: topics.ledControl.commandTopicBrightness,
    icon: 'mdi:light-recessed',
    entity_category: 'config',
    name: 'Light',
    object_id: `${device.name}_light`,
    unique_id: `${device.name}_LedControl`,
    availability_topic: deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    // payload_on: "100",
    // payload_off: "0",
    brightness_scale: 100,
    brightness: true,
    color_mode: true,
    supported_color_modes: ['brightness'],
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadModeControl = {
    state_topic: topics.modeControl.stateTopic,
    state_value_template: '{{ value }}',
    command_topic: topics.modeControl.commandTopic,
    options: [
      'auto',
      'sleep',
      'low',
      'medium',
      'high',
      'turbo',
      'allergen',
      'bacteria',
      'off',
    ],
    icon: 'mdi:fan',
    name: 'Mode',
    object_id: `${device.name}_modeControl`,
    unique_id: `${device.name}_mode`,
    availability_topic: deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadPm25Sensor = {
    state_topic: topics.pm25Sensor.stateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:air-filter',
    name: 'PM2.5',
    object_id: `${device.name}_pm25`,
    unique_id: `${device.name}_pm25`,
    availability_topic: deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    unit_of_measurement: 'μg/m³',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadAllergyIndexSensor = {
    state_topic: topics.allergyIndexSensor.stateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:flower-pollen-outline',
    name: 'Allergy Index',
    object_id: `${device.name}_allergenIndex`,
    unique_id: `${device.name}allergenIndex`,
    availability_topic: deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadChildLock = {
    state_topic: topics.childLockControl.stateTopic,
    command_topic: topics.childLockControl.commandTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:lock',
    name: 'Child Lock',
    object_id: `${device.name}_childLock`,
    unique_id: `${device.name}_childLock`,
    availability_topic: deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const publish = (topic: string, message: unknown) => {
    const mqttMessage = message !== undefined ? JSON.stringify(message) : '';
    mqtt.publish(topic, mqttMessage, { retain: true });
  };

  const publishAutoDiscovery = () => {
    publish(configTopicModeControl, configPayloadModeControl);
    publish(configTopicLedControl, configPayloadLedControl);
    publish(configTopicPm25Sensor, configPayloadPm25Sensor);
    publish(configTopicAllergyIndexSensor, configPayloadAllergyIndexSensor);
    publish(configTopicChildLockControl, configPayloadChildLock);
    publish(deviceAvailabilityTopic, 'lost');
  };

  const unpublishAutoDiscovery = () => {
    publish(configTopicModeControl, undefined);
    publish(configTopicLedControl, undefined);
    publish(configTopicPm25Sensor, undefined);
    publish(configTopicAllergyIndexSensor, undefined);
    publish(configTopicChildLockControl, undefined);
    publish(deviceAvailabilityTopic, undefined);
  };

  const deviceReady = () => {
    publish(deviceAvailabilityTopic, 'ready');
  };

  const deviceLost = () => {
    publish(deviceAvailabilityTopic, 'lost');
  };

  return {
    deviceReady,
    deviceLost,
    publishAutoDiscovery,
    unpublishAutoDiscovery,
  };
}

export type HomeAssistantAutoDiscoveryHandler = ReturnType<
  typeof getHomeAssistantAutoDiscoveryHandler
>;
