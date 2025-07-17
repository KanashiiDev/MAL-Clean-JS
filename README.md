# MAL-Clean-JS
Customizations and fixes for MyAnimeList!
<p align="left">
Made for the <a href="https://userstyles.world/style/10678/myanimelist-clean">MyAnimeList - Clean</a> userstyle, but users without it can also use it.
<br><br><a href="https://greasyfork.org/en/scripts/480965-mal-clean-js"><img src="https://shields.io/badge/GreasyFork-Install%20Userscript-ddd" alt="Get Userscript"/></a><br>
<h6><b><a href="https://files.catbox.moe/srlz3y.png">How to Open Settings</a></b></h6>
</p>
<p align="left">
<details><summary>Features</summary>
<b>Panel</b>
<li>Add more info to seasonal anime. <a href="https://files.catbox.moe/sn9rt6.png">[IMAGE]</a></li>
<li>Add recently added anime & manga. <a href="https://files.catbox.moe/97witl.png">[IMAGE]</a></li>
<li>Show currently watching anime & manga. <a href="https://files.catbox.moe/ayx26l.png">[IMAGE]</a></li>
<li>Auto add start/finish date to watching anime & reading manga.</li>
<li>Add next episode countdown to currently watching anime.</li>
<li>Modern Anime/Manga Links <a href="https://files.catbox.moe/yvrntr.png">[IMAGE]</a></li>
<li>Add live preview to the editor.</li><br>
<b>Anime</b>
<li>Hide non-Japanese Anime.</li>
<li>Replace OPs and EDs with animethemes.moe</li><br>
<b>Anime & Manga</b>
<li>Custom Cover Image. <a href="https://files.catbox.moe/kdzyv3.png">[IMAGE]</a></li>
<li>Dynamic background color based cover art's color palette.</li>
<li>Add banner image from Anilist.</li>
<li>Add tags from Anilist.</li>
<li>Replace relations.</li>
<li>Change title position.</li><br>
<b>Character</b>
<li>Dynamic background color based cover art's color palette.</li>
<li>Custom Character Image.</li>
<li>Show alternative name.</li><br>
<b>Character & People</b>
<li>Change name position.</li><br>
<b>Forum</b>
<li>Change date format.</li><br>
<b>Profile</b>
<li>Modern Profile Layout <i>(Custom avatar, banner and badge will be visible to users with the script)</i></li>
<li>Modern Anime/Manga List. <a href="https://files.catbox.moe/f6luis.png">[IMAGE]</a></li>
<li>Make profile private.</li>
<li>Add custom profile elements <i>(This will be visible to users with the script)</i> <a href="https://files.catbox.moe/l5mvra.png">[IMAGE]</a></li>
<li>Hide profile elements <i>(This will also apply to users with the script)</i></li>
<li>Show mutual friends.</li>
<li>Add anime themes (openings and endings) to your profile (This will be visible to users with the script) <a href="https://files.catbox.moe/y1a0oc.png">[IMAGE]</a></li>
<li>Custom profile colors <i>(This will be visible to users with the script)</i></li>
<li>Custom CSS <i>(This will be visible to users with the script)</i></li>
<li>Add more than 10 favorites <i>(This will be visible to users with the script)</i></li>
<li>Add Activity History <a href="https://files.catbox.moe/ywq9dy.png">[IMAGE]</a></li>
<li>Redesign Profile Comments <a href="https://files.catbox.moe/k45hbx.png">[IMAGE]</a></li></details></p>

# Build from Source
Follow these steps to build the project from source:

1. **Install Dependencies**: Make sure all required dependencies are installed by running the following command in your terminal: `npm install`

2. **Start the Build Process**: To begin the build process, run the following command: `npm run build`. This will compile the project and place the output in the `src/build/` directory.

3. **Output**: After the build is complete, the userscript will be available in the `src/build/` folder.

---

# Adding a New Language

To add a new language to **MAL-Clean-JS**, follow these steps:

1. **Create a Language File**: In the `src/data/languages/` folder, create a new `.json` file based on the structure of `English.json`.

2. **Build the Script**: After creating your language file, run the `npm run build` script to bundle your changes and create the updated userscript.

3. **Test Your Language File**: Make sure to test your language file locally to verify it works as expected.

4. **Submit a Pull Request**: If you would like to contribute your language file back to the project, feel free to submit a pull request!

---

# Adding a New Module

To add your own custom user module to **MAL-Clean-JS**, please follow the instructions in the detailed guide linked below:

### Steps to Add a Custom User Module

1. **Read the Guide**: Start by visiting our detailed guide on how to add a user module:
   [How to Add User Module](https://github.com/KanashiiDev/MAL-Clean-JS/blob/main/src/howToAddUserModule.js).

2. **Create Your Module**: After reviewing the guide, you can create your own custom module. A user module might include any functionality that you want to enhance or extend within the script.

3. **Test Your Module**: Make sure to test your module locally to verify it works as expected.

4. **Build the Script**: After adding your custom module, run the `npm run build` script to bundle your changes and create the updated userscript.

5. **Submit a Pull Request**: If you'd like to contribute your module back to the project, feel free to submit a pull request!

By following the steps in the guide, you can easily integrate your user module into **MAL-Clean-JS**.

---

# Copyright

Copyright (C) 2023-2025 KanashiiDev and the Mal-Clean-JS contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.