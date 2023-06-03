import { AirClient } from 'philips-air';

export async function setPower(power: boolean, airClient: AirClient) {
  await airClient.setValues({ pwr: power ? '1' : '0' });
}
