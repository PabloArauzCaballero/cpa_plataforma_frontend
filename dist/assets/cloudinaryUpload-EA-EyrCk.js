import{i as e,n as t,t as n}from"./jsx-runtime-bzQ4Vb5N.js";import{v as r}from"./index-BHL3F8mG.js";var i=e(t(),1),a=e(r(),1);function o(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function s(e){if(Array.isArray(e))return e}function c(e){if(Array.isArray(e))return o(e)}function l(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,te(r.key),r)}}function d(e,t,n){return t&&u(e.prototype,t),n&&u(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function f(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=re(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function p(e,t,n){return(t=te(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function h(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function g(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function _(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?v(Object(n),!0).forEach(function(t){p(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function b(e,t){return s(e)||h(e,t)||re(e,t)||g()}function x(e){return c(e)||m(e)||re(e)||_()}function ee(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function te(e){var t=ee(e,`string`);return typeof t==`symbol`?t:t+``}function ne(e){"@babel/helpers - typeof";return ne=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},ne(e)}function re(e,t){if(e){if(typeof e==`string`)return o(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}var ie=function(){},ae={},oe={},se=null,ce={mark:ie,measure:ie};try{typeof window<`u`&&(ae=window),typeof document<`u`&&(oe=document),typeof MutationObserver<`u`&&(se=MutationObserver),typeof performance<`u`&&(ce=performance)}catch{}var le=(ae.navigator||{}).userAgent,ue=le===void 0?``:le,S=ae,C=oe,de=se,fe=ce;S.document;var w=!!C.documentElement&&!!C.head&&typeof C.addEventListener==`function`&&typeof C.createElement==`function`,pe=~ue.indexOf(`MSIE`)||~ue.indexOf(`Trident/`),me,he=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,ge=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,_e={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},ve={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},ye=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],T=`classic`,E=`duotone`,be=`sharp`,xe=`sharp-duotone`,Se=`chisel`,Ce=`etch`,we=`graphite`,Te=`jelly`,Ee=`jelly-duo`,De=`jelly-fill`,Oe=`notdog`,ke=`notdog-duo`,Ae=`slab`,je=`slab-press`,Me=`thumbprint`,Ne=`utility`,Pe=`utility-duo`,Fe=`utility-fill`,Ie=`whiteboard`,Le=`Classic`,Re=`Duotone`,ze=`Sharp`,Be=`Sharp Duotone`,Ve=`Chisel`,He=`Etch`,Ue=`Graphite`,We=`Jelly`,Ge=`Jelly Duo`,Ke=`Jelly Fill`,qe=`Notdog`,Je=`Notdog Duo`,Ye=`Slab`,Xe=`Slab Press`,Ze=`Thumbprint`,Qe=`Utility`,$e=`Utility Duo`,et=`Utility Fill`,tt=`Whiteboard`,nt=[T,E,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie];me={},p(p(p(p(p(p(p(p(p(p(me,T,Le),E,Re),be,ze),xe,Be),Se,Ve),Ce,He),we,Ue),Te,We),Ee,Ge),De,Ke),p(p(p(p(p(p(p(p(p(me,Oe,qe),ke,Je),Ae,Ye),je,Xe),Me,Ze),Ne,Qe),Pe,$e),Fe,et),Ie,tt);var rt={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},it={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},at=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),ot={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-press":{regular:`faslpr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},whiteboard:{semibold:`fawsb`}},st=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],ct={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},lt=[`kit`];p(p({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var ut={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},dt={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},ft={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},pt={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},mt,ht={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},gt=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];mt={},p(p(p(p(p(p(p(p(p(p(mt,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),p(p(p(p(p(p(p(p(p(mt,`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`slab`,`Slab`),`slab-press`,`Slab Press`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`whiteboard`,`Whiteboard`),p(p({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var _t={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},vt={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},yt={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},bt=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(gt,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),xt=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],St=[1,2,3,4,5,6,7,8,9,10],Ct=St.concat([11,12,13,14,15,16,17,18,19,20]),wt=[].concat(x(Object.keys(vt)),xt,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`border`,`fade`,`beat-fade`,`bounce`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`inverse`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`stack-1x`,`stack-2x`,`stack`,`ul`,`width-auto`,`width-fixed`,ht.GROUP,ht.SWAP_OPACITY,ht.PRIMARY,ht.SECONDARY],St.map(function(e){return`${e}x`}),Ct.map(function(e){return`w-${e}`})),Tt={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},D=`___FONT_AWESOME___`,Et=16,Dt=`fa`,Ot=`svg-inline--fa`,O=`data-fa-i2svg`,kt=`data-fa-pseudo-element`,At=`data-fa-pseudo-element-pending`,jt=`data-prefix`,Mt=`data-icon`,Nt=`fontawesome-i2svg`,Pt=`async`,Ft=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],It=[`::before`,`::after`,`:before`,`:after`],Lt=function(){try{return!0}catch{return!1}}();function k(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[T]}})}var Rt=y({},_e);Rt[T]=y(y(y(y({},{"fa-duotone":`duotone`}),_e[T]),ct.kit),ct[`kit-duotone`]);var zt=k(Rt),Bt=y({},ot);Bt[T]=y(y(y(y({},{duotone:`fad`}),Bt[T]),pt.kit),pt[`kit-duotone`]);var Vt=k(Bt),Ht=y({},yt);Ht[T]=y(y({},Ht[T]),ft.kit);var Ut=k(Ht),Wt=y({},_t);Wt[T]=y(y({},Wt[T]),ut.kit),k(Wt);var Gt=he,Kt=`fa-layers-text`,qt=ge;k(y({},rt));var Jt=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],Yt=ve,Xt=[].concat(x(lt),x(wt)),A=S.FontAwesomeConfig||{};function Zt(e){var t=C.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function Qt(e){return e===``?!0:e===`false`?!1:e===`true`?!0:e}C&&typeof C.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=b(e,2),n=t[0],r=t[1],i=Qt(Zt(n));i!=null&&(A[r]=i)});var $t={styleDefault:`solid`,familyDefault:T,cssPrefix:Dt,replacementClass:Ot,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};A.familyPrefix&&(A.cssPrefix=A.familyPrefix);var j=y(y({},$t),A);j.autoReplaceSvg||(j.observeMutations=!1);var M={};Object.keys($t).forEach(function(e){Object.defineProperty(M,e,{enumerable:!0,set:function(t){j[e]=t,N.forEach(function(e){return e(M)})},get:function(){return j[e]}})}),Object.defineProperty(M,"familyPrefix",{enumerable:!0,set:function(e){j.cssPrefix=e,N.forEach(function(e){return e(M)})},get:function(){return j.cssPrefix}}),S.FontAwesomeConfig=M;var N=[];function en(e){return N.push(e),function(){N.splice(N.indexOf(e),1)}}var P=Et,F={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function tn(e){if(!(!e||!w)){var t=C.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=C.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return C.head.insertBefore(t,r),e}}var nn=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function rn(){for(var e=12,t=``;e-- >0;)t+=nn[Math.random()*62|0];return t}function I(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function an(e){return e.classList?I(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function on(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function sn(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${on(e[n])}" `},``).trim()}function cn(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function ln(e){return e.size!==F.size||e.x!==F.x||e.y!==F.y||e.rotate!==F.rotate||e.flipX||e.flipY}function un(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function dn(e){var t=e.transform,n=e.width,r=n===void 0?Et:n,i=e.height,a=i===void 0?Et:i,o=e.startCentered,s=o===void 0?!1:o,c=``;return s&&pe?c+=`translate(${t.x/P-r/2}em, ${t.y/P-a/2}em) `:s?c+=`translate(calc(-50% + ${t.x/P}em), calc(-50% + ${t.y/P}em)) `:c+=`translate(${t.x/P}em, ${t.y/P}em) `,c+=`scale(${t.size/P*(t.flipX?-1:1)}, ${t.size/P*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var fn=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function pn(){var e=Dt,t=Ot,n=M.cssPrefix,r=M.replacementClass,i=fn;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var mn=!1;function hn(){M.autoAddCss&&!mn&&(tn(pn()),mn=!0)}var gn={mixout:function(){return{dom:{css:pn,insertCss:hn}}},hooks:function(){return{beforeDOMElementCreation:function(){hn()},beforeI2svg:function(){hn()}}}},L=S||{};L[D]||(L[D]={}),L[D].styles||(L[D].styles={}),L[D].hooks||(L[D].hooks={}),L[D].shims||(L[D].shims=[]);var R=L[D],_n=[],vn=function(){C.removeEventListener(`DOMContentLoaded`,vn),yn=1,_n.map(function(e){return e()})},yn=!1;w&&(yn=(C.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(C.readyState),yn||C.addEventListener(`DOMContentLoaded`,vn));function bn(e){w&&(yn?setTimeout(e,0):_n.push(e))}function z(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?on(e):`<${t} ${sn(r)}>${a.map(z).join(``)}</${t}>`}function xn(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var Sn=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},Cn=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:Sn(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function wn(e){return x(e).length===1?e.codePointAt(0).toString(16):null}function Tn(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function En(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n===void 0?!1:n,i=Tn(t);typeof R.hooks.addPack==`function`&&!r?R.hooks.addPack(e,Tn(t)):R.styles[e]=y(y({},R.styles[e]||{}),i),e===`fas`&&En(`fa`,t)}var B=R.styles,Dn=R.shims,On=Object.keys(Ut),kn=On.reduce(function(e,t){return e[t]=Object.keys(Ut[t]),e},{}),An=null,jn={},Mn={},Nn={},Pn={},Fn={};function In(e){return~Xt.indexOf(e)}function Ln(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!In(i)?i:null}var Rn=function(){var e=function(e){return Cn(B,function(t,n,r){return t[r]=Cn(n,e,{}),t},{})};jn=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),Mn=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Fn=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in B||M.autoFetchSvg,n=Cn(Dn,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});Nn=n.names,Pn=n.unicodes,An=Gn(M.styleDefault,{family:M.familyDefault})};en(function(e){An=Gn(e.styleDefault,{family:M.familyDefault})}),Rn();function zn(e,t){return(jn[e]||{})[t]}function Bn(e,t){return(Mn[e]||{})[t]}function V(e,t){return(Fn[e]||{})[t]}function Vn(e){return Nn[e]||{prefix:null,iconName:null}}function Hn(e){var t=Pn[e],n=zn(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function H(){return An}var Un=function(){return{prefix:null,iconName:null,rest:[]}};function Wn(e){var t=T,n=On.reduce(function(e,t){return e[t]=`${M.cssPrefix}-${t}`,e},{});return nt.forEach(function(r){(e.includes(n[r])||e.some(function(e){return kn[r].includes(e)}))&&(t=r)}),t}function Gn(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?T:t,r=zt[n][e];if(n===E&&!e)return`fad`;var i=Vt[n][e]||Vt[n][r],a=e in R.styles?e:null;return i||a||null}function Kn(e){var t=[],n=null;return e.forEach(function(e){var r=Ln(M.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function qn(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var Jn=bt.concat(st);function Yn(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t===void 0?!1:t,r=null,i=qn(e.filter(function(e){return Jn.includes(e)})),a=qn(e.filter(function(e){return!Jn.includes(e)})),o=b(i.filter(function(e){return r=e,!ye.includes(e)}),1)[0],s=o===void 0?null:o,c=Wn(i),l=y(y({},Kn(a)),{},{prefix:Gn(s,{family:c})});return y(y(y({},l),$n({values:e,family:c,styles:B,config:M,canonical:l,givenPrefix:r})),Xn(n,r,l))}function Xn(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?Vn(i):{},o=V(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!B.far&&B.fas&&!M.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var Zn=nt.filter(function(e){return e!==T||e!==E}),Qn=Object.keys(yt).filter(function(e){return e!==T}).map(function(e){return Object.keys(yt[e])}).flat();function $n(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===E,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&Zn.includes(n)&&(Object.keys(s).find(function(e){return Qn.includes(e)})||l.autoFetchSvg)&&(r.prefix=at.get(n).defaultShortPrefixId,r.iconName=V(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=H()||`fas`),r}var er=function(){function e(){l(this,e),this.definitions={}}return d(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=y(y({},e.definitions[n]||{}),t[n]),En(n,t[n]);var r=Ut[T][n];r&&En(r,t[n]),Rn()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),tr=[],U={},W={},nr=Object.keys(W);function rr(e,t){var n=t.mixoutsTo;return tr=e,U={},Object.keys(W).forEach(function(e){nr.indexOf(e)===-1&&delete W[e]}),tr.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),ne(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){U[e]||(U[e]=[]),U[e].push(r[e])})}e.provides&&e.provides(W)}),n}function ir(e,t){var n=[...arguments].slice(2);return(U[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function G(e){var t=[...arguments].slice(1);(U[e]||[]).forEach(function(e){e.apply(null,t)})}function K(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return W[e]?W[e].apply(null,t):void 0}function ar(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||H();if(t)return t=V(n,t)||t,xn(or.definitions,n,t)||xn(R.styles,n,t)}var or=new er,q={noAuto:function(){M.autoReplaceSvg=!1,M.observeMutations=!1,G(`noAuto`)},config:M,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return w?(G(`beforeI2svg`,e),K(`pseudoElements2svg`,e),K(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;M.autoReplaceSvg===!1&&(M.autoReplaceSvg=!0),M.observeMutations=!0,bn(function(){sr({autoReplaceSvgRoot:t}),G(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if(ne(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:V(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=Gn(e[0]);return{prefix:n,iconName:V(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${M.cssPrefix}-`)>-1||e.match(Gt))){var r=Yn(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||H(),iconName:V(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=H();return{prefix:i,iconName:V(i,e)||e}}}},library:or,findIconDefinition:ar,toHtml:z},sr=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?C:e;(Object.keys(R.styles).length>0||M.autoFetchSvg)&&w&&M.autoReplaceSvg&&q.dom.i2svg({node:t})};function cr(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(e){return z(e)})}}),Object.defineProperty(e,"node",{get:function(){if(w){var t=C.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function lr(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(ln(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=cn(y(y({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function ur(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${M.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:y(y({},i),{},{id:o}),children:r}]}]}function dr(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function fr(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u===void 0?!1:u,f=r.found?r:n,p=f.width,m=f.height,h=[M.replacementClass,a?`${M.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:y(y({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!dr(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[O]=``);var _=y(y({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:y({},l.styles)}),v=r.found&&n.found?K(`generateAbstractMask`,_)||{children:[],attributes:{}}:K(`generateAbstractIcon`,_)||{children:[],attributes:{}},b=v.children,x=v.attributes;return _.children=b,_.attributes=x,s?ur(_):lr(_)}function pr(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o===void 0?!1:o,c=y(y({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[O]=``);var l=y({},a.styles);ln(i)&&(l.transform=dn({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=cn(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function mr(e){var t=e.content,n=e.extra,r=y(y({},n.attributes),{},{class:n.classes.join(` `)}),i=cn(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var hr=R.styles;function gr(e){var t=e[0],n=e[1],r=b(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${M.cssPrefix}-${Yt.GROUP}`},children:[{tag:`path`,attributes:{class:`${M.cssPrefix}-${Yt.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${M.cssPrefix}-${Yt.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var _r={found:!1,width:512,height:512};function vr(e,t){!Lt&&!M.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function yr(e,t){var n=t;return t===`fa`&&M.styleDefault!==null&&(t=H()),new Promise(function(r,i){if(n===`fa`){var a=Vn(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&hr[t]&&hr[t][e]){var o=hr[t][e];return r(gr(o))}vr(e,t),r(y(y({},_r),{},{icon:M.showMissingIcons&&e&&K(`missingIconAbstract`)||{}}))})}var br=function(){},xr=M.measurePerformance&&fe&&fe.mark&&fe.measure?fe:{mark:br,measure:br},Sr=`FA "7.2.0"`,Cr=function(e){return xr.mark(`${Sr} ${e} begins`),function(){return wr(e)}},wr=function(e){xr.mark(`${Sr} ${e} ends`),xr.measure(`${Sr} ${e}`,`${Sr} ${e} begins`,`${Sr} ${e} ends`)},Tr={begin:Cr,end:wr},Er=function(){};function Dr(e){return typeof(e.getAttribute?e.getAttribute(O):null)==`string`}function Or(e){var t=e.getAttribute?e.getAttribute(jt):null,n=e.getAttribute?e.getAttribute(Mt):null;return t&&n}function kr(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(M.replacementClass)}function Ar(){return M.autoReplaceSvg===!0?Fr.replace:Fr[M.autoReplaceSvg]||Fr.replace}function jr(e){return C.createElementNS(`http://www.w3.org/2000/svg`,e)}function Mr(e){return C.createElement(e)}function Nr(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?jr:Mr:t;if(typeof e==`string`)return C.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Nr(e,{ceFn:n}))}),r}function Pr(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var Fr={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(e){t.parentNode.insertBefore(Nr(e),t)}),t.getAttribute(O)===null&&M.keepOriginalSource){var n=C.createComment(Pr(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~an(t).indexOf(M.replacementClass))return Fr.replace(e);var r=RegExp(`${M.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===M.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return z(e)}).join(`
`);t.setAttribute(O,``),t.innerHTML=a}};function Ir(e){e()}function Lr(e,t){var n=typeof t==`function`?t:Er;if(e.length===0)n();else{var r=Ir;M.mutateApproach===Pt&&(r=S.requestAnimationFrame||Ir),r(function(){var t=Ar(),r=Tr.begin(`mutate`);e.map(t),r(),n()})}}var Rr=!1;function zr(){Rr=!0}function Br(){Rr=!1}var Vr=null;function Hr(e){if(de&&M.observeMutations){var t=e.treeCallback,n=t===void 0?Er:t,r=e.nodeCallback,i=r===void 0?Er:r,a=e.pseudoElementsCallback,o=a===void 0?Er:a,s=e.observeMutationsRoot,c=s===void 0?C:s;Vr=new de(function(e){if(!Rr){var t=H();I(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!Dr(e.addedNodes[0])&&(M.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&M.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&Dr(e.target)&&~Jt.indexOf(e.attributeName))if(e.attributeName===`class`&&Or(e.target)){var r=Yn(an(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(jt,a||t),s&&e.target.setAttribute(Mt,s)}else kr(e.target)&&i(e.target)})}}),w&&Vr.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Ur(){Vr&&Vr.disconnect()}function Wr(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function Gr(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=Yn(an(e));return i.prefix||=H(),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=Bn(i.prefix,e.innerText)||zn(i.prefix,wn(e.innerText))),!i.iconName&&M.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function Kr(e){return I(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function qr(){return{iconName:null,prefix:null,transform:F,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Jr(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=Gr(e),r=n.iconName,i=n.prefix,a=n.rest,o=Kr(e),s=ir(`parseNodeAttributes`,{},e);return y({iconName:r,prefix:i,transform:F,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?Wr(e):[],attributes:o}},s)}var Yr=R.styles;function Xr(e){var t=M.autoReplaceSvg===`nest`?Jr(e,{styleParser:!1}):Jr(e);return~t.extra.classes.indexOf(Kt)?K(`generateLayersText`,e,t):K(`generateSvgReplacementMutation`,e,t)}function Zr(){return[].concat(x(st),x(bt))}function Qr(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!w)return Promise.resolve();var n=C.documentElement.classList,r=function(e){return n.add(`${Nt}-${e}`)},i=function(e){return n.remove(`${Nt}-${e}`)},a=M.autoFetchSvg?Zr():ye.concat(Object.keys(Yr));a.includes(`fa`)||a.push(`fa`);var o=[`.${Kt}:not([${O}])`].concat(a.map(function(e){return`.${e}:not([${O}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=I(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=Tr.begin(`onTree`),l=s.reduce(function(e,t){try{var n=Xr(t);n&&e.push(n)}catch(e){Lt||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){Lr(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function $r(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Xr(e).then(function(e){e&&Lr([e],t)})}function ei(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:ar(t||{}),i=n.mask;return i&&=(i||{}).icon?i:ar(i||{}),e(r,y(y({},n),{},{mask:i}))}}var ti=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?F:n,i=t.symbol,a=i===void 0?!1:i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,_=e.iconName,v=e.icon;return cr(y({type:`icon`},e),function(){return G(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),fr({icons:{main:gr(v),mask:s?gr(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:_,transform:y(y({},F),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},ni={mixout:function(){return{icon:ei(ti)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=Qr,e.nodeCallback=$r,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?C:t,r=e.callback;return Qr(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([yr(n,r),o.iconName?yr(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=b(o,2),u=l[0],d=l[1];t([e,fr({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=cn(a);o.length>0&&(n.style=o);var s;return ln(i)&&(s=K(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},ri={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return cr({type:`layer`},function(){G(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${M.cssPrefix}-layers`].concat(x(r)).join(` `)},children:n}]})}}}},ii={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return cr({type:`counter`,content:e},function(){return G(`beforeDOMElementCreation`,{content:e,params:t}),mr({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${M.cssPrefix}-layers-counter`].concat(x(a))}})})}}}},ai={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?F:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return cr({type:`text`,content:e},function(){return G(`beforeDOMElementCreation`,{content:e,params:t}),pr({content:e,transform:y(y({},F),r),extra:{attributes:s,styles:l,classes:[`${M.cssPrefix}-layers-text`].concat(x(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(pe){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,pr({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},oi=RegExp(`"`,`ug`),si=[1105920,1112319],ci=y(y(y(y({},{FontAwesome:{normal:`fas`,400:`fas`}}),it),Tt),dt),li=Object.keys(ci).reduce(function(e,t){return e[t.toLowerCase()]=ci[t],e},{}),ui=Object.keys(li).reduce(function(e,t){var n=li[t];return e[t]=n[900]||x(Object.entries(n))[0][1],e},{});function di(e){return wn(x(e.replace(oi,``))[0]||``)}function fi(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(oi,``),r=n.codePointAt(0),i=r>=si[0]&&r<=si[1],a=n.length===2?n[0]===n[1]:!1;return i||a||t}function pi(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(li[n]||{})[i]||ui[n]}function mi(e,t){var n=`${At}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=I(e.children).filter(function(e){return e.getAttribute(kt)===t})[0],o=S.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(qt),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=pi(s,l),p=di(d),m=c[0].startsWith(`FontAwesome`),h=fi(o),g=zn(f,p),_=g;if(m){var v=Hn(p);v.iconName&&v.prefix&&(g=v.iconName,f=v.prefix)}if(g&&!h&&(!a||a.getAttribute(jt)!==f||a.getAttribute(Mt)!==_)){e.setAttribute(n,_),a&&e.removeChild(a);var b=qr(),x=b.extra;x.attributes[kt]=t,yr(g,f).then(function(i){var a=fr(y(y({},b),{},{icons:{main:i,mask:Un()},prefix:f,iconName:_,extra:x,watchable:!0})),o=C.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return z(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function hi(e){return Promise.all([mi(e,`::before`),mi(e,`::after`)])}function gi(e){return e.parentNode!==document.head&&!~Ft.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(kt)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var _i=function(e){return!!e&&It.some(function(t){return e.includes(t)})},vi=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=f(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(_i(a)){var o=It.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function yi(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(w){var n;if(t)n=e;else if(M.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=f(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=f(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,u=f(vi(l.selectorText)),d;try{for(u.s();!(d=u.n()).done;){var p=d.value;r.add(p)}}catch(e){u.e(e)}finally{u.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){M.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var m=Array.from(r).join(`, `);try{n=e.querySelectorAll(m)}catch{}}return new Promise(function(e,t){var r=I(n).filter(gi).map(hi),i=Tr.begin(`searchPseudoElements`);zr(),Promise.all(r).then(function(){i(),Br(),e()}).catch(function(){i(),Br(),t()})})}}var bi={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=yi,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?C:t;M.searchPseudoElements&&yi(n)}}},xi=!1,Si={mixout:function(){return{dom:{unwatch:function(){zr(),xi=!0}}}},hooks:function(){return{bootstrap:function(){Hr(ir(`mutationObserverCallbacks`,{}))},noAuto:function(){Ur()},watch:function(e){var t=e.observeMutationsRoot;xi?Br():Hr(ir(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Ci=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i;break}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},wi={mixout:function(){return{parse:{transform:function(e){return Ci(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Ci(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:y({},a.outer),children:[{tag:`g`,attributes:y({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:y(y({},t.icon.attributes),a.path)}]}]}}}},Ti={x:0,y:0,width:`100%`,height:`100%`};function Ei(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function Di(e){return e.tag===`g`?e.children:[e]}rr([gn,ni,ri,ii,ai,bi,Si,wi,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?Yn(n.split(` `).map(function(e){return e.trim()})):Un();return r.prefix||=H(),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=un({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:y(y({},Ti),{},{fill:`white`})},p=c.children?{children:c.children.map(Ei)}:{},m={tag:`g`,attributes:y({},d.inner),children:[Ei(y({tag:c.tag,attributes:y(y({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:y({},d.outer),children:[m]},g=`mask-${a||rn()}`,_=`clip-${a||rn()}`,v={tag:`mask`,attributes:y(y({},Ti),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},b={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:_},children:Di(u)},v]};return t.push(b,{tag:`rect`,attributes:y({fill:`currentColor`,"clip-path":`url(#${_})`,mask:`url(#${g})`},Ti)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;S.matchMedia&&(t=S.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:y(y({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=y(y({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:y(y({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:y(y({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:y(y({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:y(y({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:y(y({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:y(y({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:y(y({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``?!0:n,e}}}}],{mixoutsTo:q}),q.noAuto;var J=q.config;q.library,q.dom;var Oi=q.parse;q.findIconDefinition,q.toHtml;var ki=q.icon;q.layer,q.text,q.counter;var Y=n();function Ai(e){return e-=0,e===e}function ji(e){return Ai(e)?e:(e=e.replace(/[_-]+(.)?/g,(e,t)=>t?t.toUpperCase():``),e.charAt(0).toLowerCase()+e.slice(1))}var Mi=(e,t)=>i.createElement(`stop`,{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function Ni(e){return e.charAt(0).toUpperCase()+e.slice(1)}var X=new Map,Pi=1e3;function Fi(e){if(X.has(e))return X.get(e);let t={},n=0,r=e.length;for(;n<r;){let i=e.indexOf(`;`,n),a=i===-1?r:i,o=e.slice(n,a).trim();if(o){let e=o.indexOf(`:`);if(e>0){let n=o.slice(0,e).trim(),r=o.slice(e+1).trim();if(n&&r){let e=ji(n);t[e.startsWith(`webkit`)?Ni(e):e]=r}}}n=a+1}if(X.size===Pi){let e=X.keys().next().value;e&&X.delete(e)}return X.set(e,t),t}function Ii(e,t,n={}){if(typeof t==`string`)return t;let r=(t.children||[]).map(t=>{let r=t;return(`fill`in n||n.gradientFill)&&t.tag===`path`&&`fill`in t.attributes&&(r={...t,attributes:{...t.attributes,fill:void 0}}),Ii(e,r)}),i=t.attributes||{},a={};for(let[e,t]of Object.entries(i))switch(!0){case e===`class`:a.className=t;break;case e===`style`:a.style=Fi(String(t));break;case e.startsWith(`aria-`):case e.startsWith(`data-`):a[e.toLowerCase()]=t;break;default:a[ji(e)]=t}let{style:o,role:s,"aria-label":c,gradientFill:l,...u}=n;if(o&&(a.style=a.style?{...a.style,...o}:o),s&&(a.role=s),c&&(a[`aria-label`]=c,a[`aria-hidden`]=`false`),l){a.fill=`url(#${l.id})`;let{type:t,stops:n=[],...i}=l;r.unshift(e(t===`linear`?`linearGradient`:`radialGradient`,{...i,id:l.id},n.map(Mi)))}return e(t.tag,{...a,...u},...r)}var Li=Ii.bind(null,i.createElement),Ri=(e,t)=>{let n=(0,i.useId)();return e||(t?n:void 0)},zi=class{constructor(e=`react-fontawesome`){this.enabled=!1;let t=!1;try{t=typeof process<`u`&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}};typeof process<`u`&&{}.FA_VERSION;var Bi=`searchPseudoElementsFullScan`in J&&typeof J.searchPseudoElementsFullScan==`boolean`?`7.0.0`:`6.0.0`,Vi=Number.parseInt(Bi)>=7,Hi=()=>Vi,Ui=`fa`,Z={beat:`fa-beat`,fade:`fa-fade`,beatFade:`fa-beat-fade`,bounce:`fa-bounce`,shake:`fa-shake`,spin:`fa-spin`,spinPulse:`fa-spin-pulse`,spinReverse:`fa-spin-reverse`,pulse:`fa-pulse`},Wi={left:`fa-pull-left`,right:`fa-pull-right`},Gi={90:`fa-rotate-90`,180:`fa-rotate-180`,270:`fa-rotate-270`},Ki={"2xs":`fa-2xs`,xs:`fa-xs`,sm:`fa-sm`,lg:`fa-lg`,xl:`fa-xl`,"2xl":`fa-2xl`,"1x":`fa-1x`,"2x":`fa-2x`,"3x":`fa-3x`,"4x":`fa-4x`,"5x":`fa-5x`,"6x":`fa-6x`,"7x":`fa-7x`,"8x":`fa-8x`,"9x":`fa-9x`,"10x":`fa-10x`},Q={border:`fa-border`,fixedWidth:`fa-fw`,flip:`fa-flip`,flipHorizontal:`fa-flip-horizontal`,flipVertical:`fa-flip-vertical`,inverse:`fa-inverse`,rotateBy:`fa-rotate-by`,swapOpacity:`fa-swap-opacity`,widthAuto:`fa-width-auto`},qi={default:`fa-layers`};function Ji(e){let t=J.cssPrefix||J.familyPrefix||Ui;return t===Ui?e:e.replace(new RegExp(String.raw`(?<=^|\s)${Ui}-`,`g`),`${t}-`)}function Yi(e){let{beat:t,fade:n,beatFade:r,bounce:i,shake:a,spin:o,spinPulse:s,spinReverse:c,pulse:l,fixedWidth:u,inverse:d,border:f,flip:p,size:m,rotation:h,pull:g,swapOpacity:_,rotateBy:v,widthAuto:y,className:b}=e,x=[];return b&&x.push(...b.split(` `)),t&&x.push(Z.beat),n&&x.push(Z.fade),r&&x.push(Z.beatFade),i&&x.push(Z.bounce),a&&x.push(Z.shake),o&&x.push(Z.spin),c&&x.push(Z.spinReverse),s&&x.push(Z.spinPulse),l&&x.push(Z.pulse),u&&x.push(Q.fixedWidth),d&&x.push(Q.inverse),f&&x.push(Q.border),p===!0&&x.push(Q.flip),(p===`horizontal`||p===`both`)&&x.push(Q.flipHorizontal),(p===`vertical`||p===`both`)&&x.push(Q.flipVertical),m!=null&&x.push(Ki[m]),h!=null&&h!==0&&x.push(Gi[h]),g!=null&&x.push(Wi[g]),_&&x.push(Q.swapOpacity),Hi()?(v&&x.push(Q.rotateBy),y&&x.push(Q.widthAuto),(J.cssPrefix||J.familyPrefix||Ui)===Ui?x:x.map(Ji)):x}var Xi=e=>typeof e==`object`&&`icon`in e&&!!e.icon;function Zi(e){if(e)return Xi(e)?e:Oi.icon(e)}function Qi(e){return Object.keys(e)}var $i=new zi(`FontAwesomeIcon`),ea={border:!1,className:``,mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:``,titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},ta=new Set(Object.keys(ea)),na=i.forwardRef((e,t)=>{let n={...ea,...e},{icon:r,mask:i,symbol:a,title:o,titleId:s,maskId:c,transform:l}=n,u=Ri(c,!!i),d=Ri(s,!!o),f=Zi(r);if(!f)return $i.error(`Icon lookup is undefined`,r),null;let p=Yi(n),m=typeof l==`string`?Oi.transform(l):l,h=Zi(i),g=ki(f,{...p.length>0&&{classes:p},...m&&{transform:m},...h&&{mask:h},symbol:a,title:o,titleId:d,maskId:u});if(!g)return $i.error(`Could not find icon`,f),null;let{abstract:_}=g,v={ref:t};for(let e of Qi(n))ta.has(e)||(v[e]=n[e]);return Li(_[0],v)});na.displayName=`FontAwesomeIcon`,`${qi.default}${Q.fixedWidth}`;var ra={prefix:`fas`,iconName:`file-excel`,icon:[384,512,[],`f1c3`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM164 266.7c-7.4-11-22.3-14-33.3-6.7s-14 22.3-6.7 33.3L163.2 352 124 410.7c-7.4 11-4.4 25.9 6.7 33.3s25.9 4.4 33.3-6.7l28-42 28 42c7.4 11 22.3 14 33.3 6.7s14-22.3 6.7-33.3L220.8 352 260 293.3c7.4-11 4.4-25.9-6.7-33.3s-25.9-4.4-33.3 6.7l-28 42-28-42z`]},ia={prefix:`fas`,iconName:`cloud-arrow-up`,icon:[576,512,[62338,`cloud-upload`,`cloud-upload-alt`],`f0ee`,`M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM305 191c-9.4-9.4-24.6-9.4-33.9 0l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31 0 102.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-102.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72z`]},aa={prefix:`fas`,iconName:`magnifying-glass`,icon:[512,512,[128269,`search`],`f002`,`M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z`]},oa={prefix:`fas`,iconName:`floppy-disk`,icon:[448,512,[128190,128426,`save`],`f0c7`,`M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm32 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z`]},sa={prefix:`fas`,iconName:`trash`,icon:[448,512,[],`f1f8`,`M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z`]},ca={prefix:`fas`,iconName:`folder-open`,icon:[576,512,[128194,128449,61717],`f07c`,`M56 225.6L32.4 296.2 32.4 96c0-35.3 28.7-64 64-64l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4l117.3 0c35.3 0 64 28.7 64 64l0 16-365.4 0c-41.3 0-78 26.4-91.1 65.6zM477.8 448L99 448c-32.8 0-55.9-32.1-45.5-63.2l48-144C108 221.2 126.4 208 147 208l378.8 0c32.8 0 55.9 32.1 45.5 63.2l-48 144c-6.5 19.6-24.9 32.8-45.5 32.8z`]},la={prefix:`fas`,iconName:`chevron-right`,icon:[320,512,[9002],`f054`,`M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z`]},ua={prefix:`fas`,iconName:`database`,icon:[448,512,[],`f1c0`,`M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z`]},da={prefix:`fas`,iconName:`file-image`,icon:[384,512,[128443],`f1c5`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM92.6 448l198.8 0c15.8 0 28.6-12.8 28.6-28.6 0-7.3-2.8-14.4-7.9-19.7L215.3 297.9c-6-6.3-14.4-9.9-23.2-9.9l-.3 0c-8.8 0-17.1 3.6-23.2 9.9L71.9 399.7C66.8 405 64 412.1 64 419.4 64 435.2 76.8 448 92.6 448z`]},fa={prefix:`fas`,iconName:`folder`,icon:[512,512,[128193,128447,61716,`folder-blank`],`f07b`,`M64 448l384 0c35.3 0 64-28.7 64-64l0-240c0-35.3-28.7-64-64-64L298.7 80c-6.9 0-13.7-2.2-19.2-6.4L241.1 44.8C230 36.5 216.5 32 202.7 32L64 32C28.7 32 0 60.7 0 96L0 384c0 35.3 28.7 64 64 64z`]},pa={prefix:`fas`,iconName:`circle-exclamation`,icon:[512,512,[`exclamation-circle`],`f06a`,`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`]},ma={prefix:`fas`,iconName:`link`,icon:[576,512,[128279,`chain`],`f0c1`,`M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z`]},ha={prefix:`fas`,iconName:`file`,icon:[384,512,[128196,128459,61462],`f15b`,`M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-277.5c0-17-6.7-33.3-18.7-45.3L258.7 18.7C246.7 6.7 230.5 0 213.5 0L64 0zM325.5 176L232 176c-13.3 0-24-10.7-24-24L208 58.5 325.5 176z`]},ga={prefix:`fas`,iconName:`server`,icon:[448,512,[],`f233`,`M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm216 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm216 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z`]},_a={prefix:`fas`,iconName:`pen`,icon:[512,512,[128394],`f304`,`M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z`]},va={prefix:`fas`,iconName:`rotate-right`,icon:[512,512,[`redo-alt`,`rotate-forward`],`f2f9`,`M488 192l-144 0c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l46.7-46.7c-75.3-58.6-184.3-53.3-253.5 15.9-75 75-75 196.5 0 271.5s196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c94.3-94.3 243.7-99.6 344.3-16.2L471 7c6.9-6.9 17.2-8.9 26.2-5.2S512 14.3 512 24l0 144c0 13.3-10.7 24-24 24z`]},ya={prefix:`fas`,iconName:`chevron-left`,icon:[320,512,[9001],`f053`,`M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z`]},ba={prefix:`fas`,iconName:`triangle-exclamation`,icon:[512,512,[9888,`exclamation-triangle`,`warning`],`f071`,`M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`]},xa={prefix:`fas`,iconName:`folder-plus`,icon:[512,512,[],`f65e`,`M512 384c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4L448 80c35.3 0 64 28.7 64 64l0 240zM256 160c-13.3 0-24 10.7-24 24l0 48-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0 0 48c0 13.3 10.7 24 24 24s24-10.7 24-24l0-48 48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-48c0-13.3-10.7-24-24-24z`]},Sa={prefix:`fas`,iconName:`file-pdf`,icon:[576,512,[],`f1c1`,`M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l80 0 0-112c0-35.3 28.7-64 64-64l176 0 0-165.5c0-17-6.7-33.3-18.7-45.3L290.7 18.7C278.7 6.7 262.5 0 245.5 0L96 0zM357.5 176L264 176c-13.3 0-24-10.7-24-24L240 58.5 357.5 176zM240 380c-11 0-20 9-20 20l0 128c0 11 9 20 20 20s20-9 20-20l0-28 12 0c33.1 0 60-26.9 60-60s-26.9-60-60-60l-32 0zm32 80l-12 0 0-40 12 0c11 0 20 9 20 20s-9 20-20 20zm96-80c-11 0-20 9-20 20l0 128c0 11 9 20 20 20l32 0c28.7 0 52-23.3 52-52l0-64c0-28.7-23.3-52-52-52l-32 0zm20 128l0-88 12 0c6.6 0 12 5.4 12 12l0 64c0 6.6-5.4 12-12 12l-12 0zm88-108l0 128c0 11 9 20 20 20s20-9 20-20l0-44 28 0c11 0 20-9 20-20s-9-20-20-20l-28 0 0-24 28 0c11 0 20-9 20-20s-9-20-20-20l-48 0c-11 0-20 9-20 20z`]},Ca={prefix:`fas`,iconName:`copy`,icon:[448,512,[],`f0c5`,`M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z`]},wa={prefix:`fas`,iconName:`file-word`,icon:[384,512,[],`f1c2`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM135.4 274.8c-2.9-12.9-15.7-21.1-28.6-18.2s-21.1 15.7-18.2 28.6l32 144c2.3 10.5 11.4 18.2 22.2 18.8s20.6-6.1 24-16.4l25.2-75.7 25.2 75.7c3.4 10.2 13.2 16.9 24 16.4s19.9-8.2 22.2-18.8l32-144c2.9-12.9-5.3-25.8-18.2-28.6s-25.8 5.3-28.6 18.2l-13.2 59.4-20.6-61.8c-3.3-9.8-12.4-16.4-22.8-16.4s-19.5 6.6-22.8 16.4l-20.6 61.8-13.2-59.4z`]},Ta={prefix:`fas`,iconName:`arrow-up-right-from-square`,icon:[512,512,[`external-link`],`f08e`,`M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z`]},Ea={prefix:`fas`,iconName:`box-archive`,icon:[512,512,[`archive`],`f187`,`M0 64C0 46.3 14.3 32 32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64zM32 176l448 0 0 240c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-240zm152 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z`]};function Da(e,t){(0,i.useEffect)(()=>{if(!e)return;let n=document.body,r=Number(n.dataset.modalCount||`0`);r===0&&(n.dataset.modalPreviousOverflow=n.style.overflow,n.style.overflow=`hidden`),n.dataset.modalCount=String(r+1);function i(e){e.key===`Escape`&&t?.()}return document.addEventListener(`keydown`,i),()=>{document.removeEventListener(`keydown`,i);let e=Number(n.dataset.modalCount||`1`)-1;if(e>0){n.dataset.modalCount=String(e);return}delete n.dataset.modalCount,n.style.overflow=n.dataset.modalPreviousOverflow||``,delete n.dataset.modalPreviousOverflow}},[e,t])}var $={backdrop:`_backdrop_12hqy_1`,dialog:`_dialog_12hqy_14`,header:`_header_12hqy_24`,icon:`_icon_12hqy_32`,titleBlock:`_titleBlock_12hqy_48`,body:`_body_12hqy_60`,target:`_target_12hqy_64`,warning:`_warning_12hqy_73`,actions:`_actions_12hqy_80`,cancel:`_cancel_12hqy_97`,confirm:`_confirm_12hqy_102`};function Oa({isOpen:e,title:t,message:n,targetLabel:r,warning:i,confirmLabel:o=`Confirmar`,cancelLabel:s=`Cancelar`,variant:c=`default`,isLoading:l=!1,onConfirm:u,onCancel:d}){return Da(e,l?void 0:d),e?(0,a.createPortal)((0,Y.jsx)(`div`,{className:$.backdrop,role:`alertdialog`,"aria-modal":`true`,"aria-labelledby":`confirm-dialog-title`,"aria-describedby":`confirm-dialog-message`,children:(0,Y.jsxs)(`div`,{className:$.dialog,children:[(0,Y.jsxs)(`header`,{className:$.header,children:[(0,Y.jsx)(`span`,{className:$.icon,"data-variant":c,"aria-hidden":`true`,children:(0,Y.jsx)(na,{icon:ba})}),(0,Y.jsxs)(`div`,{className:$.titleBlock,children:[(0,Y.jsx)(`h2`,{id:`confirm-dialog-title`,children:t}),(0,Y.jsx)(`p`,{id:`confirm-dialog-message`,children:n})]})]}),r||i?(0,Y.jsxs)(`div`,{className:$.body,children:[r?(0,Y.jsx)(`div`,{className:$.target,children:r}):null,i?(0,Y.jsx)(`p`,{className:$.warning,children:i}):null]}):null,(0,Y.jsxs)(`div`,{className:$.actions,children:[(0,Y.jsx)(`button`,{type:`button`,className:$.cancel,onClick:d,disabled:l,children:s}),(0,Y.jsx)(`button`,{type:`button`,className:$.confirm,"data-variant":c,onClick:u,disabled:l,children:l?`Procesando...`:o})]})]})}),document.body):null}var ka=``,Aa=``,ja=`cpa/archivos`,Ma=10*1024*1024,Na=25*1024*1024;function Pa(){throw Error(`Falta configurar VITE_CLOUDINARY_CLOUD_NAME.`)}function Fa(e){if(!e)throw Error(`No se envió ningún archivo.`);if(e.size>Na)throw Error(`El archivo excede el límite de 25 MB.`)}function Ia(e){if(!e)throw Error(`No se envió ningún archivo.`);if(!String(e.type||``).startsWith(`image/`))throw Error(`El archivo debe ser una imagen válida.`);if(e.size>Ma)throw Error(`La imagen excede el límite de 10 MB.`)}function La(e){return(e||ja).trim()||void 0}async function Ra(e,{folder:t}={}){Pa(),Ia(e);let n=new FormData;n.append(`file`,e),n.append(`upload_preset`,Aa);let r=La(t);r&&n.append(`folder`,r);let i=`https://api.cloudinary.com/v1_1/${ka}/image/upload`,a;try{a=await fetch(i,{method:`POST`,body:n})}catch{throw Error(`No se pudo subir la imagen a Cloudinary por un problema de red.`)}let o=null;try{o=await a.json()}catch{o=null}if(!a.ok){let e=o?.error?.message||`Revisa el upload preset y la configuración de Cloudinary.`;throw Error(`Cloudinary rechazó la subida. ${e}`)}if(!o?.secure_url)throw Error(`Cloudinary no devolvió una URL usable para la imagen.`);return{url:String(o.secure_url),publicId:String(o.public_id??``),width:typeof o.width==`number`?o.width:void 0,height:typeof o.height==`number`?o.height:void 0,format:typeof o.format==`string`?o.format:void 0,bytes:typeof o.bytes==`number`?o.bytes:void 0,resourceType:typeof o.resource_type==`string`?o.resource_type:void 0,originalFilename:typeof o.original_filename==`string`?o.original_filename:void 0}}async function za(e,{folder:t}={}){Pa(),Fa(e);let n=new FormData;n.append(`file`,e),n.append(`upload_preset`,Aa);let r=La(t);r&&n.append(`folder`,r);let i=`https://api.cloudinary.com/v1_1/${ka}/auto/upload`,a;try{a=await fetch(i,{method:`POST`,body:n})}catch{throw Error(`No se pudo subir el archivo por un problema de red.`)}let o=null;try{o=await a.json()}catch{o=null}if(!a.ok){let e=o?.error?.message||`Revisa el upload preset y la configuración de Cloudinary.`;throw Error(`Cloudinary rechazó la subida. ${e}`)}if(!o?.secure_url)throw Error(`Cloudinary no devolvió una URL usable para el archivo.`);return{url:String(o.secure_url),publicId:String(o.public_id??``),width:typeof o.width==`number`?o.width:void 0,height:typeof o.height==`number`?o.height:void 0,format:typeof o.format==`string`?o.format:void 0,bytes:typeof o.bytes==`number`?o.bytes:void 0,resourceType:typeof o.resource_type==`string`?o.resource_type:void 0,originalFilename:typeof o.original_filename==`string`?o.original_filename:void 0}}export{aa as C,sa as D,ga as E,na as O,ma as S,va as T,wa as _,Ta as a,ca as b,la as c,Ca as d,ua as f,Sa as g,da as h,Da as i,pa as l,ra as m,Ra as n,Ea as o,ha as p,Oa as r,ya as s,za as t,ia as u,oa as v,_a as w,xa as x,fa as y};