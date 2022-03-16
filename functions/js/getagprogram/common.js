/**
 * 作者情報をセットする
 * @param object db
 * @param array authorArr
 */
exports.setAuthor = (db, authorArr) => {
    authorArr.map((author) => {
        db.collection("author")
            .doc(author)
            .set({ author: author });
    });
};

/**
 * イラストレーター情報をセットする
 * @param {object} db
 * @param {array} illustratorArr
 */
exports.setIllustrator = (db, illustratorArr) => {
    illustratorArr.map((illustrator) => {
        db.collection("illustrator")
            .doc(illustrator)
            .set({ illustrator: illustrator });
    });
};

/**
 * キーワードがその行に含まれているかを判定
 * @param {string} lineText
 * @param {string} keyword
 * @returns boolean
 */
exports.isContainKeyWord = (lineText, keyword) => {
    return lineText.indexOf(keyword) > -1;
};

/**
 * 一行の中からキーワードを抽出した結果を返す
 * @param {string} lineText
 * @param {string} beginKeyword
 * @param {string} endKeyword
 * @returns string
 */
exports.getTargetText = (lineText, beginKeyword, endKeyword) => {
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
