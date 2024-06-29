// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @match       https://myanimelist.net/*
// @grant       none
// @version     1.27.7
// @author      KanashiiDev
// @description Extra customization for MyAnimeList - Clean Userstyle
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Clean-JS/issues
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require     https://cdn.jsdelivr.net/npm/colorthief@2.4.0/dist/color-thief.min.js
// @require     https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/cjs/tinycolor.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@3.1.4/dist/purify.min.js
// ==/UserScript==

//Create Element Shorthand Function
function create(e, t, n) {
  if (!e) throw SyntaxError("'tag' not defined");
  var r,
    i,
    f = document.createElement(e);
  if (t)
    for (r in t)
      if ('style' === r) for (i in t.style) f.style[i] = t.style[i];
      else t[r] && f.setAttribute(r, t[r]);
  return n && (f.innerHTML = n), f;
}

//Time Calculate for Anilist Style Activities
function nativeTimeElement(e) {
  let $ = new Date(1e3 * e);
  return (function e() {
    let r = Math.round(new Date().valueOf() / 1e3) - Math.round($.valueOf() / 1e3);
    if (0 === r) return 'Now';
    if (1 === r) return '1 second ago';
    if (r < 60) return r + ' seconds ago';
    if (r < 120) return '1 minute ago';
    if (r < 3600) return Math.floor(r / 60) + ' minutes ago';
    else if (r < 7200) return '1 hour ago';
    else if (r < 86400) return Math.floor(r / 3600) + ' hours ago';
    else if (r < 172800) return '1 day ago';
    else if (r < 604800) return Math.floor(r / 86400) + ' days ago';
    else if (r < 1209600) return '1 week ago';
    else if (r < 2419200) return Math.floor(r / 604800) + ' weeks ago';
    else if (r < 29030400) return Math.floor(r / 2419200) + ' months ago';
    else return Math.floor(r / 29030400) + ' years ago';
  })();
}

//Set Element Shorthand Function
function set(q, tag, attrs, html) {
  if (q === 1) {
    tag = document.querySelector(tag);
  }
  if (q === 2) {
    tag = document.querySelectorAll(tag);
  }
  if (!tag) {
    return;
  }
  var ele = tag,
    attrName,
    styleName;
  if (attrs)
    for (attrName in attrs) {
      if (attrName === 'style')
        for (styleName in attrs.style) {
          ele.style[styleName] = attrs.style[styleName];
        }
      if (attrName === 'sa')
        for (styleName in attrs.sa) {
          ele.setAttribute('style', attrs.sa[styleName]);
        }
      if (attrName === 'sap')
        for (styleName in attrs.sap) {
          ele.parentElement.setAttribute('style', attrs.sap[styleName]);
        }
      if (attrName === 'r') {
        ele.remove();
      }
      if (attrName === 'pp')
        for (styleName in attrs.pp) {
          ele.prepend(document.querySelector(attrs.pp[styleName]));
        }
      if (attrName === 'sal')
        for (styleName in attrs.sal) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].setAttribute('style', attrs.sal[styleName]);
          }
        }
      if (attrName === 'sl')
        for (styleName in attrs.sl) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].style[styleName] = attrs.sl[styleName];
          }
        }
    }
  if (html) ele.innerHTML = html;
  return ele;
}

//String Similarity
var stringSimilarity = function (str1, str2, substringLength, caseSensitive) {
    if (substringLength === void 0) { substringLength = 2; }
    if (caseSensitive === void 0) { caseSensitive = false; }
    if (!caseSensitive) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
    }
    if (str1.length < substringLength || str2.length < substringLength)
        return 0;
    var map = new Map();
    for (var i = 0; i < str1.length - (substringLength - 1); i++) {
        var substr1 = str1.substr(i, substringLength);
        map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
    }
    var match = 0;
    for (var j = 0; j < str2.length - (substringLength - 1); j++) {
        var substr2 = str2.substr(j, substringLength);
        var count = map.has(substr2) ? map.get(substr2) : 0;
        if (count > 0) {
            map.set(substr2, count - 1);
            match++;
        }
    }
    return (match * 2) / (str1.length + str2.length - ((substringLength - 1) * 2));
};

// Current Watching Airing Schedule - Calculate Time
async function airingTime(sec){
  const timeUntilAiring = sec;
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  const targetTimeStamp = currentTimeStamp + timeUntilAiring;
  const remainingTime = targetTimeStamp - currentTimeStamp;
  const days = Math.floor(remainingTime / (24 * 60 * 60));
  const hours = Math.floor((remainingTime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
  return (days ? days+"d ":"")+(hours ? hours+"h ":"")+(minutes ? minutes+"m":"");
};

// Anilist API Request
async function AnilistAPI(fullQuery){
  var query = fullQuery;
  let url = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      };
  await delay(333);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if(data.error){
      return null;
    }
    if(data.data){
      return data;
    }
  } catch (error) {
    return null;
  }
}

// Current Watching Airing Schedule - Episode Behind
async function episodesBehind(c, w) {
  if (c - 1 <= w) {
    return;
  }
  else {
    const epBehind = c - 1 - w;
    return epBehind + " ep behind";
    }
}

// Anime-Manga Add Class
function aniMangaAddClass(main, name) {
  const h2 = $('h2:contains("' + main + '"):last');
  if (h2.length > 0) {
    name = name || main.split(" ").join("") + "Div";
    const parent = h2.parent();
    parent.is('div') && !parent.hasClass('leftside') && !parent.hasClass('rightside') ? parent.addClass(name) : h2.addClass(name);
  }
}

// Create MalClean List Divs
function createListDiv(title,buttons) {
  let btns = create("div",{class:'mainListBtnsDiv'});
  for(let x = 0; x<buttons.length;x++) {
    btns.append(buttons[x].b);
    btns.insertAdjacentHTML('beforeend', "<h3>"+buttons[x].t+"</h3>");
  }
  let div = create("div",{class: "mainListDiv"},'<div class="profileHeader"><h2>' + title + "</h2></div>");
  div.append(btns);
  return div;
}

// Add Divs to People Details
function peopleDetailsAddDiv(title) {
  let divElements = $('span:contains("'+title+'"):last').nextUntil('div');
  let divNameElement = $('span.dark_text:contains("'+title+'")');
  let divNameText = divNameElement[0] && divNameElement[0].nextSibling ? divNameElement[0].nextSibling.nodeValue.trim() : null;
  let newDiv = $('<div class="spaceit_pad"></div>').html(title +' ' + divNameText);
  for (let x=0;x<divElements.length; x++) {
    newDiv.append(divElements[x]);
  }
  if (divNameElement) {
    divNameText ? divNameElement[0].nextSibling.nodeValue  = "" : null;
    divNameElement.after(newDiv);
    divNameElement.remove();
  }
}

// Add Div to Empty Anime/Manga Info
function emptyInfoAddDiv(title) {
  let newDiv = $('<div itemprop="description" style="display: block;"></div>');
  let cDiv = $(title)[0];
  let siblings = [];
  for (let i = 0; i < 3; i++) {
    siblings.push(cDiv.nextSibling);
    cDiv = cDiv.nextSibling;
  }
  newDiv.append(...siblings);
  $(title).after(newDiv);
}

