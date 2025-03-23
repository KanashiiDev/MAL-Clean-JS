//Anime-Manga Background Color from Cover Image
async function colorFromCover() {
  if (
    !/\d*\/\w*\/episode\/(\d*)\/edit/.test(location.href) &&
    !location.href.endsWith("/episode/new") &&
    !location.href.endsWith("/edit/staff") &&
    !location.href.endsWith("/edit/character") &&
    /myanimelist.net\/(anime|manga|character|people)\/?([\w-]+)?\/?/.test(location.href) &&
    !document.querySelector("#content > .error404")
  ) {
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
      m = 1;
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
              img.crossOrigin = "anonymous";
              palette = colorThief.getPalette(img, 10, 5);
              paletteFetched = true;
            } catch (error) {
              img.crossOrigin = "";
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
          document.body.style.setProperty("background", `linear-gradient(180deg, ${colors[2]} 0%, ${colors[1]} 50%, ${colors[0]} 100%)`, "important");
        }
      }
      async function waitForCoverImage() {
        if (!coverCache) {
          coverCache = await coverLocalForage.getItem(entryId + "-" + entryType);
        }
        if (svar.customCover && coverCache) {
          img = document.querySelector("img[customCover]");
        } else {
          img = document.querySelector("div:nth-child(1) > a > img");
        }
        if (img && $(img).attr("style") !== "position: fixed;opacity:0!important;") {
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
      addLoading();
      waitForCoverImage();
    }
  }
}
