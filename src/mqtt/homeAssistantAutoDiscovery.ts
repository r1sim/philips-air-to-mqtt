import { type MqttClient } from 'mqtt';
import { getTopics } from './mqtt.js';
import config from '../config.js';
import { AirDeviceStatus } from '../philipsTypes.js';

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
  const configTopicHoursPreFilterSensor = `homeassistant/sensor/${device.name}/hoursPreFilter/config`;
  const configTopicHoursHepaFilterSensor = `homeassistant/sensor/${device.name}/hoursHepaFilter/config`;
  const configTopicHoursCarbonFilterSensor = `homeassistant/sensor/${device.name}/hoursCarbonFilter/config`;
  const configTopicHoursWickFilterHoursSensor = `homeassistant/sensor/${device.name}/hoursWickFilter/config`;

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

  const configPayloadPreFilterRemainingHoursSensor = {
    state_topic: topics.filterStatus.preFilterStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining Pre-filter Hours',
    object_id: `${device.name}_preFilter`,
    unique_id: `${device.name}_preFilter`,
    availability_topic: deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadCarbonFilterRemainingHoursSensor = {
    state_topic: topics.filterStatus.carbonFilterStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining Carbon Filter Hours',
    object_id: `${device.name}_carbonFilter`,
    unique_id: `${device.name}_carbonFilter`,
    availability_topic: deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadHepaFilterRemainingHoursSensor = {
    state_topic: topics.filterStatus.hepaFilterStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining HEPA Filter Hours',
    object_id: `${device.name}_hepaFilter`,
    unique_id: `${device.name}_hepaFilter`,
    availability_topic: deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadWickFilterRemainingHoursSensor = {
    state_topic: topics.filterStatus.wickFilterStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining Wick Filter Hours',
    object_id: `${device.name}_wickFilter`,
    unique_id: `${device.name}_wickFilter`,
    availability_topic: deviceAvailabilityTopic,
    unit_of_measurement: 'h',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const publish = (topic: string, message: unknown) => {
    if (message !== undefined) {
      const isString = typeof message === 'string';
      const mqttMessage = isString ? message : JSON.stringify(message);
      mqtt.publish(topic, mqttMessage, { retain: true });
    } else {
      mqtt.publish(topic, '', { retain: true });
    }
  };

  const publishAutoDiscovery = (airDeviceStatus: AirDeviceStatus) => {
    if (airDeviceStatus.mode)
      publish(configTopicModeControl, configPayloadModeControl);
    if (airDeviceStatus.aqil)
      publish(configTopicLedControl, configPayloadLedControl);
    if (airDeviceStatus.pm25)
      publish(configTopicPm25Sensor, configPayloadPm25Sensor);
    if (airDeviceStatus.iaql)
      publish(configTopicAllergyIndexSensor, configPayloadAllergyIndexSensor);
    if (airDeviceStatus.cl)
      publish(configTopicChildLockControl, configPayloadChildLock);

    if (airDeviceStatus.fltsts0)
      publish(
        configTopicHoursPreFilterSensor,
        configPayloadPreFilterRemainingHoursSensor
      );
    if (airDeviceStatus.fltsts1)
      publish(
        configTopicHoursCarbonFilterSensor,
        configPayloadCarbonFilterRemainingHoursSensor
      );
    if (airDeviceStatus.fltsts2)
      publish(
        configTopicHoursHepaFilterSensor,
        configPayloadHepaFilterRemainingHoursSensor
      );
    if (airDeviceStatus.wicksts)
      publish(
        configTopicHoursWickFilterHoursSensor,
        configPayloadWickFilterRemainingHoursSensor
      );
  };

  const unpublishAutoDiscovery = () => {
    publish(configTopicModeControl, undefined);
    publish(configTopicLedControl, undefined);
    publish(configTopicPm25Sensor, undefined);
    publish(configTopicAllergyIndexSensor, undefined);
    publish(configTopicChildLockControl, undefined);
    publish(configTopicHoursPreFilterSensor, undefined);
    publish(configTopicHoursCarbonFilterSensor, undefined);
    publish(configTopicHoursHepaFilterSensor, undefined);
    publish(configTopicHoursWickFilterHoursSensor, undefined);
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
