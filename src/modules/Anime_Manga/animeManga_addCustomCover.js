//Custom Anime/Manga Cover
async function loadCustomCover(force = "0", storeType = "cover") {
  if (!loadingCustomCover || force !== "0") {
    const coverLocalForage = await localforage.createInstance({ name: "MalJS", storeName: storeType });
    coverLocalForage.iterate((value, key) => {
      if (value.defaultImage && value.coverImage) {
        $("img").each(function () {
          const $img = $(this);
          if ($img.parent().attr("class") !== "js-picture-gallery") {
            const dataSrc = $img.attr("data-src") || "";
            const imgSrc = $img.attr("src") || "";
            const imgAlt = $img.attr("alt")?.toUpperCase() || "";
            const imgSrcSet = $img.attr("srcset")?.toUpperCase() || "";
            const dbTitle = value.title;
            const dbDefaultImage = value.defaultImage;
            const dbTitleMatch = storeType === "character" ? dbTitle.some((el) => imgAlt.includes(el.toUpperCase())) : imgAlt.includes(dbTitle.toUpperCase());
            if ((imgSrc && imgSrc.includes(dbDefaultImage)) || (dataSrc && dataSrc.includes(dbDefaultImage))) {
              if (imgAlt && dbTitleMatch) {
                if (value.type && (imgSrc.toUpperCase().includes(`/${value.type}/`) || dataSrc.toUpperCase().includes(`/${value.type}/`))) {
                  $img.addClass("customCover").attr("customCover", "1").attr("src", value.coverImage).attr("data-src", value.coverImage).removeAttr("srcset").removeAttr("data-srcset");

                  if (value.fit && value.fit !== "initial") {
                    $img.css("object-fit", value.fit);
                  }
                  if (value.position && value.position !== "50% 50%") {
                    $img.css("object-position", value.position);
                  }
                }
              }
            }
          }
        });
      }
    });
    loadingCustomCover = 1;
  }
}
// Add Custom Cover
async function getCustomCover(storeType) {
  if (location.pathname.endsWith("/pics")) {
    const coverLocalForage = localforage.createInstance({ name: "MalJS", storeName: storeType });
    let coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
    const picTable = document.querySelector("#content > table > tbody > tr > td:nth-child(2) table[cellspacing='10']");
    const mainButton = create("a", { active: "0", class: "add-custom-pic-button", style: { cursor: "pointer" } }, "Change Cover");
    const defaultImg = document.querySelector("div:nth-child(1) > a > img");
    const characterTitle = $(".title-name")
      .text()
      .replace(/\(.*\)/, "")
      .replace(/\".*\"/, "")
      .trim()
      .replace(/"[^"]*"\s*/, "")
      .split(/\s+/);
    const formattedCharacterTitle = [characterTitle.reverse().join(", "), characterTitle.reverse().join(" ")];
    $(".floatRightHeader").append(" - ", mainButton);
    mainButton.addEventListener("click", async () => {
      const active = $(mainButton).attr("active");
      if (active == "0") {
        if (!document.querySelector("#customCoverPreview")) {
          mainButton.innerText = "Change Cover [X]";
          coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
          let customCoverDiv = create("div", { class: "customCoverDiv" });
          let customCoverInput = create("input", { id: "customCoverInput", style: { margin: "5px" }, placeholder: "Custom Cover URL" });
          let customCoverFit = AdvancedCreate("select", "maljsNativeInput", false, customCoverDiv);
          let addOption = function (value, text) {
            let newOption = AdvancedCreate("option", false, text, customCoverFit);
            newOption.value = value;
          };
          addOption("initial", "default");
          addOption("cover", "cover");
          addOption("contain", "contain");
          addOption("scale-down", "scale-down");
          addOption("none", "none");

          const coverPreview = `<td width="225" align="center" style="min-width:320px;">
          <div class="picSurround" id="customCoverPreview"><a class="js-picture-gallery" rel="gallery-anime"><div>
          <img class="lazyloaded" src="${defaultImg.src}" style="max-width:225px;"><p>Custom Cover</p></div><div>
          <img class="lazyloaded" src="${defaultImg.src}" style="width: 70px;height: 110px;object-fit: initial;"><p>70x110</p><br>
          <img class="lazyloaded" src="${defaultImg.src}" style="width: 50px;height: 70px;object-fit: initial;"><p>50x70</p></div></a></div></td>
          <td width="225" align="center">
          <div class="picSurround"><a class="js-picture-gallery" rel="gallery-anime">
          <img id="defaultCoverImage" class="lazyloaded" src="${coverCache?.defaultImageSrc ? coverCache?.defaultImageSrc : defaultImg.src}" style="max-width:225px;">
          </a><div style="text-align: center;" class="spaceit"><a>Default Cover</a></div></div></td>`;
          const coverPreviewParent = create("tr", { id: "customCoverPreviewTable" }, coverPreview);
          picTable.insertBefore(coverPreviewParent, picTable.firstChild);

          const imgPosSlider = `<div class="cover-position-slider-container" style="display:none">
          <label for="xSlider">X:</label><input type="range" class ="coverSlider" id="coverXSlider" min="0" max="100" value="50"style="width: 115px;padding:6px!important;margin-right: 5px;">
          <label for="ySlider">Y:</label><input type="range" class ="coverSlider" id="coverYSlider" min="0" max="100" value="50"style="width: 115px;padding:6px!important;"></div>`;

          customCoverDiv.append(customCoverInput, customCoverFit);
          $("#customCoverPreview").append(customCoverDiv, imgPosSlider);
          picTable.style.width = "100%";
          $(picTable).find("td").css("min-width", "310px");

          //Update Cover Positions
          const xSlider = document.getElementById("coverXSlider");
          const ySlider = document.getElementById("coverYSlider");
          function updateCoverPositions() {
            const x = xSlider.value + "%";
            const y = ySlider.value + "%";
            $("#customCoverPreview img").css("object-position", `${x} ${y}`);
          }
          xSlider.addEventListener("input", updateCoverPositions);
          ySlider.addEventListener("input", updateCoverPositions);
          customCoverFit.addEventListener("change", function (e) {
            $("#customCoverPreview img").css("object-fit", customCoverFit.value);
            if (customCoverFit.value !== "initial") {
              $("#customCoverPreview .cover-position-slider-container").css("display", "grid");
              $("#customCoverPreview .coverSlider").val("50");
            } else {
              $("#customCoverPreview .cover-position-slider-container").css("display", "none");
            }
          });
          customCoverInput.addEventListener("change", function (e) {
            $("#customCoverPreview img").attr("src", customCoverInput.value);
          });
        }
        const tdElements = picTable.querySelectorAll("td");
        tdElements.forEach((td) => {
          if (td.querySelector(".custom-cover-select-btn")) return;
          if (td.querySelector("img")) {
            const selectButton = create("a", { class: "custom-cover-select-btn mal-btn primary" }, "Select");
            selectButton.addEventListener("click", async () => {
              const img = td.querySelector("img");
              if (img && img.height > 10) {
                if (coverCache?.defaultImage && img.src.includes(coverCache.defaultImage)) {
                  await coverLocalForage.removeItem(entryId + "-" + entryType);
                  $("div:nth-child(1) > a > img").first().attr("src", img.src);
                  $("#defaultCoverImage").attr("src", img.src);
                } else {
                  await coverLocalForage.setItem(entryId + "-" + entryType, {
                    key: entryId + "-" + entryType,
                    title: storeType == "cover" ? entryTitle : formattedCharacterTitle,
                    type: storeType == "character" ? "CHARACTERS" : entryType,
                    fit: img.style.objectFit ? img.style.objectFit : "initial",
                    position: img.style.objectPosition ? img.style.objectPosition : "50% 50%",
                    defaultImage: coverCache?.defaultImage ? coverCache.defaultImage : defaultImg?.src?.replace(/\.\w+$/, "").replace("https://cdn.myanimelist.net/images/", "") || "",
                    defaultImageSrc: coverCache?.defaultImageSrc ? coverCache.defaultImageSrc : defaultImg?.src,
                    coverImage: img.src,
                  });
                }
                mainButton.innerText = "Change Cover";
                if (storeType === "cover") {
                  await loadCustomCover(1);
                } else if (storeType === "character") {
                  await loadCustomCover(1, "character");
                }
                $(".custom-cover-select-btn").remove();
                $("#customCoverPreviewTable").remove();
                $(mainButton).attr("active", "0");
              }
            });
            td.appendChild(selectButton);
          }
        });
        $(mainButton).attr("active", "1");
      } else {
        mainButton.innerText = "Change Cover";
        $(".custom-cover-select-btn").remove();
        $("#customCoverPreviewTable").remove();
        $(mainButton).attr("active", "0");
      }
    });
  }
}
