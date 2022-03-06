exports.gaScraiping = async (db, page) => {
    const url = "https://ga.sbcr.jp/release/month_current/";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    console.log(externalRes);
    /*
    const { setAuthor, setIllustrator } = require("./common");
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const novelInfoAllArr = getGANovelInfo(document);
    const novelInfoArr = shurinkWorkInfo(novelInfoAllArr);
    //配列ごとの情報をオブジェクトにまとめる
    const gaImgUrlArr = getGAImageUrlArr(document);
    const novelInfoObjArr = getGANovelInfoObj(novelInfoArr);
    //console.log(novelInfoObjArr[novelInfoObjArr.length - 1]);
    const writeObj = await writeGAInfoToFireStore(
        novelInfoObjArr[novelInfoObjArr.length - 1],
        gaImgUrlArr
    );
    //console.log(writeObj);
    db.collection("gaPublishInfo")
        .doc(writeObj.saleMonthYear)
        .set({ newRelease: writeObj.fullNovelInfoObjArr });
    setAuthor(db, writeObj.authorArr);
    setIllustrator(db, writeObj.illustratorArr);
    */
};

/**
 * GA文庫の情報を配列に格納した状態で返します。
 * @param NodeList document
 * @returns array
 */
const getGANovelInfo = (document) => {
    const nodes = document.querySelectorAll(".newBook_item_inner");
    const htmlTree = Array.from(nodes, (html) => html.textContent.trim());
    //const tokyoWeathers = Array.from(nodes, (td) => td.textContent.trim());
    const novelInfoArr = htmlTree.map((html) =>
        html
            .split("\n")
            .map((text) => text.replace("\n", ""))
            .filter((replacedText) => replacedText !== "")
    );
    const novelDistinctInfoArr = novelInfoArr.map((novelInfo) => [
        ...new Set(novelInfo),
    ]);
    return novelDistinctInfoArr;
};

/**
 * スクレイピングで取得したすべてのテキスト情報の配列をテキスト単位にまとめて、
 * 二次元配列として返す
 * @param array novelInfoAllArr スクレイピングで取得したすべてのテキスト情報の配列
 * @returns array
 */
const shurinkWorkInfo = (novelInfoAllArr) => {
    //作品情報ごとに配列に放り込む
    let count = 0;
    let novelInfoArr = [];
    let novelInfo = [];
    for (let i = 0; i < novelInfoAllArr.length; i++) {
        let line = novelInfoAllArr[i];
        if (line.indexOf("発売日:") > -1) {
            novelInfoArr[i] = novelInfo;
            novelInfo = [];
            count = 0;
        }
        novelInfo[count] = line;
        count++;
    }
    //最後の1回
    novelInfoArr[novelInfoAllArr.length - 1] = novelInfo;
    return novelInfoArr;
};

/**
 * GA文庫のイメージURLを取得します
 * @param NodeList document
 * @returns array
 */
const getGAImageUrlArr = (document) => {
    const imageHtmls = document.querySelectorAll(".image_wrap > .image > img");
    const imgUrls = Array.from(imageHtmls, (html) =>
        html.getAttribute("data-src")
    );
    return imgUrls;
};

/**
 * GA文庫の情報をオブジェクトの形で返します
 * @param array novelInfoArr
 * @returns object
 */
const getGANovelInfoObj = (novelInfoAllArr) => {
    const retObjArr = novelInfoAllArr.map((novelInfoArr) => {
        const novelInfoObjArr = novelInfoArr.map((novelInfo) => {
            const saleDate = 0;
            const title = 1;
            const authorIllustrator = 2;
            const ISBN = 3;
            const price = 4;
            const outLineBegin = 7;
            const outLineEnd = novelInfo.length;
            let outLine = "";
            for (let i = outLineBegin; i < outLineEnd; i++) {
                outLine += novelInfo[i].trim() + "\n";
            }
            const replacedAuthorIllustrator = novelInfo[authorIllustrator]
                .replace(" ", "")
                .replace("　", "");
            const authorIllustratorObj = getGAAuthorIllustrator(
                replacedAuthorIllustrator
            );
            const novelInfoObj = {
                saleDate: novelInfo[saleDate].replace("発売日：", "").trim(),
                title: novelInfo[title].trim(),
                author: authorIllustratorObj.author.trim(),
                illustrator: authorIllustratorObj.illustrator.trim(),
                ISBN: novelInfo[ISBN].replace("ISBN：", "").trim(),
                price: novelInfo[price].trim(),
                outLine: outLine,
            };
            return novelInfoObj;
        });
        return novelInfoObjArr;
    });
    return retObjArr;
};

/**
 * 著者とイラストレーター情報を返す
 * @param string replacedAuthorIllustrator
 * @returns object
 */
const getGAAuthorIllustrator = (replacedAuthorIllustrator) => {
    let author = "";
    let illustrator = "";
    if (
        typeof replacedAuthorIllustrator !== "undefined" &&
        replacedAuthorIllustrator !== ""
    ) {
        const illustratorIndex = replacedAuthorIllustrator.indexOf(
            "イラスト："
        );
        const lastIndex = replacedAuthorIllustrator.length;
        author = replacedAuthorIllustrator.substring(2, illustratorIndex);
        illustrator = replacedAuthorIllustrator.substring(
            illustratorIndex + 5,
            lastIndex
        );
    }
    return { author: author, illustrator: illustrator };
};

/**
 * GA文庫のスクレイピング情報をFireStoreにセットする
 * @param {object} db
 * @param {array} novelInfoObjArr
 * @param {array} gaImgUrlArr
 */
const writeGAInfoToFireStore = async (novelInfoObjArr, gaImgUrlArr) => {
    let fullNovelInfoObjArr = [];
    const date = new Date();
    const fullYear = date.getFullYear();
    const month = date.getMonth() + 1;
    const saleMonthYear = fullYear + "" + month;
    let authorArr = [];
    let illustratorArr = [];
    for (let i = 0; i < novelInfoObjArr.length; i++) {
        let novelInfoObj = novelInfoObjArr[i];
        const imageUrl = gaImgUrlArr[i];
        novelInfoObj.imageUrl = imageUrl;
        fullNovelInfoObjArr[i] = novelInfoObj;
        authorArr[i] = novelInfoObj.author;
        illustratorArr[i] = novelInfoObj.illustrator;
    }
    const retObj = {
        saleMonthYear: saleMonthYear,
        fullNovelInfoObjArr: fullNovelInfoObjArr,
        authorArr: authorArr,
        illustratorArr: illustratorArr,
    };
    return retObj;
};
