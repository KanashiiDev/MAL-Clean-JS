async function findCustomCSS() {
  if (!customCSS) return;

  let customCSSData = Array.isArray(customCSS) ? customCSS[0] : customCSS;
  let customCSSModern = Array.isArray(customCSS) ? customCSS[1] : null;
  let customCSSMini = Array.isArray(customCSS) ? customCSS[2] : null;

  if (svar.customCSS && customCSSModern) {
    svar.autoModernLayout = false;
    svar.modernLayout = true;
    defaultMal = false;
  }

  if (svar.customCSS && !customCSSModern) {
    svar.autoModernLayout = true;
    svar.modernLayout = false;
    defaultMal = true;
  }

  if (customCSSData) {
    const styleElement = create(
      "style",
      { id: "customCSSFix" },
      `#currently-popup, .malCleanMainHeader, .malCleanMainContainer { background: #121212 !important;}
      #currently-popup .dataTextButton,.mainbtns {background-color: var(--color-foreground)!important;}`
    );

    document.head.appendChild(styleElement);
    if (!customCSSMini) {
      document.querySelectorAll("style").forEach((style) => {
        if (style.innerHTML.includes("--fg:") || style.innerHTML.includes("--color-foreground2:")) {
          style.innerHTML = "";
        }
      });
    }
  }

  if (styles) {
    let customCSSMain = create("style", { id: "customCSSMain" }, styles);
    document.head.appendChild(customCSSMain);
  }
  if (!customCSSMini) {
    if ($("html").hasClass("dark-mode")) {
      customCSSMain.innerText = styles + defaultColors + defaultCSSFixes;
      defaultMal = 1;
    } else {
      customCSSMain.innerText = styles + defaultColorsLight + defaultCSSFixes;
      defaultMal = 1;
    }
  } else {
    $("style#customCSSFix").remove();
  }

  function injectCustomCSS() {
    if (!customCSSData) return;

    if (customCSSData.match(/^https?:\/\/.*\.css$/)) {
      let cssLink = create("link", { rel: "stylesheet", type: "text/css", href: customCSS });
      document.head.appendChild(cssLink);
    } else if (customCSSData.length < 1e6) {
      let css = create("style", { id: "customCSS" }, customCSSData);
      document.head.appendChild(css);
    }
  }

  injectCustomCSS();
}
