const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

/*
exports.gaScraiping = functions
    .region("asia-northeast1")
    .runWith({
        timeoutSeconds: 300,
        memory: "2GB",
    })
    .https.onRequest(async (req, res) => {
        const scrai = require("./ga");
        const retArr = await scrai.gaScraiping(db);
        //functions.logger.info(retArr, { structuredData: true });
        res.send("fine");
    });
*/

exports.gaScraiping = functions
    .region("asia-northeast1")
    .runWith({
        timeoutSeconds: 300,
        memory: "1GB",
    })
    .pubsub.schedule("0 0 16 * *")
    .timeZone("Asia/Tokyo")
    .onRun(async () => {
        const scrai = require("./ga");
        const retArr = await scrai.gaScraiping(db);
    });

exports.testFunc = functions
    .region("asia-northeast1")
    .https.onRequest(async (req, res) => {
        const scrai = require("./lightning");
        const retArr = await scrai.lightningScraiping(db);
        console.log(retArr);
        //functions.logger.info(retArr, { structuredData: true });
        res.send("fine");
    });

/**
 * A&Gのホームページをスクレイピングし、番組情報を取得する
 */
exports.getAandGProgramList = functions
    .region("asia-northeast1")
    .runWith({
        timeoutSeconds: 30,
        memory: "128MB",
    })
    .pubsub.schedule("0 4 * * 1")
    .timeZone("Asia/Tokyo")
    .onRun(async () => {
        const programArr = await sendRequest();
        getProgramList(programArr);
        setFireStore(programArr);
        //functions.logger.info(programArr.length, { structuredData: true });
    });

/**
 * getAandGProgramListのテスト用関数
 */
exports.getAandGProgramListHttp = functions
    .region("asia-northeast1")
    .https.onRequest(async (req, res) => {
        const programArr = await sendRequest();
        getProgramList(programArr);
        setFireStore(programArr);
        getProgramList(programArr);
        //functions.logger.info(programArr.length, { structuredData: true });
        res.send(programArr);
    });

/**
 * 通知用テスト関数
 */
exports.notifyRegistedProgramHttp = functions
    .region("asia-northeast1")
    .https.onRequest(async (req, res) => {
        const notifier = require("./notifier");
        notifier.getNotifyTarget(req, res, db, "everymonday", functions);
        res.send("fine");
    });

/**
 * A&G番組情報を毎日通知する
 */
exports.notifyRegistedProgramEveryDay = functions
    .region("asia-northeast1")
    .runWith({
        timeoutSeconds: 30,
        memory: "128MB",
    })
    .pubsub.schedule("0 18 * * *")
    .timeZone("Asia/Tokyo")
    .onRun(async (req, res) => {
        const notifier = require("./notifier");
        notifier.getNotifyTarget(req, res, db, "everyday", functions);
    });

/**
 * A&G番組情報を毎週月曜日に通知する
 */
exports.notifyRegistedProgramEveryMonDay = functions
    .region("asia-northeast1")
    .runWith({
        timeoutSeconds: 30,
        memory: "128MB",
    })
    .pubsub.schedule("30 5 * * 1")
    .timeZone("Asia/Tokyo")
    .onRun(async (req, res) => {
        const notifier = require("./notifier");
        notifier.getNotifyTarget(req, res, db, "everymonday", functions);
    });

const sendRequest = async () => {
    const url = "https://www.joqr.co.jp/qr/agregularprogram/";
    const fetch = require("node-fetch");
    const externalRes = await fetch(url)
        .then((res) => res.text())
        .then((body) => body);
    const htmlText = externalRes.split("<tbody>");
    const removedNhtmlText = htmlText[1].split("\n");
    const programArr = squeezeTargetRecord(removedNhtmlText);
    const distributedArr = distributeProgramData(programArr);
    return distributedArr;
};

const setFireStore = (programArr) => {
    for (let i = 0; i < programArr.length; i++) {
        const documentId = i.toString();
        db.collection("agprogramList")
            .doc(documentId)
            .delete();
        db.collection("agprogramList")
            .doc(documentId)
            .set({ agprogramList: programArr[i] });
    }
};

const getProgramList = (programArr) => {
    let titleArr = [];
    let personalityArr = [];
    programArr.map((todaysProgramArr) => {
        todaysProgramArr.map((programInfo) => {
            const personality = programInfo.personality;
            const isUndefinedPersonality = typeof personality == "undefined";
            console.log(personality);
            if (!isUndefinedPersonality) {
                if (personality.indexOf(",") > -1) {
                    const personalities = personality.split(",");
                    personalities.map((ps) => {
                        personalityArr.push(ps);
                    });
                } else {
                    personalityArr.push(personality);
                }
            }
            titleArr.push(programInfo.title);
        });
    });
    const titleSetArr = [...new Set(titleArr)];
    const personalitySetArr = [...new Set(personalityArr)];
    db.collection("agCastList")
        .doc("personality")
        .delete();
    db.collection("agCastList")
        .doc("personality")
        .set({ personalityList: personalitySetArr });

    db.collection("agCastList")
        .doc("title")
        .delete();
    db.collection("agCastList")
        .doc("title")
        .set({ titleList: titleSetArr });
};

