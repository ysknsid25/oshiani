export const noteUrl = "https://note.com/mahjanager";
export const googleFormUrl = "https://forms.gle/516aKVUFosamNFFb6";

export const getTweetUrl = (title, hashTags, officialSite) => {
    const twitterUtl = "https://twitter.com/intent/tweet?";
    const url = encodeURIComponent(location.href);
    const tweet = "私の'推しアニ！'は『" + title + "』です！ " + officialSite;
    return (
        twitterUtl + "text=" + tweet + "&hashtags=" + hashTags + "&url=" + url
    );
};
