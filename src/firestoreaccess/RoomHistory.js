import { db, anl, auth } from "../plugins/firebase";
export const COLLECTION_ROOM_HISTORY = db.collection("RoomHistory");

/**
 * 対局室を登録します。
 * @param {Object} roomInfo
 * @param {Array} horaInfoArr
 * @param {boolean} isNewRoom
 * @return string docId FireStoreへの操作が失敗した場合は空文字
 */
export const createRoomHistory = async (roomInfo) => {
    const uid = await getLoginUid();
    const writeVal = {
        uid: uid,
        ymd: roomInfo.ymd,
        no: roomInfo.battleNo,
        firstName: roomInfo.firstName,
        firstScore: parseInt(roomInfo.firstScore),
        secondName: roomInfo.secondName,
        secondScore: parseInt(roomInfo.secondScore),
        thirdName: roomInfo.thirdName,
        thirdScore: parseInt(roomInfo.thirdScore),
        fourthName: roomInfo.fourthName,
        fourthScore: parseInt(roomInfo.fourthScore),
    };
    const docId = COLLECTION_ROOM_HISTORY.doc().id;
    const eventName = "RoomHistory Created";
    let isSuccess = await setRoomInfo(docId, writeVal, eventName);
    if (!isSuccess) {
        return "";
    }
    return docId;
};

/**
 * 最終対局番号を返します
 * @param {number} scoresLength
 * @param {string} uid
 * @returns
 */
export const getMaxBattleNo = async (scoresLength) => {
    if (scoresLength === 0) {
        return 1;
    }
    const uid = await getLoginUid();
    let maxNo = 0;
    await COLLECTION_ROOM_HISTORY.where("uid", "==", uid)
        .orderBy("no", "desc")
        .limit(1)
        .get()
        .then((roomHistorySnapShot) => {
            roomHistorySnapShot.forEach((doc) => {
                const data = doc.data();
                maxNo = data.no + 1;
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getRoomHistoryArr",
                msg: error,
            });
        });
    return maxNo;
};

/**
 * 対局履歴を更新する
 * @param {string} docId
 * @param {Object} scoreInfo
 */
export const updateRoomHistory = async (docId, scoreInfo) => {
    const uid = await getLoginUid();
    const writeVal = {
        uid: uid,
        firstName: scoreInfo.first.name,
        firstScore: parseInt(scoreInfo.first.score),
        secondName: scoreInfo.second.name,
        secondScore: parseInt(scoreInfo.second.score),
        thirdName: scoreInfo.third.name,
        thirdScore: parseInt(scoreInfo.third.score),
        fourthName: scoreInfo.fourth.name,
        fourthScore: parseInt(scoreInfo.fourth.score),
    };
    await COLLECTION_ROOM_HISTORY.doc(docId)
        .update(writeVal)
        .then(() => {
            anl.logEvent("update Room History", {
                function: "updateRoomHistory",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "updateRoomHistory",
                msg: error,
            });
        });
};

/**
 * 対局情報を登録・更新する
 * @param {Objcet} roomInfo
 * @returns boolean isSuccess
 */
const setRoomInfo = async (docId, roomInfo, action) => {
    let isSuccess = false;
    await COLLECTION_ROOM_HISTORY.doc(docId)
        .set(roomInfo)
        .then(() => {
            isSuccess = true;
            anl.logEvent(action, {
                function: "setRoomInfo",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "setRoomInfo",
                msg: error,
            });
        });
    return isSuccess;
};

/**
 * 対局情報を削除する
 * @param {String} docId
 */
export const deleteRoomHistory = (docId) => {
    COLLECTION_ROOM_HISTORY.doc(docId).delete();
};

/**
 * 和了履歴を取得します
 * @param {string} docId
 */
export const getHoraHistory = async (docId) => {
    let retArr = [];
    const SUB_COLLECTION_HORA_HISTORY = COLLECTION_ROOM_HISTORY.doc(
        docId
    ).collection("horaHistory");
    await SUB_COLLECTION_HORA_HISTORY.orderBy("no", "desc")
        .get()
        .then((horaHistorySnapShot) => {
            horaHistorySnapShot.forEach((doc) => {
                const data = doc.data();
                const tmpObj = {
                    docId: doc.id,
                    no: data.no,
                    from: data.from,
                    to: data.to,
                    time: data.time,
                    yaku: data.yaku,
                    score: data.score,
                };
                retArr.push(tmpObj);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getHoraHistory",
                msg: error,
            });
        });
    return retArr;
};

