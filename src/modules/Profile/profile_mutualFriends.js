async function mutualFriends() {
  let myFriends = 0;
  let userFriends = 0;
  const friendsHeader = document.querySelector(".boxlist-container.friend.mb16");
  const mutualsButton = create("a", { class: "mal-btn", style: { backgroundColor: "var(--color-foreground)" } }, "Mutual Friends");
  const mutualsDiv = create("div", { class: "boxlist-container" });
  $(friendsHeader).before(mutualsButton);
  $(friendsHeader).after(mutualsDiv);
  mutualsButton.addEventListener("click", async function () {
    const loadingText = translate("$loading");
    if ($(mutualsButton).text() !== loadingText) {
      mutualsButton.classList.toggle("active");
      try {
        $(mutualsButton).text(loadingText);
        if (!myFriends) {
          myFriends = await getFriends(headerUserName);
          myFriends = myFriends.map((friend) => friend.username);
        }
        if (!userFriends) {
          userFriends = await getFriends(username);
        }
        $(mutualsButton).text(translate("$mutualFriends"));
        mutualsButton.classList[1] === "active" ? $(mutualsButton).css({ backgroundColor: "var(--color-foreground2)" }) : $(mutualsButton).css({ backgroundColor: "var(--color-foreground)" });
        if (!$(mutualsDiv).attr("done")) {
          userFriends.forEach((user) => {
            if (mutualsButton.classList[1]) {
              $(".boxlist-container.friend.mb16, .mt4.mb8").hide();
              $(mutualsDiv).show();
              if (myFriends.includes(user.username)) {
                const mutualsBox = create("div", {
                  class: "boxlist col-3",
                  style: { minHeight: "48px" },
                });
                mutualsBox.innerHTML = `
                <div class="di-tc"><a href="${user.url}">
                <img class="image profile-w48 lazyload"src="https://cdn.myanimelist.net/r/84x124/images/questionmark_23.gif" data-src="${user.images.jpg.image_url}" alt="Profile Image">
                </a></div>
                <div class="di-tc va-t pl8 data">
                <div class="title">
                <a href="${user.url}">${user.username}</a>
                </div>
                </div>
                `;
                mutualsDiv.append(mutualsBox);
              }
            }
          });
          $(mutualsDiv).attr("done", "1");
        }
        if (!mutualsButton.classList[1]) {
          $(".boxlist-container.friend.mb16, .mt4.mb8").show();
          $(mutualsDiv).hide();
        } else {
          $(".boxlist-container.friend.mb16, .mt4.mb8").hide();
          $(mutualsDiv).show();
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
  });
}
if (/\/profile\/.*\/friends/gm.test(current) && userNotHeaderUser) {
  mutualFriends();
}
