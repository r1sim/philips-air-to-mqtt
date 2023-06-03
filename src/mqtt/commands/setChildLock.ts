import { AirClient } from 'philips-air';

export async function setChildLock(
  childLock: boolean,
  airClient: AirClient
): Promise<void> {
  console.log('Setting child lock to', childLock);
  await airClient.setValues({ cl: childLock });
}
