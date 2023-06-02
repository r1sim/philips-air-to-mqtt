# Philips Air 2 MQTT

The project aims to control philips air purifiers using MQTT. MQTT is a lightweight messaging protocol widely used in Internet of Things (IoT) applications for its simplicity and efficiency.

I built this to integrate my air purifier into home assistant without using HACS.

## Features

- Mode Control
- Light Control
- Child Lock Control
- PM2.5
- Allergen Index
- Home Assistant Auto Discovery

**Supported Models**

- AC2889/10

Other models are probably also supported, but the AC2889 is the only model I own. Please submit a PR if you tested this with another model.

## Configuration

Ensure you have access to an MQTT broker. If you don't have one set up, you can use Mosquitto or other brokers.

The project uses environment variables for configuration. Set the following environment variables before running the project:

| Variable                      | Description                   | Default\* |
| ----------------------------- | ----------------------------- | --------- |
| **`PHILIPS_AIR_HOST`**        | Air Purifier IP/Host          |           |
| **`PHILIPS_AIR_DEVICE_NAME`** | Air Purifier IP/Host          |           |
| **`PHILIPS_AIR_PROTOCOL`**    | `http` or `coap`              | `http`    |
| **`MQTT_HOST`**               | MQTT Broker IP/Host           |           |
| **`MQTT_USERNAME`**           | MQTT Broker Username          |           |
| **`MQTT_PASSWORD`**           | MQTT Broker Password          |           |
| **`MQTT_PORT`**               | IP or Host of you MQTT Broker | `1883`    |

_\*Variables without a default value are required_

## Usage using Docker

The easiest way to deploy this is using the docker image.

Create a file called `docker-compose.yaml` using the following contents:

```yaml
version: '3.3'
services:
  philips-air-to-mqtt:
    image: philips-air-to-mqtt:latest
    environment:
      - MQTT_HOST=
      - MQTT_PORT=1883
      - MQTT_USERNAME=
      - MQTT_PASSWORD=
      - PHILIPS_AIR_HOST=
      - PHILIPS_AIR_DEVICE_NAME=
      - PHILIPS_AIR_PROTOCOL=http
    restart: unless-stopped
    init: true
```

Starting the container:

```bash
docker-compose up
```

## Local development

1. Install node 18
2. Clone this repository
3. Copy `.env.example` to `.env` and edit the configuration
4. Run `npm install`
5. Run `npm run start`

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue in the GitHub repository.

This repository uses [conventional commits](https://www.conventionalcommits.org). Please make sure to use the conventional commits for your commit messages.

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgements

This project would not have been possible without the open source community.

Special thanks to the following projects and libraries:

- [rgerganov/py-air-control](https://github.com/rgerganov/py-air-control)
- [NikDevx/philips-air](https://github.com/NikDevx/philips-air)
