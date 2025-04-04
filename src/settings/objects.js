//Profile Foreground Color
let fgColorSelector = create("input", { class: "badgeInput", id: "fgcolorselector", type: "color" });
let updateFgButton = create("button", { class: "mainbtns", id: "privateProfile" }, "Update");
let removeFgButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "customFgRemove" });
let fgColorValue = "var(--color-foreground)";
let defaultFgColor = getComputedStyle(document.body);
defaultFgColor = defaultFgColor.getPropertyValue("--color-foreground");
fgColorSelector.value = defaultFgColor;

fgColorSelector.addEventListener("input", (event) => {
  fgColorValue = event.target.value;
  changeForeground(fgColorValue);
});

updateFgButton.onclick = () => {
  const fgBase64 = LZString.compressToBase64(JSON.stringify(fgColorValue));
  const fgbase64url = fgBase64.replace(/\//g, "_");
  editAboutPopup(`customfg/${fgbase64url}`, "fg");
};

removeFgButton.onclick = () => {
  editAboutPopup(`customfg/...`, "fg");
};

//Private Profile
var privateButton = create("button", { class: "mainbtns", id: "privateProfile" }, "Private");
var removePrivateButton = create("button", { class: "mainbtns", id: "privateRemove" }, "Public");

privateButton.onclick = () => {
  editAboutPopup(`privateProfile/IxA=`, "private");
};

removePrivateButton.onclick = () => {
  editAboutPopup(`privateProfile/...`, "private");
};

//Hide Profile Elements
var hideProfileElButton = create("button", { class: "mainbtns", id: "hideProfileElementsButton" }, "Hide");
var hideProfileElUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton" }, "Update");
var removehideProfileElButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "hideProfileElementsRemove" });
let hiddenProfileElements = [];
let hiddenProfileElementsTemp = [];
const divIds = [
  "#user-def-favs",
  "#user-friends-div",
  "#user-badges-div",
  "#user-rss-feed-div",
  "#user-links-div",
  "#user-status-div",
  "#user-status-history-div",
  "#user-status-counts-div",
  "#user-button-div",
  "#user-stats-div",
  "#user-updates-div",
  "#user-history-div",
  "#lastcomment",
  "#fav-0-div",
  "#fav-1-div",
  "#fav-2-div",
  "#fav-3-div",
  "#fav-4-div",
  "#favThemes",
];

async function clearHiddenDivs() {
  divIds.forEach((item) => {
    const div = document.querySelector(item);
    if (div) {
      if (hiddenProfileElementsTemp.includes(item)) {
        div.style.display = "none";
      } else {
        div.style.opacity = "1";
        div.style.pointerEvents = "auto";
      }
    }
  });
  $(".hide-button").remove();
  hideProfileElButton.textContent = "Hide";
}

function applyHiddenDivs() {
  hiddenProfileElements.forEach((item) => {
    if (divIds.includes(item)) {
      const div = document.querySelector(item);
      if (div) {
        div.style.display = "none";
      }
    }
  });
}

hideProfileElButton.onclick = () => {
  if (userNotHeaderUser) {
    window.location.href = "https://myanimelist.net/profile/" + headerUserName;
  } else {
    hiddenProfileElementsTemp = hiddenProfileElements.slice();
    if (hideProfileElButton.textContent === "Hide") {
      divIds.forEach((divId) => {
        const div = document.querySelector(divId);
        if (div) {
          div.style.removeProperty("display");
          if (hiddenProfileElementsTemp.includes(divId)) {
            div.style.opacity = ".1";
            div.style.pointerEvents = "none";
          }
        }
        if (div && !$(div).next().is(".hide-button")) {
          const hideButton = document.createElement("a");
          hideButton.textContent = hiddenProfileElementsTemp.includes(divId) ? "Show" : "Hide";
          hideButton.className = "hide-button mal-btn primary mt8 mb8";
          div.insertAdjacentElement("afterend", hideButton);
          hideButton.addEventListener("click", () => {
            hideButton.textContent = hideButton.textContent === "Hide" ? "Show" : "Hide";
            if (hiddenProfileElementsTemp.includes(divId)) {
              hiddenProfileElementsTemp = hiddenProfileElementsTemp.filter((className) => className !== divId);
              div.style.opacity = "1";
              div.style.pointerEvents = "auto";
            } else {
              hiddenProfileElementsTemp.push(divId);
              div.style.opacity = ".1";
              div.style.pointerEvents = "none";
            }
          });
        }
      });
    } else {
      clearHiddenDivs();
      hideProfileElButton.textContent = hideProfileElButton.textContent === "Hide" ? "Cancel" : "Hide";
    }
    hideProfileElButton.textContent = hideProfileElButton.textContent === "Hide" ? "Cancel" : "Hide";
  }
};

