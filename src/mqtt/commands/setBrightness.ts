import { airClient } from '../../index.js';

export async function setBrightness(brightness: number) {
  await airClient.setValues({ aqil: brightness });
}