//データ取得のための目印
const keywords = {
    tableTagBegin: "<tbody",
    tableTagEnd: "</tbody>",
    tdTagBegin: "<td",
    tdTagEnd: "</td>",
    tagBegin: "<",
    tagEnd: ">",
    classBegin: 'class="',
    classEnd: '"',
    repeat: "is-repeat",
    first: "bg-f",
    realtime: "bg-l",
    rowspanBegin: 'rowspan="',
    rowspanEnd: '"',
    colspanBegin: 'colspan="',
    colspanEnd: '"',
    titleHref: "<a href=",
    personality: 'class="personality"',
};

/**
 * 番組情報が入っている箇所を特定して、番組情報のみを格納した配列にして返す
 * TIPS: なるほど。こういう順次系の処理は関数型より命令型のほうが向いてる
 * @param textArr
 */
const squeezeTargetRecord = (textArr) => {
    let duringTd = false;
    let programArr = [];
    let nowBetweenTdLine = 0;
    let isNextPersonality = false;

    let programObj = new Object();

    const WHAT_LINE_HAS = {
        DUR_AND_BROADCAST_TYPE: 1,
        BEGIN_TIME: 3,
        TITLE: 5,
    };

    for (let i = 0; i < textArr.length; i++) {
        const line = textArr[i].trim();

        //tbodyの最後が来たら、抜ける
        if (findKeyWord(keywords.tableTagEnd, line)) {
            break;
        }
        //TDタグの始まりを検知
        if (findKeyWord(keywords.tdTagBegin, line)) {
            duringTd = true;
        }
        //TDの間に来たら、順番に値を取得していく
        if (duringTd) {
            ++nowBetweenTdLine;
            if (WHAT_LINE_HAS.DUR_AND_BROADCAST_TYPE === nowBetweenTdLine) {
                const typeStr = getInnerHTML(
                    line,
                    keywords.classBegin,
                    keywords.classBegin.length,
                    keywords.classEnd
                );
                programObj.dur = getDurTime(line);
                programObj.howManyBroadCast = getHowManyBroadCast(line);
                programObj.isRepeat = isRepeat(typeStr);
                programObj.isRealTime = "";
                programObj.isFirst = "";
            } else if (WHAT_LINE_HAS.BEGIN_TIME === nowBetweenTdLine) {
                const begintime = getBeginTime(line);
                const begintimeArr = begintime.split(":");
                const beginTimeHour = begintimeArr[0];
                const beginTimeMinute = begintimeArr[1];
                programObj.beginHour = Number(beginTimeHour);
                programObj.beginMinute = Number(beginTimeMinute);
                programObj.beginTime =
                    zeroComplete(programObj.beginHour) +
                    "" +
                    zeroComplete(programObj.beginMinute);
                programObj.endTime = getEndTime(
                    programObj.beginHour,
                    programObj.beginMinute,
                    programObj.dur
                );
                programObj.endHour = Number(programObj.endTime.substring(0, 2));
                programObj.endMinute = Number(
                    programObj.endTime.substring(2, 4)
                );
            } else if (WHAT_LINE_HAS.TITLE === nowBetweenTdLine) {
                programObj.title = getTitle(line);
            } else if (isNextPersonality) {
                if (typeof programObj.personality !== "undefined") {
                    programObj.personality =
                        programObj.personality + "," + getPersonality(line);
                } else {
                    programObj.personality = getPersonality(line);
                }
            }
            isNextPersonality = line.indexOf(keywords.personality) > 0;
        }
        //TDタグの終わりに来たら、オブジェクトを配列にプッシュして、初期化
        //TDの間フラグをOFFにして、カウンターをクリアする
        if (findKeyWord(keywords.tdTagEnd, line)) {
            for (let i = 1; i <= programObj.howManyBroadCast; i++) {
                programArr.push(programObj);
            }
            programObj = new Object();
            duringTd = false;
            nowBetweenTdLine = 0;
        }
    }

    return programArr;
};

//キーワードが含まれるか検索
const findKeyWord = (keyword, line) => line.indexOf(keyword) > -1;

//HTMLの中身を取得
const getInnerHTML = (line, beginSign, keywordLength, endSign) => {
    const beginPos = line.indexOf(beginSign) + keywordLength;
    let substrLine = line.substring(beginPos);
    const endPos = substrLine.indexOf(endSign);
    return substrLine.substring(0, endPos);
};

//放送時間を取得する
const getDurTime = (line) => {
    return getInnerHTML(
        line,
        keywords.rowspanBegin,
        keywords.rowspanBegin.length,
        keywords.rowspanEnd
    );
};

