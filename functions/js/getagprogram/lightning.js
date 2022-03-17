exports.lightningScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    const key = date.getFullYear() + "" + (date.getMonth() + 1);
    const url = "https://dengekibunko.jp/product/newrelease-bunko.html";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const bookInfoArr = readBody(externalRes);
    db.collection("lightningPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _BEGIN_OF_SCRAIPING =
    "js-summary-product-list-with-image p-product-media list-unstyled";
const _KEY_OF_IMG_URL_SPLIT = '<img src="';
const _KEY_OF_IMG_URL = "p-books-media02__img-wrap";
const _BEGIN_OF_IMG_URL = 'img src="';
const _END_OF_IMG_URL = '"';

const _KEY_OF_TITLE = "p-books-media__title";
const _KEY_OF_TITLE_SPLIT = '<a href="';
const _BEGIN_OF_TITLE = ">";
const _END_OF_TITLE = "</a>";

const _KEY_OF_ILLUST_AUTHOR = '<ul class="p-books-media__authors">';
const _KEY_OF_ILLUST = "イラスト：";
const _KEY_OF_AUTHOR = "著者：";
const _BEGIN_OF_ILLUST_AUTHOR_WORD = 'class="p-books-media__authors-link">';
const _END_OF_ILLUST_AUTHOR_WORD = "</a>";
const _END_OF_ILLUST_AUTHOR = "</ul>";

const _BEGIN_OF_CATCHTEXT = '<p class="p-books-media__lead">';
const _END_OF_CATCHTEXT = "</p>";
const _BEGIN_OF_OUTLINETEXT = '<p class="p-books-media__summary">';
const _END_OF_OUTLINETEXT = "</p>";

const _BEGIN_OF_SALE_INFO =
    '<table class="p-books-media02__info d-none d-md-table">';
const _END_OF_SALE_INFO = "</table>";
const _KEY_OF_SALE_DATE = "<th>発売日</th>";
const _BEGIN_OF_SALE_DATE = "<td>";
const _END_OF_SALE_DATE = "</td>";
const _KEY_OF_PRICE = "<th>定価</th>";
const _BEGIN_OF_PRICE = "<td>";
const _END_OF_PRICE = '<span class="d-inline-block">';

const _END_OF_BOOK_INFO = "p-books-media02__action d-none d-md-block";
const _END_OF_SCRAIPING = '<div id="future">';

/**
 * bodyテキストの中身を解析していく
 * @param {string} bodyText
 * @returns array
 */
const readBody = (bodyText) => {
    const { isContainKeyWord, getTargetText } = require("./common");
    const bodyTextArr = bodyText.split(/\n/);
    let isBeginScraiping = false;
    let isImgText = false;
    let isAuthorIllustText = false;
    let isSaleInfoText = false;
    let resultArr = [];
    let tmpObj = {};
    for (let i = 0; i < bodyTextArr.length; i++) {
        const lineText = bodyTextArr[i];
        //スクレイピングの終了判定
        if (isBeginScraiping && isContainKeyWord(lineText, _END_OF_SCRAIPING)) {
            break;
        }
        //スクレイピングの開始判定
        if (isContainKeyWord(lineText, _BEGIN_OF_SCRAIPING)) {
            isBeginScraiping = true;
        }
        if (!isBeginScraiping) {
            continue;
        }
        //画像URLの予告
        if (isContainKeyWord(lineText, _KEY_OF_IMG_URL)) {
            isImgText = true;
        }
        //画像URL
        if (isImgText && isContainKeyWord(lineText, _BEGIN_OF_IMG_URL)) {
            const imgLine = lineText.split(_KEY_OF_IMG_URL_SPLIT);
            tmpObj.imgurl = imgLine[1].replace('"', "");
            isImgText = false;
        }
        //タイトル
        if (isContainKeyWord(lineText, _KEY_OF_TITLE)) {
            const tmpLineArr = lineText.split(_KEY_OF_TITLE_SPLIT);
            tmpObj.title = getTargetText(
                tmpLineArr[1],
                _BEGIN_OF_TITLE,
                _END_OF_TITLE
            );
        }
        //著者・イラストレーター情報の取得開始
        if (isContainKeyWord(lineText, _KEY_OF_ILLUST_AUTHOR)) {
            isAuthorIllustText = true;
        }
        //著者・イラストレーター情報の取得終了
        if (
            isAuthorIllustText &&
            isContainKeyWord(lineText, _END_OF_ILLUST_AUTHOR)
        ) {
            isAuthorIllustText = false;
        }
        //著者
        if (isAuthorIllustText && isContainKeyWord(lineText, _KEY_OF_AUTHOR)) {
            //2行先が著者
            tmpObj.author = getTargetText(
                bodyTextArr[i + 2],
                _BEGIN_OF_ILLUST_AUTHOR_WORD,
                _END_OF_ILLUST_AUTHOR_WORD
            );
        }
        //イラストレーター
        if (isAuthorIllustText && isContainKeyWord(lineText, _KEY_OF_ILLUST)) {
            //2行先がイラストレーター
            tmpObj.illust = getTargetText(
                bodyTextArr[i + 2],
                _BEGIN_OF_ILLUST_AUTHOR_WORD,
                _END_OF_ILLUST_AUTHOR_WORD
            );
        }
        //キャッチテキスト
        if (isContainKeyWord(lineText, _BEGIN_OF_CATCHTEXT)) {
            tmpObj.catchtext = getTargetText(
                lineText,
                _BEGIN_OF_CATCHTEXT,
                _END_OF_CATCHTEXT
            );
        }
        //アウトラインテキスト
        if (isContainKeyWord(lineText, _BEGIN_OF_OUTLINETEXT)) {
            tmpObj.outlinetext = getTargetText(
                lineText,
                _BEGIN_OF_OUTLINETEXT,
                _END_OF_OUTLINETEXT
            );
        }
        //販売情報の取得開始
        if (isContainKeyWord(lineText, _BEGIN_OF_SALE_INFO)) {
            isSaleInfoText = true;
        }
        //販売情報の取得終了
        if (isSaleInfoText && isContainKeyWord(lineText, _END_OF_SALE_INFO)) {
            isSaleInfoText = false;
        }
        //発売日
        if (isSaleInfoText && isContainKeyWord(lineText, _KEY_OF_SALE_DATE)) {
            //次の行が発売日
            tmpObj.sabledate = getTargetText(
                bodyTextArr[i + 1],
                _BEGIN_OF_SALE_DATE,
                _END_OF_SALE_DATE
            );
        }
        //販売価格
        if (isSaleInfoText && isContainKeyWord(lineText, _KEY_OF_PRICE)) {
            //次の行が販売価格
            tmpObj.price = getTargetText(
                bodyTextArr[i + 1],
                _BEGIN_OF_PRICE,
                _END_OF_PRICE
            );
        }
        //ひとつの書籍情報の終わり判定
        if (isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            resultArr.push(tmpObj);
            tmpObj = {};
        }
    }
    return resultArr;
};
