export default {
  mqtt: {
    connection: {
      host: (process.env.MQTT_HOST as string) ?? 'localhost',
      port: process.env.MQTT_PORT ? parseInt(process.env.MQTT_PORT) : 1883,
      username: process.env.MQTT_USERNAME as string,
      password: process.env.MQTT_PASSWORD as string,
    },
    homeAssistantAutoDiscovery: {
      enabled:
        process.env.MQTT_HA_AD_ENABLED &&
        process.env.MQTT_HA_AD_ENABLED === 'false'
          ? false
          : true,
      deleteOnShutdown:
        process.env.MQTT_HA_AD_DELETE_ON_SHUTDOWN &&
        process.env.MQTT_HA_AD_DELETE_ON_SHUTDOWN === 'true'
          ? true
          : false,
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
      protocol: ((process.env.PHILIPS_AIR_PROTOCOL as string) ?? 'http') as
        | 'http'
        | 'coap',
    },
  },
};
