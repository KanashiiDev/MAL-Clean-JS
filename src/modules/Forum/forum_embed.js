if (svar.embed && /\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href)) {
  const embedCache = localforage.createInstance({ name: "MalJS", storeName: "embed" });
  const options = { cacheTTL: svar.embedTTL ? svar.embedTTL : 2592000000, class: "embed" };
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
  async function getEmbedData(id, type) {
    let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
    if (type === "manga") {
      apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
    }
    try {
      const cache = (await embedCache.getItem(id)) || { time: 0 };
      data = await cache;
      if (data && data.data && data.data.status) {
        if (data.data.status === "Finished Airing" || data.data.status === "Finished") {
          options.cacheTTL = 15552000000;
        } else {
          options.cacheTTL = svar.embedTTL;
        }
      }
      if (cache.time + options.cacheTTL < Date.now()) {
        data = await fetchData(apiUrl);
        if (data.status === 404) {
          return;
        }
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
            year: data.data.type !== "Anime" ? publishedYear || airedYear || "" : airedYear || "",
            url: data.data.url,
          },
          time: Date.now(),
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
        const detailsArray = [];
        if (data.data.type) {
          detailsArray.push(data.data.type);
        }
        if (data.data.status) {
          detailsArray.push(data.data.status.split("Currently").join(""));
        }
        if (data.data.season) {
          detailsArray.push(data.data.season.charAt(0).toUpperCase() + data.data.season.slice(1));
        }
        const year =
          cached && data.data.year ? data.data.year : data.data.type !== "Anime" && publishedYear ? publishedYear : airedYear ? airedYear : data.data.type === "Anime" && airedYear ? airedYear : "";
        if (year) {
          detailsArray.push(year);
        }
        if (data.data.score) {
          detailsArray.push('<span class="score">' + " · " + Math.floor(data.data.score * 10) + "%" + "</span>");
        }
        const detailsArrayLast = detailsArray.length > 0 ? detailsArray[detailsArray.length - 1].toString() : "";
        details.innerHTML = detailsArrayLast.includes("score") ? detailsArray.slice(0, -1).join(" · ") + detailsArray.slice(-1) : detailsArray.join(" · ");
        const dat = document.createElement("div");
        dat.classList.add("embed-container");
        dat.innerHTML = "<a></a>";
        const namediv = document.createElement("div");
        namediv.classList.add("embed-inner");
        const name = document.createElement("a");
        name.innerText = data.data.title;
        name.classList.add("embed-title");
        if (data.data.type && ["Manga", "Manhwa", "Novel"].includes(data.data.type)) {
          name.style = "color: #92d493!important;";
        }
        name.href = data.data.url;
        const historyimg = document.createElement("a");
        historyimg.classList.add("embed-image");
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
    const forumHeader = document.querySelector("h1.forum_locheader")?.innerText;
    const headerRegex = /\w+\s\d{4}\sPreview/gm;
    const c =
      document.querySelectorAll(".message-wrapper > div.content").length > 0 ? document.querySelectorAll(".message-wrapper > div.content") : document.querySelectorAll(".forum.thread .message");
    for (let x = 0; x < c.length; x++) {
      let content = c[x].innerHTML;
      content = content
        .replace(/(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\.php\?id=)([0-9]+)/gm, "https://myanimelist.net/$2/$3")
        .replace(/(<a href="\b(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\/[0-9]+))/gm, " $1");
      let matches = content.match(/<a href="https:\/\/myanimelist\.net\/(anime|manga|character|people)\/([0-9]+)([^"'<]+)".*?>.*?<\/a>/gm);
      matches = matches ? matches.filter((link) => !link.includes("/video")) : matches;
      if (matches && !headerRegex.test(forumHeader)) {
        let uniqueMatches = Array.from(new Set(matches));
        for (let i = 0; i < uniqueMatches.length; i++) {
          let match = uniqueMatches[i];
          const id = match.split("/")[4];
          const escapedMatch = match.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
          const reg = new RegExp('(?<!Div">)(' + escapedMatch + ")", "gms");
          if (!id.startsWith("0")) {
            const type = match.split("/")[3];
            let link = create("a", { href: match });
            let cont = create("div", { class: "embed-link", id: id, type: type });
            const embedData = await getEmbedData(id, type);
            if (embedData) {
              cont.appendChild(embedData);
              link.appendChild(cont);
              content = content.replace(reg, await DOMPurify.sanitize(cont));
            }
            if (matches.length > 4 && i % 4 === 0) {
              cached ? await delay(33) : await delay(777);
            } else {
              cached ? await delay(33) : await delay(333);
            }
          }
          c[x].innerHTML = content;
        }
        await delay(777);
      }
      if (c[x].className === "message" && !c[x].id) {
        c[x].remove();
      }
    }
  }
  embedload();
}
//Forum Anime-Manga Embed //--END--//

//New Profile Comments Feature
async function newProfileComments(profile) {
  let mainCont = profile ? $("#lastcomment") : $("#content");
  if (profile) {
    mainCont.css("max-width", "810px");
  } else {
    $('#content div:not(.borderClass):contains("Pages ")').hide();
  }
  let currPage = 1;
  let oldprofileLinkArray = [];
  let addedComCount = 0;
  const loading = create("div", { class: "user-history-loading actloading" }, "Loading" + '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>');

  function parseProfileHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const section = doc.querySelector("#message")?.outerHTML;
    const match = /uid:(\d+)/.exec(section);
    return match ? match[1] : null;
  }

  async function getProfileId(profileUrl) {
    try {
      const response = await fetch(profileUrl);
      const html = await response.text();
      return parseProfileHTML(html);
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function getNextComments(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc;
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  }

  async function fetchAndUpdateComments(element, url, newCommentsContainer, append = false) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const comments = Array.from(doc.querySelectorAll("div[id^=comBox] > table > tbody > tr")).reverse();
      let sender = $(doc).find("div[id^=com] > .dark_text a").last()[0];
      let receiver = doc.querySelector("#content > div.borderClass.com-box-header a:last-child");
      receiver.innerText = "@" + receiver.innerText.replace("'s Profile", "");
      let isNameMatch = receiver.innerText !== "@" + sender.innerText ? 0 : 1;
      comments.forEach((comment, index) => {
        $(comment).find(".picSurround").addClass("image").find("img").css("height", "55px");
        if (!append && index === 0) {
          if (!isNameMatch) {
            $(comment).find(".spaceit").prepend(receiver, "<br>");
          }
          if (profile) {
            $(comment).find("div[id^=com]").first().css({ display: "inline-block", width: "calc(100% - 100px)" });
            $(comment).find(".picSurround").css({ display: "inline-block" });
          }
          element.innerHTML = comment.innerHTML;
        } else {
          newCommentsContainer.appendChild(comment.cloneNode(true));
        }
      });

      // Create a “Load More” button if there is a “Prev” link
      const prevLink = $(doc).find('a:contains("Prev")').attr("href");
      if (prevLink) {
        await createLoadMoreButton(prevLink, newCommentsContainer, element, "child");
      }
      return comments.length;
    } catch (error) {
      console.error(`Could not retrieve comments: ${error}`);
    }
  }

  // Create a button to hide/show comments
  async function createToggleButton(newCommentsContainer, commentsCount) {
    if (commentsCount > 1) {
      const commCount = commentsCount - 1 === 29 ? "29+" : commentsCount - 1;
      const buttonDiv = create("div", { class: "newCommentsCommentButton" });
      const buttonLabel = create("span", { class: "commentButtonLabel" }, commCount);
      const button = create("a", { class: "commentButton fa fa-comment", style: { paddingRight: "5px", cursor: "pointer" } });
      buttonDiv.append(button, buttonLabel);
      button.addEventListener("click", () => {
        newCommentsContainer.style.display = newCommentsContainer.style.display === "none" ? "inline-block" : "none";
      });
      return buttonDiv;
    }
  }

  // Create load more button
  function createLoadMoreButton(url, newCommentsContainer, element, className) {
    let loadMoreButton = newCommentsContainer.querySelector(".newCommentsLoadMoreButton." + className);
    if (loadMoreButton) return;
    loadMoreButton = create("a", { class: "newCommentsLoadMoreButton " + className }, "Load More");
    loadMoreButton.addEventListener("click", async () => {
      mainCont.append(loading);
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading...";
      if (element) {
        await fetchAndUpdateComments(element, url, newCommentsContainer, true);
      } else {
        const doc = await getNextComments(url);
        if (doc) comToCom(url, doc);
      }
      loadMoreButton.disabled = false;
      loadMoreButton.remove();
    });
    newCommentsContainer.appendChild(loadMoreButton);
    if (profile) mainCont.append($('a.btn-form-submit:contains("All Comments")').parent());
  }

  // Main
  async function comToCom(url, doc) {
    url = url.replace(/&*show=\d*/g, "");
    const idIndex = url.indexOf("id=");
    let mainDelay = 500;
    if (idIndex === -1) return;
    const baseUrl = "/comtocom.php?id1=" + url.substring(idIndex + 3) + "&id2=";
    let isProfilePage = document.location.href.includes("profile");
    $("div[id^=comBox]").not(".newCommentsContainerMain").css("display", "none");
    if (doc) {
      let els = doc.querySelectorAll("div[id^=comBox]");
      for (const el of els) {
        el.style.display = "none";
        mainCont.append(el, profile ? $('a.btn-form-submit:contains("All Comments")').parent() : $('div[style="text-align: right;"]'));
      }
    }
    let elements = isProfilePage ? document.querySelectorAll("div[id^=comBox]") : document.querySelectorAll("div[id^=comBox] > table > tbody > tr");
    for (const el of elements) {
      if (!el.getAttribute("comActive")) {
        mainDelay = 500;
        let profileLink = isProfilePage ? el.querySelector(".image")?.href : el.querySelector(".picSurround > a")?.href;
        if (doc && profile) {
          profileLink = el.querySelector(".picSurround > a")?.href;
        }
        const elParent = profile ? $(el) : $(el).parent().parent().parent();
        elParent.css("display", "none");
        if (!profileLink) continue;
        if (oldprofileLinkArray.indexOf(profileLink) === -1) {
          oldprofileLinkArray.push(profileLink);
          const profileId = await getProfileId(profileLink);
          if (!profileId) continue;
          const commentsUrl = `${baseUrl}${profileId}&last=1`;
          const linkButton = create("a", { class: "newCommentsLinkButton fa fa-link", href: commentsUrl, target: "_blank" });
          const newCommentsContainer = create("div", { class: "newCommentsContainer", style: { display: "none", width: "100%" } });
          const commentsCount = await fetchAndUpdateComments(el, commentsUrl, newCommentsContainer);
          const toggleButton = await createToggleButton(newCommentsContainer, commentsCount);
          if (profile) elParent.addClass("comment-profile");
          if (toggleButton) {
            elParent.prepend(linkButton), elParent.append(toggleButton, newCommentsContainer);
          }
          mainCont.append(loading);
          elParent.find("div[id^=com]").first().css("min-height", "55px");
          elParent.addClass("comment newCommentsContainerMain");
          addedComCount++;
        } else {
          mainCont.children().remove("br");
          elParent.remove();
          mainDelay = 50;
        }
        el.setAttribute("comActive", "1");
        elParent.css("display", "");
        await delay(mainDelay);
      }
    }
    loading.remove();
    currPage += 1;
    let nextPage = $(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    if (doc) {
      nextPage = $(doc).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    } else if (currPage === 2 && profile) {
      let profileCount = await getNextComments(url);
      nextPage = $(profileCount).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr("href");
    }
    if (nextPage) {
      await createLoadMoreButton(nextPage, mainCont[0], null, "parent");
    }
    if ($(".newCommentsLoadMoreButton.parent")[0]) {
      if (addedComCount < 6) {
        $(".newCommentsLoadMoreButton.parent")[0].style.display = "none";
        $(".newCommentsLoadMoreButton.parent")[0].click();
      } else {
        $(".newCommentsLoadMoreButton.parent")[0].style.display = "block";
        loading.remove();
        addedComCount = 0;
      }
    }
  }
  let comcomUrl = profile ? $('a:contains("All Comments")')?.attr("href") : location.href;
  let checkComBox = document.querySelectorAll("div[id^=comBox]");
  if (comcomUrl && checkComBox.length > 0) comToCom(comcomUrl);
}
