async function getAiringTime() {
  if ($(".InformationDiv").length > 0) {
    let informationDiv = defaultMal ? $(".InformationDiv").nextAll() : $(".InformationDiv").next().children();
    let InformationAiring = informationDiv.children('.dark_text:contains("Status")').parent();
    if (InformationAiring.length > 0) {
      InformationAiring = InformationAiring.text()
        .replace(/Status:?\s*/, "")
        .trim();
      if (InformationAiring === "Currently Airing") {
        const AiringData = await aniAPIRequest();
        if (AiringData?.data.Media) {
          const AiringEp = AiringData.data.Media.nextAiringEpisode ? AiringData.data.Media.nextAiringEpisode.episode : "";
          const AiringTime = AiringData.data.Media.nextAiringEpisode ? AiringData.data.Media.nextAiringEpisode.timeUntilAiring : "";
          const AiringInfo =
            AiringEp && AiringTime
              ? ` <div class="spaceit_pad"> <span class="dark_text">${svar.animeInfoDesign ? "Airing" : "Airing: "}</span>
              ${svar.animeInfoDesign ? "<br>" : ""}<a>Ep ${AiringEp}: ${await airingTime(AiringTime)}</a></div>`
              : "";
          if (AiringInfo) {
            informationDiv.first().before(AiringInfo);
          }
        }
      }
    }
  }
}
