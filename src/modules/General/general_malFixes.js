function pageFixes(page) {
  if (page === "anime-manga") {
    let text = create("div", {
      class: "description",
      itemprop: "description",
      style: {
        display: "block",
        fontSize: "11px",
        fontWeight: "500",
        marginTop: "5px",
        whiteSpace: "pre-wrap",
        border: "var(--border) solid var(--border-color)",
      },
    });
    const sections = [
      "Information",
      "Alternative Titles",
      "Statistics",
      "Summary Stats",
      "Score Stats",
      "More Info",
      "Resources",
      "Streaming Platforms",
      "Available At",
      "Background",
      "Synopsis",
      "Episode Videos",
      "Related Anime",
      "Related Manga",
      "Related Entries",
      "Characters",
      "Staff",
      "Reviews",
      "Recommendations",
      "Interest Stacks",
      "Recent News",
      "Recent Featured Articles",
      "Recent Forum Discussion",
      "MALxJapan -More than just anime-",
    ];
    sections.forEach((section) => aniMangaAddClass(section));

    if ($(".AlternativeTitlesDiv").length) {
      if ($("a.js-anime-toggle-alternative-title-button").length > 0 || $("a.js-manga-toggle-alternative-title-button").length > 0) {
        $(".AlternativeTitlesDiv").nextUntil("a").addClass("spaceit-shadow-end").addClass("mb8");
      } else {
        $(".AlternativeTitlesDiv").nextUntil("br").addClass("spaceit-shadow-end");
      }
      document.querySelector(".AlternativeTitlesDiv").nextElementSibling.setAttribute("style", "margin-bottom:4px");
      $('span:contains("Synonyms")').parent().next().css({
        borderRadius: "var(--br)",
      });
    }
    if (document.querySelector(".js-alternative-titles.hide")) {
      document.querySelector(".js-alternative-titles.hide").setAttribute("style", "border-radius:var(--br);overflow:hidden");
    }
    if ($(".InformationDiv").length && !defaultMal) {
      $(".InformationDiv").nextUntil("br").not("h2").attr("style", "background:0!important").addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
    }
    if ($(".StatisticsDiv").length && !defaultMal) {
      $(".StatisticsDiv").nextUntil("br").not("h2").attr("style", "background:0!important").addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
      $(".statistics-info").css("opacity", "0");
      $(".spaceit_pad.po-r.js-statistics-info.di-ib sup").css("opacity", "0");
    }
    if ($(".ResourcesDiv").length) {
      $(".ResourcesDiv").next().addClass("spaceit-shadow-end");
      document.querySelector(".ResourcesDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
      document.querySelector(".ResourcesDiv").nextElementSibling.style.borderRadius = "var(--br)";
    }
    if ($(".StreamingPlatformsDiv").length) {
      $(".StreamingPlatformsDiv").next(".pb16.broadcasts").attr("style", "padding-bottom: 12px!important");
      $(".StreamingPlatformsDiv").next().addClass("spaceit-shadow-end");
      document.querySelector(".StreamingPlatformsDiv").nextElementSibling.style.borderRadius = "var(--br)";
    }
    if ($(".AvailableAtDiv").length) {
      $(".AvailableAtDiv").next().addClass("spaceit-shadow-end");
      document.querySelector(".AvailableAtDiv").nextElementSibling.style.borderRadius = "var(--br)";
      document.querySelector(".AvailableAtDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
    }
    if ($(".SummaryStatsDiv").length) {
      const statsDiv = create("div", { class: "statsDiv spaceit-shadow-end" });
      const statElements = $(".SummaryStatsDiv").nextUntil("br");
      $(".SummaryStatsDiv").after(statsDiv);
      statsDiv.setAttribute(
        "style",
        "border-radius:var(--br);overflow:hidden;display: -ms-grid;display: grid;-ms-grid-columns: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;border:var(--border) solid var(--border-color)"
      );
      $(statsDiv).append(statElements);
    }
    if ($(".score-stats").length) {
      $(".score-stats").addClass("spaceit-shadow-end");
    }
    if ($(".table-recently-updated").length) {
      $(".table-recently-updated").addClass("spaceit-shadow-end");
    }

    handleEmptyInfo(".SynopsisDiv", "No synopsis information has been added to this title.");
    handleEmptyInfo(".CharactersDiv", "No characters or voice");
    handleEmptyInfo(".CharactersDiv", "No characters for this manga");
    handleEmptyInfo(".RecommendationsDiv", "No recommendations have been made");
    handleEmptyInfo(".StaffDiv", "No staff for this");
    handleEmptyInfo(".MoreInfoDiv", "", 1);

    if ($(".RecentNewsDiv").length && !$(".RecentNewsDiv").next().is("div")) {
      $(".RecentNewsDiv").remove();
    }
    if ($('.page-forum:contains("No discussion topic was found.")')[0]) {
      $('.page-forum:contains("No discussion topic was found.")')[0].remove();
      $(".RecentForumDiscussionDiv").remove();
    }
    if (svar.editPopup && $('#addtolist a:contains("Edit Details")').length) {
      let editDetails = $('#addtolist a:contains("Edit Details")')[0];
      editDetails.className = "fa fa-pen";
      editDetails.style.fontFamily = "fontAwesome";
      editDetails.style.padding = "5px";
      editDetails.innerText = "";
      editDetails.href = "javascript:void(0);";
      editDetails.onclick = async () => {
        await editPopup(entryId, entryType);
      };
    }

    // Change the design of the Information on the left side.
    if (svar.animeInfoDesign) {
      let informationDiv = defaultMal ? $(".InformationDiv").nextAll().children(".dark_text") : $(".InformationDiv").next().children().children(".dark_text");
      informationDiv.each(function () {
        let currentText = $(this).text();
        $(this).text(currentText.slice(0, -1));
      });
      informationDiv.after("<br>");
    }

    //Remove the "to ?" in the Aired in Information section on the left side
    if ($(".InformationDiv").length > 0) {
      let InformationAired = defaultMal ? $(".InformationDiv").nextAll().children('.dark_text:contains("Aired")') : $(".InformationDiv").next().children().children('.dark_text:contains("Aired")');
      if (InformationAired.length > 0) {
        InformationAired = InformationAired.parent()[0].childNodes[3] ? InformationAired.parent()[0].childNodes[3] : InformationAired.parent()[0].childNodes[2];
        InformationAired.nodeValue = InformationAired.nodeValue.replace("to ?", "");
      }
    }

    let rightSide = document.querySelector("#content > table > tbody > tr > td:nth-child(2)[valign='top'] tr > td[valign='top']");
    if (rightSide) {
      for (let x = 0; x < 1; x++) {
        rightSide.childNodes.forEach(function (el, i) {
          if (
            i >= 4 &&
            el.class !== "SynopsisDiv" &&
            el.innerText !== "Related Manga" &&
            el.innerText !== "More Videos\nEpisode Videos" &&
            el.innerText !== "Episode Videos" &&
            el.id !== "episode_video" &&
            el.id !== "CallFunctionFormatMoreInfoText"
          ) {
            text.innerHTML += el.textContent;
          }
        });
        for (let x = 0; x < 10; x++) {
          rightSide.childNodes.forEach(function (el, i) {
            {
              if (
                i >= 4 &&
                el.class !== "SynopsisDiv" &&
                el.innerText !== "Related Manga" &&
                el.innerText !== "More Videos\nEpisode Videos" &&
                el.innerText !== "Episode Videos" &&
                el.id !== "episode_video" &&
                el.id !== "CallFunctionFormatMoreInfoText"
              ) {
                el.remove();
              }
            }
          });
        }
      }
    }
    let textfix = text.innerHTML.replace(/<br>.*\s/gm, "").replace(/\n\s{3,10}/g, "");
    if (textfix.includes("No background")) {
      textfix = textfix.replace(/(information here.+)/gm, 'information <a href="/dbchanges.php?aid=' + entryId + '&amp;t=background">here</a>.');
    }
    text.innerHTML = textfix;
    let backgroundInfo = $('h2:contains("Background"):last');
    backgroundInfo.append(text);
    if ($(".SynopsisDiv").next("span").length) {
      $(".SynopsisDiv")
        .next("span")
        .html(
          $(".SynopsisDiv")
            .next("span")
            .html()
            .replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, "")
        );
    }
    if ($(".SynopsisDiv").next("p").length) {
      $(".SynopsisDiv")
        .next("p")
        .html(
          $(".SynopsisDiv")
            .next("p")
            .html()
            .replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, "")
        );
    }
  }
  if (page === "character") {
    let regex = /(Member Favorites).*/g;
    let fav = document.querySelector("#content > table > tbody > tr > td.borderClass");
    let match = create("p", { id: "memberTotalFavs" }, fav.innerText.match(regex));
    fav.innerHTML = fav.innerHTML.replace(regex, "");
    if (match) {
      document.querySelector("#v-favorite").insertAdjacentElement("beforebegin", match);
    }
    if (!/\/(clubs)/.test(current) || !/\/(pics)/.test(current)) {
      $('div:contains("Voice Actors"):last')
        .addClass("VoiceActorsDiv")
        .html(function (_, html) {
          return html.replace("Voice Actors", "");
        })
        .before('<h2 class="VoiceActorsHeader"style="margin-bottom: -10px;margin-top: 10px;">Voice Actors</h2>');

      while ($(".VoiceActorsDiv").next("table").length > 0) {
        $(".VoiceActorsDiv").append(
          $(".VoiceActorsDiv").next("table").addClass("VoiceActorsDivTable").css({
            backgroundColor: "var(--color-foreground)",
            borderRadius: "var(--br)",
            marginTop: "8px",
            border: "var(--border) solid var(--border-color)",
          })
        );
        $(".VoiceActorsDivTable").children().children().children().children(".picSurround").children().children().css({
          width: "52px",
          height: "80px",
          objectFit: "cover",
        });
        $(".VoiceActorsDivTable").children().children().children().css({
          border: "0",
        });
      }
      $(".VoiceActorsDiv").css({
        display: "grid",
        MsGridColumns: "1fr 1fr",
        gridTemplateColumns: "1fr 1fr",
        gap: "0px 6px",
      });
      $('h2:contains("Recent Featured Articles"):last').addClass("RecentFeaturedArticlesDiv").append($(".RecentFeaturedArticlesDiv").next());
      $(".RecentFeaturedArticlesDiv").css({
        marginTop: "10px",
      });
      $(".RecentFeaturedArticlesDiv").children("div:last-child").css({
        marginTop: "8px",
      });
      $(".RecentFeaturedArticlesDiv").children().children().css("width", "99%").children().css("borderRadius", "var(--br)");
      let rightSide = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
      $(rightSide).addClass("characterDiv");
      let text = create("div", {
        class: "description",
        itemprop: "description",
        style: {
          display: "block",
          fontSize: "11px",
          fontWeight: "500",
          marginTop: "5px",
          whiteSpace: "pre-wrap",
          border: "var(--border) solid var(--border-color)",
        },
      });

      text.innerHTML = getTextUntil(".VoiceActorsHeader");
      rightSide.appendChild(text);

      //Remove spaces and add text at the top
      let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, "");
      text.innerHTML = fixtext;

      document.querySelector(".breadcrumb").after(text);

      //Cleanup
      $.trim($(".characterDiv").contents().not($(".description")).not($(".VoiceActorsDiv")).not($("#horiznav_nav")).not($(".breadcrumb")).not($("h2")).not($("table")).remove());
      $(".description").children().not($("li")).not($("input")).not($("span.spoiler_content")).remove();
      if ($(".description") && $(".description").text().length === 0) {
        $(".description").remove();
      }

      //Fix Spoilers
      let spofix = document.querySelectorAll(".spoiler_content > input");
      $(".spoiler_content").css({
        background: "var(--color-foreground4)",
        borderRadius: "var(--br)",
        padding: "0px 5px 5px",
        margin: "5px 0px",
      });
      for (let x = 0; x < spofix.length; x++) {
        spofix[x].setAttribute("onclick", "this.parentNode.style.display='none';this.parentNode.previousElementSibling.style.display='inline-block';");
      }
      if ($(".VoiceActorsHeader").next().html() === "") {
        $(".VoiceActorsHeader").remove();
      }
    }
  }
}

