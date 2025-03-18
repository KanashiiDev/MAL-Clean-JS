// Forum Hide Blocked Users //--START--//
if (/\/(forum)\/.?(topicid|animeid|board)([\w-]+)?\/?/.test(location.href)) {
  let blockedUsers = [];
  getBlockedUsers();
  async function getBlockedUsers() {
    const html = await fetch("https://myanimelist.net/editprofile.php?go=privacy")
      .then((response) => response.text())
      .then((data) => {
        let newDocument = new DOMParser().parseFromString(data, "text/html");
        let findUser = newDocument.querySelectorAll("#content > div:nth-child(2) a[href*=profile]");
        for (let x = 0; x < findUser.length; x++) {
          blockedUsers.push(findUser[x].innerText);
        }
        removeBlockedUsers();
      });
  }
  function removeBlockedUsers() {
    //Remove Blocked User's Forum Topics
    let ForumTopic = document.querySelectorAll("#forumTopics tr[data-topic-id]");
    for (let x = 0; x < ForumTopic.length; x++) {
      for (let y = 0; y < blockedUsers.length; y++) {
        if (ForumTopic[x].children[1].children[4].innerText === blockedUsers[y]) {
          ForumTopic[x].remove();
        }
      }
    }
    //Remove Blocked User's Forum Reply
    let forumReply = document.querySelectorAll(".message-wrapper > div.profile");
    for (let x = 0; x < forumReply.length; x++) {
      for (let y = 0; y < blockedUsers.length; y++) {
        if (forumReply[x].children[0].innerText === blockedUsers[y]) {
          forumReply[x].parentElement.parentElement.remove();
        }
      }
    }
    //Remove Blocked User's Forum Reply (Conversation View)
    let forumReplyV = document.querySelectorAll(".messages.replies.parents .message");
    for (let x = 0; x < forumReplyV.length; x++) {
      if (!forumReplyV[x].getAttribute("checked")) {
        for (let y = 0; y < blockedUsers.length; y++) {
          if (forumReplyV[x].children[0].children[1].children[0].children[0].innerText === blockedUsers[y]) {
            forumReplyV[x].remove();
          }
        }
        forumReplyV[x].setAttribute("checked", 1);
      }
    }
  }
  //Conversation View - If new forum reply loaded, check blockedUsers
  if (document.querySelectorAll(" .content > div.user > div.item.update").length) {
    let target = document.querySelector(".messages.replies.parents");
    let observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        removeBlockedUsers();
      }
    });
    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }
}
