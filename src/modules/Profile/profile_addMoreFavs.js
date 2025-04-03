// Add More Favorites
async function addMoreFavs(storeType) {
  try {
    const moreFavsLocalForage = localforage.createInstance({
      name: "MalJS",
      storeName: "moreFavs_" + storeType,
    });

    const dataKey = pageIsCompany ? `${location.pathname.split("/")[3]}-${location.pathname.split("/")[2].toUpperCase()}` : `${entryId}-${entryType}`;
    const dataType = pageIsCompany ? "COMPANY" : entryType;
    const dataInfoType = document.querySelector("span.information.type")?.textContent || "";
    const dataInfoYear = document.querySelector("span.information.season")?.textContent.split(" ")[1] || "";

    let moreFavsCache = await moreFavsLocalForage.getItem(dataKey);
    const favButton = document.querySelector("#favOutput");

    if (!favButton) {
      throw new Error("Favorite button not found");
    }

    // Change Favorite Text
    const isFavoriteData = $("#v-favorite").attr("data-favorite")?.includes('isFavorite":true,');
    if (!isFavoriteData) {
      const isFavorite = moreFavsCache !== null;
      if (isFavorite) $("#favOutput").text("Remove from Favorites");
    }
    // Get default image
    const defaultImg = pageIsCompany ? document.querySelector(".logo img") : document.querySelector("div:nth-child(1) > a > img");

    // Format character title
    const characterTitle = $(".title-name")
      .text()
      .replace(/\(.*\)/, "")
      .replace(/\".*\"/, "")
      .trim()
      .replace(/"[^"]*"\s*/, "")
      .split(/\s+/);

    const formattedCharacterTitle = [characterTitle.reverse().join(", "), characterTitle.reverse().join(" ")];

    // Wait for Favorite Data
    async function waitForFavoriteDiv(selector, interval = 250, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
          const element = $(selector);
          if (element.length && element.is(":visible")) {
            clearInterval(checkInterval);
            resolve(element);
          } else if (Date.now() - startTime > timeout) {
            clearInterval(checkInterval);
            reject(new Error(`Timeout waiting for ${selector}`));
          }
        }, interval);
      });
    }

    // Update Fav Text
    async function updateFavText(isFavorite, maxAttempts = 10) {
      try {
        const favDiv = await waitForFavoriteDiv("#v-favorite > div");
        $("#favOutput").text(isFavorite ? "Remove from Favorites" : "Add to Favorites");
        let attempts = 0;
        const updateMessage = () => {
          attempts++;
          const currentText = favDiv.text().trim();
          if (currentText.startsWith("Only") || !currentText.includes("Mal-Clean:")) {
            favDiv.text(`Mal-Clean: ${isFavorite ? "Added Successfully" : "Removed Successfully"}`);
            return true;
          }
          return false;
        };

        // Try immediately
        if (updateMessage()) return;

        // Retry with interval if needed
        return new Promise((resolve) => {
          const intervalId = setInterval(() => {
            if (updateMessage() || attempts >= maxAttempts) {
              clearInterval(intervalId);
              resolve();
            }
          }, 250);
        });
      } catch (error) {
        console.error("Error updating favorite UI:", error);
      }
    }

    favButton.addEventListener("click", async () => {
      try {
        $("#v-favorite").css("pointerEvents", "none");
        await waitForFavoriteDiv("#v-favorite > div");
        const isCurrentlyFavorite = $("#favOutput").text().trim() === "Add to Favorites";
        const favDivText = $("#v-favorite > div").text().trim();
        const maxFavCheck = favDivText.startsWith("Only");
        if (maxFavCheck) {
          if (isCurrentlyFavorite) {
            // Add to favorites
            const favData = {
              key: dataKey,
              title: storeType === "character" ? formattedCharacterTitle : entryTitle,
              type: storeType === "character" ? "CHARACTERS" : dataType,
              dataType: dataInfoType,
              dataYear: dataInfoYear,
              source: storeType === "character" ? $("#content > table > tbody > tr > td.borderClass > table").find("a").eq(1).text() : entryTitle,
              url: location.pathname,
              defaultImage: moreFavsCache?.defaultImage || defaultImg?.src?.replace(/\.\w+$/, "").replace("https://cdn.myanimelist.net/images/", "") || "",
              defaultImageSrc: moreFavsCache?.defaultImageSrc || defaultImg?.src,
            };
            await moreFavsLocalForage.setItem(dataKey, favData);
            await updateFavText(true);
          } else {
            // Remove from favorites
            await moreFavsLocalForage.removeItem(dataKey);
            await updateFavText(false);
          }

          if (svar.moreFavsMode) {
            const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character", "moreFavs_people", "moreFavs_company");
            await editAboutPopup(`moreFavs/${moreFavsDB}`, "moreFavs", 1);
          }
        }
        $("#v-favorite").css("pointerEvents", "");
      } catch (error) {
        console.error("Error in favorite button click handler:", error);
      }
    });
  } catch (error) {
    console.error("Error in addMoreFavs:", error);
  }
}

