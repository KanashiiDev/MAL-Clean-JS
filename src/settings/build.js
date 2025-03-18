//MalClean Settings - Create Settings Div
function createDiv() {
  const modernBtn = "<a style=\"cursor: pointer;\" onclick=\"document.getElementById('modernLayoutBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });\">Modern Profile Layout</a>";
  let listDiv = create("div", { class: "malCleanMainContainer" }, '<div class="malCleanMainHeader"><b>' + stLink.innerText + "</b></div>");
  let customfgDiv = createCustomSettingDiv(
    "Custom Foreground Color (Required " + modernBtn + ")",
    "Change profile foreground color. This will be visible to users with the script.",
    [fgColorSelector, updateFgButton, removeFgButton],
    svar.modernLayout,
    "profile"
  );

  let custombgDiv = createCustomSettingDiv(
    "Custom Banner (Required " + modernBtn + ")",
    "Add custom banner to your profile. This will be visible to users with the script.",
    [bgInput, bgButton, bgRemoveButton, bgInfo],
    svar.modernLayout,
    "profile"
  );
  let custompfDiv = createCustomSettingDiv(
    "Custom Avatar",
    "Add custom avatar to your profile. This will be visible to users with the script.",
    [pfInput, pfButton, pfRemoveButton, pfInfo],
    1,
    "profile"
  );
  let custombadgeDiv = createCustomSettingDiv(
    "Custom Badge (Required " + modernBtn + ")",
    "Add custom badge to your profile. This will be visible to users with the script." + "<p>You can use HTML elements. Maximum size 300x150. Update empty to delete.</p>",
    [badgeInput, badgeColorSelector, badgeColorLoop, badgeButton],
    svar.modernLayout,
    "profile"
  );
  let malBadgesDiv = createCustomSettingDiv(
    "Mal-Badges",
    "You can add Mal-Badges to your profile. This will be visible to users with the script." +
      "<p>If the badge does not appear, it means that the Mal-Badges is blocking access. There is nothing you can do about it.</p>",
    [malBadgesInput, malBadgesButton, malBadgesRemoveButton, malBadgesDetailButton, malBadgesDetailButtonText],
    1,
    "profile"
  );
  let customCSSDiv = createCustomSettingDiv(
    "Custom CSS",
    "Add custom css to your profile. This will be visible to users with the script.",
    [cssInput, cssButton, cssRemoveButton, cssmodernLayout, cssmodernLayoutText, cssInfo],
    1,
    "profile"
  );
  let customColorsDiv = createCustomSettingDiv(
    "Custom Profile Colors",
    "Change profile colors. This will be visible to users with the script.",
    [customColors, customColorButton, customColorRemoveButton],
    1,
    "profile"
  );
  let privateProfileDiv = createCustomSettingDiv("Profile Privacy", "You can make your profile private or public for users with the script.", [privateButton, removePrivateButton], 1, "profile");
  let hideProfileElDiv = createCustomSettingDiv(
    "Hide Profile Elements",
    "You can hide your profile elements. This will also apply to users with the script.",
    [hideProfileElButton, hideProfileElUpdateButton, removehideProfileElButton],
    1,
    "profile"
  );
  let customProfileElDiv = createCustomSettingDiv(
    "Custom Profile Elements",
    "You can add custom profile elements your profile. This will be visible to users with the script. You can use HTML elements.",
    [customProfileElUpdateButton, customProfileElRightUpdateButton],
    1,
    "profile"
  );
  const buttons = buttonsConfig.reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  listDiv.querySelector(".malCleanMainHeader").append(reloadButton, closeButton);
  listDiv.append(
    createListDiv("My Panel", [
      { b: buttons["animeInfoBtn"], t: "Add info to seasonal anime (hover over anime to make it appear)" },
      { b: buttons["currentlyWatchingBtn"], t: "Show currently watching anime" },
      { b: buttons["currentlyReadingBtn"], t: "Show currently reading manga" },
      { b: buttons["airingDateBtn"], t: "Add next episode countdown to currently watching anime" },
      { b: buttons["autoAddDateBtn"], t: "Auto add start/finish date to watching anime & reading manga" },
      { b: buttons["recentlyAddedAnimeBtn"], t: "Show recently added anime" },
      { b: buttons["recentlyAddedMangaBtn"], t: "Show recently added manga" },
      ...(!defaultMal ? [{ b: buttons["headerSlideBtn"], t: "Auto Hide/Show header" }] : []),
      ...(defaultMal ? [{ b: buttons["scrollbarStyleBtn"], t: "Change Scrollbar Appearance" }] : []),
    ]),
    createListDiv("Anime / Manga", [
      { b: buttons["animeBgBtn"], t: "Add dynamic background color based cover art's color palette" },
      { b: buttons["animeBannerBtn"], t: "Add banner image from Anilist" },
      { b: buttons["animeBannerMoveBtn"], t: "Move the cover image below the banner image." },
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
      ...(!defaultMal ? [{ b: buttons["headerOpacityBtn"], t: "Add auto opacity to the header if the user has a custom banner." }] : []),
      ...(svar.modernLayout ? [{ b: buttons["moveBadgesBtn"], t: "Move badges after the anime & manga list buttons." }] : []),
      ...(svar.modernLayout ? [{ b: buttons["actHistoryBtn"], t: "Show Activity History" }] : []),
      ...(svar.modernLayout ? [{ b: buttons["profileAnimeGenreBtn"], t: "Show Anime Genre Overview" }] : []),
      ...(svar.modernLayout ? [{ b: buttons["profileMangaGenreBtn"], t: "Show Manga Genre Overview" }] : []),
      { b: buttons["customCSSBtn"], t: "Show custom CSS" },
      { b: buttons["profileHeaderBtn"], t: "Change username position" },
      { b: buttons["moreFavsBtn"], t: "Add more than 10 favorites" },
      { b: buttons["newCommentsBtn"], t: "Comments Redesign" },
      { b: buttons["profileNewCommentsBtn"], t: "Profile Comments Redesign" },
    ])
  );
  listDiv.append(privateProfileDiv, hideProfileElDiv, customProfileElDiv, malBadgesDiv, custompfDiv, custombadgeDiv, custombgDiv, customfgDiv);
  if (svar.modernLayout) {
    buttons["profileHeaderBtn"].parentElement.style.display = "none";
  }
  listDiv.append(customColorsDiv, customCSSDiv);
  document.querySelector("#headerSmall").insertAdjacentElement("afterend", listDiv);
  listDiv.append(buttons["removeAllCustomBtn"]);

  createSettingDropdown("#replaceListBtnOption", "svar", svar, "listAiringStatusBtn", "Show Airing Status Dot");
  createSettingDropdown("#moreFavsBtnOption", "svar", svar, "moreFavsModeBtn", "Update also for other users");
  createSettingDropdown("#embedBtnOption", "ttl", svar, "embedTTL", "embed");
  createSettingDropdown("#animeTagBtnOption", "ttl", svar, "tagTTL", "tag");
  createSettingDropdown("#animeRelationBtnOption", "ttl", svar, "relationTTL", "relation");
  createSettingDropdown("#modernLayoutBtnOption", "svar", svar, "autoModernLayoutBtn", "Turn off auto modern layout detection.");

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
}
