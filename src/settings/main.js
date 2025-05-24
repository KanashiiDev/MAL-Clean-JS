//MalClean Settings - Close Settings Div
function closeDiv() {
  $(".malCleanMainContainer").remove();
  clearHiddenDivs();
  settingsActive = !1;
}

//MalClean Settings - Settings Open & Close
function Settings() {
  settingsActive = !settingsActive;
  if (settingsActive) {
    createDiv();
  }
  if (!settingsActive) {
    closeDiv();
  }
}
//MalClean Settings - Settings Button
stButton.onclick = () => {
  Settings();
};

//MalClean Settings - Close Button
var closeButton = create("button", { class: "mainbtns fa fa-x", id: "closebtn" });
closeButton.onclick = () => {
  closeDiv();
};

// MalClean Inner Settings
const innerSettingsButton = create("button", { active: "0", class: "mainbtns fa fa-gear", id: "innerSettingsBtn" });
const settingDiv = create("div", { class: "malCleanSettingInnerSettings malCleanSettingPopup", style: { display: "none" } });
innerSettingsButton.addEventListener("click", () => {
  const target = document.querySelector("div.malCleanMainHeader > div.malCleanMainHeaderTitle");
  const isActive = innerSettingsButton.getAttribute("active") === "1";

  if (!settingDiv.children.length) {
    settingDiv.append(createSettingSection(translate("$languageSelector"), initLanguageSelector()));
  }

  if (isActive) {
    $(settingDiv).slideUp();
    innerSettingsButton.setAttribute("active", "0");
  } else {
    target.insertAdjacentElement("afterend", settingDiv);
    $(settingDiv).slideDown();
    innerSettingsButton.setAttribute("active", "1");
  }
});

// MalClean Inner Settings - Create Setting
function createSettingSection(title, ...contents) {
  const section = create("div", { class: "setting-section" });
  const label = create("p", { class: "setting-section-text" }, title);
  section.append(label, ...contents);
  return section;
}

//MalClean Settings - Reload Button
var reloadButton = create("button", { class: "mainbtns fa fa-refresh", id: "reloadbtn" });
reloadButton.onclick = () => {
  window.location.reload();
};

//MalClean Settings - Refresh Page Button Animation
function reloadWarn() {
  reloadButton.setAttribute("style", "animation:reloadLoop 2.5s infinite");
}

//MalClean Settings - Disable Buttons
function disableButton(button, title) {
  const tooltip = create("div", { class: "title-note-inner" });
  tooltip.innerText = title;
  $("#" + button)
    .prop("disabled", true)
    .addClass("disabled")
    .removeClass("btn-active")
    .append(tooltip);
}

//MalClean Settings - Tooltip Buttons
function tooltipButton(button, title) {
  const tooltip = create("div", { class: "tooltip title-note-inner" });
  tooltip.innerText = title;
  const btn = $("#" + button);
  if (!btn.hasClass("disabled")) {
    btn.addClass("tooltip").append(tooltip);
  }
}

// MalClean Settings - Buttons Config
function getButtonsConfig() {
  const config = Object.keys(svar).map((setting) => ({
    setting,
    id: setting.endsWith("Btn") ? setting : setting + "Btn",
    text: null,
    enabled: svar[setting],
  }));

  // Special Buttons
  config.push({
    setting: "removeAllCustom",
    id: "removeAllCustomBtn",
    text: translate("$removeAllCustomSettings"),
    enabled: true,
  });

  if (!defaultMal) {
    config.push({ id: "headerSlideBtn", setting: "headerSlide", text: null, enabled: true }, { id: "headerOpacityBtn", setting: "headerOpacity", text: null, enabled: true });
  } else {
    svar.headerSlide = 0;
    svar.headerOpacity = 0;
  }

  return config;
}

// MalClean Settings - Create Buttons
function createButton({ id, setting, text }) {
  const button = create("button", { class: "mainbtns", id });
  if (text) button.textContent = text;
  if (setting === "removeAllCustom") button.setAttribute("style", "color: #e06c64 !important;font-weight: bold; width:98%;");
  button.onclick = async () => {
    if (setting === "removeAllCustom") {
      const userConfirmed = confirm("Are you sure you want to remove all custom profile settings?");
      if (userConfirmed) {
        await localforage.dropInstance({ name: "MalJS" });
        await editAboutPopup(`...`, "removeAll");
      }
    } else if (setting !== "removeAllCustom" && setting !== "save") {
      svar[setting] = !svar[setting];
      svar.save();
      getSettings();
      reloadWarn();
    }
  };
  return button;
}

