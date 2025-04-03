await startCustomProfile();
//Wait for user image
async function imgLoad() {
  userimg = document.querySelector(".user-image.mb8 > img");
  set(0, userimg, { sa: { 0: "position: fixed;opacity:0!important;" } });

  if (userimg && userimg.src) {
    set(0, userimg, { sa: { 0: "position: relative;opacity:1!important;" } });
  } else if (!document.querySelector(".btn-detail-add-picture.nolink")) {
    await delay(250);
    await imgLoad();
  }
}

async function startCustomProfile() {
  await imgLoad();
  await findCustomAbout();
  await applyAl();

  if (svar.profileHeader && !svar.modernLayout) {
    let title = document.querySelector("#contentWrapper h1");
    title.setAttribute("style", "padding-left: 2px;margin-bottom:5px");
    let table = document.querySelector(".container-right");
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
      $("#user-button-div").after($("#user-badges-div"));
      $("#user-badges-div").after($("#user-mal-badges"));
      if ($("#user-badges-div").next().is("ul")) {
        $("#user-badges-div").css("margin-bottom", "12px");
      }
    }
  }
  await delay(1000);
  addLoading("forceRemove");
}

//Profile Vertical Favs Fix
if ($("#anime_favorites").length && $("#anime_favorites").css("width") <= "191px") {
  $("#user-def-favs h5").attr("style", "padding: 0!important;opacity: 0;height: 0px").text("");
}
