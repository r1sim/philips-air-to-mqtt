import { airClient } from '../../index.js';

export async function setPower(power: boolean) {
  await airClient.setValues({ pwr: power ? '1' : '0' });
}
