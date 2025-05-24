async function processRecentlyGridAccordion(type, hide) {
  if (!svar.recentlyGridAccordion) return;
  const recentlyCollapsedHeight = svar.recentlyGrid6Column ? 315 : 370;
  const $container = $(`#widget-recently-added-${type}`);
  const $main = $(`#recently-added-${type}`);
  const $div = $container.find(".widget-slide");
  const $btn = $container.find(".toggle-button");
  const $icon = $container.find(".toggle-icon");
  const $loadBtn = $container.find(`#recently-added-${type}-load-more`);
  const triggered = $loadBtn.attr("data-triggered") === "true";

  if (hide) {
    $loadBtn.attr("data-triggered", "false");
  }

  const scrollHeight = $div[0].scrollHeight;
  const isExpandable = scrollHeight > recentlyCollapsedHeight;

  $btn.attr("data-expanded", "false");

  // Check Expand
  if (isExpandable) {
    if (!$btn.attr("data-keep-expanded")) {
      $div.css({
        "max-height": `${recentlyCollapsedHeight}px`,
        transition: "max-height 0.4s ease",
      });
    }
    $container.find(".accordion").show();
  } else {
    $container.find(".accordion").hide();
  }

  // Accordion opening conditions
  if (!hide || triggered) {
    $div.css({
      "max-height": `${scrollHeight}px`,
      transition: "max-height 0.4s ease",
    });
    $btn.attr("data-expanded", "true");
    $icon.css("top", "5px");
  } else {
    $icon.css("top", "-35px");
  }

  // Accordion Click
  $btn.off("click").on("click", async function () {
    const isExpanded = $(this).attr("data-expanded") === "true";
    const currentScrollHeight = $div[0].scrollHeight;

    if (isExpanded) {
      // Shrink
      $div.css("max-height", `${recentlyCollapsedHeight}px`);
      $(this).attr("data-expanded", "false");
      $icon.css("top", "-35px");

      const offset = !defaultMal ? 55 : 10;
      const top = $main[0].getBoundingClientRect().top + window.pageYOffset - offset;
      await delay(400);
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      // Expand
      $div.css("max-height", `${currentScrollHeight}px`);
      $(this).attr("data-expanded", "true");
      $icon.css("top", "5px");
    }
  });
}

function recentlyHtmlTemplate(type) {
  const typeTranslate = type === "anime" ? translate("$recentlyAddedAnime") : translate("$recentlyAddedManga");
  const genreFilter = type === "anime" ? svar.recentlyAnimeFilter : svar.recentlyMangaFilter;
  let animeOptions = `
    <select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilter">
    <option value="All">All</option><option value="TV,Movie" >TV &amp; Movie</option><option value="TV">TV</option>
    <option value="TV Special">TV Special</option><option value="Movie">Movie</option><option value="ONA">ONA</option>
    <option value="OVA">OVA</option><option value="Special">Special</option><option value="Music">Music</option>
    <option value="CM">CM</option><option value="PV">PV</option>
    </select>`;
  const animeSelected = svar.recentlyAnimeDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyAnimeDefault) : "All";
  animeOptions = animeOptions.replace(`value="${animeSelected}"`, `value="${animeSelected}" selected`);

  let mangaOptions = `
    <select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilterManga">
        <option value="All">All</option>
        <option value="Manga">Manga</option>
        <option value="One-shot">One-shot</option>
        <option value="Doujinshi">Doujinshi</option>
        <option value="Light Novel">Light Novel</option>
        <option value="Novel">Novel</option>
        <option value="Manhwa">Manhwa</option>
        <option value="Manhua">Manhua</option>
      </select>`;
  const mangaSelected = svar.recentlyMangaDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyMangaDefault) : "All";
  mangaOptions = mangaOptions.replace(`value="${mangaSelected}"`, `value="${mangaSelected}" selected`);

  const template = `
    <div class="widget anime_suggestions left">
    <div class="widget-header">
      <span style="float: right;"></span>
      <h2 class="index_h2_seo">
        <a href="https://myanimelist.net/${type}.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1${genreFilter}">${typeTranslate}</a>
      </h2>
      <i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>
    ${type === "anime" ? animeOptions : mangaOptions}
    </div>
    <div class="widget-content">
      <div class="mt4">
        <div class="widget-slide-block" id="widget-recently-added-${type}">
          <div id="currently-left-recently-added-${type}" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;">
            <span class="btn-inner"></span>
          </div>
          <div id="currently-right-recently-added-${type}" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">
            <span class="btn-inner" style="display: none;"></span>
          </div>
          <div class="widget-slide-outer">
            <ul class="widget-slide js-widget-slide recent-${type}"  data-index="0" style="width: 720px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul>
          </div>
          ${
            svar.recentlyGrid && svar.recentlyGridAccordion
              ? `<div class="accordion" style="display: none; text-align-last: center; height: 25px; margin-top: 5px; width: 100%; position: relative;">
      <button class="toggle-button" style="height: 25px; width: 100%;overflow: hidden;background: none;border: none;cursor: pointer;">
      <img class="toggle-icon" src="https://myanimelist.net/images/icon-pulldown2.png?v=163426320" style="position: relative; top: -35px;">
      </button></div>`
              : ""
          }
        </div>
      </div>
    </div>
  </div>`;
  return template;
}

