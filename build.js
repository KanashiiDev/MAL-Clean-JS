import fs from "fs";
import path from "path";
import { glob } from "glob";

(async () => {
  // Modules to be included in Async
  const asyncModules = ["src/moduleController.js", "src/settings/main.js", "src/settings/objects.js", "src/settings/build.js", "src/controller.js"];

  // Build Modules
  const buildModules = [...(await glob("src/modules/**/*.js"))];
  buildModules.sort();

  // Modules outside Async
  const topLevelModules = ["src/settings.js", "src/utilities.js", "src/polyfills.js", "src/css/main.css.js", "src/localization.js"];

  const OUTPUT_FILE = "src/build/malclean.user.js";
  const LANGUAGES = [...(await glob("src/data/languages/*.json"))];
  LANGUAGES.sort();

  // Load Languages
  function loadLanguageJson() {
    const baseDir = "src/data/languages";
    const result = {};
    for (const language of LANGUAGES) {
      const key = path.basename(language, ".json");
      const content = fs.readFileSync(path.join(language), "utf8");
      result[key === "raw_keys" ? "$raw_keys" : key] = JSON.parse(content);
    }
    return result;
  }

  // Read localization.js and Change
  function readAndPatchLocalization(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const languageData = loadLanguageJson();
    const jsonStr = JSON.stringify(languageData, null, 2);

    return content.replace("this.languages = __LANGUAGE_JSON__;", `this.languages = ${jsonStr};`);
  }

  // Get version from package.json
  function getVersion() {
    return new Promise((resolve, reject) => {
      fs.readFile("package.json", "utf8", (err, data) => {
        if (err) {
          reject("File Reading Error: " + err);
          return;
        }
        const packageJson = JSON.parse(data);
        const version = packageJson.version;
        resolve(version);
      });
    });
  }
  const version = await getVersion();
  const metadata = `// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @version     ${version}
// @description Customizations and fixes for MyAnimeList
// @author      KanashiiDev
// @match       https://myanimelist.net/*
// @match       https://www.mal-badges.com/users/*malbadges*
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Clean-JS/issues
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require     https://cdn.jsdelivr.net/npm/colorthief@2.6.0/dist/color-thief.min.js
// @require     https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/cjs/tinycolor.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@3.2.5/dist/purify.min.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2023-2025 KanashiiDev and the MAL-Clean-JS contributors
//
// SPDX-License-Identifier: GPL-3.0-or-later
/*
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.

	<https://www.gnu.org/licenses/>.
*/`;

  // Read Modules
  function readModules(files) {
    return files.map((filePath) => {
      let content;
      if (filePath.endsWith("localization.js")) {
        content = readAndPatchLocalization(filePath);
      } else {
        content = fs.readFileSync(filePath, "utf-8");
      }
      return `// ==== ${path.basename(filePath)} ====\n${content}`;
    });
  }

  // Combine
  const result = [metadata, "", ...readModules(topLevelModules), "", '(async function () {\n"use strict";\n', ...readModules(asyncModules), ...readModules(buildModules), "})();"];

  // Write
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, result.join("\n"));

  console.log(`Built userscript to ${OUTPUT_FILE}`);
})();
