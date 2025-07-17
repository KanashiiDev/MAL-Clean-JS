let fgColor = getComputedStyle(document.body);
fgColor = tinycolor(fgColor.getPropertyValue("--fg"));
const fgOpacity = fgColor.setAlpha(0.8).toRgbString();

let styles = `
.malCleanSpinner {
  position: relative;
  margin-left: 5px;
  font-size: 12px;
  font-family: FontAwesome;
  display: inline-block;
}

.loadmore,
.actloading,
.listLoading {
    font-size: .8rem;
    font-weight: 700;
    padding: 14px;
    text-align: center
}

.tooltipBody .addtoList {
    position: absolute;
    top: -5px;
    right: 0;
    cursor: pointer;
    padding: 5px;
    font-size: .6rem;
    background: var(--color-foreground2);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius)
}

.maljsBlogDiv {
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    overflow: hidden;
    width: 97%;
    margin-top:5px;
    padding: 10px 20px 50px 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

.maljsBlogDivRelations {
    background: var(--color-foreground3);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    width: 100%;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

.maljsBlogDivRelations div {
    color: var(--color-text) !important;
    margin-bottom:0!important;
    padding-right: 5px;
    display: inline-block;
    margin-left: 10px !important;
    margin-right: -10px !important;
    width: 98%;
    max-height: 110px;
    overflow: scroll;
}

.maljsBlogDivRelations div::before {
    margin-top:9px
}

.maljsBlogDivRelations a {
    background: var(--color-foreground2)!important;
    border-radius: var(--br) !important;
    padding: 6px !important;
    display: inline-table;
    margin: 2px
}

.page-common .maljsBlogDiv .maljsBlogDivHeader .lightLink {
    color:var(--color-link)!important;
    font-size: .9rem!important;
    margin-top:-4px
}

.maljsBlogDivContent {
    background: var(--color-foreground)!important
}

#myanimelist .blockUserIcon {
    font-family: "Font Awesome 6 Pro";
    float: right;
    z-index: 10;
    color: var(--color-link) !important;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer
}

.blogMainWide {
    display:block;
    height:100%!important;
    max-height:600px!important;
    width:100%!important;
    min-width:1020px;
    background: var(--color-foreground) !important;
    border: 1px solid var(--border-color) !important;
    padding: 10px!important;
    margin-bottom: 20px!important;
    box-sizing: border-box;
}

.user-genres .user-genres-container {
    padding: 10px;
    background: var(--color-foreground);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    text-align: center;
}

.user-genres .user-genres-inner {
    display: -ms-inline-grid;
    display: inline-grid;
    grid-auto-flow: column;
    -webkit-justify-content: space-around;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    min-width: 420px;
    gap: 8px
}

.user-genres .user-genres-inner .user-genre-div {
    text-align: center
}

.user-genres .user-genres-inner .user-genre-div .user-genre-name {
    padding: 6px 16px;
    margin-bottom: 8px;
    background: var(--color-foreground2);
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
}

.user-genres .user-genres-inner .user-genre-div .user-genre-count p {
    display: inline-block;
    font-size: .6rem;
    color: var(--color-main-text-light)
}

.favThemes img {
    width: 40px
}

.favThemes .flex2x .fav-theme-container .favThemeSongTitle {
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px
}
.customProfileEls .custom-el-container .editCustomEl,
.customProfileEls .custom-el-container .sortCustomEl,
.customProfileEls .custom-el-container .removeCustomEl,
.favThemes .fav-theme-container .sortFavSong,
.favThemes .fav-theme-container .removeFavSong {
    display: none;
    font-family: 'FontAwesome';
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 6px;
    height: 4px;
    font-size: 8px
}

.customProfileEls .custom-el-container .sortCustomEl,
.favThemes .fav-theme-container .sortFavSong {
    right:15px
}

.customProfileEls .custom-el-container .editCustomEl {
    right:30px
}

.customProfileEls .custom-el-container .sortCustomEl.selected,
.favThemes .fav-theme-container .sortFavSong.selected {
    color: var(--color-link);
    display: block!important
}

.loadmore:hover,
.customProfileEls .custom-el-container .editCustomEl:hover,
.customProfileEls .custom-el-container .sortCustomEl:hover,
.customProfileEls .custom-el-container .removeCustomEl:hover,
.favThemes .fav-theme-container .sortFavSong:hover,
.favThemes .fav-theme-container .removeFavSong:hover {
    color: var(--color-link)
}
.customProfileEls .custom-el-container:hover .editCustomEl,
.customProfileEls .custom-el-container:hover .sortCustomEl,
.customProfileEls .custom-el-container:hover .removeCustomEl,
.favThemes .fav-theme-container:hover .sortFavSong,
.favThemes .fav-theme-container:hover .removeFavSong {
    display: block !important
}

.customProfileEls .custom-el-container:hover .sortCustomEl.hidden,
.favThemes .fav-theme-container:hover .sortFavSong.hidden{
     display: none !important
}

.customProfileEls .flex2x .custom-el-container .custom-el-inner,
.favThemes .flex2x .fav-theme-container {
    background: var(--color-foreground);
    padding: 10px;
    margin-bottom: 10px;
    min-height: 55px;
    height: 100%;
    min-width: 375px;
    max-width: 375px
}

.customProfileEls .custom-el-container {
    position: relative
}

.customProfileEls .custom-el-container .custom-el-inner {
    background: var(--color-foreground);
}

.customProfileEls .custom-el-container .custom-el-inner,
.favThemes .fav-theme-container {
    position: relative;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin-bottom: 10px
}

.favThemes video {
    width: 100%
}

.favThemes .video-container {
    margin-top: 10px;
    display: none
}

.favThemes .fav-theme-header {
    width: 99%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    text-align: center;
}

.favThemes .flex2x .fav-theme-header h2 {
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    width: 325px;
    font-size: 0.68rem!important;
    padding-bottom: 5px!important;
}

.favThemes .fav-theme-header h2 {
    cursor: default;
    -webkit-border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    -webkit-border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    -o-border-image: -o-linear-gradient(left, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
    border-image: -webkit-gradient(linear, left top, right top, from(var(--color-foreground)), color-stop(50%, var(--color-foreground4)), to(var(--color-foreground))) 1;
    border-image: linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground4) 50%, var(--color-foreground) 100%) 1;
}

.favThemes .fav-theme-inner {
    -webkit-box-align: center;
    -webkit-align-items: center;
        -ms-flex-align: center;
            align-items: center;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 50px 1fr;
    grid-template-columns: 50px 1fr
}

.favThemes .flex2x{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    gap: 0px 10px;
    margin: 5px 0px;
    -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
            flex-wrap: wrap
}

.user-profile-about a[href*="/custombg"],
.user-profile-about a[href*="/custompf"],
.user-profile-about a[href*="/customCSS"] {
    display: none
}

.filterList_TagsContainer .tag-link {
    cursor: pointer;
    word-break: break-word;
    display: block;
    width: 97%;
    background: var(--color-foreground3);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    margin-left: -5px;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.filterList_TagsContainer .tag-link.clicked {
    background: var(--color-foreground4);
    border: var(--border) solid var(--border-color);
}

.filterList_TagsContainer .tag-link:hover {
    background: var(--color-foreground2)
}

.filterList_GenresFilter input[type="checkbox"] {
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    vertical-align: middle;
    left: -2px;
    -webkit-appearance: none;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    content: "";
    position: absolute;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto !important;
    height: 10px;
    width: 10px;
    background: var(--color-link2) !important
}

.filterList_GenresFilter input[type="checkbox"]:checked:after {
    font-family: fontAwesome;
    content: "\\f00c";
    margin-left: 4px !important;
    color: var(--color-link) !important;
    background: none !important
}

i.tags-container-clear.fa.fa-close,
i.year-filter-clear.fa.fa-close {
    display: none;
    font-family: 'FontAwesome';
    background: var(--color-foreground4);
    padding: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    float: right;
    cursor: pointer;
    margin-right: 83%;
    margin-top: -2px;
    margin-bottom: 0px
}

.year-filter-slider-container {
    margin-top: -4px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px
}

input#year-filter-slider {
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    padding: 0 !important
}

.cover-position-slider-container {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 10px 1fr 10px 1fr;
    grid-template-columns: 10px 1fr 10px 1fr;
    width: 285px;
    justify-items: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 5px
}

.genreDropBtn {
    color:var(--color-main-text-normal);
    width: 100%;
    border: 0;
    background: var(--color-foreground2);
    padding: 8px;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    margin: 5px 0px
}
.maljsBlogDivRelations a:hover,
#maljsDraw3x3:hover,
.compareBtn:hover,
.sort-container #sort-asc:hover,
.sort-container #sort-desc:hover,
.genreDropBtn:hover {
    background: var(--color-foreground4)!important
}

#maljs-dropdown-content {
    display: none;
    -ms-grid-columns: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    background: var(--color-foreground);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    min-width: 160px;
    -webkit-box-shadow: 0px 8px 16px 0px var(--shadow-color);
    box-shadow: 0px 8px 16px 0px var(--shadow-color);
    z-index: 1;
    height: 175px;
    overflow: auto
}

.maljs-dropdown-content label {
    margin: 2px;
    padding: 7px 0px;
    display: block;
    align-content: center
}

.maljs-dropdown-content label:hover {
    background: var(--color-foreground4)
}

.maljs-dropdown-content label:has(input.genre-filter:checked) {
    background: var(--color-foreground2);
    border: 1px solid var(--border-color);
    border-radius: 5px;
}

.list-entries .status-section {
    background: var(--color-foreground);
    border-radius: var(--border-radius)
}

.filterLists-back {
    width: 25px;
    text-align: center;
    margin-top: -67px;
    font-family: 'FontAwesome';
    cursor: pointer;
    position: absolute;
    background: var(--color-foreground);
    padding: 6px;
    -webkit-border-top-left-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    -webkit-border-top-right-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    border-bottom:0
}

.filterListsDivContainer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex
}

.filterListsDiv {
    width: auto;
    display: block;
    margin-top: -5px
}

.filterListsCount {
    width: 90px;
    line-height: 19px;
    color: var(--color-main-text-light);
    margin-top: -5px
}

.list-entries .entry .edit {
    height: 40px;
    width: 40px;
    position: absolute;
    background: #00000070;
    display: block;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    font-family: fontAwesome;
    opacity: 0;
    cursor: pointer;
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}

.list-entries .entry .edit:hover {
    opacity: 1
}

.maljsDisplayBox {
    overflow: hidden;
    position: fixed;
    top: 65px;
    left: 20px;
    z-index: 9999;
    padding: 20px;
    background-color: rgb(var(--color-foreground));
    border: 1px solid var(--border-color);
    border-radius: 4px;
    -webkit-box-shadow: 0 0 15px var(--shadow-color) !important;
    box-shadow: 0 0 15px var(--shadow-color) !important;
    background: var(--color-background);
    height: 85%;
}

.maljsDisplayBoxTitle {
    font-size: 15px;
    border-bottom: 1px solid var(--border-color);
    display: block;
    margin-bottom: 10px;
    padding: 3px
}

input.maljsNativeInput {
    margin-bottom: 5px;
    border: 1px solid var(--border-color)
}

.maljsDisplayBox .scrollableContent p {
    margin: 10px 0px !important
}

.maljsDisplayBox .scrollableContent {
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    scrollbar-width: thin;
    margin-top: 5px;
    padding: 30px;
    padding-top: 15px;
    scrollbar-width: auto
}

.maljsDisplayBoxClose {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    width: 15px;
    height: 18px;
    text-align: center;
    background-color: #852325;
    font-weight: bold;
    border: solid;
    border-width: 1px;
    border-radius: 2px;
    color: var(--color-main-text-normal);
    z-index: 20;
}

.maljsResizePearl {
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 20px;
    height: 20px;
    border: solid;
    border-radius: 10px;
    background: rgb(var(--color-foreground));
    cursor: se-resize
}

.container-left>#filter,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-top: -8px;
    background: var(--color-foreground);
    padding: 15px;
    border-radius: var(--border-radius)
}

.container-left>#filter .filterLists,
#content>table>tbody>tr td[valign='top']:nth-child(1)>#filter .filterLists {
    display: block;
    cursor: pointer;
    padding: 3px;
    width: 70px
}

.container-left > #filter #filter-input,
.sort-container #sort-asc,
.sort-container #sort-desc {
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: 1px solid var(--border-color);
}

.sort-container #sort-asc,
.sort-container #sort-desc,
#maljsDraw3x3,
.compareBtn {
    color:var(--color-main-text-normal);
    background: var(--color-foreground2);
    padding: 10px;
    border-radius: var(--border-radius);
    display: block;
    margin-top: 5px;
    cursor: pointer;
    width: auto;
    display: inline-block
}

.compareBtn {
    float: right;
    text-align: center
}

#filter>input#filter-input {
    width: 94%
}

.list-entries .entry .cover,
.list-entries .row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox
}

.list-entries .row {
    border-color: var(--border-color);
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center
}

.list-entries .entry .cover {
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    max-width: 60px;
    min-width: 60px;
    padding: 0
}

.list-entries .entry .cover .image {
    object-fit: cover;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    height: 40px;
    width: 40px
}

.list-entries .entry .airing-dot {
    position: relative;
    left: -6.5px;
    width: 6.5px;
    height: 6.5px;
    border-radius: 10px;
    background: #7bd555;
    box-shadow: 0 0 5px rgba(123, 213, 85, .8);
    -webkit-transition: .15s;
    -o-transition: .15s;
    transition: .15s;
    opacity: 1
}

.list-entries .row:hover .airing-dot {
    opacity:0;
}

.list-entries .entry .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 15px;
    text-align: left;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    word-break: break-word
}

.list-entries .entry .title a {
    -webkit-transition: none;
    -o-transition: none;
    transition: none;
    margin-right: auto
}

.list-entries .entry>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 18px 20px;
    text-align: center
}

.list-entries .list-head>div {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding: 20px;
    text-align: center;
    font-weight: 700
}

.list-entries .list-head .title {
    -webkit-box-flex: 5;
    -webkit-flex: 5;
    -ms-flex: 5;
    flex: 5;
    padding-left: 75px;
    text-align: left
}

.list-entries .section-name {
    border-bottom: 1px solid var(--border-color)!important;
    padding: 10px!important;
    margin: 0!important;
    margin-bottom: 0!important;
    font-weight:bold!important
}

.list-entries .entry.row.hidden {
    display: none
}

.list-entries .status-section {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    margin-bottom: 10px;
    padding-bottom: 10px
}

.list-head.row {
    margin-bottom: -10px
}

.mainbtns.tooltip .title-note-inner, 
.mainbtns.disabled .title-note-inner, 
.list-entries .title-note-inner {
    display:none;
    position: absolute !important;
    background: var(--color-foreground2);
    padding: 10px;
    margin: -26px 0 0 20px;
    max-width: 420px;
    -webkit-box-shadow: 0 0 10px var(--shadow-color) !important;
    box-shadow: 0 0 10px var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--border-radius);
            border-radius: var(--border-radius)
}

.mainbtns.disabled .title-note-inner {
  background: #633232
}

.mainbtns.tooltip:hover .title-note-inner,
.mainbtns.disabled .title-note-inner {
    width: 420px;
    left: 12px
}

.list-entries .user-note {
    width: 20px;
    margin: 0 -15px 0 5px
}
.mainbtns.tooltip:hover .title-note-inner,
.mainbtns.disabled:hover .title-note-inner,
.list-entries .user-note:hover .title-note-inner {
    display:block
}

.RelatedEntriesDiv {
    height: 45px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    justify-content: space-between
}

.relationsTarget {
    width:100%;
    overflow:hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block
}
    
.relationsTarget > .relationWrapper {
    display: -ms-grid!important;
    display: grid!important;
    grid-template-columns: repeat(auto-fill, minmax(90px, -webkit-max-content));
    grid-template-columns: repeat(auto-fill, minmax(90px, max-content));
    -webkit-justify-content: space-around;
    justify-content: space-around;
    gap: 10px
}

.relations-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    float: right;
    margin: 5px 5px 0 auto
}

.relationEntry {
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    float: left;
    opacity: 1;
    width: 85px;
    min-width:85px;
    min-height:120px;
    overflow: hidden;
    position: relative;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out
}

.relationTitle {
    border-bottom: 2px solid;
    -webkit-transition: .3s;
    transition: .3s;
    width: 100%;
    background: var(--color-foreground2);
    -webkit-align-content: center;
    align-content: center;
    bottom: 0;
    height: 35px;
    color: var(--color-main-text-normal);
    font-size: 9.5px;
    font-weight: bold;
    left: 0;
    position: absolute;
    text-align: center;
    opacity: .95;
    -webkit-border-bottom-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    -webkit-border-bottom-right-radius: var(--br);
    border-bottom-right-radius: var(--br)
}

.relationImg {
    width: 85px;
    height: 120px;
    -webkit-transition: .3s;
    transition: .3s
}

.relationEntry:hover {
    overflow: visible !important
}

.relationEntry:hover .relationImg {
    -webkit-border-top-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    -webkit-border-bottom-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.relationEntryRight:hover .relationImg {
    -webkit-border-top-left-radius: 0 !important;
    border-top-left-radius: 0 !important;
    -webkit-border-bottom-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    -webkit-border-top-right-radius: var(--br) !important;
    border-top-right-radius: var(--br) !important;
    -webkit-border-bottom-right-radius: var(--br) !important;
    border-bottom-right-radius: var(--br) !important
}

.relationEntry:hover .relationTitle {
    opacity: 0
}

.relationDetails {
    -webkit-transition: .3s;
    transition: .3s;
    display:none;
    position: absolute;
    top: 0;
    left:0;
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    max-width: 300px;
    height: 100px;
    padding: 10px;
    background: var(--color-foregroundOP2);
    z-index: 5;
    text-align: start;
    -webkit-border-top-right-radius: var(--br);
    border-top-right-radius: var(--br);
    -webkit-border-bottom-right-radius: var(--br);
    border-bottom-right-radius: var(--br);
}

.relationDetails.relationEntryRight {
    text-align: end;
    -webkit-border-bottom-left-radius: var(--br);
    border-bottom-left-radius: var(--br);
    -webkit-border-top-left-radius: var(--br);
    border-top-left-radius: var(--br);
    -webkit-border-bottom-right-radius: 0;
    border-bottom-right-radius: 0;
    -webkit-border-top-right-radius: 0;
    border-top-right-radius: 0
}

.relationDetailsTitle {
    height: 67px;
    margin-bottom: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    color: var(--color-main-text-normal)
}

#relation-hover-portal {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    margin: 0 !important;
    padding: 0 !important
}
    
.aniTagDiv .category-group,
.aniTagDiv {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr;
    grid-template-columns: 1fr;
    grid-gap: 6px
}

.aniTag {
    position: relative;
    overflow: visible!important;
    cursor: default;
    display: -webkit-box;
    display: flex;
    background-color: var(--color-foreground);
    border-radius: var(--br);
    padding: 7px;
    -webkit-box-pack: justify;
    justify-content: space-between
}

.aniTagDiv .category-group.spoiler-group,
.aniTag.spoiler {
    display: none
}

.showSpoilers {
    cursor: pointer
}

.showSpoilers,
.aniTag.spoiler .aniTag-name {
    color: #d98080;
    font-weight: 600
}

.aniTag-category {
    margin: 10px 0 4px 0;
}

.aniTag-percent {
    color: var(--color-main-text-light)
}

.aniTag::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 0;
  background: var(--color-foreground4);
  color: var(--color-text);
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-line;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
  max-width: 210px;
}

.aniTag:hover::after {
  opacity: 1;
}

#content>table>tbody>tr>td:nth-child(2)>div.rightside.js-scrollfix-bottom-rel>div.h1.edit-info,
#content>table>tbody>tr>td.borderClass>div>div>div:nth-child(1),
#content>table>tbody>tr>td.borderClass>div>div:nth-child(1) {
    z-index: 1;
    position: relative
}

.bannerHover {
    width: 220px;
    height: 80px;
    position: absolute;
    bottom: 0px;
    left: 18px;
    z-index: 1
}

.bannerShadow {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(6, 13, 34, .1)), color-stop(50%, rgba(6, 13, 34, 0)), to(rgba(6, 13, 34, .6)));
    background: -o-linear-gradient(top, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    background: linear-gradient(180deg, rgba(6, 13, 34, .1), rgba(6, 13, 34, 0) 50%, rgba(6, 13, 34, .6));
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0px
}

.bannerImage {
    width: 100%;
    height: 100%
}

@supports (object-fit: cover) {
    .bannerImage {
        object-fit: cover;
        max-height: 240px
    }

    .relationImg {
        object-fit: cover
    }
}

.bannerDiv {
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    max-height: 435px;
    position: relative;
    width: auto;
    margin: -30px -10px 0 -10px
}

.aniLeftSide {
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    position: relative;
    padding-top: 0 !important;
    top: -85px
}

.aniTag,
.aniTag::after,
.spaceit-shadow-end,
.spaceit-shadow-end-div,
.spaceit-shadow {
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    border: var(--border) solid var(--border-color);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

.aniTag,
.spaceit-shadow-end,
.spaceit-shadow-end-div{
    overflow: hidden
}

.spaceit-shadow-end-div {
    padding: 2px;
    background: var(--color-foreground)
}

.fa-info-circle:before {
    text-shadow: rgb(0 0 0 / 70%) 0px 0px 2px;
}

#currently-popup {
    height: 425px;
    width: 674px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background-color: var(--color-foregroundOP2);
    padding: 15px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

#currently-popup iframe {
    width: 100%;
    height: 100%;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    border: 1px solid var(--border-color)
}

#currently-popup .popupBack {
    left: 6px;
    right: inherit !important;
    font-family: FontAwesome;
    float: left;
    padding: 0px 0px 5px 0px
}

#currently-popup .dataTextDiv {
    max-height: 145px;
    overflow: auto;
    word-break: break-all;
    background: var(--color-foreground4);
    -webkit-border-radius: var(--border-radius);
    border-radius: var(--border-radius);
    padding: 10px;
    margin: 10px
}

#widget-currently-watching .btn-anime,
#widget-currently-reading .btn-anime,
#recently-added-anime .btn-anime,
#recently-added-manga .btn-anime {
    background-color: var(--color-foreground2)
}

#widget-currently-watching > div.widget-slide-outer > ul > li:hover span.epBehind,
#recently-added-anime .btn-anime:hover i,
#recently-added-manga .btn-anime:hover i,
#recently-added-anime .btn-anime:hover .recently-added-type,
#recently-added-manga .btn-anime:hover .recently-added-type,
.widget.seasonal.left .btn-anime:hover i,
#widget-currently-watching .btn-anime:hover i,
#widget-currently-reading .btn-anime:hover i {
    opacity: .9 !important
}

#recently-added-anime li.btn-anime .link,
#recently-added-manga li.btn-anime .link,
#currently-watching li.btn-anime .link,
#currently-reading li.btn-anime .link {
    position:relative
}

#recently-added-anime li.btn-anime span,
#recently-added-manga li.btn-anime span,
#currently-watching li.btn-anime span,
#currently-reading li.btn-anime span {
    opacity: 0;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2em;
    width: calc(100% - 9.5px);
    max-height: 4.45em
}

#recently-added-anime li.btn-anime:hover span,
#recently-added-manga li.btn-anime:hover span,
#currently-watching li.btn-anime:hover span,
#currently-reading li.btn-anime:hover span {
     opacity: 1
}

#recently-added-anime-load-more,
#recently-added-manga-load-more {
    width: 124px;
    height: auto;
    min-height: 101px;
    display: inline-block;
    text-align: center;
    background: var(--color-foreground2);
    align-content: center;
    cursor: pointer
}

.currently-loading-indicator {
    background: var(--color-main-text-light)!important;
    margin-top: -5px
}

.recently-genre-indicator {
  height: 3px;
  background-color: var(--color-foreground4);
  width: 100%;
  -webkit-animation: loadingBar 2s ease-in-out infinite;
          animation: loadingBar 2s ease-in-out infinite;
  grid-column: 1 / -1;
  display: none;
}

@-webkit-keyframes loadingBar {
  0% { -webkit-transform: scaleX(0); transform: scaleX(0); -webkit-transform-origin: left; transform-origin: left; }
  100% { -webkit-transform: scaleX(1); transform: scaleX(1); -webkit-transform-origin: left; transform-origin: left; }
}

@keyframes loadingBar {
  0% { -webkit-transform: scaleX(0); transform: scaleX(0); -webkit-transform-origin: left; transform-origin: left; }
  100% { -webkit-transform: scaleX(1); transform: scaleX(1); -webkit-transform-origin: left; transform-origin: left; }
}

.editCurrently,
.incButton {
font-family: "Font Awesome 6 Pro";
    position: absolute;
    right: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
    padding: 4px;
    border-radius: 5px;
    opacity: 0;
    transition: 0.4s;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.incButton {
   top: 26px
}

.customCover {
   max-width: 225px!important;
}

#customCoverPreview > .js-picture-gallery {
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    width: 300px;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between
}

#customAddContainer.right {
   z-index: 2;
   position: relative;
   margin-bottom: 10px
}

#customAddContainer #custom-preview-div {
   border-bottom: 1px solid var(--border-color);
   margin-bottom: 10px
}

.malCleanSettingPopup .settingContainer.input input,
.malCleanSettingPopup .settingContainer.input select,
#customAddContainerInside input#header-input,
#customAddContainerInside textarea#content-input {
    width: 95%;
    max-width: 95%;
    background-color: var(--color-foreground);
    border: 1px solid var(--border-color);
    padding: 10px;
    border-radius: 4px;
    margin: 5px 0px
}

.malCleanSettingPopup .settingContainer.input select {
    width: 100%;
    max-width: 100%
}

.malCleanSettingPopup .settingContainer.input input {
    background-color: var(--color-foreground2)
}

#customAddContainer.right #customAddContainerInside input#header-input {
   width: 97%;
   max-width: 97%;
}

#customAddContainerInside textarea#content-input {
    min-height: 100px
}

#custom-preview-div-bb > div,
#custom-preview-div-bb-def > div,
#customAddContainer #custom-preview-div > div {
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    -webkit-border-radius: var(--border-radius);
    overflow: hidden;
    width: 95%;
    padding: 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color);
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color)
}

#custom-preview-div-bb-def > div {
    background: var(--color-foreground2);
}

#customProfileEls .custom-el-container > .custom-el-inner *,
#customAddContainer #custom-preview-div > div * {
    max-width: 415px
}

#customAddContainer.right #custom-preview-div > div {
    width: 97%;
}

#customProfileEls.right .custom-el-container > .custom-el-inner *,
#customAddContainer.right #custom-preview-div > div * {
    max-width: 777px
}

#customProfileEls .custom-el-container > .custom-el-inner.notAl * {
    max-width: 791px
}

div#custom-preview-div > div blockquote:not(.spoiler) {
    background: var(--color-foreground2);
    padding: 10px;
    margin: 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br)
}

.custom-el-container .custom-el-inner blockquote.spoiler,
div#custom-preview-div blockquote.spoiler {
    margin: 5px
}

#customAddContainer #customAddContainerInside textarea:not(#iframe-html-src) {
    width: 405px !important
}

#customAddContainer.right #customAddContainerInside textarea:not(#iframe-html-src) {
    width: 777px !important
}

#customAddContainerInside .sceditor-button-youtube div:before {
    color: rgb(232, 93, 117) !important
}

#customAddContainerInside .sceditor-button-video div:before {
    content: "\\f03d"
}

#customAddContainerInside .sceditor-button-iframe div:before {
    content: "\\e495"
}

#customAddContainerInside .sceditor-button-div div:before {
    content: "\\f0c8";
    font-weight: 500
}

#currently-popup .popupBack,
#currently-closePopup {
    position: absolute;
    top: 5px;
    right: 6px;
    cursor: pointer
}

.currentlyGrid,
.recentlyGrid {
    width: 100%;
    display: -ms-grid;
    display: grid!important;
    justify-items: center;
}

.currentlyGrid6Column .btn-anime,
.recentlyGrid6Column .btn-anime {
    min-height: 146px;
    max-height: 146px;
}

.currentlyGrid6Column img.lazyloaded,
.recentlyGrid6Column img.lazyloaded  {
    width: 100px;
    height: 146px;
    max-height: 146px
}

.airingInfo {
    color: var(--color-text);
    transition: .4s;
    text-align: center;
    background-color: ${fgOpacity};
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%
}

.behindWarn {
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0)), to(rgba(232, 93, 117, .49)));
    background: -o-linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(232, 93, 117, .49));
    padding: 3px 0px;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 4px;
    opacity: .8
}

.recently-added-type,
.epBehind {
    color: var(--color-main-text-op);
    position: absolute;
    left: 3px;
    top: 3px;
    background: var(--color-foregroundOP2);
    padding: 2px 4px !important;
    border-radius: 5px;
    width: auto!important;
    max-width: calc(100% - 34px)!important
}

.airingInfo div:first-child:after {
    content: "";
    display: block;
    height: 3px;
    width: 0
}

.widget.anime_suggestions.left #widget-currently-reading a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-reading a:hover .airingInfo,
.widget.anime_suggestions.left #widget-currently-watching a:hover .behindWarn,
.widget.anime_suggestions.left #widget-currently-watching a:hover .airingInfo {
    opacity: 0;
}

.widget-slide-block:hover #currently-left-recently-added-anime.active,
.widget-slide-block:hover #currently-left-recently-added-manga.active,
.widget-slide-block:hover #currently-left-manga.active,
.widget-slide-block:hover #currently-left.active {
    left: 0 !important;
    opacity: 1 !important
}
.widget-slide-block:hover #currently-right-recently-added-anime.active,
.widget-slide-block:hover #currently-right-recently-added-manga.active,
.widget-slide-block:hover #currently-right-manga.active,
.widget-slide-block:hover #currently-right.active {
    right: 0 !important;
    opacity: 1 !important
}

.embed-loading {
  position: relative;
}

.embed-loading .embed-container{
    min-width: 240px;
    max-height: 60px;
    justify-content: center;
}

.embed-loading .embed-inner {
    width: 100%;
}

#content .embed-loading .embed-image {
    background: var(--color-foreground4);
    width: 50px !important;
    height: 60px !important;
}

body #content .embed-loading .spinner {
    width: 15px;
    height: 15px;
    border: 3px solid #ccc !important;
    border-top-color: #666 !important;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 50% auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.embed-link {
    width: max-content;
    line-height: 1.16rem;
    margin: 5px 1px;
    display: inline-block;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.embed-link .embed-container.no-genre .genres {
    display: none
}

.embed-link .embed-container:not(.no-genre) div {
    transition: opacity 0.3s ease-in-out;
}

.embed-link .embed-container:not(.no-genre) .genres {
    margin-bottom: -18.5px;
    opacity: 0
}

.embed-link .embed-container:not(.no-genre):hover .genres {
    opacity: 1
}

.embed-link .embed-container:not(.no-genre):hover .details {
    opacity: 0
}

.embed-link .embed-title {
    font-weight: bold;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center;
}

#content .embed-link .embed-image {
    width: 40px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    margin-right: 10px;
    margin-left: -10px;
    -webkit-border-top-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    -webkit-border-bottom-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.embed-link .embed-container {
    color: var(--color-text);
    align-items: center;
    text-align: center;
    width: max-content;
    min-height: 55px;
    background-color: var(--color-foreground2);
    padding: 0px 10px;
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden;
}

.forum .replied.show .embed-container,
.quotetext .embed-container {
    background-color: var(--color-foreground);
}

.tooltipBody {
    display: none;
    background-color: var(--color-foreground);
    border-radius: 5px;
    -webkit-box-shadow: 0 0 10px var(--shadow-color) !important;
    box-shadow: 0 0 10px var(--shadow-color) !important;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-top: 5px
}

.tooltipBody.grid {
    background-color: var(--color-foreground2);
    z-index:222
}

.tooltipBody .main {
    margin: 0 !important;
    padding: 10px
}

.tooltipBody .text b {
    margin-bottom: 2px;
    display: inline-block
}

.tooltipDetails {
  display:none
}

.malCleanMainContainer {
    right: 0;
    width: 520px;
    height: 86vh;
    margin-right: 10px;
    -webkit-transition: 0.4s;
    -o-transition: 0.4s;
    transition: 0.4s;
    position: fixed;
    top: 55px;
    z-index: 100;
    background: var(--color-foregroundOP);
    overflow-y: auto;
    display: -ms-grid;
    display: grid;
    color: var(--color-text);
    padding: 10px;
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    -webkit-border-radius: 10px;
            border-radius: 10px
}

@media (max-width: 768px) {
    .malCleanMainContainer {
        height: 75vh
    }
}

@media (max-width: 480px) {
    .malCleanMainContainer {
        height: 70vh
    }
}

.malCleanSettingContainer {
    margin-top: 10px;
    width: auto
}

.malCleanSettingPopup {
    display: inline-grid;
    padding: 10px;
    background: var(--color-foreground4);
    border-radius: var(--border-radius);
    border: var(--border) solid var(--border-color);
    -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
    grid-column: 1 / -1;
    margin-bottom: 5px;
    grid-column: 1/-1
}

.malCleanMainContainer > .malCleanSettingContainer:nth-child(2) {
    margin-top: 85px
}

.mainListBtnDiv,.malCleanSettingPopup .settingContainer.svar {
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 35px auto auto 1fr;
    grid-template-columns: 35px auto auto 1fr;
    -webkit-box-pack: start;
    -webkit-justify-content: start;
    -ms-flex-pack: start;
    justify-content: start;
    gap:5px
}

.malCleanSettingPopup .settingContainer.svar {
    -ms-grid-columns: 35px auto;
    grid-template-columns: 35px auto
}

.malCleanSettingPopup .settingContainer.slider {
     display: -webkit-box;
     display: -webkit-flex;
     display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    gap: 5px
}

.mainListBtnDiv .fa-gear {
   font-family: "Font Awesome 6 Pro";
   cursor:pointer;
    -webkit-align-content: center;
    -ms-flex-line-pack: center;
    align-content: center
}

.malCleanMainContainerList .malCleanSettingButtons .removeButton,
.malCleanMainContainer .malCleanMainHeaderTitle #innerSettingsBtn,
.malCleanMainContainer .malCleanMainHeaderTitle #reloadbtn,
.malCleanMainContainer .malCleanMainHeaderTitle #closeButton {
    font-family: fontAwesome
}

.textpb {
    padding-top: 5px !important;
    font-weight: bold
}

.textpb a {
    color: rgb(var(--color-link)) !important
}

.malCleanMainHeader {
    font-size: 1rem;
    padding-bottom: 5px
}

.malCleanMainHeaderNav {
    display: -ms-grid;
    display: grid;
    grid-auto-flow: column;
    width: 100%
}

.malCleanMainContainerList { 
    display: inline-block;
    padding-right: 6px;
    overflow-y: auto;
    overflow-x: hidden
}

.malCleanMainContainerList::-webkit-scrollbar-thumb,
.malCleanMainContainerList::-webkit-scrollbar {
    background: var(--color-background);
    -webkit-border-radius: 4px;
    border-radius: 4px
}

.malCleanMainContainerList::-webkit-scrollbar-corner,
.malCleanMainContainerList::-webkit-scrollbar-track {
    background: #fff0
}

.malCleanMainContainerList::-webkit-scrollbar-thumb {
    background: var(--color-foreground4)
}

.malCleanMainHeaderTitle {
    width: 100%;
    display: -ms-inline-grid;
    display: inline-grid;
    -ms-grid-columns: 80% auto auto auto;
    grid-template-columns: 80% auto auto auto;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center
}

.malCleanSettingInnerSettings.malCleanSettingPopup {
    width: 95%
}
  
.malCleanSettingInnerSettings.malCleanSettingPopup .setting-section {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-inline-box;
    display: -webkit-inline-flex;
    display: inline-flex;
    gap: 10px
}

#currently-popup .dataTextButton,
.mainbtns.disabled,
.mainbtns {
    -webkit-transition: 0.25s;
    -o-transition: 0.25s;
    transition: 0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    padding: 5px;
    margin: 4px;
    cursor: pointer;
    background-color: var(--color-background);
    color: var(--color-text)
}

.mainbtns.disabled:before,
.mainbtns.disabled:hover {
    background: 0 0 !important
}

.malCleanMainContainer .mainbtns:hover,
#currently-popup .dataTextButton:hover {
    -webkit-transform: scale(1.04);
    -ms-transform: scale(1.04);
    transform: scale(1.04)
}

.btn-active {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.malCleanSettingPopup .settingContainer.svar .btn-active {
    background-color: var(--color-foreground2) !important;
    color: rgb(159, 173, 189)
}

.btn-active:before {
    font-family: 'Font Awesome 6 Pro';
    content: "\\f00c"
}

.mainbtns.disabled:before {
    font-family: 'Font Awesome 6 Pro';
    content: "\\f05e"
}

.btn-active-def {
    background-color: var(--color-foreground4) !important;
    color: rgb(159, 173, 189)
}

.btn-active-def-2 {
    background-color: var(--color-foreground2) !important;
    color: rgb(159, 173, 189)
}

@keyframes reloadLoop {
    0% {
        background-color: var(--color-background);
    }

    50% {
        background-color: var(--color-foreground4);
    }

    100% {
        background-color: var(--color-background)
    }
}

.display-none {
    display: none !important
}

.customColorsInside {
    gap:10px;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr
}

.customColorsInside .colorGroup .colorOption {
    margin-top: 5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 5px
}

.customColorsInside .colorGroup .colorOption input{
    cursor: pointer
}
.user-history-title {
    width: 80%;
    -webkit-align-self: center;
    -ms-flex-item-align: center;
    -ms-grid-row-align: center;
    align-self: center
}

.user-history-date {
    width:25%;
    text-align: right
}
  
.user-history-cover-link {
     margin-left: -10px;
     height: 70px;
     width:50px;
     margin-top: -10px;
     margin-right: 10px;
     padding-right: 5px
}

.user-history-cover {
    background-size:cover;
    height: 70px;
    width:50px;
    object-fit: cover;
    -webkit-border-top-right-radius: 0 !important;
    border-top-right-radius: 0 !important;
    -webkit-border-bottom-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important
}

.user-history {
    height: 50px;
    background-color: var(--color-foreground);
    margin: 10px 5px;
    padding: 10px;
    border:var(--border) solid var(--border-color);
    -webkit-border-radius: var(--br);
    border-radius: var(--br);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    overflow: hidden
}

.user-history-main .loadmore {
    cursor: pointer;
    background: var(--color-foreground);
    border-radius: var(--border-radius);
    margin-bottom: 25px;
    z-index: 2;
    position: relative
}

body .malCleanMainContainerList .malCleanSettingButtons {
    display: -ms-grid;
    display: grid;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 10px
}

body .malCleanMainContainerList .malCleanSettingButtons button,
body .malCleanMainContainerList .malCleanSettingButtons input {
    background: var(--color-background);
    height: 40px;
    width: auto;
    margin: 4px;
    border: 1px solid var(--border-color);
    border-radius: 4px
}

.malCleanMainContainerList input:focus-visible {
    outline: 2px solid var(--color-foreground4)!important
}

.malCleanMainContainer .malCleanSettingContainer h2 {
    font-size: 13px!important;
    background: var(--color-foreground2);
    border-radius: var(--br);
    padding: 5px!important
}

.malCleanMainContainer .malCleanSettingContainer h3 {
    font-weight: 500!important
}

#myanimelist .malCleanMainContainer .malCleanSettingContainer textarea {
    resize: vertical;
    height: 18px;
    min-height: 18px;
    padding: 10px;
    background: var(--color-foreground2)!important;
}

.anisong-accordion-button {
    text-align: right;
    cursor: pointer;
    display: block;
    width: 85px;
    margin-left: auto;
    margin-right: 5px
}

.anisongs .theme-songs.js-theme-songs {
    margin-bottom: 5px
}

.anisongs video {
    width: 100%;
    margin-top: 10px
}

.anisongs .oped-preview-button.oped-preview-button-gray {
    cursor: pointer;
    display: inline-block;
    height: 8px;
    margin-bottom: -3px;
    width: 15px;
    -webkit-filter: invert(100%) hue-rotate(180deg) brightness(75%) !important;
    filter: invert(100%) hue-rotate(180deg) brightness(75%) !important
}

.theme-songs.js-theme-songs.has-video .fa-star {
    font-family: FontAwesome;
    opacity: .1;
    display: inline;
    margin-left: 5px;
    cursor: pointer;
    -webkit-transition: .3s;
    -o-transition: .3s;
    transition: .3s
}
.theme-songs.js-theme-songs.has-video:hover .fa-star {
    opacity: 1
}

.fa-solid.fa-rotate-right {
    cursor: pointer;
    color: var(--color-link);
}

#badges-iframe {
  -ms-zoom: 0.75;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.5);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  width: 895px;
  max-width: 895px;
  height: 480px;
  max-height: 480px;
  -webkit-resize: none;
  -moz-resize: none;
  resize: none;
  overflow: hidden;
  margin-top: -95px;
  margin-left: -16px
}

#badges-iframe.defaultMal {
    width: 668px;
    max-width: 668px;
    height: 480px;
    max-height: 480px;
    margin-top: -67px;
    margin-left: -6px;
    -webkit-transform: scale(0.35);
        -ms-transform: scale(0.35);
            transform: scale(0.35)
}

div#badges-inner {
  padding: 10px;
  transition: transform .3s ease-in-out;
  background: var(--color-foreground);
  border: var(--border) solid var(--border-color);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius)
}

div#badges-inner.defaultMal {
  padding: 0;
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
}

div#badges-iframe-inner {
  overflow: hidden;
  pointer-events: none;
  border: 1px solid var(--border-color);
  -webkit-box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  box-shadow: 0 0 var(--shadow-strength) var(--shadow-color) !important;
  height: 145px;
  background: var(--color-foreground2);
  -webkit-border-radius: 10px;
  border-radius: 10px
}

div#badges-iframe-inner.defaultMal {
  height: 100px;
  border: 0 !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
  background: var(--color-foreground);
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
}

.sceditor-container.sourceMode.ltr {
  min-height: 100px
}

.newCommentsContainerMain {
  background: var(--color-foreground);
  display: block;
  margin-bottom: 15px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  border: var(--border) solid var(--border-color)
}

.newCommentsContainerMain:hover .newCommentsLinkButton {
 opacity: 1 !important
}

.newCommentsContainer tr {
  background: var(--color-foreground2);
  padding: 5px 0px;
  display: block;
  margin: 10px;
  -webkit-border-radius: var(--border-radius);
  border-radius: var(--border-radius);
  border: var(--border) solid var(--border-color)
}

.comment-profile .newCommentsContainer tr {
  padding: 5px
}

.newCommentsLinkButton,
.newCommentsCommentButton {
  width: 100%;
  height: 0px;
  top: -20px;
  text-align: right;
  display: block;
  position: relative;
  font-family: FontAwesome;
  right: 10px;
}

.newCommentsLinkButton {
  opacity: 0;
  top:10px
}

.comment-profile .newCommentsLinkButton,
.comment-profile .newCommentsCommentButton {
  top:2px;
  right: 2px;
}

.comment-profile .newCommentsCommentButton {
  top:-10px;
}

.newCommentsLoadMoreButton {
   padding: 10px;
   display: block;
   background: var(--color-foreground4);
   margin: 10px;
   margin-bottom: 20px;
   border: var(--border) solid var(--border-color);
   -webkit-border-radius: var(--border-radius);
   border-radius: var(--border-radius);
   cursor: pointer;
   text-align: center
}
`;
let colorFromCoverCSS = `
.lazyloading {
  opacity: 1 !important;
}

footer {
  z-index: 0;
  margin-top: 65px !important;
  position: relative;
}

.dark-mode .profile .user-statistics,
.profile .user-statistics {
  width: 99%
}

.dark-mode .profile .user-comments .comment,
.profile .user-comments .comment,
.dark-mode .page-common .content-container .container-right h2,
.page-common .content-container .container-right h2,
.dark-mode .fav-slide-block,
.fav-slide-block {
  width: 96%
}

.dark-mode body:not(.ownlist),
body:not(.ownlist) {
  background-color: var(--color-background) !important
}

.page-common #myanimelist #contentWrapper {
  background-color: var(--color-backgroundo) !important;
  top: 55px !important;
  padding: 10px;
  margin-left: -15px;
  width: 1070px;
  border-radius: var(--border-radius);
  box-shadow: 0 0 4px var(--shadow-color) !important
}
`;

