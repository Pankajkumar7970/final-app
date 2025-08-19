import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import TranslatedText from "./TranslatedText";
import * as ExpoLocation from "expo-location";
import Icon from "react-native-vector-icons/Feather";
import { RESULTS, openSettings } from "react-native-permissions";
import { ensurePermission } from "../utils/permissions"; // <-- You implement for "location"

const GeolocationButton = ({ onLocationFound, disabled = false }) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);

    try {
      // 1. Request & check permission
      let result = await ensurePermission("location");

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission Required",
          "Please enable location permission from settings to use maps.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ]
        );
        return;
      }

      if (result !== RESULTS.GRANTED) {
        result = await ensurePermission("location");
        if (result !== RESULTS.GRANTED) return;
      }

      // 2. Check if location services (GPS) are enabled
      const servicesEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          "Location Services Off",
          "Please enable GPS/location services to use this feature.",
          [{ text: "OK" }]
        );
        return;
      }

      // 3. Get location
      const location = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.High,
        mayShowUserSettingsDialog: true, // Helps on Android release builds
      });

      onLocationFound({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert("Success", "Location detected.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to get your location.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || isGettingLocation) && styles.buttonDisabled,
      ]}
      onPress={getCurrentLocation}
      disabled={disabled || isGettingLocation}
    >
      {isGettingLocation ? (
        <ActivityIndicator size="small" color="#0070BA" />
      ) : (
        <Icon name="map-pin" size={16} color="#0070BA" />
      )}
      <TranslatedText style={styles.buttonText}>
        {isGettingLocation ? "Getting..." : "Use My Location"}
      </TranslatedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#0070BA33",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#0070BA",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
});

export default GeolocationButton;
