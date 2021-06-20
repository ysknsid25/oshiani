import { db, anl } from "../plugins/firebase";
import { createActionHistory } from "./ActionHistory";
import { getUserInfo } from "./Users";
import { getTimeStamp } from "../constants/cmnfunc";

export const COLLECTION_REVIEWS = db.collection("Reviews");

/**
 * 作品へのレビュー情報を取得する
 * TODO: もしユーザーが増えて、コメントが100件とかつくようになったら制限を考える
 * @param {string} workId
 * @returns
 */
export const getWorkReviews = async (workId) => {
    let retArr = [];
    const SUB_COLLECTION_REVIEWS = COLLECTION_REVIEWS.doc(workId).collection(
        "Review"
    );
    await SUB_COLLECTION_REVIEWS.orderBy("commentdate", "desc")
        .get()
        .then((reviewSnapShot) => {
            reviewSnapShot.forEach((doc) => {
                const data = doc.data();
                const tmpObj = {
                    docId: doc.id,
                    comment: data.comment,
                    commentdate: data.commentdate,
                    photoUrl: data.photoUrl,
                    rating: data.rating,
                    uname: data.uname,
                };
                retArr.push(tmpObj);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getWorkReviews",
                msg: error,
            });
        });
    return retArr;
};

/**
 * レビューを投稿します
 * @param {string} uid
 * @param {number} workId
 * @param {Object} reviewInfo
 */
export const setReview = async (uid, workId, title, reviewInfo) => {
    let success = false;
    const userInfo = await getUserInfo(uid);
    const nowDateTime = getTimeStamp();
    const reviewObj = {
        comment: reviewInfo.comment,
        commentdate: nowDateTime,
        photoUrl: userInfo.photoUrl,
        rating: reviewInfo.rating,
        uname: userInfo.displayName,
    };
    await COLLECTION_REVIEWS.doc(workId.toString())
        .collection("Review")
        .doc(uid)
        .set(reviewObj)
        .then(() => {
            anl.logEvent("setReview", {
                function: "setReview",
            });
            success = true;
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "setReview",
                msg: error,
            });
        });
    createActionHistory("post review", title);
    return success;
};
