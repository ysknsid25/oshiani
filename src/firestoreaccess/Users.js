import { db, anl } from "../plugins/firebase";
import { createActionHistory } from "./ActionHistory";

export const COLLECTION_USERS = db.collection("Users");

/**
 * ユーザー情報を作成・更新する
 * @param {Object} user
 */
export const authorizeUser = async (user) => {
    let userInfo = getUserInfo(user.uid);
    if (!Object.keys(userInfo).length) {
        userInfo = {
            uid: user.uid,
            photoUrl: user.photoUrl,
            displayName: user.displayName,
            providerId: user.providerId,
        };
        await setUserInfo(userInfo, "user create");
    } else {
        await updateUserInfo(userInfo, user);
    }
    await createActionHistory("login", "");
};

/**
 * ユーザー情報を更新するか判別して、更新を行う
 * @param {Object} oldUserInfo
 * @param {Objcet} newUserInfo
 */
const updateUserInfo = async (oldUserInfo, newUserInfo) => {
    let isChanged =
        oldUserInfo.photoUrl !== newUserInfo.photoUrl ||
        oldUserInfo.displayName !== newUserInfo.displayName;
    if (isChanged) {
        await setUserInfo(newUserInfo, "user update");
    }
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
    const userInfo = await COLLECTION_USERS.doc(uid).get();
    return userInfo;
};
