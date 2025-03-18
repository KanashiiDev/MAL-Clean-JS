//Auto Hide/Show Header
function autoHeader() {
  if (svar.headerSlide || svar.headerOpacity) {
    let lastScrollTop = 0;
    const header = document.querySelector("#headerSmall");
    const menu = document.querySelector("#menu");
    let seasonalNav;
    if (header && menu) {
      // Set initial position
      header.style.top = "0";
      menu.style.transition = "top 0.3s ease-in-out";
      header.style.transition = "top 0.3s ease-in-out, background 0.3s ease-in-out";

      window.addEventListener("scroll", () => {
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
        if (/\/(profile)\/.?([\w]+)?\/?/.test(location.pathname) && document.querySelector("#banner") && document.querySelector("#banner").style.background !== "" && svar.headerOpacity) {
          if (scrollTop === 0) {
            header.style.backgroundColor = "var(--fgo)!important";
          } else if (header.style.backgroundColor !== "") {
            header.style.backgroundColor = "";
          }
        }
        if (svar.headerSlide) {
          if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.top = "-50px";
            menu.style.top = "-50px";
            if (seasonalNav) {
              seasonalNav.style.top = "-50px";
            }
          } else {
            // Scrolling up
            header.style.top = "0";
            menu.style.top = "7px";
            if (seasonalNav) {
              seasonalNav.style.top = "0";
            }
          }
        }
        lastScrollTop = scrollTop;
      });
    }
  }
}
autoHeader();
