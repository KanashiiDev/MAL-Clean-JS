//create your own module
//create a javascript file called yourModule.js inside the “userModules” file inside the folders for specific categories in the “modules” directory.
//Example: If your userModule is for “My Panel”, you should add your userModule to the src\modules\Panel\userModules folder.

exportModule({
  name: "My First Module", // The name of your module (visible on the settings page)
  id: "myFirstModule", // A unique ID (use camelCase, lowercase letters and numbers)
  defaultValue: true, // Should the module be enabled by default?
  author: "YourName", // Author of the module
  description: "This module does something useful. Describe it here!", // Short description of what the module does
  category: "Profile", // Available categories: My Panel, Anime Manga, Character, People, Blog, Club, Forum, Profile
  priority: 0, // Controls the order on the settings page (lower = higher priority)

  urlMatch: function () {
    // This function should return true if the module should run on the current page
    // Example: Run only on profile pages
    return location.pathname.startsWith("/profile/");
  },

  code: function () {
    // This is where your main module logic goes.
    if (svar.myOptionSetting) {
      console.log("My extra Feture is active!");
    }
  },

  dropdown: function () {
    // Use this to add extra settings (visible in the settings panel)

    // 🔘 Toggle Option
    createSettingDropdown("#myFirstModule", "option", "myOptionSetting", true, "Enable this extra Feature?");

    // ⏳ TTL (Time To Live) Setting - update interval in days
    createSettingDropdown("#myFirstModule", "ttl", "myTTLSetting", 3, "How often should data be refreshed? (Days)");

    // ⌨️ Input Field
    createSettingDropdown("#myFirstModule", "input", "myInputSetting", "Default value", "Your Input Title");

    // 🔽 Select Dropdown
    createSettingDropdown("#myFirstModule", "select", "mySelectSetting", "option2", "Choose your option:", [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ]);
    // 🔽 Slider
      createSettingDropdown("#myFirstModule", "slider", "mySliderSetting", 10, "Choose your select Range:", [0, 100, 1]);
  },

  css: `
    /* Optional custom CSS goes here */
    .my-first-module-class {
      color: red;
      font-weight: bold;
    }
  `,
});
