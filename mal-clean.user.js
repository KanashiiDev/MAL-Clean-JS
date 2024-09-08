// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @match       https://myanimelist.net/*
// @grant       none
// @version     1.28.2
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

function AdvancedCreate(HTMLtag, classes, text, appendLocation, cssText) {
    var element = document.createElement(HTMLtag);
    if (Array.isArray(classes)) {
        element.classList.add(...classes);
        if (classes.includes("newTab")) {
            element.setAttribute("target", "_blank");
        }
    } else if (classes) {
        if (classes[0] === "#") {
            element.id = classes.substring(1);
        } else {
            element.classList.add(classes);
            if (classes === "newTab") {
                element.setAttribute("target", "_blank");
            }
        }
    }
    if (text || text === 0) {
        element.innerText = text;
    }
    if (appendLocation && appendLocation.appendChild) {
        appendLocation.appendChild(element);
    }
    if (cssText) {
        element.style.cssText = cssText;
    }
    return element;
}

function createDisplayBox(cssProperties,windowTitle){
  let displayBox = AdvancedCreate("div","maljsDisplayBox",false,document.querySelector("#myanimelist"));
	if(windowTitle){
		AdvancedCreate("span","maljsDisplayBoxTitle",windowTitle,displayBox)
	}
	let mousePosition;
	let offset = [0,0];
	let isDown = false;
	let isDownResize = false;
	let displayBoxClose = AdvancedCreate("span","maljsDisplayBoxClose","x",displayBox);
    displayBoxClose.onclick = function(){
		displayBox.remove();
	};
	let resizePearl = AdvancedCreate("span","maljsResizePearl",false,displayBox);
	displayBox.addEventListener("mousedown",function(e){
		let root = e.target;
		while(root.parentNode){//don't annoy people trying to copy-paste
			if(root.classList.contains("scrollableContent")){
				return
			}
			root = root.parentNode
		}
		isDown = true;
		offset = [
			displayBox.offsetLeft - e.clientX,
			displayBox.offsetTop - e.clientY
		];
	},true);
	resizePearl.addEventListener("mousedown",function(event){
		event.stopPropagation();
		event.preventDefault();
		isDownResize = true;
		offset = [
			displayBox.offsetLeft,
			displayBox.offsetTop
		];
	},true);
	document.addEventListener("mouseup",function(){
		isDown = false;
		isDownResize = false;
	},true);
	document.addEventListener("mousemove",function(event){
		if(isDownResize){
			mousePosition = {
				x : event.clientX,
				y : event.clientY
			};
			displayBox.style.width = (mousePosition.x - offset[0] + 5) + "px";
			displayBox.style.height = (mousePosition.y - offset[1] + 5) + "px";
			return;
		}
		if(isDown){
			mousePosition = {
				x : event.clientX,
				y : event.clientY
			};
			displayBox.style.left = (mousePosition.x + offset[0]) + "px";
			displayBox.style.top  = (mousePosition.y + offset[1]) + "px";
		}
	},true);
	let innerSpace = AdvancedCreate("div","scrollableContent",false,displayBox);
	return innerSpace;
}

//Time Calculate for Anilist Style Activities
function nativeTimeElement(e) {
  let $ = new Date(1e3 * e);
  if (isNaN($.valueOf())) return 'Now';
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
//Get text until selector
function getTextUntil(selector) {
  let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
  let endElement = document.querySelector(selector);
  if (!main || !endElement) return "";
  let textContent = "";
  let collect = true;
  Array.from(main.childNodes).forEach(function (el, i) {
    if (el === endElement) {
      collect = false;
    }

    if (collect && i > 5 && el.className !== "normal_header") {
      if (el.nodeType === Node.ELEMENT_NODE) {
        textContent += el.innerHTML || "";
      } else if (el.nodeType === Node.TEXT_NODE) {
        textContent += el.textContent || "";
      }
    }
  });
  return textContent.trim();
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

function handleEmptyInfo(divSelector, checkText) {
  const $div = $(divSelector);
  if ($div.length) {
    const nextSibling = $div[0].nextSibling;
    if (nextSibling && !$(nextSibling).attr('itemprop') && (nextSibling.nodeValue || nextSibling.innerText) && (nextSibling.nodeValue || nextSibling.innerText).includes(checkText)) {
      emptyInfoAddDiv(divSelector);
      if (nextSibling.innerHTML) {
        nextSibling.innerHTML = nextSibling.innerHTML.replace('<br>', '');
      }
    }
  }
}

// MalClenSettings Edit About Popup
async function editAboutPopup(data, type) {
  return new Promise((resolve, reject) => {
    if ($('#currently-popup').length) {
      return;
    }
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "2" },
    });
    const popupLoading = create("div", {
      class: "actloading",
      style: { position: "fixed", top: "45%", left: "0", right: "0", fontSize: "16px" },
    }, "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome;word-break: break-word;"></i>');
    const iframe = create("iframe", { src: 'https://myanimelist.net/editprofile.php' });
    iframe.style.opacity = 0;

    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    popup.append(popupClose, iframe, popupLoading);
    document.body.append(popup,popupMask);
    document.body.style.overflow = "hidden";
    $('button#custombg,button#custompf,button#customcss').prop('disabled', true);

    $(iframe).on("load", async function () {
      let $iframeContents = $(iframe).contents();
      let $about = $iframeContents.find("#classic-about-me-textarea");
      let isClassic = $iframeContents.find("#about_me_setting_2").is(':checked');
      let $submit = $iframeContents.find('.inputButton[type="submit"]');
      let matchRegex = /(\[url=).*(malcleansettings)\/.*([^.]]+)/gm;
      let addRegex = /(\[url=https:\/\/malcleansettings\/)(.*)(]‎)/gm;
      let custompfRegex = /(custompf)\/([^\/]+.)/gm;
      let customBgRegex = /(custombg)\/([^\/]+.)/gm;
      let customCssRegex = /(customcss)\/([^\/]+.)/gm;
      let favSongEntryRegex = /(favSongEntry)\/([^\/]+.)/gm;

      popupLoading.innerHTML = "Updating" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';

      if ($iframeContents.find(".goodresult").length > 0) {
        window.location.reload();
      }

      if (isClassic) {
        let aboutText = $about.text();
        if (!matchRegex.test(aboutText)) {
          $about.text('[url=https://malcleansettings/custompf/.../custombg/.../customcss/.../]‎ [/url]' + aboutText);
          aboutText = '[url=https://malcleansettings/custompf/.../custombg/.../customcss/.../]‎ [/url]' + aboutText;
        }

        if (type === 'pf') {
          $about.text(aboutText.replace(custompfRegex, data+'/'));
          $submit.click();
        } else if (type === 'bg') {
          $about.text(aboutText.replace(customBgRegex, data+'/'));
          $submit.click();
        } else if (type === 'css') {
          $about.text(aboutText.replace(customCssRegex, data+'/'));
          $submit.click();
        } else if (type === 'favSongEntry') {
          if(!$iframeContents.find(".goodresult").length){
            if($about.text().indexOf(data) > -1){
              popupLoading.innerHTML = "Already Added";
            } else{
              $about.text(aboutText.replace(addRegex, `$1$2${data}/$3`));
              $submit.click();
            }
          }
        } else if (type === 'removeFavSong') {
          $about.text(aboutText.replace(data, ''));
          $submit.click();
        }
      } else{
        iframe.remove();
        popupLoading.innerHTML = "You are not using classic about.<br>Please create a blog post and paste this code there. <br>[url=https://" + data + "/]";
      }
    });

    // close popup
    popupClose.onclick = () => {
      close();
    };
  });
}


// Anime/Manga Edit Popup
async function editPopup(id, type, add) {
  return new Promise((resolve, reject) => {
    if ($('#currently-popup').length) {
      return;
    }
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
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "2" },
    },);
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
      if(add){
        popupLoading.remove();
        iframe.style.opacity = 1;
      } else{
        popupLoading.innerHTML = "Updating" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
      }
      if(add && $(iframe).contents().find(".goodresult")[0]){
        close();
      }
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
          if (svar.autoAddDate) {
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
      if(!add) {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
        let mangaVol = $(iframe).contents().find("#add_manga_num_read_volumes")[0];
        let mangaVolLast = parseInt($(iframe).contents().find("#totalVol").text());
        let status = $(iframe).contents().find("#add_anime_status,#add_manga_status")[0];
        let submit = $(iframe).contents().find(".inputButton.main_submit")[0];
        ep.value =  parseInt(ep.value) + 1;
        if(parseInt(ep.value) == lastEp) {
          status.value = 2;
          if(mangaVol) {
            mangaVol.value = mangaVolLast;
          }
        }
        checkEp();
        $(submit).click();
      }

        //if decrease ep clicked
      $(decreaseEp).on("click", function () {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        ep.value = ep.value > 0 ? ep.value - 1 : ep.value;
        checkEp();
      });
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
      if(!add){
        close()
      };
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
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "2" },
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
        $(iframe).contents().find("footer")[0].remove();
        $(iframe).contents().find(".h1")[0].remove();
        $(iframe).contents().find("form > input.inputtext")[0].value = id;
        $(iframe).contents().find('a[href*=profile]').removeAttr("href");
        $(iframe).contents().find('html')[0].style.overflowX = 'hidden';
        $(iframe).contents().find('#content')[0].style.padding = '0';
        $(iframe).contents().find("#contentWrapper")[0].setAttribute('style', 'top: 5px!important;min-height: auto;padding: 0;width:auto;margin-left:0!important');
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
  relationFilter:false,
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
  headerSlide: false,
  replaceList: false,
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
.loadmore,
.actloading,
.listLoading {
    font-size: .8rem;
    font-weight: 700;
    padding: 14px;
    text-align: center;
}

.favThemes img {
    width: 40px
}

.favThemes .flex2x .anime-container .favThemeSongTitle {
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px
}

.favThemes .anime-container .removeFavSong {
    display: none;
    font-family: 'FontAwesome';
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 6px;
    height: 4px;
    font-size: 8px
}

.favThemes .anime-container:hover .removeFavSong {
    display: block !important
}

.favThemes .flex2x .anime-container {

    padding: 10px;
    margin-bottom: 10px;
    min-height: 55px;
    height: 100%;
    min-width: 375px;
    max-width: 375px;
}

.favThemes .anime-container {
position: relative;
    background: var(--color-foreground);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin-bottom: 10px;
}

.favThemes video {
    width: 100%
}

.favThemes .video-container {
    margin-top: 10px;
    display: none
}

.favThemes .favSongHeader {
    width: 99%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: center;
}

.favThemes .flex2x .favSongHeader h2 {
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px;
    font-size: 0.68rem!important;
    padding-bottom: 5px!important;
}

