//Change Foreground Color
async function changeForeground(color) {
  let cArr = [
    `--fg: ${color}!important;`,
    `--fg2: ${tinycolor(color).brighten(3)}!important;`,
    `--fg4: ${tinycolor(color).brighten(6)}!important;`,
    `--fgOP: ${color}!important;`,
    `--fgOP2: ${tinycolor(color).brighten(3)}!important;`,
    `--bg: ${tinycolor(color).darken(3)}!important;`,
    `--bgo: ${tinycolor(color).setAlpha(0.8).toRgbString()}!important;`,
    `--color-background: ${tinycolor(color).darken(3)}!important;`,
    `--color-backgroundo: ${tinycolor(color).setAlpha(0.8).toRgbString()}!important;`,
    `--color-foreground: ${color}!important;`,
    `--color-foreground2: ${tinycolor(color).brighten(3)}!important;`,
    `--color-foreground3: ${tinycolor(color).brighten(4)}!important;`,
    `--color-foreground4: ${tinycolor(color).brighten(6)}!important;`,
    `--color-foregroundOP: ${color}!important;`,
    `--color-foregroundOP2: ${tinycolor(color).brighten(3)}!important;`,
    `--border-color: ${tinycolor(color).brighten(8)}!important;`,
  ];
  if (svar.modernLayout) {
    await delay(200);
    $("style").each(function () {
      let styleContent = $(this).html();
      if (styleContent.includes("--fg:") || styleContent.includes("--color-")) {
        let updatedStyle = styleContent
          .replace(/--fg:\s*[^;]+;/g, cArr[0])
          .replace(/--fg2:\s*[^;]+;/g, cArr[1])
          .replace(/--fg4:\s*[^;]+;/g, cArr[2])
          .replace(/--fgOP:\s*[^;]+;/g, cArr[3])
          .replace(/--fgOP2:\s*[^;]+;/g, cArr[4])
          .replace(/--bg:\s*[^;]+!important;/g, cArr[5])
          .replace(/--bgo:\s*[^;]+!important;/g, cArr[6])
          .replace(/--color-background:\s*[^;]+!important;/g, cArr[7])
          .replace(/--color-backgroundo:\s*[^;]+!important;/g, cArr[8])
          .replace(/--color-foreground:\s*[^;]+!important;/g, cArr[9])
          .replace(/--color-foreground2:\s*[^;]+!important;/g, cArr[10])
          .replace(/--color-foreground3:\s*[^;]+!important;/g, cArr[11])
          .replace(/--color-foreground4:\s*[^;]+!important;/g, cArr[12])
          .replace(/--color-foregroundOP:\s*[^;]+!important;/g, cArr[13])
          .replace(/--color-foregroundOP2:\s*[^;]+!important;/g, cArr[14])
          .replace(/--border-color:\s*[^;]+!important;/g, cArr[15]);
        $(this).html(updatedStyle);
      }
    });

    let customColors = `:root, body {${cArr.join("\n")}}
    .dark-mode .page-common #headerSmall,.page-common #headerSmall,html .page-common #contentWrapper, .dark-mode .page-common #contentWrapper,.dark-mode .page-common #content
    {background-color: var(--color-background)!important}
    .dark-mode .profile.statistics .content-container .container-right .chart-wrapper>.filter,.dark-mode .mal-alert,.dark-mode .mal-alert.danger,.dark-mode .profile.statistics .chart-container-rf .right .filter,
    .dark-mode .mal-alert.secondary,.dark-mode .sceditor-container,.dark-mode .head-config,.dark-mode .profile .navi .tabs .btn-tab,.dark-mode .profile .boxlist-container .boxlist,
    .dark-mode .sceditor-container iframe,.dark-mode .sceditor-container textarea,.dark-mode .user-profile .user-status li,.dark-mode .user-profile .user-status li:nth-of-type(even),
    .profile.statistics .content-container .container-right .chart-wrapper>.filter,.mal-alert,.mal-alert.danger,.profile.statistics .chart-container-rf .right .filter,.mal-alert.secondary,
    .sceditor-container,.head-config,.profile .navi .tabs .btn-tab,.profile .boxlist-container .boxlist,.sceditor-container iframe, .sceditor-container textarea,.user-profile .user-status li,
    .user-profile .user-status li:nth-of-type(even),.dark-mode .page-common #footer-block, .page-common #footer-block,.page-common ul#nav ul li a,
    .dark-mode .page-common .header-profile .header-profile-dropdown ul li a,.page-common .header-profile .header-profile-dropdown ul li a,
     .header-list .header-list-dropdown ul li a,.dark-mode .page-common .header-notification-dropdown .arrow_box,.page-common .header-notification-dropdown .arrow_box
    {background: var(--color-foreground)!important}
    .dark-mode .mal-alert.primary,.dark-mode .profile .navi .tabs .btn-tab:hover, .dark-mode .profile .navi .tabs .btn-tab.on,.dark-mode .page-common .quotetext, .dark-mode .page-common .codetext,
    .dark-mode .mal-tabs a.item.active,.dark-mode div.sceditor-toolbar,.mal-alert.primary,.profile .navi .tabs .btn-tab:hover, .profile .navi .tabs .btn-tab.on,.page-common .quotetext, .page-common .codetext,
    .mal-tabs a.item.active,div.sceditor-toolbar,.dark-mode .page-common #menu,.page-common #menu
    {background: 0!important}
    .page-common .content-container * {border-color:var(--border-color)!important}
    .dark-mode .page-common #searchBar.searchBar #topSearchText,.page-common #searchBar.searchBar #topSearchText
    {border-left: var(--border-color) 1px solid;}
    .dark-mode .page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a,.page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a,
    .dark-mode .page-common #searchBar.searchBar #topSearchValue,.page-common #searchBar.searchBar #topSearchValue,.user-profile .user-button .btn-profile-submit,.dark-mode .page-common .btn-form-submit,
    .page-common .btn-form-submit,.dark-mode .page-common #topSearchText, .page-common #topSearchText
    {background-color: var(--color-foreground2) !important;}
    .dark-mode .page-common .header-notification-item:hover,.page-common .header-notification-item:hover
    ${defaultMal ? `,.dark-mode .page-common #searchBar.searchBar #topSearchButon,.page-common #searchBar.searchBar #topSearchButon` : ``}
    {background-color: var(--color-foreground4) !important;}
    html .page-common #contentWrapper, .dark-mode .page-common #contentWrapper
    {padding: 10px 0 0 0!important;}
    .dark-mode .page-common .header-notification-dropdown, .page-common .header-notification-dropdown,
    #nav > li > a, #menu #menu_left #nav li ul,.page-common .header-profile.link-bg,.page-common .header-profile .header-profile-dropdown.color-pc-constant,
    .page-common .header-profile .header-profile-dropdown,.dark-mode .page-common .header-list .header-list-dropdown.color-pc-constant,.page-common .header-list .header-list-dropdown.color-pc-constant
    {background:0 0!important}
    .dark-mode .page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a:hover,.page-common .header-notification-dropdown .header-notification-dropdown-inner .header-notification-view-all a:hover,
    .dark-mode .page-common .header-list .header-list-dropdown.color-pc-constant ul li a:hover,.page-common .header-list .header-list-dropdown.color-pc-constant ul li a:hover,
    .dark-mode .page-common #nav.color-pc-constant ul a:hover,.page-common #nav.color-pc-constant ul a:hover,.dark-mode .page-common .header-profile .header-profile-dropdown ul li a:hover,
    .dark-mode .page-common .header-profile ul li a:hover, .page-common .header-profile ul li a:hover
    {color:#bbb!important;}`;
    customColors = customColors.replace(/\n/g, "");
    styleSheet.innerText = styles + customColors + defaultCSSFixes;
    document.head.appendChild(styleSheet);
  }
}
