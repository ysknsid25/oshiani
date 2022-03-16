exports.sneakerScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    //! スニーカー文庫は1日発売のため、翌月を対象に取得する前提
    const month = date.getMonth() + 1 > 12 ? 1 : date.getMonth() + 2;
    const key = date.getFullYear() + "" + month;
    const url = "https://sneakerbunko.jp/product/";
    //console.log(url);
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const saledate = date.getFullYear() + "年" + month + "月1日";
    const bookInfoArr = readBody(externalRes, saledate);
    db.collection("sneakerPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    console.log(illustArr);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _BEGIN_OF_SCRAIPING = '<ul class="c-thumbnail-book row">';
const _BEGIN_OF_BOOK_INFO = "js-dup-check c-thumbnail-book__item -to-media";
const _KEY_OF_TITLE = '<p class="c-thumbnail-book__title">';
const _BEGIN_OF_TITLE = 'class="c-thumbnail-book__title-link">';
const _END_OF_TITLE = "</a></p>";
const _KEY_OF_IMG_URL = "書影：";
const _BEGIN_OF_IMG_URL = '<img src="';
const _END_OF_IMG_URL = '" width=';
const _KEY_OF_AUTHOR = "著者";
const _KEY_OF_ILLUSTLATOR = "イラスト";

const _BEGIN_OF_AUTHOR_ILLUST = 'class="c-thumbnail-book__author-link">';
const _END_OF_AUTHOR_ILLUST = "</a>";

const _BEGIN_OF_ILLUSTLATOR = 'class="c-thumbnail-book__author-link">';
const _END_OF_ILLUSTLATOR = "</a>";
const _END_OF_BOOK_INFO = "</li>";
const _END_OF_SCRAIPING = "</ul>";

/**
 * bodyテキストの中身を解析していく
 * @param {string} bodyText
 * @returns array
 */
const readBody = (bodyText, saledate) => {
    const { isContainKeyWord, getTargetText } = require("./common");
    const bodyTextArr = bodyText.split(/\n/);
    let isBeginScraiping = false;
    let isBeginBook = false;
    let resultArr = [];
    let tmpObj = {};
    for (let i = 0; i < bodyTextArr.length; i++) {
        const lineText = bodyTextArr[i];
        //console.log(lineText);
        //スクレイピングの終了判定
        if (
            !isBeginBook &&
            isBeginScraiping &&
            isContainKeyWord(lineText, _END_OF_SCRAIPING)
        ) {
            break;
        }
        //スクレイピングの開始判定
        if (isContainKeyWord(lineText, _BEGIN_OF_SCRAIPING)) {
            isBeginScraiping = true;
        }
        if (!isBeginScraiping) {
            continue;
        }
        //一冊の書籍のはじまり
        if (isContainKeyWord(lineText, _BEGIN_OF_BOOK_INFO)) {
            isBeginBook = true;
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
                _BEGIN_OF_AUTHOR_ILLUST,
                _END_OF_AUTHOR_ILLUST
            );
        }
        //イラストレーター
        if (isContainKeyWord(lineText, _KEY_OF_ILLUSTLATOR)) {
            tmpObj.illust = getTargetText(
                lineText,
                _BEGIN_OF_ILLUSTLATOR,
                _END_OF_ILLUSTLATOR
            );
        }
        //ひとつの書籍情報の終わり判定
        if (isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            tmpObj.sabledate = saledate;
            resultArr.push(tmpObj);
            tmpObj = {};
            isBeginBook = false;
        }
    }
    return resultArr;
};
