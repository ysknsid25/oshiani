import { db, anl } from "../plugins/firebase";
import { getTimeStamp } from "../constants/cmnfunc";

export const COLLECTION_ARTICLES = db.collection("Articles");

/**
 * 記事を全件取得する
 * @param {limit}
 * @returns
 */
export const getArticles = async (limit) => {
    let articles = [];
    await COLLECTION_ARTICLES.orderBy("postDate", "desc")
        .limit(limit)
        .get()
        .then((articleSnapShot) => {
            articleSnapShot.forEach((doc) => {
                const data = doc.data();
                articles.push(data);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getArticles",
                msg: error,
            });
            console.log(error);
        });
    return articles;
};

/**
 * 記事をカテゴリーを指定して取得する
 * @param {limit}
 * @returns
 */
export const getCategoryArticles = async (limit, category) => {
    let articles = [];
    await COLLECTION_ARTICLES.where("category", "==", category)
        .orderBy("postDate", "desc")
        .limit(limit)
        .get()
        .then((articleSnapShot) => {
            articleSnapShot.forEach((doc) => {
                const data = doc.data();
                articles.push(data);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getCategoryArticles",
                msg: error,
            });
            console.log(error);
        });
    return articles;
};

/**
 * IDを指定して、記事を取得する
 * @param {string} articleId
 * @returns
 */
export const getArticle = async (articleId) => {
    let article = {
        articleId: "",
        title: "",
        imageUrl: "",
        categoryObj: {
            key: 0,
            value: "次にアニメ化しそうな作品",
            color: "#F8BBD0",
        },
        category: 0,
        article1: "",
        article2: "",
        article3: "",
        article4: "",
        article5: "",
        article6: "",
        postDate: getTimeStamp(),
        rateStory: 0,
        rateActor: 0,
        ratePicture: 0,
        rateMusic: 0,
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
