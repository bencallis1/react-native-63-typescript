package app_custom_native_modules;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public final class Util {

    public static void emitPasswordHashResult(ReactContext reactContext, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("password_hash_result", params);
    }

    public static void emitPasswordValidationResult(ReactContext reactContext, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("password_validation_result", params);
    }

}
