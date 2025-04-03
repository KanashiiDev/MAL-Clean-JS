//MalClean Settings - Create Settings Div
function createDiv() {
  const modernBtn = "<a style=\"cursor: pointer;\" onclick=\"document.getElementById('modernLayoutBtn').scrollIntoView({ behavior: 'smooth', block: 'start' });\">Modern Profile Layout</a>";
  const listNav = ` <div class="malCleanMainHeaderNav"><button>My Panel</button><button>Anime Manga</button><button>Character</button>
  <button>People</button><button>Blog</button><button>Club</button><button>Forum</button><button>Profile</button></div>`;
  let mainInner = create("div", { class: "malCleanMainContainer" }, '<div class="malCleanMainHeader"><div class="malCleanMainHeaderTitle"><b>' + stLink.innerText + "</b></div>" + listNav + "</div>");
  let listDiv = create("div", { class: "malCleanMainContainerList" });
  mainInner.append(listDiv);
  let customfgDiv = createCustomSettingDiv(
    "Custom Foreground Color (Required " + modernBtn + ")",
    "Change profile foreground color. This will be visible to users with the script.",
    null,
    [fgColorSelector, updateFgButton, removeFgButton],
    ["65% 25% 10%"],
    null,
    svar.modernLayout,
    "profile"
  );

  let custombgDiv = createCustomSettingDiv(
    "Custom Banner (Required " + modernBtn + ")",
    "Add custom banner to your profile. This will be visible to users with the script.",
    null,
    [bgInput, bgButton, bgRemoveButton],
    ["65% 25% 10%"],
    [bgInfo],
    svar.modernLayout,
    "profile"
  );
  let custompfDiv = createCustomSettingDiv(
    "Custom Avatar",
    "Add custom avatar to your profile. This will be visible to users with the script.",
    null,
    [pfInput, pfButton, pfRemoveButton],
    ["65% 25% 10%"],
    [pfInfo],
    1,
    "profile"
  );
  let custombadgeDiv = createCustomSettingDiv(
    "Custom Badge (Required " + modernBtn + ")",
    "Add custom badge to your profile. This will be visible to users with the script." + "<p>You can use HTML elements. Maximum size 300x150. Update empty to delete.</p>",
    null,
    [badgeInput, badgeColorSelector, badgeColorLoop, badgeButton],
    ["50% 15% 15% 20%"],
    null,
    svar.modernLayout,
    "profile"
  );
  let malBadgesDiv = createCustomSettingDiv(
    "Mal-Badges",
    "You can add Mal-Badges to your profile. This will be visible to users with the script." +
      "<p>If the badge does not appear, it means that the Mal-Badges is blocking access. There is nothing you can do about it.</p>",
    null,
    [malBadgesInput, malBadgesButton, malBadgesRemoveButton],
    ["65% 25% 10%"],
    [malBadgesDetailButton, malBadgesDetailButtonText],
    1,
    "profile"
  );
  let customCSSDiv = createCustomSettingDiv(
    "Custom CSS",
    "Add custom css to your profile. This will be visible to users with the script.",
    null,
    [cssInput, cssButton, cssRemoveButton],
    ["65% 25% 10%"],
    [cssmodernLayout, cssmodernLayoutText, cssInfo],
    1,
    "profile"
  );
  let customColorsDiv = createCustomSettingDiv(
    "Custom Profile Colors",
    "Change profile colors. This will be visible to users with the script.",
    [customColors],
    [customColorButton, customColorRemoveButton],
    ["90% 10%"],
    null,
    1,
    "profile"
  );
  let privateProfileDiv = createCustomSettingDiv(
    "Profile Privacy",
    "You can make your profile private or public for users with the script.",
    null,
    [privateButton, removePrivateButton],
    ["50% 50%"],
    null,
    1,
    "profile"
  );
  let hideProfileElDiv = createCustomSettingDiv(
    "Hide Profile Elements",
    "You can hide your profile elements. This will also apply to users with the script.",
    null,
    [hideProfileElButton, hideProfileElUpdateButton, removehideProfileElButton],
    ["65% 25% 10%"],
    null,
    1,
    "profile"
  );
  let customProfileElDiv = createCustomSettingDiv(
    "Custom Profile Elements",
    "You can add custom profile elements your profile. This will be visible to users with the script. You can use HTML elements.",
    null,
    [customProfileElUpdateButton, customProfileElRightUpdateButton],
    [svar.modernLayout ? "50% 50%" : "100%"],
    null,
    1,
    "profile"
  );
  const buttons = buttonsConfig.reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  mainInner.querySelector(".malCleanMainHeaderTitle").append(reloadButton, closeButton);
  listDiv.append(
    createListDiv("My Panel", [
      { b: buttons["animeInfoBtn"], t: "Add info to seasonal anime (hover over anime to make it appear)" },
      { b: buttons["currentlyWatchingBtn"], t: "Show currently watching anime" },
      { b: buttons["currentlyReadingBtn"], t: "Show currently reading manga" },
      { b: buttons["airingDateBtn"], t: "Add next episode countdown to currently watching anime" },
      { b: buttons["autoAddDateBtn"], t: "Auto add start/finish date to watching anime & reading manga" },
      { b: buttons["recentlyAddedAnimeBtn"], t: "Show recently added anime" },
      { b: buttons["recentlyAddedMangaBtn"], t: "Show recently added manga" },
      { b: buttons["headerSlideBtn"], t: "Auto Hide/Show header" },
      { b: buttons["scrollbarStyleBtn"], t: "Change Scrollbar Appearance" },
    ]),
    createListDiv("Anime - Manga", [
      { b: buttons["animeBgBtn"], t: "Add dynamic background color based cover art's color palette" },
      { b: buttons["animeBannerBtn"], t: "Add banner image from Anilist" },
      { b: buttons["animeTagBtn"], t: "Add tags from Anilist" },
      { b: buttons["animeRelationBtn"], t: "Replace relations" },
      { b: buttons["relationFilterBtn"], t: "Add filter to replaced relations" },
      { b: buttons["animeSongsBtn"], t: "Replace Anime OP/ED with animethemes.moe" },
      { b: buttons["editPopupBtn"], t: "Replace the edit details with the edit popup" },
      { b: buttons["animeInfoDesignBtn"], t: "Change the design of the Information on the left side." },
      { b: buttons["animeHeaderBtn"], t: "Change title position" },
      { b: buttons["customCoverBtn"], t: "Custom Cover Image <br><i>(Go to the anime/manga pictures page to change it)</i>" },
    ]),
    createListDiv("Character", [
      { b: buttons["charBgBtn"], t: "Add dynamic background color based cover art's color palette" },
      { b: buttons["characterHeaderBtn"], t: "Change name position" },
      { b: buttons["characterNameAltBtn"], t: "Show alternative name" },
      { b: buttons["customCharacterCoverBtn"], t: "Custom Cover Image <br><i>(Go to the character pictures page to change it)</i>" },
    ]),
    createListDiv("People", [{ b: buttons["peopleHeaderBtn"], t: "Change name position" }]),
    createListDiv("Blog", [
      { b: buttons["blogRedesignBtn"], t: "Redesign blog page" },
      { b: buttons["blogContentBtn"], t: "Auto fetch blog content" },
    ]),
    createListDiv("Club", [{ b: buttons["clubCommentsBtn"], t: "Expand club comments" }]),
    createListDiv("Forum", [
      { b: buttons["embedBtn"], t: "Modern Anime/Manga Links" },
      { b: buttons["forumDateBtn"], t: "Change date format" },
    ]),
    createListDiv("Profile", [
      { b: buttons["modernLayoutBtn"], t: "Modern Profile Layout" },
      { b: buttons["replaceListBtn"], t: "Modern Anime/Manga List" },
      { b: buttons["profileRemoveLeftSideBtn"], t: "Hide the modern profile left side if it is not the main profile page." },
      { b: buttons["headerOpacityBtn"], t: "Add auto opacity to the header if the user has a custom banner." },
      { b: buttons["moveBadgesBtn"], t: "Move badges after the anime & manga list buttons." },
      { b: buttons["actHistoryBtn"], t: "Show Activity History" },
      { b: buttons["profileAnimeGenreBtn"], t: "Show Anime Genre Overview" },
      { b: buttons["profileMangaGenreBtn"], t: "Show Manga Genre Overview" },
      { b: buttons["moreFavsBtn"], t: "Add more than 10 favorites" },
      { b: buttons["customCSSBtn"], t: "Show custom CSS" },
      { b: buttons["newCommentsBtn"], t: "Comments Redesign" },
      { b: buttons["profileNewCommentsBtn"], t: "Profile Comments Redesign" },
      { b: buttons["profileHeaderBtn"], t: "Change username position" },
    ])
  );
  listDiv.append(privateProfileDiv, hideProfileElDiv, customProfileElDiv, malBadgesDiv, custompfDiv, custombadgeDiv, custombgDiv, customfgDiv);
  listDiv.append(customColorsDiv, customCSSDiv);
  document.querySelector("#headerSmall").insertAdjacentElement("beforeend", mainInner);
  listDiv.append(buttons["removeAllCustomBtn"]);

  createSettingDropdown("#replaceListBtnOption", "svar", svar, "listAiringStatusBtn", "Show Airing Status Dot");
  createSettingDropdown("#moreFavsBtnOption", "svar", svar, "moreFavsModeBtn", "Update also for other users");
  createSettingDropdown("#embedBtnOption", "ttl", svar, "embedTTL", "embed");
  createSettingDropdown("#animeTagBtnOption", "ttl", svar, "tagTTL", "tag");
  createSettingDropdown("#animeRelationBtnOption", "ttl", svar, "relationTTL", "relation");
  createSettingDropdown("#modernLayoutBtnOption", "svar", svar, "autoModernLayoutBtn", "Turn off auto modern layout detection.");
  createSettingDropdown("#animeBannerBtnOption", "svar", svar, "animeBannerMoveBtn", "Move the cover image below the banner image.");

  $(".malCleanSettingButtons input").attr("style", "height: 38px;padding: 0 6px!important");
  $("#moreFavsModeBtn").on("click", async function () {
    await delay(200);
    if ($("#moreFavsModeBtn").hasClass("btn-active")) {
      if (svar.moreFavsMode) {
        const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character");
        await editAboutPopup(`moreFavs/${moreFavsDB}`, "moreFavs", 1);
      }
    }
  });
  getSettings();

  //Disable Buttons
  if (defaultMal) {
    disableButton("headerSlideBtn", "Mal Clean Userstyle Required");
    disableButton("headerOpacityBtn", "Mal Clean Userstyle & Modern Profile Layout Required");
  } else {
    disableButton("scrollbarStyleBtn", "This setting is only for users who do not have Mal Clean Userstyle.");
  }
  if (!svar.modernLayout) {
    disableButton("headerOpacityBtn", "Mal Clean Userstyle & Modern Profile Layout Required");
    disableButton("profileRemoveLeftSideBtn", "Modern Profile Layout Required!");
    disableButton("moveBadgesBtn", "Modern Profile Layout Required!");
    disableButton("actHistoryBtn", "Modern Profile Layout Required!");
    disableButton("profileAnimeGenreBtn", "Modern Profile Layout Required!");
    disableButton("profileMangaGenreBtn", "Modern Profile Layout Required!");
  } else {
    disableButton("profileHeaderBtn", "Disable Modern Profile Layout.");
  }

  //Navigation
  const navButtons = mainInner.querySelectorAll(".malCleanMainHeaderNav button");
  const settingContainers = mainInner.querySelectorAll(".malCleanSettingContainer[id]");
  navButtons.forEach((button) => {
    button.classList.add("mainbtns");
    const sectionName = button.textContent.trim().replace(/[\W_]+/, "-");
    button.onclick = function () {
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
    };
  });

  //Highlight Active Section
  let ticking = false;
  function highlightClosestSection() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
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
            .replace(/[^\w]+/g, "-")
            .replace(/^-+|-+$/g, "");

          const isActive = buttonTarget === closestSection.id;
          button.classList.toggle("btn-active-def", isActive);
        } else {
          button.classList.remove("btn-active-def");
        }
      });

      ticking = false;
    });
  }

  // Throttling
  function throttledEvent() {
    highlightClosestSection();
  }

  // Debounce for better performance
  function debounce(func, wait = 50) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }
  listDiv.addEventListener("scroll", debounce(throttledEvent));
  highlightClosestSection();
}
