import { AirClient, CoapClient, HttpClient } from 'philips-air';
import config from './config.js';
import { getMqttHandler } from './mqtt/mqtt.js';
import { HomeAssistantAutoDiscoveryHandler } from './mqtt/homeAssistantAutoDiscovery.js';
import { AirDeviceFirmware } from './philipsTypes.js';

async function updateDeviceStatus() {
  try {
    const deviceStatus = await airClient.getStatus();
    mqttHandler?.publishMqttDeviceStatus(deviceStatus);
    return deviceStatus;
  } catch (error) {
    console.error('Error while updating device status', error);
    mqttHandler?.publishConnectionLost();
  }
  return undefined;
}
export const airClient: AirClient =
  config.airPurifier.connection.protocol === 'http'
    ? new HttpClient(config.airPurifier.connection.host)
    : new CoapClient(config.airPurifier.connection.host);

export const airFirmware: AirDeviceFirmware | undefined = undefined;
export const mqttHomeAssistantAutoDiscovery:
  | HomeAssistantAutoDiscoveryHandler
  | undefined = undefined;

console.info('Starting Philips Air Purifier MQTT Bridge');
console.info('Attempting to connect to air purifier');
const firmware = await airClient.getFirmware();
console.info('Connected to air purifier', firmware);
const mqttHandler = getMqttHandler(firmware, {
  onRequestUpdate: () => updateDeviceStatus(),
});
// Refresh status every 2 minutes
setInterval(async () => updateDeviceStatus(), 120 * 1000);

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down...');

  process.exit(0);
});
