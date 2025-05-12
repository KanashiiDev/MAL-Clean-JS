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
function reloadset() {
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
      reloadset();
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
      settingUI = createSelectSetting(settingKey, text, options);
      break;
    case "slider":
      settingUI = createSliderSetting(settingKey, text, options, defaultValue);
      break;
  }

  if (settingUI) {
    $(targetDiv).append(settingUI);
  }
}
