// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @match       https://myanimelist.net/*
// @grant       none
// @version     1.07
// @author      KanashiiDev
// @description Extra customization for MyAnimeList - Clean Userstyle
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Clean-JS/issues
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require     https://cdn.jsdelivr.net/npm/colorthief@2.4.0/dist/color-thief.min.js
// @require     https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/cjs/tinycolor.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// ==/UserScript==

//Create Element Shorthand Function
function create(e, t, n) {
  if (!e) throw SyntaxError("'tag' not defined");
  var r,
    i,
    f = document.createElement(e);
  if (t)
    for (r in t)
      if ('style' === r) for (i in t.style) f.style[i] = t.style[i];
      else t[r] && f.setAttribute(r, t[r]);
  return n && (f.innerHTML = n), f;
}

//Time Calculate for Anilist Style Activities
function nativeTimeElement(e) {
  let $ = new Date(1e3 * e);
  return (function e() {
    let r = Math.round(new Date().valueOf() / 1e3) - Math.round($.valueOf() / 1e3);
    if (0 === r) return 'Now';
    if (1 === r) return '1 second ago';
    if (r < 60) return r + ' seconds ago';
    if (r < 120) return '1 minute ago';
    if (r < 3600) return Math.floor(r / 60) + ' minutes ago';
    else if (r < 7200) return '1 hour ago';
    else if (r < 86400) return Math.floor(r / 3600) + ' hours ago';
    else if (r < 172800) return '1 day ago';
    else if (r < 604800) return Math.floor(r / 86400) + ' days ago';
    else if (r < 1209600) return '1 week ago';
    else if (r < 2419200) return Math.floor(r / 604800) + ' weeks ago';
    else if (r < 29030400) return Math.floor(r / 2419200) + ' months ago';
    else return Math.floor(r / 29030400) + ' years ago';
  })();
}

//Set Element Shorthand Function
function set(q, tag, attrs, html) {
  if (q === 1) {
    tag = document.querySelector(tag);
  }
  if (q === 2) {
    tag = document.querySelectorAll(tag);
  }
  if (!tag) {
    return;
  }
  var ele = tag,
    attrName,
    styleName;
  if (attrs)
    for (attrName in attrs) {
      if (attrName === 'style')
        for (styleName in attrs.style) {
          ele.style[styleName] = attrs.style[styleName];
        }
      if (attrName === 'sa')
        for (styleName in attrs.sa) {
          ele.setAttribute('style', attrs.sa[styleName]);
        }
      if (attrName === 'sap')
        for (styleName in attrs.sap) {
          ele.parentElement.setAttribute('style', attrs.sap[styleName]);
        }
      if (attrName === 'r') {
        ele.remove();
      }
      if (attrName === 'pp')
        for (styleName in attrs.pp) {
          ele.prepend(document.querySelector(attrs.pp[styleName]));
        }
      if (attrName === 'sal')
        for (styleName in attrs.sal) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].setAttribute('style', attrs.sal[styleName]);
          }
        }
      if (attrName === 'sl')
        for (styleName in attrs.sl) {
          for (let x = 0; x < tag.length; x++) {
            tag[x].style[styleName] = attrs.sl[styleName];
          }
        }
    }
  if (html) ele.innerHTML = html;
  return ele;
}

let svar = {
  animebg: true,
  charbg: true,
  peopleHeader: true,
  animeHeader: true,
  characterHeader: true,
  characterNameAlt: true,
  profileHeader: true,
  customcss: true,
  alstyle: true,
};

svar.save = function () {
  localStorage.setItem('maljsSettings', JSON.stringify(svar));
};
const svarSettings = JSON.parse(localStorage.getItem('maljsSettings'));
if (!svarSettings) {
  svar.save();
}
if (svar) {
  let keys = Object.keys(svarSettings);
  keys.forEach((key) => (svar[key] = svarSettings[key]));
}

//Settings CSS
var styles = `
.maindiv {
    right: 0;
    width: 500px;
    margin: auto;
    margin-right: 15px;
    -webkit-transition: 1s;
    -o-transition: 1s;
    transition: 1s;
    position: fixed;
    top:55px;
    z-index:11;
    background-color: var(--color-foreground)!important;
    overflow-y: scroll;
    display: -ms-grid;
    display: grid;
    color: rgb(var(--color-text));
    padding: 10px;
    border: 1px solid #6969694d;
    -webkit-border-radius: 10px;
            border-radius: 10px
    }
.childdiv{
    border-top:1px solid;
    margin-top:10px;
    }
.textpb{
    padding-top:5px!important;
    font-weight:bold
    }
.textpb a{
    color: rgb(var(--color-link))!important;
    }
.maindivheader {
    margin-bottom: 5px;
    margin-left: 5px;
    display: grid;
    grid-template-columns: 4fr 1fr 1fr;
    align-items: center;
    font-size: medium;
    }
.buttonsDiv {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    word-break: break-word;
    white-space-collapse: break-spaces;
    }
.buttonsDiv > .mainbtns {
    display: grid;
    grid-template-rows: 15px 10px;
    align-items: center
    }
.mainbtns {
    -webkit-transition:0.25s;
    -o-transition:0.25s;
    transition:0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    padding: 4px;
    margin: 4px;
    cursor: pointer;
     background-color: var(--color-background);
    color: rgb(var(--color-text));
    }
    .mainbtns:hover{
    transform:scale(1.04)
    }
.mainbtns hr{
    width:100%
}
.btn-active {
    background-color: var(--color-foreground4)!important;
    color: rgb(159, 173, 189)
    }
    @keyframes reloadLoop {
  0% {
    background-color: var(--color-background);
  }
  50% {
    background-color: var(--color-foreground4);
  }
  100% {
    background-color: var(--color-background);
  }
}
button#customcss,
button#custombg,
button#custompf{
    height: 40px;
    width: 45%;
}
input#cssinput,
input#bginput,
input#pfinput{
    width: 47%;
    height: 15px;
    margin-right: 5px;
}
.maindiv .childdiv h2{
    background: var(--fg2);
    border-radius: var(--br);
    padding: 5px;
    }
.maindiv .childdiv h3 {
    font-weight:500
    }`;

//CSS fix for TinyColor
var styles2 = `
.anisongs .theme-songs.js-theme-songs {
    margin-bottom:5px
    }
.anisongs video {
    width: 379px;
    margin-top: 10px
    }
.anisongs .oped-preview-button.oped-preview-button-gray {
    cursor: pointer;
    display: inline-block;
    height: 8px;
    margin-bottom: -3px;
    width: 15px;
    -webkit-filter: invert(100%) hue-rotate(180deg) brightness(75%);
    filter: invert(100%) hue-rotate(180deg) brightness(75%);
    }
footer {
    z-index: 0;
    margin-top: 65px!important;
    position: relative
    }
.dark-mode .profile .user-statistics,
    .profile .user-statistics {
    width: 99%
    }
.dark-mode .profile .user-comments .comment,
.profile .user-comments .comment,
.dark-mode .page-common .content-container .container-right h2,
.page-common .content-container .container-right h2,
.dark-mode .fav-slide-block,
.fav-slide-block {
    width: 96%
    }
#myanimelist:before {
    content: "";
    width: 200%;
    left: 0;
    position: fixed;
    height: 200%;
    z-index: 0;
    -webkit-backdrop-filter: brightness(bg_brightness)contrast(bg_contrast)saturate(bg_saturate)!important;
    backdrop-filter: brightness(bg_brightness)contrast(bg_contrast)saturate(bg_saturate)!important;
    }
.dark-mode body:not(.ownlist),
    body:not(.ownlist) {
    background: url(bg_image)!important;
    background-size: cover!important;
    background-attachment: fixed!important;
    background-color: var(--color-background)!important;
    }
.page-common #myanimelist #contentWrapper {
    background-color: var(--color-backgroundo)!important;
    top: 55px!important;
    padding: 10px;
    margin-left: -15px;
    width: 1070px;
    border-radius: var(--border-radius);
    box-shadow: 0 0 4px var(--shadow-color)!important;
    }`;

