const baseUrl = "https://api.annict.com";
const worksUrl = "/v1/works";
const castsUrl = "/v1/casts";
const staffsUrl = "/v1/staffs";
const token = "?access_token=A5kKRnr5a2_VBFWr2gPMdbh3g0ZIHoB-VfIVbugvTMU";
const twitterBaseUrl = "https://twitter.com/";
const YEAR_DURING = 5;
export const getCount = 12;

export const date = new Date();

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

export const blogCategory = [
    //    { key: 0, value: "次にアニメ化しそうな作品", color: "#F8BBD0" },
    { key: 1, value: "アニメの神回", color: "#FFCDD2" },
    { key: 2, value: "管理人の推しアニ", color: "#FFF9C4" },
    { key: 3, value: "雑記", color: "#C5CAE9" },
];

export const season = {
    spring: "spring",
    summer: "summer",
    autumn: "autumn",
    winter: "winter",
};

export const mediaType = {
    tv: "primary",
    ova: "primary",
    web: "green",
    movie: "red",
};

export const getNowSeason = (nowMonth = date.getMonth()) => {
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

export const getSeasonInfoArr = () => {
    const nowSeason = getNowSeason();
    const nowYear = date.getFullYear();
    let nextYear = nowYear;
    //秋アニメの時期には、来期の冬アニメは来年になるため
    if (nowSeason === season.autumn) {
        nextYear += 1;
    }
    const seasonInfoArr = [
        {
            imageUrl: "../../../images/winter-image.jpg",
            subtitle: nextYear + "-" + season.winter,
            targetSeason: season.winter,
            targetYear: nextYear,
        },
        {
            imageUrl: "../../../images/spring-image.jpg",
            subtitle: nowYear + "-" + season.spring,
            targetSeason: season.spring,
            targetYear: nowYear,
        },
        {
            imageUrl: "../../../images/summer-image.jpg",
            subtitle: nowYear + "-" + season.summer,
            targetSeason: season.summer,
            targetYear: nowYear,
        },
        {
            imageUrl: "../../../images/autumn-image.jpg",
            subtitle: nowYear + "-" + season.autumn,
            targetSeason: season.autumn,
            targetYear: nowYear,
        },
    ];
    return seasonInfoArr;
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
    return "./images/noimage.png";
};

export const getTitle = (title) => {
    const ishalfWidthCharOnly = title.match(/^[\x20-\x7e]*$/);
    if (!ishalfWidthCharOnly && title.length > 14) {
        return title.substring(0, 14) + "…";
    }
    return title;
};
