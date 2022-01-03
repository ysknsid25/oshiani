/**
 * 通知対象の設定情報を取得する
 * @param {firebase db} db
 * @param {string} frequency 頻度
 */
exports.getNotifyTarget = async (req, res, db, frequency, functions) => {
    const subject = getSubject(frequency);
    const programInfoArr = await getProgramInfoArr(db, functions, frequency);
    //functions.logger.info(programInfoArr, { structuredData: true });
    db.collection("UserNotifySetting")
        .where("doNotify", "==", true)
        .where("frequency", "==", frequency)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const notifyInfo = {
                    email: doc.data().targetEmail,
                    castList: doc.data().castList,
                };
                const msg = mekaMessage(programInfoArr, notifyInfo.castList);
                if (msg !== "") {
                    sendMail(
                        req,
                        res,
                        functions,
                        notifyInfo.email,
                        subject,
                        msg
                    );
                }
                //debug(notifyInfo, functions);
                //functions.logger.info(retArr, { structuredData: true });
                //console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            functions.logger.info(error, { structuredData: true });
        });
};

/**
 * メール送信の実態
 * @param {object} req
 * @param {object} res
 * @param {object} functions
 * @param {string} to
 * @param {string} subject
 * @param {string} msg
 * @returns string 処理結果
 */
const sendMail = (req, res, functions, to, subject, msg) => {
    const mailsender = require("./sendEmail");
    const mailInfo = {
        req: req,
        res: res,
        functions: functions,
        to: to,
        subject: subject,
        msg: msg,
    };
    const result = mailsender.sendEmail(mailInfo);
    return result;
};

/**
 * 頻度別にメールタイトルを返す
 * @param {string} frequency
 * @returns メールタイトル
 */
const getSubject = (frequency) => {
    if (isEveryday(frequency)) {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const nextDate = date.getDate();
        return (
            "A&G 明日(" + year + "/" + month + "/" + nextDate + ")の番組情報"
        );
    }
    return "A&G 今週の番組情報";
};

/**
 * 番組情報を取得する
 * @param {object} db
 * @param {object} functions
 * @param {string} frequency
 * @returns 番組情報
 */
const getProgramInfoArr = async (db, functions, frequency) => {
    let retArr = [];
    if (isEveryday(frequency)) {
        const nextDay = getNextDay();
        const nextDayProgram = await getProgramList(db, functions, nextDay);
        retArr = [nextDayProgram.agprogramList];
    } else {
        const mondayProgram = await getProgramList(db, functions, 0);
        const thuesdayProgram = await getProgramList(db, functions, 1);
        const wedenesdayProgram = await getProgramList(db, functions, 2);
        const thuresProgram = await getProgramList(db, functions, 3);
        const fridayProgram = await getProgramList(db, functions, 4);
        const saturdayProgram = await getProgramList(db, functions, 5);
        const sundayProgram = await getProgramList(db, functions, 6);
        retArr = [
            mondayProgram.agprogramList,
            thuesdayProgram.agprogramList,
            wedenesdayProgram.agprogramList,
            thuresProgram.agprogramList,
            fridayProgram.agprogramList,
            saturdayProgram.agprogramList,
            sundayProgram.agprogramList,
        ];
    }
    return retArr;
};

/**
 * 翌日を取得する
 * @returns 翌日
 */
const getNextDay = () => {
    const date = new Date();
    //0: 日曜日だけど、Firestoreには月曜日は0として保存されている
    const nextday = date.getDay();
    return nextday;
};

/**
 * その日の曜日を元にして放送情報を取得する
 *
 * @returns Array
 */
const getProgramList = async (db, functions, intdocumentId) => {
    let documentId = intdocumentId.toString();
    let programList = [];
    await db
        .collection("agprogramList")
        .doc(documentId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                programList = doc.data();
                if (typeof programList === "undefined") {
                    programList = [];
                }
            }
        })
        .catch((error) => {
            functions.logger.info(error, { structuredData: true });
        });
    return programList;
};

/**
 * 毎日かどうか
 * @param {string} frequency
 * @returns boolean
 */
const isEveryday = (frequency) => {
    return frequency === "everyday";
};

/**
 * 番組情報のメッセージを生成する
 * @param {array} programInfoArr 番組情報
 * @param {array} castList ユーザーが通知対象として登録したキャスト情報
 * @returns 番組情報
 */
const mekaMessage = (programInfoArr, castList) => {
    let message = "";
    const date = new Date();
    const targetDay = date.getDate();
    for (let day = 0; day < programInfoArr.length; day++) {
        const aDayProgramInfo = programInfoArr[day];
        date.setDate(targetDay + day);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const nextDate = date.getDate();
        if (aDayProgramInfo.length > 0 && castList.length > 0) {
            let tmpMessage =
                '<table border="1"><tr><th colspan="6" align="left">' +
                year +
                "/" +
                month +
                "/" +
                nextDate +
                "</th></tr><tr><th>Begin</th><th>End</th><th>isRepeat</th><th>Title</th><th>Personality</th><th></th></tr>";
            let isExitsData = false;
            aDayProgramInfo.map((programInfo) => {
                const result = castList.find((castStr) => {
                    //console.log(castStr);
                    if (typeof programInfo.personality === "undefined") {
                        return false;
                    }
                    return programInfo.personality.indexOf(castStr) > -1;
                });
                //console.log(result);
                if (typeof result !== "undefined") {
                    isExitsData = true;
                    const beginTime = getColonTime(programInfo.beginTime);
                    const endTime = getColonTime(programInfo.endTime);
                    const repeat = programInfo.isRepeat ? "再" : "";
                    const googleCalendarBegin =
                        year +
                        "" +
                        zeroUme(month) +
                        "" +
                        zeroUme(nextDate) +
                        "T" +
                        programInfo.beginTime +
                        "00Z";
                    const googleCalendarEnd =
                        year +
                        "" +
                        zeroUme(month) +
                        "" +
                        zeroUme(nextDate) +
                        "T" +
                        programInfo.endTime +
                        "00Z";
                    const googleCalendarUrl =
                        "https://www.google.com/calendar/render?action=TEMPLATE&text=" +
                        programInfo.title +
                        "&dates=" +
                        googleCalendarBegin +
                        "/" +
                        googleCalendarEnd +
                        "&ctz=Atlantic/Canary";
                    tmpMessage +=
                        "<tr><td>" +
                        beginTime +
                        "</td><td>" +
                        endTime +
                        "</td><td>" +
                        repeat +
                        "</td><td>" +
                        programInfo.title +
                        "</td><td>" +
                        programInfo.personality +
                        "</td><td><a href='" +
                        googleCalendarUrl +
                        "'>Googleカレンダーに追加する</a></td></tr>";
                }
            });
            tmpMessage += "</table><br>";
            //console.log(tmpMessage);
            if (isExitsData) {
                message += tmpMessage;
            }
        }
    }
    //console.log(message);
    return message;
};

/**
 * 0埋め処理を施す
 * @param {date} val
 * @returns 0埋め結果
 */
const zeroUme = (val) => {
    if (val < 10) {
        return "0" + val;
    }
    return val;
};

/**
 * 時間を:付きに変換する
 * @param {string} time
 * @returns
 */
const getColonTime = (time) => {
    let colonTime = "";
    if (time !== "" && time.length === 4) {
        colonTime = time.slice(0, 2) + ":" + time.slice(2);
    }
    return colonTime;
};

/*
const debug = (value, functions) => {
    functions.logger.info(value, { structuredData: true });
};
*/