//CSS MyAnimeList - Clean Main Colors
var styles3 = ` body,
    :root {
    --color-background: #0c1525!important;
    --color-backgroundo: #0c1525!important;
    --color-foreground: #161f2f!important;
    --color-foreground2: #202939!important;
    --color-foreground3: rgba(37,46,62,0.3)!important;
    --color-foreground4: #2a3343!important;
    --br: 5px!important;
    --color-text: 182 182 182;
    --color-text-normal: #b6b6b6!important;
    --color-main-text-normal: #c8c8c8!important;
    --color-main-text-light: #a5a5a5!important;
    --color-main-text-op: #fff!important;
    --color-link: 159, 173, 189;
    --color-link2: #7992bb!important;
    --color-text-hover: #cfcfcf!important;
    --color-link-hover: #cee7ff!important;
    }`;
var styleSheet = document.createElement('style');
var styleSheet2 = document.createElement('style');
var styleSheet3 = document.createElement('style');
var stButton = create('li', {});
stButton.onclick = () => {
  Settings();
};
var stLink = create('a', {}, 'MalClean Settings');
var active = false;

var buttonclose = create(
  'button',
  {
    class: 'mainbtns',
    id: 'closebtn',
  },
  'Close',
);
buttonclose.onclick = () => {
  closeDiv();
};

var buttonreload = create(
  'button',
  {
    class: 'mainbtns',
    id: 'reloadbtn',
  },
  'Refresh',
);
buttonreload.onclick = () => {
  reload();
};

var button1 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'animebgbtn',
  },
  '<b>' + 'Anime/Manga' + '</b><hr>' + 'Background Color from Image',
);
button1.onclick = () => {
  svar.animebg = !svar.animebg;
  svar.save();
  getSettings();
  reloadset();
};

var button2 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'animeHeaderbtn',
  },
  '<b>' + 'Anime/Manga' + '</b><hr>' + 'Change Title Position',
);
button2.onclick = () => {
  svar.animeHeader = !svar.animeHeader;
  svar.save();
  getSettings();
  reloadset();
};

var button3 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'charbgbtn',
  },
  '<b>' + 'Character' + '</b><hr>' + 'Background Color from Image',
);
button3.onclick = () => {
  svar.charbg = !svar.charbg;
  svar.save();
  getSettings();
  reloadset();
};

var button4 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'characterHeaderbtn',
  },
  '<b>' + 'Character' + '</b><hr>' + 'Change Name Position',
);
button4.onclick = () => {
  svar.characterHeader = !svar.characterHeader;
  svar.save();
  getSettings();
  reloadset();
};

var button5 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'characterNameAltbtn',
  },
  '<b>' + 'Character' + '</b><hr>' + 'Show Alternative Name',
);
button5.onclick = () => {
  svar.characterNameAlt = !svar.characterNameAlt;
  svar.save();
  getSettings();
  reloadset();
};

var button6 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'peopleHeaderbtn',
  },
  '<b>' + 'People' + '</b><hr>' + 'Change Name Position',
);
button6.onclick = () => {
  svar.peopleHeader = !svar.peopleHeader;
  svar.save();
  getSettings();
  reloadset();
};

var button7 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'customcssbtn',
  },
  '<b>' + 'Profile' + '</b><hr>' + 'Show Custom CSS',
);
button7.onclick = () => {
  svar.customcss = !svar.customcss;
  svar.save();
  getSettings();
  reloadset();
};

var button9 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'profileheaderbtn',
  },
  '<b>' + 'Profile' + '</b><hr>' + 'Change Username Position',
);
button9.onclick = () => {
  svar.profileHeader = !svar.profileHeader;
  svar.save();
  getSettings();
  reloadset();
};

var button10 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'alstylebtn',
  },
  '<b>' + 'Profile' + '</b><hr>' + 'Anilist Style',
);
button10.onclick = () => {
  svar.alstyle = !svar.alstyle;
  svar.save();
  getSettings();
  reloadset();
};

//alstyle - BG Elements
let bginput = create('input', {
  class: 'bginput',
  id: 'bginput',
});
bginput.placeholder = 'Paste your Background Image Url here';

var button11 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'custombg',
  },
  'Convert Background to BBCode',
);

var bginfo = create(
  'p',
  {
    class: 'textpb',
  },
  '',
);

button11.onclick = () => {
  if (bginput.value.slice(-1) === ']') {
    bginfo.innerText = 'Background Image already converted.';
  } else if (bginput.value.length > 1) {
    bginput.value = '[url=https://custombg/' + LZString.compressToBase64(JSON.stringify(bginput.value)) + ']‎ [/url]';
    bginput.select();
    bginfo.innerHTML =
      'Background Image Converted. Please copy and paste to your ' +
      "<a class='embedLink' href=\"" +
      'https://myanimelist.net/editprofile.php' +
      '">' +
      'About Me' +
      '</a>' +
      ' section.';
  } else {
    bginfo.innerText = 'Background Image url empty.';
  }
};

//alstyle - PF  Elements
var button12 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'custompf',
  },
  'Convert Avatar to BBCode',
);

button12.onclick = () => {
  if (pfinput.value.slice(-1) === ']') {
    pfinfo.innerText = 'Background Image already converted.';
  } else if (pfinput.value.length > 1) {
    pfinput.value = '[url=https://custompf/' + LZString.compressToBase64(JSON.stringify(pfinput.value)) + ']‎ [/url]';
    pfinput.select();
    pfinfo.innerHTML =
      'Avatar Image Converted. Please copy and paste to your ' +
      "<a class='embedLink' href=\"" +
      'https://myanimelist.net/editprofile.php' +
      '">' +
      'About Me' +
      '</a>' +
      ' section.';
  } else {
    pfinfo.innerText = 'Avatar Image url empty.';
  }
};

let pfinput = create('input', {
  class: 'bginput',
  id: 'pfinput',
});
pfinput.placeholder = 'Paste your Avatar Image Url here';

var pfinfo = create(
  'p',
  {
    class: 'textpb',
  },
  '',
);

//custom css Elements
var button8 = create(
  'button',
  {
    class: 'mainbtns',
    id: 'customcss',
  },
  'Convert CSS to BBCode',
);

button8.onclick = () => {
  if (cssinput.value.slice(-1) === ']') {
    cssinfo.innerText = 'Css already converted.';
  } else if (cssinput.value.length > 1) {
    cssinput.value = '[url=https://customcss/' + LZString.compressToBase64(JSON.stringify(cssinput.value)) + ']‎ [/url]';
    cssinput.select();
    cssinfo.innerHTML =
      'Css Converted. Please copy and paste to your ' + "<a class='embedLink' href=\"" + 'https://myanimelist.net/editprofile.php' + '">' + 'About Me' + '</a>' + ' section.';
  } else {
    cssinfo.innerText = 'Css empty.';
  }
};

var cssinfo = create(
  'p',
  {
    class: 'textpb',
  },
  '',
);

let cssinput = create('input', {
  class: 'cssinput',
  id: 'cssinput',
});
cssinput.placeholder = 'Paste your CSS here';

//Refresh Page Button Function
function reload() {
  window.location.href = window.location.href;
}

//Refresh Page Button Animation
function reloadset() {
  reloadbtn.setAttribute('style', 'animation:reloadLoop 2.5s infinite');
}

// Toggle enabled Buttons
function getSettings() {
  animebgbtn.classList.toggle('btn-active', svar.animebg);
  charbgbtn.classList.toggle('btn-active', svar.charbg);
  peopleHeaderbtn.classList.toggle('btn-active', svar.peopleHeader);
  animeHeaderbtn.classList.toggle('btn-active', svar.animeHeader);
  characterHeaderbtn.classList.toggle('btn-active', svar.characterHeader);
  characterNameAltbtn.classList.toggle('btn-active', svar.characterNameAlt);
  customcssbtn.classList.toggle('btn-active', svar.customcss);
  profileheaderbtn.classList.toggle('btn-active', svar.profileHeader);
  alstylebtn.classList.toggle('btn-active', svar.alstyle);
}

