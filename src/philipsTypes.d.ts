type FirmwareStatus = {
  name: string;
  version?: string;
  upgrade?: string;
  state?: 'idle';
  progress?: number;
  statusmsg?: string;
  mandatory?: boolean;
  Runtime?: number;
  ota?: string;
  StatusType?: string;
  swversion?: string;
  modelid?: string;
  type?: string;
};

type FilterStatus = {
  fltt1: string; // HEPA filter type
  fltt2: string; // Active carbon filter type
  fltsts0: number; // Prefilter lifetime in hours
  fltsts1: number; // HEPA filter lifetime in hours
  fltsts2: number; // Active carbon filter lifetime in hours
};

// Only for devices with a humidifier such as AC3829
type HumidifierStatus = {
  wl?: number; // Water level
  func?: 'P' | 'PH'; // Humidifier mode "Purification" and "Purification & Humidification"
  rhset?: number; // Target humidity
  rh?: number; // Current humidity
  wicksts?: number; // Wick filter lifetime in hours
};

type ControlStatus = {
  cl: '0' | '1'; // Child lock
  aqit: number; // Air Quality Notification Threshold
  dt: number; // Timer Hours
  dtrs: number; // Timer Minutes
  aqil: number; // Light brightness 0 - 100
  uil: '0' | '1'; // Button Light
  pwr: '0' | '1'; // Power
  om: '1' | '2' | '3' | 't' | 's';
  mode:
    | 'B' // Bacteria
    | 'M' // Manual
    | 'A' // Allergen
    | 'P'; // Auto
  err:
    | 0 // no error
    | 193 // F0 (pre-filter) must be cleaned
    | 49408 // no water
    | 32768 // water tank open
    | 49155; // pre-filter must be cleaned
};

type AirStatus = {
  ddp: // Used Index
  | '0' // IAI
    | '1' // PM2.5
    | '2' // Gas
    | '3'; // Humidity
  temp?: number; // Temperature. Not all devices support this.
  tvoc?: number; // Total volatile organic compounds. Not all devices support this.
  pm25?: number; // PM2.5
  iaql?: number; // Allergen Index
};

export type AirDeviceStatus = AirStatus &
  ControlStatus &
  FirmwareStatus &
  FilterStatus &
  HumidifierStatus;
