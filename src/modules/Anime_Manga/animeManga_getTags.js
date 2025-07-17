async function getTags() {
  let tagData;
  const tagDiv = create("div", { class: "aniTagDiv" }, `<h2 style="margin-bottom: 8px;">${translate("$listTags")}</h2>`);
  const tagTarget = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
  const tagLocalForage = localforage.createInstance({ name: "MalJS", storeName: "tags" });
  const tagcacheTTL = svar.tagTTL;
  let tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
  let tagReCheck = create("i", { class: "fa-solid fa-rotate-right", style: { marginLeft: "4px", fontSize: "smaller" }, title: translate("$refreshTags") });
  tagReCheck.onclick = () => {
    tagLocalForage.removeItem(entryId + "-" + entryType);
    window.location.reload();
  };
  if (!tagCache || tagCache.time + tagcacheTTL < Date.now()) {
    tagData = await aniAPIRequest();
    if (tagData?.data.Media?.tags?.length > 0) {
      await tagLocalForage.setItem(entryId + "-" + entryType, {
        tags: tagData.data.Media.tags,
        time: Date.now(),
      });
      tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
    }
  }

  if (tagCache && tagTarget) {
    if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className === "clearfix mauto mt16") {
      tagTarget.lastChild.lastElementChild.remove();
    }
    if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className !== "pb16") {
      tagDiv.style.paddingTop = "16px";
    }

    // Categorized View
    if (svar.categorizeTags) {
      const groupedTags = new Map();
      tagCache.tags.forEach((tag) => {
        const category = tag.category?.trim() || "UNCATEGORIZED";
        if (!groupedTags.has(category)) groupedTags.set(category, []);
        groupedTags.get(category).push(tag);
      });

      const sortedCategories = Array.from(groupedTags.keys()).sort();

      sortedCategories.forEach((category, index) => {
        const tags = groupedTags.get(category);
        const onlySpoilers = tags.every((tag) => tag.isMediaSpoiler);
        const groupClass = onlySpoilers ? "category-group spoiler-group" : "category-group";
        const groupStyle = index === 0 ? 'style="margin-top: -10px;"' : "";
        const categoryKey = category === "UNCATEGORIZED" ? "uncategorized-group" : "";
        let groupHTML = `<div class="${groupClass} ${categoryKey}" ${groupStyle} >`;

        groupHTML += `<h4 class="aniTag-category" ${category === "UNCATEGORIZED" ? 'style="display:none"' : ""}>${category}</h4>`;

        groupHTML += tags
          .map(
            (tag) => `
          <div class="${tag.isMediaSpoiler ? "aniTag spoiler" : "aniTag"}" style="${tag.isMediaSpoiler && !onlySpoilers ? "display:none;" : ""}" data-tooltip="${tag.description || ""}">
            <a><div class="aniTag-name">${tag.name.replace(/'/g, " ")}</div></a>
            <div class="aniTag-percent">(${tag.rank}%)</div>
          </div>
          `
          )
          .join("");

        groupHTML += `</div>`;
        tagDiv.innerHTML += groupHTML;
      });
    }

    // Plain List (Without Category)
    else {
      tagDiv.innerHTML += tagCache.tags
        .map(
          (tag) => `
        <div class="${tag.isMediaSpoiler ? "aniTag spoiler" : "aniTag"}" style="${tag.isMediaSpoiler ? "display:none;" : ""}" data-tooltip="${tag.description || ""}">
          <a>
            <div class="aniTag-name">${tag.name.replace(/'/g, " ")}</div>
          </a>
          <div class="aniTag-percent">(${tag.rank}%)</div>
        </div>
      `
        )
        .join("");
    }

    tagTarget.append(tagDiv);
    tagDiv.querySelector("h2")?.append(tagReCheck);

    // Show/hide spoiler
    if ($(".aniTagDiv .spoiler").length) {
      const showSpoilers = create("div", { class: "showSpoilers" }, translate("$showSpoilerTags", $(".aniTagDiv .spoiler").length));

      showSpoilers.onclick = () => {
        let isVisible;

        if (svar.categorizeTags) {
          const spoilerGroups = $(".aniTagDiv .spoiler-group");
          const hiddenSpoilerTags = $(".aniTagDiv .category-group .spoiler");

          isVisible =
            hiddenSpoilerTags.filter(function () {
              return $(this).css("display") !== "none";
            }).length > 0;

          if (isVisible) {
            spoilerGroups.css("display", "none");
            hiddenSpoilerTags.css("display", "none");
            $(showSpoilers).text(translate("$showSpoilerTags", $(".aniTagDiv .spoiler").length));
          } else {
            spoilerGroups.css("display", "block");
            hiddenSpoilerTags.css("display", "flex");
            $(showSpoilers).text(translate("$hideSpoilerTags", $(".aniTagDiv .spoiler").length));
          }
        } else {
          const flatSpoilers = $(".aniTagDiv > .spoiler");
          isVisible = flatSpoilers.first().css("display") !== "none";

          if (isVisible) {
            flatSpoilers.css("display", "none");
            $(showSpoilers).text(translate("$showSpoilerTags", $(".aniTagDiv .spoiler").length));
          } else {
            flatSpoilers.css("display", "flex");
            $(showSpoilers).text(translate("$hideSpoilerTags", $(".aniTagDiv .spoiler").length));
          }
        }
      };

      tagDiv.append(showSpoilers);
    }
  } else {
    tagDiv.innerHTML = "";
  }
}