.favThemes .favSongHeader h2 {
    -webkit-border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    -webkit-border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    -o-border-image: -o-linear-gradient(left, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
}

.favThemes .favSongContainer {
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 50px 1fr;
    grid-template-columns: 50px 1fr
}

.favThemes .flex2x{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    gap: 0px 10px;
    margin: 5px 0px;
    -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap
}

.user-profile-about a[href*="/custombg"],
.user-profile-about a[href*="/custompf"],
.user-profile-about a[href*="/customcss"] {
    display: none
}

.filterList_TagsContainer .tag-link {
    cursor: pointer;
    word-break: break-word;
    display: block;
    width: 97%;
    background: var(--color-foreground3);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-left: -5px;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.filterList_TagsContainer .tag-link.clicked {
    background: var(--color-foreground4);
    border: var(--border) solid var(--border-color);
}

.filterList_TagsContainer .tag-link:hover {
    background: var(--color-foreground2)
}

.filterList_GenresFilter input[type="checkbox"] {
    cursor: pointer;
    vertical-align: middle;
    bottom: 2px;
    left: -5px;
    -webkit-appearance: none;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    content: "";
    position: absolute;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto !important;
    height: 10px;
    width: 10px;
    background: var(--color-link2) !important
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    font-family: fontAwesome;
    content: "\\f00c";
    margin-left: 4px !important;
    color: var(--color-link) !important;
    background: none !important
}

i.tags-container-clear.fa.fa-close,
i.year-filter-clear.fa.fa-close {
    display: none;
    font-family: 'FontAwesome';
    background: var(--color-foreground4);
    padding: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    float: right;
    cursor: pointer;
    margin-right: 86%;
    margin-top: -2px;
    margin-bottom: 0px
}

.year-filter-slider-container {
    margin-top: -4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px
}

input#year-filter-slider {
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    padding: 0 !important
}

.genreDropBtn {
    width: 100%;
    border: 0;
    background: var(--color-foreground2);
    padding: 8px;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    margin: 5px 0px
}

.genreDropBtn:hover {
    background: var(--color-foreground4)
}

#maljs-dropdown-content {
    display: none;
    -ms-grid-columns: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    width: 410px;
    background: var(--color-foreground);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    min-width: 160px;
    -webkit-box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    height: 175px;
    overflow: scroll;
}

.maljs-dropdown-content label {
    padding: 12px 16px;
    display: block;
}

.maljs-dropdown-content label:hover {
    background: var(--color-foreground4)
}

.maljs-dropdown-content label:has(input.genre-filter:checked) {
    background: var(--color-foreground2);
    border-bottom: 1px solid
}

.list-entries .status-section {
    background: var(--color-foreground);
    border-radius: var(--border-radius)
}

.filterLists-back {
    width: 25px;
    text-align: center;
    margin-top: -67px;
    font-family: 'FontAwesome';
    cursor: pointer;
    position: absolute;
    background: var(--color-foreground);
    padding: 6px;
    -webkit-border-top-left-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    -webkit-border-top-right-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    border-bottom:0
}

.filterListsDivContainer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}

.filterListsDiv {
    width: 70px;
    display: block;
    margin-top: -5px
}

.filterListsCount {
    width: 90px;
    line-height: 19px;
    color: var(--color-main-text-light);
    margin-top: -5px
}

.list-entries .entry .edit {
    height: 40px;
    width: 40px;
    position: absolute;
    background: #00000070;
    display: block;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    font-family: fontAwesome;
    opacity: 0;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}

.list-entries .entry .edit:hover {
    opacity: 1
}

.maljsDisplayBox {
    overflow: hidden;
    position: fixed;
    top: 65px;
    left: 20px;
    z-index: 9999;
    padding: 20px;
    background-color: rgb(var(--color-foreground));
    border: solid 1px;
    border-radius: 4px;
    box-shadow: black 2px 2px 20px;
    background: var(--color-background);
    height: 85%;
}

.maljsDisplayBoxTitle {
    font-size: 15px;
    border-bottom: 1px solid;
    display: block;
    margin-bottom: 10px;
    padding: 3px
}

input.maljsNativeInput {
    margin-bottom: 5px
}

.maljsDisplayBox .scrollableContent p {
    margin: 10px 0px !important
}

.maljsDisplayBox .scrollableContent {
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    scrollbar-width: thin;
    margin-top: 5px;
    padding: 30px;
    padding-top: 15px;
    scrollbar-width: auto
}

.maljsDisplayBoxClose {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    width: 15px;
    height: 18px;
    text-align: center;
    background-color: #852325;
    font-weight: bold;
    border: solid;
    border-width: 1px;
    border-radius: 2px;
    color: var(--color-main-text-normal);
    z-index: 20;
}

.maljsResizePearl {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 20px;
    height: 20px;
    border: solid;
    border-radius: 10px;
    background: rgb(var(--color-foreground));
    cursor: se-resize
}

.container-left>#filter,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-top: -8px;
    background: var(--color-foreground);
    padding: 15px;
    border-radius: var(--border-radius)
}

.container-left>#filter .filterLists,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter .filterLists {
    display: block;
    cursor: pointer;
    padding: 3px;
    width: 70px
}
.sort-container #sort-asc,
.sort-container #sort-desc,
#maljsDraw3x3,
.compareBtn {
    background: var(--color-foreground2);
    padding: 10px;
    border-radius: var(--border-radius);
    display: block;
    margin-top: 5px;
    cursor: pointer;
    width: 55px
}

.compareBtn {
    float: right;
    text-align: center
}

#filter>input#filter-input {
    width: 94%
}

.list-entries .entry .cover,
.list-entries .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox
}

.list-entries .row {
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center
}

.list-entries .entry .cover {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    max-width: 60px;
    min-width: 60px;
    padding: 0
}

.list-entries .entry .cover .image {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    height: 40px;
    width: 40px
}

.list-entries .entry .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 15px;
    text-align: left;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    word-break: break-word
}

.list-entries .entry .title a {
    -webkit-transition: none;
    -o-transition: none;
    transition: none;
    margin-right: auto
}

.list-entries .entry>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 18px 20px;
    text-align: center
}

.list-entries .list-head>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 20px;
    text-align: center;
    font-weight: 700
}

.list-entries .list-head .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 75px;
    text-align: left
}

.list-entries .section-name {
    border-bottom: 1px solid;
    padding: 10px;
    padding-top:0;
    margin-bottom: 0
}

.list-entries .entry.row.hidden {
    display: none
}

.list-entries .status-section {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-bottom: 10px;
    padding-bottom: 10px
}

.list-head.row {
    margin-bottom: -10px
}

.relationsTarget,
.relationsExpanded {
    display: -webkit-box !important;
    display: -webkit-flex !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    gap: 14px
}

.relationsExpanded {
    padding-left: 8px
}

.relations-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}

.relationEntry {
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
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

.relationTitle {
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
    transition: .3s
}

.relationEntry:hover {
    overflow: visible !important
}

.relationEntry:hover .relationImg {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.relationEntryRight:hover .relationImg {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: var(--br) !important;
    border-bottom-right-radius: var(--br) !important
}

.relationEntry:hover .relationTitle {
    opacity: 0
}

.relationEntry:hover .relationDetails {
    opacity: 1;
    z-index: 10
}

.relationDetails:hover {
    display: none
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
    background: var(--color-foregroundOP2);
    z-index: 5;
    border-top-right-radius: var(--br);
    border-bottom-right-radius: var(--br)
}

.relationDetailsRight {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    left: inherit;
    right: 86px
}

.relationDetailsTitle {
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
    display: none
}

.showSpoilers {
    cursor: pointer
}

.showSpoilers,
.aniTag.spoiler .aniTag-name {
    color: #d98080;
    font-weight: 600
}

.aniTag-percent {
    color: var(--color-main-text-light)
}

#content>table>tbody>tr>td:nth-child(2)>div.rightside.js-scrollfix-bottom-rel>div.h1.edit-info,
#content>table>tbody>tr>td.borderClass>div>div>div:nth-child(1),
#content>table>tbody>tr>td.borderClass>div>div:nth-child(1) {
    z-index: 1;
    position: relative
}

.bannerHover {
    width: 220px;
    height: 80px;
    position: absolute;
    bottom: 0px;
    left: 18px;
    z-index: 1
}

.bannerShadow {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(6, 13, 34, .1)), color-stop(50%, rgba(6, 13, 34, 0)), to(rgba(6, 13, 34, .6)));
    background: -o-linear-gradient(top, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    background: linear-gradient(180deg, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0px
}

.bannerImage {
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
    max-height: 435px;
    position: relative;
    padding: 0 !important;
    margin-left: -13px;
    margin-top: -17px;
    width: calc(100% + 25px);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden
}

.aniLeftSide {
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    position: relative;
    padding-top: 0 !important;
    top: -85px
}

.spaceit-shadow {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--br);
            border-radius: var(--br)
}

.aniTag,
.spaceit-shadow-end,
.spaceit-shadow-end-div {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    border-radius: var(--br);
    overflow: hidden
}

.spaceit-shadow-end-div {
    padding: 2px;
    background: var(--color-foreground)
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
    background-color: var(--color-foregroundOP2);
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
    border: 1px solid
}

#currently-popup .popupBack {
    left: 6px;
    right: inherit !important;
    font-family: FontAwesome;
    float: left;
    padding: 0px 0px 5px 0px;
}

.widget.seasonal.left .btn-anime i:hover {
    width: 160px;
    height: 220px;
    text-align: right;
    background: 0 !important
}

#widget-currently-watching>div.widget-slide-outer>ul>li:hover span.epBehind,
.widget.seasonal.left .btn-anime:hover i,
#widget-currently-watching .btn-anime:hover i,
#widget-currently-reading .btn-anime:hover i {
    opacity: .9 !important
}

#currently-watching span {
    width: 93%
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
    transition: .4s;
    text-align: center;
    background-color: rgb(31 38 49 / 72%);
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%
}

.behindWarn {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0)), to(rgba(232, 93, 117, .49)));
    background: -o-linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4px;
    opacity: .8
}

.epBehind {
    color: var(--color-main-text-op);
    position: absolute;
    left: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
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
    opacity: 0;
}

.widget-slide-block:hover #current-left-manga.active,
.widget-slide-block:hover #current-left.active {
    left: 0 !important;
    opacity: 1 !important
}

.widget-slide-block:hover #current-right-manga.active,
.widget-slide-block:hover #current-right.active {
    right: 0 !important;
    opacity: 1 !important
}

.embedLink {
    width: max-content;
    line-height: 1.16rem;
    margin: 5px 1px;
    display: inline-block;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.embedDiv.no-genre .genres {
    display: none
}

.embedDiv:not(.no-genre) div {
    transition: opacity 0.3s ease-in-out;
}

.embedDiv:not(.no-genre) .genres {
    margin-bottom: -18.5px;
    opacity: 0
}

.embedDiv:not(.no-genre):hover .genres {
    opacity: 1
}

.embedDiv:not(.no-genre):hover .details {
    opacity: 0
}

.embedName {
    font-weight: bold;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
}

.embedImage {
    background-size: cover;
    height: 58px;
    width: 41px;
    margin-right: 10px;
    margin-left: -10px;
}

.embedDiv {
    color: var(--color-text);
    align-items: center;
    text-align: center;
    width: max-content;
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
    margin-top: 5px
}

.tooltipBody .main {
    margin: 0 !important
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
    top: 55px;
    z-index: 11;
    background: var(--color-foregroundOP);
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
    margin-top: 10px;
}

#listDiv>.mainListDiv:nth-child(2) {
    margin-top: 45px
}

.mainListBtnsDiv {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 0px 2px;
}

.textpb {
    padding-top: 5px !important;
    font-weight: bold
}

