async function on_load() {
  //Change anime.php and manga.php URLs.
  function replacePHPUrls() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    if (url.pathname === "/anime.php" || url.pathname === "/manga.php") {
      const id = url.searchParams.get("id");
      if (id) {
        const type = url.pathname.includes("anime") ? "anime" : "manga";
        const newUrl = `${url.origin}/${type}/${id}/`;

        if (currentUrl !== newUrl) {
          window.location.replace(newUrl);
        }
      }
    }
  }
  replacePHPUrls();

  //Add MalClean Settings to header dropdown
  let pfHeader = $('li:contains("Account Settings")')[0];
  if (!pfHeader) {
    pfHeader = document.querySelector(".header-profile-dropdown > ul > li:nth-last-child(3)");
  }
  if (pfHeader) {
    let gear = pfHeader.querySelector("a > i");
    let gearClone = gear.cloneNode(!0);
    stLink.prepend(gearClone);
    stButton.append(stLink);
    pfHeader.insertAdjacentElement("afterend", stButton);
  }

  if (svar.customCover) {
    await loadCustomCover();
  }
  if ((svar.customCharacterCover && (/\/(profile)\/.?([\w]+)?\/?/.test(current) || $(".detail-characters-list").length)) || current.endsWith("/characters") || current.endsWith("/character.php")) {
    await loadCustomCover(1, "character");
  }

  if ($("#loadingDiv").length) {
    addLoading("remove");
  }
}
if (document.readyState === "complete") {
  on_load();
} else {
  window.addEventListener("load", on_load);
}
