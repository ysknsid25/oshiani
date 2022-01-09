const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

exports.test = async (functions) => {
    const res = await fetch("https://ga.sbcr.jp/release/month_current/");
    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const novelInfoAllArr = getGANovelInfo(document);
    //console.log(novelInfoArr.length);
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
    const novelInfoObjArr = getGANovelInfoObj(novelInfoArr);
    //const gaImgUrlArr = getGAImageUrlArr(document);
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
        const saleDate = 0;
        const title = 1;
        const authorIllustrator = 2;
        const ISBN = 3;
        const price = 4;
        const outLineBegin = 7;
        const outLineEnd = novelInfoArr.length;
        let outLine = "";
        for (let i = outLineBegin; i < outLineEnd; i++) {
            outLine += novelInfoArr[i];
        }
        console.log(novelInfoArr[authorIllustrator]);
        const replacedAuthorIllustrator = novelInfoArr[authorIllustrator]
            .replace(" ", "")
            .replace("　", "");
        const authorIllustratorObj = getGAAuthorIllustrator(
            replacedAuthorIllustrator
        );
        const novelInfo = {
            saleDate: novelInfoArr[saleDate].replace("発売日：", ""),
            title: novelInfoArr[title],
            author: authorIllustratorObj.author,
            illustrator: authorIllustratorObj.illustrator,
            ISBN: novelInfoArr[ISBN].replace("ISBN：", ""),
            price: novelInfoArr[price],
            outLine: outLine,
        };
        return novelInfo;
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
        const lastIndex = replacedAuthorIllustrator.length();
        author = replacedAuthorIllustrator.substring(2, illustratorIndex);
        illustrator = replacedAuthorIllustrator.substring(
            illustratorIndex + 2,
            lastIndex
        );
    }
    return { author: author, illustrator: illustrator };
};
