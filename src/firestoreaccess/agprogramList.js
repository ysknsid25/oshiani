import { db, anl } from "../plugins/firebase";
export const COLLECTION_AGPROGRAMLIST = db.collection("agprogramList");

/**
 * その日の曜日を元にして放送情報を取得する
 *
 * @returns Array
 */
export const getProgramList = async () => {
    const date = new Date();
    const today = date.getDay();
    const hour = date.getHours();
    let documentId = today - 1;
    //FireStoreには月曜日始まりで保存されているから
    if (documentId === -1) {
        documentId = 6;
    }
    //A&Gの放送は毎朝6時に開始するので、0時~5時の間は、前日の番組表を参照させないといけないから
    if (hour < 6) {
        documentId -= 1;
    }
    documentId = documentId.toString();
    let programList = [];
    await COLLECTION_AGPROGRAMLIST.doc(documentId)
        .get()
        .then((doc) => {
            anl.logEvent("getProgramList", {
                function: "getProgramList",
            });
            if (doc.exists) {
                programList = doc.data();
                if (typeof programList === "undefined") {
                    programList = [];
                }
            }
        })
        .catch((error) => {
            anl.logEvent("errorInfo", {
                function: "getProgramList",
                msg: error,
            });
            console.log(error);
        });
    return programList;
};
