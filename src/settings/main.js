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

// MalClean Settings - Buttons Config
const buttonsConfig = Object.keys(svar).map((setting) => ({
  setting: setting,
  id: setting + "Btn",
  text: null,
  enabled: svar[setting],
}));
buttonsConfig.push({ setting: "removeAllCustom", id: "removeAllCustomBtn", text: "Remove All Custom Profile Settings" });

if (!defaultMal) {
  buttonsConfig.push({ id: "headerSlideBtn", setting: "headerSlide" }, { id: "headerOpacityBtn", setting: "headerOpacity" });
} else {
  svar.headerSlide = 0;
  svar.headerOpacity = 0;
}
// MalClean Settings - Create Buttons
function createButton({ id, setting, text }) {
  const button = create("button", { class: "mainbtns", id });
  if (text) button.textContent = text;
  if (setting === "removeAllCustom") button.setAttribute("style", "color: #e06c64 !important;font-weight: bold;");
  button.onclick = () => {
    if (setting === "removeAllCustom") {
      const userConfirmed = confirm("Are you sure you want to remove all custom profile settings?");
      if (userConfirmed) {
        editAboutPopup(`...`, "removeAll");
      }
    } else if (setting !== "removeAllCustom" || setting !== "save") {
      svar[setting] = !svar[setting];
      svar.save();
      getSettings();
      reloadset();
    }
  };
  return button;
}

//MalClean Settings - Create Custom Settings Div Function
function createCustomSettingDiv(title, description, elementsToAppend, svar = "0", forProfile) {
  const div = create(
    "div",
    { class: "malCleanSettingContainer" },
    `<div class="malCleanSettingHeader">
       <h2>${title}</h2>
       <h3>${description}</h3>
       <div class="malCleanSettingInner"></div>
     </div>`
  );
  const innerDiv = div.querySelector(".malCleanSettingInner");
  let profileCheck = forProfile ? userNotHeaderUser : false;
  if (!profileCheck) {
    if (svar === "0" || svar) {
      if (elementsToAppend && Array.isArray(elementsToAppend)) {
        elementsToAppend.forEach((element) => {
          innerDiv.append(element);
        });
      }
    }
  } else {
    const profileBtn = create("button", { class: "mainbtns", id: "backToProfile", style: { width: "98%" } }, "Back to My Profile");
    profileBtn.onclick = () => {
      window.location.href = "https://myanimelist.net/profile/" + headerUserName;
    };
    innerDiv.append(profileBtn);
  }
  return div;
}

//MalClean Settings - Create Settings Dropdown
function createSettingDropdown(parentElement, type, svar, settingKey, text) {
  let settingDiv;
  let settingContainer = create("div", { class: "settingContainer" });
  let hasSettings = document.querySelector(`${parentElement} .malCleanSettingPopup`);
  if (!hasSettings) {
    let settingButton = create("a", { active: "0", class: "fa fa-gear" });
    settingDiv = create("div", { class: "malCleanSettingPopup", style: { display: "none" } });
    settingButton.onclick = () => {
      const active = $(settingButton).attr("active");
      if (active === "0") {
        $(settingDiv).slideDown();
        $(settingButton).attr("active", "1");
        if (type === "svar") getSettings();
      } else {
        $(settingDiv).slideUp();
        $(settingButton).attr("active", "0");
      }
    };

    $(parentElement).append(settingButton);
    $(settingButton).parent().append(settingDiv);
  }
  let targetDiv = hasSettings || settingDiv;
  if (type === "svar") {
    // Svar Settings
    const buttons = buttonsConfig.reduce((acc, { id, setting, text }) => {
      acc[id] = createButton({ id, setting, text });
      return acc;
    }, {});
    settingContainer.classList.add("svar");
    $(settingContainer).append(buttons[settingKey], `<h3>${text}</h3>`);
    $(targetDiv).append(settingContainer);
  } else if (type === "ttl") {
    // TTL Settings
    let settingInput = create("input", { class: `${settingKey}Input`, placeholder: "Days (Number)" });
    if (svar[settingKey]) settingInput.value = daysToTTL(svar[settingKey], 1);
    settingContainer.classList.add("input");
    $(settingContainer).append(`<h3>How often should the ${text} data be updated? (Days)</h3>`, settingInput);
    $(targetDiv).append(settingContainer);

    settingInput.addEventListener("input", (event) => {
      const ttl = daysToTTL(event.target.value);
      svar[settingKey] = ttl;
      svar.save();
    });
  }
}
