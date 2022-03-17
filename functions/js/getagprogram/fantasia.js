exports.fantasiaScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    const key = date.getFullYear() + "" + (date.getMonth() + 1);
    const url = "https://fantasiabunko.jp/product/new-release.html";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const bookInfoArr = readBody(externalRes);
    db.collection("fantasiaPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _BEGIN_OF_SCRAIPING = '<ul class="productList">';
const _KEY_OF_IMG_URL = "js-img-fallback";
const _BEGIN_OF_IMG_URL = '<img src="';
const _END_OF_IMG_URL = '" class=';
const _KEY_OF_TITLE = '<h3><a href="';
const _BEGIN_OF_TITLE = '">';
const _END_OF_TITLE = "</a></h3>";
const _KEY_OF_AUTHOR = "著者：";
const _BEGIN_OF_AUTHOR = '">';
const _END_OF_AUTHOR = "</a></li>";
const _KEY_OF_ILLUST = "イラスト：";
const _BEGIN_OF_ILLUSTLATOR = '">';
const _END_OF_ILLUSTLATOR = "</a></li>";
const _KEY_OF_SALE_DATE = "発売日";
const _BEGIN_OF_SALE_DATE = "発売日：";
const _END_OF_SALE_DATE = "</p>";

const _BEGIN_OF_CATCHTEXT = '<p class="catch">';
const _END_OF_CATCHTEXT = "</p>";
const _BEGIN_OF_OUTLINETEXT = '<p class="story">';
const _END_OF_OUTLINETEXT = "</p>";
const _END_OF_BOOK_INFO = '<div class="shop">';
const _END_OF_SCRAIPING = "</section>";

/**
 * bodyテキストの中身を解析していく
 * @param {string} bodyText
 * @returns array
 */
const readBody = (bodyText) => {
    const { isContainKeyWord, getTargetText } = require("./common");
    const bodyTextArr = bodyText.split(/\n/);
    let isBeginScraiping = false;
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
        //画像URL
        if (isContainKeyWord(lineText, _KEY_OF_IMG_URL)) {
            tmpObj.imgurl = getTargetText(
                lineText,
                _BEGIN_OF_IMG_URL,
                _END_OF_IMG_URL
            );
        }
        //タイトル
        if (isContainKeyWord(lineText, _KEY_OF_TITLE)) {
            tmpObj.title = getTargetText(
                lineText,
                _BEGIN_OF_TITLE,
                _END_OF_TITLE
            );
        }
        //著者
        if (isContainKeyWord(lineText, _KEY_OF_AUTHOR)) {
            tmpObj.author = getTargetText(
                lineText,
                _BEGIN_OF_AUTHOR,
                _END_OF_AUTHOR
            );
        }
        //イラストレーター
        if (isContainKeyWord(lineText, _KEY_OF_ILLUST)) {
            tmpObj.illust = getTargetText(
                lineText,
                _BEGIN_OF_ILLUSTLATOR,
                _END_OF_ILLUSTLATOR
            );
        }
        //発売日
        if (isContainKeyWord(lineText, _KEY_OF_SALE_DATE)) {
            tmpObj.sabledate = getTargetText(
                lineText,
                _BEGIN_OF_SALE_DATE,
                _END_OF_SALE_DATE
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
        //アウトラインテキストの開始判定
        if (isContainKeyWord(lineText, _BEGIN_OF_OUTLINETEXT)) {
            //次の行からアウトラインテキストになるので、フラグをONにする
            tmpObj.outlinetext = getTargetText(
                lineText,
                _BEGIN_OF_OUTLINETEXT,
                _END_OF_OUTLINETEXT
            );
        }
        //ひとつの書籍情報の終わり判定
        if (isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            tmpObj.price = "";
            resultArr.push(tmpObj);
            tmpObj = {};
        }
    }
    return resultArr;
};
