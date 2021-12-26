import {
    getOshiAniRecomendTweetUrl,
    googleFormUrl,
    releaseNoteUrl,
} from "./links";
import { getNowYear, getNowSeason } from "../api/Annict";
const tweetUrl = getOshiAniRecomendTweetUrl();

const nowYear = getNowYear();
const nowSeason = getNowSeason();

export const menulist = [
    {
        name: "TOP",
        icon: "fas fa-home",
        iconColor: "primary",
        url: "/",
    },
    {
        name: "アニメ検索",
        icon: "mdi-magnify",
        iconColor: "primary",
        url: "/WorkInfoList/year/" + nowYear + "/season/" + nowSeason,
    },
    {
        name: "Blog",
        icon: "far fa-newspaper",
        iconColor: "primary",
        url: "/Blog",
    },
    {
        name: "みんなの推しアニメ",
        icon: "fas fa-trophy",
        iconColor: "primary",
        url: "/OshiAni",
    },
    {
        name: "免責事項",
        icon: "fas fa-info-circle",
        iconColor: "primary",
        url: "/Information",
    },
];

export const constMenuLists = [
    {
        name: "リリースノート",
        icon: "far fa-sticky-note",
        iconColor: "#191970",
        url: releaseNoteUrl,
    },
    {
        name: "フィードバックする",
        icon: "far fa-clipboard",
        iconColor: "primary",
        url: googleFormUrl,
    },
    {
        name: "推しアニ！を教える",
        icon: "fab fa-twitter",
        iconColor: "#1DA1F2",
        url: tweetUrl,
    },
    /*
    {
        name: "リリースノート",
        icon: "fas fa-sticky-note",
        iconColor: "primary",
        url: noteUrl,
    },
    */
];
