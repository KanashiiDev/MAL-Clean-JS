//Recently Added Anime //--START--//
if (svar.recentlyAddedAnime && location.pathname === "/") {
  buildRecentlyAddedAnime();

  async function buildRecentlyAddedAnime() {
    let user = headerUserName;
    if (user) {
      const recentlyAddedDiv = create("article", { class: "widget-container left  recently-anime", id: "recently-added-anime", page: "0" });
      recentlyAddedDiv.innerHTML =
        '<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span><h2 class="index_h2_seo">' +
        '<a href="https://myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1">Recently Added Anime</a>' +
        '</h2><i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>' +
        '<select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilter">' +
        '<option value="All">All</option><option value="TV,Movie" selected >TV	&amp; Movie</option><option value="TV">TV</option><option value="TV Special">TV Special</option>' +
        '<option value="Movie">Movie</option><option value="ONA">ONA</option><option value="OVA">OVA</option>' +
        '<option value="Special">Special</option><option value="Music">Music</option><option value="CM">CM</option><option value="PV">PV</option></select></div>' +
        '<div class="widget-content"><div class="mt4">' +
        '<div class="widget-slide-block" id="widget-recently-added-anime">' +
        '<div id="current-left-recently-added-anime" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>' +
        '<div id="current-right-recently-added-anime" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">' +
        '<span class="btn-inner" style="display: none;"></span></div><div class="widget-slide-outer">' +
        '<ul class="widget-slide js-widget-slide recent-anime" data-slide="4" style="width: 720px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul>' +
        "</div></div></div></div></div>";

      // Get List
      let list = await getList();
      async function getList() {
        for (let x = 0; x < 5; x++) {
          const data = await getRecentlyAdded(0);
          if (data) {
            return data;
          }
          await delay(1000);
        }
        // if error
        let d = document.querySelector("#recently-added-anime > div > div.widget-header");
        if (d) {
          let e = create("span", { class: "currently-watching-error", style: { float: "right", display: "inline-block" } }, "API Error. Please try again.");
          let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
          r.onclick = () => {
            recentlyAddedDiv.remove();
            buildRecentlyAddedAnime();
          };
          e.append(r);
          d.append(e);
        }
      }

      if (list) {
        if (document.querySelector("#currently-reading")) {
          document.querySelector("#currently-reading").insertAdjacentElement("afterend", recentlyAddedDiv);
        } else if (document.querySelector("#currently-watching")) {
          document.querySelector("#currently-watching").insertAdjacentElement("afterend", recentlyAddedDiv);
        } else {
          document.querySelector("#content > div.left-column").prepend(recentlyAddedDiv);
        }
        buildRecentlyAddedList(list, "#widget-recently-added-anime ul");
        document.querySelector("#recently-added-anime > div > div.widget-header > i").remove();
        document.querySelector("#widget-recently-added-anime > div.widget-slide-outer > ul").children.length > 5
          ? document.querySelector("#current-right-recently-added-anime").classList.add("active")
          : "";

        let animeItemsBackup = Array.from(document.querySelectorAll("#widget-recently-added-anime ul .btn-anime"));
        document.querySelector("#widget-recently-added-anime ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-anime ul .btn-anime").length + 138 + "px";

        //Load More Items
        const loadMoreButton = create("a", { id: "recently-added-anime-load-more" }, "Load More");
        const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
        slider.append(loadMoreButton);
        filterRecentlyAdded(animeItemsBackup, ["TV", "Movie"]);
        updateRecentlyAddedSliders(slider, "#current-left-recently-added-anime", "#current-right-recently-added-anime");

        loadMoreButton.addEventListener("click", async function () {
          if (loadMoreButton.innerHTML === "Load More") {
            loadMoreButton.innerHTML = '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>';
            const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
            const selectedType = document.getElementById("typeFilter").value.split(",");
            let pageCount = document.getElementById("recently-added-anime").getAttribute("page");
            pageCount = parseInt(pageCount) + 50;
            let moreList = await getRecentlyAdded(0, pageCount);
            list = list.concat(moreList);
            $("#widget-recently-added-anime ul").html("");
            buildRecentlyAddedList(list, "#widget-recently-added-anime ul");
            document.getElementById("recently-added-anime").setAttribute("page", pageCount);
            animeItemsBackup = Array.from(document.querySelectorAll("#widget-recently-added-anime ul .btn-anime"));
            filterRecentlyAdded(animeItemsBackup, selectedType);
            updateRecentlyAddedSliders(slider, "#current-left-recently-added-anime", "#current-right-recently-added-anime");
            slider.append(loadMoreButton);
            document.querySelector("#widget-recently-added-anime ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-anime ul .btn-anime").length + 138 + "px";
            await delay(1000);
            loadMoreButton.innerHTML = "Load More";
            document.querySelector("#widget-recently-added-anime ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-anime ul .btn-anime").length + 138 + "px";
          }
        });

        // Filter
        document.getElementById("typeFilter").addEventListener("change", function (e) {
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
          slider.style.marginLeft = 0;
          const list = document.querySelector("#widget-recently-added-anime ul");
          list.innerHTML = "";
          addAllRecentlyAdded(animeItemsBackup, list);
          const selectedType = e.target.value.split(",");
          const animeItems = Array.from(document.querySelectorAll("#widget-recently-added-anime ul .btn-anime"));
          if (selectedType[0] !== "All") {
            filterRecentlyAdded(animeItems, selectedType);
          }
          document.querySelector("#widget-recently-added-anime ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-anime ul .btn-anime").length + 138 + "px";
          updateRecentlyAddedSliders(slider, "#current-left-recently-added-anime", "#current-right-recently-added-anime");
          slider.append(loadMoreButton);
        });

        // Slider Left
        document.querySelector("#current-left-recently-added-anime").addEventListener("click", function () {
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
          const slideWidth = slider.children[0].offsetWidth + 12;
          if (parseInt(slider.style.marginLeft) < 0) {
            slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
            document.querySelector("#widget-recently-added-anime > div.widget-slide-outer > ul").children.length > 5
              ? document.querySelector("#current-right-recently-added-anime").classList.add("active")
              : "";
          }
          if (parseInt(slider.style.marginLeft) > 0) {
            slider.style.marginLeft = -slideWidth + "px";
          }
          if (parseInt(slider.style.marginLeft) === 0) {
            document.querySelector("#current-left-recently-added-anime").classList.remove("active");
          }
        });

        // Slider Right
        document.querySelector("#current-right-recently-added-anime").addEventListener("click", function () {
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
          const slideWidth = slider.children[0].offsetWidth + 12;
          if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
            slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
            document.querySelector("#current-left-recently-added-anime").classList.add("active");
          }
          if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
            document.querySelector("#current-right-recently-added-anime").classList.remove("active");
          }
        });
      }
    }
  }
}
//Recently Added Anime //--END--//