// Load More Favorites
async function loadMoreFavs(force = "0", storeType = "character", aboutData = null) {
  function processFavItem(value, storeType) {
    const titleText = storeType === "character" ? value.title[0] : value.title;
    const container = create("li", { class: "btn-fav", title: titleText });
    const link = create("a", { class: "link bg-center", href: value.url });
    const title = create("span", { class: "title fs10" }, titleText);
    let typeText = value.type?.toLowerCase();
    typeText = typeText === "characters" ? "character" : typeText;
    const dataInfo = value.dataType && value.dataYear ? value.dataType + " ･ " + value.dataYear : value.type.charAt(0).toUpperCase() + value.type.slice(1).toLowerCase();
    const boxlistDetails = typeText === "character" ? value.source : dataInfo;
    const boxListText = boxlistDetails !== "People" && boxlistDetails !== "Company" ? boxlistDetails : "";
    let type = create("span", { class: "users" }, boxListText);
    if (isMainProfilePage) typeText = typeText === "people" ? "person" : typeText;
    const img = create("img", { class: "image lazyloaded", src: value.defaultImageSrc, width: "70", height: typeText === "company" ? "70" : "110", border: "0", alt: value.title[0] });
    boxListText ? link.append(title, type, img) : link.append(title, img);
    container.append(link);
    let parent = $(`#${typeText}_favorites .fav-slide`).length ? $(`#${typeText}_favorites .fav-slide`) : $(`.favs.${typeText}`);
    if (parent) parent.append(container);
    if (location.pathname === `/profile/${username}/favorites`) {
      const boxlist = `<div class="boxlist col-4">
      <div class="di-tc">
      <a href="${value.url}"><img class="image profile-w48 lazyloaded" src="${value.defaultImageSrc}" alt="${titleText}"></a>
      </div>
      <div class="di-tc va-t pl8 data">
      <div class="title"><a href="${value.url}">${titleText}</a></div>
      <div class="di-ib mt4 fn-grey2">${boxListText}</div>
      </div>
      </div>`;
      $(".container-right > div h5").each(function () {
        if ($(this).text().toLowerCase() === typeText) {
          $(this).next().append(boxlist);
        }
      });
    }
  }
  function processFavs(dataArray, storeType) {
    dataArray.forEach((value) => processFavItem(value, storeType));
  }
  if (!loadingMoreFavorites || force !== "0") {
    let moreFavsLocalForage = await localforage.createInstance({ name: "MalJS", storeName: "moreFavs_" + storeType });
    if (Array.isArray(aboutData)) {
      processFavs(aboutData, storeType);
    } else {
      await moreFavsLocalForage.iterate((value) => {
        processFavItem(value, storeType);
      });
    }
    loadingMoreFavorites = 1;
  }
}

