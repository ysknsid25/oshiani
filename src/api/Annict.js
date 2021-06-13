const baseUrl = "https://api.annict.com";
const worksUrl = "/v1/works";
const token = "?access_token=A5kKRnr5a2_VBFWr2gPMdbh3g0ZIHoB-VfIVbugvTMU";
const twitterBaseUrl = "https://twitter.com/";
export const getCount = 10;

const date = new Date();

export const season = {
    spring: "spring",
    summer: "summer",
    autumn: "autumn",
    winter: "winter",
};

export const mediaType = {
    tv: "primary",
    ova: "secondary",
    web: "green",
    movie: "red",
};

export const getNowSeason = () => {
    const nowMonth = date.getMonth();
    if (-1 < nowMonth && nowMonth < 4) {
        return season.winter;
    }
    if (3 < nowMonth && nowMonth < 7) {
        return season.spring;
    }
    if (6 < nowMonth && nowMonth < 10) {
        return season.summer;
    }
    return season.autumn;
};

export const getTwitterUrl = (twitterIconUrl) =>
    twitterBaseUrl + twitterIconUrl;

export const getNowYear = () => date.getFullYear();

export const getWorkInfoUrl = (targetYear, targetSeason, targetPage) => {
    const seasonCondition = targetYear + "-" + targetSeason;
    return (
        baseUrl +
        worksUrl +
        token +
        "&filter_season=" +
        seasonCondition +
        "&page=" +
        targetPage +
        "&per_page=" +
        getCount
    );
};

export const getImage = (url) => {
    if (url !== "") {
        return url;
    }
    return "https://placehold.jp/600x300.png";
};
