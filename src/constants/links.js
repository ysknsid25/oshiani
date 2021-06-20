export const noteUrl = "https://note.com/oshiani/";
export const googleFormUrl = "https://forms.gle/PD5UiCAkRi41UTbL7";
const twitterUtl = "https://twitter.com/intent/tweet?";
const url = encodeURIComponent(location.href);
export const getTweetUrl = (title, hashTag, officialSite) => {
    const tweet = "私の'推しアニ！'は『" + title + "』です！ ";
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
    const tweet = "あなたの推したいアニメを探すためのアプリ「推しアニ」です。";
    return (
        twitterUtl + "text=" + tweet + "&hashtags=" + hashTags + "&url=" + url
    );
};