//CSS MyAnimeList - Clean Main Colors
let defaultColors = `
:root,
body {
  --fg: #181818!important;
  --color-background: #121212!important;
  --color-backgroundo: #12121266!important;
  --color-foreground: #181818!important;
  --color-foreground2: #242424!important;
  --color-foreground3: #323232!important;
  --color-foregroundOP: #181818!important;
  --color-foregroundOP2: #242424!important;
  --color-foreground4: #282828!important;
  --border-color: #222!important;
  --border-radius: 5px!important;
  --color-text: #b6b6b6;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: #9fadbd;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
}`;

let defaultColorsLight = `
:root,
body {
  --fg: #f5f5f5!important;
  --color-background: #eef1fa!important;
  --color-backgroundo: #eef1fa66!important;
  --color-foreground: #f5f5f5!important;
  --color-foreground2: #eeeeee!important;
  --color-foreground3: #e3e3e366!important;
  --color-foregroundOP: #f5f5f5!important;
  --color-foregroundOP2: #e3e3e3!important;
  --color-foreground4: #e3e3e3!important;
  --border-color: #bcbcbc!important;
  --border-radius: 5px!important;
  --color-text: #b6b6b6;
  --color-text-normal: #b6b6b6!important;
  --color-main-text-normal: #c8c8c8!important;
  --color-main-text-light: #a5a5a5!important;
  --color-main-text-op: #ffffff!important;
  --color-link: 9fadbd;
  --color-link2: #7992bb!important;
  --color-text-hover: #cfcfcf!important;
  --color-link-hover: #cee7ff!important
}`;

