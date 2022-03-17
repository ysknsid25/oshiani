exports.dashxScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    const key = date.getFullYear() + "" + (date.getMonth() + 1);
    const url = "http://dash.shueisha.co.jp/release/future.php";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const bookInfoArr = readBody(externalRes);
    db.collection("dashxPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _BASE_URL = "http://dash.shueisha.co.jp";

const _BEGIN_OF_SCRAIPING = "container mainCont";
const _BEGIN_OF_IMG_URL = '<div class="cover"><img src="';
const _END_OF_IMG_URL = '" alt="';
const _KEY_OF_TITLE_AUTHOR_ILLUST = '<div class="title_box">';
const _BEGIN_OF_TITLE = "<h3>";
const _END_OF_TITLE = "</h3>";
const _BEGIN_OF_AUTHOR = "著者：";
const _END_OF_AUTHOR = '</span><br><span class="boldText">';
const _BEGIN_OF_ILLUSTLATOR = "イラスト：";
const _END_OF_ILLUSTLATOR = "</span><br></p>";
const _BEGIN_OF_PRICE = "定価：</span>";
const _END_OF_PRICE = '<br><span class="boldText">';
const _BEGIN_OF_SALE_DATE = "発売日：</span>";
const _END_OF_SALE_DATE = "<br>";

const _BEGIN_OF_CATCHTEXT = '<p class="boldText catch">';
const _END_OF_CATCHTEXT = "</p><p>";
const _BEGIN_OF_OUTLINETEXT = _END_OF_CATCHTEXT;
const _END_OF_OUTLINETEXT = '</p><div class="d-md-none">';
const _END_OF_BOOK_INFO = '<p class="credit">';
const _END_OF_SCRAIPING = "<!-- /content -->";

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
        if (isContainKeyWord(lineText, _BEGIN_OF_IMG_URL)) {
            const tmpImgUrl = getTargetText(
                lineText,
                _BEGIN_OF_IMG_URL,
                _END_OF_IMG_URL
            );
            if (tmpImgUrl !== "") {
                tmpObj.imgurl = _BASE_URL + tmpImgUrl;
            } else {
                tmpObj.imgurl = "";
            }
        }
        if (isContainKeyWord(lineText, _KEY_OF_TITLE_AUTHOR_ILLUST)) {
            //次の行にタイトルと著者とイラストレーターがいる
            const tmpLineText = bodyTextArr[i + 1];
            //タイトル
            if (isContainKeyWord(tmpLineText, _BEGIN_OF_TITLE)) {
                tmpObj.title = getTargetText(
                    tmpLineText,
                    _BEGIN_OF_TITLE,
                    _END_OF_TITLE
                );
            }
            //著者
            if (isContainKeyWord(tmpLineText, _BEGIN_OF_AUTHOR)) {
                tmpObj.author = getTargetText(
                    tmpLineText,
                    _BEGIN_OF_AUTHOR,
                    _END_OF_AUTHOR
                );
            }
            //イラストレーター
            if (isContainKeyWord(tmpLineText, _BEGIN_OF_ILLUSTLATOR)) {
                tmpObj.illust = getTargetText(
                    tmpLineText,
                    _BEGIN_OF_ILLUSTLATOR,
                    _END_OF_ILLUSTLATOR
                );
            }
        }

        //発売日
        if (isContainKeyWord(lineText, _BEGIN_OF_SALE_DATE)) {
            tmpObj.sabledate = getTargetText(
                lineText,
                _BEGIN_OF_SALE_DATE,
                _END_OF_SALE_DATE
            );
        }
        //価格
        if (isContainKeyWord(lineText, _BEGIN_OF_PRICE)) {
            tmpObj.price = getTargetText(
                lineText,
                _BEGIN_OF_PRICE,
                _END_OF_PRICE
            );
        }
        //キャッチテキスト
        if (isContainKeyWord(lineText, _BEGIN_OF_CATCHTEXT)) {
            const tmpCAtchText = getTargetText(
                lineText,
                _BEGIN_OF_CATCHTEXT,
                _END_OF_CATCHTEXT
            );
            //余計なもんが入ってくるので取り除く
            tmpObj.catchtext = tmpCAtchText.replace(
                '</p><p class="boldText catch">',
                ""
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
            resultArr.push(tmpObj);
            tmpObj = {};
        }
    }
    return resultArr;
};