//Companies add border and shadow
if (/\/(anime|manga)\/producer\/\d.?([\w-]+)?\/?/.test(current)) {
  let studioDivShadow = $('.mb16:contains("Member"):last');
  if ($(studioDivShadow).length && $(studioDivShadow).children().css("flex") !== "1 1 0%") {
    $(studioDivShadow).children().attr("style", "background:0!important").wrapAll("<div class='spaceit-shadow-end-div'></div>");
  }
}

//People fix details and add shadow
if (/\/(people)\/.?([\w-]+)?\/?/.test(current)) {
  peopleDetailsAddDiv("Family name:");
  peopleDetailsAddDiv("Website:");
  let peopleDivShadow = document.querySelector("#content > table > tbody > tr > td.borderClass  .spaceit_pad");
  if (peopleDivShadow) {
    $(peopleDivShadow).attr("style", "background:0!important");
    $(peopleDivShadow).nextUntil("div:not(.spaceit_pad)").attr("style", "background:0!important").addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
    $('div:contains("Website:"):last').html() === 'Website: <a href="http://"></a>' ? $('div:contains("Website:"):last').remove() : null;
    $('div:contains("Family name:"):last').html() === "Family name: " ? $('div:contains("Family name:"):last').remove() : null;
    $('span:contains("More:"):last').css({ display: "block", padding: "2px", marginTop: "5px" });
  }
}

