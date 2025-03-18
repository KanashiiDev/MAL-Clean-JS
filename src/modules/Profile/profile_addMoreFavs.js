// Add More Favorites
async function addMoreFavs(storeType, valid = 0) {
  const moreFavsLocalForage = localforage.createInstance({ name: "MalJS", storeName: "moreFavs_" + storeType });
  let moreFavsCache = await moreFavsLocalForage.getItem(entryId + "-" + entryType);
  const favButton = document.querySelector("#favOutput");
  const isFavorite = moreFavsCache !== null;
  if (isFavorite) {
    $("#favOutput").text("Remove from Favorites");
  }

  const defaultImg = document.querySelector("div:nth-child(1) > a > img");
  const characterTitle = $(".title-name")
    .text()
    .replace(/\(.*\)/, "")
    .replace(/\".*\"/, "")
    .trim()
    .replace(/"[^"]*"\s*/, "")
    .split(/\s+/);
  const formattedCharacterTitle = [characterTitle.reverse().join(", "), characterTitle.reverse().join(" ")];

  //Wait for the Fav Status
  async function waitForFavoriteDiv(interval = 250) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if ($("#v-favorite > div").length) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, interval);
    });
  }

  // Update Fav Text
  async function updateFavUI(isFavorite) {
    await delay(500);
    $("#favOutput").text(isFavorite ? "Remove from Favorites" : "Add to Favorites");
    const intervalId = setInterval(() => {
      const favDiv = $("#v-favorite > div");
      if (favDiv.text().trim().startsWith("Only") || !favDiv.length || !favDiv.text().trim().includes("Mal-Clean:")) {
        if (favDiv.length) {
          favDiv.text(isFavorite ? "Mal-Clean: Added Successfully" : "Mal-Clean: Removed Successfully");
        }
      } else {
        clearInterval(intervalId);
      }
    }, 250);
  }

  favButton.addEventListener("click", async () => {
    await waitForFavoriteDiv();
    const isCurrentlyFavorite = $("#favOutput").text().trim() === "Add to Favorites";
    const maxFavCheck = $("#v-favorite > div").text().trim().startsWith("Only");
    if (maxFavCheck) {
      if (isCurrentlyFavorite) {
        // add
        await moreFavsLocalForage.setItem(entryId + "-" + entryType, {
          key: entryId + "-" + entryType,
          title: storeType === "character" ? formattedCharacterTitle : entryTitle,
          type: storeType === "character" ? "CHARACTERS" : entryType,
          source: storeType === "character" ? $("#content > table > tbody > tr > td.borderClass > table").find("a").eq(1).text() : entryTitle,
          url: location.pathname,
          defaultImage: moreFavsCache?.defaultImage || defaultImg?.src?.replace(/\.\w+$/, "").replace("https://cdn.myanimelist.net/images/", "") || "",
          defaultImageSrc: moreFavsCache?.defaultImageSrc || defaultImg?.src,
        });
        updateFavUI(true);
      } else {
        // remove
        await moreFavsLocalForage.removeItem(entryId + "-" + entryType);
        updateFavUI(false);
      }
      if (svar.moreFavsMode) {
        const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character");
        await editAboutPopup(`moreFavs/${moreFavsDB}`, "moreFavs", 1);
      }
    }
  });
}

// Load More Favorites
async function loadMoreFavs(force = "0", storeType = "character", aboutData = null) {
  function processFavItem(value, storeType) {
    const titleText = storeType === "character" ? value.title[0] : value.title;
    const container = create("li", { class: "btn-fav", title: titleText });
    const link = create("a", { class: "link bg-center", href: value.url });
    const title = create("span", { class: "title fs10" }, value.title[0]);
    let type = create("span", { class: "users" }, value.source);
    let typeText = value.type?.toLowerCase();
    typeText = typeText === "characters" ? "character" : typeText;
    const img = create("img", { class: "image lazyloaded", src: value.defaultImageSrc, width: "70", height: "110", border: "0", alt: value.title[0] });
    link.append(title, type, img);
    container.append(link);
    let parent = $(`#${typeText}_favorites .fav-slide`).length ? $(`#${typeText}_favorites .fav-slide`) : $(`.favs.${typeText}`);
    if (parent) parent.append(container);
  }
  function processFavs(dataArray, storeType) {
    dataArray.forEach((value) => processFavItem(value, storeType));
  }
  if (!loadingMoreFavorites || force !== "0") {
    let moreFavsLocalForage = await localforage.createInstance({ name: "MalJS", storeName: "moreFavs_" + storeType });
    if (Array.isArray(aboutData)) {
      processFavs(aboutData, storeType);
    } else {
      moreFavsLocalForage.iterate((value, key) => {
        processFavItem(value, storeType);
      });
    }
    loadingMoreFavorites = 1;
  }
}
