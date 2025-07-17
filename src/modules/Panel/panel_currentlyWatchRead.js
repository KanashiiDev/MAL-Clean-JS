//Currently Watching
let incCount = 0;
let incTimer;
let incActive = 0;
let lastClickTime = 0;
const debounceDelay = 400;
const collapsedHeight = svar.currentlyGrid6Column ? 315 : 370;

function htmlTemplate(type) {
  const typeText = type === "anime" ? "watching" : "reading";
  const typeTranslate = type === "anime" ? translate("$currentlyWatching") : translate("$currentlyReading");
  const text = `<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span>
      <h2 class="index_h2_seo"><a href="https://myanimelist.net/${type}list/${headerUserName}?status=1">${typeTranslate}</a></h2>
      <i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i></div>
      <div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-${typeText}">
      <div id="currently-left${type === "manga" ? "-manga" : ""}" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>
      <div id="currently-right${type === "manga" ? "-manga" : ""}" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;"><span class="btn-inner" style="display: none;"></span></div>
      <div class="widget-slide-outer">
      <ul class="widget-slide js-widget-slide ${type === "manga" ? "manga" : ""}" style="width: 3984px;
      margin-left: 0px; -webkit-transition: margin-left 0.4s ease-in-out; transition: margin-left 0.4s ease-in-out"></ul>
      ${
        svar.currentlyGrid && svar.currentlyGridAccordion
          ? `</div><div class="accordion" style="display: none; text-align-last: center; height: 25px; margin-top: 5px; width: 100%; position: relative;">
      <button class="toggle-button" style="height: 25px; width: 100%;overflow: hidden;background: none;border: none;cursor: pointer;">
      <img class="toggle-icon" src="https://myanimelist.net/images/icon-pulldown2.png?v=163426320" style="position: relative; top: -35px;">
      </button></div>`
          : ""
      }</div></div></div></div>`;
  return text;
}