//放送日分の番組情報を取得する
const getHowManyBroadCast = (line) => {
    if (line.indexOf(keywords.colspanBegin) > 0) {
        const howManyBroadCast = getInnerHTML(
            line,
            keywords.colspanBegin,
            keywords.colspanBegin.length,
            keywords.colspanEnd
        );
        return Number(howManyBroadCast);
    } else {
        return 1;
    }
};

//再放送か
const isRepeat = (broadCastType) => broadCastType.indexOf(keywords.repeat) > 0;

//0埋めする
const zeroComplete = (num) => {
    if (0 <= num && num < 10) {
        return "0" + num;
    }

    return num;
};

//開始時刻を取得する
const getBeginTime = (line) => {
    const replacedBeginDiv = line.replace(
        '<div class="weeklyProgram-time">',
        ""
    );
    const replacedEndDiv = replacedBeginDiv.replace("</div>", "");
    return replacedEndDiv;
};

//終了時刻を取得する
const getEndTime = (beginHour, beginMinute, dur) => {
    let endHour = Number(beginHour);
    let endMinute = Number(beginMinute);
    const numDur = Number(dur);

    if (numDur < 60) {
        endMinute = endMinute + numDur;
    } else if (numDur === 60) {
        endHour = endHour + 1;
    } else if (numDur > 60) {
        endHour = endHour + Math.floor(dur / 60); //放送時間(h)
        endMinute = endMinute + (dur % 60); //放送時間(m)
    }

    if (endMinute === 60) {
        endHour = endHour + 1;
        endMinute = 0;
    }

    return zeroComplete(endHour) + "" + zeroComplete(endMinute);
};

//タイトルを取得する
const getTitle = (line) => {
    if (findKeyWord(keywords.titleHref, line)) {
        return getInnerHTML(
            line,
            keywords.tagEnd,
            keywords.tagEnd.length,
            keywords.tagBegin
        );
    }
    return line.trim();
};

//パーソナリティを取得する
const getPersonality = (line) => {
    const replacedStr = line.replace("</a>", "");
    const beginPos = replacedStr.indexOf(">");
    const substrLine = replacedStr.substring(beginPos + 1, replacedStr.length);
    return substrLine;
};

//各曜日に対応する番組データを振り分ける
const distributeProgramData = (allProgramsArr) => {
    let firstDayProgramArr = [allProgramsArr[0]];
    let secondDayProgramArr = [allProgramsArr[1]];
    let thirdDayProgramArr = [allProgramsArr[2]];
    let fourthDayProgramArr = [allProgramsArr[3]];
    let fifthDayProgramArr = [allProgramsArr[4]];
    let sixthDayProgramArr = [allProgramsArr[5]];
    let seventhDayProgramArr = [allProgramsArr[6]];
    let programEveryDay = [];

    for (let i = 7; i < allProgramsArr.length; i++) {
        const programData = allProgramsArr[i].beginTime;
        const firstDayEndTime =
            firstDayProgramArr[firstDayProgramArr.length - 1].endTime;
        const secondDayEndTime =
            secondDayProgramArr[secondDayProgramArr.length - 1].endTime;
        const thirdDayEndTime =
            thirdDayProgramArr[thirdDayProgramArr.length - 1].endTime;
        const fourthDayEndTime =
            fourthDayProgramArr[fourthDayProgramArr.length - 1].endTime;
        const fifthDayEndTime =
            fifthDayProgramArr[fifthDayProgramArr.length - 1].endTime;
        const sixthDayEndTime =
            sixthDayProgramArr[sixthDayProgramArr.length - 1].endTime;
        const seventhDayEndTime =
            seventhDayProgramArr[seventhDayProgramArr.length - 1].endTime;

        if (programData == firstDayEndTime) {
            firstDayProgramArr.push(allProgramsArr[i]);
        } else if (programData == secondDayEndTime) {
            secondDayProgramArr.push(allProgramsArr[i]);
        } else if (programData == thirdDayEndTime) {
            thirdDayProgramArr.push(allProgramsArr[i]);
        } else if (programData == fourthDayEndTime) {
            fourthDayProgramArr.push(allProgramsArr[i]);
        } else if (programData == fifthDayEndTime) {
            fifthDayProgramArr.push(allProgramsArr[i]);
        } else if (programData == sixthDayEndTime) {
            sixthDayProgramArr.push(allProgramsArr[i]);
        } else if (programData == seventhDayEndTime) {
            seventhDayProgramArr.push(allProgramsArr[i]);
        }
    }

    programEveryDay.push(firstDayProgramArr);
    programEveryDay.push(secondDayProgramArr);
    programEveryDay.push(thirdDayProgramArr);
    programEveryDay.push(fourthDayProgramArr);
    programEveryDay.push(fifthDayProgramArr);
    programEveryDay.push(sixthDayProgramArr);
    programEveryDay.push(seventhDayProgramArr);

    return programEveryDay;
};
