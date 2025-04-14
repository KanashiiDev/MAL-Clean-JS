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
      if (pfData && pfData !== "...") {
        try {
          custompf = decodeAndParseBase64(pfData, purifyConfigText);
          document.querySelector(".user-image.mb8 > img").setAttribute("src", custompf);
        } catch (error) {
          console.error("An error occurred while processing the custom profile avatar: ", error);
        }
      }
    }
    if (bgMatch) {
      const bgData = bgMatch[0].replace(profileRegex.bg, "$2");
      if (bgData && bgData !== "...") {
        try {
          custombg = decodeAndParseBase64(bgData, purifyConfigText);
          banner.setAttribute(
            "style",
            `background-color: var(--color-foreground); background: url(${custombg}); background-position: 50% 35%; 
            background-repeat: no-repeat; background-size: cover; height: 330px; position: relative;`
          );
          customModernLayoutFounded = 1;
        } catch (error) {
          console.error("An error occurred while processing the custom profile banner: ", error);
        }
      }
    }
    if (badgeMatch) {
      const badgeData = badgeMatch[0].replace(profileRegex.badge, "$2");
      if (badgeData && badgeData !== "...") {
        try {
          custombadge = decodeAndParseBase64(badgeData, purifyConfig);
          if (Array.isArray(custombadge) && custombadge[0].length > 1) {
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
        } catch (error) {
          console.error("An error occurred while processing the custom badge: ", error);
        }
      }
    }
    if (cssMatch) {
      const cssData = cssMatch[0].replace(profileRegex.css, "$2");
      if (cssData && cssData !== "...") {
        try {
          customCSS = decodeAndParseBase64(cssData, purifyConfigText);
          if (svar.customCSS) {
            await findCustomCSS();
          }
        } catch (error) {
          console.error("An error occurred while processing the custom css: ", error);
        }
      }
    }
    if (customModernLayoutFounded && !svar.autoModernLayout) {
      svar.modernLayout = true;
    }
    if (
      (svar.customCSS && customCSS && customCSS.constructor === Array && !customCSS[1]) ||
      (svar.customCSS && customCSS && customCSS.constructor !== Array) ||
      (svar.modernLayout && customModernLayoutFounded && svar.autoModernLayout)
    ) {
      svar.modernLayout = false;
    }
    if (colorMatch && svar.modernLayout) {
      const colorData = colorMatch[0].replace(profileRegex.colors, "$2");
      if (colorData !== "...") {
        try {
          customcolors = decodeAndParseBase64(colorData, purifyConfigText);
          await applyCustomColors(customcolors);
        } catch (error) {
          console.error("An error occurred while processing the custom profile color: ", error);
        }
      }
    }
    if (privateProfileMatch) {
      const privateData = privateProfileMatch[0].replace(profileRegex.privateProfile, "$2");
      if (privateData && privateData !== "...") {
        try {
          privateProfile = decodeAndParseBase64(privateData, purifyConfigText);
          privateButton.classList.toggle("btn-active-def", privateProfile);
          applyPrivateProfile();
        } catch (error) {
          console.error("An error occurred while processing the private profile:", error);
        }
      } else {
        removePrivateButton.classList.toggle("btn-active-def", 1);
      }
    }
    if (hideProfileElMatch) {
      const hideProfileElData = hideProfileElMatch[0].replace(profileRegex.hideProfileEl, "$2");
      if (hideProfileElData !== "...") {
        try {
          hiddenProfileElements = decodeAndParseBase64(hideProfileElData, purifyConfigText);
          applyHiddenDivs();
        } catch (error) {
          console.error("An error occurred while processing the hide profile elements:", error);
        }
      }
    }
    if (moreFavsMatch) {
      const moreFavsData = moreFavsMatch[0].replace(profileRegex.moreFavs, "$2");
      if (moreFavsData && moreFavsData !== "...") {
        try {
          const moreFavsDecompressed = decodeAndParseBase64(moreFavsData, purifyConfig);

          // Null check
          const safeGetValues = (obj) => (obj && typeof obj === "object" && !Array.isArray(obj) ? Object.values(obj) : []);
          const animanga = safeGetValues(moreFavsDecompressed?.moreFavs_anime_manga);
          const character = safeGetValues(moreFavsDecompressed?.moreFavs_character);
          const people = safeGetValues(moreFavsDecompressed?.moreFavs_people);
          const company = safeGetValues(moreFavsDecompressed?.moreFavs_company);

          if (!userNotHeaderUser) {
            if (svar.moreFavsMode) {
              if (animanga.length) await replaceLocalForageDB("moreFavs_anime_manga", animanga);
              if (character.length) await replaceLocalForageDB("moreFavs_character", character);
              if (people.length) await replaceLocalForageDB("moreFavs_people", people);
              if (company.length) await replaceLocalForageDB("moreFavs_company", company);
              await loadMoreFavs(1, "character");
              await loadMoreFavs(1, "anime_manga");
              await loadMoreFavs(1, "people");
              await loadMoreFavs(1, "company");
            }
          } else {
            if (animanga.length) await loadMoreFavs(1, "anime_manga", animanga);
            if (character.length) await loadMoreFavs(1, "character", character);
            if (people.length) await loadMoreFavs(1, "people", people);
            if (company.length) await loadMoreFavs(1, "company", company);
          }
        } catch (error) {
          console.error("An error occurred while processing the moreFavs:", error);
        }
      }
    } else {
      if (svar.moreFavs && !userNotHeaderUser) {
        await loadMoreFavs(1, "character");
        await loadMoreFavs(1, "anime_manga");
        await loadMoreFavs(1, "people");
        await loadMoreFavs(1, "company");
      }
    }
    if (fgMatch) {
      const fgData = fgMatch[0].replace(profileRegex.fg, "$2");
      if (fgData && fgData !== "...") {
        try {
          customfg = decodeAndParseBase64(fgData, purifyConfigText);
          await changeForeground(customfg);
        } catch (error) {
          console.error("An error occurred while processing the hide custom foreground color:", error);
        }
      }
    }
    if (malBadgesMatch) {
      const malBadgesData = malBadgesMatch[0].replace(profileRegex.malBadges, "$2");
      if (malBadgesData !== "..." && isMainProfilePage) {
        try {
          malBadgesUrl = decodeAndParseBase64(malBadgesData, purifyConfigText);
          if (malBadgesUrl) malBadgesUrl += malBadgesUrl.endsWith("?detail") ? "&malbadges" : "?malbadges";
          await getMalBadges(malBadgesUrl);
        } catch (error) {
          console.error("An error occurred while processing the hide custom mal-badges:", error);
        }
      }
    }
    if (favSongMatch) {
      if (isMainProfilePage) {
        try {
          await buildFavSongs(aboutContent);
        } catch (error) {
          console.error("An error occurred while processing the hide custom fav songs", error);
        }
      }
    }
    if (customElMatch) {
      if (isMainProfilePage) {
        try {
          await buildCustomElements(aboutContent);
        } catch (error) {
          console.error("An error occurred while processing the hide custom elements", error);
        }
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
