const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

exports.test = async (functions) => {
    const res = await fetch("https://ga.sbcr.jp/release/month_current/");
    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const nodes = document.querySelectorAll(".newBook_item_Wrap");
    const htmlTree = Array.from(nodes, (html) => html.textContent.trim());
    //const tokyoWeathers = Array.from(nodes, (td) => td.textContent.trim());
    functions.logger.info(htmlTree, { structuredData: true });
};
