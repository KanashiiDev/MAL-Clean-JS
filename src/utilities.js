//Delay Function
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

//Simple Create Element Shorthand Function
function create(e, t, n) {
  if (!e) throw SyntaxError("'tag' not defined");
  var r,
    i,
    f = document.createElement(e);
  if (t)
    for (r in t)
      if ("style" === r) for (i in t.style) f.style[i] = t.style[i];
      else t[r] && f.setAttribute(r, t[r]);
  return n && (f.innerHTML = n), f;
}

//Advanced Create Element Shorthand Function
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

function createDisplayBox(cssProperties, windowTitle) {
  let displayBox = AdvancedCreate("div", "maljsDisplayBox", false, document.querySelector("#myanimelist"));
  if (windowTitle) {
    AdvancedCreate("span", "maljsDisplayBoxTitle", windowTitle, displayBox);
  }
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let isDownResize = false;
  let displayBoxClose = AdvancedCreate("span", "maljsDisplayBoxClose", "x", displayBox);
  displayBoxClose.onclick = function () {
    displayBox.remove();
  };
  let resizePearl = AdvancedCreate("span", "maljsResizePearl", false, displayBox);
  displayBox.addEventListener(
    "mousedown",
    function (e) {
      let root = e.target;
      while (root.parentNode) {
        //don't annoy people trying to copy-paste
        if (root.classList.contains("scrollableContent")) {
          return;
        }
        root = root.parentNode;
      }
      isDown = true;
      offset = [displayBox.offsetLeft - e.clientX, displayBox.offsetTop - e.clientY];
    },
    true
  );
  resizePearl.addEventListener(
    "mousedown",
    function (event) {
      event.stopPropagation();
      event.preventDefault();
      isDownResize = true;
      offset = [displayBox.offsetLeft, displayBox.offsetTop];
    },
    true
  );
  document.addEventListener(
    "mouseup",
    function () {
      isDown = false;
      isDownResize = false;
    },
    true
  );
  document.addEventListener(
    "mousemove",
    function (event) {
      if (isDownResize) {
        mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        displayBox.style.width = mousePosition.x - offset[0] + 5 + "px";
        displayBox.style.height = mousePosition.y - offset[1] + 5 + "px";
        return;
      }
      if (isDown) {
        mousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        displayBox.style.left = mousePosition.x + offset[0] + "px";
        displayBox.style.top = mousePosition.y + offset[1] + "px";
      }
    },
    true
  );
  let innerSpace = AdvancedCreate("div", "scrollableContent", false, displayBox);
  return innerSpace;
}

//Copy mal clean colors to iframe (required for customFg customization)
function copyLastFgStyleToIframe(iframe) {
  if (!iframe.contentDocument) {
    return;
  }
  let styles = document.head.querySelectorAll("style");
  let lastFgStyle = null;
  styles.forEach((style) => {
    if (style.textContent.includes("--fg:")) {
      lastFgStyle = style;
    }
  });

  if (lastFgStyle) {
    let iframeDoc = iframe.contentDocument;
    let newStyle = iframeDoc.createElement("style");
    newStyle.textContent = lastFgStyle.textContent;
    iframeDoc.head.appendChild(newStyle);
  }
}

// MalClen Settings - Edit About Popup
async function editAboutPopup(data, type) {
  return new Promise((resolve, reject) => {
    if ($("#currently-popup").length) {
      return;
    }
    let canSubmit = 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);", style: { display: "none" } });
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
    });
    const popupDataText = create("div", { class: "dataTextDiv" });
    const popupDataTextButton = create("button", { class: "dataTextButton" }, "Copy");
    const popupLoading = create(
      "div",
      {
        class: "actloading",
        style: { position: "relative", left: "0px", right: "0px", fontSize: "16px", height: "100%", alignContent: "center", zIndex: "2" },
      },
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome;word-break: break-word;"></i>'
    );
    const iframe = create("iframe", { style: { pointerEvents: "none", opacity: "0" }, src: "https://myanimelist.net/editprofile.php" });

    // close popup function
    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    popup.append(popupClose, popupLoading, iframe);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    async function notFound() {
      iframe.remove();
      popupClose.style.display = "block";
      popupLoading.innerHTML = "You are not using classic about.<br><br>Please paste this code into a public blog post on the first page so that the code will run automatically.<br><br>";
      popupDataText.innerHTML = "[url=https://malcleansettings/]‎ [/url]";
      popupLoading.append(popupDataText, popupDataTextButton);
      popupDataTextButton.addEventListener("click", async function () {
        try {
          await navigator.clipboard.writeText(popupDataText.innerText);
          popupDataTextButton.innerText = "Copied!";
        } catch (err) {
          console.error("Error:", err);
        }
      });
    }

    $(iframe).on("load", async function () {
      let $iframeContents = $(iframe).contents();
      let $about = $iframeContents.find("#classic-about-me-textarea");
      let isClassic = $iframeContents.find("#about_me_setting_2").is(":checked");
      let $submit = $iframeContents.find('.inputButton[type="submit"]');
      const regexes = {
        match: /(\[url=https:\/\/malcleansettings\/)(.*)(]‎) \[\/url\]/gm,
        add: /(\[url=https:\/\/malcleansettings\/)(.*)(]‎)/gm,
        privateProfile: /(privateProfile)\/([^\/]+.)/gm,
        hideProfileEl: /(hideProfileEl)\/([^\/]+.)/gm,
        customPf: /(custompf)\/([^\/]+.)/gm,
        customFg: /(customfg)\/([^\/]+.)/gm,
        customBg: /(custombg)\/([^\/]+.)/gm,
        customCSS: /(customCSS)\/([^\/]+.)/gm,
        customBadge: /(custombadge)\/([^\/]+.)/gm,
        customColor: /(customcolors)\/([^\/]+.)/gm,
        malBadges: /(malBadges)\/([^\/]+.)/gm,
        favSongEntry: /(favSongEntry)\/([^\/]+.)/gm,
        customProfileEl: /(customProfileEl)\/([^\/]+.)/gm,
        moreFavs: /(moreFavs)\/([^\/]+.)/gm,
      };
      let userBlogPage = "https://myanimelist.net/blog/" + headerUserName;
      popupLoading.innerHTML = "Updating" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
      $iframeContents.find("body")[0].setAttribute("style", "background:0!important");
      if ($iframeContents.find(".goodresult")[0]) {
        canSubmit = 0;
        window.location.reload();
        return;
      }
      if ($iframeContents.find(".badresult")[0]) {
        canSubmit = 0;
        popupLoading.innerHTML = "An error occured. Please try again.";
        return;
      }

      // Replace text with regex check
      function replaceTextIfMatches(regex, aboutText, replacement, add) {
        if (add) {
          return aboutText.replace(regexes.add, `$1$2${replacement}$3`);
        }
        if (regex.test(aboutText)) {
          return aboutText.replace(regex, replacement);
        }
        return aboutText.replace(regexes.add, `$1$2${replacement}$3`);
      }

      // Update about text and submit
      async function updateAboutText(newText) {
        $about.text(newText);
        $submit.click();
      }

      async function changeData() {
        let aboutText = $about.text();

        //if no custom settings, add default custom settings
        if (!regexes.match.test(aboutText)) {
          aboutText = "[url=https://malcleansettings/]‎ [/url]" + aboutText;
        }

        // Update based on the type
        if (type === "color") {
          aboutText = replaceTextIfMatches(regexes.customColor, aboutText, `${data}/`);
        } else if (type === "badge") {
          aboutText = replaceTextIfMatches(regexes.customBadge, aboutText, `${data}/`);
        } else if (type === "malBadges") {
          aboutText = replaceTextIfMatches(regexes.malBadges, aboutText, `${data}/`);
        } else if (type === "private") {
          aboutText = replaceTextIfMatches(regexes.privateProfile, aboutText, `${data}/`);
        } else if (type === "pf") {
          aboutText = replaceTextIfMatches(regexes.customPf, aboutText, `${data}/`);
        } else if (type === "fg") {
          aboutText = replaceTextIfMatches(regexes.customFg, aboutText, `${data}/`);
        } else if (type === "bg") {
          aboutText = replaceTextIfMatches(regexes.customBg, aboutText, `${data}/`);
        } else if (type === "css") {
          aboutText = replaceTextIfMatches(regexes.customCSS, aboutText, `${data}/`);
        } else if (type === "moreFavs") {
          aboutText = replaceTextIfMatches(regexes.moreFavs, aboutText, `${data}/`);
        } else if (type === "hideProfileEl") {
          aboutText = replaceTextIfMatches(regexes.hideProfileEl, aboutText, `${data}/`);
        } else if (type === "customProfileEl") {
          aboutText = replaceTextIfMatches(regexes.customProfileEl, aboutText, `${data}/`, 1);
        } else if (type === "favSongEntry") {
          if (!$iframeContents.find(".goodresult")[0]) {
            if (aboutText.indexOf(data) > -1) {
              popupLoading.innerHTML = "Already Added";
              popupClose.style.display = "block";
              canSubmit = 0;
            } else {
              aboutText = replaceTextIfMatches(regexes.favSongEntry, aboutText, `${data}/`, 1);
            }
          }
        } else if (type === "editCustomEl") {
          aboutText = aboutText.replace(`/${data[0]}/`, `/${data[1]}/`);
        } else if (type === "removeFavSong" || type === "removeCustomEl") {
          aboutText = aboutText.replace(data, "");
        } else if (type === "replaceFavSong" || type === "replaceCustomEl") {
          aboutText = aboutText.replace(`/${data[0]}/`, `/${data[1]}/`).replace(`/${data[1]}/`, `/${data[0]}/`);
        } else if (type === "removeAll") {
          aboutText = aboutText.replace(regexes.match, "");
        }
        if (canSubmit) {
          await updateAboutText(aboutText);
        }
      }

      if (isClassic && settingsFounded !== 2) {
        changeData();
      } else if ($(iframe).attr("src").indexOf("blog") === -1) {
        iframe.src = userBlogPage;
      }
      if ($(iframe).contents()[0].URL.indexOf("editprofile.php") === -1) {
        if ($(iframe).contents()[0].URL.indexOf("myblog.php") === -1) {
          let $blogFound = null;
          const $maljsBlogDivs = $iframeContents.find('#content > div div:has(a:contains("Edit Entry"))').prev();
          if ($maljsBlogDivs.length) {
            $maljsBlogDivs.each(function () {
              const $this = $(this);
              if ($this.html().includes("malcleansettings")) {
                $blogFound = 1;
                const $editLink = $this.next().find('a[href*="/myblog.php?go=edit"]');
                if ($editLink.length) {
                  iframe.src = $editLink.attr("href");
                }
              }
            });
          }
          if (!$blogFound) {
            notFound();
          }
        } else {
          $about = $iframeContents.find("textarea[name='entry_text']");
          $submit = $iframeContents.find('.inputButton[name="subentry"]');
          changeData();
        }
      }
    });
    // close popup click function
    popupClose.onclick = () => {
      close();
    };
  });
}

