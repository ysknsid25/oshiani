const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

exports.test = async (functions) => {
    const res = await fetch("https://www.jma.go.jp/jp/week/319.html");
    const html = await res.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const nodes = document.querySelectorAll(
        "#infotablefont tr:nth-child(4) td"
    );
    const tokyoWeathers = Array.from(nodes, (td) => td.textContent.trim());
    functions.logger.info(tokyoWeathers, { structuredData: true });
};
