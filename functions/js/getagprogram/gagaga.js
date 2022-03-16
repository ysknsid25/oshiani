exports.gagagaScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    const key = date.getFullYear() + "" + (date.getMonth() + 1);
    const url = "https://gagagabunko.jp/release/";
    console.log(url);
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const bookInfoArr = readBody(externalRes);
    db.collection("gagagaPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _BASE_URL = "https://gagagabunko.jp/";

const _BEGIN_OF_SCRAIPING = "<!-- ↓ CONTENTS START!! ↓-->";
const _BEGIN_OF_BOOK_INFO = '<section class="content">';
const _BEGIN_OF_SALE_DATE = '<span class="headingReleasedate">';
const _END_OF_SALE_DATE = "</span>";
const _KEY_OF_TITLE_AUTHOR_ILLUST_PRICE = '<div id="title">';
const _BEGIN_OF_TITLE = '<h3 class="blueBold">';
const _END_OF_TITLE = "</h3>";
const _BEGIN_OF_AUTHOR = "著：";
const _END_OF_AUTHOR = "　イラスト：";
const _BEGIN_OF_ILLUSTLATOR = _END_OF_AUTHOR;
const _END_OF_ILLUSTLATOR = "</span><br />";
const _BEGIN_OF_PRICE = "　";
const _END_OF_PRICE = "</span>";
const _KEY_OF_IMG_URL = '<div id="syoeiB">';
const _BEGIN_OF_IMG_URL = '<img src="..';
const _END_OF_IMG_URL = '" width="100%"';
const _KEY_OF_CATCHTEXT_OUTLINETEXT = '<div id="Synopsis">';
const _BEGIN_OF_CATCHTEXT = '<span class="bold">';
const _END_OF_CATCHTEXT = "</span>";
const _BEGIN_OF_OUTLINETEXT = '<p class="textsize14">';
const _END_OF_OUTLINETEXT = "</p>";
const _END_OF_BOOK_INFO = "</section>";
const _END_OF_SCRAIPING = '<section class="content2">';

/**
 * bodyテキストの中身を解析していく
 * @param {string} bodyText
 * @returns array
 */
const readBody = (bodyText) => {
    const { isContainKeyWord, getTargetText } = require("./common");
    const bodyTextArr = bodyText.split(/\n/);
    let isBeginScraiping = false;
    let isBeginBook = false;
    let resultArr = [];
    let tmpObj = {};
    let saleDate = "";
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
        //発売日
        if (isContainKeyWord(lineText, _BEGIN_OF_SALE_DATE)) {
            saleDate = getTargetText(
                lineText,
                _BEGIN_OF_SALE_DATE,
                _END_OF_SALE_DATE
            );
        }
        //ひとつの書籍情報のはじまり判定
        if (isContainKeyWord(lineText, _BEGIN_OF_BOOK_INFO)) {
            isBeginBook = true;
        }
        //画像URL
        if (isContainKeyWord(lineText, _KEY_OF_IMG_URL)) {
            //次の行が画像
            const tmpUrl = getTargetText(
                bodyTextArr[i + 1],
                _BEGIN_OF_IMG_URL,
                _END_OF_IMG_URL
            );
            tmpObj.imgurl = _BASE_URL + tmpUrl;
        }
        //タイトル・著者・イラスト・定価
        if (isContainKeyWord(lineText, _KEY_OF_TITLE_AUTHOR_ILLUST_PRICE)) {
            tmpObj.title = getTargetText(
                bodyTextArr[i + 1],
                _BEGIN_OF_TITLE,
                _END_OF_TITLE
            );
            tmpObj.author = getTargetText(
                bodyTextArr[i + 2],
                _BEGIN_OF_AUTHOR,
                _END_OF_AUTHOR
            );
            tmpObj.illust = getTargetText(
                bodyTextArr[i + 2],
                _BEGIN_OF_ILLUSTLATOR,
                _END_OF_ILLUSTLATOR
            );
            tmpObj.price = getTargetText(
                bodyTextArr[i + 3],
                _BEGIN_OF_PRICE,
                _END_OF_PRICE
            );
        }
        //キャッチテキスト・アウトラインテキスト
        if (isContainKeyWord(lineText, _KEY_OF_CATCHTEXT_OUTLINETEXT)) {
            //次の行がキャッチテキスト。次の次の行がアウトラインテキスト
            tmpObj.catchtext = getTargetText(
                bodyTextArr[i + 1],
                _BEGIN_OF_CATCHTEXT,
                _END_OF_CATCHTEXT
            );
            tmpObj.outlinetext = getTargetText(
                bodyTextArr[i + 2],
                _BEGIN_OF_OUTLINETEXT,
                _END_OF_OUTLINETEXT
            );
        }
        //ひとつの書籍情報の終わり判定
        if (isBeginBook && isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            tmpObj.sabledate = saleDate;
            resultArr.push(tmpObj);
            tmpObj = {};
            isBeginBook = false;
        }
    }
    return resultArr;
};
