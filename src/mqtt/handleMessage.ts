import { getTopics } from './mqtt.js';
import { setBrightness } from './commands/setBrightness.js';
import { setChildLock } from './commands/setChildLock.js';
import { setPresetMode } from './commands/setPresetMode.js';
import { type PresetMode } from './types.js';
import { AirDeviceStatus } from '../philipsTypes.js';

export async function handleMqttMessage(
  topic: string,
  messageBuffer: Buffer,
  onRequestUpdate: () => Promise<AirDeviceStatus | undefined>
) {
  const topics = getTopics();
  const message = messageBuffer.toString();
  console.log(`Received message on topic ${topic}: ${message}`);
  switch (topic) {
    case topics.modeControl.commandTopic: {
      await setPresetMode(message as PresetMode);
      break;
    }
    case topics.ledControl.commandTopic: {
      if (message === 'OFF') {
        await setBrightness(0);
      } else {
        const deviceStatus = await onRequestUpdate();
        const ledCurrentlyOn = deviceStatus?.aqil !== 0;
        if (!ledCurrentlyOn) await setBrightness(50);
      }
      break;
    }
    case topics.ledControl.commandTopicBrightness: {
      await setBrightness(parseInt(message));
      break;
    }
    case topics.childLockControl.commandTopic: {
      await setChildLock(message === 'ON');
      break;
    }
  }
}
