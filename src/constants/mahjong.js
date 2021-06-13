export const DEF_MOTITEN = [25000, 30000];

export const OYA = "0";
export const KO = "1";
export const OYAKO_VALUES = [
    { label: "親", value: OYA },
    { label: "子", value: KO },
];

export const TUMO = "0";
export const RON = "1";
export const AGARI_VALUES = [
    { label: "ツモ", value: TUMO },
    { label: "ロン・包", value: RON },
];

export const HU_VALUES = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

export const HAN_VALUES = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "満貫", value: "5" },
    { label: "跳満", value: "6" },
    { label: "倍満", value: "7" },
    { label: "三倍満", value: "8" },
    { label: "役満", value: "9" },
];

export const HONBA_VALUES = ["", "1", "2", "3", "4", "5", "6", "7", "8"];

export const TON_BA = 0;
export const NAN_BA = 1;
export const SYA_BA = 2;
export const PE_BA = 3;
export const BA_VALUES = ["東", "南", "西", "北"];

export const KYOKU_VALUES = ["1", "2", "3", "4"];

const BA_RYOU = 300;
const MANGAN_MIMAN = "5";

const KONOMANGAN_RON = "8000";
const KONOMANGAN_TUMO = "2000,4000";
const OYANOMANGAN_RON = "12000";
const OYANOMANGAN_TUMO = "4000";

const KONOTOKUTEN_MAP = new Map([
    ["2020", "400,700"],
    ["2030", "700,1300"],
    ["2040", "1300,2600"],
    ["2521", "1600"],
    ["2531", "3200"],
    ["2541", "6400"],
    ["2530", "800,1600"],
    ["2540", "1600,3200"],
    ["3011", "1000"],
    ["3021", "2000"],
    ["3031", "3900"],
    ["3041", "7700"],
    ["3010", "300,500"],
    ["3020", "500,1000"],
    ["3030", "1000,2000"],
    ["3040", "2000,3900"],
    ["4011", "1300"],
    ["4021", "2600"],
    ["4031", "5200"],
    ["4041", KONOMANGAN_RON],
    ["4010", "400,700"],
    ["4020", "700,1300"],
    ["4030", "1300,2600"],
    ["4040", KONOMANGAN_TUMO],
    ["5011", "1600"],
    ["5021", "3200"],
    ["5031", "6400"],
    ["5041", KONOMANGAN_RON],
    ["5010", "400,800"],
    ["5020", "800,1600"],
    ["5030", "1600,3200"],
    ["5040", KONOMANGAN_TUMO],
    ["6011", "2000"],
    ["6021", "3900"],
    ["6031", "7700"],
    ["6041", KONOMANGAN_RON],
    ["6010", "500,1000"],
    ["6020", "1000,2000"],
    ["6030", "2000,3900"],
    ["6040", KONOMANGAN_TUMO],
    ["7011", "2300"],
    ["7021", "4500"],
    ["7031", KONOMANGAN_RON],
    ["7041", KONOMANGAN_RON],
    ["7010", "600,1200"],
    ["7020", "1200,2300"],
    ["7030", KONOMANGAN_TUMO],
    ["7040", KONOMANGAN_TUMO],
    ["8011", "2600"],
    ["8021", "5200"],
    ["8031", KONOMANGAN_RON],
    ["8041", KONOMANGAN_RON],
    ["8010", "700,1300"],
    ["8020", "1300,2600"],
    ["8030", KONOMANGAN_TUMO],
    ["8040", KONOMANGAN_TUMO],
    ["9011", "2900"],
    ["9021", "5800"],
    ["9031", KONOMANGAN_RON],
    ["9041", KONOMANGAN_RON],
    ["9010", "800,1500"],
    ["9020", "1500,2900"],
    ["9030", KONOMANGAN_TUMO],
    ["9040", KONOMANGAN_TUMO],
    ["10011", "3200"],
    ["10021", "6400"],
    ["10031", KONOMANGAN_RON],
    ["10041", KONOMANGAN_RON],
    ["10010", "800,1600"],
    ["10020", "1600,3200"],
    ["10030", KONOMANGAN_TUMO],
    ["10040", KONOMANGAN_TUMO],
    ["11011", "3600"],
    ["11021", "7100"],
    ["11031", KONOMANGAN_RON],
    ["11041", KONOMANGAN_RON],
    ["11010", "900,1800"],
    ["11020", "1800,3600"],
    ["11030", KONOMANGAN_TUMO],
    ["11040", KONOMANGAN_TUMO],
]);

