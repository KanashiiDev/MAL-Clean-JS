if (svar.replaceList) {
  let contLeft = $(".container-left").length ? $(".container-left") : $("#content > table > tbody > tr td[valign='top']:nth-child(1)");
  let contRight = $(".container-right").length ? $(".container-right") : $("#content > table > tbody > tr td[valign='top']:nth-child(2)");
  let isManga = null;
  // Function to create a single entry row
  function createEntryRow(animeData) {
    // Find or create the section for the current status
    let section = document.getElementById(`status-section-${animeData.status}`);
    if (!section) {
      // If section doesn't exist, create a new section
      section = create("div", { class: "status-section", id: `status-section-${animeData.status}` });
      const statusTextMap = {
        1: isManga ? translate("$listReading") : translate("$listWatching"),
        2: translate("$listCompleted"),
        3: translate("$listPaused"),
        4: translate("$listDropped"),
        6: translate("$listPlanning"),
      };
      // Create the section header
      const sectionHeader = create("h3", { class: "section-name" }, `${statusTextMap[animeData.status]}`);
      section.appendChild(sectionHeader);

      // Create the list head row
      const listHeadRow = create("div", { class: "list-head row" });

      // Create and append columns for the list head
      [
        [translate("$listSelectTitle"), "title"],
        [translate("$listSelectScore"), "score"],
        [translate("$listSelectProgress"), "progress"],
        [translate("$listSelectType"), "type"],
      ].forEach((colName) => {
        const colDiv = create("div", { class: colName[1] }, colName[0]);
        listHeadRow.appendChild(colDiv);
      });
      // Append list head row to the section
      section.appendChild(listHeadRow);
      // Append the new section to the parent container
      document.querySelector(".list-entries").appendChild(section);
    }
    const entryRow = create("div", { class: "entry row" });
    const coverDiv = create("div", { class: "cover" });
    const imageDiv = create("img", { class: "image lazyload", alt: animeData.title, src: "https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: animeData.imageUrl });
    if (animeData.airingStatus == 1 && svar.listAiringStatus) {
      const airingDot = create("span", { class: "airing-dot" });
      coverDiv.append(airingDot);
    }
    const editDiv = create("div", { class: "edit fa-pen", id: animeData.id });
    editDiv.onclick = async () => {
      isManga ? await editPopup(editDiv.id, "manga", null, null, 1) : await editPopup(editDiv.id, null, null, null, 1);
    };
    coverDiv.append(imageDiv, editDiv);
    // Create the title div
    const titleDiv = create("div", { class: "title" });
    const titleLink = create("a", { class: "title-link", href: animeData.href, style: { maxWidth: "450px" } }, animeData.title);
    titleDiv.appendChild(titleLink);
    if (animeData.notes) {
      const titleNote = create("div", { class: "user-note" });
      const titleNoteIcon = create("span", { class: "title-note fa-sticky-note" });
      const titleNoteInner = create("div", { class: "title-note-inner" });
      titleNoteInner.innerHTML = animeData.notes;
      titleNote.append(titleNoteIcon, titleNoteInner);
      $(titleNoteIcon).attr("style", 'font-family:"FontAwesome"!important');
      $(titleNote).appendTo(titleDiv);
    }
    // Create the score div
    const scoreDiv = create("div", { class: "score" }, animeData.score);
    // Create the progress div
    const progressDiv = create("div", { class: "progress" }, animeData.progress + (animeData.progressEnd ? "/" + animeData.progressEnd : ""));
    // Create the format div
    const formatDiv = create("div", { class: "format" }, animeData.format);
    // Append all child elements to the entry row
    entryRow.appendChild(coverDiv);
    entryRow.appendChild(titleDiv);
    entryRow.appendChild(scoreDiv);
    entryRow.appendChild(progressDiv);
    entryRow.appendChild(formatDiv);
    section.appendChild(entryRow);
    entryRow.setAttribute("genres", animeData.genres ? JSON.stringify(animeData.genres) : "");
    entryRow.setAttribute("season", animeData.season ? JSON.stringify(animeData.season) : "0");
    entryRow.setAttribute("tags", animeData.tags ? animeData.tags : "");
    entryRow.setAttribute("startDate", animeData.startDate ? animeData.startDate : "");
    entryRow.setAttribute("finishDate", animeData.finishDate ? animeData.finishDate : "");
    entryRow.setAttribute("createdAt", animeData.createdAt ? JSON.stringify(animeData.createdAt) : "");
    entryRow.setAttribute("updatedAt", animeData.updatedAt ? JSON.stringify(animeData.updatedAt) : "");
    entryRow.setAttribute("progress", animeData.progress ? JSON.stringify(animeData.progress) : "0");
    if (isManga) entryRow.setAttribute("mangaYear", animeData.mangaYear ? JSON.stringify(animeData.mangaYear) : "");
  }
  async function fetchWithTimeout(url, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Fetch request was aborted");
      } else {
        console.error("Fetch error:", error);
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
          $(".listLoading").html(`Retrying (${attempt}/${retries})... <i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>`);
          console.log(`Retrying (${attempt}/${retries})...`);
          await new Promise((res) => {
            setTimeout(() => res(), 1000);
          });
        } else {
          throw error;
        }
      }
    }
  }

  async function fetchAndCombineData() {
    let offset = 0;
    let allData = [];
    let shouldContinue = true;

    while (shouldContinue) {
      try {
        const response = await fetchWithRetry(`https://myanimelist.net/${isManga ? "mangalist/" + username : "animelist/" + username}/load.json?offset=${offset}&status=7`);
        const data = await response.json();

        if (data.errors) {
          shouldContinue = false;
          if (data.errors[0]?.message === "invalid request") {
            return "hidden_List";
          }
          console.error("API error:", data.errors);
          return data.errors[0]?.message;
        } else if (data.length === 0) {
          shouldContinue = false;
        } else {
          allData = allData.concat(data);
          offset += 300;
          await delay(333);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        shouldContinue = false;
      }
    }
    return allData;
  }

  async function getAnimeList(type) {
    let animeDataList = [];
    let list = [];
    isManga = type;
    const listLoading = create(
      "div",
      {
        class: "listLoading",
        style: { position: "absolute", top: "100%", left: "0", right: "0", fontSize: "16px" },
      },
      translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>'
    );
    const listEntries = create("div", { class: "list-entries" });
    contRight.append(listLoading, listEntries);
    await fetchAndCombineData().then(async (allData) => {
      list = allData;
      if (Array.isArray(list)) {
        for (let x = 0; x < list.length; x++) {
          if (isManga) {
            animeDataList.push({
              id: list[x].manga_id,
              genres: list[x].genres,
              tags: list[x].tags,
              imageUrl: list[x].manga_image_path,
              href: list[x].manga_url,
              title: list[x].manga_title,
              score: list[x].score,
              mangaYear: parseDate(list[x].manga_start_date_string, 1),
              airingStatus: list[x].manga_publishing_status,
              startDate: list[x].start_date_string,
              finishDate: list[x].finish_date_string,
              progress: list[x].num_read_chapters,
              progressEnd: list[x].manga_num_chapters,
              createdAt: list[x].created_at,
              updatedAt: list[x].updated_at,
              status: list[x].status,
              format: list[x].manga_media_type_string,
              notes: list[x].editable_notes,
            });
          } else {
            animeDataList.push({
              id: list[x].anime_id,
              genres: list[x].genres,
              tags: list[x].tags,
              season: list[x].anime_season,
              imageUrl: list[x].anime_image_path,
              href: list[x].anime_url,
              title: list[x].anime_title,
              score: list[x].score,
              airingStatus: list[x].anime_airing_status,
              startDate: list[x].start_date_string,
              finishDate: list[x].finish_date_string,
              progress: list[x].num_watched_episodes,
              progressEnd: list[x].anime_num_episodes,
              createdAt: list[x].created_at,
              updatedAt: list[x].updated_at,
              status: list[x].status,
              format: list[x].anime_media_type_string,
              notes: list[x].editable_notes,
            });
          }
        }
        loadCustomCover(1);
      }
    });

    animeDataList.sort((a, b) => b.score - a.score);
    animeDataList.forEach((animeData) => createEntryRow(animeData));
    const container = contRight.find(".list-entries");
    const divs = Array.from(container.find(".status-section"));
    divs.sort((a, b) => a.id.localeCompare(b.id));
    divs.forEach((div) => container.append(div));
    $(".loadmore").hide();
    if (!Array.isArray(list)) {
      if (list === "hidden_List") {
        listEntries.innerHTML = `<h3>${translate("$privateList")}</h3>`;
      } else {
        listEntries.innerHTML = `<h3>Error: ${list}</h3>`;
      }
    }
    listLoading.remove();

    if (svar.modernLayout) {
      $(".content-container").css("grid-template-columns", "26% auto");
      contRight.css("min-width", "900px");
      const contentDiv = document.querySelector("#content > div") ? document.querySelector("#content > div") : document.querySelector("#content > table > tbody > tr");
      if (contentDiv.className !== "") {
        contentDiv.style.marginTop = "50px";
      } else {
        contentDiv.style.marginTop = "25px";
      }
    } else if (document.querySelector("#contentWrapper > div > h1.h1")) {
      document.querySelector("#contentWrapper > div > h1.h1").style.marginBottom = "25px";
    } else if (svar.profileHeader && document.querySelector("#contentWrapper > div")) {
      document.querySelector("#contentWrapper > div").style.marginBottom = "25px";
    }

    //List Filter
    const listFilter = create("div", { id: "filter" });
    listFilter.innerHTML = `<label for="filter-input"></label><input type="text" id="filter-input" placeholder="Filter"><h3>${translate("$listLists")}</h3>`;
    const goBack = create("a", { class: "filterLists-back fa fa-arrow-left" });
    goBack.onclick = () => {
      if (svar.modernLayout) {
        $(".content-container").css("grid-template-columns", "33% auto");
        contRight.css("min-width", "800px");
      }
      contLeft.children().show();
      contRight.children().show();
      $(".loadmore").show();
      $(".fav-slide-block.mb12").show();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").show();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").show();

      if (svar.modernLayout) {
        const contentDiv = document.querySelector("#content > div") ? document.querySelector("#content > div") : document.querySelector("#content > table > tbody > tr");
        if (contentDiv.className !== "") {
          contentDiv.style.marginTop = "20px";
        } else {
          contentDiv.style.marginTop = "10px";
        }
      } else if (document.querySelector("#contentWrapper > div > h1.h1")) {
        document.querySelector("#contentWrapper > div > h1.h1").style.marginBottom = "0";
      } else if (svar.profileHeader && document.querySelector("#contentWrapper > div")) {
        document.querySelector("#contentWrapper > div").style.marginBottom = "0";
      }

      contLeft.find("#filter").remove();
      contLeft.find(".listCheck-footer").remove();
      contRight.find(".list-entries").remove();
    };
    $(listFilter).prepend(goBack);
    $(listFilter).prepend($("<h3>", { text: isManga ? "Manga List" : "Anime List", css: { marginTop: 0 } }));
    function hideOtherSections(sectionName) {
      let sections = document.querySelectorAll(".status-section");
      sections.forEach(function (section) {
        if (sectionName === "all") {
          section.style.display = "block";
        } else if (section.id !== sectionName) {
          section.style.display = "none";
        } else {
          section.style.display = "block";
        }
      });
    }
    const a_all = create("a", { class: "filterLists" }, translate("$listAll"));
    a_all.onclick = () => {
      hideOtherSections("all");
    };
    const a_watching = create("a", { class: "filterLists" }, isManga ? translate("$listReading") : translate("$listWatching"));
    a_watching.onclick = () => {
      hideOtherSections("status-section-1");
    };
    const a_completed = create("a", { class: "filterLists" }, translate("$listCompleted"));
    a_completed.onclick = () => {
      hideOtherSections("status-section-2");
    };
    const a_planning = create("a", { class: "filterLists" }, translate("$listPlanning"));
    a_planning.onclick = () => {
      hideOtherSections("status-section-6");
    };
    const a_paused = create("a", { class: "filterLists" }, translate("$listPaused"));
    a_paused.onclick = () => {
      hideOtherSections("status-section-3");
    };
    const a_dropped = create("a", { class: "filterLists" }, translate("$listDropped"));
    a_dropped.onclick = () => {
      hideOtherSections("status-section-4");
    };
    const listsDiv = create("div", { class: "filterListsDiv" });
    listsDiv.append(a_all, a_watching, a_completed, a_planning, a_paused, a_dropped);
    const listCount = create("div", { class: "filterListsCount" });
    const total = document.querySelectorAll(".entry.row").length;
    const section1 = document.querySelectorAll("#status-section-1 .entry.row").length;
    const section2 = document.querySelectorAll("#status-section-2 .entry.row").length;
    const section6 = document.querySelectorAll("#status-section-6 .entry.row").length;
    const section3 = document.querySelectorAll("#status-section-3 .entry.row").length;
    const section4 = document.querySelectorAll("#status-section-4 .entry.row").length;
    listCount.innerHTML = `(${total})<br>(${section1})<br>(${section2})<br>(${section6})<br>(${section3})<br>(${section4})`;
    const listsDivContainer = create("div", { class: "filterListsDivContainer" });
    listsDivContainer.append(listsDiv, listCount);
    listFilter.append(listsDivContainer);
    contLeft.append(listFilter);
    document.getElementById("filter-input").addEventListener("input", function () {
      var filterValue = this.value.toLowerCase();
      var entries = document.querySelectorAll(".entry");
      entries.forEach(function (entry) {
        var titleText = entry.querySelector(".title a").textContent.toLowerCase();
        if (titleText.includes(filterValue)) {
          entry.classList.remove("hidden");
        } else {
          entry.classList.add("hidden");
        }
      });
    });

    //Genres Filter
    const genresFilter = create("div", { class: "filterList_GenresFilter" });
    genresFilter.innerHTML = genresFilter.innerHTML = `
    <button class="genreDropBtn">${translate("$listSelectGenres")}</button>
    <div class="maljs-dropdown-content" id="maljs-dropdown-content">
    <label><input type="checkbox" class="genre-filter" value="1" title="Action"> Action</label>
    <label><input type="checkbox" class="genre-filter" value="2" title="Adventure"> Adventure</label>
    <label><input type="checkbox" class="genre-filter" value="5" title="Avant Garde"> Avant Garde</label>
    <label><input type="checkbox" class="genre-filter" value="46" title="Award Winning"> Award Winning</label>
    <label><input type="checkbox" class="genre-filter" value="28" title="Boys Love"> Boys Love</label>
    <label><input type="checkbox" class="genre-filter" value="4" title="Comedy"> Comedy</label>
    <label><input type="checkbox" class="genre-filter" value="8" title="Drama"> Drama</label>
    <label><input type="checkbox" class="genre-filter" value="9" title="Ecchi"> Ecchi</label>
    <label><input type="checkbox" class="genre-filter" value="10" title="Fantasy"> Fantasy</label>
    <label><input type="checkbox" class="genre-filter" value="12" title="Hentai"> Hentai</label>
    <label><input type="checkbox" class="genre-filter" value="26" title="Girls Love"> Girls Love</label>
    <label><input type="checkbox" class="genre-filter" value="47" title="Gourmet"> Gourmet</label>
    <label><input type="checkbox" class="genre-filter" value="14" title="Horror"> Horror</label>
    <label><input type="checkbox" class="genre-filter" value="7" title="Mystery"> Mystery</label>
    <label><input type="checkbox" class="genre-filter" value="22" title="Romance"> Romance</label>
    <label><input type="checkbox" class="genre-filter" value="24" title="Sci-Fi"> Sci-Fi</label>
    <label><input type="checkbox" class="genre-filter" value="36" title="Slice of Life"> Slice of Life</label>
    <label><input type="checkbox" class="genre-filter" value="30" title="Sports"> Sports</label>
    <label><input type="checkbox" class="genre-filter" value="37" title="Supernatural"> Supernatural</label>
    <label><input type="checkbox" class="genre-filter" value="41" title="Suspense"> Suspense</label>
    </div>`;

    listFilter.appendChild(genresFilter);
    // Genres Dropdown Function
    $(".genreDropBtn").click(function () {
      const genreFilterDiv = document.querySelector(".filterList_GenresFilter");
      genreFilterDiv.style.minWidth = genreFilterDiv.style.minWidth === "255px" ? "" : "255px";
      const dropdownContent = document.getElementById("maljs-dropdown-content");
      dropdownContent.style.display = dropdownContent.style.display === "grid" ? "none" : "grid";
    });
    // Genres Filter Function
    $(".genre-filter").click(function () {
      const checkboxes = document.querySelectorAll(".genre-filter");
      const entries = document.querySelectorAll(".entry");
      const selectedGenres = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);
      entries.forEach((entry) => {
        const genres = JSON.parse(entry.getAttribute("genres"));
        const entryGenres = genres.map((genre) => genre.id.toString());
        const isVisible = selectedGenres.every((genre) => entryGenres.includes(genre)) || selectedGenres.length === 0;
        if (isVisible) {
          entry.classList.remove("hidden");
        } else {
          entry.classList.add("hidden");
        }
      });
      $(".genreDropBtn").text(
        selectedGenres.length > 0
          ? Array.from(checkboxes)
              .filter((checkbox) => checkbox.checked)
              .map((checkbox) => checkbox.title)
          : translate("$listSelectGenres")
      );
    });

    //Year Filter
    const yearFilter = create("div", { class: "filterList_YearFilter" });
    const currentYear = new Date().getFullYear();
    const yearFilterMax = currentYear;
    const yearFilterMin = currentYear - 95;
    const yearFilterClear = create("i", { class: "year-filter-clear fa fa-close" });
    yearFilter.innerHTML = `<div class="year-filter-slider-container">
  <input type="range" id="year-filter-slider" min="${yearFilterMin}" max="${yearFilterMax}" value="${yearFilterMax}" step="1">
  <span id="year-filter-label">${yearFilterMax}</span></div>`;
    let canAddYearFilter = 0;
    if ((!isManga && animeDataList[0] && animeDataList[0].season) || (isManga && animeDataList[0] && animeDataList[0].mangaYear)) {
      canAddYearFilter = 1;
    }
    if (canAddYearFilter) {
      $(yearFilter).prepend(`<h3>${translate("$listYear")}</h3>`);
      $(yearFilter).prepend($(yearFilterClear));
      listFilter.appendChild(yearFilter);
      const $yearFilterSlider = $("#year-filter-slider");
      const $yearFilterLabel = $("#year-filter-label");

      // Year Filter Clear Button Function
      $(yearFilterClear).on("click", function () {
        const entries = document.querySelectorAll(".entry");
        entries.forEach((entry) => {
          entry.classList.remove("hidden");
          yearFilterClear.style.display = "none";
          $yearFilterSlider.val(currentYear).change();
          $yearFilterLabel.text($yearFilterSlider.val());
        });
      });
      // Update label when slider value changes
      $yearFilterSlider.on("input", function () {
        if (yearFilterClear.style.display !== "block") {
          yearFilterClear.style.display = "block";
        }
        $yearFilterLabel.text($(this).val());
        const entries = document.querySelectorAll(".entry");
        entries.forEach((entry) => {
          const seasonData = isManga ? JSON.parse(entry.getAttribute("mangayear")) : JSON.parse(entry.getAttribute("season"));
          const entryYear = seasonData?.year ? seasonData.year : 0;
          if (entryYear && entryYear === parseInt($(this).val(), 10)) {
            entry.classList.remove("hidden");
          } else {
            entry.classList.add("hidden");
          }
        });
      });

      // Initialize label
      $yearFilterLabel.text($yearFilterSlider.val());
    }

    //Sort Filter
    const sortFilter = create("div", { class: "filterList_SortFilter" });
    sortFilter.innerHTML = `
  <div class="sort-container" style="display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; gap: 0px 10px; margin-top: 10px;">
  <select id="sort-select" style="width:100%"><option value="title">${translate("$listSelectTitle")}</option><option value="score">${translate("$listSelectScore")}</option>
  <option value="progress">${translate("$listSelectProgress")}</option><option value="startdate">${translate("$listSelectStartDate")}</option><option value="finishdate">${translate(
      "$listSelectFinishDate"
    )}</option>
  ${isManga ? "" : `<option value="createdat">${translate("$listSelectLastAdded")}</option> <option value="updatedat">${translate("$listSelectLastUpdated")}</option>`}</select>
  <button class="fa fa-arrow-up" id="sort-asc" style="font-family: FontAwesome; width:33px; margin-top:0"></button>
  <button class="fa fa-arrow-down" id="sort-desc" style="font-family: FontAwesome; width:33px; margin-top:0"></button></div>`;
    listFilter.appendChild(sortFilter);
    const sortSelect = document.getElementById("sort-select");
    const sortAsc = document.getElementById("sort-asc");
    const sortDesc = document.getElementById("sort-desc");

    function getValue(entry, criterion) {
      switch (criterion) {
        case "score": {
          const score = entry.querySelector(".score")?.textContent?.trim();
          const parsed = parseInt(score, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        case "title": {
          const title = entry.querySelector(".title")?.textContent?.trim();
          return title ?? "";
        }
        case "startdate": {
          const startdate = entry.getAttribute("startdate");
          if (!startdate) return -Infinity;
          const parsed = parseDate(startdate);
          return parsed != null ? parsed : -Infinity;
        }
        case "finishdate": {
          const finishdate = entry.getAttribute("finishdate");
          if (!finishdate) return -Infinity;
          const parsed = parseDate(finishdate);
          return parsed != null ? parsed : -Infinity;
        }
        case "createdat": {
          const createdatAttr = entry.getAttribute("createdat");
          if (!createdatAttr) return -Infinity;
          const parsed = parseInt(createdatAttr, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        case "updatedat": {
          const updatedatAttr = entry.getAttribute("updatedat");
          if (!updatedatAttr) return -Infinity;
          const parsed = parseInt(updatedatAttr, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        case "progress": {
          const progressAttr = entry.getAttribute("progress");
          if (!progressAttr) return -Infinity;
          const parsed = parseInt(progressAttr, 10);
          return isNaN(parsed) ? -Infinity : parsed;
        }
        default:
          return "";
      }
    }

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
    const entries = document.querySelectorAll(".entry");
    const tagsContainer = create("div", { class: "filterList_TagsContainer" });
    const tagsContainerClear = create("i", { class: "tags-container-clear fa fa-close" });
    const tags = new Set(); // Using a Set to avoid duplicates
    tagsContainer.style.marginBottom = "10px";
    listFilter.appendChild(tagsContainer);
    // Tags Clear Button Function
    $(tagsContainerClear).on("click", function () {
      $(".tag-link.clicked").attr("class", "tag-link");
      const entries = document.querySelectorAll(".entry");
      entries.forEach((entry) => {
        entry.classList.remove("hidden");
        tagsContainerClear.style.display = "none";
      });
    });
    // Collect all unique tags
    entries.forEach((entry) => {
      const tag = entry.getAttribute("tags").replace(/"/g, ""); // Remove quotes
      if (tag) {
        tags.add(tag);
      }
    });

    if (tags.size > 0) {
      $(tagsContainer).prepend(`<h3>${translate("$listTags")}</h3>`);
      $(tagsContainer).prepend($(tagsContainerClear));
    }
    // Filter function
    function filterByTag(tag) {
      if (tagsContainerClear.style.display !== "block") {
        tagsContainerClear.style.display = "block";
      }
      entries.forEach((entry) => {
        const entryTag = entry.getAttribute("tags").replace(/"/g, "");
        if (entryTag === tag) {
          entry.classList.remove("hidden");
        } else {
          entry.classList.add("hidden");
        }
      });
    }
    // Create tag links
    tags.forEach((tag) => {
      const link = create("a", { class: "tag-link" }, tag);
      link.onclick = () => {
        $(".tag-link.clicked").attr("class", "tag-link");
        $(link).attr("class", "tag-link clicked");
        filterByTag(tag);
      };
      tagsContainer.appendChild(link);
    });

    //Compare Button
    if (userNotHeaderUser) {
      let compareBtn = create("a", { class: "compareBtn" }, translate("$listCompare"));
      let compareUrl = isManga
        ? "https://myanimelist.net/sharedmanga.php?u1=" + username + "&u2=" + headerUserName
        : "https://myanimelist.net/sharedanime.php?u1=" + username + "&u2=" + headerUserName;
      compareBtn.href = compareUrl;
      listFilter.appendChild(compareBtn);
    }

    // Make 3x3
    let buttonDraw3x3 = AdvancedCreate("a", "#maljsDraw3x3", translate("$3x3Btn"));
    listFilter.appendChild(buttonDraw3x3);
    buttonDraw3x3.onclick = function () {
      if (!document.querySelector(".maljsDisplayBox")) {
        $(".entry.row .title").css("pointer-events", "none");
        let displayBox = createDisplayBox(false, translate("$3x3Btn"));
        let col_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let col_label = AdvancedCreate("span", false, translate("$3x3Columns"), displayBox, "margin: 5px");
        col_input.type = "number";
        col_input.value = 3;
        col_input.step = 1;
        col_input.min = 0;
        let row_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let row_label = AdvancedCreate("span", false, translate("$3x3Rows"), displayBox, "margin: 5px");
        AdvancedCreate("br", false, false, displayBox);
        row_input.type = "number";
        row_input.value = 3;
        row_input.step = 1;
        row_input.min = 0;
        let margin_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let margin_label = AdvancedCreate("span", false, translate("$3x3ImgSpacing"), displayBox, "margin: 5px");
        AdvancedCreate("br", false, false, displayBox);
        margin_input.type = "number";
        margin_input.value = 0;
        margin_input.min = 0;
        let width_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let width_label = AdvancedCreate("span", false, translate("$3x3ImgWidth"), displayBox, "margin: 5px");
        width_input.type = "number";
        width_input.value = 230;
        width_input.min = 0;
        let height_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
        let height_label = AdvancedCreate("span", false, translate("$3x3ImgHeight"), displayBox, "margin: 5px");
        AdvancedCreate("br", false, false, displayBox);
        height_input.type = "number";
        height_input.value = 345;
        height_input.min = 0;
        let fitMode = AdvancedCreate("select", "maljsNativeInput", false, displayBox);
        let fitMode_label = AdvancedCreate("span", false, translate("$3x3ImgFit"), displayBox, "margin	: 5px");
        let addOption = function (value, text) {
          let newOption = AdvancedCreate("option", false, text, fitMode);
          newOption.value = value;
        };
        addOption("scale", "scale");
        addOption("crop", "crop");
        addOption("hybrid", "scale/crop hybrid");
        addOption("letterbox", "letterbox");
        addOption("transparent", "transparent letterbox");

        let recipe = AdvancedCreate("p", false, translate("$3x3Desc"), displayBox);
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
            card.querySelector(".title").style.pointerEvents = "";
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
              if (keepUpdating) {
                if (this.draw3x3selected) {
                  linkList[linkList.indexOf(this.draw3x3selected)] = "empty";
                  this.draw3x3selected = false;
                  this.style.borderStyle = "none";
                } else {
                  let val = this.querySelector(".cover .image").src;
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
              }
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

  //Anime List Button
  const animeListButton = document.querySelector("a.btn-profile-submit.fl-l");
  if (animeListButton) {
    animeListButton.href = "javascript:void(0);";
    animeListButton.onclick = async () => {
      $(contLeft).children().hide();
      $(contRight).children().hide();
      $(".fav-slide-block.mb12").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
      getAnimeList();
    };
  }
  //Manga List Button
  const mangaListButton = document.querySelector("a.btn-profile-submit.fl-r");
  if (mangaListButton) {
    mangaListButton.href = "javascript:void(0);";
    mangaListButton.onclick = async () => {
      $(contLeft).children().hide();
      $(contRight).children().hide();
      $(".fav-slide-block.mb12").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
      $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
      getAnimeList("manga");
    };
  }
}
