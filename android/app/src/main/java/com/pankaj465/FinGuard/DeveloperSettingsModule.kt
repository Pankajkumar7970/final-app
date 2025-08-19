package com.yourapp

import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class DeveloperSettingsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeveloperSettingsModule"
    }

    @ReactMethod
    fun isDeveloperModeEnabled(promise: Promise) {
        try {
            val devOptions = Settings.Global.getInt(
                reactContext.contentResolver,
                Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
                0
            )

            val adb = Settings.Global.getInt(
                reactContext.contentResolver,
                Settings.Global.ADB_ENABLED,
                0
            )

            val enabled = (devOptions == 1 || adb == 1)
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
