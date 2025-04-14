//Currently Watching
let incCount = 0;
let incTimer;
let incActive = 0;
let lastClickTime = 0;
const debounceDelay = 400;
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
    let user = headerUserName;
    if (user) {
      const currentlyWatchingDiv = create("article", { class: "widget-container left", id: "currently-watching" });
      currentlyWatchingDiv.innerHTML = `<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span>
      <h2 class="index_h2_seo"><a href="https://myanimelist.net/animelist/${user}?status=1">Currently Watching</a></h2>
      <i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative; margin-left:5px; font-size:12px; font-family:FontAwesome"></i></div>
      <div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-watching">
      <div id="current-left" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>
      <div id="current-right" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;"><span class="btn-inner" style="display: none;"></span></div>
      <div class="widget-slide-outer"><ul class="widget-slide js-widget-slide" data-slide="4" style="width: 3984px; margin-left: 0px; -webkit-transition: margin-left 0.4s ease-in-out; transition: margin-left 0.4s ease-in-out"></ul>
      </div></div></div></div></div>`;
      //Get watching anime data from user's list
      const html = await fetch("https://myanimelist.net/animelist/" + user + "?status=1")
        .then((response) => response.text())
        .then(async (data) => {
          var newDocument = new DOMParser().parseFromString(data, "text/html");
          let list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
          if (list) {
            document.querySelector("#content > div.left-column").prepend(currentlyWatchingDiv);
            await processList();
            async function processList() {
              if (svar.airingDate) {
                for (const item of list) {
                  idArray.push(item.anime_id);
                }
                //get anime time until airing info from Anilist API
                const queries = idArray.map((id, index) => `Media${index}: Media(idMal: ${id}, type: ANIME) {nextAiringEpisode {timeUntilAiring episode}}`);
                const fullQuery = `query {${queries.join("\n")}}`;
                infoData = await fetchAnimeData();
                async function fetchAnimeData() {
                  for (let x = 0; x < 5; x++) {
                    infoData = await AnilistAPI(fullQuery);
                    if (infoData) {
                      return infoData;
                    }
                    await delay(1000);
                  }
                  // if api error
                  let d = document.querySelector("#currently-watching > div > div.widget-header");
                  if (d) {
                    let e = create("span", { class: "currently-watching-error", style: { float: "right", display: "inline-block" } }, "API Error. Unable to get next episode countdown ");
                    let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
                    r.onclick = () => {
                      currentlyWatchingDiv.remove();
                      getWatching();
                    };
                    e.append(r);
                    d.append(e);
                  }
                }
              }
              // if watching anime still airing, add time until airing
              for (let x = 0; x < list.length; x++) {
                let currep, nextep;
                if (svar.airingDate && infoData) {
                  const media = infoData.data["Media" + x];
                  ep = media.nextAiringEpisode ? media.nextAiringEpisode.episode : "";
                  const airing = media.nextAiringEpisode ? media.nextAiringEpisode.timeUntilAiring : "";
                  left = ep && airing ? "<div id=" + airing + ' class="airingInfo"><div>Ep ' + ep + "</div>" + "<div>" + (await airingTime(airing)) + "</div></div>" : "";
                  let info = [ep, left];
                  if (info) {
                    currep = info[0] && info[0] !== 1 ? await episodesBehind(info[0], list[x].num_watched_episodes) : 0;
                    nextep = svar.airingDate && info[1] ? info[1] : "";
                    if (currep) {
                      nextep += '<span class="epBehind">' + currep + '</span><div class="behindWarn"></div>';
                    }
                  }
                }
                if (!nextep || !infoData) {
                  nextep =
                    '<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">' +
                    list[x].num_watched_episodes +
                    (list[x].anime_num_episodes !== 0 ? " / " + list[x].anime_num_episodes : "") +
                    "</div></div>";
                }
                let ib = create("i", { class: "fa fa-pen editCurrently", id: list[x].anime_id });
                let increaseButton = create("i", { class: "fa fa-plus incButton", id: list[x].anime_id });
                // create watching anime div
                let wDiv = create("li", { class: "btn-anime" });
                wDiv.innerHTML = `<a class="link" href="${list[x].anime_url}">
                <img width="124" height="170" class="lazyloaded" src="${list[x].anime_image_path}" alt="${list[x].anime_title}">
                <span class="title js-color-pc-constant color-pc-constant">${list[x].anime_title}</span>${nextep ? nextep : ""}</a>`;
                wDiv.appendChild(ib);
                wDiv.appendChild(increaseButton);
                document.querySelector("#widget-currently-watching ul").append(wDiv);
                ib.onclick = async () => {
                  await editPopup(ib.id);
                  currentlyWatchingDiv.remove();
                  getWatching();
                };
                increaseButton.onclick = async () => {
                  const currentTime = new Date().getTime();
                  if (currentTime - lastClickTime < debounceDelay || (incActive !== 0 && incActive !== ib.id)) {
                    return;
                  }
                  if (incActive === 0) {
                    incActive = ib.id;
                  }
                  lastClickTime = currentTime;
                  incCount++;
                  increaseButton.innerText = incCount.toString();
                  clearTimeout(incTimer);
                  incTimer = setTimeout(async function () {
                    await editPopup(ib.id, null, true, incCount);
                    currentlyWatchingDiv.remove();
                    getWatching();
                    incCount = 0;
                    incActive = 0;
                  }, 2000);
                };
              }
              // sort by time until airing
              if (svar.airingDate) {
                let airingDivs = Array.from(document.querySelectorAll("#widget-currently-watching ul li"));
                let airingMainDiv = document.querySelector("#widget-currently-watching ul");
                airingDivs.sort(function (a, b) {
                  let idA = a.children[0]?.children[2]?.id;
                  let idB = b.children[0]?.children[2]?.id;
                  return idA - idB;
                });
                airingMainDiv.innerHTML = "";
                airingDivs.forEach(function (div) {
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
            if (svar.customCover) {
              loadCustomCover(1);
            }
          }
        });
    }
  }
}

//Currently Reading
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
    let user = headerUserName;
    if (user) {
      const currentlyReadingDiv = create("article", { class: "widget-container left", id: "currently-reading" });
      currentlyReadingDiv.innerHTML = `<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span>
        <h2 class="index_h2_seo"><a href="https://myanimelist.net/mangalist/${user}?status=1">Currently Reading</a></h2>
        <i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative; margin-left:5px; font-size:12px; font-family:FontAwesome"></i></div>
        <div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-reading">
        <div id="current-left-manga" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>
        <div id="current-right-manga" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;"><span class="btn-inner" style="display: none;"></span></div>
        <div class="widget-slide-outer"><ul class="widget-slide js-widget-slide manga" data-slide="4" style="width: 3984px; margin-left: 0px; -webkit-transition: margin-left 0.4s ease-in-out; transition: margin-left 0.4s ease-in-out"></ul>
        </div></div></div></div></div>`;
      //Get reading anime data from user's list
      const html = await fetch("https://myanimelist.net/mangalist/" + user + "?status=1")
        .then((response) => response.text())
        .then(async (data) => {
          var newDocument = new DOMParser().parseFromString(data, "text/html");
          let list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
          if (list) {
            if (document.querySelector("#currently-watching")) {
              document.querySelector("#currently-watching").insertAdjacentElement("afterend", currentlyReadingDiv);
            } else {
              document.querySelector("#content > div.left-column").prepend(currentlyReadingDiv);
            }
            await processList();
            async function processList() {
              for (let x = 0; x < list.length; x++) {
                let nextchap =
                  '<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">' +
                  list[x].num_read_chapters +
                  (list[x].manga_num_chapters !== 0 ? " / " + list[x].manga_num_chapters : "") +
                  "</div></div>";
                let ib = create("i", { class: "fa fa-pen editCurrently", id: list[x].manga_id });
                let increaseButton = create("i", { class: "fa fa-plus incButton", id: list[x].anime_id });
                increaseButton.onclick = async () => {
                  const currentTime = new Date().getTime();
                  if (currentTime - lastClickTime < debounceDelay || (incActive !== 0 && incActive !== ib.id)) {
                    return;
                  }
                  if (incActive === 0) {
                    incActive = ib.id;
                  }
                  lastClickTime = currentTime;
                  incCount++;
                  increaseButton.innerText = incCount.toString();
                  clearTimeout(incTimer);
                  incTimer = setTimeout(async function () {
                    await editPopup(ib.id, "manga", true, incCount);
                    currentlyReadingDiv.remove();
                    getreading();
                    incCount = 0;
                    incActive = 0;
                  }, 2000);
                };
                // Create Reading Manga Div
                let rDiv = create("li", { class: "btn-anime" });
                rDiv.innerHTML = `<a class="link" href="${list[x].manga_url}">
                <img width="124" height="170" class="lazyloaded" src="${list[x].manga_image_path}" alt="${list[x].manga_title}" alt="${list[x].manga_title}">
                <span class="title js-color-pc-constant color-pc-constant">${list[x].manga_title}</span>${nextchap}</a>`;
                rDiv.appendChild(ib);
                rDiv.appendChild(increaseButton);
                document.querySelector("#widget-currently-reading ul").append(rDiv);
                ib.onclick = async () => {
                  await editPopup(ib.id, "manga");
                  currentlyReadingDiv.remove();
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
            if (svar.customCover) {
              loadCustomCover(1);
            }
          }
        });
    }
  }
}
