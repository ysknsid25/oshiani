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
