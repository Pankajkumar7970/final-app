// firebaseAuth.js
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    "391480015245-sf3lrttpogl3005p3j9g2vpt0aet2b5o.apps.googleusercontent.com",
});

export const signInWithGoogle = async () => {
  try {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = userCredential.user;

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
    };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await auth().signOut();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Google Sign-Out Error:", error);
    throw error;
  }
};