async function createRecentlyAddedWidget(type) {
  $(`#recently-added-${type}`).remove();
  const isAnime = type === "anime";
  const mediaType = isAnime ? 0 : 1;
  const id = `recently-added-${type}`;
  const containerClass = `widget-container left recently-${type}`;
  const widgetSelector = `#widget-recently-added-${type}`;
  const sliderSelector = `.widget-slide.js-widget-slide.recent-${type}`;
  const typeFilterId = isAnime ? "typeFilter" : "typeFilterManga";
  const leftBtnId = `#currently-left-recently-added-${type}`;
  const rightBtnId = `#currently-right-recently-added-${type}`;
  const loadMoreText = translate("$loadMore");
  const recentlyLoadMoreWidth = svar.recentlyGrid6Column && svar.recentlyGrid ? 102 : 124;
  const recentlyLoadMoreHeight = svar.recentlyGrid6Column && svar.recentlyGrid ? 147 : 170;
  let btnAnimeWidth;

  let user = headerUserName;
  if (!user) return;

  const recentlyAddedDiv = create("article", { class: containerClass, id: id, page: "0" });
  recentlyAddedDiv.innerHTML = recentlyHtmlTemplate(type);

  let list = await getList();
  async function getList() {
    for (let x = 0; x < 5; x++) {
      const data = await getRecentlyAdded(mediaType);
      if (data) return data;
      await delay(1000);
    }
    let d = document.querySelector(`#${id} > div > div.widget-header`);
    if (d) {
      let e = create("span", { class: "currently-watching-error", style: { float: "right", display: "inline-block" } }, "API Error. Please try again.");
      let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
      r.onclick = () => {
        recentlyAddedDiv.remove();
        createRecentlyAddedWidget(type);
      };
      e.append(r);
      d.append(e);
    }
  }

  if (!list) return;

  // Insert widget to DOM
  const refEl = document.querySelector("#recently-added-anime") || document.querySelector("#currently-reading") || document.querySelector("#currently-watching");
  if (refEl) {
    refEl.insertAdjacentElement("afterend", recentlyAddedDiv);
  } else {
    document.querySelector("#content > div.left-column").prepend(recentlyAddedDiv);
  }

  buildRecentlyAddedList(list, `${widgetSelector} ul`, recentlyLoadMoreWidth, recentlyLoadMoreHeight);
  document.querySelector(`${widgetSelector} > div.widget-slide-outer > ul`).children.length > 5 ? document.querySelector(rightBtnId)?.classList.add("active") : "";

  let itemBackup = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`));
  btnAnimeWidth = getTotalWidth(`${widgetSelector} ul .btn-anime`);
  if (!svar.recentlyGrid) {
    document.querySelector(`${widgetSelector} ul`).style.width =
      btnAnimeWidth * Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length + btnAnimeWidth + recentlyLoadMoreWidth + "px";
  }
  // Load More Button
  const loadMoreButton = create("a", { class: "btn-load-more", id: `${id}-load-more` }, loadMoreText);
  loadMoreButton.style.width = recentlyLoadMoreWidth + "px";
  loadMoreButton.style.height = recentlyLoadMoreHeight + "px";
  const slider = document.querySelector(sliderSelector);
  slider.append(loadMoreButton);
  const genreFilter = type === "anime" ? svar.recentlyAnimeFilter : svar.recentlyMangaFilter;
  const animeSelected = svar.recentlyAnimeDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyAnimeDefault) : "All";
  const mangaSelected = svar.recentlyMangaDefault ? (genreFilter.includes("genre%5B%5D=12") ? "All" : svar.recentlyMangaDefault) : "All";
  filterRecentlyAdded(itemBackup, isAnime ? animeSelected : mangaSelected);
  updateRecentlyAddedSliders(slider, leftBtnId, rightBtnId);

  loadMoreButton.addEventListener("click", async function () {
    if (loadMoreButton.innerHTML === loadMoreText) {
      let retries = 5;
      let delayMs = 1000;
      loadMoreButton.style.pointerEvents = "none";
      document.getElementById(typeFilterId).disabled = true;
      async function tryLoadMore() {
        loadMoreButton.innerHTML = '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>';
        const selectedType = document.getElementById(typeFilterId).value.split(",");
        const prevCount = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length;

        let pageCount = parseInt(document.getElementById(id).getAttribute("page")) + 50;
        let moreList = await getRecentlyAdded(mediaType, pageCount);
        list = list.concat(moreList);
        buildRecentlyAddedList(moreList, `${widgetSelector} ul`, recentlyLoadMoreWidth, recentlyLoadMoreHeight);

        document.getElementById(id).setAttribute("page", pageCount);
        const newItems = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).slice(-moreList.length);
        itemBackup.push(...newItems);

        filterRecentlyAdded(itemBackup, selectedType);
        updateRecentlyAddedSliders(slider, leftBtnId, rightBtnId);
        slider.append(loadMoreButton);
        if (!svar.recentlyGrid) {
          document.querySelector(`${widgetSelector} ul`).style.width =
            btnAnimeWidth * Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length + btnAnimeWidth + recentlyLoadMoreWidth + "px";
        }
        loadMoreButton.setAttribute("data-triggered", "true");
        refreshSlider();

        if (svar.recentlyGrid) {
          processRecentlyGridAccordion(type, 1);
        }

        const newCount = Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length;

        if (newCount === prevCount && retries > 0) {
          retries--;
          await delay(delayMs);
          await tryLoadMore();
        } else {
          loadMoreButton.innerHTML = loadMoreText;
        }
      }

      await tryLoadMore();
      loadMoreButton.style.pointerEvents = "";
      document.getElementById(typeFilterId).disabled = false;
    }
  });

  // Type Filter Change
  document.getElementById(typeFilterId).addEventListener("change", function (e) {
    slider.style.marginLeft = 0;
    const listNode = document.querySelector(`${widgetSelector} ul`);
    listNode.innerHTML = "";
    addAllRecentlyAdded(itemBackup, listNode);
    const selectedType = e.target.value.split(",");
    filterRecentlyAdded(itemBackup, selectedType);
    if (!svar.recentlyGrid) {
      document.querySelector(`${widgetSelector} ul`).style.width =
        btnAnimeWidth * Array.from(document.querySelectorAll(`${widgetSelector} ul .btn-anime`)).filter((el) => el.offsetWidth > 0).length + btnAnimeWidth + recentlyLoadMoreWidth + "px";
    }
    updateRecentlyAddedSliders(slider, leftBtnId, rightBtnId);
    slider.append(loadMoreButton);
    refreshSlider(1);
    if (svar.recentlyGrid) {
      processRecentlyGridAccordion(type, 1);
    }
  });

  // Sliders
  let items = Array.from(slider.querySelectorAll(".btn-anime,.btn-load-more")).filter((el) => el.offsetWidth > 0);
  const slideWidth = getTotalWidth(items[0]);
  const itemsPerScroll = 5;
  let maxIndex = Math.ceil(items.length / itemsPerScroll) - 1;
  const leftBtn = document.querySelector(leftBtnId);
  const rightBtn = document.querySelector(rightBtnId);

  function refreshSlider(reset) {
    items.length = 0;
    items = Array.from(slider.querySelectorAll(".btn-anime,.btn-load-more")).filter((el) => el.offsetWidth > 0);
    maxIndex = Math.ceil(items.length / itemsPerScroll) - 1;
    if (reset) slider.setAttribute("data-index", "0");
    updateButtons(reset ? 0 : parseInt(slider.dataset.index || "0"));
  }

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

  document.querySelector(`#${id} > div > div.widget-header > i`).remove();
  if (svar.recentlyGrid) {
    $(`${widgetSelector} .widget-slide`).addClass(`recentlyGrid ${svar.recentlyGrid6Column ? "recentlyGrid6Column" : ""}`);
    $(`${widgetSelector} .widget-slide`).css("grid-template-columns", svar.recentlyGrid6Column ? "repeat(6, minmax(0, 1fr))" : "repeat(5, minmax(0, 1fr))");
    $(`${widgetSelector} .widget-slide`).css("gap", svar.recentlyGrid6Column ? "15px 10px" : "20px 10px");
    $(`${widgetSelector} .widget-slide`).css("width", "100%");
    $(`${widgetSelector} ${leftBtnId}`).remove();
    $(`${widgetSelector} ${rightBtnId}`).remove();
    processRecentlyGridAccordion(type, 1);
  } else {
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

if (svar.recentlyAddedAnime && location.pathname === "/") {
  createRecentlyAddedWidget("anime");
}

if (svar.recentlyAddedManga && location.pathname === "/") {
  createRecentlyAddedWidget("manga");
}
