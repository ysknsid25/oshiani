import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/auth";

const environment = process.env.NODE_ENV || "development";
const envSet = require(`./env.${environment}.js`);

export const RAMEN = envSet.RAMEN;
const firebaseConfig = envSet.CONFIG;

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
export const anl = firebaseApp.analytics();
export const authProvider = new firebase.auth.TwitterAuthProvider();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebaseApp.auth();

/**
 * google:ログイン処理
 * @returns object retVal
 */
export const loginWithGoogle = async () => {
    const loginInfo = await auth
        .signInWithPopup(googleAuthProvider)
        .then((result) => {
            const credential = result.credential;
            console.log(credential);
            const user = result.user;
            const retVal = {
                uid: user.uid,
                photoUrl: user.photoURL,
                displayName: user.displayName,
                providerId: credential.providerId,
                isLoginSuccess: true,
                email: user.email,
                emailVerified: user.emailVerified,
                credential: {
                    idToken: credential.idToken,
                    accessToken: credential.accessToken,
                },
            };
            anl.logEvent("login detected", retVal);
            return retVal;
            //console.log(result);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = error.credential;
            const retval = {
                function: "loginWithGoogle",
                errorCode: errorCode,
                msg: errorMessage,
                credential: credential,
                isLoginSuccess: false,
            };
            anl.logEvent("errorInfo", retval);
            return retval;
        });
    return loginInfo;
};

/**
 * twitter:ログイン処理
 * @returns object retVal
 */
export const login = async () => {
    const loginInfo = await auth
        .signInWithPopup(authProvider)
        .then((result) => {
            const credential = result.credential;
            console.log(credential);
            const user = result.user;
            const retVal = {
                uid: user.uid,
                photoUrl: user.photoURL,
                displayName: user.displayName,
                providerId: credential.providerId,
                isLoginSuccess: true,
                email: user.email,
                emailVerified: user.emailVerified,
                credential: {
                    token: credential.accessToken,
                    secret: credential.secret,
                },
            };
            anl.logEvent("login detected", retVal);
            return retVal;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = error.credential;
            const retval = {
                function: "signInWithRedirect",
                errorCode: errorCode,
                msg: errorMessage,
                credential: credential,
                isLoginSuccess: false,
            };
            anl.logEvent("errorInfo", retval);
            return retval;
        });
    return loginInfo;
};

/**
 * ログアウト処理
 */
export const logout = async () => {
    await auth
        .signOut()
        .then(() => {
            anl.logEvent("logout detected");
        })
        .catch((error) => {
            anl.logEvent("logout Error", JSON.stringify(error));
        });
};

/**
 * ユーザー情報の取得
 */
export const getAuthUserInfo = async () => {
    let userInfo = "";
    await auth.onAuthStateChanged(function(user) {
        if (user) {
            userInfo = user;
        }
    });
    return userInfo;
};

/**
 * 再認証を行う
 * @param {string} uid
 */
export const reAuth = async (uid) => {
    //console.log(uid);
    db.collection("Users")
        .doc(uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const userInfo = doc.data();
                if (userInfo.providerId === "google.com") {
                    const credential = googleAuthProvider.GetCredential(
                        userInfo.credential.idToken,
                        userInfo.credential.accessToken
                    );
                    console.log(credential);
                }
            }
        });
};
