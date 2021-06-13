/**
 * 現在時刻を指定されたフォーマットの形で返します。
 * @param DateTimeFormat
 * @returns
 */
export const getTimeStamp = (DateTimeFormat = "YYYY/MM/DD hh:mi:ss") => {
    const d = new Date(); // Today
    return DateTimeFormat.replace(/YYYY/g, String(d.getFullYear()))
        .replace(/MM/g, ("0" + (d.getMonth() + 1)).slice(-2))
        .replace(/DD/g, ("0" + d.getDate()).slice(-2))
        .replace(/hh/g, ("0" + d.getHours()).slice(-2))
        .replace(/mi/g, ("0" + d.getMinutes()).slice(-2))
        .replace(/ss/g, ("0" + d.getSeconds()).slice(-2));
};

/**
 * 区分名と区分値を持つオブジェクトを格納した配列を与えて、
 * 区分名を取得します。
 * @param kbnValArr
 * @param compareVal
 * @param isWantName trueの場合は区分名から区分値を取得する
 * @returns
 */
export const getKbnInfo = (kbnValArr, compareVal, isWantVal = false) => {
    let retKey = "label";
    let compareKey = "value";
    if (isWantVal) {
        retKey = "value";
        compareKey = "label";
    }
    const foundKbnObj = kbnValArr.find(
        (kbnInfo) => kbnInfo[compareKey] === compareVal
    );
    return foundKbnObj[retKey];
};
