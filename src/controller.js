const pageIsForum = /\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href);
const pageIsForumTopic = /\/forum\/.?topicid([\w-]+)?\/?/.test(location.href);
const pageIsAniManga =
  /\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) &&
  !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current) &&
  !/\/(ownlist|season|adapted|recommendations)/.test(current) &&
  !document.querySelector("#content > .error404");
const pageIsAniMangaPHP = /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(location.href);
const pageIsProfile = /\/(profile)\/.?([\w]+)?\/?/.test(current);
const pageIsCharacter = /\/(character)\/.?([\w-]+)?\/?/.test(current);
const pageIsClubs = /\/(clubs)/.test(current);
const pageIsPeople = /\/(people)\/.?([\w-]+)?\/?/.test(current);
const pageIsNews = /\/news\/\d/.test(location.href);
const pageIsCompany = /(anime|manga)\/(producer)\/.?([\w-]+)?\/?/.test(current);
const pageIsTopAnime = /(topanime.php)/.test(current);
const pageIsAnimeSeason = /(\/anime\/season)/.test(current);
const pageIsAnimeGenre = /(\/anime\/genre\/)/.test(current);
const pageIsCompare = /(shared.php)/.test(current);
let blockU = create("i", { class: "fa fa-ban mt4 ml12 blockUserIcon" });
blockU.onclick = () => {
  blockUser(username);
};

if (pageIsAniManga) {
  await colorFromCover();
  pageFixes("anime-manga");
  getAiringTime();
  await loadAniSong();
  if (svar.moreFavs) {
    addMoreFavs("anime_manga");
  }
  if (svar.animeRelation) {
    getRelations();
  }
  if (svar.customCover) {
    getCustomCover("cover");
    loadCustomCover(1, "cover");
  }
  if (svar.animeTag) {
    getTags();
  }
  if (svar.animeBanner) {
    getBannerImage();
  }
}

if (pageIsCharacter) {
  await colorFromCover();
  pageFixes("character");
  if (svar.moreFavs) {
    addMoreFavs("character");
  }
  if (svar.customCharacterCover) {
    getCustomCover("character");
    loadCustomCover(1, "character");
  }
}
if (pageIsPeople) {
  if (svar.moreFavs) {
    addMoreFavs("people");
  }
}
if (pageIsCompany) {
  if (svar.moreFavs) {
    addMoreFavs("company");
  }
}

if (pageIsProfile) {
  addLoading("add", translate("$loadingProfile", username), 1, 1);
  if (svar.profileNewComments && isMainProfilePage) {
    newProfileComments(1);
  }
  //Add Block User Button
  if (isMainProfilePage && userNotHeaderUser && headerUserName !== "" && headerUserName !== "MALnewbie") {
    $("a.header-right").after(blockU);
  }
}

if (pageIsCompare) {
  compareUserLists();
  compareUserListSortDiff();
}

if (svar.newComments && location.href.includes("https://myanimelist.net/comments.php")) {
  newProfileComments();
}

if (pageIsTopAnime) {
  if (svar.hideNonJapaneseAnime) {
    removeFromTopAnime(nonJapaneseIds);
  }
}

if (pageIsAnimeSeason || pageIsAnimeGenre) {
  if (svar.hideNonJapaneseAnime) {
    removeFromAnimeSeason(nonJapaneseIds);
  }
}

if (pageIsAniMangaPHP && document.querySelector("h1").innerHTML === "Anime Search") {
  if (svar.hideNonJapaneseAnime) {
    removeFromAnimeSearch(nonJapaneseIds);
  }
}

if (location.pathname === "/") {
  if (svar.hideNonJapaneseAnime) {
    removeFromTopAnimeWidget(nonJapaneseIds);
  }
}
