import { db, anl, getAuthUserInfo } from "../plugins/firebase";
import { getTimeStamp } from "../constants/cmnfunc";

export const COLLECTION_ACTION = db.collection("ActionHistory");

/**
 * 行動履歴を書き込む
 * @param {String} action
 * @param {String} message
 */
export const createActionHistory = async (action, message) => {
    const user = await getAuthUserInfo();
    const actionHistoryRef = COLLECTION_ACTION.doc();
    const actionInfo = {
        action: action,
        datetime: getTimeStamp(),
        message: typeof message === "undefined" ? "" : message,
        userId: user.uid,
    };
    actionHistoryRef
        .set(actionInfo)
        .then(() => {})
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "createActionHistory",
                msg: error,
            });
        });
};

/**
 * ユーザーの直近5件の行動履歴を取得します
 * @param {String} userId
 * @returns
 */
export const getActionHistoryArr = async (userId) => {
    let retArr = [];
    await COLLECTION_ACTION.where("userId", "==", userId)
        .orderBy("datetime", "desc")
        .limit(5)
        .get()
        .then((actionHistorySnapShot) => {
            actionHistorySnapShot.forEach((doc) => {
                const data = doc.data();
                const color = data["action"] === "login" ? "red" : "indigo";
                const tmpObj = {
                    id: doc.id,
                    title: data["action"],
                    time: data["datetime"],
                    message: data["message"],
                    color: color,
                };
                retArr.push(tmpObj);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getActionHistoryArr",
                msg: error,
            });
        });
    return retArr;
};