// Anime/Manga Edit Popup
async function editPopup(id, type) {
  return new Promise((resolve, reject) => {
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/ownlist/" + (type ? type.toLocaleLowerCase() : "anime") + "/" + id + "/edit?hideLayout=1";
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupLoading = create("div",{
      class: "actloading",
      style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px" },},
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "1" },
    });
    const iframe = create("iframe", { src: popupId });
    iframe.style.opacity = 0;
    const close = () => {
      if ($(iframe).contents().find(".goodresult").length && url) {
        window.location.reload();
      }
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };
    if (type === "manga") {
      popup.style.height = "472px";
    }

    popup.append(popupClose, iframe, popupLoading);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
      iframe.style.opacity = 1;
      popupLoading.remove();

      if (svar.autoAddDate) {
        // close advanced section
        if ($(iframe).contents().find("#hide-advanced-button")[0].style.display === "") {
          $(iframe).contents().find("#hide-advanced-button")[0].click();
        }

        let decreaseEp = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").next().clone().text("-").css({ marginRight: "0" });
        $(decreaseEp).prependTo($(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").parent());

        function checkEp() {
          let ep = parseInt($(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").val());
          let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
          let day = $(iframe).contents().find("#add_anime_finish_date_day,#add_manga_finish_date_day")[0];
          let month = $(iframe).contents().find("#add_anime_finish_date_month,#add_manga_finish_date_month")[0];
          let year = $(iframe).contents().find("#add_anime_finish_date_year,#add_manga_finish_date_year")[0];
          let startDate = $(iframe).contents().find("#add_anime_start_date_month,#add_manga_start_date_month").val();
          let endDate = $(iframe).contents().find("#add_anime_finish_date_month,#add_manga_finish_date_month").val();

          // if episode count is greater than 0 and the start date is not entered
          if (ep > 0 && lastEp > 0 && !startDate) {
            $(iframe).contents().find("#start_date_insert_today")[0].click();
          }

          // if episode count equals or exceeds the total episodes and the end date is not entered, add end date
          if (ep >= lastEp && lastEp > 0 && !endDate) {
            $(iframe).contents().find("#end_date_insert_today")[0].click();
          }

          //if episode count less than total episodes and the end date is entered, clear end date
          if (ep < lastEp && lastEp > 0 && endDate) {
            day.value = 0;
            month.value = 0;
            year.value = 0;
          }
        }

        //if episode count changed
        $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").on("input", function () {
          checkEp();
        });

        //if increment episode (+) clicked
        $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").next().on("click", function () {
          checkEp();
        });

        //if entry status is completed
        $(iframe).contents().find("#add_anime_status,#add_manga_status")[0].addEventListener("change", function () {
          if (this.value == "2") {
            checkEp();
          }
        });

        //if decrease ep clicked
        $(decreaseEp).on("click", function () {
          let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
          ep.value = ep.value > 0 ? ep.value - 1 : ep.value;
          checkEp();
        });
      }

      //if history clicked
      $(iframe).contents().find("#totalEpisodes,#totalChap").next().children().on("click", function () {
        iframe.style.opacity = 0;
        popup.append(popupLoading);
        popup.prepend(popupBack);
      });

      //if history back clicked
      $(popupBack).on("click", function () {
        iframe.style.opacity = 0;
        popup.append(popupLoading);
        iframe.src = popupId;
        popupBack.remove();
      });
    });

    // close popup
    popupMask.onclick = () => {
      close();
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

// Block User Popup
async function blockUser(id) {
  return new Promise((resolve, reject) => {
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/editprofile.php?go=privacy";
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupLoading = create("div",{
      class: "actloading",
      style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px" },},
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "1" },
    });
    const iframe = create("iframe", { src: popupId });
    iframe.style.opacity = 0;
    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    popup.append(popupClose, iframe, popupLoading);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
      iframe.style.opacity = 1;
      popupLoading.remove();
      if ($(iframe).contents().find("form > input.inputtext")[0]) {
        $(iframe).contents().find("#headerSmall")[0].remove();
        $(iframe).contents().find("#menu")[0].remove();
        $(iframe).contents().find("#horiznav_nav")[0].remove();
        $(iframe).contents().find(".h1")[0].remove();
        $(iframe).contents().find("form > input.inputtext")[0].value = id;
        $(iframe).contents().find('a[href*=profile]').removeAttr("href");
        $(iframe).contents().find('html')[0].style.overflowX = 'hidden';
        $(iframe).contents().find('#content')[0].style.padding = '0';
        $(iframe).contents().find("#contentWrapper")[0].setAttribute('style', 'top: 0px;min-height: auto;padding: 0;');
        $(iframe).contents().find("#myanimelist")[0].setAttribute('style', 'width: auto;padding: 0px 5px;');
        $(iframe).contents().find("form:has(input.inputtext)")[0].style.width = "auto";
        $(iframe).contents().find("#content > div > div")[0].style.width = "auto";
      }
      if ($(iframe).contents().find(".goodresult")[0]) {
        popup.append($(iframe).contents().find(".goodresult")[0]);
        iframe.remove();
      }
      if ($(iframe).contents().find(".badresult")[0]) {
        popup.append($(iframe).contents().find(".badresult")[0]);
        iframe.remove();
      }
      $(iframe).contents().find("input[name='bsub']").on("click", function () {
        iframe.style.opacity = 0;
        popup.append(popupLoading);
      });
      $(iframe).contents().find("span:has(form)").on("click", function () {
        iframe.style.opacity = 0;
        popup.append(popupLoading);
      });
    });

    // close popup
    popupMask.onclick = () => {
      close();
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

let svar = {
  animebg: true,
  charbg: true,
  peopleHeader: true,
  animeHeader: true,
  animeBanner: true,
  animeTag: true,
  animeRelation: true,
  animeSongs: true,
  characterHeader: true,
  characterNameAlt: true,
  profileHeader: false,
  customcss: false,
  alstyle: false,
  animeinfo: true,
  embed: true,
  currentlyWatching: true,
  currentlyReading: true,
  airingDate: true,
  autoAddDate: true,
  editPopup: true,
  forumDate: true,
};

svar.save = function () {
  localStorage.setItem('maljsSettings', JSON.stringify(svar));
};
const svarSettings = JSON.parse(localStorage.getItem('maljsSettings'));
if (!svarSettings) {
  svar.save();
}
if (svar) {
  let keys = Object.keys(svarSettings);
  keys.forEach((key) => (svar[key] = svarSettings[key]));
}

//Settings CSS
let styles = `
.relationsTarget,
.relationsExpanded{
    display: -webkit-box!important;
    display: -webkit-flex!important;
    display: -ms-flexbox!important;
    display: flex!important;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    gap:14px
}
.relationsExpanded{
    padding: 0px 8px
}
.relations-accordion-button {
    text-align:right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}
.relationEntry{
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    float: left;
    opacity: 1;
    overflow: hidden;
    position: relative;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out
}
.relationTitle{
    border-bottom: 2px solid;
    transition: .3s;
    width: 100%;
    background: var(--color-foreground2);
    align-content: center;
    bottom: 0;
    height: 35px;
    color: var(--color-main-text-normal);
    font-size: 9.5px;
    font-weight: bold;
    left: 0;
    position: absolute;
    text-align: center;
    opacity: .95;
    border-bottom-left-radius: var(--br);
    border-bottom-right-radius: var(--br)
}
.relationImg {
    width: 86px;
    height: 120px;
    transition:.3s
}
.relationEntry:hover {
    overflow:visible!important
}
.relationEntry:hover .relationImg {
    border-top-right-radius:0!important;
    border-bottom-right-radius:0!important
}
.relationEntryRight:hover .relationImg {
    border-top-left-radius:0!important;
    border-bottom-left-radius:0!important;
    border-top-right-radius:var(--br)!important;
    border-bottom-right-radius:var(--br)!important
}
.relationEntry:hover .relationTitle {
    opacity:0
}
.relationEntry:hover .relationDetails {
    opacity:1;
    z-index:10
}
.relationDetails:hover {
    display:none
}
.relationDetails {
    transition: .3s;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 86px;
    width: max-content;
    max-width: 300px;
    height: 100px;
    padding: 10px;
    background: var(--color-foreground2);
    z-index: 5;
    border-top-right-radius: var(--br);
    border-bottom-right-radius: var(--br)
}
.relationDetailsRight{
    border-top-right-radius:0;
    border-bottom-right-radius: 0;
    border-top-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    left: inherit;
    right:86px
}
.relationDetailsTitle{
    height: 67px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    color: var(--color-main-text-normal)
}
.aniTagDiv {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 6px
}
.aniTag {
    cursor: default;
    display: -webkit-box;
    display: flex;
    background-color: var(--color-foreground);
    border-radius: var(--br);
    padding: 7px;
    -webkit-box-pack: justify;
    justify-content: space-between
}
.aniTag.spoiler {
    display:none
}
.showSpoilers {
    cursor:pointer
}
.showSpoilers,
.aniTag.spoiler .aniTag-name {
    color: #d98080;
    font-weight: 600
}
.aniTag-percent {
    color:var(--color-main-text-light)
}
#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel > div.h1.edit-info,
#content > table > tbody > tr > td.borderClass > div > div > div:nth-child(1),
#content > table > tbody > tr > td.borderClass > div > div:nth-child(1){
    z-index: 1;
    position: relative
}
.bannerHover{
    width: 220px;
    height: 80px;
    position: absolute;
    bottom: 0px;
    left: 18px;
    z-index: 1
}
.bannerShadow {
    background: -webkit-gradient(linear,left top, left bottom,from(rgba(6, 13, 34,.1)),color-stop(50%, rgba(6, 13, 34,0)),to(rgba(6, 13, 34,.6)));
    background: -o-linear-gradient(top,rgba(6, 13, 34,.1),rgba(6, 13, 34,0) 50%,rgba(6, 13, 34,.6));
    background: linear-gradient(180deg,rgba(6, 13, 34,.1),rgba(6, 13, 34,0) 50%,rgba(6, 13, 34,.6));
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0px
}
.bannerImage{
    width: 100%;
    height: 100%
}
@supports (object-fit: cover) {
  .bannerImage {
    object-fit: cover;
    max-height: 240px
  }
  .relationImg {
    object-fit: cover
  }
}
.bannerDiv {
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    max-height:435px;
    position:relative;
    padding:0!important;
    margin-left: -13px;
    margin-top:-7px;
    width: calc(100% + 25px);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    overflow:hidden
}
.aniLeftSide {
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    position:relative;
    padding-top:0!important;
    top:-85px
}
.aniTag,
.spaceit-shadow,
.spaceit-shadow-people,
.spaceit-shadow-studio,
.spaceit-shadow-stats,
.spaceit-shadow-end {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;
    border: var(--border) solid var(--border-color);
}
.spaceit-shadow:after {
    background-color: var(--color-foreground);
    height: 6px;
    content: "";
    position: relative;
    left: -10px;
    bottom: -13px;
    display: block;
    width: 224px;
    z-index: 5
}
.spaceit-shadow-people {
    max-width: 225px
}
.spaceit-shadow-studio {
    max-width: 280px
}
.spaceit-shadow-people:after {
    background-color: var(--color-foreground);
    height: 6px;
    content: "";
    position: relative;
    left: -10px;
    bottom: -13px;
    display: block;
    width: 245px;
    z-index: 5
}
.spaceit-shadow-studio:after {
    background-color: var(--color-foreground);
    height: 6px;
    content: "";
    position: relative;
    left: -10px;
    bottom: -13px;
    display: block;
    width: 300px;
    z-index: 5
}
.spaceit-shadow-stats{
    max-width: 384px
}
.spaceit-shadow-stats:after {
    background-color: var(--color-foreground);
    height: 6px;
    content: "";
    position: relative;
    left: -10px;
    bottom: -3px;
    display: block;
    width: 390px;
    z-index: 5
}
.fa-info-circle:before {
    text-shadow: rgb(0 0 0 / 70%) 0px 0px 2px;
}
#currently-popup {
    height: 425px;
    width: 674px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: var(--color-foreground2);
    padding: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}
#currently-popup iframe {
    width: 100%;
    height: 100%;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    border:1px solid
}
#currently-popup .popupBack {
    left: 6px;
    right: inherit!important;
    font-family: FontAwesome;
    float: left;
    padding: 0px 0px 5px 0px;
}
.widget.seasonal.left .btn-anime i:hover{
    width:160px;
    height:220px;
    text-align:right;
    background:0!important
}
#widget-currently-watching > div.widget-slide-outer > ul > li:hover span.epBehind,
.widget.seasonal.left .btn-anime:hover i,
#widget-currently-watching .btn-anime:hover i,
#widget-currently-reading .btn-anime:hover i {
    opacity:.9!important
}
#currently-watching span{
    width:93%
}
#currently-popup .popupBack,
#currently-closePopup {
    position: absolute;
    top: 5px;
    right: 6px;
    cursor: pointer
}
.airingInfo {
    color: var(--color-text);
    transition:.4s;
    text-align:center;
    background-color:rgb(31 38 49 / 72%);
    padding:3px 0px;
    position:absolute;
    bottom:0;
    width:100%
}
.behindWarn {
background: -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0)), to(rgba(232, 93, 117, .49))); */
    background: -o-linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    padding:3px 0px;
    position:absolute;
    bottom:0;
    width:100%;
    height:4px;
    opacity:.8
}
.epBehind{
    color: var(--color-main-text-op);
    position: absolute;
    left: 3px;
    top: 3px;
    background: var(--color-foreground2);
    padding: 2px 4px !important;
    border-radius: 5px;
    width: auto !important
}
.airingInfo div:first-child:after {
    content: "";
    display: block;
    height: 3px;
    width: 0
}
.widget.anime_suggestions.left #widget-currently-reading a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-reading a:hover .airingInfo,
.widget.anime_suggestions.left #widget-currently-watching a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-watching a:hover .airingInfo {
    opacity:0;
}
.widget-slide-block:hover #current-left-manga.active,
.widget-slide-block:hover #current-left.active{
    left:0!important;
    opacity:1!important
}
.widget-slide-block:hover #current-right-manga.active,
.widget-slide-block:hover #current-right.active{
    right:0!important;
    opacity:1!important
}
.embedLink {
    width:max-content;
    line-height: 1.16rem;
    margin: 5px 1px;
    display: inline-block;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.embedDiv.no-genre .genres{
   display:none
}
.embedDiv:not(.no-genre) div{
    transition: opacity 0.3s ease-in-out;
}
.embedDiv:not(.no-genre) .genres{
    margin-bottom:-18.5px;
    opacity:0
}
.embedDiv:not(.no-genre):hover .genres {
    opacity:1
}
.embedDiv:not(.no-genre):hover .details {
    opacity:0
}
.embedName{
    font-weight:bold;
    display:block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
}
.embedImage{
    background-size: cover;
    height: 58px;
    width: 41px;
    margin-right: 10px;
    margin-left: -10px;
}
.embedDiv{
    color: var(--color-text);
    align-items: center;
    text-align:center;
    width:max-content;
    min-height: 55px;
    background-color: var(--color-foreground2);
    padding: 0px 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden;
}
.forum .replied.show .embedDiv,
.quotetext .embedDiv {
    background-color: var(--color-foreground);
}
.tooltipBody {
    display: none;
    background-color: var(--color-foreground);
    border-radius: 5px;
    color: #fff;
    margin-top:5px
}
.tooltipBody .main {
    margin:0!important
}
.mainDiv {
    right: 0;
    width: 520px;
    height: 86vh;
    max-height: 775px;
    margin-right: 15px;
    -webkit-transition: .4s;
    -o-transition: .4s;
    transition: .4s;
    position: fixed;
    top:55px;
    z-index:11;
    background-color: var(--color-foreground)!important;
    overflow-y: scroll;
    display: -ms-grid;
    display: grid;
    color: var(--color-text);
    padding: 10px;
    border: 1px solid #6969694d;
    -webkit-border-radius: 10px;
            border-radius: 10px
}
.mainListDiv {
    margin-top:10px;
}
#listDiv > .mainListDiv:nth-child(2) {
    margin-top:45px
}
.mainListBtnsDiv{
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 0px 2px;
}
.textpb{
    padding-top:5px!important;
    font-weight:bold
}
.textpb a{
    color: rgb(var(--color-link))!important;
}
.mainDivHeader {
    display: -ms-inline-grid;
    display: inline-grid;
    -ms-grid-columns: 4fr 1fr 1fr;
    grid-template-columns: 4fr 1fr 1fr;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: medium;
    position: fixed;
    background: var(--color-foreground);
    width: 505px;
    border-top-left-radius: 10px;
    margin-top: 0px;
    padding: 10px;
    height: 35px;
    top: inherit;
    right: 25px
}
.mainbtns {
    -webkit-transition:0.25s;
    -o-transition:0.25s;
    transition:0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    padding: 5px;
    margin: 4px;
    cursor: pointer;
    background-color: var(--color-background);
    color: var(--color-text)
}
.mainbtns:hover{
    -webkit-transform:scale(1.04);
    -ms-transform:scale(1.04);
    transform:scale(1.04)
}
.btn-active {
    background-color: var(--color-foreground4)!important;
    color: rgb(159, 173, 189)
}
.btn-active:before{
    font-family: 'Font Awesome 6 Pro';
    content: "\\f00c"
}
@keyframes reloadLoop {
    0% {
    background-color: var(--color-background);
    }
    50% {
    background-color: var(--color-foreground4);
    }
    100% {
    background-color: var(--color-background)
  }
}
.display-none {
    display:none!important
}
button#customcss,
button#custombg,
button#custompf{
    height: 40px;
    width: 45%
}
input#cssinput,
input#bginput,
input#pfinput{
    width: 47%;
    height: 15px;
    margin-right: 5px
}
.mainDiv .mainListDiv h2{
    background: var(--fg2);
    border-radius: var(--br);
    padding: 5px
}
.mainDiv .mainListDiv h3 {
    font-weight:500
}`;
let styles1 = `
.anisong-accordion-button {
    text-align:right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}
.anisongs .theme-songs.js-theme-songs {
    margin-bottom:5px
}
.anisongs video {
    width: 100%;
    margin-top: 10px
}
.anisongs .oped-preview-button.oped-preview-button-gray {
    cursor: pointer;
    display: inline-block;
    height: 8px;
    margin-bottom: -3px;
    width: 15px;
    -webkit-filter: invert(100%) hue-rotate(180deg) brightness(75%)!important;
    filter: invert(100%) hue-rotate(180deg) brightness(75%)!important
    }`;
let styles2 = `
.lazyloading {
    opacity: 1!important
}
footer {
    z-index: 0;
    margin-top: 65px!important;
    position: relative
}
.dark-mode .profile .user-statistics,
.profile .user-statistics {
    width: 99%
}
.dark-mode .profile .user-comments .comment,
.profile .user-comments .comment,
.dark-mode .page-common .content-container .container-right h2,
.page-common .content-container .container-right h2,
.dark-mode .fav-slide-block,
.fav-slide-block {
    width: 96%
}
#myanimelist:before {
    content: "";
    width: 200%;
    left: 0;
    position: fixed;
    height: 200%;
    z-index: 0;
    -webkit-backdrop-filter: brightness(bg_brightness)contrast(bg_contrast)saturate(bg_saturate)!important;
    backdrop-filter: brightness(bg_brightness)contrast(bg_contrast)saturate(bg_saturate)!important;
}
.dark-mode body:not(.ownlist),
    body:not(.ownlist) {
    background: url(bg_image)!important;
    background-size: cover!important;
    background-attachment: fixed!important;
    background-color: var(--color-background)!important;
}
.page-common #myanimelist #contentWrapper {
    background-color: var(--color-backgroundo)!important;
    top: 55px!important;
    padding: 10px;
    margin-left: -15px;
    width: 1070px;
    border-radius: var(--border-radius);
    box-shadow: 0 0 4px var(--shadow-color)!important;
}`;

//CSS MyAnimeList - Clean Main Colors
let styles3 = `
body,:root {
    --color-background: #0c1525!important;
    --color-backgroundo: #0c1525!important;
    --color-foreground: #161f2f!important;
    --color-foreground2: #202939!important;
    --color-foreground3: rgba(37,46,62,0.3)!important;
    --color-foreground4: #2a3343!important;
    --br: 5px!important;
    --color-text: 182 182 182;
    --color-text-normal: #b6b6b6!important;
    --color-main-text-normal: #c8c8c8!important;
    --color-main-text-light: #a5a5a5!important;
    --color-main-text-op: #fff!important;
    --color-link: 159, 173, 189;
    --color-link2: #7992bb!important;
    --color-text-hover: #cfcfcf!important;
    --color-link-hover: #cee7ff!important;
}`;

//Create Style Elements
let styleSheet = document.createElement('style');
let styleSheet1 = document.createElement('style');
let styleSheet2 = document.createElement('style');
let styleSheet3 = document.createElement('style');
styles = styles.replace(/\n/g, '');
styles1 = styles1.replace(/\n/g, '');
styles2 = styles2.replace(/\n/g, '');
styles3 = styles3.replace(/\n/g, '');

//Settings Button
var stButton = create("li", {});
stButton.onclick = () => {
  Settings();
};
var stLink = create("a", {}, "MalClean Settings");
var active = !1;

//Close Button
var buttonclose = create("button", { class: "mainbtns", id: "closebtn" }, "Close");
buttonclose.onclick = () => {
  closeDiv();
};

//Reload Button
var buttonreload = create("button", { class: "mainbtns", id: "reloadbtn" }, "Refresh");
buttonreload.onclick = () => {
  window.location.reload();
};

//Refresh Page Button Animation
function reloadset() {
  reloadbtn.setAttribute('style', 'animation:reloadLoop 2.5s infinite');
}

//Other Buttons
var button1 = create("button", { class: "mainbtns", id: "animeBgBtn" });
button1.onclick = () => {
  svar.animebg = !svar.animebg;
  svar.save();
  getSettings();
  reloadset();
};
var button2 = create("button", { class: "mainbtns", id: "animeHeaderBtn" });
button2.onclick = () => {
  svar.animeHeader = !svar.animeHeader;
  svar.save();
  getSettings();
  reloadset();
};
var button17 = create("button", { class: "mainbtns", id: "animeBannerBtn" });
button17.onclick = () => {
  svar.animeBanner = !svar.animeBanner;
  svar.save();
  getSettings();
  reloadset();
};
var button18 = create("button", { class: "mainbtns", id: "animeTagBtn" });
button18.onclick = () => {
  svar.animeTag = !svar.animeTag;
  svar.save();
  getSettings();
  reloadset();
};
var button19 = create("button", { class: "mainbtns", id: "animeRelationBtn" });
button19.onclick = () => {
  svar.animeRelation = !svar.animeRelation;
  svar.save();
  getSettings();
  reloadset();
};
var button3 = create("button", { class: "mainbtns", id: "charBgBtn" });
button3.onclick = () => {
  svar.charbg = !svar.charbg;
  svar.save();
  getSettings();
  reloadset();
};
var button4 = create("button", { class: "mainbtns", id: "characterHeaderBtn" });
button4.onclick = () => {
  svar.characterHeader = !svar.characterHeader;
  svar.save();
  getSettings();
  reloadset();
};
var button5 = create("button", { class: "mainbtns", id: "characterNameAltBtn" });
button5.onclick = () => {
  svar.characterNameAlt = !svar.characterNameAlt;
  svar.save();
  getSettings();
  reloadset();
};
var button6 = create("button", { class: "mainbtns", id: "peopleHeaderBtn" });
button6.onclick = () => {
  svar.peopleHeader = !svar.peopleHeader;
  svar.save();
  getSettings();
  reloadset();
};
var button7 = create("button", { class: "mainbtns", id: "customCssBtn" });
button7.onclick = () => {
  svar.customcss = !svar.customcss;
  svar.save();
  getSettings();
  reloadset();
};
var button9 = create("button", { class: "mainbtns", id: "profileHeaderBtn" });
button9.onclick = () => {
  svar.profileHeader = !svar.profileHeader;
  svar.save();
  getSettings();
  reloadset();
};
var button10 = create("button", { class: "mainbtns", id: "alStyleBtn" });
button10.onclick = () => {
  svar.alstyle = !svar.alstyle;
  svar.save();
  getSettings();
  reloadset();
};
var button13 = create("button", { class: "mainbtns", id: "animeInfoBtn" });
button13.onclick = () => {
  svar.animeinfo = !svar.animeinfo;
  svar.save();
  getSettings();
  reloadset();
};
var button14 = create("button", { class: "mainbtns", id: "embedBtn" });
button14.onclick = () => {
  svar.embed = !svar.embed;
  svar.save();
  getSettings();
  reloadset();
};
var button15 = create("button", { class: "mainbtns", id: "currentlyWatchingBtn" });
button15.onclick = () => {
  svar.currentlyWatching = !svar.currentlyWatching;
  svar.save();
  getSettings();
  reloadset();
};
var button16 = create("button", { class: "mainbtns", id: "airingDateBtn" });
button16.onclick = () => {
  svar.airingDate = !svar.airingDate;
  svar.save();
  getSettings();
  reloadset();
};
var button20 = create("button", { class: "mainbtns", id: "animeSongsBtn" });
button20.onclick = () => {
  svar.animeSongs = !svar.animeSongs;
  svar.save();
  getSettings();
  reloadset();
};
var button21 = create("button", { class: "mainbtns", id: "autoAddDateBtn" });
button21.onclick = () => {
  svar.autoAddDate = !svar.autoAddDate;
  svar.save();
  getSettings();
  reloadset();
};
var button22 = create("button", { class: "mainbtns", id: "editPopupBtn" });
button22.onclick = () => {
  svar.editPopup = !svar.editPopup;
  svar.save();
  getSettings();
  reloadset();
};
var button23 = create("button", { class: "mainbtns", id: "currentlyReadingBtn" });
button23.onclick = () => {
  svar.currentlyReading = !svar.currentlyReading;
  svar.save();
  getSettings();
  reloadset();
};
var button24 = create("button", { class: "mainbtns", id: "forumDateBtn" });
button24.onclick = () => {
  svar.forumDate = !svar.forumDate;
  svar.save();
  getSettings();
  reloadset();
};
//Custom Profile Background
let bginput = create("input", { class: "bginput", id: "bginput" });
bginput.placeholder = "Paste your Background Image Url";
var button11 = create("button", { class: "mainbtns", id: "custombg" }, "Convert Background to BBCode");
var bginfo = create("p", { class: "textpb" }, "");

button11.onclick = () => {
  if (bginput.value.slice(-1) === "]") {
    bginfo.innerText = "Background Image already converted.";
  } else if (bginput.value.length > 1) {
    bginput.value = "[url=https://custombg/" + LZString.compressToBase64(JSON.stringify(bginput.value)) + "]‎ [/url]";
    bginput.select();
    bginput.addEventListener(`focus`, () => bginput.select());
    bginfo.innerHTML ="Background Image Converted. Please copy and paste to your " +"<a class='embedLink' href='https://myanimelist.net/editprofile.php'>About Me</a>" + " section." +
      '<br>'+"if you are using modern about please create a blog post and paste it there.";
  } else {
    bginfo.innerText = "Background Image url empty.";
  }
};

//Custom Avatar
var button12 = create("button", { class: "mainbtns", id: "custompf" }, "Convert Avatar to BBCode");
button12.onclick = () => {
  if (pfinput.value.slice(-1) === "]") {
    pfinfo.innerText = "Background Image already converted.";
  } else if (pfinput.value.length > 1) {
    pfinput.value = "[url=https://custompf/" + LZString.compressToBase64(JSON.stringify(pfinput.value)) + "]‎ [/url]";
    pfinput.select();
    pfinput.addEventListener(`focus`, () => pfinput.select());
    pfinfo.innerHTML ="Avatar Image Converted. Please copy and paste to your " +"<a class='embedLink' href='https://myanimelist.net/editprofile.php'>About Me</a>" + " section." +
      '<br>'+"if you are using modern about please create a blog post and paste it there.";
  } else {
    pfinfo.innerText = "Avatar Image url empty.";
  }
};
let pfinput = create("input", { class: "bginput", id: "pfinput" });
pfinput.placeholder = "Paste your Avatar Image Url here";
var pfinfo = create("p", { class: "textpb" }, "");

//Custom CSS
var button8 = create("button", { class: "mainbtns", id: "customcss" }, "Convert CSS to BBCode");
button8.onclick = () => {
  if (cssinput.value.slice(-1) === "]") {
    cssinfo.innerText = "Css already converted.";
  } else if (cssinput.value.length > 1) {
    cssinput.value = "[url=https://customcss/" + LZString.compressToBase64(JSON.stringify(cssinput.value)) + "]‎ [/url]";
    cssinput.select();
    cssinput.addEventListener(`focus`, () => cssinput.select());
    cssinfo.innerHTML = "Css Converted. Please copy and paste to your " +"<a class='embedLink' href='https://myanimelist.net/editprofile.php'>About Me</a>" + " section." +
      '<br>'+"if you are using modern about please create a blog post and paste it there.";
  } else {
    cssinfo.innerText = "Css empty.";
  }
};
var cssinfo = create("p", { class: "textpb" }, "");
let cssinput = create("input", { class: "cssinput", id: "cssinput" });
cssinput.placeholder = "Paste your CSS here";

// Toggle enabled Buttons
function getSettings() {
  animeBgBtn.classList.toggle('btn-active', svar.animebg);
  charBgBtn.classList.toggle('btn-active', svar.charbg);
  peopleHeaderBtn.classList.toggle('btn-active', svar.peopleHeader);
  animeHeaderBtn.classList.toggle('btn-active', svar.animeHeader);
  animeBannerBtn.classList.toggle('btn-active', svar.animeBanner);
  animeTagBtn.classList.toggle('btn-active', svar.animeTag);
  animeRelationBtn.classList.toggle('btn-active', svar.animeRelation);
  characterHeaderBtn.classList.toggle('btn-active', svar.characterHeader);
  characterNameAltBtn.classList.toggle('btn-active', svar.characterNameAlt);
  customCssBtn.classList.toggle('btn-active', svar.customcss);
  profileHeaderBtn.classList.toggle('btn-active', svar.profileHeader);
  alStyleBtn.classList.toggle('btn-active', svar.alstyle);
  animeInfoBtn.classList.toggle('btn-active', svar.animeinfo);
  embedBtn.classList.toggle('btn-active', svar.embed);
  currentlyWatchingBtn.classList.toggle('btn-active', svar.currentlyWatching);
  currentlyReadingBtn.classList.toggle('btn-active', svar.currentlyReading);
  airingDateBtn.classList.toggle('btn-active', svar.airingDate);
  animeSongsBtn.classList.toggle('btn-active', svar.animeSongs);
  autoAddDateBtn.classList.toggle('btn-active', svar.autoAddDate);
  editPopupBtn.classList.toggle('btn-active', svar.editPopup);
  forumDateBtn.classList.toggle('btn-active', svar.forumDate);
}

//Create Settings Div
function createDiv() {
  let listDiv = create("div", { class: "mainDiv", id: "listDiv" }, '<div class="mainDivHeader"><b>' + stLink.innerText + "</b></div>");
  let custombgDiv = create(
    "div",
    { class: "mainListDiv", id: "profileDiv" },
    '<div class="profileHeader"><h2>' +
      "Anilist Style - Custom Background Image" +
      "</h2><h3>" +
      "Add custom Background Image to your profile. This will be visible to others with the script." +
      "</h3></div>"
  );
  let custompfDiv = create(
    "div",
    { class: "mainListDiv", id: "profileDiv" },
    '<div class="profileHeader"><h2>' + "Anilist Style - Custom Avatar" + "</h2><h3>" + "Add custom Avatar to your profile. This will be visible to others with the script." + "</h3></div>"
  );
  let customcssDiv = create(
    "div",
    { class: "mainListDiv", id: "profileDiv" },
    '<div class="profileHeader"><h2>' + "Custom CSS" + "</h2><h3>" + "Add custom CSS to your profile. This will be visible to others with the script." + "</h3></div>"
  );

  listDiv.querySelector(".mainDivHeader").append(buttonreload, buttonclose);
  listDiv.append(
    createListDiv(
      "My Panel",
      [{b:button13,t:"Add info to seasonal anime (hover over anime to make it appear)"},
       {b:button15,t:"Show currently watching anime"},
       {b:button23,t:"Show currently reading manga"},
       {b:button16,t:"Add next episode countdown to currently watching anime"},
       {b:button21,t:"Auto add start/finish date to watching anime & reading manga"},
      ]),
    createListDiv(
      "Anime / Manga",
      [
        {b:button1,t:"Add dynamic background color based cover art's color palette"},
        {b:button17,t:"Add banner image from Anilist"},
        {b:button18,t:"Add tags from Anilist"},
        {b:button19,t:"Replace relations"},
        {b:button20,t:"Replace Anime OP/ED with animethemes.moe"},
        {b:button22,t:"Replace the edit details with the edit popup"},
        {b:button2,t:"Change title position"}
      ]),
    createListDiv(
      "Character",
      [
       {b:button3,t:"Add dynamic background color based cover art's color palette"},
       {b:button4,t:"Change name position"},
       {b:button5,t:"Show alternative name"}]),
    createListDiv(
      "People",
      [
       {b:button6,t:"Change name position"}]),
    createListDiv(
      "Forum",
      [
       {b:button14,t:"Make Anime/Manga links like Anilist"},
       {b:button24,t:"Change date format"},
      ]),
    createListDiv(
      "Profile",
      [
       {b:button10,t:"Make profile like Anilist"},
       {b:button7,t:"Show custom CSS"},
       {b:button9,t:"Change username position"}
      ]),
  );
  if (svar.alstyle) {
    listDiv.append(custombgDiv, custompfDiv);
    custombgDiv.append(bginput, button11, bginfo);
    custompfDiv.append(pfinput, button12, pfinfo);
    button9.style.display = "none";
    button9.nextSibling.style.display = "none";
  }
  listDiv.append(customcssDiv);
  customcssDiv.append(cssinput, button8, cssinfo);
  document.querySelector("#headerSmall").insertAdjacentElement("afterend", listDiv);
  getSettings();
}
function closeDiv() {
  listDiv.remove();
  active = !1;
}

//Settings Open & Close
function Settings() {
  active = !active;
  if (active) {
    createDiv();
  }
  if (!active) {
    closeDiv();
  }
}

//Delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Main
(function () {
  "use strict";

  // News and Forum - Load iframe only when the spoiler button is clicked
  if (/\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href) || /\/(news)\/\d/.test(location.href)) {
    const spoilers = document.querySelectorAll(".spoiler:has(.movie)");
    spoilers.forEach(spoiler => {
      const showButton = spoiler.querySelector(".show_button");
      const iframe = spoiler.querySelector("iframe");
      showButton.setAttribute("data-src", iframe.src);
      iframe.src = "";
      showButton.addEventListener("click", function() {
        iframe.src = showButton.getAttribute("data-src");
        spoiler.querySelector(".spoiler_content").style.display = 'inline-block';
        showButton.style.display = 'none';
      });
      const hideButton = spoiler.querySelector(".hide_button");
      hideButton.addEventListener("click", function() {
        spoiler.querySelector(".spoiler_content").style.display = 'none';
        showButton.style.display = 'inline-block';
        iframe.src = "";
      });
    });
  }

  //onload Function
  function on_load() {
  //Replace anime.php
    const phpUrl = window.location.href;
    if (phpUrl.includes('/anime.php?id=')) {
      const newUrl = phpUrl.replace('/anime.php?id=', '/anime/');
      window.location.href = newUrl+'/';
    }
    //Add MalClean Settings to header dropdown
    let pfHeader = $('li:contains("Account Settings")')[0];
    if (!pfHeader) {
      pfHeader = document.querySelector(".header-profile-dropdown > ul > li:nth-last-child(3)");
    }
    if (pfHeader) {
      var gear = pfHeader.querySelector("a > i");
      var gearClone = gear.cloneNode(!0);
      stLink.prepend(gearClone);
      stButton.append(stLink);
      pfHeader.insertAdjacentElement("afterend", stButton);
    }
  };
  if(document.readyState === 'loading') {
    document.addEventListener( 'DOMContentLoaded', on_load );
  }
  else if( document.readyState === 'interactive' || document.readyState === 'complete' ) {
    on_load();
  }

  var current = location.pathname;
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  //Currently Watching //--START--//
  if (svar.currentlyWatching && location.pathname === "/") {
    //Create Currently Watching Div
    getWatching();
    async function getWatching() {
      if (svar.airingDate) {
        let s = document.createElement("style");
        s.innerText = `.widget.anime_suggestions.left #widget-currently-watching > div.widget-slide-outer ul > li > a span{opacity: 0;transition: .4s}
        .widget.anime_suggestions.left div#widget-currently-watching > div.widget-slide-outer ul > li > a:hover span{opacity: 1}`;
        document.head.appendChild(s);
      }
      let idArray = [];
      let ep, left, infoData;
      let user = document.querySelector("#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8 > a");
      user = user ? user.innerText : null;
      if(user) {
      const watchdiv = create("article", { class: "widget-container left", id: "currently-watching" });
      watchdiv.innerHTML =
        '<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span><h2 class="index_h2_seo"><a href="https://myanimelist.net/animelist/' +
        user +
        '?status=1">Currently Watching</a>' +
        '</h2><i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-size:12px;font-family:FontAwesome"></i></div>' +
        '<div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-watching">' +
        '<div id="current-left" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>' +
        '<div id="current-right" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">' +
        '<span class="btn-inner" style="display: none;"></span></div><div class="widget-slide-outer">' +
        '<ul class="widget-slide js-widget-slide" data-slide="4" style="width: 3984px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul></div></div></div></div></div>';
      //Get watching anime data from user's list
      const html = await fetch("https://myanimelist.net/animelist/" + user + "?status=1")
        .then((response) => response.text())
        .then((data) => {
          var newDocument = new DOMParser().parseFromString(data, "text/html");
          let list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
          if (list) {
            document.querySelector("#content > div.left-column").prepend(watchdiv);
            processList();
            async function processList() {
              if (svar.airingDate) {
                for (const item of list) {
                  idArray.push(item.anime_id);
                }
                //get anime time until airing info from Anilist API
                const queries = idArray.map((id, index) => `Media${index}: Media(idMal: ${id}, type: ANIME) {nextAiringEpisode {timeUntilAiring episode}}`);
                const fullQuery = `query {${queries.join("\n")}}`;
                infoData = await AnilistAPI(fullQuery);
                if (!infoData) {
                  for (let x = 0; x < 5; x++) {
                    if (!infoData) {
                      await AnilistAPI(fullQuery);
                      await delay(1000);
                    }
                    if(!infoData && x === 4) {
                      let d = document.querySelector("#currently-watching > div > div.widget-content > div");
                      let r = create("i",{class:"fa-solid fa-rotate-right",style:{cursor: "pointer",color: "var(--color-link)"}});
                      r.onclick = () => {
                        watchdiv.remove();
                        getWatching();
                      }
                      d.innerText = "API Error ";
                      d.append(r);
                      document.querySelector("#currently-watching > div > div.widget-header > i").remove();
                      return;
                    }
                  }
                }
              }
              // if watching anime still airing, add time until airing
              for (let x = 0; x < list.length; x++) {
                let currep, nextep;
                if (svar.airingDate) {
                  const media = infoData.data["Media" + x];
                  ep = media.nextAiringEpisode ? media.nextAiringEpisode.episode : "";
                  const airing = media.nextAiringEpisode ? media.nextAiringEpisode.timeUntilAiring : "";
                  left = ep && airing ? '<div id='+airing+' class="airingInfo"><div>Ep ' + ep + "</div>" + "<div>" + (await airingTime(airing)) + "</div></div>" : "";
                  let info = [ep, left];
                  if(info) {
                    currep = info[0] && info[0] !== 1 ? await episodesBehind(info[0], list[x].num_watched_episodes) : 0;
                    nextep = svar.airingDate && info[1] ? info[1] : "";
                    if (currep) {
                      nextep += '<span class="epBehind">' + currep + '</span><div class="behindWarn"></div>';
                    }
                  }
                }
                if(!nextep) {
                  nextep = '<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">' + list[x].num_watched_episodes +
                    (list[x].anime_num_episodes !== 0 ? " / " + list[x].anime_num_episodes : "") + '</div></div>';
                }
                let ib = create("i", {
                  class: "fa fa-pen",
                  id: list[x].anime_id,
                  style: {
                    fontFamily: '"Font Awesome 6 Pro"',
                    position: "absolute",
                    right: "3px",
                    top: "3px",
                    background: "var(--color-foreground2)",
                    padding: "4px",
                    borderRadius: "5px",
                    opacity: "0.3",
                    transition: ".4s",
                  },
                });
                // create watching anime div
                let wDiv = create("li", { class: "btn-anime" });
                wDiv.innerHTML =
                  '<a class="link" href=' +
                  list[x].anime_url +
                  ">" +
                  '<img width="124" height="170" class="lazyloaded" src=' +
                  list[x].anime_image_path +
                  ">" +
                  '<span class="title js-color-pc-constant color-pc-constant">' +
                  list[x].anime_title +
                  "</span>" +
                  (nextep ? nextep : "") +
                  "</a>";
                wDiv.appendChild(ib);
                document.querySelector("#widget-currently-watching ul").append(wDiv);
                ib.onclick = async () => {
                  await editPopup(ib.id);
                  watchdiv.remove();
                  getWatching();
                };
              }
              // sort by time until airing
              if (svar.airingDate) {
                let airingDivs = Array.from(document.querySelectorAll("#widget-currently-watching ul li"));
                let airingMainDiv = document.querySelector("#widget-currently-watching ul");
                airingDivs.sort(function(a, b) {
                  let idA = a.children[0]?.children[2]?.id;
                  let idB = b.children[0]?.children[2]?.id;
                  return idA - idB;
                });
                airingMainDiv.innerHTML = '';
                airingDivs.forEach(function(div) {
                  airingMainDiv.appendChild(div);
                });
              }
              document.querySelector("#currently-watching > div > div.widget-header > i").remove();
              document.querySelector("#widget-currently-watching > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right").classList.add("active") : "";
            }

            //Currently Watching - Slider Left
            document.querySelector("#current-left").addEventListener("click", function () {
              const slider = document.querySelector(".widget-slide");
              const slideWidth = slider.children[0].offsetWidth + 12;
              if (parseInt(slider.style.marginLeft) < 0) {
                slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
                document.querySelector("#widget-currently-watching > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right").classList.add("active") : "";
              }
              if (parseInt(slider.style.marginLeft) > 0) {
                slider.style.marginLeft = -slideWidth + "px";
              }
              if (parseInt(slider.style.marginLeft) === 0) {
                document.querySelector("#current-left").classList.remove("active");
              }
            });
            //Currently Watching - Slider Right
            document.querySelector("#current-right").addEventListener("click", function () {
              const slider = document.querySelector(".widget-slide");
              const slideWidth = slider.children[0].offsetWidth + 12;
              if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
                slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
                document.querySelector("#current-left").classList.add("active");
              }
              if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
                document.querySelector("#current-right").classList.remove("active");
              }
            });
          }
        });
      }
    }
  }
    //Currently Watching //--END--//

  //Currently Reading //--START--//
  if (svar.currentlyReading && location.pathname === "/") {
    //Create Currently Reading Div
    getreading();
    async function getreading() {
      if (svar.airingDate) {
        let s = document.createElement("style");
        s.innerText = `.widget.anime_suggestions.left #widget-currently-reading > div.widget-slide-outer ul > li > a span{opacity: 0;transition: .4s}
        .widget.anime_suggestions.left div#widget-currently-reading > div.widget-slide-outer ul > li > a:hover span{opacity: 1}`;
        document.head.appendChild(s);
      }
      let idArray = [];
      let ep, left, infoData;
      let user = document.querySelector("#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8 > a");
      user = user ? user.innerText : null;
      if(user) {
      const readdiv = create("article", { class: "widget-container left", id: "currently-reading" });
      readdiv.innerHTML =
        '<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span><h2 class="index_h2_seo"><a href="https://myanimelist.net/mangalist/' +
        user +
        '?status=1">Currently Reading</a>' +
        '</h2><i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-size:12px;font-family:FontAwesome"></i></div>' +
        '<div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-reading">' +
        '<div id="current-left-manga" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>' +
        '<div id="current-right-manga" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">' +
        '<span class="btn-inner" style="display: none;"></span></div><div class="widget-slide-outer">' +
        '<ul class="widget-slide js-widget-slide manga" data-slide="4" style="width: 3984px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul></div></div></div></div></div>';
      //Get reading anime data from user's list
      const html = await fetch("https://myanimelist.net/mangalist/" + user + "?status=1")
        .then((response) => response.text())
        .then((data) => {
          var newDocument = new DOMParser().parseFromString(data, "text/html");
          let list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
          if (list) {
            if(document.querySelector("#currently-watching")) {
              document.querySelector("#currently-watching").insertAdjacentElement("afterend", readdiv);
            } else {
              document.querySelector("#content > div.left-column").prepend(readdiv);
            }
            processList();
            async function processList() {
              for (let x = 0; x < list.length; x++) {
                let nextchap = '<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">' + list[x].num_read_chapters +
                    (list[x].manga_num_chapters !== 0 ? " / " + list[x].manga_num_chapters : "") + '</div></div>';
                let ib = create("i", {
                  class: "fa fa-pen",
                  id: list[x].manga_id,
                  style: {
                    fontFamily: '"Font Awesome 6 Pro"',
                    position: "absolute",
                    right: "3px",
                    top: "3px",
                    background: "var(--color-foreground2)",
                    padding: "4px",
                    borderRadius: "5px",
                    opacity: "0.3",
                    transition: ".4s",
                  },
                });
                // Create Reading Manga Div
                let rDiv = create("li", { class: "btn-anime" });
                rDiv.innerHTML =
                  '<a class="link" href=' +
                  list[x].manga_url +
                  ">" +
                  '<img width="124" height="170" class="lazyloaded" src=' +
                  list[x].manga_image_path +
                  ">" +
                  '<span class="title js-color-pc-constant color-pc-constant">' +
                  list[x].manga_title +
                  "</span>" +
                  nextchap +
                  "</a>";
                rDiv.appendChild(ib);
                document.querySelector("#widget-currently-reading ul").append(rDiv);
                ib.onclick = async () => {
                  await editPopup(ib.id,'manga');
                  readdiv.remove();
                  getreading();
                };
              }
              document.querySelector("#currently-reading > div > div.widget-header > i").remove();
              document.querySelector("#widget-currently-reading > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-manga").classList.add("active") : "";
            }

            //Currently Reading - Slider Left
            document.querySelector("#current-left-manga").addEventListener("click", function () {
              const slider = document.querySelector(".widget-slide.js-widget-slide.manga");
              const slideWidth = slider.children[0].offsetWidth + 12;
              if (parseInt(slider.style.marginLeft) < 0) {
                slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
                document.querySelector("#widget-currently-reading > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-manga").classList.add("active") : "";
              }
              if (parseInt(slider.style.marginLeft) > 0) {
                slider.style.marginLeft = -slideWidth + "px";
              }
              if (parseInt(slider.style.marginLeft) === 0) {
                document.querySelector("#current-left-manga").classList.remove("active");
              }
            });
            //Currently Reading - Slider Right
            document.querySelector("#current-right-manga").addEventListener("click", function () {
              const slider = document.querySelector(".widget-slide.js-widget-slide.manga");
              const slideWidth = slider.children[0].offsetWidth + 12;
              if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
                slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
                document.querySelector("#current-left-manga").classList.add("active");
              }
              if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
                document.querySelector("#current-right-manga").classList.remove("active");
              }
            });
          }
        });
      }
    }
  }
    //Currently Reading //--END--//

    //Seasonal Info //--START--//
  if (svar.animeinfo && location.pathname === "/") {
    //Get Seasonal Anime and add info button
    const i = document.querySelectorAll(".widget.seasonal.left .btn-anime");
    i.forEach((info) => {
      let ib = create("i", {
        class: "fa fa-info-circle",
        style: { fontFamily: '"Font Awesome 6 Pro"', position: 'absolute', right: '3px', top: '3px', padding: "4px", opacity: "0", transition: ".4s",zIndex:"20"},
      });
      info.prepend(ib);
    });
    async function exit() {
      let v = 1;
      timeout();
      function timeout() {
        if (v > 0) {
          setTimeout(async function () {
            if ($(".tooltipBody:hover").length === 0 && $(".widget.seasonal.left i:hover").length === 0) {
              await delay(50);
              if ($(".tooltipBody:hover").length === 0 && $(".widget.seasonal.left i:hover").length === 0) {
                //info button hover out
                $(this).attr("alt", $(this).data("tooltipTitle"));
                $(".tooltipBody").slideUp(400, function () {
                  $(this).remove();
                  v = 0;
                });
              } else {
                v = 1;
              }
            }
            timeout();
          }, 200);
        }
      }
    }
    //info button click event
    $(".widget.seasonal.left i").on('click', async function () {
        exit();
        if ($(".tooltipBody").length === 0) {
          let info;
          if (!$(this).closest(".btn-anime")[0].getAttribute("details")) {
            //Get info from Jikan API
            async function getinfo(id) {
              const apiUrl = `https://api.jikan.moe/v4/anime/${id}/full`;
              await fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                  info = data.data;
                });
            }
            let id = $(this).next(".link")[0].href.split("/")[4];
            await getinfo(id);
            info =
              '<div class="main">' +
              (info.title ? '<div class="text"><h2>' + info.title + "</h2></div>" : "") +
              (info.synopsis ? '<div class="text"><b>Synopsis</b><br>' + info.synopsis + "</div>" : "") +
              (info.genres && info.genres[0]
                ? '<br><div class="text"><b>Genres</b><br>' +
                  info.genres
                    .map((node) => "<a href='"+node.url + "'>"+node.name+"</a>")
                    .toString()
                    .split(",")
                    .join(", ") +
                  "</div>"
                : "") +
              (info.studios && info.studios[0]
                ? '<br><div class="text"><b>Studios</b><br>' +
                  info.studios
                    .map((node) => "<a href='"+node.url + "'>"+node.name+"</a>")
                    .toString()
                    .split(",")
                    .join(", ") +
                  "</div>"
                : "") +
              (info.themes && info.themes[0]
                ? '<br><div class="text"><b>Themes</b><br>' +
                  info.themes
                    .map((node) => "<a href='"+node.url + "'>"+node.name+"</a>")
                    .toString()
                    .split(",")
                    .join(", ") +
                  "</div>"
                : "") +
              (info.demographics && info.demographics[0]
                ? '<br><div class="text"><b>Demographics</b><br>' +
                  info.demographics
                    .map((node) => "<a href='"+node.url + "'>"+node.name+"</a>")
                    .toString()
                    .split(",")
                    .join(", ") +
                  "</div>"
                : "") +
              (info.type ? '<br><div class="text"><b>Type</b><br>' + info.type + "</div>" : "") +
              (info.rating ? '<br><div class="text"><b>Rating</b><br>' + info.rating + "</div>" : "") +
              (info.aired && info.aired.string ? '<br><div class="text"><b>Start Date</b><br>' + info.aired.string.split(" to ?").join("")+"</div>" : "") +
              (info.broadcast ? '<br><div class="text"><b>Broadcast</b><br>' + info.broadcast.string + "</div>" : "") +
              (info.episodes ? '<br><div class="text"><b>Episodes</b><br>' + info.episodes + "</div>" : "") +
              (info.trailer && info.trailer.embed_url ? '<br><div class="text"><b>Trailer</b><br>' +
               '<div class="spoiler">'+
               '<input type="button" class="button show_button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" data-showname="Show Trailer" data-hidename="Hide Trailer" value="Show Trailer">' +
               '<span class="spoiler_content" style="display:none">' +
               '<input type="button" class="button hide_button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide Trailer">' +'<br>' +
               '<iframe width="700" height="400" class="movie youtube" frameborder="0" autoplay="0" allowfullscreen src="' + info.trailer.embed_url.split("&autoplay=1").join("") + '"></iframe></span></div>' +
               "</div>" : "") +
              '<br><div class="text"><b>Forum</b><br>'+
              "<a href='"+info.url+"/forum" + "'>All</a> | <a href='"+info.url+"/forum?topic=episode" + "'>Episodes</a> | <a href='"+info.url+"/forum?topic=other" + "'>Other</a></div>"+
              (info.external && info.external[0]
                ? '<br><div class="text"><b>Available At</b><br>' +
                  info.external
                    .map((node) =>"<a href='"+node.url + "'>"+node.name+"</a>")
                    .toString()
                    .split(",")
                    .join(" | ") +
                  "</div>"
                : "");
            $(this).closest(".btn-anime")[0].setAttribute("details", "true");
            $('<div class="tooltipDetails"></div>').html(info).appendTo($(this).closest(".btn-anime"));
          }
          var title = await $(this).attr("alt");
          $(this).data("tooltipTitle", title);

          $(
            '<div class="tooltipBody">' +
              ($(".tooltipBody").length === 0 && $(this).closest(".btn-anime")[0].children[2]
                ? $(this).closest(".btn-anime")[0].children[2].innerHTML
                : "") +
              "</div>",
          )
            .appendTo(".widget.seasonal.left")
            .slideDown(400);
        }
      }
    ).on('mouseleave',
      async function (){
        exit();
      });
  }
  //Seasonal Info //--END--//

  // Forum Hide Blocked Users //--START--//
  if (/\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href)) {
    let blockedUsers = [];
    getBlockedUsers();
    async function getBlockedUsers() {
      const html = await fetch("https://myanimelist.net/editprofile.php?go=privacy")
        .then((response) => response.text())
        .then((data) => {
          let newDocument = new DOMParser().parseFromString(data, "text/html");
          let findUser = newDocument.querySelectorAll("#content > div:nth-child(2) a[href*=profile]");
          for (let x = 0; x < findUser.length; x++) {
            blockedUsers.push(findUser[x].innerText);
          }
          removeBlockedUsers();
        });
    }
    function removeBlockedUsers() {
      //Remove Blocked User's Forum Reply
      let forumReply = document.querySelectorAll(".message-wrapper > div.profile");
      for (let x = 0; x < forumReply.length; x++) {
        for (let y = 0; y < blockedUsers.length; y++) {
          if (forumReply[x].children[0].innerText === blockedUsers[y]) {
            forumReply[x].parentElement.parentElement.remove();
          }
        }
      }
      //Remove Blocked User's Forum Topics
      let ForumTopic = document.querySelectorAll("#forumTopics tr[data-topic-id]");
      for (let x = 0; x < ForumTopic.length; x++) {
        for (let y = 0; y < blockedUsers.length; y++) {
          if (ForumTopic[x].children[1].children[4].innerText === blockedUsers[y]) {
            ForumTopic[x].remove();
          }
        }
      }
      //Remove Blocked User's Forum Reply (Conversation View)
      let forumReplyV = document.querySelectorAll(".messages.replies.parents .message");
      for (let x = 0; x < forumReplyV.length; x++) {
        if (!forumReplyV[x].getAttribute('checked')) {
          for (let y = 0; y < blockedUsers.length; y++) {
            if (forumReplyV[x].children[0].children[1].children[0].children[0].innerText === blockedUsers[y]) {
              forumReplyV[x].remove();
            }
          }
          forumReplyV[x].setAttribute('checked',1);
        }
      }
    }
    //Conversation View - If new forum reply loaded, check blockedUsers
    if (document.querySelectorAll(" .content > div.user > div.item.update").length) {
      let target = document.querySelector(".messages.replies.parents");
      let observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          removeBlockedUsers();
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
    }
  }
  // Forum Hide Blocked Users //--End--//

  // Forum Change Date Format //--START--//
  if (svar.forumDate && (/\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href))) {
    changeDate();
    function changeDate() {
      let dateData = document.querySelectorAll(".message-header > .date").length > 0 ? document.querySelectorAll(".message-header > .date") : document.querySelectorAll(".content > div.user > div.item.update");
      let lastPost = document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4)");
      if(lastPost) {
        for (let x = 0; x < lastPost.length; x++) {
          let t = $(lastPost[x]).find('br').get(0).nextSibling.nodeValue;
          let t2 = t.replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)/gm, '$1').replace(',',' ');
          lastPost[x].innerHTML = lastPost[x].innerHTML.replace(t,'<span>'+t2+'</span>');
        }
      }
      let topicDate = Array.prototype.slice.call(document.querySelectorAll("#forumTopics tr[data-topic-id] .lightLink")).concat(Array.prototype.slice.call(document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4) span")));
      dateData = topicDate.length ? topicDate : dateData;
      let date,datenew;
      const yearRegex = /\b\d{4}\b/;
      for (let x = 0; x < dateData.length; x++) {
        if(!dateData[x].getAttribute('dated')) {
          date = topicDate.length ? dateData[x].innerText + ', 00:00 AM' : dateData[x].innerText;
          datenew = date.includes("Yesterday") || date.includes("Today")|| date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
          date = yearRegex.test(date) ? date : date.replace(/(\,)/, ' ' + new Date().getFullYear());
          datenew ? date = dateData[x].innerText : date;
          let timestamp = new Date(date).getTime();
          const timestampSeconds = dateData[x].getAttribute('data-time') ? dateData[x].getAttribute('data-time') : Math.floor(timestamp / 1000);
          dateData[x].title = dateData[x].innerText;
          dateData[x].innerText = datenew ? date : nativeTimeElement(timestampSeconds);
          dateData[x].setAttribute('dated',1);
        }
      }
    }
      if (document.querySelectorAll(".content > div.user > div.item.update").length) {
        let target = document.querySelector('.messages.replies.parents')
        let observer = new MutationObserver(function (mutationsList, observer) {
          for (let mutation of mutationsList) {
            changeDate();
          }
        });
        observer.observe(target, {
          childList: true,
          subtree: true,
        });
      }
    }
  // Forum Change Date Format //--END--//

  //Forum Anime-Manga Embed //--START--//
  if (svar.embed && /\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href)) {
    const embedCache = localforage.createInstance({ name: "MalJS", storeName: "embed" });
    const options = { cacheTTL: 262974383, class: "embed" };
    let acttextfix;
    let id, type, embed, imgdata, data, cached;
    //API Request
    async function fetchData(url) {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              if (response.status === 429) {
                setTimeout(() => resolve(fetchData(url)), 3000);
                return;
              }
            }
            resolve(await response.json());
          } catch (error) {
            reject(error);
          }
        }, 333);
      });
    }
    async function getimgf(id, type) {
      let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
      if (type === "manga") {
        apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
      }
      try {
        const cache = (await embedCache.getItem(id)) || { time: 0 };
        data = await cache;
        if (data && data.data && data.data.status) {
          if (data.data.status === "Finished Airing" || data.data.status === "Finished") {
            options.cacheTTL = 15778476000;
          } else {
            options.cacheTTL = 262974383;
          }
        }
        if (cache.time + options.cacheTTL < +new Date()) {
          data = await fetchData(apiUrl);
          const publishedYear = data.data.published?.prop?.from?.year;
          const airedYear = data.data.aired?.prop?.from?.year;
          await embedCache.setItem(id, {
            data: {
              status: data.data.status,
              score: data.data.score,
              title: data.data.title,
              type: data.data.type,
              genres: data.data.genres,
              season: data.data.season,
              images: data.data.images,
              year: data.data.type !== "Anime" ? (publishedYear || airedYear || "") : (airedYear || ""),
              url: data.data.url,
            },
            time: +new Date(),
          });
          imgdata = data.data.images.jpg.image_url;
          cached = false;
        } else {
          cached = true;
          data = await cache;
          imgdata = data.data.images.jpg.image_url;
        }
        if (imgdata) {
          const publishedYear = data.data.published?.prop?.from?.year;
          const airedYear = data.data.aired?.prop?.from?.year;
          const genres = document.createElement("div");
          genres.classList.add("genres");
          genres.innerHTML = data.data.genres
            ? data.data.genres
                .filter((node) => node.name !== "Award Winning")
                .map((node) => node.name)
                .toString()
                .split(",")
                .join(", ")
            : "";
          const details = document.createElement("div");
          details.classList.add("details");
          details.innerHTML =
            (data.data.type ? data.data.type + " · " : "") +
            (data.data.status ? data.data.status.split("Airing").join("") : "") +
            (data.data.season ? " · " + data.data.season.charAt(0).toUpperCase() + data.data.season.slice(1) : "")  + " " +
            (cached && data.data.year ? data.data.year :
                    data.data.type !== "Anime" && publishedYear ? publishedYear :
                    airedYear ? airedYear :
                    data.data.type === "Anime" && airedYear ? airedYear : "") +
            (data.data.score ? '<span class="embedscore">' + " · " + Math.floor(data.data.score * 10) + "%" + "</span>" : "");
          const dat = document.createElement("div");
          dat.classList.add("embedDiv");
          dat.innerHTML = '<a></a>';
          const namediv = document.createElement("div");
          namediv.classList.add("detailsDiv");
          const name = document.createElement("a");
          name.innerText = data.data.title;
          name.classList.add("embedName");
          name.href = data.data.url;
          const historyimg = document.createElement("a");
          historyimg.classList.add("embedImage");
          historyimg.style.backgroundImage = `url(${imgdata})`;
          historyimg.href = data.data.url;
          data.data.genres.length > 0 ? (genres.style.display = "block") : dat.classList.add("no-genre");
          namediv.append(name, genres, details);
          dat.appendChild(historyimg);
          dat.appendChild(namediv);
          return dat;
        }
      } catch (error) {
        console.error("error:", error);
      }
    }
    //Load Embed
    async function embedload() {
      const c = document.querySelectorAll(".message-wrapper > div.content").length > 0 ? document.querySelectorAll(".message-wrapper > div.content") : document.querySelectorAll(".forum.thread .message");
      for (let x = 0; x < c.length; x++) {
        let content = c[x].innerHTML;
        content = content.replace(/http:\/\/|https:\/\/(myanimelist\.net\/(anime|manga)\.php\?id=)([0-9]+)/gm , 'https://myanimelist.net/$2/$3');
        let matches = content.match(/(?<!Div">)(?<!\w">)<a href="\b(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\/)([0-9]+)([^"'<]+)(?=".\w)/gm);
        matches = matches ? matches.filter(link => !link.includes('/video')) : matches;
        if (matches) {
          let uniqueMatches = Array.from(new Set(matches));
          for (let i = 0; i < uniqueMatches.length; i++) {
            let match = uniqueMatches[i];
            const id = match.split("/")[4];
            const reg = new RegExp("(?<!Div\"\>)("+match.replace(/\./g, "\\.").replace(/\//g, "\\/").replace(/\?/g, ".*?") + '".*?>[a-zA-Z0-9_ ].*?</a>)', "gms");
            if (!id.startsWith('0')) {
              const type = match.split("/")[3];
              let link = create("a", { href: match });
              let cont = create("div", { class: "embedLink", id: id, type: type });
              cont.appendChild(await getimgf(id, type));
              link.appendChild(cont);
              content = content.replace(reg, await DOMPurify.sanitize(cont));
              if (matches.length > 4 && i % 4 === 0) {
                cached ? await delay(33) : await delay(999);
              } else {
                cached ? await delay(33) : await delay(333);
              }
            }
            c[x].innerHTML = content;
          }
          await delay(999);
        }
        if(c[x].className === "message" && !c[x].id) {
          c[x].remove();
        }
      }
    }
    embedload();
  }
  //Forum Anime-Manga Embed //--END--//

  //Profile Section //--START--//
  if (/\/(profile)\/.?([\w-]+)?\/?/.test(current)) {
    let banner = create('div', {class: 'banner',id: 'banner',});
    let shadow = create('div', {class: 'banner',id: 'shadow',});

    const pfloading = create("div", { class: "actloading",style:{position:"fixed",top:"50%",left:"0",right:"0",fontSize:"16px"}},
                           "Loading"+'<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>');
    let username = current.split('/')[2];
    let custombg,custompf,customcss,userimg,customFounded;
    let bgRegex = /(custombg)\/([^"]+)/gm;
    let pfRegex = /(custompf)\/([^"]+)/gm;
    let cssRegex = /(customcss)\/([^"]+)/gm;
     let blockU = create("i", {
      class: "fa fa-ban",
      style: {
        fontFamily: '"Font Awesome 6 Pro"',
        position: 'absolute',
        right: '65px',
        color: 'var(--color-link) !important',
        fontWeight: 'bold',
        fontSize: '12px',
        cursor: 'pointer',
        margin: '60px 10px 0px'},
    });
    blockU.onclick = () => {
      blockUser(username);
    }
    if(username === $(".header-profile-link").text()) {
      blockU.style.display = "none";
    }

    //Wait for user image
    async function imgLoad() {
      userimg = document.querySelector('.user-image.mb8 > img');
      set(0, userimg, { sa: { 0: "position: fixed;opacity:0!important;" }});

      if (userimg && userimg.src) {
        set(0, userimg, { sa: { 0: "position: relative;opacity:1!important;" }});
      }
      else if(!document.querySelector(".btn-detail-add-picture.nolink")) {
        await delay(250);
        await imgLoad();
      }
    }

    async function startCustomProfile () {
      await imgLoad();
      await findCustomAbout();
      if (!customFounded) {
        await findCustomBlogPost();
      }
      if (customcss && svar.customcss) {
        svar.alstyle = false;
        applyAl();
      } else if(customFounded || svar.alstyle === true) {
        svar.alstyle = true;
        applyAl();
      }
      else {
        pfloading.remove();
        document.body.style.removeProperty("overflow");
        document.querySelector('#contentWrapper').setAttribute('style', 'opacity:1');
      }
    }

    if(document.readyState === 'loading') {
      document.addEventListener( 'DOMContentLoaded', startCustomProfile );
    }
    else if (document.readyState === 'interactive' || document.readyState === 'complete') {
      document.querySelector('#contentWrapper').setAttribute('style', 'opacity:0');
      document.body.append(pfloading);
      document.body.style.overflow = "hidden";
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      shadow.setAttribute('style', 'background: linear-gradient(180deg,rgba(6,13,34,0) 40%,rgba(6,13,34,.6));height: 100%;left: 0;position: absolute;top: 0;width: 100%;');
      banner.append(shadow);
      if (svar.alstyle) {
        banner.append(blockU);
      } else{
        document.querySelector('#contentWrapper').prepend(blockU);
        blockU.style.right= "75px";
        blockU.style.margin= "8.5px 0 0 0";
      }
      startCustomProfile();
    }

    //Get Custom Background Image and Custom Profile Image Data from About Section
    async function findCustomAbout() {
      const aboutSection = document.querySelector('.user-profile-about.js-truncate-outer');
      const processAboutSection = (aboutContent) => {
      const bgMatch = aboutContent.match(bgRegex);
      const pfMatch = aboutContent.match(pfRegex);
      const cssMatch = aboutContent.match(cssRegex);
        if (bgMatch) {
          const bgData = bgMatch[0].replace(bgRegex, '$2');
          custombg = JSON.parse(LZString.decompressFromBase64(bgData));
          banner.setAttribute(
          'style',
          `background-color: var(--color-foreground); background: url(${custombg}); background-position: 50% 35%; background-repeat: no-repeat; background-size: cover; height: 330px; position: relative;`
          );
          customFounded = 1;
        }
        if (pfMatch) {
          const pfData = pfMatch[0].replace(pfRegex, '$2');
          custompf = JSON.parse(LZString.decompressFromBase64(pfData));
          document.querySelector('.user-image.mb8 > img').setAttribute('src', custompf);
          customFounded = 1;
        }
        if (cssMatch) {
          const cssData = cssMatch[0].replace(cssRegex, '$2');
          customcss = JSON.parse(LZString.decompressFromBase64(cssData));
        }
      };
      if (aboutSection) {
        processAboutSection(aboutSection.innerHTML);
      } else {
        // If current page not have about section get user about from jikanAPI
        const apiUrl = `https://api.jikan.moe/v4/users/${username}/about`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data && data.data.about) {
            processAboutSection(data.data.about);
          }
        } catch (e) {
          console.error('Error fetching user about data:', e);
        }
      }
    }

    // for modern about, user can use blog post to add custom pf bg and css
    async function findCustomBlogPost() {
      let custompfLink, custombgLink;
      const rssUrl = 'https://myanimelist.net/rss.php?type=blog&u=' + username;
      const response = await fetch(rssUrl);
      const str = await response.text();
      const data = new window.DOMParser().parseFromString(str, "text/xml");
      const items = data.querySelectorAll('item');
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const description = item.querySelector('description').textContent;
        const custompfMatch = description.match(pfRegex);
        const custombgMatch = description.match(bgRegex);
        const customcssMatch = description.match(cssRegex);
        if (custompfMatch) {
          custompfLink = custompfMatch[0].replace(pfRegex, '$2').replace('https://', '');
          custompf = LZString.decompressFromBase64(custompfLink).replace(/"/gm, '');
          document.querySelector('.user-image.mb8 > img').setAttribute('src', custompf);
          customFounded = 1;
        }
        if (custombgMatch) {
          custombgLink = custombgMatch[0].replace(bgRegex, '$2').replace('https://', '');
          custombg = LZString.decompressFromBase64(custombgLink).replace(/"/gm, '');
          banner.setAttribute(
          'style',
          `background-color: var(--color-foreground);background:url(${custombg});background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;`
        );
        customFounded = 1;
        }
        if (customcssMatch) {
          const cssData = customcssMatch[0].replace(cssRegex, '$2');
          customcss = LZString.decompressFromBase64(cssData).substring(1).slice(0, -1);
        }
      }
    }
    //Apply Anilist Style Profile
    async function applyAl() {
    if (svar.customcss) {
      findcss();
      function findcss() {
        if (customcss) {
          $('style:contains(--fg: #161f2f;)').html('');
          styleSheet3.innerText = styles3;
          document.getElementsByTagName("head")[0].appendChild(styleSheet3);
          styleSheet.innerText = styles;
          document.getElementsByTagName("head")[0].appendChild(styleSheet);
          getdata();
          function getdata() {
            let css = document.createElement('style');
            if(customcss.match(/^https.*\.css$/)){
              let cssLink = document.createElement("link");
              cssLink.rel = "stylesheet";
              cssLink.type = "text/css";
              cssLink.href = customcss;
              document.getElementsByTagName("head")[0].appendChild(cssLink);
            }
            else {
              if(customcss.length < 1e6){
                css.innerText = customcss;
                document.getElementsByTagName("head")[0].appendChild(css);
              }
            }
          }
        }
      }
    }
      if (svar.alstyle) {
        //CSS Fix for Anilist Style
        let fixstyle = `
        .l-listitem-3_2_items{margin-right:0}
        .l-listitem-list.row1{margin-right: 0px;margin-left: -46px;}
        .l-listitem-list.row2{margin-left: 24px;}
        .l-listitem .c-aboutme-ttl-lv2{max-width: 420px;}
        .l-ranking-list_portrait-item{flex-basis: 66px;}
        div#modern-about-me-expand-button,.c-aboutme-accordion-btn-icon{display:none}
        #banner a.header-right.mt4.mr0{z-index: 2;position: relative;margin: 60px 10px 0px !important;}
        .loadmore,.actloading {font-size: .8rem;font-weight: 700;padding: 14px;text-align: center;}
        .loadmore {cursor: pointer;background: var(--color-foreground);border-radius: var(--border-radius);}
        #headerSmall + #menu {width:auto!important}
        .profile .user-profile-about.js-truncate-outer{border:var(--border) solid var(--border-color);}
        .profile .btn-truncate.js-btn-truncate.open {padding-bottom:0!important}
        .profile-about-user.js-truncate-inner img,.user-comments .comment .text .comment-text .userimg{-webkit-box-shadow:none!important;box-shadow:none!important}
        .user-profile .user-friends {display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: start;-webkit-justify-content: start;-ms-flex-pack: start;justify-content: start}
        .user-profile .user-friends .icon-friend {margin: 5px!important;}
        .favs{justify-items: center;-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;border:var(--border) solid var(--border-color);
        box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;display: -ms-grid!important;background-color: var(--color-foreground);
        padding:5px;display: grid!important;grid-gap: 5px 5px!important;grid-template-columns: repeat(auto-fill, 76px)!important;-webkit-box-pack: space-evenly!important;-ms-flex-pack: space-evenly!important;
        -webkit-justify-content: space-evenly!important;justify-content: space-evenly!important;margin-bottom: 12px!important;-webkit-border-radius: var(--br);border-radius: var(--br);}
        .word-break img, .dark-mode .profile .user-profile-about .userimg, .profile .user-profile-about .userimg,
        .profile .user-profile-about a .userimg,.profile .user-profile-about .userimg.img-a-r {max-width: 100%;-webkit-box-shadow: none!important;box-shadow: none!important;}
        .profile .user-profile-about .quotetext{margin-left:0px;max-width:100%}
        .profile .user-profile-about iframe {max-width:100%}
        .profile .user-profile-about input.button {white-space: break-spaces;}
        #modern-about-me-inner {overflow:hidden}
         #modern-about-me-inner > *, #modern-about-me-inner .l-mainvisual {max-width:420px!important}
        .l-listitem-list-item {-webkit-flex-basis: 64px;flex-basis: 64px;-ms-flex-preferred-size: 64px;}
        .l-listitem-5_5_items {margin-right: -25px;}
        .historyname{width: 80%;-webkit-align-self: center;-ms-flex-item-align: center;-ms-grid-row-align: center;align-self: center;}
        .historydate{width:25%;text-align: right;}
        .historyimg{background-size:cover;margin-left: -10px;height: 69px;width:50px;margin-top: -9px;margin-right: 10px;padding-right: 5px;}
        .historydiv {height: 50px;background-color: var(--color-foreground);margin: 10px 5px;padding: 10px;border:var(--border) solid var(--border-color);-webkit-border-radius: var(--br);border-radius: var(--br);display: -webkit-box;display: -webkit-flex;
        display: -ms-flexbox;display: flex;-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;overflow: hidden;}
        #horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}
        .favTooltip {text-indent:0;-webkit-transition:.4s;-o-transition:.4s;transition:.4s;position: absolute;background-color: var(--color-foreground4);color: var(--color-text);
        padding: 5px;-webkit-border-radius: 6px;border-radius: 6px;opacity:0;width: -webkit-max-content;width: -moz-max-content;width: max-content;left: 0;right: 0;margin: auto;max-width: 420px;}
        .favs .btn-fav, .user-badge, .icon-friend {overflow:hidden}
        .favs .btn-fav:hover, .user-badge:hover, .icon-friend:hover {overflow:visible!important}
        .favs .btn-fav:hover .favTooltip,.user-badge:hover .favTooltip, .icon-friend:hover .favTooltip{opacity:1}
        .user-profile .user-badges .user-badge:hover,.user-profile .user-friends .icon-friend:hover,.user-profile .user-friends .icon-friend:active{opacity:1!important}
        .dark-mode .user-profile .user-badges .user-badge,.user-profile .user-badges .user-badge {margin:3.5px!important;}
        .max{max-height:99999px!important}`;
        var fixstylesheet = document.createElement('style');
        fixstylesheet.innerText = fixstyle.replace(/\n/g, '');
        document.head.appendChild(fixstylesheet);

        //Get Activity History from MAL and Cover Image from Jikan API
        async function gethistory(l) {
          let title,ep,date,datenew,id,url,type,historyimg,oldimg;
          let wait = 666;
          let c = l ? l - 12 : 0;
          let length = l ? l : 12;
          let head = create("h2", { class: "mt16" }, "Activity");
          const loading = create("div", { class: "actloading" },"Loading"+'<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-size:12px;font-family:FontAwesome"></i>');
          const html = await fetch("https://myanimelist.net/history/"+username)
          .then((response) => response.text())
          .then(async(data) => {
            let newDocument = new DOMParser().parseFromString(data, "text/html");
            let item = newDocument.querySelectorAll("#content > div.history_content_wrapper > table > tbody > tr > td.borderClass:first-child");
            length = item.length < length ? item.length : length;
            document.querySelector('#statistics').insertAdjacentElement('afterend', loading);
            for (let x = c; x < length; x++){
              if (x === 0) {
                head.style.marginLeft="5px";
                document.querySelector('#statistics').insertAdjacentElement('beforeend', head);
              }
              type = item[x].querySelector("a").href.split('.')[1].split('/')[1];
              url = item[x].querySelector("a").href;
              id = item[x].querySelector("a").href.split('=')[1];
              title = item[x].querySelector("a").outerHTML;
              ep = item[x].querySelector("strong").innerText;
              date = item[x].parentElement.children[1].innerText.split("Edit").join("");
              datenew = date.includes("Yesterday") || date.includes("Today")|| date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
              date = datenew ? date : date.split(",").join(" "+new Date().getFullYear());
              let dat = create("div", { class: "historydiv" });
              let name = create("div", { class: "historyname" });
              let timestamp = new Date(date).getTime();
              const timestampSeconds = Math.floor(timestamp / 1000);
              let historydate = create("div", { class: "historydate", title: date }, datenew ? date : nativeTimeElement(timestampSeconds));
              let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
              if (type === 'anime') {
                name.innerHTML = 'Watched  episode ' + ep + ' of ' + '<a href="' + url + '">' + title + '</a>';
              } else {
                apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
                name.innerHTML = 'Read chapter ' + ep + ' of ' + '<a href="' + url + '">' + title + '</a>';
              }
              async function getimg(url) {await fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                oldimg = data.data?.images ? data.data.images.jpg.image_url : 'https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c';
                historyimg = create('a', {
                  class: 'historyimg',
                  href: url,
                  style: {
                    backgroundImage: 'url(' +  oldimg + ')',
                  },
                });
              })};
              if(x!== 0 && x!== c && item[x - 1].querySelector("a").outerHTML === (item[x].querySelector("a").outerHTML)){
                wait = 111;
                historyimg = create('a', {
                  class: 'historyimg',
                  href: url,
                  style: {
                    backgroundImage: 'url(' +  oldimg + ')',
                  },
                });
              }
              else {
                wait = 999;
                await getimg(url);
              }
              dat.append(historyimg, name);
              dat.append(historydate);
              document.querySelector('#statistics').insertAdjacentElement('beforeend', dat);
              await delay(wait);
            }
            loading.remove();
            if(item.length > length){
              let loadmore = create("div", { class: "loadmore" },"Load More");
              loadmore.onclick = () => {
                gethistory(length+12);
                loadmore.remove();
              }
              document.querySelector('#statistics').insertAdjacentElement('afterend', loadmore);
            }
          });
        }
        //Make Profile looks like Anilist
        svar.profileHeader = !1;
        let about = document.querySelector(".user-profile-about.js-truncate-outer");
        let modernabout = document.querySelector("#modern-about-me");
        let avatar = document.querySelector(".user-image");
        let name = $('span:contains("s Profile"):last');
        let container = create("div", { class: "container", id: "container" });
        let headerRight = document.querySelector("a.header-right.mt4.mr0");
        container.setAttribute("style", "margin: 0 auto;min-width: 320px;max-width: 1240px;left: -40px;position: relative;height: 100%;");
        if (!custombg) {
          banner.setAttribute("style", "background-color: var(--color-foreground);background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;");
        }
        document.querySelector("#myanimelist").setAttribute("style", "min-width: 1240px;width:100%");
        set(1, "#myanimelist .wrapper", { sa: { 0: "width:100%;display:table" } });
        document.querySelector("#contentWrapper").insertAdjacentElement("beforebegin", banner);
        banner.append(container);
        headerRight ? banner.prepend(headerRight) : null;
        container.append(avatar);
        about ? about.classList.add("max") : null;
        modernabout ? modernabout.classList.add("max") : null;
        if (set(0, about, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
          document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", about);
        }
        if (set(0, modernabout, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
          document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", modernabout);
          let l = document.querySelectorAll(".l-listitem");
          let a = "max-width:420px";
          set(2, ".l-listitem", { sal: { 0: "-webkit-box-pack: center;display: flex;-ms-flex-pack: center;justify-content: center;flex-wrap: wrap;flex-direction: row;" } });
          set(1, ".l-mainvisual", { sa: { 0: a } });
          set(1, ".intro-mylinks-wrap", { sa: { 0: a } });
          set(1, ".l-intro", { sa: { 0: a } });
          set(1, ".l-intro-text-wrap-1", { sa: { 0: a } });
          set(1, ".copy-wrap-1", { sa: { 0: a } });
          set(1, ".mylinks-ul", { sa: { 0: a } });
        }
        if (about || modernabout) {
          if (set(1, ".user-profile h1:first-child", { sa: { 0: "position: absolute;top: 50px;right: 0;" } })) {
            banner.append(document.querySelector(".user-profile h1:first-child"));
          }
          $('a:contains("About Me Design"):last').remove();
        }
        set(1, ".user-image img", { sa: { 0: "display: inline-block;max-height: 230px;max-width: 160px;width: 100%;box-shadow:none!important" } });
        set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
        document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
        set(1, ".user-statistics-stats.mt16", { sa: { 0: "margin-top:8px!important" } });
        set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
        document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
        avatar.setAttribute("style", "display: flex;height: inherit;align-items: flex-end;position: relative;width:500px;");
        name.css({ "font-size": "2rem", "font-weight": "800", left: "35px", top: "-35px" });
        name.html(name.html().replace(/'s Profile/g, "\n"));
        avatar.append(name[0]);
        set(2, "#container span.profile-team-title.js-profile-team-title", { sl: { top: "18px" } });
        container.append(document.querySelector(".user-function.mb8"));
        if(username === $(".header-profile-link").text()) {
          $(".user-function.mb8").addClass('display-none');
        }
        set(1, "a.btn-profile-submit.fl-l", { sa: { 0: "width:50%" } });
        set(1, "a.btn-profile-submit.fl-r", { sa: { 0: "width:50%" } });

        if (set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } })) {
          set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } });
        }
        if (set(1, ".bar-outer.anime", { sa: { 0: "width:100%" } })) {
          set(1, ".bar-outer.manga", { sa: { 0: "width:100%" } });
        }
        set(1, ".user-function.mb8", { sa: { 0: "position: relative;left: 100%;top: -50px;display: flex;width: 100px;font-size: 1rem;justify-content: flex-end;gap:6px;" } });
        set(2, ".user-function.mb8 a", { sal: { 0: "border:none!important;box-shadow:none!important" } });
        set(2, ".user-function.mb8 span", { sal: { 0: "border:none!important;box-shadow:none!important" } });
        if (set(1, ".content-container", { sa: { 0: "display: grid!important;grid-template-columns: 33% auto;margin-top: 30px;justify-content: center;" } })) {
          set(1, ".container-left", { sa: { 0: "width:auto" } });
          set(1, ".container-right", { sa: { 0: "width:auto;min-width:800px" } });
        }
        if (set(1, "#content > table > tbody > tr > td.profile_leftcell", { sa: { 0: "width:auto" } })) {
          set(1, "#content > table > tbody > tr", { sa: { 0: "display: grid!important;grid-template-columns: 33% auto;margin-top: 10px;justify-content: center;" } });
          set(1, "#content > table > tbody > tr > td.pl8", { sa: { 0: "width: auto;position:relative;min-width:800px" } });
        }
        set(1, ".user-profile", { sa: { 0: "width:auto;" } });
        set(2, ".user-profile li", { sal: { 0: "width:auto" } });
        set(1, ".quotetext", { sa: { 0: "margin-left:0;" } });
        if (set(1, "#lastcomment", { sa: { 0: "padding-top:0" } })) {
          document.querySelector("#content > div > div.container-right").prepend(document.querySelector("#lastcomment"));
        }
        if ($(".head-config").next().is(".boxlist-container.badge")) {
          $(".head-config").remove();
        }
        set(1, "#content > table > tbody > tr > td.pl8 > #horiznav_nav", { r: { 0: 0 } });
        set(1, ".container-right #horiznav_nav", { r: { 0: 0 } });
        document.querySelector("#contentWrapper").setAttribute("style", "width: 1375px;max-width: 1375px!important;min-width:500px; margin: auto;top: -40px;transition:.6s;opacity:1");
        pfloading.remove();
        document.body.style.removeProperty("overflow");
        let more = document.querySelector(".btn-truncate.js-btn-truncate");
        if (more) {
          more.setAttribute("data-height", '{"outer":1000,"inner":90000}');
        }
        let s = document.querySelector("#statistics");
        if (s) {
          s.setAttribute("style", "width: 813px");
          s.children[1].append(document.querySelector("#statistics .stats.manga"));
          s.children[2].prepend(document.querySelector("#statistics .updates.anime"));
          s.prepend(document.querySelector("#statistics > div:nth-child(2)"));
          document.querySelector(".container-right").prepend(s);
          $('h2:contains("Statistics"):last').remove();
          let favs = create("div", { class: "favs" });
          let favs2 = create("div", { class: "favs" });
          let favs3 = create("div", { class: "favs" });
          let favs4 = create("div", { class: "favs" });
          let favs5 = create("div", { class: "favs" });
          document.querySelector("#content > div > div.container-left > div > ul:nth-child(4)").prepend(favs, favs2, favs3, favs4, favs5);
          getfavs();
          function getfavs() {
            let favc = ["#anime_favorites", "#manga_favorites", "#character_favorites", "#person_favorites", "#company_favorites"];
            let fave = [favs, favs2, favs3, favs4, favs5];
            let f, c;
            for (let l = 0; l < 5; l++) {
              f = document.querySelector(favc[l]);
              if (!f) {
                fave[l].remove();
              } else {
                fave[l].insertAdjacentElement("beforebegin", f.previousElementSibling);
                c = document.querySelectorAll(favc[l] + " ul > li");
                for (let x = 0; x < c.length; x++) {
                  let r = c[x].querySelectorAll("span");
                  for (let y = 0; y < r.length; y++) {
                    r[y].remove();
                  }
                  c[x].setAttribute("style", "width:76px");
                  fave[l].append(c[x]);
                }
                f.remove();
              }
            }
          }
          let userFavs = document.querySelectorAll("li.btn-fav");
          let userBadges = document.querySelectorAll(".user-badge");
          let userFriends = document.querySelectorAll(".icon-friend");
          let collection = Array.from(userFavs).concat(Array.from(userBadges), Array.from(userFriends));
          for (let btnFav of collection) {
            btnFav.tagName === "A" ? btnFav.innerText = "" : "";
            btnFav.style.position = "relative";
            btnFav.style.display = "flex";
            btnFav.style.justifyContent = "center";
            if(btnFav.attributes.title){
              btnFav.setAttribute("data-title",btnFav.attributes.title.textContent);
              btnFav.removeAttribute("title");
            }
            let title = btnFav.getAttribute("data-title");
            if (title) {
              let tt = document.createElement("div");
              tt.className="favTooltip";
              tt.textContent = title;
              btnFav.prepend(tt);
              btnFav.tagName === "A" || btnFav.classList[0] && btnFav.classList[0] === "user-badge" ? tt.style.marginTop = "-5px" : "";
              tt.style.top = -tt.offsetHeight+"px";
            }
          };
          document.querySelector(".container-right > h2.mb12").remove();
          set(1, ".container-right > .btn-favmore", { r: { 0: 0 } });
          set(2, "ul.user-status.border-top h5", { sal: { 0: "font-size: 11px;margin-bottom: 8px;margin-left: 2px;" } });
          set(2, ".container-left h4", { sal: { 0: "font-size: 11px;margin-left: 2px;" } });
          const favHeader = document.querySelectorAll('ul.user-status.border-top h5');
          for(let i = 0; i < favHeader.length; i++) {
            favHeader[i].innerText = favHeader[i].innerText.replace(/ (.*)/, '');
          }
          set(1, ".favs", { sap: { 0: "box-shadow: none!important;" } });
          gethistory();
        }
        //Add Navbar to Profile Banner
        let nav = create("div", { class: "navbar", id: "navbar" });
        nav.innerHTML =
          '<div id="horiznav_nav" style="margin: 0;height: 45px;align-content: center;"><ul>'+
          '<li><a href="/profile/'+username+'">Overview</a></li><li><a href="/profile/'+username+'/statistics">Statistics</a></li>'+
          '<li><a href="/profile/'+username+'/favorites">Favorites</a></li><li><a href="/profile/'+username+'/reviews">Reviews</a></li>'+
          '<li><a href="/profile/'+username+'/recommendations">Recommendations</a></li><li><a href="/profile/'+username+'/stacks">Interest Stacks</a></li><li><a href="/profile/'+username+'/clubs">Clubs</a></li>'+
          '<li><a href="/profile/'+username+'/badges">Badges</a></li><li><a href="/profile/'+username+'/friends">Friends</a></li></ul></div>';
        banner.insertAdjacentElement('afterend', nav);
        nav.setAttribute('style', 'z-index: 2;position: relative;background: #000;text-align: center;background-color: var(--color-foreground) !important;');
        let navel = document.querySelectorAll('#navbar #horiznav_nav > ul > li > a');
        $('h2:contains("Synopsis"):last').parent().addClass('SynopsisDiv');
        let n = current.split('/')[3];
        if (!n) {
          $(navel[0]).addClass('navactive');
        } else {
          n = n.charAt(0).toUpperCase() + n.slice(1);
          $('.navbar a:contains(' + n + ')').addClass('navactive');
        }
        set(0, navel, { sal: { 0: "margin: 0 30px;font-size: .9rem;box-shadow: none!important;" } });
      } else {
        pfloading.remove();
        document.body.style.removeProperty("overflow");
        document.querySelector('#contentWrapper').setAttribute('style', 'opacity:1');
      }
    }
    if (svar.profileHeader) {
      let title = document.querySelector('#contentWrapper > div:nth-child(1)');
      title.children[0].setAttribute('style', 'padding-left: 2px;margin-bottom:12px');
      let table = document.querySelector('.user-profile-about.js-truncate-outer');
      if (!table) {
        table = document.querySelector('#content > div > div.container-right > div > div:nth-child(1)');
      }
      if (table) {
        table.prepend(title);
      }
    }
  }
  //Profile Section //--END--//

  //Character Section //-START-//
  if (/\/(character)\/.?([\w-]+)?\/?/.test(current) && !(/\/(clubs)/.test(current)) && !(/\/(pics)/.test(current))) {
    let regex = /(Member Favorites).*/g;
    let match = document.createElement('p');
    let fav = document.querySelector('#content > table > tbody > tr > td.borderClass');
    match.innerText = fav.innerText.match(regex);
    fav.innerHTML = fav.innerHTML.replace(regex, '');
    if (match) {
      document.querySelector('#v-favorite').insertAdjacentElement('beforebegin', match);
    }
    $('div:contains("Voice Actors"):last').addClass('VoiceActorsDiv');
    while ($('.VoiceActorsDiv').next('table').length > 0) {
      $('.VoiceActorsDiv').append(
        $('.VoiceActorsDiv').next('table').addClass('VoiceActorsDivTable').css({
          backgroundColor: 'var(--color-foreground)',
          borderRadius: 'var(--br)',
          marginTop: '8px',
          border:'var(--border) solid var(--border-color)',
        }),
      );
      $('.VoiceActorsDivTable').children().children().children().children('.picSurround').children().children().css({
        width: '60px !important',
        height: '80px',
        objectFit: 'cover',
      });
      $('.VoiceActorsDivTable').children().children().children().css({
        border: '0',
      });
    }
    $('.VoiceActorsDiv').css({
      marginTop: '10px',
    });
    $('h2:contains("Recent Featured Articles"):last').addClass('RecentFeaturedArticlesDiv').append($('.RecentFeaturedArticlesDiv').next());
    $('.RecentFeaturedArticlesDiv').css({
      marginTop: '10px',
    });
    $('.RecentFeaturedArticlesDiv').children('div:last-child').css({
      marginTop: '8px',
    });
    $('.RecentFeaturedArticlesDiv').children().children().css('width', '99%').children().css('borderRadius', 'var(--br)');
    let doc;
    let main = document.querySelector('#content > table > tbody > tr > td:nth-child(2)');
    $(main).addClass('characterDiv');
    let text = create('div', {
      class: 'description',
      itemprop: 'description',
      style: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginTop: '5px',
        whiteSpace: 'pre-wrap',
        border:'var(--border) solid var(--border-color)',
      },
    });
    main.childNodes.forEach(function (el, i) {
      if (
        i >= 5 &&
        el !== document.querySelector('.VoiceActorsDiv') &&
        el !== document.querySelector('h2') &&
        el !== document.querySelector('.RecentFeaturedArticlesDiv') &&
        el.innerText !== 'Voice Actors' &&
        el.innerText !== 'More Videos\nEpisode Videos' &&
        el.innerText !== 'Episode Videos' &&
        el.id !== 'episode_video' &&
        el.id !== 'CallFunctionFormatMoreInfoText'
      ) {
        if (el.innerHTML === undefined) {
          text.innerHTML += el.textContent;
        } else {
          text.innerHTML += el.innerHTML;
        }
      }
    });
    let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, '');
    text.innerHTML = fixtext;
    if (document.querySelector('#content > table > tbody > tr > td.characterDiv > br:nth-child(5)')) {
      doc = document.querySelector('#content > table > tbody > tr > td.characterDiv > br:nth-child(5)');
    } else {
      doc = document.querySelector('#content > table > tbody > tr > td.characterDiv > br:nth-child(6)');
    }
    doc.before(text);
    $.trim($('.characterDiv').contents().not($('.description')).not($('.VoiceActorsDiv')).not($('#horiznav_nav')).not($('.breadcrumb')).not($('h2')).not($('table')).remove());
    $('.description').children().not($('li')).not($('input')).not($('span.spoiler_content')).remove();
    let spofix = document.querySelectorAll('.spoiler_content > input');
    $('.spoiler_content').css({
      background: 'var(--color-foreground4)',
      borderRadius: 'var(--br)',
      padding: '0px 5px 5px',
      margin: '5px 0px',
    });
    for (let x = 0; x < spofix.length; x++) {
      spofix[x].setAttribute('onclick', "this.parentNode.style.display='none';this.parentNode.previousElementSibling.style.display='inline-block';");
    }
  }
  //Character Section //--END--//

  //Anime/Manga Section//--START--//
  if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && !/\/(anime|manga)\/producer|genre|magazine\/.?([\w-]+)?\/?/.test(current)
      &&!/\/(ownlist|season|recommendations)/.test(current) && !document.querySelector("#content > .error404")) {
    const entryId = current.split("/")[2];
    const entryType = current.split("/")[1].toUpperCase();
    let text = create('div', {
      class: 'description',
      itemprop: 'description',
      style: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginTop: '5px',
        whiteSpace: 'pre-wrap',
        border:'var(--border) solid var(--border-color)',
      },
    });
    const sections = [
      'Information',
      'Alternative Titles',
      'Statistics',
      'Summary Stats',
      'Score Stats',
      'More Info',
      'Resources',
      'Streaming Platforms',
      'Available At',
      'Background',
      'Synopsis',
      'Episode Videos',
      'Related Anime',
      'Related Manga',
      'Related Entries',
      'Characters',
      'Staff',
      'Reviews',
      'Recommendations',
      'Interest Stacks',
      'Recent News',
      'Recent Featured Articles',
      'Recent Forum Discussion',
      'MALxJapan -More than just anime-'
    ];
    sections.forEach(section => aniMangaAddClass(section));

    if ($('.AlternativeTitlesDiv').length) {
      if($("a.js-anime-toggle-alternative-title-button").length > 0 || $("a.js-manga-toggle-alternative-title-button").length > 0) {
        $(".AlternativeTitlesDiv").nextUntil('a').addClass("spaceit-shadow-end").addClass("mb8");
      } else {
        $(".AlternativeTitlesDiv").nextUntil('br').addClass("spaceit-shadow-end");
      }
      document.querySelector('.AlternativeTitlesDiv').nextElementSibling.setAttribute('style', 'border-radius:var(--br);margin-bottom:4px');
      $('span:contains("Synonyms")').parent().next().css({
        borderRadius: 'var(--br)'
      });
    }
    if (document.querySelector('.js-alternative-titles.hide')) {
      document.querySelector('.js-alternative-titles.hide').setAttribute('style', 'border-radius:var(--br);overflow:hidden');
    }
    if ($('.InformationDiv').length) {
      $(".InformationDiv").nextUntil('br').addClass("spaceit-shadow");
      $(".InformationDiv").nextUntil('br').last().removeClass("spaceit-shadow").addClass("spaceit-shadow-end");
      document.querySelector('.InformationDiv').nextElementSibling.setAttribute('style', 'border-top-left-radius:var(--br);border-top-right-radius:var(--br);');
    }
    if ($('.StatisticsDiv').length) {
      $(".StatisticsDiv").nextUntil('br').addClass("spaceit-shadow");
      $(".StatisticsDiv").nextUntil('br').not(".clearfix").last().removeClass("spaceit-shadow").addClass("spaceit-shadow-end").css({ borderBottomLeftRadius:"var(--br)",borderBottomRightRadius:"var(--br)"});
      document.querySelector('.StatisticsDiv').nextElementSibling.setAttribute('style', 'border-top-left-radius:var(--br);border-top-right-radius:var(--br)');
      document.querySelector('.StatisticsDiv').previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
    }
    if ($('.ResourcesDiv').length) {
      $(".ResourcesDiv").next().addClass("spaceit-shadow-end");
      document.querySelector('.ResourcesDiv').previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
      document.querySelector('.ResourcesDiv').nextElementSibling.style.borderRadius = 'var(--br)';
    }
    if ($('.StreamingPlatformsDiv').length) {
      $(".StreamingPlatformsDiv").next(".pb16.broadcasts").attr('style', 'padding-bottom: 12px!important');
      $(".StreamingPlatformsDiv").next().addClass("spaceit-shadow-end");
      document.querySelector('.StreamingPlatformsDiv').nextElementSibling.style.borderRadius = 'var(--br)';
    }
    if ($('.AvailableAtDiv').length) {
      $(".AvailableAtDiv").next().addClass("spaceit-shadow-end");
      document.querySelector('.AvailableAtDiv').nextElementSibling.style.borderRadius = 'var(--br)';
      document.querySelector('.AvailableAtDiv').previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
    }
    if($('.SummaryStatsDiv').length){
      const statsDiv = create("div", { class: "statsDiv spaceit-shadow-end" });
      const statElements = $('.SummaryStatsDiv').nextUntil('br');
      $('.SummaryStatsDiv').after(statsDiv);
      statsDiv.setAttribute('style', 'border-radius:var(--br);overflow:hidden;display: -ms-grid;display: grid;-ms-grid-columns: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;border:var(--border) solid var(--border-color)');
      $(statsDiv).append(statElements);
    }
    if($('.score-stats').length){
      $('.score-stats').addClass("spaceit-shadow-end");
    }
    if($('.table-recently-updated').length){
      $('.table-recently-updated').addClass("spaceit-shadow-end");
    }
    if($('.CharactersDiv').length && $('.CharactersDiv')[0].nextSibling.nodeValue && $('.CharactersDiv')[0].nextSibling.nodeValue.includes("No characters or voice")){
      emptyInfoAddDiv('.CharactersDiv');
    }
    if($('.RecommendationsDiv').length && $('.RecommendationsDiv')[0].nextSibling.nodeValue && $('.RecommendationsDiv')[0].nextSibling.nodeValue.includes("No recommendations have been made")){
      emptyInfoAddDiv('.RecommendationsDiv');
    }
    if($('.CharactersDiv').length && $('.CharactersDiv')[0].nextSibling.nodeValue && $('.CharactersDiv')[0].nextSibling.nodeValue.includes("No characters ")){
      emptyInfoAddDiv('.CharactersDiv');
      $('.CharactersDiv')[0].nextSibling.innerHTML = $('.CharactersDiv')[0].nextSibling.innerHTML.replace('<br>', '');
    }
    if($('.StaffDiv').length && $('.StaffDiv')[0].nextSibling.nodeValue && $('.StaffDiv')[0].nextSibling.nodeValue.includes("No staff for this")){
      emptyInfoAddDiv('.StaffDiv');
    }
    if($('.MoreInfoDiv').length){
      emptyInfoAddDiv('.MoreInfoDiv');
    }
    if($('.RecentNewsDiv').length && !$('.RecentNewsDiv').next().is('div')){
      $('.RecentNewsDiv').remove();
    }
    if($(".leftside > div.clearfix.mauto.mt16.spaceit-shadow").length) {
      $(".leftside > div.clearfix.mauto.mt16.spaceit-shadow").last().remove();
    }
    if($('.page-forum:contains("No discussion topic was found.")')[0]){
      $('.page-forum:contains("No discussion topic was found.")')[0].remove();
      $('.RecentForumDiscussionDiv').remove();
    }
    if(svar.editPopup && $('#addtolist a:contains("Edit Details")').length){
      let editDetails = $('#addtolist a:contains("Edit Details")')[0]
      editDetails.className = 'fa fa-pen';
      editDetails.style.fontFamily = 'fontAwesome';
      editDetails.style.padding = '5px';
      editDetails.innerText = "";
      editDetails.href = 'javascript:void(0);';
      editDetails.onclick = async () => {
        await editPopup(entryId,entryType);
      }
    }

    //Background info Fix
    let backgroundInfo = $('h2:contains("Background"):last');

    //Add Banner Image
    if(svar.animeBanner) {
      getBannerImage();
      async function getBannerImage() {
        let bannerData;
        const bannerDiv = create("div", { class: "bannerDiv"});
        const bannerImage = create("img", { class: "bannerImage"});
        const bannerShadow = create("div", { class: "bannerShadow"});
        const bannerTarget = document.querySelector("#content");
        const BannerLocalForage = localforage.createInstance({ name: "MalJS", storeName: "banner" });
        const BannerCache = await BannerLocalForage.getItem(entryId+"-"+entryType);
        if(BannerCache) {
          bannerData = BannerCache;
        }
        else {
          const bannerQuery = `query {Media(idMal:${entryId} type:${entryType}) {bannerImage}}`;
          bannerData = await AnilistAPI(bannerQuery);
          if(bannerData.data.Media && bannerData.data.Media.bannerImage) {
          await BannerLocalForage.setItem(entryId+"-"+entryType, {
            bannerImage:bannerData.data.Media.bannerImage
          });
            bannerData = await BannerLocalForage.getItem(entryId+"-"+entryType);
          } else {
            bannerData = null;
          }
        }
        if(bannerData && bannerData.bannerImage && bannerTarget) {
          let bgColor = getComputedStyle(document.body);
          bgColor = tinycolor(bgColor.getPropertyValue('--bg'));
          const leftSide = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
          const bannerHover = create("div", { class: "bannerHover"});
          const bannerShadowColor = [bgColor.setAlpha(.1).toRgbString(),bgColor.setAlpha(.0).toRgbString(),bgColor.setAlpha(.6).toRgbString()];
          bannerShadow.style.background = `linear-gradient(180deg,${bannerShadowColor[0]},${bannerShadowColor[1]} 50%,${bannerShadowColor[2]})`;
          leftSide.classList.add("aniLeftSide");
          bannerImage.src = bannerData.bannerImage;
          bannerDiv.append(bannerImage,bannerHover,bannerShadow);
          bannerTarget.prepend(bannerDiv);
          svar.animeHeader = true;
          headerPosChange(1);
          $(bannerHover).on('mouseenter', async function() {
            leftSide.style.top="0"
          });
          $(bannerHover).on('mouseleave', async function() {
            leftSide.style.top="-85px"
          });
        }
      }
    }

    // Add Tags from Anilist
    if(svar.animeTag) {
      getTags();
      async function getTags() {
        let tagData;
        const tagDiv = create("div", { class: "aniTagDiv"});
        const tagTarget = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
        const tagLocalForage = localforage.createInstance({ name: "MalJS", storeName: "tags" });
        const tagcacheTTL = 262974383;
        let tagCache = await tagLocalForage.getItem(entryId+"-"+entryType);
        if (!tagCache || tagCache.time + tagcacheTTL < +new Date()) {
          const tagQuery = `query {Media(idMal:${entryId} type:${entryType}) {tags {isMediaSpoiler name rank description}}}`;
          tagData = await AnilistAPI(tagQuery);
          if (tagData.data.Media && tagData.data.Media.tags && tagData.data.Media.tags.length > 0) {
            await tagLocalForage.setItem(entryId+"-"+entryType, {
              tags: tagData.data.Media.tags,
              time: +new Date(),
            });
            tagCache = await tagLocalForage.getItem(entryId+"-"+entryType);
          }
        }
        if (tagCache) {
          if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className === "clearfix mauto mt16") {
            tagTarget.lastChild.lastElementChild.remove();
          }
          if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className !== "pb16") {
            tagDiv.style.paddingTop = "16px"
          }
          tagDiv.innerHTML = '<h2 style="margin-bottom:-2px;">Tags</h2>';
          tagDiv.innerHTML += tagCache.tags
            .map((node) => `
            <div class="${node.isMediaSpoiler === true ? 'aniTag spoiler' : 'aniTag'}"><a title="${node.description ? node.description : ''}"><div class="aniTag-name">${node.name.replace(/'/g, " ")}</div></a>
            <div class="aniTag-percent">(${node.rank}%)</div></div>`).join('');
          tagTarget.append(tagDiv);
          if($(".aniTagDiv .spoiler").length) {
            let showSpoilers = create("div", { class: "showSpoilers" },"Show " + $(".aniTagDiv .spoiler").length.toString() + " spoiler tags");
              showSpoilers.onclick = () => {
                if($(".aniTagDiv .spoiler").css("display") !== "none") {
                  $(".aniTagDiv .spoiler").css("display","none");
                  $(showSpoilers).text("Show " + $(".aniTagDiv .spoiler").length.toString() + " spoiler tags");
                } else {
                  $(".aniTagDiv .spoiler").css("display","flex");
                  $(showSpoilers).text("Hide spoiler tags");
                }
              }
              tagDiv.append(showSpoilers);
          }
        }
      }
    }

    // Replace Relations
    if(svar.animeRelation) {
      getRelations();
      async function getRelations() {
        let relationData,sortedRelations;
        const relationDiv = create("div", { class: "aniTagDiv"});
        const relationTarget = document.querySelector(".related-entries");
        const relationLocalForage = localforage.createInstance({ name: "MalJS", storeName: "relations" });
        const relationcacheTTL = 262974383;
        let relationCache = await relationLocalForage.getItem(entryId+"-"+entryType);
        const priorityOrder = {"ADAPTATION": 0,"PREQUEL": 1,"SEQUEL": 2,"PARENT": 3,"ALTERNATIVE": 4,"SIDE_STORY": 5,"SPIN_OFF": 6,"CHARACTER": 7,"OTHER": 8};
        if (!relationCache || relationCache.time + relationcacheTTL < +new Date()) {
          const relationQuery = `query {Media(idMal:${entryId} type:${entryType}) {relations {edges {relationType node {status startDate {year} seasonYear type format title {romaji} coverImage {medium large} idMal}}}}}`;
          relationData = await AnilistAPI(relationQuery);
          relationData.data.Media ? relationData = relationData.data.Media.relations.edges.filter(node => node.node.idMal !== null) : null;
          if (relationData.length > 0) {
            // Sort by priorityOrder
            sortedRelations = relationData.sort((a, b) => {
              const orderA = priorityOrder[a.relationType];
              const orderB = priorityOrder[b.relationType];
              return orderA - orderB;
            });
            // Group by relationType
            let groupedRelations = sortedRelations.reduce((acc, curr) => {
              if (!acc[curr.relationType]) {
                acc[curr.relationType] = [];
              }
              acc[curr.relationType].push(curr);
              return acc;
            }, {});
            // Sort each group by year
            for (let type in groupedRelations) {
              groupedRelations[type].sort((a, b) => {
                const yearA = a.node.seasonYear ?? a.node.startDate?.year ?? 0;
                const yearB = b.node.seasonYear ?? b.node.startDate?.year ?? 0;
                return yearA - yearB;
              });
            }
            // Flatten the grouped and sorted relations into a single array
            sortedRelations = Object.values(groupedRelations).flat();
            // relationLocalForage Set Item
            await relationLocalForage.setItem(entryId+"-"+entryType, {
              relations: sortedRelations,
              time: +new Date(),
            });
            relationCache = await relationLocalForage.getItem(entryId+"-"+entryType);
          }
        }
        if (relationCache && relationTarget) {
        $('h2:contains("Related Entries"):last').text("Relations");
        document.querySelector("#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel > table").style.overflow = "visible";
        relationTarget.classList.add("relationsTarget");
        relationTarget.style.setProperty('padding', '10px', 'important');
        relationTarget.classList.add("spaceit-shadow-end");
          relationTarget.innerHTML = relationCache.relations
            .map((node) => {
            const isManga = node.node.type === "MANGA";
            const typePath = isManga ? "manga" : "anime";
            const format = node.node.format ? (node.node.format === "NOVEL" ? node.node.format = "LIGHT NOVEL" : node.node.format) : node.node.type;
            const coverImage = node.node.coverImage && node.node.coverImage.large ? node.node.coverImage.large : node.node.coverImage.medium ? node.node.coverImage.medium :  "";
            const borderColor = isManga ? "#92d493" : "#afc7ee";
            const relationType = node.relationType.split("_").join(" ");
            const title = node.node.title && node.node.title.romaji ? node.node.title.romaji : "";
            const year = node.node.type === "MANGA" && node.node.startDate && node.node.startDate.year
            ? node.node.startDate.year + ' · '
            : node.node.seasonYear
            ? node.node.seasonYear + ' · '
            : node.node.startDate && node.node.startDate.year
            ? node.node.startDate.year + ' · '
            : "";
            const status = node.node.status ? node.node.status.split("_").join(" ") : "";
            return `
            <div class='relationEntry'><a class='link' href='/${typePath}/${node.node.idMal}/'>
            <img class='relationImg' src='${coverImage}' />
            <span class='relationTitle' style='border-color: ${borderColor}!important;'>${relationType}</span>
            <div class='relationDetails' style='color: ${borderColor}!important;'>
            ${relationType}
            <br>
            <div class='relationDetailsTitle'>${title}</div>
            ${format} · ${year}${status}
            </div></a></div>`;
            })
            .join("");

          $(".relationEntry").on('mouseenter', async function() {
            const el = $(this);
            const elDetails = $(this).find(".relationDetails");
            const viewportWidth = window.innerWidth;
            const divRect = elDetails[0].getBoundingClientRect();
            const isOverflowing = divRect.left < 0 || divRect.right > viewportWidth;
            if (isOverflowing) {
              $(el).addClass("relationEntryRight");
              $(elDetails).addClass("relationDetailsRight");
            } else {
              $(el).removeClass("relationEntryRight");
              $(elDetails).removeClass("relationDetailsRight");
            }
          })
          $(".relationEntry").on('mouseleave', async function() {
            const el = $(this);
            const elDetails = $(this).find(".relationDetails");
            $(el).removeClass("relationEntryRight");
            $(elDetails).removeClass("relationDetailsRight");
          })
          if(relationTarget.clientHeight > 140) {
            const relationTargetExpand = create('a', { class: 'relations-accordion-button' });
            const extraRelationsDiv = create('div', { class: 'relationsExpanded', style: { display: "none" } });
            const extraRelations = relationTarget.querySelectorAll(".relationEntry");
            relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
            for (let i = 0; i < extraRelations.length; i++) {
              if(relationTarget.clientHeight > 144) {
                extraRelationsDiv.appendChild(relationTarget.querySelector(".relationEntry:last-child"));
              }
            }
            relationTarget.append(extraRelationsDiv);
            const extraDivs = Array.from(extraRelationsDiv.children);
            const reversedDivs = extraDivs.reverse();
            extraRelationsDiv.innerHTML = '';
            reversedDivs.forEach(div => extraRelationsDiv.appendChild(div));
            relationTarget.insertAdjacentElement("afterend", relationTargetExpand);
            relationTarget.querySelector("div:nth-child(1)").style.marginLeft="8px";
            extraRelationsDiv.setAttribute('style', 'display:none!important');
            relationTarget.setAttribute('style', 'margin-bottom:5px;padding:12px 4px!important');
            relationTargetExpand.addEventListener('click', function () {
              if (extraRelationsDiv.style.display === 'none') {
                extraRelationsDiv.setAttribute('style', 'display:flex!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
              } else {
                extraRelationsDiv.setAttribute('style', 'display:none!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
              }
            });
          }
        }
      }
    }

    if (!/(.*anime|manga)\/.*\/.*\/\w.*/gm.test(current)) {
      let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)[valign='top'] tr > td[valign='top']");
      for (let x = 0; x < 1; x++) {
        main.childNodes.forEach(function (el, i) {
          if (
            i >= 4 &&
            el.class !== 'SynopsisDiv' &&
            el.innerText !== 'Related Manga' &&
            el.innerText !== 'More Videos\nEpisode Videos' &&
            el.innerText !== 'Episode Videos' &&
            el.id !== 'episode_video' &&
            el.id !== 'CallFunctionFormatMoreInfoText'
          ) {
            text.innerHTML += el.textContent;
          }
        });
        for (let x = 0; x < 10; x++) {
          main.childNodes.forEach(function (el, i) {
            {
              if (
                i >= 4 &&
                el.class !== 'SynopsisDiv' &&
                el.innerText !== 'Related Manga' &&
                el.innerText !== 'More Videos\nEpisode Videos' &&
                el.innerText !== 'Episode Videos' &&
                el.id !== 'episode_video' &&
                el.id !== 'CallFunctionFormatMoreInfoText'
              ) {
                el.remove();
              }
            }
          });
        }
      }
      let textfix = text.innerHTML.replace(/<br>.*\s/gm, '').replace(/\n\s{3,10}/g, '');
      if (textfix.includes("No background")) {
        textfix = textfix.replace(/(information here.+)/gm, 'information <a href="/dbchanges.php?aid='+entryId+'&amp;t=background">here</a>.')
      }
      text.innerHTML = textfix;
      backgroundInfo.append(text);
      if($('.SynopsisDiv').next('span').length) {
        $('.SynopsisDiv').next('span').html($('.SynopsisDiv').next('span').html().replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, ''));
      }
      if($('.SynopsisDiv').next('p').length) {
        $('.SynopsisDiv').next('p').html($('.SynopsisDiv').next('p').html().replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, ''));
      }
    }
  }
  //Anime/Manga Section //--END--//

  //People fix details and add shadow
  if (/\/(people)\/.?([\w-]+)?\/?/.test(current)) {
    peopleDetailsAddDiv('Family name:');
    peopleDetailsAddDiv('Website:');
    let peopleDivShadow = document.querySelector("#content > table > tbody > tr > td.borderClass  .spaceit_pad");
    if (peopleDivShadow) {
      $(peopleDivShadow).addClass("spaceit-shadow-people");
      $(peopleDivShadow).nextUntil('div:not(.spaceit_pad)').addClass("spaceit-shadow-people");
      $(peopleDivShadow).nextUntil('div:not(.spaceit_pad)').last().removeClass("spaceit-shadow-people").addClass("spaceit-shadow-people-end")
        .css({ borderBottomLeftRadius:"var(--br)",borderBottomRightRadius:"var(--br)",marginBottom:"10px",border:"var(--border) solid var(--border-color)"});
      $(peopleDivShadow).css({ borderTopLeftRadius:"var(--br)",borderTopRightRadius:"var(--br)",});
      $('div:contains("Website:"):last').html() === 'Website: <a href="http://"></a>' ? $('div:contains("Website:"):last').remove() : null;
      $('div:contains("Family name:"):last').html() === 'Family name: ' ? $('div:contains("Family name:"):last').remove() : null;
      $('span:contains("More:"):last').css({display: 'block',padding: '2px'});
    }
  }

  //Companies add border and shadow
  if(/\/(anime|manga)\/producer\/\d.?([\w-]+)?\/?/.test(current)) {
    let studioDivShadow = document.querySelector("#content > div.content-left > div.mb16:nth-last-child(3");
    if ($(studioDivShadow).length && $(studioDivShadow).children().css('flex') !== '1 1 0%') {
      $('#content > div.content-left > div.mb16:nth-last-child(3)').children().addClass("spaceit-shadow-studio");
    }
  }

  //People and Character Name Position Change  //--START--//
  if ((/\/(people)\/.?([\w-]+)?\/?/.test(current) && svar.peopleHeader) || (/\/(character)\/.?([\w-]+)?\/?/.test(current) && svar.characterHeader)) {
    let name = document.querySelector('.h1.edit-info');
    name.getElementsByTagName('strong')[0].style.fontSize = '1.3rem';
    name.setAttribute('style', 'padding-left:5px;padding-top:10px;height:20px');
    document.querySelector('#content').style.paddingTop = '20px';
    let table = document.querySelector('#content > table > tbody > tr > td:nth-child(2)');
    table.prepend(name);
    if (/\/(character)\/.?([\w-]+)?\/?/.test(current) && !(/\/(clubs)/.test(current)) && !(/\/(pics)/.test(current)) && svar.characterHeader) {
      if (!svar.characterNameAlt) {
        name.setAttribute('style', 'line-height:25px');
      }
      let extra = document.querySelector('#content > table > tbody > tr > td.characterDiv > h2 > span > small');
      extra.innerText = ' ' + extra.innerText;
      if (svar.characterNameAlt) {
        extra.innerHTML = extra.innerHTML;
        document.querySelector('.h1.edit-info > div.h1-title > h1').append(extra);
        extra.style.lineHeight = '20px';
        if (name.children[0].children[0].children[0].innerText.match(/".*"/gm)) {
          extra.innerHTML = extra.innerHTML + '</br>' + name.children[0].children[0].children[0].innerText.match(/".*"/gm);
          name.children[0].children[0].children[0].innerText = name.children[0].children[0].children[0].innerText.replace(/".*"/gm, '');
        } else {
          extra.innerHTML = '</br>' + extra.innerHTML;
        }
      }
      document.querySelector('#content > table > tbody > tr > td.characterDiv > h2').remove();
    }
  }
  //People and Character Name Position Change //--END--//

  //Anime and Manga Header Position Change //--START--//
  headerPosChange();
  function headerPosChange(v){
    if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && (svar.animeHeader || v) &&
        !/\/(anime|manga)\/producer|genre|magazine\/.?([\w-]+)?\/?/.test(current) && !document.querySelector("#content > .error404")) {
      set(1, ".h1.edit-info", { sa: { 0: "margin:0;width:97.5%" } });
      set(1, "#content > table > tbody > tr > td:nth-child(2) > .js-scrollfix-bottom-rel", { pp: { 0: ".h1.edit-info" } });
      const titleOldDiv = document.querySelector("#contentWrapper > div:nth-child(1)");
      if(titleOldDiv && titleOldDiv.innerHTML === '') {
        titleOldDiv.remove();
      }
    }
  }
  //Anime and Manga Header Position Change //--END--//

  //Clubs Page add class to Divs
  if (/\/(clubs.php).?([\w-]+)?\/?/.test(current)) {
    $("div.normal_header").next("table").addClass("clubDivs");
    $("div.bgNone").addClass("clubDivs");
    $("div.bgColor1").addClass("clubDivs");
    $('div.normal_header:contains("Club Pictures")').next().children().children().children().addClass("clubDivs");
    $("#content > table > tbody > tr > td[valign=top]:last-child").addClass("clubDivs");
    set(2, ".clubDivs", { sal: { 0: "border-radius:var(--br);overflow:hidden" } });
  }

  //Anime-Manga Background Color from Cover Image //--START--//
  if (/myanimelist.net\/(anime|manga|character|people)\/?([\w-]+)?\/?/.test(location.href) && !document.querySelector("#content > .error404")) {
    let m;
    if (
      /\/(character.php)\/?([\w-]+)?/.test(current) ||
      /\/(people)\/?([\w-]+)?\/?/.test(current) ||
      /\/(anime|manga)\/producer|season|genre|magazine\/.?([\w-]+)?\/?/.test(current) ||
      /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(current) ||
      (/\/(character)\/?([\w-]+)?\/?/.test(current) && !svar.charbg) ||
      (/\/(anime|manga)\/?([\w-]+)?\/?/.test(current) && !svar.animebg)
    ) {
      m = 1
    }
    if(!m) {
      styleSheet2.innerText = styles2;
      document.head.appendChild(styleSheet2);
      const colorThief = new ColorThief();
      let img,dominantColor,Palette,t;
      let colors = [];
      async function r() {
        if (!t) {
          if (!Palette) {
            try {
              img.setAttribute('crossorigin', 'anonymous');
              Palette = colorThief.getPalette(img, 10, 5);
              img.removeAttribute('crossorigin');
            } catch {
              await delay(100);
              return r();
            }
            await delay(100);
            return r();
          } else {
            t = 1;
            for (let i = 0; i < Palette.length; i++) {
              let color = tinycolor('rgba(' + Palette[i][0] + ',' + Palette[i][1] + ',' + Palette[i][2] + ', .8)');

              while(color.getLuminance() > 0.08) {
                color = color.darken(1)
              }
              while(color.getLuminance() < 0.04) {
                color = color.brighten(1);
              }
              colors.push(color);
            }
            document.querySelector('body').style
              .setProperty('background', 'linear-gradient(180deg, ' + colors[2].toString() + ' 0%,' + colors[1].toString() + ' 50%, ' + colors[0].toString() + ' 100%)', 'important');
          }
        }
      }
      $(document).ready( async function () {
       await imgLoad();
        async function imgLoad() {
          img = document.querySelector('div:nth-child(1) > a > img');
          set(0, img, { sa: { 0: "position: fixed;opacity:0!important;" }});
          if (img && img.src) {
            set(0, img, { sa: { 0: "position: relative;opacity:1!important;" }});
            await r();
          }
          else {
            await delay(250);
            await imgLoad();
          }
        }
      });
    }
  }
  //Anime-Manga Background Color from Cover Image //--END--//

  if (svar.animeSongs) {
  //Anisongs for MAL //--START--//
  //fork of anisongs by morimasa
  //https://greasyfork.org/en/scripts/374785-anisongs
  const anisongs_temp = {
    last: null,
    target: null,
  };
  anisong();
  function anisong() {
    const songCache = localforage.createInstance({ name: "MalJS", storeName: "anisongs" });
    let currentpath = current.match(/(anime|manga)\/([0-9]+)\/[^/]*\/?(.*)/) &&
        !/\/(ownlist|season|recommendations)/.test(current) &&
        !/\/(anime|manga)\/producer|genre|magazine\/.?([\w-]+)?\/?/.test(current) ? current.match(/(anime|manga)\/([0-9]+)\/[^/]*\/?(.*)/) : null;
    let currentid;
    let location;
    if (currentpath && currentpath[1] === "anime") {
      styleSheet1.innerText = styles1;
      document.head.appendChild(styleSheet1);
      currentid = currentpath[2];
      location = currentpath[3];
      if (location !== '') {
        anisongs_temp.last = 0;
      }
      anisongs_temp.target = document.querySelector('.rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)');
      if (anisongs_temp.last !== currentid && location === '') {
        if (anisongs_temp.target) {
          anisongs_temp.last = currentid;
          launch(currentid);
        } else {
          setTimeout(anisong, 500);
        }
      }
    } else if (currentpath && currentpath[1] === "manga") {
      cleaner(anisongs_temp.target);
      anisongs_temp.last = 0;
    } else {
      anisongs_temp.last = 0;
    }
    const options = { cacheTTL: 604800000, class: "anisongs" };
    let anisongdata,op1,ed1;
    const API = {
      //Get Songs from JikanAPI
      async getSongs(mal_id) {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${currentid}/themes`);
        return res.json();
      },
      //Get Videos from AnimeThemesAPI
      async getVideos(anilist_id) {
        const include = ['animethemes.animethemeentries.videos', 'animethemes.song', 'animethemes.song.artists'].join(',');
        const res = await fetch(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=${currentid}&include=${include}`);
        return res.json();
      },
    };
    class VideoElement {
      constructor(parent, url) {
        this.url = url;
        this.parent = parent;
        this.make();
      }
      toggle() {
        if (this.el.parentNode) {
          this.el.remove();
        } else {
          this.parent.append(this.el);
        }
      }
      make() {
        const box = document.createElement('div'),
          vid = document.createElement('video');
        vid.src = this.url;
        vid.controls = true;
        vid.preload = true;
        vid.volume = 0.5;
        box.append(vid);
        this.el = box;
      }
    }
    class Videos {
      constructor(id) {
        this.id = id;
      }
      async get() {
        const {anime} = await API.getVideos(this.id);
        if (anime.length === 0) {
          return {
            OP: [],
            ED: [],
          };
        }
        //Sort and Remove Dubbed OP-ED
        let d = anime ? anime[0].animethemes.sort((a, b) => a.sequence - b.sequence) : null;
        let t = [];
        for (let x = 0; x < d.length; x++) {
          let reg = /Dubbed/;
          if (d[x].group && !d[x].group.match(reg)) {
            t.push(d[x]);
          }
          else if (!d[x].group) {
            t.push(d[x]);
          }
        }
        return Videos.groupTypes(t);
      }
      static groupTypes(songs) {
        const groupBy = (xs, key) => {
          return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        return groupBy(songs, 'type');
      }
      static merge(entries, videos) {
        const cleanTitle = (song) => {
          return song.replace(/^\d{1,2}:/, '');
        };
        const findUrl = (n) => {
          let url;
          if (videos[n]) {
            if (videos[n].animethemeentries[0] && videos[n].animethemeentries[0].videos[0]) {
              url = videos[n].animethemeentries[0].videos[0].link;
            }
            if (url) url = url.replace(/staging\./, '');
          }
          return url;
        };
        if (videos) {
          return entries.map((e, i) => {
            let u = null;
            for (let x = 0; x < videos.length;x++) {
              let vid = videos[x];
              let link = vid.animethemeentries[0].videos[0] && vid.animethemeentries[0].videos[0].link ? vid.animethemeentries[0].videos[0].link : null;
              let m = 0;
              let title = cleanTitle(e).replace(/(\w\d+\: |)/gm,'').replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g,'').replace(/(.*)( by )(.*)/g,'$1')
              .replace(/(.*)( feat. | ft. )(.*)/g,'$1').replace(/(Produced|\WProduced)/g,'').replace(/["']/g, '').replace(/<.*>/g, '').replace(/[^\w\s\(\)\[\]\,\-\:]/g, '').trim();
              let title2 =  vid.song.title ? vid.song.title.replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g,'').replace(/(.*)( by )(.*)/g,'$1')
              .replace(/(.*)( feat. | ft. )(.*)/g,'$1').replace(/(Produced|\WProduced)/g,'').replace(/["']/g, '').replace(/<.*>/g, '').replace(/[^\w\s\(\)\[\]\,\-\:]/g, '').trim() : null;
              let ep = cleanTitle(e).replace(/(.*).((eps|ep) (\w.*\ |)(.*)\))/gm,'$5').replace(/\s/g, '');
              let epdata = vid.animethemeentries[0].episodes;
              let ep2 = epdata && (epdata.constructor !== Array || epdata.length === 1) ? (epdata.constructor !== Array ? epdata.replace(/\s/g, '') : epdata) : null;
              let eps = [];
              if(vid.animethemeentries.length > 1) {
                for(let y = 0; y < vid.animethemeentries.length; y++) {
                  eps.push(vid.animethemeentries[y].episodes);
                }
                eps = eps.join("-").split("-").map(Number);
                eps = eps[0] + "-" + eps[eps.length - 1];
              }
              let artistmatch;
              if(vid.type === "OP" && title) {
                op1 = title;
              }
              if(vid.type === "ED" && title) {
                ed1 = title;
              }
              if (m === 0 && vid.sequence) {
                if (i + 1 === vid.sequence && stringSimilarity(title, vid.song.title) > .8) {
                  u = link;
                  m = 1;
                }
                if (i === vid.sequence || i + 1 === vid.sequence || i + 2 === vid.sequence) {
                  if(stringSimilarity(title, title2) > .8) {
                  }
                }
              }
              if (m === 0 && vid.song.artists !== null && vid.song.artists[0] && vid.song.title !== null) {
                let artist = cleanTitle(e).replace(/\(([^CV: ].*?)\)+?/g,'').replace(/(.*)( by )(.*)/g,'$3').replace(/( feat\. | feat\.| ft\. )/g,', ').replace(/["']/g, '').replace(/\s\[.*\]/gm, '').trim();
                let artistv2 = artist.replace(/(\w.*)( x )(\w.*)/g,'$1');
                let artist2 = cleanTitle(e).replace(/(.*)by \w.*\(([^eps ].*?)\)(.*(eps |ep ).*)/g, '$2').replace(/( feat\. | feat\.| ft\. )/g,', ').replace(/["']/g, '').replace(/\s\[.*\]/gm, '').trim();
                let artists = [];
                let matches = [];
                let match;
                for(let y = 0; y < vid.song.artists.length;y++) {
                  artists.push(vid.song.artists[y].name.replace(/\((.*?)\).?/g,'').replace(/(.*)( by )(.*)/g,'$3').replace(/( feat\. | feat\.| ft\. )/g,', ').replace(/["']/g, '').replace(/\s\[.*\]/gm, '').trim())
                }
                artists = artists.join(", ");
                const cv = /\(CV: ([^\)]+)\)/g;
                if(artist.match(cv)) {
                  while ((match = cv.exec(artist)) !== null) {
                    matches.push(match[1]);
                  }
                  matches = matches.join(", ");
                }
                if (m === 0 && (
                  stringSimilarity(artist, artists) > .85 || stringSimilarity(artist2, artists) > .9 ||
                  stringSimilarity(artistv2, artists) > .9 || matches.length > 0 && stringSimilarity(artists, matches) > .85)) {
                  artistmatch = 1;
                  if (stringSimilarity(title, vid.song.title) > .8 || i === vid.sequence && stringSimilarity(title, title2) > .8 || !vid.sequence && stringSimilarity(title, title2) > .8) {
                    u = link;
                    m = 1;
                  }
                }
              }
              if (m === 0 && (ep === ep2 || ep === eps)) {
                u = link;
                m = 1;
              }
              if (m === 0 && (vid.sequence && artistmatch && vid.slug && videos.length < 10 || !vid.sequence && vid.slug && videos.length < 10)) {
                if (anisongdata && anisongdata.openings.length > 0 && vid.type === "OP"){
                  let n = vid.slug.replace(/(OP)(.*\d)(.*)/g, '$2');
                  if (n === (i + 1).toString() && (!vid.sequence || artistmatch &&  i + 1 === vid.sequence)) {
                  u = link;
                  m = 1;
                  }
                }
                if (anisongdata && anisongdata.endings.length > 0 && vid.type === "ED" && ed1 !== undefined && op1 !== undefined && ed1 !== op1){
                  let n = vid.slug.replace(/(ED)(.*\d)(.*)/g, '$2');
                  if (!vid.sequence && n === (i + 1).toString() || artistmatch && n === (i + 1).toString() &&  i + 1 === vid.sequence) {
                  u = link;
                  m = 1;
                  }
                }
              }
              if(m === 0 && artistmatch && videos.length === 1) {
                u = link;
                m = 1;
              }
            }
            return {
              title: cleanTitle(e),
              url: u,
            };
          });
        }
        return entries.map((e, i) => {
          return {
            title: cleanTitle(e),
          };
        });
      }
    }
    function insert(songs, parent) {
      if (!songs || !songs.length) {
        let song = create('div',{class: 'song',},'',);
        parent.append(song);
      } else {
        songs.forEach((song, i) => {
          song.title = song.title.replace(/(".*")/, '<b>' + '$1' + '</b>');
          const txt = `${i + 1}. ${song.title || song}`;
          const node = create('div', { class: 'theme-songs js-theme-songs',},txt,);
          parent.appendChild(node);
          if (song.url) {
            let play = create('div', {class: 'oped-preview-button oped-preview-button-gray'});
            node.prepend(play);
            const vid = new VideoElement(node, song.url);
            play.addEventListener('click', () => vid.toggle());
            node.classList.add('has-video');
          }
        });
      }
    }

    function createTargetDiv(text, target, pos) {
      let el = document.createElement('div');
      el.appendChild(document.createElement('h2'));
      el.children[0].innerText = text;
      el.classList = options.class;
      target.insertBefore(el, target.children[pos]);
      return el;
    }

    function cleaner(target) {
      if (!target) return;
      let el = target.querySelectorAll(`.${options.class}`);
      el.forEach((e) => target.removeChild(e));
      $('.rightside.js-scrollfix-bottom-rel div.di-t > .di-tc.va-t:has(h2)').remove();
      set(1, '.rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)', {
        sa: {
          0: 'display: grid!important;grid-template-columns: 1fr 1fr;grid-column-gap: 10px;',
        },
      });
      $('.rightside.js-scrollfix-bottom-rel .di-b.ar').remove();
    }

    function placeData(data) {
      let nt = create(
        'div',
        {
          class: 'theme-songs js-theme-songs',
        });
      let nt2 = nt.cloneNode(true);
      cleaner(anisongs_temp.target);
      let op = createTargetDiv('Openings', anisongs_temp.target, 0);
      if (data.opening_themes.length === 1) {
        op.children[0].innerText = 'Openings';
      }
      if (data.opening_themes.length === 0) {
        op.append(nt);
        nt.innerHTML = 'No opening themes have been added to this title. Help improve our database by adding an opening theme '+
          "<a class='embedLink' href='https://myanimelist.net/dbchanges.php?aid=" + currentid + "&t=theme'>" + 'here' + '</a>';
      }
      let ed = createTargetDiv('Endings', anisongs_temp.target, 1);
      if (data.ending_themes.length === 1) {
        ed.children[0].innerText = 'Endings';
      }
      if (data.ending_themes.length === 0) {
        ed.append(nt2);
        nt2.innerHTML = 'No ending themes have been added to this title. Help improve our database by adding an ending theme '+
          "<a class='embedLink' href='https://myanimelist.net/dbchanges.php?aid=" + currentid + "&t=theme'>" + 'here' + '</a>';
      }
      insert(data.opening_themes, op);
      insert(data.ending_themes, ed);

      function addAccordion(div) {
        const aniSongsDiv = document.querySelector(div);
        const themeSongs = aniSongsDiv.querySelectorAll(".theme-songs");
        if (themeSongs.length > 4) {
          const accordionButton = create('a', { class: 'anisong-accordion-button', style: { display: "none" } });
          const extraSongs = create('div', { class: 'anisong-extra-songs', style: { display: "none" } });
          accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
          for (let i = 4; i < themeSongs.length; i++) {
            extraSongs.appendChild(themeSongs[i]);
          }
          aniSongsDiv.append(extraSongs, accordionButton);
          accordionButton.style.display = 'block';
          accordionButton.addEventListener('click', function () {
            if (extraSongs.style.display === 'none') {
              extraSongs.style.display = 'block';
              accordionButton.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
            } else {
              extraSongs.style.display = 'none';
              accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
            }
          });
        }
      }
      addAccordion('div.di-t > div.anisongs:nth-child(1)');
      addAccordion('div.di-t > div.anisongs:nth-child(2)');
    }
    async function launch(currentid) {
      // get from cache and check TTL
      const cache = (await songCache.getItem(currentid)) || {
        time: 0,
      };
      if (cache.time + options.cacheTTL < +new Date()) {
        let mal_id = currentid;
        let status;
        let _videos;
        const apiUrl = `https://api.jikan.moe/v4/anime/${currentid}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            status = data.data.status;
          });
        if (mal_id && ['Finished Airing', 'Currently Airing'].includes(status)) {
          const {data} = await API.getSongs(mal_id);
          let {openings: opening_themes, endings: ending_themes} = data;
          // add songs to cache if they're not empty and query videos
          if (opening_themes.length || ending_themes.length) {
            if (['Finished Airing', 'Currently Airing'].includes(status)) {
              try {
                anisongdata = data;
                _videos = await new Videos(currentid).get();
                opening_themes = Videos.merge(opening_themes, _videos.OP);
                ending_themes = Videos.merge(ending_themes, _videos.ED);
              } catch (e) {
                console.log('Anisongs', e);
              }
            }
          if (_videos) {
            await songCache.setItem(currentid, { opening_themes, ending_themes, time: +new Date() });
          }
          }
          // place the data onto site
          if (await songCache.getItem(currentid)) {
          placeData({
            opening_themes,
            ending_themes,
          });
          };
          return 'Downloaded songs';
        } else {
          return 'No malid';
        }
      } else {
        // place the data onto site
        placeData(cache);
        return 'Used cache';
      }
    }
  }
  //Anisongs for MAL //--END--//
}
})();
