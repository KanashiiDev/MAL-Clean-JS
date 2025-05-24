const RELATION_HEIGHT_THRESHOLD = 120;
const relationPriority = {
  ADAPTATION: 0,
  PREQUEL: 1,
  SEQUEL: 2,
  PARENT: 3,
  ALTERNATIVE: 4,
  SIDE_STORY: 5,
  SUMMARY: 6,
  SPIN_OFF: 7,
  CHARACTER: 8,
  OTHER: 9,
};

async function getRelations() {
  const relationTarget = document.querySelector(".related-entries");
  if (!relationTarget) return;

  const relationStorage = localforage.createInstance({ name: "MalJS", storeName: "relations" });
  const cacheTTL = svar.relationTTL;
  let cache = await relationStorage.getItem(`${entryId}-${entryType}`);

  if (!cache || cache.time + cacheTTL < Date.now()) {
    cache = await fetchAndCacheRelations(relationStorage);
  }

  if (!cache?.relations?.length) return;

  renderRelations(relationTarget, cache.relations);
  setupExpandCollapse(relationTarget);
  setupFiltering(relationTarget);
}

async function fetchAndCacheRelations(storage) {
  const apiResult = await aniAPIRequest();
  let relations = apiResult?.data?.Media?.relations?.edges?.filter((r) => r.node.idMal !== null) || [];

  relations.sort((a, b) => relationPriority[a.relationType] - relationPriority[b.relationType]);

  const grouped = relations.reduce((acc, cur) => {
    const type = cur.relationType;
    acc[type] = acc[type] || [];
    acc[type].push(cur);
    return acc;
  }, {});

  for (const type in grouped) {
    grouped[type].sort((a, b) => {
      const yA = a.node.seasonYear ?? a.node.startDate?.year ?? 0;
      const yB = b.node.seasonYear ?? b.node.startDate?.year ?? 0;
      return yA - yB;
    });
  }

  const sortedRelations = Object.values(grouped).flat();
  const cache = { relations: sortedRelations, time: Date.now() };
  await storage.setItem(entryId + "-" + entryType, cache);
  return cache;
}

function renderRelations(container, relations) {
  container.innerHTML = "";

  relations.forEach((relation) => {
    const relationHTML = createRelationHTML(relation);
    container.appendChild(relationHTML);
  });

  container.classList.add("relationsTarget", "spaceit-shadow");
  container.style.padding = "12px 4px";

  const header = document.querySelector("h2");
  if (header && header.textContent.includes("Related Entries")) {
    header.textContent = "Relations";
  }

  setupHoverBehavior();
}

function ensureHoverPortal() {
  if (!document.getElementById("relation-hover-portal")) {
    const hoverPortal = create("div", { id: "relation-hover-portal" });
    document.body.appendChild(hoverPortal);
  }
}

function createRelationHTML(node) {
  const isManga = node.node.type === "MANGA";
  const typePath = isManga ? "manga" : "anime";
  const format = node.node.format === "NOVEL" ? "LIGHT NOVEL" : node.node.format?.replace("_", " ") ?? node.node.type;
  const cover = node.node.coverImage?.large ?? node.node.coverImage?.medium ?? "";
  const borderColor = isManga ? "#92d493" : "#afc7ee";
  const relationType = node.relationType.replace(/_/g, " ");
  const title = node.node.title?.romaji ?? "";
  const year = node.node.startDate?.year ?? node.node.seasonYear ?? "";
  const status = node.node.status?.replace(/_/g, " ") ?? "";

  const div = create("div", { class: "relationEntry" });

  div.innerHTML = `
    <a class='link' href='/${typePath}/${node.node.idMal}/'>
      <img class='relationImg lazyload' src='https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif' data-src='${cover}' alt='${title}' />
      <span class='relationTitle' style='border-color: ${borderColor}!important;'>${relationType}</span>
      <div class='relationDetails' style='color: ${borderColor}!important;'>
        ${relationType}<br>
        <div class='relationDetailsTitle'>${title}</div>
        ${format}${year ? ` · ${year}` : ""}${status ? ` · ${status}` : ""}
      </div>
    </a>`;

  return div;
}

