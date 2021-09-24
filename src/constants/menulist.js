import { getOshiAniRecomendTweetUrl, googleFormUrl } from "./links";
const tweetUrl = getOshiAniRecomendTweetUrl();

export const menulist = [
    {
        name: "アニメ検索",
        icon: "mdi-magnify",
        iconColor: "#191970",
        url: "/",
    },
    {
        name: "Blog",
        icon: "far fa-newspaper",
        iconColor: "#191970",
        url: "/Blog",
    },
    {
        name: "みんなの推しアニメ",
        icon: "fas fa-trophy",
        iconColor: "#191970",
        url: "/OshiAni",
    },
    {
        name: "免責事項",
        icon: "fas fa-info-circle",
        iconColor: "#191970",
        url: "/Information",
    },
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
];
