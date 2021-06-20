import { db, anl } from "../plugins/firebase";

export const COLLECTION_WORKINFO = db.collection("WorkInfo");

/**
 * トランザクションを使って作品情報を更新します
 * @param {Object} workInfo
 * @param {number} bookmarkCount
 * @param {number} rating
 * @param {number} commentcnt
 * @returns
 */
export const updateWorkInfo = async (
    workInfo,
    bookmarkCount,
    rating,
    commentcnt
) => {
    let isSuccess = false;
    const workInfoRef = COLLECTION_WORKINFO.doc(workInfo.id.toString());
    db.runTransaction((transaction) => {
        return transaction.get(workInfoRef).then(async (res) => {
            const seasonObj = getSeason(workInfo.season_name);
            if (res.exists) {
                const newBookMarkCnt = res.data().bookmarkcnt + bookmarkCount;
                const newCommentCnt = res.data().commentcnt + commentcnt;
                const oldRatingTotal =
                    res.data().ratingavg * res.data().commentcnt;
                let newAvgRating = (oldRatingTotal + rating) / newCommentCnt;
                newAvgRating = isNaN(newAvgRating) ? 0 : newAvgRating;
                transaction.update(workInfoRef, {
                    bookmarkcnt: newBookMarkCnt,
                    commentcnt: newCommentCnt,
                    id: workInfo.id,
                    images: {
                        recommended_url: workInfo.images.recommended_url,
                    },
                    media: workInfo.media,
                    media_text: workInfo.media_text,
                    official_site_url: workInfo.official_site_url,
                    ratingavg: newAvgRating,
                    season: seasonObj.season,
                    season_name: workInfo.season_name,
                    title: workInfo.title,
                    twitter_hashtag: workInfo.twitter_hashtag,
                    wikipedia_url: workInfo.wikipedia_url,
                    year: seasonObj.year,
                });
            } else {
                await setWorkInfo(workInfo, "insert");
            }
        });
    })
        .then(() => {
            console.log("Transaction successfully committed!");
            anl.logEvent("updateWorkInfo", {
                function: "updateWorkInfo",
                msg: "Transaction successfully committed!",
            });
            isSuccess = true;
        })
        .catch((error) => {
            console.log("Transaction failed: ", error);
            anl.logEvent("errorInfo", {
                function: "updateWorkInfo",
                msg: error,
            });
        });
    return isSuccess;
};

/**
 * season_nameから年・放送期を取得します
 * @param {string} seasonName year-season
 * @returns
 */
const getSeason = (seasonName) => {
    if (seasonName === "") {
        return {
            isExist: false,
            year: "",
            season: "",
        };
    }
    const tmpArr = seasonName.split("-");
    const retObj = {
        isExist: true,
        year: tmpArr[0],
        season: tmpArr[1],
    };
    return retObj;
};

/**
 * 作品情報が存在しているかを判別する
 * @param {String} workId
 * @returns Object UserInfo
 */
export const getWorkInfo = async (workId) => {
    let workInfo = {};
    await COLLECTION_WORKINFO.doc(workId)
        .get()
        .then((doc) => {
            anl.logEvent("getWorkInfo", {
                function: "getWorkInfo",
            });
            if (doc.exists) {
                workInfo = doc.data();
                workInfo.isExists = true;
            } else {
                workInfo.isExists = false;
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getWorkInfo",
                msg: error,
            });
            workInfo.isExists = false;
        });
    return workInfo;
};

/**
 * 作品情報を登録・更新する
 * @param {Objcet} userInfo
 * @returns
 */
export const setWorkInfo = async (workInfo, action) => {
    let isUpdatedWorkInfo = false;
    const seasonObj = getSeason(workInfo.season_name);
    const registVal = {
        bookmarkcnt: 0,
        commentcnt: 0,
        id: workInfo.id,
        images: {
            recommended_url: workInfo.images.recommended_url,
        },
        media: workInfo.media,
        media_text: workInfo.media_text,
        official_site_url: workInfo.official_site_url,
        ratingavg: 0,
        season: seasonObj.season,
        season_name: workInfo.season_name,
        title: workInfo.title,
        twitter_hashtag: workInfo.twitter_hashtag,
        wikipedia_url: workInfo.wikipedia_url,
        year: seasonObj.year,
    };
    await COLLECTION_WORKINFO.doc(workInfo.id.toString())
        .set(registVal)
        .then(() => {
            isUpdatedWorkInfo = true;
            anl.logEvent(action, {
                function: "setUserInfo",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "setWorkInfo",
                msg: error,
            });
        });
    return isUpdatedWorkInfo;
};