const OYANOTOKUTEN_MAP = new Map([
    ["2020", "700"],
    ["2030", "1300"],
    ["2040", "2600"],
    ["2521", "2400"],
    ["2531", "4800"],
    ["2541", "9600"],
    ["2530", "1600"],
    ["2540", "3200"],
    ["3011", "1500"],
    ["3021", "2900"],
    ["3031", "5800"],
    ["3041", "11600"],
    ["3010", "500"],
    ["3020", "1000"],
    ["3030", "2000"],
    ["3040", "3900"],
    ["4011", "2000"],
    ["4021", "3900"],
    ["4031", "7700"],
    ["4041", OYANOMANGAN_RON],
    ["4010", "700"],
    ["4020", "1300"],
    ["4030", "2600"],
    ["4040", OYANOMANGAN_TUMO],
    ["5011", "2400"],
    ["5021", "4800"],
    ["5031", "9600"],
    ["5041", OYANOMANGAN_RON],
    ["5010", "800"],
    ["5020", "1600"],
    ["5030", "3200"],
    ["5040", OYANOMANGAN_TUMO],
    ["6011", "2900"],
    ["6021", "5800"],
    ["6031", "11600"],
    ["6041", OYANOMANGAN_RON],
    ["6010", "1000"],
    ["6020", "2000"],
    ["6030", "3900"],
    ["6040", OYANOMANGAN_TUMO],
    ["7011", "3400"],
    ["7021", "6800"],
    ["7031", OYANOMANGAN_RON],
    ["7041", OYANOMANGAN_RON],
    ["7010", "1200"],
    ["7020", "2300"],
    ["7030", OYANOMANGAN_TUMO],
    ["7040", OYANOMANGAN_TUMO],
    ["8011", "3900"],
    ["8021", "7700"],
    ["8031", OYANOMANGAN_RON],
    ["8041", OYANOMANGAN_RON],
    ["8010", "1300"],
    ["8020", "2600"],
    ["8030", OYANOMANGAN_TUMO],
    ["8040", OYANOMANGAN_TUMO],
    ["9011", "4400"],
    ["9021", "8700"],
    ["9031", OYANOMANGAN_RON],
    ["9041", OYANOMANGAN_RON],
    ["9010", "1500"],
    ["9020", "2900"],
    ["9030", OYANOMANGAN_TUMO],
    ["9040", OYANOMANGAN_TUMO],
    ["10011", "4800"],
    ["10021", "9600"],
    ["10031", OYANOMANGAN_RON],
    ["10041", OYANOMANGAN_RON],
    ["10010", "1600"],
    ["10020", "3200"],
    ["10030", OYANOMANGAN_TUMO],
    ["10040", OYANOMANGAN_TUMO],
    ["11011", "5300"],
    ["11021", "10600"],
    ["11031", OYANOMANGAN_RON],
    ["11041", OYANOMANGAN_RON],
    ["11010", "1800"],
    ["11020", "3600"],
    ["11030", OYANOMANGAN_TUMO],
    ["11040", OYANOMANGAN_TUMO],
]);

const MANGANIJOU_MAP = new Map([
    ["501", "12000"],
    ["500", "4000"],
    ["511", "8000"],
    ["510", "2000,4000"],
    ["601", "18000"],
    ["600", "6000"],
    ["611", "12000"],
    ["610", "3000,6000"],
    ["701", "24000"],
    ["700", "8000"],
    ["711", "16000"],
    ["710", "4000,8000"],
    ["801", "36000"],
    ["800", "12000"],
    ["811", "24000"],
    ["810", "6000,12000"],
    ["901", "48000"],
    ["900", "16000"],
    ["911", "32000"],
    ["910", "8000,16000"],
]);

//各人の計算処理
export const liquidationMain = (plus, minus) => plus - minus;

/**
 * 得点を取得する
 * tokutenKey: 符+翻+自摸orロン(自摸:0, ロン:1)
 * oyako: 0:親, 1:子
 * manganIjouKey: 0: 満貫未満, 1:跳満, 2:倍満, 3:三倍満, 4:役満
 * agari: 0:自摸, 1:ロン・包
 */