//Clubs Page Fixes
//Clubs Page add class to Divs
if (/\/(clubs.php).?([\w-]+)?\/?/.test(current)) {
  $("div.normal_header:contains('Club Members')").next("table").addClass("club-container");
  $("div.bgNone").addClass("club-container");
  $("div.bgColor1").addClass("club-container");
  $('div.normal_header:contains("Club Pictures")').next().children().children().children().addClass("club-container");
  $("#content > table > tbody > tr > td[valign=top]:last-child").addClass("club-container");
  set(2, ".club-container", { sal: { 0: "border-radius:var(--br);overflow:hidden" } });
}

//Club Comments Expand
if (svar.clubComments) {
  if (location.search.includes("cid") && location.pathname === "/clubs.php") {
    document.querySelector("#content > table > tbody > tr").style.display = "inline-block";
    const commHeader = $(".normal_header:contains('Club Comments')");
    const commDiv = $(".normal_header:contains('Club Comments')").next();
    commDiv.css("width", "100%");
    $("#content > table > tbody").append(commHeader, commDiv);
  }
}

//Blog Page Fixes
if (current === "/blog.php" && !location.search && svar.blogContent) {
  getBlogContent();
}

if (/\/(blog)\//.test(current) || /\?eid=/.test(location.search)) {
  if (svar.blogRedesign) {
    //wrap header with a class and add href
    $(".lightLink:not(.lightLink.to-left)").each(function () {
      let headerHref;
      if ($(this).nextAll(".borderClass").children().first().children().eq(1).attr("href")) {
        headerHref = $(this).nextAll(".borderClass").children().first().children().eq(1).attr("href").replace("#comment", "");
      }
      $(this).wrap(function () {
        let hrefAttribute = !/\?eid=/.test(location.search) && headerHref ? `href="${headerHref}"` : "";
        return `<a ${hrefAttribute} class="maljsBlogDivHeader"></a>`;
      });
    });
    $("span.lightLink.to-left").css({ position: "absolute", margin: "-30px 0 0 10px" });
    $(".borderClass").css({ border: "0" });

    //wrap blog Div
    $('.normal_header:not(:contains("Categories"))').each(function () {
      $(this).nextUntil(".borderClass").last("div").addClass("maljsBlogDivContent");
      $(this).nextUntil(".borderClass").wrapAll('<div class="maljsBlogDiv"></div>');
    });

    $(".maljsBlogDivHeader:not(.maljsBlogDiv .maljsBlogDivHeader)").each(function () {
      $(this).nextUntil(".borderClass").last("div").addClass("maljsBlogDivContent");
      $(this).nextUntil(".borderClass").addBack().addBack().wrapAll('<div class="maljsBlogDiv"></div>');
    });

    //wrap relations div
    $('.maljsBlogDiv div:contains("Relations:")').wrap('<div class="maljsBlogDivRelations"></div>');
  }
}

