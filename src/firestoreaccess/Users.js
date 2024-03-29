import { db, anl } from "../plugins/firebase";
import { createActionHistory } from "./ActionHistory";

export const COLLECTION_USERS = db.collection("Users");

/**
 * ユーザー情報を作成・更新する
 * @param {Object} user
 */
export const authorizeUser = async (user) => {
    const userInfo = {
        uid: user.uid,
        photoUrl: user.photoUrl,
        displayName: user.displayName,
        providerId: user.providerId,
        email: user.email,
        emailVerified: user.emailVerified,
        credential: user.credential,
    };
    await setUserInfo(userInfo, "user create");
    await createActionHistory("login", "");
};

/**
 * ユーザー情報を登録・更新する
 * @param {Objcet} userInfo
 * @returns
 */
const setUserInfo = async (userInfo, action) => {
    let isCreatedUser = false;
    await COLLECTION_USERS.doc(userInfo.uid)
        .set(userInfo)
        .then(() => {
            isCreatedUser = true;
            anl.logEvent(action, {
                function: "setUserInfo",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "setUserInfo",
                msg: error,
            });
        });
    return isCreatedUser;
};

/**
 * 登録されたユーザー情報を取得する
 * @param {String} uid
 * @returns Object UserInfo
 */
export const getUserInfo = async (uid) => {
    let userInfo = {};
    await COLLECTION_USERS.doc(uid)
        .get()
        .then((doc) => {
            anl.logEvent("getUserInfo", {
                function: "getUserInfo",
            });
            if (doc.exists) {
                userInfo = doc.data();
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getUserInfo",
                msg: error,
            });
        });
    return userInfo;
};
