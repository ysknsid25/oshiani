exports.lightningScraiping = async (db) => {
    //const { setAuthor, setIllustrator } = require("./common");
    //const date = new Date();
    //const key = date.getFullYear() + "" + (date.getMonth() + 1);
    const url = "https://dengekibunko.jp/product/newrelease-bunko.html";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    return externalRes;
};
