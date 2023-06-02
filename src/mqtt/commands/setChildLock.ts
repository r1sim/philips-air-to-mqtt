import { airClient } from '../../index.js';

export async function setChildLock(childLock: boolean): Promise<void> {
  console.log('Setting child lock to', childLock);
  await airClient.setValues({ cl: childLock });
}
