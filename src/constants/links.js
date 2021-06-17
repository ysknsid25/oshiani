export const noteUrl = "https://note.com/mahjanager";
export const googleFormUrl = "https://forms.gle/516aKVUFosamNFFb6";
const twitterUtl = "https://twitter.com/intent/tweet?";
const url = encodeURIComponent(location.href);
export const getTweetUrl = (title, hashTags, officialSite) => {
    const tweet = "私の'推しアニ！'は『" + title + "』です！ " + officialSite;
    return (
        twitterUtl + "text=" + tweet + "&hashtags=" + hashTags + "&url=" + url
    );
};

export const getOshiAniRecomendTweetUrl = () => {
    const hashTags = "oshiani";
    const tweet = "あなたの推したいアニメを探すためのアプリ「推しアニ」です。";
    return (
        twitterUtl + "text=" + tweet + "&hashtags=" + hashTags + "&url=" + url
    );
};
