const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

exports.test = async (functions) => {
    const res = await fetch("https://ga.sbcr.jp/release/month_current/");
    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const nodes = document.querySelectorAll(".newBook_item_inner");
    const htmlTree = Array.from(nodes, (html) => html.textContent.trim());
    //const tokyoWeathers = Array.from(nodes, (td) => td.textContent.trim());
    const testMeg = htmlTree.map((html) =>
        html
            .split("\n")
            .map((text) => text.replace("\n", ""))
            .filter((replacedText) => replacedText !== "")
    );
    const distinctMsg = [...new Set(testMeg[0])];
    distinctMsg.map((text) =>
        functions.logger.info(text, { structuredData: true })
    );

    const imageHtmls = document.querySelectorAll(".image_wrap > .image > img");
    const imgUrls = Array.from(imageHtmls, (html) =>
        html.getAttribute("data-src")
    );
    const removeLFImgUrls = imgUrls.map((img) =>
        functions.logger.info(img, { structuredData: true })
    );
};