hideProfileElUpdateButton.onclick = () => {
  const pfElBase64 = LZString.compressToBase64(JSON.stringify(hiddenProfileElementsTemp));
  const pfElbase64url = pfElBase64.replace(/\//g, "_");
  editAboutPopup(`hideProfileEl/${pfElbase64url}`, "hideProfileEl");
  clearHiddenDivs();
};

removehideProfileElButton.onclick = () => {
  editAboutPopup(`hideProfileEl/...`, "hideProfileEl");
};

//Custom Profile Elements
var customProfileElUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton" }, "Add to Left Side");
var customProfileElRightUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton" }, "Add to Right Side");

customProfileElUpdateButton.onclick = () => {
  if (svar.modernLayout) {
    createCustomDiv();
  } else {
    createCustomDiv("right");
  }
};

customProfileElRightUpdateButton.onclick = () => {
  createCustomDiv("right");
};

//Custom Profile Background
let bgInput = create("input", { class: "bgInput", id: "bgInput" });
bgInput.placeholder = "Paste your Background Image Url here";
var bgButton = create("button", { class: "mainbtns", id: "custombg" }, "Update");
var bgRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "custombgRemove" });
var bgInfo = create("p", { class: "textpb" }, "");

bgButton.onclick = () => {
  bgInfo.innerText = "";
  if (bgInput.value.length > 1) {
    const bgBase64 = LZString.compressToBase64(JSON.stringify(bgInput.value));
    const bgbase64url = bgBase64.replace(/\//g, "_");
    editAboutPopup(`custombg/${bgbase64url}`, "bg");
    bgInput.addEventListener(`focus`, () => bgInput.select());
  } else {
    bgInfo.innerText = "Background Image url empty.";
  }
};
bgRemoveButton.onclick = () => {
  editAboutPopup(`custombg/...`, "bg");
};

//Custom Avatar
var pfButton = create("button", { class: "mainbtns", id: "custompf" }, "Update");
var pfRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "custompfRemove" });
let pfInput = create("input", { class: "pfInput", id: "pfInput" });
pfInput.placeholder = "Paste your Avatar Image Url here";
var pfInfo = create("p", { class: "textpb" }, "");
pfButton.onclick = () => {
  pfInfo.innerText = "";
  if (pfInput.value.length > 1) {
    const pfBase64 = LZString.compressToBase64(JSON.stringify(pfInput.value));
    const pfbase64url = pfBase64.replace(/\//g, "_");
    editAboutPopup(`custompf/${pfbase64url}`, "pf");
    pfInput.addEventListener(`focus`, () => pfInput.select());
  } else {
    pfInfo.innerText = "Avatar Image url empty.";
  }
};
pfRemoveButton.onclick = () => {
  editAboutPopup(`custompf/...`, "pf");
};

//Custom CSS
var cssButton = create("button", { class: "mainbtns", id: "customCSS" }, "Update");
var cssRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "customCSSRemove" });
var cssInfo = create("p", { class: "textpb" }, "");
let cssInput = create("input", { class: "cssInput", id: "cssInput" });
var cssmodernLayout = create("button", { class: "mainbtns", id: "cssmodernLayout", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var cssmodernLayoutText = create("h3", { style: { display: "inline" } }, "Custom CSS + Modern Profile Layout");
let cssmodernLayoutEnabled = false;
cssmodernLayout.onclick = () => {
  cssmodernLayoutEnabled = !cssmodernLayoutEnabled;
  cssmodernLayout.classList.toggle("btn-active", cssmodernLayoutEnabled);
};
cssInput.placeholder = "Paste your CSS here";
cssButton.onclick = () => {
  cssInfo.innerText = "";
  if (cssInput.value.length > 1) {
    cssInput.value = cssInput.value
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .replace(/\n+/g, "");
    const cssBase64 = LZString.compressToBase64(JSON.stringify([cssInput.value, cssmodernLayoutEnabled]));
    const cssbase64url = cssBase64.replace(/\//g, "_");
    editAboutPopup(`customCSS/${cssbase64url}`, "css");
    cssInput.addEventListener(`focus`, () => cssInput.select());
  } else {
    cssInfo.innerText = "Css empty.";
  }
};
cssRemoveButton.onclick = () => {
  editAboutPopup(`customCSS/...`, "css");
};

//Mal Badges
let malBadgesInput = create("input", { class: "malBadgesInput", id: "malBadgesInput" });
malBadgesInput.placeholder = "Paste your Mal-Badges Url Here";
var malBadgesButton = create("button", { class: "mainbtns", id: "malBadgesBtn" }, "Update");
var malBadgesRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "malBadgesRemove" });
var malBadgesDetailButton = create("button", { class: "mainbtns", id: "malBadgesBtn", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var malBadgesDetailButtonText = create("h3", { style: { display: "inline" } }, "Detailed Badge (Required Modern Layout)");
let malBadgesDetailButtonEnabled = false;
let malBadgesInfo = create("p", { class: "textpb" }, "");
malBadgesDetailButton.onclick = () => {
  malBadgesDetailButtonEnabled = !malBadgesDetailButtonEnabled;
  malBadgesDetailButton.classList.toggle("btn-active", malBadgesDetailButtonEnabled);
};

malBadgesButton.onclick = () => {
  if (malBadgesInput.value.length > 1) {
    try {
      malBadgesInfo.innerText = "";
      const url = new URL(malBadgesInput.value);
      if (url.hostname.endsWith("mal-badges.com")) {
        const detailMode = malBadgesDetailButtonEnabled ? "?detail" : "";
        const badgeBase64 = LZString.compressToBase64(JSON.stringify(malBadgesInput.value + detailMode));
        const badgeBase64Url = badgeBase64.replace(/\//g, "_");
        editAboutPopup(`malBadges/${badgeBase64Url}`, "malBadges");
        malBadgesInput.addEventListener(`focus`, () => bgInput.select());
      } else {
        malBadgesInfo.innerText = "Please enter a valid URL.\nExample: https://www.mal-badges.com/users/USERNAME";
      }
    } catch (e) {
      malBadgesInfo.innerText = "Please enter a valid URL.\nExample: https://www.mal-badges.com/users/USERNAME";
    }
  }
};
malBadgesRemoveButton.onclick = () => {
  editAboutPopup(`malBadges/...`, "malBadges");
};

//Custom Badge
var badgeButton = create("button", { class: "mainbtns", id: "custombadge" }, "Update");
let badgeInput = create("input", { class: "badgeInput", id: "badgeInput" });
let badgeColorSelector = create("input", { class: "badgeInput", id: "badgecolorselector", type: "color" });
let badgeColorLoop = create("button", { class: "mainbtns", id: "custombadgeColorLoop" }, "Rainbow");
let badgeColorLoopEnabled = false;
let badgeColorValue = "#000000";
badgeInput.placeholder = "Type your badge text here";
badgeColorLoop.onclick = () => {
  badgeColorLoopEnabled = !badgeColorLoopEnabled;
  if (badgeColorLoopEnabled) {
    badgeColorLoop.style.background = "var(--color-foreground2)";
    badgeColorValue = "loop";
  } else {
    badgeColorLoop.style.background = "var(--color-background)";
    badgeColorSelector.value = "#000000";
    badgeColorValue = "#000000";
  }
};
badgeColorSelector.addEventListener("input", (event) => {
  badgeColorValue = event.target.value;
  badgeColorLoop.style.background = "var(--color-background)";
  badgeColorLoopEnabled = false;
});
badgeButton.onclick = () => {
  if (badgeInput.value.length > 1) {
    const badgeBase64 = LZString.compressToBase64(JSON.stringify([badgeInput.value, badgeColorValue]));
    const badgebase64url = badgeBase64.replace(/\//g, "_");
    editAboutPopup(`custombadge/${badgebase64url}`, "badge");
    badgeInput.addEventListener(`focus`, () => badgeInput.select());
  } else {
    editAboutPopup(`custombadge/...`, "badge");
  }
};

//Custom Profile Colors
const createColorInput = () => create("input", { class: "customColorInput", type: "color" });
const customColorButton = create("button", { class: "mainbtns", id: "customColorUpdate" }, "Update");
const customColorRemoveButton = create("button", { class: "mainbtns fa fa-trash removeButton", id: "customColorRemove" });
const customColors = create("div", { class: "customColorsInside" });
let defaultLinkColor = getComputedStyle(document.body);
defaultLinkColor = defaultLinkColor.getPropertyValue("--color-link");

const customColorLabels = ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch", "Reading", "Completed", "On Hold", "Dropped", "Plan to Read", "Links"];

const customColorsDefault = ["#338543", "#2d4276", "#c9a31f", "#832f30", "#747474", "#338543", "#2d4276", "#c9a31f", "#832f30", "#747474", defaultLinkColor];

let colorValues;
const colorSelectors = Array.from({ length: customColorLabels.length }, (_, index) => {
  const colorInput = createColorInput();
  colorInput.value = customColorsDefault[index];
  colorInput.addEventListener("input", (event) => {
    colorValues = colorSelectors.map((selector) => selector.value);
    applyCustomColors(colorValues);
  });
  return colorInput;
});
const colorAnimeStats = create("div", { class: "colorGroup" }, "<b>Anime Stats</b>");
customColorLabels.slice(0, 5).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index], colorLabel);
  colorAnimeStats.appendChild(colorDiv);
});

const colorMangaStats = create("div", { class: "colorGroup" }, "<b>Manga Stats</b>");
customColorLabels.slice(5, 10).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index + 5], colorLabel);
  colorMangaStats.appendChild(colorDiv);
});

const colorProfile = create("div", { class: "colorGroup" }, "<b>Profile</b>");
customColorLabels.slice(10).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index + 10], colorLabel);
  colorProfile.appendChild(colorDiv);
});
customColors.append(colorAnimeStats, colorMangaStats, colorProfile);
customColorButton.onclick = () => {
  const colors = colorSelectors.map((selector) => selector.value);
  const customColorBase64 = LZString.compressToBase64(JSON.stringify(colors));
  const customColorBase64Url = customColorBase64.replace(/\//g, "_");
  editAboutPopup(`customcolors/${customColorBase64Url}`, "color");
};
customColorRemoveButton.onclick = () => {
  editAboutPopup(`customcolors/...`, "color");
};