//MalClean Settings - Create Custom Settings Div Function
function createCustomSettingDiv(title, description, elementsToAppend, buttonsToAppend, buttonsWidth, infoToAppend, svar = "0", forProfile) {
  const div = create(
    "div",
    { class: "malCleanSettingContainer", id: forProfile ? "Profile" : "default" },
    `<div class="malCleanSettingHeader">
       <h2>${title}</h2>
       <h3>${description}</h3>
       <div class="malCleanSettingInner"></div>
       <div class="malCleanSettingButtons" style= "grid-template-columns: ${buttonsWidth};"></div>
       <div class="malCleanSettingInfo"></div>
     </div>`
  );
  const innerDiv = div.querySelector(".malCleanSettingInner");
  const buttonDiv = div.querySelector(".malCleanSettingButtons");
  const infoDiv = div.querySelector(".malCleanSettingInfo");
  let profileCheck = forProfile ? userNotHeaderUser : false;
  if (!profileCheck) {
    if (svar === "0" || svar) {
      if (elementsToAppend && Array.isArray(elementsToAppend)) {
        elementsToAppend.forEach((element) => {
          innerDiv.append(element);
        });
      } else {
        innerDiv.remove();
      }
      if (buttonsToAppend && Array.isArray(buttonsToAppend)) {
        buttonsToAppend.forEach((button) => {
          buttonDiv.append(button);
        });
      } else {
        buttonDiv.remove();
      }
      if (infoToAppend && Array.isArray(infoToAppend)) {
        infoToAppend.forEach((info) => {
          if (info === "<br>") {
            infoDiv.append(document.createElement("br"));
          } else {
            infoDiv.append(info);
          }
        });
      } else {
        infoDiv.remove();
      }
    }
  } else {
    const profileBtn = create("button", { class: "mainbtns", id: "backToProfile", style: { width: "98%" } }, translate("$backToMyProfile"));
    profileBtn.onclick = () => {
      window.location.href = "https://myanimelist.net/profile/" + headerUserName;
    };
    innerDiv.append(profileBtn);
    buttonDiv.remove();
    infoDiv.remove();
  }
  return div;
}

//MalClean Settings - Create Settings Dropdown Elements
function initSetting(settingKey, type, defaultValue) {
  if (svar[settingKey] === undefined) {
    svar[settingKey] = type === "ttl" ? daysToTTL(defaultValue) : defaultValue;
    svar.save();
    reloadWarn();
  }
}

// Function to create Input settings
function createInputSetting(settingKey, text) {
  const container = create("div", { class: "settingContainer input" });
  const input = create("input", { class: `${settingKey}Input`, placeholder: "Input" });
  input.value = svar[settingKey];

  input.addEventListener(
    "input",
    debounce((e) => {
      svar[settingKey] = e.target.value;
      svar.save();
      reloadWarn();
    }, 300)
  );

  $(container).append(`<h3>${text}</h3>`, input);
  return container;
}

// Function to create ttl settings
function createTTLSetting(settingKey, text) {
  const container = create("div", { class: "settingContainer input" });
  const input = create("input", { class: `${settingKey}Input`, placeholder: "Days (Number)" });
  input.value = daysToTTL(svar[settingKey], 1);

  input.addEventListener(
    "input",
    debounce((e) => {
      svar[settingKey] = daysToTTL(e.target.value);
      svar.save();
      reloadWarn();
    }, 300)
  );

  $(container).append(`<h3>${text}</h3>`, input);
  return container;
}

// Function to create option settings
function createOptionSetting(settingKey, text) {
  const container = create("div", { class: "settingContainer svar", id: "settingContainer-" + settingKey });
  const buttons = getButtonsConfig().reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  const btn = buttons[settingKey + "Btn"];
  if (!btn) {
    console.warn(`No button found for settingKey: ${settingKey}`);
    return null;
  }

  $(container).append(btn, `<h3>${text}</h3>`);
  return container;
}

