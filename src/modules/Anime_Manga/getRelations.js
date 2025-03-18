async function getRelations() {
  let relationData, sortedRelations, relationHeight;
  const relationDiv = create("div", { class: "aniTagDiv" });
  const relationTargetExpand = create("a", { class: "relations-accordion-button" });
  const extraRelationsDiv = create("div", { class: "relationsExpanded", style: { display: "none" } });
  const relationTarget = document.querySelector(".related-entries");
  const relationLocalForage = localforage.createInstance({ name: "MalJS", storeName: "relations" });
  const relationcacheTTL = svar.relationTTL;
  let relationCache = await relationLocalForage.getItem(entryId + "-" + entryType);
  const priorityOrder = { ADAPTATION: 0, PREQUEL: 1, SEQUEL: 2, PARENT: 3, ALTERNATIVE: 4, SIDE_STORY: 5, SUMMARY: 6, SPIN_OFF: 7, CHARACTER: 8, OTHER: 9 };
  if (!relationCache || relationCache.time + relationcacheTTL < Date.now()) {
    relationData = await aniAPIRequest();
    relationData?.data.Media ? (relationData = relationData.data.Media.relations.edges.filter((node) => node.node.idMal !== null)) : null;
    if (relationData && relationData.length > 0) {
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
      await relationLocalForage.setItem(entryId + "-" + entryType, {
        relations: sortedRelations,
        time: Date.now(),
      });
      relationCache = await relationLocalForage.getItem(entryId + "-" + entryType);
    }
  }
  if (relationCache && relationTarget) {
    $('h2:contains("Related Entries"):last').parent().find("a").remove();
    $('h2:contains("Related Entries"):last').text("Relations");
    document.querySelector("#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel > table").style.overflow = "visible";
    relationTarget.classList.add("relationsTarget");
    relationTarget.style.setProperty("padding", "10px", "important");
    relationTarget.classList.add("spaceit-shadow");
    relationTarget.innerHTML = relationCache.relations
      .map((node) => {
        const isManga = node.node.type === "MANGA";
        const typePath = isManga ? "manga" : "anime";
        const format = node.node.format ? (node.node.format === "NOVEL" ? (node.node.format = "LIGHT NOVEL") : node.node.format.replace("_", " ")) : node.node.type;
        const coverImage = node.node.coverImage && node.node.coverImage.large ? node.node.coverImage.large : node.node.coverImage.medium ? node.node.coverImage.medium : "";
        const borderColor = isManga ? "#92d493" : "#afc7ee";
        const relationType = node.relationType.split("_").join(" ");
        const title = node.node.title && node.node.title.romaji ? node.node.title.romaji : "";
        const year =
          node.node.type === "MANGA" && node.node.startDate && node.node.startDate.year
            ? node.node.startDate.year + " · "
            : node.node.seasonYear
            ? node.node.seasonYear + " · "
            : node.node.startDate && node.node.startDate.year
            ? node.node.startDate.year + " · "
            : "";
        const status = node.node.status ? node.node.status.split("_").join(" ") : "";
        return `
      <div class='relationEntry'><a class='link' href='/${typePath}/${node.node.idMal}/'>
      <img class='relationImg' src='${coverImage}' alt='${title}' />
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
      $(".relationEntry").on("mouseenter", async function () {
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
      });
      $(".relationEntry").on("mouseleave", async function () {
        const el = $(this);
        const elDetails = $(this).find(".relationDetails");
        $(el).removeClass("relationEntryRight");
        $(elDetails).removeClass("relationDetailsRight");
      });
    }

    relationDetailsShow();
    if (relationTarget.clientHeight > 144) {
      relationHeight = relationTarget.clientHeight;
      const extraRelations = relationTarget.querySelectorAll(".relationEntry");
      relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
      for (let i = 0; i < extraRelations.length; i++) {
        if (relationTarget.clientHeight > 144) {
          extraRelationsDiv.appendChild(relationTarget.querySelector(".relationEntry:last-child"));
        }
      }
      relationTarget.append(extraRelationsDiv);
      const extraDivs = Array.from(extraRelationsDiv.children);
      const reversedDivs = extraDivs.reverse();
      extraRelationsDiv.innerHTML = "";
      reversedDivs.forEach((div) => extraRelationsDiv.appendChild(div));
      relationTarget.insertAdjacentElement("afterend", relationTargetExpand);
      relationTarget.querySelector("div:nth-child(1)").style.marginLeft = "8px";
      extraRelationsDiv.setAttribute("style", "display:none!important");
      relationTarget.setAttribute("style", "margin-bottom:5px;padding:12px 4px!important");
      relationTargetExpand.addEventListener("click", function () {
        if (document.querySelector(".relationsExpanded").style.display === "none") {
          document.querySelector(".relationsExpanded").setAttribute("style", "display:flex!important");
          relationTargetExpand.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
        } else {
          document.querySelector(".relationsExpanded").setAttribute("style", "display:none!important");
          relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
        }
      });
    }

    // Filter Replaced Relations
    let filterTarget = document.querySelector(".RelatedEntriesDiv .floatRightHeader");
    if (filterTarget && svar.relationFilter && svar.animeRelation) {
      let filtered;
      const relationDefault = relationTarget.innerHTML;
      const relationFilter = create("div", { class: "relations-filter" });
      relationFilter.innerHTML =
        '<label for="relationFilter"></label><select id="relationFilter">' +
        '<option value="">All</option><option value="ADAPTATION">Adaptation</option><option value="PREQUEL">Prequel</option>' +
        '<option value="SEQUEL">Sequel</option><option value="PARENT">Parent</option><option value="ALTERNATIVE">Alternative</option><option value="SUMMARY">Summary</option>' +
        '<option value="SIDE STORY">Side Story</option><option value="SPIN OFF">Spin Off</option><option value="CHARACTER">Character</option><option value="OTHER">Other</option></select>';
      filterTarget.append(relationFilter);
      extraRelationsDiv.setAttribute("style", "display: flex!important;height: 0px;overflow: hidden;");

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

        const entries = document.querySelectorAll(".relationEntry");
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (filtered) {
            entry.style.marginLeft = "0";
          }
          const relationTitle = entry.querySelector(".relationTitle").textContent;
          if (title === "" || relationTitle === title) {
            entry.style.display = "block";
          } else {
            entry.style.display = "none";
          }
        }

        if (!relationFilter.children[1].value.length) {
          extraRelationsDiv.setAttribute("style", "display:none!important");
          relationTargetExpand.setAttribute("style", "display:block!important");
          relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
          if (relationHeight) {
            relationTarget.setAttribute("style", "margin-bottom: 5px;padding: 12px 4px!important;");
          } else {
            relationTarget.setAttribute("style", "padding: 12px 12px!important;");
          }
        } else {
          relationTargetExpand.setAttribute("style", "display:none!important");
          relationTarget.setAttribute("style", "padding: 12px 12px!important;");
        }
        relationDetailsShow();
      }

      function updateFilterOptions() {
        const options = document.querySelectorAll("#relationFilter option");
        const titles = Array.from(document.querySelectorAll(".relationTitle")).map((el) => el.textContent);
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          if (option.value !== "") {
            if (!titles.includes(option.value)) {
              option.remove();
            }
          }
        }
        if (document.querySelectorAll("#relationFilter option").length <= 2) {
          document.querySelector(".relations-filter").remove();
        } else {
          document.querySelector(".RelatedEntriesDiv").setAttribute("style", "align-content: center;margin-bottom: 10px;");
          document.querySelector(".RelatedEntriesDiv #related_entries").setAttribute("style", "margin-top: 10px;");
        }
      }

      document.getElementById("relationFilter").addEventListener("change", function () {
        filterRelations(this.value);
      });
      filterRelations("");
      updateFilterOptions();
    }
  }
}