//blog fix for anisongs
if ((/\/(blog.php)/.test(current) || /\/(blog)\//.test(current)) && !/\?eid=/.test(location.search)) {
  $('#content div > div:contains("Relations:") > a')
    .not(".maljsBlogDivHeader")
    .not(".maljsBlogDivContent")
    .each(function () {
      let href = $(this).attr("href");
      if (href && !href.endsWith("/")) {
        $(this).attr("href", href + "/");
      }
    });
} else if (/\/(blog.php)/.test(current) && /\?eid=/.test(location.search)) {
  $('#content div:contains("Relations:") > a')
    .not(".maljsBlogDivHeader")
    .not(".maljsBlogDivContent")
    .each(function () {
      let href = $(this).attr("href");
      if (href && !href.endsWith("/")) {
        $(this).attr("href", href + "/");
      }
    });
}

//Add BBCode Editor
if (
  location.href === "https://myanimelist.net/myblog.php" ||
  (location.href.includes("myblog.php") && location.search.includes("go=edit")) ||
  (location.href.includes("blog.php") && location.search.includes("eid"))
) {
  let blogTextArea = document.querySelectorAll("textarea")[0];
  if (blogTextArea) {
    blogTextArea.classList.add("bbcode-message-editor");
  }
}

if ((location.search.includes("cid") && location.pathname === "/clubs.php") || (location.pathname === "/editclub.php" && location.search.includes("&action=details"))) {
  let clubTextArea = document.querySelectorAll("textarea")[0];
  if (clubTextArea) {
    clubTextArea.classList.add("bbcode-message-editor");
  }
}
if (location.href === "https://myanimelist.net/editprofile.php" && !location.search) {
  let profileTextArea = document.querySelectorAll("textarea")[1];
  if (profileTextArea) {
    profileTextArea.classList.add("bbcode-message-editor");
  }
}
if (location.href === "https://myanimelist.net/editprofile.php?go=signature") {
  let profileTextArea = document.querySelectorAll("textarea")[0];
  if (profileTextArea) {
    profileTextArea.classList.add("bbcode-message-editor");
  }
}
// Modern Profile - Mal Badges Fixes
if (/mal-badges\.com\/(user).*malbadges/.test(location.href)) {
  $('#content  div[data-page-id="main"] .userv2-detail').css("background", "#fff0");
  $("#content  .mr-auto").css("background", "#fff0");
  $("body").css("background-color", "#fff0");
  $("#content").css("background", "#fff0");
  $(".user_badge img").css("max-width", "initial");

  // Detailed Badge
  if (location.href.endsWith("?detail&malbadges")) {
    $(".userv2-stats").css({ "font-size": "15px", gap: "8px", "padding-right": "12px" });
    $(".value-display.value-display--plain .count").css("font-size", "45px");
  } else {
    $(".userv2-stats").remove();
    $(".value-display.value-display--plain .count").css("font-size", "55px");
    $(".userv2-detail__stats").css("grid-template-columns", "1fr 1fr 1fr");
    let statsDivs = $(".userv2-detail__stats .value-display");
    statsDivs.eq(-2).before(statsDivs.eq(-1));
    $(".userv2-detail-bar .value-display__label, .userv2-detail-bar .value-display__value").css("font-size", "16px");
    $(".userv2-detail-bar .count").css("font-size", "20px");
    $(".userv2-detail-bar .value-display.value-display--rank").last().find(".value-display__label").text("Comp Rank");
    $(".userv2-detail-bar .value-display__value").css("font-size", "13px");
    const xpLen = $(".userv2-detail__stats .count").last().attr("data-number")?.length;
    if (xpLen > 4) {
      $(".userv2-detail__stats .count").css("font-size", "55px");
    }
    if (xpLen > 5) {
      $(".userv2-detail__stats .count").css("font-size", "50px");
    }
  }
}
// News and Forum - Load iframe only when the spoiler button is clicked
if (/\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href) || /\/(news)\/\d/.test(location.href)) {
  const spoilers = document.querySelectorAll(".spoiler:has(.movie)");
  spoilers.forEach((spoiler) => {
    const showButton = spoiler.querySelector(".show_button");
    const hideButton = spoiler.querySelector(".hide_button");
    const iframe = spoiler.querySelector("iframe");
    showButton.setAttribute("data-src", iframe.src);
    iframe.src = "";
    $(iframe).contents().find("body").attr("style", "background:0!important");
    showButton.setAttribute(
      "onclick",
      showButton.getAttribute("onclick") +
        'this.nextElementSibling.querySelector("iframe.movie").setAttribute("src",this.getAttribute("data-src"));' +
        'this.nextElementSibling.querySelector("iframe.movie").contentWindow.document.body.setAttribute("style","background:0!important");'
    );
    hideButton.setAttribute("onclick", hideButton.getAttribute("onclick") + 'this.parentElement.querySelector("iframe.movie").removeAttribute("src")');
  });
}

// Genre List Design Fix
if (location.href === "https://myanimelist.net/anime.php" || location.href === "https://myanimelist.net/manga.php") {
  document.querySelectorAll(".genre-link").forEach((genreLink) => {
    const genreCol = genreLink.querySelector(".genre-list-col");
    if (genreCol) {
      genreCol.setAttribute("style", "display: -webkit-inline-box;display: -webkit-inline-flex;display: inline-flex;-webkit-flex-wrap: wrap;flex-wrap: wrap;");
      genreLink.querySelectorAll(".genre-list.al").forEach((genre) => {
        genreCol.appendChild(genre);
      });
    }
  });
  $(".genre-list-col:empty").remove();
}

// Footer Block Fix
$("#footer-block").css("max-width", "100%");