// Anime/Manga Edit Popup
async function editPopup(id, type, add, addCount, addFg) {
  return new Promise((resolve, reject) => {
    if ($("#currently-popup").length) {
      return;
    }
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/ownlist/" + (type ? type.toLocaleLowerCase() : "anime") + "/" + id + "/edit?hideLayout=1";
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupLoading = create(
      "div",
      {
        class: "actloading",
        style: { position: "relative", left: "0px", right: "0px", fontSize: "16px", height: "100%", alignContent: "center", zIndex: "2" },
      },
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
    });
    const iframe = create("iframe", { style: { opacity: "0" }, src: popupId });
    const close = () => {
      if ($(iframe).contents().find(".goodresult")[0] && url) {
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

    popup.append(popupClose, popupLoading, iframe);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
      $(iframe).contents().find("body")[0].setAttribute("style", "background:0!important");
      if (addFg) {
        copyLastFgStyleToIframe(iframe);
      }
      if (!add) {
        popupLoading.remove();
        iframe.style.opacity = 1;
      } else {
        popupLoading.innerHTML = "Updating" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
      }
      if (add && $(iframe).contents().find(".goodresult")[0]) {
        close();
      }
      if ($(iframe).contents().find(".badresult")[0]) {
        popupLoading.innerHTML = "An error occured. Please try again.";
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
          if (ep > 0 && !startDate) {
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
      $(iframe)
        .contents()
        .find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")
        .on("input", function () {
          checkEp();
        });

      //if increment episode (+) clicked
      $(iframe)
        .contents()
        .find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")
        .next()
        .on("click", function () {
          checkEp();
        });

      //if entry status is completed
      $(iframe)
        .contents()
        .find("#add_anime_status,#add_manga_status")[0]
        .addEventListener("change", function () {
          if (this.value == "2") {
            checkEp();
          }
        });

      if (add) {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
        let mangaVol = $(iframe).contents().find("#add_manga_num_read_volumes")[0];
        let mangaVolLast = parseInt($(iframe).contents().find("#totalVol").text());
        let status = $(iframe).contents().find("#add_anime_status,#add_manga_status")[0];
        let submit = $(iframe).contents().find(".inputButton.main_submit")[0];
        ep.value = parseInt(ep.value) + addCount;
        if (parseInt(ep.value) >= lastEp && lastEp !== 0) {
          status.value = 2;
          if (mangaVol) {
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
      $(iframe)
        .contents()
        .find("#totalEpisodes,#totalChap")
        .next()
        .children()
        .on("click", function () {
          iframe.style.opacity = 0;
          popup.prepend(popupLoading);
          popup.prepend(popupBack);
        });

      //if history back clicked
      $(popupBack).on("click", function () {
        iframe.style.opacity = 0;
        popup.prepend(popupLoading);
        iframe.src = popupId;
        popupBack.remove();
      });
    });

    // close popup
    popupMask.onclick = () => {
      if (!add) {
        close();
      }
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

// Block User Popup
async function blockUser(id) {
  return new Promise((resolve, reject) => {
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/editprofile.php?go=privacy";
    const popupLoading = create(
      "div",
      {
        class: "actloading",
        style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px" },
      },
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
    });
    const iframe = create("iframe", { style: { opacity: "0" }, src: popupId });
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
      $(iframe).contents().find("body")[0].setAttribute("style", "background:0!important");
      iframe.style.opacity = 1;
      popupLoading.remove();
      if ($(iframe).contents().find("form > input.inputtext")[0]) {
        $(iframe).contents().find("#headerSmall")[0].remove();
        $(iframe).contents().find("#menu")[0].remove();
        $(iframe).contents().find("#horiznav_nav")[0].remove();
        $(iframe).contents().find("footer")[0].remove();
        $(iframe).contents().find(".h1")[0].remove();
        $(iframe).contents().find("form > input.inputtext")[0].value = id;
        $(iframe).contents().find("a[href*=profile]").removeAttr("href");
        $(iframe).contents().find("html")[0].style.overflowX = "hidden";
        $(iframe).contents().find("#content")[0].style.padding = "0";
        $(iframe).contents().find("#contentWrapper")[0].setAttribute("style", "top: 5px!important;min-height: auto;padding: 0;width:auto;margin-left:0!important");
        $(iframe).contents().find("#myanimelist")[0].setAttribute("style", "width: auto;padding: 0px 5px;");
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

      $(iframe)
        .contents()
        .find("input[name='bsub']")
        .on("click", function () {
          iframe.style.opacity = 0;
          popup.append(popupLoading);
        });

      $(iframe)
        .contents()
        .find("span:has(form)")
        .on("click", function () {
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

// Anilist API Request
async function AnilistAPI(fullQuery) {
  var query = fullQuery;
  let url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    };
  await delay(333);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) {
      return null;
    }
    if (data.data) {
      return data;
    }
  } catch (error) {
    return null;
  }
}

let AlAPIData;
let AlAPIRequestPromise;

async function aniAPIRequest() {
  if (!AlAPIRequestPromise) {
    const AlQuery = `query {Media(idMal:${entryId}, type:${entryType}) {bannerImage tags {isMediaSpoiler name rank description}
    relations {edges {relationType node {status startDate {year} seasonYear type format title {romaji} coverImage {medium large} idMal}}}
    nextAiringEpisode {timeUntilAiring episode}}}`;
    AlAPIRequestPromise = AnilistAPI(AlQuery).then((data) => {
      AlAPIData = data;
      AlAPIRequestPromise = null;
      return data;
    });
  }
  return AlAPIRequestPromise;
}

//  MalClean - Add Loader
let loadingDiv = create("div", { class: "actloading", id: "loadingDiv", style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px", zIndex: "12" } });
const loadingDivMask = create("div", {
  class: "fancybox-overlay",
  style: { background: "var(--color-background)", opacity: "1", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
});

function addLoading(type = "add", text = "Loading", circle = 1, force = 0) {
  const contWrap = document.querySelector("#contentWrapper");
  if (contWrap) {
    if (force) {
      $(loadingDiv).attr("force", force);
    }
    let spinCircle = '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
    if (type === "add") {
      loadingDiv.innerHTML = text + (circle ? spinCircle : "");
      if (!document.querySelector("#loadingDiv")) {
        document.body.append(loadingDivMask, loadingDiv);
      }
      document.querySelector("#contentWrapper").style.opacity = "0";
      document.body.style.overflow = "hidden";
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    } else if (type === "remove" && !$(loadingDiv).attr("force")) {
      loadingDivMask.remove();
      loadingDiv.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector("#contentWrapper").style.opacity = "1";
    }
    if (type === "forceRemove") {
      loadingDivMask.remove();
      loadingDiv.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector("#contentWrapper").style.opacity = "1";
    }
  }
}

//Compresses multiple localForage databases into a single LZString compressed string
async function compressLocalForageDB(...dbNames) {
  try {
    // Validate input
    if (!dbNames.length || dbNames.length < 2) {
      throw new Error("At least 2 database names must be provided");
    }

    // Helper function to fetch all data from a database
    const fetchDB = async (name) => {
      const db = await localforage.createInstance({
        name: "MalJS",
        storeName: name,
      });

      const keys = await db.keys();
      const data = {};

      await Promise.all(
        keys.map(async (key) => {
          data[key] = await db.getItem(key);
        })
      );

      return data;
    };

    // Fetch all databases in parallel
    const dbData = {};
    await Promise.all(
      dbNames.map(async (name) => {
        if (name) dbData[name] = await fetchDB(name);
      })
    );

    // Compress the data
    const jsonString = JSON.stringify(dbData);
    const compressedData = LZString.compressToBase64(jsonString).replace(/\//g, "_");

    return compressedData;
  } catch (error) {
    console.error("Database compression error:", error);
    return null;
  }
}

//Time Calculate
function nativeTimeElement(e) {
  let $ = new Date(1e3 * e);
  if (isNaN($.valueOf())) return "Now";
  return (function e() {
    let r = Math.round(new Date().valueOf() / 1e3) - Math.round($.valueOf() / 1e3);
    if (0 === r) return "Now";
    if (1 === r) return "1 second ago";
    if (r < 60) return r + " seconds ago";
    if (r < 120) return "1 minute ago";
    if (r < 3600) return Math.floor(r / 60) + " minutes ago";
    else if (r < 7200) return "1 hour ago";
    else if (r < 86400) return Math.floor(r / 3600) + " hours ago";
    else if (r < 172800) return "1 day ago";
    else if (r < 604800) return Math.floor(r / 86400) + " days ago";
    else if (r < 1209600) return "1 week ago";
    else if (r < 2419200) return Math.floor(r / 604800) + " weeks ago";
    else if (r < 29030400) return Math.floor(r / 2419200) + " months ago";
    else return Math.floor(r / 29030400) + " years ago";
  })();
}

//Fix Date for Modern Anime/Manga List option
function parseDate(dateString, string) {
  const parts = dateString.split("-");
  let day = parts[0];
  let month = parts[1];
  let yearSuffix = parts[2];
  const currentYear = new Date().getFullYear();
  const currentYearSuffix = (currentYear % 100) + 4;
  let year = parseInt(yearSuffix, 10) > currentYearSuffix ? "19" + yearSuffix : "20" + yearSuffix;
  const fromString = { month: parseInt(month, 10), day: parseInt(day, 10), year: parseInt(year, 10) };
  return string ? fromString : new Date(`${year}-${month}-${day}`).getTime();
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
      if (attrName === "style")
        for (styleName in attrs.style) {
          ele.style[styleName] = attrs.style[styleName];
        }
      if (attrName === "sa")
        for (styleName in attrs.sa) {
          ele.setAttribute("style", attrs.sa[styleName]);
        }
      if (attrName === "sap")
        for (styleName in attrs.sap) {
          ele.parentElement.setAttribute("style", attrs.sap[styleName]);
        }
      if (attrName === "r") {
        ele.remove();
      }
      if (attrName === "pp")
        for (styleName in attrs.pp) {
          ele.prepend(document.querySelector(attrs.pp[styleName]));
        }
      if (attrName === "sal")
        for (styleName in attrs.sal) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].setAttribute("style", attrs.sal[styleName]);
          }
        }
      if (attrName === "sl")
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
  if (substringLength === void 0) {
    substringLength = 2;
  }
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (!caseSensitive) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }
  if (str1.length < substringLength || str2.length < substringLength) return 0;
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
  return (match * 2) / (str1.length + str2.length - (substringLength - 1) * 2);
};

// Current Watching Airing Schedule - Calculate Time
async function airingTime(sec) {
  const timeUntilAiring = sec;
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  const targetTimeStamp = currentTimeStamp + timeUntilAiring;
  const remainingTime = targetTimeStamp - currentTimeStamp;
  const days = Math.floor(remainingTime / (24 * 60 * 60));
  const hours = Math.floor((remainingTime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
  return (days ? days + "d " : "") + (hours ? hours + "h " : "") + (minutes ? minutes + "m" : "");
}

async function replaceLocalForageDB(instance, newData) {
  const db = await localforage.createInstance({ name: "MalJS", storeName: instance });
  await db.clear();
  for (let i = 0; i < newData.length; i++) {
    await db.setItem(newData[i].key, newData[i]);
  }
}

// Current Watching Airing Schedule - Episode Behind
async function episodesBehind(c, w) {
  if (c - 1 <= w) {
    return;
  } else {
    const epBehind = c - 1 - w;
    return epBehind + " ep behind";
  }
}

//Rgb to Hex
function rgbToHex(rgb) {
  let result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return rgb;
  return "#" + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase();
}

//Days to TTL
function daysToTTL(days, toDay) {
  if (isNaN(days) || days <= 0) {
    return 86400000;
  }
  const ttl = toDay ? days / (1000 * 60 * 60 * 24) : days * 24 * 60 * 60 * 1000;
  return ttl;
}

// Anime-Manga Add Class
function aniMangaAddClass(main, name) {
  const h2 = $('h2:contains("' + main + '"):last');
  if (h2.length > 0) {
    name = name || main.split(" ").join("") + "Div";
    const parent = h2.parent();
    parent.is("div") && !parent.hasClass("leftside") && !parent.hasClass("rightside") ? parent.addClass(name) : h2.addClass(name);
  }
}

// Create MalClean List Divs
function createListDiv(title, buttons) {
  let btns = create("div", { class: "mainListBtnsDiv" });
  for (let x = 0; x < buttons.length; x++) {
    let mainDiv = create("div", { class: "mainListBtnDiv", id: buttons[x].b.id + "Option" });
    $(mainDiv).append(buttons[x].b, "<h3>" + buttons[x].t + "</h3>", buttons[x]?.s);
    btns.append(mainDiv);
  }
  let div = create("div", { class: "malCleanSettingContainer", id: title.trim().replace(/[\W_]+/, "-") }, '<div class="malCleanSettingHeader"><h2>' + title + "</h2></div>");
  div.append(btns);
  return div;
}

//Get Text until Selector
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

//Add SCEditor Commands
async function addSCEditorCommands() {
  //ScEditor Color Picker
  sceditor.command.set("colorpick", {
    _dropDown: function (e, t) {
      if ($("input.bbcode-message-color-picker").length === 0) {
        $('<input type="color" class="bbcode-message-color-picker" />').css({ position: "absolute", opacity: 0, width: 0, height: 0 }).appendTo("body").val("#ff0000");
      }
      var colorPicker = $("input.bbcode-message-color-picker");
      colorPicker.css({
        top: $(t).offset().top + 24 + "px",
        left: $(t).offset().left + 12 + "px",
      });
      colorPicker.trigger("click");
      colorPicker.off("change").on("change", function () {
        var color = colorPicker.val();
        if (e.inSourceMode()) {
          e.insertText("[color=" + color + "]", "[/color]");
        } else {
          e.execCommand("forecolor", color);
        }
      });
    },
    exec: function (e) {
      sceditor.command.get("colorpick")._dropDown(this, e);
    },
    txtExec: function (e) {
      sceditor.command.get("colorpick")._dropDown(this, e);
    },
    tooltip: "Font Color",
  });

  //ScEditor Spoiler
  sceditor.formats.bbcode.set("spoiler", {
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    isInline: false,
    format: function (element, content) {
      var desc = "";
      var $elm = $(element);
      var $button = $elm.children("button").first();
      if ($button.length === 1 || $elm.data("desc")) {
        desc = $button.text() || $elm.data("desc");
        $button.remove();
        content = this.elementToBbcode(element);
        if (desc === "spoiler") {
          desc = "";
        } else if (desc.charAt(0) !== "=") {
          desc = "=" + desc;
          $elm.data("desc", desc);
        }
        $elm.prepend($button);
      }

      return "[spoiler" + desc + "]" + content + "[/spoiler]";
    },
    html: function (token, attrs, content) {
      var data = "";
      var desc = attrs.defaultattr || "Spoiler";
      content =
        '<div class="spoiler">' +
        '<input type="button" class="button show_button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" data-showname="Show Spoiler" data-hidename="Hide Spoiler" value="Show ' +
        desc +
        '">' +
        '<span class="spoiler_content" style="display:none">' +
        '<input type="button" class="button hide_button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide ' +
        desc +
        '">' +
        "<br>" +
        content +
        "</span></div>";
      if (attrs.defaultattr) {
        data += ' data-desc="' + sceditor.escapeEntities(attrs.defaultattr) + '"';
      }
      return "<blockquote" + data + ' class="spoiler">' + content + "</blockquote>";
    },
  });
  sceditor.command.set("spoiler", {
    exec: function (caller) {
      var html = '<blockquote class="spoiler"><button>spoiler</button><span class="spoiler_content" style="display:none"></span></blockquote>';
      this.wysiwygEditorInsertHtml(html);
      $(this.getBody())
        .find("blockquote.spoiler")
        .each(function () {
          if ($(this).find("button").length == 0) {
            $(this).prepend("<button>spoiler</button>");
          }
        });
    },
    txtExec: ["[spoiler]", "[/spoiler]"],
    tooltip: "Insert a spoiler",
  });

  //ScEditor Center
  sceditor.formats.bbcode.set("center", {
    styles: {
      "text-align": ["center", "-webkit-center", "-moz-center", "-khtml-center"],
    },
    isInline: false,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function (element, content) {
      return "[center]" + content + "[/center]";
    },
    html: function (token, attrs, content) {
      return '<div style="text-align: center;">' + content + "</div>";
    },
  });

  //ScEditor Right
  sceditor.formats.bbcode.set("right", {
    styles: {
      "text-align": ["right", "-webkit-right", "-moz-right", "-khtml-right"],
    },
    isInline: false,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function (element, content) {
      return "[right]" + content + "[/right]";
    },
    html: function (token, attrs, content) {
      return '<div style="text-align: right;">' + content + "</div>";
    },
  });

  //ScEditor Color
  sceditor.formats.bbcode.set("color", {
    styles: {
      color: null,
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      let color = element.style.color;
      if (color.startsWith("rgb")) color = rgbToHex(color);
      return "[color=" + color + "]" + content + "[/color]";
    },
    html: function (token, attrs, content) {
      return '<span style="color: ' + (attrs.defaultattr || "inherit") + ';">' + content + "</span>";
    },
  });

  //ScEditor Size
  sceditor.formats.bbcode.set("size", {
    styles: {
      "font-size": null,
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      let fontSize = element.style.fontSize;
      if (!fontSize) return content;
      return `[size=${fontSize.replace(/px/g, "").replace(/%/g, "")}]${content}[/size]`;
    },
    html: function (token, attrs, content) {
      let sizeValue = attrs.defaultattr ? attrs.defaultattr + "%" : "inherit";
      return `<span style="font-size: ${sizeValue};">${content}</span>`;
    },
  });

  //ScEditor Font
  sceditor.formats.bbcode.set("font", {
    styles: {
      "font-family": null,
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      return "[font=" + element.style.fontFamily + "]" + content + "[/font]";
    },
    html: function (token, attrs, content) {
      return '<span style="font-family: ' + (attrs.defaultattr || "inherit") + ';">' + content + "</span>";
    },
  });
  //ScEditor Div
  sceditor.formats.bbcode.set("div", {
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    isInline: false,
    tags: {
      div: {
        id: null,
        class: null,
        style: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      return `[div${elId}${elClass}${elStyle}]${content}[/div]`;
    },

    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-div"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-div"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      return `<div${elId}${elClass}${elStyle}>${content}</div>`;
    },
  });
  sceditor.command.set("div", {
    txtExec: function (caller, content) {
      let editor = this;
      let sce_div = '<div id="sce_divoptionsbox"><div class="sce_div-option" data-action="insertDiv">';
      sce_div += '<label for="div-id">ID (Optional):</label><input id="div-id" type="text" placeholder=".id" />';
      sce_div += '<label for="div-class">Class (Optional):</label><input id="div-class" type="text" placeholder="#class" />';
      sce_div += '<label for="div-style">Style (Optional):</label><input id="div-style" type="text" placeholder="" /><br>';
      sce_div += '<input id="insert-div-btn" type="button" class="button" value="Insert"></input>';
      sce_div += "</div></div>";
      let drop_content = $(sce_div);

      // Handle div insertion
      drop_content.find("#insert-div-btn").click(function (e) {
        let divId = $("#div-id").val() ? ` id="${$("#div-id").val()}"` : "";
        let divClass = $("#div-class").val() ? ` class="${$("#div-class").val()}"` : "";
        let divStyle = $("#div-style").val() ? ` style="${$("#div-style").val()}"` : "";
        let divTag = `[div${divId}${divClass}${divStyle}]${content}[/div]`;
        editor.insert(divTag);
        editor.closeDropDown(true);
        e.preventDefault();
      });
      editor.createDropDown(caller, "div-picker", drop_content[0]);
    },
    tooltip: "Insert a Div",
  });

  //ScEditor Iframe
  sceditor.formats.bbcode.set("iframe", {
    allowsEmpty: false,
    tags: {
      iframe: {
        class: null,
        style: null,
        src: null,
        width: null,
        height: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      let src = element.getAttribute("src");
      let width = element.getAttribute("width") || 415;
      let height = element.getAttribute("height") || 315;
      let title = element.getAttribute("title") ? ` title="${element.getAttribute("title")}"` : "";
      let sandbox = element.getAttribute("sandbox") ? ` sandbox="${element.getAttribute("sandbox")}"` : "";
      let allow = element.getAttribute("allow") ? ` allow="${element.getAttribute("allow")}"` : "";
      let loading = element.getAttribute("loading") ? ` loading="${element.getAttribute("loading")}"` : "";
      let referrerpolicy = element.getAttribute("referrerpolicy") ? ` referrerpolicy="${element.getAttribute("referrerpolicy")}"` : "";
      let mergedAttributes = `${title}${sandbox}${allow}${loading}${referrerpolicy}`;

      if (src && src.startsWith("https://")) {
        return `[iframe${elId}${elClass}${elStyle} width="${width}" height="${height}"${mergedAttributes}]${src}[/iframe]`;
      }
      return content;
    },
    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-iframe"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-iframe"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      let width = attrs.width || 415;
      let height = attrs.height || 315;
      let title = attrs.title ? ` title="${attrs.title}"` : "";
      let allow = attrs.allow ? ` allow="${attrs.allow}"` : "";
      let loading = attrs.loading ? ` loading="${attrs.loading}"` : "";
      let referrerpolicy = attrs.referrerpolicy ? ` referrerpolicy="${attrs.referrerpolicy}"` : "";
      let sandbox = 'sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"';
      let mergedAttributes = `${title}${allow}${loading}${referrerpolicy}`;

      if (content && content.startsWith("https://")) {
        return `<iframe${elId}${elClass}${elStyle} width="${width}" height="${height}" src="${content}" ${mergedAttributes} ${sandbox}></iframe>`;
      }
      return "";
    },
  });
  sceditor.command.set("iframe", {
    txtExec: function (caller) {
      var editor = this;
      var sce_iframe = '<div id="sce_iframeoptionsbox"><div class="sce_iframe-option" data-action="insertIframe">';
      sce_iframe += '<label for="iframe-src">Iframe URL:</label><input id="iframe-src" type="text" placeholder="https://" />';
      sce_iframe += '<label for="iframe-width">Width (Optional):</label><input id="iframe-width" type="text" placeholder="" />';
      sce_iframe += '<label for="iframe-height">Height (Optional):</label><input id="iframe-height" type="text" placeholder="" />';
      sce_iframe += '<label for="iframe-style">Style (Optional):</label><input id="iframe-style" type="text" placeholder="" /><br>';
      sce_iframe += '<label for="iframe-html-src">Iframe as HTML (Optional):</label><textarea id="iframe-html-src" placeholder="<iframe src=&quot;&quot;></iframe>" /></textarea>';
      sce_iframe += '<input id="insert-iframe-btn" type="button" class="button" value="Insert"></input>';
      sce_iframe += "</div></div>";
      var drop_content = $(sce_iframe);

      // Handle iframe insertion
      drop_content.find("#insert-iframe-btn").click(function (e) {
        let iframeSrc = $("#iframe-src").val();
        let iframeHTMLSrc = $("#iframe-html-src").val();
        let iframeWidth = $("#iframe-width").val() ? ` width="${$("#iframe-width").val()}"` : "";
        let iframeHeight = $("#iframe-height").val() ? ` height="${$("#iframe-height").val()}"` : "";
        let iframeStyle = $("#iframe-style").val() ? ` style="${$("#iframe-style").val()}"` : "";
        let iframeTag;
        if (iframeHTMLSrc) {
          iframeSrc = "";
        }
        if (iframeSrc.startsWith("https://") && !iframeHTMLSrc) {
          iframeTag = `[iframe${iframeWidth}${iframeHeight}${iframeStyle}]${iframeSrc}[/iframe]`;
          editor.insert(iframeTag);
        }
        if (/src="https:\/\//.test(iframeHTMLSrc)) {
          iframeTag = iframeHTMLSrc;
          editor.insert(iframeTag);
        }
        editor.closeDropDown(true);
        e.preventDefault();
      });

      editor.createDropDown(caller, "iframe-picker", drop_content[0]);
    },
    tooltip: "Insert an Iframe",
  });

  //ScEditor Video
  sceditor.formats.bbcode.set("video", {
    allowsEmpty: false,
    tags: {
      video: {
        src: null,
        width: null,
        height: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      let src = element.getAttribute("src");
      let width = element.getAttribute("width") || 415;
      let height = element.getAttribute("height") || 315;
      let autoplay = element.getAttribute("autoplay") === "" ? " autoplay=1" : "";
      let controls = element.getAttribute("controls") === "" ? "" : " controls=0";
      let muted = element.getAttribute("muted") === "" ? " muted=1" : "";
      let loop = element.getAttribute("loop") === "" ? " loop=1" : "";
      let poster = element.getAttribute("poster") ? ` poster="${element.getAttribute("poster")}"` : "";
      let mergedAttributes = `${autoplay}${controls}${muted}${loop}${poster}`;
      return src ? `[video width="${width}" height="${height}"${mergedAttributes}]${src}[/video]` : content;
    },
    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-video"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-video"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      let width = attrs.width || 415;
      let height = attrs.height || 315;
      let autoplay = attrs.autoplay ? " autoplay" : "";
      let controls = attrs.controls == 0 ? "" : " controls";
      let muted = attrs.muted || autoplay ? " muted" : "";
      let loop = attrs.loop ? " loop" : "";
      let poster = attrs.poster ? ` poster="${attrs.poster}"` : "";
      let mergedAttributes = `${autoplay}${controls}${muted}${loop}${poster}`;
      return `<video ${elId}${elClass}${elStyle} width="${width}" height="${height}" frameborder="0" src="${content}" ${mergedAttributes} onloadstart="this.volume=0.5"></video>`;
    },
  });
  sceditor.command.set("video", {
    txtExec: function (caller) {
      var editor = this;
      var sce_video = '<div id="sce_videooptionsbox"><div class="sce_video-option" data-action="insertVideo">';
      sce_video += '<label for="video-url">Video URL:</label><input id="video-url" type="text" placeholder="https://" />';
      sce_video += '<label for="video-width">Width (Optional):</label><input id="video-width" type="text" placeholder="" />';
      sce_video += '<label for="video-height">Height (Optional):</label><input id="video-height" type="text" placeholder="" />';
      sce_video += '<label for="video-style">Style (Optional):</label><input id="video-style" type="text" placeholder="" /><br>';
      sce_video += '<div><label><input type="checkbox" id="video-autoplay" /> Autoplay</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-muted" /> Muted</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-loop" /> Loop</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-controls" checked /> Controls</label></div>';
      sce_video += '<input id="insert-video-btn" type="button" class="button" value="Insert"></input>';
      sce_video += "</div></div>";
      var drop_content = $(sce_video);

      // Handle video insertion
      drop_content.find("#insert-video-btn").click(function (e) {
        let videoSrc = $("#video-url").val();
        let videoWidth = $("#video-width").val() ? ` width="${$("#video-width").val()}"` : "";
        let videoHeight = $("#video-height").val() ? ` height="${$("#video-height").val()}"` : "";
        let videoStyle = $("#video-style").val() ? ` style="${$("#video-style").val()}"` : "";

        // Get checked attributes
        let autoplay = $("#video-autoplay").is(":checked") ? " autoplay=1" : "";
        let muted = $("#video-muted").is(":checked") ? " muted=1" : "";
        let loop = $("#video-loop").is(":checked") ? " loop=1" : "";
        let controls = $("#video-controls").is(":checked") ? "" : " controls=0";

        if (videoSrc) {
          var videoTag = `[video${videoWidth}${videoHeight}${videoStyle}${autoplay}${muted}${loop}${controls}]${videoSrc}[/video]`;
          editor.insert(videoTag);
        }
        editor.closeDropDown(true);
        e.preventDefault();
      });

      editor.createDropDown(caller, "video-picker", drop_content[0]);
    },
    tooltip: "Insert a Video",
  });
}

//Add SCEditor
async function addSCEditor(source) {
  await addSCEditorCommands();
  sceditor.create(source, {
    format: "bbcode",
    style: "/css/sceditor.inner.css",
    width: "100%",
    height: "180px",
    charset: "utf-8",
    emoticonsEnabled: true,
    resizeMaxHeight: -1,
    resizeMinHeight: 100,
    resizeMinWidth: 440,
    resizeHeight: true,
    resizeWidth: false,
    startInSourceMode: true,
    autoUpdate: true,
    toolbar: "bold,italic,underline,strike|size,center,right,colorpick|bulletlist,orderedlist|code,quote,spoiler|image,link,youtube|video,iframe,div",
    allowIFrame: true,
    allowedIframeUrls: [],
    toolbarExclude: null,
    parserOptions: {},
    allowedTags: ["*"],
    allowElements: ["*"],
    allowedAttributes: ["*"],
    disallowedTags: [],
    disallowedAttibs: [],
  });
}

//ScParser toBBCode Function
function scParserActions(elementId, type) {
  const scParser = sceditor.instance(document.getElementById(elementId));
  let scText = scParser.val();
  if (type === "getVal") {
    return scText;
  }
  if (type === "fromBBGetVal") {
    return scParser.fromBBCode(scText, true);
  }
  if (type === "bbRefresh") {
    let bbCodeContent = scParser.toBBCode(scText);

    scParser.val(bbCodeContent);
  }
}

// Add Divs to People Details
function peopleDetailsAddDiv(title) {
  let divElements = $('span:contains("' + title + '"):last').nextUntil("div");
  let divNameElement = $('span.dark_text:contains("' + title + '")');
  let divNameText = divNameElement[0] && divNameElement[0].nextSibling ? divNameElement[0].nextSibling.nodeValue.trim() : null;
  let newDiv = $('<div class="spaceit_pad"></div>').html(title + " " + divNameText);
  for (let x = 0; x < divElements.length; x++) {
    newDiv.append(divElements[x]);
  }
  if (divNameElement) {
    divNameText ? (divNameElement[0].nextSibling.nodeValue = "") : null;
    divNameElement.after(newDiv);
    divNameElement.remove();
  }
}

// Add Div to Empty Anime/Manga Info
function emptyInfoAddDiv(title, mode) {
  let newDiv = $('<div itemprop="description" style="display: block;"></div>');
  let cDiv = $(title)[0];
  let siblings = [];
  if (mode) {
    while (cDiv.nextSibling && cDiv.nextSibling.nodeName !== "DIV") {
      siblings.push(cDiv.nextSibling);
      cDiv = cDiv.nextSibling;
    }
  } else {
    for (let i = 0; i < 3; i++) {
      if (cDiv.nextSibling.nodeName !== "BR") {
        siblings.push(cDiv.nextSibling);
        cDiv = cDiv.nextSibling;
      }
    }
  }
  newDiv.append(...siblings);
  $(title).after(newDiv);
}

//Check Empty Anime & Manga info
function handleEmptyInfo(divSelector, checkText, mode) {
  const $div = $(divSelector);
  if ($div.length) {
    const nextSibling = $div[0].nextSibling;
    if (nextSibling && !$(nextSibling).attr("itemprop") && (nextSibling.nodeValue || nextSibling.innerText) && (nextSibling.nodeValue || nextSibling.innerText).includes(checkText)) {
      emptyInfoAddDiv(divSelector, mode);
      if (nextSibling.innerHTML) {
        nextSibling.innerHTML = nextSibling.innerHTML.replace("<br>", "");
      }
    }
  }
}

//Get Recently Added from MyAnimeList
async function getRecentlyAdded(type, page) {
  const dataArray = [];
  try {
    await delay(250);
    const response = await fetch(`https://myanimelist.net/${type ? "manga" : "anime"}.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1&show=${page ? page : "0"}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("div.js-categories-seasonal tr");

    rows.forEach((row) => {
      const imgSrc = row.querySelector("td img") ? row.querySelector("td img").getAttribute("data-src").replace("/r/50x70/", "/") : "";
      if (imgSrc) {
        const title = row.querySelector("td strong") ? row.querySelector("td strong").textContent : "";
        const type = row.querySelector('td[width="45"]') ? row.querySelector('td[width="45"]').textContent.trim() : "";
        const url = row.querySelector("td a") ? row.querySelector("td a").href : "";
        dataArray.push({
          img: imgSrc,
          title: title,
          type: type,
          url: url,
        });
      }
    });
    return dataArray;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

//Build Recently Added List
async function buildRecentlyAddedList(list, appLoc) {
  for (let x = 1; x < list.length; x++) {
    let rDiv = create("li", { class: "btn-anime" });
    rDiv.innerHTML =
      '<i class="fa fa-info-circle" style="font-family: &quot;Font Awesome 6 Pro&quot;; position: absolute; right: 3px; top: 3px; padding: 4px; opacity: 0; transition: 0.4s; z-index: 20;"></i>' +
      '<a class="link" href=' +
      list[x].url +
      ">" +
      '<img width="124" height="170" class="lazyloaded" src=' +
      list[x].img +
      ">" +
      '<span class="recently-added-type">' +
      list[x].type +
      "</span>" +
      '<span class="title js-color-pc-constant color-pc-constant">' +
      list[x].title +
      "</span></a>";
    document.querySelector(appLoc).append(rDiv);
  }
}

//Add all Recently Added Items to List
function addAllRecentlyAdded(main, list) {
  main.forEach((item) => {
    if (!list.contains(item)) {
      list.appendChild(item);
    }
  });
}

//Filter Recently Added List
function filterRecentlyAdded(items, selectedTypes) {
  items.forEach((item) => {
    const type = item.querySelector(".recently-added-type").textContent;
    if (!selectedTypes.includes(type)) {
      item.remove();
    }
  });
}

//Create Info Tooltip
let waitForInfo = 0;
async function createInfo(clickedSource, mainDiv, type) {
  if (!waitForInfo && $(".tooltipBody").length === 0) {
    waitForInfo = 1;
    clickedSource.attr("class", "fa fa-circle-o-notch fa-spin");
    let info, isFailed;
    if (!clickedSource.closest(".btn-anime")[0].getAttribute("details")) {
      //Get info from Jikan API
      async function getinfo(id) {
        const apiUrl = `https://api.jikan.moe/v4/${type ? "manga" : "anime"}/${id}/full`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          info = data.data;
        } catch (error) {
          info = '<div class="main">Error: ' + error + "</div>";
          isFailed = 1;
        }
      }
      let id = clickedSource.next(".link")[0].href.split("/")[4];
      await getinfo(id);
      if (info.title) {
        info =
          '<div class="main">' +
          (info.title
            ? '<div class="text" style="position: relative;border-bottom: 1px solid;"><h3 style="max-width: 90%;margin-top: 5px;">' +
              info.title +
              "</h3><a id='" +
              info.mal_id +
              "' class='addtoList'>Add to List</a></div>"
            : "") +
          (info.title_english && info.title_english !== info.title ? '<br><div class="text"><b>English Title</b><br>' + info.title_english + "</div>" : "") +
          (info.synopsis ? '<br><div class="text"><b>Synopsis</b><br>' + info.synopsis.replace(/(\[Written by MAL Rewrite\]+)/gm, "") + "</div>" : "") +
          (info.genres && info.genres[0]
            ? '<br><div class="text"><b>Genres</b><br>' +
              info.genres
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(", ") +
              "</div>"
            : "") +
          (info.studios && info.studios[0]
            ? '<br><div class="text"><b>Studios</b><br>' +
              info.studios
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(", ") +
              "</div>"
            : "") +
          (info.authors && info.authors[0]
            ? '<br><div class="text"><b>Authors</b><br>' +
              info.authors
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(", ") +
              "</div>"
            : "") +
          (info.serializations && info.serializations[0]
            ? '<br><div class="text"><b>Serialization</b><br>' +
              info.serializations
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(", ") +
              "</div>"
            : "") +
          (info.themes && info.themes[0]
            ? '<br><div class="text"><b>Themes</b><br>' +
              info.themes
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(", ") +
              "</div>"
            : "") +
          (info.demographics && info.demographics[0]
            ? '<br><div class="text"><b>Demographics</b><br>' +
              info.demographics
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(", ") +
              "</div>"
            : "") +
          (info.type ? '<br><div class="text"><b>Type</b><br>' + info.type + "</div>" : "") +
          (info.rating ? '<br><div class="text"><b>Rating</b><br>' + info.rating + "</div>" : "") +
          (info.aired && info.aired.string ? '<br><div class="text"><b>Start Date</b><br>' + info.aired.string.split(" to ?").join("") + "</div>" : "") +
          (info.broadcast && info.broadcast.string ? '<br><div class="text"><b>Broadcast</b><br>' + info.broadcast.string + "</div>" : "") +
          (info.episodes ? '<br><div class="text"><b>Episodes</b><br>' + info.episodes + "</div>" : "") +
          (info.chapters ? '<br><div class="text"><b>Chapters</b><br>' + info.chapters + "</div>" : "") +
          (info.volumes ? '<br><div class="text"><b>Volumes</b><br>' + info.volumes + "</div>" : "") +
          (info.trailer && info.trailer.embed_url
            ? '<br><div class="text"><b>Trailer</b><br>' +
              '<div class="spoiler">' +
              '<input type="button" class="button show_button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" data-showname="Show Trailer" data-hidename="Hide Trailer" value="Show Trailer">' +
              '<span class="spoiler_content" style="display:none">' +
              '<input type="button" class="button hide_button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide Trailer">' +
              "<br>" +
              '<iframe width="700" height="400" class="movie youtube" frameborder="0" autoplay="0" allow="fullscreen" src="' +
              info.trailer.embed_url.split("&autoplay=1").join("") +
              '"></iframe></span></div>' +
              "</div>"
            : "") +
          '<br><div class="text"><b>Forum</b><br>' +
          "<a href='" +
          info.url +
          "/forum" +
          "'>All</a> | <a href='" +
          info.url +
          "/forum?topic=episode" +
          "'>" +
          (type ? "Chapters" : "Episodes") +
          "</a> | <a href='" +
          info.url +
          "/forum?topic=other" +
          "'>Other</a></div>" +
          (info.external && info.external[0]
            ? '<br><div class="text"><b>Available At</b><br>' +
              info.external
                .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
                .toString()
                .split(",")
                .join(" | ") +
              "</div>"
            : "");
      } else {
        info = '<div class="main">No information found in JikanAPI</div>';
      }
      if (!isFailed) {
        clickedSource.closest(".btn-anime")[0].setAttribute("details", "true");
        $('<div class="tooltipDetails"></div>').html(info).appendTo(clickedSource.closest(".btn-anime"));
      }
    }
    var title = await clickedSource.attr("alt");
    clickedSource.data("tooltipTitle", title);

    $(
      '<div class="tooltipBody">' +
        ($(".tooltipBody").length === 0 && clickedSource.closest(".btn-anime")[0].children[2] ? clickedSource.closest(".btn-anime")[0].children[2].innerHTML : "") +
        "</div>"
    )
      .appendTo(mainDiv)
      .slideDown(400);
    $(".tooltipBody .addtoList").on("click", async function () {
      await editPopup($(this).attr("id"));
    });
    clickedSource.attr("class", "fa fa-info-circle");
    waitForInfo = 0;
  }
}

//Info Tooltip Check Mouse Leave
async function infoExit(mainDiv, clickedFrom) {
  let timeoutId, isElHover, isTTBHover;
  async function handleTooltipHide() {
    isElHover = clickedFrom.parent().is(":hover");
    isTTBHover = $(".tooltipBody:hover").length;
    // Check if neither the tooltip nor the target element is being hovered over
    if (!isTTBHover && !isElHover) {
      await delay(250);
      if (!isTTBHover && !isElHover) {
        // When both elements are not hovered, hide the tooltip
        $(".tooltipBody").slideUp(400, function () {
          $(this).remove(); // Remove tooltip
          clearTimeout(timeoutId);
        });
      }
    } else {
      // If hovered, keep checking the condition at intervals
      timeoutId = setTimeout(handleTooltipHide, 400);
    }
  }
  // Initial check to start the hide process
  timeoutId = setTimeout(handleTooltipHide, 400);
}

//Update Recently Added List Sliders
function updateRecentlyAddedSliders(slider, leftSlider, rightSlider) {
  if (slider.childNodes.length > 4) {
    document.querySelector(rightSlider).classList.add("active");
  } else {
    document.querySelector(rightSlider).classList.remove("active");
  }
  document.querySelector(leftSlider).classList.remove("active");
  $(".widget-container.left.recently-anime i")
    .on("click", async function () {
      infoExit(".widget-container.left.recently-anime .anime_suggestions", $(this));
      createInfo($(this), ".widget-container.left.recently-anime .anime_suggestions");
    })
    .on("mouseleave", async function () {
      infoExit(".widget-container.left.recently-anime .anime_suggestions", $(this));
    });
  $(".widget-container.left.recently-manga i")
    .on("click", async function () {
      infoExit(".widget-container.left.recently-manga .anime_suggestions", $(this));
      createInfo($(this), ".widget-container.left.recently-manga .anime_suggestions", 1);
    })
    .on("mouseleave", async function () {
      infoExit(".widget-container.left.recently-manga .anime_suggestions", $(this));
    });
}

async function getBlogContent() {
  const tdElements = document.querySelectorAll('td[width="50%"][valign="top"]');
  for (const td of tdElements) {
    const linkElement = td.querySelector('a[href^="/blog.php?eid="]');
    if (linkElement) {
      const blogUrl = linkElement.getAttribute("href");
      try {
        const response = await fetch(blogUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const blogContent = doc.querySelector(".blog_detail_content_wrapper");
        if (blogContent) {
          td.setAttribute("class", "blogMainWide");
          const targetDiv = td.querySelector("div:nth-child(2)");
          if (targetDiv) {
            const newDiv = create("div", { class: "blog_detail_content_wrapper", style: { width: "auto", maxHeight: "500px", overflow: "auto", margin: "10px 0px" } });
            newDiv.innerHTML = blogContent.innerHTML;
            targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);
          }
        }
        await delay(333);
      } catch (error) {
        console.error("An error occurred while retrieving blog content:", error);
      }
    }
  }
}

async function getUserGenres(type, createDiv) {
  const genreTitle = type ? "Manga" : "Anime";
  const genreType = type ? "manga" : "anime";
  const apiUrl = `https://myanimelist.net/profile/${username}/chart-data.json?type=${genreType}-genre-table&sort=count&order=desc&categories=genres%2Cthemes`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const items = data.items;
      if (items && items.length > 0 && createDiv) {
        const itemsTop5 = data.items.slice(0, 5);
        let genresDivMain = create(
          "div",
          { class: "user-genres", id: `user-${genreType}-genres` },
          `<h5 style="font-size: 11px;margin-bottom: 8px;margin-left: 2px;">${genreTitle} Genre Overview</h5>`
        );
        let genresDiv = create("div", { class: "user-genres-container", id: "user-genres-container" });
        let genresDivInner = create("div", { class: "user-genres-inner", id: "user-genres-inner" });
        genresDivMain.append(genresDiv);
        genresDiv.append(genresDivInner);
        if ($("#user-anime-genres").length) {
          $("#user-anime-genres").after(genresDivMain);
        } else {
          $(".user-button.clearfix.mb12").after(genresDivMain);
        }
        itemsTop5.forEach((item) => {
          const genreDiv = create("div", { class: "user-genre-div" });
          const genreName = create("div", { class: "user-genre-name" }, `<a href="${item.item_list_url}">${item.item}</a>`);
          const genreCount = create("div", { class: "user-genre-count" }, `<b>${item.item_count} </b><p>Entries</p>`);
          genreDiv.append(genreName, genreCount);
          genresDivInner.append(genreDiv);
        });
        $(genresDiv).css("width", "max-content");
        $("#user-status-history-div").css("margin-top", "10px");
        while (genresDivInner.offsetWidth > 425) {
          genresDivInner.lastChild.remove();
        }
        $(genresDiv).css("width", "auto");
      } else if (items && items.length > 0) {
        return items;
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

async function getMalBadges(url) {
  if (!svar.modernLayout) url += "&default";
  let badgesDivMain = create("div", { class: "user-mal-badges", id: "user-mal-badges" }, `<h5 style="font-size: 11px;margin-bottom: 8px;margin-left: 2px;">Mal Badges</h5>`);
  let badgesDivInner = create("div", { class: "badges-inner", id: "badges-inner" });
  let badgesDivIframeInner = create("div", { class: "badges-iframe-inner", id: "badges-iframe-inner" });
  let badgesIframe = create("iframe", { class: "badges-iframe", id: "badges-iframe", tabindex: "-1", scrolling: "no", width: "415", height: "315", src: url, style: { display: "none" } });
  let badgesIframeLoading = create(
    "div",
    {
      class: "actloading",
      style: { position: "relative", left: "0px", right: "0px", fontSize: "14px", height: "120px", alignContent: "center", zIndex: "2" },
    },
    "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome;word-break: break-word;"></i>'
  );
  if (!svar.modernLayout) {
    $([badgesIframe, badgesDivIframeInner, badgesDivInner]).addClass("defaultMal");
    badgesIframeLoading.style.height = "72px";
  }
  badgesIframe.onerror = function () {
    badgesDivMain.remove();
  };
  badgesIframe.onload = function () {
    badgesIframeLoading.remove();
    badgesIframe.style.display = "block";
  };
  badgesDivMain.append(badgesDivInner);
  badgesDivInner.append(badgesDivIframeInner);
  badgesDivIframeInner.append(badgesIframeLoading, badgesIframe);
  $(badgesDivIframeInner).wrap(`<a href="${url.split("?")[0]}"></a>`);
  $("#user-badges-div").after(badgesDivMain);
}

//Get Friends Info from JikanAPI
async function getFriends(username) {
  let allFriends = [];
  let page = 1;
  let isFinished = 0;
  try {
    while (!isFinished) {
      const response = await fetch(`https://api.jikan.moe/v4/users/${username}/friends?page=${page}`);
      const remainingRequests = response.headers.get("X-RateLimit-Remaining");
      const resetTime = response.headers.get("X-RateLimit-Reset");
      if (remainingRequests === "0") {
        const currentTime = Math.floor(Date.now() / 1000);
        const waitTime = resetTime - currentTime;
        console.log(`Rate limit reached. Waiting for ${waitTime} seconds.`);
        await delay(waitTime * 1000);
      }
      const data = await response.json();
      const friends = data.data.map((friend) => friend.user);
      allFriends = allFriends.concat(friends);
      if (!data.pagination.has_next_page) {
        isFinished = 1;
      }
      page++;
      await delay(500);
    }
    return allFriends;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

//Fetch Custom Profile About Data
//(The 'username' variable must be replaced with 'headerUserName' when retrieving data from somewhere other than the profile.)
async function fetchCustomAbout(processFunction, regex = /(malcleansettings)\/([^"\/])/gm, url = `https://myanimelist.net/profile/${username}`) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.text();
    return await processFunction(data, regex);
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function processRssFeed(xml, regex) {
  const parser = new DOMParser();
  const data = parser.parseFromString(xml, "text/xml");
  const items = data.querySelectorAll("item");

  for (let i = 0; i < items.length; i++) {
    const description = items[i].querySelector("description").textContent;
    if (description.match(regex)) {
      settingsFounded = 2;
      return description;
    }
  }
  return null;
}

async function processProfilePage(html, regex) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const userProfileAbout = doc.querySelector(".user-profile-about");

  if (userProfileAbout && userProfileAbout.innerHTML.match(regex)) {
    return userProfileAbout.innerHTML;
  } else {
    await delay(250);
    const rssData = await fetchCustomAbout(processRssFeed, regex, `https://myanimelist.net/rss.php?type=blog&u=${username}`);
    if (rssData) {
      settingsFounded = 1;
      return rssData;
    }
  }
  return null;
}