//Default Favs Slider Fix
if (pageIsProfile) {
  $(".fav-slide-block.mb12").each(function () {
    let text = $(this).prev().text();
    let count = $(this).find("ul").children().length;
    $(this)
      .prev()
      .text(text.replace(/\((.*)\)/, `(${count})`));
  });
  // favorites slider
  const hasTouchEvent = "ontouchstart" in window;
  const favSlider = function (selectorName) {
    const $favSlideBlock = $(`#${selectorName}.fav-slide-block`);
    if (!$favSlideBlock.length) return;

    let nowCount = 0;
    const sliderWidth = 800;
    const btnWidth = 40;
    const moveSlideNum = $favSlideBlock.find(".fav-slide").data("slide") || 4;
    const favW = $favSlideBlock.find(".fav-slide li.btn-fav").eq(0).outerWidth();
    const favCount = $favSlideBlock.find(".fav-slide li.btn-fav").length;
    const favWidth = favW + 8;
    const setSlideWidth = favWidth * (favCount + moveSlideNum);
    $favSlideBlock.find(".fav-slide").width(setSlideWidth);

    //button
    const $sliderBtnLeft = $favSlideBlock.find(".btn-fav-slide-side.left");
    const $sliderBtnRight = $favSlideBlock.find(".btn-fav-slide-side.right");
    $sliderBtnRight.css({ display: "block" });

    // hide button
    if (favCount < moveSlideNum + 1) {
      $sliderBtnLeft.hide();
      $sliderBtnRight.hide();
    } else if (!hasTouchEvent) {
      const hideBtnTimer = setInterval(function () {
        $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
        clearInterval(hideBtnTimer);
      }, 1500);
    }
    $sliderBtnLeft.hide();
    // slide function
    const moveSlideFav = function (obj) {
      const direction = obj.direction;
      const $btnInner = obj.button;
      $btnInner.hide();

      if (direction == "right") {
        // slide limit
        const maxCount = favCount - parseInt(sliderWidth / favWidth);
        if (nowCount + moveSlideNum >= maxCount) {
          nowCount = maxCount;
          $sliderBtnRight.hide();
        } else {
          nowCount += moveSlideNum;
        }

        $favSlideBlock.find(".fav-slide").animate(
          {
            marginLeft: `${-1 * favWidth * nowCount}px`,
          },
          {
            duration: 500,
            easing: "swing",
            complete: function () {
              $btnInner.show();
              $sliderBtnLeft.show();
              if (nowCount != maxCount) {
                $sliderBtnRight.show();
              }
            },
          }
        );
      } else {
        // slide limit
        if (nowCount - moveSlideNum <= 0) {
          nowCount = 0;
          $sliderBtnLeft.hide();
        } else {
          nowCount -= moveSlideNum;
        }

        $favSlideBlock.find(".fav-slide").animate(
          {
            marginLeft: `${-1 * favWidth * nowCount}px`,
          },
          {
            duration: 500,
            easing: "swing",
            complete: function () {
              $btnInner.show();
              $sliderBtnRight.show();
              if (nowCount != 0) {
                $sliderBtnLeft.show();
              }
            },
          }
        );
      }
    };
    //click
    $sliderBtnLeft.find(".btn-inner").on("click", function (e) {
      const btn = {
        direction: "left",
        button: $(this),
      };
      moveSlideFav(btn);
    });
    $sliderBtnRight.find(".btn-inner").on("click", function (e) {
      const btn = {
        direction: "right",
        button: $(this),
      };
      moveSlideFav(btn);
    });

    // hover
    if (!hasTouchEvent) {
      $favSlideBlock
        .find(".fav-slide-outer")
        .on("mouseover", function () {
          $sliderBtnLeft.css({ left: 0, opacity: 1 });
          $sliderBtnRight.css({ right: 0, opacity: 1 });
        })
        .on("mouseout", function () {
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
        });

      $sliderBtnLeft
        .on("mouseover", function () {
          $sliderBtnLeft.css({ left: 0, opacity: 1 });
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
        })
        .on("mouseout", function () {
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        });

      $sliderBtnRight
        .on("mouseover", function () {
          $sliderBtnRight.css({ right: 0, opacity: 1 });
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        })
        .on("mouseout", function () {
          $sliderBtnRight.css({ right: -1 * btnWidth, opacity: 0 });
          $sliderBtnLeft.css({ left: -1 * btnWidth, opacity: 0 });
        });
    }
  };

  // set favorites slider
  if ($(".fav-slide-block")[0]) {
    const slideCount = $(".fav-slide-block").length;
    for (let i = 0; i < slideCount; i++) {
      const id = $(".fav-slide-block").eq(i).attr("id");
      favSlider(id);
    }
  }
}