export const getTokuten = (
    basuu,
    reachBou,
    tokutenKey,
    manganIjouKey,
    oyako,
    agari
) => {
    const obj_tokutenKey = new String(tokutenKey);
    const obj_agari = new String(agari);
    const tokutenkeyManganMiman = obj_tokutenKey + obj_agari;
    const tokutenKeyManganIjou = manganIjouKey + oyako + agari;
    const kyoutaku = reachBou * 1000;
    const totalBaRyou = BA_RYOU * basuu;
    let tokuten = {
        tumoOyaShiharai: 0,
        tumoKoShiharai: 0,
        oyaShiharai: 0,
        koShiharai: 0,
        kyotaku: 0,
    };
    if (manganIjouKey < MANGAN_MIMAN) {
        tokuten = getTokutenManganMiman(
            tokutenkeyManganMiman,
            oyako,
            totalBaRyou,
            agari
        );
    } else {
        tokuten = getTokutenManganIjou(
            oyako,
            tokutenKeyManganIjou,
            totalBaRyou,
            agari
        );
    }
    tokuten.kyotaku = kyoutaku;
    return tokuten;
};

//満貫未満の場合の得点を算出する
export const getTokutenManganMiman = (key, oyako, totalBaRyou, agari) => {
    const baryou = getBaryou(totalBaRyou, agari);
    let tokuten = KONOTOKUTEN_MAP.get(key);
    if (oyako == OYA) {
        tokuten = OYANOTOKUTEN_MAP.get(key);
    }
    const retTokuten = getTokutenContainBaryou(oyako, agari, tokuten, baryou);
    return retTokuten;
};

/**
 * 満貫以上の得点を計算する
 */
export const getTokutenManganIjou = (oyako, key, totalBaRyou, agari) => {
    const baryou = getBaryou(totalBaRyou, agari);
    const tokuten = getTokutenContainBaryou(
        oyako,
        agari,
        MANGANIJOU_MAP.get(key),
        baryou
    );
    return tokuten;
};

/**
 * 場料も含めた得点を返します。
 * @param tokuten
 * @param baryou
 * @returns
 */
const getTokutenContainBaryou = (oyako, agari, tokuten, baryou) => {
    let tokutenArr = [];
    if (tokuten.indexOf(",") > -1) {
        tokutenArr = tokuten.split(",");
    }
    let retshiharai = {
        tumoOyaShiharai: 0,
        tumoKoShiharai: 0,
        oyaShiharai: 0,
        koShiharai: 0,
        kyotaku: 0,
    };
    if (tokutenArr.length > 1) {
        //子のツモ
        retshiharai.tumoOyaShiharai = parseInt(tokutenArr[1]) + baryou;
        retshiharai.tumoKoShiharai = parseInt(tokutenArr[0]) + baryou;
    } else {
        if (agari === TUMO) {
            retshiharai.tumoKoShiharai = parseInt(tokuten) + baryou;
        } else {
            if (oyako === OYA) {
                retshiharai.koShiharai = parseInt(tokuten) + baryou;
            } else {
                retshiharai.oyaShiharai = parseInt(tokuten) + baryou;
            }
        }
    }
    return retshiharai;
};

//場料を計算します
const getBaryou = (totalBaRyou, agari) => {
    let baryou = totalBaRyou;
    if (totalBaRyou > 0 && agari === TUMO) {
        baryou = totalBaRyou / 3;
    }
    return baryou;
};

/**
 * 存在しない得点のチェック
 */
export const isInvalidHuHan = (hu, han, agari) => {
    const PINHU_NOT_EXIST_MSG = "20符1翻は存在しません。";
    const TITOI_NOT_EXIST_MSG = "25符1翻は存在しません。";
    const PINHU_ERR_MSG = "20符はツモのみです";
    const TITOI_ERR_MSG = "25符2翻はロンのみです";
    const key = hu + han + agari;
    const HANEMANIJOU_MAP = new Map([
        ["2010", PINHU_NOT_EXIST_MSG],
        ["2011", PINHU_NOT_EXIST_MSG],
        ["2021", PINHU_ERR_MSG],
        ["2031", PINHU_ERR_MSG],
        ["2041", PINHU_ERR_MSG],
        ["2510", TITOI_NOT_EXIST_MSG],
        ["2511", TITOI_NOT_EXIST_MSG],
        ["2520", TITOI_ERR_MSG],
    ]);
    return HANEMANIJOU_MAP.get(key);
};
