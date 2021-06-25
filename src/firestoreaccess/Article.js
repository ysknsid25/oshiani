import { db, anl } from "../plugins/firebase";
import { getTimeStamp } from "../constants/cmnfunc";

export const COLLECTION_ARTICLES = db.collection("Articles");

/**
 * 記事を取得する
 * @param {string} articleId
 * @returns
 */
export const getArticle = async (articleId) => {
    let article = {
        articleId: "hoge",
        title: "",
        imageUrl: "",
        categoryObj: {
            key: 0,
            value: "次にアニメ化しそうな作品",
            color: "#F8BBD0",
        },
        article1: "",
        article2: "",
        article3: "",
        article4: "",
        article5: "",
        article6: "",
        postDate: getTimeStamp(),
    };
    await COLLECTION_ARTICLES.doc(articleId)
        .get()
        .then((doc) => {
            anl.logEvent("getArticle", {
                function: "getArticle",
            });
            if (doc.exists) {
                article = doc.data();
                if (typeof article === "undefined") {
                    article = "";
                }
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getArticle",
                msg: error,
            });
            console.log(error);
        });
    return article;
};

/**
 * 記事を投稿します
 * @param {string} uid
 * @param {number} workId
 * @param {Object} reviewInfo
 */
export const postArticle = async (articleInfo) => {
    let success = false;
    await COLLECTION_ARTICLES.doc(articleInfo.articleId)
        .set(articleInfo)
        .then(() => {
            anl.logEvent("postArticle", {
                function: "postArticle",
            });
            success = true;
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "postArticle",
                msg: error,
            });
            console.log(error);
        });
    return success;
};