.textpb a {
    color: rgb(var(--color-link)) !important;
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
    background: var(--color-foregroundOP);
    width: 505px;
    border-top-left-radius: 10px;
    margin-top: 0px;
    padding: 10px;
    height: 35px;
    top: inherit;
    right: 25px
}

.mainbtns {
    -webkit-transition: 0.25s;
    -o-transition: 0.25s;
    transition: 0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    padding: 5px;
    margin: 4px;
    cursor: pointer;
    background-color: var(--color-background);
    color: var(--color-text)
}

.mainbtns:hover {
    -webkit-transform: scale(1.04);
    -ms-transform: scale(1.04);
    transform: scale(1.04)
}

.btn-active {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.btn-active:before {
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
    display: none !important
}

button#customcss,
button#custombg,
button#custompf {
    height: 40px;
    width: 32%
}

input#cssinput,
input#bginput,
input#pfinput {
    width: 60%;
    height: 15px;
    margin-right: 5px
}

.mainDiv .mainListDiv h2 {
    background: var(--fg2);
    border-radius: var(--br);
    padding: 5px
}

.mainDiv .mainListDiv h3 {
    font-weight: 500
}
`;
let styles1 = `
.anisong-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}

.anisongs .theme-songs.js-theme-songs {
    margin-bottom: 5px
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
    -webkit-filter: invert(100%) hue-rotate(180deg) brightness(75%) !important;
    filter: invert(100%) hue-rotate(180deg) brightness(75%) !important
}
`;
let styles2 = `
.lazyloading {
  opacity: 1 !important;
}
footer {
  z-index: 0;
  margin-top: 65px !important;
  position: relative;
}
.dark-mode .profile .user-statistics,
.profile .user-statistics {
  width: 99%;
}
.dark-mode .profile .user-comments .comment,
.profile .user-comments .comment,
.dark-mode .page-common .content-container .container-right h2,
.page-common .content-container .container-right h2,
.dark-mode .fav-slide-block,
.fav-slide-block {
  width: 96%;
}
#myanimelist:before {
  content: "";
  width: 200%;
  left: 0;
  position: fixed;
  height: 200%;
  z-index: 0;
  -webkit-backdrop-filter: brightness(bg_brightness) contrast(bg_contrast) saturate(bg_saturate) !important;
  backdrop-filter: brightness(bg_brightness) contrast(bg_contrast) saturate(bg_saturate) !important;
}
.dark-mode body:not(.ownlist),
body:not(.ownlist) {
  background: url(bg_image) !important;
  background-size: cover !important;
  background-attachment: fixed !important;
  background-color: var(--color-background) !important;
}
.page-common #myanimelist #contentWrapper {
  background-color: var(--color-backgroundo) !important;
  top: 55px !important;
  padding: 10px;
  margin-left: -15px;
  width: 1070px;
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px var(--shadow-color) !important;
}
`;

//CSS MyAnimeList - Clean Main Colors
let styles3 = `
body,
:root {
    --color-background: #0c1525 !important;
    --color-backgroundo: #0c1525 !important;
    --color-foreground: #161f2f !important;
    --color-foreground2: #202939 !important;
    --color-foreground3: rgba(37, 46, 62, 0.3) !important;
    --color-foreground4: #2a3343 !important;
    --br: 5px !important;
    --color-text: 182 182 182;
    --color-text-normal: #b6b6b6 !important;
    --color-main-text-normal: #c8c8c8 !important;
    --color-main-text-light: #a5a5a5 !important;
    --color-main-text-op: #fff !important;
    --color-link: 159, 173, 189;
    --color-link2: #7992bb !important;
    --color-text-hover: #cfcfcf !important;
    --color-link-hover: #cee7ff !important;
}
`;

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
var button25 = create("button", { class: "mainbtns", id: "headerSlideBtn" });
button25.onclick = () => {
  svar.headerSlide = !svar.headerSlide;
  svar.save();
  getSettings();
  reloadset();
};
var button26 = create("button", { class: "mainbtns", id: "relationFilterBtn" });
button26.onclick = () => {
  svar.relationFilter = !svar.relationFilter;
  svar.save();
  getSettings();
  reloadset();
};
var button27 = create("button", { class: "mainbtns", id: "replaceListBtn" });
button27.onclick = () => {
  svar.replaceList = !svar.replaceList;
  svar.save();
  getSettings();
  reloadset();
};
//Custom Profile Background
let bginput = create("input", { class: "bginput", id: "bginput" });
bginput.placeholder = "Paste your Background Image Url here";
var button11 = create("button", { class: "mainbtns", id: "custombg" }, "Update");
var bginfo = create("p", { class: "textpb" }, "");

button11.onclick = () => {
  if (bginput.value.slice(-1) === "]") {
    bginfo.innerText = "Background Image already converted.";
  } else if (bginput.value.length > 1) {
    const bgBase64 = LZString.compressToBase64(JSON.stringify(bginput.value));
    const bgbase64url = bgBase64.replace(/\//g, '_');
    editAboutPopup(`custombg/${bgbase64url}`,'bg');
    bginput.addEventListener(`focus`, () => bginput.select());
  } else {
    bginfo.innerText = "Background Image url empty.";
  }
};

//Custom Avatar
var button12 = create("button", { class: "mainbtns", id: "custompf" }, "Update");
button12.onclick = () => {
  if (pfinput.value.slice(-1) === "]") {
    pfinfo.innerText = "Background Image already converted.";
  } else if (pfinput.value.length > 1) {
    const pfBase64 = LZString.compressToBase64(JSON.stringify(pfinput.value));
    const pfbase64url = pfBase64.replace(/\//g, '_');
    editAboutPopup(`custompf/${pfbase64url}`,'pf');
    pfinput.addEventListener(`focus`, () => pfinput.select());
  } else {
    pfinfo.innerText = "Avatar Image url empty.";
  }
};
let pfinput = create("input", { class: "bginput", id: "pfinput" });
pfinput.placeholder = "Paste your Avatar Image Url here";
var pfinfo = create("p", { class: "textpb" }, "");

//Custom CSS
var button8 = create("button", { class: "mainbtns", id: "customcss" }, "Update");
button8.onclick = () => {
  if (cssinput.value.slice(-1) === "]") {
    cssinfo.innerText = "Css already converted.";
  } else if (cssinput.value.length > 1) {
    const cssBase64 = LZString.compressToBase64(JSON.stringify(cssinput.value));
    const cssbase64url = cssBase64.replace(/\//g, '_');
    editAboutPopup(`customcss/${cssbase64url}`,'css');
    cssinput.addEventListener(`focus`, () => cssinput.select());
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
  relationFilterBtn.classList.toggle('btn-active', svar.relationFilter);
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
  headerSlideBtn.classList.toggle('btn-active', svar.headerSlide);
  replaceListBtn.classList.toggle('btn-active', svar.replaceList);
}

//Create Settings Div
function createDiv() {
  let listDiv = create("div", { class: "mainDiv", id: "listDiv" }, '<div class="mainDivHeader"><b>' + stLink.innerText + "</b></div>");
  let custombgDiv = create(
    "div",
    { class: "mainListDiv", id: "profileDiv" },
    '<div class="profileHeader"><h2>' +
      "Custom Background Image (Required Anilist Style Profile)" +
      "</h2><h3>" +
      "Add custom Background Image to your profile. This will be visible to others with the script." +
      "</h3></div>"
  );
  let custompfDiv = create(
    "div",
    { class: "mainListDiv", id: "profileDiv" },
    '<div class="profileHeader"><h2>' + "Custom Avatar (Required Anilist Style Profile)" + "</h2><h3>" + "Add custom Avatar to your profile. This will be visible to others with the script." + "</h3></div>"
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
       {b:button25,t:"Auto Hide/Show header"},
      ]),
    createListDiv(
      "Anime / Manga",
      [
        {b:button1,t:"Add dynamic background color based cover art's color palette"},
        {b:button17,t:"Add banner image from Anilist"},
        {b:button18,t:"Add tags from Anilist"},
        {b:button19,t:"Replace relations"},
        {b:button26,t:"Add filter to replaced relations"},
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
       {b:button27,t:"Make Anime/Manga List like Anilist"},
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

  //Auto Hide/Show Header
  if(svar.headerSlide) {
    let lastScrollTop = 0;
    const header = document.querySelector('#headerSmall');
    const menu = document.querySelector('#menu');
    if (header) {
      menu.style.transition = "top 0.3s ease-in-out";
      header.style.transition = "top 0.3s ease-in-out";
      window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          header.style.top = '-50px';
          menu.style.top = '-50px';
        } else {
          // Scrolling up
          header.style.top = '0';
          menu.style.top = '5px';
        }
        lastScrollTop = scrollTop;
      });
    }
  }

  // News and Forum - Load iframe only when the spoiler button is clicked
  if (/\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href) || /\/(news)\/\d/.test(location.href)) {
    const spoilers = document.querySelectorAll(".spoiler:has(.movie)");
    spoilers.forEach(spoiler => {
      const showButton = spoiler.querySelector(".show_button");
      const hideButton = spoiler.querySelector(".hide_button");
      const iframe = spoiler.querySelector("iframe");
      showButton.setAttribute("data-src", iframe.src);
      iframe.src = "";
      $(iframe).contents().find("body").attr('style','background:0!important');
      showButton.setAttribute("onclick", showButton.getAttribute('onclick') +
                              'this.nextElementSibling.querySelector("iframe.movie").setAttribute("src",this.getAttribute("data-src"));' +
                              'this.nextElementSibling.querySelector("iframe.movie").contentWindow.document.body.setAttribute("style","background:0!important");');
      hideButton.setAttribute("onclick", hideButton.getAttribute('onclick')+'this.parentElement.querySelector("iframe.movie").removeAttribute("src")');
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
                    background: "var(--color-foregroundOP2)",
                    padding: "4px",
                    borderRadius: "5px",
                    opacity: "0.3",
                    transition: ".4s",
                  },
                });
                let increaseButton = create("i", {
                  class: "fa fa-plus",
                  id: list[x].anime_id,
                  style: {
                    fontFamily: '"Font Awesome 6 Pro"',
                    position: "absolute",
                    right: "3px",
                    top: "26px",
                    background: "var(--color-foregroundOP2)",
                    padding: "4px",
                    borderRadius: "5px",
                    opacity: "0",
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
                   wDiv.appendChild(increaseButton);
                document.querySelector("#widget-currently-watching ul").append(wDiv);
                ib.onclick = async () => {
                  await editPopup(ib.id);
                  watchdiv.remove();
                  getWatching();
                };
                increaseButton.onclick = async () => {
                  await editPopup(ib.id,null,true);
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
                    background: "var(--color-foregroundOP2)",
                    padding: "4px",
                    borderRadius: "5px",
                    opacity: "0.3",
                    transition: ".4s",
                  },
                });
                let increaseButton = create("i", {
                  class: "fa fa-plus",
                  id: list[x].anime_id,
                  style: {
                    fontFamily: '"Font Awesome 6 Pro"',
                    position: "absolute",
                    right: "3px",
                    top: "26px",
                    background: "var(--color-foregroundOP2)",
                    padding: "4px",
                    borderRadius: "5px",
                    opacity: "0",
                    transition: ".4s",
                  },
                });
                increaseButton.onclick = async () => {
                  await editPopup(ib.id,'manga',true);
                  readdiv.remove();
                  getreading();
                };
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
                rDiv.appendChild(increaseButton);
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
  if (/\/(profile)\/.?([\w]+)?\/?/.test(current)) {
    let banner = create('div', {class: 'banner',id: 'banner',});
    let shadow = create('div', {class: 'banner',id: 'shadow',});

    const pfloading = create("div", { class: "actloading",style:{position:"fixed",top:"50%",left:"0",right:"0",fontSize:"16px"}},
                           "Loading"+'<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>');
    let username = current.split('/')[2];
    let custombg,custompf,customcss,userimg,customFounded;
    let bgRegex = /(custombg)\/([^"\/]+)/gm;
    let pfRegex = /(custompf)\/([^"\/]+)/gm;
    let cssRegex = /(customcss)\/([^"\/]+)/gm;
    let favSongEntryRegex = /(favSongEntry)\/([^\/]+.)/gm;

    //block user icon
     let blockU = create("i", {
      class: "fa fa-ban",
      style: {
        fontFamily: '"Font Awesome 6 Pro"',
        position: 'absolute',
        zIndex:'10',
        right: '65px',
        color: 'var(--color-link) !important',
        fontWeight: 'bold',
        fontSize: '12px',
        cursor: 'pointer',
        margin: '60px 10px 0px'},
    });
    //block user icon click
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
        document.querySelector('#contentWrapper').style.opacity = "1";
      }
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      document.querySelector('#contentWrapper').style.opacity = "0";
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
      if ($("#contentWrapper > div:nth-child(2) > h1 > a").css("z-index") === '1') {
        blockU.style.right= "82px";
        blockU.style.margin= "9px 0 0 0";
      }
      document.querySelector("#contentWrapper").style.top = "60px";
      startCustomProfile();
    }
    if($('title').text() === '404 Not Found - MyAnimeList.net\n'){
      pfloading.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector('#contentWrapper').style.opacity = "1";
    }

    async function buildFavSongs(data) {
      let parts = data.split("/");
      let favarray = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "favSongEntry") {
          if (i + 1 < parts.length) {
            const base64 = parts[i + 1].replace(/_/g, "/");
            const lzbase64 = LZString.decompressFromBase64(base64);
            let dec = JSON.parse(lzbase64);
            favarray.push(dec);
          }
        }
      }
      let opGroup = create("div", { id: "op-group" });
      let edGroup = create("div", { id: "ed-group" });
      let FavContent = create("div", { class: "favThemes" });
      if (svar.alstyle) {
        $("#content > div > div.container-left > div li.icon-statistics.link").before(FavContent);
      } else {
        $("#content > div > div.container-right > h2").nextUntil(".user-comments").wrapAll("<div class='favContainer'></div>");
        $(".user-comments").before(FavContent);
        $(FavContent).css({marginBottom: '30px',width:'813px'});
        opGroup.classList.add("flex2x");
        edGroup.classList.add("flex2x");
      }
      favarray.forEach((arr, index) => {
        arr.forEach((item) => {
          const favSongContainer = create("div", { class: "anime-container", type: item.themeType });
          favSongContainer.innerHTML = `
                <div class="fa fa-x removeFavSong" order=${index}></div>
                <div class="favSongContainer">
                <a href='https://myanimelist.net/anime/${item.animeUrl}/'>
                ${`<img src="${item.animeImage ? item.animeImage : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c"}" class="anime-image" alt="${
                  item.animeTitle
                }">`}
                </a>
                <div class="favSongHeader">
                <h2>${item.animeTitle}</h2>
                <a class="favThemeSongTitle" style="cursor:pointer">${item.songTitle}</a>
                </div></div>
                <div class="video-container">
                <video controls>
                <source src="${item.songSource}" type="video/webm">
                Your browser does not support the video tag.
                </video>
                </div>
                `;
          FavContent.appendChild(favSongContainer);
        });
      });
      FavContent.append(opGroup, edGroup);
      $(opGroup).before(`<h5 style="${svar.alstyle ? "font-size: 11px; margin-bottom: 8px; margin-left: 2px;" : ""}">Openings</h5>`);
      $(edGroup).before(`<h5 style="${svar.alstyle ? "font-size: 11px; margin-bottom: 8px; margin-left: 2px;" : ""}">Endings</h5>`);
      const favThemes = document.querySelector(".favThemes");
      const animeContainers = favThemes.querySelectorAll(".anime-container");

      animeContainers.forEach((container) => {
        const type = container.getAttribute("type");
        if (type === "OP") {
          opGroup.appendChild(container);
        } else if (type === "ED") {
          edGroup.appendChild(container);
        }
      });
      $(".removeFavSong").on("click", function () {
        const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
        const base64url = compressedBase64.replace(/\//g, "_");
        editAboutPopup(`favSongEntry/${base64url}/`, "removeFavSong");
      });

      $(".favThemeSongTitle").on("click", function () {
        if (!svar.alstyle) {
          const title = $(this).prev();
          title.css("white-space", title.css("white-space") === "nowrap" || title.css("white-space") === "nowrap" ? "normal" : "nowrap");
          $(this).css("white-space", $(this).css("white-space") === "nowrap" || $(this).css("white-space") === "nowrap" ? "normal" : "nowrap");
        }
        const videoContainer = $(this).parent().parent().parent().children(".video-container");
        const currentDisplay = videoContainer.css("display");
        videoContainer.css("display", currentDisplay === "none" || currentDisplay === "" ? "block" : "none");
      });
      if (username !== $(".header-profile-link").text()) {
        $(".removeFavSong").remove();
      }
    }
    //Get Custom Background Image and Custom Profile Image Data from About Section
    async function findCustomAbout() {
      const aboutSection = document.querySelector('.user-profile-about.js-truncate-outer');
      const processAboutSection = (aboutContent) => {
      const bgMatch = aboutContent.match(bgRegex);
      const pfMatch = aboutContent.match(pfRegex);
      const cssMatch = aboutContent.match(cssRegex);
      const favSongMatch = aboutContent.match(favSongEntryRegex);
        if (bgMatch) {
          const bgData = bgMatch[0].replace(bgRegex, '$2');
          if(bgData !== '...'){
            let bgBase64Url = bgData.replace(/_/g, "/");
            custombg = JSON.parse(LZString.decompressFromBase64(bgBase64Url));
            banner.setAttribute(
              'style',
              `background-color: var(--color-foreground); background: url(${custombg}); background-position: 50% 35%; background-repeat: no-repeat; background-size: cover; height: 330px; position: relative;`
            );
            customFounded = 1;
          }
        }
        if (pfMatch) {
          const pfData = pfMatch[0].replace(pfRegex, '$2');
          if(pfData !== '...'){
            let pfBase64Url = pfData.replace(/_/g, "/");
            custompf = JSON.parse(LZString.decompressFromBase64(pfBase64Url));
            document.querySelector('.user-image.mb8 > img').setAttribute('src', custompf);
            customFounded = 1;
          }
        }
        if (cssMatch) {
          const cssData = cssMatch[0].replace(cssRegex, '$2');
          if(cssData !== '...'){
            let cssBase64Url = cssData.replace(/_/g, "/");
          customcss = JSON.parse(LZString.decompressFromBase64(cssBase64Url));
          }
        }
        if (favSongMatch) {
          if(customFounded) {
            svar.alstyle = true;
          }
          if (!/\/profile\/.*\/\w/gm.test(current)) {
            buildFavSongs(aboutContent)
          }
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

    // for modern about, user can use blog post to add custom profile image, banner and css
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
        const favSongMatch = description.match(favSongEntryRegex);
        if (favSongMatch && !/\/profile\/.*\/\w/gm.test(current)) {
          buildFavSongs(description);
        }
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
        .l-listitem-list.row1{margin-right: 0px;margin-left: -46px}
        .l-listitem-list.row2{margin-left: 24px;}
        .l-listitem .c-aboutme-ttl-lv2{max-width: 420px;}
        .l-ranking-list_portrait-item{flex-basis: 66px;}
        .l-ranking-list_circle-item{flex-basis: 70px;}
        div#modern-about-me-expand-button,.c-aboutme-accordion-btn-icon{display:none}
        #banner a.header-right.mt4.mr0{z-index: 2;position: relative;margin: 60px 10px 0px !important;}
        .loadmore,.actloading,.listLoading {font-size: .8rem;font-weight: 700;padding: 14px;text-align: center;}
        .loadmore {cursor: pointer;background: var(--color-foreground);border-radius: var(--border-radius);margin-bottom: 25px;z-index: 2;position: relative;}
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
        .historydiv {height: 50px;background-color: var(--color-foreground);margin: 10px 5px;padding: 10px;border:var(--border) solid var(--border-color);
        -webkit-border-radius: var(--br);border-radius: var(--br);display: -webkit-box;display: -webkit-flex;
        display: -ms-flexbox;display: flex;-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;overflow: hidden;}
        #horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}
        .dark-mode .page-common #horiznav_nav ul li,.page-common #horiznav_nav ul li {background: 0 !important}
        .favTooltip {z-index:2;text-indent:0;-webkit-transition:.4s;-o-transition:.4s;transition:.4s;position: absolute;background-color: var(--color-foreground4);color: var(--color-text);
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
        document.body.style.setProperty('background', 'var(--color-background)','important');
        document.body.style.setProperty('--color-foreground', 'var(--color-foregroundOP)','important');
        document.body.style.setProperty('--color-foreground2', 'var(--color-foregroundOP2)','important');
        //Get Activity History from MAL and Cover Image from Jikan API
        const titleImageMap = {};
        async function gethistory(l, item) {
          let title, ep, date, datenew, id, url, type, historyimg, oldimg;
          let wait = 666;
          let c = l ? l - 12 : 0;
          let length = l ? l : 12;
          let head = create("h2", { class: "mt16" }, "Activity");
          const loading = create(
            "div",
            { class: "actloading" },
            "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-size:12px;font-family:FontAwesome"></i>'
          );
          if (!l) {
            const html = await fetch("https://myanimelist.net/history/" + username)
              .then((response) => response.text())
              .then(async (data) => {
                let newDocument = new DOMParser().parseFromString(data, "text/html");
                item = newDocument.querySelectorAll("#content > div.history_content_wrapper > table > tbody > tr > td.borderClass:first-child");
              });
          }

          length = item.length < length ? item.length : length;
          document.querySelector("#statistics").insertAdjacentElement("afterend", loading);

          for (let x = c; x < length; x++) {
            if (x === 0) {
              head.style.marginLeft = "5px";
              document.querySelector("#statistics").insertAdjacentElement("beforeend", head);
            }
            type = item[x].querySelector("a").href.split(".")[1].split("/")[1];
            url = item[x].querySelector("a").href;
            id = item[x].querySelector("a").href.split("=")[1];
            title = item[x].querySelector("a").outerHTML;
            ep = item[x].querySelector("strong").innerText;
            date = item[x].parentElement.children[1].innerText.split("Edit").join("");
            datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
            date = datenew ? date : date.split(",").join(" " + new Date().getFullYear());

            let dat = create("div", { class: "historydiv" });
            let name = create("div", { class: "historyname" });
            let timestamp = new Date(date).getTime();
            const timestampSeconds = Math.floor(timestamp / 1000);
            let historydate = create("div", { class: "historydate", title: date }, datenew ? date : nativeTimeElement(timestampSeconds));

            let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
            if (type === "anime") {
              name.innerHTML = "Watched episode " + ep + " of " + '<a href="' + url + '">' + title + "</a>";
            } else {
              apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
              name.innerHTML = "Read chapter " + ep + " of " + '<a href="' + url + '">' + title + "</a>";
            }

            // Image retrieval function
            async function getimg(url) {
              await fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                  oldimg = data.data?.images ? data.data.images.jpg.image_url : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c";
                  titleImageMap[title] = oldimg; // Map the title to the image
                });
            }

            // Check if the title already exists in the map
            if (titleImageMap[title]) {
              oldimg = titleImageMap[title];
              historyimg = create("a", {
                class: "historyimg",
                href: url,
                style: {
                  backgroundImage: "url(" + oldimg + ")",
                },
              });
              wait = 99; // If already exists, reduce wait time
            } else {
              wait = 999; // If new title, increase wait time
              await getimg(url);
              historyimg = create("a", {
                class: "historyimg",
                href: url,
                style: {
                  backgroundImage: "url(" + oldimg + ")",
                },
              });
            }

            dat.append(historyimg, name);
            dat.append(historydate);
            document.querySelector("#statistics").insertAdjacentElement("beforeend", dat);
            await delay(wait);
          }

          loading.remove();

          if (item.length > length) {
            let loadmore = create("div", { class: "loadmore" }, "Load More");
            loadmore.onclick = () => {
              gethistory(length + 12, item);
              loadmore.remove();
            };
            if (document.querySelectorAll(".filterListsDiv").length < 1) {
              document.querySelector("#statistics").insertAdjacentElement("afterend", loadmore);
            }
          }
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
        if (set(1, ".content-container", { sa: { 0: "display: grid!important;grid-template-columns: 33% auto;margin-top: 50px;justify-content: center;" } })) {
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
        $("#contentWrapper > div:nth-child(2) > h1").remove();
        set(1, "#content > table > tbody > tr > td.pl8 > #horiznav_nav", { r: { 0: 0 } });
        set(1, ".container-right #horiznav_nav", { r: { 0: 0 } });
        document.querySelector("#contentWrapper")
          .setAttribute("style", "width: 1375px;max-width: 1375px!important;min-width:500px; margin: auto;top: -40px;transition:.6s;opacity:1;top: -40px!important;border:0!important;box-shadow:none!important");
        pfloading.remove();
        document.body.style.removeProperty("overflow");
        let more = document.querySelector(".btn-truncate.js-btn-truncate");
        if (more) {
          more.setAttribute("data-height", '{"outer":1000,"inner":90000}');
        }
        let s = document.querySelector("#statistics");
        if (s) {
          let mangaStats = document.querySelector("#statistics .stats.manga");
          let mangaUpdates = document.querySelector("#statistics .updates.manga");
          let animeStats = document.querySelector("#statistics .stats.anime");
          let animeUpdates = document.querySelector("#statistics .updates.anime");
          s.setAttribute("style", "width: 813px");
          s.children[1].append(mangaStats);
          s.children[2].prepend(animeUpdates);
          s.prepend(document.querySelector("#statistics > div:nth-child(2)"));
          document.querySelector(".container-right").prepend(s);
          $('h2:contains("Statistics"):last').remove();

          // if anime & manga stats empty - Remove
          if (animeStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00'  &&  mangaStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00') {
            document.querySelector("#statistics").remove();
          }
          else {
            // if manga stats empty - Remove
            if(mangaStats && mangaStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00') {
              mangaStats.remove();
              mangaUpdates.remove();
              if(animeStats && animeStats.children[1].innerText !== 'Days: 0.0\tMean Score: 0.00') {
                animeStats.parentElement.appendChild(animeUpdates);
              }
            }
            // if anime stats empty - Remove
            if(animeStats && animeStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00') {
              animeStats.remove();
              animeUpdates.remove();
              if(mangaStats.parentElement && mangaStats.children[1].innerText !== 'Days: 0.0\tMean Score: 0.00') {
                mangaStats.parentElement.appendChild(mangaUpdates);
              }
            }
          }
        }
        //Favorites
        if(document.querySelector("#content > div > div.container-left > div > ul:nth-child(4)")) {
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
        if(document.querySelector(".container-right > h2.mb12")) {
          document.querySelector(".container-right > h2.mb12").remove();
        }

        set(1, ".container-right > .btn-favmore", { r: { 0: 0 } });
        set(2, "ul.user-status.border-top h5", { sal: { 0: "font-size: 11px;margin-bottom: 8px;margin-left: 2px;" } });
        set(2, ".container-left h4", { sal: { 0: "font-size: 11px;margin-left: 2px;" } });
        const favHeader = document.querySelectorAll('ul.user-status.border-top h5');
        for(let i = 0; i < favHeader.length; i++) {
          favHeader[i].innerText = favHeader[i].innerText.replace(/ (.*)/, '');
        }
        set(1, ".favs", { sap: { 0: "box-shadow: none!important;" } });
        if(document.querySelector('#statistics')) {
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
        document.querySelector('#contentWrapper').style.opacity = "1";
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

    //Anilist Style Anime and Manga List //-START-//
      let contLeft = $(".container-left").length ?  $(".container-left") : $("#content > table > tbody > tr td[valign='top']:nth-child(1)");
      let contRight = $(".container-right").length ?  $(".container-right") : $("#content > table > tbody > tr td[valign='top']:nth-child(2)");
    if(svar.replaceList) {
      //Anime List Button
      const animeListButton = document.querySelector("a.btn-profile-submit.fl-l");
      if(animeListButton){
        animeListButton.href = "javascript:void(0);";
        animeListButton.onclick = async () => {
          $(contLeft).children().hide();
          $(contRight).children().hide();
          $(".fav-slide-block.mb12").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
          getAnimeList();
        };
      };
      //Manga List Button
      const mangaListButton = document.querySelector("a.btn-profile-submit.fl-r");
      if(mangaListButton){
        mangaListButton.href = "javascript:void(0);";
        mangaListButton.onclick = async () => {
          $(contLeft).children().hide();
          $(contRight).children().hide();
          $(".fav-slide-block.mb12").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
          getAnimeList("manga");
        };
      };
    }
    let isManga = null;
    // Function to create a single entry row
    function createEntryRow(animeData) {
      // Find or create the section for the current status
      let section = document.getElementById(`status-section-${animeData.status}`);
      if (!section) {
        // If section doesn't exist, create a new section
        section = document.createElement('div');
        section.id = `status-section-${animeData.status}`;
        section.className = 'status-section';
        const statusTextMap = {
          1: (isManga ? 'Reading' : 'Watching'),
          2: 'Completed',
          3: 'Paused',
          4: 'Dropped',
          6: 'Planning'
        };
        // Create the section header
        const sectionHeader = document.createElement('h3');
        sectionHeader.className = 'section-name';
        sectionHeader.textContent = `${statusTextMap[animeData.status]}`;
        section.appendChild(sectionHeader);

        // Create the list head row
        const listHeadRow = document.createElement('div');
        listHeadRow.className = 'list-head row';

        // Create and append columns for the list head
        ['title', 'score', 'progress','type'].forEach((colName) => {
          const colDiv = document.createElement('div');
          colDiv.className = colName;
          colDiv.textContent = colName.charAt(0).toUpperCase() + colName.slice(1);
          listHeadRow.appendChild(colDiv);
        });
        // Append list head row to the section
        section.appendChild(listHeadRow);
        // Append the new section to the parent container
        document.querySelector('.list-entries').appendChild(section);
      }
      const entryRow = create('div', {class: 'entry row'});
      const coverDiv = create('div', {class: 'cover'});
      const imageDiv = create('div', {
        class: 'image',
        style: {
          backgroundImage: 'url(' +  animeData.imageUrl + ')',
        },
      });
      const editDiv = create('div', {class: 'edit fa-pen',});
      editDiv.id = animeData.id;
      editDiv.onclick = async () => {
        isManga ? await editPopup(editDiv.id,'manga') : await editPopup(editDiv.id)
      };
      coverDiv.append(imageDiv,editDiv);
      // Create the title div
      const titleDiv =  create('div', {class: 'title'});
      const titleLink = create('a', {class: 'title-link'},animeData.title);
      titleLink.style.maxWidth = '450px';
      titleLink.href = animeData.href;
      titleDiv.appendChild(titleLink);
      if(animeData.notes){
        const titleNote = create('span', {class: 'title-note fa-sticky-note'});
        titleNote.title = animeData.notes;
        $(titleNote).attr('style','font-family:"FontAwesome"!important').appendTo(titleDiv);
      }
      // Create the score div
      const scoreDiv = create('div', {class: 'score'},animeData.score);
      // Create the progress div
      const progressDiv = create('div', {class: 'progress'},animeData.progress + (animeData.progressEnd ? '/'+animeData.progressEnd : ''));
      // Create the format div
      const formatDiv = create('div', {class: 'format'},animeData.format);
      // Append all child elements to the entry row
      entryRow.appendChild(coverDiv);
      entryRow.appendChild(titleDiv);
      entryRow.appendChild(scoreDiv);
      entryRow.appendChild(progressDiv);
      entryRow.appendChild(formatDiv);
      section.appendChild(entryRow);
      entryRow.setAttribute("genres",JSON.stringify(animeData.genres ? animeData.genres : ""));
      entryRow.setAttribute("season",JSON.stringify(animeData.season ? animeData.season : ""));
      entryRow.setAttribute("tags",JSON.stringify(animeData.tags ? animeData.tags : ""));
      entryRow.setAttribute("startDate",JSON.stringify(animeData.startDate ? animeData.startDate : ""));
      entryRow.setAttribute("finishDate",JSON.stringify(animeData.finishDate ? animeData.finishDate : ""));
      entryRow.setAttribute("createdAt",JSON.stringify(animeData.createdAt ? animeData.createdAt : ""));
      entryRow.setAttribute("updatedAt",JSON.stringify(animeData.updatedAt ? animeData.updatedAt : ""));
    }
    async function fetchWithTimeout(url, timeout = 10000) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Fetch request was aborted');
        } else {
          console.error('Fetch error:', error);
        }
        throw error;
      }
    }
    async function fetchWithRetry(url, timeout = 15000, retries = 5) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await fetchWithTimeout(url, timeout);
        } catch (error) {
          if (attempt < retries) {
            $(".listLoading").html(`Retrying (${attempt}/${retries})... <i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>`);
            console.log(`Retrying (${attempt}/${retries})...`);
            await new Promise(res => setTimeout(res, 1000));
          } else {
            throw error;
            }
        }
      }
    }

    async function fetchAndCombineData() {
      let offset = 0;
      let allData = [];
      while (true) {
        try {
          const response = await fetchWithRetry(`https://myanimelist.net/${isManga ? ('mangalist/'+username) : ('animelist/'+username)}/load.json?offset=${offset}&status=7`);
          const data = await response.json();
          if (data.length === 0) {
            break;
          }
          allData = allData.concat(data);
          offset += 300;
        } catch (error) {
          console.error("Fetch error:", error);
          break;
        }
      }
      return allData;
    }

    async function getAnimeList(type){
      let animeDataList = [];
      isManga = type;
      const fetchUrl = isManga ? "https://myanimelist.net/mangalist/" + username + "?status=7" : "https://myanimelist.net/animelist/" + username + "?status=7";
      const listLoading = create("div",{
      class: "listLoading",
      style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px" },},
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>');
      const listEntries = create('div', {class: 'list-entries'});
      contRight.append(listLoading,listEntries);
        const html = await fetchAndCombineData().then(async allData => {
          let list = allData;

          if (list) {
            for (let x = 0; x < list.length; x++) {
              if (isManga) {
                animeDataList.push({
                  id: list[x].manga_id,
                  genres:list[x].genres,
                  tags:list[x].tags,
                  imageUrl: list[x].manga_image_path,
                  href: list[x].manga_url,
                  title: list[x].manga_title,
                  score: list[x].score,
                  startDate: list[x].start_date_string,
                  finishDate: list[x].finish_date_string,
                  progress: list[x].num_read_chapters,
                  progressEnd: list[x].manga_num_chapters,
                  createdAt:list[x].created_at,
                  updatedAt:list[x].updated_at,
                  status: list[x].status,
                  format: list[x].manga_media_type_string,
                  notes: list[x].editable_notes
                });
              } else {
                animeDataList.push({
                  id: list[x].anime_id,
                  genres:list[x].genres,
                  tags:list[x].tags,
                  season:list[x].anime_season,
                  imageUrl: list[x].anime_image_path,
                  href: list[x].anime_url,
                  title: list[x].anime_title,
                  score:  list[x].score,
                  startDate: list[x].start_date_string,
                  finishDate: list[x].finish_date_string,
                  progress: list[x].num_watched_episodes,
                  progressEnd: list[x].anime_num_episodes,
                  createdAt:list[x].created_at,
                  updatedAt:list[x].updated_at,
                  status: list[x].status,
                  format: list[x].anime_media_type_string,
                  notes: list[x].editable_notes
                });
              }
            }
          }
        })

      animeDataList.sort((a, b) => b.score - a.score);
      animeDataList.forEach(animeData => createEntryRow(animeData));
      const container = contRight.find('.list-entries');
      const divs = Array.from(container.find('.status-section'));
      divs.sort((a, b) => a.id.localeCompare(b.id));
      divs.forEach(div => container.append(div));
      $('.loadmore').hide();
      listLoading.remove();

      //List Filter
      const listFilter = create('div', {id: 'filter'});
      listFilter.innerHTML = '<label for="filter-input"></label><input type="text" id="filter-input" placeholder="Filter"><h3>Lists</h3>';
      const goBack = create('a', {class: 'filterLists-back fa fa-arrow-left'});
        goBack.onclick = () => {
          contLeft.children().show();
          contRight.children().show();
          $('.loadmore').show();
          $(".fav-slide-block.mb12").show();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").show();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").show();
          contLeft.find("#filter").remove();
          contLeft.find(".listCheck-footer").remove();
          contRight.find(".list-entries").remove();
        };
      $(listFilter).prepend(goBack);
      $(listFilter).prepend($('<h3>', {text: isManga ? 'Manga List' : 'Anime List',css: { marginTop: 0 }}));
      const a_all = create('a', {class: 'filterLists'},"All");
        a_all.onclick = () => { hideOtherSections("all")};
        const a_watching = create('a', {class: 'filterLists'},(isManga ? "Reading" : "Watching"));
        a_watching.onclick = () => { hideOtherSections("status-section-1")};
        const a_completed = create('a', {class: 'filterLists'},"Completed");
        a_completed.onclick =  () => { hideOtherSections("status-section-2")};
        const a_planning = create('a', {class: 'filterLists'},"Planning");
        a_planning.onclick = () => { hideOtherSections("status-section-6")};
        const a_paused = create('a', {class: 'filterLists'},"Paused");
        a_paused.onclick = () => { hideOtherSections("status-section-3")};
        const a_dropped = create('a', {class: 'filterLists'},"Dropped");
        a_dropped.onclick = () => { hideOtherSections("status-section-4")};
        const listsDiv = create('div', {class: 'filterListsDiv'});
         listsDiv.append(a_all,a_watching,a_completed,a_planning,a_paused,a_dropped);
        const listCount = create('div', {class: 'filterListsCount'});
        listCount.innerHTML = "("+document.querySelectorAll(".entry.row").length+")"+'<br>'+
          "("+document.querySelectorAll("#status-section-1 .entry.row").length+")"+'<br>'+
          "("+document.querySelectorAll("#status-section-2 .entry.row").length+")"+'<br>'+
          "("+document.querySelectorAll("#status-section-6 .entry.row").length+")"+'<br>'+
          "("+document.querySelectorAll("#status-section-3 .entry.row").length+")"+'<br>'+
          "("+document.querySelectorAll("#status-section-4 .entry.row").length+")";
        function hideOtherSections(sectionName) {
          let sections = document.querySelectorAll('.status-section');
          sections.forEach(function(section) {
            if(sectionName === 'all'){
              section.style.display = 'block';
            } else if (section.id !== sectionName) {
              section.style.display = 'none';
            }
            else{
              section.style.display = 'block';
            }
          });
        }

        const listsDivContainer = create('div', {class: 'filterListsDivContainer'});
        listsDivContainer.append(listsDiv,listCount);
        listFilter.append(listsDivContainer);
        contLeft.append(listFilter);
        document.getElementById('filter-input').addEventListener('input', function() {
          var filterValue = this.value.toLowerCase();
          var entries = document.querySelectorAll('.entry');
          entries.forEach(function(entry) {
            var titleText = entry.querySelector('.title a').textContent.toLowerCase();
            if (titleText.includes(filterValue)) {
              entry.classList.remove('hidden');
            } else {
              entry.classList.add('hidden');
            }
          });
        });

        //Genres Filter
        const genresFilter = create('div', {class: 'filterList_GenresFilter'});
        genresFilter.innerHTML = '<button class="genreDropBtn">Select Genres</button><div class="maljs-dropdown-content" id="maljs-dropdown-content">'+
          '<label><input type="checkbox" class="genre-filter" value="1" title="Action"> Action</label><label><input type="checkbox" class="genre-filter" value="2" title="Adventure">Adventure</label>'+
          '<label><input type="checkbox" class="genre-filter" value="5" title="Avant Garde"> Avant Garde</label><label><input type="checkbox" class="genre-filter" value="46" title="Award Winning"> Award Winning</label>'+
          '<label><input type="checkbox" class="genre-filter" value="28" title="Boys Love"> Boys Love</label>'+'<label><input type="checkbox" class="genre-filter" value="4" title="Comedy"> Comedy</label>'+
          '<label><input type="checkbox" class="genre-filter" value="8" title="Drama"> Drama</label><label><input type="checkbox" class="genre-filter" value="9" title="Ecchi"> Ecchi</label>'+
          '<label><input type="checkbox" class="genre-filter" value="10" title="Fantasy"> Fantasy</label><label><input type="checkbox" class="genre-filter" value="12" title="Hentai"> Hentai</label>'+
          '<label><input type="checkbox" class="genre-filter" value="26" title="Girls Love"> Girls Love</label><label><input type="checkbox" class="genre-filter" value="47" title="Gourmet"> Gourmet</label>'+
          '<label><input type="checkbox" class="genre-filter" value="14" title="Horror"> Horror</label><label><input type="checkbox" class="genre-filter" value="7" title="Mystery"> Mystery</label>'+
          '<label><input type="checkbox" class="genre-filter" value="22" title="Romance"> Romance</label><label><input type="checkbox" class="genre-filter" value="24" title="Sci-Fi"> Sci-Fi</label>'+
          '<label><input type="checkbox" class="genre-filter" value="36" title="Slice of Life"> Slice of Life</label><label><input type="checkbox" class="genre-filter" value="30" title="Sports"> Sports</label>'+
          '<label><input type="checkbox" class="genre-filter" value="37" title="Supernatural"> Supernatural</label><label><input type="checkbox" class="genre-filter" value="41" title="Suspense"> Suspense</label></div>';
          listFilter.appendChild(genresFilter);
        // Genres Dropdown Function
        $(".genreDropBtn").click(function(){
          const dropdownContent = document.getElementById('maljs-dropdown-content');
          dropdownContent.style.display = dropdownContent.style.display === 'grid' ? 'none' : 'grid';
        });
        // Genres Filter Function
        $(".genre-filter").click(function(){
          const checkboxes = document.querySelectorAll('.genre-filter');
          const entries = document.querySelectorAll('.entry');
          const selectedGenres = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value);
          entries.forEach(entry => {
            const genres = JSON.parse(entry.getAttribute('genres'));
            const entryGenres = genres.map(genre => genre.id.toString());
            const isVisible = selectedGenres.every(genre => entryGenres.includes(genre)) || selectedGenres.length === 0;
            if(isVisible){
              entry.classList.remove('hidden');
            } else {
              entry.classList.add('hidden');}
          });
          $(".genreDropBtn").text(selectedGenres.length > 0 ? Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.title) : "Select Genres");
        });

        //Year Filter
        const yearFilter = create('div', {class: 'filterList_YearFilter'});
        const yearFilterThisYear = new Date().getFullYear();
        const yearFilterClear = create('i', {class: 'year-filter-clear fa fa-close'});
        yearFilter.innerHTML = '<div class="year-filter-slider-container">'+
          '<input type="range" id="year-filter-slider" min="1917" max="'+yearFilterThisYear+'"value="'+yearFilterThisYear+'" step="1"><span id="year-filter-label">'+yearFilterThisYear+'</span></div>';
        if(!isManga && animeDataList[0] && animeDataList[0].season) {
          $(yearFilter).prepend('<h3>Year</h3>');
          $(yearFilter).prepend($(yearFilterClear));
          listFilter.appendChild(yearFilter);
          const $yearFilterSlider = $('#year-filter-slider');
          const $yearFilterLabel = $('#year-filter-label');

          // Year Filter Clear Button Function
          $(yearFilterClear).on('click', function() {
            const entries = document.querySelectorAll('.entry');
            entries.forEach(entry => {
              entry.classList.remove('hidden');
              yearFilterClear.style.display = "none";
              $yearFilterSlider.val(yearFilterThisYear).change();
              $yearFilterLabel.text($yearFilterSlider.val());
            });
          });
          // Update label when slider value changes
          $yearFilterSlider.on('input', function() {
            if(yearFilterClear.style.display !== "block"){
              yearFilterClear.style.display = "block"
            }
            $yearFilterLabel.text($(this).val());
            const entries = document.querySelectorAll('.entry');
            entries.forEach(entry => {
              const seasonData = JSON.parse(entry.getAttribute('season'));
              const entryYear = seasonData ? seasonData.year : null;
              if (entryYear && entryYear === parseInt($(this).val(), 10)) {
                entry.classList.remove('hidden');
              } else {
                entry.classList.add('hidden');
              }
            });
          });

        // Initialize label
        $yearFilterLabel.text($yearFilterSlider.val());
        }

      //Sort Filter
      const sortFilter = create("div", { class: "filterList_SortFilter" });
      sortFilter.innerHTML =
        '<div class="sort-container" style="display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;gap: 0px 10px;margin-top: 10px;">'+
        '<select id="sort-select" style="width:100%"><option value="score">Score</option><option value="title">Title</option>' +
        '<option value="startdate">Start Date</option><option value="finishdate">Finish Date</option><option value="createdat">Last Added</option>' +
        '<option value="updatedat">Last Updated</option></select><button class="fa fa-arrow-up" id="sort-asc" style="font-family: FontAwesome;width:33px;margin-top:0"></button>'+
        '<button class="fa fa-arrow-down" id="sort-desc" style="font-family: FontAwesome;width:33px;margin-top:0"></button></div>';
      listFilter.appendChild(sortFilter);
      const sortSelect = document.getElementById("sort-select");
      const sortAsc = document.getElementById("sort-asc");
      const sortDesc = document.getElementById("sort-desc");

      function sortEntriesInSection(section, criterion, order) {
        const entries = Array.from(section.querySelectorAll(".entry"));
        const compare = (a, b) => {
          const aValue = getValue(a, criterion);
          const bValue = getValue(b, criterion);
          if (order === "asc") {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        };

        entries.sort(compare);
        const parent = section;
        entries.forEach((entry) => parent.appendChild(entry));
      }

      function getValue(entry, criterion) {
        switch (criterion) {
          case "score":
            return parseInt(entry.querySelector(".score").textContent, 10);
          case "title":
            return entry.querySelector(".title").textContent.trim();
          case "startdate":
            return new Date(entry.getAttribute("startdate")).getTime();
          case "finishdate":
            return new Date(entry.getAttribute("finishdate")).getTime();
          case "createdat":
            return parseInt(entry.getAttribute("createdat"), 10);
          case "updatedat":
            return parseInt(entry.getAttribute("updatedat"), 10);
          default:
            return "";
        }
      }

      function sortAllSections(criterion, order) {
        const sections = document.querySelectorAll(".status-section");
        sections.forEach((section) => {
          sortEntriesInSection(section, criterion, order);
        });
      }

      sortAsc.addEventListener("click", () => {
        sortAllSections(sortSelect.value, "asc");
      });

      sortDesc.addEventListener("click", () => {
        sortAllSections(sortSelect.value, "desc");
      });

        //Tags
        const entries = document.querySelectorAll('.entry');
        const tagsContainer = create('div', {class: 'filterList_TagsContainer'});
        const tagsContainerClear = create('i', {class: 'tags-container-clear fa fa-close'});
        const tags = new Set(); // Using a Set to avoid duplicates
        tagsContainer.style.marginBottom = "10px";
        listFilter.appendChild(tagsContainer);
        // Tags Clear Button Function
        $(tagsContainerClear).on('click', function() {
          $(".tag-link.clicked").attr('class', 'tag-link');
          const entries = document.querySelectorAll('.entry');
          entries.forEach(entry => {
            entry.classList.remove('hidden');
            tagsContainerClear.style.display = "none";
          });
        });
        // Collect all unique tags
        entries.forEach(entry => {
        const tag = entry.getAttribute('tags').replace(/"/g, ''); // Remove quotes
        if (tag) {
          tags.add(tag);
        }
        });

        if(tags.size > 0) {
          $(tagsContainer).prepend('<h3>Tags</h3>');
          $(tagsContainer).prepend($(tagsContainerClear));
        }

        // Create tag links
        tags.forEach(tag => {
          const link = document.createElement('a');
          link.className = 'tag-link';
          link.textContent = tag;
          link.onclick = () => {
            $(".tag-link.clicked").attr('class', 'tag-link');
            $(link).attr('class', 'tag-link clicked');
            filterByTag(tag)
          };
          tagsContainer.appendChild(link);
        });
        // Filter function
        function filterByTag(tag) {
          if(tagsContainerClear.style.display !== "block"){
            tagsContainerClear.style.display = "block"
          }
          entries.forEach(entry => {
            const entryTag = entry.getAttribute('tags').replace(/"/g, '');
            if (entryTag === tag) {
              entry.classList.remove('hidden');
            } else {
              entry.classList.add('hidden');
            }
          });
        }

        //Compare Button
        if(username !== $(".header-profile-link").text()) {
        let compareBtn = create('a', {class: 'compareBtn'},"Compare");
        compareBtn.href = 'https://myanimelist.net/shared.php?u1='+username+'&u2='+$(".header-profile-link").text();
                listFilter.appendChild(compareBtn);
        }

        // Make 3x3
        let buttonDraw3x3 = AdvancedCreate("a", "#maljsDraw3x3", "Make 3x3");
        listFilter.appendChild(buttonDraw3x3);
        buttonDraw3x3.title = "Make 3x3";
        buttonDraw3x3.onclick = function () {
          if (!document.querySelector(".maljsDisplayBox")) {
            let displayBox = createDisplayBox(false, "3x3 Maker");
            let col_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
            let col_label = AdvancedCreate("span", false, "columns", displayBox, "margin: 5px");
            col_input.type = "number";
            col_input.value = 3;
            col_input.step = 1;
            col_input.min = 0;
            let row_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
            let row_label = AdvancedCreate("span", false, "rows", displayBox, "margin: 5px");
            AdvancedCreate("br", false, false, displayBox);
            row_input.type = "number";
            row_input.value = 3;
            row_input.step = 1;
            row_input.min = 0;
            let margin_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
            let margin_label = AdvancedCreate("span", false, "spacing (px)", displayBox, "margin: 5px");
            AdvancedCreate("br", false, false, displayBox);
            margin_input.type = "number";
            margin_input.value = 0;
            margin_input.min = 0;
            let width_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
            let width_label = AdvancedCreate("span", false, "image width (px)", displayBox, "margin: 5px");
            width_input.type = "number";
            width_input.value = 230;
            width_input.min = 0;
            let height_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
            let height_label = AdvancedCreate("span", false, "image height (px)", displayBox, "margin: 5px");
            AdvancedCreate("br", false, false, displayBox);
            height_input.type = "number";
            height_input.value = 345;
            height_input.min = 0;
            let fitMode = AdvancedCreate("select", "maljsNativeInput", false, displayBox);
            let fitMode_label = AdvancedCreate("span", false, "image fitting", displayBox, "margin	: 5px");
            let addOption = function (value, text) {
              let newOption = AdvancedCreate("option", false, text, fitMode);
              newOption.value = value;
            };
            addOption("scale", "scale");
            addOption("crop", "crop");
            addOption("hybrid", "scale/crop hybrid");
            addOption("letterbox", "letterbox");
            addOption("transparent", "transparent letterbox");

            let recipe = AdvancedCreate("p", false, "Click 9 media entries, then save the image below", displayBox);
            let linkList = [];
            let keepUpdating = true;
            let image_width = 230;
            let image_height = 345;
            let margin = 0;
            let columns = 3;
            let rows = 3;
            let mode = fitMode.value;

            displayBox.parentNode.querySelector(".maljsDisplayBoxClose").onclick = function () {
              displayBox.parentNode.remove();
              keepUpdating = false;
              let cardList = document.querySelectorAll(".entry.row");
              cardList.forEach(function (card) {
                card.draw3x3selected = false;
                card.style.borderStyle = "none";
              });
              linkList = [];
            };

            let finalCanvas = AdvancedCreate("canvas", false, false, displayBox, "max-height: 60%;max-width: 90%");
            let ctx = finalCanvas.getContext("2d");
            let updateDrawing = function () {
              finalCanvas.width = image_width * columns + (columns - 1) * margin;
              finalCanvas.height = image_height * rows + (rows - 1) * margin;
              ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
              let drawStuff = function (image, x, y, width, height) {
                let img = new Image();
                img.onload = function () {
                  let sx = 0;
                  let sy = 0;
                  let sWidth = img.width;
                  let sHeight = img.height;
                  let dx = x;
                  let dy = y;
                  let dWidth = width;
                  let dHeight = height;
                  if (mode === "crop") {
                    if (img.width / img.height > width / height) {
                      let factor = img.height / height;
                      sWidth = width * factor;
                      sx = (img.width - sWidth) / 2;
                    } else {
                      //crop top and bottom
                      let factor = img.width / width;
                      sHeight = height * factor;
                      sy = (img.height - sHeight) / 2;
                    }
                  } else if (mode === "hybrid") {
                    if (img.width / img.height > width / height) {
                      let factor = img.height / height;
                      sWidth = width * factor;
                      sWidth += (img.width - sWidth) / 2;
                      sx = (img.width - sWidth) / 2;
                    } else {
                      //crop top and bottom
                      let factor = img.width / width;
                      sHeight = height * factor;
                      sHeight += (img.height - sHeight) / 2;
                      sy = (img.height - sHeight) / 2;
                    }
                  } else if (mode === "letterbox" || mode === "transparent") {
                    if (img.width / img.height > width / height) {
                      let factor = img.width / width;
                      dHeight = img.height / factor;
                      dy = y + (height - dHeight) / 2;
                    } else {
                      //too tall
                      let factor = img.height / height;
                      dWidth = img.width / factor;
                      dx = x + (width - dWidth) / 2;
                    }
                    if (mode === "letterbox") {
                      ctx.fillStyle = "black";
                      ctx.fillRect(x, y, width, height);
                    }
                  } else {
                  }
                  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                };
                img.src = image;
              };
              for (var y = 0; y < rows; y++) {
                for (var x = 0; x < columns; x++) {
                  if (linkList[y * columns + x] !== "empty") {
                    drawStuff(linkList[y * columns + x], x * image_width + x * margin, y * image_height + y * margin, image_width, image_height);
                  }
                }
              }
            };

            let updateConfig = function () {
              columns = parseInt(col_input.value) || 3;
              rows = parseInt(row_input.value) || 3;
              margin = parseInt(margin_input.value) || 0;
              image_width = parseInt(width_input.value) || 230;
              image_height = parseInt(height_input.value) || 345;
              mode = fitMode.value;
              displayBox.parentNode.querySelector(".maljsDisplayBoxTitle").textContent = columns + "x" + rows + " Maker";
              recipe.innerText = "Click " + rows * columns + " media entries, then save the image below";
              updateDrawing();
            };
            col_input.oninput = updateConfig;
            row_input.oninput = updateConfig;
            margin_input.oninput = updateConfig;
            width_input.oninput = updateConfig;
            height_input.oninput = updateConfig;
            fitMode.oninput = updateConfig;

            let updateCards = function () {
              let cardList = document.querySelectorAll(".entry.row");
              cardList.forEach((card) => {
                card.onclick = function () {
                  if (this.draw3x3selected) {
                    linkList[linkList.indexOf(this.draw3x3selected)] = "empty";
                    this.draw3x3selected = false;
                    this.style.borderStyle = "none";
                  } else {
                    let val = this.querySelector(".cover .image").style.backgroundImage.replace("url(", "").replace(")", "").replace('"', "").replace('"', "");
                    if (
                      !linkList.some((place, index) => {
                        if (place === "empty") {
                          linkList[index] = val;
                          return true;
                        }
                        return false;
                      })
                    ) {
                      linkList.push(val);
                    }
                    this.draw3x3selected = val;
                    this.style.borderStyle = "solid";
                  }
                  updateDrawing();
                };
              });
            };
            let waiter = function () {
              updateCards();
              if (keepUpdating) {
                setTimeout(waiter, 500);
              }
            };
            waiter();
          }
        };
      }
  }
  //Anilist Style Anime and Manga List //-END-//
  //Profile Section //--END--//

  //Character Section //-START-//
  if (/\/(character)\/.?([\w-]+)?\/?/.test(current)) {
    let regex = /(Member Favorites).*/g;
    let match = document.createElement("p");
    let fav = document.querySelector("#content > table > tbody > tr > td.borderClass");
    match.innerText = fav.innerText.match(regex);
    fav.innerHTML = fav.innerHTML.replace(regex, "");
    if (match) {
      document.querySelector("#v-favorite").insertAdjacentElement("beforebegin", match);
    }
    if (/\/(clubs)/.test(current) || /\/(pics)/.test(current)) {
    } else {
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
        display: "-ms-grid",
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
      let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
      $(main).addClass("characterDiv");
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
      main.appendChild(text);

      //Remove spaces and add text at the top
      let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, "");
      text.innerHTML = fixtext;

      document.querySelector(".breadcrumb").after(text);

      //Cleanup
      $.trim($('.characterDiv').contents().not($('.description')).not($('.VoiceActorsDiv')).not($('#horiznav_nav')).not($('.breadcrumb')).not($('h2')).not($('table')).remove());
      $(".description").children().not($("li")).not($("input")).not($("span.spoiler_content")).remove();

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
      document.querySelector('.AlternativeTitlesDiv').nextElementSibling.setAttribute('style', 'margin-bottom:4px');
      $('span:contains("Synonyms")').parent().next().css({
        borderRadius: 'var(--br)'
      });
    }
    if (document.querySelector('.js-alternative-titles.hide')) {
      document.querySelector('.js-alternative-titles.hide').setAttribute('style', 'border-radius:var(--br);overflow:hidden');
    }
    if ($('.InformationDiv').length) {
      $(".InformationDiv").nextUntil("br").not('h2').attr('style','background:0!important').addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
    }
    if ($('.StatisticsDiv').length) {
      $(".StatisticsDiv").nextUntil("br").not('h2').attr('style','background:0!important').addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
      $(".statistics-info").css('opacity','0');
      $(".spaceit_pad.po-r.js-statistics-info.di-ib sup").css('opacity','0');
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

    handleEmptyInfo('.SynopsisDiv', "No synopsis information has been added to this title.");
    handleEmptyInfo('.CharactersDiv', "No characters or voice");
    handleEmptyInfo('.CharactersDiv', "No characters for this manga");
    handleEmptyInfo('.RecommendationsDiv', "No recommendations have been made");
    handleEmptyInfo('.StaffDiv', "No staff for this");
    handleEmptyInfo('.MoreInfoDiv','');

    if($('.RecentNewsDiv').length && !$('.RecentNewsDiv').next().is('div')){
      $('.RecentNewsDiv').remove();
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
        let relationData,sortedRelations,relationHeight;
        const relationDiv = create("div", { class: "aniTagDiv"});
        const relationTargetExpand = create('a', { class: 'relations-accordion-button' });
        const extraRelationsDiv = create('div', { class: 'relationsExpanded', style: { display: "none" } });
        const relationTarget = document.querySelector(".related-entries");
        const relationLocalForage = localforage.createInstance({ name: "MalJS", storeName: "relations" });
        const relationcacheTTL = 262974383;
        let relationCache = await relationLocalForage.getItem(entryId+"-"+entryType);
        const priorityOrder = {"ADAPTATION": 0,"PREQUEL": 1,"SEQUEL": 2,"PARENT": 3,"ALTERNATIVE": 4,"SIDE_STORY": 5,"SUMMARY": 6,"SPIN_OFF": 7,"CHARACTER": 8,"OTHER": 9};
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
        relationTarget.classList.add("spaceit-shadow");
          relationTarget.innerHTML = relationCache.relations
            .map((node) => {
            const isManga = node.node.type === "MANGA";
            const typePath = isManga ? "manga" : "anime";
            const format = node.node.format ? (node.node.format === "NOVEL" ? node.node.format = "LIGHT NOVEL" : node.node.format.replace('_',' ')) : node.node.type;
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

          function relationDetailsShow() {
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
          }

          relationDetailsShow();
          if(relationTarget.clientHeight > 140) {
            relationHeight = relationTarget.clientHeight;
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
              if (document.querySelector(".relationsExpanded").style.display === 'none') {
                document.querySelector(".relationsExpanded").setAttribute('style', 'display:flex!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
              } else {
                document.querySelector(".relationsExpanded").setAttribute('style', 'display:none!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
              }
            });
          }

          // Filter Replaced Relations
          let filterTarget = document.querySelector('.RelatedEntriesDiv .floatRightHeader');
          if(filterTarget && svar.relationFilter && svar.animeRelation) {
            let filtered;
            const relationDefault = relationTarget.innerHTML;
            const relationFilter = create('div', { class: 'relations-filter' });
            relationFilter.innerHTML =  '<label for="relationFilter"></label><select id="relationFilter">'+
              '<option value="">All</option><option value="ADAPTATION">Adaptation</option><option value="PREQUEL">Prequel</option>'+
              '<option value="SEQUEL">Sequel</option><option value="PARENT">Parent</option><option value="ALTERNATIVE">Alternative</option><option value="SUMMARY">Summary</option>'+
              '<option value="SIDE STORY">Side Story</option><option value="SPIN OFF">Spin Off</option><option value="CHARACTER">Character</option><option value="OTHER">Other</option></select>';
            filterTarget.append(relationFilter);
            extraRelationsDiv.setAttribute('style', 'display: flex!important;height: 0px;overflow: hidden;');

            function filterRelations(title) {
              if (!relationFilter.children[1].value.length) {
                relationTarget.innerHTML = relationDefault;
                filtered = 0;
              } else {
                if (!filtered) {
                  relationTarget.innerHTML = relationDefault + extraRelationsDiv.innerHTML;
                  filtered = 1;
                }
              }

              const entries = document.querySelectorAll('.relationEntry');
              for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (filtered) {
                  entry.style.marginLeft = "0";
                }
                const relationTitle = entry.querySelector('.relationTitle').textContent;
                if (title === "" || relationTitle === title) {
                  entry.style.display = 'block';
                } else {
                  entry.style.display = 'none';
                }
              }

              if (!relationFilter.children[1].value.length) {
                extraRelationsDiv.setAttribute('style', 'display:none!important');
                relationTargetExpand.setAttribute('style', 'display:block!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
              if (relationHeight) {
                relationTarget.setAttribute('style', 'margin-bottom: 5px;padding: 12px 4px!important;');
              } else {
                relationTarget.setAttribute('style', 'padding: 12px 12px!important;');
              }
              } else {
                relationTargetExpand.setAttribute('style', 'display:none!important');
                relationTarget.setAttribute('style', 'padding: 12px 12px!important;');
              }
              relationDetailsShow();
            }

            function updateFilterOptions() {
              const options = document.querySelectorAll('#relationFilter option');
              const titles = Array.from(document.querySelectorAll('.relationTitle')).map(el => el.textContent);
              for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.value !== "") {
                  if (!titles.includes(option.value)) {
                    option.remove();
                  }
                }
              }
              if(document.querySelectorAll('#relationFilter option').length <= 2) {
                document.querySelector('.relations-filter').remove();
              }
              else{
                document.querySelector('.RelatedEntriesDiv').setAttribute('style', 'align-content: center;margin-bottom: 10px;');
                document.querySelector('.RelatedEntriesDiv #related_entries').setAttribute('style', 'margin-top: 10px;');
              }
            }

            document.getElementById('relationFilter').addEventListener('change', function() {
              filterRelations(this.value);
            });
            filterRelations('');
            updateFilterOptions();
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
      $(peopleDivShadow).attr('style','background:0!important');
      $(peopleDivShadow).nextUntil('div:not(.spaceit_pad)').attr('style','background:0!important').addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
      $('div:contains("Website:"):last').html() === 'Website: <a href="http://"></a>' ? $('div:contains("Website:"):last').remove() : null;
      $('div:contains("Family name:"):last').html() === 'Family name: ' ? $('div:contains("Family name:"):last').remove() : null;
      $('span:contains("More:"):last').css({display: 'block',padding: '2px'});
    }
  }

  //Companies add border and shadow
  if(/\/(anime|manga)\/producer\/\d.?([\w-]+)?\/?/.test(current)) {
    let studioDivShadow = $('.mb16:contains("Member"):last');
    if ($(studioDivShadow).length && $(studioDivShadow).children().css('flex') !== '1 1 0%') {
      $(studioDivShadow).children().attr('style','background:0!important').wrapAll("<div class='spaceit-shadow-end-div'></div>");
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
      if(extra) {
        extra.innerText = ' ' + extra.innerText;
      }
      if (svar.characterNameAlt) {
      if(extra) {
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
        for(let x=0; x< themeSongs.length; x++){
          const favorite = create('div',{class: 'fav fa-star',style:{fontFamily: 'FontAwesome',display: 'inline-block',marginLeft: '5px',cursor:'pointer'}},'',);
          favorite.onclick = () => {
            $(favorite).parent().find('.oped-preview-button').click();
            const title = $(favorite).parent().text();
            const type = $(favorite).parent().prev("h2").text();
            const src = $(favorite).parent().find('video').attr('src');
            const favArray = [
              {
                animeTitle:document.title.replace(' - MyAnimeList.net',''),
                animeImage:document.querySelector("img[itemprop]").src,
                animeUrl:currentid,
                songTitle:title.substring(2),
                songSource:src,
                themeType:(type === "Openings" ? "OP" : "ED")
              }
            ];
            const compressedBase64 = LZString.compressToBase64(JSON.stringify(favArray));
            const base64url = compressedBase64.replace(/\//g, '_');
            editAboutPopup(`favSongEntry/${base64url}`,'favSongEntry');
            $(favorite).parent().find('.oped-preview-button').click();
          }
          themeSongs[x].append(favorite);
        }
      }
      addAccordion('div.di-t > div.anisongs:nth-child(1)');
      addAccordion('div.di-t > div.anisongs:nth-child(2)');
      let aniSongsMainDiv = document.querySelector("div.di-t:has(.anisongs)");
      if(aniSongsMainDiv) {
      let lastCheck = nativeTimeElement(Math.floor(data.time / 1000));
      let AniSongsReCheck = create("i",{class:"fa-solid fa-rotate-right",style:{cursor: "pointer",color: "var(--color-link)"}});
      let AniSongsFooter = create('div',{class: 'anisongs-footer',style:{textAlign:"right"}},'Themes provided from '+'<a href="https://animethemes.moe/">AnimeThemes.moe</a><br>' + 'Last Update: ' + lastCheck + ' ');
      AniSongsFooter.append(AniSongsReCheck);
      AniSongsReCheck.onclick = () => {
        songCache.removeItem(currentid);
        window.location.reload();
      }
      aniSongsMainDiv.append(AniSongsFooter);
      }
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
