import { db, anl } from "../plugins/firebase";
import { getKbnInfo } from "../constants/cmnfunc";
import { infoTypeKbn } from "../constants/kbn";

export const COLLECTION_RELEASE = db.collection("ReleaseHistory");

/**
 * お知らせ情報を書き込む
 * @param releaseInfo
 * {
 *  articleUrl: string,
 *  infoType: string,
 *  postDate: timestamp,
 *  title: string
 * }
 */
export const createReleaseInfo = async (releaseInfo) => {
    const releaseInfoRef = COLLECTION_RELEASE.doc();
    await releaseInfoRef
        .set(releaseInfo)
        .then(() => {
            return true;
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "createReleaseInfo",
                msg: error,
            });
            return false;
        });
};

/**
 * リリース情報コレクション投稿日のdescで返します。
 * @returns releaseInfo docs
 * {
 *  id: id,
 *  articleUrl: string,
 *  infoType: string,
 *  postDate: timestamp,
 *  title: string
 * }
 */
export const getReleaseInfoArr = async () => {
    let retArr = [];
    await COLLECTION_RELEASE.orderBy("postDate", "desc")
        .limit(5)
        .get()
        .then((releaseInfoSnapShot) => {
            releaseInfoSnapShot.forEach((doc) => {
                const data = doc.data();
                const tmpObj = {
                    id: doc.id,
                    articleUrl: data["articleUrl"],
                    infoType: getKbnInfo(infoTypeKbn, data["infoType"]),
                    postDate: data["postDate"],
                    title: data["title"],
                    color: getColorCdFromIndoType(data["infoType"]),
                };
                retArr.push(tmpObj);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", { function: "ReleaseInfo", msg: error });
        });
    return retArr;
};

//区分に応じてカラーコードをセットする
const getColorCdFromIndoType = (infoType) => {
    //リリース情報の場合indigo
    if (infoType === infoTypeKbn[0]["value"]) {
        return "indigo";
    }
    return "red";
};
