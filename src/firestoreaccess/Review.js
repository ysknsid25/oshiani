import { db, anl } from "../plugins/firebase";
//import { createActionHistory } from "./ActionHistory";

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
