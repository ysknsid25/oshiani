import { db, anl } from "../plugins/firebase";
export const COLLECTION_AGCASTLIST = db.collection("agCastList");

const PERSONALITY_ID = "personality";
const PERSONALITY_PROPS = "personalityList";
const TITLE_ID = "title";
const TITLE_PROPS = "titleList";

/**
 * A＆Gのキャスト一覧情報を取得する
 * @returns キャスト情報
 */
export const getCastList = () => {
    const retList = getAgCastList(PERSONALITY_ID, PERSONALITY_PROPS);
    return retList;
};

/**
 * A&Gの番組一覧情報を取得する
 * @returns 番組情報
 */
export const getPgTitleList = () => {
    const retList = getAgCastList(TITLE_ID, TITLE_PROPS);
    return retList;
};

/**
 * agCastListコレクションの情報を取得する
 * @returns Array
 */
const getAgCastList = async (documentId, targetprops) => {
    const stringDocumentId = documentId.toString();
    let retList = [];
    await COLLECTION_AGCASTLIST.doc(stringDocumentId)
        .get()
        .then((doc) => {
            anl.logEvent("getAgCastList", {
                function: "getAgCastList",
            });
            if (doc.exists) {
                const data = doc.data();
                retList = data[targetprops];
                if (typeof retList === "undefined") {
                    retList = [];
                }
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getAgCastList",
                msg: error,
            });
            console.log(error);
        });
    return retList;
};
