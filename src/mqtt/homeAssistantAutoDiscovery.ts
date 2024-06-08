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
  const configTopicFanControl = `homeassistant/fan/${device.name}/mode/config`;
  const configTopicLedControl = `homeassistant/light/${device.name}/light/config`;
  //const configTopicChildLockControl = `homeassistant/switch/${device.name}/childLock/config`;
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
    availability_topic: topics.deviceAvailabilityTopic,
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

  const configFan = {
    state_topic: topics.onStatusStateTopic,
    command_topic: topics.fan.modeCommandTopic,
    object_id: `${device.name}_fan`,
    unique_id: `${device.name}_fan`,
    payload_on: 'on',
    payload_off: 'off',
    availability_topic: topics.deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
    icon: 'mdi:fan',
    name: device.name,
    percentage_state_topic: topics.fan.speedStateTopic,
    percentage_command_topic: topics.fan.speedCommandTopic,
    preset_modes: [
      'auto',
      'allergen',
      'bacteria',
      'sleep',
      'low',
      'medium',
      'high',
      'turbo',
    ],
    preset_mode_state_topic: topics.fan.modeStateTopic,
    preset_mode_command_topic: topics.fan.modeCommandTopic,
    preset_mode_state_template: '{{ value }}',
    speed_range_min: 1,
    speed_range_max: 5,
  };

  const configPayloadPm25Sensor = {
    state_topic: topics.sensors.pm25StateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:air-filter',
    name: 'PM2.5',
    object_id: `${device.name}_pm25`,
    unique_id: `${device.name}_pm25`,
    availability_topic: topics.deviceAvailabilityTopic,
    payload_available: 'ready',
    payload_not_available: 'lost',
    unit_of_measurement: 'μg/m³',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadAllergyIndexSensor = {
    state_topic: topics.sensors.allergenIndexStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:flower-pollen-outline',
    name: 'Allergy Index',
    object_id: `${device.name}_allergenIndex`,
    unique_id: `${device.name}allergenIndex`,
    availability_topic: topics.deviceAvailabilityTopic,
    unit_of_measurement: 'AI',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  // const configPayloadChildLock = {
  //   state_topic: topics.childLockControl.stateTopic,
  //   command_topic: topics.childLockControl.commandTopic,
  //   state_value_template: '{{ value }}',
  //   icon: 'mdi:lock',
  //   name: 'Child Lock',
  //   object_id: `${device.name}_childLock`,
  //   unique_id: `${device.name}_childLock`,
  //   availability_topic: deviceAvailabilityTopic,
  //   payload_available: 'ready',
  //   payload_not_available: 'lost',
  //   device: getAutoDiscoveryDevice(),
  // };

  const configPayloadPreFilterRemainingHoursSensor = {
    state_topic: topics.filters.preFilterRemainingHoursStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining Pre-filter Hours',
    object_id: `${device.name}_preFilter`,
    unique_id: `${device.name}_preFilter`,
    availability_topic: topics.deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadCarbonFilterRemainingHoursSensor = {
    state_topic: topics.filters.carbonFilterRemainingHoursStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining Carbon Filter Hours',
    object_id: `${device.name}_carbonFilter`,
    unique_id: `${device.name}_carbonFilter`,
    availability_topic: topics.deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadHepaFilterRemainingHoursSensor = {
    state_topic: topics.filters.hepaFilterRemainingHoursStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining HEPA Filter Hours',
    object_id: `${device.name}_hepaFilter`,
    unique_id: `${device.name}_hepaFilter`,
    availability_topic: topics.deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
    payload_available: 'ready',
    payload_not_available: 'lost',
    device: getAutoDiscoveryDevice(),
  };

  const configPayloadWickFilterRemainingHoursSensor = {
    state_topic: topics.filters.wickFilterRemainingHoursStateTopic,
    state_value_template: '{{ value }}',
    icon: 'mdi:fan-clock',
    name: 'Remaining Wick Filter Hours',
    object_id: `${device.name}_wickFilter`,
    unique_id: `${device.name}_wickFilter`,
    availability_topic: topics.deviceAvailabilityTopic,
    unit_of_measurement: 'Hours',
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
    if (airDeviceStatus.mode !== undefined) {
      publish(configTopicFanControl, configFan);
    }
    if (airDeviceStatus.aqil !== undefined)
      publish(configTopicLedControl, configPayloadLedControl);
    if (airDeviceStatus.pm25 !== undefined)
      publish(configTopicPm25Sensor, configPayloadPm25Sensor);
    if (airDeviceStatus.iaql !== undefined)
      publish(configTopicAllergyIndexSensor, configPayloadAllergyIndexSensor);
    // if (airDeviceStatus.cl)
    //   publish(configTopicChildLockControl, configPayloadChildLock);

    if (airDeviceStatus.fltsts0 !== undefined)
      publish(
        configTopicHoursPreFilterSensor,
        configPayloadPreFilterRemainingHoursSensor
      );
    if (airDeviceStatus.fltsts1 !== undefined)
      publish(
        configTopicHoursCarbonFilterSensor,
        configPayloadCarbonFilterRemainingHoursSensor
      );
    if (airDeviceStatus.fltsts2 !== undefined)
      publish(
        configTopicHoursHepaFilterSensor,
        configPayloadHepaFilterRemainingHoursSensor
      );
    if (airDeviceStatus.wicksts !== undefined)
      publish(
        configTopicHoursWickFilterHoursSensor,
        configPayloadWickFilterRemainingHoursSensor
      );
  };

  const unpublishAutoDiscovery = () => {
    publish(configTopicFanControl, undefined);
    publish(configTopicLedControl, undefined);
    publish(configTopicPm25Sensor, undefined);
    publish(configTopicAllergyIndexSensor, undefined);
    //publish(configTopicChildLockControl, undefined);
    publish(configTopicHoursPreFilterSensor, undefined);
    publish(configTopicHoursCarbonFilterSensor, undefined);
    publish(configTopicHoursHepaFilterSensor, undefined);
    publish(configTopicHoursWickFilterHoursSensor, undefined);
  };

  return {
    publishAutoDiscovery,
    unpublishAutoDiscovery,
  };
}

export type HomeAssistantAutoDiscoveryHandler = ReturnType<
  typeof getHomeAssistantAutoDiscoveryHandler
>;
