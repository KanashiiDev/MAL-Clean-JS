if (svar.animeInfo && location.pathname === "/") {
  //Get Seasonal Anime and add info button
  if (document.querySelector(".widget.seasonal.left")) {
    const i = document.querySelectorAll(".widget.seasonal.left .btn-anime");
    i.forEach((info) => {
      let ib = create("i", {
        class: "fa fa-info-circle",
        style: { fontFamily: '"Font Awesome 6 Pro"', position: "absolute", right: "3px", top: "3px", padding: "4px", opacity: "0", transition: ".4s", zIndex: "20" },
      });
      info.prepend(ib);
    });

    //info button click event
    $(".widget.seasonal.left i")
      .on("click", async function () {
        infoExit(".widget.seasonal.left", $(this));
        createInfo($(this), ".widget.seasonal.left");
      })
      .on("mouseleave", async function () {
        infoExit(".widget.seasonal.left", $(this));
      });
  }
}
