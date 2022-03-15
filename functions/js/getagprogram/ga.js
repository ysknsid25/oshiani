exports.gaScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    const key = date.getFullYear() + "" + (date.getMonth() + 1);
    const url = "https://ga.sbcr.jp/release/month_current/";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const bookInfoArr = readBody(externalRes);
    db.collection("gaPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _BEGIN_OF_SCRAIPING = '<div class="newBook_infoWrap spOnly">';
const _BEGIN_OF_IMG_URL =
    '<div class="image"><img src="" class=" tcd-lazy" data-src="';
const _END_OF_IMG_URL = '"></div></div></a>';
const _BEGIN_OF_SALE_DATE = '<p class="post_meta pcOnly">発売日：';
const _END_OF_SALE_DATE = "</p>";
const _KEY_OF_TITLE = '<h3 class="title">';
const _BEGIN_OF_TITLE = "<span>";
const _END_OF_TITLE = "</span>";
const _KEY_OF_ILLUST = '<p class="lineup_illust_area">';
const _KEY_OF_AUTHOR = '<p class="lineup_author_area">著：';
const _BEGIN_OF_AUTHOR = _KEY_OF_AUTHOR;
const _END_OF_AUTHOR = "</p>";
const _BEGIN_OF_ILLUSTLATOR = "イラスト：";
const _END_OF_ILLUSTLATOR = "</p>";
const _KEY_OF_PRICE = '<p class="price">';
const _KEY_OF_CATCHTEXT = '<p class="catchText">';
const _BEGIN_OF_OUTLINETEXT = '<p class="outlineText">';
const _END_OF_OUTLINETEXT = "</p>";
const _END_OF_BOOK_INFO = "</div><!-- /newBook_item_inner -->";
const _END_OF_SCRAIPING = '<div class="newBook_month_select_wrap">';

/**
 * bodyテキストの中身を解析していく
 * @param {string} bodyText
 * @returns array
 */
const readBody = (bodyText) => {
    const bodyTextArr = bodyText.split(/\n/);
    let isBeginScraiping = false;
    let isOutLineText = false;
    let outLineText = "";
    let resultArr = [];
    let tmpObj = {};
    for (let i = 0; i < bodyTextArr.length; i++) {
        const lineText = bodyTextArr[i];
        //スクレイピングの開始判定
        if (isContainKeyWord(lineText, _BEGIN_OF_SCRAIPING)) {
            isBeginScraiping = true;
        }
        if (!isBeginScraiping) {
            continue;
        }
        //画像URL
        if (isContainKeyWord(lineText, _BEGIN_OF_IMG_URL)) {
            tmpObj.imgurl = getTargetText(
                lineText,
                _BEGIN_OF_IMG_URL,
                _END_OF_IMG_URL
            );
        }
        //発売日
        if (isContainKeyWord(lineText, _BEGIN_OF_SALE_DATE)) {
            tmpObj.sabledate = getTargetText(
                lineText,
                _BEGIN_OF_SALE_DATE,
                _END_OF_SALE_DATE
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
            const tmpLineArr = lineText.split(_KEY_OF_ILLUST);
            tmpObj.illust = getTargetText(
                tmpLineArr[1],
                _BEGIN_OF_ILLUSTLATOR,
                _END_OF_ILLUSTLATOR
            );
        }
        //販売価格
        if (isContainKeyWord(lineText, _KEY_OF_PRICE)) {
            //次の行が販売価格
            tmpObj.price = bodyTextArr[i + 1];
        }
        //キャッチテキスト
        if (isContainKeyWord(lineText, _KEY_OF_CATCHTEXT)) {
            //次の行がキャッチテキスト。ただし</p>が入ってくるので置換する
            tmpObj.catchtext = bodyTextArr[i + 1].replace("</p>", "");
        }
        //アウトラインテキストの開始判定
        if (isContainKeyWord(lineText, _BEGIN_OF_OUTLINETEXT)) {
            //次の行からアウトラインテキストになるので、フラグをONにする
            isOutLineText = true;
            continue;
        }
        //アウトラインテキストの終了判定
        if (isOutLineText && isContainKeyWord(lineText, _END_OF_OUTLINETEXT)) {
            isOutLineText = false;
            tmpObj.outlinetext = outLineText;
            outLineText = "";
        }
        //アウトラインテキストフラグがONの間は蓄え続ける
        if (isOutLineText) {
            outLineText = outLineText + lineText;
        }
        //ひとつの書籍情報の終わり判定
        if (isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            resultArr.push(tmpObj);
            tmpObj = {};
        }
        if (isContainKeyWord(lineText, _END_OF_SCRAIPING)) {
            break;
        }
    }
    return resultArr;
};

/**
 * キーワードがその行に含まれているかを判定
 * @param {string} lineText
 * @param {string} keyword
 * @returns boolean
 */
const isContainKeyWord = (lineText, keyword) => {
    return lineText.indexOf(keyword) > -1;
};

/**
 * 一行の中からキーワードを抽出した結果を返す
 * @param {string} lineText
 * @param {string} beginKeyword
 * @param {string} endKeyword
 * @returns string
 */
const getTargetText = (lineText, beginKeyword, endKeyword) => {
    const keywordBeginPosi = lineText.indexOf(beginKeyword);
    const endIndex = lineText.indexOf(endKeyword);
    if (keywordBeginPosi === -1 || endIndex === -1) {
        return "";
    }
    const beginIndex = keywordBeginPosi + beginKeyword.length;
    if (beginIndex > endIndex) {
        return "";
    }
    return lineText.substring(beginIndex, endIndex).trim();
};
