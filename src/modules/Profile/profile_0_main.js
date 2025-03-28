if ($(".comment-form").text().trim() === `You must be friends with ${username} to comment on their profile.`) {
  const profileComID = $('a:contains("Report")').last().attr("href").split("&")[2];
  $(".comment-form").append(`<br><a href=https://myanimelist.net/comments.php?${profileComID}>All Comments</a>`);
}
let banner = create("div", { class: "banner", id: "banner" });
let shadow = create("div", { class: "banner", id: "shadow" });
let container = create("div", { class: "container", id: "container" });
let customfg, custombg, custompf, customCSS, custombadge, customcolors, userimg, customModernLayoutFounded, privateProfile, malBadgesUrl;
let profileRegex = {
  malClean: /(malcleansettings)\/([^"\/])/gm,
  fg: /(customfg)\/([^"\/]+)/gm,
  bg: /(custombg)\/([^"\/]+)/gm,
  pf: /(custompf)\/([^"\/]+)/gm,
  css: /(customCSS)\/([^"\/]+)/gm,
  badge: /(custombadge)\/([^"\/]+)/gm,
  malBadges: /(malBadges)\/([^"\/]+)/gm,
  colors: /(customcolors)\/([^"\/]+)/gm,
  favSongEntry: /(favSongEntry)\/([^\/]+.)/gm,
  privateProfile: /(privateProfile)\/([^"\/]+)/gm,
  hideProfileEl: /(hideProfileEl)\/([^"\/]+)/gm,
  customProfileEl: /(customProfileEl)\/([^"\/]+)/gm,
  moreFavs: /(moreFavs)\/([^\/]+.)/gm,
};
$(".user-friends.pt4.pb12").prev().addBack().wrapAll("<div id='user-friends-div'></div>");
$(".user-badges").prev().addBack().wrapAll("<div id='user-badges-div'></div>");
$(".user-profile-sns").has('a:contains("Recent")').prev().addBack().wrapAll("<div id='user-rss-feed-div'></div>");
$('.user-profile-sns:not(:contains("Recent"))').prev().addBack().wrapAll("<div id='user-links-div'></div>");
$(".user-button").attr("id", "user-button-div");
$(".user-status:contains(Joined)").last().attr("id", "user-status-div");
$(".user-status:contains(History)").attr("id", "user-status-history-div");
$(".user-status:contains(Forum Posts)").attr("id", "user-status-counts-div");
$(".user-statistics-stats").first().attr("id", "user-stats-div");
$(".user-statistics-stats").last().attr("id", "user-updates-div");
shadow.setAttribute("style", "background: linear-gradient(180deg,rgba(6,13,34,0) 40%,rgba(6,13,34,.6));height: 100%;left: 0;position: absolute;top: 0;width: 100%;");
banner.append(shadow);
await startCustomProfile();
if ($("title").text() === "404 Not Found - MyAnimeList.net\n") {
  addLoading("remove");
}
//Private Profile Check
async function applyPrivateProfile() {
  if (privateProfile && userNotHeaderUser) {
    await delay(200);
    $("#banner").hide();
    $("#content").hide();
    $("#navbar").hide();
    addLoading("add", "Private Profile", 0, 1);
  }
}
//Profile Vertical Favs Fix
if ($("#anime_favorites").css("width") <= "191px") {
  $("#user-def-favs h5").attr("style", "padding: 0!important;opacity: 0;height: 0px").text('');
}
