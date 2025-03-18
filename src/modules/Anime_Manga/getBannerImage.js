async function getBannerImage() {
  let bannerData;
  const bannerDiv = create("div", { class: "bannerDiv" });
  const bannerImage = create("img", { class: "bannerImage" });
  const bannerShadow = create("div", { class: "bannerShadow" });
  const bannerTarget = document.querySelector("#content");
  const BannerLocalForage = localforage.createInstance({ name: "MalJS", storeName: "banner" });
  const BannerCache = await BannerLocalForage.getItem(entryId + "-" + entryType);
  const leftSide = document.querySelector("#content > table > tbody > tr > td:nth-child(1)");
  if (BannerCache) {
    bannerData = BannerCache;
  } else {
    bannerData = await aniAPIRequest();
    if (bannerData?.data.Media && bannerData.data.Media.bannerImage) {
      await BannerLocalForage.setItem(entryId + "-" + entryType, {
        bannerImage: bannerData.data.Media.bannerImage,
      });
      bannerData = await BannerLocalForage.getItem(entryId + "-" + entryType);
    } else {
      bannerData = null;
    }
  }
  if (bannerData && bannerData?.bannerImage && bannerTarget && leftSide) {
    let bgColor = getComputedStyle(document.body);
    bgColor = tinycolor(bgColor.getPropertyValue("--bg"));
    const bannerHover = create("div", { class: "bannerHover" });
    const bannerShadowColor = [bgColor.setAlpha(0.1).toRgbString(), bgColor.setAlpha(0.0).toRgbString(), bgColor.setAlpha(0.6).toRgbString()];
    bannerShadow.style.background = `linear-gradient(180deg,${bannerShadowColor[0]},${bannerShadowColor[1]} 50%,${bannerShadowColor[2]})`;
    leftSide.classList.add("aniLeftSide");
    bannerImage.src = bannerData.bannerImage;
    bannerDiv.append(bannerImage, bannerHover, bannerShadow);
    bannerTarget.prepend(bannerDiv);
    svar.animeHeader = true;
    headerPosChange(1);
    document.querySelector("td.borderClass.aniLeftSide").style.borderWidth = "0";
    if (svar.animeBannerMove) {
      bannerHover.remove();
      leftSide.style.top = "0";
    } else {
      $(bannerHover).on("mouseenter", async function () {
        leftSide.style.top = "0";
      });
      $(bannerHover).on("mouseleave", async function () {
        leftSide.style.top = "-85px";
      });
    }
  }
}
