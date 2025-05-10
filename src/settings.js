let defaultMal,
  settingsActive,
  settingsFounded,
  loadingMoreFavorites,
  loadingCustomCover = 0;
const current = location.pathname;
const entryTitle = $(".title-name").text()
  ? $(".title-name")
      .text()
      .replace(/\".*\" /, "")
  : document.title
      .replace(/(.*)(\|.*)/, "$1")
      .replace(/(.*)(\(.*\).*)/, "$1")
      .trim();
const entryType = current.split("/")[1].toUpperCase();
const entryId = current.split("/")[2];
const username = current.split("/")[2];
const headerUserName = $(".header-profile-link").text();
const userNotHeaderUser = username !== headerUserName;
const isMainProfilePage = /\/profile\/.*\/\w/gm.test(current) ? 0 : 1;
var stLink = create("a", { class: "malCleanSettingLink", id: "malCleanSettingLink" }, "MalClean Settings");
var stButton = create("li", { class: "malCleanSettingButton", id: "malCleanSettingButton" });

//Default Settings (not for userModules)
let svar = {
  animeBg: true,
  charBg: true,
  customCover: true,
  customCharacterCover: true,
  newComments: false,
  profileNewComments: false,
  moreFavs: true,
  moreFavsMode: true,
  peopleHeader: true,
  animeHeader: true,
  animeBanner: true,
  animeBannerMove: false,
  animeTag: true,
  animeRelation: true,
  animeInfoDesign: false,
  relationFilter: false,
  animeSongs: true,
  characterHeader: true,
  characterNameAlt: true,
  profileHeader: false,
  customCSS: false,
  modernLayout: false,
  autoModernLayout: false,
  animeInfo: true,
  embed: true,
  currentlyWatching: true,
  currentlyReading: true,
  recentlyAddedAnime: true,
  recentlyAddedManga: true,
  listAiringStatus: true,
  airingDate: true,
  autoAddDate: true,
  editPopup: true,
  forumDate: true,
  headerSlide: false,
  headerOpacity: true,
  replaceList: false,
  blogRedesign: false,
  blogContent: true,
  actHistory: true,
  profileAnimeGenre: true,
  profileMangaGenre: false,
  profileRemoveLeftSide: false,
  profileBannerGradient: true,
  moveBadges: false,
  clubComments: false,
  scrollbarStyle: false,
  currentLanguage: "English"
};

svar.save = function () {
  localStorage.setItem("maljsSettings", JSON.stringify(svar));
};
let svarSettings = null;

try {
  svarSettings = JSON.parse(localStorage.getItem("maljsSettings"));
} catch (e) {
  console.error("Error parsing localStorage data:", e);
}

if (!svarSettings) {
  svar.save();
} else {
  let keys = Object.keys(svarSettings);
  keys.forEach((key) => (svar[key] = svarSettings[key]));
}

function getSettings() {
  Object.keys(svar).forEach((setting) => {
    const btnId = setting.endsWith("Btn") ? setting : setting + "Btn";
    const btn = document.getElementById(btnId);

    const isExcluded = (setting === "headerSlide" || setting === "headerOpacity") && defaultMal;

    if (btn && typeof svar[setting] !== "undefined" && !isExcluded && btn.classList && !btn.classList.contains("disabled")) {
      btn.classList.toggle("btn-active", !!svar[setting]);
    }
  });
}

if (typeof jQuery === "undefined") {
  console.error("Mal-Clean-JS: jQuery not found, stopping...");
  throw new Error("Mal-Clean-JS: jQuery not found");
}


const purifyConfig = {
  FORBID_TAGS: ["script", "object", "embed", "frame", "frameset"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onmouseenter", "onmouseleave", "srcdoc"],
  ADD_TAGS: ["b", "i", "u", "strong", "em", "a", "img", "div", "span", "p", "ul", "ol", "li", "br", "hr", "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "thead", "tbody", "tr", "td", "th", "video", "audio", "iframe", "source", "blockquote", "pre", "code"],
  ADD_ATTR: [ "frameborder", "sandbox", "allow", "href", "src", "alt", "title", "width", "height", "controls", "loop", "autoplay", "muted",
    "class", "id", "style", "target", "rel","colspan", "rowspan"],
  SAFE_FOR_JQUERY: true,
  KEEP_CONTENT: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
};

const purifyConfigText = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
};
