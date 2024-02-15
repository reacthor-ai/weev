import {BrowserName, DeviceCategory, OperatingSystemsName} from "crawlee";

export const defaultBrowserPoolOptions = {
  preLaunchHooks: [() => {
    console.log('running pre launch')
  }],
  fingerprintOptions: {
    fingerprintGeneratorOptions: {
      browsers: [{
        name: BrowserName.firefox,
        minVersion: 96,
      }],
      devices: [
        DeviceCategory.desktop,
      ],
      operatingSystems: [
        OperatingSystemsName.macos,
      ],
    },
  },
}