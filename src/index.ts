import { AirClient, CoapClient, HttpClient } from 'philips-air';
import config from './config.js';
import { getMqttHandler } from './mqtt/mqtt.js';
import { AirDeviceStatus } from './philipsTypes.js';

export let airDeviceStatus: AirDeviceStatus | undefined = undefined;
let mqttHandler: ReturnType<typeof getMqttHandler> | undefined = undefined;

async function connectToAirPurifier(host: string, protocol: 'coap' | 'http') {
  const getClient = async (protocol: 'coap' | 'http') => {
    const client =
      protocol === 'coap' ? new CoapClient(host) : new HttpClient(host, 20000);
    await updateDeviceStatus(client);
    await updateFilterStatus(client);
    await updateFirmwareStatus(client);
    return client;
  };
  console.info(`Connecting to ${protocol}://${host}`);
  if (protocol === 'coap') return await getClient('coap');
  return await getClient('http');
}

async function updateFirmwareStatus(airClient: AirClient) {
  console.debug('Checking firmware status');
  return airClient
    .getFirmware()
    .catch(error => {
      console.error('Error while checking firmware status', error);
      mqttHandler?.publishError();
    })
    .then(firmware => {
      console.debug('Firmware', JSON.stringify(firmware));
      airDeviceStatus = { ...airDeviceStatus, ...firmware };
    });
}

async function updateFilterStatus(airClient: AirClient) {
  console.debug('Checking filter status');
  return airClient
    .getFilters()
    .catch(error => {
      console.error('Error while checking filter status', error);
      mqttHandler?.publishError();
    })
    .then(filters => {
      console.debug('Filters', JSON.stringify(filters));
      airDeviceStatus = { ...airDeviceStatus, ...filters };
    });
}

async function updateDeviceStatus(airClient: AirClient) {
  console.debug('Checking device status');
  return airClient
    .getStatus()
    .catch(error => {
      console.error('Error while updating device status', error);
      mqttHandler?.publishError();
    })
    .then(status => {
      console.debug('Filters', JSON.stringify(status));
      airDeviceStatus = { ...airDeviceStatus, ...status };
    });
}

function setupUpdateIntervals(airClient: AirClient) {
  setInterval(async () => {
    await updateDeviceStatus(airClient);
    if (airDeviceStatus) mqttHandler?.publishDeviceStatus(airDeviceStatus);
  }, config.airPurifier.refreshInterval * 1000).unref();

  setInterval(async () => {
    await updateFilterStatus(airClient);
    if (airDeviceStatus) mqttHandler?.publishDeviceStatus(airDeviceStatus);
  }, 2 * 3600 * 1000).unref(); // Check for filters every 2 hours
}

async function main() {
  console.info('Starting Philips Air Purifier MQTT Bridge');
  const { host, protocol } = config.airPurifier.connection;
  const client = await connectToAirPurifier(host, protocol);

  if (!airDeviceStatus) return console.error('Unable to get device status');
  mqttHandler = getMqttHandler(airDeviceStatus, client, {
    onRequestUpdate: () => updateDeviceStatus(client),
  });

  setupUpdateIntervals(client);

  const shutdown = () => {
    console.info('Shutting down');
    mqttHandler?.handleShutdown();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
