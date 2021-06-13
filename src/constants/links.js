export const noteUrl = "https://note.com/mahjanager";
export const googleFormUrl = "https://forms.gle/516aKVUFosamNFFb6";

const getTweetUrl = () => {
    const twitterUtl = "https://twitter.com/intent/tweet?";
    const url = encodeURIComponent(location.href);
    const tweet =
        "麻雀成績管理アプリ「Mahjanager」です。得点計算が簡単にできたり、成績管理ができたりします。";
    const hashTags = "Mahjanager";
    return (
        twitterUtl + "text=" + tweet + "&hashtags=" + hashTags + "&url=" + url
    );
};

export const tweetUrl = getTweetUrl();