// Function to create select settings
function createSelectSetting(settingKey, text, options = [], defaultValue) {
  const container = create("div", { class: "settingContainer input" });
  const label = create("h3", {}, text);
  const select = create("select", { class: `${settingKey}Select` });

  options.forEach((opt) => {
    const optionEl = create("option", { value: opt.value }, opt.label);
    if (svar[settingKey] === opt.value || (svar[settingKey] === undefined && opt.value === defaultValue)) {
      optionEl.selected = true;
    }
    select.appendChild(optionEl);
  });

  select.addEventListener("change", (e) => {
    svar[settingKey] = e.target.value;
    svar.save();
    reloadWarn();
  });

  container.appendChild(label);
  container.appendChild(select);

  return container;
}

// Function to create slider settings
function createSliderSetting(settingKey, text, options = [], defaultValue) {
  const [min, max] = options;

  const sliderWrapper = create("div", { class: "settingContainer slider" });
  const sliderLabel = create("label", { for: settingKey }, text);
  const sliderInput = create("input", {
    type: "range",
    id: settingKey,
    name: settingKey,
    min: min,
    max: max,
    value: defaultValue,
    class: "sliderInput",
  });

  const debouncedUpdate = debounce((event) => {
    svar[settingKey] = event.target.value;
    svar.save();
    reloadWarn();
  }, 500);

  sliderInput.addEventListener("change", debouncedUpdate);

  const sliderValueDisplay = create("span", { class: "sliderValue" }, defaultValue);

  sliderInput.oninput = function () {
    sliderValueDisplay.textContent = sliderInput.value;
  };

  sliderWrapper.append(sliderLabel);
  sliderWrapper.append(sliderInput);
  sliderWrapper.append(sliderValueDisplay);

  return sliderWrapper;
}

function createRecentlyFilter(settingKey, text) {
  const includedGenreIds = new Set();
  const excludedGenreIds = new Set();

  const filterValue = svar[settingKey];
  if (filterValue) {
    const decoded = decodeURIComponent(filterValue);
    const params = new URLSearchParams(decoded);

    for (const [key, value] of params.entries()) {
      if (key === "genre[]") {
        includedGenreIds.add(parseInt(value));
      } else if (key === "genre_ex[]") {
        excludedGenreIds.add(parseInt(value));
      }
    }
  }

  const genreList = [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 5, name: "Avant Garde" },
    { id: 46, name: "Award Winning" },
    { id: 28, name: "Boys Love" },
    { id: 4, name: "Comedy" },
    { id: 8, name: "Drama" },
    { id: 10, name: "Fantasy" },
    { id: 26, name: "Girls Love" },
    { id: 47, name: "Gourmet" },
    { id: 14, name: "Horror" },
    { id: 7, name: "Mystery" },
    { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" },
    { id: 36, name: "Slice of Life" },
    { id: 30, name: "Sports" },
    { id: 37, name: "Supernatural" },
    { id: 45, name: "Suspense" },
    { id: 42, name: "Josei" },
    { id: 15, name: "Kids" },
    { id: 41, name: "Seinen" },
    { id: 25, name: "Shoujo" },
    { id: 27, name: "Shounen" },
    { id: 49, name: "Erotica" },
    { id: 9, name: "Ecchi" },
    { id: 12, name: "Hentai" },
  ].map((genre) => {
    if (includedGenreIds.has(genre.id)) {
      return { ...genre, selected: true };
    } else if (excludedGenreIds.has(genre.id)) {
      return { ...genre, excluded: true };
    } else {
      return genre;
    }
  });

  const filterWrapper = create("div", { class: "settingContainer filter anime-search-filter" });
  filterWrapper.setAttribute("style", "display: grid;grid-template-columns: 1fr 1fr;");
  function createGenreFilter(containerSelector, genres) {
    const container = containerSelector;
    container.classList.add("category-wrapper");

    const header = create("div", { class: "fs10 fw-b mb4 category-type", style: { gridColumn: "1/-1" } }, "Genres");
    container.appendChild(header);
    const loadingIndicator = create("div", { class: "recently-genre-indicator" });
    const debouncedSaveGenres = debounce(() => {
      if (svar.recentlyAddedAnime && location.pathname === "/" && settingKey === "recentlyAnimeFilter") {
        createRecentlyAddedWidget("anime");
      }

      if (svar.recentlyAddedManga && location.pathname === "/" && settingKey === "recentlyMangaFilter") {
        createRecentlyAddedWidget("manga");
      }
      loadingIndicator.remove();
    }, 2000);

    genres.forEach(({ id, name, selected, excluded }) => {
      const span = create("span", { class: `mb4 btn-sort-order js-btn-sort-order${selected ? " selected" : excluded ? " crossed" : ""}` });

      const input = create("input", { value: id, type: "checkbox", id: `genre-${id}`, name: selected ? "genre[]" : excluded ? "genre_ex[]" : "genre[]" });
      input.style.display = "none";
      if (selected) input.checked = true;

      span.addEventListener("click", () => {
        if (span.classList.contains("selected")) {
          span.classList.remove("selected");
          span.classList.add("crossed");
          input.name = "genre_ex[]";
        } else if (span.classList.contains("crossed")) {
          span.classList.remove("crossed");
          input.name = "genre[]";
        } else {
          span.classList.add("selected");
          input.name = "genre[]";
        }
        svar[settingKey] = buildGenreUrl(svar[settingKey]);
        svar.save();
        if (!document.querySelector(".recently-genre-indicator")) {
          header.append(loadingIndicator);
        }
        loadingIndicator.style.display = "none";
        void loadingIndicator.offsetWidth;
        loadingIndicator.style.display = "block";
        debouncedSaveGenres();
      });

      const label = document.createElement("p");
      label.textContent = `${name}`;

      span.appendChild(input);
      span.appendChild(label);
      container.appendChild(span);
    });

    const showAll = document.createElement("a");
    showAll.className = "show-all-btn";
    showAll.style.display = "none";
    showAll.textContent = "Show All";

    container.appendChild(showAll);
  }

  createGenreFilter(filterWrapper, genreList);

  function buildGenreUrl(existingParams = "") {
    const includedGenres = new Set();
    const excludedGenres = new Set();

    if (existingParams) {
      const decoded = decodeURIComponent(existingParams);
      const params = new URLSearchParams(decoded);

      for (const [key, value] of params.entries()) {
        if (key === "genre[]") {
          includedGenres.add(parseInt(value));
        } else if (key === "genre_ex[]") {
          excludedGenres.add(parseInt(value));
        }
      }
    }

    filterWrapper.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      const span = checkbox.closest("span");
      const genreId = parseInt(checkbox.value);

      if (span.classList.contains("selected")) {
        includedGenres.add(genreId);
        excludedGenres.delete(genreId);
      } else if (span.classList.contains("crossed")) {
        excludedGenres.add(genreId);
        includedGenres.delete(genreId);
      } else {
        includedGenres.delete(genreId);
        excludedGenres.delete(genreId);
      }
    });

    const params = [];

    for (const id of includedGenres) {
      params.push(`genre%5B%5D=${id}`);
    }

    for (const id of excludedGenres) {
      params.push(`genre_ex%5B%5D=${id}`);
    }

    return params.length ? "&" + params.join("&") : "";
  }

  return filterWrapper;
}

