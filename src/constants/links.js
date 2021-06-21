export const noteUrl = "https://note.com/oshiani/";
export const googleFormUrl = "https://forms.gle/PD5UiCAkRi41UTbL7";
const twitterUtl = "https://twitter.com/intent/tweet?";
//const url = encodeURIComponent(location.href);
const campainUrl =
    "https://oshiani.net/?utm_source=twitter&utm_medium=usershare&utm_campaign=twitterusershare";
export const getTweetUrl = (title, hashTag, officialSite) => {
    const tweet = "私の'推しアニ！'は『" + title + "』です！ " + campainUrl;
    const hashTags = hashTag + ",oshiani,推しアニ";
    return (
        twitterUtl +
        "text=" +
        tweet +
        "&hashtags=" +
        hashTags +
        "&url=" +
        officialSite
    );
};

export const getOshiAniRecomendTweetUrl = () => {
    const hashTags = "oshiani";
    const tweet =
        "あなたの推したいアニメを探すためのアプリ「推しアニ」です。" +
        campainUrl;
    return twitterUtl + "text=" + tweet + "&hashtags=" + hashTags;
};
