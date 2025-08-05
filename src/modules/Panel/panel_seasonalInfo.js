if (svar.animeInfo && location.pathname === "/") {
  //Get Seasonal Anime and add info button
  if (document.querySelector(".widget.seasonal.left")) {
    try {
      const i = document.querySelectorAll(".widget.seasonal.left .btn-anime");
      i.forEach((info) => {
        let ib = create("i", {
          class: "fa more-info-button fa-info-circle",
        });
        info.prepend(ib);
      });

      // info button click event for seasonal anime
      $(".widget.seasonal.left i").on("click", async function () {
        createInfo($(this), ".widget.seasonal.left");
      });

      // Add info button to auto recommendations
      const recDiv = await waitForElement(".js-auto-recommendation .item");
      if (recDiv) {
        const i = document.querySelectorAll(".js-auto-recommendation .item");
        i.forEach((info) => {
          let ib = create("i", {
            class: "fa more-info-button fa-info-circle",
          });
          $(info).addClass("link");
          $(info).wrapAll("<div class='rec-info-wrapper btn-anime'></div>").parent().prepend(ib);
        });

        // info button click event for recommendations
        $(".widget.anime_suggestions.left .rec-info-wrapper.btn-anime i").on("click", async function () {
          createInfo($(this), ".widget.anime_suggestions.left", 0);
        });
        $(".widget.manga_suggestions.left .rec-info-wrapper.btn-anime i").on("click", async function () {
          createInfo($(this), ".widget.manga_suggestions.left", 1);
        });
      }
    } catch (error) {
      console.error("AnimeInfo Error:", error);
    }
  }
}
