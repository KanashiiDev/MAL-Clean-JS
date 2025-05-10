if (svar.embed && /\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href)) {
  const embedCache = localforage.createInstance({ name: "MalJS", storeName: "embed" });
  const options = { cacheTTL: svar.embedTTL ? svar.embedTTL : 2592000000, class: "embed" };
  let imgdata, data, cached;
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
        const genres = create(
          "div",
          { class: "genres" },
          data.data.genres
            ? data.data.genres
                .filter((node) => node.name !== "Award Winning")
                .map((node) => node.name)
                .toString()
                .split(",")
                .join(", ")
            : ""
        );
        const details = create("div", { class: "details" });
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
        const dat = create("div", { class: "embed-container" }, "<a></a>");
        const namediv = create("div", { class: "embed-inner" });
        const name = create("a", { class: "embed-title" }, data.data.title);
        if (data.data.type && ["Manga", "Manhwa", "Novel"].includes(data.data.type)) {
          name.style = "color: #92d493!important;";
        }
        name.href = data.data.url;
        const historyimg = create("a", { class: "embed-image", style: { backgroundImage: `url(${imgdata})` }, href: data.data.url });
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
