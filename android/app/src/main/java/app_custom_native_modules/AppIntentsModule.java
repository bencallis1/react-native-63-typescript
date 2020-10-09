package app_custom_native_modules;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppIntentsModule  extends ReactContextBaseJavaModule {

    private Activity currentActivity;
    private Callback callback;
    private String NULL_CURRENT_ACTIVITY = "0";
    private final String SUCCESS_CALLBACK = "SUCCESS";
    private final String FAILURE_CALLBACK = "FAILURE";
    private ReactApplicationContext reactContext;

    private String url;

    public AppIntentsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.url = null;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppIntentsModule";
    }

    @ReactMethod
    public void openWebPageIntent(String url, Callback callback) {

        this.url = url;
        this.callback = callback;
        this.currentActivity = getCurrentActivity();

        if (this.currentActivity == null) {
            this.callback.invoke(NULL_CURRENT_ACTIVITY);
            return;
        }

        if (this.url == null) {
            Toast.makeText(this.currentActivity,
                    "URL provided not valid!",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);
            return;
        }


        try {

            Uri webpage = Uri.parse(url);
            Intent myIntent = new Intent(Intent.ACTION_VIEW, webpage);
            this.currentActivity.startActivity(myIntent);

            this.callback.invoke(SUCCESS_CALLBACK);

        } catch (ActivityNotFoundException e) {

            Toast.makeText(this.currentActivity,
                    "No application can handle this request. Please install a web browser or check your URL.",
                    Toast.LENGTH_LONG).show();

            this.callback.invoke(FAILURE_CALLBACK);

            e.printStackTrace();

        }
    }

}
