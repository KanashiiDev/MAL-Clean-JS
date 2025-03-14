// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @match       https://myanimelist.net/*
// @match       https://www.mal-badges.com/users/*malbadges*
// @grant       none
// @version     1.29.88
// @author      KanashiiDev
// @description Customizations and fixes for MyAnimeList
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

//Simple Create Element Shorthand Function
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

//Advanced Create Element Shorthand Function
function AdvancedCreate(HTMLtag, classes, text, appendLocation, cssText) {
  var element = document.createElement(HTMLtag);
  if (Array.isArray(classes)) {
    element.classList.add(...classes);
    if (classes.includes("newTab")) {
      element.setAttribute("target", "_blank");
    }
  } else if (classes) {
    if (classes[0] === "#") {
      element.id = classes.substring(1);
    } else {
      element.classList.add(classes);
      if (classes === "newTab") {
        element.setAttribute("target", "_blank");
      }
    }
  }
  if (text || text === 0) {
    element.innerText = text;
  }
  if (appendLocation && appendLocation.appendChild) {
    appendLocation.appendChild(element);
  }
  if (cssText) {
    element.style.cssText = cssText;
  }
  return element;
}

function createDisplayBox(cssProperties, windowTitle) {
  let displayBox = AdvancedCreate("div", "maljsDisplayBox", false, document.querySelector("#myanimelist"));
  if (windowTitle) {
    AdvancedCreate("span", "maljsDisplayBoxTitle", windowTitle, displayBox)
  }
  let mousePosition;
  let offset = [0, 0];
  let isDown = false;
  let isDownResize = false;
  let displayBoxClose = AdvancedCreate("span", "maljsDisplayBoxClose", "x", displayBox);
  displayBoxClose.onclick = function () {
    displayBox.remove();
  };
  let resizePearl = AdvancedCreate("span", "maljsResizePearl", false, displayBox);
  displayBox.addEventListener("mousedown", function (e) {
    let root = e.target;
    while (root.parentNode) {//don't annoy people trying to copy-paste
      if (root.classList.contains("scrollableContent")) {
        return
      }
      root = root.parentNode
    }
    isDown = true;
    offset = [
      displayBox.offsetLeft - e.clientX,
      displayBox.offsetTop - e.clientY
    ];
  }, true);
  resizePearl.addEventListener("mousedown", function (event) {
    event.stopPropagation();
    event.preventDefault();
    isDownResize = true;
    offset = [
      displayBox.offsetLeft,
      displayBox.offsetTop
    ];
  }, true);
  document.addEventListener("mouseup", function () {
    isDown = false;
    isDownResize = false;
  }, true);
  document.addEventListener("mousemove", function (event) {
    if (isDownResize) {
      mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      displayBox.style.width = (mousePosition.x - offset[0] + 5) + "px";
      displayBox.style.height = (mousePosition.y - offset[1] + 5) + "px";
      return;
    }
    if (isDown) {
      mousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      displayBox.style.left = (mousePosition.x + offset[0]) + "px";
      displayBox.style.top = (mousePosition.y + offset[1]) + "px";
    }
  }, true);
  let innerSpace = AdvancedCreate("div", "scrollableContent", false, displayBox);
  return innerSpace;
}

async function compressLocalForageDB(dbName, dbName2 = null) {
  try {
    async function fetchDB(name) {
      const db = await localforage.createInstance({ name: "MalJS", storeName: name });
      const keys = await db.keys();
      let data = {};
      for (const key of keys) {
        const value = await db.getItem(key);
        data[key] = value;
      }
      return data;
    }
    const dbData = {};
    if (dbName) dbData[dbName] = await fetchDB(dbName);
    if (dbName2) dbData[dbName2] = await fetchDB(dbName2);

    // JSON -> LZString
    const jsonString = JSON.stringify(dbData);
    const compressedData = LZString.compressToBase64(jsonString).replace(/\//g, "_");

    return compressedData;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

//Time Calculate
function nativeTimeElement(e) {
  let $ = new Date(1e3 * e);
  if (isNaN($.valueOf())) return 'Now';
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

//Fix Date for Modern Anime/Manga List option
function parseDate(dateString, string) {
  const parts = dateString.split("-");
  let day = parts[0];
  let month = parts[1];
  let yearSuffix = parts[2];
  const currentYear = new Date().getFullYear();
  const currentYearSuffix = currentYear % 100 + 4;
  let year = parseInt(yearSuffix, 10) > currentYearSuffix ? "19" + yearSuffix : "20" + yearSuffix;
  const fromString = { month: parseInt(month, 10), day: parseInt(day, 10), year: parseInt(year, 10),};
  return string ? fromString : new Date(`${year}-${month}-${day}`).getTime();
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

//String Similarity
var stringSimilarity = function (str1, str2, substringLength, caseSensitive) {
  if (substringLength === void 0) { substringLength = 2; }
  if (caseSensitive === void 0) { caseSensitive = false; }
  if (!caseSensitive) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
  }
  if (str1.length < substringLength || str2.length < substringLength)
    return 0;
  var map = new Map();
  for (var i = 0; i < str1.length - (substringLength - 1); i++) {
    var substr1 = str1.substr(i, substringLength);
    map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
  }
  var match = 0;
  for (var j = 0; j < str2.length - (substringLength - 1); j++) {
    var substr2 = str2.substr(j, substringLength);
    var count = map.has(substr2) ? map.get(substr2) : 0;
    if (count > 0) {
      map.set(substr2, count - 1);
      match++;
    }
  }
  return (match * 2) / (str1.length + str2.length - ((substringLength - 1) * 2));
};

// Current Watching Airing Schedule - Calculate Time
async function airingTime(sec) {
  const timeUntilAiring = sec;
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  const targetTimeStamp = currentTimeStamp + timeUntilAiring;
  const remainingTime = targetTimeStamp - currentTimeStamp;
  const days = Math.floor(remainingTime / (24 * 60 * 60));
  const hours = Math.floor((remainingTime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
  return (days ? days + "d " : "") + (hours ? hours + "h " : "") + (minutes ? minutes + "m" : "");
};

// Anilist API Request
async function AnilistAPI(fullQuery) {
  var query = fullQuery;
  let url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    };
  await delay(333);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) {
      return null;
    }
    if (data.data) {
      return data;
    }
  } catch (error) {
    return null;
  }
}

async function replaceLocalForageDB(instance, newData) {
  const db = await localforage.createInstance({ name: "MalJS", storeName: instance });
  await db.clear();
  for (let i = 0; i < newData.length; i++) {
    await db.setItem(newData[i].key, newData[i]);
  }
}

// Current Watching Airing Schedule - Episode Behind
async function episodesBehind(c, w) {
  if (c - 1 <= w) {
    return;
  }
  else {
    const epBehind = c - 1 - w;
    return epBehind + " ep behind";
  }
}

//Rgb to Hex
function rgbToHex(rgb) {
  let result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return rgb;
  return (
    "#" + ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase());
}

//Days to TTL
function daysToTTL(days, toDay) {
  if (isNaN(days) || days <= 0) {
    return 86400000;
  }
  const ttl = toDay ? days / (1000 * 60 * 60 * 24) : days * 24 * 60 * 60 * 1000;
  return ttl;
}

// Anime-Manga Add Class
function aniMangaAddClass(main, name) {
  const h2 = $('h2:contains("' + main + '"):last');
  if (h2.length > 0) {
    name = name || main.split(" ").join("") + "Div";
    const parent = h2.parent();
    parent.is('div') && !parent.hasClass('leftside') && !parent.hasClass('rightside') ? parent.addClass(name) : h2.addClass(name);
  }
}

// Create MalClean List Divs
function createListDiv(title, buttons) {
  let btns = create("div", { class: 'mainListBtnsDiv' });
  for (let x = 0; x < buttons.length; x++) {
    let mainDiv = create("div", { class: 'mainListBtnDiv', id: buttons[x].b.id + 'Option' });
    $(mainDiv).append(buttons[x].b, "<h3>" + buttons[x].t + "</h3>", buttons[x]?.s);
    btns.append(mainDiv);
  }
  let div = create("div", { class: "malCleanSettingContainer" }, '<div class="malCleanSettingHeader"><h2>' + title + "</h2></div>");
  div.append(btns);
  return div;
}

//Get Text until Selector
function getTextUntil(selector) {
  let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
  let endElement = document.querySelector(selector);
  if (!main || !endElement) return "";
  let textContent = "";
  let collect = true;
  Array.from(main.childNodes).forEach(function (el, i) {
    if (el === endElement) {
      collect = false;
    }

    if (collect && i > 5 && el.className !== "normal_header") {
      if (el.nodeType === Node.ELEMENT_NODE) {
        textContent += el.innerHTML || "";
      } else if (el.nodeType === Node.TEXT_NODE) {
        textContent += el.textContent || "";
      }
    }
  });
  return textContent.trim();
}

//Add SCEditor Commands
async function addSCEditorCommands() {
  //ScEditor Color Picker
  sceditor.command.set("colorpick", {
    _dropDown: function (e, t) {
      if ($("input.bbcode-message-color-picker").length === 0) {
        $('<input type="color" class="bbcode-message-color-picker" />').css({ position: "absolute", opacity: 0, width: 0, height: 0 }).appendTo("body").val("#ff0000");
      }
      var colorPicker = $("input.bbcode-message-color-picker");
      colorPicker.css({
        top: $(t).offset().top + 24 + "px",
        left: $(t).offset().left + 12 + "px",
      });
      colorPicker.trigger("click");
      colorPicker.off("change").on("change", function () {
        var color = colorPicker.val();
        if (e.inSourceMode()) {
          e.insertText("[color=" + color + "]", "[/color]");
        } else {
          e.execCommand("forecolor", color);
        }
      });
    },
    exec: function (e) {
      sceditor.command.get("colorpick")._dropDown(this, e);
    },
    txtExec: function (e) {
      sceditor.command.get("colorpick")._dropDown(this, e);
    },
    tooltip: "Font Color",
  });

  //ScEditor Spoiler
  sceditor.formats.bbcode.set("spoiler", {
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    isInline: false,
    format: function (element, content) {
      var desc = "";
      var $elm = $(element);
      var $button = $elm.children("button").first();
      if ($button.length === 1 || $elm.data("desc")) {
        desc = $button.text() || $elm.data("desc");
        $button.remove();
        content = this.elementToBbcode(element);
        if (desc === "spoiler") {
          desc = "";
        } else if (desc.charAt(0) !== "=") {
          desc = "=" + desc;
          $elm.data("desc", desc);
        }
        $elm.prepend($button);
      }

      return "[spoiler" + desc + "]" + content + "[/spoiler]";
    },
    html: function (token, attrs, content) {
      var data = "";
      var desc = attrs.defaultattr || "Spoiler";
      content =
        '<div class="spoiler">' +
        '<input type="button" class="button show_button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" data-showname="Show Spoiler" data-hidename="Hide Spoiler" value="Show ' +
        desc +
        '">' +
        '<span class="spoiler_content" style="display:none">' +
        '<input type="button" class="button hide_button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide ' +
        desc +
        '">' +
        "<br>" +
        content +
        "</span></div>";
      if (attrs.defaultattr) {
        data += ' data-desc="' + sceditor.escapeEntities(attrs.defaultattr) + '"';
      }
      return "<blockquote" + data + ' class="spoiler">' + content + "</blockquote>";
    },
  });
  sceditor.command.set("spoiler", {
    exec: function (caller) {
      var html = '<blockquote class="spoiler"><button>spoiler</button><span class="spoiler_content" style="display:none"></span></blockquote>';
      this.wysiwygEditorInsertHtml(html);
      $(this.getBody())
        .find("blockquote.spoiler")
        .each(function () {
          if ($(this).find("button").length == 0) {
            $(this).prepend("<button>spoiler</button>");
          }
        });
    },
    txtExec: ["[spoiler]", "[/spoiler]"],
    tooltip: "Insert a spoiler",
  });

  //ScEditor Center
  sceditor.formats.bbcode.set("center", {
    styles: {
      "text-align": ["center", "-webkit-center", "-moz-center", "-khtml-center"],
    },
    isInline: false,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function (element, content) {
      return "[center]" + content + "[/center]";
    },
    html: function (token, attrs, content) {
      return '<div style="text-align: center;">' + content + '</div>';
    }
  });

  //ScEditor Right
  sceditor.formats.bbcode.set("right", {
    styles: {
      "text-align": ["right", "-webkit-right", "-moz-right", "-khtml-right"],
    },
    isInline: false,
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    format: function (element, content) {
      return "[right]" + content + "[/right]";
    },
    html: function (token, attrs, content) {
      return '<div style="text-align: right;">' + content + '</div>';
    }
  });

  //ScEditor Color
  sceditor.formats.bbcode.set("color", {
    styles: {
      "color": null
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      let color = element.style.color;
      if (color.startsWith("rgb")) color = rgbToHex(color);
      return "[color=" + color + "]" + content + "[/color]";
    },
    html: function (token, attrs, content) {
      return '<span style="color: ' + (attrs.defaultattr || "inherit") + ';">' + content + '</span>';
    }
  });

  //ScEditor Size
  sceditor.formats.bbcode.set("size", {
    styles: {
      "font-size": null
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      let fontSize = element.style.fontSize;
      if (!fontSize) return content;
      return `[size=${fontSize.replace("px", "").replace("%", "")}]${content}[/size]`;
    },
    html: function (token, attrs, content) {
      let sizeValue = attrs.defaultattr ? attrs.defaultattr + "%" : "inherit";
      return `<span style="font-size: ${sizeValue};">${content}</span>`;
    }
  });

  //ScEditor Font
  sceditor.formats.bbcode.set("font", {
    styles: {
      "font-family": null
    },
    isInline: true,
    allowsEmpty: true,
    format: function (element, content) {
      return "[font=" + element.style.fontFamily + "]" + content + "[/font]";
    },
    html: function (token, attrs, content) {
      return '<span style="font-family: ' + (attrs.defaultattr || "inherit") + ';">' + content + '</span>';
    }
  });
  //ScEditor Div
  sceditor.formats.bbcode.set("div", {
    allowsEmpty: true,
    breakAfter: false,
    breakBefore: false,
    isInline: false,
    tags: {
      div: {
        id: null,
        class: null,
        style: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      return `[div${elId}${elClass}${elStyle}]${content}[/div]`;
    },

    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-div"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-div"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      return `<div${elId}${elClass}${elStyle}>${content}</div>`;
    },

  });
  sceditor.command.set("div", {
    txtExec: function (caller, content) {
      let editor = this;
      let sce_div = '<div id="sce_divoptionsbox"><div class="sce_div-option" data-action="insertDiv">';
      sce_div += '<label for="div-id">ID (Optional):</label><input id="div-id" type="text" placeholder=".id" />';
      sce_div += '<label for="div-class">Class (Optional):</label><input id="div-class" type="text" placeholder="#class" />';
      sce_div += '<label for="div-style">Style (Optional):</label><input id="div-style" type="text" placeholder="" /><br>';
      sce_div += '<input id="insert-div-btn" type="button" class="button" value="Insert"></input>';
      sce_div += "</div></div>";
      let drop_content = $(sce_div);

      // Handle div insertion
      drop_content.find("#insert-div-btn").click(function (e) {
        let divId = $("#div-id").val() ? ` id="${$("#div-id").val()}"` : "";
        let divClass = $("#div-class").val() ? ` class="${$("#div-class").val()}"` : "";
        let divStyle = $("#div-style").val() ? ` style="${$("#div-style").val()}"` : "";
        let divTag = `[div${divId}${divClass}${divStyle}]${content}[/div]`;
        editor.insert(divTag);
        editor.closeDropDown(true);
        e.preventDefault();
      });
      editor.createDropDown(caller, "div-picker", drop_content[0]);
    },
    tooltip: "Insert a Div",
  });

  //ScEditor Iframe
  sceditor.formats.bbcode.set("iframe", {
    allowsEmpty: false,
    tags: {
      iframe: {
        class: null,
        style: null,
        src: null,
        width: null,
        height: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      let src = element.getAttribute("src");
      let width = element.getAttribute("width") || 415;
      let height = element.getAttribute("height") || 315;
      let title = element.getAttribute("title") ? ` title="${element.getAttribute("title")}"` : "";
      let sandbox = element.getAttribute("sandbox") ? ` sandbox="${element.getAttribute("sandbox")}"` : "";
      let allow = element.getAttribute("allow") ? ` allow="${element.getAttribute("allow")}"` : "";
      let loading = element.getAttribute("loading") ? ` loading="${element.getAttribute("loading")}"` : "";
      let referrerpolicy = element.getAttribute("referrerpolicy") ? ` referrerpolicy="${element.getAttribute("referrerpolicy")}"` : "";
      let mergedAttributes = `${title}${sandbox}${allow}${loading}${referrerpolicy}`;

      if (src && src.startsWith("https://")) {
        return `[iframe${elId}${elClass}${elStyle} width="${width}" height="${height}"${mergedAttributes}]${src}[/iframe]`;
      }
      return content;
    },
    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-iframe"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-iframe"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      let width = attrs.width || 415;
      let height = attrs.height || 315;
      let title = attrs.title ? ` title="${attrs.title}"` : "";
      let allow = attrs.allow ? ` allow="${attrs.allow}"` : "";
      let loading = attrs.loading ? ` loading="${attrs.loading}"` : "";
      let referrerpolicy = attrs.referrerpolicy ? ` referrerpolicy="${attrs.referrerpolicy}"` : "";
      let sandbox = 'sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"';
      let mergedAttributes = `${title}${allow}${loading}${referrerpolicy}`;

      if (content && content.startsWith("https://")) {
        return `<iframe${elId}${elClass}${elStyle} width="${width}" height="${height}" src="${content}" ${mergedAttributes} ${sandbox}></iframe>`;
      }
      return "";
    },

  });
  sceditor.command.set("iframe", {
    txtExec: function (caller) {
      var editor = this;
      var sce_iframe = '<div id="sce_iframeoptionsbox"><div class="sce_iframe-option" data-action="insertIframe">';
      sce_iframe += '<label for="iframe-src">Iframe URL:</label><input id="iframe-src" type="text" placeholder="https://" />';
      sce_iframe += '<label for="iframe-width">Width (Optional):</label><input id="iframe-width" type="text" placeholder="" />';
      sce_iframe += '<label for="iframe-height">Height (Optional):</label><input id="iframe-height" type="text" placeholder="" />';
      sce_iframe += '<label for="iframe-style">Style (Optional):</label><input id="iframe-style" type="text" placeholder="" /><br>';
      sce_iframe += '<label for="iframe-html-src">Iframe as HTML (Optional):</label><textarea id="iframe-html-src" placeholder="<iframe src=&quot;&quot;></iframe>" /></textarea>';
      sce_iframe += '<input id="insert-iframe-btn" type="button" class="button" value="Insert"></input>';
      sce_iframe += "</div></div>";
      var drop_content = $(sce_iframe);

      // Handle iframe insertion
      drop_content.find("#insert-iframe-btn").click(function (e) {
        let iframeSrc = $("#iframe-src").val();
        let iframeHTMLSrc = $("#iframe-html-src").val();
        let iframeWidth = $("#iframe-width").val() ? ` width="${$("#iframe-width").val()}"` : "";
        let iframeHeight = $("#iframe-height").val() ? ` height="${$("#iframe-height").val()}"` : "";
        let iframeStyle = $("#iframe-style").val() ? ` style="${$("#iframe-style").val()}"` : "";

        if (iframeHTMLSrc) {
          iframeSrc = "";
        }
        if (iframeSrc.startsWith("https://") && !iframeHTMLSrc) {
          var iframeTag = `[iframe${iframeWidth}${iframeHeight}${iframeStyle}]${iframeSrc}[/iframe]`;
          editor.insert(iframeTag);
        }
        if (/src="https:\/\//.test(iframeHTMLSrc)) {
          var iframeTag = iframeHTMLSrc;
          editor.insert(iframeTag);
        }
        editor.closeDropDown(true);
        e.preventDefault();
      });


      editor.createDropDown(caller, "iframe-picker", drop_content[0]);
    },
    tooltip: "Insert an Iframe",
  });

  //ScEditor Video
  sceditor.formats.bbcode.set("video", {
    allowsEmpty: false,
    tags: {
      video: {
        src: null,
        width: null,
        height: null,
      },
    },
    format: function (element, content) {
      let elId = element.getAttribute("id") ? ` id="${element.getAttribute("id")}"` : "";
      let elClass = element.getAttribute("class") ? ` class="${element.getAttribute("class")}"` : "";
      let elStyle = element.getAttribute("style") ? ` style="${element.getAttribute("style")}"` : "";
      let src = element.getAttribute("src");
      let width = element.getAttribute("width") || 415;
      let height = element.getAttribute("height") || 315;
      let autoplay = element.getAttribute("autoplay") === "" ? " autoplay=1" : "";
      let controls = element.getAttribute("controls") === "" ? "" : " controls=0";
      let muted = element.getAttribute("muted") === "" ? " muted=1" : "";
      let loop = element.getAttribute("loop") === "" ? " loop=1" : "";
      let poster = element.getAttribute("poster") ? ` poster="${element.getAttribute("poster")}"` : "";
      let mergedAttributes = `${autoplay}${controls}${muted}${loop}${poster}`;
      return src ? `[video width="${width}" height="${height}"${mergedAttributes}]${src}[/video]` : content;
    },
    html: function (token, attrs, content) {
      let elId = attrs.id ? ` id="${attrs.id}"` : ` id="mc-video"`;
      let elClass = attrs.class ? ` class="${attrs.class}"` : ` class="mc-video"`;
      let elStyle = attrs.style ? ` style="${attrs.style}"` : "";
      let width = attrs.width || 415;
      let height = attrs.height || 315;
      let autoplay = attrs.autoplay ? " autoplay" : "";
      let controls = attrs.controls == 0 ? "" : " controls";
      let muted = attrs.muted || autoplay ? " muted" : "";
      let loop = attrs.loop ? " loop" : "";
      let poster = attrs.poster ? ` poster="${attrs.poster}"` : "";
      let mergedAttributes = `${autoplay}${controls}${muted}${loop}${poster}`;
      return `<video ${elId}${elClass}${elStyle} width="${width}" height="${height}" frameborder="0" src="${content}" ${mergedAttributes} onloadstart="this.volume=0.5"></video>`;
    },

  });
  sceditor.command.set("video", {
    txtExec: function (caller) {
      var editor = this;
      var sce_video = '<div id="sce_videooptionsbox"><div class="sce_video-option" data-action="insertVideo">';
      sce_video += '<label for="video-url">Video URL:</label><input id="video-url" type="text" placeholder="https://" />';
      sce_video += '<label for="video-width">Width (Optional):</label><input id="video-width" type="text" placeholder="" />';
      sce_video += '<label for="video-height">Height (Optional):</label><input id="video-height" type="text" placeholder="" />';
      sce_video += '<label for="video-style">Style (Optional):</label><input id="video-style" type="text" placeholder="" /><br>';
      sce_video += '<div><label><input type="checkbox" id="video-autoplay" /> Autoplay</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-muted" /> Muted</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-loop" /> Loop</label></div>';
      sce_video += '<div><label><input type="checkbox" id="video-controls" checked /> Controls</label></div>';
      sce_video += '<input id="insert-video-btn" type="button" class="button" value="Insert"></input>';
      sce_video += "</div></div>";
      var drop_content = $(sce_video);

      // Handle video insertion
      drop_content.find("#insert-video-btn").click(function (e) {
        let videoSrc = $("#video-url").val();
        let videoWidth = $("#video-width").val() ? ` width="${$("#video-width").val()}"` : "";
        let videoHeight = $("#video-height").val() ? ` height="${$("#video-height").val()}"` : "";
        let videoStyle = $("#video-style").val() ? ` style="${$("#video-style").val()}"` : "";

        // Get checked attributes
        let autoplay = $("#video-autoplay").is(":checked") ? " autoplay=1" : "";
        let muted = $("#video-muted").is(":checked") ? " muted=1" : "";
        let loop = $("#video-loop").is(":checked") ? " loop=1" : "";
        let controls = $("#video-controls").is(":checked") ? "" : " controls=0";

        if (videoSrc) {
          var videoTag = `[video${videoWidth}${videoHeight}${videoStyle}${autoplay}${muted}${loop}${controls}]${videoSrc}[/video]`;
          editor.insert(videoTag);
        }
        editor.closeDropDown(true);
        e.preventDefault();
      });

      editor.createDropDown(caller, "video-picker", drop_content[0]);
    },
    tooltip: "Insert a Video",
  });

}

//Add SCEditor
async function addSCEditor(source) {
  await addSCEditorCommands();
  sceditor.create(source, {
    format: "bbcode",
    style: "/css/sceditor.inner.css",
    width: "100%",
    height: "180px",
    charset: "utf-8",
    emoticonsEnabled: true,
    resizeMaxHeight: -1,
    resizeMinHeight: 100,
    resizeMinWidth: 440,
    resizeHeight: true,
    resizeWidth: false,
    startInSourceMode: true,
    autoUpdate: true,
    toolbar: "bold,italic,underline,strike|size,center,right,colorpick|bulletlist,orderedlist|code,quote,spoiler|image,link,youtube|video,iframe,div",
    allowIFrame: true,
    allowedIframeUrls: [],
    toolbarExclude: null,
    parserOptions: {},
    allowedTags: ['*'],
    allowElements: ['*'],
    allowedAttributes: ['*'],
    disallowedTags: [],
    disallowedAttibs: [],
  });
}

//ScParser toBBCode Function
function scParserActions(elementId, type) {
  const scParser = sceditor.instance(document.getElementById(elementId));
  let scText = scParser.val();
  if (type === 'getVal') {
    return scText;
  }
  if (type === 'fromBBGetVal') {
    return scParser.fromBBCode(scText, true);
  }
  if (type === 'bbRefresh') {
    let bbCodeContent = scParser.toBBCode(scText);

    scParser.val(bbCodeContent);
  }
}

// Add Divs to People Details
function peopleDetailsAddDiv(title) {
  let divElements = $('span:contains("' + title + '"):last').nextUntil('div');
  let divNameElement = $('span.dark_text:contains("' + title + '")');
  let divNameText = divNameElement[0] && divNameElement[0].nextSibling ? divNameElement[0].nextSibling.nodeValue.trim() : null;
  let newDiv = $('<div class="spaceit_pad"></div>').html(title + ' ' + divNameText);
  for (let x = 0; x < divElements.length; x++) {
    newDiv.append(divElements[x]);
  }
  if (divNameElement) {
    divNameText ? divNameElement[0].nextSibling.nodeValue = "" : null;
    divNameElement.after(newDiv);
    divNameElement.remove();
  }
}

// Add Div to Empty Anime/Manga Info
function emptyInfoAddDiv(title, mode) {
  let newDiv = $('<div itemprop="description" style="display: block;"></div>');
  let cDiv = $(title)[0];
  let siblings = [];
  if (mode) {
    while (cDiv.nextSibling && cDiv.nextSibling.nodeName !== "DIV") {
      siblings.push(cDiv.nextSibling);
      cDiv = cDiv.nextSibling;
    }
  } else {
    for (let i = 0; i < 3; i++) {
      if (cDiv.nextSibling.nodeName !== "BR") {
        siblings.push(cDiv.nextSibling);
        cDiv = cDiv.nextSibling;
      }
    }
  }
  newDiv.append(...siblings);
  $(title).after(newDiv);
}

//Check Empty Anime & Manga info
function handleEmptyInfo(divSelector, checkText, mode) {
  const $div = $(divSelector);
  if ($div.length) {
    const nextSibling = $div[0].nextSibling;
    if (nextSibling && !$(nextSibling).attr('itemprop') && (nextSibling.nodeValue || nextSibling.innerText) && (nextSibling.nodeValue || nextSibling.innerText).includes(checkText)) {
      emptyInfoAddDiv(divSelector, mode);
      if (nextSibling.innerHTML) {
        nextSibling.innerHTML = nextSibling.innerHTML.replace('<br>', '');
      }
    }
  }
}

//Get Recently Added from MyAnimeList
async function getRecentlyAdded(type, page) {
  const dataArray = [];
  try {
    await delay(250);
    const response = await fetch(`https://myanimelist.net/${type ? 'manga' : 'anime'}.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1&show=${page ? page : '0'}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const rows = doc.querySelectorAll('div.js-categories-seasonal tr');

    rows.forEach(row => {
      const imgSrc = row.querySelector('td img') ? row.querySelector('td img').getAttribute('data-src').replace('/r/50x70/', '/') : '';
      if (imgSrc) {
        const title = row.querySelector('td strong') ? row.querySelector('td strong').textContent : '';
        const type = row.querySelector('td[width="45"]') ? row.querySelector('td[width="45"]').textContent.trim() : '';
        const url = row.querySelector('td a') ? row.querySelector('td a').href : '';
        dataArray.push({
          img: imgSrc,
          title: title,
          type: type,
          url: url,
        });
      }
    });
    return dataArray;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

//Build Recently Added List
async function buildRecentlyAddedList(list, appLoc) {
  for (let x = 1; x < list.length; x++) {
    let rDiv = create("li", { class: "btn-anime" });
    rDiv.innerHTML =
      '<i class="fa fa-info-circle" style="font-family: &quot;Font Awesome 6 Pro&quot;; position: absolute; right: 3px; top: 3px; padding: 4px; opacity: 0; transition: 0.4s; z-index: 20;"></i>' +
      '<a class="link" href=' +
      list[x].url +
      ">" +
      '<img width="124" height="170" class="lazyloaded" src=' +
      list[x].img +
      ">" +
      '<span class="recently-added-type">' + list[x].type + '</span>' +
      '<span class="title js-color-pc-constant color-pc-constant">' +
      list[x].title +
      "</span></a>";
    document.querySelector(appLoc).append(rDiv);
  }
}

//Add all Recently Added Items to List
function addAllRecentlyAdded(main, list) {
  main.forEach(item => {
    if (!list.contains(item)) {
      list.appendChild(item);
    }
  });
}

//Filter Recently Added List
function filterRecentlyAdded(items, selectedTypes) {
  items.forEach(item => {
    const type = item.querySelector('.recently-added-type').textContent;
    if (!selectedTypes.includes(type)) {
      item.remove();
    }
  });
}

//Update Recently Added List Sliders
function updateRecentlyAddedSliders(slider, leftSlider, rightSlider) {
  if (slider.childNodes.length > 4) {
    document.querySelector(rightSlider).classList.add("active");
  } else {
    document.querySelector(rightSlider).classList.remove("active");
  }
  document.querySelector(leftSlider).classList.remove("active");
  $(".widget-container.left.recently-anime i").on('click', async function () {
    infoExit('.widget-container.left.recently-anime .anime_suggestions', $(this));
    createInfo($(this), '.widget-container.left.recently-anime .anime_suggestions');
  }).on('mouseleave', async function () {
    infoExit('.widget-container.left.recently-anime .anime_suggestions', $(this));
  });
  $(".widget-container.left.recently-manga i").on('click', async function () {
    infoExit('.widget-container.left.recently-manga .anime_suggestions', $(this));
    createInfo($(this), '.widget-container.left.recently-manga .anime_suggestions', 1);
  }).on('mouseleave', async function () {
    infoExit('.widget-container.left.recently-manga .anime_suggestions', $(this));
  });
}

//Create Info Tooltip
let waitForInfo = 0;
async function createInfo(clickedSource, mainDiv, type) {
  if (!waitForInfo && $(".tooltipBody").length === 0) {
    waitForInfo = 1;
    clickedSource.attr("class", 'fa fa-circle-o-notch fa-spin');
    let info, isFailed;
    if (!clickedSource.closest(".btn-anime")[0].getAttribute("details")) {
      //Get info from Jikan API
      async function getinfo(id) {
        const apiUrl = `https://api.jikan.moe/v4/${type ? 'manga' : 'anime'}/${id}/full`;
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          info = data.data;
        }
        catch (error) {
          info = '<div class="main">Error: ' + error + '</div>';
          isFailed = 1;
        }
      }
      let id = clickedSource.next(".link")[0].href.split("/")[4];
      await getinfo(id);
      if (info.title) {
        info =
          '<div class="main">' +
          (info.title ? '<div class="text" style="position: relative;border-bottom: 1px solid;"><h3 style="max-width: 90%;margin-top: 5px;">' + info.title + "</h3><a id='" + info.mal_id + "' class='addtoList'>Add to List</a></div>" : "") +
          (info.title_english && info.title_english !== info.title ? '<br><div class="text"><b>English Title</b><br>' + info.title_english + "</div>" : "") +
          (info.synopsis ? '<br><div class="text"><b>Synopsis</b><br>' + info.synopsis.replace(/(\[Written by MAL Rewrite\]+)/gm, '') + "</div>" : "") +
          (info.genres && info.genres[0]
            ? '<br><div class="text"><b>Genres</b><br>' +
            info.genres
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(", ") +
            "</div>"
            : "") +
          (info.studios && info.studios[0]
            ? '<br><div class="text"><b>Studios</b><br>' +
            info.studios
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(", ") +
            "</div>"
            : "") +
          (info.authors && info.authors[0]
            ? '<br><div class="text"><b>Authors</b><br>' +
            info.authors
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(", ") +
            "</div>"
            : "") +
          (info.serializations && info.serializations[0]
            ? '<br><div class="text"><b>Serialization</b><br>' +
            info.serializations
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(", ") +
            "</div>"
            : "") +
          (info.themes && info.themes[0]
            ? '<br><div class="text"><b>Themes</b><br>' +
            info.themes
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(", ") +
            "</div>"
            : "") +
          (info.demographics && info.demographics[0]
            ? '<br><div class="text"><b>Demographics</b><br>' +
            info.demographics
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(", ") +
            "</div>"
            : "") +
          (info.type ? '<br><div class="text"><b>Type</b><br>' + info.type + "</div>" : "") +
          (info.rating ? '<br><div class="text"><b>Rating</b><br>' + info.rating + "</div>" : "") +
          (info.aired && info.aired.string ? '<br><div class="text"><b>Start Date</b><br>' + info.aired.string.split(" to ?").join("") + "</div>" : "") +
          (info.broadcast && info.broadcast.string ? '<br><div class="text"><b>Broadcast</b><br>' + info.broadcast.string + "</div>" : "") +
          (info.episodes ? '<br><div class="text"><b>Episodes</b><br>' + info.episodes + "</div>" : "") +
          (info.chapters ? '<br><div class="text"><b>Chapters</b><br>' + info.chapters + "</div>" : "") +
          (info.volumes ? '<br><div class="text"><b>Volumes</b><br>' + info.volumes + "</div>" : "") +
          (info.trailer && info.trailer.embed_url ? '<br><div class="text"><b>Trailer</b><br>' +
            '<div class="spoiler">' +
            '<input type="button" class="button show_button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" data-showname="Show Trailer" data-hidename="Hide Trailer" value="Show Trailer">' +
            '<span class="spoiler_content" style="display:none">' +
            '<input type="button" class="button hide_button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide Trailer">' + '<br>' +
            '<iframe width="700" height="400" class="movie youtube" frameborder="0" autoplay="0" allow="fullscreen" src="' + info.trailer.embed_url.split("&autoplay=1").join("") + '"></iframe></span></div>' +
            "</div>" : "") +
          '<br><div class="text"><b>Forum</b><br>' +
          "<a href='" + info.url + "/forum" + "'>All</a> | <a href='" + info.url + "/forum?topic=episode" + "'>" + (type ? "Chapters" : "Episodes") + "</a> | <a href='" + info.url + "/forum?topic=other" + "'>Other</a></div>" +
          (info.external && info.external[0]
            ? '<br><div class="text"><b>Available At</b><br>' +
            info.external
              .map((node) => "<a href='" + node.url + "'>" + node.name + "</a>")
              .toString()
              .split(",")
              .join(" | ") +
            "</div>"
            : "");
      } else {
        info = '<div class="main">No information found in JikanAPI</div>';
      }
      if (!isFailed) {
        clickedSource.closest(".btn-anime")[0].setAttribute("details", "true");
        $('<div class="tooltipDetails"></div>').html(info).appendTo(clickedSource.closest(".btn-anime"));
      }
    }
    var title = await clickedSource.attr("alt");
    clickedSource.data("tooltipTitle", title);

    $(
      '<div class="tooltipBody">' +
      ($(".tooltipBody").length === 0 && clickedSource.closest(".btn-anime")[0].children[2]
        ? clickedSource.closest(".btn-anime")[0].children[2].innerHTML
        : "") +
      "</div>",
    )
      .appendTo(mainDiv)
      .slideDown(400);
    $(".tooltipBody .addtoList").on('click', async function () {
      await editPopup($(this).attr('id'));
    });
    clickedSource.attr("class", 'fa fa-info-circle');
    waitForInfo = 0;
  }
}

//Info Tooltip Check Mouse Leave
async function infoExit(mainDiv, clickedFrom) {
  let timeoutId, isElHover, isTTBHover;
  async function handleTooltipHide() {
    isElHover = clickedFrom.parent().is(":hover");
    isTTBHover = $(".tooltipBody:hover").length;
    // Check if neither the tooltip nor the target element is being hovered over
    if (!isTTBHover && !isElHover) {
      await delay(250);
      if (!isTTBHover && !isElHover) {
        // When both elements are not hovered, hide the tooltip
        $(".tooltipBody").slideUp(400, function () {
          $(this).remove(); // Remove tooltip
          clearTimeout(timeoutId);
        });
      }
    } else {
      // If hovered, keep checking the condition at intervals
      timeoutId = setTimeout(handleTooltipHide, 400);
    }
  }
  // Initial check to start the hide process
  timeoutId = setTimeout(handleTooltipHide, 400);
}

async function getBlogContent() {
  const tdElements = document.querySelectorAll('td[width="50%"][valign="top"]');
  for (const td of tdElements) {
    const linkElement = td.querySelector('a[href^="/blog.php?eid="]');
    if (linkElement) {
      const blogUrl = linkElement.getAttribute("href");
      try {
        const response = await fetch(blogUrl);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const blogContent = doc.querySelector(".blog_detail_content_wrapper");
        if (blogContent) {
          td.setAttribute('class', 'blogMainWide');
          const targetDiv = td.querySelector('div:nth-child(2)');
          if (targetDiv) {
            const newDiv = create('div', { class: "blog_detail_content_wrapper", style: { width: 'auto', maxHeight: "500px", overflow: "auto", margin: "10px 0px" } })
            newDiv.innerHTML = blogContent.innerHTML;
            targetDiv.parentNode.insertBefore(newDiv, targetDiv.nextSibling);
          }
        }
        await delay(333);
      } catch (error) {
        console.error("An error occurred while retrieving blog content:", error);
      }
    }
  }
}

async function getUserGenres(type, createDiv) {
  const genreTitle = type ? 'Manga' : 'Anime';
  const genreType = type ? 'manga' : 'anime';
  const apiUrl = `https://myanimelist.net/profile/${username}/chart-data.json?type=${genreType}-genre-table&sort=count&order=desc&categories=genres%2Cthemes`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const items = data.items;
      if (items && items.length > 0 && createDiv) {
        const itemsTop5 = data.items.slice(0, 5);
        let genresDivMain = create("div", { class: "user-genres", id: `user-${genreType}-genres` }, `<h5 style="font-size: 11px;margin-bottom: 8px;margin-left: 2px;">${genreTitle} Genre Overview</h5>`);
        let genresDiv = create("div", { class: "user-genres-container", id: "user-genres-container" });
        let genresDivInner = create("div", { class: "user-genres-inner", id: "user-genres-inner" });
        genresDivMain.append(genresDiv);
        genresDiv.append(genresDivInner);
        if ($('#user-anime-genres').length) {
          $('#user-anime-genres').after(genresDivMain);
        } else {
          $('.user-button.clearfix.mb12').after(genresDivMain);
        }
        itemsTop5.forEach(item => {
          const genreDiv = create("div", { class: "user-genre-div" });
          const genreName = create("div", { class: "user-genre-name" }, `<a href="${item.item_list_url}">${item.item}</a>`);
          const genreCount = create("div", { class: "user-genre-count" }, `<b>${item.item_count} </b><p>Entries</p>`);
          genreDiv.append(genreName, genreCount);
          genresDivInner.append(genreDiv);
        });
        $(genresDiv).css('width', 'max-content');
        $('#user-status-history-div').css('margin-top', '10px');
        while (genresDivInner.offsetWidth > 425) {
          genresDivInner.lastChild.remove();
        }
        $(genresDiv).css('width', 'auto');
      } else if (items && items.length > 0) {
        return items;
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}

async function getMalBadges(url) {
  if (!svar.modernLayout) url += '&default';
  let badgesDivMain = create("div", { class: "user-mal-badges", id: "user-mal-badges" }, `<h5 style="font-size: 11px;margin-bottom: 8px;margin-left: 2px;">Mal Badges</h5>`);
  let badgesDivInner = create("div", { class: "badges-inner", id: "badges-inner" });
  let badgesDivIframeInner = create("div", { class: "badges-iframe-inner", id: "badges-iframe-inner" });
  let badgesIframe = create("iframe", { class: "badges-iframe", id: "badges-iframe", tabindex: "-1", scrolling: "no", width: "415", height: "315", src: url, style: { display: 'none' } });
  let badgesIframeLoading = create("div", {
    class: "actloading", style: { position: 'relative', left: '0px', right: '0px', fontSize: '14px', height: '120px', alignContent: 'center', zIndex: '2' },
  }, "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome;word-break: break-word;"></i>');
  if (!svar.modernLayout) {
    $([badgesIframe, badgesDivIframeInner, badgesDivInner]).addClass('defaultMal');
    badgesIframeLoading.style.height = "72px";
  }
  badgesIframe.onerror = function () {
    badgesDivMain.remove();
  };
  badgesIframe.onload = function () {
    badgesIframeLoading.remove();
    badgesIframe.style.display = "block";
  };
  badgesDivMain.append(badgesDivInner);
  badgesDivInner.append(badgesDivIframeInner);
  badgesDivIframeInner.append(badgesIframeLoading, badgesIframe);
  $(badgesDivIframeInner).wrap(`<a href="${url.split('?')[0]}"></a>`);
  $('#user-badges-div').after(badgesDivMain);
}

// Add More Favorites
async function addMoreFavs(storeType, valid = 0) {
  const moreFavsLocalForage = localforage.createInstance({ name: "MalJS", storeName: "moreFavs_" + storeType });
  let moreFavsCache = await moreFavsLocalForage.getItem(entryId + "-" + entryType);
  const favButton = document.querySelector('#favOutput');
  const isFavorite = moreFavsCache !== null;
  if (isFavorite) {
    $("#favOutput").text('Remove from Favorites');
  }

  const defaultImg = document.querySelector('div:nth-child(1) > a > img');
  const characterTitle = $('.title-name').text().replace(/\(.*\)/, '').replace(/\".*\"/, '').trim().replace(/"[^"]*"\s*/, '').split(/\s+/);
  const formattedCharacterTitle = [characterTitle.reverse().join(', '), characterTitle.reverse().join(' ')];

  favButton.addEventListener("click", async () => {
    await waitForFavoriteDiv();
    const isCurrentlyFavorite = $("#favOutput").text().trim() === 'Add to Favorites';
    const maxFavCheck = $("#v-favorite > div").text().trim().startsWith('Only');
    if (maxFavCheck) {
      if (isCurrentlyFavorite) {
        // add
        await moreFavsLocalForage.setItem(entryId + "-" + entryType, {
          key: entryId + "-" + entryType,
          title: storeType === "character" ? formattedCharacterTitle : entryTitle,
          type: storeType === "character" ? 'CHARACTERS' : entryType,
          source: storeType === "character" ? $("#content > table > tbody > tr > td.borderClass > table").find('a').eq(1).text() : entryTitle,
          url: location.pathname,
          defaultImage: moreFavsCache?.defaultImage || (defaultImg?.src?.replace(/\.\w+$/, '').replace('https://cdn.myanimelist.net/images/', '') || ""),
          defaultImageSrc: moreFavsCache?.defaultImageSrc || defaultImg?.src
        });
        updateFavUI(true);
      } else {
        // remove
        await moreFavsLocalForage.removeItem(entryId + "-" + entryType);
        updateFavUI(false);
      }
      if (svar.moreFavsMode) {
        const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character");
        await editAboutPopup(`moreFavs/${moreFavsDB}`, 'moreFavs', 1);
      }
    }
  });

  // Update Fav Text
  async function updateFavUI(isFavorite) {
    await delay(500);
    $("#favOutput").text(isFavorite ? 'Remove from Favorites' : 'Add to Favorites');
    const intervalId = setInterval(() => {
      const favDiv = $("#v-favorite > div");
      if (favDiv.text().trim().startsWith('Only') || !favDiv.length || !favDiv.text().trim().includes('Mal-Clean:')) {
        if (favDiv.length) {
          favDiv.text(isFavorite ? 'Mal-Clean: Added Successfully' : 'Mal-Clean: Removed Successfully');
        }
      } else {
        clearInterval(intervalId);
      }
    }, 250);
  }

  //Wait for the Fav Status
  async function waitForFavoriteDiv(interval = 250) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if ($("#v-favorite > div").length) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, interval);
    });
  }
}

// Add Custom Cover
async function getCustomCover(storeType) {
  if (location.pathname.endsWith('/pics')) {
    const coverLocalForage = localforage.createInstance({ name: "MalJS", storeName: storeType });
    let coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
    const picTable = document.querySelector("#content > table > tbody > tr > td:nth-child(2) table[cellspacing='10']");
    const mainButton = create('a', { active: '0', class: 'add-custom-pic-button', style: { cursor: 'pointer' } }, 'Change Cover');
    const defaultImg = document.querySelector('div:nth-child(1) > a > img');
    const characterTitle = $('.title-name').text().replace(/\(.*\)/, '').replace(/\".*\"/, '').trim().replace(/"[^"]*"\s*/, '').split(/\s+/);
    const formattedCharacterTitle = [characterTitle.reverse().join(', '), characterTitle.reverse().join(' ')];
    $('.floatRightHeader').append(' - ', mainButton);
    mainButton.addEventListener("click", async () => {
      const active = $(mainButton).attr('active');
      if (active == '0') {
        if (!document.querySelector("#customCoverPreview")) {
          mainButton.innerText = "Change Cover [X]";
          coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
          let customCoverDiv = create("div", { class: "customCoverDiv" });
          let customCoverInput = create("input", { id: 'customCoverInput', style: { margin: "5px" }, placeholder: "Custom Cover URL" });
          let customCoverFit = AdvancedCreate("select", "maljsNativeInput", false, customCoverDiv);
          let addOption = function (value, text) {
            let newOption = AdvancedCreate("option", false, text, customCoverFit);
            newOption.value = value;
          };
          addOption("initial", "default");
          addOption("cover", "cover");
          addOption("contain", "contain");
          addOption("scale-down", "scale-down");
          addOption("none", "none");

          const coverPreview = `<tr id="customCoverPreviewTable"><td width="225" align="center" style="min-width:320px;">
          <div class="picSurround" id="customCoverPreview"><a class="js-picture-gallery" rel="gallery-anime"><div>
          <img class="lazyloaded" src="${defaultImg.src}" style="max-width:225px;"><p>Custom Cover</p></div><div>
          <img class="lazyloaded" src="${defaultImg.src}" style="width: 70px;height: 110px;object-fit: initial;"><p>70x110</p><br>
          <img class="lazyloaded" src="${defaultImg.src}" style="width: 50px;height: 70px;object-fit: initial;"><p>50x70</p></div></a></div></td>
          <td width="225" align="center">
          <div class="picSurround"><a class="js-picture-gallery" rel="gallery-anime">
          <img id="defaultCoverImage" class="lazyloaded" src="${coverCache?.defaultImageSrc ? coverCache?.defaultImageSrc : defaultImg.src}" style="max-width:225px;">
          </a><div style="text-align: center;" class="spaceit"><a>Default Cover</a></div></div></td></tr>`;
          picTable.innerHTML = coverPreview + picTable.innerHTML;

          const imgPosSlider = `<div class="cover-position-slider-container" style="display:none">
          <label for="xSlider">X:</label><input type="range" class ="coverSlider" id="coverXSlider" min="0" max="100" value="50"style="width: 115px;padding:6px!important;margin-right: 5px;">
          <label for="ySlider">Y:</label><input type="range" class ="coverSlider" id="coverYSlider" min="0" max="100" value="50"style="width: 115px;padding:6px!important;"></div>`;

          customCoverDiv.append(customCoverInput, customCoverFit);
          $('#customCoverPreview').append(customCoverDiv, imgPosSlider);
          picTable.style.width = '100%';
          $(picTable).find('td').css('min-width', '310px');

          //Update Cover Positions
          const xSlider = document.getElementById("coverXSlider");
          const ySlider = document.getElementById("coverYSlider");
          function updateCoverPositions() {
            const x = xSlider.value + "%";
            const y = ySlider.value + "%";
            $('#customCoverPreview img').css('object-position', `${x} ${y}`);
          }
          xSlider.addEventListener("input", updateCoverPositions);
          ySlider.addEventListener("input", updateCoverPositions);
          customCoverFit.addEventListener('change', function (e) {
            $('#customCoverPreview img').css('object-fit', customCoverFit.value);
            if (customCoverFit.value !== 'initial') {
              $('#customCoverPreview .cover-position-slider-container').css('display', 'grid');
              $('#customCoverPreview .coverSlider').val('50');
            } else {
              $('#customCoverPreview .cover-position-slider-container').css('display', 'none');
            }
          });
          customCoverInput.addEventListener('change', function (e) {
            $('#customCoverPreview img').attr('src', customCoverInput.value);
          });
        }
        const tdElements = picTable.querySelectorAll("td");
        tdElements.forEach(td => {
          if (td.querySelector(".custom-cover-select-btn")) return;
          if (td.querySelector("img")) {
            const selectButton = create('a', { class: 'custom-cover-select-btn mal-btn primary' }, 'Select');
            selectButton.addEventListener("click", async () => {
              const img = td.querySelector("img");
              if (img && img.height > 10) {
                if (coverCache?.defaultImage && img.src.includes(coverCache.defaultImage)) {
                  await coverLocalForage.removeItem(entryId + "-" + entryType);
                  $('div:nth-child(1) > a > img').first().attr('src', img.src);
                  $('#defaultCoverImage').attr('src', img.src);
                } else {
                  await coverLocalForage.setItem(entryId + "-" + entryType, {
                    key: entryId + "-" + entryType,
                    title: storeType == "cover" ? entryTitle : formattedCharacterTitle,
                    type: storeType == "character" ? 'CHARACTERS' : entryType,
                    fit: img.style.objectFit ? img.style.objectFit : "initial",
                    position: img.style.objectPosition ? img.style.objectPosition : '50% 50%',
                    defaultImage: coverCache?.defaultImage ? coverCache.defaultImage : (defaultImg?.src?.replace(/\.\w+$/, '').replace('https://cdn.myanimelist.net/images/', '') || ""),
                    defaultImageSrc: coverCache?.defaultImageSrc ? coverCache.defaultImageSrc : defaultImg?.src,
                    coverImage: img.src
                  });
                }
                mainButton.innerText = "Change Cover";
                if (storeType === "cover") {
                  await loadCustomCover(1);
                } else if (storeType === "character") {
                  await loadCustomCover(1, "character");
                }
                $('.custom-cover-select-btn').remove();
                $('#customCoverPreviewTable').remove();
                $(mainButton).attr('active', '0');
              }
            });
            td.appendChild(selectButton);
          }
        });
        $(mainButton).attr('active', '1');
      } else {
        mainButton.innerText = "Change Cover";
        $('.custom-cover-select-btn').remove();
        $('#customCoverPreviewTable').remove();
        $(mainButton).attr('active', '0');
      }
    });
  }
}

//Get Friends Info from JikanAPI
async function getFriends(username) {
  let allFriends = [];
  let page = 1;
  try {
    while (true) {
      const response = await fetch(`https://api.jikan.moe/v4/users/${username}/friends?page=${page}`);
      const remainingRequests = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');
      if (remainingRequests === '0') {
        const currentTime = Math.floor(Date.now() / 1000);
        const waitTime = resetTime - currentTime;
        console.log(`Rate limit reached. Waiting for ${waitTime} seconds.`);
        await delay(waitTime * 1000);
      }
      const data = await response.json();
      const friends = data.data.map(friend => friend.user);
      allFriends = allFriends.concat(friends);
      if (!data.pagination.has_next_page) {
        break;
      }
      page++;
      await delay(500);
    }
    return allFriends;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

//Fetch Custom Profile About Data
//(The 'username' variable must be replaced with 'headerUserName' when retrieving data from somewhere other than the profile.)
async function fetchCustomAbout(processFunction, regex = /(malcleansettings)\/([^"\/])/gm, url = `https://myanimelist.net/profile/${username}`) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.text();
    return await processFunction(data, regex);
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function processRssFeed(xml, regex) {
  const parser = new DOMParser();
  const data = parser.parseFromString(xml, "text/xml");
  const items = data.querySelectorAll('item');

  for (let i = 0; i < items.length; i++) {
    const description = items[i].querySelector('description').textContent;
    if (description.match(regex)) {
      settingsFounded = 2;
      return description;
    }
  }
  return null;
}

async function processProfilePage(html, regex) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const userProfileAbout = doc.querySelector('.user-profile-about');

  if (userProfileAbout && userProfileAbout.innerHTML.match(regex)) {
    return userProfileAbout.innerHTML;
  } else {
    await delay(250);
    const rssData = await fetchCustomAbout(processRssFeed, regex, `https://myanimelist.net/rss.php?type=blog&u=${username}`);
    if (rssData) {
      settingsFounded = 1;
      return rssData;
    }
  }
  return null;
}

// MalClen Settings - Edit About Popup
async function editAboutPopup(data, type) {
  return new Promise(async (resolve, reject) => {
    if ($('#currently-popup').length) {
      return;
    }
    let canSubmit = 1;
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
    });
    const popupDataText = create("div", { class: "dataTextDiv", });
    const popupDataTextButton = create("button", { class: "dataTextButton", }, "Copy");
    const popupLoading = create("div", {
      class: "actloading",
      style: { position: 'relative', left: '0px', right: '0px', fontSize: '16px', height: '100%', alignContent: 'center', zIndex: '2' },
    }, "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome;word-break: break-word;"></i>');
    const iframe = create("iframe", { src: "https://myanimelist.net/editprofile.php" });
    iframe.style.pointerEvents = 'none';
    iframe.style.opacity = 0;

    // close popup function
    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    popup.append(popupClose, popupLoading, iframe);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", async function () {
      let $iframeContents = $(iframe).contents();
      let $about = $iframeContents.find("#classic-about-me-textarea");
      let isClassic = $iframeContents.find("#about_me_setting_2").is(':checked');
      let $submit = $iframeContents.find('.inputButton[type="submit"]');
      const regexes = {
        match: /(\[url=).*(malcleansettings)\/.*([^.]]+)/gm,
        add: /(\[url=https:\/\/malcleansettings\/)(.*)(]‎)/gm,
        privateProfile: /(privateProfile)\/([^\/]+.)/gm,
        hideProfileEl: /(hideProfileEl)\/([^\/]+.)/gm,
        customPf: /(custompf)\/([^\/]+.)/gm,
        customFg: /(customfg)\/([^\/]+.)/gm,
        customBg: /(custombg)\/([^\/]+.)/gm,
        customCSS: /(customCSS)\/([^\/]+.)/gm,
        customBadge: /(custombadge)\/([^\/]+.)/gm,
        customColor: /(customcolors)\/([^\/]+.)/gm,
        malBadges: /(malBadges)\/([^\/]+.)/gm,
        favSongEntry: /(favSongEntry)\/([^\/]+.)/gm,
        customProfileEl: /(customProfileEl)\/([^\/]+.)/gm,
        moreFavs: /(moreFavs)\/([^\/]+.)/gm,
      };
      let userBlogPage = 'https://myanimelist.net/blog/' + headerUserName;
      popupLoading.innerHTML = "Updating" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
      $iframeContents.find('body')[0].setAttribute('style', 'background:0!important');
      if ($iframeContents.find(".goodresult")[0]) {
        canSubmit = 0;
        window.location.reload();
        return;
      }
      if ($iframeContents.find(".badresult")[0]) {
        canSubmit = 0;
        popupLoading.innerHTML = "An error occured. Please try again.";
        return;
      }

      // Replace text with regex check
      function replaceTextIfMatches(regex, aboutText, replacement, add) {
        if (add) {
          return aboutText.replace(regexes.add, `$1$2${replacement}$3`);
        }
        if (regex.test(aboutText)) {
          return aboutText.replace(regex, replacement);
        }
        return aboutText.replace(regexes.add, `$1$2${replacement}$3`);
      }

      // Update about text and submit
      async function updateAboutText(newText) {
        $about.text(newText);
        $submit.click();
      }

      async function changeData() {
        let aboutText = $about.text();

        //if no custom settings, add default custom settings
        if (!regexes.match.test(aboutText)) {
          aboutText = '[url=https://malcleansettings/]‎ [/url]' + aboutText;
        }

        // Update based on the type
        if (type === 'color') {
          aboutText = replaceTextIfMatches(regexes.customColor, aboutText, `${data}/`);
        } else if (type === 'badge') {
          aboutText = replaceTextIfMatches(regexes.customBadge, aboutText, `${data}/`);
        } else if (type === 'malBadges') {
          aboutText = replaceTextIfMatches(regexes.malBadges, aboutText, `${data}/`);
        }
        else if (type === 'private') {
          aboutText = replaceTextIfMatches(regexes.privateProfile, aboutText, `${data}/`);
        } else if (type === 'pf') {
          aboutText = replaceTextIfMatches(regexes.custompf, aboutText, `${data}/`);
        } else if (type === 'fg') {
          aboutText = replaceTextIfMatches(regexes.customFg, aboutText, `${data}/`);
        } else if (type === 'bg') {
          aboutText = replaceTextIfMatches(regexes.customBg, aboutText, `${data}/`);
        } else if (type === 'css') {
          aboutText = replaceTextIfMatches(regexes.customCSS, aboutText, `${data}/`);
        } else if (type === 'moreFavs') {
          aboutText = replaceTextIfMatches(regexes.moreFavs, aboutText, `${data}/`);
        } else if (type === 'hideProfileEl') {
          aboutText = replaceTextIfMatches(regexes.hideProfileEl, aboutText, `${data}/`);
        } else if (type === 'customProfileEl') {
          aboutText = replaceTextIfMatches(regexes.customProfileEl, aboutText, `${data}/`, 1);
        } else if (type === 'favSongEntry') {
          if (!$iframeContents.find(".goodresult")[0]) {
            if (aboutText.indexOf(data) > -1) {
              popupLoading.innerHTML = "Already Added";
              canSubmit = 0;
            } else {
              aboutText = replaceTextIfMatches(regexes.favSongEntry, aboutText, `${data}/`);
            }
          }
        } else if (type === 'editCustomEl') {
          aboutText = aboutText.replace(`/${data[0]}/`, `/${data[1]}/`);
        } else if (type === 'removeFavSong' || type === 'removeCustomEl') {
          aboutText = aboutText.replace(data, '');
        } else if (type === 'replaceFavSong' || type === 'replaceCustomEl') {
          aboutText = aboutText.replace(`/${data[0]}/`, `/${data[1]}/`).replace(`/${data[1]}/`, `/${data[0]}/`);
        } else if (type === 'removeAll') {
          aboutText = aboutText.replace(regexes.match, '');
        }
        if (canSubmit) {
          await updateAboutText(aboutText);
        }
      }

      if (isClassic && settingsFounded !== 2) {
        changeData();
      } else if ($(iframe).attr('src').indexOf("blog") === -1) {
        iframe.src = userBlogPage;
      }
      if ($(iframe).contents()[0].URL.indexOf("editprofile.php") === -1) {
        if (!settingsFounded && $(iframe).contents()[0].URL.indexOf("myblog.php") === -1) {
          let $blogFound = null;
          let $maljsBlogDivs = $iframeContents.find('#content > div div:has(a:contains("Edit Entry"))').prev();
          if ($maljsBlogDivs.length) {
            $maljsBlogDivs.each(function () {
              let $this = $(this);
              if ($this.html().indexOf("malcleansettings") > -1) {
                $blogFound = $(this);
                let $editLink = $blogFound.next().find('a[href*="/myblog.php?go=edit"]');
                if ($editLink.length) {
                  $editLink[0].click();
                }
              }
            });
          } if (!$blogFound) {
            notFound();
          }
        } else {
          $about = $iframeContents.find("textarea[name='entry_text']");
          $submit = $iframeContents.find('.inputButton[name="subentry"]');
          changeData();
        }
      }
    });

    function notFound() {
      iframe.remove();
      popupLoading.innerHTML = "You are not using classic about.<br><br>Please paste this code into a blog post on the first page so that the code will run automatically.<br><br>";
      popupDataText.innerHTML = "[url=https://malcleansettings/] [/url]";
      popupLoading.append(popupDataText, popupDataTextButton);
      popupDataTextButton.addEventListener('click', function () {
        const tempInput = document.createElement('input');
        tempInput.value = popupDataText.innerText;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        popupDataTextButton.innerText = "Copied!"
      });
    }
    // close popup click function
    popupClose.onclick = () => {
      close();
    };
  });
}

// Anime/Manga Edit Popup
async function editPopup(id, type, add, addCount) {
  return new Promise((resolve, reject) => {
    if ($('#currently-popup').length) {
      return;
    }
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/ownlist/" + (type ? type.toLocaleLowerCase() : "anime") + "/" + id + "/edit?hideLayout=1";
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupLoading = create("div", {
      class: "actloading",
      style: { position: 'relative', left: '0px', right: '0px', fontSize: '16px', height: '100%', alignContent: 'center', zIndex: '2' },
    },
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
    },);
    const iframe = create("iframe", { src: popupId });
    iframe.style.opacity = 0;
    const close = () => {
      if ($(iframe).contents().find(".goodresult")[0] && url) {
        window.location.reload();
      }
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };
    if (type === "manga") {
      popup.style.height = "472px";
    }

    popup.append(popupClose, popupLoading, iframe);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
       $(iframe).contents().find('body')[0].setAttribute('style', 'background:0!important');
      if (!add) {
        popupLoading.remove();
        iframe.style.opacity = 1;
      } else {
        popupLoading.innerHTML = "Updating" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
      }
      if (add && $(iframe).contents().find(".goodresult")[0]) {
        close();
      }
      if ($(iframe).contents().find(".badresult")[0]) {
        popupLoading.innerHTML = "An error occured. Please try again.";
      }
      // close advanced section
      if ($(iframe).contents().find("#hide-advanced-button")[0].style.display === "") {
        $(iframe).contents().find("#hide-advanced-button")[0].click();
      }

      let decreaseEp = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").next().clone().text("-").css({ marginRight: "0" });
      $(decreaseEp).prependTo($(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").parent());

      function checkEp() {
        let ep = parseInt($(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").val());
        let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
        let day = $(iframe).contents().find("#add_anime_finish_date_day,#add_manga_finish_date_day")[0];
        let month = $(iframe).contents().find("#add_anime_finish_date_month,#add_manga_finish_date_month")[0];
        let year = $(iframe).contents().find("#add_anime_finish_date_year,#add_manga_finish_date_year")[0];
        let startDate = $(iframe).contents().find("#add_anime_start_date_month,#add_manga_start_date_month").val();
        let endDate = $(iframe).contents().find("#add_anime_finish_date_month,#add_manga_finish_date_month").val();
        if (svar.autoAddDate) {
          // if episode count is greater than 0 and the start date is not entered
          if (ep > 0 && !startDate) {
            $(iframe).contents().find("#start_date_insert_today")[0].click();
          }

          // if episode count equals or exceeds the total episodes and the end date is not entered, add end date
          if (ep >= lastEp && lastEp > 0 && !endDate) {
            $(iframe).contents().find("#end_date_insert_today")[0].click();
          }

          //if episode count less than total episodes and the end date is entered, clear end date
          if (ep < lastEp && lastEp > 0 && endDate) {
            day.value = 0;
            month.value = 0;
            year.value = 0;
          }
        }
      }

      //if episode count changed
      $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").on("input", function () {
        checkEp();
      });

      //if increment episode (+) clicked
      $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters").next().on("click", function () {
        checkEp();
      });

      //if entry status is completed
      $(iframe).contents().find("#add_anime_status,#add_manga_status")[0].addEventListener("change", function () {
        if (this.value == "2") {
          checkEp();
        }
      });

      if (add) {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        let lastEp = parseInt($(iframe).contents().find("#totalEpisodes,#totalChap").text());
        let mangaVol = $(iframe).contents().find("#add_manga_num_read_volumes")[0];
        let mangaVolLast = parseInt($(iframe).contents().find("#totalVol").text());
        let status = $(iframe).contents().find("#add_anime_status,#add_manga_status")[0];
        let submit = $(iframe).contents().find(".inputButton.main_submit")[0];
        ep.value = parseInt(ep.value) + addCount;
        if (parseInt(ep.value) >= lastEp && lastEp !== 0) {
          status.value = 2;
          if (mangaVol) {
            mangaVol.value = mangaVolLast;
          }
        }
        checkEp();
        $(submit).click();
      }

      //if decrease ep clicked
      $(decreaseEp).on("click", function () {
        let ep = $(iframe).contents().find("#add_anime_num_watched_episodes,#add_manga_num_read_chapters")[0];
        ep.value = ep.value > 0 ? ep.value - 1 : ep.value;
        checkEp();
      });

      //if history clicked
      $(iframe).contents().find("#totalEpisodes,#totalChap").next().children().on("click", function () {
        iframe.style.opacity = 0;
        popup.prepend(popupLoading);
        popup.prepend(popupBack);
      });

      //if history back clicked
      $(popupBack).on("click", function () {
        iframe.style.opacity = 0;
        popup.prepend(popupLoading);
        iframe.src = popupId;
        popupBack.remove();
      });
    });

    // close popup
    popupMask.onclick = () => {
      if (!add) {
        close()
      };
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

// Block User Popup
async function blockUser(id) {
  return new Promise((resolve, reject) => {
    const url = location.pathname === "/" ? null : 1;
    const popup = create("div", { id: "currently-popup" });
    const popupClose = create("a", { id: "currently-closePopup", class: "fa-solid fa-xmark", href: "javascript:void(0);" });
    const popupId = "/editprofile.php?go=privacy";
    const popupBack = create("a", { class: "popupBack fa-solid fa-arrow-left", href: "javascript:void(0);" });
    const popupLoading = create("div", {
      class: "actloading",
      style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px" },
    },
      "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>'
    );
    const popupMask = create("div", {
      class: "fancybox-overlay",
      style: { background: "#000000", opacity: "0.3", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
    });
    const iframe = create("iframe", { src: popupId });
    iframe.style.opacity = 0;
    const close = () => {
      popup.remove();
      popupMask.remove();
      document.body.style.removeProperty("overflow");
      resolve();
    };

    popup.append(popupClose, iframe, popupLoading);
    document.body.append(popup, popupMask);
    document.body.style.overflow = "hidden";

    $(iframe).on("load", function () {
      $(iframe).contents().find('body')[0].setAttribute('style', 'background:0!important');
      iframe.style.opacity = 1;
      popupLoading.remove();
      if ($(iframe).contents().find("form > input.inputtext")[0]) {
        $(iframe).contents().find("#headerSmall")[0].remove();
        $(iframe).contents().find("#menu")[0].remove();
        $(iframe).contents().find("#horiznav_nav")[0].remove();
        $(iframe).contents().find("footer")[0].remove();
        $(iframe).contents().find(".h1")[0].remove();
        $(iframe).contents().find("form > input.inputtext")[0].value = id;
        $(iframe).contents().find('a[href*=profile]').removeAttr("href");
        $(iframe).contents().find('html')[0].style.overflowX = 'hidden';
        $(iframe).contents().find('#content')[0].style.padding = '0';
        $(iframe).contents().find("#contentWrapper")[0].setAttribute('style', 'top: 5px!important;min-height: auto;padding: 0;width:auto;margin-left:0!important');
        $(iframe).contents().find("#myanimelist")[0].setAttribute('style', 'width: auto;padding: 0px 5px;');
        $(iframe).contents().find("form:has(input.inputtext)")[0].style.width = "auto";
        $(iframe).contents().find("#content > div > div")[0].style.width = "auto";
      }

      if ($(iframe).contents().find(".goodresult")[0]) {
        popup.append($(iframe).contents().find(".goodresult")[0]);
        iframe.remove();
      }

      if ($(iframe).contents().find(".badresult")[0]) {
        popup.append($(iframe).contents().find(".badresult")[0]);
        iframe.remove();
      }

      $(iframe).contents().find("input[name='bsub']").on("click", function () {
        iframe.style.opacity = 0;
        popup.append(popupLoading);
      });

      $(iframe).contents().find("span:has(form)").on("click", function () {
        iframe.style.opacity = 0;
        popup.append(popupLoading);
      });
    });

    // close popup
    popupMask.onclick = () => {
      close();
    };
    popupClose.onclick = () => {
      close();
    };
  });
}

//Custom Anime/Manga Cover
let loadingCustomCover = 0;
async function loadCustomCover(force = "0", storeType = "cover") {
  if (!loadingCustomCover || force !== "0") {
    const coverLocalForage = await localforage.createInstance({ name: "MalJS", storeName: storeType });
    coverLocalForage.iterate((value, key) => {
      if (value.defaultImage && value.coverImage) {
        $("img").each(function () {
          const $img = $(this);
          if ($img.parent().attr('class') !== 'js-picture-gallery') {
            const dataSrc = $img.attr("data-src") || "";
            const imgSrc = $img.attr("src") || "";
            const imgAlt = $img.attr("alt")?.toUpperCase() || "";
            const imgSrcSet = $img.attr("srcset")?.toUpperCase() || "";
            const dbTitle = value.title;
            const dbDefaultImage = value.defaultImage;
            const dbTitleMatch = storeType === "character" ? dbTitle.some(el => imgAlt.includes(el.toUpperCase())) : imgAlt.includes(dbTitle.toUpperCase());
            if ((imgSrc && imgSrc.includes(dbDefaultImage)) || (dataSrc && dataSrc.includes(dbDefaultImage))) {
              if (imgAlt && dbTitleMatch) {
                if (value.type && (imgSrc.toUpperCase().includes(`/${value.type}/`) || dataSrc.toUpperCase().includes(`/${value.type}/`))) {
                  $img.addClass('customCover')
                    .attr('customCover', '1').attr('src', value.coverImage).attr('data-src', value.coverImage)
                    .removeAttr('srcset').removeAttr('data-srcset');

                  if (value.fit && value.fit !== 'initial') {
                    $img.css('object-fit', value.fit);
                  }
                  if (value.position && value.position !== '50% 50%') {
                    $img.css('object-position', value.position);
                  }
                }
              }
            }
          }
        });
      }
    });
    loadingCustomCover = 1;
  };
}

// Load More Favorites
let loadingMoreFavorites = 0;
async function loadMoreFavs(force = "0", storeType = "character", aboutData = null) {
  if (!loadingMoreFavorites || force !== "0") {
    let moreFavsLocalForage = await localforage.createInstance({ name: "MalJS", storeName: "moreFavs_" + storeType });
    if (Array.isArray(aboutData)) {
      processFavs(aboutData, storeType);
    } else {
      moreFavsLocalForage.iterate((value, key) => {
        processFavItem(value, storeType);
      });
    }
    loadingMoreFavorites = 1;
  }
  function processFavs(dataArray, storeType) {
    dataArray.forEach(value => processFavItem(value, storeType));
  }
  function processFavItem(value, storeType) {
    const titleText = storeType === "character" ? value.title[0] : value.title;
    const container = create("li", { class: "btn-fav", title: titleText });
    const link = create("a", { class: "link bg-center", href: value.url });
    const title = create("span", { class: "title fs10" }, value.title[0]);
    let type = create("span", { class: "users" }, value.source);
    let typeText = value.type?.toLowerCase();
    typeText = typeText === "characters" ? "character" : typeText;
    const img = create("img", { class: "image lazyloaded", src: value.defaultImageSrc, width: "70", height: "110", border: "0", alt: value.title[0], });
    link.append(title, type, img);
    container.append(link);
    let parent = $(`#${typeText}_favorites .fav-slide`).length
      ? $(`#${typeText}_favorites .fav-slide`)
      : $(`.favs.${typeText}`);
    if (parent) parent.append(container);
  }
}

async function createCustomDiv(appLoc, header, content, editData) {
  $("#customAddContainer").remove();
  if (!document.querySelector("#customAddContainer")) {
    const cont = create("div", { id: "customAddContainer" });
    let appendLoc = appLoc ? appLoc : document.querySelector("#user-button-div");
    const isRight = appLoc === 'right' || appLoc && appLoc.classList[1] ? 1 : 0;
    if (isRight) {
      appendLoc = $(".user-comments").before(cont);
    } else {
      appendLoc.insertAdjacentElement("afterend", cont);
    }
    const newDiv = create("div", { id: "customAddContainerInside" });
    const btnsDiv = create("div", { id: "customAddContainerInsideButtons", style: { display: "block", textAlignLast: "center" } });
    if (isRight) cont.classList.add("right");
    const closeButton = create("button", { class: "mainbtns btn-active-def", id: "closeButton", style: { width: "45px", float: "right", marginTop: "-5px" } }, "Close");
    closeButton.addEventListener("click", function () {
      cont.remove();
    });
    newDiv.appendChild(closeButton);
    $(newDiv).append("<h4>" + (appLoc && appLoc !== 'right' ? "Edit" : "Add Custom") + " Profile Element" + "</h4>");

    // Header
    const headerInput = create("input", { id: "header-input" });
    headerInput.setAttribute("placeholder", "Add Title here");
    headerInput.value = header ? header : null;
    newDiv.appendChild(headerInput);

    // Content
    const contentInput = create("textarea", { id: "content-input" });
    contentInput.setAttribute("placeholder", "Add Content Here");
    contentInput.value = content ? content : null;
    newDiv.appendChild(contentInput);

    // Preview Button
    const previewButton = create("button", { class: "mainbtns btn-active-def", id: "previewButton", style: { width: "48%" } }, "Preview");
    previewButton.addEventListener("click", function () {
      if (!document.querySelector("#custom-preview-div")) {
        const previewDiv = create("div", { id: "custom-preview-div" });
        cont.prepend(previewDiv);
      }
      addSCEditorCommands();
      scParserActions("content-input", "bbRefresh");
      const headerText = headerInput.value || "No Title";
      const contentText = scParserActions("content-input", "fromBBGetVal");
      document.querySelector("#custom-preview-div").innerHTML = `
      <h2>Preview</h2>
      ${isRight && svar.modernLayout ?
          `<h4 style="border: 0;margin: 15px 0 4px 4px;">${headerText}</h4>`
          :
          `<h5 style="${svar.modernLayout ? 'font-size: 11px; margin: 0 0 8px 2px;' : ''}">${headerText}</h5>`
        }
      <div>${contentText}</div><br>`;
    });
    btnsDiv.appendChild(previewButton);

    // Add Button
    const addButton = create("button", { class: "mainbtns btn-active-def", id: "addButton", style: { width: "48%" } }, appLoc && appLoc !== 'right' ? "Edit" : "Add");
    addButton.addEventListener("click", function () {
      scParserActions("content-input", "bbRefresh");
      const headerText = headerInput.value;
      let contentText = scParserActions("content-input", "fromBBGetVal");

      if (headerText.length > 1 && contentText.length > 1) {
        const customElArray = [
          {
            header: headerText,
            content: contentText,
            isRight: isRight,
          },
        ];
        const customElBase64 = LZString.compressToBase64(JSON.stringify(customElArray));
        const customElbase64url = customElBase64.replace(/\//g, "_");
        if (editData) {
          editAboutPopup([editData, `customProfileEl/${customElbase64url}`], "editCustomEl");
        } else {
          editAboutPopup(`customProfileEl/${customElbase64url}`, "customProfileEl");
        }
      }
    });
    btnsDiv.appendChild(addButton);
    newDiv.appendChild(btnsDiv);
    document.getElementById("customAddContainer").appendChild(newDiv);

    //ScEditor - Required Commands and Formats
    if (typeof sceditor !== "undefined") {
      await addSCEditor(contentInput);
      scParserActions("content-input", "bbRefresh");
    }
  }

  //Animate Scroll to ScEditor
  $("html, body").animate(
    {
      scrollTop: $("#customAddContainer").offset().top - $(window).height() * 0.1,
    },
    500
  );
}

let svar = {
  animeBg: true,
  charBg: true,
  customCover: true,
  customCharacterCover: true,
  newComments: false,
  profileNewComments: false,
  moreFavs: false,
  moreFavsMode: true,
  peopleHeader: true,
  animeHeader: true,
  animeBanner: true,
  animeBannerMove: false,
  animeTag: true,
  animeRelation: true,
  animeInfoDesign: false,
  relationFilter: false,
  animeSongs: true,
  characterHeader: true,
  characterNameAlt: true,
  profileHeader: false,
  customCSS: false,
  modernLayout: false,
  autoModernLayout: false,
  animeInfo: true,
  embed: true,
  embedTTL: 2592000000,
  relationTTL: 604800000,
  tagTTL: 604800000,
  currentlyWatching: true,
  currentlyReading: true,
  recentlyAddedAnime: true,
  recentlyAddedManga: true,
  listAiringStatus: true,
  airingDate: true,
  autoAddDate: true,
  editPopup: true,
  forumDate: true,
  headerSlide: false,
  headerOpacity: true,
  replaceList: false,
  blogRedesign: false,
  blogContent: true,
  actHistory: true,
  profileAnimeGenre: true,
  profileMangaGenre: false,
  moveBadges: false,
  clubComments: false,
  scrollbarStyle: false,
};

svar.save = function () {
  localStorage.setItem('maljsSettings', JSON.stringify(svar));
};

const svarSettings = JSON.parse(localStorage.getItem('maljsSettings'));

if (!svarSettings) {
  svar.save();
} else {
  let keys = Object.keys(svarSettings);
  keys.forEach((key) => (svar[key] = svarSettings[key]));
}
let fgColor = getComputedStyle(document.body);
fgColor = tinycolor(fgColor.getPropertyValue('--fg'));
const fgOpacity = fgColor.setAlpha(.8).toRgbString();

//Settings CSS
let styles = `
.malCleanLoader {
    top:2px;
    position:relative;
    margin-left:5px;
    font-size:12px;
    font-family:FontAwesome
}
.loadmore,
.actloading,
.listLoading {
    font-size: .8rem;
    font-weight: 700;
    padding: 14px;
    text-align: center
}

.tooltipBody .addtoList {
    position: absolute;
    top: -5px;
    right: 0;
    cursor: pointer;
    padding: 5px;
    font-size: .6rem;
    background: var(--color-foreground2);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius)
}

.maljsBlogDiv {
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    overflow: hidden;
    width: 97%;
    margin-top:5px;
    padding: 10px 20px 50px 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

.maljsBlogDivRelations {
    background: var(--color-foreground3);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    width: 100%;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

.maljsBlogDivRelations div {
    color: var(--color-text) !important;
    margin-bottom:0!important;
    padding-right: 5px;
    display: inline-block;
    margin-left: 10px !important;
    margin-right: -10px !important;
    width: 98%;
    max-height: 110px;
    overflow: scroll;
}

.maljsBlogDivRelations div::before {
    margin-top:9px
}

.maljsBlogDivRelations a {
    background: var(--color-foreground2)!important;
    border-radius: var(--br) !important;
    padding: 6px !important;
    display: inline-table;
    margin: 2px
}

.page-common .maljsBlogDiv .maljsBlogDivHeader .lightLink {
    color:var(--color-link)!important;
    font-size: .9rem!important;
    margin-top:-4px
}

.maljsBlogDivContent {
    background: var(--color-foreground)!important
}

#myanimelist .blockUserIcon {
    font-family: "Font Awesome 6 Pro";
    float: right;
    z-index: 10;
    color: var(--color-link) !important;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer
}

.blogMainWide {
    display:block;
    height:100%!important;
    max-height:600px!important;
    width:100%!important;
    min-width:1020px;
    background: var(--color-foreground) !important;
    border: 1px solid var(--border-color) !important;
    padding: 10px!important;
    margin-bottom: 20px!important;
    box-sizing: border-box;
}

.user-genres .user-genres-container {
    padding: 10px;
    background: var(--color-foreground);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    text-align: center;
}

.user-genres .user-genres-inner {
    display: -ms-inline-grid;
    display: inline-grid;
    grid-auto-flow: column;
    -webkit-justify-content: space-around;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    min-width: 420px;
    gap: 8px
}

.user-genres .user-genres-inner .user-genre-div {
    text-align: center
}

.user-genres .user-genres-inner .user-genre-div .user-genre-name {
    padding: 6px 16px;
    margin-bottom: 8px;
    background: var(--color-foreground2);
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
}

.user-genres .user-genres-inner .user-genre-div .user-genre-count p {
    display: inline-block;
    font-size: .6rem;
    color: var(--color-main-text-light)
}

.favThemes img {
    width: 40px
}

.favThemes .flex2x .fav-theme-container .favThemeSongTitle {
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px
}
.customProfileEls .custom-el-container .editCustomEl,
.customProfileEls .custom-el-container .sortCustomEl,
.customProfileEls .custom-el-container .removeCustomEl,
.favThemes .fav-theme-container .sortFavSong,
.favThemes .fav-theme-container .removeFavSong {
    display: none;
    font-family: 'FontAwesome';
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 6px;
    height: 4px;
    font-size: 8px
}

.customProfileEls .custom-el-container .sortCustomEl,
.favThemes .fav-theme-container .sortFavSong {
    right:15px
}

.customProfileEls .custom-el-container .editCustomEl {
    right:30px
}

.customProfileEls .custom-el-container .sortCustomEl.selected,
.favThemes .fav-theme-container .sortFavSong.selected {
    color: var(--color-link);
    display: block!important
}

.loadmore:hover,
.customProfileEls .custom-el-container .editCustomEl:hover,
.customProfileEls .custom-el-container .sortCustomEl:hover,
.customProfileEls .custom-el-container .removeCustomEl:hover,
.favThemes .fav-theme-container .sortFavSong:hover,
.favThemes .fav-theme-container .removeFavSong:hover {
    color: var(--color-link)
}
.customProfileEls .custom-el-container:hover .editCustomEl,
.customProfileEls .custom-el-container:hover .sortCustomEl,
.customProfileEls .custom-el-container:hover .removeCustomEl,
.favThemes .fav-theme-container:hover .sortFavSong,
.favThemes .fav-theme-container:hover .removeFavSong {
    display: block !important
}

.customProfileEls .custom-el-container:hover .sortCustomEl.hidden,
.favThemes .fav-theme-container:hover .sortFavSong.hidden{
     display: none !important
}

.customProfileEls .flex2x .custom-el-container .custom-el-inner,
.favThemes .flex2x .fav-theme-container {
    background: var(--color-foreground);
    padding: 10px;
    margin-bottom: 10px;
    min-height: 55px;
    height: 100%;
    min-width: 375px;
    max-width: 375px
}

.customProfileEls .custom-el-container {
    position: relative
}

.customProfileEls .custom-el-container .custom-el-inner {
    background: var(--color-foreground);
}

.customProfileEls .custom-el-container .custom-el-inner,
.favThemes .fav-theme-container {
    position: relative;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin-bottom: 10px
}

.favThemes video {
    width: 100%
}

.favThemes .video-container {
    margin-top: 10px;
    display: none
}

.favThemes .fav-theme-header {
    width: 99%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: center;
}

.favThemes .flex2x .fav-theme-header h2 {
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px;
    font-size: 0.68rem!important;
    padding-bottom: 5px!important;
}

.favThemes .fav-theme-header h2 {
    cursor: default;
    -webkit-border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    -webkit-border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    -o-border-image: -o-linear-gradient(left, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
}

.favThemes .fav-theme-inner {
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 50px 1fr;
    grid-template-columns: 50px 1fr
}

.favThemes .flex2x{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    gap: 0px 10px;
    margin: 5px 0px;
    -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap
}

.user-profile-about a[href*="/custombg"],
.user-profile-about a[href*="/custompf"],
.user-profile-about a[href*="/customCSS"] {
    display: none
}

.filterList_TagsContainer .tag-link {
    cursor: pointer;
    word-break: break-word;
    display: block;
    width: 97%;
    background: var(--color-foreground3);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-left: -5px;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.filterList_TagsContainer .tag-link.clicked {
    background: var(--color-foreground4);
    border: var(--border) solid var(--border-color);
}

.filterList_TagsContainer .tag-link:hover {
    background: var(--color-foreground2)
}

.filterList_GenresFilter input[type="checkbox"] {
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    vertical-align: middle;
    left: -2px;
    -webkit-appearance: none;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    content: "";
    position: absolute;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto !important;
    height: 10px;
    width: 10px;
    background: var(--color-link2) !important
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    font-family: fontAwesome;
    content: "\\f00c";
    margin-left: 4px !important;
    color: var(--color-link) !important;
    background: none !important
}

i.tags-container-clear.fa.fa-close,
i.year-filter-clear.fa.fa-close {
    display: none;
    font-family: 'FontAwesome';
    background: var(--color-foreground4);
    padding: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    float: right;
    cursor: pointer;
    margin-right: 83%;
    margin-top: -2px;
    margin-bottom: 0px
}

.year-filter-slider-container {
    margin-top: -4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px
}

input#year-filter-slider {
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    padding: 0 !important
}

.cover-position-slider-container {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 10px 1fr 10px 1fr;
    grid-template-columns: 10px 1fr 10px 1fr;
    width: 285px;
    justify-items: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 5px
}

.genreDropBtn {
    color:var(--color-main-text-normal);
    width: 100%;
    border: 0;
    background: var(--color-foreground2);
    padding: 8px;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    margin: 5px 0px
}
.maljsBlogDivRelations a:hover,
#maljsDraw3x3:hover,
.compareBtn:hover,
.sort-container #sort-asc:hover,
.sort-container #sort-desc:hover,
.genreDropBtn:hover {
    background: var(--color-foreground4)!important
}

#maljs-dropdown-content {
    display: none;
    -ms-grid-columns: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    background: var(--color-foreground);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    min-width: 160px;
    -webkit-box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    height: 175px;
    overflow: auto
}

.maljs-dropdown-content label {
    margin: 2px;
    padding: 7px 0px;
    display: block;
    align-content: center
}

.maljs-dropdown-content label:hover {
    background: var(--color-foreground4)
}

.maljs-dropdown-content label:has(input.genre-filter:checked) {
    background: var(--color-foreground2);
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.list-entries .status-section {
    background: var(--color-foreground);
    border-radius: var(--border-radius)
}

.filterLists-back {
    width: 25px;
    text-align: center;
    margin-top: -67px;
    font-family: 'FontAwesome';
    cursor: pointer;
    position: absolute;
    background: var(--color-foreground);
    padding: 6px;
    -webkit-border-top-left-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    -webkit-border-top-right-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    border-bottom:0
}

.filterListsDivContainer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}

.filterListsDiv {
    width: 70px;
    display: block;
    margin-top: -5px
}

.filterListsCount {
    width: 90px;
    line-height: 19px;
    color: var(--color-main-text-light);
    margin-top: -5px
}

.list-entries .entry .edit {
    height: 40px;
    width: 40px;
    position: absolute;
    background: #00000070;
    display: block;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    font-family: fontAwesome;
    opacity: 0;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}

.list-entries .entry .edit:hover {
    opacity: 1
}

.maljsDisplayBox {
    overflow: hidden;
    position: fixed;
    top: 65px;
    left: 20px;
    z-index: 9999;
    padding: 20px;
    background-color: rgb(var(--color-foreground));
    border: solid 1px;
    border-radius: 4px;
    box-shadow: black 2px 2px 20px;
    background: var(--color-background);
    height: 85%;
}

.maljsDisplayBoxTitle {
    font-size: 15px;
    border-bottom: 1px solid var(--border-color);
    display: block;
    margin-bottom: 10px;
    padding: 3px
}

input.maljsNativeInput {
    margin-bottom: 5px;
    border: 1px solid var(--border-color)
}

.maljsDisplayBox .scrollableContent p {
    margin: 10px 0px !important
}

.maljsDisplayBox .scrollableContent {
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    scrollbar-width: thin;
    margin-top: 5px;
    padding: 30px;
    padding-top: 15px;
    scrollbar-width: auto
}

.maljsDisplayBoxClose {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    width: 15px;
    height: 18px;
    text-align: center;
    background-color: #852325;
    font-weight: bold;
    border: solid;
    border-width: 1px;
    border-radius: 2px;
    color: var(--color-main-text-normal);
    z-index: 20;
}

.maljsResizePearl {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 20px;
    height: 20px;
    border: solid;
    border-radius: 10px;
    background: rgb(var(--color-foreground));
    cursor: se-resize
}

.container-left>#filter,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-top: -8px;
    background: var(--color-foreground);
    padding: 15px;
    border-radius: var(--border-radius)
}

.container-left>#filter .filterLists,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter .filterLists {
    display: block;
    cursor: pointer;
    padding: 3px;
    width: 70px
}

.container-left > #filter #filter-input,
.sort-container #sort-asc,
.sort-container #sort-desc {
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: 1px solid var(--border-color);
}

.sort-container #sort-asc,
.sort-container #sort-desc,
#maljsDraw3x3,
.compareBtn {
    color:var(--color-main-text-normal);
    background: var(--color-foreground2);
    padding: 10px;
    border-radius: var(--border-radius);
    display: block;
    margin-top: 5px;
    cursor: pointer;
    width: 55px
}

.compareBtn {
    float: right;
    text-align: center
}

#filter>input#filter-input {
    width: 94%
}

.list-entries .entry .cover,
.list-entries .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox
}

.list-entries .row {
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center
}

.list-entries .entry .cover {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    max-width: 60px;
    min-width: 60px;
    padding: 0
}

.list-entries .entry .cover .image {
    object-fit: cover;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    height: 40px;
    width: 40px
}

.list-entries .entry .airing-dot {
    position: relative;
    left: -6.5px;
    width: 6.5px;
    height: 6.5px;
    border-radius: 10px;
    background: #7bd555;
    box-shadow: 0 0 5px rgba(123, 213, 85, .8);
    -webkit-transition: .15s;
    -o-transition: .15s;
    transition: .15s;
    opacity: 1
}

.list-entries .row:hover .airing-dot {
    opacity:0;
}

.list-entries .entry .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 15px;
    text-align: left;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    word-break: break-word
}

.list-entries .entry .title a {
    -webkit-transition: none;
    -o-transition: none;
    transition: none;
    margin-right: auto
}

.list-entries .entry>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 18px 20px;
    text-align: center
}

.list-entries .list-head>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 20px;
    text-align: center;
    font-weight: 700
}

.list-entries .list-head .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 75px;
    text-align: left
}

.list-entries .section-name {
    border-bottom: 1px solid!important;
    padding: 10px!important;
    margin: 0!important;
    margin-bottom: 0!important;
    font-weight:bold!important
}

.list-entries .entry.row.hidden {
    display: none
}

.list-entries .status-section {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-bottom: 10px;
    padding-bottom: 10px
}

.list-head.row {
    margin-bottom: -10px
}

.list-entries .title-note-inner {
    display:none;
    position: absolute !important;
    background: var(--color-foreground2);
    padding: 10px;
    margin: -26px 0 0 20px;
    max-width: 315px;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
            border-radius: var(--border-radius)
}

.list-entries .user-note {
    width: 20px;
    margin: 0 -15px 0 5px
}

.list-entries .user-note:hover .title-note-inner{
    display:block
}

.relationsTarget,
.relationsExpanded {
    display: -webkit-box !important;
    display: -webkit-flex !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    gap: 13.5px
}

.relationsExpanded {
    padding-left: 8px
}

.relations-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}

.relationEntry {
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    float: left;
    opacity: 1;
    width: 85px;
    overflow: hidden;
    position: relative;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out
}

.relationTitle {
    border-bottom: 2px solid;
    transition: .3s;
    width: 100%;
    background: var(--color-foreground2);
    align-content: center;
    bottom: 0;
    height: 35px;
    color: var(--color-main-text-normal);
    font-size: 9.5px;
    font-weight: bold;
    left: 0;
    position: absolute;
    text-align: center;
    opacity: .95;
    border-bottom-left-radius: var(--br);
    border-bottom-right-radius: var(--br)
}

.relationImg {
    width: 85px;
    height: 120px;
    transition: .3s
}

.relationEntry:hover {
    overflow: visible !important
}

.relationEntry:hover .relationImg {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.relationEntryRight:hover .relationImg {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: var(--br) !important;
    border-bottom-right-radius: var(--br) !important
}

.relationEntry:hover .relationTitle {
    opacity: 0
}

.relationEntry:hover .relationDetails {
    opacity: 1;
    z-index: 10
}

.relationDetails:hover {
    display: none
}

.relationDetails {
    transition: .3s;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 86px;
    width: max-content;
    max-width: 300px;
    height: 100px;
    padding: 10px;
    background: var(--color-foregroundOP2);
    z-index: 5;
    border-top-right-radius: var(--br);
    border-bottom-right-radius: var(--br)
}

.relationDetailsRight {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    left: inherit;
    right: 86px
}

.relationDetailsTitle {
    height: 67px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    color: var(--color-main-text-normal)
}

.aniTagDiv {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 6px
}

.aniTag {
    cursor: default;
    display: -webkit-box;
    display: flex;
    background-color: var(--color-foreground);
    border-radius: var(--br);
    padding: 7px;
    -webkit-box-pack: justify;
    justify-content: space-between
}

.aniTag.spoiler {
    display: none
}

.showSpoilers {
    cursor: pointer
}

.showSpoilers,
.aniTag.spoiler .aniTag-name {
    color: #d98080;
    font-weight: 600
}

.aniTag-percent {
    color: var(--color-main-text-light)
}

#content>table>tbody>tr>td:nth-child(2)>div.rightside.js-scrollfix-bottom-rel>div.h1.edit-info,
#content>table>tbody>tr>td.borderClass>div>div>div:nth-child(1),
#content>table>tbody>tr>td.borderClass>div>div:nth-child(1) {
    z-index: 1;
    position: relative
}

.bannerHover {
    width: 220px;
    height: 80px;
    position: absolute;
    bottom: 0px;
    left: 18px;
    z-index: 1
}

.bannerShadow {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(6, 13, 34, .1)), color-stop(50%, rgba(6, 13, 34, 0)), to(rgba(6, 13, 34, .6)));
    background: -o-linear-gradient(top, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    background: linear-gradient(180deg, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0px
}

.bannerImage {
    width: 100%;
    height: 100%
}

@supports (object-fit: cover) {
    .bannerImage {
        object-fit: cover;
        max-height: 240px
    }

    .relationImg {
        object-fit: cover
    }
}

.bannerDiv {
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    max-height: 435px;
    position: relative;
    width: auto;
    margin: -30px -10px 0 -10px
}

.aniLeftSide {
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    position: relative;
    padding-top: 0 !important;
    top: -85px
}

.spaceit-shadow {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--br);
            border-radius: var(--br)
}

.aniTag,
.spaceit-shadow-end,
.spaceit-shadow-end-div {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    border-radius: var(--br);
    overflow: hidden
}

.spaceit-shadow-end-div {
    padding: 2px;
    background: var(--color-foreground)
}

.fa-info-circle:before {
    text-shadow: rgb(0 0 0 / 70%) 0px 0px 2px;
}

#currently-popup {
    height: 425px;
    width: 674px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: var(--color-foregroundOP2);
    padding: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

#currently-popup iframe {
    width: 100%;
    height: 100%;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    border: 1px solid var(--border-color)
}

#currently-popup .popupBack {
    left: 6px;
    right: inherit !important;
    font-family: FontAwesome;
    float: left;
    padding: 0px 0px 5px 0px
}

#currently-popup .dataTextDiv {
    max-height: 145px;
    overflow: auto;
    word-break: break-all;
    background: var(--color-foreground4);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin: 10px
}

#widget-currently-watching>div.widget-slide-outer>ul>li:hover span.epBehind,
#recently-added-anime .btn-anime:hover i,
#recently-added-manga .btn-anime:hover i,
#recently-added-anime .btn-anime:hover .recently-added-type,
#recently-added-manga .btn-anime:hover .recently-added-type,
.widget.seasonal.left .btn-anime:hover i,
#widget-currently-watching .btn-anime:hover i,
#widget-currently-reading .btn-anime:hover i {
    opacity: .9 !important
}

#recently-added-anime li.btn-anime span,
#recently-added-manga li.btn-anime span,
#currently-watching li.btn-anime span,
#currently-reading li.btn-anime span {
    opacity: 0;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    width: 93%;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2em;
    max-height: 4.45em
}

#recently-added-anime li.btn-anime:hover span,
#recently-added-manga li.btn-anime:hover span,
#currently-watching li.btn-anime:hover span,
#currently-reading li.btn-anime:hover span {
     opacity: 1
}

#recently-added-anime-load-more,
#recently-added-manga-load-more {
    width: 124px;
    height: 171.8px;
    display: inline-block;
    text-align: center;
    background: var(--color-foreground2);
    align-content: center;
    cursor: pointer
}

.editCurrently,
.incButton {
font-family: "Font Awesome 6 Pro";
    position: absolute;
    right: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
    padding: 4px;
    border-radius: 5px;
    opacity: 0;
    transition: 0.4s;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.incButton {
   top: 26px
}

.customCover {
   max-width: 225px!important;
}

#customCoverPreview > .js-picture-gallery {
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    width: 300px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between
}

#customAddContainer.right {
   z-index: 2;
   position: relative;
   margin-bottom: 10px
}

#customAddContainer #custom-preview-div {
   border-bottom: 1px solid var(--border-color);
   margin-bottom: 10px
}

.malCleanSettingPopup .settingContainer.input input,
#customAddContainerInside input#header-input,
#customAddContainerInside textarea#content-input {
    width: 95%;
    max-width: 95%;
    border: 1px solid var(--border-color);
    margin: 5px 0px
}

#customAddContainer.right #customAddContainerInside input#header-input {
   width: 97%;
   max-width: 97%;
}

#customAddContainerInside textarea#content-input {
    min-height: 100px
}

#custom-preview-div-bb > div,
#custom-preview-div-bb-def > div,
#customAddContainer #custom-preview-div > div {
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    overflow: hidden;
    width: 95%;
    padding: 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

#custom-preview-div-bb-def > div {
    background: var(--color-foreground2);
}

#customProfileEls .custom-el-container > .custom-el-inner *,
#customAddContainer #custom-preview-div > div * {
    max-width: 415px
}

#customAddContainer.right #custom-preview-div > div {
    width: 97%;
}

#customProfileEls.right .custom-el-container > .custom-el-inner *,
#customAddContainer.right #custom-preview-div > div * {
    max-width: 777px
}

#customProfileEls .custom-el-container > .custom-el-inner.notAl * {
    max-width: 791px
}

div#custom-preview-div > div blockquote:not(.spoiler) {
    background: var(--color-foreground2);
    padding: 10px;
    margin: 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

div#custom-preview-div > div blockquote.spoiler {
    margin: 5px
}

#customAddContainer #customAddContainerInside textarea:not(#iframe-html-src) {
    width: 405px !important
}

#customAddContainer.right #customAddContainerInside textarea:not(#iframe-html-src) {
    width: 777px !important
}

#customAddContainerInside .sceditor-button-youtube div:before {
    color: rgb(232, 93, 117) !important
}

#customAddContainerInside .sceditor-button-video div:before {
    content: "\\f03d"
}

#customAddContainerInside .sceditor-button-iframe div:before {
    content: "\\e495"
}

#customAddContainerInside .sceditor-button-div div:before {
    content: "\\f0c8";
    font-weight: 500
}

#currently-popup .popupBack,
#currently-closePopup {
    position: absolute;
    top: 5px;
    right: 6px;
    cursor: pointer
}

.airingInfo {
    color: var(--color-text);
    transition: .4s;
    text-align: center;
    background-color: ${fgOpacity};
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%
}

.behindWarn {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0)), to(rgba(232, 93, 117, .49)));
    background: -o-linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4px;
    opacity: .8
}

.recently-added-type,
.epBehind {
    color: var(--color-main-text-op);
    position: absolute;
    left: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
    padding: 2px 4px !important;
    border-radius: 5px;
    width: auto !important
}

.airingInfo div:first-child:after {
    content: "";
    display: block;
    height: 3px;
    width: 0
}

.widget.anime_suggestions.left #widget-currently-reading a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-reading a:hover .airingInfo,
.widget.anime_suggestions.left #widget-currently-watching a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-watching a:hover .airingInfo {
    opacity: 0;
}

.widget-slide-block:hover #current-left-recently-added-anime.active,
.widget-slide-block:hover #current-left-recently-added-manga.active,
.widget-slide-block:hover #current-left-manga.active,
.widget-slide-block:hover #current-left.active {
    left: 0 !important;
    opacity: 1 !important
}
.widget-slide-block:hover #current-right-recently-added-anime.active,
.widget-slide-block:hover #current-right-recently-added-manga.active,
.widget-slide-block:hover #current-right-manga.active,
.widget-slide-block:hover #current-right.active {
    right: 0 !important;
    opacity: 1 !important
}

.embed-link {
    width: max-content;
    line-height: 1.16rem;
    margin: 5px 1px;
    display: inline-block;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.embed-container.no-genre .genres {
    display: none
}

.embed-container:not(.no-genre) div {
    transition: opacity 0.3s ease-in-out;
}

.embed-container:not(.no-genre) .genres {
    margin-bottom: -18.5px;
    opacity: 0
}

.embed-container:not(.no-genre):hover .genres {
    opacity: 1
}

.embed-container:not(.no-genre):hover .details {
    opacity: 0
}

.embed-title {
    font-weight: bold;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
}

.embed-image {
    background-size: cover;
    height: 58px;
    width: 41px;
    margin-right: 10px;
    margin-left: -10px;
}

.embed-container {
    color: var(--color-text);
    align-items: center;
    text-align: center;
    width: max-content;
    min-height: 55px;
    background-color: var(--color-foreground2);
    padding: 0px 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden;
}

.forum .replied.show .embed-container,
.quotetext .embed-container {
    background-color: var(--color-foreground);
}

.tooltipBody {
    display: none;
    background-color: var(--color-foreground);
    border-radius: 5px;
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    overflow: hidden;
    margin-top: 5px
}

.tooltipBody .main {
    margin: 0 !important;
    padding: 10px
}

.tooltipBody .text b {
    margin-bottom: 2px;
    display: inline-block
}

.tooltipDetails {
  display:none
}

.malCleanMainContainer {
    right: 0;
    width: 520px;
    height: 86vh;
    margin-right: 15px;
    -webkit-transition: .4s;
    -o-transition: .4s;
    transition: .4s;
    position: fixed;
    top: 55px;
    z-index: 11;
    background: var(--color-foregroundOP);
    overflow-y: auto;
    display: -ms-grid;
    display: grid;
    color: var(--color-text);
    padding: 10px;
    border: 1px solid #6969694d;
    -webkit-border-radius: 10px;
    border-radius: 10px
}

@media (max-width: 768px) {
    .malCleanMainContainer {
        height: 75vh
    }
}

@media (max-width: 480px) {
    .malCleanMainContainer {
        height: 70vh
    }
}

.malCleanSettingContainer {
    margin-top: 10px
}

.malCleanSettingPopup {
    display: inline-grid;
    padding: 10px;
    background: var(--color-foreground4);
    border-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    grid-column: 1 / -1;
    margin-bottom: 5px;
    grid-column: 1/-1
}

.malCleanMainContainer > .malCleanSettingContainer:nth-child(2) {
    margin-top: 45px
}

.mainListBtnDiv,.malCleanSettingPopup .settingContainer.svar {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 35px auto auto 1fr;
    grid-template-columns: 35px auto auto 1fr;
    -webkit-box-pack: start;
    -webkit-justify-content: start;
    -ms-flex-pack: start;
    justify-content: start;
    gap:5px
}

.malCleanSettingPopup .settingContainer.svar {
    -ms-grid-columns: 35px auto;
    grid-template-columns: 35px auto
}

.mainListBtnDiv .fa-gear {
   font-family: "Font Awesome 6 Pro";
   cursor:pointer;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center
}

.textpb {
    padding-top: 5px !important;
    font-weight: bold
}

.textpb a {
    color: rgb(var(--color-link)) !important
}

.malCleanMainHeader {
    display: -ms-inline-grid;
    display: inline-grid;
    -ms-grid-columns: 4fr 1fr 1fr;
    grid-template-columns: 4fr 1fr 1fr;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: medium;
    position: fixed;
    background: var(--color-foregroundOP);
    width: 505px;
    border-top-left-radius: 10px;
    margin-top: 0px;
    padding: 10px;
    height: 35px;
    top: inherit;
    z-index:2;
    right: 25px
}

#currently-popup .dataTextButton,
.mainbtns {
    -webkit-transition: 0.25s;
    -o-transition: 0.25s;
    transition: 0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    padding: 5px;
    margin: 4px;
    cursor: pointer;
    background-color: var(--color-background);
    color: var(--color-text)
}

#currently-popup .dataTextButton:hover,
.mainbtns:hover:not(#customColorUpdate) {
    -webkit-transform: scale(1.04);
    -ms-transform: scale(1.04);
    transform: scale(1.04)
}

.btn-active {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.malCleanSettingPopup .settingContainer.svar .btn-active {
    background-color: var(--color-foreground2) !important;
    color: rgb(159, 173, 189)
}

.btn-active:before {
    font-family: 'Font Awesome 6 Pro';
    content: "\\f00c"
}

.btn-active-def {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.btn-active-def-2 {
    background-color: var(--color-foreground2) !important;
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
        background-color: var(--color-background)
    }
}

.display-none {
    display: none !important
}

.customColorsInside {
    gap:10px;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr
}

.customColorsInside .colorGroup .colorOption{
    margin-top: 5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 5px
}
.customColorsInside .colorGroup .colorOption input{
    cursor: pointer
}
button#hideProfileElementsButton,
button#hideProfileElementsUpdateButton,
button#customColorUpdate,
button#customColorRemove,
button#custombgRemove,
button#malBadgesRemove,
button#customFgRemove,
button#hideProfileElementsRemove,
button#custompfRemove,
button#customCSSRemove,
button#customCSS,
button#privateProfile,
button#privateRemove,
button#malBadgesBtn,
button#malBadgesRemove,
button#custombg,
button#custompf {
    height: 40px;
    width: 26%
}

button#malBadgesRemove,
button#customFgRemove,
button#hideProfileElementsRemove,
button#customColorRemove,
button#custombgRemove,
button#custompfRemove,
button#customCSSRemove {
    width: 5%;
    font-family:FontAwesome
}

button#customColorUpdate {
  width: 472px;
  margin: 10px 5px 0px 0px
}

#custombadgeColorLoop,
#badgecolorselector,
button#custombadge{
    height: 40px;
    width: 15%
}

input#badgeInput,
input#malBadgesInput,
input#cssInput,
input#bgInput,
input#pfInput {
    border: 1px solid var(--border-color);
    padding: 10px;
    width: 60%;
    height: 15px;
    margin-right: 5px
}

input#badgeInput {
    width: 45%
}

#badgecolorselector{
    position: relative;
    top: 10px;
    margin: 0px 2px
}
#fgcolorselector{
    position: relative;
    top: 10px;
    width: 65%;
    margin: 0px 2px;
    height: 40px
}

.malCleanMainContainer .malCleanSettingContainer h2 {
    background: var(--color-foreground2);
    border-radius: var(--br);
    padding: 5px
}

.malCleanMainContainer .malCleanSettingContainer h3 {
    font-weight: 500
}
.anisong-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}

.anisongs .theme-songs.js-theme-songs {
    margin-bottom: 5px
}

.anisongs video {
    width: 100%;
    margin-top: 10px
}

.anisongs .oped-preview-button.oped-preview-button-gray {
    cursor: pointer;
    display: inline-block;
    height: 8px;
    margin-bottom: -3px;
    width: 15px;
    -webkit-filter: invert(100%) hue-rotate(180deg) brightness(75%) !important;
    filter: invert(100%) hue-rotate(180deg) brightness(75%) !important
}

.theme-songs.js-theme-songs.has-video .fa-star {
    font-family: FontAwesome;
    opacity: .1;
    display: inline;
    margin-left: 5px;
    cursor: pointer;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.theme-songs.js-theme-songs.has-video:hover .fa-star {
    opacity: 1
}

#badges-iframe {
  -ms-zoom: 0.75;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.5);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  width: 895px;
  max-width: 895px;
  height: 480px;
  max-height: 480px;
  -webkit-resize: none;
  -moz-resize: none;
  resize: none;
  overflow: hidden;
  margin-top: -95px;
  margin-left: -16px
}

#badges-iframe.defaultMal {
    width: 668px;
    max-width: 668px;
    height: 480px;
    max-height: 480px;
    margin-top: -67px;
    margin-left: -6px;
    -webkit-transform: scale(0.35);
        -ms-transform: scale(0.35);
            transform: scale(0.35)
}

div#badges-inner {
  padding: 10px;
  transition: transform .3s ease-in-out;
  background: var(--color-foreground);
  border: var(--border) solid var(--border-color);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius)
}

div#badges-inner.defaultMal {
  padding: 0;
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
}

div#badges-iframe-inner {
  overflow: hidden;
  pointer-events: none;
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  height: 145px;
  background: var(--color-foreground2);
  -webkit-border-radius: 10px;
  border-radius: 10px
}

div#badges-iframe-inner.defaultMal {
  height: 100px;
  border: 0 !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  background: var(--color-foreground);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
}

.sceditor-container.sourceMode.ltr {
  min-height: 100px
}

.newCommentsContainerMain {
  background: var(--color-foreground);
  display: block;
  margin-bottom: 15px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  border: var(--border) solid var(--border-color)
}

.newCommentsContainerMain:hover .newCommentsLinkButton {
 opacity: 1 !important
}

.newCommentsContainer tr {
  background: var(--color-foreground2);
  padding: 5px 0px;
  display: block;
  margin: 10px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  border: var(--border) solid var(--border-color)
}

.comment-profile .newCommentsContainer tr {
  padding: 5px
}

.newCommentsLinkButton,
.newCommentsCommentButton {
  width: 100%;
  height: 0px;
  top: -20px;
  text-align: right;
  display: block;
  position: relative;
  font-family: FontAwesome;
  right: 10px;
}

.newCommentsLinkButton {
  opacity: 0;
  top:10px
}

.comment-profile .newCommentsLinkButton,
.comment-profile .newCommentsCommentButton {
  top:2px;
  right: 2px;
}

.comment-profile .newCommentsCommentButton {
  top:-10px;
}

.newCommentsLoadMoreButton {
   padding: 10px;
   display: block;
   background: var(--color-foreground4);
   margin: 10px;
   margin-bottom: 20px;
   border: var(--border) solid var(--border-color);
   -webkit-border-radius: var(--border-radius);
   border-radius: var(--border-radius);
   cursor: pointer;
   text-align: center
}
`;
let styles2 = `
.lazyloading {
  opacity: 1 !important;
}

footer {
  z-index: 0;
  margin-top: 65px !important;
  position: relative;
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

.dark-mode body:not(.ownlist),
body:not(.ownlist) {
  background-color: var(--color-background) !important
}

.page-common #myanimelist #contentWrapper {
  background-color: var(--color-backgroundo) !important;
  top: 55px !important;
  padding: 10px;
  margin-left: -15px;
  width: 1070px;
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px var(--shadow-color) !important
}
`;

//CSS MyAnimeList - Clean Main Colors
let styles3 = `
body,
:root {
    --color-background: #0c1525 !important;
    --color-backgroundo: #0c1525 !important;
    --color-foreground: #161f2f !important;
    --color-foregroundOP: #161f2f !important;
    --color-foregroundOP2: #202939 !important;
    --color-foreground2: #202939 !important;
    --color-foreground3: rgba(37, 46, 62, 0.3) !important;
    --color-foreground4: #2a3343 !important;
    --br: 5px !important;
    --color-text: #b6b6b6;
    --color-text-normal: #b6b6b6 !important;
    --color-main-text-normal: #c8c8c8 !important;
    --color-main-text-light: #a5a5a5 !important;
    --color-main-text-op: #ffffff !important;
    --color-link: #9fadbd;
    --color-link2: #7992bb !important;
    --color-text-hover: #cfcfcf !important;
    --color-link-hover: #cee7ff !important;
}
`;
let defaultColors = `
:root,
body {
  --fg: #181818!important;
  --color-background: #121212!important;
  --color-backgroundo: #12121266!important;
  --color-foreground: #181818!important;
  --color-foreground2: #242424!important;
  --color-foreground3: #28282866!important;
  --color-foregroundOP: #181818!important;
  --color-foregroundOP2: #242424!important;
  --color-foreground4: #282828!important;
  --border-color: #222!important;
  --border-radius: 5px!important;
  --color-text: #b6b6b6;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: #9fadbd;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
}
${svar.scrollbarStyle ?
    `::-webkit-scrollbar {
  background: 0 0
}

::-webkit-scrollbar-track {
  background: #fff0
}

::-webkit-scrollbar-thumb {
  background: var(--color-foreground2);
  -webkit-border-radius: 3px;
  border-radius: 3px
}

::-webkit-scrollbar-corner {
  background: #0000
}` : ``}

a.feed-main-button {
  top: 0!important
}

.feed-main {
  padding: 10px
}

.feed-main a:hover {
  text-decoration: none!important
}

#currently-popup iframe {
  border: 0!important
}
`;
let defaultColorsLight = `
:root,
body {
  --fg: #f5f5f5!important;
  --color-background: #eef1fa!important;
  --color-backgroundo: #eef1fa66!important;
  --color-foreground: #f5f5f5!important;
  --color-foreground2: #eeeeee!important;
  --color-foreground3: #e3e3e366!important;
  --color-foregroundOP: #f5f5f5!important;
  --color-foregroundOP2: #e3e3e3!important;
  --color-foreground4: #e3e3e3!important;
  --border-color: #bcbcbc!important;
  --border-radius: 5px!important;
  --color-text: #b6b6b6;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: 9fadbd;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
}

${svar.scrollbarStyle ?
    `::-webkit-scrollbar {
  background: 0 0
}

::-webkit-scrollbar-track {
  background: #fff0
}

::-webkit-scrollbar-thumb {
  background: var(--color-foreground2);
  -webkit-border-radius: 3px;
  border-radius: 3px
}

::-webkit-scrollbar-corner {
  background: #0000
}` : ``}

a.feed-main-button {
  top: 0!important
}

.feed-main {
  padding: 10px
}

.feed-main a:hover {
  text-decoration: none!important
}

#currently-popup iframe {
  border: 0!important
}`;
let defaultCSSFixes = `
.list-entries .section-name,
.dark-mode .page-common #horiznav_nav,
.page-common div#horiznav_nav {
  border-color: var(--border-color)!important
}

.profile .user-statistics .user-statistics-stats .updates {
  padding-right:10px
}

.bannerHover {
  height:90px!important
}

#fgcolorselector {
  width: 64%
}

button#customColorUpdate {
  width: 460px
}

.profileRightActions {
  position: relative;
  top: -50px
}

.widget-slide-block .widget-slide .btn-anime .link .title.color-pc-constant {
  color: var(--color-main-text-normal)
}

.tooltipBody {
  padding:10px
}

.bannerDiv {
    margin: -5px -10px 0 -10px
}
`;

if (typeof jQuery === 'undefined') {
  console.error('Mal-Clean-JS: jQuery not found, stopping...');
  return;
}
// defaultMal = Mal without UserStyle
// settingsFounded = Custom Profile Settings Founded
let defaultMal, settingsFounded = 0;
const current = location.pathname;
const entryTitle = $('.title-name').text() ? $('.title-name').text().replace(/\".*\" /, '') : document.title.replace(/(.*)(\|.*)/, '$1').replace(/(.*)(\(.*\).*)/, '$1').trim();
const entryType = current.split("/")[1].toUpperCase();
const entryId = current.split('/')[2];
const username = current.split('/')[2];
const headerUserName = $(".header-profile-link").text();
const userNotHeaderUser = username !== headerUserName;
const isMainProfilePage = /\/profile\/.*\/\w/gm.test(current) ? 0 : 1;

//Create Style Elements
let styleSheet = document.createElement('style');
let styleSheet2 = document.createElement('style');
let styleSheet3 = document.createElement('style');
styles = styles.replace(/\n/g, '');
styles2 = styles2.replace(/\n/g, '');
styles3 = styles3.replace(/\n/g, '');
defaultColors = defaultColors.replace(/\n/g, '');
defaultColorsLight = defaultColorsLight.replace(/\n/g, '');
defaultCSSFixes = defaultCSSFixes.replace(/\n/g, '');

//Add CSS
if ($('style:contains(--fg:)').length) {
  styleSheet.innerText = styles;
} else if ($('html').hasClass('dark-mode')) {
  styleSheet.innerText = styles + defaultColors + defaultCSSFixes;
  defaultMal = 1;
} else {
  styleSheet.innerText = styles + defaultColorsLight + defaultCSSFixes;
  defaultMal = 1;
}
document.head.appendChild(styleSheet);

//MalClean Settings - Settings Button
var stButton = create("li", {});
stButton.onclick = () => {
  Settings();
};
var stLink = create("a", {}, "MalClean Settings");
var active = !1;

//MalClean Settings - Close Button
var closeButton = create("button", { class: "mainbtns", id: "closebtn" }, "Close");
closeButton.onclick = () => {
  closeDiv();
};

//MalClean Settings - Reload Button
var reloadButton = create("button", { class: "mainbtns", id: "reloadbtn" }, "Refresh");
reloadButton.onclick = () => {
  window.location.reload();
};

//MalClean Settings - Refresh Page Button Animation
function reloadset() {
  reloadbtn.setAttribute('style', 'animation:reloadLoop 2.5s infinite');
}

// MalClean Settings - Buttons Config
const buttonsConfig = Object.keys(svar).map(setting => ({
  setting: setting,
  id: setting + 'Btn',
  text: null,
  enabled: svar[setting]
}));
buttonsConfig.push({ setting: "removeAllCustom", id: 'removeAllCustomBtn', text: "Remove All Custom Profile Settings" });

if (!defaultMal) {
  buttonsConfig.push(
    { id: "headerSlideBtn", setting: "headerSlide" },
    { id: "headerOpacityBtn", setting: "headerOpacity" }
  );
} else {
  svar.headerSlide = 0;
  svar.headerOpacity = 0;
}
// MalClean Settings - Create Buuttons
function createButton({ id, setting, text }) {
  const button = create("button", { class: "mainbtns", id });
  if (text) button.textContent = text;
  if (setting === "removeAllCustom") button.setAttribute('style', 'color: #e06c64 !important;font-weight: bold;');
  button.onclick = () => {
    if (setting === "removeAllCustom") {
      const userConfirmed = confirm("Are you sure you want to remove all custom profile settings?");
      if (userConfirmed) {
        editAboutPopup(`...`, 'removeAll');
      }
    } else {
      svar[setting] = !svar[setting];
      svar.save();
      getSettings();
      reloadset();
    }
  };
  return button;
}

//  MalClean - Add Loader
let loadingDiv = create("div", { class: "actloading", id: "loadingDiv", style: { position: "fixed", top: "50%", left: "0", right: "0", fontSize: "16px", zIndex: "12" } });
const loadingDivMask = create("div", {
  class: "fancybox-overlay",
  style: { background: "var(--color-background)", opacity: "1", display: "block", width: "100%", height: "100%", position: "fixed", top: "0", zIndex: "11" },
});

function addLoading(type = "add", text = "Loading", circle = 1, force = 0) {
  const contWrap = document.querySelector('#contentWrapper');
  if (contWrap) {
    if (force) {
      $(loadingDiv).attr('force', force);
    }
    let spinCircle = '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>';
    if (type === "add") {
      loadingDiv.innerHTML = text + (circle ? spinCircle : '');
      if (!document.querySelector('#loadingDiv')) {
        document.body.append(loadingDivMask, loadingDiv);
      }
      document.querySelector('#contentWrapper').style.opacity = "0";
      document.body.style.overflow = "hidden";
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    } else if (type === "remove" && !$(loadingDiv).attr('force')) {
      loadingDivMask.remove();
      loadingDiv.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector('#contentWrapper').style.opacity = "1";
    }
    if (type === "forceRemove") {
      loadingDivMask.remove();
      loadingDiv.remove();
      document.body.style.removeProperty("overflow");
      document.querySelector('#contentWrapper').style.opacity = "1";
    }
  }
}

//Add Custom Profile Colors
async function applyCustomColors(customcolors) {
  let styleElement = document.getElementById("customProfileColors");
  const colorStyles = `
  .profile .statistics-updates .data .graph .graph-inner.watching, .profile .user-statistics .stats-status .circle.watching:after,
  .profile .user-statistics .stats-graph .graph.watching {background:${customcolors[0]}!important}
  .profile .statistics-updates .data .graph .graph-inner.completed, .profile .user-statistics .stats-status .circle.completed:after,
  .profile .user-statistics .stats-graph .graph.completed {background:${customcolors[1]}!important}
  .profile .statistics-updates .data .graph .graph-inner.on_hold, .profile .user-statistics .stats-status .circle.on_hold:after,
  .profile .user-statistics .stats-graph .graph.on_hold {background:${customcolors[2]}!important}
  .profile .statistics-updates .data .graph .graph-inner.dropped, .profile .user-statistics .stats-status .circle.dropped:after,
  .profile .user-statistics .stats-graph .graph.dropped {background:${customcolors[3]}!important}
  .profile .statistics-updates .data .graph .graph-inner.plan_to_watch, .profile .user-statistics .stats-status .circle.plan_to_watch:after,
  .profile .user-statistics .stats-graph .graph.plan_to_watch {background:${customcolors[4]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.reading, .profile .user-statistics .stats-status .circle.reading:after,
  .profile .user-statistics .stats-graph .graph.reading {background:${customcolors[5]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.completed, .profile .user-statistics .stats-status .circle.manga.completed:after,
  .profile .user-statistics .stats-graph .graph.manga.completed {background:${customcolors[6]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.on_hold, .profile .user-statistics .stats-status .circle.manga.on_hold:after,
  .profile .user-statistics .stats-graph .graph.manga.on_hold {background:${customcolors[7]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.dropped, .profile .user-statistics .stats-status .circle.manga.dropped:after,
  .profile .user-statistics .stats-graph .graph.manga.dropped {background:${customcolors[8]}!important}
  .profile .statistics-updates .data .graph .graph-inner.manga.plan_to_read, .profile .user-statistics .stats-status .circle.manga.plan_to_read:after,
  .profile .user-statistics .stats-graph .graph.plan_to_read {background:${customcolors[9]}!important}
  .profile #profile-stats-anime-genre-table table .list-item .data.ratio > div .mal-progress .mal-progress-bar.primary{background:${customcolors[10]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#338543"]{fill:${customcolors[0]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#2d4276"]{fill:${customcolors[1]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#c9a31f"]{fill:${customcolors[2]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#832f30"]{fill:${customcolors[3]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#338543"]{fill:${customcolors[5]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#2d4276"]{fill:${customcolors[6]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#c9a31f"]{fill:${customcolors[7]}!important;}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group[fill="#832f30"]{fill:${customcolors[8]}!important;}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #338543;"]{color:${customcolors[0]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #2d4276;"]{color:${customcolors[1]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #c9a31f;"]{color:${customcolors[2]}!important}
  #profile-stats-anime-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #832f30;"]{color:${customcolors[3]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #338543;"]{color:${customcolors[5]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #2d4276;"]{color:${customcolors[6]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #c9a31f;"]{color:${customcolors[7]}!important}
  #profile-stats-manga-score-dist g.amcharts-Sprite-group.amcharts-Container-group span[style="color: #832f30;"]{color:${customcolors[8]}!important}
  .profile #myanimelist li.btn-fav .title.fs10{color:${customcolors[10]}!important}
  #myanimelist #horiznav_nav.profile-nav > ul > li > a.navactive,#myanimelist .user-function .icon-user-function:not(.disabled) i,
  #myanimelist a:not(.user-function.mb8 a):not(.profile-nav > ul > li > a):not(.icon-team-title):not(.header-profile-link):not(.header-menu-dropdown.header-profile-dropdown a):not(#nav ul a):not(.header-list-dropdown ul li a),
  #myanimelist a:visited:not(.profile-nav > ul > li > a):not(.icon-team-title):not(.header-menu-dropdown.header-profile-dropdown a):not(#nav ul a):not(.header-list-dropdown ul li a) {color:${customcolors[10]}!important;}
  .loadmore:hover, .favThemes .fav-theme-container .sortFavSong:hover, .favThemes .fav-theme-container .removeFavSong:hover,
  #myanimelist #header-menu > div.header-menu-unit.header-profile.js-header-menu-unit > a:hover,#myanimelist #menu > #menu_left > #nav > li > a:hover,#myanimelist .header-list-button .icon:hover,
  #myanimelist .header-notification-dropdown .header-notification-dropdown-inner .header-notification-item > .inner.is-read .header-notification-item-header .category,
  #myanimelist a:not(.user-function.mb8 a):not(.icon-team-title):not(.header-profile-link):hover,.header-list .header-list-dropdown ul li a:hover,.header-profile-dropdown.color-pc-constant ul li a:hover,
  .page-common #nav.color-pc-constant li a:hover,.profile #myanimelist #header-menu ul > li > a:hover,#myanimelist > div.header-menu-unit.header-profile.js-header-menu-unit > a:hover,
  #myanimelist #top-search-bar.color-pc-constant #topSearchButon:hover,#myanimelist .header-message-button:hover .icon,#myanimelist .header-notification-button:hover .icon,
  #myanimelist #menu #topSearchText:hover:not(:focus-within) + #topSearchButon i:before,.dark-mode .profile #myanimelist #menu #nav ul a:hover,#myanimelist #horiznav_nav.profile-nav > ul > li > a:hover,
  .profile #myanimelist #menu #nav ul a:hover {
  color:${tinycolor(customcolors[10]).brighten(25)}!important;}`;
  if (!styleElement) {
    styleElement = create("style", { id: "customProfileColors" });
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = colorStyles.replace(/\n/g, '');
}

//Change Foreground Color
async function changeForeground(color) {
  let cArr = [
    `--fg: ${color}!important;`,
    `--fg2: ${tinycolor(color).brighten(3)}!important;`,
    `--fg4: ${tinycolor(color).brighten(6)}!important;`,
    `--fgOP: ${color}!important;`,
    `--fgOP2: ${tinycolor(color).brighten(3)}!important;`,
    `--bg: ${tinycolor(color).darken(3)}!important;`,
    `--bgo: ${tinycolor(color).setAlpha(.8).toRgbString()}!important;`,
    `--color-background: ${tinycolor(color).darken(3)}!important;`,
    `--color-backgroundo: ${tinycolor(color).setAlpha(.8).toRgbString()}!important;`,
    `--color-foreground: ${color}!important;`,
    `--color-foreground2: ${tinycolor(color).brighten(3)}!important;`,
    `--color-foreground3: ${tinycolor(color).brighten(4)}!important;`,
    `--color-foreground4: ${tinycolor(color).brighten(6)}!important;`,
    `--color-foregroundOP: ${color}!important;`,
    `--color-foregroundOP2: ${tinycolor(color).brighten(3)}!important;`,
    `--border-color: ${tinycolor(color).brighten(8)}!important;`,
  ];
  if (svar.modernLayout) {
    await delay(200);
    $('style').each(function () {
      let styleContent = $(this).html();
      if (styleContent.includes('--fg:') || styleContent.includes('--color-')) {
        let updatedStyle = styleContent
          .replace(/--fg:\s*[^;]+;/g, cArr[0])
          .replace(/--fg2:\s*[^;]+;/g, cArr[1])
          .replace(/--fg4:\s*[^;]+;/g, cArr[2])
          .replace(/--fgOP:\s*[^;]+;/g, cArr[3])
          .replace(/--fgOP2:\s*[^;]+;/g, cArr[4])
          .replace(/--bg:\s*[^;]+!important;/g, cArr[5])
          .replace(/--bgo:\s*[^;]+!important;/g, cArr[6])
          .replace(/--color-background:\s*[^;]+!important;/g, cArr[7])
          .replace(/--color-backgroundo:\s*[^;]+!important;/g, cArr[8])
          .replace(/--color-foreground:\s*[^;]+!important;/g, cArr[9])
          .replace(/--color-foreground2:\s*[^;]+!important;/g, cArr[10])
          .replace(/--color-foreground3:\s*[^;]+!important;/g, cArr[11])
          .replace(/--color-foreground4:\s*[^;]+!important;/g, cArr[12])
          .replace(/--color-foregroundOP:\s*[^;]+!important;/g, cArr[13])
          .replace(/--color-foregroundOP2:\s*[^;]+!important;/g, cArr[14])
          .replace(/--border-color:\s*[^;]+!important;/g, cArr[15]);
        $(this).html(updatedStyle);
      }
    });

    let customColors = `:root, body {${cArr.join("\n")}}
    .dark-mode .page-common #headerSmall,.page-common #headerSmall,html .page-common #contentWrapper, .dark-mode .page-common #contentWrapper,.dark-mode .page-common #content
    {background-color: var(--color-background)!important}
    .dark-mode .profile.statistics .content-container .container-right .chart-wrapper>.filter,.dark-mode .mal-alert,.dark-mode .mal-alert.danger,.dark-mode .profile.statistics .chart-container-rf .right .filter,
    .dark-mode .mal-alert.secondary,.dark-mode .sceditor-container,.dark-mode .head-config,.dark-mode .profile .navi .tabs .btn-tab,.dark-mode .profile .boxlist-container .boxlist,
    .dark-mode .sceditor-container iframe,.dark-mode .sceditor-container textarea,.dark-mode .user-profile .user-status li,.dark-mode .user-profile .user-status li:nth-of-type(even),
    .profile.statistics .content-container .container-right .chart-wrapper>.filter,.mal-alert,.mal-alert.danger,.profile.statistics .chart-container-rf .right .filter,.mal-alert.secondary,
    .sceditor-container,.head-config,.profile .navi .tabs .btn-tab,.profile .boxlist-container .boxlist,.sceditor-container iframe, .sceditor-container textarea,.user-profile .user-status li,
    .user-profile .user-status li:nth-of-type(even),.dark-mode .page-common #footer-block, .page-common #footer-block,.page-common ul#nav ul li a,
    .dark-mode .page-common .header-profile .header-profile-dropdown ul li a,.page-common .header-profile .header-profile-dropdown ul li a,
     .header-list .header-list-dropdown ul li a,.dark-mode .page-common .header-notification-dropdown .arrow_box,.page-common .header-notification-dropdown .arrow_box
    {background: var(--color-foreground)!important}
    .dark-mode .mal-alert.primary,.dark-mode .profile .navi .tabs .btn-tab:hover, .dark-mode .profile .navi .tabs .btn-tab.on,.dark-mode .page-common .quotetext, .dark-mode .page-common .codetext,
    .dark-mode .mal-tabs a.item.active,.dark-mode div.sceditor-toolbar,.mal-alert.primary,.profile .navi .tabs .btn-tab:hover, .profile .navi .tabs .btn-tab.on,.page-common .quotetext, .page-common .codetext,
    .mal-tabs a.item.active,div.sceditor-toolbar,.dark-mode .page-common #menu,.page-common #menu
    {background: 0!important}
    .page-common .content-container * {border-color:var(--border-color)!important}
    .dark-mode .page-common #searchBar.searchBar #topSearchText,.page-common #searchBar.searchBar #topSearchText
    {border-left: var(--border-color) 1px solid;}
    .dark-mode .page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a,.page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a,
    .dark-mode .page-common #searchBar.searchBar #topSearchValue,.page-common #searchBar.searchBar #topSearchValue,.user-profile .user-button .btn-profile-submit,.dark-mode .page-common .btn-form-submit,
    .page-common .btn-form-submit,.dark-mode .page-common #topSearchText, .page-common #topSearchText
    {background-color: var(--color-foreground2) !important;}
    .dark-mode .page-common .header-notification-item:hover,.page-common .header-notification-item:hover
    ${defaultMal ? `,.dark-mode .page-common #searchBar.searchBar #topSearchButon,.page-common #searchBar.searchBar #topSearchButon` : ``}
    {background-color: var(--color-foreground4) !important;}
    html .page-common #contentWrapper, .dark-mode .page-common #contentWrapper
    {padding: 10px 0 0 0!important;}
    .dark-mode .page-common .header-notification-dropdown, .page-common .header-notification-dropdown,
    #nav > li > a, #menu #menu_left #nav li ul,.page-common .header-profile.link-bg,.page-common .header-profile .header-profile-dropdown.color-pc-constant,
    .page-common .header-profile .header-profile-dropdown,.dark-mode .page-common .header-list .header-list-dropdown.color-pc-constant,.page-common .header-list .header-list-dropdown.color-pc-constant
    {background:0 0!important}
    .dark-mode .page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a:hover,.page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a:hover,
    .dark-mode .page-common .header-list .header-list-dropdown.color-pc-constant ul li a:hover,.page-common .header-list .header-list-dropdown.color-pc-constant ul li a:hover,
    .dark-mode .page-common #nav.color-pc-constant ul a:hover,.page-common #nav.color-pc-constant ul a:hover,.dark-mode .page-common .header-profile .header-profile-dropdown ul li a:hover,
    .dark-mode .page-common .header-profile ul li a:hover, .page-common .header-profile ul li a:hover
    {color:#bbb!important;}`;
    customColors = customColors.replace(/\n/g, '');
    styleSheet.innerText = styles + customColors + defaultCSSFixes;
    document.head.appendChild(styleSheet);
  }
}

//Profile Foreground Color
let fgColorSelector = create("input", { class: "badgeInput", id: "fgcolorselector", type: "color" });
let updateFgButton = create("button", { class: "mainbtns", id: "privateProfile" }, "Update");
let removeFgButton = create("button", { class: "mainbtns fa fa-trash", id: "customFgRemove" });
let fgColorValue = 'var(--color-foreground)';
let defaultFgColor = getComputedStyle(document.body);
defaultFgColor = defaultFgColor.getPropertyValue('--color-foreground');
fgColorSelector.value = defaultFgColor;

fgColorSelector.addEventListener('input', (event) => {
  fgColorValue = event.target.value;
  changeForeground(fgColorValue);
});

updateFgButton.onclick = () => {
  const fgBase64 = LZString.compressToBase64(JSON.stringify(fgColorValue));
  const fgbase64url = fgBase64.replace(/\//g, '_');
  editAboutPopup(`customfg/${fgbase64url}`, 'fg');
};

removeFgButton.onclick = () => {
  editAboutPopup(`customfg/...`, 'fg');
};

//Private Profile
var privateButton = create("button", { class: "mainbtns", id: "privateProfile", style: { width: '48%' } }, "Private");
var removePrivateButton = create("button", { class: "mainbtns", id: "privateRemove", style: { width: '48%' } }, "Public");

privateButton.onclick = () => {
  editAboutPopup(`privateProfile/IxA=`, 'private');
};

removePrivateButton.onclick = () => {
  editAboutPopup(`privateProfile/...`, 'private');
};

//Hide Profile Elements
var hideProfileElButton = create("button", { class: "mainbtns", id: "hideProfileElementsButton", style: { width: '45%' } }, "Hide");
var hideProfileElUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton", style: { width: '45%' } }, "Update");
var removehideProfileElButton = create("button", { class: "mainbtns fa fa-trash", id: "hideProfileElementsRemove" });
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
  "#favThemes"
];

async function clearHiddenDivs() {
  divIds.forEach(item => {
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
  $('.hide-button').remove();
  hideProfileElButton.textContent = "Hide";
}

function applyHiddenDivs() {
  hiddenProfileElements.forEach(item => {
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
          div.style.removeProperty('display');
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
  const pfElbase64url = pfElBase64.replace(/\//g, '_');
  editAboutPopup(`hideProfileEl/${pfElbase64url}`, 'hideProfileEl');
  clearHiddenDivs();
};

removehideProfileElButton.onclick = () => {
  editAboutPopup(`hideProfileEl/...`, 'hideProfileEl');
};

//Custom Profile Elements
var customProfileElUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton", style: { width: '48%' } }, "Add to Left Side");
var customProfileElRightUpdateButton = create("button", { class: "mainbtns", id: "hideProfileElementsUpdateButton", style: { width: '48%' } }, "Add to Right Side");

customProfileElUpdateButton.onclick = () => {
  if(svar.modernLayout) {
    createCustomDiv();
  } else {
    createCustomDiv('right');
  }
}

customProfileElRightUpdateButton.onclick = () => {
  createCustomDiv('right');
}

//Mal Badges
let malBadgesInput = create("input", { class: "malBadgesInput", id: "malBadgesInput" });
malBadgesInput.placeholder = "Paste your Mal-Badges Url Here";
var malBadgesButton = create("button", { class: "mainbtns", id: "malBadgesBtn" }, "Update");
var malBadgesRemoveButton = create("button", { class: "mainbtns fa fa-trash", id: "malBadgesRemove" });
var malBadgesDetailButton = create("button", { class: "mainbtns", id: "malBadgesBtn", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var malBadgesDetailButtonText = create("h3", { style: { display: 'inline' }}, "Detailed Badge (Required Modern Layout)");
let malBadgesDetailButtonEnabled = false;
malBadgesDetailButton.onclick = () => {
  malBadgesDetailButtonEnabled = !malBadgesDetailButtonEnabled;
  malBadgesDetailButton.classList.toggle('btn-active', malBadgesDetailButtonEnabled);
}

malBadgesButton.onclick = () => {
  if (malBadgesInput.value.length > 1 && malBadgesInput.value.includes('mal-badges.com')) {
    const detailMode = malBadgesDetailButtonEnabled ? '?detail' : '';
    const badgeBase64 = LZString.compressToBase64(JSON.stringify(malBadgesInput.value + detailMode));
    const badgeBase64Url = badgeBase64.replace(/\//g, '_');
    editAboutPopup(`malBadges/${badgeBase64Url}`, 'malBadges');
    malBadgesInput.addEventListener(`focus`, () => bgInput.select());
  }
};
malBadgesRemoveButton.onclick = () => {
  editAboutPopup(`malBadges/...`, 'malBadges');
};

//Custom Profile Background
let bgInput = create("input", { class: "bgInput", id: "bgInput" });
bgInput.placeholder = "Paste your Background Image Url here";
var bgButton = create("button", { class: "mainbtns", id: "custombg" }, "Update");
var bgRemoveButton = create("button", { class: "mainbtns fa fa-trash", id: "custombgRemove" });
var bgInfo = create("p", { class: "textpb" }, "");

bgButton.onclick = () => {
  if (bgInput.value.length > 1) {
    const bgBase64 = LZString.compressToBase64(JSON.stringify(bgInput.value));
    const bgbase64url = bgBase64.replace(/\//g, '_');
    editAboutPopup(`custombg/${bgbase64url}`, 'bg');
    bgInput.addEventListener(`focus`, () => bgInput.select());
  } else {
    bgInfo.innerText = "Background Image url empty.";
  }
};
bgRemoveButton.onclick = () => {
  editAboutPopup(`custombg/...`, 'bg');
};

//Custom Avatar
var pfButton = create("button", { class: "mainbtns", id: "custompf" }, "Update");
var pfRemoveButton = create("button", { class: "mainbtns fa fa-trash", id: "custompfRemove" });
let pfInput = create("input", { class: "pfInput", id: "pfInput" });
pfInput.placeholder = "Paste your Avatar Image Url here";
var pfInfo = create("p", { class: "textpb" }, "");
pfButton.onclick = () => {
  if (pfInput.value.length > 1) {
    const pfBase64 = LZString.compressToBase64(JSON.stringify(pfInput.value));
    const pfbase64url = pfBase64.replace(/\//g, '_');
    editAboutPopup(`custompf/${pfbase64url}`, 'pf');
    pfInput.addEventListener(`focus`, () => pfInput.select());
  } else {
    pfInfo.innerText = "Avatar Image url empty.";
  }
};
pfRemoveButton.onclick = () => {
  editAboutPopup(`custompf/...`, 'pf');
};

//Custom CSS
var cssButton = create("button", { class: "mainbtns", id: "customCSS" }, "Update");
var cssRemoveButton = create("button", { class: "mainbtns fa fa-trash", id: "customCSSRemove" });
var cssInfo = create("p", { class: "textpb" }, "");
let cssInput = create("input", { class: "cssInput", id: "cssInput" });
var cssmodernLayout = create("button", { class: "mainbtns", id: "cssmodernLayout", style: { height: "32px", width: "32px", verticalAlign: "middle" } });
var cssmodernLayoutText = create("h3", { style: { display: 'inline' } }, "Custom CSS + Modern Profile Layout");
let cssmodernLayoutEnabled = false;
cssmodernLayout.onclick = () => {
  cssmodernLayoutEnabled = !cssmodernLayoutEnabled;
  cssmodernLayout.classList.toggle('btn-active', cssmodernLayoutEnabled);
}
cssInput.placeholder = "Paste your CSS here";
cssButton.onclick = () => {
  if (cssInput.value.length > 1) {
    const cssBase64 = LZString.compressToBase64(JSON.stringify([cssInput.value, cssmodernLayoutEnabled]));
    const cssbase64url = cssBase64.replace(/\//g, '_');
    editAboutPopup(`customCSS/${cssbase64url}`, 'css');
    cssInput.addEventListener(`focus`, () => cssInput.select());
  } else {
    cssInfo.innerText = "Css empty.";
  }
};
cssRemoveButton.onclick = () => {
  editAboutPopup(`customCSS/...`, 'css');
};

//Custom Badge
var badgeButton = create("button", { class: "mainbtns", id: "custombadge" }, "Update");
let badgeInput = create("input", { class: "badgeInput", id: "badgeInput" });
let badgeColorSelector = create("input", { class: "badgeInput", id: "badgecolorselector", type: "color" });
let badgeColorLoop = create("button", { class: "mainbtns", id: "custombadgeColorLoop" }, "Rainbow");
let badgeColorLoopEnabled = false;
let badgeColorValue = '#000000';
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
}
badgeColorSelector.addEventListener('input', (event) => {
  badgeColorValue = event.target.value;
  badgeColorLoop.style.background = "var(--color-background)";
  badgeColorLoopEnabled = false;
});
badgeButton.onclick = () => {
  if (badgeInput.value.length > 1) {
    const badgeBase64 = LZString.compressToBase64(JSON.stringify([badgeInput.value, badgeColorValue]));
    const badgebase64url = badgeBase64.replace(/\//g, '_');
    editAboutPopup(`custombadge/${badgebase64url}`, 'badge');
    badgeInput.addEventListener(`focus`, () => badgeInput.select());
  } else {
    editAboutPopup(`custombadge/...`, 'badge');
  }
};

//Custom Profile Colors
const createColorInput = () => create("input", { class: "customColorInput", type: "color" });
const customColorButton = create("button", { class: "mainbtns", id: "customColorUpdate" }, "Update");
const customColorRemoveButton = create("button", { class: "mainbtns fa fa-trash", id: "customColorRemove" });
const customColors = create("div", { class: "customColorsInside" });
let defaultLinkColor = getComputedStyle(document.body);
defaultLinkColor = defaultLinkColor.getPropertyValue('--color-link');

const customColorLabels = [
  'Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch',
  'Reading', 'Completed', 'On Hold', 'Dropped', 'Plan to Read', 'Links'
];

const customColorsDefault = [
  '#338543', '#2d4276', '#c9a31f', '#832f30', '#747474',
  '#338543', '#2d4276', '#c9a31f', '#832f30', '#747474', defaultLinkColor
];

let colorValues;
const colorSelectors = Array.from({ length: customColorLabels.length }, (_, index) => {
  const colorInput = createColorInput();
  colorInput.value = customColorsDefault[index];
  colorInput.addEventListener("input", (event) => {
    colorValues = colorSelectors.map(selector => selector.value);
    applyCustomColors(colorValues);
  });
  return colorInput;
});
const colorAnimeStats = create("div", { class: "colorGroup" }, '<b>Anime Stats</b>');
customColorLabels.slice(0, 5).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index], colorLabel);
  colorAnimeStats.appendChild(colorDiv);
});

const colorMangaStats = create("div", { class: "colorGroup" }, '<b>Manga Stats</b>');
customColorLabels.slice(5, 10).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index + 5], colorLabel);
  colorMangaStats.appendChild(colorDiv);
});

const colorProfile = create("div", { class: "colorGroup" }, '<b>Profile</b>');
customColorLabels.slice(10).forEach((label, index) => {
  const colorDiv = create("div", { class: "colorOption" });
  const colorLabel = create("label", { class: "colorLabel" });
  colorLabel.append(`${label} `);
  colorDiv.append(colorSelectors[index + 10], colorLabel);
  colorProfile.appendChild(colorDiv);
});
customColors.append(colorAnimeStats, colorMangaStats, colorProfile);
customColorButton.onclick = () => {
  const colors = colorSelectors.map(selector => selector.value);
  const customColorBase64 = LZString.compressToBase64(JSON.stringify(colors));
  const customColorBase64Url = customColorBase64.replace(/\//g, '_');
  editAboutPopup(`customcolors/${customColorBase64Url}`, 'color');
};
customColorRemoveButton.onclick = () => {
  editAboutPopup(`customcolors/...`, 'color');
};

// Toggle enabled Buttons
function getSettings() {
  Object.keys(svar).forEach(setting => {
    const btn = window[`${setting}Btn`];
    if (btn !== undefined && typeof svar[setting] !== 'undefined' && (setting !== 'headerSlide' && setting !== 'headerOpacity' || !defaultMal)) {
      btn.classList.toggle('btn-active', svar[setting]);
    }
  });
}

//MalClean Settings - Create Custom Settings Div Function
function createCustomSettingDiv(title, description, elementsToAppend, svar = "0", forProfile) {
  const div = create("div", { class: "malCleanSettingContainer" },
    `<div class="malCleanSettingHeader">
       <h2>${title}</h2>
       <h3>${description}</h3>
       <div class="malCleanSettingInner"></div>
     </div>`
  );
  const innerDiv = div.querySelector('.malCleanSettingInner');
  let profileCheck = forProfile ? userNotHeaderUser : false;
  if (!profileCheck) {
    if (svar === "0" || svar) {
      if (elementsToAppend && Array.isArray(elementsToAppend)) {
        elementsToAppend.forEach(element => {
          innerDiv.append(element);
        });
      }
    }
  } else {
    const profileBtn = create("button", { class: "mainbtns", id: "backToProfile", style: { width: '98%' } }, "Back to My Profile");
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
      const active = $(settingButton).attr('active');
      if (active === '0') {
        $(settingDiv).slideDown();
        $(settingButton).attr('active', '1');
        if (type === "svar") getSettings();
      } else {
        $(settingDiv).slideUp();
        $(settingButton).attr('active', '0');
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
    settingContainer.classList.add('svar');
    $(settingContainer).append(buttons[settingKey], `<h3>${text}</h3>`);
    $(targetDiv).append(settingContainer);
  } else if (type === "ttl") {
    // TTL Settings
    let settingInput = create("input", { class: `${settingKey}Input`, placeholder: "Days (Number)" });
    if (svar[settingKey]) settingInput.value = daysToTTL(svar[settingKey], 1);
    settingContainer.classList.add('input');
    $(settingContainer).append(`<h3>How often should the ${text} data be updated? (Days)</h3>`, settingInput);
    $(targetDiv).append(settingContainer);

    settingInput.addEventListener('input', (event) => {
      const ttl = daysToTTL(event.target.value);
      svar[settingKey] = ttl;
      svar.save();
    });
  }
}

//MalClean Settings - Create Settings Div
function createDiv() {
  const modernBtn = '<a style="cursor: pointer;" onclick="document.getElementById(\'modernLayoutBtn\').scrollIntoView({ behavior: \'smooth\', block: \'center\' });">Modern Profile Layout</a>';
  let listDiv = create("div", { class: "malCleanMainContainer" }, '<div class="malCleanMainHeader"><b>' + stLink.innerText + "</b></div>");
  let customfgDiv = createCustomSettingDiv(
    "Custom Foreground Color (Required " + modernBtn + ")",
    "Change profile foreground color. This will be visible to users with the script.",
    [fgColorSelector, updateFgButton, removeFgButton], svar.modernLayout, "profile"
  );

  let custombgDiv = createCustomSettingDiv(
    "Custom Banner (Required " + modernBtn + ")",
    "Add custom banner to your profile. This will be visible to users with the script.",
    [bgInput, bgButton, bgRemoveButton, bgInfo], svar.modernLayout, "profile"
  );
  let custompfDiv = createCustomSettingDiv(
    "Custom Avatar",
    "Add custom avatar to your profile. This will be visible to users with the script.",
    [pfInput, pfButton, pfRemoveButton, pfInfo], 1, "profile"
  );
  let custombadgeDiv = createCustomSettingDiv(
    "Custom Badge (Required " + modernBtn + ")",
    "Add custom badge to your profile. This will be visible to users with the script." +
    "<p>You can use HTML elements. Maximum size 300x150. Update empty to delete.</p>",
    [badgeInput, badgeColorSelector, badgeColorLoop, badgeButton], svar.modernLayout, "profile"
  );
  let malBadgesDiv = createCustomSettingDiv(
    "Mal-Badges",
    "You can add Mal-Badges to your profile. This will be visible to users with the script." +
    "<p>If the badge does not appear, it means that the Mal-Badges is blocking access. There is nothing you can do about it.</p>",
    [malBadgesInput, malBadgesButton, malBadgesRemoveButton, malBadgesDetailButton, malBadgesDetailButtonText], 1, "profile"
  );
  let customCSSDiv = createCustomSettingDiv(
    "Custom CSS",
    "Add custom css to your profile. This will be visible to users with the script.",
    [cssInput, cssButton, cssRemoveButton, cssmodernLayout, cssmodernLayoutText, cssInfo], 1, "profile"
  );
  let customColorsDiv = createCustomSettingDiv(
    "Custom Profile Colors",
    "Change profile colors. This will be visible to users with the script.",
    [customColors, customColorButton, customColorRemoveButton], 1, "profile"
  );
  let privateProfileDiv = createCustomSettingDiv(
    "Profile Privacy",
    "You can make your profile private or public for users with the script.",
    [privateButton, removePrivateButton], 1, "profile"
  );
  let hideProfileElDiv = createCustomSettingDiv(
    "Hide Profile Elements",
    "You can hide your profile elements. This will also apply to users with the script.",
    [hideProfileElButton, hideProfileElUpdateButton, removehideProfileElButton], 1, "profile"
  );
  let customProfileElDiv = createCustomSettingDiv(
    "Custom Profile Elements",
    "You can add custom profile elements your profile. This will be visible to users with the script. You can use HTML elements.",
    [customProfileElUpdateButton, customProfileElRightUpdateButton], 1, "profile"
  );
  const buttons = buttonsConfig.reduce((acc, { id, setting, text }) => {
    acc[id] = createButton({ id, setting, text });
    return acc;
  }, {});

  listDiv.querySelector(".malCleanMainHeader").append(reloadButton, closeButton);
  listDiv.append(
    createListDiv(
      "My Panel",
      [
        { b: buttons["animeInfoBtn"], t: "Add info to seasonal anime (hover over anime to make it appear)" },
        { b: buttons["currentlyWatchingBtn"], t: "Show currently watching anime" },
        { b: buttons["currentlyReadingBtn"], t: "Show currently reading manga" },
        { b: buttons["airingDateBtn"], t: "Add next episode countdown to currently watching anime" },
        { b: buttons["autoAddDateBtn"], t: "Auto add start/finish date to watching anime & reading manga" },
        { b: buttons["recentlyAddedAnimeBtn"], t: "Show recently added anime" },
        { b: buttons["recentlyAddedMangaBtn"], t: "Show recently added manga" },
        ...!defaultMal ? [{ b: buttons["headerSlideBtn"], t: "Auto Hide/Show header" }] : [],
        ...defaultMal ? [{ b: buttons["scrollbarStyleBtn"], t: "Change Scrollbar Appearance" }] : [],
      ]
    ),
    createListDiv(
      "Anime / Manga",
      [
        { b: buttons["animeBgBtn"], t: "Add dynamic background color based cover art's color palette" },
        { b: buttons["animeBannerBtn"], t: "Add banner image from Anilist" },
        { b: buttons["animeBannerMoveBtn"], t: "Move the cover image below the banner image." },
        { b: buttons["animeTagBtn"], t: "Add tags from Anilist" },
        { b: buttons["animeRelationBtn"], t: "Replace relations" },
        { b: buttons["relationFilterBtn"], t: "Add filter to replaced relations" },
        { b: buttons["animeSongsBtn"], t: "Replace Anime OP/ED with animethemes.moe" },
        { b: buttons["editPopupBtn"], t: "Replace the edit details with the edit popup" },
        { b: buttons["animeInfoDesignBtn"], t: "Change the design of the Information on the left side." },
        { b: buttons["animeHeaderBtn"], t: "Change title position" },
        { b: buttons["customCoverBtn"], t: "Custom Cover Image <br><i>(Go to the anime/manga pictures page to change it)</i>" },
      ]
    ),
    createListDiv(
      "Character",
      [
        { b: buttons["charBgBtn"], t: "Add dynamic background color based cover art's color palette" },
        { b: buttons["characterHeaderBtn"], t: "Change name position" },
        { b: buttons["characterNameAltBtn"], t: "Show alternative name" },
        { b: buttons["customCharacterCoverBtn"], t: "Custom Cover Image <br><i>(Go to the character pictures page to change it)</i>" },
      ]
    ),
    createListDiv(
      "People",
      [
        { b: buttons["peopleHeaderBtn"], t: "Change name position" },
      ]
    ),
    createListDiv(
      "Blog",
      [
        { b: buttons["blogRedesignBtn"], t: "Redesign blog page" },
        { b: buttons["blogContentBtn"], t: "Auto fetch blog content" },
      ]
    ),
    createListDiv(
      "Club",
      [
        { b: buttons["clubCommentsBtn"], t: "Expand club comments" },
      ]
    ),
    createListDiv(
      "Forum",
      [
        { b: buttons["embedBtn"], t: "Modern Anime/Manga Links" },
        { b: buttons["forumDateBtn"], t: "Change date format" },
      ]
    ),
    createListDiv(
      "Profile",
      [
        { b: buttons["modernLayoutBtn"], t: "Modern Profile Layout" },
        { b: buttons["replaceListBtn"], t: "Modern Anime/Manga List" },
        ...!defaultMal ? [{ b: buttons["headerOpacityBtn"], t: "Add auto opacity to the header if the user has a custom banner." }] : [],
        ...svar.modernLayout ? [{ b: buttons["moveBadgesBtn"], t: "Move badges after the anime & manga list buttons." }] : [],
        ...svar.modernLayout ? [{ b: buttons["actHistoryBtn"], t: "Show Activity History" }] : [],
        ...svar.modernLayout ? [{ b: buttons["profileAnimeGenreBtn"], t: "Show Anime Genre Overview" }] : [],
        ...svar.modernLayout ? [{ b: buttons["profileMangaGenreBtn"], t: "Show Manga Genre Overview" }] : [],
        { b: buttons["customCSSBtn"], t: "Show custom CSS" },
        { b: buttons["profileHeaderBtn"], t: "Change username position" },
        { b: buttons["moreFavsBtn"], t: "Add more than 10 favorites" },
        { b: buttons["newCommentsBtn"], t: "Comments Redesign" },
        { b: buttons["profileNewCommentsBtn"], t: "Profile Comments Redesign" },
      ]
    )
  );
  listDiv.append(privateProfileDiv, hideProfileElDiv, customProfileElDiv, malBadgesDiv, custompfDiv, custombadgeDiv, custombgDiv, customfgDiv);
  if (svar.modernLayout) {
    buttons["profileHeaderBtn"].parentElement.style.display = "none";
  }
  listDiv.append(customColorsDiv, customCSSDiv);
  document.querySelector("#headerSmall").insertAdjacentElement("afterend", listDiv);
  listDiv.append(buttons["removeAllCustomBtn"]);

  createSettingDropdown("#replaceListBtnOption", "svar", svar, "listAiringStatusBtn", "Show Airing Status Dot");
  createSettingDropdown("#moreFavsBtnOption", "svar", svar, "moreFavsModeBtn", "Update also for other users");
  createSettingDropdown("#embedBtnOption", "ttl", svar, "embedTTL", "embed");
  createSettingDropdown("#animeTagBtnOption", "ttl", svar, "tagTTL", "tag");
  createSettingDropdown("#animeRelationBtnOption", "ttl", svar, "relationTTL", "relation");
  createSettingDropdown("#modernLayoutBtnOption", "svar", svar, "autoModernLayoutBtn", "Turn off auto modern layout detection.");

  $("#moreFavsModeBtn").on('click', async function () {
    await delay(200);
    if ($("#moreFavsModeBtn").hasClass('btn-active')) {
      if (svar.moreFavsMode) {
        const moreFavsDB = await compressLocalForageDB("moreFavs_anime_manga", "moreFavs_character");
        await editAboutPopup(`moreFavs/${moreFavsDB}`, 'moreFavs', 1);
      }
    }
  });
  getSettings();
}

//MalClean Settings - Close Settings Div
function closeDiv() {
  $('.malCleanMainContainer').remove();
  clearHiddenDivs();
  active = !1;
}

//MalClean Settings - Settings Open & Close
function Settings() {
  active = !active;
  if (active) {
    createDiv();
  }
  if (!active) {
    closeDiv();
  }
}

//Delay Function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Main
(async function () {
  "use strict";

  // Modern Profile - Mal Badges Fixes
  if (/mal-badges\.com\/(user).*malbadges/.test(location.href)) {
    $('#content  div[data-page-id="main"] .userv2-detail').css('background', '#fff0');
    $('#content  .mr-auto').css('background', '#fff0'); $('body').css('background-color', '#fff0');
    $('#content').css('background', '#fff0');
    $('.user_badge img').css('max-width', 'initial');

    // Detailed Badge
    if (location.href.endsWith('?detail&malbadges')) {
      $('.userv2-stats').css({ 'font-size': '15px', 'gap': '8px', 'padding-right': '12px' });
      $('.value-display.value-display--plain .count').css('font-size', '45px');
    } else {
      $('.userv2-stats').remove();
      $('.value-display.value-display--plain .count').css('font-size', '55px');
      $('.userv2-detail__stats').css('grid-template-columns', '1fr 1fr 1fr');
      let statsDivs = $('.userv2-detail__stats .value-display');
      statsDivs.eq(-2).before(statsDivs.eq(-1));
      $('.userv2-detail-bar .value-display__label, .userv2-detail-bar .value-display__value').css('font-size', '16px');
      $('.userv2-detail-bar .count').css('font-size', '20px');
      $('.userv2-detail-bar .value-display.value-display--rank').last().find('.value-display__label').text('Comp Rank');
      $('.userv2-detail-bar .value-display__value').css('font-size', '13px');
      const xpLen = $('.userv2-detail__stats .count').last().attr('data-number')?.length;
      if (xpLen > 4) {
        $('.userv2-detail__stats .count').css('font-size', '55px');
      }
      if (xpLen > 5) {
        $('.userv2-detail__stats .count').css('font-size', '50px');
      }
    }
  }
  // News and Forum - Load iframe only when the spoiler button is clicked
  if (/\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href) || /\/(news)\/\d/.test(location.href)) {
    const spoilers = document.querySelectorAll(".spoiler:has(.movie)");
    spoilers.forEach(spoiler => {
      const showButton = spoiler.querySelector(".show_button");
      const hideButton = spoiler.querySelector(".hide_button");
      const iframe = spoiler.querySelector("iframe");
      showButton.setAttribute("data-src", iframe.src);
      iframe.src = "";
      $(iframe).contents().find("body").attr('style', 'background:0!important');
      showButton.setAttribute("onclick", showButton.getAttribute('onclick') +
        'this.nextElementSibling.querySelector("iframe.movie").setAttribute("src",this.getAttribute("data-src"));' +
        'this.nextElementSibling.querySelector("iframe.movie").contentWindow.document.body.setAttribute("style","background:0!important");');
      hideButton.setAttribute("onclick", hideButton.getAttribute('onclick') + 'this.parentElement.querySelector("iframe.movie").removeAttribute("src")');
    });
  }

  // Add More Favs
  if (svar.moreFavs && /\/(profile)\/.?([\w]+)?\/?/.test(current) && !userNotHeaderUser) {
    await loadMoreFavs(1, "character");
    await loadMoreFavs(1, "anime_manga");
  }

  //onload Function
  async function on_load() {
    //Replace anime.php
    const phpUrl = window.location.href;
    if (phpUrl.includes('/anime.php?id=')) {
      const newUrl = phpUrl.replace('/anime.php?id=', '/anime/');
      window.location.href = newUrl + '/';
    }
    //Add MalClean Settings to header dropdown
    let pfHeader = $('li:contains("Account Settings")')[0];
    if (!pfHeader) {
      pfHeader = document.querySelector(".header-profile-dropdown > ul > li:nth-last-child(3)");
    }
    if (pfHeader) {
      var gear = pfHeader.querySelector("a > i");
      var gearClone = gear.cloneNode(!0);
      stLink.prepend(gearClone);
      stButton.append(stLink);
      pfHeader.insertAdjacentElement("afterend", stButton);
    }

    if (svar.customCover) {
      await loadCustomCover();
    }
    if (svar.customCharacterCover && (/\/(profile)\/.?([\w]+)?\/?/.test(current) || $('.detail-characters-list').length) || current.endsWith('/characters') || current.endsWith('/character.php')) {
      await loadCustomCover(1, "character");
    }
    if ($('#loadingDiv').length) {
      addLoading("remove");
    }
  };

  if (document.readyState === "complete") {
    on_load();
  } else {
    window.addEventListener("load", on_load);
  }

  //Currently Watching //--START--//
  let incCount = 0;
  let incTimer;
  let incActive = 0;
  let lastClickTime = 0;
  const debounceDelay = 400;
  if (svar.currentlyWatching && location.pathname === "/") {
    //Create Currently Watching Div
    getWatching();
    async function getWatching() {
      if (svar.airingDate) {
        let s = document.createElement("style");
        s.innerText = `.widget.anime_suggestions.left #widget-currently-watching > div.widget-slide-outer ul > li > a span{opacity: 0;transition: .4s}
        .widget.anime_suggestions.left div#widget-currently-watching > div.widget-slide-outer ul > li > a:hover span{opacity: 1}`;
        document.head.appendChild(s);
      }
      let idArray = [];
      let ep, left, infoData;
      let user = headerUserName;
      if (user) {
        const currentlyWatchingDiv = create("article", { class: "widget-container left", id: "currently-watching" });
        currentlyWatchingDiv.innerHTML = `<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span>
      <h2 class="index_h2_seo"><a href="https://myanimelist.net/animelist/${user}?status=1">Currently Watching</a></h2>
      <i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative; margin-left:5px; font-size:12px; font-family:FontAwesome"></i></div>
      <div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-watching">
      <div id="current-left" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>
      <div id="current-right" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;"><span class="btn-inner" style="display: none;"></span></div>
      <div class="widget-slide-outer"><ul class="widget-slide js-widget-slide" data-slide="4" style="width: 3984px; margin-left: 0px; -webkit-transition: margin-left 0.4s ease-in-out; transition: margin-left 0.4s ease-in-out"></ul>
      </div></div></div></div></div>`;
        //Get watching anime data from user's list
        const html = await fetch("https://myanimelist.net/animelist/" + user + "?status=1")
          .then((response) => response.text())
          .then(async (data) => {
            var newDocument = new DOMParser().parseFromString(data, "text/html");
            let list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
            if (list) {
              document.querySelector("#content > div.left-column").prepend(currentlyWatchingDiv);
              await processList();
              async function processList() {
                if (svar.airingDate) {
                  for (const item of list) {
                    idArray.push(item.anime_id);
                  }
                  //get anime time until airing info from Anilist API
                  const queries = idArray.map((id, index) => `Media${index}: Media(idMal: ${id}, type: ANIME) {nextAiringEpisode {timeUntilAiring episode}}`);
                  const fullQuery = `query {${queries.join("\n")}}`;
                  infoData = await fetchAnimeData();
                  async function fetchAnimeData() {
                    for (let x = 0; x < 5; x++) {
                      infoData = await AnilistAPI(fullQuery);
                      if (infoData) {
                        return infoData;
                      }
                      await delay(1000);
                    }
                    // if api error
                    let d = document.querySelector("#currently-watching > div > div.widget-header");
                    if (d) {
                      let e = create('span', { class: 'currently-watching-error', style: { float: "right", display: 'inline-block' } }, "API Error. Unable to get next episode countdown ");
                      let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
                      r.onclick = () => {
                        currentlyWatchingDiv.remove();
                        getWatching();
                      };
                      e.append(r);
                      d.append(e);
                    }
                  }
                }
                // if watching anime still airing, add time until airing
                for (let x = 0; x < list.length; x++) {
                  let currep, nextep;
                  if (svar.airingDate && infoData) {
                    const media = infoData.data["Media" + x];
                    ep = media.nextAiringEpisode ? media.nextAiringEpisode.episode : "";
                    const airing = media.nextAiringEpisode ? media.nextAiringEpisode.timeUntilAiring : "";
                    left = ep && airing ? '<div id=' + airing + ' class="airingInfo"><div>Ep ' + ep + "</div>" + "<div>" + (await airingTime(airing)) + "</div></div>" : "";
                    let info = [ep, left];
                    if (info) {
                      currep = info[0] && info[0] !== 1 ? await episodesBehind(info[0], list[x].num_watched_episodes) : 0;
                      nextep = svar.airingDate && info[1] ? info[1] : "";
                      if (currep) {
                        nextep += '<span class="epBehind">' + currep + '</span><div class="behindWarn"></div>';
                      }
                    }
                  }
                  if (!nextep || !infoData) {
                    nextep = '<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">' + list[x].num_watched_episodes +
                      (list[x].anime_num_episodes !== 0 ? " / " + list[x].anime_num_episodes : "") + '</div></div>';
                  }
                  let ib = create("i", { class: "fa fa-pen editCurrently", id: list[x].anime_id });
                  let increaseButton = create("i", { class: "fa fa-plus incButton", id: list[x].anime_id });
                  // create watching anime div
                  let wDiv = create("li", { class: "btn-anime" });
                  wDiv.innerHTML = `<a class="link" href="${list[x].anime_url}">
                <img width="124" height="170" class="lazyloaded" src="${list[x].anime_image_path}" alt="${list[x].anime_title}">
                <span class="title js-color-pc-constant color-pc-constant">${list[x].anime_title}</span>${nextep ? nextep : ""}</a>`;
                  wDiv.appendChild(ib);
                  wDiv.appendChild(increaseButton);
                  document.querySelector("#widget-currently-watching ul").append(wDiv);
                  ib.onclick = async () => {
                    await editPopup(ib.id);
                    currentlyWatchingDiv.remove();
                    getWatching();
                  };
                  increaseButton.onclick = async () => {
                    const currentTime = new Date().getTime();
                    if (currentTime - lastClickTime < debounceDelay || incActive !== 0 && incActive !== ib.id) {
                      return;
                    }
                    if (incActive === 0) {
                      incActive = ib.id;
                    }
                    lastClickTime = currentTime;
                    incCount++;
                    increaseButton.innerText = incCount.toString();
                    clearTimeout(incTimer);
                    incTimer = setTimeout(async function () {
                      await editPopup(ib.id, null, true, incCount);
                      currentlyWatchingDiv.remove();
                      getWatching();
                      incCount = 0;
                      incActive = 0;
                    }, 2000);
                  };
                }
                // sort by time until airing
                if (svar.airingDate) {
                  let airingDivs = Array.from(document.querySelectorAll("#widget-currently-watching ul li"));
                  let airingMainDiv = document.querySelector("#widget-currently-watching ul");
                  airingDivs.sort(function (a, b) {
                    let idA = a.children[0]?.children[2]?.id;
                    let idB = b.children[0]?.children[2]?.id;
                    return idA - idB;
                  });
                  airingMainDiv.innerHTML = '';
                  airingDivs.forEach(function (div) {
                    airingMainDiv.appendChild(div);
                  });
                }
                document.querySelector("#currently-watching > div > div.widget-header > i").remove();
                document.querySelector("#widget-currently-watching > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right").classList.add("active") : "";
              }

              //Currently Watching - Slider Left
              document.querySelector("#current-left").addEventListener("click", function () {
                const slider = document.querySelector(".widget-slide");
                const slideWidth = slider.children[0].offsetWidth + 12;
                if (parseInt(slider.style.marginLeft) < 0) {
                  slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
                  document.querySelector("#widget-currently-watching > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right").classList.add("active") : "";
                }
                if (parseInt(slider.style.marginLeft) > 0) {
                  slider.style.marginLeft = -slideWidth + "px";
                }
                if (parseInt(slider.style.marginLeft) === 0) {
                  document.querySelector("#current-left").classList.remove("active");
                }
              });
              //Currently Watching - Slider Right
              document.querySelector("#current-right").addEventListener("click", function () {
                const slider = document.querySelector(".widget-slide");
                const slideWidth = slider.children[0].offsetWidth + 12;
                if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
                  slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
                  document.querySelector("#current-left").classList.add("active");
                }
                if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
                  document.querySelector("#current-right").classList.remove("active");
                }
              });
              if (svar.customCover) {
                loadCustomCover(1);
              }
            }
          });
      }
    }
  }
  //Currently Watching //--END--//

  //Currently Reading //--START--//
  if (svar.currentlyReading && location.pathname === "/") {
    //Create Currently Reading Div
    getreading();
    async function getreading() {
      if (svar.airingDate) {
        let s = document.createElement("style");
        s.innerText = `.widget.anime_suggestions.left #widget-currently-reading > div.widget-slide-outer ul > li > a span{opacity: 0;transition: .4s}
        .widget.anime_suggestions.left div#widget-currently-reading > div.widget-slide-outer ul > li > a:hover span{opacity: 1}`;
        document.head.appendChild(s);
      }
      let idArray = [];
      let ep, left, infoData;
      let user = headerUserName;
      if (user) {
        const currentlyReadingDiv = create("article", { class: "widget-container left", id: "currently-reading" });
        currentlyReadingDiv.innerHTML = `<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span>
        <h2 class="index_h2_seo"><a href="https://myanimelist.net/mangalist/${user}?status=1">Currently Reading</a></h2>
        <i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative; margin-left:5px; font-size:12px; font-family:FontAwesome"></i></div>
        <div class="widget-content"><div class="mt4"><div class="widget-slide-block" id="widget-currently-reading">
        <div id="current-left-manga" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>
        <div id="current-right-manga" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;"><span class="btn-inner" style="display: none;"></span></div>
        <div class="widget-slide-outer"><ul class="widget-slide js-widget-slide manga" data-slide="4" style="width: 3984px; margin-left: 0px; -webkit-transition: margin-left 0.4s ease-in-out; transition: margin-left 0.4s ease-in-out"></ul>
        </div></div></div></div></div>`;
        //Get reading anime data from user's list
        const html = await fetch("https://myanimelist.net/mangalist/" + user + "?status=1")
          .then((response) => response.text())
          .then(async (data) => {
            var newDocument = new DOMParser().parseFromString(data, "text/html");
            let list = JSON.parse(newDocument.querySelector("#list-container > div.list-block > div > table").getAttribute("data-items"));
            if (list) {
              if (document.querySelector("#currently-watching")) {
                document.querySelector("#currently-watching").insertAdjacentElement("afterend", currentlyReadingDiv);
              } else {
                document.querySelector("#content > div.left-column").prepend(currentlyReadingDiv);
              }
              await processList();
              async function processList() {
                for (let x = 0; x < list.length; x++) {
                  let nextchap = '<div id="700000" class="airingInfo" style="padding: 8px 0px"><div style="padding-top:3px">' + list[x].num_read_chapters +
                    (list[x].manga_num_chapters !== 0 ? " / " + list[x].manga_num_chapters : "") + '</div></div>';
                  let ib = create("i", { class: "fa fa-pen editCurrently", id: list[x].manga_id });
                  let increaseButton = create("i", { class: "fa fa-plus incButton", id: list[x].anime_id });
                  increaseButton.onclick = async () => {
                    const currentTime = new Date().getTime();
                    if (currentTime - lastClickTime < debounceDelay || incActive !== 0 && incActive !== ib.id) {
                      return;
                    }
                    if (incActive === 0) {
                      incActive = ib.id;
                    }
                    lastClickTime = currentTime;
                    incCount++;
                    increaseButton.innerText = incCount.toString();
                    clearTimeout(incTimer);
                    incTimer = setTimeout(async function () {
                      await editPopup(ib.id, 'manga', true, incCount);
                      currentlyReadingDiv.remove();
                      getreading();
                      incCount = 0;
                      incActive = 0;
                    }, 2000);
                  };
                  // Create Reading Manga Div
                  let rDiv = create("li", { class: "btn-anime" });
                  rDiv.innerHTML = `<a class="link" href="${list[x].manga_url}">
                <img width="124" height="170" class="lazyloaded" src="${list[x].manga_image_path}" alt="${list[x].manga_title}" alt="${list[x].manga_title}">
                <span class="title js-color-pc-constant color-pc-constant">${list[x].manga_title}</span>${nextchap}</a>`;
                  rDiv.appendChild(ib);
                  rDiv.appendChild(increaseButton);
                  document.querySelector("#widget-currently-reading ul").append(rDiv);
                  ib.onclick = async () => {
                    await editPopup(ib.id, 'manga');
                    currentlyReadingDiv.remove();
                    getreading();
                  };
                }
                document.querySelector("#currently-reading > div > div.widget-header > i").remove();
                document.querySelector("#widget-currently-reading > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-manga").classList.add("active") : "";
              }

              //Currently Reading - Slider Left
              document.querySelector("#current-left-manga").addEventListener("click", function () {
                const slider = document.querySelector(".widget-slide.js-widget-slide.manga");
                const slideWidth = slider.children[0].offsetWidth + 12;
                if (parseInt(slider.style.marginLeft) < 0) {
                  slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
                  document.querySelector("#widget-currently-reading > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-manga").classList.add("active") : "";
                }
                if (parseInt(slider.style.marginLeft) > 0) {
                  slider.style.marginLeft = -slideWidth + "px";
                }
                if (parseInt(slider.style.marginLeft) === 0) {
                  document.querySelector("#current-left-manga").classList.remove("active");
                }
              });
              //Currently Reading - Slider Right
              document.querySelector("#current-right-manga").addEventListener("click", function () {
                const slider = document.querySelector(".widget-slide.js-widget-slide.manga");
                const slideWidth = slider.children[0].offsetWidth + 12;
                if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
                  slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
                  document.querySelector("#current-left-manga").classList.add("active");
                }
                if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
                  document.querySelector("#current-right-manga").classList.remove("active");
                }
              });
              if (svar.customCover) {
                loadCustomCover(1);
              }
            }
          });
      }
    }
  }
  //Currently Reading //--END--//

  //Recently Added Anime //--START--//
  if (svar.recentlyAddedAnime && location.pathname === "/") {
    buildRecentlyAddedAnime();

    async function buildRecentlyAddedAnime() {
      let user = headerUserName;
      if (user) {
        const recentlyAddedDiv = create("article", { class: "widget-container left  recently-anime", id: "recently-added-anime", page: "0" });
        recentlyAddedDiv.innerHTML =
          '<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span><h2 class="index_h2_seo">' +
          '<a href="https://myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1">Recently Added Anime</a>' +
          '</h2><i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>' +
          '<select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilter">' + '<option value="All">All</option><option value="TV,Movie" selected >TV	&amp; Movie</option><option value="TV">TV</option><option value="TV Special">TV Special</option>' +
          '<option value="Movie">Movie</option><option value="ONA">ONA</option><option value="OVA">OVA</option>' +
          '<option value="Special">Special</option><option value="Music">Music</option><option value="CM">CM</option><option value="PV">PV</option></select></div>' +
          '<div class="widget-content"><div class="mt4">' +
          '<div class="widget-slide-block" id="widget-recently-added-anime">' +
          '<div id="current-left-recently-added-anime" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>' +
          '<div id="current-right-recently-added-anime" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">' +
          '<span class="btn-inner" style="display: none;"></span></div><div class="widget-slide-outer">' +
          '<ul class="widget-slide js-widget-slide recent-anime" data-slide="4" style="width: 720px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul>' +
          '</div></div></div></div></div>';

        // Get List
        let list = await getList();
        async function getList() {
          for (let x = 0; x < 5; x++) {
            const data = await getRecentlyAdded(0);
            if (data) {
              return data;
            }
            await delay(1000);
          }
          // if error
          let d = document.querySelector("#recently-added-anime > div > div.widget-header");
          if (d) {
            let e = create('span', { class: 'currently-watching-error', style: { float: "right", display: 'inline-block' } }, "API Error. Please try again.");
            let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
            r.onclick = () => {
              recentlyAddedDiv.remove();
              buildRecentlyAddedAnime();
            };
            e.append(r);
            d.append(e);
          }
        }

        if (list) {
          if (document.querySelector("#currently-reading")) {
            document.querySelector("#currently-reading").insertAdjacentElement("afterend", recentlyAddedDiv);
          } else if (document.querySelector("#currently-watching")) {
            document.querySelector("#currently-watching").insertAdjacentElement("afterend", recentlyAddedDiv);
          } else {
            document.querySelector("#content > div.left-column").prepend(recentlyAddedDiv);
          }
          buildRecentlyAddedList(list, "#widget-recently-added-anime ul");
          document.querySelector("#recently-added-anime > div > div.widget-header > i").remove();
          document.querySelector("#widget-recently-added-anime > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-recently-added-anime").classList.add("active") : "";

          let animeItemsBackup = Array.from(document.querySelectorAll('#widget-recently-added-anime ul .btn-anime'));
          document.querySelector('#widget-recently-added-anime ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-anime ul .btn-anime').length + 138 + 'px';

          //Load More Items
          const loadMoreButton = create("a", { id: "recently-added-anime-load-more" }, "Load More");
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
          slider.append(loadMoreButton);
          filterRecentlyAdded(animeItemsBackup, ['TV', 'Movie']);
          updateRecentlyAddedSliders(slider, "#current-left-recently-added-anime", "#current-right-recently-added-anime");

          loadMoreButton.addEventListener("click", async function () {
            if (loadMoreButton.innerHTML === 'Load More') {
              loadMoreButton.innerHTML = '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>';
              const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
              const selectedType = document.getElementById('typeFilter').value.split(',');
              let pageCount = document.getElementById('recently-added-anime').getAttribute('page');
              pageCount = parseInt(pageCount) + 50;
              let moreList = await getRecentlyAdded(0, pageCount);
              list = list.concat(moreList);
              $('#widget-recently-added-anime ul').html('');
              buildRecentlyAddedList(list, "#widget-recently-added-anime ul");
              document.getElementById('recently-added-anime').setAttribute('page', pageCount);
              animeItemsBackup = Array.from(document.querySelectorAll('#widget-recently-added-anime ul .btn-anime'));
              filterRecentlyAdded(animeItemsBackup, selectedType);
              updateRecentlyAddedSliders(slider, "#current-left-recently-added-anime", "#current-right-recently-added-anime");
              slider.append(loadMoreButton);
              document.querySelector('#widget-recently-added-anime ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-anime ul .btn-anime').length + 138 + 'px';
              await delay(1000);
              loadMoreButton.innerHTML = 'Load More';
              document.querySelector('#widget-recently-added-anime ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-anime ul .btn-anime').length + 138 + 'px';
            }
          });

          // Filter
          document.getElementById('typeFilter').addEventListener('change', function (e) {
            const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
            slider.style.marginLeft = 0;
            const list = document.querySelector('#widget-recently-added-anime ul');
            list.innerHTML = '';
            addAllRecentlyAdded(animeItemsBackup, list);
            const selectedType = e.target.value.split(',');
            const animeItems = Array.from(document.querySelectorAll('#widget-recently-added-anime ul .btn-anime'));
            if (selectedType[0] !== 'All') {
              filterRecentlyAdded(animeItems, selectedType);
            }
            document.querySelector('#widget-recently-added-anime ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-anime ul .btn-anime').length + 138 + 'px';
            updateRecentlyAddedSliders(slider, "#current-left-recently-added-anime", "#current-right-recently-added-anime");
            slider.append(loadMoreButton);
          });

          // Slider Left
          document.querySelector("#current-left-recently-added-anime").addEventListener("click", function () {
            const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
            const slideWidth = slider.children[0].offsetWidth + 12;
            if (parseInt(slider.style.marginLeft) < 0) {
              slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
              document.querySelector("#widget-recently-added-anime > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-recently-added-anime").classList.add("active") : "";
            }
            if (parseInt(slider.style.marginLeft) > 0) {
              slider.style.marginLeft = -slideWidth + "px";
            }
            if (parseInt(slider.style.marginLeft) === 0) {
              document.querySelector("#current-left-recently-added-anime").classList.remove("active");
            }
          });

          // Slider Right
          document.querySelector("#current-right-recently-added-anime").addEventListener("click", function () {
            const slider = document.querySelector(".widget-slide.js-widget-slide.recent-anime");
            const slideWidth = slider.children[0].offsetWidth + 12;
            if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
              slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
              document.querySelector("#current-left-recently-added-anime").classList.add("active");
            }
            if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
              document.querySelector("#current-right-recently-added-anime").classList.remove("active");
            }
          });
        }
      }
    }
  }
  //Recently Added Anime //--END--//

  //Recently Added Manga //--START--//
  if (svar.recentlyAddedManga && location.pathname === "/") {
    buildRecentlyAddedManga();

    async function buildRecentlyAddedManga() {
      let user = headerUserName;
      if (user) {
        const recentlyAddedDiv = create("article", { class: "widget-container left recently-manga", id: "recently-added-manga", page: "0" });
        recentlyAddedDiv.innerHTML =
          '<div class="widget anime_suggestions left"><div class="widget-header"><span style="float: right;"></span><h2 class="index_h2_seo">' +
          '<a href="https://myanimelist.net/manga.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1">Recently Added Manga</a>' +
          '</h2><i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>' +
          '<select style="float: right;padding: 2px !important;margin-top: -5px;" id="typeFilterManga">' +
          '<option value="All">All</option><option value="Manga" selected>Manga</option><option value="One-shot">One-shot</option>' +
          '<option value="Doujinshi">Doujinshi</option><option value="Light Novel">Light Novel</option><option value="Novel">Novel</option>' +
          '<option value="Manhwa">Manhwa</option><option value="Manhua">Manhua</option></select></div>' +
          '<div class="widget-content"><div class="mt4">' +
          '<div class="widget-slide-block" id="widget-recently-added-manga">' +
          '<div id="current-left-recently-added-manga" class="btn-widget-slide-side left" style="left: -40px; opacity: 0;"><span class="btn-inner"></span></div>' +
          '<div id="current-right-recently-added-manga" class="btn-widget-slide-side right" style="right: -40px; opacity: 0;">' +
          '<span class="btn-inner" style="display: none;"></span></div><div class="widget-slide-outer">' +
          '<ul class="widget-slide js-widget-slide recent-manga" data-slide="4" style="width: 720px; margin-left: 0px;-webkit-transition:margin-left 0.4s ease-in-out;transition:margin-left 0.4s ease-in-out"></ul>' +
          '</div></div></div></div></div>';

        // Get List
        let list = await getList();
        async function getList() {
          for (let x = 0; x < 5; x++) {
            const data = await getRecentlyAdded(1);
            if (data) {
              return data;
            }
            await delay(1000);
          }
          // if error
          let d = document.querySelector("#recently-added-anime > div > div.widget-header");
          if (d) {
            let e = create('span', { class: 'currently-watching-error', style: { float: "right", display: 'inline-block' } }, "API Error. Please try again.");
            let r = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
            r.onclick = () => {
              recentlyAddedDiv.remove();
              buildRecentlyAddedManga();
            };
            e.append(r);
            d.append(e);
          }
        }

        if (list) {
          if (document.querySelector("#recently-added-anime")) {
            document.querySelector("#recently-added-anime").insertAdjacentElement("afterend", recentlyAddedDiv);
          } else if (document.querySelector("#currently-reading")) {
            document.querySelector("#currently-reading").insertAdjacentElement("afterend", recentlyAddedDiv);
          } else if (document.querySelector("#currently-watching")) {
            document.querySelector("#currently-watching").insertAdjacentElement("afterend", recentlyAddedDiv);
          } else {
            document.querySelector("#content > div.left-column").prepend(recentlyAddedDiv);
          }
          buildRecentlyAddedList(list, "#widget-recently-added-manga ul");
          document.querySelector("#recently-added-manga > div > div.widget-header > i").remove();
          document.querySelector("#widget-recently-added-manga > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-recently-added-manga").classList.add("active") : "";

          let mangaItemsBackup = Array.from(document.querySelectorAll('#widget-recently-added-manga ul .btn-anime'));
          document.querySelector('#widget-recently-added-manga ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-manga ul .btn-anime').length + 138 + 'px';

          //Load More Items
          const loadMoreButton = create("a", { id: "recently-added-manga-load-more" }, "Load More");
          const slider = document.querySelector(".widget-slide.js-widget-slide.recent-manga");
          slider.append(loadMoreButton);
          filterRecentlyAdded(mangaItemsBackup, ['Manga']);
          updateRecentlyAddedSliders(slider, "#current-left-recently-added-manga", "#current-right-recently-added-manga");

          loadMoreButton.addEventListener("click", async function () {
            if (loadMoreButton.innerHTML === 'Load More') {
              loadMoreButton.innerHTML = '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>';
              const selectedType = document.getElementById('typeFilterManga').value.split(',');
              let pageCount = document.getElementById('recently-added-manga').getAttribute('page');
              pageCount = parseInt(pageCount) + 50;
              let moreList = await getRecentlyAdded(1, pageCount);
              list = list.concat(moreList);
              $('#widget-recently-added-manga ul').html('');
              buildRecentlyAddedList(list, "#widget-recently-added-manga ul");
              document.getElementById('recently-added-manga').setAttribute('page', pageCount);
              mangaItemsBackup = Array.from(document.querySelectorAll('#widget-recently-added-manga ul .btn-anime'));
              filterRecentlyAdded(mangaItemsBackup, selectedType);
              updateRecentlyAddedSliders(slider, "#current-left-recently-added-manga", "#current-right-recently-added-manga");
              slider.append(loadMoreButton);
              document.querySelector('#widget-recently-added-manga ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-manga ul .btn-anime').length + 138 + 'px';
              await delay(1000);
              loadMoreButton.innerHTML = 'Load More';
            }
          });

          // Filter
          document.getElementById('typeFilterManga').addEventListener('change', function (e) {
            slider.style.marginLeft = 0;
            const list = document.querySelector('#widget-recently-added-manga ul');
            list.innerHTML = '';
            addAllRecentlyAdded(mangaItemsBackup, list);
            const selectedType = e.target.value.split(',');
            const mangaItems = Array.from(document.querySelectorAll('#widget-recently-added-manga ul .btn-anime'));
            if (selectedType[0] !== 'All') {
              filterRecentlyAdded(mangaItems, selectedType);
            }
            document.querySelector('#widget-recently-added-manga ul').style.width = 138 * document.querySelectorAll('#widget-recently-added-manga ul .btn-anime').length + 138 + 'px';
            updateRecentlyAddedSliders(slider, "#current-left-recently-added-manga", "#current-right-recently-added-manga");
            slider.append(loadMoreButton);
          });

          // Slider Left
          document.querySelector("#current-left-recently-added-manga").addEventListener("click", function () {
            const slider = document.querySelector(".widget-slide.js-widget-slide.recent-manga");
            const slideWidth = slider.children[0].offsetWidth + 12;
            if (parseInt(slider.style.marginLeft) < 0) {
              slider.style.marginLeft = parseInt(slider.style.marginLeft) + slideWidth + "px";
              document.querySelector("#widget-recently-added-manga > div.widget-slide-outer > ul").children.length > 5 ? document.querySelector("#current-right-recently-added-manga").classList.add("active") : "";
            }
            if (parseInt(slider.style.marginLeft) > 0) {
              slider.style.marginLeft = -slideWidth + "px";
            }
            if (parseInt(slider.style.marginLeft) === 0) {
              document.querySelector("#current-left-recently-added-manga").classList.remove("active");
            }
          });

          // Slider Right
          document.querySelector("#current-right-recently-added-manga").addEventListener("click", function () {
            const slider = document.querySelector(".widget-slide.js-widget-slide.recent-manga");
            const slideWidth = slider.children[0].offsetWidth + 12;
            if (parseInt(slider.style.marginLeft) > -slideWidth * (slider.children.length - 5)) {
              slider.style.marginLeft = parseInt(slider.style.marginLeft) - slideWidth + "px";
              document.querySelector("#current-left-recently-added-manga").classList.add("active");
            }
            if (parseInt(slider.style.marginLeft) === -slideWidth * (slider.children.length - 5)) {
              document.querySelector("#current-right-recently-added-manga").classList.remove("active");
            }
          });
        }
      }
    }
  }
  //Recently Added Manga //--END--//

  //Seasonal Info //--START--//
  if (svar.animeInfo && location.pathname === "/") {
    //Get Seasonal Anime and add info button
    if (document.querySelector(".widget.seasonal.left")) {
      const i = document.querySelectorAll(".widget.seasonal.left .btn-anime");
      i.forEach((info) => {
        let ib = create("i", {
          class: "fa fa-info-circle",
          style: { fontFamily: '"Font Awesome 6 Pro"', position: 'absolute', right: '3px', top: '3px', padding: "4px", opacity: "0", transition: ".4s", zIndex: "20" },
        });
        info.prepend(ib);
      });

      //info button click event
      $(".widget.seasonal.left i").on('click', async function () {
        infoExit('.widget.seasonal.left', $(this));
        createInfo($(this), '.widget.seasonal.left');
      }).on('mouseleave', async function () {
        infoExit('.widget.seasonal.left', $(this));
      });
    }
  }
  //Seasonal Info //--END--//

  // Forum Hide Blocked Users //--START--//
  if (/\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href)) {
    let blockedUsers = [];
    getBlockedUsers();
    async function getBlockedUsers() {
      const html = await fetch("https://myanimelist.net/editprofile.php?go=privacy")
        .then((response) => response.text())
        .then((data) => {
          let newDocument = new DOMParser().parseFromString(data, "text/html");
          let findUser = newDocument.querySelectorAll("#content > div:nth-child(2) a[href*=profile]");
          for (let x = 0; x < findUser.length; x++) {
            blockedUsers.push(findUser[x].innerText);
          }
          removeBlockedUsers();
        });
    }
    function removeBlockedUsers() {
      //Remove Blocked User's Forum Topics
      let ForumTopic = document.querySelectorAll("#forumTopics tr[data-topic-id]");
      for (let x = 0; x < ForumTopic.length; x++) {
        for (let y = 0; y < blockedUsers.length; y++) {
          if (ForumTopic[x].children[1].children[4].innerText === blockedUsers[y]) {
            ForumTopic[x].remove();
          }
        }
      }
      //Remove Blocked User's Forum Reply
      let forumReply = document.querySelectorAll(".message-wrapper > div.profile");
      for (let x = 0; x < forumReply.length; x++) {
        for (let y = 0; y < blockedUsers.length; y++) {
          if (forumReply[x].children[0].innerText === blockedUsers[y]) {
            forumReply[x].parentElement.parentElement.remove();
          }
        }
      }
      //Remove Blocked User's Forum Reply (Conversation View)
      let forumReplyV = document.querySelectorAll(".messages.replies.parents .message");
      for (let x = 0; x < forumReplyV.length; x++) {
        if (!forumReplyV[x].getAttribute('checked')) {
          for (let y = 0; y < blockedUsers.length; y++) {
            if (forumReplyV[x].children[0].children[1].children[0].children[0].innerText === blockedUsers[y]) {
              forumReplyV[x].remove();
            }
          }
          forumReplyV[x].setAttribute('checked', 1);
        }
      }
    }
    //Conversation View - If new forum reply loaded, check blockedUsers
    if (document.querySelectorAll(" .content > div.user > div.item.update").length) {
      let target = document.querySelector(".messages.replies.parents");
      let observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          removeBlockedUsers();
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
    }
  }
  // Forum Hide Blocked Users //--End--//

  // Forum Change Date Format //--START--//
  function changeDate(d) {
    let dateData = document.querySelectorAll(".message-header > .date").length > 0 ? document.querySelectorAll(".message-header > .date") : document.querySelectorAll(".content > div.user > div.item.update");
    let lastPost = d ? d : document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4)");
    if (lastPost) {
      for (let x = 0; x < lastPost.length; x++) {
        let t = d ? lastPost[x].innerHTML : $(lastPost[x]).find('br').get(0).nextSibling.nodeValue;
        let t2 = d
          ? t.replace(/\s{2,}/g, ' ').replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)(\sby.*)/gm, '<span class ="replyDate">$1 $2</span>$3')
          : t.replace(/\s{2,}/g, ' ').replace(/(\w.*\d.*) (\d.*\:\d{2}.*\W.\w)/gm, '<span class ="replyDate">$1</span>').replace(',', ' ');
        lastPost[x].innerHTML = lastPost[x].innerHTML.replace(t, t2);
      }
    }
    let topicDate = Array.prototype.slice.call(document.querySelectorAll("#forumTopics tr[data-topic-id] .lightLink"))
      .concat(Array.prototype.slice.call(document.querySelectorAll("#forumTopics tr[data-topic-id] td:nth-child(4) span")));
    if (d) {
      topicDate = document.querySelectorAll("span.replyDate");
    }
    dateData = topicDate.length ? topicDate : dateData;
    let date, datenew;
    const timeRegex = /\d{1,2}:\d{2} [APM]{2}/;
    const yearRegex = /\b\d{4}\b/;
    for (let x = 0; x < dateData.length; x++) {
      if (!dateData[x].getAttribute('dated')) {
        date = !timeRegex.test(dateData[x].innerText) ? dateData[x].innerText + ', 00:00 AM' : dateData[x].innerText;
        datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
        date = yearRegex.test(date) ? date : date.replace(/(\,)/, ' ' + new Date().getFullYear());
        datenew ? date = dateData[x].innerText : date;
        let timestamp = new Date(date).getTime();
        const timestampSeconds = dateData[x].getAttribute('data-time') ? dateData[x].getAttribute('data-time') : Math.floor(timestamp / 1000);
        dateData[x].title = dateData[x].innerText;
        dateData[x].innerText = datenew ? date : nativeTimeElement(timestampSeconds);
        dateData[x].setAttribute('dated', 1);
      }
    }
  }
  if (svar.forumDate && location.href === 'https://myanimelist.net/forum/') {
    let replyDate = Array.prototype.slice.call(document.querySelectorAll('span.date.di-ib')).concat(Array.prototype.slice.call(document.querySelectorAll("span.information.di-ib")));
    changeDate(replyDate);
  }

  if (svar.forumDate && (/\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href))) {
    changeDate();
    if (document.querySelectorAll(".content > div.user > div.item.update").length) {
      let target = document.querySelector('.messages.replies.parents')
      let observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
          changeDate();
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
    }
  }
  // Forum Change Date Format //--END--//

  //Forum Anime-Manga Embed //--START--//
  if (svar.embed && /\/(forum)\/.?topicid([\w-]+)?\/?/.test(location.href)) {
    const embedCache = localforage.createInstance({ name: "MalJS", storeName: "embed" });
    const options = { cacheTTL: svar.embedTTL ? svar.embedTTL : 2592000000, class: "embed" };
    let acttextfix;
    let id, type, embed, imgdata, data, cached;
    //API Request
    async function fetchData(url) {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              if (response.status === 429) {
                setTimeout(() => resolve(fetchData(url)), 3000);
                return;
              }
            }
            resolve(await response.json());
          } catch (error) {
            reject(error);
          }
        }, 333);
      });
    }
    async function getEmbedData(id, type) {
      let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
      if (type === "manga") {
        apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
      }
      try {
        const cache = (await embedCache.getItem(id)) || { time: 0 };
        data = await cache;
        if (data && data.data && data.data.status) {
          if (data.data.status === "Finished Airing" || data.data.status === "Finished") {
            options.cacheTTL = 15552000000;
          } else {
            options.cacheTTL = svar.embedTTL;
          }
        }
        if (cache.time + options.cacheTTL < Date.now()) {
          data = await fetchData(apiUrl);
          if (data.status === 404) {
            return;
          }
          const publishedYear = data.data.published?.prop?.from?.year;
          const airedYear = data.data.aired?.prop?.from?.year;
          await embedCache.setItem(id, {
            data: {
              status: data.data.status,
              score: data.data.score,
              title: data.data.title,
              type: data.data.type,
              genres: data.data.genres,
              season: data.data.season,
              images: data.data.images,
              year: data.data.type !== "Anime" ? (publishedYear || airedYear || "") : (airedYear || ""),
              url: data.data.url,
            },
            time: Date.now(),
          });
          imgdata = data.data.images.jpg.image_url;
          cached = false;
        } else {
          cached = true;
          data = await cache;
          imgdata = data.data.images.jpg.image_url;
        }
        if (imgdata) {
          const publishedYear = data.data.published?.prop?.from?.year;
          const airedYear = data.data.aired?.prop?.from?.year;
          const genres = document.createElement("div");
          genres.classList.add("genres");
          genres.innerHTML = data.data.genres
            ? data.data.genres
              .filter((node) => node.name !== "Award Winning")
              .map((node) => node.name)
              .toString()
              .split(",")
              .join(", ")
            : "";
          const details = document.createElement("div");
          details.classList.add("details");
          const detailsArray = [];
          if (data.data.type) {
            detailsArray.push(data.data.type);
          }
          if (data.data.status) {
            detailsArray.push(data.data.status.split("Currently").join(""));
          }
          if (data.data.season) {
            detailsArray.push(data.data.season.charAt(0).toUpperCase() + data.data.season.slice(1));
          }
          const year = cached && data.data.year ? data.data.year :
            data.data.type !== "Anime" && publishedYear ? publishedYear :
              airedYear ? airedYear :
                data.data.type === "Anime" && airedYear ? airedYear : "";
          if (year) {
            detailsArray.push(year);
          }
          if (data.data.score) {
            detailsArray.push('<span class="score">' + " · " + Math.floor(data.data.score * 10) + "%" + "</span>");
          }
          const detailsArrayLast = detailsArray.length > 0 ? detailsArray[detailsArray.length - 1].toString() : "";
          details.innerHTML = detailsArrayLast.includes('score') ? detailsArray.slice(0, -1).join(' · ') + detailsArray.slice(-1) : detailsArray.join(' · ');
          const dat = document.createElement("div");
          dat.classList.add("embed-container");
          dat.innerHTML = '<a></a>';
          const namediv = document.createElement("div");
          namediv.classList.add("embed-inner");
          const name = document.createElement("a");
          name.innerText = data.data.title;
          name.classList.add("embed-title");
          if (data.data.type && ["Manga", "Manhwa", "Novel"].includes(data.data.type)) {
            name.style = 'color: #92d493!important;';
          }
          name.href = data.data.url;
          const historyimg = document.createElement("a");
          historyimg.classList.add("embed-image");
          historyimg.style.backgroundImage = `url(${imgdata})`;
          historyimg.href = data.data.url;
          data.data.genres.length > 0 ? (genres.style.display = "block") : dat.classList.add("no-genre");
          namediv.append(name, genres, details);
          dat.appendChild(historyimg);
          dat.appendChild(namediv);
          return dat;
        }
      } catch (error) {
        console.error("error:", error);
      }
    }
    //Load Embed
    async function embedload() {
      const forumHeader = document.querySelector("h1.forum_locheader")?.innerText;
      const headerRegex = /\w+\s\d{4}\sPreview/gm;
      const c = document.querySelectorAll(".message-wrapper > div.content").length > 0 ? document.querySelectorAll(".message-wrapper > div.content") : document.querySelectorAll(".forum.thread .message");
      for (let x = 0; x < c.length; x++) {
        let content = c[x].innerHTML;
        content = content
          .replace(/(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\.php\?id=)([0-9]+)/gm, 'https://myanimelist.net/$2/$3')
          .replace(/(<a href="\b(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\/[0-9]+))/gm, ' $1');
        let matches = content.match(/<a href="\b(http:\/\/|https:\/\/)(myanimelist\.net\/(anime|manga)\/)([0-9]+)([^"'<]+)(?=".\w)/gm);
        matches = matches ? matches.filter(link => !link.includes('/video')) : matches;
        if (matches && !headerRegex.test(forumHeader)) {
          let uniqueMatches = Array.from(new Set(matches));
          for (let i = 0; i < uniqueMatches.length; i++) {
            let match = uniqueMatches[i];
            const id = match.split("/")[4];
            const reg = new RegExp("(?<!Div\"\>)(" + match.replace(/\./g, "\\.").replace(/\//g, "\\/").replace(/\?/g, ".*?") + '".*?>[a-zA-Z0-9_ ].*?</a>)', "gms");
            if (!id.startsWith('0')) {
              const type = match.split("/")[3];
              let link = create("a", { href: match });
              let cont = create("div", { class: "embed-link", id: id, type: type });
              const embedData = await getEmbedData(id, type);
              if (embedData) {
                cont.appendChild(embedData);
                link.appendChild(cont);
                content = content.replace(reg, await DOMPurify.sanitize(cont));
              }
              if (matches.length > 4 && i % 4 === 0) {
                cached ? await delay(33) : await delay(999);
              } else {
                cached ? await delay(33) : await delay(333);
              }
            }
            c[x].innerHTML = content;
          }
          await delay(999);
        }
        if (c[x].className === "message" && !c[x].id) {
          c[x].remove();
        }
      }
    }
    embedload();
  }
  //Forum Anime-Manga Embed //--END--//

  //New Profile Comments Feature
  async function newProfileComments(profile) {
    let mainCont = profile ? $('#lastcomment') : $('#content');
    if (profile) {
      mainCont.css('max-width', '810px');
    } else {
      $('#content div:not(.borderClass):contains("Pages ")').hide();
    }
    let currPage = 1;
    let oldprofileLinkArray = [];
    let addedComCount = 0;
    const loading = create("div", { class: "user-history-loading actloading" }, "Loading" + '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>');

    function parseProfileHTML(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const section = doc.querySelector("#message")?.outerHTML;
      const match = /uid:(\d+)/.exec(section);
      return match ? match[1] : null;
    }

    async function getProfileId(profileUrl) {
      try {
        const response = await fetch(profileUrl);
        const html = await response.text();
        return parseProfileHTML(html);
      } catch (error) {
        console.error(`Error: ${error}`);
        return null;
      }
    }

    async function getNextComments(url) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc;
      } catch (error) {
        console.error(`Error: ${error}`);
        return null;
      }
    }

    async function fetchAndUpdateComments(element, url, newCommentsContainer, append = false) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const comments = Array.from(doc.querySelectorAll('div[id^=comBox] > table > tbody > tr')).reverse();
        let sender = $(doc).find("div[id^=com] > .dark_text a").last()[0];
        let receiver = doc.querySelector("#content > div.borderClass.com-box-header a:last-child");
        receiver.innerText = '@' + receiver.innerText.replace("'s Profile", "");
        let isNameMatch = receiver.innerText !== '@' + sender.innerText ? 0 : 1;
        comments.forEach((comment, index) => {
          $(comment).find('.picSurround').addClass('image').find('img').css('height', '55px');
          if (!append && index === 0) {
            if (!isNameMatch) {
              $(comment).find('.spaceit').prepend(receiver, '<br>');
            }
            if (profile) {
              $(comment).find('div[id^=com]').first().css({ display: 'inline-block', width: 'calc(100% - 100px)' });
              $(comment).find('.picSurround').css({ display: 'inline-block' });
            }
            element.innerHTML = comment.innerHTML;
          } else {
            newCommentsContainer.appendChild(comment.cloneNode(true));
          }
        });

        // Create a “Load More” button if there is a “Prev” link
        const prevLink = $(doc).find('a:contains("Prev")').attr('href');
        if (prevLink) {
          await createLoadMoreButton(prevLink, newCommentsContainer, element, 'child');
        }
        return comments.length;
      } catch (error) {
        console.error(`Could not retrieve comments: ${error}`);
      }
    }

    // Create a button to hide/show comments
    async function createToggleButton(newCommentsContainer, commentsCount) {
      if (commentsCount > 1) {
        const commCount = commentsCount - 1 === 29 ? '29+' : commentsCount - 1;
        const buttonDiv = create("div", { class: "newCommentsCommentButton" });
        const buttonLabel = create("span", { class: "commentButtonLabel" }, commCount);
        const button = create("a", { class: "commentButton fa fa-comment", style: { paddingRight: '5px', cursor: 'pointer' } });
        buttonDiv.append(button, buttonLabel);
        button.addEventListener('click', () => {
          newCommentsContainer.style.display = newCommentsContainer.style.display === "none" ? "inline-block" : "none";
        });
        return buttonDiv;
      }
    }

    // Create load more button
    function createLoadMoreButton(url, newCommentsContainer, element, className) {
      let loadMoreButton = newCommentsContainer.querySelector(".newCommentsLoadMoreButton." + className);
      if (loadMoreButton) return;
      loadMoreButton = create("a", { class: "newCommentsLoadMoreButton " + className }, "Load More");
      loadMoreButton.addEventListener('click', async () => {
        mainCont.append(loading);
        loadMoreButton.disabled = true;
        loadMoreButton.textContent = "Loading...";
        if (element) {
          await fetchAndUpdateComments(element, url, newCommentsContainer, true);
        } else {
          const doc = await getNextComments(url);
          if (doc) comToCom(url, doc);
        }
        loadMoreButton.disabled = false;
        loadMoreButton.remove();
      });
      newCommentsContainer.appendChild(loadMoreButton);
      if(profile) mainCont.append($('a.btn-form-submit:contains("All Comments")').parent());
    }

    // Main
    async function comToCom(url, doc) {
      url = url.replace(/&*show=\d*/g, "");
      const idIndex = url.indexOf('id=');
      let mainDelay = 500;
      if (idIndex === -1) return;
      const baseUrl = '/comtocom.php?id1=' + url.substring(idIndex + 3) + '&id2=';
      let isProfilePage = document.location.href.includes('profile');
      $('div[id^=comBox]').not('.newCommentsContainerMain').css('display', 'none');
      if (doc) {
        let els = doc.querySelectorAll('div[id^=comBox]');
        for (const el of els) {
          el.style.display = 'none';
          mainCont.append(el, (profile ? $('a.btn-form-submit:contains("All Comments")').parent() : $('div[style="text-align: right;"]')));
        }
      }
      let elements = isProfilePage ? document.querySelectorAll('div[id^=comBox]') : document.querySelectorAll('div[id^=comBox] > table > tbody > tr');
      for (const el of elements) {
        if (!el.getAttribute('comActive')) {
          mainDelay = 500;
          let profileLink = isProfilePage ? el.querySelector('.image')?.href : el.querySelector('.picSurround > a')?.href;
          if (doc && profile) {
            profileLink = el.querySelector('.picSurround > a')?.href;
          }
          const elParent = profile ? $(el) : $(el).parent().parent().parent();
          elParent.css('display', 'none');
          if (!profileLink) continue;
          if (oldprofileLinkArray.indexOf(profileLink) === -1) {
            oldprofileLinkArray.push(profileLink);
            const profileId = await getProfileId(profileLink);
            if (!profileId) continue;
            const commentsUrl = `${baseUrl}${profileId}&last=1`;
            const linkButton = create("a", { class: 'newCommentsLinkButton fa fa-link', href: commentsUrl, target:"_blank" });
            const newCommentsContainer = create("div", { class: "newCommentsContainer", style: { display: 'none', width: '100%' } });
            const commentsCount = await fetchAndUpdateComments(el, commentsUrl, newCommentsContainer);
            const toggleButton = await createToggleButton(newCommentsContainer, commentsCount);
            if (profile) elParent.addClass('comment-profile');
            if (toggleButton) {
              elParent.prepend(linkButton),
                elParent.append(toggleButton, newCommentsContainer);
            }
            mainCont.append(loading);
            elParent.find('div[id^=com]').first().css('min-height', '55px');
            elParent.addClass('comment newCommentsContainerMain');
            addedComCount++;
          } else {
            mainCont.children().remove('br');
            elParent.remove();
            mainDelay = 50;
          }
          el.setAttribute('comActive', '1');
          elParent.css('display', '');
          await delay(mainDelay);
        }
      }
      loading.remove();
      currPage += 1;
      let nextPage = $(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr('href');
      if (doc) {
        nextPage = $(doc).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr('href');
      } else if (currPage === 2 && profile) {
        let profileCount = await getNextComments(url);
        nextPage = $(profileCount).find(`div[style="text-align: right;"] > a:contains(${currPage})`)?.attr('href');
      }
      if (nextPage) {
        await createLoadMoreButton(nextPage, mainCont[0], null, 'parent');
      }
      if ($('.newCommentsLoadMoreButton.parent')[0]) {
        if (addedComCount < 6) {
          $('.newCommentsLoadMoreButton.parent')[0].style.display = "none";
          $('.newCommentsLoadMoreButton.parent')[0].click();
        } else {
          $('.newCommentsLoadMoreButton.parent')[0].style.display = "block";
          loading.remove();
          addedComCount = 0;
        }
      }
    }
    let comcomUrl = profile ? $('a:contains("All Comments")')?.attr('href') : location.href;
    let checkComBox = document.querySelectorAll('div[id^=comBox]');
    if (comcomUrl && checkComBox.length > 0) comToCom(comcomUrl);
  }

  if (svar.newComments && location.href.includes('https://myanimelist.net/comments.php')) {
    newProfileComments();
  }

  //Profile Section //--START--//
  if (/\/(profile)\/.?([\w]+)?\/?/.test(current)) {
    addLoading("add", `Loading ${username}'s Profile`, 1, 1);
    if (svar.profileNewComments && isMainProfilePage) {
      newProfileComments(1);
    }
    if ($('.comment-form').text().trim() === `You must be friends with ${username} to comment on their profile.`) {
      const profileComID = $('a:contains("Report")').last().attr('href').split('&')[2];
      $('.comment-form').append(`<br><a href=https://myanimelist.net/comments.php?${profileComID}>All Comments</a>`);
    }
    let banner = create('div', { class: 'banner', id: 'banner', });
    let shadow = create('div', { class: 'banner', id: 'shadow', });
    let container = create("div", { class: "container", id: "container" });
    let customfg, custombg, custompf, customCSS, custombadge, customcolors, userimg, customModernLayoutFounded, privateProfile, malBadgesUrl;
    let profileRegex = {
      malClean: /(malcleansettings)\/([^"\/])/gm,
      fg: /(customfg)\/([^"\/]+)/gm,
      bg: /(custombg)\/([^"\/]+)/gm,
      pf: /(custompf)\/([^"\/]+)/gm,
      css: /(customCSS)\/([^"\/]+)/gm,
      badge: /(custombadge)\/([^"\/]+)/gm,
      malBadges: /(malBadges)\/([^"\/]+)/gm,
      colors: /(customcolors)\/([^"\/]+)/gm,
      favSongEntry: /(favSongEntry)\/([^\/]+.)/gm,
      privateProfile: /(privateProfile)\/([^"\/]+)/gm,
      hideProfileEl: /(hideProfileEl)\/([^"\/]+)/gm,
      customProfileEl: /(customProfileEl)\/([^"\/]+)/gm,
      moreFavs: /(moreFavs)\/([^\/]+.)/gm,
    };

    //Block User
    let blockU = create("i", { class: "fa fa-ban mt4 ml12 blockUserIcon" });
    blockU.onclick = () => {
      blockUser(username);
    }
    $(".user-friends.pt4.pb12").prev().addBack().wrapAll("<div id='user-friends-div'></div>");
    $(".user-badges").prev().addBack().wrapAll("<div id='user-badges-div'></div>");
    $(".user-profile-sns").has('a:contains("Recent")').prev().addBack().wrapAll("<div id='user-rss-feed-div'></div>");
    $('.user-profile-sns:not(:contains("Recent"))').prev().addBack().wrapAll("<div id='user-links-div'></div>");
    $('.user-button').attr('id', 'user-button-div');
    $('.user-status:contains(Joined)').last().attr('id', 'user-status-div');
    $('.user-status:contains(History)').attr('id', 'user-status-history-div');
    $('.user-status:contains(Forum Posts)').attr('id', 'user-status-counts-div');
    $('.user-statistics-stats').first().attr('id', 'user-stats-div');
    $('.user-statistics-stats').last().attr('id', 'user-updates-div');
    //Wait for user image
    async function imgLoad() {
      userimg = document.querySelector('.user-image.mb8 > img');
      set(0, userimg, { sa: { 0: "position: fixed;opacity:0!important;" } });

      if (userimg && userimg.src) {
        set(0, userimg, { sa: { 0: "position: relative;opacity:1!important;" } });
      }
      else if (!document.querySelector(".btn-detail-add-picture.nolink")) {
        await delay(250);
        await imgLoad();
      }
    }

    async function startCustomProfile() {
      await imgLoad();
      await findCustomAbout();
      await applyAl();

      if (svar.profileHeader && !svar.modernLayout) {
        let title = document.querySelector('#contentWrapper h1');
        title.setAttribute('style', 'padding-left: 2px;margin-bottom:5px');
        let table = document.querySelector('.container-right');
        if (table) {
          table.prepend(title);
        }
      }
      if (!svar.modernLayout) {
        customProfileElUpdateButton.textContent = "Add";
        customProfileElUpdateButton.style.width = "98%";
        customProfileElRightUpdateButton.style.display = "none";
      } else {
        if (svar.profileAnimeGenre && isMainProfilePage) {
          await getUserGenres(0, 1);
        }
        if (svar.profileMangaGenre && isMainProfilePage) {
          await getUserGenres(1, 1);
        }
        if (svar.moveBadges) {
          $('#user-button-div').after($('#user-badges-div'));
          $('#user-badges-div').after($('#user-mal-badges'));
          if ($('#user-badges-div').next().is('ul')) {
            $('#user-badges-div').css('margin-bottom', '12px');
          }
        }
      }
      await delay(1000);
      addLoading("forceRemove");
    }

    //Add Block User Button
    if (isMainProfilePage && userNotHeaderUser && headerUserName !== '' && headerUserName !== 'MALnewbie') {
      $("a.header-right").after(blockU);
    }
    shadow.setAttribute('style', 'background: linear-gradient(180deg,rgba(6,13,34,0) 40%,rgba(6,13,34,.6));height: 100%;left: 0;position: absolute;top: 0;width: 100%;');
    banner.append(shadow);
    await startCustomProfile();

    if ($('title').text() === '404 Not Found - MyAnimeList.net\n') {
      addLoading("remove");
    }

    async function buildCustomElements(data) {
      let parts = data.split("/");
      let favarray = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "customProfileEl") {
          if (i + 1 < parts.length) {
            const base64 = parts[i + 1].replace(/_/g, "/");
            const lzbase64 = LZString.decompressFromBase64(base64);
            let dec = JSON.parse(lzbase64);
            favarray.push(dec);
          }
        }
      }

      let mainGroup = create("div", { id: "custom-el-group" });
      let customElContent = create("div", { class: "customProfileEls", id: "customProfileEls" });
      let customElContentRight = create("div", { class: "customProfileEls right", id: "customProfileEls" });
      let sortItem1 = null;
      let sortItem2 = null;
      if (svar.modernLayout) {
        const appendLoc = document.querySelector("#user-button-div");
        appendLoc.insertAdjacentElement("afterend", customElContent);
      } else {
        $(".user-comments").before(customElContent);
        $(customElContent).css({ marginBottom: '30px', width: '813px' });
        mainGroup.classList.add("flex2x");
      }
      $(".user-comments").before(customElContentRight);

      favarray.forEach((arr, index) => {
        arr.forEach((item) => {
          const isRight = item.isRight ? 1 : 0;
          const customElContainer = create("div", { class: "custom-el-container" });
          if (isRight) customElContainer.classList.add('right');
          customElContainer.innerHTML = `
          <div class="fa fa-pen editCustomEl" order="${index}" title="Edit"></div>
          <div class="fa fa-sort sortCustomEl" order="${index}" title="Sort"></div>
          <div class="fa fa-x removeCustomEl" order="${index}" title="Remove"></div>
          ${isRight && svar.modernLayout ?
              `<h4 class="custom-el-header" style="border: 0;margin: 15px 0 4px 4px;">${item.header}</h4>`
              :
              `<h5 class="custom-el-header" style="${svar.modernLayout ? 'font-size: 11px; margin: 0 0 8px 2px;' : ''}">${item.header}</h5>`
            }
          <div class="${svar.modernLayout ? 'custom-el-inner' : 'custom-el-inner notAl'}">${item.content}</div>
          `;
          if (isRight) {
            customElContentRight.appendChild(customElContainer);
            if (svar.alstyle && !defaultMal) {
              $(".user-comments").css('top', '-50px');
            }
          } else {
            customElContent.appendChild(customElContainer);
          }
        });
      });
      customElContent.append(mainGroup);

      //Sort Custom Element click function
      document.querySelectorAll('.sortCustomEl').forEach(element => {
        element.addEventListener('click', function () {
          const order = this.getAttribute('order');
          if (sortItem1 === null) {
            sortItem1 = order;
            $('.sortCustomEl').addClass('hidden');
            $(this).addClass('selected');
            $(this).parent().parent().children('.custom-el-container').children('.sortCustomEl').removeClass('hidden');
            $(this).parent().parent().children('.custom-el-container').children('.sortCustomEl').show();
          } else if (sortItem2 === null) {
            sortItem2 = order;
            if (sortItem2 !== sortItem1) {
              replaceCustomEls();
            }
            $(this).parent().parent().children('.custom-el-container').children('.sortCustomEl').hide();
            $('.sortCustomEl').removeClass('hidden').removeClass('selected');
          }
          if (sortItem1 === sortItem2) {
            sortItem1 = null;
            sortItem2 = null;
          }

          function replaceCustomEls() {
            const sortItem1compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem1]));
            const sortItem1base64url = sortItem1compressedBase64.replace(/\//g, "_");
            const sortItem2compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem2]));
            const sortItem2base64url = sortItem2compressedBase64.replace(/\//g, "_");
            editAboutPopup([sortItem1base64url, sortItem2base64url], "replaceCustomEl");
            sortItem1 = null;
            sortItem2 = null;
          }
        });
      });
      //Edit Custom Element click function -not-tested
      $(".editCustomEl").on("click", function () {
        const appLoc = $(this).parent()[0];
        const header = $(this).nextUntil('.custom-el-header').next('.custom-el-header').text();
        const content = $(this).nextUntil('.custom-el-inner').next('.custom-el-inner').html();
        const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
        const base64url = compressedBase64.replace(/\//g, "_");
        const editData = `customProfileEl/${base64url}`;
        createCustomDiv(appLoc, header, content, editData);
      });

      //Remove Custom Element click function
      $(".removeCustomEl").on("click", function () {
        const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
        const base64url = compressedBase64.replace(/\//g, "_");
        editAboutPopup(`customProfileEl/${base64url}/`, "removeCustomEl");
      });

      if (userNotHeaderUser) {
        $(".sortCustomEl").remove();
        $(".editCustomEl").remove();
        $(".removeCustomEl").remove();
      }
    }

    //Fav Theme Songs
    async function buildFavSongs(data) {
      let parts = data.split("/");
      let favarray = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "favSongEntry") {
          if (i + 1 < parts.length) {
            const base64 = parts[i + 1].replace(/_/g, "/");
            const lzbase64 = LZString.decompressFromBase64(base64);
            let dec = JSON.parse(lzbase64);
            favarray.push(dec);
          }
        }
      }

      let opGroup = create("div", { id: "op-group" });
      let edGroup = create("div", { id: "ed-group" });
      let FavContent = create("div", { class: "favThemes", id: "favThemes" });
      let sortItem1 = null;
      let sortItem2 = null;
      if (svar.modernLayout) {
        $(FavContent).insertBefore($("#content > div > div.container-left > div li.icon-statistics.link").parent());

      } else {
        $("#content > div > div.container-right > h2").nextUntil(".user-comments").wrapAll("<div class='favContainer' id='user-def-favs'></div>");
        $(".user-comments").before(FavContent);
        $(FavContent).css({ marginBottom: '30px', width: '813px', display: 'inline-block'});
        opGroup.classList.add("flex2x");
        edGroup.classList.add("flex2x");
      }

      if (customCSS && customCSS.constructor === Array && customCSS[1] || customCSS && customCSS.constructor !== Array || svar.modernLayout) {
        const favbg = document.createElement('style');
        favbg.textContent = `.favThemes .fav-theme-container {background: var(--color-foreground);}`;
        document.head.appendChild(favbg);
      }

      favarray.forEach((arr, index) => {
        arr.forEach((item) => {
          const favSongContainer = create("div", { class: "fav-theme-container", type: item.themeType });
          favSongContainer.innerHTML = `
            <div class="fa fa-sort sortFavSong"order=${index} title="Sort"></div>
            <div class="fa fa-x removeFavSong" order=${index} title="Remove"></div>
            <div class="fav-theme-inner">
            <a href='https://myanimelist.net/anime/${item.animeUrl}/'>
            ${`<img src="${item.animeImage ? item.animeImage : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c"}" class="anime-image" alt="${item.animeTitle}">`}</a>
            <div class="fav-theme-header">
            <h2>${item.animeTitle}</h2>
            <a class="favThemeSongTitle" style="cursor:pointer">${item.songTitle.replace(/(\(eps \d.*\))/, '')}</a>
            </div></div>
            <div class="video-container">
            <video controls>
            <source src="${item.songSource}" type="video/webm">
            Your browser does not support the video tag.
            </video>
            </div>
            `;
          FavContent.appendChild(favSongContainer);
        });
      });

      FavContent.append(opGroup, edGroup);

      const favThemes = document.querySelector(".favThemes");
      const animeContainers = favThemes.querySelectorAll(".fav-theme-container");

      animeContainers.forEach((container) => {
        const type = container.getAttribute("type");
        if (type === "OP") {
          opGroup.appendChild(container);
          if ($(opGroup).children().length === 1) {
            $(opGroup).before(`<h5>Openings</h5>`);
          }
        } else if (type === "ED") {
          edGroup.appendChild(container);
        }
        if ($(edGroup).children().length === 1) {
          $(edGroup).before(`<h5>Endings</h5>`);
        }
      });
      function toggleShowMore(groupSelector) {
        let limit = svar.modernLayout ? 5 : 6;
        const accordionButton = create('a', { class: 'anisong-accordion-button', id: `${groupSelector}-accordion-button`, style: { display: "none" } }, '<i class="fas fa-chevron-down mr4"></i>\nShow More\n');
        if ($(`#${groupSelector}-accordion-button`).length === 0) {
          $(`#${groupSelector}`).append(accordionButton);
        }

        if ($(`#${groupSelector} .fav-theme-container`).length > limit) {
          $(`#${groupSelector} .fav-theme-container`).slice(limit).hide();
          $(`#${groupSelector}-accordion-button`).show();
        }
        $(`#${groupSelector}-accordion-button`).on('click', function () {
          var isVisible = $(`#${groupSelector} .fav-theme-container`).slice(limit).is(":visible");
          if (isVisible) {
            $(`#${groupSelector} .fav-theme-container`).slice(limit).slideUp();
            $(this).html('<i class="fas fa-chevron-down mr4"></i> Show More');
          } else {
            $(`#${groupSelector} .fav-theme-container`).slice(limit).slideDown();
            $(this).html('<i class="fas fa-chevron-up mr4"></i> Show Less');
          }
        });
      }
      toggleShowMore("op-group");
      toggleShowMore("ed-group");
      //Sort Favorite Song click function
      document.querySelectorAll('.sortFavSong').forEach(element => {
        element.addEventListener('click', function () {
          const order = this.getAttribute('order');
          if (sortItem1 === null) {
            sortItem1 = order;
            $('.sortFavSong').addClass('hidden');
            $(this).addClass('selected');
            $(this).parent().parent().children('.fav-theme-container').children('.sortFavSong').removeClass('hidden');
            $(this).parent().parent().children('.fav-theme-container').children('.sortFavSong').show();
          } else if (sortItem2 === null) {
            sortItem2 = order;
            if (sortItem2 !== sortItem1) {
              replaceFavSongs();
            }
            $(this).parent().parent().children('.fav-theme-container').children('.sortFavSong').hide();
            $('.sortFavSong').removeClass('hidden').removeClass('selected');
          }
          if (sortItem1 === sortItem2) {
            sortItem1 = null;
            sortItem2 = null;
          }

          function replaceFavSongs() {
            const sortItem1compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem1]));
            const sortItem1base64url = sortItem1compressedBase64.replace(/\//g, "_");
            const sortItem2compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[sortItem2]));
            const sortItem2base64url = sortItem2compressedBase64.replace(/\//g, "_");
            editAboutPopup([sortItem1base64url, sortItem2base64url], "replaceFavSong");
            sortItem1 = null;
            sortItem2 = null;
          }
        });
      });
      //Remove Favorite Song click function
      $(".removeFavSong").on("click", function () {
        const compressedBase64 = LZString.compressToBase64(JSON.stringify(favarray[$(this).attr("order")]));
        const base64url = compressedBase64.replace(/\//g, "_");
        editAboutPopup(`favSongEntry/${base64url}/`, "removeFavSong");
      });

      //Favorite Song Title click function
      $(".favThemeSongTitle").on("click", function () {
        if (!svar.modernLayout) {
          const title = $(this).prev();
          title.css("white-space", title.css("white-space") === "nowrap" || title.css("white-space") === "nowrap" ? "normal" : "nowrap");
          $(this).css("white-space", $(this).css("white-space") === "nowrap" || $(this).css("white-space") === "nowrap" ? "normal" : "nowrap");
        }
        const videoContainer = $(this).parent().parent().parent().children(".video-container");
        const currentDisplay = videoContainer.css("display");
        videoContainer.css("display", currentDisplay === "none" || currentDisplay === "" ? "block" : "none");
      });
      if (userNotHeaderUser) {
        $(".sortFavSong").remove();
        $(".removeFavSong").remove();
      }
    }

    //Get Custom Banner and Custom Profile Image Data from About Section
    async function findCustomAbout() {
      const aboutSection = document.querySelector('.user-profile-about.js-truncate-outer');
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
          const pfData = pfMatch[0].replace(profileRegex.pf, '$2');
          if (pfData !== '...') {
            let pfBase64Url = pfData.replace(/_/g, "/");
            custompf = JSON.parse(LZString.decompressFromBase64(pfBase64Url));
            document.querySelector('.user-image.mb8 > img').setAttribute('src', custompf);
          }
        }
        if (bgMatch) {
          const bgData = bgMatch[0].replace(profileRegex.bg, '$2');
          if (bgData !== '...') {
            let bgBase64Url = bgData.replace(/_/g, "/");
            custombg = JSON.parse(LZString.decompressFromBase64(bgBase64Url));
            banner.setAttribute(
              'style',
              `background-color: var(--color-foreground); background: url(${custombg}); background-position: 50% 35%; background-repeat: no-repeat; background-size: cover; height: 330px; position: relative;`
            );
            customModernLayoutFounded = 1;
          }
        }
        if (badgeMatch) {
          const badgeData = badgeMatch[0].replace(profileRegex.badge, '$2');
          if (badgeData !== '...') {
            let badgeBase64Url = badgeData.replace(/_/g, "/");
            custombadge = JSON.parse(LZString.decompressFromBase64(badgeBase64Url));
            const badgeDiv = create('div', { class: 'maljsProfileBadge', });
            badgeDiv.innerHTML = custombadge[0];
            if (custombadge[1] === 'loop') {
              $(badgeDiv).addClass('rainbow');
            } else {
              badgeDiv.style.background = custombadge[1];
            }
            container.append(badgeDiv);
            customModernLayoutFounded = 1;
          }
        }
        if (cssMatch) {
          const cssData = cssMatch[0].replace(profileRegex.css, '$2');
          if (cssData !== '...') {
            let cssBase64Url = cssData.replace(/_/g, "/");
            customCSS = JSON.parse(LZString.decompressFromBase64(cssBase64Url));
          }
        }
        if (customModernLayoutFounded && !svar.autoModernLayout) {
          svar.modernLayout = true;
        }
        if (customCSS && customCSS.constructor === Array && !customCSS[1] || customCSS && customCSS.constructor !== Array ||
            !svar.modernLayout && customModernLayoutFounded && svar.autoModernLayout) {
          svar.modernLayout = false;
        }
        if (colorMatch) {
          const colorData = colorMatch[0].replace(profileRegex.colors, '$2');
          if (colorData !== '...') {
            let colorBase64Url = colorData.replace(/_/g, "/");
            customcolors = JSON.parse(LZString.decompressFromBase64(colorBase64Url));
            await applyCustomColors(customcolors);
          }
        }
        if (privateProfileMatch) {
          const privateData = privateProfileMatch[0].replace(profileRegex.privateProfile, '$2');
          if (privateData !== '...') {
            let privateBase64Url = privateData.replace(/_/g, "/");
            privateProfile = JSON.parse(LZString.decompressFromBase64(privateBase64Url));
            privateButton.classList.toggle('btn-active-def', privateProfile);
            applyPrivateProfile();
          } else {
            removePrivateButton.classList.toggle('btn-active-def', 1);
          }
        }
        if (hideProfileElMatch) {
          const hideProfileElData = hideProfileElMatch[0].replace(profileRegex.hideProfileEl, '$2');
          if (hideProfileElData !== '...') {
            let profileElBase64Url = hideProfileElData.replace(/_/g, "/");
            hiddenProfileElements = JSON.parse(LZString.decompressFromBase64(profileElBase64Url));
            applyHiddenDivs();
          }
        }
        if (moreFavsMatch) {
          const moreFavsData = moreFavsMatch[0].replace(profileRegex.moreFavs, '$2');
          if (moreFavsData !== '...') {
            let moreFavsDecompressed = moreFavsData.replace(/_/g, "/");
            moreFavsDecompressed = JSON.parse(LZString.decompressFromBase64(moreFavsDecompressed));
            const animanga = Object.values(moreFavsDecompressed.moreFavs_anime_manga);
            const character = Object.values(moreFavsDecompressed.moreFavs_character);
            if (!userNotHeaderUser) {
              if (svar.moreFavsMode) {
                await replaceLocalForageDB("moreFavs_anime_manga", animanga);
                await replaceLocalForageDB("moreFavs_character", character);
              }
            } else {
              await loadMoreFavs(1, "anime_manga", animanga);
              await loadMoreFavs(1, "character", character);
            }
          }
        }
        if (fgMatch) {
          const fgData = fgMatch[0].replace(profileRegex.fg, '$2');
          if (fgData !== '...') {
            let fgBase64Url = fgData.replace(/_/g, "/");
            customfg = JSON.parse(LZString.decompressFromBase64(fgBase64Url));
            await changeForeground(customfg);
          }
        }
        if (malBadgesMatch) {
          const malBadgesData = malBadgesMatch[0].replace(profileRegex.malBadges, '$2');
          if (malBadgesData !== '...' && isMainProfilePage) {
            let malBadgesBase64Url = malBadgesData.replace(/_/g, "/");
            malBadgesUrl = JSON.parse(LZString.decompressFromBase64(malBadgesBase64Url));
            if (malBadgesUrl) malBadgesUrl += malBadgesUrl.endsWith('?detail') ? '&malbadges' : '?malbadges';
            await getMalBadges(malBadgesUrl);
          }
        }
        if (favSongMatch) {
          if (isMainProfilePage) {
            await buildFavSongs(aboutContent)
          }
        }
        if (customElMatch) {
          if (isMainProfilePage) {
            await buildCustomElements(aboutContent)
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

    //Apply Modern Profile Layout
    async function applyAl() {
      if (svar.customCSS) {
        findcss();
        function findcss() {
          let customCSSData, customCSSAl;
          if (customCSS && customCSS.constructor === Array) {
            customCSSData = customCSS[0];
            customCSSAl = customCSS[1];
          } else {
            customCSSData = customCSS;
          }
          if (customCSS) {
            if (!customCSSAl) {
              const malscss = document.createElement('style');
              malscss.textContent = `#currently-popup, .malCleanMainHeader, .malCleanMainContainer {background:#121212!important;}`;
              document.head.appendChild(malscss);
              $('style:contains(--fg:)').html('');
            }
            styleSheet3.innerText = styles3;
            document.getElementsByTagName("head")[0].appendChild(styleSheet3);
            styleSheet.innerText = styles;
            document.getElementsByTagName("head")[0].appendChild(styleSheet);
            getdata();
            function getdata() {
              let css = document.createElement('style');
              if (customCSSData.match(/^https.*\.css$/)) {
                let cssLink = document.createElement("link");
                cssLink.rel = "stylesheet";
                cssLink.type = "text/css";
                cssLink.href = customCSS;
                document.getElementsByTagName("head")[0].appendChild(cssLink);
              }
              else {
                if (customCSSData.length < 1e6) {
                  css.innerText = customCSSData;
                  document.getElementsByTagName("head")[0].appendChild(css);
                }
              }
            }
          }
        }
      }
      if (svar.modernLayout) {
        //CSS Fix for Modern Profile Layout
        let fixstyle = `
        .page-common #horiznav_nav.profile-nav > ul > li > a:not(.navactive){color: var(--color-main-text-light)!important;background:0!important}
        .page-common #horiznav_nav.profile-nav > ul > li > a.navactive,.page-common #horiznav_nav.profile-nav > ul > li > a:hover{color:  var(--color-link)!important;background:0!important}
        .maljsNavBtn{background: var(--color-foreground);border-radius: 5px;cursor: pointer;display: inline-block;padding: 10px!important;text-align: center;}
        .maljsProfileBadge{background: var(--color-foreground);-webkit-border-radius: 4px;border-radius: 5px;color: #e9e9e9;font-weight:600;
        display: inline-block;margin-left: 10px;padding: 10px;text-align: center;-webkit-transition: .3s;-o-transition: .3s;transition: .3s;position: absolute;
        bottom: 60px;right: -56px;max-width: 300px;max-height: 150px;overflow: hidden;}
        .maljsProfileBadge > * {width: auto; height: auto}
        .rainbow{-webkit-animation-duration: 20s;animation-duration: 20s;-webkit-animation-iteration-count: infinite;animation-iteration-count: infinite;
        -webkit-animation-name: rainbow;animation-name: rainbow;-webkit-animation-timing-function: ease-in-out;animation-timing-function: ease-in-out;cursor: default;}
        @keyframes rainbow{0%{background:rgb(0 105 255 / .71)}10%{background:rgb(100 0 255 / .71)}20%{background:rgb(255 0 139 / .71)}30%{background:rgb(255 0 0 / .71)}
        40%{background:rgb(255 96 0 / .71)}50%{background:rgb(202 255 0 / .71)}60%{background:rgb(0 255 139 / .71)}70%{background:rgb(202 255 0 / .71)}
        80%{background:rgb(255 96 0 / .71)}85%{background:rgb(255 0 0 / .71)}90%{background:rgb(255 0 139 / .71)}95%{background:rgb(100 0 255 / .71)}to{background:rgb(0 105 255 / .71)}}
        .l-listitem-3_2_items{margin-right:0}
        .l-listitem-list.row1{margin-right: 0px;margin-left: -46px}
        .l-listitem-list.row2{margin-left: 24px;}
        .l-listitem .c-aboutme-ttl-lv2{max-width: 420px;}
        .l-ranking-list_portrait-item{flex-basis: 66px;}
        .l-ranking-list_circle-item{flex-basis: 70px;}
        div#modern-about-me-expand-button,.c-aboutme-accordion-btn-icon{display:none}
        #banner a.header-right.mt4.mr0{z-index: 2;position: relative;margin: 60px 10px 0px !important;}
        #banner div i.fa.fa-ban{margin: 60px 0px 0px !important;position: relative;}
        .loadmore,.actloading,.listLoading {font-size: .8rem;font-weight: 700;padding: 14px;text-align: center;}
        .loadmore {cursor: pointer;background: var(--color-foreground);border-radius: var(--border-radius);margin-bottom: 25px;z-index: 2;position: relative;}
        #headerSmall + #menu {width:auto!important}
        .profile .user-profile-about.js-truncate-outer{border:var(--border) solid var(--border-color);}
        .profile .btn-truncate.js-btn-truncate.open {padding-bottom:0!important}
        .profile-about-user.js-truncate-inner img,.user-comments .comment .text .comment-text .userimg{-webkit-box-shadow:none!important;box-shadow:none!important}
        .user-profile .user-friends {display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: start;-webkit-justify-content: start;-ms-flex-pack: start;justify-content: start}
        .user-profile .user-friends .icon-friend {margin: 5px!important;}
        .favs {-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;border: var(--border) solid var(--border-color);box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
        display: -ms-grid !important;background-color: var(--color-foreground);padding: 10px;display: grid !important;grid-gap: 15px 5px !important;grid-template-columns: repeat(auto-fill, 70px) !important;
        -webkit-border-radius: var(--br);border-radius: var(--br);-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;margin-bottom:12px}
        .word-break img, .dark-mode .profile .user-profile-about .userimg, .profile .user-profile-about .userimg,
        .profile .user-profile-about a .userimg,.profile .user-profile-about .userimg.img-a-r {max-width: 100%;-webkit-box-shadow: none!important;box-shadow: none!important;}
        .profile .user-profile-about .quotetext{margin-left:0px;max-width:100%}
        .profile .user-profile-about iframe {max-width:100%}
        .profile .user-profile-about input.button {white-space: break-spaces;}
        #modern-about-me-inner {overflow:hidden}
         #modern-about-me-inner > *, #modern-about-me-inner .l-mainvisual {max-width:420px!important}
        .l-listitem-list-item {-webkit-flex-basis: 64px;flex-basis: 64px;-ms-flex-preferred-size: 64px;}
        .l-listitem-5_5_items {margin-right: -25px;}
        .user-history-title{width: 80%;-webkit-align-self: center;-ms-flex-item-align: center;-ms-grid-row-align: center;align-self: center;}
        .user-history-date{width:25%;text-align: right;}
        .user-history-cover-link{margin-left: -10px;height: 70px;width:50px;margin-top: -10px;margin-right: 10px;padding-right: 5px;}
        .user-history-cover{background-size:cover;height: 70px;width:50px;object-fit: cover;
        -webkit-border-top-right-radius: 0 !important;border-top-right-radius: 0 !important;-webkit-border-bottom-right-radius: 0 !important;border-bottom-right-radius: 0 !important;}
        .user-history {height: 50px;background-color: var(--color-foreground);margin: 10px 5px;padding: 10px;border:var(--border) solid var(--border-color);
        -webkit-border-radius: var(--br);border-radius: var(--br);display: -webkit-box;display: -webkit-flex;
        display: -ms-flexbox;display: flex;-webkit-box-pack: justify;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;overflow: hidden;}
        #horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}
        .dark-mode .page-common #horiznav_nav ul li,.page-common #horiznav_nav ul li {background: 0 !important}
        .favTooltip {border: var(--border) solid var(--border-color);-webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
        z-index:2;text-indent:0;-webkit-transition:.4s;-o-transition:.4s;transition:.4s;position: absolute;background-color: var(--color-foreground4);color: var(--color-text);
        padding: 5px;-webkit-border-radius: 6px;border-radius: 6px;opacity:0;width: -webkit-max-content;width: -moz-max-content;width: max-content;left: 0;right: 0;margin: auto;max-width: 420px;}
        .user-profile {width:auto!important}
        .favs .btn-fav, .user-badge, .icon-friend {overflow:hidden}
        .favs .btn-fav:hover, .user-badge:hover, .icon-friend:hover {overflow:visible!important}
        .favs .btn-fav:hover .favTooltip,.user-badge:hover .favTooltip, .icon-friend:hover .favTooltip{opacity:1}
        .user-profile .user-badges .user-badge:hover,.user-profile .user-friends .icon-friend:hover,.user-profile .user-friends .icon-friend:active{opacity:1!important}
        .dark-mode .user-profile .user-badges .user-badge,.user-profile .user-badges .user-badge {${defaultMal ? 'margin:2px!important' : 'margin: 4px!important'}}
        .max{max-height:99999px!important}`;
        var fixstylesheet = document.createElement('style');
        fixstylesheet.innerText = fixstyle.replace(/\n/g, '');
        document.head.appendChild(fixstylesheet);
        document.body.style.setProperty('background', 'var(--color-background)', 'important');
        document.body.style.setProperty('--color-foreground', 'var(--color-foregroundOP)', 'important');
        document.body.style.setProperty('--color-foreground2', 'var(--color-foregroundOP2)', 'important');

        //Get Activity History from MAL and Cover Image from Jikan API
        if (svar.actHistory) {
          const titleImageMap = {};
          let historyMain = create("div", { class: "user-history-main", id: "user-history-div" });
          if (document.querySelector("#statistics")) {
            document.querySelector("#statistics").insertAdjacentElement("beforeend", historyMain);
          }
          async function gethistory(l, item) {
            let title, titleText, ep, date, datenew, id, url, type, historylink, historyimg, oldimg;
            let wait = 666;
            let c = l ? l - 12 : 0;
            let length = l ? l : 12;
            let head = create("h2", { class: "mt16" }, "Activity");
            const loading = create(
              "div",
              { class: "user-history-loading actloading" },
              "Loading" + '<i class="fa fa-circle-o-notch fa-spin malCleanLoader"></i>'
            );
            if (!l) {
              const html = await fetch("https://myanimelist.net/history/" + username)
                .then((response) => response.text())
                .then(async (data) => {
                  let newDocument = new DOMParser().parseFromString(data, "text/html");
                  item = newDocument.querySelectorAll("#content > div.history_content_wrapper > table > tbody > tr > td.borderClass:first-child");
                });
            }

            length = item.length < length ? item.length : length;
            historyMain.insertAdjacentElement("afterend", loading);

            for (let x = c; x < length; x++) {
              if (x === 0) {
                head.style.marginLeft = "5px";
                historyMain.appendChild(head);
              }
              type = item[x].querySelector("a").href.split(".")[1].split("/")[1];
              url = item[x].querySelector("a").href;
              id = item[x].querySelector("a").href.split("=")[1];
              title = item[x].querySelector("a").outerHTML;
              titleText = item[x].querySelector("a").innerText.trim();
              ep = item[x].querySelector("strong").innerText;
              date = item[x].parentElement.children[1].innerText.split("Edit").join("");
              datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
              date = datenew ? date : /\b\d{4}\b/.test(date) ? date : date + " " + new Date().getFullYear();
              let dat = create("div", { class: "user-history" });
              let name = create("div", { class: "user-history-title" });
              let timestamp = new Date(date).getTime();
              const timestampSeconds = Math.floor(timestamp / 1000);
              let historydate = create("div", { class: "user-history-date", title: date }, datenew ? date : nativeTimeElement(timestampSeconds));
              let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
              if (type === "anime") {
                name.innerHTML = "Watched episode " + ep + " of " + '<a href="' + url + '">' + title + "</a>";
              } else {
                apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
                name.innerHTML = "Read chapter " + ep + " of " + '<a href="' + url + '">' + title + "</a>";
              }

              // Image retrieval function
              async function getimg(url) {
                await fetch(apiUrl)
                  .then((response) => response.json())
                  .then((data) => {
                    oldimg = data.data?.images ? data.data.images.jpg.image_url : "https://cdn.myanimelist.net/r/42x62/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c";
                    titleImageMap[title] = oldimg; // Map the title to the image
                  });
              }

              // Check if the title already exists in the map
              if (titleImageMap[title]) {
                oldimg = titleImageMap[title];
                historylink = create("a", { class: "user-history-cover-link", href: url, });
                historyimg = create("img", { class: "user-history-cover", alt: titleText, src: oldimg, });
                wait = 99; // If already exists, reduce wait time
              } else {
                wait = 999; // If new title, increase wait time
                await getimg(url);
                historylink = create("a", { class: "user-history-cover-link", href: url, });
                historyimg = create("img", { class: "user-history-cover", alt: titleText, src: oldimg, });
              }
              historylink.append(historyimg);
              dat.append(historylink, name);
              dat.append(historydate);
              historyMain.appendChild(dat);
              await loadCustomCover(1);
              await delay(wait);
            }
            loading.remove();
            if (item.length > length) {
              let loadmore = create("div", { class: "loadmore" }, "Load More");
              loadmore.onclick = () => {
                gethistory(length + 12, item);
                loadmore.remove();
              };
              historyMain.appendChild(loadmore);
            }
          }
          if (document.querySelector('#statistics')) {
            gethistory();
          }
        }
        //Modern Profile Layout
        let about = document.querySelector(".user-profile-about.js-truncate-outer");
        let modernabout = document.querySelector("#modern-about-me");
        let avatar = document.querySelector(".user-image");
        let name = $('span:contains("s Profile"):first');
        let headerRight = document.querySelector("a.header-right.mt4.mr0");
        container.setAttribute("style", "margin: 0 auto;min-width: 320px;max-width: 1240px;left: -40px;position: relative;height: 100%;");
        if (!custombg) {
          banner.setAttribute("style", "background-color: var(--color-foreground);background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;");
        } else {
          if (svar.headerOpacity) {
            const headerSmall = document.getElementById('headerSmall');
            headerSmall.style.backgroundColor = 'var(--fgo)!important';
            headerSmall.addEventListener('mouseenter', () => {
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              if (scrollTop === 0) {
                headerSmall.style.backgroundColor = '';
              }
            });
            banner.addEventListener('mouseenter', () => {
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              if (scrollTop === 0) {
                headerSmall.style.backgroundColor = 'var(--fgo)!important';
              }
            });
          }
        }
        document.querySelector("#myanimelist").setAttribute("style", "min-width: 1240px;width:100%");
        set(1, "#myanimelist .wrapper", { sa: { 0: "width:100%;display:table" } });
        document.querySelector("#contentWrapper").insertAdjacentElement("beforebegin", banner);
        banner.append(container);
        headerRight ? banner.prepend(headerRight) : null;
        $('.header-right:contains("Profile Settings")').remove();
        if (isMainProfilePage && userNotHeaderUser && headerUserName !== '' && headerUserName !== 'MALnewbie') {
          $(headerRight).wrapAll("<div class='profileRightActions'></div>").after(blockU);
        }
        container.append(avatar);
        about ? about.classList.add("max") : null;
        modernabout ? modernabout.classList.add("max") : null;
        if (set(0, about, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
          document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", about);
        }
        if (set(0, modernabout, { sa: { 0: "margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);" } })) {
          document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement("beforebegin", modernabout);
          let l = document.querySelectorAll(".l-listitem");
          let a = "max-width:420px";
          set(2, ".l-listitem", { sal: { 0: "-webkit-box-pack: center;display: flex;-ms-flex-pack: center;justify-content: center;flex-wrap: wrap;flex-direction: row;" } });
          set(1, ".l-mainvisual", { sa: { 0: a } });
          set(1, ".intro-mylinks-wrap", { sa: { 0: a } });
          set(1, ".l-intro", { sa: { 0: a } });
          set(1, ".l-intro-text-wrap-1", { sa: { 0: a } });
          set(1, ".copy-wrap-1", { sa: { 0: a } });
          set(1, ".mylinks-ul", { sa: { 0: a } });
        }
        if (about || modernabout) {
          if (set(1, ".user-profile h1:first-child", { sa: { 0: "position: absolute;top: 50px;right: 0;" } })) {
            banner.append(document.querySelector(".user-profile h1:first-child"));
          }
          $('a:contains("About Me Design"):last').remove();
        }
        set(1, ".user-image img", { sa: { 0: "display: inline-block;max-height: 230px;max-width: 160px;width: 100%;box-shadow:none!important" } });
        set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
        document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
        set(1, ".user-statistics-stats.mt16", { sa: { 0: "margin-top:8px!important" } });
        $('.user-statistics-stats .stats.manga h5').addClass('mb12');
        set(1, ".user-image .btn-detail-add-picture", { sa: { 0: "display: flex;flex-direction: column;justify-content: center;" } });
        document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
        avatar.setAttribute("style", "display: flex;height: inherit;align-items: flex-end;position: relative;width:500px;");
        name.css({ "font-size": "2rem", "font-weight": "800", left: "35px", top: "-35px", color: 'var(--color-main-text-op)', opacity: '.93' });
        name.html(name.html().replace(/'s Profile/g, "\n"));
        avatar.append(name[0]);
        set(2, "#container span.profile-team-title.js-profile-team-title", { sl: { top: "18px" } });
        container.append(document.querySelector(".user-function.mb8"));

        if (username === headerUserName) {
          $(".user-function.mb8").addClass('display-none');
        }
        $(".user-function.mb8").children('.icon-gift').remove();
        $(".user-function.mb8").children('.icon-comment').remove();
        $(".user-function.mb8").children('.icon-request').addClass('maljsNavBtn');
        $(".user-function.mb8").children('.icon-message').addClass('maljsNavBtn');
        $(".user-function.mb8").children('.icon-remove').addClass('maljsNavBtn');
        if ($(".user-function.mb8").attr('class') === 'user-function mb8 display-none' && $(".maljsProfileBadge").length) {
          $(".maljsProfileBadge").css({ bottom: "35px", });
        }

        set(1, "a.btn-profile-submit.fl-l", { sa: { 0: "width:49.5%" } });
        set(1, "a.btn-profile-submit.fl-r", { sa: { 0: "width:49.5%" } });

        if (set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } })) {
          set(1, ".user-profile-about.js-truncate-outer .btn-truncate.js-btn-truncate", { sa: { 0: "display:none" } });
        }
        if (set(1, ".bar-outer.anime", { sa: { 0: "width:100%" } })) {
          set(1, ".bar-outer.manga", { sa: { 0: "width:100%" } });
        }
        set(1, ".user-function.mb8", { sa: { 0: "position: relative;left: 96.5%;top: -60px;display: flex;width: 100px;font-size: 1rem;justify-content: flex-end;gap: 6px;" } });
        set(2, ".user-function.mb8 a", { sal: { 0: "border:none!important;box-shadow:none!important" } });
        set(2, ".user-function.mb8 span", { sal: { 0: "border:none!important;box-shadow:none!important" } });

        if (set(1, ".content-container", { sa: { 0: "display: grid!important;grid-template-columns: 33% auto;margin-top: 20px;justify-content: center;" } })) {
          set(1, ".container-left", { sa: { 0: "width:auto" } });
          set(1, ".container-right", { sa: { 0: "width:auto;min-width:800px" } });
        }

        if (set(1, "#content > table > tbody > tr > td.profile_leftcell", { sa: { 0: "width:auto" } })) {
          set(1, "#content > table > tbody > tr", { sa: { 0: "display: grid!important;grid-template-columns: 33% auto;margin-top: 10px;justify-content: center;" } });
          set(1, "#content > table > tbody > tr > td.pl8", { sa: { 0: "width: auto;position:relative;min-width:800px" } });
        }
        set(1, ".user-profile", { sa: { 0: "width:auto;" } });
        set(2, ".user-profile li", { sal: { 0: "width:auto" } });
        set(1, ".quotetext", { sa: { 0: "margin-left:0;" } });
        if ($(".head-config").next().is(".boxlist-container.badge")) {
          $(".head-config").remove();
        }
        $("#contentWrapper > div:nth-child(2) > h1").remove();
        set(1, "#content > table > tbody > tr > td.pl8 > #horiznav_nav", { r: { 0: 0 } });
        set(1, ".container-right #horiznav_nav", { r: { 0: 0 } });
        document.querySelector("#contentWrapper")
          .setAttribute("style", "width: 1375px;max-width: 1375px!important;min-width:500px; margin: auto;top: -40px;transition:.6s;opacity:1;top: -40px!important;border:0!important;box-shadow:none!important");
        let more = document.querySelector(".btn-truncate.js-btn-truncate");
        if (more) {
          more.setAttribute("data-height", '{"outer":1000,"inner":90000}');
        }
        let s = document.querySelector("#statistics");
        if (s) {
          let mangaStats = document.querySelector("#statistics .stats.manga");
          let mangaUpdates = document.querySelector("#statistics .updates.manga");
          let animeStats = document.querySelector("#statistics .stats.anime");
          let animeUpdates = document.querySelector("#statistics .updates.anime");
          s.setAttribute("style", "width: 813px");
          s.children[1].append(mangaStats);
          s.children[2].prepend(animeUpdates);
          s.prepend(document.querySelector("#statistics > div:nth-child(2)"));
          document.querySelector(".container-right").prepend(s);
          $('h2:contains("Statistics"):last').remove();

          // if anime & manga stats empty - Remove
          if (animeStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00' && mangaStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00') {
            document.querySelector("#statistics").remove();
          }
          else {
            // if manga stats empty - Remove
            if (mangaStats && mangaStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00') {
              mangaStats.remove();
              mangaUpdates.remove();
              if (animeStats && animeStats.children[1].innerText !== 'Days: 0.0\tMean Score: 0.00') {
                animeStats.parentElement.appendChild(animeUpdates);
              }
            }
            // if anime stats empty - Remove
            if (animeStats && animeStats.children[1].innerText === 'Days: 0.0\tMean Score: 0.00') {
              animeStats.remove();
              animeUpdates.remove();
              if (mangaStats.parentElement && mangaStats.children[1].innerText !== 'Days: 0.0\tMean Score: 0.00') {
                mangaStats.parentElement.appendChild(mangaUpdates);
              }
            }
          }
        }
        //Favorites
        if ($('.user-button.clearfix.mb12').length) {
          let favs = create("div", { class: "favs anime" });
          let favs2 = create("div", { class: "favs manga" });
          let favs3 = create("div", { class: "favs character" });
          let favs4 = create("div", { class: "favs people" });
          let favs5 = create("div", { class: "favs company" });
          $('.user-button.clearfix.mb12').after(favs, favs2, favs3, favs4, favs5);
          getfavs();
          function getfavs() {
            let favc = ["#anime_favorites", "#manga_favorites", "#character_favorites", "#person_favorites", "#company_favorites"];
            let fave = [favs, favs2, favs3, favs4, favs5];
            let f, c;
            for (let l = 0; l < 5; l++) {
              f = document.querySelector(favc[l]);
              if (!f) {
                fave[l].remove();
              } else {
                fave[l].insertAdjacentElement("beforebegin", f.previousElementSibling);
                c = document.querySelectorAll(favc[l] + " ul > li");
                for (let x = 0; x < c.length; x++) {
                  let r = c[x].querySelectorAll("span");
                  for (let y = 0; y < r.length; y++) {
                    r[y].remove();
                  }
                  c[x].setAttribute("style", "width:70px");
                  fave[l].append(c[x]);
                }
                f.remove();
              }
            }
          }
        }
        $('.favs').each(function (index) { $(this).prev().addBack().wrapAll("<div class='user-favs' id='fav-" + index + "-div'></div>"); });
        let userFavs = document.querySelectorAll("li.btn-fav");
        let userBadges = document.querySelectorAll(".user-badge");
        let userFriends = document.querySelectorAll(".icon-friend");
        let collection = Array.from(userFavs).concat(Array.from(userBadges), Array.from(userFriends));
        for (let btnFav of collection) {
          btnFav.tagName === "A" ? btnFav.innerText = "" : "";
          btnFav.style.position = "relative";
          btnFav.style.display = "flex";
          btnFav.style.justifyContent = "center";
          if (btnFav.attributes.title) {
            btnFav.setAttribute("data-title", btnFav.attributes.title.textContent);
            btnFav.removeAttribute("title");
          }
          let title = btnFav.getAttribute("data-title");
          if (title) {
            let tt = document.createElement("div");
            tt.className = "favTooltip";
            tt.textContent = title;
            btnFav.prepend(tt);
            btnFav.tagName === "A" || btnFav.classList[0] && btnFav.classList[0] === "user-badge" ? tt.style.marginTop = "-5px" : "";
            tt.style.top = -tt.offsetHeight - 4 + "px";
          }
        };
        if (document.querySelector(".container-right > h2.mb12")) {
          document.querySelector(".container-right > h2.mb12").remove();
        }
        if (!$('.profile .user-profile').length && $('#content > table > tbody > tr > td.profile_leftcell').length) {
          document.querySelector("#content > table > tbody > tr > td.profile_leftcell").classList.add('profile');
        }
        set(1, ".container-right > .btn-favmore", { r: { 0: 0 } });
        set(2, ".profile .user-profile h5", { sal: { 0: "font-size: 11px;margin-bottom: 8px;margin-left: 2px;" } });
        set(2, ".container-left h4", { sal: { 0: "font-size: 11px;margin-left: 2px;" } });
        //Remove Favorite Count
        const favHeader = document.querySelectorAll('.profile .user-profile .user-favs h5');
        for (let i = 0; i < favHeader.length; i++) {
          favHeader[i].innerText = favHeader[i].innerText.replace(/ \(\d+\)/, '');
        }
        set(1, ".favs", { sap: { 0: "box-shadow: none!important;" } });

        //Add Navbar to Profile Banner
        let nav = create("div", { class: "navbar", id: "navbar" });
        nav.innerHTML =
          '<div id="horiznav_nav" class="profile-nav" style="margin: 0;height: 45px;align-content: center;"><ul>' +
          '<li><a href="/profile/' + username + '">Overview</a></li><li><a href="/profile/' + username + '/statistics">Statistics</a></li>' +
          '<li><a href="/profile/' + username + '/favorites">Favorites</a></li><li><a href="/profile/' + username + '/reviews">Reviews</a></li>' +
          '<li><a href="/profile/' + username + '/recommendations">Recommendations</a></li><li><a href="/profile/' + username + '/stacks">Interest Stacks</a></li><li><a href="/profile/' + username + '/clubs">Clubs</a></li>' +
          '<li><a href="/profile/' + username + '/badges">Badges</a></li><li><a href="/profile/' + username + '/friends">Friends</a></li></ul></div>';
        banner.insertAdjacentElement('afterend', nav);
        nav.setAttribute('style', 'z-index: 3;position: relative;background: #000;text-align: center;background-color: var(--color-foreground) !important;');
        let navel = document.querySelectorAll('#navbar #horiznav_nav > ul > li > a');
        $('h2:contains("Synopsis"):last').parent().addClass('SynopsisDiv');
        let n = current.split('/')[3];
        if (!n) {
          $(navel[0]).addClass('navactive');
        } else {
          n = n.charAt(0).toUpperCase() + n.slice(1);
          $('.navbar a:contains(' + n + ')').addClass('navactive');
        }
        set(0, navel, { sal: { 0: "margin: 0 30px;font-size: .9rem;box-shadow: none!important;" } });
      }
    }
    //Private Profile Check
    async function applyPrivateProfile() {
      if (privateProfile && userNotHeaderUser) {
        await delay(200);
        $('#banner').hide();
        $('#content').hide();
        $('#navbar').hide();
        addLoading("add", "Private Profile", 0, 1);
      }
    }
    //Modern Profile Layout Anime and Manga List //-START-//
    let contLeft = $(".container-left").length ? $(".container-left") : $("#content > table > tbody > tr td[valign='top']:nth-child(1)");
    let contRight = $(".container-right").length ? $(".container-right") : $("#content > table > tbody > tr td[valign='top']:nth-child(2)");
    if (svar.replaceList) {
      //Anime List Button
      const animeListButton = document.querySelector("a.btn-profile-submit.fl-l");
      if (animeListButton) {
        animeListButton.href = "javascript:void(0);";
        animeListButton.onclick = async () => {
          $(contLeft).children().hide();
          $(contRight).children().hide();
          $(".fav-slide-block.mb12").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
          getAnimeList();
        };
      };
      //Manga List Button
      const mangaListButton = document.querySelector("a.btn-profile-submit.fl-r");
      if (mangaListButton) {
        mangaListButton.href = "javascript:void(0);";
        mangaListButton.onclick = async () => {
          $(contLeft).children().hide();
          $(contRight).children().hide();
          $(".fav-slide-block.mb12").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").hide();
          $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").hide();
          getAnimeList("manga");
        };
      };
    }
    let isManga = null;
    // Function to create a single entry row
    function createEntryRow(animeData) {
      // Find or create the section for the current status
      let section = document.getElementById(`status-section-${animeData.status}`);
      if (!section) {
        // If section doesn't exist, create a new section
        section = document.createElement('div');
        section.id = `status-section-${animeData.status}`;
        section.className = 'status-section';
        const statusTextMap = {
          1: (isManga ? 'Reading' : 'Watching'),
          2: 'Completed',
          3: 'Paused',
          4: 'Dropped',
          6: 'Planning'
        };
        // Create the section header
        const sectionHeader = document.createElement('h3');
        sectionHeader.className = 'section-name';
        sectionHeader.textContent = `${statusTextMap[animeData.status]}`;
        section.appendChild(sectionHeader);

        // Create the list head row
        const listHeadRow = document.createElement('div');
        listHeadRow.className = 'list-head row';

        // Create and append columns for the list head
        ['title', 'score', 'progress', 'type'].forEach((colName) => {
          const colDiv = document.createElement('div');
          colDiv.className = colName;
          colDiv.textContent = colName.charAt(0).toUpperCase() + colName.slice(1);
          listHeadRow.appendChild(colDiv);
        });
        // Append list head row to the section
        section.appendChild(listHeadRow);
        // Append the new section to the parent container
        document.querySelector('.list-entries').appendChild(section);
      }
      const entryRow = create('div', { class: 'entry row' });
      const coverDiv = create('div', { class: 'cover' });
      const imageDiv = create('img', {class: 'image lazyload', alt: animeData.title, src: animeData.imageUrl});
      if (animeData.airingStatus == 1 && svar.listAiringStatus) {
        const airingDot = create('span', { class: 'airing-dot' });
        coverDiv.append(airingDot);
      }
      const editDiv = create('div', { class: 'edit fa-pen', id: animeData.id });
      editDiv.onclick = async () => {
        isManga ? await editPopup(editDiv.id, 'manga') : await editPopup(editDiv.id)
      };
      coverDiv.append(imageDiv, editDiv);
      // Create the title div
      const titleDiv = create('div', { class: 'title' });
      const titleLink = create('a', { class: 'title-link', href: animeData.href, style: { maxWidth: '450px' } }, animeData.title);
      titleDiv.appendChild(titleLink);
      if (animeData.notes) {
        const titleNote = create('div', { class: 'user-note' });
        const titleNoteIcon = create('span', { class: 'title-note fa-sticky-note' });
        const titleNoteInner = create('div', { class: 'title-note-inner' });
        titleNoteInner.innerHTML = animeData.notes;
        titleNote.append(titleNoteIcon, titleNoteInner);
        $(titleNoteIcon).attr('style', 'font-family:"FontAwesome"!important');
        $(titleNote).appendTo(titleDiv);
      }
      // Create the score div
      const scoreDiv = create('div', { class: 'score' }, animeData.score);
      // Create the progress div
      const progressDiv = create('div', { class: 'progress' }, animeData.progress + (animeData.progressEnd ? '/' + animeData.progressEnd : ''));
      // Create the format div
      const formatDiv = create('div', { class: 'format' }, animeData.format);
      // Append all child elements to the entry row
      entryRow.appendChild(coverDiv);
      entryRow.appendChild(titleDiv);
      entryRow.appendChild(scoreDiv);
      entryRow.appendChild(progressDiv);
      entryRow.appendChild(formatDiv);
      section.appendChild(entryRow);
      entryRow.setAttribute("genres", animeData.genres ? JSON.stringify(animeData.genres) : "");
      entryRow.setAttribute("season", animeData.season ? JSON.stringify(animeData.season) : "0");
      entryRow.setAttribute("tags", animeData.tags ? animeData.tags : "");
      entryRow.setAttribute("startDate", animeData.startDate ? animeData.startDate : "");
      entryRow.setAttribute("finishDate", animeData.finishDate ? animeData.finishDate : "");
      entryRow.setAttribute("createdAt", animeData.createdAt ? JSON.stringify(animeData.createdAt) : "");
      entryRow.setAttribute("updatedAt", animeData.updatedAt ? JSON.stringify(animeData.updatedAt) : "");
      entryRow.setAttribute("progress", animeData.progress ? JSON.stringify(animeData.progress) : "0");
      if(isManga) entryRow.setAttribute("mangaYear", animeData.mangaYear ? JSON.stringify(animeData.mangaYear) : "");
    }
    async function fetchWithTimeout(url, timeout = 10000) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Fetch request was aborted');
        } else {
          console.error('Fetch error:', error);
        }
        throw error;
      }
    }
    async function fetchWithRetry(url, timeout = 15000, retries = 5) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await fetchWithTimeout(url, timeout);
        } catch (error) {
          if (attempt < retries) {
            $(".listLoading").html(`Retrying (${attempt}/${retries})... <i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>`);
            console.log(`Retrying (${attempt}/${retries})...`);
            await new Promise(res => setTimeout(res, 1000));
          } else {
            throw error;
          }
        }
      }
    }

    async function fetchAndCombineData() {
      let offset = 0;
      let allData = [];
      while (true) {
        try {
          const response = await fetchWithRetry(`https://myanimelist.net/${isManga ? ('mangalist/' + username) : ('animelist/' + username)}/load.json?offset=${offset}&status=7`);
          const data = await response.json();
          if (data.length === 0) {
            break;
          }
          allData = allData.concat(data);
          offset += 300;
        } catch (error) {
          console.error("Fetch error:", error);
          break;
        }
      }
      return allData;
    }

    async function getAnimeList(type) {
      let animeDataList = [];
      isManga = type;
      const fetchUrl = isManga ? "https://myanimelist.net/mangalist/" + username + "?status=7" : "https://myanimelist.net/animelist/" + username + "?status=7";
      const listLoading = create("div", {
        class: "listLoading",
        style: { position: "absolute", top: "100%", left: "0", right: "0", fontSize: "16px" },
      },
        "Loading" + '<i class="fa fa-circle-o-notch fa-spin" style="top:2px; position:relative;margin-left:5px;font-family:FontAwesome"></i>');
      const listEntries = create('div', { class: 'list-entries' });
      contRight.append(listLoading, listEntries);
      const html = await fetchAndCombineData().then(async allData => {
        let list = allData;
        if (list) {
          for (let x = 0; x < list.length; x++) {
            if (isManga) {
              animeDataList.push({
                id: list[x].manga_id,
                genres: list[x].genres,
                tags: list[x].tags,
                imageUrl: list[x].manga_image_path,
                href: list[x].manga_url,
                title: list[x].manga_title,
                score: list[x].score,
                mangaYear: parseDate(list[x].manga_start_date_string, 1),
                airingStatus: list[x].manga_publishing_status,
                startDate: list[x].start_date_string,
                finishDate: list[x].finish_date_string,
                progress: list[x].num_read_chapters,
                progressEnd: list[x].manga_num_chapters,
                createdAt: list[x].created_at,
                updatedAt: list[x].updated_at,
                status: list[x].status,
                format: list[x].manga_media_type_string,
                notes: list[x].editable_notes
              });
            } else {
              animeDataList.push({
                id: list[x].anime_id,
                genres: list[x].genres,
                tags: list[x].tags,
                season: list[x].anime_season,
                imageUrl: list[x].anime_image_path,
                href: list[x].anime_url,
                title: list[x].anime_title,
                score: list[x].score,
                airingStatus: list[x].anime_airing_status,
                startDate: list[x].start_date_string,
                finishDate: list[x].finish_date_string,
                progress: list[x].num_watched_episodes,
                progressEnd: list[x].anime_num_episodes,
                createdAt: list[x].created_at,
                updatedAt: list[x].updated_at,
                status: list[x].status,
                format: list[x].anime_media_type_string,
                notes: list[x].editable_notes
              });
            }
          }
          loadCustomCover(1);
        }
      })

      animeDataList.sort((a, b) => b.score - a.score);
      animeDataList.forEach(animeData => createEntryRow(animeData));
      const container = contRight.find('.list-entries');
      const divs = Array.from(container.find('.status-section'));
      divs.sort((a, b) => a.id.localeCompare(b.id));
      divs.forEach(div => container.append(div));
      $('.loadmore').hide();
      listLoading.remove();

      if (svar.modernLayout) {
        $('.content-container').css('grid-template-columns', '26% auto');
        contRight.css('min-width', '900px');
        const contentDiv = document.querySelector("#content > div") ? document.querySelector("#content > div") : document.querySelector("#content > table > tbody > tr");
        if (contentDiv.className !== '') {
          contentDiv.style.marginTop = "50px";
        } else {
          contentDiv.style.marginTop = "25px";
        }
      } else if (document.querySelector("#contentWrapper > div > h1.h1")) {
        document.querySelector("#contentWrapper > div > h1.h1").style.marginBottom = "25px";
      } else if (svar.profileHeader && document.querySelector("#contentWrapper > div")) {
        document.querySelector("#contentWrapper > div").style.marginBottom = "25px";
      }

      //List Filter
      const listFilter = create('div', { id: 'filter' });
      listFilter.innerHTML = '<label for="filter-input"></label><input type="text" id="filter-input" placeholder="Filter"><h3>Lists</h3>';
      const goBack = create('a', { class: 'filterLists-back fa fa-arrow-left' });
      goBack.onclick = () => {
        if (svar.modernLayout) {
          $('.content-container').css('grid-template-columns', '33% auto');
          contRight.css('min-width', '800px');
        }
        contLeft.children().show();
        contRight.children().show();
        $('.loadmore').show();
        $(".fav-slide-block.mb12").show();
        $("#content > div > div.container-right > div.favmore > h5:nth-child(1)").show();
        $("#content > div > div.container-right > div.favmore > h5:nth-child(3)").show();

        if (svar.modernLayout) {
          const contentDiv = document.querySelector("#content > div") ? document.querySelector("#content > div") : document.querySelector("#content > table > tbody > tr");
          if (contentDiv.className !== '') {
            contentDiv.style.marginTop = "20px";
          } else {
            contentDiv.style.marginTop = "10px";
          }
        } else if (document.querySelector("#contentWrapper > div > h1.h1")) {
          document.querySelector("#contentWrapper > div > h1.h1").style.marginBottom = "0";
        } else if (svar.profileHeader && document.querySelector("#contentWrapper > div")) {
          document.querySelector("#contentWrapper > div").style.marginBottom = "0";
        }

        contLeft.find("#filter").remove();
        contLeft.find(".listCheck-footer").remove();
        contRight.find(".list-entries").remove();
      };
      $(listFilter).prepend(goBack);
      $(listFilter).prepend($('<h3>', { text: isManga ? 'Manga List' : 'Anime List', css: { marginTop: 0 } }));
      const a_all = create('a', { class: 'filterLists' }, "All");
      a_all.onclick = () => { hideOtherSections("all") };
      const a_watching = create('a', { class: 'filterLists' }, (isManga ? "Reading" : "Watching"));
      a_watching.onclick = () => { hideOtherSections("status-section-1") };
      const a_completed = create('a', { class: 'filterLists' }, "Completed");
      a_completed.onclick = () => { hideOtherSections("status-section-2") };
      const a_planning = create('a', { class: 'filterLists' }, "Planning");
      a_planning.onclick = () => { hideOtherSections("status-section-6") };
      const a_paused = create('a', { class: 'filterLists' }, "Paused");
      a_paused.onclick = () => { hideOtherSections("status-section-3") };
      const a_dropped = create('a', { class: 'filterLists' }, "Dropped");
      a_dropped.onclick = () => { hideOtherSections("status-section-4") };
      const listsDiv = create('div', { class: 'filterListsDiv' });
      listsDiv.append(a_all, a_watching, a_completed, a_planning, a_paused, a_dropped);
      const listCount = create('div', { class: 'filterListsCount' });
      listCount.innerHTML = "(" + document.querySelectorAll(".entry.row").length + ")" + '<br>' +
        "(" + document.querySelectorAll("#status-section-1 .entry.row").length + ")" + '<br>' +
        "(" + document.querySelectorAll("#status-section-2 .entry.row").length + ")" + '<br>' +
        "(" + document.querySelectorAll("#status-section-6 .entry.row").length + ")" + '<br>' +
        "(" + document.querySelectorAll("#status-section-3 .entry.row").length + ")" + '<br>' +
        "(" + document.querySelectorAll("#status-section-4 .entry.row").length + ")";
      function hideOtherSections(sectionName) {
        let sections = document.querySelectorAll('.status-section');
        sections.forEach(function (section) {
          if (sectionName === 'all') {
            section.style.display = 'block';
          } else if (section.id !== sectionName) {
            section.style.display = 'none';
          }
          else {
            section.style.display = 'block';
          }
        });
      }

      const listsDivContainer = create('div', { class: 'filterListsDivContainer' });
      listsDivContainer.append(listsDiv, listCount);
      listFilter.append(listsDivContainer);
      contLeft.append(listFilter);
      document.getElementById('filter-input').addEventListener('input', function () {
        var filterValue = this.value.toLowerCase();
        var entries = document.querySelectorAll('.entry');
        entries.forEach(function (entry) {
          var titleText = entry.querySelector('.title a').textContent.toLowerCase();
          if (titleText.includes(filterValue)) {
            entry.classList.remove('hidden');
          } else {
            entry.classList.add('hidden');
          }
        });
      });

      //Genres Filter
      const genresFilter = create('div', { class: 'filterList_GenresFilter' });
      genresFilter.innerHTML = '<button class="genreDropBtn">Select Genres</button><div class="maljs-dropdown-content" id="maljs-dropdown-content">' +
        '<label><input type="checkbox" class="genre-filter" value="1" title="Action"> Action</label><label><input type="checkbox" class="genre-filter" value="2" title="Adventure">Adventure</label>' +
        '<label><input type="checkbox" class="genre-filter" value="5" title="Avant Garde"> Avant Garde</label><label><input type="checkbox" class="genre-filter" value="46" title="Award Winning"> Award Winning</label>' +
        '<label><input type="checkbox" class="genre-filter" value="28" title="Boys Love"> Boys Love</label>' + '<label><input type="checkbox" class="genre-filter" value="4" title="Comedy"> Comedy</label>' +
        '<label><input type="checkbox" class="genre-filter" value="8" title="Drama"> Drama</label><label><input type="checkbox" class="genre-filter" value="9" title="Ecchi"> Ecchi</label>' +
        '<label><input type="checkbox" class="genre-filter" value="10" title="Fantasy"> Fantasy</label><label><input type="checkbox" class="genre-filter" value="12" title="Hentai"> Hentai</label>' +
        '<label><input type="checkbox" class="genre-filter" value="26" title="Girls Love"> Girls Love</label><label><input type="checkbox" class="genre-filter" value="47" title="Gourmet"> Gourmet</label>' +
        '<label><input type="checkbox" class="genre-filter" value="14" title="Horror"> Horror</label><label><input type="checkbox" class="genre-filter" value="7" title="Mystery"> Mystery</label>' +
        '<label><input type="checkbox" class="genre-filter" value="22" title="Romance"> Romance</label><label><input type="checkbox" class="genre-filter" value="24" title="Sci-Fi"> Sci-Fi</label>' +
        '<label><input type="checkbox" class="genre-filter" value="36" title="Slice of Life"> Slice of Life</label><label><input type="checkbox" class="genre-filter" value="30" title="Sports"> Sports</label>' +
        '<label><input type="checkbox" class="genre-filter" value="37" title="Supernatural"> Supernatural</label><label><input type="checkbox" class="genre-filter" value="41" title="Suspense"> Suspense</label></div>';
      listFilter.appendChild(genresFilter);
      // Genres Dropdown Function
      $(".genreDropBtn").click(function () {
        const genreFilterDiv = document.querySelector('.filterList_GenresFilter');
        genreFilterDiv.style.minWidth = genreFilterDiv.style.minWidth === '255px' ? '' : '255px';
        const dropdownContent = document.getElementById('maljs-dropdown-content');
        dropdownContent.style.display = dropdownContent.style.display === 'grid' ? 'none' : 'grid';
      });
      // Genres Filter Function
      $(".genre-filter").click(function () {
        const checkboxes = document.querySelectorAll('.genre-filter');
        const entries = document.querySelectorAll('.entry');
        const selectedGenres = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value);
        entries.forEach(entry => {
          const genres = JSON.parse(entry.getAttribute('genres'));
          const entryGenres = genres.map(genre => genre.id.toString());
          const isVisible = selectedGenres.every(genre => entryGenres.includes(genre)) || selectedGenres.length === 0;
          if (isVisible) {
            entry.classList.remove('hidden');
          } else {
            entry.classList.add('hidden');
          }
        });
        $(".genreDropBtn").text(selectedGenres.length > 0 ? Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.title) : "Select Genres");
      });

      //Year Filter
      const yearFilter = create('div', { class: 'filterList_YearFilter' });
      const currentYear = new Date().getFullYear();
      const yearFilterMax = currentYear;
      const yearFilterMin = currentYear - 95;
      const yearFilterClear = create('i', { class: 'year-filter-clear fa fa-close' });
      yearFilter.innerHTML = `<div class="year-filter-slider-container">
      <input type="range" id="year-filter-slider" min="${yearFilterMin}" max="${yearFilterMax}" value="${yearFilterMax}" step="1">
      <span id="year-filter-label">${yearFilterMax}</span></div>`;
      let canAddYearFilter = 0;
      if (!isManga && animeDataList[0] && animeDataList[0].season || isManga && animeDataList[0] && animeDataList[0].mangaYear) {
        canAddYearFilter = 1;
      }
      if (canAddYearFilter) {
        $(yearFilter).prepend('<h3>Year</h3>');
        $(yearFilter).prepend($(yearFilterClear));
        listFilter.appendChild(yearFilter);
        const $yearFilterSlider = $('#year-filter-slider');
        const $yearFilterLabel = $('#year-filter-label');

        // Year Filter Clear Button Function
        $(yearFilterClear).on('click', function () {
          const entries = document.querySelectorAll('.entry');
          entries.forEach(entry => {
            entry.classList.remove('hidden');
            yearFilterClear.style.display = "none";
            $yearFilterSlider.val(yearFilterThisYear).change();
            $yearFilterLabel.text($yearFilterSlider.val());
          });
        });
        // Update label when slider value changes
        $yearFilterSlider.on('input', function () {
          if (yearFilterClear.style.display !== "block") {
            yearFilterClear.style.display = "block"
          }
          $yearFilterLabel.text($(this).val());
          const entries = document.querySelectorAll('.entry');
          entries.forEach(entry => {
            const seasonData = isManga ? JSON.parse(entry.getAttribute('mangayear')) : JSON.parse(entry.getAttribute('season'));
            const entryYear = seasonData?.year ? seasonData.year : 0;
            if (entryYear && entryYear === parseInt($(this).val(), 10)) {
              entry.classList.remove('hidden');
            } else {
              entry.classList.add('hidden');
            }
          });
        });

        // Initialize label
        $yearFilterLabel.text($yearFilterSlider.val());
      }

      //Sort Filter
      const sortFilter = create("div", { class: "filterList_SortFilter" });
      sortFilter.innerHTML = `
      <div class="sort-container" style="display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; gap: 0px 10px; margin-top: 10px;">
      <select id="sort-select" style="width:100%"><option value="title">Title</option><option value="score">Score</option>
      <option value="progress">Progress</option><option value="startdate">Start Date</option><option value="finishdate">Finish Date</option>
      ${isManga ? '' : `<option value="createdat">Last Added</option> <option value="updatedat">Last Updated</option>`}</select>
      <button class="fa fa-arrow-up" id="sort-asc" style="font-family: FontAwesome; width:33px; margin-top:0"></button>
      <button class="fa fa-arrow-down" id="sort-desc" style="font-family: FontAwesome; width:33px; margin-top:0"></button></div>`;
      listFilter.appendChild(sortFilter);
      const sortSelect = document.getElementById("sort-select");
      const sortAsc = document.getElementById("sort-asc");
      const sortDesc = document.getElementById("sort-desc");

      function sortEntriesInSection(section, criterion, order) {
        const entries = Array.from(section.querySelectorAll(".entry"));
        const compare = (a, b) => {
          const aValue = getValue(a, criterion);
          const bValue = getValue(b, criterion);
          if (order === "asc") {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          } else {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        };
        entries.sort(compare);
        const parent = section;
        entries.forEach((entry) => parent.appendChild(entry));
      }

      function getValue(entry, criterion) {
        switch (criterion) {
          case "score":
            const score = entry.querySelector(".score")?.textContent;
            return score ? parseInt(score, 10) : -Infinity;
          case "title":
            return entry.querySelector(".title")?.textContent.trim();
          case "startdate":
            const startdate = entry.getAttribute("startdate");
            return startdate ? parseDate(startdate) : -Infinity;
          case "finishdate":
            const finishdate = entry.getAttribute("finishdate");
            return finishdate ? parseDate(finishdate) : -Infinity;
          case "createdat":
            const createdat = entry.getAttribute("createdat");
            return createdat ? parseInt(createdat, 10) : -Infinity;
          case "updatedat":
            const updatedat = entry.getAttribute("updatedat");
            return updatedat ? parseInt(updatedat, 10) : -Infinity;
          case "progress":
            return parseInt(entry.getAttribute("progress"), 10);
          default:
            return "";
        }
      }

      function sortAllSections(criterion, order) {
        const sections = document.querySelectorAll(".status-section");
        sections.forEach((section) => {
          sortEntriesInSection(section, criterion, order);
        });
      }

      sortAsc.addEventListener("click", () => {
        sortAllSections(sortSelect.value, "asc");
      });

      sortDesc.addEventListener("click", () => {
        sortAllSections(sortSelect.value, "desc");
      });
      //Tags
      const entries = document.querySelectorAll('.entry');
      const tagsContainer = create('div', { class: 'filterList_TagsContainer' });
      const tagsContainerClear = create('i', { class: 'tags-container-clear fa fa-close' });
      const tags = new Set(); // Using a Set to avoid duplicates
      tagsContainer.style.marginBottom = "10px";
      listFilter.appendChild(tagsContainer);
      // Tags Clear Button Function
      $(tagsContainerClear).on('click', function () {
        $(".tag-link.clicked").attr('class', 'tag-link');
        const entries = document.querySelectorAll('.entry');
        entries.forEach(entry => {
          entry.classList.remove('hidden');
          tagsContainerClear.style.display = "none";
        });
      });
      // Collect all unique tags
      entries.forEach(entry => {
        const tag = entry.getAttribute('tags').replace(/"/g, ''); // Remove quotes
        if (tag) {
          tags.add(tag);
        }
      });

      if (tags.size > 0) {
        $(tagsContainer).prepend('<h3>Tags</h3>');
        $(tagsContainer).prepend($(tagsContainerClear));
      }

      // Create tag links
      tags.forEach(tag => {
        const link = document.createElement('a');
        link.className = 'tag-link';
        link.textContent = tag;
        link.onclick = () => {
          $(".tag-link.clicked").attr('class', 'tag-link');
          $(link).attr('class', 'tag-link clicked');
          filterByTag(tag);
        };
        tagsContainer.appendChild(link);
      });
      // Filter function
      function filterByTag(tag) {
        if (tagsContainerClear.style.display !== "block") {
          tagsContainerClear.style.display = "block"
        }
        entries.forEach(entry => {
          const entryTag = entry.getAttribute('tags').replace(/"/g, '');
          if (entryTag === tag) {
            entry.classList.remove('hidden');
          } else {
            entry.classList.add('hidden');
          }
        });
      }

      //Compare Button
      if (userNotHeaderUser) {
        let compareBtn = create('a', { class: 'compareBtn' }, "Compare");
        let compareUrl = isManga ? 'https://myanimelist.net/sharedmanga.php?u1=' + username + '&u2=' + headerUserName : 'https://myanimelist.net/sharedanime.php?u1=' + username + '&u2=' + headerUserName;
        compareBtn.href = compareUrl;
        listFilter.appendChild(compareBtn);
      }

      // Make 3x3
      let buttonDraw3x3 = AdvancedCreate("a", "#maljsDraw3x3", "Make 3x3");
      listFilter.appendChild(buttonDraw3x3);
      buttonDraw3x3.title = "Make 3x3";
      buttonDraw3x3.onclick = function () {
        if (!document.querySelector(".maljsDisplayBox")) {
          $(".entry.row .title").css('pointer-events', 'none');
          let displayBox = createDisplayBox(false, "3x3 Maker");
          let col_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
          let col_label = AdvancedCreate("span", false, "columns", displayBox, "margin: 5px");
          col_input.type = "number";
          col_input.value = 3;
          col_input.step = 1;
          col_input.min = 0;
          let row_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
          let row_label = AdvancedCreate("span", false, "rows", displayBox, "margin: 5px");
          AdvancedCreate("br", false, false, displayBox);
          row_input.type = "number";
          row_input.value = 3;
          row_input.step = 1;
          row_input.min = 0;
          let margin_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
          let margin_label = AdvancedCreate("span", false, "spacing (px)", displayBox, "margin: 5px");
          AdvancedCreate("br", false, false, displayBox);
          margin_input.type = "number";
          margin_input.value = 0;
          margin_input.min = 0;
          let width_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
          let width_label = AdvancedCreate("span", false, "image width (px)", displayBox, "margin: 5px");
          width_input.type = "number";
          width_input.value = 230;
          width_input.min = 0;
          let height_input = AdvancedCreate("input", "maljsNativeInput", false, displayBox);
          let height_label = AdvancedCreate("span", false, "image height (px)", displayBox, "margin: 5px");
          AdvancedCreate("br", false, false, displayBox);
          height_input.type = "number";
          height_input.value = 345;
          height_input.min = 0;
          let fitMode = AdvancedCreate("select", "maljsNativeInput", false, displayBox);
          let fitMode_label = AdvancedCreate("span", false, "image fitting", displayBox, "margin	: 5px");
          let addOption = function (value, text) {
            let newOption = AdvancedCreate("option", false, text, fitMode);
            newOption.value = value;
          };
          addOption("scale", "scale");
          addOption("crop", "crop");
          addOption("hybrid", "scale/crop hybrid");
          addOption("letterbox", "letterbox");
          addOption("transparent", "transparent letterbox");

          let recipe = AdvancedCreate("p", false, "Click 9 media entries, then save the image below", displayBox);
          let linkList = [];
          let keepUpdating = true;
          let image_width = 230;
          let image_height = 345;
          let margin = 0;
          let columns = 3;
          let rows = 3;
          let mode = fitMode.value;

          displayBox.parentNode.querySelector(".maljsDisplayBoxClose").onclick = function () {
            displayBox.parentNode.remove();
            keepUpdating = false;
            let cardList = document.querySelectorAll(".entry.row");
            cardList.forEach(function (card) {
              card.draw3x3selected = false;
              card.style.borderStyle = "none";
              card.querySelector('.title').style.pointerEvents = "";
            });
            linkList = [];
          };

          let finalCanvas = AdvancedCreate("canvas", false, false, displayBox, "max-height: 60%;max-width: 90%");
          let ctx = finalCanvas.getContext("2d");
          let updateDrawing = function () {
            finalCanvas.width = image_width * columns + (columns - 1) * margin;
            finalCanvas.height = image_height * rows + (rows - 1) * margin;
            ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
            let drawStuff = function (image, x, y, width, height) {
              let img = new Image();
              img.onload = function () {
                let sx = 0;
                let sy = 0;
                let sWidth = img.width;
                let sHeight = img.height;
                let dx = x;
                let dy = y;
                let dWidth = width;
                let dHeight = height;
                if (mode === "crop") {
                  if (img.width / img.height > width / height) {
                    let factor = img.height / height;
                    sWidth = width * factor;
                    sx = (img.width - sWidth) / 2;
                  } else {
                    //crop top and bottom
                    let factor = img.width / width;
                    sHeight = height * factor;
                    sy = (img.height - sHeight) / 2;
                  }
                } else if (mode === "hybrid") {
                  if (img.width / img.height > width / height) {
                    let factor = img.height / height;
                    sWidth = width * factor;
                    sWidth += (img.width - sWidth) / 2;
                    sx = (img.width - sWidth) / 2;
                  } else {
                    //crop top and bottom
                    let factor = img.width / width;
                    sHeight = height * factor;
                    sHeight += (img.height - sHeight) / 2;
                    sy = (img.height - sHeight) / 2;
                  }
                } else if (mode === "letterbox" || mode === "transparent") {
                  if (img.width / img.height > width / height) {
                    let factor = img.width / width;
                    dHeight = img.height / factor;
                    dy = y + (height - dHeight) / 2;
                  } else {
                    //too tall
                    let factor = img.height / height;
                    dWidth = img.width / factor;
                    dx = x + (width - dWidth) / 2;
                  }
                  if (mode === "letterbox") {
                    ctx.fillStyle = "black";
                    ctx.fillRect(x, y, width, height);
                  }
                } else {
                }
                ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
              };
              img.src = image;
            };
            for (var y = 0; y < rows; y++) {
              for (var x = 0; x < columns; x++) {
                if (linkList[y * columns + x] !== "empty") {
                  drawStuff(linkList[y * columns + x], x * image_width + x * margin, y * image_height + y * margin, image_width, image_height);
                }
              }
            }
          };

          let updateConfig = function () {
            columns = parseInt(col_input.value) || 3;
            rows = parseInt(row_input.value) || 3;
            margin = parseInt(margin_input.value) || 0;
            image_width = parseInt(width_input.value) || 230;
            image_height = parseInt(height_input.value) || 345;
            mode = fitMode.value;
            displayBox.parentNode.querySelector(".maljsDisplayBoxTitle").textContent = columns + "x" + rows + " Maker";
            recipe.innerText = "Click " + rows * columns + " media entries, then save the image below";
            updateDrawing();
          };
          col_input.oninput = updateConfig;
          row_input.oninput = updateConfig;
          margin_input.oninput = updateConfig;
          width_input.oninput = updateConfig;
          height_input.oninput = updateConfig;
          fitMode.oninput = updateConfig;

          let updateCards = function () {
            let cardList = document.querySelectorAll(".entry.row");
            cardList.forEach((card) => {
              card.onclick = function () {
                if (keepUpdating) {
                  if (this.draw3x3selected) {
                    linkList[linkList.indexOf(this.draw3x3selected)] = "empty";
                    this.draw3x3selected = false;
                    this.style.borderStyle = "none";
                  } else {
                    let val = this.querySelector(".cover .image").src;
                    if (!linkList.some((place, index) => {
                      if (place === "empty") {
                        linkList[index] = val;
                        return true;
                      }
                      return false;
                    })) {
                      linkList.push(val);
                    }
                    this.draw3x3selected = val;
                    this.style.borderStyle = "solid";
                  }
                  updateDrawing();
                };
              };
            });
          };
          let waiter = function () {
            updateCards();
            if (keepUpdating) {
              setTimeout(waiter, 500);
            }
          };
          waiter();
        }
      };
    }
    //Modern Profile Layout Anime and Manga List //-END-//

    //profile Mutual Friends //-START-//
    async function mutualFriends() {
      let myFriends = 0;
      let userFriends = 0;
      const friends = document.querySelectorAll(".boxlist .title");
      const friendsHeader = document.querySelector(".boxlist-container.friend.mb16");
      const mutualsButton = create('a', { class: 'mal-btn', style: { backgroundColor: "var(--color-foreground)" } }, "Mutual Friends");
      const mutualsDiv = create('div', { class: 'boxlist-container' });
      $(friendsHeader).before(mutualsButton);
      $(friendsHeader).after(mutualsDiv);
      mutualsButton.addEventListener('click', async function () {
        if ($(mutualsButton).text() !== 'Loading..') {
          mutualsButton.classList.toggle('active');
          try {
            $(mutualsButton).text("Loading..");
            if (!myFriends) {
              myFriends = await getFriends(headerUserName);
              myFriends = myFriends.map(friend => friend.username);
            }
            if (!userFriends) {
              userFriends = await getFriends(username);
            }
            $(mutualsButton).text("Mutual Friends");
            const userFriendsBoxes = document.querySelectorAll('.boxlist.col-3');
            mutualsButton.classList[1] === 'active' ? $(mutualsButton).css({ backgroundColor: "var(--color-foreground2)" }) : $(mutualsButton).css({ backgroundColor: "var(--color-foreground)" });
            if (!$(mutualsDiv).attr('done')) {
              userFriends.forEach(user => {
                if (mutualsButton.classList[1]) {
                  $('.boxlist-container.friend.mb16, .mt4.mb8').hide();
                  $(mutualsDiv).show();
                  if (myFriends.includes(user.username)) {
                    const mutualsBox = create('div', { class: 'boxlist col-3', style: { minHeight: "48px" } });
                    mutualsBox.innerHTML = '<div class="di-tc"><a href="' + user.url + '">' + '<img class="image profile-w48 lazyloaded" src="' + user.images.jpg.image_url +
                      '" alt="Profile Image"></a></div>' + '<div class="di-tc va-t pl8 data"><div class="title"><a href="' + user.url + '">' + user.username + '</a></div></div>';
                    mutualsDiv.append(mutualsBox);
                  }
                }
              });
              $(mutualsDiv).attr('done', '1');
            }
            if (!mutualsButton.classList[1]) {
              $('.boxlist-container.friend.mb16, .mt4.mb8').show();
              $(mutualsDiv).hide();
            } else {
              $('.boxlist-container.friend.mb16, .mt4.mb8').hide();
              $(mutualsDiv).show();
            }
          } catch (error) {
            console.error('Error fetching profile data:', error);
          };

        }
      });
    }
    if (/\/profile\/.*\/friends/gm.test(current) && userNotHeaderUser) {
      mutualFriends();
    }
    //profile Mutual Friends //-END-//

    //Profile Vertical Favs Fix
    if ($('#anime_favorites').css('width') <= '191px') {
      $('#user-def-favs h5').attr('style', 'padding: 0!important;opacity: 0;height: 0px');
    }
  }
  //Profile Section //--END--//

  //Auto Hide/Show Header
  if (svar.headerSlide || svar.headerOpacity) {
    let lastScrollTop = 0;
    const header = document.querySelector('#headerSmall');
    const menu = document.querySelector('#menu');
    let seasonalNav;
    if (header && menu) {
      // Set initial position
      header.style.top = '0';
      menu.style.transition = "top 0.3s ease-in-out";
      header.style.transition = "top 0.3s ease-in-out, background 0.3s ease-in-out";

      window.addEventListener('scroll', () => {
        //Seasonal Anime Nav Fix
        if (/\/(anime)\/(season).?([\w]+)?\/?/.test(location.pathname)) {
          if (!seasonalNav) {
            seasonalNav = document.querySelector("#content > div.navi-seasonal.js-navi-seasonal.fixed");
          }
          if (seasonalNav && !seasonalNav.style.transition) {
            seasonalNav.style.transition = "top 0.3s ease-in-out";
          }
        }
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (/\/(profile)\/.?([\w]+)?\/?/.test(location.pathname) && document.querySelector("#banner") && document.querySelector("#banner").style.background !== '' && svar.headerOpacity) {
          if (scrollTop === 0) {
            header.style.backgroundColor = 'var(--fgo)!important';
          } else if (header.style.backgroundColor !== '') {
            header.style.backgroundColor = '';
          }
        }
        if (svar.headerSlide) {
          if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.top = '-50px';
            menu.style.top = '-50px';
            if (seasonalNav) {
              seasonalNav.style.top = '-50px';
            }
          } else {
            // Scrolling up
            header.style.top = '0';
            menu.style.top = '7px';
            if (seasonalNav) {
              seasonalNav.style.top = '0';
            }
          }
        }
        lastScrollTop = scrollTop;
      });
    }
  }
  //Character Section //-START-//
  if (/\/(character)\/.?([\w-]+)?\/?/.test(current)) {
    if (svar.customCharacterCover) {
      addMoreFavs("character");
      getCustomCover("character");
      loadCustomCover(1, "character");
    }
    let regex = /(Member Favorites).*/g;
    let match = document.createElement("p");
    let fav = document.querySelector("#content > table > tbody > tr > td.borderClass");
    match.innerText = fav.innerText.match(regex);
    fav.innerHTML = fav.innerHTML.replace(regex, "");
    if (match) {
      document.querySelector("#v-favorite").insertAdjacentElement("beforebegin", match);
    }
    if (/\/(clubs)/.test(current) || /\/(pics)/.test(current)) {
    } else {
      $('div:contains("Voice Actors"):last')
        .addClass("VoiceActorsDiv")
        .html(function (_, html) {
          return html.replace("Voice Actors", "");
        })
        .before('<h2 class="VoiceActorsHeader"style="margin-bottom: -10px;margin-top: 10px;">Voice Actors</h2>');

      while ($(".VoiceActorsDiv").next("table").length > 0) {
        $(".VoiceActorsDiv").append(
          $(".VoiceActorsDiv").next("table").addClass("VoiceActorsDivTable").css({
            backgroundColor: "var(--color-foreground)",
            borderRadius: "var(--br)",
            marginTop: "8px",
            border: "var(--border) solid var(--border-color)",
          })
        );
        $(".VoiceActorsDivTable").children().children().children().children(".picSurround").children().children().css({
          width: "52px",
          height: "80px",
          objectFit: "cover",
        });
        $(".VoiceActorsDivTable").children().children().children().css({
          border: "0",
        });
      }
      $(".VoiceActorsDiv").css({
        display: "-ms-grid",
        display: "grid",
        MsGridColumns: "1fr 1fr",
        gridTemplateColumns: "1fr 1fr",
        gap: "0px 6px",
      });
      $('h2:contains("Recent Featured Articles"):last').addClass("RecentFeaturedArticlesDiv").append($(".RecentFeaturedArticlesDiv").next());
      $(".RecentFeaturedArticlesDiv").css({
        marginTop: "10px",
      });
      $(".RecentFeaturedArticlesDiv").children("div:last-child").css({
        marginTop: "8px",
      });
      $(".RecentFeaturedArticlesDiv").children().children().css("width", "99%").children().css("borderRadius", "var(--br)");
      let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
      $(main).addClass("characterDiv");
      let text = create("div", {
        class: "description",
        itemprop: "description",
        style: {
          display: "block",
          fontSize: "11px",
          fontWeight: "500",
          marginTop: "5px",
          whiteSpace: "pre-wrap",
          border: "var(--border) solid var(--border-color)",
        },
      });

      text.innerHTML = getTextUntil(".VoiceActorsHeader");
      main.appendChild(text);

      //Remove spaces and add text at the top
      let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, "");
      text.innerHTML = fixtext;

      document.querySelector(".breadcrumb").after(text);

      //Cleanup
      $.trim($('.characterDiv').contents().not($('.description')).not($('.VoiceActorsDiv')).not($('#horiznav_nav')).not($('.breadcrumb')).not($('h2')).not($('table')).remove());
      $(".description").children().not($("li")).not($("input")).not($("span.spoiler_content")).remove();

      //Fix Spoilers
      let spofix = document.querySelectorAll(".spoiler_content > input");
      $(".spoiler_content").css({
        background: "var(--color-foreground4)",
        borderRadius: "var(--br)",
        padding: "0px 5px 5px",
        margin: "5px 0px",
      });
      for (let x = 0; x < spofix.length; x++) {
        spofix[x].setAttribute("onclick", "this.parentNode.style.display='none';this.parentNode.previousElementSibling.style.display='inline-block';");
      }
      if ($(".VoiceActorsHeader").next().html() === "") {
        $(".VoiceActorsHeader").remove();
      }
    }
  }
  //Character Section //--END--//

  //Anime/Manga Section//--START--//
  if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current)
    && !/\/(ownlist|season|adapted|recommendations)/.test(current) && !document.querySelector("#content > .error404")) {
    if (svar.customCharacterCover) {
      addMoreFavs("anime_manga");
    }
    let text = create('div', {
      class: 'description',
      itemprop: 'description',
      style: {
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginTop: '5px',
        whiteSpace: 'pre-wrap',
        border: 'var(--border) solid var(--border-color)',
      },
    });
    const sections = [
      'Information',
      'Alternative Titles',
      'Statistics',
      'Summary Stats',
      'Score Stats',
      'More Info',
      'Resources',
      'Streaming Platforms',
      'Available At',
      'Background',
      'Synopsis',
      'Episode Videos',
      'Related Anime',
      'Related Manga',
      'Related Entries',
      'Characters',
      'Staff',
      'Reviews',
      'Recommendations',
      'Interest Stacks',
      'Recent News',
      'Recent Featured Articles',
      'Recent Forum Discussion',
      'MALxJapan -More than just anime-'
    ];
    sections.forEach(section => aniMangaAddClass(section));

    if ($('.AlternativeTitlesDiv').length) {
      if ($("a.js-anime-toggle-alternative-title-button").length > 0 || $("a.js-manga-toggle-alternative-title-button").length > 0) {
        $(".AlternativeTitlesDiv").nextUntil('a').addClass("spaceit-shadow-end").addClass("mb8");
      } else {
        $(".AlternativeTitlesDiv").nextUntil('br').addClass("spaceit-shadow-end");
      }
      document.querySelector('.AlternativeTitlesDiv').nextElementSibling.setAttribute('style', 'margin-bottom:4px');
      $('span:contains("Synonyms")').parent().next().css({
        borderRadius: 'var(--br)'
      });
    }
    if (document.querySelector('.js-alternative-titles.hide')) {
      document.querySelector('.js-alternative-titles.hide').setAttribute('style', 'border-radius:var(--br);overflow:hidden');
    }
    if ($('.InformationDiv').length && !defaultMal) {
      $(".InformationDiv").nextUntil("br").not('h2').attr('style', 'background:0!important').addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
    }
    if ($('.StatisticsDiv').length && !defaultMal) {
      $(".StatisticsDiv").nextUntil("br").not('h2').attr('style', 'background:0!important').addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
      $(".statistics-info").css('opacity', '0');
      $(".spaceit_pad.po-r.js-statistics-info.di-ib sup").css('opacity', '0');
    }
    if ($('.ResourcesDiv').length) {
      $(".ResourcesDiv").next().addClass("spaceit-shadow-end");
      document.querySelector('.ResourcesDiv').previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
      document.querySelector('.ResourcesDiv').nextElementSibling.style.borderRadius = 'var(--br)';
    }
    if ($('.StreamingPlatformsDiv').length) {
      $(".StreamingPlatformsDiv").next(".pb16.broadcasts").attr('style', 'padding-bottom: 12px!important');
      $(".StreamingPlatformsDiv").next().addClass("spaceit-shadow-end");
      document.querySelector('.StreamingPlatformsDiv').nextElementSibling.style.borderRadius = 'var(--br)';
    }
    if ($('.AvailableAtDiv').length) {
      $(".AvailableAtDiv").next().addClass("spaceit-shadow-end");
      document.querySelector('.AvailableAtDiv').nextElementSibling.style.borderRadius = 'var(--br)';
      document.querySelector('.AvailableAtDiv').previousElementSibling.previousElementSibling.setAttribute('style', 'border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)');
    }
    if ($('.SummaryStatsDiv').length) {
      const statsDiv = create("div", { class: "statsDiv spaceit-shadow-end" });
      const statElements = $('.SummaryStatsDiv').nextUntil('br');
      $('.SummaryStatsDiv').after(statsDiv);
      statsDiv.setAttribute('style', 'border-radius:var(--br);overflow:hidden;display: -ms-grid;display: grid;-ms-grid-columns: 1fr 1fr 1fr;grid-template-columns: 1fr 1fr 1fr;border:var(--border) solid var(--border-color)');
      $(statsDiv).append(statElements);
    }
    if ($('.score-stats').length) {
      $('.score-stats').addClass("spaceit-shadow-end");
    }
    if ($('.table-recently-updated').length) {
      $('.table-recently-updated').addClass("spaceit-shadow-end");
    }

    handleEmptyInfo('.SynopsisDiv', "No synopsis information has been added to this title.");
    handleEmptyInfo('.CharactersDiv', "No characters or voice");
    handleEmptyInfo('.CharactersDiv', "No characters for this manga");
    handleEmptyInfo('.RecommendationsDiv', "No recommendations have been made");
    handleEmptyInfo('.StaffDiv', "No staff for this");
    handleEmptyInfo('.MoreInfoDiv', '', 1);

    if ($('.RecentNewsDiv').length && !$('.RecentNewsDiv').next().is('div')) {
      $('.RecentNewsDiv').remove();
    }
    if ($('.page-forum:contains("No discussion topic was found.")')[0]) {
      $('.page-forum:contains("No discussion topic was found.")')[0].remove();
      $('.RecentForumDiscussionDiv').remove();
    }
    if (svar.editPopup && $('#addtolist a:contains("Edit Details")').length) {
      let editDetails = $('#addtolist a:contains("Edit Details")')[0]
      editDetails.className = 'fa fa-pen';
      editDetails.style.fontFamily = 'fontAwesome';
      editDetails.style.padding = '5px';
      editDetails.innerText = "";
      editDetails.href = 'javascript:void(0);';
      editDetails.onclick = async () => {
        await editPopup(entryId, entryType);
      }
    }

    // Change the design of the Information on the left side.
    if (svar.animeInfoDesign) {
      let informationDiv = defaultMal ? $('.InformationDiv').nextAll().children('.dark_text') : $('.InformationDiv').next().children().children('.dark_text');
      informationDiv.each(function () {
        let currentText = $(this).text();
        $(this).text(currentText.slice(0, -1));
      });
      informationDiv.after('<br>');
    }

    //Remove the "to ?" in the Aired in Information section on the left side
    if ($('.InformationDiv').length > 0) {
      let InformationAired = defaultMal ? $('.InformationDiv').nextAll().children('.dark_text:contains("Aired")') : $('.InformationDiv').next().children().children('.dark_text:contains("Aired")');
      if (InformationAired.length > 0) {
        InformationAired = InformationAired.parent()[0].childNodes[3] ? InformationAired.parent()[0].childNodes[3] : InformationAired.parent()[0].childNodes[2];
        InformationAired.nodeValue = InformationAired.nodeValue.replace('to ?', '');
      }
    }

    //Main Anilist Query for Anime/Manga Page (banner-tags-relations-airing)
    let AlAPIData;
    let AlAPIRequestPromise;

    async function aniAPIRequest() {
      if (!AlAPIRequestPromise) {
        const AlQuery = `query {Media(idMal:${entryId}, type:${entryType}) {bannerImage tags {isMediaSpoiler name rank description}
        relations {edges {relationType node {status startDate {year} seasonYear type format title {romaji} coverImage {medium large} idMal}}}
        nextAiringEpisode {timeUntilAiring episode}}}`;
        AlAPIRequestPromise = AnilistAPI(AlQuery).then(data => {
          AlAPIData = data;
          AlAPIRequestPromise = null;
          return data;
        });
      }
      return AlAPIRequestPromise;
    }

    //Add Airing Time
    getAiringTime();
    async function getAiringTime() {
      if ($('.InformationDiv').length > 0) {
        let informationDiv = defaultMal ? $('.InformationDiv').nextAll() : $('.InformationDiv').next().children();
        let InformationAiring = informationDiv.children('.dark_text:contains("Status")').parent();
        if (InformationAiring.length > 0) {
          InformationAiring = InformationAiring.text().replace(/Status:?\s*/, '').trim();
          if (InformationAiring === "Currently Airing") {
            const AiringData = await aniAPIRequest();
            if (AiringData?.data.Media) {
              const AiringEp = AiringData.data.Media.nextAiringEpisode ? AiringData.data.Media.nextAiringEpisode.episode : "";
              const AiringTime = AiringData.data.Media.nextAiringEpisode ? AiringData.data.Media.nextAiringEpisode.timeUntilAiring : "";
              const AiringInfo = AiringEp && AiringTime
                ? '<div class="spaceit_pad"><span class="dark_text">' + (svar.animeInfoDesign ? 'Airing' : 'Airing: ')
                + '</span>' + (svar.animeInfoDesign ? '<br>' : '') + '<a>Ep ' + AiringEp + ': ' + (await airingTime(AiringTime)) + "</a></div>"
                : "";
              if (AiringInfo) {
                informationDiv.first().before(AiringInfo)
              }
            }
          }
        }
      }
    }

    //Add Banner Image
    if (svar.animeBanner) {
      getBannerImage();
      async function getBannerImage() {
        let bannerData;
        const bannerDiv = create("div", { class: "bannerDiv" });
        const bannerImage = create("img", { class: "bannerImage" });
        const bannerShadow = create("div", { class: "bannerShadow" });
        const bannerTarget = document.querySelector("#content");
        const BannerLocalForage = localforage.createInstance({ name: "MalJS", storeName: "banner" });
        const BannerCache = await BannerLocalForage.getItem(entryId + "-" + entryType);
        const leftSide = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
        if (BannerCache) {
          bannerData = BannerCache;
        }
        else {
          bannerData = await aniAPIRequest();
          if (bannerData?.data.Media && bannerData.data.Media.bannerImage) {
            await BannerLocalForage.setItem(entryId + "-" + entryType, {
              bannerImage: bannerData.data.Media.bannerImage
            });
            bannerData = await BannerLocalForage.getItem(entryId + "-" + entryType);
          } else {
            bannerData = null;
          }
        }
        if (bannerData && bannerData?.bannerImage && bannerTarget && leftSide) {
          let bgColor = getComputedStyle(document.body);
          bgColor = tinycolor(bgColor.getPropertyValue('--bg'));
          const bannerHover = create("div", { class: "bannerHover" });
          const bannerShadowColor = [bgColor.setAlpha(.1).toRgbString(), bgColor.setAlpha(.0).toRgbString(), bgColor.setAlpha(.6).toRgbString()];
          bannerShadow.style.background = `linear-gradient(180deg,${bannerShadowColor[0]},${bannerShadowColor[1]} 50%,${bannerShadowColor[2]})`;
          leftSide.classList.add("aniLeftSide");
          bannerImage.src = bannerData.bannerImage;
          bannerDiv.append(bannerImage, bannerHover, bannerShadow);
          bannerTarget.prepend(bannerDiv);
          svar.animeHeader = true;
          headerPosChange(1);
          document.querySelector('td.borderClass.aniLeftSide').style.borderWidth = '0';
          if (svar.animeBannerMove) {
            bannerHover.remove();
            leftSide.style.top = "0";
          } else {
            $(bannerHover).on('mouseenter', async function () {
              leftSide.style.top = "0";
            });
            $(bannerHover).on('mouseleave', async function () {
              leftSide.style.top = "-85px";
            });
          }
        }
      }
    }

    // Add Tags from Anilist
    if (svar.animeTag) {
      getTags();
      async function getTags() {
        let tagData;
        const tagDiv = create("div", { class: "aniTagDiv" });
        const tagTarget = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
        const tagLocalForage = localforage.createInstance({ name: "MalJS", storeName: "tags" });
        const tagcacheTTL = svar.tagTTL;
        let tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
        if (!tagCache || tagCache.time + tagcacheTTL < Date.now()) {
          tagData = await aniAPIRequest();
          if (tagData?.data.Media && tagData.data.Media.tags && tagData.data.Media.tags.length > 0) {
            await tagLocalForage.setItem(entryId + "-" + entryType, {
              tags: tagData.data.Media.tags,
              time: Date.now(),
            });
            tagCache = await tagLocalForage.getItem(entryId + "-" + entryType);
          }
        }
        if (tagCache && tagTarget) {
          if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className === "clearfix mauto mt16") {
            tagTarget.lastChild.lastElementChild.remove();
          }
          if (tagTarget.lastChild.lastElementChild && tagTarget.lastChild.lastElementChild.className !== "pb16") {
            tagDiv.style.paddingTop = "16px"
          }
          tagDiv.innerHTML = '<h2 style="margin-bottom:-2px;">Tags</h2>';
          tagDiv.innerHTML += tagCache.tags
            .map((node) => `
            <div class="${node.isMediaSpoiler === true ? 'aniTag spoiler' : 'aniTag'}"><a title="${node.description ? node.description : ''}"><div class="aniTag-name">${node.name.replace(/'/g, " ")}</div></a>
            <div class="aniTag-percent">(${node.rank}%)</div></div>`).join('');
          tagTarget.append(tagDiv);
          if ($(".aniTagDiv .spoiler").length) {
            let showSpoilers = create("div", { class: "showSpoilers" }, "Show " + $(".aniTagDiv .spoiler").length.toString() + " spoiler tags");
            showSpoilers.onclick = () => {
              if ($(".aniTagDiv .spoiler").css("display") !== "none") {
                $(".aniTagDiv .spoiler").css("display", "none");
                $(showSpoilers).text("Show " + $(".aniTagDiv .spoiler").length.toString() + " spoiler tags");
              } else {
                $(".aniTagDiv .spoiler").css("display", "flex");
                $(showSpoilers).text("Hide spoiler tags");
              }
            }
            tagDiv.append(showSpoilers);
          }
        }
      }
    }

    // Replace Relations
    if (svar.animeRelation) {
      getRelations();
      async function getRelations() {
        let relationData, sortedRelations, relationHeight;
        const relationDiv = create("div", { class: "aniTagDiv" });
        const relationTargetExpand = create('a', { class: 'relations-accordion-button' });
        const extraRelationsDiv = create('div', { class: 'relationsExpanded', style: { display: "none" } });
        const relationTarget = document.querySelector(".related-entries");
        const relationLocalForage = localforage.createInstance({ name: "MalJS", storeName: "relations" });
        const relationcacheTTL = svar.relationTTL;
        let relationCache = await relationLocalForage.getItem(entryId + "-" + entryType);
        const priorityOrder = { "ADAPTATION": 0, "PREQUEL": 1, "SEQUEL": 2, "PARENT": 3, "ALTERNATIVE": 4, "SIDE_STORY": 5, "SUMMARY": 6, "SPIN_OFF": 7, "CHARACTER": 8, "OTHER": 9 };
        if (!relationCache || relationCache.time + relationcacheTTL < Date.now()) {
          relationData = await aniAPIRequest();
          relationData?.data.Media ? relationData = relationData.data.Media.relations.edges.filter(node => node.node.idMal !== null) : null;
          if (relationData && relationData.length > 0) {
            // Sort by priorityOrder
            sortedRelations = relationData.sort((a, b) => {
              const orderA = priorityOrder[a.relationType];
              const orderB = priorityOrder[b.relationType];
              return orderA - orderB;
            });
            // Group by relationType
            let groupedRelations = sortedRelations.reduce((acc, curr) => {
              if (!acc[curr.relationType]) {
                acc[curr.relationType] = [];
              }
              acc[curr.relationType].push(curr);
              return acc;
            }, {});
            // Sort each group by year
            for (let type in groupedRelations) {
              groupedRelations[type].sort((a, b) => {
                const yearA = a.node.seasonYear ?? a.node.startDate?.year ?? 0;
                const yearB = b.node.seasonYear ?? b.node.startDate?.year ?? 0;
                return yearA - yearB;
              });
            }
            // Flatten the grouped and sorted relations into a single array
            sortedRelations = Object.values(groupedRelations).flat();
            // relationLocalForage Set Item
            await relationLocalForage.setItem(entryId + "-" + entryType, {
              relations: sortedRelations,
              time: Date.now(),
            });
            relationCache = await relationLocalForage.getItem(entryId + "-" + entryType);
          }
        }
        if (relationCache && relationTarget) {
          $('h2:contains("Related Entries"):last').parent().find('a').remove();
          $('h2:contains("Related Entries"):last').text("Relations");
          document.querySelector("#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel > table").style.overflow = "visible";
          relationTarget.classList.add("relationsTarget");
          relationTarget.style.setProperty('padding', '10px', 'important');
          relationTarget.classList.add("spaceit-shadow");
          relationTarget.innerHTML = relationCache.relations
            .map((node) => {
              const isManga = node.node.type === "MANGA";
              const typePath = isManga ? "manga" : "anime";
              const format = node.node.format ? (node.node.format === "NOVEL" ? node.node.format = "LIGHT NOVEL" : node.node.format.replace('_', ' ')) : node.node.type;
              const coverImage = node.node.coverImage && node.node.coverImage.large ? node.node.coverImage.large : node.node.coverImage.medium ? node.node.coverImage.medium : "";
              const borderColor = isManga ? "#92d493" : "#afc7ee";
              const relationType = node.relationType.split("_").join(" ");
              const title = node.node.title && node.node.title.romaji ? node.node.title.romaji : "";
              const year = node.node.type === "MANGA" && node.node.startDate && node.node.startDate.year
                ? node.node.startDate.year + ' · '
                : node.node.seasonYear
                  ? node.node.seasonYear + ' · '
                  : node.node.startDate && node.node.startDate.year
                    ? node.node.startDate.year + ' · '
                    : "";
              const status = node.node.status ? node.node.status.split("_").join(" ") : "";
              return `
            <div class='relationEntry'><a class='link' href='/${typePath}/${node.node.idMal}/'>
            <img class='relationImg' src='${coverImage}' alt='${title}' />
            <span class='relationTitle' style='border-color: ${borderColor}!important;'>${relationType}</span>
            <div class='relationDetails' style='color: ${borderColor}!important;'>
            ${relationType}
            <br>
            <div class='relationDetailsTitle'>${title}</div>
            ${format} · ${year}${status}
            </div></a></div>`;
            })
            .join("");

          function relationDetailsShow() {
            $(".relationEntry").on('mouseenter', async function () {
              const el = $(this);
              const elDetails = $(this).find(".relationDetails");
              const viewportWidth = window.innerWidth;
              const divRect = elDetails[0].getBoundingClientRect();
              const isOverflowing = divRect.left < 0 || divRect.right > viewportWidth;
              if (isOverflowing) {
                $(el).addClass("relationEntryRight");
                $(elDetails).addClass("relationDetailsRight");
              } else {
                $(el).removeClass("relationEntryRight");
                $(elDetails).removeClass("relationDetailsRight");
              }
            })
            $(".relationEntry").on('mouseleave', async function () {
              const el = $(this);
              const elDetails = $(this).find(".relationDetails");
              $(el).removeClass("relationEntryRight");
              $(elDetails).removeClass("relationDetailsRight");
            })
          }

          relationDetailsShow();
          if (relationTarget.clientHeight > 144) {
            relationHeight = relationTarget.clientHeight;
            const extraRelations = relationTarget.querySelectorAll(".relationEntry");
            relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
            for (let i = 0; i < extraRelations.length; i++) {
              if (relationTarget.clientHeight > 144) {
                extraRelationsDiv.appendChild(relationTarget.querySelector(".relationEntry:last-child"));
              }
            }
            relationTarget.append(extraRelationsDiv);
            const extraDivs = Array.from(extraRelationsDiv.children);
            const reversedDivs = extraDivs.reverse();
            extraRelationsDiv.innerHTML = '';
            reversedDivs.forEach(div => extraRelationsDiv.appendChild(div));
            relationTarget.insertAdjacentElement("afterend", relationTargetExpand);
            relationTarget.querySelector("div:nth-child(1)").style.marginLeft = "8px";
            extraRelationsDiv.setAttribute('style', 'display:none!important');
            relationTarget.setAttribute('style', 'margin-bottom:5px;padding:12px 4px!important');
            relationTargetExpand.addEventListener('click', function () {
              if (document.querySelector(".relationsExpanded").style.display === 'none') {
                document.querySelector(".relationsExpanded").setAttribute('style', 'display:flex!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
              } else {
                document.querySelector(".relationsExpanded").setAttribute('style', 'display:none!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
              }
            });
          }

          // Filter Replaced Relations
          let filterTarget = document.querySelector('.RelatedEntriesDiv .floatRightHeader');
          if (filterTarget && svar.relationFilter && svar.animeRelation) {
            let filtered;
            const relationDefault = relationTarget.innerHTML;
            const relationFilter = create('div', { class: 'relations-filter' });
            relationFilter.innerHTML = '<label for="relationFilter"></label><select id="relationFilter">' +
              '<option value="">All</option><option value="ADAPTATION">Adaptation</option><option value="PREQUEL">Prequel</option>' +
              '<option value="SEQUEL">Sequel</option><option value="PARENT">Parent</option><option value="ALTERNATIVE">Alternative</option><option value="SUMMARY">Summary</option>' +
              '<option value="SIDE STORY">Side Story</option><option value="SPIN OFF">Spin Off</option><option value="CHARACTER">Character</option><option value="OTHER">Other</option></select>';
            filterTarget.append(relationFilter);
            extraRelationsDiv.setAttribute('style', 'display: flex!important;height: 0px;overflow: hidden;');

            function filterRelations(title) {
              if (!relationFilter.children[1].value.length) {
                relationTarget.innerHTML = relationDefault;
                filtered = 0;
              } else {
                if (!filtered) {
                  relationTarget.innerHTML = relationDefault + extraRelationsDiv.innerHTML;
                  filtered = 1;
                }
              }

              const entries = document.querySelectorAll('.relationEntry');
              for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (filtered) {
                  entry.style.marginLeft = "0";
                }
                const relationTitle = entry.querySelector('.relationTitle').textContent;
                if (title === "" || relationTitle === title) {
                  entry.style.display = 'block';
                } else {
                  entry.style.display = 'none';
                }
              }

              if (!relationFilter.children[1].value.length) {
                extraRelationsDiv.setAttribute('style', 'display:none!important');
                relationTargetExpand.setAttribute('style', 'display:block!important');
                relationTargetExpand.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
                if (relationHeight) {
                  relationTarget.setAttribute('style', 'margin-bottom: 5px;padding: 12px 4px!important;');
                } else {
                  relationTarget.setAttribute('style', 'padding: 12px 12px!important;');
                }
              } else {
                relationTargetExpand.setAttribute('style', 'display:none!important');
                relationTarget.setAttribute('style', 'padding: 12px 12px!important;');
              }
              relationDetailsShow();
            }

            function updateFilterOptions() {
              const options = document.querySelectorAll('#relationFilter option');
              const titles = Array.from(document.querySelectorAll('.relationTitle')).map(el => el.textContent);
              for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.value !== "") {
                  if (!titles.includes(option.value)) {
                    option.remove();
                  }
                }
              }
              if (document.querySelectorAll('#relationFilter option').length <= 2) {
                document.querySelector('.relations-filter').remove();
              }
              else {
                document.querySelector('.RelatedEntriesDiv').setAttribute('style', 'align-content: center;margin-bottom: 10px;');
                document.querySelector('.RelatedEntriesDiv #related_entries').setAttribute('style', 'margin-top: 10px;');
              }
            }

            document.getElementById('relationFilter').addEventListener('change', function () {
              filterRelations(this.value);
            });
            filterRelations('');
            updateFilterOptions();
          }
        }
      }
    }

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
      if (textfix.includes("No background")) {
        textfix = textfix.replace(/(information here.+)/gm, 'information <a href="/dbchanges.php?aid=' + entryId + '&amp;t=background">here</a>.')
      }
      text.innerHTML = textfix;
      let backgroundInfo = $('h2:contains("Background"):last');
      backgroundInfo.append(text);
      if ($('.SynopsisDiv').next('span').length) {
        $('.SynopsisDiv').next('span').html($('.SynopsisDiv').next('span').html().replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, ''));
      }
      if ($('.SynopsisDiv').next('p').length) {
        $('.SynopsisDiv').next('p').html($('.SynopsisDiv').next('p').html().replace(/(<br>\n<br>\n\[Written by MAL Rewrite\]+)/gm, ''));
      }
    }
    //Custom Cover Add
    if (svar.customCover) {
      getCustomCover("cover");
    }
  }
  //Anime/Manga Section //--END--//

  //Companies add border and shadow
  if (/\/(anime|manga)\/producer\/\d.?([\w-]+)?\/?/.test(current)) {
    let studioDivShadow = $('.mb16:contains("Member"):last');
    if ($(studioDivShadow).length && $(studioDivShadow).children().css('flex') !== '1 1 0%') {
      $(studioDivShadow).children().attr('style', 'background:0!important').wrapAll("<div class='spaceit-shadow-end-div'></div>");
    }
  }

  //People fix details and add shadow
  if (/\/(people)\/.?([\w-]+)?\/?/.test(current)) {
    peopleDetailsAddDiv('Family name:');
    peopleDetailsAddDiv('Website:');
    let peopleDivShadow = document.querySelector("#content > table > tbody > tr > td.borderClass  .spaceit_pad");
    if (peopleDivShadow) {
      $(peopleDivShadow).attr('style', 'background:0!important');
      $(peopleDivShadow).nextUntil('div:not(.spaceit_pad)').attr('style', 'background:0!important').addBack().wrapAll("<div class='spaceit-shadow-end-div'></div>");
      $('div:contains("Website:"):last').html() === 'Website: <a href="http://"></a>' ? $('div:contains("Website:"):last').remove() : null;
      $('div:contains("Family name:"):last').html() === 'Family name: ' ? $('div:contains("Family name:"):last').remove() : null;
      $('span:contains("More:"):last').css({ display: 'block', padding: '2px', marginTop: '5px' });
    }
  }

  //People and Character Name Position Change  //--START--//
  if ((/\/(people)\/.?([\w-]+)?\/?/.test(current) && svar.peopleHeader) || (/\/(character)\/.?([\w-]+)?\/?/.test(current) && svar.characterHeader)) {
    let name = document.querySelector('.h1.edit-info');
    name.getElementsByTagName('strong')[0].style.fontSize = '1.3rem';
    name.setAttribute('style', 'padding-left:5px;padding-top:10px;height:20px');
    document.querySelector('#content').style.paddingTop = '20px';
    let table = document.querySelector('#content > table > tbody > tr > td:nth-child(2)');
    table.prepend(name);
    if (/\/(character)\/.?([\w-]+)?\/?/.test(current) && !(/\/(clubs)/.test(current)) && !(/\/(pics)/.test(current)) && svar.characterHeader) {
      if (!svar.characterNameAlt) {
        name.setAttribute('style', 'line-height:25px');
      }
      let extra = document.querySelector('#content > table > tbody > tr > td.characterDiv > h2 > span > small');
      if (extra) {
        extra.innerText = ' ' + extra.innerText;
      }
      if (svar.characterNameAlt) {
        if (extra) {
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
      }
      document.querySelector('#content > table > tbody > tr > td.characterDiv > h2').remove();
    }
  }
  //People and Character Name Position Change //--END--//

  //Anime and Manga Header Position Change //--START--//
  headerPosChange();
  function headerPosChange(v) {
    if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && (svar.animeHeader || v) &&
      !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current) && !document.querySelector("#content > .error404")) {
      set(1, ".h1.edit-info", { sa: { 0: "margin:0;width:97.5%" } });
      set(1, "#content > table > tbody > tr > td:nth-child(2) > .js-scrollfix-bottom-rel", { pp: { 0: ".h1.edit-info" } });
      const titleOldDiv = document.querySelector("#contentWrapper > div:nth-child(1)");
      if (titleOldDiv && titleOldDiv.innerHTML === '') {
        titleOldDiv.remove();
      }
    }
  }
  //Anime and Manga Header Position Change //--END--//

  //Add BBCode Editor
  if (location.href === 'https://myanimelist.net/myblog.php' ||
    location.href.includes('myblog.php') && location.search.includes('go=edit') ||
    location.href.includes('blog.php') && location.search.includes('eid')) {
    let blogTextArea = document.querySelectorAll('textarea')[0];
    if (blogTextArea) {
      blogTextArea.classList.add("bbcode-message-editor");
    }
  }

  if (location.search.includes("cid") && location.pathname === '/clubs.php' ||
    location.pathname === '/editclub.php' && location.search.includes("&action=details")) {
    let clubTextArea = document.querySelectorAll('textarea')[0];
    if (clubTextArea) {
      clubTextArea.classList.add("bbcode-message-editor");
    }
  }
  if (location.href === 'https://myanimelist.net/editprofile.php' && !location.search) {
    let profileTextArea = document.querySelectorAll('textarea')[1];
    if (profileTextArea) {
      profileTextArea.classList.add("bbcode-message-editor");
    }
  }
  if (location.href === 'https://myanimelist.net/editprofile.php?go=signature') {
    let profileTextArea = document.querySelectorAll('textarea')[0];
    if (profileTextArea) {
      profileTextArea.classList.add("bbcode-message-editor");
    }
  }

  //Clubs Page Fixes
  //Clubs Page add class to Divs
  if (/\/(clubs.php).?([\w-]+)?\/?/.test(current)) {
    $("div.normal_header:contains('Club Members')").next("table").addClass("club-container");
    $("div.bgNone").addClass("club-container");
    $("div.bgColor1").addClass("club-container");
    $('div.normal_header:contains("Club Pictures")').next().children().children().children().addClass("club-container");
    $("#content > table > tbody > tr > td[valign=top]:last-child").addClass("club-container");
    set(2, ".club-container", { sal: { 0: "border-radius:var(--br);overflow:hidden" } });
  }

  //Club Comments Expand
  if (svar.clubComments) {
    if (location.search.includes("cid") && location.pathname === '/clubs.php') {
      document.querySelector("#content > table > tbody > tr").style.display = "inline-block";
      const commHeader = $(".normal_header:contains('Club Comments')");
      const commDiv = $(".normal_header:contains('Club Comments')").next();
      commDiv.css('width', '100%');
      $("#content > table > tbody").append(commHeader, commDiv);
    }
  }

  //Blog Page Fixes
  if (current === "/blog.php" && !location.search && svar.blogContent) {
    getBlogContent();
  }

  if ((/\/(blog)\//.test(current) || /\?eid=/.test(location.search))) {
    if (svar.blogRedesign) {
      //wrap header with a class and add href
      $('.lightLink:not(.lightLink.to-left)').each(function () {
        let headerHref;
        if ($(this).nextAll('.borderClass').children().first().children().eq(1).attr('href')) {
          headerHref = $(this).nextAll('.borderClass').children().first().children().eq(1).attr('href').replace('#comment', '');
        }
        $(this).wrap(function () {
          let hrefAttribute = !/\?eid=/.test(location.search) && headerHref ? `href="${headerHref}"` : '';
          return `<a ${hrefAttribute} class="maljsBlogDivHeader"></a>`;
        });
      });
      $('span.lightLink.to-left').css({ position: "absolute", margin: "-30px 0 0 10px" });
      $('.borderClass').css({ border: "0" });

      //wrap blog Div
      $('.normal_header:not(:contains("Categories"))').each(function () {
        $(this).nextUntil('.borderClass').last('div').addClass('maljsBlogDivContent');
        $(this).nextUntil('.borderClass').wrapAll('<div class="maljsBlogDiv"></div>');
      });

      $('.maljsBlogDivHeader:not(.maljsBlogDiv .maljsBlogDivHeader)').each(function () {
        $(this).nextUntil('.borderClass').last('div').addClass('maljsBlogDivContent');
        $(this).nextUntil('.borderClass').addBack().addBack().wrapAll('<div class="maljsBlogDiv"></div>');
      });

      //wrap relations div
      $('.maljsBlogDiv div:contains("Relations:")').wrap('<div class="maljsBlogDivRelations"></div>');
    }
  }

  //blog fix for anisongs
  if ((/\/(blog.php)/.test(current) || /\/(blog)\//.test(current)) && !/\?eid=/.test(location.search)) {
    $('#content div > div:contains("Relations:") > a').not('.maljsBlogDivHeader').not('.maljsBlogDivContent').each(function () {
      let href = $(this).attr('href');
      if (href && !href.endsWith('/')) {
        $(this).attr('href', href + '/');
      };
    });
  } else if (/\/(blog.php)/.test(current) && /\?eid=/.test(location.search)) {
    $('#content div:contains("Relations:") > a').not('.maljsBlogDivHeader').not('.maljsBlogDivContent').each(function () {
      let href = $(this).attr('href');
      if (href && !href.endsWith('/')) {
        $(this).attr('href', href + '/');
      };
    });
  };

  //Anime-Manga Background Color from Cover Image //--START--//
  if (!/\d*\/\w*\/episode\/(\d*)\/edit/.test(location.href)
    && !location.href.endsWith('/episode/new')
    && !location.href.endsWith('/edit/staff')
    && !location.href.endsWith('/edit/character')
    && /myanimelist.net\/(anime|manga|character|people)\/?([\w-]+)?\/?/.test(location.href)
    && !document.querySelector("#content > .error404")) {
    let m;
    if (
      /\/(character.php)\/?([\w-]+)?/.test(current) ||
      /\/(people)\/?([\w-]+)?\/?/.test(current) ||
      /\/(anime|manga)\/producer|season|genre|magazine\/.?([\w-]+)?\/?/.test(current) ||
      /\/(anime|manga)\/adapted.?([\w-]+)?\/?/.test(current) ||
      /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(current) ||
      (/\/(character)\/?([\w-]+)?\/?/.test(current) && !svar.charBg) ||
      (/\/(anime|manga)\/?([\w-]+)?\/?/.test(current) && !svar.animeBg)
    ) {
      m = 1
    }
    if (!m) {
      if (!defaultMal) {
        styleSheet2.innerText = styles2;
        document.head.appendChild(styleSheet2);
      }
      const coverLocalForage = localforage.createInstance({ name: "MalJS", storeName: "cover" });
      const colorThief = new ColorThief();
      let img, dominantColor, palette, paletteFetched, listenerAdded, coverCache;
      let colors = [];
      let img2 = new Image();

      async function bgColorFromImage(img) {
        if (!paletteFetched) {
          if (!palette) {
            try {
              img.crossOrigin = 'anonymous';
              palette = colorThief.getPalette(img, 10, 5);
              paletteFetched = true;
            } catch (error) {
              img.crossOrigin = '';
              await delay(150);
              return;
            }
          }
        }
        if (paletteFetched) {
          colors = [];
          for (let i = 0; i < palette.length; i++) {
            let color = tinycolor(`rgba(${palette[i][0]}, ${palette[i][1]}, ${palette[i][2]}, 1)`);
            while (color.getLuminance() > 0.08) {
              color = color.darken(1);
            }
            while (color.getLuminance() < 0.04) {
              color = color.brighten(1);
            }
            colors.push(color);
          }
          document.body.style.setProperty('background', `linear-gradient(180deg, ${colors[2]} 0%, ${colors[1]} 50%, ${colors[0]} 100%)`, 'important');
        }
      }

      addLoading();
      waitForCoverImage();

      async function waitForCoverImage() {
        if (!coverCache) {
          coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
        }
        if (svar.customCover && coverCache) {
          img = document.querySelector('img[customCover]');
        } else {
          img = document.querySelector('div:nth-child(1) > a > img');
        }
        if (img && $(img).attr('style') !== "position: fixed;opacity:0!important;") {
          set(0, img, { sa: { 0: "position: fixed;opacity:0!important;" } });
        }
        if (img && img.src && img.width && img.complete) {
          set(0, img, { sa: { 0: "position: relative;opacity:1!important;" } });
          img2.src = img.src;
          if (!listenerAdded) {
            img.addEventListener("load", function () {
              img2.src = img.src;
            });
            img2.addEventListener("load", function () {
              paletteFetched = false;
              palette = 0;
              bgColorFromImage(img2);
            });
            listenerAdded = 1;
          }
        } else {
          await delay(150);
          await waitForCoverImage();
        }
      }
    }
  }
  //Anime-Manga Background Color from Cover Image //--END--//

  if (svar.animeSongs) {
    //Anisongs for MAL //--START--//
    //fork of anisongs by morimasa
    //https://greasyfork.org/en/scripts/374785-anisongs
    const anisongs_temp = {
      last: null,
      target: null,
      id: null,
    };
    anisong();
    function anisong() {
      const songCache = localforage.createInstance({ name: "MalJS", storeName: "anisongs" });
      let currentpath = current.match(/(anime|manga)\/([0-9]+)\/*\/?(.*)/) &&
        !/\/(ownlist|season|recommendations)/.test(current) &&
        !document.querySelector("#content > .error404") &&
        !current.split('/')[4] &&
        !/\/(anime|manga)\/producer|genre|magazine|adapted\/.?([\w-]+)?\/?/.test(current) ? current.match(/(anime|manga)\/([0-9]+)\/*\/?(.*)/) : null;
      if (currentpath && currentpath[1] === "anime") {
        anisongs_temp.id = currentpath[2];
        anisongs_temp.target = document.querySelector('.rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)');
        if (anisongs_temp.last !== anisongs_temp.id) {
          if (anisongs_temp.target) {
            anisongs_temp.last = anisongs_temp.id;
            launch(anisongs_temp.id);
          } else {
            setTimeout(anisong, 500);
          }
        }
      } else if (currentpath && currentpath[1] === "manga") {
        cleaner(anisongs_temp.target);
        anisongs_temp.last = 0;
      } else {
        anisongs_temp.last = 0;
      }
      const options = { cacheTTL: 604800000, class: "anisongs" };
      let anisongdata, op1, ed1;
      const API = {
        //Get Songs from JikanAPI
        async getSongs(mal_id) {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${anisongs_temp.id}/themes`);
          return res.json();
        },
        //Get Videos from AnimeThemesAPI
        async getVideos(anilist_id) {
          const include = ['animethemes.animethemeentries.videos', 'animethemes.song', 'animethemes.song.artists'].join(',');
          const res = await fetch(`https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=MyAnimeList&filter[external_id]=${anisongs_temp.id}&include=${include}`);
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
          const { anime } = await API.getVideos(this.id);
          if (anime.length === 0) {
            return {
              OP: [],
              ED: [],
            };
          }
          //Sort and Remove Dubbed OP-ED
          let d = anime ? anime[0].animethemes.sort((a, b) => a.sequence - b.sequence) : null;
          let t = [];
          for (let x = 0; x < d.length; x++) {
            let reg = /Dubbed/;
            if (d[x].group && !d[x].group.match(reg)) {
              t.push(d[x]);
            }
            else if (!d[x].group) {
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
              let u = null;
              for (let x = 0; x < videos.length; x++) {
                let vid = videos[x];
                let link = vid.animethemeentries[0].videos[0] && vid.animethemeentries[0].videos[0].link ? vid.animethemeentries[0].videos[0].link : null;
                let m = 0;
                let title = cleanTitle(e).replace(/(\w\d+\: |)/gm, '').replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g, '').replace(/(.*)( by )(.*)/g, '$1')
                  .replace(/(.*)( feat. | ft. )(.*)/g, '$1').replace(/(Produced|\WProduced)/g, '').replace(/["']/g, '').replace(/<.*>/g, '').replace(/[^\w\s\(\)\[\]\,\-\:]/g, '').trim();
                let title2 = vid.song.title ? vid.song.title.replace(/\((?!.*(Ver\.|ver\.))(.*?)\)+?/g, '').replace(/(.*)( by )(.*)/g, '$1')
                  .replace(/(.*)( feat. | ft. )(.*)/g, '$1').replace(/(Produced|\WProduced)/g, '').replace(/["']/g, '').replace(/<.*>/g, '').replace(/[^\w\s\(\)\[\]\,\-\:]/g, '').trim() : null;
                let ep = cleanTitle(e).replace(/(.*).((eps|ep) (\w.*\ |)(.*)\))/gm, '$5').replace(/\s/g, '');
                let epdata = vid.animethemeentries[0].episodes;
                let ep2 = epdata && (epdata.constructor !== Array || epdata.length === 1) ? (epdata.constructor !== Array ? epdata.replace(/\s/g, '') : epdata) : null;
                let eps = [];
                if (vid.animethemeentries.length > 1) {
                  for (let y = 0; y < vid.animethemeentries.length; y++) {
                    eps.push(vid.animethemeentries[y].episodes);
                  }
                  eps = eps.join("-").split("-").map(Number);
                  eps = eps[0] + "-" + eps[eps.length - 1];
                }
                let artistmatch;
                if (vid.type === "OP" && title) {
                  op1 = title;
                }
                if (vid.type === "ED" && title) {
                  ed1 = title;
                }
                if (m === 0 && vid.sequence) {
                  if (i + 1 === vid.sequence && stringSimilarity(title, vid.song.title) > .8) {
                    u = link;
                    m = 1;
                  }
                  if (i === vid.sequence || i + 1 === vid.sequence || i + 2 === vid.sequence) {
                    if (stringSimilarity(title, title2) > .8) {
                    }
                  }
                }
                if (m === 0 && vid.song.artists !== null && vid.song.artists[0] && vid.song.title !== null) {
                  let artist = cleanTitle(e).replace(/\(([^CV: ].*?)\)+?/g, '').replace(/(.*)( by )(.*)/g, '$3').replace(/( feat\. | feat\.| ft\. )/g, ', ').replace(/["']/g, '').replace(/\s\[.*\]/gm, '').trim();
                  let artistv2 = artist.replace(/(\w.*)( x )(\w.*)/g, '$1');
                  let artist2 = cleanTitle(e).replace(/(.*)by \w.*\(([^eps ].*?)\)(.*(eps |ep ).*)/g, '$2').replace(/( feat\. | feat\.| ft\. )/g, ', ').replace(/["']/g, '').replace(/\s\[.*\]/gm, '').trim();
                  let artists = [];
                  let matches = [];
                  let match;
                  for (let y = 0; y < vid.song.artists.length; y++) {
                    artists.push(vid.song.artists[y].name.replace(/\((.*?)\).?/g, '').replace(/(.*)( by )(.*)/g, '$3').replace(/( feat\. | feat\.| ft\. )/g, ', ').replace(/["']/g, '').replace(/\s\[.*\]/gm, '').trim())
                  }
                  artists = artists.join(", ");
                  const cv = /\(CV: ([^\)]+)\)/g;
                  if (artist.match(cv)) {
                    while ((match = cv.exec(artist)) !== null) {
                      matches.push(match[1]);
                    }
                    matches = matches.join(", ");
                  }
                  if (m === 0 && (
                    stringSimilarity(artist, artists) > .82 || stringSimilarity(artist2, artists) > .9 ||
                    stringSimilarity(artistv2, artists) > .9 || matches.length > 0 && stringSimilarity(artists, matches) > .82)) {
                    artistmatch = 1;
                    if (stringSimilarity(title, vid.song.title) > .8 || i === vid.sequence && stringSimilarity(title, title2) > .8 || !vid.sequence && stringSimilarity(title, title2) > .8) {
                      u = link;
                      m = 1;
                    }
                  }
                }
                if (m === 0 && !vid.song.artists.length && vid.song.title !== null) {
                  if (stringSimilarity(title, vid.song.title) > .8 || i === vid.sequence && stringSimilarity(title, title2) > .8 || !vid.sequence && stringSimilarity(title, title2) > .8) {
                    u = link;
                    m = 1;
                  }
                }
                if (m === 0 && (ep === ep2 || ep === eps)) {
                  u = link;
                  m = 1;
                }
                if (m === 0 && (vid.sequence && artistmatch && vid.slug && videos.length < 10 || !vid.sequence && vid.slug && videos.length < 10)) {
                  if (anisongdata && anisongdata.openings.length > 0 && vid.type === "OP") {
                    let n = vid.slug.replace(/(OP)(.*\d)(.*)/g, '$2');
                    if (n === (i + 1).toString() && (!vid.sequence || artistmatch && i + 1 === vid.sequence)) {
                      u = link;
                      m = 1;
                    }
                  }
                  if (anisongdata && anisongdata.endings.length > 0 && vid.type === "ED" && ed1 !== undefined && op1 !== undefined && ed1 !== op1) {
                    let n = vid.slug.replace(/(ED)(.*\d)(.*)/g, '$2');
                    if (!vid.sequence && n === (i + 1).toString() || artistmatch && n === (i + 1).toString() && i + 1 === vid.sequence) {
                      u = link;
                      m = 1;
                    }
                  }
                }
                if (m === 0 && artistmatch && videos.length === 1) {
                  u = link;
                  m = 1;
                }
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
          let song = create('div', { class: 'song', }, '',);
          parent.append(song);
        } else {

          songs.forEach((song, i) => {
            song.title = song.title.replace(/(".*")/, '<b>' + '$1' + '</b>');
            const txt = `${i + 1}. ${song.title || song}`;
            const node = create('div', { class: 'theme-songs js-theme-songs', }, txt,);
            parent.appendChild(node);
            if (song.url) {
              let play = create('div', { class: 'oped-preview-button oped-preview-button-gray' });
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
        $('.rightside.js-scrollfix-bottom-rel div.di-t > .di-tc.va-t:has(h2)').remove();
        set(1, '.rightside.js-scrollfix-bottom-rel div.di-t:not(.w100)', {
          sa: {
            0: 'display: grid!important;grid-template-columns: 1fr 1fr;grid-column-gap: 10px;',
          },
        });
        $('.rightside.js-scrollfix-bottom-rel .di-b.ar').remove();
      }

      function placeData(data) {
        let nt = create('div', { class: 'theme-songs js-theme-songs', });
        let nt2 = nt.cloneNode(true);
        cleaner(anisongs_temp.target);
        let op = createTargetDiv('Openings', anisongs_temp.target, 0);
        if (data.opening_themes.length === 1) {
          op.children[0].innerText = 'Openings';
        }
        if (data.opening_themes.length === 0) {
          op.append(nt);
          nt.innerHTML = 'No opening themes have been added to this title. Help improve our database by adding an opening theme ' +
            "<a class='embed-link' href='https://myanimelist.net/dbchanges.php?aid=" + anisongs_temp.id + "&t=theme'>" + 'here' + '</a>';
        }
        let ed = createTargetDiv('Endings', anisongs_temp.target, 1);
        if (data.ending_themes.length === 1) {
          ed.children[0].innerText = 'Endings';
        }
        if (data.ending_themes.length === 0) {
          ed.append(nt2);
          nt2.innerHTML = 'No ending themes have been added to this title. Help improve our database by adding an ending theme ' +
            "<a class='embed-link' href='https://myanimelist.net/dbchanges.php?aid=" + anisongs_temp.id + "&t=theme'>" + 'here' + '</a>';
        }
        insert(data.opening_themes, op);
        insert(data.ending_themes, ed);

        async function addAccordion(div) {
          const aniSongsDiv = document.querySelector(div);
          const themeSongs = aniSongsDiv.querySelectorAll(".theme-songs");
          if (themeSongs.length > 4) {
            const accordionButton = create('a', { class: 'anisong-accordion-button', style: { display: "none" } });
            const extraSongs = create('div', { class: 'anisong-extra-songs', style: { display: "none" } });
            accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
            for (let i = 4; i < themeSongs.length; i++) {
              extraSongs.appendChild(themeSongs[i]);
            }
            aniSongsDiv.append(extraSongs, accordionButton);
            accordionButton.style.display = 'block';
            accordionButton.addEventListener('click', function () {
              if (extraSongs.style.display === 'none') {
                extraSongs.style.display = 'block';
                accordionButton.innerHTML = '<i class="fas fa-chevron-up mr4"></i>\nShow Less\n';
              } else {
                extraSongs.style.display = 'none';
                accordionButton.innerHTML = '<i class="fas fa-chevron-down mr4"></i>\nShow More\n';
              }
            });
          }
          for (let x = 0; x < themeSongs.length; x++) {
            const favorite = create('div', { class: 'fav fa-star' }, '',);
            favorite.onclick = async () => {
              if (!$(favorite).parent().find('video').length) {
                $(favorite).parent().find('.oped-preview-button').click();
              }
              const animeTitle = $('.title-name').text() ? $('.title-name').text() : document.title.replace(/(.*)(\|.*)/, '$1').replace(/(.*)(\(.*\).*)/, '$1').trim();
              const title = $(favorite).parent().text().substring(2);
              const type = $(favorite).parent().prev("h2").text();
              const src = $(favorite).parent().find('video').attr('src');
              let img;
              async function imgLoad() {
                img = document.querySelector('div:nth-child(1) > a > img');
                set(0, img, { sa: { 0: "position: fixed;opacity:0!important;" } });
                if (img && img.src) {
                  set(0, img, { sa: { 0: "position: relative;opacity:1!important;" } });
                }
                else {
                  await delay(250);
                  await imgLoad();
                }
              }
              await imgLoad();
              const favArray = [
                {
                  animeTitle: animeTitle,
                  animeImage: img.src,
                  animeUrl: anisongs_temp.id,
                  songTitle: title.replace(/(\(eps \d.*\))/, ''),
                  songSource: src,
                  themeType: (type === "Openings" ? "OP" : "ED")
                }
              ];
              const compressedBase64 = LZString.compressToBase64(JSON.stringify(favArray));
              const base64url = compressedBase64.replace(/\//g, '_');
              editAboutPopup(`favSongEntry/${base64url}`, 'favSongEntry');
              $(favorite).parent().find('.oped-preview-button').click();
            }
            if (themeSongs[x].className === 'theme-songs js-theme-songs has-video' && headerUserName !== '') {
              themeSongs[x].append(favorite);
            }
          }
        }
        addAccordion('div.di-t > div.anisongs:nth-child(1)');
        addAccordion('div.di-t > div.anisongs:nth-child(2)');
        let aniSongsMainDiv = document.querySelector("div.di-t:has(.anisongs)");
        if (aniSongsMainDiv) {
          let lastCheck = nativeTimeElement(Math.floor(data.time / 1000));
          let AniSongsReCheck = create("i", { class: "fa-solid fa-rotate-right", style: { cursor: "pointer", color: "var(--color-link)" } });
          let AniSongsFooter = create('div', { class: 'anisongs-footer', style: { textAlign: "right", marginRight: "5px" } }, 'Themes provided from ' +
            '<a href="https://animethemes.moe/">AnimeThemes.moe</a><br>' + 'Last Update: ' + lastCheck + ' ');
          AniSongsFooter.append(AniSongsReCheck);
          AniSongsReCheck.onclick = () => {
            songCache.removeItem(anisongs_temp.id);
            window.location.reload();
          }
          aniSongsMainDiv.append(AniSongsFooter);
        }
      }
      async function launch(currentid) {
        // get from cache and check TTL
        const cache = (await songCache.getItem(currentid)) || {
          time: 0,
        };
        if (cache.time + options.cacheTTL < Date.now()) {
          let mal_id = currentid;
          let status;
          let _videos;
          const apiUrl = `https://api.jikan.moe/v4/anime/${currentid}`;
          await fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              status = data.data.status;
            });
          if (mal_id && ['Finished Airing', 'Currently Airing'].includes(status)) {
            const { data } = await API.getSongs(mal_id);
            let { openings: opening_themes, endings: ending_themes } = data;
            // add songs to cache if they're not empty and query videos
            if (opening_themes.length || ending_themes.length) {
              if (['Finished Airing', 'Currently Airing'].includes(status)) {
                try {
                  anisongdata = data;
                  _videos = await new Videos(currentid).get();
                  opening_themes = Videos.merge(opening_themes, _videos.OP);
                  ending_themes = Videos.merge(ending_themes, _videos.ED);
                } catch (e) {
                  console.log('Anisongs', e);
                }
              }
              if (_videos) {
                await songCache.setItem(currentid, { opening_themes, ending_themes, time: Date.now() });
              }
            }
            // place the data onto site
            if (await songCache.getItem(currentid)) {
              placeData({
                opening_themes,
                ending_themes,
              });
            };
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
  }
})();
