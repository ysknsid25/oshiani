import { db, anl } from "../plugins/firebase";
import { date, getNowSeason, getNowYear } from "../api/Annict";

export const COLLECTION_WORKINFO = db.collection("WorkInfo");

/**
 * FireStoreに保存された作品情報を取得します。
 * @param {Array} idArrays
 * @returns
 */
export const getWorkInfos = (idArrays) => {
    let retArr = [];
    idArrays.map(async (id) => {
        const emptyObj = {
            id: id,
            bookmarkcnt: 0,
            ratingavg: 0,
        };
        const docRef = COLLECTION_WORKINFO.doc(id.toString());
        await docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const tmpObj = {
                        id: id,
                        bookmarkcnt: data.bookmarkcnt,
                        ratingavg: data.ratingavg,
                    };
                    retArr.push(tmpObj);
                } else {
                    retArr.push(emptyObj);
                }
            })
            .catch((error) => {
                anl.logEvent("errorInfo", {
                    function: "getWorkInfos",
                    msg: error,
                });
                retArr.push(emptyObj);
            });
    });
    return retArr;
};

/**
 * 指定された条件で人気のある作品を取得します。
 * @param {boolean} isNextSeason
 * @param {boolean} isBookMark
 */
export const getPopularWorks = async (isNextSeason, isBookMark) => {
    let retArr = [];

    let targetSeason = getNowSeason();
    let targetYear = getNowYear();
    if (isNextSeason) {
        let tmpMonth = date.getMonth() + 3;
        if (tmpMonth > 12) {
            tmpMonth = tmpMonth - 12;
            targetYear += 1;
        }
        targetSeason = getNowSeason(tmpMonth);
    }

    let sortField = "ratingavg";
    let sortField2 = "bookmarkcnt";
    if (isBookMark) {
        sortField = "bookmarkcnt";
        sortField2 = "ratingavg";
    }
    await COLLECTION_WORKINFO.where("year", "==", targetYear.toString())
        .where("season", "==", targetSeason.toString())
        .orderBy(sortField, "desc")
        .orderBy(sortField2, "desc")
        .orderBy("id", "asc")
        .limit(5)
        .get()
        .then((workInfoSnapShot) => {
            workInfoSnapShot.forEach((doc) => {
                const data = doc.data();
                retArr.push(data);
            });
        })
        .catch((error) => {
            console.log(error);
            anl.logEvent("errorInfo", {
                function: "getPopularWorks",
                msg: error,
            });
        });
    return retArr;
};

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
