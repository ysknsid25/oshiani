import { noteUrl, getOshiAniRecomendTweetUrl, googleFormUrl } from "./links";
const tweetUrl = getOshiAniRecomendTweetUrl();

export const menulist = [
    {
        name: "アニメ検索",
        icon: "mdi-magnify",
        iconColor: "#191970",
        url: "/",
        needLogin: false,
    },
    {
        name: "Blog",
        icon: "far fa-newspaper",
        iconColor: "#191970",
        url: "/Blog",
        needLogin: false,
    },
    {
        name: "みんなの推しアニメ",
        icon: "fas fa-trophy",
        iconColor: "#191970",
        url: "/OshiAni",
        needLogin: false,
    },
    {
        name: "ウォッチリスト",
        icon: "far fa-eye",
        iconColor: "#191970",
        url: "/WatchList",
        needLogin: true,
    },
    {
        name: "行動履歴",
        icon: "fas fa-tasks",
        iconColor: "#191970",
        url: "/Profile",
        needLogin: true,
    },
    {
        name: "免責事項",
        icon: "fas fa-info-circle",
        iconColor: "#191970",
        url: "/Information",
        needLogin: false,
    },
];

export const constMenuLists = [
    {
        name: "フィードバックする",
        icon: "far fa-clipboard",
        iconColor: "#191970",
        url: googleFormUrl,
    },
    {
        name: "推しアニ！を教える",
        icon: "fab fa-twitter",
        iconColor: "#1DA1F2",
        url: tweetUrl,
    },
    {
        name: "リリースノート",
        icon: "fas fa-sticky-note",
        iconColor: "#191970",
        url: noteUrl,
    },
];
