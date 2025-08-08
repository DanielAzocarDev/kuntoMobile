import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'site.fromtheweb.kunto.dev';
  }

  if (IS_PREVIEW) {
    return 'site.fromtheweb.kunto.preview';
  }

  return 'site.fromtheweb.kunto';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'Kunto (Dev)';
  }

  if (IS_PREVIEW) {
    return 'Kunto (Preview)';
  }

  return 'Kunto';
};


export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
    "name": getAppName(),
    "slug": "kunto",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "kunto",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": getUniqueIdentifier(),
      "icon": {
        "dark": "./assets/icons/ios-dark.png",
        "light": "./assets/icons/ios-light.png",
        "tinted": "./assets/icons/ios-tinted.png"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icons/adaptive-icon.png",
        "monochromeImage": "./assets/icons/adaptive-icon.png",
        "backgroundColor": "#0f172a"
      },
      "edgeToEdgeEnabled": true,
      "package": getUniqueIdentifier()
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/icons/splash-icon-dark.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#0f172a",
          "dark": {
            "image": "./assets/icons/splash-icon-light.png",
            "imageWidth": 200,
            "resizeMode": "contain",
            "backgroundColor": "#000"
          }
        }
      ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow Kunto to access your Face ID biometric data."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "9c7f4929-50bd-4593-a90e-46e3a9c286ed"
      }
    }
  })
