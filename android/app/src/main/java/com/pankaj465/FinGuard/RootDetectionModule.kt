package com.pankaj465.FinGuard

import android.os.Build
import java.io.File
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class RootDetectionModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RootDetectionModule"
    }

    @ReactMethod
    fun isDeviceRooted(promise: Promise) {
        try {
            val rooted = checkRootMethod1() || checkRootMethod2() || checkRootMethod3()
            promise.resolve(rooted)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    // Method 1: Look for su binary
    private fun checkRootMethod1(): Boolean {
        val paths = arrayOf(
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su"
        )
        return paths.any { File(it).exists() }
    }

    // Method 2: Check build tags
    private fun checkRootMethod2(): Boolean {
        val buildTags = Build.TAGS
        return buildTags != null && buildTags.contains("test-keys")
    }

    // Method 3: Try running su command
    private fun checkRootMethod3(): Boolean {
        return try {
            Runtime.getRuntime().exec("su").destroy()
            true
        } catch (e: Exception) {
            false
        }
    }
}
