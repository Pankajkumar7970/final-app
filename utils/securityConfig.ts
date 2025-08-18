import { Platform } from "react-native";
import * as Crypto from "expo-crypto";

// Security Configuration Constants
export const SECURITY_CONFIG = {
  // AES-256 Encryption Configuration
  ENCRYPTION: {
    ALGORITHM: "AES-256-CBC",
    KEY_SIZE: 256,
    IV_SIZE: 16,
    TAG_SIZE: 16,
    ITERATIONS: 100000,
  },

  // SSL Pinning Configuration
  SSL_PINNING: {
    ENABLED: true,
    CERTIFICATES: {
      PRIMARY: {
        domain: "onrender.com",
        fingerprint:
          "0B:CD:A7:A3:81:C8:03:9E:3A:E4:D3:64:62:27:BC:DB:90:A1:A8:B9:FE:5C:2D:EC:FF:20:A9:63:D1:A7:F3:39",
        backup:
          "91:18:D9:5D:31:D8:27:B0:72:69:89:38:E3:8E:80:29:C1:C0:6F:12:36:C6:FC:DD:77:07:97:DD:A7:50:0E:4E",
      },
    },
    VALIDATION: {
      ALLOW_BACKUP_CERTS: true, // Allow fallback to backup certificate if primary fails
      MAX_CERT_AGE_DAYS: 90, // Maximum age of certificate in days
      MAX_RETRIES: 3, // Retry attempts for failed connections
      TIMEOUT_MS: 10000, // 10 seconds timeout
    },
    DEBUG: {
      LOG_PINNING_ATTEMPTS: true, // Log each pinning attempt
      LOG_CERTIFICATE_DETAILS: true, // Log full certificate info
      LOG_VALIDATION_RESULTS: true, // Log success/failure validation
      LOG_ERROR_DETAILS: true, // Log errors for debugging
    },
  },
  // API Security Configuration
  API: {
    BASE_URL: __DEV__
      ? "https://staging-api.finguard.com"
      : "https://api.finguard.com",
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RATE_LIMIT: {
      ENABLED: true,
      REQUESTS_PER_MINUTE: 60,
      BURST_LIMIT: 10,
    },
    ENCRYPTION: {
      ENABLED: true,
      SHARED_SECRET: "ChangeThisToAStrongSecret", // Set via env at runtime for request/response encryption
    },
  },

  // Root/Jailbreak Detection
  DEVICE_SECURITY: {
    ROOT_DETECTION_ENABLED: true,
    JAILBREAK_DETECTION_ENABLED: true,
    EMULATOR_DETECTION_ENABLED: true,
    DEBUG_MODE_DETECTION_ENABLED: !__DEV__,
    DEVELOPMENT_MODE_DETECTION_ENABLED: !__DEV__,
  },

  // App Security Settings
  APP_SECURITY: {
    BACKUP_DISABLED: true,
    SCREENSHOT_DISABLED: true,
    COPY_PASTE_DISABLED: true,
    SCREEN_RECORDING_DISABLED: true,
    KEYBOARD_AUTOCOMPLETE_DISABLED: true,
  },

  // Permissions Configuration
  PERMISSIONS: {
    REQUIRED: [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
    ],
    OPTIONAL: ["android.permission.VIBRATE", "android.permission.WAKE_LOCK"],
  },

  // Code Obfuscation Settings
  OBFUSCATION: {
    ENABLED: true,
    MINIFY_ENABLED: true,
    SOURCE_MAP_DISABLED: true,
  },

  // Session Security
  SESSION: {
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
    MAX_SESSIONS: 3,
    AUTO_LOGOUT_ON_INACTIVITY: 30 * 60 * 1000, // 30 minutes
  },

  // Data Protection
  DATA_PROTECTION: {
    SENSITIVE_DATA_ENCRYPTION: true,
    LOCAL_STORAGE_ENCRYPTION: true,
    CACHE_ENCRYPTION: true,
    LOG_ENCRYPTION: true,
  },
};

// Generate secure encryption keys
export const generateEncryptionKey = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    randomBytes.toString(),
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
};

