// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//exports.helloWorld = functions
//    .region("asia-northeast1")
//    .runWith({
//        timeoutSeconds: 300,
//        memory: "256MB",
//    })
//    .pubsub.schedule("*/1 0-3,6-23 * * *")
//    .timeZone("Asia/Tokyo")
//    .onRun(async () => {
//        const status = await getAandGProgarmList();
//        functions.logger.info(status, { structuredData: true });
//    });

const aAndg = require("./js/getagprogram/getagprogram");
exports.testFunc = aAndg.testFunc;
exports.gaScraiping = aAndg.gaScraiping;
exports.lightningScraiping = aAndg.lightningScraiping;
exports.gagagaScraiping = aAndg.gagagaScraiping;
exports.sneakerScraiping = aAndg.sneakerScraiping;
exports.fantasiaScraiping = aAndg.fantasiaScraiping;
exports.famitsuScraiping = aAndg.famitsuScraiping;
exports.dashxScraiping = aAndg.dashxScraiping;
exports.mfScraiping = aAndg.mfScraiping;
exports.getAandGProgramList = aAndg.getAandGProgramList;
exports.getAandGProgramListHttp = aAndg.getAandGProgramListHttp;
exports.notifyRegistedProgramHttp = aAndg.notifyRegistedProgramHttp;
exports.notifyRegistedProgramEveryDay = aAndg.notifyRegistedProgramEveryDay;
exports.notifyRegistedProgramEveryMonDay =
    aAndg.notifyRegistedProgramEveryMonDay;
