async function findCustomAbout() {
  const aboutSection = document.querySelector(".user-profile-about.js-truncate-outer");
  const processAboutSection = async (aboutContent) => {
    const fgMatch = aboutContent.match(profileRegex.fg);
    const bgMatch = aboutContent.match(profileRegex.bg);
    const pfMatch = aboutContent.match(profileRegex.pf);
    const cssMatch = aboutContent.match(profileRegex.css);
    const badgeMatch = aboutContent.match(profileRegex.badge);
    const malBadgesMatch = aboutContent.match(profileRegex.malBadges);
    const colorMatch = aboutContent.match(profileRegex.colors);
    const favSongMatch = aboutContent.match(profileRegex.favSongEntry);
    const privateProfileMatch = aboutContent.match(profileRegex.privateProfile);
    const hideProfileElMatch = aboutContent.match(profileRegex.hideProfileEl);
    const customElMatch = aboutContent.match(profileRegex.customProfileEl);
    const moreFavsMatch = aboutContent.match(profileRegex.moreFavs);
    if (pfMatch) {
      const pfData = pfMatch[0].replace(profileRegex.pf, "$2");
      if (pfData !== "...") {
        let pfBase64Url = pfData.replace(/_/g, "/");
        custompf = JSON.parse(LZString.decompressFromBase64(pfBase64Url));
        document.querySelector(".user-image.mb8 > img").setAttribute("src", custompf);
      }
    }
    if (bgMatch) {
      const bgData = bgMatch[0].replace(profileRegex.bg, "$2");
      if (bgData !== "...") {
        let bgBase64Url = bgData.replace(/_/g, "/");
        custombg = JSON.parse(LZString.decompressFromBase64(bgBase64Url));
        banner.setAttribute(
          "style",
          `background-color: var(--color-foreground); background: url(${custombg}); background-position: 50% 35%; background-repeat: no-repeat; background-size: cover; height: 330px; position: relative;`
        );
        customModernLayoutFounded = 1;
      }
    }
    if (badgeMatch) {
      const badgeData = badgeMatch[0].replace(profileRegex.badge, "$2");
      if (badgeData !== "...") {
        let badgeBase64Url = badgeData.replace(/_/g, "/");
        custombadge = JSON.parse(LZString.decompressFromBase64(badgeBase64Url));
        const badgeDiv = create("div", { class: "maljsProfileBadge" });
        badgeDiv.innerHTML = custombadge[0];
        if (custombadge[1] === "loop") {
          $(badgeDiv).addClass("rainbow");
        } else {
          badgeDiv.style.background = custombadge[1];
        }
        container.append(badgeDiv);
        customModernLayoutFounded = 1;
      }
    }
    if (cssMatch) {
      const cssData = cssMatch[0].replace(profileRegex.css, "$2");
      if (cssData !== "...") {
        let cssBase64Url = cssData.replace(/_/g, "/");
        customCSS = JSON.parse(LZString.decompressFromBase64(cssBase64Url));
      }
    }
    if (customModernLayoutFounded && !svar.autoModernLayout) {
      svar.modernLayout = true;
    }
    if (
      (customCSS && customCSS.constructor === Array && !customCSS[1]) ||
      (customCSS && customCSS.constructor !== Array) ||
      (!svar.modernLayout && customModernLayoutFounded && svar.autoModernLayout)
    ) {
      svar.modernLayout = false;
    }
    if (colorMatch) {
      const colorData = colorMatch[0].replace(profileRegex.colors, "$2");
      if (colorData !== "...") {
        let colorBase64Url = colorData.replace(/_/g, "/");
        customcolors = JSON.parse(LZString.decompressFromBase64(colorBase64Url));
        await applyCustomColors(customcolors);
      }
    }
    if (privateProfileMatch) {
      const privateData = privateProfileMatch[0].replace(profileRegex.privateProfile, "$2");
      if (privateData !== "...") {
        let privateBase64Url = privateData.replace(/_/g, "/");
        privateProfile = JSON.parse(LZString.decompressFromBase64(privateBase64Url));
        privateButton.classList.toggle("btn-active-def", privateProfile);
        applyPrivateProfile();
      } else {
        removePrivateButton.classList.toggle("btn-active-def", 1);
      }
    }
    if (hideProfileElMatch) {
      const hideProfileElData = hideProfileElMatch[0].replace(profileRegex.hideProfileEl, "$2");
      if (hideProfileElData !== "...") {
        let profileElBase64Url = hideProfileElData.replace(/_/g, "/");
        hiddenProfileElements = JSON.parse(LZString.decompressFromBase64(profileElBase64Url));
        applyHiddenDivs();
      }
    }
    if (moreFavsMatch) {
      const moreFavsData = moreFavsMatch[0].replace(profileRegex.moreFavs, "$2");
      if (moreFavsData !== "...") {
        let moreFavsDecompressed = moreFavsData.replace(/_/g, "/");
        moreFavsDecompressed = JSON.parse(LZString.decompressFromBase64(moreFavsDecompressed));
        const animanga = Object.values(moreFavsDecompressed.moreFavs_anime_manga);
        const character = Object.values(moreFavsDecompressed.moreFavs_character);
        if (!userNotHeaderUser) {
          if (svar.moreFavsMode) {
            await replaceLocalForageDB("moreFavs_anime_manga", animanga);
            await replaceLocalForageDB("moreFavs_character", character);
          }
        } else {
          await loadMoreFavs(1, "anime_manga", animanga);
          await loadMoreFavs(1, "character", character);
        }
      }
    }
    if (fgMatch) {
      const fgData = fgMatch[0].replace(profileRegex.fg, "$2");
      if (fgData !== "...") {
        let fgBase64Url = fgData.replace(/_/g, "/");
        customfg = JSON.parse(LZString.decompressFromBase64(fgBase64Url));
        await changeForeground(customfg);
      }
    }
    if (malBadgesMatch) {
      const malBadgesData = malBadgesMatch[0].replace(profileRegex.malBadges, "$2");
      if (malBadgesData !== "..." && isMainProfilePage) {
        let malBadgesBase64Url = malBadgesData.replace(/_/g, "/");
        malBadgesUrl = JSON.parse(LZString.decompressFromBase64(malBadgesBase64Url));
        if (malBadgesUrl) malBadgesUrl += malBadgesUrl.endsWith("?detail") ? "&malbadges" : "?malbadges";
        await getMalBadges(malBadgesUrl);
      }
    }
    if (favSongMatch) {
      if (isMainProfilePage) {
        await buildFavSongs(aboutContent);
      }
    }
    if (customElMatch) {
      if (isMainProfilePage) {
        await buildCustomElements(aboutContent);
      }
    }
  };

  // Find profile about and processAboutSection
  if (aboutSection && aboutSection.innerHTML.match(profileRegex.malClean)) {
    await processAboutSection(aboutSection.innerHTML);
    settingsFounded = 1;
  } else if (!settingsFounded) {
    const profileData = await fetchCustomAbout(processProfilePage);
    if (profileData) await processAboutSection(profileData);
  }
}
