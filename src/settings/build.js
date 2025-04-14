//MalClean Settings - Create Settings Div
async function createDiv() {
  const buttons = getButtonsConfig().reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  function buildUserModules(container) {
    const categorized = {};
    const existingContainers = {};

    container.querySelectorAll(".malCleanSettingContainer").forEach((div) => {
      const title = div.querySelector("h2")?.textContent;
      if (title) {
        existingContainers[title] = div;
      }
    });

    userModules.forEach((mod) => {
      if (!mod.id || !buttons[mod.id + "Btn"]) {
        console.warn(`Missing Button ID: ${mod.id}`);
        return;
      }

      if (!categorized[mod.category]) {
        categorized[mod.category] = [];
      }

      categorized[mod.category].push({
        b: buttons[mod.id + "Btn"],
        t: mod.description,
        s: mod.extraElement,
      });
    });

    Object.entries(categorized).forEach(([category, btnList]) => {
      if (existingContainers[category]) {
        const existingContainer = existingContainers[category];
        const newContent = createListDiv(category, btnList).querySelector(".mainListBtnsDiv");
        existingContainer.append(newContent);
      } else {
        container.append(createListDiv(category, btnList));
      }
    });
  }

  const modernBtn = "<a style=\"cursor: pointer;\" onclick=\"document.getElementById('modernLayoutBtn').scrollIntoView({ behavior: 'smooth', block: 'start' });\">Modern Profile Layout</a>";
  const listNav = ` <div class="malCleanMainHeaderNav"><button>My Panel</button><button>Anime Manga</button><button>Character</button>
  <button>People</button><button>Blog</button><button>Club</button><button>Forum</button><button>Profile</button></div>`;
  let mainInner = create("div", { class: "malCleanMainContainer" }, '<div class="malCleanMainHeader"><div class="malCleanMainHeaderTitle"><b>' + stLink.innerText + "</b></div>" + listNav + "</div>");
  let listDiv = create("div", { class: "malCleanMainContainerList" });
  mainInner.append(listDiv);
  let customfgDiv = createCustomSettingDiv(
    translate("$customForegroundTitle", modernBtn),
    translate("$customForegroundDesc"),
    null,
    [fgColorSelector, updateFgButton, removeFgButton],
    ["65% 25% 10%"],
    null,
    svar.modernLayout,
    "profile"
  );

  let custombgDiv = createCustomSettingDiv(
    translate("$customBannerTitle", modernBtn),
    translate("$customBannerDesc"),
    null,
    [bgInput, bgButton, bgRemoveButton],
    ["65% 25% 10%"],
    [bgInfo],
    svar.modernLayout,
    "profile"
  );

  let custompfDiv = createCustomSettingDiv(translate("$custompfTitle"), translate("$custompfDesc"), null, [pfInput, pfButton, pfRemoveButton], ["65% 25% 10%"], [pfInfo], 1, "profile");

  let custombadgeDiv = createCustomSettingDiv(
    translate("$custombadgeTitle", modernBtn),
    translate("$custombadgeDesc"),
    null,
    [badgeInput, badgeColorSelector, badgeColorLoop, badgeButton],
    ["50% 15% auto auto"],
    null,
    svar.modernLayout,
    "profile"
  );

  let malBadgesDiv = createCustomSettingDiv(
    translate("$malBadgesTitle"),
    translate("$malBadgesDesc"),
    null,
    [malBadgesInput, malBadgesButton, malBadgesRemoveButton],
    ["65% 25% 10%"],
    [malBadgesDetailButton, malBadgesDetailButtonText, malBadgesInfo],
    1,
    "profile"
  );

  let customCSSDiv = createCustomSettingDiv(
    translate("$customCSSTitle"),
    translate("$customCSSDesc"),
    null,
    [cssInput, cssButton, cssRemoveButton],
    ["65% 25% 10%"],
    [cssmodernLayout, cssmodernLayoutText, cssInfo],
    1,
    "profile"
  );

  let customColorsDiv = createCustomSettingDiv(
    translate("$customColorsTitle"),
    translate("$customColorsDesc"),
    [customColors],
    [customColorButton, customColorRemoveButton],
    ["90% 10%"],
    null,
    1,
    "profile"
  );

  let privateProfileDiv = createCustomSettingDiv(translate("$privateProfileTitle"), translate("$privateProfileDesc"), null, [privateButton, removePrivateButton], ["50% 50%"], null, 1, "profile");
  let hideProfileElDiv = createCustomSettingDiv(
    translate("$hideProfileElTitle"),
    translate("$hideProfileElDesc"),
    null,
    [hideProfileElButton, hideProfileElUpdateButton, removehideProfileElButton],
    ["65% 25% 10%"],
    null,
    1,
    "profile"
  );

  let customProfileElDiv = createCustomSettingDiv(
    translate("$customProfileElTitle"),
    translate("$customProfileElDesc"),
    null,
    [customProfileElUpdateButton, customProfileElRightUpdateButton],
    [svar.modernLayout ? "50% 50%" : "100%"],
    null,
    1,
    "profile"
  );

  mainInner.querySelector(".malCleanMainHeaderTitle").append(innerSettingsButton, reloadButton, closeButton);
  listDiv.append(
    createListDiv("My Panel", [
      { b: buttons["animeInfoBtn"], t: translate("$animeInfoSetting") },
      { b: buttons["currentlyWatchingBtn"], t: translate("$showCurrentlyWatchingAnime") },
      { b: buttons["currentlyReadingBtn"], t: translate("$showCurrentlyReadingManga") },
      { b: buttons["airingDateBtn"], t: translate("$addEpisodeCountdown") },
      { b: buttons["autoAddDateBtn"], t: translate("$autoAddDates") },
      { b: buttons["recentlyAddedAnimeBtn"], t: translate("$showRecentlyAddedAnime") },
      { b: buttons["recentlyAddedMangaBtn"], t: translate("$showRecentlyAddedManga") },
      { b: buttons["headerSlideBtn"], t: translate("$autoHideHeader") },
      { b: buttons["scrollbarStyleBtn"], t: translate("$changeScrollbarAppearance") },
    ]),
    createListDiv("Anime - Manga", [
      { b: buttons["animeBgBtn"], t: translate("$dynamicBackgroundColor") },
      { b: buttons["animeBannerBtn"], t: translate("$addAnilistBanner") },
      { b: buttons["animeTagBtn"], t: translate("$addAnilistTags") },
      { b: buttons["animeRelationBtn"], t: translate("$replaceRelations") },
      { b: buttons["relationFilterBtn"], t: translate("$addRelationFilter") },
      { b: buttons["animeSongsBtn"], t: translate("$replaceAnimeSongs") },
      { b: buttons["editPopupBtn"], t: translate("$replaceEditDetails") },
      { b: buttons["animeInfoDesignBtn"], t: translate("$changeInfoDesign") },
      { b: buttons["animeHeaderBtn"], t: translate("$changeTitlePosition") },
      { b: buttons["customCoverBtn"], t: translate("$customCoverImage") },
    ]),
    createListDiv("Character", [
      { b: buttons["charBgBtn"], t: translate("$charDynamicBackground") },
      { b: buttons["characterHeaderBtn"], t: translate("$changeCharacterNamePosition") },
      { b: buttons["characterNameAltBtn"], t: translate("$showAltCharacterName") },
      { b: buttons["customCharacterCoverBtn"], t: translate("$customCharacterCover") },
    ]),
    createListDiv("People", [{ b: buttons["peopleHeaderBtn"], t: translate("$changePeopleNamePosition") }]),
    createListDiv("Blog", [
      { b: buttons["blogRedesignBtn"], t: translate("$redesignBlogPage") },
      { b: buttons["blogContentBtn"], t: translate("$autoFetchBlogContent") },
    ]),
    createListDiv("Club", [{ b: buttons["clubCommentsBtn"], t: translate("$expandClubComments") }]),
    createListDiv("Forum", [
      { b: buttons["embedBtn"], t: translate("$modernAnimeMangaLinks") },
      { b: buttons["forumDateBtn"], t: translate("$changeDateFormatForum") },
    ]),
    createListDiv("Profile", [
      { b: buttons["modernLayoutBtn"], t: translate("$modernProfileLayout") },
      { b: buttons["replaceListBtn"], t: translate("$modernAnimeMangaList") },
      { b: buttons["profileRemoveLeftSideBtn"], t: translate("$hideProfileLeftSide") },
      { b: buttons["headerOpacityBtn"], t: translate("$autoHeaderOpacity") },
      { b: buttons["moveBadgesBtn"], t: translate("$moveBadgesPosition") },
      { b: buttons["actHistoryBtn"], t: translate("$showActivityHistory") },
      { b: buttons["profileAnimeGenreBtn"], t: translate("$showAnimeGenreOverview") },
      { b: buttons["profileMangaGenreBtn"], t: translate("$showMangaGenreOverview") },
      { b: buttons["moreFavsBtn"], t: translate("$moreThan10Favorites") },
      { b: buttons["customCSSBtn"], t: translate("$showCustomCSS") },
      { b: buttons["newCommentsBtn"], t: translate("$commentsRedesign") },
      { b: buttons["profileNewCommentsBtn"], t: translate("$profileCommentsRedesign") },
      { b: buttons["profileHeaderBtn"], t: translate("$changeUsernamePosition") },
    ])
  );
  listDiv.append(privateProfileDiv, hideProfileElDiv, customProfileElDiv, malBadgesDiv, custompfDiv, custombadgeDiv, custombgDiv, customfgDiv, customColorsDiv, customCSSDiv);
  buildUserModules(listDiv);
  document.querySelector("#headerSmall").insertAdjacentElement("beforeend", mainInner);
  listDiv.append(buttons["removeAllCustomBtn"]);

  createSettingDropdown("#replaceListBtn", "option", "listAiringStatus", true, translate("$ddAiringDot"));
  createSettingDropdown("#moreFavsBtn", "option", "moreFavsMode", true, translate("$ddmoreFavsMode"));
  createSettingDropdown("#embedBtn", "ttl", "embedTTL", 30, translate("$ddEmbedTTL"));
  createSettingDropdown("#animeTagBtn", "ttl", "tagTTL", 7, translate("$ddTagTTL"));
  createSettingDropdown("#animeRelationBtn", "ttl", "relationTTL", 7, translate("$ddRelationTTL"));
  createSettingDropdown("#modernLayoutBtn", "option", "autoModernLayout", false, translate("$ddAutoModernLayout"));
  createSettingDropdown("#animeBannerBtn", "option", "animeBannerMove", false, translate("$ddAnimeBannerMove"));
  runModulesDropdown();

  $(".malCleanSettingButtons input").attr("style", "height: 38px;padding: 0 6px!important");
  $("#moreFavsModeBtn").on("click", async function () {
    await delay(200);
    if ($("#moreFavsModeBtn").hasClass("btn-active")) {
      if (svar.moreFavsMode) {
        const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character", "moreFavs_people", "moreFavs_company");
        await editAboutPopup(`moreFavs/${moreFavsDB}`, "moreFavs", 1);
      }
    }
  });

  getSettings();

  //Disable Buttons
  if (defaultMal) {
    disableButton("headerSlideBtn", translate("$mcUserStyleWarn"));
    disableButton("headerOpacityBtn", translate("$mcUserStyleModernWarn"));
  } else {
    disableButton("scrollbarStyleBtn", translate("$activeMcUserStyleWarn"));
  }
  if (!svar.modernLayout) {
    disableButton("headerOpacityBtn", translate("$mcUserStyleModernReqWarn"));
    disableButton("profileRemoveLeftSideBtn", translate("$modernProfileWarn"));
    disableButton("moveBadgesBtn", translate("$modernProfileWarn"));
    disableButton("actHistoryBtn", translate("$modernProfileWarn"));
    disableButton("profileAnimeGenreBtn", translate("$modernProfileWarn"));
    disableButton("profileMangaGenreBtn", translate("$modernProfileWarn"));
  } else {
    disableButton("profileHeaderBtn", translate("$disableModernProfileWarn"));
  }

  //Navigation
  const navButtons = mainInner.querySelectorAll(".malCleanMainHeaderNav button");
  const settingContainers = mainInner.querySelectorAll(".malCleanSettingContainer[id]");
  navButtons.forEach((button) => {
    button.classList.add("mainbtns");
    const sectionName = button.textContent
      .trim()
      .toLowerCase()
      .replace(/[\W_]+/g, "-");
    button.onclick = function () {
      function slideControl() {
        const targetSection = mainInner.querySelector(".malCleanSettingContainer#" + sectionName);
        if (targetSection) {
          const offset = 80;
          const elementPosition = targetSection.offsetTop;
          const offsetPosition = elementPosition - offset;
          listDiv.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
      const hideSetting = document.querySelectorAll(".malCleanSettingInnerSettings.malCleanSettingPopup");
      if (hideSetting.length) {
        $(hideSetting).slideUp(() => {
          slideControl();
        });
        document.querySelector("#innerSettingsBtn").setAttribute("active", "0");
      } else {
        slideControl();
      }
    };
  });

  //Highlight Active Section
  let ticking = false;
  function highlightClosestSection() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      function highlightControl() {
        let closestSection = null;
        let minDistance = Infinity;
        const listTop = listDiv.getBoundingClientRect().top;
        const referencePoint = listTop + 20;

        settingContainers.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - referencePoint);
          const isInView = rect.top <= referencePoint && rect.bottom >= listTop;

          if (isInView && distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        });

        // Highlight the closest section
        navButtons.forEach((button) => {
          if (closestSection) {
            const buttonTarget = button.textContent
              .trim()
              .toLowerCase()
              .replace(/[\W_]+/g, "-")
              .replace(/^-+|-+$/g, "");

            const isActive = buttonTarget === closestSection.id;
            button.classList.toggle("btn-active-def", isActive);
          } else {
            button.classList.remove("btn-active-def");
          }
        });

        ticking = false;
      }
      const hideSetting = document.querySelectorAll(".malCleanSettingInnerSettings.malCleanSettingPopup");
      if (hideSetting.length) {
        $(hideSetting).slideUp(() => {
          highlightControl();
        });
        document.querySelector("#innerSettingsBtn").setAttribute("active", "0");
      } else {
        highlightControl();
      }
    });
  }

  // Throttling
  function throttledEvent() {
    highlightClosestSection();
  }

  listDiv.addEventListener("scroll", debounce(throttledEvent, 50));
  highlightClosestSection();
}
