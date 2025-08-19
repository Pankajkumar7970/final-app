import { NativeModules, Platform } from "react-native";

const { DeveloperSettingsModule } = NativeModules;

export async function isDeveloperModeEnabled() {
  if (Platform.OS === "android" && DeveloperSettingsModule) {
    return await DeveloperSettingsModule.isDeveloperModeEnabled();
  }
  return false;
}

