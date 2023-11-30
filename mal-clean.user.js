// ==UserScript==
// @name        MAL-Clean-JS
// @namespace   https://github.com/KanashiiDev
// @match       https://myanimelist.net/*
// @grant       none
// @version     1.01
// @author      KanashiiDev
// @description Extra customization for MyAnimeList - Clean Userstyle
// @license     GPL-3.0-or-later
// @icon        https://myanimelist.net/favicon.ico
// @supportURL  https://github.com/KanashiiDev/MAL-Clean-JS/issues
// @run-at      document-end
// ==/UserScript==

//LZString
var LZString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var i={compressToBase64:function(r){if(null==r)return"";var n=i._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(n){return t(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:i._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=i.compress(r),n=new Uint8Array(2*o.length),e=0,t=o.length;e<t;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;e<t;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":i._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(o){return t(n,r.charAt(o))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,t,i,s={},u={},a="",p="",c="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<r.length;i+=1)if(a=r.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),p=c+a,Object.prototype.hasOwnProperty.call(s,p))c=p;else{if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),s[p]=f++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:i._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var t,i,s,u,a,p,c,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(s=0,a=Math.pow(2,2),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 2:return""}for(l[3]=c,i=c,v.push(c);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(c=s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[c])m=l[c];else{if(c!==h)return null;m=i+i.charAt(0)}v.push(m),l[h++]=i+m.charAt(0),i=m,0==--f&&(f=Math.pow(2,d),d++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module?module.exports=LZString:"undefined"!=typeof angular&&null!=angular&&angular.module("LZString",[]).factory("LZString",function(){return LZString});
//TinyColor Min
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t="undefined"!=typeof globalThis?globalThis:t||self).tinycolor=r()}(this,(function(){"use strict";function t(r){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(r)}var r=/^\s+/,e=/\s+$/;function n(a,i){if(i=i||{},(a=a||"")instanceof n)return a;if(!(this instanceof n))return new n(a,i);var o=function(n){var a={r:0,g:0,b:0},i=1,o=null,h=null,s=null,f=!1,u=!1;"string"==typeof n&&(n=function(t){t=t.replace(r,"").replace(e,"").toLowerCase();var n,a=!1;if(y[t])t=y[t],a=!0;else if("transparent"==t)return{r:0,g:0,b:0,a:0,format:"name"};if(n=T.rgb.exec(t))return{r:n[1],g:n[2],b:n[3]};if(n=T.rgba.exec(t))return{r:n[1],g:n[2],b:n[3],a:n[4]};if(n=T.hsl.exec(t))return{h:n[1],s:n[2],l:n[3]};if(n=T.hsla.exec(t))return{h:n[1],s:n[2],l:n[3],a:n[4]};if(n=T.hsv.exec(t))return{h:n[1],s:n[2],v:n[3]};if(n=T.hsva.exec(t))return{h:n[1],s:n[2],v:n[3],a:n[4]};if(n=T.hex8.exec(t))return{r:w(n[1]),g:w(n[2]),b:w(n[3]),a:F(n[4]),format:a?"name":"hex8"};if(n=T.hex6.exec(t))return{r:w(n[1]),g:w(n[2]),b:w(n[3]),format:a?"name":"hex"};if(n=T.hex4.exec(t))return{r:w(n[1]+""+n[1]),g:w(n[2]+""+n[2]),b:w(n[3]+""+n[3]),a:F(n[4]+""+n[4]),format:a?"name":"hex8"};if(n=T.hex3.exec(t))return{r:w(n[1]+""+n[1]),g:w(n[2]+""+n[2]),b:w(n[3]+""+n[3]),format:a?"name":"hex"};return!1}(n));"object"==t(n)&&(E(n.r)&&E(n.g)&&E(n.b)?(l=n.r,c=n.g,d=n.b,a={r:255*A(l,255),g:255*A(c,255),b:255*A(d,255)},f=!0,u="%"===String(n.r).substr(-1)?"prgb":"rgb"):E(n.h)&&E(n.s)&&E(n.v)?(o=H(n.s),h=H(n.v),a=function(t,r,e){t=6*A(t,360),r=A(r,100),e=A(e,100);var n=Math.floor(t),a=t-n,i=e*(1-r),o=e*(1-a*r),h=e*(1-(1-a)*r),s=n%6,f=[e,o,i,i,h,e][s],u=[h,e,e,o,i,i][s],l=[i,i,h,e,e,o][s];return{r:255*f,g:255*u,b:255*l}}(n.h,o,h),f=!0,u="hsv"):E(n.h)&&E(n.s)&&E(n.l)&&(o=H(n.s),s=H(n.l),a=function(t,r,e){var n,a,i;function o(t,r,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?t+6*(r-t)*e:e<.5?r:e<2/3?t+(r-t)*(2/3-e)*6:t}if(t=A(t,360),r=A(r,100),e=A(e,100),0===r)n=a=i=e;else{var h=e<.5?e*(1+r):e+r-e*r,s=2*e-h;n=o(s,h,t+1/3),a=o(s,h,t),i=o(s,h,t-1/3)}return{r:255*n,g:255*a,b:255*i}}(n.h,o,s),f=!0,u="hsl"),n.hasOwnProperty("a")&&(i=n.a));var l,c,d;return i=x(i),{ok:f,format:n.format||u,r:Math.min(255,Math.max(a.r,0)),g:Math.min(255,Math.max(a.g,0)),b:Math.min(255,Math.max(a.b,0)),a:i}}(a);this._originalInput=a,this._r=o.r,this._g=o.g,this._b=o.b,this._a=o.a,this._roundA=Math.round(100*this._a)/100,this._format=i.format||o.format,this._gradientType=i.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=o.ok}function a(t,r,e){t=A(t,255),r=A(r,255),e=A(e,255);var n,a,i=Math.max(t,r,e),o=Math.min(t,r,e),h=(i+o)/2;if(i==o)n=a=0;else{var s=i-o;switch(a=h>.5?s/(2-i-o):s/(i+o),i){case t:n=(r-e)/s+(r<e?6:0);break;case r:n=(e-t)/s+2;break;case e:n=(t-r)/s+4}n/=6}return{h:n,s:a,l:h}}function i(t,r,e){t=A(t,255),r=A(r,255),e=A(e,255);var n,a,i=Math.max(t,r,e),o=Math.min(t,r,e),h=i,s=i-o;if(a=0===i?0:s/i,i==o)n=0;else{switch(i){case t:n=(r-e)/s+(r<e?6:0);break;case r:n=(e-t)/s+2;break;case e:n=(t-r)/s+4}n/=6}return{h:n,s:a,v:h}}function o(t,r,e,n){var a=[S(Math.round(t).toString(16)),S(Math.round(r).toString(16)),S(Math.round(e).toString(16))];return n&&a[0].charAt(0)==a[0].charAt(1)&&a[1].charAt(0)==a[1].charAt(1)&&a[2].charAt(0)==a[2].charAt(1)?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function h(t,r,e,n){return[S(R(n)),S(Math.round(t).toString(16)),S(Math.round(r).toString(16)),S(Math.round(e).toString(16))].join("")}function s(t,r){r=0===r?0:r||10;var e=n(t).toHsl();return e.s-=r/100,e.s=k(e.s),n(e)}function f(t,r){r=0===r?0:r||10;var e=n(t).toHsl();return e.s+=r/100,e.s=k(e.s),n(e)}function u(t){return n(t).desaturate(100)}function l(t,r){r=0===r?0:r||10;var e=n(t).toHsl();return e.l+=r/100,e.l=k(e.l),n(e)}function c(t,r){r=0===r?0:r||10;var e=n(t).toRgb();return e.r=Math.max(0,Math.min(255,e.r-Math.round(-r/100*255))),e.g=Math.max(0,Math.min(255,e.g-Math.round(-r/100*255))),e.b=Math.max(0,Math.min(255,e.b-Math.round(-r/100*255))),n(e)}function d(t,r){r=0===r?0:r||10;var e=n(t).toHsl();return e.l-=r/100,e.l=k(e.l),n(e)}function g(t,r){var e=n(t).toHsl(),a=(e.h+r)%360;return e.h=a<0?360+a:a,n(e)}function b(t){var r=n(t).toHsl();return r.h=(r.h+180)%360,n(r)}function m(t,r){if(isNaN(r)||r<=0)throw new Error("Argument to polyad must be a positive number");for(var e=n(t).toHsl(),a=[n(t)],i=360/r,o=1;o<r;o++)a.push(n({h:(e.h+o*i)%360,s:e.s,l:e.l}));return a}function p(t){var r=n(t).toHsl(),e=r.h;return[n(t),n({h:(e+72)%360,s:r.s,l:r.l}),n({h:(e+216)%360,s:r.s,l:r.l})]}function _(t,r,e){r=r||6,e=e||30;var a=n(t).toHsl(),i=360/e,o=[n(t)];for(a.h=(a.h-(i*r>>1)+720)%360;--r;)a.h=(a.h+i)%360,o.push(n(a));return o}function v(t,r){r=r||6;for(var e=n(t).toHsv(),a=e.h,i=e.s,o=e.v,h=[],s=1/r;r--;)h.push(n({h:a,s:i,v:o})),o=(o+s)%1;return h}n.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},getLuminance:function(){var t,r,e,n=this.toRgb();return t=n.r/255,r=n.g/255,e=n.b/255,.2126*(t<=.03928?t/12.92:Math.pow((t+.055)/1.055,2.4))+.7152*(r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))+.0722*(e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))},setAlpha:function(t){return this._a=x(t),this._roundA=Math.round(100*this._a)/100,this},toHsv:function(){var t=i(this._r,this._g,this._b);return{h:360*t.h,s:t.s,v:t.v,a:this._a}},toHsvString:function(){var t=i(this._r,this._g,this._b),r=Math.round(360*t.h),e=Math.round(100*t.s),n=Math.round(100*t.v);return 1==this._a?"hsv("+r+", "+e+"%, "+n+"%)":"hsva("+r+", "+e+"%, "+n+"%, "+this._roundA+")"},toHsl:function(){var t=a(this._r,this._g,this._b);return{h:360*t.h,s:t.s,l:t.l,a:this._a}},toHslString:function(){var t=a(this._r,this._g,this._b),r=Math.round(360*t.h),e=Math.round(100*t.s),n=Math.round(100*t.l);return 1==this._a?"hsl("+r+", "+e+"%, "+n+"%)":"hsla("+r+", "+e+"%, "+n+"%, "+this._roundA+")"},toHex:function(t){return o(this._r,this._g,this._b,t)},toHexString:function(t){return"#"+this.toHex(t)},toHex8:function(t){return function(t,r,e,n,a){var i=[S(Math.round(t).toString(16)),S(Math.round(r).toString(16)),S(Math.round(e).toString(16)),S(R(n))];if(a&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)&&i[3].charAt(0)==i[3].charAt(1))return i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0)+i[3].charAt(0);return i.join("")}(this._r,this._g,this._b,this._a,t)},toHex8String:function(t){return"#"+this.toHex8(t)},toRgb:function(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+")":"rgba("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:Math.round(100*A(this._r,255))+"%",g:Math.round(100*A(this._g,255))+"%",b:Math.round(100*A(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+Math.round(100*A(this._r,255))+"%, "+Math.round(100*A(this._g,255))+"%, "+Math.round(100*A(this._b,255))+"%)":"rgba("+Math.round(100*A(this._r,255))+"%, "+Math.round(100*A(this._g,255))+"%, "+Math.round(100*A(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":!(this._a<1)&&(M[o(this._r,this._g,this._b,!0)]||!1)},toFilter:function(t){var r="#"+h(this._r,this._g,this._b,this._a),e=r,a=this._gradientType?"GradientType = 1, ":"";if(t){var i=n(t);e="#"+h(i._r,i._g,i._b,i._a)}return"progid:DXImageTransform.Microsoft.gradient("+a+"startColorstr="+r+",endColorstr="+e+")"},toString:function(t){var r=!!t;t=t||this._format;var e=!1,n=this._a<1&&this._a>=0;return r||!n||"hex"!==t&&"hex6"!==t&&"hex3"!==t&&"hex4"!==t&&"hex8"!==t&&"name"!==t?("rgb"===t&&(e=this.toRgbString()),"prgb"===t&&(e=this.toPercentageRgbString()),"hex"!==t&&"hex6"!==t||(e=this.toHexString()),"hex3"===t&&(e=this.toHexString(!0)),"hex4"===t&&(e=this.toHex8String(!0)),"hex8"===t&&(e=this.toHex8String()),"name"===t&&(e=this.toName()),"hsl"===t&&(e=this.toHslString()),"hsv"===t&&(e=this.toHsvString()),e||this.toHexString()):"name"===t&&0===this._a?this.toName():this.toRgbString()},clone:function(){return n(this.toString())},_applyModification:function(t,r){var e=t.apply(null,[this].concat([].slice.call(r)));return this._r=e._r,this._g=e._g,this._b=e._b,this.setAlpha(e._a),this},lighten:function(){return this._applyModification(l,arguments)},brighten:function(){return this._applyModification(c,arguments)},darken:function(){return this._applyModification(d,arguments)},desaturate:function(){return this._applyModification(s,arguments)},saturate:function(){return this._applyModification(f,arguments)},greyscale:function(){return this._applyModification(u,arguments)},spin:function(){return this._applyModification(g,arguments)},_applyCombination:function(t,r){return t.apply(null,[this].concat([].slice.call(r)))},analogous:function(){return this._applyCombination(_,arguments)},complement:function(){return this._applyCombination(b,arguments)},monochromatic:function(){return this._applyCombination(v,arguments)},splitcomplement:function(){return this._applyCombination(p,arguments)},triad:function(){return this._applyCombination(m,[3])},tetrad:function(){return this._applyCombination(m,[4])}},n.fromRatio=function(r,e){if("object"==t(r)){var a={};for(var i in r)r.hasOwnProperty(i)&&(a[i]="a"===i?r[i]:H(r[i]));r=a}return n(r,e)},n.equals=function(t,r){return!(!t||!r)&&n(t).toRgbString()==n(r).toRgbString()},n.random=function(){return n.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})},n.mix=function(t,r,e){e=0===e?0:e||50;var a=n(t).toRgb(),i=n(r).toRgb(),o=e/100;return n({r:(i.r-a.r)*o+a.r,g:(i.g-a.g)*o+a.g,b:(i.b-a.b)*o+a.b,a:(i.a-a.a)*o+a.a})},n.readability=function(t,r){var e=n(t),a=n(r);return(Math.max(e.getLuminance(),a.getLuminance())+.05)/(Math.min(e.getLuminance(),a.getLuminance())+.05)},n.isReadable=function(t,r,e){var a,i,o=n.readability(t,r);switch(i=!1,(a=function(t){var r,e;r=((t=t||{level:"AA",size:"small"}).level||"AA").toUpperCase(),e=(t.size||"small").toLowerCase(),"AA"!==r&&"AAA"!==r&&(r="AA");"small"!==e&&"large"!==e&&(e="small");return{level:r,size:e}}(e)).level+a.size){case"AAsmall":case"AAAlarge":i=o>=4.5;break;case"AAlarge":i=o>=3;break;case"AAAsmall":i=o>=7}return i},n.mostReadable=function(t,r,e){var a,i,o,h,s=null,f=0;i=(e=e||{}).includeFallbackColors,o=e.level,h=e.size;for(var u=0;u<r.length;u++)(a=n.readability(t,r[u]))>f&&(f=a,s=n(r[u]));return n.isReadable(t,s,{level:o,size:h})||!i?s:(e.includeFallbackColors=!1,n.mostReadable(t,["#fff","#000"],e))};var y=n.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},M=n.hexNames=function(t){var r={};for(var e in t)t.hasOwnProperty(e)&&(r[t[e]]=e);return r}(y);function x(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function A(t,r){(function(t){return"string"==typeof t&&-1!=t.indexOf(".")&&1===parseFloat(t)})(t)&&(t="100%");var e=function(t){return"string"==typeof t&&-1!=t.indexOf("%")}(t);return t=Math.min(r,Math.max(0,parseFloat(t))),e&&(t=parseInt(t*r,10)/100),Math.abs(t-r)<1e-6?1:t%r/parseFloat(r)}function k(t){return Math.min(1,Math.max(0,t))}function w(t){return parseInt(t,16)}function S(t){return 1==t.length?"0"+t:""+t}function H(t){return t<=1&&(t=100*t+"%"),t}function R(t){return Math.round(255*parseFloat(t)).toString(16)}function F(t){return w(t)/255}var C,q,N,T=(q="[\\s|\\(]+("+(C="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)")+")[,|\\s]+("+C+")[,|\\s]+("+C+")\\s*\\)?",N="[\\s|\\(]+("+C+")[,|\\s]+("+C+")[,|\\s]+("+C+")[,|\\s]+("+C+")\\s*\\)?",{CSS_UNIT:new RegExp(C),rgb:new RegExp("rgb"+q),rgba:new RegExp("rgba"+N),hsl:new RegExp("hsl"+q),hsla:new RegExp("hsla"+N),hsv:new RegExp("hsv"+q),hsva:new RegExp("hsva"+N),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/});function E(t){return!!T.CSS_UNIT.exec(t)}return n}));
//ColorThief Min
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t||self).ColorThief=r()}(this,function(){if(!t)var t={map:function(t,r){var n={};return r?t.map(function(t,o){return n.index=o,r.call(n,t)}):t.slice()},naturalOrder:function(t,r){return t<r?-1:t>r?1:0},sum:function(t,r){var n={};return t.reduce(r?function(t,o,e){return n.index=e,t+r.call(n,o)}:function(t,r){return t+r},0)},max:function(r,n){return Math.max.apply(null,n?t.map(r,n):r)}};var r=function(){var r=5,n=8-r,o=1e3;function e(t,n,o){return(t<<2*r)+(n<<r)+o}function i(t){var r=[],n=!1;function o(){r.sort(t),n=!0}return{push:function(t){r.push(t),n=!1},peek:function(t){return n||o(),void 0===t&&(t=r.length-1),r[t]},pop:function(){return n||o(),r.pop()},size:function(){return r.length},map:function(t){return r.map(t)},debug:function(){return n||o(),r}}}function u(t,r,n,o,e,i,u){var a=this;a.r1=t,a.r2=r,a.g1=n,a.g2=o,a.b1=e,a.b2=i,a.histo=u}function a(){this.vboxes=new i(function(r,n){return t.naturalOrder(r.vbox.count()*r.vbox.volume(),n.vbox.count()*n.vbox.volume())})}function c(r,n){if(n.count()){var o=n.r2-n.r1+1,i=n.g2-n.g1+1,u=t.max([o,i,n.b2-n.b1+1]);if(1==n.count())return[n.copy()];var a,c,f,s,l=0,h=[],v=[];if(u==o)for(a=n.r1;a<=n.r2;a++){for(s=0,c=n.g1;c<=n.g2;c++)for(f=n.b1;f<=n.b2;f++)s+=r[e(a,c,f)]||0;h[a]=l+=s}else if(u==i)for(a=n.g1;a<=n.g2;a++){for(s=0,c=n.r1;c<=n.r2;c++)for(f=n.b1;f<=n.b2;f++)s+=r[e(c,a,f)]||0;h[a]=l+=s}else for(a=n.b1;a<=n.b2;a++){for(s=0,c=n.r1;c<=n.r2;c++)for(f=n.g1;f<=n.g2;f++)s+=r[e(c,f,a)]||0;h[a]=l+=s}return h.forEach(function(t,r){v[r]=l-t}),function(t){var r,o,e,i,u,c=t+"1",f=t+"2",s=0;for(a=n[c];a<=n[f];a++)if(h[a]>l/2){for(e=n.copy(),i=n.copy(),u=(r=a-n[c])<=(o=n[f]-a)?Math.min(n[f]-1,~~(a+o/2)):Math.max(n[c],~~(a-1-r/2));!h[u];)u++;for(s=v[u];!s&&h[u-1];)s=v[--u];return e[f]=u,i[c]=e[f]+1,[e,i]}}(u==o?"r":u==i?"g":"b")}}return u.prototype={volume:function(t){var r=this;return r._volume&&!t||(r._volume=(r.r2-r.r1+1)*(r.g2-r.g1+1)*(r.b2-r.b1+1)),r._volume},count:function(t){var r=this,n=r.histo;if(!r._count_set||t){var o,i,u,a=0;for(o=r.r1;o<=r.r2;o++)for(i=r.g1;i<=r.g2;i++)for(u=r.b1;u<=r.b2;u++)a+=n[e(o,i,u)]||0;r._count=a,r._count_set=!0}return r._count},copy:function(){var t=this;return new u(t.r1,t.r2,t.g1,t.g2,t.b1,t.b2,t.histo)},avg:function(t){var n=this,o=n.histo;if(!n._avg||t){var i,u,a,c,f=0,s=1<<8-r,l=0,h=0,v=0;for(u=n.r1;u<=n.r2;u++)for(a=n.g1;a<=n.g2;a++)for(c=n.b1;c<=n.b2;c++)f+=i=o[e(u,a,c)]||0,l+=i*(u+.5)*s,h+=i*(a+.5)*s,v+=i*(c+.5)*s;n._avg=f?[~~(l/f),~~(h/f),~~(v/f)]:[~~(s*(n.r1+n.r2+1)/2),~~(s*(n.g1+n.g2+1)/2),~~(s*(n.b1+n.b2+1)/2)]}return n._avg},contains:function(t){var r=this,o=t[0]>>n;return gval=t[1]>>n,bval=t[2]>>n,o>=r.r1&&o<=r.r2&&gval>=r.g1&&gval<=r.g2&&bval>=r.b1&&bval<=r.b2}},a.prototype={push:function(t){this.vboxes.push({vbox:t,color:t.avg()})},palette:function(){return this.vboxes.map(function(t){return t.color})},size:function(){return this.vboxes.size()},map:function(t){for(var r=this.vboxes,n=0;n<r.size();n++)if(r.peek(n).vbox.contains(t))return r.peek(n).color;return this.nearest(t)},nearest:function(t){for(var r,n,o,e=this.vboxes,i=0;i<e.size();i++)((n=Math.sqrt(Math.pow(t[0]-e.peek(i).color[0],2)+Math.pow(t[1]-e.peek(i).color[1],2)+Math.pow(t[2]-e.peek(i).color[2],2)))<r||void 0===r)&&(r=n,o=e.peek(i).color);return o},forcebw:function(){var r=this.vboxes;r.sort(function(r,n){return t.naturalOrder(t.sum(r.color),t.sum(n.color))});var n=r[0].color;n[0]<5&&n[1]<5&&n[2]<5&&(r[0].color=[0,0,0]);var o=r.length-1,e=r[o].color;e[0]>251&&e[1]>251&&e[2]>251&&(r[o].color=[255,255,255])}},{quantize:function(f,s){if(!f.length||s<2||s>256)return!1;var l=function(t){var o,i=new Array(1<<3*r);return t.forEach(function(t){o=e(t[0]>>n,t[1]>>n,t[2]>>n),i[o]=(i[o]||0)+1}),i}(f);l.forEach(function(){});var h=function(t,r){var o,e,i,a=1e6,c=0,f=1e6,s=0,l=1e6,h=0;return t.forEach(function(t){(o=t[0]>>n)<a?a=o:o>c&&(c=o),(e=t[1]>>n)<f?f=e:e>s&&(s=e),(i=t[2]>>n)<l?l=i:i>h&&(h=i)}),new u(a,c,f,s,l,h,r)}(f,l),v=new i(function(r,n){return t.naturalOrder(r.count(),n.count())});function g(t,r){for(var n,e=t.size(),i=0;i<o;){if(e>=r)return;if(i++>o)return;if((n=t.pop()).count()){var u=c(l,n),a=u[0],f=u[1];if(!a)return;t.push(a),f&&(t.push(f),e++)}else t.push(n),i++}}v.push(h),g(v,.75*s);for(var p=new i(function(r,n){return t.naturalOrder(r.count()*r.volume(),n.count()*n.volume())});v.size();)p.push(v.pop());g(p,s);for(var b=new a;p.size();)b.push(p.pop());return b}}}().quantize,n=function(t){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.width=this.canvas.width=t.naturalWidth,this.height=this.canvas.height=t.naturalHeight,this.context.drawImage(t,0,0,this.width,this.height)};n.prototype.getImageData=function(){return this.context.getImageData(0,0,this.width,this.height)};var o=function(){};return o.prototype.getColor=function(t,r){return void 0===r&&(r=10),this.getPalette(t,5,r)[0]},o.prototype.getPalette=function(t,o,e){var i=function(t){var r=t.colorCount,n=t.quality;if(void 0!==r&&Number.isInteger(r)){if(1===r)throw new Error("colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()");r=Math.max(r,2),r=Math.min(r,20)}else r=10;return(void 0===n||!Number.isInteger(n)||n<1)&&(n=10),{colorCount:r,quality:n}}({colorCount:o,quality:e}),u=new n(t),a=function(t,r,n){for(var o,e,i,u,a,c=t,f=[],s=0;s<r;s+=n)e=c[0+(o=4*s)],i=c[o+1],u=c[o+2],(void 0===(a=c[o+3])||a>=125)&&(e>250&&i>250&&u>250||f.push([e,i,u]));return f}(u.getImageData().data,u.width*u.height,i.quality),c=r(a,i.colorCount);return c?c.palette():null},o.prototype.getColorFromUrl=function(t,r,n){var o=this,e=document.createElement("img");e.addEventListener("load",function(){var i=o.getPalette(e,5,n);r(i[0],t)}),e.src=t},o.prototype.getImageData=function(t,r){var n=new XMLHttpRequest;n.open("GET",t,!0),n.responseType="arraybuffer",n.onload=function(){if(200==this.status){var t=new Uint8Array(this.response);i=t.length;for(var n=new Array(i),o=0;o<t.length;o++)n[o]=String.fromCharCode(t[o]);var e=n.join(""),u=window.btoa(e);r("data:image/png;base64,"+u)}},n.send()},o.prototype.getColorAsync=function(t,r,n){var o=this;this.getImageData(t,function(t){var e=document.createElement("img");e.addEventListener("load",function(){var t=o.getPalette(e,5,n);r(t[0],this)}),e.src=t})},o});
//Create Element Function
function create(e,t,n){if(!e)throw SyntaxError("'tag' not defined");var r,i,f=document.createElement(e);if(t)for(r in t)if("style"===r)for(i in t.style)f.style[i]=t.style[i];else t[r]&&f.setAttribute(r,t[r]);return n&&(f.innerHTML=n),f}
//Time Calculate
function nativeTimeElement(e){let $=new Date(1e3*e);return function e(){let r=Math.round(new Date().valueOf()/1e3)-Math.round($.valueOf()/1e3);if(0===r)return"Now";if(1===r)return"1 second ago";if(r<60)return r+" seconds ago";if(r<120)return"1 minute ago";if(r<3600)return Math.floor(r/60)+" minutes ago";else if(r<7200)return"1 hour ago";else if(r<86400)return Math.floor(r/3600)+" hours ago";else if(r<172800)return"1 day ago";else if(r<604800)return Math.floor(r/86400)+" days ago";else if(r<1209600)return"1 week ago";else if(r<2419200)return Math.floor(r/604800)+" weeks ago";else if(r<29030400)return Math.floor(r/2419200)+" months ago";else return Math.floor(r/29030400)+" years ago"}()}
//Set Element
function set(q, tag, attrs, html) {if(q === 1) {tag = document.querySelector(tag);}if(q === 2) {tag = document.querySelectorAll(tag);}if(!tag){return;};var ele = tag,attrName,styleName;if (attrs) for (attrName in attrs) {if (attrName === "style") for (styleName in attrs.style) {ele.style[styleName] = attrs.style[styleName];}if (attrName === "sa")for (styleName in attrs.sa) {ele.setAttribute("style",attrs.sa[styleName]);}if (attrName === "sap")for (styleName in attrs.sap) {ele.parentElement.setAttribute("style",attrs.sap[styleName]);}if (attrName === "r"){ele.remove();}if (attrName === "pp")for (styleName in attrs.pp) {ele.prepend(document.querySelector(attrs.pp[styleName]))}if (attrName === "sal")for (styleName in attrs.sal) {for (let x = 0; x < tag.length; x++) {tag[x].setAttribute("style",attrs.sal[styleName]);}}if (attrName === "sl")for (styleName in attrs.sl) {for (let x = 0; x < tag.length; x++) {tag[x].style[styleName] = attrs.sl[styleName];}}}if (html) ele.innerHTML = html;return ele;}
//Variables
var animebg = true;
var charbg = true;
var peopleHeader = true;
var animeHeader = true;
var characterHeader = true;
var characterNameAlt = true;
var profileHeader = true;
var customcss = true;
var alstyle = true;
var styles = `
.maindiv {
    right: 0;
    width: 500px;
    margin: auto;
    margin-right: 15px;
    -webkit-transition: 1s;
    -o-transition: 1s;
    transition: 1s;
    position: fixed;
    top:55px;
    z-index:11;
    background-color: var(--color-foreground)!important;
    overflow-y: scroll;
    display: -ms-grid;
    display: grid;
    color: rgb(var(--color-text));
    padding: 10px;
    border: 1px solid #6969694d;
    -webkit-border-radius: 10px;
            border-radius: 10px
    }
.childdiv{
    border-top:1px solid;
    margin-top:10px;
    }
.textpb{
    padding-top:5px!important;
    font-weight:bold
    }
.textpb a{
    color: rgb(var(--color-link))!important;
    }
.maindivheader {
    margin-bottom: 5px;
    margin-left: 5px;
    display: grid;
    grid-template-columns: 4fr 1fr 1fr;
    align-items: center;
    font-size: medium;
    }
.buttonsDiv {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    word-break: break-word;
    white-space-collapse: break-spaces;
    }
.buttonsDiv > .mainbtns {
    display: grid;
    grid-template-rows: 15px 10px;
    align-items: center
    }
.mainbtns {
    -webkit-transition:0.25s;
    -o-transition:0.25s;
    transition:0.25s;
    border: 0px;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    padding: 4px;
    margin: 4px;
    cursor: pointer;
     background-color: var(--color-background);
    color: rgb(var(--color-text));
    }
    .mainbtns:hover{
    transform:scale(1.04)
    }
.mainbtns hr{
    width:100%
}
.btn-active {
    background-color: var(--color-foreground4)!important;
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
    background-color: var(--color-background);
  }
}
button#customcss,
button#custombg,
button#custompf{
    height: 40px;
    width: 45%;
}
input#cssinput,
input#bginput,
input#pfinput{
    width: 47%;
    height: 15px;
    margin-right: 5px;
}
.maindiv .childdiv h2{
    background: var(--fg2);
    border-radius: var(--br);
    padding: 5px;}
    .maindiv .childdiv h3{font-weight:500}
    `;
var styles2 = `
footer {
    z-index: 0;
    margin-top: 65px!important;
    position: relative
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
#myanimelist:before {
    content: "";
    width: 200%;
    left: 0;
    position: fixed;
    height: 200%;
    z-index: 0;
    -webkit-backdrop-filter: brightness(bg_brightness)contrast(bg_contrast)saturate(bg_saturate)!important;
    backdrop-filter: brightness(bg_brightness)contrast(bg_contrast)saturate(bg_saturate)!important;
    }
.dark-mode body:not(.ownlist),
    body:not(.ownlist) {
    background: url(bg_image)!important;
    background-size: cover!important;
    background-attachment: fixed!important;
    background-color: var(--color-background)!important;
    }
.page-common #myanimelist #contentWrapper {
    background-color: var(--color-backgroundo)!important;
    top: 55px!important;
    padding: 10px;
    margin-left: -15px;
    width: 1070px;
    border-radius: var(--border-radius);
    box-shadow: 0 0 4px var(--shadow-color)!important;
    }`;
var styles3 = ` body,
    :root {
        --color-background: #0c1525!important;
        --color-backgroundo: #0c1525!important;
        --color-foreground: #161f2f!important;
        --color-foreground2: #202939!important;
        --color-foreground3: rgba(37,46,62,0.3)!important;
        --color-foreground4: #2a3343!important;
        --br: 5px!important;
        --color-text: 182 182 182;
    --color-text-normal: #b6b6b6!important;
    --color-main-text-normal: #c8c8c8!important;
    --color-main-text-light: #a5a5a5!important;
    --color-main-text-op: #fff!important;
    --color-link: 159, 173, 189;
    --color-link2: #7992bb!important;
    --color-text-hover: #cfcfcf!important;
    --color-link-hover: #cee7ff!important;
    }`;
var styleSheet = document.createElement("style");
var styleSheet2 = document.createElement("style");
var styleSheet3 = document.createElement("style");
var stButton = create("li", {});
stButton.onclick = () => {
  Settings();
};
var stLink = create("a", {}, "MalClean Settings");
var active = false;
var buttonclose = create("button", {
  class: "mainbtns",
  id: "closebtn"
}, "Close");
buttonclose.onclick = () => {
  closeDiv();
};
var buttonreload = create("button", {
  class: "mainbtns",
  id: "reloadbtn"
}, "Refresh");
buttonreload.onclick = () => {
  reload();
};
var button1 = create("button", {
  class: "mainbtns",
  id: "animebgbtn"
}, '<b>'+"Anime/Manga"+'</b><hr>' + "Background Color Based Image");
button1.onclick = () => {
animebg = checkdata(animebg,"animebg");getSettings();reloadset();
};
var button2 = create("button", {
  class: "mainbtns",
  id: "animeHeaderbtn"
}, '<b>'+"Anime/Manga"+'</b><hr>' + "Change Title Position");
button2.onclick = () => {
animeHeader = checkdata(animeHeader,"animeHeader");getSettings();reloadset();
};
var button3 = create("button", {
  class: "mainbtns",
  id: "charbgbtn"
}, '<b>'+"Character"+'</b><hr>' + "Background Color Based Image");
button3.onclick = () => {
  charbg = checkdata(charbg,"charbg");getSettings();reloadset();
};
var button4 = create("button", {
  class: "mainbtns",
  id: "characterHeaderbtn"
}, '<b>'+"Character"+'</b><hr>' + "Change Name Position");
button4.onclick = () => {
   characterHeader = checkdata(characterHeader,"characterHeader");getSettings();reloadset();
};
var button5 = create("button", {
  class: "mainbtns",
  id: "characterNameAltbtn"
}, '<b>'+"Character"+'</b><hr>' + "Show Alternative Name");
button5.onclick = () => {
     characterNameAlt = checkdata(characterNameAlt,"characterNameAlt");getSettings();reloadset();
};
var button6 = create("button", {
  class: "mainbtns",
  id: "peopleHeaderbtn"
},'<b>'+"People"+'</b><hr>' + "Change Name Position");
button6.onclick = () => {
     peopleHeader = checkdata(peopleHeader,"peopleHeader");getSettings();reloadset();
};
var button7 = create("button", {
  class: "mainbtns",
  id: "customcssbtn"
}, '<b>'+"Profile"+'</b><hr>' + "Show Custom CSS");
button7.onclick = () => {
     customcss = checkdata(customcss,"customcss");getSettings();reloadset();
};
var button9 = create("button", {
  class: "mainbtns",
  id: "profileheaderbtn"
}, '<b>'+"Profile"+'</b><hr>' + "Change Username Position");
button9.onclick = () => {
     profileHeader = checkdata(profileHeader,"profileHeader");getSettings();reloadset();
};
var button10 = create("button", {
  class: "mainbtns",
  id: "alstylebtn"
}, '<b>'+"Profile"+'</b><hr>' + "Anilist Style");
button10.onclick = () => {
     alstyle = checkdata(alstyle,"alstyle");getSettings();reloadset();
};
//alstyle - bg
let bginput = create("input", {
  class: "bginput",
  id: "bginput"
});
var button11 = create("button", {
  class: "mainbtns",
  id: "custombg"
}, "Convert Background to BBCode");
var bginfo = create("p", {
  class: "textpb"
}, "");
button11.onclick = () => {
  if (bginput.value.slice(-1) === "]") {
    bginfo.innerText = "Background Image already converted.";
  } else if (bginput.value.length > 1) {
    bginput.value = "[url=https://custombg/" + LZString.compressToBase64(JSON.stringify(bginput.value)) + "]‎ [/url]";
    bginput.select();
    bginfo.innerHTML = "Background Image Converted. Please copy and paste to your " + "<a class='embedLink' href=\"" + "https://myanimelist.net/editprofile.php" + '">' + "About Me" + "</a>" + " section.";
  } else {
    bginfo.innerText = "Background Image url empty.";
  }
};
bginput.placeholder = "Paste your Background Image Url here";
//alstyle - pf
let pfinput = create("input", {
  class: "bginput",
  id: "pfinput"
});
var button12 = create("button", {
  class: "mainbtns",
  id: "custompf"
}, "Convert Avatar to BBCode");
var pfinfo = create("p", {
  class: "textpb"
}, "");
button12.onclick = () => {
  if (pfinput.value.slice(-1) === "]") {
    pfinfo.innerText = "Background Image already converted.";
  } else if (pfinput.value.length > 1) {
    pfinput.value = "[url=https://custompf/" + LZString.compressToBase64(JSON.stringify(pfinput.value)) + "]‎ [/url]";
    pfinput.select();
    pfinfo.innerHTML = "Avatar Image Converted. Please copy and paste to your " + "<a class='embedLink' href=\"" + "https://myanimelist.net/editprofile.php" + '">' + "About Me" + "</a>" + " section.";
  } else {
    pfinfo.innerText = "Avatar Image url empty.";
  }
};
pfinput.placeholder = "Paste your Avatar Image Url here";
//custom css
var button8 = create("button", {
  class: "mainbtns",
  id: "customcss"
}, "Convert CSS to BBCode");
var cssinfo = create("p", {
  class: "textpb"
}, "");
button8.onclick = () => {
  if (cssinput.value.slice(-1) === "]") {
    cssinfo.innerText = "Css already converted.";
  } else if (cssinput.value.length > 1) {
    cssinput.value = "[url=https://customcss/" + LZString.compressToBase64(JSON.stringify(cssinput.value)) + "]‎ [/url]";
    cssinput.select();
    cssinfo.innerHTML = "Css Converted. Please copy and paste to your " + "<a class='embedLink' href=\"" + "https://myanimelist.net/editprofile.php" + '">' + "About Me" + "</a>" + " section.";
  } else {
    cssinfo.innerText = "Css empty.";
  }
};
let cssinput = create("input", {
  class: "cssinput",
  id: "cssinput"
});
cssinput.placeholder = "Paste your CSS here";
function checkdata(x,y){
  x = JSON.parse(localStorage.getItem(y));
  x = !x;
  localStorage.setItem(y, x);
  return(x);
}
animebg = JSON.parse(localStorage.getItem("animebg"));
charbg = JSON.parse(localStorage.getItem("charbg"));
peopleHeader = JSON.parse(localStorage.getItem("peopleHeader"));
animeHeader = JSON.parse(localStorage.getItem("animeHeader"));
characterHeader = JSON.parse(localStorage.getItem("characterHeader"));
characterNameAlt = JSON.parse(localStorage.getItem("characterNameAlt"));
customcss = JSON.parse(localStorage.getItem("customcss"));
profileHeader = JSON.parse(localStorage.getItem("profileHeader"));
alstyle = JSON.parse(localStorage.getItem("alstyle"));
function reload() {
  window.location.href = window.location.href;
}
function reloadset() {
  reloadbtn.setAttribute("style", "animation:reloadLoop 2.5s infinite");
}
function getSettings() {
  animebgbtn.classList.toggle("btn-active", animebg);
  charbgbtn.classList.toggle("btn-active", charbg);
  peopleHeaderbtn.classList.toggle("btn-active", peopleHeader);
  animeHeaderbtn.classList.toggle("btn-active", animeHeader);
  characterHeaderbtn.classList.toggle("btn-active", characterHeader);
  characterNameAltbtn.classList.toggle("btn-active", characterNameAlt);
  customcssbtn.classList.toggle("btn-active", customcss);
  profileheaderbtn.classList.toggle("btn-active", profileHeader);
  alstylebtn.classList.toggle("btn-active", alstyle);
}
function createDiv() {
  var listDiv = create("div", {
    class: "maindiv",
    id: "listDiv"
  }, '<div class="maindivheader"><b>' + stLink.innerText + '</b></div>');
  var buttonsDiv = create("div", {
    class: "buttonsDiv",
    id: "buttonsDiv"
  });
  var custombgDiv = create("div", {
    class: "childdiv",
    id: "profileDiv"
  }, '<div class="profileHeader"><h2>' + "Al Style - Custom Background Image" + '</h2><h3>' + "Add custom Background Image to your profile. This will be visible to others with the script." + '</h3></div>');
    var custompfDiv = create("div", {
    class: "childdiv",
    id: "profileDiv"
  }, '<div class="profileHeader"><h2>' + "Al Style - Custom Avatar" + '</h2><h3>' + "Add custom Avatar to your profile. This will be visible to others with the script." + '</h3></div>');
  var customcssDiv = create("div", {
    class: "childdiv",
    id: "profileDiv"
  }, '<div class="profileHeader"><h2>' + "Custom CSS" + '</h2><h3>' + "Add custom CSS to your profile. This will be visible to others with the script." + '</h3></div>');
  var buttonsDiv = create("div", {
    class: "buttonsDiv",
    id: "buttonsDiv"
  });
  listDiv.querySelector(".maindivheader").append(buttonreload, buttonclose);
  buttonsDiv.append(button1, button2, button3, button4, button5, button6,button7,button9,button10);
  listDiv.append(buttonsDiv);
  if(alstyle){listDiv.append(custombgDiv,custompfDiv);custombgDiv.append(bginput,button11,bginfo);custompfDiv.append(pfinput,button12,pfinfo);button9.style.display="none";}
  listDiv.append(customcssDiv);
  customcssDiv.append(cssinput,button8,cssinfo);
  document.querySelector("#headerSmall").insertAdjacentElement('afterend', listDiv);
  getSettings();
}
function closeDiv() {
  listDiv.remove();
  active = false;
};
function add() {
  var header = document.querySelector("#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8.on > div > ul > li:nth-child(9)");
  if (!header) {
    setTimeout(add, 100);
    return;
  }
  var gear = document.querySelector("#header-menu > div.header-menu-unit.header-profile.js-header-menu-unit.link-bg.pl8.pr8.on > div > ul > li:nth-child(9) > a > i");
  var gear1 = gear.cloneNode(true);
  stLink.prepend(gear1);
  stButton.append(stLink);
  header.insertAdjacentElement('afterend', stButton);
}
function Settings() {
  active = !active;
  if (active) {
    createDiv();
  }
  if (!active) {
    closeDiv();
  }
}
let v = false;
let lv = 0;
function loadspin(val){let d=document.querySelector("#fancybox-loading > div"); v=val; function l(){lv=lv-40;if(lv < -440){lv =0}if(d){d.style.top = lv+"px";}}if(v){setTimeout(l(),100);return;}else{return;}}

//Main
(function () {
  'use strict';
  add();
  var current = location.pathname;
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  ////Profile Section//-Start-////
  if (/\/(profile)\/.?([\w-]+)?\/?/.test(current)) {
    if(alstyle){document.querySelector("#contentWrapper").setAttribute("style", "opacity:0");}
    let username = current.split("/")[2];
    let banner = create("div", {class: "banner",id: "banner"});
    let shadow = create("div", {class: "banner",id: "shadow"});
    let custombg;
    let custompf;
    shadow.setAttribute("style", "background: linear-gradient(180deg,rgba(6,13,34,0) 40%,rgba(6,13,34,.6));height: 100%;left: 0;position: absolute;top: 0;width: 100%;");
    banner.append(shadow);
    findbg();
    async function findbg(){
      if(document.querySelector("#fancybox-loading")){document.querySelector("#fancybox-loading").style.setProperty('display', 'block', 'important');loadspin(true);};
      let regex = /(custombg)\/([^"]+)/gm;
      let regex2 = /(custompf)\/([^"]+)/gm;
      let about = document.querySelector(".user-profile-about.js-truncate-outer");
      if(document.querySelector(".user-image.mb8 > img")){
      if(!document.querySelector(".user-image.mb8 > img").src){setTimeout(findbg,100);return;}}
      if(about){
        let m = about.innerHTML.match(regex);
        let m2 = about.innerHTML.match(regex2);
            if(m){
            let dat = m[0].replace(regex, "$2");
            custombg =  JSON.parse(LZString.decompressFromBase64(dat));
            banner.setAttribute("style", "background:url(" + custombg + ");background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;");
            alstyle = true;
          }
          if(m2){
            let dat2 = m2[0].replace(regex2, "$2");
            custompf =  JSON.parse(LZString.decompressFromBase64(dat2));
            document.querySelector(".user-image.mb8 > img").setAttribute("src", ""+custompf+"");
            alstyle = true;
          }
         applyAl();
      } else {
      const apiUrl = `https://api.jikan.moe/v4/users/${username}/about`;
      await fetch(apiUrl).then(response => response.json()).then(data => {
        if(data.data.about){
        let match = data.data.about.match(regex);
        let match2 = data.data.about.match(regex2);
          if(match){
            let dat = match[0].replace(regex, "$2");
            custombg =  JSON.parse(LZString.decompressFromBase64(dat));
            banner.setAttribute("style", "background:url(" + custombg + ");background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;");
            alstyle = true;
          }
          if(match2){
            let dat2 = match2[0].replace(regex2, "$2");custompf =  JSON.parse(LZString.decompressFromBase64(dat2));
            document.querySelector(".user-image.mb8 > img").setAttribute("src", ""+custompf+"");
            alstyle = true;
          }
        }
        applyAl();
      });
    }}
    async function applyAl(){
      if (alstyle) {
        let fixstyle = `
@keyframes spin {from {transform:rotate(0deg);}to {transform:rotate(360deg);}}
.profile-about-user.js-truncate-inner img,.user-comments .comment .text .comment-text .userimg{box-shadow:none!important}
.user-profile .user-friends {display: flex;justify-content: space-between}
.user-profile .user-friends .icon-friend {margin: 5px!important;}
.favs{display: -ms-grid!important;background-color: var(--color-foreground);padding:5px;display: grid!important;grid-gap: 5px 5px!important;grid-template-columns: repeat(auto-fill, 76px)!important;-webkit-box-pack: space-evenly!important;-ms-flex-pack: space-evenly!important;justify-content: space-evenly!important;margin-bottom: 12px!important;border-radius: var(--br);}
.profile .user-profile-about .userimg {max-width: 420px;}
.l-listitem-list-item {flex-basis: 64px;-ms-flex-preferred-size: 64px;}
.l-listitem-5_5_items {margin-right: -25px;}.historyname{width: 80%;align-self: center;}
.historydate{width:25%;text-align: right;}
.historyimg{background-size:cover;margin-left: -10px;height: 69px;width:50px;margin-top: -9px;margin-right: 10px;padding-right: 5px;}
.historydiv {height: 50px;background-color: var(--color-foreground);margin: 10px 5px;padding: 10px;border-radius: var(--br);display: flex;justify-content: space-between;overflow: hidden;}
#horiznav_nav .navactive {color: var(--color-text)!important;background: var(--color-foreground2)!important;padding: 5px!important;}`;
    var fixstylesheet = document.createElement("style");
    fixstylesheet.innerText = fixstyle;
    document.head.appendChild(fixstylesheet);
    function gethistory() {
      let animeid;
      let imgdata;
      let i = 0;
      let last;
      let lock = 0;
      let entry;
      let wait = 500;
      const apiUrl = `https://api.jikan.moe/v4/users/${username}/history`;
      fetch(apiUrl).then(response => response.json()).then(data => {
        entry = data.data;
        if(entry.length < 12){last = entry.length} else {last = 12};
        if(entry[0]){
        let head = create("h2", {class: "mt16"},"Activity");
          document.querySelector("#statistics").insertAdjacentElement('beforeend', head);
          myLoop();
        }
        function myLoop() {
          setTimeout(function () {
            if(i<last)getimgf();}, wait);
        }
        async function getimgf() {
        if(lock === 1){setTimeout(getimgf,500);return;};
          wait = 350;
          animeid = entry[i].entry.mal_id;
          let dat = create("div", {class: "historydiv"});
          let name = create("div", {class: "historyname"});
          let timestamp = new Date(entry[i].date).getTime();
          const timestampSeconds = Math.floor(timestamp / 1000);
          let date = create("div", {class: "historydate",title: entry[i].date}, nativeTimeElement(timestampSeconds));
          let apiUrl = `https://api.jikan.moe/v4/anime/${animeid}`;
          if (entry[i].entry.type === "anime") {
            name.innerHTML = "Watched  episode " + entry[i].increment + " of " + '<a href="' + entry[i].entry.url + '">' + entry[i].entry.name + '</a>';
          } else {
            apiUrl = `https://api.jikan.moe/v4/manga/${animeid}`;
            name.innerHTML = "Read chapter " + entry[i].increment + " of " + '<a href="' + entry[i].entry.url + '">' + entry[i].entry.name + '</a>';
          }
          if (i < last  && i > 0  &&  entry[i].entry.mal_id !== entry[i - 1].entry.mal_id) {
            getimg();
          } else {
            if (i < last && i > 0) {
              wait = 100;
              let historyimg = create("a", {
                class: "historyimg",
                href: entry[i].entry.url,
                style: {
                  backgroundImage: "url(" + imgdata + ")"
                }
              });
              dat.append(historyimg, name);
              dat.append(date);
              document.querySelector("#statistics").insertAdjacentElement('beforeend', dat);
              i++;if (i<last) {myLoop();}
            }
          }
          if(i === 0){getimg();}
          async function getimg() {
            lock=1;

            await fetch(apiUrl).then(response => response.json()).then(data => {
              imgdata = data.data.images.jpg.image_url;
              if (imgdata) {
                let historyimg = create("a", {
                  class: "historyimg",
                  href: entry[i].entry.url,
                  style: {
                    backgroundImage: "url(" + imgdata + ")"
                  }
                });
                dat.append(historyimg, name);
                dat.append(date);
                document.querySelector("#statistics").insertAdjacentElement('beforeend', dat);
                setTimeout(function(){lock=0;i++;if (i<last) {myLoop();}},350);
              }
            });
          }
        }
      }).catch(error => console.error('error:', error));
    }
    profileHeader = false;
    let about = document.querySelector(".user-profile-about.js-truncate-outer");
    let modernabout = document.querySelector("#modern-about-me");
    let avatar = document.querySelector(".user-image");
    let name = $('span:contains("s Profile"):last');
    let container = create("div", {class: "container",id: "container"});
    container.setAttribute("style", "margin: 0 auto;min-width: 320px;max-width: 1240px;left: -40px;position: relative;height: 100%;");
    if(!custombg){banner.setAttribute("style", "background-position: 50% 35%; background-repeat: no-repeat;background-size: cover;height: 330px;position: relative;")};
    document.querySelector("#myanimelist").setAttribute("style", "min-width: 1240px;width:100%");
    set(1,"#myanimelist .wrapper",{sa:{0:"width:100%;display:table"}});
    document.querySelector("#contentWrapper").insertAdjacentElement('beforebegin', banner);
    banner.append(container);
    container.append(avatar);
    if (set(0,about,{sa:{0:"margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br)"}})) {
      document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement('beforebegin', about);
    }
    if (set(0,modernabout,{sa:{0:"margin-bottom: 20px;width: auto;background: var(--color-foreground);padding: 10px;border-radius: var(--br);max-height:2000px"}})) {
      document.querySelector("#content > div > div.container-left > div > ul.user-status.border-top.pb8.mb4").insertAdjacentElement('beforebegin', modernabout);
      let l = document.querySelectorAll(".l-listitem");
      let a = "max-width:492px;max-height:492px";
      set(2,".l-listitem",{sal:{0:"-webkit-box-pack: center;display: flex;-ms-flex-pack: center;justify-content: center;flex-wrap: wrap;flex-direction: row;"}});
      set(1,".l-mainvisual",{sa:{0:a}});
      set(1,".intro-mylinks-wrap",{sa:{0:a}});
      set(1,".l-intro",{sa:{0:a}});
      set(1,".l-intro-text-wrap-1",{sa:{0:a}});
      set(1,".copy-wrap-1",{sa:{0:a}});
      set(1,".mylinks-ul",{sa:{0:a}});
    }
        if(about || modernabout) {
          if(set(1,".user-profile h1:first-child",{sa:{0:"position: absolute;top: 50px;right: 0;"}})){
            banner.append(document.querySelector(".user-profile h1:first-child"))};
          $('a:contains("About Me Design"):last').remove();
        }
        set(1,".user-image img",{sa:{0:"display: inline-block;max-height: 230px;max-width: 160px;width: 100%;box-shadow:none!important"}});
        set(1,".user-image .btn-detail-add-picture",{sa:{0:"display: flex;flex-direction: column;justify-content: center;"}});
        document.querySelector(".user-image").setAttribute("style", "top: 99px;left: 99px;position: relative;");
        avatar.setAttribute("style", "display: flex;height: inherit;align-items: flex-end;position: relative;width:500px;");
        name.css({
      'font-size': '2rem',
      'font-weight': '800',
      'left': '35px',
      'top': '-35px'
    });
    name.html(name.html().replace(/'s Profile/g, '\n'));
    avatar.append(name[0]);
    set(2,"#container span.profile-team-title.js-profile-team-title",{sl:{top:"18px"}});
    container.append(document.querySelector(".user-function.mb8"));
    set(1,"a.btn-profile-submit.fl-l",{sa:{0:"width:50%"}});
    set(1,"a.btn-profile-submit.fl-r",{sa:{0:"width:50%"}});
    if (set(1,".bar-outer.anime",{sa:{0:"width:100%"}})) {
      set(1,".bar-outer.manga",{sa:{0:"width:100%"}});
    }
        set(1,".user-function.mb8",{sa:{0:"position: relative;left: 100%;top: -50px;display: flex;width: 100px;font-size: 1rem;justify-content: space-evenly;"}});
        if (set(1,".content-container",{sa:{0:"display: grid!important;grid-template-columns: 33% auto;margin-top: 30px;justify-content: center;"}})) {
          set(1,".container-left",{sa:{0:"width:auto"}});
           set(1,".container-right",{sa:{0:"width:auto;min-width:800px"}});
        }
        if (set(1,"#content > table > tbody > tr > td.profile_leftcell",{sa:{0:"width:auto"}})) {
          set(1,"#content > table > tbody > tr",{sa:{0:"display: grid!important;grid-template-columns: 33% auto;margin-top: 10px;justify-content: center;"}})
          set(1,"#content > table > tbody > tr > td.pl8",{sa:{0:"width: auto;position:relative;min-width:800px"}});
        }
        set(1,".user-profile",{sa:{0:"width:auto;"}});
        set(2,".user-profile li",{sal:{0:"width:auto"}});
        set(1,".quotetext",{sa:{0:"margin-left:0;"}});
    if (set(1,"#lastcomment",{sa:{0:"padding-top:0!important;"}})) {
      document.querySelector("#content > div > div.container-right").prepend(document.querySelector("#lastcomment"));
    }
        set(1,"#content > table > tbody > tr > td.pl8 > #horiznav_nav",{r:{0:0}});
        set(1,".container-right #horiznav_nav",{r:{0:0}});
        document.querySelector("#contentWrapper").setAttribute("style", "width: 1375px;min-width:500px; margin: auto;top: -40px;transition:.6s");
        if( document.querySelector("#fancybox-loading")){document.querySelector("#fancybox-loading").style.setProperty('display', '');};
        let s = document.querySelector("#statistics");
        if (s) {
          s.setAttribute("style", "width: 813px");
          s.children[1].append(document.querySelector("#statistics .stats.manga"));
          s.children[2].prepend(document.querySelector("#statistics .updates.anime"));
          s.prepend(document.querySelector("#statistics > div:nth-child(2)"));
          document.querySelector(".container-right").prepend(s);
          $('h2:contains("Statistics"):last').remove();
          let favs = create("div", {class: "favs",});
          let favs2 = create("div", {class: "favs",});
          let favs3 = create("div", {class: "favs",});
          let favs4 = create("div", {class: "favs",});
          let favs5 = create("div", {class: "favs",});

          /*Get Favorites*/
          document.querySelector("#content > div > div.container-left > div > ul:nth-child(4)").prepend(favs, favs2, favs3, favs4, favs5);
          getfavs();
          function getfavs(){
            let favc = ["#anime_favorites","#manga_favorites","#character_favorites","#person_favorites","#company_favorites"];
            let fave = [favs, favs2, favs3, favs4, favs5];
            let f,c;
            for(let l = 0; l<5;l++){
            f = document.querySelector(favc[l]);
            if(!f){fave[l].remove();}
            else{
              fave[l].insertAdjacentElement('beforebegin', f.previousElementSibling);
              c = document.querySelectorAll(favc[l] + " ul > li");
              for (let x = 0; x < c.length; x++) {
                let r = c[x].querySelectorAll("span");
                for (let y = 0; y < r.length; y++) {
                  r[y].remove();
                }
                c[x].setAttribute("style", "width:76px");
                fave[l].append(c[x]);
              }
              f.remove();
            }
            }
          }
          document.querySelector(".container-right > h2.mb12").remove();
        set(1,".container-right > .btn-favmore",{r:{0:0}});
        set(1,".favs",{sap:{0:"box-shadow: none!important;"}});
      gethistory();
    }
    let nav = create("div", {class: "navbar",id: "navbar"});
    nav.innerHTML = '<div id="horiznav_nav" style="margin: 5px 0 10px;"><ul><li><a href="/profile/">Overview</a></li><li><a href="/profile/">Statistics</a></li><li><a href="/profile/">Favorites</a></li><li><a href="/profile/">Reviews</a></li><li><a href="/profile/">Recommendations</a></li><li><a href="/profile/">Interest Stacks</a></li><li><a href="/profile/">Clubs</a></li><li><a href="/profile/">Badges</a></li><li><a href="/profile/">Friends</a></li></ul></div>';
    banner.insertAdjacentElement('afterend', nav);
    nav.setAttribute("style", "z-index: 2;position: relative;background: #000;padding: 10px;text-align: center;background-color: var(--color-foreground) !important;");
    let navel = document.querySelectorAll("#navbar #horiznav_nav > ul > li > a");
    navel[0].href = navel[0].href + username;
    navel[1].href = navel[1].href + username + "/statistics";
    navel[2].href = navel[2].href + username + "/favorites";
    navel[3].href = navel[3].href + username + "/reviews";
    navel[4].href = navel[4].href + username + "/recommendations";
    navel[5].href = navel[5].href + username + "/stacks";
    navel[6].href = navel[6].href + username + "/clubs";
    navel[7].href = navel[7].href + username + "/badges";
    navel[8].href = navel[8].href + username + "/friends";
    $('h2:contains("Synopsis"):last').parent().addClass("SynopsisDiv");
        let n = current.split("/")[3];
        if(!n){$(navel[0]).addClass("navactive")} else {
        n = n.charAt(0).toUpperCase() + n.slice(1);
        $('.navbar a:contains('+n+')').addClass("navactive")};
    set(0,navel,{sal:{0:"margin: 0 30px;font-size: 1rem;box-shadow: none!important;"}});
  }}
  if (profileHeader) {
    let title = document.querySelector("#contentWrapper > div:nth-child(1)");
    title.children[0].setAttribute("style", "padding-left: 2px");
    let table = document.querySelector(".user-profile-about.js-truncate-outer");
    if (!table) {
      table = document.querySelector("#content > div > div.container-right > div > div:nth-child(1)");
    }
    if(table){table.prepend(title);}
  }
  if (customcss) {
    findcss();
    function findcss() {
      var details = document.querySelector(".user-profile-about.js-truncate-outer");
      if (!details) {
        setTimeout(findcss, 100);
        return;
      }
      let regex = /(customcss)\/([^()]+)/gm;
      let match = details.innerHTML.match(regex);
      if (match) {
        $("style:contains(--fg: #161f2f;)").html("");
        styleSheet3.innerText = styles3;
        document.head.appendChild(styleSheet3);
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        getdata();
        function getdata() {
          let css = document.createElement("style");
          let data = match[0].replace(regex, "$2");
          css.innerText = JSON.parse(LZString.decompressFromBase64(data));
          document.head.appendChild(css);
        }
      }
    }
  }
}
    //Profile Section//-End-//
    //Character Section//-Start-//
if (/\/(character)\/.?([\w-]+)?\/?/.test(current)) {
  let regex = /(Member Favorites).*/g;
  let match = document.createElement("p");
  let fav = document.querySelector("#content > table > tbody > tr > td.borderClass");
  match.innerText = fav.innerText.match(regex);
  fav.innerHTML = fav.innerHTML.replace(regex, "");
  if (match) {
    document.querySelector("#v-favorite").insertAdjacentElement('beforebegin', match);
  }
  $('div:contains("Voice Actors"):last').addClass("VoiceActorsDiv");
  while ($('.VoiceActorsDiv').next("table").length > 0) {
    $('.VoiceActorsDiv').append($('.VoiceActorsDiv').next("table").addClass("VoiceActorsDivTable").css({
      'backgroundColor': 'var(--color-foreground)',
      'borderRadius': 'var(--br)',
      'marginTop': '8px'
    }));
    $('.VoiceActorsDivTable').children().children().children().children(".picSurround").children().children().css({
      width: '60px !important',
      height: '80px',
      objectFit: 'cover'
    });
  }
  $('.VoiceActorsDiv').css({
    'marginTop': '10px'
  });
  $('h2:contains("Recent Featured Articles"):last').addClass("RecentFeaturedArticlesDiv").append($('.RecentFeaturedArticlesDiv').next());
  $('.RecentFeaturedArticlesDiv').css({
    'marginTop': '10px'
  });
  $('.RecentFeaturedArticlesDiv').children("div:last-child").css({
    'marginTop': '8px'
  });
  $('.RecentFeaturedArticlesDiv').children().children().css('width', '99%').children().css('borderRadius', 'var(--br)');
  let doc;
  let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
  $(main).addClass('characterDiv');
  let text = create("div", {
    class: "description",
    itemprop: "description",
    style: {
      display: "block",
      fontSize: "11px",
      fontWeight: "500",
      marginTop: "5px",
      whiteSpace: "pre-wrap"
    }
  });
  main.childNodes.forEach(function (el, i) {
    if (i >= 5 && el !== document.querySelector(".VoiceActorsDiv") && el !== document.querySelector("h2") && el !== document.querySelector(".RecentFeaturedArticlesDiv") && el.innerText !== 'Voice Actors' && el.innerText !== 'More Videos\nEpisode Videos' && el.innerText !== 'Episode Videos' && el.id !== 'episode_video' && el.id !== 'CallFunctionFormatMoreInfoText') {
      if (el.innerHTML === undefined) {
        text.innerHTML += el.textContent;
      } else {
        text.innerHTML += el.innerHTML;
      }
    }
  });
  let fixtext = text.innerHTML.replace(/\n\s{2,100}/g, "");
  text.innerHTML = fixtext;
  if (document.querySelector("#content > table > tbody > tr > td.characterDiv > br:nth-child(5)")) {
    doc = document.querySelector("#content > table > tbody > tr > td.characterDiv > br:nth-child(5)");
  } else {
    doc = document.querySelector("#content > table > tbody > tr > td.characterDiv > br:nth-child(6)");
  }
  doc.before(text);
  $.trim($(".characterDiv").contents().not($(".description")).not($(".VoiceActorsDiv")).not($("h2")).not($("table")).remove());
  $('.description').children().not($("input")).not($("span.spoiler_content")).remove();
  let spofix = document.querySelectorAll(".spoiler_content > input");
  $('.spoiler_content').css({
    background: 'var(--color-foreground4)',
    borderRadius: 'var(--br)',
    padding: '0px 5px 5px',
    margin: '5px 0px'
  });
  for (let x = 0; x < spofix.length; x++) {
    spofix[x].setAttribute("onclick", "this.parentNode.style.display='none';this.parentNode.previousElementSibling.style.display='inline-block';");
  }
}
  ////Character Section//-End-////
  ////Anime/Manga Section//-Start-////
if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && !/(.*anime|manga)\/.*\/.*\/\w.*/mg.test(current)) {
  let text = create("div", {
    class: "description",
    itemprop: "description",
    style: {
      display: "block",
      fontSize: "11px",
      fontWeight: "500",
      marginTop: "5px",
      whiteSpace: "pre-wrap"
    }
  });
  //Left Side
  if($('h2:contains("Alternative Titles"):last')){
   $('h2:contains("Alternative Titles"):last').addClass("AlternativeTitlesDiv");
  document.querySelector(".AlternativeTitlesDiv").nextElementSibling.setAttribute("style", "border-radius:var(--br);margin-bottom:2px");
  $('span:contains("Synonyms")').parent().next().css({
    'borderRadius': 'var(--br)',
    'marginBottom': '2px'
  });
 }
  if (document.querySelector(".js-alternative-titles.hide")) {
    document.querySelector(".js-alternative-titles.hide").setAttribute("style", "border-radius:var(--br);overflow:hidden");
  }
  ;
  $('h2:contains("Information"):last').addClass("InformationDiv");
  document.querySelector(".InformationDiv").nextElementSibling.setAttribute("style", "border-top-left-radius:var(--br);border-top-right-radius:var(--br)");
  $('h2:contains("Statistics"):last').addClass("StatisticsDiv");
  document.querySelector(".StatisticsDiv").nextElementSibling.setAttribute("style", "border-top-left-radius:var(--br);border-top-right-radius:var(--br)");
  document.querySelector(".StatisticsDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
  if($('h2:contains("Resources"):last').length > 0){
  $('h2:contains("Resources"):last').addClass("ResourcesDiv");
  document.querySelector(".ResourcesDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
  document.querySelector(".ResourcesDiv").nextElementSibling.style.borderRadius = "var(--br)";}
  if ($('h2:contains("Streaming Platforms")').length > 0) {
    $('h2:contains("Streaming Platforms"):last').addClass("StreamingAtDiv");
    document.querySelector(".StreamingAtDiv").nextElementSibling.style.borderRadius = "var(--br)";
  }
  ;
  if ($('h2:contains("Available At")').length > 0) {
    $('h2:contains("Available At"):last').addClass("AvailableAtDiv");
    document.querySelector(".AvailableAtDiv").nextElementSibling.style.borderRadius = "var(--br)";
    document.querySelector(".AvailableAtDiv").previousElementSibling.previousElementSibling.setAttribute("style", "border-bottom-left-radius:var(--br);border-bottom-right-radius:var(--br)");
  }
  //Right Side
  $('h2:contains("Synopsis"):last').parent().addClass("SynopsisDiv");
  $('h2:contains("Episode Videos"):last').parent().addClass("EpisodeVideosDiv");
  $('h2:contains("Related Anime"):last').addClass("RelatedAnimeDiv");
  $('h2:contains("Related Manga"):last').addClass("RelatedMangaDiv");
  $('h2:contains("Characters"):last').parent().addClass("CharactersDiv");
  $('h2:contains("Staff"):last').parent().addClass("StaffDiv");
  $('h2:contains("Reviews"):last').addClass("ReviewsDiv");
  $('h2:contains("Recommendations"):last').parent().addClass("RecommendationsDiv");
  $('.RecommendationsDiv').closest('div').append($('.RecommendationsDiv').next());
  $('h2:contains("Interest Stacks"):last').parent().addClass("InterestStacksDiv");
  $('.InterestStacksDiv').closest('div').append($('.InterestStacksDiv').next());
  $('h2:contains("Recent News"):last').addClass("RecentNewsDiv");
  $('h2:contains("Recent Featured Articles"):last').parent().addClass("RecentFeaturedArticlesDiv");
  $('h2:contains("Recent Forum Discussion"):last').addClass("RecentForumDiscussionDiv");
  $('h2:contains("MALxJapan -More than just anime-"):last').parent().addClass("MalxJDiv");
  let doc = $('h2:contains("Background"):last');
  doc.addClass("backgroundDiv");
  let main = document.querySelector("#content > table > tbody > tr > td:nth-child(2)[valign='top'] tr > td[valign='top']");
  for (let x = 0; x < 1; x++) {
    main.childNodes.forEach(function (el, i) {
      if (i >= 4 && el.class !== 'SynopsisDiv' && el.innerText !== 'Related Manga' && el.innerText !== 'More Videos\nEpisode Videos' && el.innerText !== 'Episode Videos' && el.id !== 'episode_video' && el.id !== 'CallFunctionFormatMoreInfoText') {
        text.innerHTML += el.textContent;
      }
    });
    for (let x = 0; x < 10; x++) {
      main.childNodes.forEach(function (el, i) {
        {
          if (i >= 4 && el.class !== 'SynopsisDiv' && el.innerText !== 'Related Manga' && el.innerText !== 'More Videos\nEpisode Videos' && el.innerText !== 'Episode Videos' && el.id !== 'episode_video' && el.id !== 'CallFunctionFormatMoreInfoText') {
            el.remove();
          }
        }
      });
    }
  }
  let textfix = text.innerHTML.replace(/<br>.*\s/gm, '').replace(/\n\s{3,10}/g, '');
  text.innerHTML = textfix;
  doc.append(text);
  for (let x = 0; x < 100; x++) {
    if ($('.backgroundDiv:contains("No background information has been added to this title.")').css('display', 'none')) ;
  }
}
  ////Anime/Manga Section//-End-////
  //People and Character Name Position Change // -Start- //
  if (/\/(people)\/.?([\w-]+)?\/?/.test(current) && peopleHeader || /\/(character)\/.?([\w-]+)?\/?/.test(current) && characterHeader) {
    let name = document.querySelector(".h1.edit-info");
    name.getElementsByTagName("strong")[0].style.fontSize= '1.3rem';
    name.setAttribute("style", "padding-left:5px;padding-top:10px;height:20px");
    document.querySelector("#content").style.paddingTop="20px";
    let table = document.querySelector("#content > table > tbody > tr > td:nth-child(2)");
    table.prepend(name);
    if(/\/(character)\/.?([\w-]+)?\/?/.test(current) && characterHeader){
      if(!characterNameAlt){
        name.setAttribute("style", "line-height:25px");}
      let extra = document.querySelector("#content > table > tbody > tr > td.characterDiv > h2 > span > small");
      extra.innerText = " "+extra.innerText;
      if(characterNameAlt){
        extra.innerHTML = extra.innerHTML;
        document.querySelector(".h1.edit-info > div.h1-title > h1").append(extra);
        extra.style.lineHeight="20px";
        if(name.children[0].children[0].children[0].innerText.match(/".*"/gm)){
        extra.innerHTML =  extra.innerHTML + "</br>"+ name.children[0].children[0].children[0].innerText.match(/".*"/gm);
        name.children[0].children[0].children[0].innerText = name.children[0].children[0].children[0].innerText.replace(/".*"/gm, "");
        }
        else {extra.innerHTML = "</br>"+extra.innerHTML;
        }
      }
      document.querySelector("#content > table > tbody > tr > td.characterDiv > h2").remove();
    }
  }
  //People and Character Name Position Change // -End- //
  ////Anime-Manga Image to Background Color//-Start-//
  if (/myanimelist.net\/(anime|manga|character|people)\/?([\w-]+)?\/?/.test(location.href)) {
    if (/\/(people)\/?([\w-]+)?\/?/.test(current) || /\/(anime|manga)\/producer|season\/.?([\w-]+)?\/?/.test(current)|| /\/(anime.php|manga.php).?([\w-]+)?\/?/.test(current)){return;}
    if (/\/(character)\/?([\w-]+)?\/?/.test(current) && !charbg){return;}
    if (/\/(anime|manga)\/?([\w-]+)?\/?/.test(current) && !animebg){return;}
  styleSheet2.innerText = styles2;
  document.head.appendChild(styleSheet2);
  let img = document.querySelector("div:nth-child(1) > a > img");
  var colorThief = new ColorThief();
  $(document).ready(function ($) {
    img.setAttribute("crossorigin", "anonymous");
    $(img).load(function () {
      var dominantColor = colorThief.getColor(img);
      var Palette = colorThief.getPalette(img, 10, true);
      //Single Color
      // document.querySelector("body").style.setProperty("background-color", "rgba("+dominantColor[0]+","+dominantColor[1]+","+dominantColor[2]+")", "important");
      //Linear Color
      let color0 = tinycolor("rgba (" + Palette[2][0] + ", " + Palette[2][1] + ", " + Palette[2][2] + ", .8)");
      let color1 = tinycolor("rgba (" + Palette[1][0] + ", " + Palette[1][1] + ", " + Palette[1][2] + ", .8)");
      let color2 = tinycolor("rgba (" + Palette[0][0] + ", " + Palette[0][1] + ", " + Palette[0][2] + ", .8)");
      for (let x = 0; x < 25; x++) {
        if (color0.getLuminance() > .08) {
          color0 = tinycolor("rgb (" + color0.darken(2) + ")");
        } else if (color0.getLuminance() < .01) {
          color0 = tinycolor("rgb (" + color0.brighten(2) + ")");
        }
        if (color1.getLuminance() > .08) {
          color1 = tinycolor("rgb (" + color1.darken(2) + ")");
        } else if (color1.getLuminance() < .01) {
          color1 = tinycolor("rgb (" + color1.brighten(2) + ")");
        }
        if (color2.getLuminance() > .08) {
          color2 = tinycolor("rgb (" + color2.darken(2) + ")");
        } else if (color2.getLuminance() < .01) {
          color2 = tinycolor("rgb (" + color2.brighten(2) + ")");
        }
      };
      document.querySelector("body").style.setProperty("background", "linear-gradient(180deg, " + color0.toString() + " 0%," + color1.toString() + " 50%, " + color2.toString() + " 100%)", "important");
      img.removeAttribute("crossorigin");
    });
  });
}
if (/\/(anime|manga)\/.?([\w-]+)?\/?/.test(current) && animeHeader && !/\/(anime|manga)\/producer\/.?([\w-]+)?\/?/.test(current)) {
  set(1,".h1.edit-info",{sa:{0:"margin:0;width:97.5%"}});
  set(1,"#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel",{pp:{0:".h1.edit-info"}});
}
if (/\/(clubs.php).?([\w-]+)?\/?/.test(current)) {
$('div.normal_header').next("table").addClass("clubDivs");
  $('div.bgNone').addClass("clubDivs");
  $('div.bgColor1').addClass("clubDivs");
$('div.normal_header:contains("Club Pictures")').next().children().children().children().addClass("clubDivs");
  $("#content > table > tbody > tr > td[valign=top]:last-child").addClass("clubDivs");
    set(2,".clubDivs",{sal:{0:"border-radius:var(--br);overflow:hidden"}});
}
  //Anime-Manga Image to Background Color//-End-////
})();
