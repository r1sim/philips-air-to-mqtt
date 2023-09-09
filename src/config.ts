import Joi from 'joi';

const config = {
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

const validationSchema = Joi.object({
  mqtt: Joi.object({
    connection: Joi.object({
      host: Joi.alternatives(
        Joi.string().hostname(),
        Joi.string().ip()
      ).required(),
      port: Joi.number().port().required(),
      username: Joi.string().allow('').optional(),
      password: Joi.string().allow('').optional(),
    }).required(),
    homeAssistantAutoDiscovery: Joi.object({
      enabled: Joi.boolean().required(),
      deleteOnShutdown: Joi.boolean().required(),
    }).required(),
    topicPrefix: Joi.string().required(),
  }).required(),
  airPurifier: Joi.object({
    deviceName: Joi.string().required(),
    refreshInterval: Joi.number().required(),
    connection: Joi.object({
      host: Joi.string().required(),
      protocol: Joi.string().valid('http', 'coap').required(),
    }).required(),
  }).required(),
});

const { error, value } = validationSchema.validate(config);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default value;