//MalClean Settings - Create Settings Dropdown
async function createSettingDropdown(parentElement, type, settingKey, defaultValue = true, text, options = []) {
  if (typeof parentElement === "string" && !parentElement.endsWith("Btn")) {
    parentElement += "Btn";
  }

  initSetting(settingKey, type, defaultValue);

  let settingDiv;
  const existingSettings = document.querySelector(`${parentElement}Option .malCleanSettingPopup`);

  if (!existingSettings) {
    const settingButton = create("a", { active: "0", class: "fa fa-gear" });
    settingDiv = create("div", { class: "malCleanSettingPopup", style: { display: "none" } });

    settingButton.onclick = () => {
      const active = $(settingButton).attr("active");
      if (active === "0") {
        $(settingDiv).slideDown();
        $(settingButton).attr("active", "1");
        if (type === "option") getSettings();
      } else {
        $(settingDiv).slideUp();
        $(settingButton).attr("active", "0");
      }
    };

    $(`${parentElement}Option`).append(settingButton);
    $(settingButton).parent().append(settingDiv);
  }

  const targetDiv = existingSettings || settingDiv;
  let settingUI = null;

  switch (type) {
    case "input":
      settingUI = createInputSetting(settingKey, text);
      break;
    case "ttl":
      settingUI = createTTLSetting(settingKey, text);
      break;
    case "option":
      settingUI = createOptionSetting(settingKey, text);
      break;
    case "select":
      settingUI = createSelectSetting(settingKey, text, options, defaultValue);
      break;
    case "slider":
      settingUI = createSliderSetting(settingKey, text, options, defaultValue);
      break;
    case "recentlyFilter":
      settingUI = createRecentlyFilter(settingKey, text);
      break;
  }

  if (settingUI) {
    $(targetDiv).append(settingUI);
  }
}
