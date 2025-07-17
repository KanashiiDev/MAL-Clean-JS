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
    const loading = create("div", { class: "user-history-loading actloading" }, translate("$loading") + '<i class="fa fa-circle-o-notch fa-spin malCleanSpinner"></i>');
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
      const urlFix = new URL(url);
      const urlId = urlFix.searchParams.get("id");
      if (urlId) {
        const type = urlFix.pathname.includes("anime") ? "anime" : "manga";
        url = `/${type}/${urlId}/`;
      }
      id = item[x].querySelector("a").href.split("=")[1];
      title = item[x].querySelector("a").outerHTML;
      titleText = item[x].querySelector("a").innerText.trim();
      ep = item[x].querySelector("strong").innerText;
      date = item[x].parentElement.children[1].innerText.split("Edit").join("").trim();
      datenew = date.includes("Yesterday") || date.includes("Today") || date.includes("hour") || date.includes("minutes") || date.includes("seconds") ? true : false;
      date = datenew ? date : /\b\d{4}\b/.test(date) ? date : date + " " + new Date().getFullYear();
      let dat = create("div", { class: "user-history" });
      let name = create("div", { class: "user-history-title" });
      let timestamp = new Date(date).getTime();
      const timestampSeconds = Math.floor(timestamp / 1000);
      let historydate = create("div", { class: "user-history-date", title: date }, datenew ? date : nativeTimeElement(timestampSeconds));
      let apiUrl = `https://api.jikan.moe/v4/anime/${id}`;
      if (type === "anime") {
        name.innerHTML = `Watched episode ${ep} of <a href="${url}">${titleText}</a>`;
      } else {
        apiUrl = `https://api.jikan.moe/v4/manga/${id}`;
        name.innerHTML = `Read chapter ${ep} of <a href="${url}">${titleText}</a>`;
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
        historylink = create("a", { class: "user-history-cover-link", href: url });
        historyimg = create("img", { class: "user-history-cover lazyload", alt: titleText, src: "https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: oldimg });
        wait = 99; // If already exists, reduce wait time
      } else {
        wait = 999; // If new title, increase wait time
        await getimg(url);
        historylink = create("a", { class: "user-history-cover-link", href: url });
        historyimg = create("img", { class: "user-history-cover lazyload", alt: titleText, src: "https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif", ["data-src"]: oldimg });
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
  if (document.querySelector("#statistics")) {
    gethistory();
  }
}
