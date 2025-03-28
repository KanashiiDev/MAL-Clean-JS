m4_divert(-1)m4_dnl
m4_changequote(<m4<,>m4>)
m4_define(MALCLEAN_VERSION,1.29.94)
m4_divert(0)m4_dnl
// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @version     MALCLEAN_VERSION
// @description Customizations and fixes for MyAnimeList
// @author      KanashiiDev
// @match       https://myanimelist.net/*
// @match       https://www.mal-badges.com/users/*malbadges*
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Clean-JS/issues
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require     https://cdn.jsdelivr.net/npm/colorthief@2.4.0/dist/color-thief.min.js
// @require     https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/cjs/tinycolor.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@3.1.4/dist/purify.min.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2023-2025 KanashiiDev and the MAL-Clean-JS contributors
//
// SPDX-License-Identifier: GPL-3.0-or-later
m4_include(settings.js)
m4_include(utilities.js)
m4_include(polyfills.js)
m4_include(css/main.css.js)
(async function() {
"use strict";
/*
	Customizations and fixes for MyAnimeList
*/
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
*/
m4_include(settings/main.js)
m4_include(settings/objects.js)
m4_include(settings/build.js)
m4_include(controller.js)
m4_include(build/userModules.js)
})()