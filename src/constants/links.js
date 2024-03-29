export const noteUrl = "https://note.com/oshiani/";
export const googleFormUrl = "https://forms.gle/PD5UiCAkRi41UTbL7";
const twitterUtl = "https://twitter.com/intent/tweet?";
export const releaseNoteUrl = "https://oshiani.net/ReleaseNote.html";
export const untitledreportUrl = "https://untitledreport.com/";
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

export const getBlogCommentTweetUrl = (articleId) => {
    const hashTags = "oshiani,推しアニ";
    const via = "samurai_se";
    const tweet = "https://oshiani.net/Article/" + articleId;
    return (
        twitterUtl +
        "text=" +
        tweet +
        "&hashtags=" +
        hashTags +
        "&via=" +
        via +
        ""
    );
};