// Security headers for API requests
export const getSecurityHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  "X-API-Version": "1.0.0",
  "X-Platform": Platform.OS,
  "X-App-Version": "1.0.0",
  "X-Device-ID": "", // Will be set dynamically
  "X-Security-Token": "", // Will be set dynamically
  "X-Request-ID": "", // Will be set dynamically
});

// Root detection patterns
export const ROOT_DETECTION_PATTERNS = {
  ANDROID: [
    "/system/app/Superuser.apk",
    "/system/xbin/su",
    "/system/bin/su",
    "/sbin/su",
    "/system/su",
    "/system/bin/.ext/.su",
    "/system/etc/init.d/99SuperSUDaemon",
    "/dev/com.koushikdutta.superuser.daemon/",
    "/system/xbin/daemonsu",
    "/system/etc/.has_su_daemon",
    "/system/etc/.installed_su_daemon",
    "/dev/.mount_rw/",
    "/system/etc/.has_su_daemon",
    "/system/etc/.installed_su_daemon",
    "/system/xbin/supolicy",
    "/system/bin/supolicy",
    "/system/etc/init.d/99SuperSUDaemon",
    "/system/etc/.has_su_daemon",
    "/system/etc/.installed_su_daemon",
    "/system/bin/.ext/.su",
    "/system/etc/.has_su_daemon",
    "/system/etc/.installed_su_daemon",
    "/system/xbin/daemonsu",
    "/system/etc/init.d/99SuperSUDaemon",
    "/system/etc/.has_su_daemon",
    "/system/etc/.installed_su_daemon",
    "/system/xbin/supolicy",
    "/system/bin/supolicy",
  ],
  IOS: [
    "/Applications/Cydia.app",
    "/Library/MobileSubstrate/MobileSubstrate.dylib",
    "/bin/bash",
    "/usr/sbin/sshd",
    "/etc/apt",
    "/private/var/lib/apt/",
    "/private/var/lib/cydia",
    "/private/var/mobile/Library/SBSettings/Themes",
    "/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
    "/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
    "/System/Library/LaunchDaemons/com.ikey.bbot.plist",
    "/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
    "/private/var/stash",
    "/private/var/lib/cydia",
    "/private/var/cache/apt",
    "/private/var/lib/dpkg",
    "/private/var/mobile/Library/Cydia",
    "/private/var/mobile/Library/Caches/com.saurik.Cydia",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Launch.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Installation.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Sources.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Metainfo.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Settings.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Installation.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Sources.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Metainfo.plist",
    "/private/var/mobile/Library/Preferences/com.saurik.Cydia.Settings.plist",
  ],
};

// Jailbreak detection patterns
export const JAILBREAK_DETECTION_PATTERNS = {
  ANDROID: [
    "ro.debuggable",
    "ro.secure",
    "ro.build.type",
    "ro.build.tags",
    "ro.build.selinux",
  ],
  IOS: [
    "DYLD_INSERT_LIBRARIES",
    "DYLD_LIBRARY_PATH",
    "DYLD_FRAMEWORK_PATH",
    "DYLD_ROOT_PATH",
    "DYLD_SHARED_REGION",
    "DYLD_VERSIONED_FRAMEWORK_PATH",
    "DYLD_VERSIONED_LIBRARY_PATH",
  ],
};

// Emulator detection patterns
export const EMULATOR_DETECTION_PATTERNS = {
  ANDROID: [
    "ro.kernel.qemu",
    "ro.hardware",
    "ro.product.cpu.abi",
    "ro.product.device",
    "ro.product.model",
    "ro.product.manufacturer",
  ],
  IOS: [
    "SIMULATOR_DEVICE_NAME",
    "SIMULATOR_DEVICE_INFO",
    "SIMULATOR_HOST_HOME",
    "SIMULATOR_ROOT",
  ],
};

// Development mode detection
export const DEVELOPMENT_MODE_INDICATORS = {
  ANDROID: [
    "ro.debuggable=1",
    "ro.secure=0",
    "ro.build.type=userdebug",
    "ro.build.type=eng",
  ],
  IOS: ["DEVELOPMENT_TEAM", "CODE_SIGN_IDENTITY", "PROVISIONING_PROFILE"],
};

export default SECURITY_CONFIG;
