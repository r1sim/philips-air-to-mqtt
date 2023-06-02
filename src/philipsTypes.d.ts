export interface AirDeviceStatus {
  om: '1' | '2' | '3' | 't' | 's';
  pwr: '0' | '1';
  cl: boolean; // Child lock
  aqil: number; // Light brightness 0 .100
  uil: '0' | '1'; // Button Light
  dt: number; // Timer Hours
  dtrs: number; // Timer Minutes
  mode:
    | 'B' // Bacteria
    | 'M' // Manual
    | 'A' // Allergen
    | 'P'; // Auto
  pm25: number; // PM2.5
  iaql: number; // Allergen Index
  aqit: number; // Air Quality Notification Threshold
  ddp:
    | '0' // IAI
    | '1' // PM2.5
    | '2' // Gas
    | '3'; // Humidity
  err:
    | 0 // no error
    | 193 // F0 (pre-filter) must be cleaned
    | 49408 // no water
    | 32768 // water tank open
    | 49155; // pre-filter must be cleaned
}

export interface AirDeviceFirmware {
  name: string;
  version: string;
  upgrade: string;
  state: 'idle';
  progress: number;
  statusmsg: string;
  mandatory: boolean;
}