async function setupHoverBehavior() {
  ensureHoverPortal();
  $(".relationEntry").off("mouseenter mouseleave");
  $(".relationEntry").on("mouseenter", async function () {
    const entry = this;
    const details = entry.querySelector(".relationDetails");
    if (!details) return;

    const portal = document.getElementById("relation-hover-portal");
    if (!portal) return;

    portal.innerHTML = "";
    const cloned = details.cloneNode(true);
    cloned.style.display = "block";
    portal.appendChild(cloned);
    positionHoverPortal(entry, portal);
  });

  function positionHoverPortal(entry, portal) {
    const rect = entry.getBoundingClientRect();
    const spacing = 10;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Make the portal temporarily visible
    portal.style.display = "block";
    portal.style.visibility = "hidden";
    portal.style.position = "absolute";
    portal.style.top = "0";
    portal.style.left = "0";
    const contentWidth = portal.firstElementChild?.offsetWidth || 300;
    portal.style.width = `${contentWidth}px`;

    // Double RequestanimationFrame to fit layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const portalWidth = portal.offsetWidth || 300;
        let left = rect.right + scrollX;
        let top = rect.top + scrollY;

        //If it does not fit to the right
        if (left + portalWidth + 10 > window.innerWidth + scrollX) {
          left = rect.left + scrollX - portalWidth;
          portal.firstElementChild?.classList.add("relationEntryRight");
          entry.classList.add("relationEntryRight");
        } else {
          portal.firstElementChild?.classList.remove("relationEntryRight");
          entry.classList.remove("relationEntryRight");
        }

        //Don't go out of the screen
        left = Math.max(spacing, left);
        top = Math.max(spacing, top);

        Object.assign(portal.style, {
          top: `${top}px`,
          left: `${left}px`,
          visibility: "visible",
          zIndex: 9999,
        });
      });
    });
  }

  $(".relationEntry").on("mouseleave", function () {
    $("#relation-hover-portal").hide().empty();
  });
}

function setupExpandCollapse(container) {
  if (container.clientHeight <= RELATION_HEIGHT_THRESHOLD) return;
  if (container.querySelector(".relationWrapper")) return;
  const wrapper = create("div", { class: "relationWrapper" });
  wrapper.setAttribute("style", `max-height: ${RELATION_HEIGHT_THRESHOLD}px; overflow: hidden; transition: max-height 0.4s ease; padding: 5px;`);

  //Move all content into wrapper
  while (container.firstChild) {
    wrapper.appendChild(container.firstChild);
  }
  container.appendChild(wrapper);
  const shouldShowExpand = wrapper.scrollHeight > getTotalHeight(wrapper);
  const expandBtn = create(
    "a",
    { class: "relations-accordion-button", ["expanded"]: "false", style: { display: shouldShowExpand ? "block" : "none" } },
    `<i class="fas fa-chevron-down mr4"></i> ${translate("$showMore")}`
  );
  expandBtn.addEventListener("click", () => {
    if (!wrapper.style.transition) {
      wrapper.style.transition = "max-height 0.4s ease";
    }
    const isExpanded = expandBtn.getAttribute("expanded") === "true";
    if (isExpanded) {
      wrapper.style.maxHeight = `${RELATION_HEIGHT_THRESHOLD}px`;
      expandBtn.innerHTML = `<i class="fas fa-chevron-down mr4"></i> ${translate("$showMore")}`;
      expandBtn.setAttribute("expanded", "false");
    } else {
      wrapper.style.maxHeight = `${wrapper.scrollHeight}px`;
      expandBtn.innerHTML = `<i class="fas fa-chevron-up mr4"></i> ${translate("$showLess")}`;
      expandBtn.setAttribute("expanded", "true");
    }
  });

  container.insertAdjacentElement("afterend", expandBtn);
}

function setupFiltering(container) {
  const relatedDiv = document.querySelector(".RelatedEntriesDiv");
  const floatHeader = relatedDiv.querySelector(".floatRightHeader");
  if (!floatHeader) return;

  const filterDiv = create("div", { class: "relations-filter" });
  const select = create("select", { id: "relationFilter" });
  function normalizeType(str) {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  const allOptions = Object.keys(relationPriority)
    .map((type) => {
      const label = normalizeType(type);

      return `<option value="${type}">${label}</option>`;
    })
    .join("");

  select.innerHTML = `<option value="">All</option>${allOptions}`;
  filterDiv.appendChild(select);
  floatHeader.appendChild(filterDiv);

  const titles = Array.from(container.querySelectorAll(".relationTitle")).map((el) => el.textContent);

  Array.from(select.options).forEach((option) => {
    if (option.value !== "" && !titles.some((title) => normalizeType(title) === normalizeType(option.value))) {
      option.remove();
    }
  });

  select.addEventListener("change", async () => {
    const selected = select.value;
    const entries = container.querySelectorAll(".relationEntry");

    entries.forEach((entry) => {
      const relationTitle = entry.querySelector(".relationTitle")?.textContent ?? "";
      const matches = selected === "" || relationTitle === selected.replace("_", " ");
      entry.style.display = matches ? "block" : "none";
    });

    const wrapper = container.querySelector(".relationWrapper");
    const expandBtn = document.querySelector(".relations-accordion-button");

    if (wrapper && expandBtn) {
      wrapper.style.maxHeight = `${RELATION_HEIGHT_THRESHOLD}px`;
      expandBtn.innerHTML = `<i class="fas fa-chevron-down mr4"></i> ${translate("$showMore")}`;
      expandBtn.setAttribute("expanded", "false");
      wrapper.style.transition = "";

      requestAnimationFrame(async () => {
        const shouldShowExpand = wrapper.scrollHeight > getTotalHeight(wrapper);
        expandBtn.style.display = shouldShowExpand ? "block" : "none";
      });
    }
  });
}
