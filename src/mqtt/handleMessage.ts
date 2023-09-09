import { getTopics } from './mqtt.js';
import { setBrightness } from './commands/setBrightness.js';
//import { setChildLock } from './commands/setChildLock.js';
import { setPresetMode } from './commands/setPresetMode.js';
import { type PresetMode } from './types.js';
import { airDeviceStatus } from '../index.js';
import { AirClient } from 'philips-air';

export async function handleMqttMessage(
  topic: string,
  messageBuffer: Buffer,
  airClient: AirClient
) {
  const topics = getTopics();
  const message = messageBuffer.toString();
  console.log(`Received message on topic ${topic}: ${message}`);
  switch (topic) {
    case topics.modeControl.commandTopic: {
      await setPresetMode(message as PresetMode, airClient);
      break;
    }
    case topics.ledControl.commandTopic: {
      if (message === 'OFF') {
        await setBrightness(0, airClient);
      } else {
        const ledCurrentlyOn = airDeviceStatus?.aqil !== 0;
        if (!ledCurrentlyOn) await setBrightness(50, airClient);
      }
      break;
    }
    case topics.ledControl.commandTopicBrightness: {
      await setBrightness(parseInt(message), airClient);
      break;
    }
    case topics.percentage.commandTopic: {
      const percentage = parseInt(message);
      if (percentage === 5) {
        await setPresetMode('turbo', airClient);
      } else if (percentage === 4) {
        await setPresetMode('high', airClient);
      } else if (percentage === 3) {
        await setPresetMode('medium', airClient);
      } else if (percentage === 2) {
        await setPresetMode('low', airClient);
      } else {
        await setPresetMode('sleep', airClient);
      }
    }
    // case topics.childLockControl.commandTopic: {
    //   await setChildLock(message === 'ON', airClient);
    //   break;
    // }
  }
}
