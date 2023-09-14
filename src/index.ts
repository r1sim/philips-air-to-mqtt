import { AirClient, CoapClient, HttpClient } from 'philips-air';
import config from './config.js';
import { getMqttHandler, getTopics } from './mqtt/mqtt.js';
import { AirDeviceStatus } from './philipsTypes.js';
import { connect } from 'mqtt';

export let airDeviceStatus: AirDeviceStatus | undefined = undefined;
let mqttHandler: ReturnType<typeof getMqttHandler> | undefined = undefined;

async function connectToAirPurifier(host: string, protocol: 'coap' | 'http') {
  const getClient = async (protocol: 'coap' | 'http') => {
    const client =
      protocol === 'coap' ? new CoapClient(host) : new HttpClient(host, 2000);
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
      if (firmware) airDeviceStatus = { ...airDeviceStatus, ...firmware };
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
      if (filters) {
        airDeviceStatus = { ...airDeviceStatus, ...filters };
        if (airDeviceStatus) mqttHandler?.publishDeviceStatus(airDeviceStatus);
      }
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
      console.debug('Device Status', JSON.stringify(status));
      if (status) {
        airDeviceStatus = { ...airDeviceStatus, ...status };
        if (airDeviceStatus) mqttHandler?.publishDeviceStatus(airDeviceStatus);
      }
    });
}

function setupUpdateIntervals(airClient: AirClient) {
  setInterval(async () => {
    await updateDeviceStatus(airClient);
  }, config.airPurifier.refreshInterval * 1000).unref();

  setInterval(async () => {
    await updateFilterStatus(airClient);
  }, 2 * 3600 * 1000).unref(); // Check for filters every 2 hours
}

async function main() {
  console.log('Connecting to MQTT');
  const topics = getTopics();
  const mqttClient = connect({
    host: config.mqtt.connection.host,
    port: config.mqtt.connection.port,
    username: config.mqtt.connection.username,
    password: config.mqtt.connection.password,
    will: {
      topic: topics.deviceAvailabilityTopic,
      payload: 'lost',
      retain: true,
      qos: 0,
    },
  });
  mqttClient.on('connect', async () => {
    console.info('Starting Philips Air Purifier MQTT Bridge');
    const { host, protocol } = config.airPurifier.connection;
    const client = await connectToAirPurifier(host, protocol);

    if (!airDeviceStatus) {
      console.error('Could not connect to air purifier');
      process.exitCode = 1;
      mqttClient.end();
      return;
    }
    console.log(airDeviceStatus);
    mqttHandler = getMqttHandler(mqttClient, airDeviceStatus, client, {
      onRequestUpdate: async () => {
        await updateDeviceStatus(client);
      },
    });

    setupUpdateIntervals(client);
  });
  mqttClient.on('error', err => {
    console.error('mqtt error', err);
  });
  mqttClient.on('disconnect', () => {
    console.error('mqtt disconnected');
  });

  const shutdown = () => {
    console.info('Shutting down');
    mqttHandler?.handleShutdown();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