//Create Settings Div
function createDiv() {
  var listDiv = create(
    'div',
    {
      class: 'maindiv',
      id: 'listDiv',
    },
    '<div class="maindivheader"><b>' + stLink.innerText + '</b></div>',
  );

  var buttonsDiv = create('div', {
    class: 'buttonsDiv',
    id: 'buttonsDiv',
  });

  var custombgDiv = create(
    'div',
    {
      class: 'childdiv',
      id: 'profileDiv',
    },
    '<div class="profileHeader"><h2>' +
      'Al Style - Custom Background Image' +
      '</h2><h3>' +
      'Add custom Background Image to your profile. This will be visible to others with the script.' +
      '</h3></div>',
  );

  var custompfDiv = create(
    'div',
    {
      class: 'childdiv',
      id: 'profileDiv',
    },
    '<div class="profileHeader"><h2>' +
      'Al Style - Custom Avatar' +
      '</h2><h3>' +
      'Add custom Avatar to your profile. This will be visible to others with the script.' +
      '</h3></div>',
  );

  var customcssDiv = create(
    'div',
    {
      class: 'childdiv',
      id: 'profileDiv',
    },
    '<div class="profileHeader"><h2>' + 'Custom CSS' + '</h2><h3>' + 'Add custom CSS to your profile. This will be visible to others with the script.' + '</h3></div>',
  );

  var buttonsDiv = create('div', {
    class: 'buttonsDiv',
    id: 'buttonsDiv',
  });

  listDiv.querySelector('.maindivheader').append(buttonreload, buttonclose);
  buttonsDiv.append(button1, button2, button3, button4, button5, button6, button7, button9, button10);
  listDiv.append(buttonsDiv);
  if (svar.alstyle) {
    listDiv.append(custombgDiv, custompfDiv);
    custombgDiv.append(bginput, button11, bginfo);
    custompfDiv.append(pfinput, button12, pfinfo);
    button9.style.display = 'none';
  }
  listDiv.append(customcssDiv);
  customcssDiv.append(cssinput, button8, cssinfo);
  document.querySelector('#headerSmall').insertAdjacentElement('afterend', listDiv);
  getSettings();
}

//Close Div Function
function closeDiv() {
  listDiv.remove();
  active = false;
}

//Add Settings Button to Dropdown Menu
function add() {
  var header = document.querySelector('#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8.on > div > ul > li:nth-child(9)');
  if (!header) {
    setTimeout(add, 100);
    return;
  }
  var gear = document.querySelector('#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8.on > div > ul > li:nth-child(9) > a > i');
  var gear1 = gear.cloneNode(true);
  stLink.prepend(gear1);
  stButton.append(stLink);
  header.insertAdjacentElement('afterend', stButton);
}

//Settings Open-Close Function
function Settings() {
  active = !active;
  if (active) {
    createDiv();
  }
  if (!active) {
    closeDiv();
  }
}

//Anilist Style - Loading Loop
let v = false;
let lv = 0;

function loadspin(val) {
  let d = document.querySelector('#fancybox-loading > div');
  v = val;

  function l() {
    lv = lv - 40;
    if (lv < -440) {
      lv = 0;
    }
    if (d) {
      d.style.top = lv + 'px';
    }
  }
  if (v) {
    setTimeout(l(), 100);
    return;
  } else {
    return;
  }
}

