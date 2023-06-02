export default {
  mqtt: {
    connection: {
      host: (process.env.MQTT_HOST as string) ?? 'localhost',
      port: process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 1883,
      username: process.env.MQTT_USERNAME as string,
      password: process.env.MQTT_PASSWORD as string,
    },
    topicPrefix: (process.env.MQTT_TOPIC_PREFIX as string) ?? 'philips-air',
  },
  airPurifier: {
    deviceName: process.env.PHILIPS_AIR_DEVICE_NAME as string,
    refreshInterval: process.env.PHILIPS_AIR_REFRESH_INTERVAL
      ? parseInt(process.env.PHILIPS_AIR_REFRESH_INTERVAL)
      : 120,
    connection: {
      host: process.env.PHILIPS_AIR_HOST as string,
      protocol: (process.env.PHILIPS_AIR_PROTOCOL as string) ?? 'http',
    },
  },
};
