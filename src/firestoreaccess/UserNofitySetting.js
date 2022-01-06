import { db, anl } from "../plugins/firebase";
export const COLLECTION_USERNOTIFYSETTING = db.collection("UserNotifySetting");

/**
 * ユーザーの通知情報を登録・更新する
 * @param {Objcet} userNotifyInfo
 * @returns
 */
export const setUserNotifyInfo = async (uid, userNotifyInfo, action) => {
    let isCreatedUserNotifyInfo = false;
    await COLLECTION_USERNOTIFYSETTING.doc(uid)
        .set(userNotifyInfo)
        .then(() => {
            isCreatedUserNotifyInfo = true;
            anl.logEvent(action, {
                function: "setUserNotifyInfo",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "setUserNotifyInfo",
                msg: error,
            });
        });
    return isCreatedUserNotifyInfo;
};

/**
 * UserNotifySettingコレクションの情報を取得する
 * @returns Array
 */
export const getUserNotifySetting = async (documentId) => {
    const stringDocumentId = documentId.toString();
    let data = {
        doNotify: false,
        frequency: "",
        targetEmail: "",
        castList: [],
    };
    await COLLECTION_USERNOTIFYSETTING.doc(stringDocumentId)
        .get()
        .then((doc) => {
            anl.logEvent("getUserNotifySetting", {
                function: "getUserNotifySetting",
            });
            if (doc.exists) {
                data = doc.data();
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getAgCastList",
                msg: error,
            });
            console.log(error);
        });
    return data;
};
