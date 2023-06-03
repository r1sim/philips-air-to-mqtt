import { AirClient } from 'philips-air';

export async function setBrightness(brightness: number, airClient: AirClient) {
  await airClient.setValues({ aqil: brightness });
}