//Main
(function () {
  'use strict';

  add();
  var current = location.pathname;
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  ////Profile Section //--START--//
  if (/\/(profile)\/.?([\w-]+)?\/?/.test(current)) {
    if (svar.alstyle) {
      document.querySelector('#contentWrapper').setAttribute('style', 'opacity:0');
    }
    let username = current.split('/')[2];
    let banner = create('div', {
      class: 'banner',
      id: 'banner',
    });
    let shadow = create('div', {
      class: 'banner',
      id: 'shadow',
    });
    let custombg;
    let custompf;
    shadow.setAttribute('style', 'background: linear-gradient(180deg,rgba(6,13,34,0) 40%,rgba(6,13,34,.6));height: 100%;left: 0;position: absolute;top: 0;width: 100%;');
    banner.append(shadow);
    findbg();
    async function findbg() {
      //Get Custom Background Image and Custom Profile Image Data from About Section
      if (document.querySelector('#fancybox-loading')) {
        document.querySelector('#fancybox-loading').style.setProperty('display', 'block', 'important');
        loadspin(true);
      }
      let regex = /(custombg)\/([^"]+)/gm;
      let regex2 = /(custompf)\/([^"]+)/gm;
      let about = document.querySelector('.user-profile-about.js-truncate-outer');
      if (document.querySelector('.user-image.mb8 > img')) {
        if (!document.querySelector('.user-image.mb8 > img').src) {
          setTimeout(findbg, 100);
          return;
        }
      }
      if (about) {
        let m = about.innerHTML.match(regex);
        let m2 = about.innerHTML.match(regex2);
        if (m) {
          let dat = m[0].replace(regex, '$2');
          custombg = JSON.parse(LZString.decompressFromBase64(dat));
          banner.setAttribute(
            'style',
            'background:url(' + custombg + ');background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;',
          );
          svar.alstyle = true;
        }
        if (m2) {
          let dat2 = m2[0].replace(regex2, '$2');
          custompf = JSON.parse(LZString.decompressFromBase64(dat2));
          document.querySelector('.user-image.mb8 > img').setAttribute('src', '' + custompf + '');
          svar.alstyle = true;
        }
        applyAl();
      } else {
        //If current page don't have about section get about from JikanAPI
        const apiUrl = `https://api.jikan.moe/v4/users/${username}/about`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data.data.about) {
              let match = data.data.about.match(regex);
              let match2 = data.data.about.match(regex2);
              if (match) {
                let dat = match[0].replace(regex, '$2');
                custombg = JSON.parse(LZString.decompressFromBase64(dat));
                banner.setAttribute(
                  'style',
                  'background:url(' + custombg + ');background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;',
                );
                svar.alstyle = true;
              }
              if (match2) {
                let dat2 = match2[0].replace(regex2, '$2');
                custompf = JSON.parse(LZString.decompressFromBase64(dat2));
                document.querySelector('.user-image.mb8 > img').setAttribute('src', '' + custompf + '');
                svar.alstyle = true;
              }
            }
            applyAl();
          });
      }
    }
    //Apply Anilist Style
    async function applyAl() {
      if (svar.alstyle) {
        //CSS Fix for Anilist Style
        let fixstyle = `
        .profile .btn-truncate.js-btn-truncate.open {padding-bottom:0!important}
        .profile-about-user.js-truncate-inner img,.user-comments .comment .text .comment-text .userimg{-webkit-box-shadow:none!important;box-shadow:none!important}
        .user-profile .user-friends {display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: start;-webkit-justify-content: start;-ms-flex-pack: start;justify-content: start}
        .user-profile .user-friends .icon-friend {margin: 5px!important;}
        .favs{-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)!important;display: -ms-grid!important;background-color: var(--color-foreground);padding:5px;display: grid!important;grid-gap: 5px 5px!important;grid-template-columns: repeat(auto-fill, 76px)!important;-webkit-box-pack: space-evenly!important;-ms-flex-pack: space-evenly!important;-webkit-justify-content: space-evenly!important;justify-content: space-evenly!important;margin-bottom: 12px!important;-webkit-border-radius: var(--br);border-radius: var(--br);}
        .word-break img, .dark-mode .profile .user-profile-about .userimg, .profile .user-profile-about .userimg, .profile .user-profile-about a .userimg,.profile .user-profile-about .userimg.img-a-r {max-width: 420px;-webkit-box-shadow: none!important;box-shadow: none!important;}
        .profile .user-profile-about input.button {white-space: break-spaces;}
        #modern-about-me-inner {overflow:hidden}
         #modern-about-me-inner > *, #modern-about-me-inner .l-mainvisual {max-width:420px!important}
        .l-listitem-list-item {-webkit-flex-basis: 64px;flex-basis: 64px;-ms-flex-preferred-size: 64px;}
        .l-listitem-5_5_items {margin-right: -25px;}.historyname{width: 80%;-webkit-align-self: center;-ms-flex-item-align: center;-ms-grid-row-align: center;align-self: center;}
        .historydate{width:25%;text-align: right;}
        .historyimg{background-size:cover;margin-left: -10px;height: 69px;width:50px;margin-top: -9px;margin-right: 10px;padding-right: 5px;}
        .historydiv {height: 50px;background-color: var(--color-foreground);margin: 10px 5px;padding: 10px;-webkit-border-radius: var(--br);border-radius: var(--br);display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;overflow: hidden;}
        #horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}`;
        var fixstylesheet = document.createElement('style');
        fixstylesheet.innerText = fixstyle;
        document.head.appendChild(fixstylesheet);

        //Get Activity History and Cover Image from Jikan API
        function gethistory() {
          let animeid;
          let imgdata;
          let i = 0;
          let last;
          let lock = 0;
          let entry;
          let wait = 500;
          const apiUrl = `https://api.jikan.moe/v4/users/${username}/history`;
          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              entry = data.data;
              if (entry.length < 12) {
                last = entry.length;
              } else {
                last = 12;
              }
              if (entry[0]) {
                let head = create(
                  'h2',
                  {
                    class: 'mt16',
                  },
                  'Activity',
                );
                document.querySelector('#statistics').insertAdjacentElement('beforeend', head);
                myLoop();
              }

              function myLoop() {
                setTimeout(function () {
                  if (i < last) getimgf();
                }, wait);
              }
              async function getimgf() {
                if (lock === 1) {
                  setTimeout(getimgf, 500);
                  return;
                }
                wait = 350;
                animeid = entry[i].entry.mal_id;
                let dat = create('div', {
                  class: 'historydiv',
                });
                let name = create('div', {
                  class: 'historyname',
                });
                let timestamp = new Date(entry[i].date).getTime();
                const timestampSeconds = Math.floor(timestamp / 1000);
                let date = create(
                  'div',
                  {
                    class: 'historydate',
                    title: entry[i].date,
                  },
                  nativeTimeElement(timestampSeconds),
                );
                let apiUrl = `https://api.jikan.moe/v4/anime/${animeid}`;
                if (entry[i].entry.type === 'anime') {
                  name.innerHTML = 'Watched  episode ' + entry[i].increment + ' of ' + '<a href="' + entry[i].entry.url + '">' + entry[i].entry.name + '</a>';
                } else {
                  apiUrl = `https://api.jikan.moe/v4/manga/${animeid}`;
                  name.innerHTML = 'Read chapter ' + entry[i].increment + ' of ' + '<a href="' + entry[i].entry.url + '">' + entry[i].entry.name + '</a>';
                }
                if (i < last && i > 0 && entry[i].entry.mal_id !== entry[i - 1].entry.mal_id) {
                  getimg();
                } else {
                  if (i < last && i > 0) {
                    wait = 100;
                    let historyimg = create('a', {
                      class: 'historyimg',
                      href: entry[i].entry.url,
                      style: {
                        backgroundImage: 'url(' + imgdata + ')',
                      },
                    });
                    dat.append(historyimg, name);
                    dat.append(date);
                    document.querySelector('#statistics').insertAdjacentElement('beforeend', dat);
                    i++;
                    if (i < last) {
                      myLoop();
                    }
                  }
                }
                if (i === 0) {
                  getimg();
                }
                async function getimg() {
                  lock = 1;
                  await fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                      imgdata = data.data.images.jpg.image_url;
                      if (imgdata) {
                        let historyimg = create('a', {
                          class: 'historyimg',
                          href: entry[i].entry.url,
                          style: {
                            backgroundImage: 'url(' + imgdata + ')',
                          },
                        });
                        dat.append(historyimg, name);
                        dat.append(date);
                        document.querySelector('#statistics').insertAdjacentElement('beforeend', dat);
                        setTimeout(function () {
                          lock = 0;
                          i++;
                          if (i < last) {
                            myLoop();
                          }
                        }, 350);
                      }
                    });
                }
              }
            })
            .catch((error) => console.error('error:', error));
        }
        //Make Profile looks like Anilist
        svar.profileHeader = false;
        let about = document.querySelector('.user-profile-about.js-truncate-outer');
        let modernabout = document.querySelector('#modern-about-me');
        let avatar = document.querySelector('.user-image');
        let name = $('span:contains("s Profile"):last');
        let container = create('div', {
          class: 'container',
          id: 'container',
        });
        container.setAttribute('style', 'margin: 0 auto;min-width: 320px;max-width: 1240px;left: -40px;position: relative;height: 100%;');
        if (!custombg) {
          banner.setAttribute('style', 'background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;');
        }
        document.querySelector('#myanimelist').setAttribute('style', 'min-width: 1240px;width:100%');
        set(1, '#myanimelist .wrapper', {
          sa: {
            0: 'width:100%;display:table',
          },
        });
        document.querySelector('#contentWrapper').insertAdjacentElement('beforebegin', banner);
        banner.append(container);
        container.append(avatar);
        if (
          set(0, about, {
            sa: {
              0: 'margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);max-height:5000px',
            },
          })
        ) {
          document.querySelector('#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4').insertAdjacentElement('beforebegin', about);
        }
        if (
          set(0, modernabout, {
            sa: {
              0: 'margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);max-height:5000px',
            },
          })
        ) {
          document.querySelector('#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4').insertAdjacentElement('beforebegin', modernabout);
          let l = document.querySelectorAll('.l-listitem');
          let a = 'max-width:492px;max-height:492px';
          set(2, '.l-listitem', {
            sal: {
              0: '-webkit-box-pack: center;display: flex;-ms-flex-pack: center;justify-content: center;flex-wrap: wrap;flex-direction: row;',
            },
          });
          set(1, '.l-mainvisual', {
            sa: {
              0: a,
            },
          });
          set(1, '.intro-mylinks-wrap', {
            sa: {
              0: a,
            },
          });
          set(1, '.l-intro', {
            sa: {
              0: a,
            },
          });
          set(1, '.l-intro-text-wrap-1', {
            sa: {
              0: a,
            },
          });
          set(1, '.copy-wrap-1', {
            sa: {
              0: a,
            },
          });
          set(1, '.mylinks-ul', {
            sa: {
              0: a,
            },
          });
        }
        if (about || modernabout) {
          if (
            set(1, '.user-profile h1:first-child', {
              sa: {
                0: 'position: absolute;top: 50px;right: 0;',
              },
            })
          ) {
            banner.append(document.querySelector('.user-profile h1:first-child'));
          }
          $('a:contains("About Me Design"):last').remove();
        }
        set(1, '.user-image img', {
          sa: {
            0: 'display: inline-block;max-height: 230px;max-width: 160px;width: 100%;box-shadow:none!important',
          },
        });
        set(1, '.user-image .btn-detail-add-picture', {
          sa: {
            0: 'display: flex;flex-direction: column;justify-content: center;',
          },
        });
        document.querySelector('.user-image').setAttribute('style', 'top: 99px;left: 99px;position: relative;');
        avatar.setAttribute('style', 'display: flex;height: inherit;align-items: flex-end;position: relative;width:500px;');
        name.css({
          'font-size': '2rem',
          'font-weight': '800',
          left: '35px',
          top: '-35px',
        });
        name.html(name.html().replace(/'s Profile/g, '\n'));
        avatar.append(name[0]);
        set(2, '#container span.profile-team-title.js-profile-team-title', {
          sl: {
            top: '18px',
          },
        });
        container.append(document.querySelector('.user-function.mb8'));
        set(1, 'a.btn-profile-submit.fl-l', {
          sa: {
            0: 'width:50%',
          },
        });
        set(1, 'a.btn-profile-submit.fl-r', {
          sa: {
            0: 'width:50%',
          },
        });
        if (
          set(1, '.bar-outer.anime', {
            sa: {
              0: 'width:100%',
            },
          })
        ) {
          set(1, '.bar-outer.manga', {
            sa: {
              0: 'width:100%',
            },
          });
        }
        set(1, '.user-function.mb8', {
          sa: {
            0: 'position: relative;left: 100%;top: -50px;display: flex;width: 100px;font-size: 1rem;justify-content: space-evenly;',
          },
        });
        if (
          set(1, '.content-container', {
            sa: {
              0: 'display: grid!important;grid-template-columns: 33% auto;margin-top: 30px;justify-content: center;',
            },
          })
        ) {
          set(1, '.container-left', {
            sa: {
              0: 'width:auto',
            },
          });
          set(1, '.container-right', {
            sa: {
              0: 'width:auto;min-width:800px',
            },
          });
        }
        if (
          set(1, '#content > table > tbody > tr > td.profile_leftcell', {
            sa: {
              0: 'width:auto',
            },
          })
        ) {
          set(1, '#content > table > tbody > tr', {
            sa: {
              0: 'display: grid!important;grid-template-columns: 33% auto;margin-top: 10px;justify-content: center;',
            },
          });
          set(1, '#content > table > tbody > tr > td.pl8', {
            sa: {
              0: 'width: auto;position:relative;min-width:800px',
            },
          });
        }
        set(1, '.user-profile', {
          sa: {
            0: 'width:auto;',
          },
        });
        set(2, '.user-profile li', {
          sal: {
            0: 'width:auto',
          },
        });
        set(1, '.quotetext', {
          sa: {
            0: 'margin-left:0;',
          },
        });
        if (
          set(1, '#lastcomment', {
            sa: {
              0: 'padding-top:0!important;',
            },
          })
        ) {
          document.querySelector('#content > div > div.container-right').prepend(document.querySelector('#lastcomment'));
        }
        set(1, '#content > table > tbody > tr > td.pl8 > #horiznav_nav', {
          r: {
            0: 0,
          },
        });
        set(1, '.container-right #horiznav_nav', {
          r: {
            0: 0,
          },
        });
        document.querySelector('#contentWrapper').setAttribute('style', 'width: 1375px;min-width:500px; margin: auto;top: -40px;transition:.6s');
        if (document.querySelector('#fancybox-loading')) {
          document.querySelector('#fancybox-loading').style.setProperty('display', '');
        }
        let more = document.querySelector('.btn-truncate.js-btn-truncate');
        if (more) {
          more.setAttribute('data-height', '{"outer":1000,"inner":5000}');
        }
        let s = document.querySelector('#statistics');
        if (s) {
          s.setAttribute('style', 'width: 813px');
          s.children[1].append(document.querySelector('#statistics .stats.manga'));
          s.children[2].prepend(document.querySelector('#statistics .updates.anime'));
          s.prepend(document.querySelector('#statistics > div:nth-child(2)'));
          document.querySelector('.container-right').prepend(s);
          $('h2:contains("Statistics"):last').remove();
          let favs = create('div', {
            class: 'favs',
          });
          let favs2 = create('div', {
            class: 'favs',
          });
          let favs3 = create('div', {
            class: 'favs',
          });
          let favs4 = create('div', {
            class: 'favs',
          });
          let favs5 = create('div', {
            class: 'favs',
          });

          /*Get Favorites*/
          document.querySelector('#content > div > div.container-left > div > ul:nth-child(4)').prepend(favs, favs2, favs3, favs4, favs5);
          getfavs();

          function getfavs() {
            let favc = ['#anime_favorites', '#manga_favorites', '#character_favorites', '#person_favorites', '#company_favorites'];
            let fave = [favs, favs2, favs3, favs4, favs5];
            let f, c;
            for (let l = 0; l < 5; l++) {
              f = document.querySelector(favc[l]);
              if (!f) {
                fave[l].remove();
              } else {
                fave[l].insertAdjacentElement('beforebegin', f.previousElementSibling);
                c = document.querySelectorAll(favc[l] + ' ul > li');
                for (let x = 0; x < c.length; x++) {
                  let r = c[x].querySelectorAll('span');
                  for (let y = 0; y < r.length; y++) {
                    r[y].remove();
                  }
                  c[x].setAttribute('style', 'width:76px');
                  fave[l].append(c[x]);
                }
                f.remove();
              }
            }
          }
          document.querySelector('.container-right > h2.mb12').remove();
          set(1, '.container-right > .btn-favmore', {
            r: {
              0: 0,
            },
          });
          set(1, '.favs', {
            sap: {
              0: 'box-shadow: none!important;',
            },
          });
          gethistory();
        }
        //Add Navbar to Profile Banner
        let nav = create('div', {
          class: 'navbar',
          id: 'navbar',
        });
        nav.innerHTML =
          '<div id="horiznav_nav" style="margin: 5px 0 10px;"><ul><li><a href="/profile/">Overview</a></li><li><a href="/profile/">Statistics</a></li><li><a href="/profile/">Favorites</a></li><li><a href="/profile/">Reviews</a></li><li><a href="/profile/">Recommendations</a></li><li><a href="/profile/">Interest Stacks</a></li><li><a href="/profile/">Clubs</a></li><li><a href="/profile/">Badges</a></li><li><a href="/profile/">Friends</a></li></ul></div>';
        banner.insertAdjacentElement('afterend', nav);
        nav.setAttribute('style', 'z-index: 2;position: relative;background: #000;padding: 10px;text-align: center;background-color: var(--color-foreground) !important;');
        let navel = document.querySelectorAll('#navbar #horiznav_nav > ul > li > a');
        navel[0].href = navel[0].href + username;
        navel[1].href = navel[1].href + username + '/statistics';
        navel[2].href = navel[2].href + username + '/favorites';
        navel[3].href = navel[3].href + username + '/reviews';
        navel[4].href = navel[4].href + username + '/recommendations';
        navel[5].href = navel[5].href + username + '/stacks';
        navel[6].href = navel[6].href + username + '/clubs';
        navel[7].href = navel[7].href + username + '/badges';
        navel[8].href = navel[8].href + username + '/friends';
        $('h2:contains("Synopsis"):last').parent().addClass('SynopsisDiv');
        let n = current.split('/')[3];
        if (!n) {
          $(navel[0]).addClass('navactive');
        } else {
          n = n.charAt(0).toUpperCase() + n.slice(1);
          $('.navbar a:contains(' + n + ')').addClass('navactive');
        }
        set(0, navel, {
          sal: {
            0: 'margin: 0 30px;font-size: 1rem;box-shadow: none!important;',
          },
        });
      }
    }
    if (svar.profileHeader) {
      let title = document.querySelector('#contentWrapper > div:nth-child(1)');
      title.children[0].setAttribute('style', 'padding-left: 2px');
      let table = document.querySelector('.user-profile-about.js-truncate-outer');
      if (!table) {
        table = document.querySelector('#content > div > div.container-right > div > div:nth-child(1)');
      }
      if (table) {
        table.prepend(title);
      }
    }
    if (svar.customcss) {
      findcss();

      function findcss() {
        var details = document.querySelector('.user-profile-about.js-truncate-outer');
        if (!details) {
          setTimeout(findcss, 100);
          return;
        }
        let regex = /(customcss)\/([^()]+)/gm;
        let match = details.innerHTML.match(regex);
        if (match) {
          $('style:contains(--fg: #161f2f;)').html('');
          styleSheet3.innerText = styles3;
          document.head.appendChild(styleSheet3);
          styleSheet.innerText = styles;
          document.head.appendChild(styleSheet);
          getdata();

          function getdata() {
            let css = document.createElement('style');
            let data = match[0].replace(regex, '$2');
            css.innerText = JSON.parse(LZString.decompressFromBase64(data));
            document.head.appendChild(css);
          }
        }
      }
    }
  }
  //Profile Section //--END--//

  //Character Section //-START-//
  if (/\/(character)\/.?([\w-]+)?\/?/.test(current)) {
    let regex = /(Member Favorites).*/g;
    let match = document.createElement('p');
    let fav = document.querySelector('#content > table > tbody > tr > td.borderClass');
    match.innerText = fav.innerText.match(regex);
    fav.innerHTML = fav.innerHTML.replace(regex, '');
    if (match) {
      document.querySelector('#v-favorite').insertAdjacentElement('beforebegin', match);
    }
    $('div:contains("Voice Actors"):last').addClass('VoiceActorsDiv');
    while ($('.VoiceActorsDiv').next('table').length > 0) {
      $('.VoiceActorsDiv').append(
        $('.VoiceActorsDiv').next('table').addClass('VoiceActorsDivTable').css({
          backgroundColor: 'var(--color-foreground)',
          borderRadius: 'var(--br)',
          marginTop: '8px',
        }),
      );
      $('.VoiceActorsDivTable').children().children().children().children('.picSurround').children().children().css({
        width: '60px !important',
        height: '80px',
        objectFit: 'cover',
      });
    }
    $('.VoiceActorsDiv').css({
      marginTop: '10px',
    });
    $('h2:contains("Recent Featured Articles"):last').addClass('RecentFeaturedArticlesDiv').append($('.RecentFeaturedArticlesDiv').next());
    $('.RecentFeaturedArticlesDiv').css({
      marginTop: '10px',
    });
    $('.RecentFeaturedArticlesDiv').children('div:last-child').css({
      marginTop: '8px',
    });
    $('.RecentFeaturedArticlesDiv').children().children().css('width', '99%').children().css('borderRadius', 'var(--br)');
    let doc;
    let main = document.querySelector('#content > table > tbody > tr > td:nth-child(2)');
    $(main).addClass('characterDiv');
    let text = create('div', {
      class: 'description',
      itemprop: 'description',
      style: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginTop: '5px',
        whiteSpace: 'pre-wrap',
      },
    });
    main.childNodes.forEach(function (el, i) {
      if (
        i >= 5 &&
        el !== document.querySelector('.VoiceActorsDiv') &&
        el !== document.querySelector('h2') &&
        el !== document.querySelector('.RecentFeaturedArticlesDiv') &&
        el.innerText !== 'Voice Actors' &&
        el.innerText !== 'More Videos\nEpisode Videos' &&
        el.innerText !== 'Episode Videos' &&
        el.id !== 'episode_video' &&
        el.id !== 'CallFunctionFormatMoreInfoText'
      ) {
        if (el.innerHTML === undefined) {
          text.innerHTML += el.textContent;
        } else {
          text.innerHTML += el.innerHTML;
        }
      }
    });
    let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, '');
    text.innerHTML = fixtext;
    if (document.querySelector('#content > table > tbody > tr > td.characterDiv > br:nth-child(5)')) {
      doc = document.querySelector('#content > table > tbody > tr > td.characterDiv > br:nth-child(5)');
    } else {
      doc = document.querySelector('#content > table > tbody > tr > td.characterDiv > br:nth-child(6)');
    }
    doc.before(text);
    $.trim($('.characterDiv').contents().not($('.description')).not($('.VoiceActorsDiv')).not($('h2')).not($('table')).remove());
    $('.description').children().not($('input')).not($('span.spoiler_content')).remove();
    let spofix = document.querySelectorAll('.spoiler_content > input');
    $('.spoiler_content').css({
      background: 'var(--color-foreground4)',
      borderRadius: 'var(--br)',
      padding: '0px 5px 5px',
      margin: '5px 0px',
    });
    for (let x = 0; x < spofix.length; x++) {
      spofix[x].setAttribute('onclick', "this.parentNode.style.display='none';this.parentNode.previousElementSibling.style.display='inline-block';");
    }
  }
  //Character Section //--END--//

  //Anime/Manga Section//--START--//
  if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && !/\/(anime|manga)\/producer\/.?([\w-]+)?\/?/.test(current)) {
    let text = create('div', {
      class: 'description',
      itemprop: 'description',
      style: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginTop: '5px',
        whiteSpace: 'pre-wrap',
      },
    });

    //Left Side
    if ($('h2:contains("Alternative Titles"):last')) {
      $('h2:contains("Alternative Titles"):last').addClass('AlternativeTitlesDiv');
      document.querySelector('.AlternativeTitlesDiv').nextElementSibling.setAttribute('style', 'border-radius:var(--br);margin-bottom:2px');
      $('span:contains("Synonyms")').parent().next().css({
        borderRadius: 'var(--br)',
        marginBottom: '2px',
      });
    }
    if (document.querySelector('.js-alternative-titles.hide')) {
      document.querySelector('.js-alternative-titles.hide').setAttribute('style', 'border-radius:var(--br);overflow:hidden');
    }
    $('h2:contains("Information"):last').addClass('InformationDiv');
    document.querySelector('.InformationDiv').nextElementSibling.setAttribute('style', 'border-top-left-radius:var(--br);border-top-right-radius:var(--br);');
    $('h2:contains("Statistics"):last').addClass('StatisticsDiv');
    document.querySelector('.StatisticsDiv').nextElementSibling.setAttribute('style', 'border-top-left-radius:var(--br);border-top-right-radius:var(--br)');
    document
      .querySelector('.StatisticsDiv')
      .previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
    if ($('h2:contains("Resources"):last').length > 0) {
      $('h2:contains("Resources"):last').addClass('ResourcesDiv');
      document
        .querySelector('.ResourcesDiv')
        .previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
      document.querySelector('.ResourcesDiv').nextElementSibling.style.borderRadius = 'var(--br)';
    }
    if ($('h2:contains("Streaming Platforms")').length > 0) {
      $('h2:contains("Streaming Platforms"):last').addClass('StreamingAtDiv');
      document.querySelector('.StreamingAtDiv').nextElementSibling.style.borderRadius = 'var(--br)';
    }
    if ($('h2:contains("Available At")').length > 0) {
      $('h2:contains("Available At"):last').addClass('AvailableAtDiv');
      document.querySelector('.AvailableAtDiv').nextElementSibling.style.borderRadius = 'var(--br)';
      document
        .querySelector('.AvailableAtDiv')
        .previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
    }

    //Right Side
    $('h2:contains("Synopsis"):last').parent().addClass('SynopsisDiv');
    $('h2:contains("Episode Videos"):last').parent().addClass('EpisodeVideosDiv');
    $('h2:contains("Related Anime"):last').addClass('RelatedAnimeDiv');
    $('h2:contains("Related Manga"):last').addClass('RelatedMangaDiv');
    $('h2:contains("Characters"):last').parent().addClass('CharactersDiv');
    $('h2:contains("Staff"):last').parent().addClass('StaffDiv');
    $('h2:contains("Reviews"):last').addClass('ReviewsDiv');
    $('h2:contains("Recommendations"):last').parent().addClass('RecommendationsDiv');
    $('.RecommendationsDiv').closest('div').append($('.RecommendationsDiv').next());
    $('h2:contains("Interest Stacks"):last').parent().addClass('InterestStacksDiv');
    $('.InterestStacksDiv').closest('div').append($('.InterestStacksDiv').next());
    $('h2:contains("Recent News"):last').addClass('RecentNewsDiv');
    $('h2:contains("Recent Featured Articles"):last').parent().addClass('RecentFeaturedArticlesDiv');
    $('h2:contains("Recent Forum Discussion"):last').addClass('RecentForumDiscussionDiv');
    $('h2:contains("MALxJapan -More than just anime-"):last').parent().addClass('MalxJDiv');

    //Background info Fix
    let doc = $('h2:contains("Background"):last');
    doc.addClass('backgroundDiv');
    if (!/(.*anime|manga)\/.*\/.*\/\w.*/gm.test(current)) {
      let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)[valign='top'] tr > td[valign='top']");
      for (let x = 0; x < 1; x++) {
        main.childNodes.forEach(function (el, i) {
          if (
            i >= 4 &&
            el.class !== 'SynopsisDiv' &&
            el.innerText !== 'Related Manga' &&
            el.innerText !== 'More Videos\nEpisode Videos' &&
            el.innerText !== 'Episode Videos' &&
            el.id !== 'episode_video' &&
            el.id !== 'CallFunctionFormatMoreInfoText'
          ) {
            text.innerHTML += el.textContent;
          }
        });
        for (let x = 0; x < 10; x++) {
          main.childNodes.forEach(function (el, i) {
            {
              if (
                i >= 4 &&
                el.class !== 'SynopsisDiv' &&
                el.innerText !== 'Related Manga' &&
                el.innerText !== 'More Videos\nEpisode Videos' &&
                el.innerText !== 'Episode Videos' &&
                el.id !== 'episode_video' &&
                el.id !== 'CallFunctionFormatMoreInfoText'
              ) {
                el.remove();
              }
            }
          });
        }
      }
      let textfix = text.innerHTML.replace(/<br>.*\s/gm, '').replace(/\n\s{3,10}/g, '');
      text.innerHTML = textfix;
      doc.append(text);
      for (let x = 0; x < 100; x++) {
        if ($('.backgroundDiv:contains("No background information has been added to this title.")').css('display', 'none'));
      }
    }
  }
  //Anime/Manga Section //--END--//

  //People and Character Name Position Change  //--START--//
  if ((/\/(people)\/.?([\w-]+)?\/?/.test(current) && svar.peopleHeader) || (/\/(character)\/.?([\w-]+)?\/?/.test(current) && svar.characterHeader)) {
    let name = document.querySelector('.h1.edit-info');
    name.getElementsByTagName('strong')[0].style.fontSize = '1.3rem';
    name.setAttribute('style', 'padding-left:5px;padding-top:10px;height:20px');
    document.querySelector('#content').style.paddingTop = '20px';
    let table = document.querySelector('#content > table > tbody > tr > td:nth-child(2)');
    table.prepend(name);
    if (/\/(character)\/.?([\w-]+)?\/?/.test(current) && svar.characterHeader) {
      if (!svar.characterNameAlt) {
        name.setAttribute('style', 'line-height:25px');
      }
      let extra = document.querySelector('#content > table > tbody > tr > td.characterDiv > h2 > span > small');
      extra.innerText = ' ' + extra.innerText;
      if (svar.characterNameAlt) {
        extra.innerHTML = extra.innerHTML;
        document.querySelector('.h1.edit-info > div.h1-title > h1').append(extra);
        extra.style.lineHeight = '20px';
        if (name.children[0].children[0].children[0].innerText.match(/".*"/gm)) {
          extra.innerHTML = extra.innerHTML + '</br>' + name.children[0].children[0].children[0].innerText.match(/".*"/gm);
          name.children[0].children[0].children[0].innerText = name.children[0].children[0].children[0].innerText.replace(/".*"/gm, '');
        } else {
          extra.innerHTML = '</br>' + extra.innerHTML;
        }
      }
      document.querySelector('#content > table > tbody > tr > td.characterDiv > h2').remove();
    }
  }
  //People and Character Name Position Change //--END--//

  //Anime-Manga Background Color from Cover Image //--START--//
  if (/myanimelist.net\/(anime|manga|character|people)\/?([\w-]+)?\/?/.test(location.href)) {
    if (/\/(people)\/?([\w-]+)?\/?/.test(current) || /\/(anime|manga)\/producer|season\/.?([\w-]+)?\/?/.test(current) || /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(current)) {
      return;
    }
    if (/\/(character)\/?([\w-]+)?\/?/.test(current) && !svar.charbg) {
      return;
    }
    if (/\/(anime|manga)\/?([\w-]+)?\/?/.test(current) && !svar.animebg) {
      return;
    }
    styleSheet2.innerText = styles2;
    document.head.appendChild(styleSheet2);
    let img = document.querySelector('div:nth-child(1) > a > img');
    var colorThief = new ColorThief();
    $(document).ready(function ($) {
      img.setAttribute('crossorigin', 'anonymous');
      $(img).load(function () {
        var dominantColor = colorThief.getColor(img);
        var Palette = colorThief.getPalette(img, 10, true);
        //Single Color
        // document.querySelector("body").style.setProperty("background-color", "rgba("+dominantColor[0]+","+dominantColor[1]+","+dominantColor[2]+")", "important");
        //Linear Color
        let color0 = tinycolor('rgba (' + Palette[2][0] + ', ' + Palette[2][1] + ', ' + Palette[2][2] + ', .8)');
        let color1 = tinycolor('rgba (' + Palette[1][0] + ', ' + Palette[1][1] + ', ' + Palette[1][2] + ', .8)');
        let color2 = tinycolor('rgba (' + Palette[0][0] + ', ' + Palette[0][1] + ', ' + Palette[0][2] + ', .8)');
        for (let x = 0; x < 25; x++) {
          if (color0.getLuminance() > 0.08) {
            color0 = tinycolor('rgb (' + color0.darken(2) + ')');
          } else if (color0.getLuminance() < 0.01) {
            color0 = tinycolor('rgb (' + color0.brighten(2) + ')');
          }
          if (color1.getLuminance() > 0.08) {
            color1 = tinycolor('rgb (' + color1.darken(2) + ')');
          } else if (color1.getLuminance() < 0.01) {
            color1 = tinycolor('rgb (' + color1.brighten(2) + ')');
          }
          if (color2.getLuminance() > 0.08) {
            color2 = tinycolor('rgb (' + color2.darken(2) + ')');
          } else if (color2.getLuminance() < 0.01) {
            color2 = tinycolor('rgb (' + color2.brighten(2) + ')');
          }
        }
        document
          .querySelector('body')
          .style.setProperty('background', 'linear-gradient(180deg, ' + color0.toString() + ' 0%,' + color1.toString() + ' 50%, ' + color2.toString() + ' 100%)', 'important');
        img.removeAttribute('crossorigin');
      });
    });
  }
  ////Anime-Manga Background Color from Cover Image //--END--//

  //Anisongs for MAL //--START--//
  //fork of anisongs by morimasa
  //https://greasyfork.org/en/scripts/374785-anisongs
  const anisongs_temp = {
    last: null,
    target: null,
  };
  anisong();
  function anisong() {
    const songCache = localforage.createInstance({
      name: 'MalJS',
      storeName: 'anisongs',
    });
    let currentpath = current.match(/(anime|manga)\/([0-9]+)\/[^/]*\/?(.*)/);
    let currentid;
    let location;
    if (currentpath && currentpath[1] === 'anime') {
      currentid = currentpath[2];
      location = currentpath[3];
      if (location !== '') {
        anisongs_temp.last = 0;
      }
      anisongs_temp.target = document.querySelector('.rightside.js-scrollfix-bottom-rel > table > tbody > tr:nth-child(3) div.di-t');
      if (anisongs_temp.last !== currentid && location === '') {
        if (anisongs_temp.target) {
          anisongs_temp.last = currentid;
          launch(currentid);
        } else {
          setTimeout(anisong, 500);
        }
      }
    } else if (currentpath && currentpath[1] === 'manga') {
      cleaner(anisongs_temp.target);
      anisongs_temp.last = 0;
    } else {
      anisongs_temp.last = 0;
    }
    const options = {
      cacheTTL: 604800000,
      // Update Weekly
      class: 'anisongs',
    };
    const API = {
      //Get Songs from JikanAPI
      async getSongs(mal_id) {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${currentid}/themes`);
        return res.json();
      },
      //Get Videos from AnimeThemesAPI
      async getVideos(anilist_id) {
        const include = ['animethemes.animethemeentries.videos', 'animethemes.song', 'animethemes.song.artists'].join(',');
        const res = await fetch(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=${currentid}&include=${include}`);
        return res.json();
      },
    };
    class VideoElement {
      constructor(parent, url) {
        this.url = url;
        this.parent = parent;
        this.make();
      }
      toggle() {
        if (this.el.parentNode) {
          this.el.remove();
        } else {
          this.parent.append(this.el);
        }
      }
      make() {
        const box = document.createElement('div'),
          vid = document.createElement('video');
        vid.src = this.url;
        vid.controls = true;
        vid.preload = true;
        vid.volume = 0.5;
        box.append(vid);
        this.el = box;
      }
    }

    class Videos {
      constructor(id) {
        this.id = id;
      }
      async get() {
        const {anime} = await API.getVideos(this.id);
        if (anime.length === 0) {
          return {
            OP: [],
            ED: [],
          };
        }
        //Sort and Remove Dubbed OP-ED
        let d = anime[0].animethemes.sort((a, b) => a.sequence - b.sequence);
        let t = [];
        for (let x = 0; x < d.length; x++) {
          let reg = /Dubbed/;
          if (d[x].group !== null && !d[x].group.match(reg)) {
            t.push(d[x]);
          }
          if (d[x].group === null) {
            t.push(d[x]);
          }
        }
        return Videos.groupTypes(t);
      }
      static groupTypes(songs) {
        const groupBy = (xs, key) => {
          return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        return groupBy(songs, 'type');
      }
      static merge(entries, videos) {
        const cleanTitle = (song) => {
          return song.replace(/^\d{1,2}:/, '');
        };
        const findUrl = (n) => {
          let url;
          if (videos[n]) {
            if (videos[n].animethemeentries[0] && videos[n].animethemeentries[0].videos[0]) {
              url = videos[n].animethemeentries[0].videos[0].link;
            }
            if (url) url = url.replace(/staging\./, '');
          }
          return url;
        };
        if (videos) {
          return entries.map((e, i) => {
            //try to fix video order
            let u = null;
            let m = 0;
            for (let x = 0; x < videos.length;) {
              if (videos[x].sequence) {
                if (i + 1 === videos[x].sequence) {
                  u = videos[x].animethemeentries[0].videos[0].link;
                  m = 1;
                }
              }
              if (m === 0 && videos[x].song.title !== null) {
                if (cleanTitle(e).match(videos[x].song.title)) {
                  u = videos[x].animethemeentries[0].videos[0].link;
                  m=1;
                }
                else {
                  let reg = /\(|\)/g;
                  if(cleanTitle(e).match(reg)){
                  let r1 = cleanTitle(e).replace(reg,'');
                  let r2 = videos[x].song.title.replace(reg,'');
                  if(r1.match(r2)){
                  u = videos[x].animethemeentries[0].videos[0].link;
                  m = 1;
                  }
                  }
                }
              }
              if (m === 0 && videos[x].song.artists.length > 0) {
                if (cleanTitle(e).match(videos[x].song.artists[0].name)) {
                  if (cleanTitle(e).match(videos[x].song.title)) {
                    u = videos[x].animethemeentries[0].videos[0].link;
                    m = 1;
                  }
                }
              }
              x++;
            }
            return {
              title: cleanTitle(e),
              url: u,
            };
          });
        }
        return entries.map((e, i) => {
          return {
            title: cleanTitle(e),
          };
        });
      }
    }

    function insert(songs, parent) {
      if (!songs || !songs.length) {
        let song = create(
          'div',
          {
            class: 'song',
          },
          '',
        );
        parent.append(song);
      } else {
        songs.forEach((song, i) => {
          song.title = song.title.replace(/(".*")/, '<b>' + '$1' + '</b>');
          const txt = `${i + 1}. ${song.title || song}`;
          const node = create(
            'div',
            {
              class: 'theme-songs js-theme-songs',
            },
            txt,
          );
          parent.appendChild(node);

          if (song.url) {
            let play = create('div', {class: 'oped-preview-button oped-preview-button-gray'});
            node.prepend(play);
            const vid = new VideoElement(node, song.url);
            play.addEventListener('click', () => vid.toggle());
            node.classList.add('has-video');
          }
        });
      }
    }

    function createTargetDiv(text, target, pos) {
      let el = document.createElement('div');
      el.appendChild(document.createElement('h2'));
      el.children[0].innerText = text;
      el.classList = options.class;
      target.insertBefore(el, target.children[pos]);
      return el;
    }

    function cleaner(target) {
      if (!target) return;
      let el = target.querySelectorAll(`.${options.class}`);
      el.forEach((e) => target.removeChild(e));

      $('.rightside.js-scrollfix-bottom-rel > table > tbody > tr:nth-child(3) > td > div.di-t > .di-tc.va-t').remove();
      set(1, '.rightside.js-scrollfix-bottom-rel > table > tbody > tr:nth-child(3) > td > div.di-t', {
        sa: {
          0: 'display: grid!important;grid-template-columns: 1fr 1fr;grid-column-gap: 10px;',
        },
      });
      $('.rightside.js-scrollfix-bottom-rel .di-b.ar').remove();
    }

    function placeData(data) {
      let nt = create(
        'div',
        {
          class: 'theme-songs js-theme-songs',
        });
      let nt2 = nt.cloneNode(true);
      cleaner(anisongs_temp.target);
      let op = createTargetDiv('Openings', anisongs_temp.target, 0);
      if (data.opening_themes.length === 1) {
        op.children[0].innerText = 'Openings';
      }
      if (data.opening_themes.length === 0) {
        op.append(nt);
        nt.innerHTML = 'No opening themes have been added to this title. Help improve our database by adding an opening theme '+
          "<a class='embedLink' href=\"" +`https://myanimelist.net/dbchanges.php?aid=${currentid}&t=theme` + '">' + 'here' + '</a>';
      }
      let ed = createTargetDiv('Endings', anisongs_temp.target, 1);
      if (data.ending_themes.length === 1) {
        ed.children[0].innerText = 'Endings';
      }
      if (data.ending_themes.length === 0) {
        ed.append(nt2);
        nt2.innerHTML = 'No ending themes have been added to this title. Help improve our database by adding an ending theme '+
          "<a class='embedLink' href=\"" +`https://myanimelist.net/dbchanges.php?aid=${currentid}&t=theme` + '">' + 'here' + '</a>';
      }
      insert(data.opening_themes, op);
      insert(data.ending_themes, ed);
    }
    async function launch(currentid) {
      // get from cache and check TTL
      const cache = (await songCache.getItem(currentid)) || {
        time: 0,
      };
      if (cache.time + options.cacheTTL < +new Date()) {
        let mal_id = currentid;
        let status;
        const apiUrl = `https://api.jikan.moe/v4/anime/${currentid}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            status = data.data.status;
          });
        if (mal_id && ['Finished Airing', 'Currently Airing'].includes(status)) {
          const {data} = await API.getSongs(mal_id);
          let {openings: opening_themes, endings: ending_themes} = data;
          // add songs to cache if they're not empty and query videos
          if (opening_themes.length || ending_themes.length) {
            if (['Finished Airing', 'Currently Airing'].includes(status)) {
              try {
                const _videos = await new Videos(currentid).get();
                opening_themes = Videos.merge(opening_themes, _videos.OP);
                ending_themes = Videos.merge(ending_themes, _videos.ED);
              } catch (e) {
                console.log('Anisongs', e);
              }
            }
            await songCache.setItem(currentid, {
              opening_themes,
              ending_themes,
              time: +new Date(),
            });
          }
          // place the data onto site
          placeData({
            opening_themes,
            ending_themes,
          });
          return 'Downloaded songs';
        } else {
          return 'No malid';
        }
      } else {
        // place the data onto site
        placeData(cache);
        return 'Used cache';
      }
    }
  }
  //Anisongs for MAL //--END--//

  //Anime and Manga Header Position Change //--START--//
  if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && svar.animeHeader && !/\/(anime|manga)\/producer\/.?([\w-]+)?\/?/.test(current)) {
    set(1, '.h1.edit-info', {
      sa: {
        0: 'margin:0;width:97.5%',
      },
    });
    set(1, '#content > table > tbody > tr > td:nth-child(2) > .js-scrollfix-bottom-rel', {
      pp: {
        0: '.h1.edit-info',
      },
    });
  }

  //Clubs Page add class to Divs
  if (/\/(clubs.php).?([\w-]+)?\/?/.test(current)) {
    $('div.normal_header').next('table').addClass('clubDivs');
    $('div.bgNone').addClass('clubDivs');
    $('div.bgColor1').addClass('clubDivs');
    $('div.normal_header:contains("Club Pictures")').next().children().children().children().addClass('clubDivs');
    $('#content > table > tbody > tr > td[valign=top]:last-child').addClass('clubDivs');
    set(2, '.clubDivs', {
      sal: {
        0: 'border-radius:var(--br);overflow:hidden',
      },
    });
  }

  //Anime-Manga Image to Background Color //--END--//
})();
