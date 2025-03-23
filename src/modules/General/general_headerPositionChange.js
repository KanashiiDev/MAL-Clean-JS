//People and Character Name Position Change
if ((pageIsPeople && svar.peopleHeader) || (pageIsCharacter && svar.characterHeader)) {
  let name = document.querySelector(".h1.edit-info");
  name.getElementsByTagName("strong")[0].style.fontSize = "1.3rem";
  name.setAttribute("style", "padding-left:5px;padding-top:10px;height:20px");
  document.querySelector("#content").style.paddingTop = "20px";
  let table = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
  table.prepend(name);
  if (/\/(character)\/.?([\w-]+)?\/?/.test(current) && !/\/(clubs)/.test(current) && !/\/(pics)/.test(current) && svar.characterHeader) {
    if (!svar.characterNameAlt) {
      name.setAttribute("style", "line-height:25px");
    }
    let extra = document.querySelector("#content > table > tbody > tr > td.characterDiv > h2 > span > small");
    if (extra) {
      extra.innerText = " " + extra.innerText;
    }
    if (svar.characterNameAlt) {
      if (extra) {
        document.querySelector(".h1.edit-info > div.h1-title > h1").append(extra);
        extra.style.lineHeight = "20px";
        if (name.children[0].children[0].children[0].innerText.match(/".*"/gm)) {
          const sanitizedContent = DOMPurify.sanitize(name.children[0].children[0].children[0].innerText.match(/".*"/gm).join("<br>"));
          extra.innerHTML = extra.innerHTML + "<br>" + sanitizedContent;
          name.children[0].children[0].children[0].innerText = name.children[0].children[0].children[0].innerText.replace(/".*"/gm, "");
        } else {
          extra.innerHTML = "<br>" + extra.innerHTML;
        }
      }
    }
    document.querySelector("#content > table > tbody > tr > td.characterDiv > h2").remove();
  }
}

//Anime and Manga Header Position Change
function headerPosChange(v) {
  if ((svar.animeHeader || v) && pageIsAniManga) {
    set(1, ".h1.edit-info", { sa: { 0: "margin:0;width:97.5%" } });
    set(1, "#content > table > tbody > tr > td:nth-child(2) > .js-scrollfix-bottom-rel", { pp: { 0: ".h1.edit-info" } });
    const titleOldDiv = document.querySelector("#contentWrapper > div:nth-child(1)");
    if (titleOldDiv && titleOldDiv.innerHTML === "") {
      titleOldDiv.remove();
    }
  }
}
headerPosChange();
