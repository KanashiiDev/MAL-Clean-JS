async function findCustomCSS() {
  if (!customCSS) return;

  let customCSSData = Array.isArray(customCSS) ? customCSS[0] : customCSS;
  let customCSSModern = Array.isArray(customCSS) ? customCSS[1] : null;

  if (svar.customCSS && customCSSModern) {
    svar.autoModernLayout = false;
  }

  if (customCSSData) {
    const styleElement = create(
      "style",
      { id: "customCSSFix" },
      `#currently-popup, .malCleanMainHeader, .malCleanMainContainer { background: #121212 !important;}
      #currently-popup .dataTextButton,.mainbtns {background-color: var(--color-foreground)!important;}`
    );

    document.head.appendChild(styleElement);
    document.querySelectorAll("style").forEach((style) => {
      if (style.innerHTML.includes("--fg:") || style.innerHTML.includes("--color-foreground2:")) {
        style.innerHTML = "";
      }
    });
  }

  if (styles) {
    let styleSheet = create("style", { id: "customCSS" }, styles);
    document.head.appendChild(styleSheet);
  }
  if ($("html").hasClass("dark-mode")) {
    styleSheet.innerText = styles + defaultColors + defaultCSSFixes;
    defaultMal = 1;
  } else {
    styleSheet.innerText = styles + defaultColorsLight + defaultCSSFixes;
    defaultMal = 1;
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