let defaultCSSFixes = `
${
  svar.scrollbarStyle
    ? `
    ::-webkit-scrollbar {
        background: 0 0
    }
    ::-webkit-scrollbar-thumb {
        background: var(--color-foreground2);
        -webkit-border-radius: 3px;
        border-radius: 3px
    }
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-corner {
        background: var(--color-background)
    }`
    : ``
}

a.feed-main-button {
    top: 0!important
}
  
.feed-main {
    padding: 10px
}
  
.feed-main a:hover {
    text-decoration: none!important
}
  
#currently-popup iframe {
    border: 0!important
}

.list-entries .section-name,
.dark-mode .page-common #horiznav_nav,
.page-common div#horiznav_nav {
    border-color: var(--border-color)!important
}

.profile .user-statistics .user-statistics-stats .updates {
    padding-right:10px
}

.bannerHover {
    height:90px!important
}

.profileRightActions {
    position: relative;
    top: -50px
}

.widget-slide-block .widget-slide .btn-anime .link .title.color-pc-constant {
    color: var(--color-main-text-normal)
}

.tooltipBody {
    padding:10px
}

.bannerDiv {
    margin: -5px -10px 0 -10px
}
`;

// Minify CSS
const minifyCSS = (css) => {
  if (!css.includes("/*")) {
    return css.replace(/\s*([{}:;,])\s*/g, "$1").replace(/\n+/g, "");
  }
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/\n+/g, "");
};
[styles, colorFromCoverCSS, defaultColors, defaultColorsLight, defaultCSSFixes].forEach((css, i, arr) => {
  arr[i] = minifyCSS(css);
});

// Create Style Elements
let styleSheet = create("style", { id: "malCleanMainCSS" });
let styleSheet2 = create("style", { id: "colorFromCoverCSS" });
document.head.appendChild(styleSheet);

// Apply Styles
const applyTheme = () => {
  const hasCustomTheme = $("style:contains(--fg:)").length;
  const isDarkMode = $("html").hasClass("dark-mode");
  let finalCSS = styles;
  if (!hasCustomTheme) {
    finalCSS += (isDarkMode ? defaultColors : defaultColorsLight) + defaultCSSFixes;
    defaultMal = 1;
  }
  styleSheet.textContent = finalCSS;
};
applyTheme();
