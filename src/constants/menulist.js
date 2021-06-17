import { noteUrl, getOshiAniRecomendTweetUrl, googleFormUrl } from "./links";
const tweetUrl = getOshiAniRecomendTweetUrl();

export const menulist = [
    {
        name: "アニメ検索",
        icon: "fas fa-home",
        iconColor: "#191970",
        url: "/",
    },
    {
        name: "行動履歴",
        icon: "fas fa-tasks",
        iconColor: "#191970",
        url: "Profile",
    },
    {
        name: "ウォッチリスト",
        icon: "fas fa-bookmark",
        iconColor: "#191970",
        url: "WatchList",
    },
    {
        name: "推しアニとは",
        icon: "far fa-question-circle",
        iconColor: "#191970",
        url: "About",
    },
    {
        name: "フィードバックする",
        icon: "far fa-clipboard",
        iconColor: "#191970",
        url: googleFormUrl,
    },
    {
        name: "推しアニを教える",
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
