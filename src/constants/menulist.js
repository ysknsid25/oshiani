import { noteUrl, getOshiAniRecomendTweetUrl, googleFormUrl } from "./links";
const tweetUrl = getOshiAniRecomendTweetUrl();

export const menulist = [
    {
        name: "アニメ検索",
        icon: "fas fa-home",
        iconColor: "#191970",
        url: "/",
        needLogin: true,
    },
    {
        name: "行動履歴",
        icon: "fas fa-tasks",
        iconColor: "#191970",
        url: "Profile",
        needLogin: false,
    },
    {
        name: "ウォッチリスト",
        icon: "fas fa-bookmark",
        iconColor: "#191970",
        url: "WatchList",
        needLogin: false,
    },
    {
        name: "フィードバックする",
        icon: "far fa-clipboard",
        iconColor: "#191970",
        url: googleFormUrl,
        needLogin: true,
    },
    {
        name: "推しアニ！を教える",
        icon: "fab fa-twitter",
        iconColor: "#1DA1F2",
        url: tweetUrl,
        needLogin: true,
    },
    {
        name: "リリースノート",
        icon: "fas fa-sticky-note",
        iconColor: "#191970",
        url: noteUrl,
        needLogin: true,
    },
];
