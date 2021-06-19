const baseUrl = "https://api.annict.com";
const worksUrl = "/v1/works";
const castsUrl = "/v1/casts";
const staffsUrl = "/v1/staffs";
const token = "?access_token=A5kKRnr5a2_VBFWr2gPMdbh3g0ZIHoB-VfIVbugvTMU";
const twitterBaseUrl = "https://twitter.com/";
const YEAR_DURING = 5;
export const getCount = 12;

const date = new Date();

export const getSelectYear = () => {
    let baseYear = date.getFullYear();
    const thisMonth = date.getMonth();
    //秋アニメのシーズンには、冬アニメを検索するために年に+1する
    if (thisMonth > 8) {
        baseYear += 1;
    }
    const firstYear = baseYear - YEAR_DURING;
    let retArr = [];
    for (let year = firstYear; year <= baseYear; year++) {
        retArr.push(year);
    }
    return retArr;
};

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

export const getWorkInfoUrl = (
    isWorkName,
    workName,
    targetYear,
    targetSeason,
    targetPage
) => {
    const seasonCondition = targetYear + "-" + targetSeason;
    let searchCondition = "&filter_season=" + seasonCondition;
    if (isWorkName) {
        searchCondition = "&filter_title=" + workName;
    }
    return (
        baseUrl +
        worksUrl +
        token +
        searchCondition +
        "&page=" +
        targetPage +
        "&per_page=" +
        getCount
    );
};

export const getCastsInfoUrl = (workId) =>
    baseUrl + castsUrl + token + "&filter_work_id=" + workId;

export const getStaffsInfoUrl = (workId) =>
    baseUrl + staffsUrl + token + "&filter_work_id=" + workId;

export const getImage = (url) => {
    if (url !== "") {
        return url;
    }
    return "https://placehold.jp/600x300.png";
};

export const getTitle = (title) => {
    const ishalfWidthCharOnly = title.match(/^[\x20-\x7e]*$/);
    if (!ishalfWidthCharOnly && title.length > 14) {
        return title.substring(0, 14) + "…";
    }
    return title;
};
