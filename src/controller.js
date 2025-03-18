const pageIsForum = /\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href);
const pageIsForumTopic = /\/forum\/.?topicid([\w-]+)?\/?/.test(location.href);
const pageIsForumBoard = /\/forum\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href);
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
let blockU = create("i", { class: "fa fa-ban mt4 ml12 blockUserIcon" });
blockU.onclick = () => {
  blockUser(username);
};
if (pageIsAniManga) {
  await colorFromCover();
  pageFixes("anime-manga");
  getAiringTime();
  await loadAniSong();
  if (svar.customCharacterCover) {
    addMoreFavs("anime_manga");
  }
  if (svar.animeRelation) {
    getRelations();
  }
  if (svar.customCover) {
    getCustomCover("cover");
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
  if (svar.customCharacterCover) {
    pageFixes("character");
    addMoreFavs("character");
    getCustomCover("character");
    loadCustomCover(1, "character");
  }
}

if (pageIsProfile) {
  addLoading("add", `Loading ${username}'s Profile`, 1, 1);
  if (svar.moreFavs && !userNotHeaderUser) {
    await loadMoreFavs(1, "character");
    await loadMoreFavs(1, "anime_manga");
  }
  if (svar.profileNewComments && isMainProfilePage) {
    newProfileComments(1);
  }
  //Add Block User Button
  if (isMainProfilePage && userNotHeaderUser && headerUserName !== "" && headerUserName !== "MALnewbie") {
    $("a.header-right").after(blockU);
  }
}

if (svar.newComments && location.href.includes("https://myanimelist.net/comments.php")) {
  newProfileComments();
}