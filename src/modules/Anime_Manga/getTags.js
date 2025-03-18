async function getTags() {
  let tagData;
  const tagDiv = create("div", { class: "aniTagDiv" });
  const tagTarget = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
  const tagLocalForage = localforage.createInstance({ name: "MalJS", storeName: "tags" });
  const tagcacheTTL = svar.tagTTL;
  let tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
  if (!tagCache || tagCache.time + tagcacheTTL < Date.now()) {
    tagData = await aniAPIRequest();
    if (tagData?.data.Media && tagData.data.Media.tags && tagData.data.Media.tags.length > 0) {
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
    tagDiv.innerHTML = '<h2 style="margin-bottom:-2px;">Tags</h2>';
    tagDiv.innerHTML += tagCache.tags
      .map(
        (node) => `
      <div class="${node.isMediaSpoiler === true ? "aniTag spoiler" : "aniTag"}"><a title="${node.description ? node.description : ""}"><div class="aniTag-name">${node.name.replace(
          /'/g,
          " "
        )}</div></a>
      <div class="aniTag-percent">(${node.rank}%)</div></div>`
      )
      .join("");
    tagTarget.append(tagDiv);
    if ($(".aniTagDiv .spoiler").length) {
      let showSpoilers = create("div", { class: "showSpoilers" }, "Show " + $(".aniTagDiv .spoiler").length.toString() + " spoiler tags");
      showSpoilers.onclick = () => {
        if ($(".aniTagDiv .spoiler").css("display") !== "none") {
          $(".aniTagDiv .spoiler").css("display", "none");
          $(showSpoilers).text("Show " + $(".aniTagDiv .spoiler").length.toString() + " spoiler tags");
        } else {
          $(".aniTagDiv .spoiler").css("display", "flex");
          $(showSpoilers).text("Hide spoiler tags");
        }
      };
      tagDiv.append(showSpoilers);
    }
  }
}
