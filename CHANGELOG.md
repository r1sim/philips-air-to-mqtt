## [1.3.4](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.3.3...v1.3.4) (2024-10-19)


### Bug Fixes

* Add `off` to preset mode definition for home assistant ([e627c0d](https://github.com/r1sim/philips-air-to-mqtt/commit/e627c0d26c7993aea644df26b01dbbbbdfa7b04b))
* Fix issue on shutdown ([2f07de9](https://github.com/r1sim/philips-air-to-mqtt/commit/2f07de9e8116f3b9064c9ca159fd3fb289aab181))

## [1.3.3](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.3.2...v1.3.3) (2024-06-08)


### Bug Fixes

* fix null assertion for device states ([15bb2cc](https://github.com/r1sim/philips-air-to-mqtt/commit/15bb2ccd52e40adaf21b9725ff2e1c1901cdd1df))
* publish device lost on shutdown ([8da86e9](https://github.com/r1sim/philips-air-to-mqtt/commit/8da86e972150cf9897df771e2d9f94ae09a2caa2))
* set led mode in `setPresetMode` ([bf778d2](https://github.com/r1sim/philips-air-to-mqtt/commit/bf778d290476b67aedc1e6fca66cce6eefd818de))

## [1.3.2](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.3.1...v1.3.2) (2023-09-14)


### Bug Fixes

* set device to unavailable when no connection is possible ([bf7251a](https://github.com/r1sim/philips-air-to-mqtt/commit/bf7251a30b31d67448795deaa7229283e323d4cd))

## [1.3.1](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.3.0...v1.3.1) (2023-09-14)


### Bug Fixes

* set device to unavailable when no connection is possible ([5bf260f](https://github.com/r1sim/philips-air-to-mqtt/commit/5bf260fc8308af858b93ec93d3b0a40c70c52a60))

# [1.3.0](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.2.1...v1.3.0) (2023-09-09)


### Bug Fixes

* add config validation ([3b09714](https://github.com/r1sim/philips-air-to-mqtt/commit/3b09714e9ddc9767f21dff6663db4d89b775495f))
* publish device status to mqtt in `onRequestUpdate` ([c27db30](https://github.com/r1sim/philips-air-to-mqtt/commit/c27db30a311df607103fabc46e445ac2c5158517))


### Features

* add `PresetMode` `on` (equivalent to `auto`) ([063be62](https://github.com/r1sim/philips-air-to-mqtt/commit/063be626d4e081fe8ca53f3de9d8613a45bc90fb))
* **HA:** replace `select` with `fan` ([f531549](https://github.com/r1sim/philips-air-to-mqtt/commit/f531549d1f518accb1f620adba0c645bf67738d9))

## [1.2.1](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.2.0...v1.2.1) (2023-06-19)


### Bug Fixes

* **mode control:** fix mapping of `allergen` & `auto` ([5c34586](https://github.com/r1sim/philips-air-to-mqtt/commit/5c345860b5ca0efe75b74c1e15ad5d1946e7b7ab))

# [1.2.0](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.1.0...v1.2.0) (2023-06-03)


### Bug Fixes

* add graceful shutdown ([2104aaa](https://github.com/r1sim/philips-air-to-mqtt/commit/2104aaa0940b925ca9e2f1839bc9e34d54effd80))


### Features

* **mqtt:** add option to enable home assistant auto discovery ([7bf24bb](https://github.com/r1sim/philips-air-to-mqtt/commit/7bf24bb7590d46a48c476ed89dccb069fda06db2))

# [1.1.0](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.0.1...v1.1.0) (2023-06-03)


### Features

* add filter status ([a20065f](https://github.com/r1sim/philips-air-to-mqtt/commit/a20065f1cf85c86aa97d8831d7a28ecc07d04a4f))

## [1.0.1](https://github.com/r1sim/philips-air-to-mqtt/compare/v1.0.0...v1.0.1) (2023-06-02)


### Bug Fixes

* **config:** add `PHILIPS_AIR_REFRESH_INTERVAL` setting ([768702a](https://github.com/r1sim/philips-air-to-mqtt/commit/768702a90124b3b8231c455376da5b0e2b15d993))

# 1.0.0 (2023-06-02)


### Bug Fixes

* **build:** fix docker cross plattform build ([c2d27ad](https://github.com/r1sim/philips-air-to-mqtt/commit/c2d27ad7d34bd70791cafb57f973490b46f5fdee))


### Features

* initial release ([f73f989](https://github.com/r1sim/philips-air-to-mqtt/commit/f73f989e8680f1ae5c99dd44c334923e7acb207c))
