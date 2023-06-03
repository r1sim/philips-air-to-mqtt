import { AirClient } from 'philips-air';
import { type AirDeviceStatus } from '../../philipsTypes.js';
import { type PresetMode } from '../types.js';
import { setPower } from './setPower.js';

function mapMode(mode: PresetMode): AirDeviceStatus['mode'] | undefined {
  if (mode === 'auto') return 'A';
  if (mode === 'allergen') return 'P';
  if (mode === 'bacteria') return 'B';
  if (mode === 'sleep') return 'M';
  if (mode === 'low') return 'M';
  if (mode === 'medium') return 'M';
  if (mode === 'high') return 'M';
  if (mode === 'turbo') return 'M';
}

function mapOm(mode: PresetMode): AirDeviceStatus['om'] | undefined {
  if (mode === 'sleep') return 's';
  if (mode === 'low') return '1';
  if (mode === 'medium') return '2';
  if (mode === 'high') return '3';
  if (mode === 'turbo') return 't';
  return undefined;
}

export async function setPresetMode(newMode: PresetMode, airClient: AirClient) {
  const pwr = newMode === 'off' ? '0' : '1';
  if (pwr === '0') {
    await setPower(false, airClient);
    return;
  }
  await setPower(true, airClient);
  const mode = mapMode(newMode);
  const om = mapOm(newMode);
  await airClient.setValues({ om, mode });
}
