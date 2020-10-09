package app_custom_native_modules;

import android.app.Activity;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.apache.commons.lang3.StringUtils;

import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.HashMap;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class AppSecurityModule extends ReactContextBaseJavaModule {

    protected static final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA1";
    protected static final int SALT_BYTES = 24;
    protected static final int HASH_BYTES = 24;
    protected static final int PBKDF2_ITERATIONS = 1000;

    protected static final int ITERATION_INDEX = 0;
    protected static final int SALT_INDEX = 1;
    protected static final int PBKDF2_INDEX = 2;

    private String passwordText;
    private String passwordToValidate;
    private String userSalt;
    private String userHash;
    private static String passwordHash;
    private static byte[] passwordSalt;
    private Activity currentActivity;
    private Callback callback;
    private String NULL_CURRENT_ACTIVITY = "0";
    private final String SUCCESS_CALLBACK = "SUCCESS";
    private final String FAILURE_CALLBACK = "FAILURE";
    private ReactApplicationContext reactContext;
    private WritableMap responseMap;

    public AppSecurityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.passwordText = null;
        this.userSalt = null;
        this.userHash = null;
        passwordHash = null;
        passwordSalt = null;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppSecurityModule";
    }

    @ReactMethod
    public void createPasswordHash(String passwordText, Callback callback) {

        this.passwordText = passwordText;
        this.callback = callback;
        this.currentActivity = getCurrentActivity();

        if (this.currentActivity == null) {
            this.callback.invoke(NULL_CURRENT_ACTIVITY);
            return;
        }

        if (this.passwordText == null) {
            Toast.makeText(this.currentActivity,
                    "Please provide password",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);
            return;
        }

        try {

            String hash = createHash(this.passwordText);

            this.responseMap = Arguments.createMap();

            //feedback data
            this.responseMap.putString("message", SUCCESS_CALLBACK);
            this.responseMap.putString("passwordHash", passwordHash);
            this.responseMap.putString("passwordSalt", Arrays.toString(passwordSalt));

            //respond
            this.callback.invoke(this.responseMap);

        } catch (NoSuchAlgorithmException e) {

            Toast.makeText(this.currentActivity,
                    "Hash password failure #1",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);

            e.printStackTrace();

        } catch (InvalidKeySpecException e) {

            Toast.makeText(this.currentActivity,
                    "Hash password failure #2",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);

            e.printStackTrace();

        }

    }

    /**
     * sd _ Kaybarax
     *
     * @param password
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    protected String createHash(String password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        return createHash(password.toCharArray());
    }

    /**
     * sd _ Kaybarax
     *
     * @param password
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    public static String createHash(char[] password)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Generate a random salt

        byte[] salt = generateSalt();
        passwordSalt = salt;//get copy

        // Hash the password
        byte[] hash = pbkdf2(password, salt, PBKDF2_ITERATIONS, HASH_BYTES);

        // format iterations:salt:hash, and get copy
        passwordHash = PBKDF2_ITERATIONS + ":" + toHex(salt) + ":" + toHex(hash);
        return passwordHash;
    }

    /**
     * sd _ Kaybarax
     *
     * @param password
     * @param salt
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    public static String createHash(char[] password, byte[] salt)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Hash the password
        byte[] hash = pbkdf2(password, salt, PBKDF2_ITERATIONS, HASH_BYTES);
        // format iterations:salt:hash
        return PBKDF2_ITERATIONS + ":" + toHex(salt) + ":" + toHex(hash);
    }

    /**
     * Generates a random salt to spice up security :)
     *
     * @return
     * @throws NoSuchAlgorithmException sd _ Kaybarax
     */
    public static byte[] generateSalt() throws NoSuchAlgorithmException {
        // VERY important to use SecureRandom instead of just Random
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        // Generate a 8 byte (64 bit) salt as recommended by RSA PKCS5
        byte[] salt = new byte[SALT_BYTES];
        random.nextBytes(salt);
        return salt;
    }

    /**
     * Computes the PBKDF2 hash of a password.
     *
     * @param password   the password to hash.
     * @param salt       the salt
     * @param iterations the iteration count (slowness factor)
     * @param bytes      the length of the hash to compute in bytes
     * @return the PBDKF2 hash of the password
     * sd _ Kaybarax
     */
    public static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }

    /**
     * Converts a string of hexadecimal characters into a byte array.
     *
     * @param hex the hex string
     * @return the hex string decoded into a byte array
     * sd _ Kaybarax
     */
    public static byte[] fromHex(String hex) {
        byte[] binary = new byte[hex.length() / 2];
        for (int i = 0; i < binary.length; i++) {
            binary[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return binary;
    }

    /**
     * Converts a byte array into a hexadecimal string.
     *
     * @param array the byte array to convert
     * @return a length*2 character string encoding the byte array
     * sd _ Kaybarax
     */
    public static String toHex(byte[] array) {
        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int paddingLength = (array.length * 2) - hex.length();
        if (paddingLength > 0)
            return String.format("%0" + paddingLength + "d", 0) + hex;
        else
            return hex;
    }

    @ReactMethod
    public void validatePasswordWithHashAndSalt(String passwordToValidate, String hash, String salt, Callback callback) {

        this.passwordToValidate = passwordToValidate;
        this.userHash = hash;
        this.userSalt = salt;
        this.callback = callback;
        this.currentActivity = getCurrentActivity();

        if (this.currentActivity == null) {
            this.callback.invoke(NULL_CURRENT_ACTIVITY);
            return;
        }

        if (this.passwordToValidate == null ||
                this.userSalt == null ||
                this.userHash == null) {
            Toast.makeText(this.currentActivity,
                    "All required data to validate password, not provided",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);
            return;
        }

        boolean passwordValidationPassed = false;

        try {

            passwordValidationPassed = validatePassword(this.passwordToValidate.toCharArray(),
                    this.userHash, this.userSalt.getBytes());

            //and then prepare result to emit feedback
            WritableMap params = Arguments.createMap();
            //data to emit back
            params.putString("passwordValidationPassed", String.valueOf(passwordValidationPassed));

            this.callback.invoke(SUCCESS_CALLBACK);
            Util.emitPasswordValidationResult(this.reactContext, params);


        } catch (NoSuchAlgorithmException e) {

            Toast.makeText(this.currentActivity,
                    "Password Validation failure #1",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);

            e.printStackTrace();

        } catch (InvalidKeySpecException e) {

            Toast.makeText(this.currentActivity,
                    "Password Validation failure #2",
                    Toast.LENGTH_LONG).show();
            this.callback.invoke(FAILURE_CALLBACK);

            e.printStackTrace();

        }

    }

    /**
     * Validates a password using a hash.
     *
     * @param password the password to check
     * @param goodHash the hash of the saved password
     * @return true if the password is correct, false if not
     * sd _ Kaybarax
     */
    public static boolean validatePassword(char[] password, String goodHash,
                                           byte[] salt) throws NoSuchAlgorithmException,
            InvalidKeySpecException {
        System.out.println("Checking the password......." + Arrays.toString(password));
        System.out.println("Against......." + goodHash);
        System.out.println("Using......." + Arrays.toString(salt));
        // Decode the hash into its parameters
        if (!StringUtils.contains(goodHash, ":")) {
            return false;
        }
        String[] params = goodHash.split(":");
        int iterations;
        try {
            iterations = Integer.parseInt(params[ITERATION_INDEX]);
        } catch (NumberFormatException numberFormatException) {
            numberFormatException.printStackTrace(System.out);
            iterations = 1000;
        }

        // byte[] salt = fromHex(params[SALT_INDEX]);
        byte[] hash = fromHex(params[PBKDF2_INDEX]);
        // Compute the hash of the provided password, using the same salt,
        // iteration count, and hash length
        byte[] testHash = pbkdf2(password, salt, iterations, hash.length);
        // Compare the hashes in constant time. The password is correct if
        // both hashes match.
        return slowEquals(hash, testHash);
    }

    /**
     * Compares two byte arrays in length-constant time. This comparison method
     * is used so that password hashes cannot be extracted from an on-line
     * system using a timing attack and then attacked off-line.
     *
     * @param a the first byte array
     * @param b the second byte array
     * @return true if both byte arrays are the same, false if not
     * sd _ Kaybarax
     */
    private static boolean slowEquals(byte[] a, byte[] b) {
        int diff = a.length ^ b.length;
        for (int i = 0; i < a.length && i < b.length; i++)
            diff |= a[i] ^ b[i];
        return diff == 0;
    }

}