/**
 * 和了履歴を削除する
 * @param {string} docId
 */
export const deleteHoraInfo = (docId, subDocId) => {
    const SUB_COLLECTION_HORA_HISTORY = COLLECTION_ROOM_HISTORY.doc(
        docId
    ).collection("horaHistory");
    SUB_COLLECTION_HORA_HISTORY.doc(subDocId).delete();
};

/**
 * 和了情報を登録する
 * @param {Array} horaInfo
 * @returns string subDocId
 */
export const setHoraInfo = async (docId, horaInfo) => {
    const maxHoraNo = await getMaxHoraHistoryNo(docId);
    horaInfo.no = maxHoraNo;
    const SUB_COLLECTION_HORA_HISTORY = COLLECTION_ROOM_HISTORY.doc(
        docId
    ).collection("horaHistory");
    let subDocId = SUB_COLLECTION_HORA_HISTORY.doc().id;
    await SUB_COLLECTION_HORA_HISTORY.doc(subDocId)
        .set(horaInfo)
        .then(() => {
            anl.logEvent("create hora history", {
                function: "setHoraInfo",
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "setHoraInfo",
                msg: error,
            });
            subDocId = "";
        });
    return subDocId;
};

/**
 * 最新の和了履歴番号を取得する
 * @param {string} docId
 * @returns
 */
export const getMaxHoraHistoryNo = async (docId) => {
    let retArr = [];
    const SUB_COLLECTION_HORA_HISTORY = COLLECTION_ROOM_HISTORY.doc(
        docId
    ).collection("horaHistory");
    await SUB_COLLECTION_HORA_HISTORY.orderBy("no", "desc")
        .limit(1)
        .get()
        .then((horaHistorySnapShot) => {
            horaHistorySnapShot.forEach((doc) => {
                const data = doc.data();
                retArr.push(data.no);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getMaxHoraHistoryNo",
                msg: error,
            });
        });
    if (retArr.length === 1) {
        return retArr[0] + 1;
    }
    return 1;
};

/**
 * ユーザーの対局履歴を取得します
 * @param {String} userId
 * @returns
 */
export const getRoomHistoryArr = async (limit) => {
    const uid = await getLoginUid();
    let retArr = [];
    await COLLECTION_ROOM_HISTORY.where("uid", "==", uid)
        .orderBy("no", "desc")
        .limit(limit)
        .get()
        .then((roomHistorySnapShot) => {
            roomHistorySnapShot.forEach((doc) => {
                const data = doc.data();
                const tmpObj = {
                    docId: doc.id,
                    uid: uid,
                    ymd: data.ymd,
                    battleNo: data.no,
                    firstName: data.firstName,
                    firstScore: data.firstScore,
                    secondName: data.secondName,
                    secondScore: data.secondScore,
                    thirdName: data.thirdName,
                    thirdScore: data.thirdScore,
                    fourthName: data.fourthName,
                    fourthScore: data.fourthScore,
                };
                retArr.push(tmpObj);
            });
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getRoomHistoryArr",
                msg: error,
            });
        });
    return retArr;
};

/**
 * 順位を取得する
 * @param {number} limit
 * @returns docId: 直近10局分のdocId
 */
export const getRecentlyRank = async (limit) => {
    const roomHistory = await getRoomHistoryArr(limit);
    let docIdArr = [];
    const rankArr = roomHistory.reverse().map((roomInfo) => {
        const userScore = roomInfo.firstScore;
        const originalArr = [
            roomInfo.firstScore,
            roomInfo.secondScore,
            roomInfo.thirdScore,
            roomInfo.fourthScore,
        ];
        const rankSortedArr = originalArr.sort((n, m) => (n < m ? 1 : -1));
        docIdArr.push(roomInfo.docId);
        //console.log(rankSortedArr.indexOf(userScore));
        return rankSortedArr.indexOf(userScore) + 1;
    });
    const retObj = {
        docIdArr: docIdArr,
        rankArr: rankArr,
    };
    return retObj;
};