//Recently Added Manga //--START--//
if (svar.recentlyAddedManga && location.pathname === "/") {
  buildRecentlyAddedManga();

  async function buildRecentlyAddedManga() {
    let user = headerUserName;
    if (user) {
      const recentlyAddedDiv = create("article", { class: "widget-container left recently-manga", id: "recently-added-manga", page: "0" });
      recentlyAddedDiv.innerHTML =
        '<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span><h2 class="index_h2_seo">' +
        '<a href="https://myanimelist.net/manga.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1">Recently Added Manga</a>' +
        '</h2><i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>' +
        '<select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilterManga">' +
        '<option value="All">All</option><option value="Manga" selected>Manga</option><option value="One-shot">One-shot</option>' +
        '<option value="Doujinshi">Doujinshi</option><option value="Light Novel">Light Novel</option><option value="Novel">Novel</option>' +
        '<option value="Manhwa">Manhwa</option><option value="Manhua">Manhua</option></select></div>' +
        '<div class="widget-content"><div class="mt4">' +
        '<div class="widget-slide-block" id="widget-recently-added-manga">' +
        '<div id="current-left-recently-added-manga" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>' +
        '<div id="current-right-recently-added-manga" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">' +
        '<span class="btn-inner" style="display: none;"></span></div><div class="widget-slide-outer">' +
        '<ul class="widget-slide js-widget-slide recent-manga" data-slide="4" style="width: 720px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul>' +
        "</div></div></div></div></div>";

      // Get List
      let list = await getList();
      async function getList() {
        for (let x = 0; x < 5; x++) {
          const data = await getRecentlyAdded(1);
          if (data) {
            return data;
          }
          await delay(1000);
        }
        // if error
        let d = document.querySelector("#recently-added-anime > div > div.widget-header");
        if (d) {
          let e = create("span", { class: "currently-watching-error", style: { float: "right", display: "inline-block" } }, "API Error. Please try again.");
          let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
          r.onclick = () => {
            recentlyAddedDiv.remove();
            buildRecentlyAddedManga();
          };
          e.append(r);
          d.append(e);
        }
      }

      if (list) {
        if (document.querySelector("#recently-added-anime")) {
          document.querySelector("#recently-added-anime").insertAdjacentElement("afterend", recentlyAddedDiv);
        } else if (document.querySelector("#currently-reading")) {
          document.querySelector("#currently-reading").insertAdjacentElement("afterend", recentlyAddedDiv);
        } else if (document.querySelector("#currently-watching")) {
          document.querySelector("#currently-watching").insertAdjacentElement("afterend", recentlyAddedDiv);
        } else {
          document.querySelector("#content > div.left-column").prepend(recentlyAddedDiv);
        }
        buildRecentlyAddedList(list, "#widget-recently-added-manga ul");
        document.querySelector("#recently-added-manga > div > div.widget-header > i").remove();
        document.querySelector("#widget-recently-added-manga > div.widget-slide-outer > ul").children.length > 5
          ? document.querySelector("#current-right-recently-added-manga").classList.add("active")
          : "";

        let mangaItemsBackup = Array.from(document.querySelectorAll("#widget-recently-added-manga ul .btn-anime"));
        document.querySelector("#widget-recently-added-manga ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-manga ul .btn-anime").length + 138 + "px";

        //Load More Items
        const loadMoreButton = create("a", { id: "recently-added-manga-load-more" }, "Load More");
        const slider = document.querySelector(".widget-slide.js-widget-slide.recent-manga");
        slider.append(loadMoreButton);
        filterRecentlyAdded(mangaItemsBackup, ["Manga"]);
        updateRecentlyAddedSliders(slider, "#current-left-recently-added-manga", "#current-right-recently-added-manga");

        loadMoreButton.addEventListener("click", async function () {
          if (loadMoreButton.innerHTML === "Load More") {
            loadMoreButton.innerHTML = '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>';
            const selectedType = document.getElementById("typeFilterManga").value.split(",");
            let pageCount = document.getElementById("recently-added-manga").getAttribute("page");
            pageCount = parseInt(pageCount) + 50;
            let moreList = await getRecentlyAdded(1, pageCount);
            list = list.concat(moreList);
            $("#widget-recently-added-manga ul").html("");
            buildRecentlyAddedList(list, "#widget-recently-added-manga ul");
            document.getElementById("recently-added-manga").setAttribute("page", pageCount);
            mangaItemsBackup = Array.from(document.querySelectorAll("#widget-recently-added-manga ul .btn-anime"));
            filterRecentlyAdded(mangaItemsBackup, selectedType);
            updateRecentlyAddedSliders(slider, "#current-left-recently-added-manga", "#current-right-recently-added-manga");
            slider.append(loadMoreButton);
            document.querySelector("#widget-recently-added-manga ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-manga ul .btn-anime").length + 138 + "px";
            await delay(1000);
            loadMoreButton.innerHTML = "Load More";
          }
        });

        // Filter
        document.getElementById("typeFilterManga").addEventListener("change", function (e) {
          slider.style.marginLeft = 0;
          const list = document.querySelector("#widget-recently-added-manga ul");
          list.innerHTML = "";
          addAllRecentlyAdded(mangaItemsBackup, list);
          const selectedType = e.target.value.split(",");
          const mangaItems = Array.from(document.querySelectorAll("#widget-recently-added-manga ul .btn-anime"));
          if (selectedType[0] !== "All") {
            filterRecentlyAdded(mangaItems, selectedType);
          }
          document.querySelector("#widget-recently-added-manga ul").style.width = 138 * document.querySelectorAll("#widget-recently-added-manga ul .btn-anime").length + 138 + "px";
          updateRecentlyAddedSliders(slider, "#current-left-recently-added-manga", "#current-right-recently-added-manga");
          slider.append(loadMoreButton);
        });

        // Slider Left
        document.querySelector("#current-left-recently-added-manga").addEventListener("click", function () {
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-manga");
          const slideWidth = slider.children[0].offsetWidth + 12;
          if (parseInt(slider.style.marginLeft) < 0) {
            slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
            document.querySelector("#widget-recently-added-manga > div.widget-slide-outer > ul").children.length > 5
              ? document.querySelector("#current-right-recently-added-manga").classList.add("active")
              : "";
          }
          if (parseInt(slider.style.marginLeft) > 0) {
            slider.style.marginLeft = -slideWidth + "px";
          }
          if (parseInt(slider.style.marginLeft) === 0) {
            document.querySelector("#current-left-recently-added-manga").classList.remove("active");
          }
        });

        // Slider Right
        document.querySelector("#current-right-recently-added-manga").addEventListener("click", function () {
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-manga");
          const slideWidth = slider.children[0].offsetWidth + 12;
          if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
            slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
            document.querySelector("#current-left-recently-added-manga").classList.add("active");
          }
          if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
            document.querySelector("#current-right-recently-added-manga").classList.remove("active");
          }
        });
      }
    }
  }
}
