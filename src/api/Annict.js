const baseUrl = "https://api.annict.com";
const worksUrl = "/v1/works";
const token = "?access_token=A5kKRnr5a2_VBFWr2gPMdbh3g0ZIHoB-VfIVbugvTMU";

export const season = {
    spring: "spring",
    summer: "summer",
    autumn: "autumn",
    winter: "winter",
};

export const getWorkInfoUrl = (targetYear, targetSeason) => {
    const seasonCondition = targetYear + "-" + targetSeason;
    return baseUrl + worksUrl + token + "&filter_season=" + seasonCondition;
};
