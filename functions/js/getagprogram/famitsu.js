exports.famitsuScraiping = async (db) => {
    const { setAuthor, setIllustrator } = require("./common");
    const date = new Date();
    const year = date.getFullYear();
    const month =
        date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + "" + (date.getMonth() + 1);
    //! キーは他のモールと合わせて0埋めしない
    const key = year + "" + date.getMonth();
    //! ファミ通文庫は毎月30日発売
    const saledate = year + "年" + month + "月30日";
    const url =
        "https://famitsubunko.jp/product/" +
        year +
        "/" +
        month +
        "/field/title_kana/nem/";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const bookInfoArr = readBody(externalRes, saledate);
    db.collection("famitsuPublishInfo")
        .doc(key)
        .set({ newRelease: bookInfoArr });
    const authorArr = bookInfoArr.map((bookInfo) => bookInfo.author);
    const illustArr = bookInfoArr.map((bookInfo) => bookInfo.illust);
    setAuthor(db, authorArr);
    setIllustrator(db, illustArr);
    return bookInfoArr;
};

const _KEY_OF_IMG_URL = "書影：";
const _BEGIN_OF_IMG_URL = '<img src="';
const _END_OF_IMG_URL = '" alt="';
const _KEY_OF_TITLE = '<p class="c-thumbnail-book__title">';
const _BEGIN_OF_TITLE = _KEY_OF_TITLE;
const _END_OF_TITLE = "</p>";
const _KEY_OF_SUB_TITLE = "c-thumbnail-book__title-sub";
const _BEGIN_OF_SUB_TITLE = '<p class="c-thumbnail-book__title-sub">';
const _END_OF_SUB_TITLE = "</p>";
const _KEY_OF_AUTHOR_SPLIT = '<a href="';
const _KEY_OF_AUTHOR = "著 : ";
const _KEY_OF_AUTHOR2 = "著者 : ";
const _BEGIN_OF_AUTHOR = '">';
const _END_OF_AUTHOR = "</a>";
const _KEY_OF_ILLUST = "イラスト : ";
const _BEGIN_OF_ILLUSTLATOR = '">';
const _END_OF_ILLUSTLATOR = "</a>";

const _END_OF_BOOK_INFO = "js-dup-check c-thumbnail-book__item";
const _END_OF_SCRAIPING = '<div class="col-lg-3">';

/**
 * bodyテキストの中身を解析していく
 * @param {string} bodyText
 * @returns array
 */
const readBody = (bodyText, saledate) => {
    const { isContainKeyWord, getTargetText } = require("./common");
    const bodyTextArr = bodyText.split(/\n/);
    let resultArr = [];
    let tmpObj = {};
    let isFirst = true;
    for (let i = 0; i < bodyTextArr.length; i++) {
        const lineText = bodyTextArr[i];
        //スクレイピングの終了判定
        if (isContainKeyWord(lineText, _END_OF_SCRAIPING)) {
            //! ファミ通文庫は本の終了部分を取れないので、最後の一回分をここで保存してから終わる
            tmpObj.saledate = saledate;
            resultArr.push(tmpObj);
            tmpObj = {};
            break;
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
        //サブタイトル
        if (isContainKeyWord(lineText, _KEY_OF_SUB_TITLE)) {
            tmpObj.title =
                tmpObj.title +
                " " +
                getTargetText(lineText, _BEGIN_OF_SUB_TITLE, _END_OF_SUB_TITLE);
        }
        //著者
        if (
            isContainKeyWord(lineText, _KEY_OF_AUTHOR) ||
            isContainKeyWord(lineText, _KEY_OF_AUTHOR2)
        ) {
            const tmpText = lineText.split(_KEY_OF_AUTHOR_SPLIT);
            tmpObj.author = getTargetText(
                tmpText[1],
                _BEGIN_OF_AUTHOR,
                _END_OF_AUTHOR
            );
        }
        //イラストレーター
        if (isContainKeyWord(lineText, _KEY_OF_ILLUST)) {
            const tmpText = lineText.split(_KEY_OF_AUTHOR_SPLIT);
            tmpObj.illust = getTargetText(
                tmpText[1],
                _BEGIN_OF_ILLUSTLATOR,
                _END_OF_ILLUSTLATOR
            );
        }
        //ひとつの書籍情報の終わり判定
        if (!isFirst && isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            tmpObj.saledate = saledate;
            resultArr.push(tmpObj);
            tmpObj = {};
        }
        //! 一回目はオブジェクトの初期化をしないために、一回目が来たタイミングでフラグを変える
        if (isContainKeyWord(lineText, _END_OF_BOOK_INFO)) {
            isFirst = false;
        }
    }
    return resultArr;
};
