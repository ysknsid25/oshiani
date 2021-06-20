import { db, anl } from "../plugins/firebase";
import { createActionHistory } from "./ActionHistory";

export const COLLECTION_WATCHLIST = db.collection("WatchList");

/**
 * 登録されたウォッチリスト(全件)を取得する
 * 全件取得だけど、配列に入ってるから返って来るのは1件だけ
 * @param {String} uid
 * @returns Array watchList
 */
export const getWatchList = async (uid) => {
    let watchList = [];
    await COLLECTION_WATCHLIST.doc(uid)
        .get()
        .then((doc) => {
            anl.logEvent("getWatchList", {
                function: "getWatchList",
            });
            if (doc.exists) {
                watchList = doc.data().watchlist;
                if (typeof watchList === "undefined") {
                    watchList = [];
                }
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getWatchList",
                msg: error,
            });
        });
    return watchList;
};

/**
 * ウォッチリストに追加します。
 * @param {string} uid
 * @param {object} workInfo
 * @returns ウォッチリストの追加に成功したか
 */
export const addWatchList = async (uid, workInfo) => {
    let retMessage = "";
    let watchList = await getWatchList(uid);
    const isExistInWatchList =
        watchList.findIndex(
            (watchWorkInfo) => watchWorkInfo.id == workInfo.id
        ) > -1;
    if (isExistInWatchList) {
        retMessage = "ウォッチリストに既に追加されています。";
        return retMessage;
    }
    const addWorkInfo = {
        id: workInfo.id,
        images: {
            recommended_url: workInfo.images.recommended_url,
        },
        media: workInfo.media,
        media_text: workInfo.media_text,
        official_site_url: workInfo.official_site_url,
        season_name: workInfo.season_name,
        title: workInfo.title,
        twitter_hashtag: workInfo.twitter_hashtag,
        wikipedia_url: workInfo.wikipedia_url,
    };
    watchList.unshift(addWorkInfo);
    await COLLECTION_WATCHLIST.doc(uid)
        .set({
            watchlist: watchList,
        })
        .then(() => {
            anl.logEvent("add WatchList", {
                function: "addWatchList",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "addWatchList",
                msg: error,
            });
            retMessage = "ウォッチリストに追加できませんでした。";
        });
    createActionHistory("add WatchList", workInfo.title);
    return retMessage;
};

/**
 * ウォッチリストから作品を削除します。
 * @param {string} uid
 * @param {array} watchList
 * @param {string} targetTitle
 * @returns
 */
export const deleteWatchList = async (uid, watchList, targetTitle) => {
    let canDeleteWatchList = false;
    await COLLECTION_WATCHLIST.doc(uid)
        .set({
            watchlist: watchList,
        })
        .then(() => {
            canDeleteWatchList = true;
            anl.logEvent("delete WatchList", {
                function: "deleteWatchList",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "deleteWatchList",
                msg: error,
            });
        });
    createActionHistory("delete WatchList", targetTitle);
    return canDeleteWatchList;
};