/**
 * 直近10局の成績を返します。
 * @param {Array} dosIdInfoArr 和了履歴を取得するためのドキュメントID配列
 */
export const getData = async (dosIdInfoArr) => {
    let kyokuCount = 0;
    let horaCount = 0;
    let hojyCount = 0;
    let reachCount = 0;
    //TODO: luckeyCountはスタイルを算出するようになったら必要になる
    //let luckeyCount = 0;
    let daten = 0;

    let avgDaten = 0;
    let hojuRitu = 0;
    let reachRitu = 0;
    let horaRitu = 0;

    const mark = "You";
    const REACH = "リーチ";
    const RYUOYOKU = "流局";
    const kirisuteDegit = 1000;

    for (let i = 0; i < dosIdInfoArr.length; i++) {
        const horaInfo = await getHoraHistory(dosIdInfoArr[i]);
        if (horaInfo.length > 0) {
            for (let n = 0; n < horaInfo.length; n++) {
                const info = horaInfo[n];
                kyokuCount++;
                //ノーテン罰符は放銃・和了のカウント外
                if (info.from !== RYUOYOKU) {
                    //放銃
                    if (info.from === mark) {
                        hojyCount++;
                    }
                    //和了
                    if (info.to === mark) {
                        horaCount++;
                        daten += isNaN(info.score) ? 0 : parseInt(info.score);
                        if (info.yaku.indexOf(REACH) > -1) {
                            reachCount++;
                        }
                    }
                }
                //luckeyCount += getContainKensyoPoint(info.yaku);
            }
        }
    }
    if (daten !== 0 && horaCount !== 0) {
        avgDaten = orgFloor(daten / horaCount, 1, 1);
    }
    if (hojyCount !== 0 && kyokuCount !== 0) {
        hojuRitu = orgFloor(hojyCount / kyokuCount, kirisuteDegit);
    }
    if (reachCount !== 0 && kyokuCount !== 0) {
        reachRitu = orgFloor(reachCount / kyokuCount, kirisuteDegit);
    }
    if (horaCount !== 0 && kyokuCount !== 0) {
        horaRitu = orgFloor(horaCount / kyokuCount, kirisuteDegit);
    }
    const recentScore = [
        { key: 0, val: avgDaten },
        { key: 1, val: horaRitu + "%" },
        { key: 2, val: hojuRitu + "%" },
        { key: 3, val: reachRitu + "%" },
    ];
    return recentScore;
};

/**
 * 任意の桁で切り捨てする関数
 * @param {number} value 切り捨てする数値
 * @param {number} base どの桁で切り捨てするか
 * @return {number} 切り捨てした値
 */
const orgFloor = (value, base, percent = 100) =>
    Math.floor(value * base * percent) / base;

//TODO: スタイルを算出するようになったら必要になる
/**
 * 上がり役に含まれる懸賞役の数を計算して返す。
 * @param {string} yakuInfo
 * @returns
 */
/*
const getContainKensyoPoint = (yakuInfo) => {
    let kensyoPoint = 0;
    const IPPATU = "一発";
    const RINSYAN = "嶺上";
    const HAITEI = "河底";
    const DABUREA = "ダブルリーチ";
    const TYANKAN = "槍槓";
    const DORA = "ドラ";

    if (yakuInfo === "") {
        return kensyoPoint;
    }

    if (yakuInfo.indexOf(IPPATU) > -1) {
        kensyoPoint++;
    }
    if (yakuInfo.indexOf(RINSYAN) > -1) {
        kensyoPoint++;
    }
    if (yakuInfo.indexOf(HAITEI) > -1) {
        kensyoPoint++;
    }
    if (yakuInfo.indexOf(DABUREA) > -1) {
        kensyoPoint++;
    }
    if (yakuInfo.indexOf(TYANKAN) > -1) {
        kensyoPoint++;
    }
    if (yakuInfo.indexOf(DORA) > -1) {
        kensyoPoint++;
    }
    return kensyoPoint;
};
*/

/**
 * ログイン中のユーザーIDを取得する
 * @returns uid
 */
const getLoginUid = async () => {
    let uid = "";
    await auth.onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
        }
    });
    return uid;
};