async function processGridAccordion(type) {
  if (!svar.currentlyGridAccordion) return;

  const $container = $(`#widget-currently-${type}`);
  const $main = $(`#currently-${type}`);
  const $div = $container.find(".widget-slide");
  const $btn = $container.find(".toggle-button");
  const $icon = $container.find(".toggle-icon");
  const isExpandable = $div[0].scrollHeight > collapsedHeight;
  $btn.attr("data-expanded", "false");

  if (isExpandable) {
    $div.css({
      "max-height": `${collapsedHeight}px`,
      transition: "max-height 0.4s ease",
    });
    $container.find(".accordion").show();
  }

  $btn.off("click").on("click", async function () {
    const isExpanded = $(this).attr("data-expanded") === "true";
    $(this).attr("data-expanded", !isExpanded);
    $div.css("max-height", !isExpanded ? `${$div[0].scrollHeight}px` : `${collapsedHeight}px`);
    $icon.css("top", !isExpanded ? "5px" : "-35px");
    if (isExpanded) {
      const offset = !defaultMal ? 55 : 10;
      const top = $main[0].getBoundingClientRect().top + window.pageYOffset - offset;
      await delay(400);
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
}

async function createCurrentlyWidget(type) {
  const isAnime = type === "anime";
  const typeText = isAnime ? "watching" : "reading";
  const listType = isAnime ? "animelist" : "mangalist";
  const idKey = isAnime ? "anime_id" : "manga_id";
  const titleKey = isAnime ? "anime_title" : "manga_title";
  const imgKey = isAnime ? "anime_image_path" : "manga_image_path";
  const urlKey = isAnime ? "anime_url" : "manga_url";
  const progressKey = isAnime ? "num_watched_episodes" : "num_read_chapters";
  const totalKey = isAnime ? "anime_num_episodes" : "manga_num_chapters";
  const widgetId = `currently-${typeText}`;
  const sliderId = `#widget-currently-${typeText}`;
  const leftBtnId = `currently-left${isAnime ? "" : "-manga"}`;
  const rightBtnId = `currently-right${isAnime ? "" : "-manga"}`;
  const defWidth = svar.currentlyGrid6Column && svar.currentlyGrid ? 102 : 124;
  const defHeight = svar.currentlyGrid6Column && svar.currentlyGrid ? 147 : 170;

  const div = create("article", { class: "widget-container left", id: widgetId });
  div.innerHTML = htmlTemplate(type);
  const dataUrl = `https://myanimelist.net/${listType}/${headerUserName}?status=1`;
  const html = await fetch(dataUrl)
    .then((response) => response.text())
    .then(async (data) => {
      const newDocument = new DOMParser().parseFromString(data, "text/html");
      const list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
      if (!list) return;

      const container = document.querySelector("#content > div.left-column");
      if (isAnime || !document.querySelector("#currently-watching")) {
        container.prepend(div);
      } else {
        document.querySelector("#currently-watching").insertAdjacentElement("afterend", div);
      }

      if (svar.airingDate && isAnime) {
        let ids = list.map((item) => item[idKey]);
        const queries = ids.map((id, i) => `Media${i}: Media(idMal: ${id}, type: ANIME) {nextAiringEpisode {timeUntilAiring episode}}`);
        const infoData = await AnilistAPI(`query {${queries.join("\n")}}`);
        await renderList(list, infoData, defWidth, defHeight);
      } else {
        await renderList(list, null, defWidth, defHeight);
      }

      async function renderList(list, infoData, width, height) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          let progressInfo = "";

          if (isAnime && svar.airingDate && infoData) {
            const media = infoData.data["Media" + i];
            const ep = media?.nextAiringEpisode?.episode ?? "";
            const time = media?.nextAiringEpisode?.timeUntilAiring ?? "";

            const behind = ep && ep !== 1 ? await episodesBehind(ep, item[progressKey]) : 0;
            const airingText = ep && time ? `<div id="${time}" class="airingInfo"><div>Ep ${ep}</div><div>${await airingTime(time)}</div></div>` : "";

            progressInfo = airingText;
            if (behind) {
              progressInfo += `<span class="epBehind">${behind}</span><div class="behindWarn"></div>`;
            }
          }

          if (!progressInfo) {
            progressInfo = `<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">${item[progressKey]}${
              item[totalKey] !== 0 ? " / " + item[totalKey] : ""
            }</div></div>`;
          }

          const editBtn = create("i", { class: "fa fa-pen editCurrently", id: item[idKey] });
          const incBtn = create("i", { class: "fa fa-plus incButton", id: item[idKey] });
          const node = create("li", {
            class: "btn-anime",
            style: { ...(svar.currentlyGrid && { margin: 0 }), minHeight: `${height}px`, maxHeight: `${height}px`, minWidth: `${width}px`, maxWidth: `${width}px` },
          });

          node.innerHTML = `<a class="link" href="${item[urlKey]}">
              <img width="${width}" height="${height}" style="min-height:${height}px;max-height:${height}px;min-width:${width}px;max-width:${width}px"
              class="lazyload" src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${item[imgKey]}" alt="${item[titleKey]}">
              <span class="title js-color-pc-constant color-pc-constant">${item[titleKey]}</span>${progressInfo}</a>`;
          node.appendChild(editBtn);
          node.appendChild(incBtn);
          document.querySelector(`${sliderId} ul`).append(node);
          const loadingIndicator = create("div", { class: "recently-genre-indicator currently-loading-indicator" });

          editBtn.onclick = async () => {
            await editPopup(item[idKey], isAnime ? null : "manga");
            div.remove();
            await createCurrentlyWidget(type);
          };

          incBtn.onclick = async () => {
            if (!document.querySelector(".currently-loading-indicator")) {
              incBtn.parentElement.append(loadingIndicator);
            }
            loadingIndicator.style.display = "none";
            void loadingIndicator.offsetWidth;
            loadingIndicator.style.display = "block";
            const currentTime = Date.now();
            if (currentTime - lastClickTime < debounceDelay || (incActive !== 0 && incActive !== editBtn.id)) {
              return;
            }
            if (incActive === 0) incActive = editBtn.id;
            lastClickTime = currentTime;
            incCount++;
            incBtn.innerText = incCount.toString();
            clearTimeout(incTimer);
            incTimer = setTimeout(async function () {
              loadingIndicator.remove();
              await editPopup(item[idKey], isAnime ? null : "manga", true, incCount);
              div.remove();
              await createCurrentlyWidget(type);
              incCount = 0;
              incActive = 0;
            }, 2000);
          };
        }
        document.querySelector(`${sliderId} ul`).style.width = 138 * list.length + "px";
        // Sort by time until airing
        if (svar.airingDate && isAnime) {
          let airingDivs = Array.from(document.querySelectorAll("#widget-currently-watching ul li"));
          let airingMainDiv = document.querySelector("#widget-currently-watching ul");

          airingDivs.sort((a, b) => {
            let idA = Number(a.querySelector(":scope > * > *:nth-child(3)")?.id || 0);
            let idB = Number(b.querySelector(":scope > * > *:nth-child(3)")?.id || 0);
            return idA - idB;
          });

          airingMainDiv.replaceChildren(...airingDivs);
        }
        document.querySelector(`#${widgetId} > div > div.widget-header > i`).remove();
        if (svar.customCover) loadCustomCover(1);
        if (svar.currentlyGrid) {
          $(`${sliderId} .widget-slide`).addClass(`currentlyGrid ${svar.currentlyGrid6Column ? "currentlyGrid6Column" : ""}`);
          $(`${sliderId} .widget-slide`).css("grid-template-columns", svar.currentlyGrid6Column ? "repeat(6, minmax(0, 1fr))" : "repeat(6, minmax(0, 1fr))");
          $(`${sliderId} .widget-slide`).css("gap", svar.currentlyGrid6Column ? "15px 10px" : "20px 10px");
          $(`${sliderId} .widget-slide`).css("width", "100%");
          $(`${sliderId} #${leftBtnId}`).remove();
          $(`${sliderId} #${rightBtnId}`).remove();
          processGridAccordion(typeText);
        } else {
          // Sliders
          const slider = document.querySelector(`${sliderId} ul`);
          let items = Array.from(slider.querySelectorAll(".btn-anime")).filter((el) => el.offsetWidth > 0);
          const slideWidth = items[0].offsetWidth + 12;
          const itemsPerScroll = 5;
          let maxIndex = Math.ceil(items.length / itemsPerScroll) - 1;
          const leftBtn = document.querySelector(`${sliderId} #${leftBtnId}`);
          const rightBtn = document.querySelector(`${sliderId} #${rightBtnId}`);

          function updateButtons(index) {
            if (index <= 0) {
              leftBtn.classList.remove("active");
              leftBtn.setAttribute("disabled", "true");
            } else {
              leftBtn.classList.add("active");
              leftBtn.removeAttribute("disabled");
            }

            if (index >= maxIndex) {
              rightBtn.classList.remove("active");
              rightBtn.setAttribute("disabled", "true");
            } else {
              rightBtn.classList.add("active");
              rightBtn.removeAttribute("disabled");
            }
          }

          updateButtons(0);
          rightBtn.addEventListener("click", function () {
            let index = parseInt(slider.dataset.index || "0");

            if (index < maxIndex) {
              index++;
              slider.dataset.index = index;
              slider.style.marginLeft = `-${index * itemsPerScroll * slideWidth}px`;
              updateButtons(index);
            }
          });

          leftBtn.addEventListener("click", function () {
            let index = parseInt(slider.dataset.index || "0");

            if (index > 0) {
              index--;
              slider.dataset.index = index;
              slider.style.marginLeft = `-${index * itemsPerScroll * slideWidth}px`;
              updateButtons(index);
            }
          });
        }
      }
    });
}

if (svar.currentlyWatching && location.pathname === "/") {
  createCurrentlyWidget("anime");
}
if (svar.currentlyReading && location.pathname === "/") {
  createCurrentlyWidget("manga");
}
