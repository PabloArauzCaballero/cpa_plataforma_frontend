import{i as e,n as t,t as n}from"./jsx-runtime-bzQ4Vb5N.js";var r=e(t(),1);function i(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function a(e){if(Array.isArray(e))return e}function o(e){if(Array.isArray(e))return i(e)}function s(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,x(r.key),r)}}function l(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function u(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=te(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function d(e,t,n){return(t=x(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function p(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function m(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function h(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?g(Object(n),!0).forEach(function(t){d(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function v(e,t){return a(e)||p(e,t)||te(e,t)||m()}function y(e){return o(e)||f(e)||te(e)||h()}function b(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function x(e){var t=b(e,`string`);return typeof t==`symbol`?t:t+``}function ee(e){"@babel/helpers - typeof";return ee=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},ee(e)}function te(e,t){if(e){if(typeof e==`string`)return i(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}var ne=function(){},re={},ie={},ae=null,oe={mark:ne,measure:ne};try{typeof window<`u`&&(re=window),typeof document<`u`&&(ie=document),typeof MutationObserver<`u`&&(ae=MutationObserver),typeof performance<`u`&&(oe=performance)}catch{}var se=(re.navigator||{}).userAgent,ce=se===void 0?``:se,S=re,C=ie,le=ae,ue=oe;S.document;var w=!!C.documentElement&&!!C.head&&typeof C.addEventListener==`function`&&typeof C.createElement==`function`,de=~ce.indexOf(`MSIE`)||~ce.indexOf(`Trident/`),fe,pe=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,me=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,he={classic:{fa:`solid`,fas:`solid`,"fa-solid":`solid`,far:`regular`,"fa-regular":`regular`,fal:`light`,"fa-light":`light`,fat:`thin`,"fa-thin":`thin`,fab:`brands`,"fa-brands":`brands`},duotone:{fa:`solid`,fad:`solid`,"fa-solid":`solid`,"fa-duotone":`solid`,fadr:`regular`,"fa-regular":`regular`,fadl:`light`,"fa-light":`light`,fadt:`thin`,"fa-thin":`thin`},sharp:{fa:`solid`,fass:`solid`,"fa-solid":`solid`,fasr:`regular`,"fa-regular":`regular`,fasl:`light`,"fa-light":`light`,fast:`thin`,"fa-thin":`thin`},"sharp-duotone":{fa:`solid`,fasds:`solid`,"fa-solid":`solid`,fasdr:`regular`,"fa-regular":`regular`,fasdl:`light`,"fa-light":`light`,fasdt:`thin`,"fa-thin":`thin`},slab:{"fa-regular":`regular`,faslr:`regular`},"slab-press":{"fa-regular":`regular`,faslpr:`regular`},thumbprint:{"fa-light":`light`,fatl:`light`},whiteboard:{"fa-semibold":`semibold`,fawsb:`semibold`},notdog:{"fa-solid":`solid`,fans:`solid`},"notdog-duo":{"fa-solid":`solid`,fands:`solid`},etch:{"fa-solid":`solid`,faes:`solid`},graphite:{"fa-thin":`thin`,fagt:`thin`},jelly:{"fa-regular":`regular`,fajr:`regular`},"jelly-fill":{"fa-regular":`regular`,fajfr:`regular`},"jelly-duo":{"fa-regular":`regular`,fajdr:`regular`},chisel:{"fa-regular":`regular`,facr:`regular`},utility:{"fa-semibold":`semibold`,fausb:`semibold`},"utility-duo":{"fa-semibold":`semibold`,faudsb:`semibold`},"utility-fill":{"fa-semibold":`semibold`,faufsb:`semibold`}},ge={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},_e=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`],T=`classic`,E=`duotone`,ve=`sharp`,ye=`sharp-duotone`,be=`chisel`,xe=`etch`,Se=`graphite`,Ce=`jelly`,we=`jelly-duo`,Te=`jelly-fill`,Ee=`notdog`,De=`notdog-duo`,Oe=`slab`,ke=`slab-press`,Ae=`thumbprint`,je=`utility`,Me=`utility-duo`,Ne=`utility-fill`,Pe=`whiteboard`,Fe=`Classic`,Ie=`Duotone`,Le=`Sharp`,Re=`Sharp Duotone`,ze=`Chisel`,Be=`Etch`,Ve=`Graphite`,He=`Jelly`,Ue=`Jelly Duo`,We=`Jelly Fill`,Ge=`Notdog`,Ke=`Notdog Duo`,qe=`Slab`,Je=`Slab Press`,Ye=`Thumbprint`,Xe=`Utility`,Ze=`Utility Duo`,Qe=`Utility Fill`,$e=`Whiteboard`,et=[T,E,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe];fe={},d(d(d(d(d(d(d(d(d(d(fe,T,Fe),E,Ie),ve,Le),ye,Re),be,ze),xe,Be),Se,Ve),Ce,He),we,Ue),Te,We),d(d(d(d(d(d(d(d(d(fe,Ee,Ge),De,Ke),Oe,qe),ke,Je),Ae,Ye),je,Xe),Me,Ze),Ne,Qe),Pe,$e);var tt={classic:{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},duotone:{900:`fad`,400:`fadr`,300:`fadl`,100:`fadt`},sharp:{900:`fass`,400:`fasr`,300:`fasl`,100:`fast`},"sharp-duotone":{900:`fasds`,400:`fasdr`,300:`fasdl`,100:`fasdt`},slab:{400:`faslr`},"slab-press":{400:`faslpr`},whiteboard:{600:`fawsb`},thumbprint:{300:`fatl`},notdog:{900:`fans`},"notdog-duo":{900:`fands`},etch:{900:`faes`},graphite:{100:`fagt`},chisel:{400:`facr`},jelly:{400:`fajr`},"jelly-fill":{400:`fajfr`},"jelly-duo":{400:`fajdr`},utility:{600:`fausb`},"utility-duo":{600:`faudsb`},"utility-fill":{600:`faufsb`}},nt={"Font Awesome 7 Free":{900:`fas`,400:`far`},"Font Awesome 7 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`,100:`fat`},"Font Awesome 7 Brands":{400:`fab`,normal:`fab`},"Font Awesome 7 Duotone":{900:`fad`,400:`fadr`,normal:`fadr`,300:`fadl`,100:`fadt`},"Font Awesome 7 Sharp":{900:`fass`,400:`fasr`,normal:`fasr`,300:`fasl`,100:`fast`},"Font Awesome 7 Sharp Duotone":{900:`fasds`,400:`fasdr`,normal:`fasdr`,300:`fasdl`,100:`fasdt`},"Font Awesome 7 Jelly":{400:`fajr`,normal:`fajr`},"Font Awesome 7 Jelly Fill":{400:`fajfr`,normal:`fajfr`},"Font Awesome 7 Jelly Duo":{400:`fajdr`,normal:`fajdr`},"Font Awesome 7 Slab":{400:`faslr`,normal:`faslr`},"Font Awesome 7 Slab Press":{400:`faslpr`,normal:`faslpr`},"Font Awesome 7 Thumbprint":{300:`fatl`,normal:`fatl`},"Font Awesome 7 Notdog":{900:`fans`,normal:`fans`},"Font Awesome 7 Notdog Duo":{900:`fands`,normal:`fands`},"Font Awesome 7 Etch":{900:`faes`,normal:`faes`},"Font Awesome 7 Graphite":{100:`fagt`,normal:`fagt`},"Font Awesome 7 Chisel":{400:`facr`,normal:`facr`},"Font Awesome 7 Whiteboard":{600:`fawsb`,normal:`fawsb`},"Font Awesome 7 Utility":{600:`fausb`,normal:`fausb`},"Font Awesome 7 Utility Duo":{600:`faudsb`,normal:`faudsb`},"Font Awesome 7 Utility Fill":{600:`faufsb`,normal:`faufsb`}},rt=new Map([[`classic`,{defaultShortPrefixId:`fas`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`,`brands`],futureStyleIds:[],defaultFontWeight:900}],[`duotone`,{defaultShortPrefixId:`fad`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp`,{defaultShortPrefixId:`fass`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`sharp-duotone`,{defaultShortPrefixId:`fasds`,defaultStyleId:`solid`,styleIds:[`solid`,`regular`,`light`,`thin`],futureStyleIds:[],defaultFontWeight:900}],[`chisel`,{defaultShortPrefixId:`facr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`etch`,{defaultShortPrefixId:`faes`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`graphite`,{defaultShortPrefixId:`fagt`,defaultStyleId:`thin`,styleIds:[`thin`],futureStyleIds:[],defaultFontWeight:100}],[`jelly`,{defaultShortPrefixId:`fajr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-duo`,{defaultShortPrefixId:`fajdr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`jelly-fill`,{defaultShortPrefixId:`fajfr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`notdog`,{defaultShortPrefixId:`fans`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`notdog-duo`,{defaultShortPrefixId:`fands`,defaultStyleId:`solid`,styleIds:[`solid`],futureStyleIds:[],defaultFontWeight:900}],[`slab`,{defaultShortPrefixId:`faslr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`slab-press`,{defaultShortPrefixId:`faslpr`,defaultStyleId:`regular`,styleIds:[`regular`],futureStyleIds:[],defaultFontWeight:400}],[`thumbprint`,{defaultShortPrefixId:`fatl`,defaultStyleId:`light`,styleIds:[`light`],futureStyleIds:[],defaultFontWeight:300}],[`utility`,{defaultShortPrefixId:`fausb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-duo`,{defaultShortPrefixId:`faudsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`utility-fill`,{defaultShortPrefixId:`faufsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}],[`whiteboard`,{defaultShortPrefixId:`fawsb`,defaultStyleId:`semibold`,styleIds:[`semibold`],futureStyleIds:[],defaultFontWeight:600}]]),it={chisel:{regular:`facr`},classic:{brands:`fab`,light:`fal`,regular:`far`,solid:`fas`,thin:`fat`},duotone:{light:`fadl`,regular:`fadr`,solid:`fad`,thin:`fadt`},etch:{solid:`faes`},graphite:{thin:`fagt`},jelly:{regular:`fajr`},"jelly-duo":{regular:`fajdr`},"jelly-fill":{regular:`fajfr`},notdog:{solid:`fans`},"notdog-duo":{solid:`fands`},sharp:{light:`fasl`,regular:`fasr`,solid:`fass`,thin:`fast`},"sharp-duotone":{light:`fasdl`,regular:`fasdr`,solid:`fasds`,thin:`fasdt`},slab:{regular:`faslr`},"slab-press":{regular:`faslpr`},thumbprint:{light:`fatl`},utility:{semibold:`fausb`},"utility-duo":{semibold:`faudsb`},"utility-fill":{semibold:`faufsb`},whiteboard:{semibold:`fawsb`}},at=[`fak`,`fa-kit`,`fakd`,`fa-kit-duotone`],ot={kit:{fak:`kit`,"fa-kit":`kit`},"kit-duotone":{fakd:`kit-duotone`,"fa-kit-duotone":`kit-duotone`}},st=[`kit`];d(d({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var ct={kit:{"fa-kit":`fak`},"kit-duotone":{"fa-kit-duotone":`fakd`}},lt={"Font Awesome Kit":{400:`fak`,normal:`fak`},"Font Awesome Kit Duotone":{400:`fakd`,normal:`fakd`}},ut={kit:{fak:`fa-kit`},"kit-duotone":{fakd:`fa-kit-duotone`}},dt={kit:{kit:`fak`},"kit-duotone":{"kit-duotone":`fakd`}},ft,pt={GROUP:`duotone-group`,SWAP_OPACITY:`swap-opacity`,PRIMARY:`primary`,SECONDARY:`secondary`},mt=[`fa-classic`,`fa-duotone`,`fa-sharp`,`fa-sharp-duotone`,`fa-thumbprint`,`fa-whiteboard`,`fa-notdog`,`fa-notdog-duo`,`fa-chisel`,`fa-etch`,`fa-graphite`,`fa-jelly`,`fa-jelly-fill`,`fa-jelly-duo`,`fa-slab`,`fa-slab-press`,`fa-utility`,`fa-utility-duo`,`fa-utility-fill`];ft={},d(d(d(d(d(d(d(d(d(d(ft,`classic`,`Classic`),`duotone`,`Duotone`),`sharp`,`Sharp`),`sharp-duotone`,`Sharp Duotone`),`chisel`,`Chisel`),`etch`,`Etch`),`graphite`,`Graphite`),`jelly`,`Jelly`),`jelly-duo`,`Jelly Duo`),`jelly-fill`,`Jelly Fill`),d(d(d(d(d(d(d(d(d(ft,`notdog`,`Notdog`),`notdog-duo`,`Notdog Duo`),`slab`,`Slab`),`slab-press`,`Slab Press`),`thumbprint`,`Thumbprint`),`utility`,`Utility`),`utility-duo`,`Utility Duo`),`utility-fill`,`Utility Fill`),`whiteboard`,`Whiteboard`),d(d({},`kit`,`Kit`),`kit-duotone`,`Kit Duotone`);var ht={classic:{"fa-brands":`fab`,"fa-duotone":`fad`,"fa-light":`fal`,"fa-regular":`far`,"fa-solid":`fas`,"fa-thin":`fat`},duotone:{"fa-regular":`fadr`,"fa-light":`fadl`,"fa-thin":`fadt`},sharp:{"fa-solid":`fass`,"fa-regular":`fasr`,"fa-light":`fasl`,"fa-thin":`fast`},"sharp-duotone":{"fa-solid":`fasds`,"fa-regular":`fasdr`,"fa-light":`fasdl`,"fa-thin":`fasdt`},slab:{"fa-regular":`faslr`},"slab-press":{"fa-regular":`faslpr`},whiteboard:{"fa-semibold":`fawsb`},thumbprint:{"fa-light":`fatl`},notdog:{"fa-solid":`fans`},"notdog-duo":{"fa-solid":`fands`},etch:{"fa-solid":`faes`},graphite:{"fa-thin":`fagt`},jelly:{"fa-regular":`fajr`},"jelly-fill":{"fa-regular":`fajfr`},"jelly-duo":{"fa-regular":`fajdr`},chisel:{"fa-regular":`facr`},utility:{"fa-semibold":`fausb`},"utility-duo":{"fa-semibold":`faudsb`},"utility-fill":{"fa-semibold":`faufsb`}},gt={classic:[`fas`,`far`,`fal`,`fat`,`fad`],duotone:[`fadr`,`fadl`,`fadt`],sharp:[`fass`,`fasr`,`fasl`,`fast`],"sharp-duotone":[`fasds`,`fasdr`,`fasdl`,`fasdt`],slab:[`faslr`],"slab-press":[`faslpr`],whiteboard:[`fawsb`],thumbprint:[`fatl`],notdog:[`fans`],"notdog-duo":[`fands`],etch:[`faes`],graphite:[`fagt`],jelly:[`fajr`],"jelly-fill":[`fajfr`],"jelly-duo":[`fajdr`],chisel:[`facr`],utility:[`fausb`],"utility-duo":[`faudsb`],"utility-fill":[`faufsb`]},_t={classic:{fab:`fa-brands`,fad:`fa-duotone`,fal:`fa-light`,far:`fa-regular`,fas:`fa-solid`,fat:`fa-thin`},duotone:{fadr:`fa-regular`,fadl:`fa-light`,fadt:`fa-thin`},sharp:{fass:`fa-solid`,fasr:`fa-regular`,fasl:`fa-light`,fast:`fa-thin`},"sharp-duotone":{fasds:`fa-solid`,fasdr:`fa-regular`,fasdl:`fa-light`,fasdt:`fa-thin`},slab:{faslr:`fa-regular`},"slab-press":{faslpr:`fa-regular`},whiteboard:{fawsb:`fa-semibold`},thumbprint:{fatl:`fa-light`},notdog:{fans:`fa-solid`},"notdog-duo":{fands:`fa-solid`},etch:{faes:`fa-solid`},graphite:{fagt:`fa-thin`},jelly:{fajr:`fa-regular`},"jelly-fill":{fajfr:`fa-regular`},"jelly-duo":{fajdr:`fa-regular`},chisel:{facr:`fa-regular`},utility:{fausb:`fa-semibold`},"utility-duo":{faudsb:`fa-semibold`},"utility-fill":{faufsb:`fa-semibold`}},vt=`fa.fas.far.fal.fat.fad.fadr.fadl.fadt.fab.fass.fasr.fasl.fast.fasds.fasdr.fasdl.fasdt.faslr.faslpr.fawsb.fatl.fans.fands.faes.fagt.fajr.fajfr.fajdr.facr.fausb.faudsb.faufsb`.split(`.`).concat(mt,[`fa-solid`,`fa-regular`,`fa-light`,`fa-thin`,`fa-duotone`,`fa-brands`,`fa-semibold`]),yt=[`solid`,`regular`,`light`,`thin`,`duotone`,`brands`,`semibold`],bt=[1,2,3,4,5,6,7,8,9,10],xt=bt.concat([11,12,13,14,15,16,17,18,19,20]),St=[].concat(y(Object.keys(gt)),yt,[`aw`,`fw`,`pull-left`,`pull-right`],[`2xs`,`xs`,`sm`,`lg`,`xl`,`2xl`,`beat`,`border`,`fade`,`beat-fade`,`bounce`,`flip-both`,`flip-horizontal`,`flip-vertical`,`flip`,`inverse`,`layers`,`layers-bottom-left`,`layers-bottom-right`,`layers-counter`,`layers-text`,`layers-top-left`,`layers-top-right`,`li`,`pull-end`,`pull-start`,`pulse`,`rotate-180`,`rotate-270`,`rotate-90`,`rotate-by`,`shake`,`spin-pulse`,`spin-reverse`,`spin`,`stack-1x`,`stack-2x`,`stack`,`ul`,`width-auto`,`width-fixed`,pt.GROUP,pt.SWAP_OPACITY,pt.PRIMARY,pt.SECONDARY],bt.map(function(e){return`${e}x`}),xt.map(function(e){return`w-${e}`})),Ct={"Font Awesome 5 Free":{900:`fas`,400:`far`},"Font Awesome 5 Pro":{900:`fas`,400:`far`,normal:`far`,300:`fal`},"Font Awesome 5 Brands":{400:`fab`,normal:`fab`},"Font Awesome 5 Duotone":{900:`fad`}},D=`___FONT_AWESOME___`,wt=16,Tt=`fa`,Et=`svg-inline--fa`,O=`data-fa-i2svg`,Dt=`data-fa-pseudo-element`,Ot=`data-fa-pseudo-element-pending`,kt=`data-prefix`,At=`data-icon`,jt=`fontawesome-i2svg`,Mt=`async`,Nt=[`HTML`,`HEAD`,`STYLE`,`SCRIPT`],Pt=[`::before`,`::after`,`:before`,`:after`],Ft=function(){try{return!0}catch{return!1}}();function k(e){return new Proxy(e,{get:function(e,t){return t in e?e[t]:e[T]}})}var It=_({},he);It[T]=_(_(_(_({},{"fa-duotone":`duotone`}),he[T]),ot.kit),ot[`kit-duotone`]);var Lt=k(It),Rt=_({},it);Rt[T]=_(_(_(_({},{duotone:`fad`}),Rt[T]),dt.kit),dt[`kit-duotone`]);var zt=k(Rt),Bt=_({},_t);Bt[T]=_(_({},Bt[T]),ut.kit);var Vt=k(Bt),Ht=_({},ht);Ht[T]=_(_({},Ht[T]),ct.kit),k(Ht);var Ut=pe,Wt=`fa-layers-text`,Gt=me;k(_({},tt));var Kt=[`class`,`data-prefix`,`data-icon`,`data-fa-transform`,`data-fa-mask`],qt=ge,Jt=[].concat(y(st),y(St)),A=S.FontAwesomeConfig||{};function Yt(e){var t=C.querySelector(`script[`+e+`]`);if(t)return t.getAttribute(e)}function Xt(e){return e===``?!0:e===`false`?!1:e===`true`?!0:e}C&&typeof C.querySelector==`function`&&[[`data-family-prefix`,`familyPrefix`],[`data-css-prefix`,`cssPrefix`],[`data-family-default`,`familyDefault`],[`data-style-default`,`styleDefault`],[`data-replacement-class`,`replacementClass`],[`data-auto-replace-svg`,`autoReplaceSvg`],[`data-auto-add-css`,`autoAddCss`],[`data-search-pseudo-elements`,`searchPseudoElements`],[`data-search-pseudo-elements-warnings`,`searchPseudoElementsWarnings`],[`data-search-pseudo-elements-full-scan`,`searchPseudoElementsFullScan`],[`data-observe-mutations`,`observeMutations`],[`data-mutate-approach`,`mutateApproach`],[`data-keep-original-source`,`keepOriginalSource`],[`data-measure-performance`,`measurePerformance`],[`data-show-missing-icons`,`showMissingIcons`]].forEach(function(e){var t=v(e,2),n=t[0],r=t[1],i=Xt(Yt(n));i!=null&&(A[r]=i)});var Zt={styleDefault:`solid`,familyDefault:T,cssPrefix:Tt,replacementClass:Et,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:`async`,keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};A.familyPrefix&&(A.cssPrefix=A.familyPrefix);var j=_(_({},Zt),A);j.autoReplaceSvg||(j.observeMutations=!1);var M={};Object.keys(Zt).forEach(function(e){Object.defineProperty(M,e,{enumerable:!0,set:function(t){j[e]=t,Qt.forEach(function(e){return e(M)})},get:function(){return j[e]}})}),Object.defineProperty(M,"familyPrefix",{enumerable:!0,set:function(e){j.cssPrefix=e,Qt.forEach(function(e){return e(M)})},get:function(){return j.cssPrefix}}),S.FontAwesomeConfig=M;var Qt=[];function $t(e){return Qt.push(e),function(){Qt.splice(Qt.indexOf(e),1)}}var N=wt,P={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function en(e){if(!(!e||!w)){var t=C.createElement(`style`);t.setAttribute(`type`,`text/css`),t.innerHTML=e;for(var n=C.head.childNodes,r=null,i=n.length-1;i>-1;i--){var a=n[i],o=(a.tagName||``).toUpperCase();[`STYLE`,`LINK`].indexOf(o)>-1&&(r=a)}return C.head.insertBefore(t,r),e}}var tn=`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;function nn(){for(var e=12,t=``;e-- >0;)t+=tn[Math.random()*62|0];return t}function F(e){for(var t=[],n=(e||[]).length>>>0;n--;)t[n]=e[n];return t}function rn(e){return e.classList?F(e.classList):(e.getAttribute(`class`)||``).split(` `).filter(function(e){return e})}function an(e){return`${e}`.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function on(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}="${an(e[n])}" `},``).trim()}function sn(e){return Object.keys(e||{}).reduce(function(t,n){return t+`${n}: ${e[n].trim()};`},``)}function cn(e){return e.size!==P.size||e.x!==P.x||e.y!==P.y||e.rotate!==P.rotate||e.flipX||e.flipY}function ln(e){var t=e.transform,n=e.containerWidth,r=e.iconWidth;return{outer:{transform:`translate(${n/2} 256)`},inner:{transform:`${`translate(${t.x*32}, ${t.y*32}) `} ${`scale(${t.size/16*(t.flipX?-1:1)}, ${t.size/16*(t.flipY?-1:1)}) `} ${`rotate(${t.rotate} 0 0)`}`},path:{transform:`translate(${r/2*-1} -256)`}}}function un(e){var t=e.transform,n=e.width,r=n===void 0?wt:n,i=e.height,a=i===void 0?wt:i,o=e.startCentered,s=o===void 0?!1:o,c=``;return s&&de?c+=`translate(${t.x/N-r/2}em, ${t.y/N-a/2}em) `:s?c+=`translate(calc(-50% + ${t.x/N}em), calc(-50% + ${t.y/N}em)) `:c+=`translate(${t.x/N}em, ${t.y/N}em) `,c+=`scale(${t.size/N*(t.flipX?-1:1)}, ${t.size/N*(t.flipY?-1:1)}) `,c+=`rotate(${t.rotate}deg) `,c}var dn=`:root, :host {
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
}`;function fn(){var e=Tt,t=Et,n=M.cssPrefix,r=M.replacementClass,i=dn;if(n!==e||r!==t){var a=RegExp(`\\.${e}\\-`,`g`),o=RegExp(`\\--${e}\\-`,`g`),s=RegExp(`\\.${t}`,`g`);i=i.replace(a,`.${n}-`).replace(o,`--${n}-`).replace(s,`.${r}`)}return i}var pn=!1;function mn(){M.autoAddCss&&!pn&&(en(fn()),pn=!0)}var hn={mixout:function(){return{dom:{css:fn,insertCss:mn}}},hooks:function(){return{beforeDOMElementCreation:function(){mn()},beforeI2svg:function(){mn()}}}},I=S||{};I[D]||(I[D]={}),I[D].styles||(I[D].styles={}),I[D].hooks||(I[D].hooks={}),I[D].shims||(I[D].shims=[]);var L=I[D],gn=[],_n=function(){C.removeEventListener(`DOMContentLoaded`,_n),vn=1,gn.map(function(e){return e()})},vn=!1;w&&(vn=(C.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(C.readyState),vn||C.addEventListener(`DOMContentLoaded`,_n));function yn(e){w&&(vn?setTimeout(e,0):gn.push(e))}function R(e){var t=e.tag,n=e.attributes,r=n===void 0?{}:n,i=e.children,a=i===void 0?[]:i;return typeof e==`string`?an(e):`<${t} ${on(r)}>${a.map(R).join(``)}</${t}>`}function bn(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}var xn=function(e,t){return function(n,r,i,a){return e.call(t,n,r,i,a)}},Sn=function(e,t,n,r){var i=Object.keys(e),a=i.length,o=r===void 0?t:xn(t,r),s,c,l;for(n===void 0?(s=1,l=e[i[0]]):(s=0,l=n);s<a;s++)c=i[s],l=o(l,e[c],c,e);return l};function Cn(e){return y(e).length===1?e.codePointAt(0).toString(16):null}function wn(e){return Object.keys(e).reduce(function(t,n){var r=e[n];return r.icon?t[r.iconName]=r.icon:t[n]=r,t},{})}function Tn(e,t){var n=(arguments.length>2&&arguments[2]!==void 0?arguments[2]:{}).skipHooks,r=n===void 0?!1:n,i=wn(t);typeof L.hooks.addPack==`function`&&!r?L.hooks.addPack(e,wn(t)):L.styles[e]=_(_({},L.styles[e]||{}),i),e===`fas`&&Tn(`fa`,t)}var En=L.styles,Dn=L.shims,On=Object.keys(Vt),kn=On.reduce(function(e,t){return e[t]=Object.keys(Vt[t]),e},{}),An=null,jn={},Mn={},Nn={},Pn={},Fn={};function In(e){return~Jt.indexOf(e)}function Ln(e,t){var n=t.split(`-`),r=n[0],i=n.slice(1).join(`-`);return r===e&&i!==``&&!In(i)?i:null}var Rn=function(){var e=function(e){return Sn(En,function(t,n,r){return t[r]=Sn(n,e,{}),t},{})};jn=e(function(e,t,n){return t[3]&&(e[t[3]]=n),t[2]&&t[2].filter(function(e){return typeof e==`number`}).forEach(function(t){e[t.toString(16)]=n}),e}),Mn=e(function(e,t,n){return e[n]=n,t[2]&&t[2].filter(function(e){return typeof e==`string`}).forEach(function(t){e[t]=n}),e}),Fn=e(function(e,t,n){var r=t[2];return e[n]=n,r.forEach(function(t){e[t]=n}),e});var t=`far`in En||M.autoFetchSvg,n=Sn(Dn,function(e,n){var r=n[0],i=n[1],a=n[2];return i===`far`&&!t&&(i=`fas`),typeof r==`string`&&(e.names[r]={prefix:i,iconName:a}),typeof r==`number`&&(e.unicodes[r.toString(16)]={prefix:i,iconName:a}),e},{names:{},unicodes:{}});Nn=n.names,Pn=n.unicodes,An=Gn(M.styleDefault,{family:M.familyDefault})};$t(function(e){An=Gn(e.styleDefault,{family:M.familyDefault})}),Rn();function zn(e,t){return(jn[e]||{})[t]}function Bn(e,t){return(Mn[e]||{})[t]}function z(e,t){return(Fn[e]||{})[t]}function Vn(e){return Nn[e]||{prefix:null,iconName:null}}function Hn(e){var t=Pn[e],n=zn(`fas`,e);return t||(n?{prefix:`fas`,iconName:n}:null)||{prefix:null,iconName:null}}function B(){return An}var Un=function(){return{prefix:null,iconName:null,rest:[]}};function Wn(e){var t=T,n=On.reduce(function(e,t){return e[t]=`${M.cssPrefix}-${t}`,e},{});return et.forEach(function(r){(e.includes(n[r])||e.some(function(e){return kn[r].includes(e)}))&&(t=r)}),t}function Gn(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).family,n=t===void 0?T:t,r=Lt[n][e];if(n===E&&!e)return`fad`;var i=zt[n][e]||zt[n][r],a=e in L.styles?e:null;return i||a||null}function Kn(e){var t=[],n=null;return e.forEach(function(e){var r=Ln(M.cssPrefix,e);r?n=r:e&&t.push(e)}),{iconName:n,rest:t}}function qn(e){return e.sort().filter(function(e,t,n){return n.indexOf(e)===t})}var Jn=vt.concat(at);function Yn(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).skipLookups,n=t===void 0?!1:t,r=null,i=qn(e.filter(function(e){return Jn.includes(e)})),a=qn(e.filter(function(e){return!Jn.includes(e)})),o=v(i.filter(function(e){return r=e,!_e.includes(e)}),1)[0],s=o===void 0?null:o,c=Wn(i),l=_(_({},Kn(a)),{},{prefix:Gn(s,{family:c})});return _(_(_({},l),$n({values:e,family:c,styles:En,config:M,canonical:l,givenPrefix:r})),Xn(n,r,l))}function Xn(e,t,n){var r=n.prefix,i=n.iconName;if(e||!r||!i)return{prefix:r,iconName:i};var a=t===`fa`?Vn(i):{},o=z(r,i);return i=a.iconName||o||i,r=a.prefix||r,r===`far`&&!En.far&&En.fas&&!M.autoFetchSvg&&(r=`fas`),{prefix:r,iconName:i}}var Zn=et.filter(function(e){return e!==T||e!==E}),Qn=Object.keys(_t).filter(function(e){return e!==T}).map(function(e){return Object.keys(_t[e])}).flat();function $n(e){var t=e.values,n=e.family,r=e.canonical,i=e.givenPrefix,a=i===void 0?``:i,o=e.styles,s=o===void 0?{}:o,c=e.config,l=c===void 0?{}:c,u=n===E,d=t.includes(`fa-duotone`)||t.includes(`fad`),f=l.familyDefault===`duotone`,p=r.prefix===`fad`||r.prefix===`fa-duotone`;return!u&&(d||f||p)&&(r.prefix=`fad`),(t.includes(`fa-brands`)||t.includes(`fab`))&&(r.prefix=`fab`),!r.prefix&&Zn.includes(n)&&(Object.keys(s).find(function(e){return Qn.includes(e)})||l.autoFetchSvg)&&(r.prefix=rt.get(n).defaultShortPrefixId,r.iconName=z(r.prefix,r.iconName)||r.iconName),(r.prefix===`fa`||a===`fa`)&&(r.prefix=B()||`fas`),r}var er=function(){function e(){s(this,e),this.definitions={}}return l(e,[{key:`add`,value:function(){var e=this,t=[...arguments].reduce(this._pullDefinitions,{});Object.keys(t).forEach(function(n){e.definitions[n]=_(_({},e.definitions[n]||{}),t[n]),Tn(n,t[n]);var r=Vt[T][n];r&&Tn(r,t[n]),Rn()})}},{key:`reset`,value:function(){this.definitions={}}},{key:`_pullDefinitions`,value:function(e,t){var n=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(n).map(function(t){var r=n[t],i=r.prefix,a=r.iconName,o=r.icon,s=o[2];e[i]||(e[i]={}),s.length>0&&s.forEach(function(t){typeof t==`string`&&(e[i][t]=o)}),e[i][a]=o}),e}}])}(),tr=[],V={},H={},nr=Object.keys(H);function rr(e,t){var n=t.mixoutsTo;return tr=e,V={},Object.keys(H).forEach(function(e){nr.indexOf(e)===-1&&delete H[e]}),tr.forEach(function(e){var t=e.mixout?e.mixout():{};if(Object.keys(t).forEach(function(e){typeof t[e]==`function`&&(n[e]=t[e]),ee(t[e])===`object`&&Object.keys(t[e]).forEach(function(r){n[e]||(n[e]={}),n[e][r]=t[e][r]})}),e.hooks){var r=e.hooks();Object.keys(r).forEach(function(e){V[e]||(V[e]=[]),V[e].push(r[e])})}e.provides&&e.provides(H)}),n}function ir(e,t){var n=[...arguments].slice(2);return(V[e]||[]).forEach(function(e){t=e.apply(null,[t].concat(n))}),t}function U(e){var t=[...arguments].slice(1);(V[e]||[]).forEach(function(e){e.apply(null,t)})}function W(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return H[e]?H[e].apply(null,t):void 0}function ar(e){e.prefix===`fa`&&(e.prefix=`fas`);var t=e.iconName,n=e.prefix||B();if(t)return t=z(n,t)||t,bn(or.definitions,n,t)||bn(L.styles,n,t)}var or=new er,G={noAuto:function(){M.autoReplaceSvg=!1,M.observeMutations=!1,U(`noAuto`)},config:M,dom:{i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return w?(U(`beforeI2svg`,e),W(`pseudoElements2svg`,e),W(`i2svg`,e)):Promise.reject(Error(`Operation requires a DOM of some kind.`))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.autoReplaceSvgRoot;M.autoReplaceSvg===!1&&(M.autoReplaceSvg=!0),M.observeMutations=!0,yn(function(){sr({autoReplaceSvgRoot:t}),U(`watch`,e)})}},parse:{icon:function(e){if(e===null)return null;if(ee(e)===`object`&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:z(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var t=e[1].indexOf(`fa-`)===0?e[1].slice(3):e[1],n=Gn(e[0]);return{prefix:n,iconName:z(n,t)||t}}if(typeof e==`string`&&(e.indexOf(`${M.cssPrefix}-`)>-1||e.match(Ut))){var r=Yn(e.split(` `),{skipLookups:!0});return{prefix:r.prefix||B(),iconName:z(r.prefix,r.iconName)||r.iconName}}if(typeof e==`string`){var i=B();return{prefix:i,iconName:z(i,e)||e}}}},library:or,findIconDefinition:ar,toHtml:R},sr=function(){var e=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:{}).autoReplaceSvgRoot,t=e===void 0?C:e;(Object.keys(L.styles).length>0||M.autoFetchSvg)&&w&&M.autoReplaceSvg&&G.dom.i2svg({node:t})};function cr(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(e){return R(e)})}}),Object.defineProperty(e,"node",{get:function(){if(w){var t=C.createElement(`div`);return t.innerHTML=e.html,t.children}}}),e}function lr(e){var t=e.children,n=e.main,r=e.mask,i=e.attributes,a=e.styles,o=e.transform;if(cn(o)&&n.found&&!r.found){var s={x:n.width/n.height/2,y:.5};i.style=sn(_(_({},a),{},{"transform-origin":`${s.x+o.x/16}em ${s.y+o.y/16}em`}))}return[{tag:`svg`,attributes:i,children:t}]}function ur(e){var t=e.prefix,n=e.iconName,r=e.children,i=e.attributes,a=e.symbol,o=a===!0?`${t}-${M.cssPrefix}-${n}`:a;return[{tag:`svg`,attributes:{style:`display: none;`},children:[{tag:`symbol`,attributes:_(_({},i),{},{id:o}),children:r}]}]}function dr(e){return[`aria-label`,`aria-labelledby`,`title`,`role`].some(function(t){return t in e})}function fr(e){var t=e.icons,n=t.main,r=t.mask,i=e.prefix,a=e.iconName,o=e.transform,s=e.symbol,c=e.maskId,l=e.extra,u=e.watchable,d=u===void 0?!1:u,f=r.found?r:n,p=f.width,m=f.height,h=[M.replacementClass,a?`${M.cssPrefix}-${a}`:``].filter(function(e){return l.classes.indexOf(e)===-1}).filter(function(e){return e!==``||!!e}).concat(l.classes).join(` `),g={children:[],attributes:_(_({},l.attributes),{},{"data-prefix":i,"data-icon":a,class:h,role:l.attributes.role||`img`,viewBox:`0 0 ${p} ${m}`})};!dr(l.attributes)&&!l.attributes[`aria-hidden`]&&(g.attributes[`aria-hidden`]=`true`),d&&(g.attributes[O]=``);var v=_(_({},g),{},{prefix:i,iconName:a,main:n,mask:r,maskId:c,transform:o,symbol:s,styles:_({},l.styles)}),y=r.found&&n.found?W(`generateAbstractMask`,v)||{children:[],attributes:{}}:W(`generateAbstractIcon`,v)||{children:[],attributes:{}},b=y.children,x=y.attributes;return v.children=b,v.attributes=x,s?ur(v):lr(v)}function pr(e){var t=e.content,n=e.width,r=e.height,i=e.transform,a=e.extra,o=e.watchable,s=o===void 0?!1:o,c=_(_({},a.attributes),{},{class:a.classes.join(` `)});s&&(c[O]=``);var l=_({},a.styles);cn(i)&&(l.transform=un({transform:i,startCentered:!0,width:n,height:r}),l[`-webkit-transform`]=l.transform);var u=sn(l);u.length>0&&(c.style=u);var d=[];return d.push({tag:`span`,attributes:c,children:[t]}),d}function mr(e){var t=e.content,n=e.extra,r=_(_({},n.attributes),{},{class:n.classes.join(` `)}),i=sn(n.styles);i.length>0&&(r.style=i);var a=[];return a.push({tag:`span`,attributes:r,children:[t]}),a}var hr=L.styles;function gr(e){var t=e[0],n=e[1],r=v(e.slice(4),1)[0],i=null;return i=Array.isArray(r)?{tag:`g`,attributes:{class:`${M.cssPrefix}-${qt.GROUP}`},children:[{tag:`path`,attributes:{class:`${M.cssPrefix}-${qt.SECONDARY}`,fill:`currentColor`,d:r[0]}},{tag:`path`,attributes:{class:`${M.cssPrefix}-${qt.PRIMARY}`,fill:`currentColor`,d:r[1]}}]}:{tag:`path`,attributes:{fill:`currentColor`,d:r}},{found:!0,width:t,height:n,icon:i}}var _r={found:!1,width:512,height:512};function vr(e,t){!Ft&&!M.showMissingIcons&&e&&console.error(`Icon with name "${e}" and prefix "${t}" is missing.`)}function yr(e,t){var n=t;return t===`fa`&&M.styleDefault!==null&&(t=B()),new Promise(function(r,i){if(n===`fa`){var a=Vn(e)||{};e=a.iconName||e,t=a.prefix||t}if(e&&t&&hr[t]&&hr[t][e]){var o=hr[t][e];return r(gr(o))}vr(e,t),r(_(_({},_r),{},{icon:M.showMissingIcons&&e&&W(`missingIconAbstract`)||{}}))})}var br=function(){},xr=M.measurePerformance&&ue&&ue.mark&&ue.measure?ue:{mark:br,measure:br},K=`FA "7.2.0"`,Sr=function(e){return xr.mark(`${K} ${e} begins`),function(){return Cr(e)}},Cr=function(e){xr.mark(`${K} ${e} ends`),xr.measure(`${K} ${e}`,`${K} ${e} begins`,`${K} ${e} ends`)},wr={begin:Sr,end:Cr},Tr=function(){};function Er(e){return typeof(e.getAttribute?e.getAttribute(O):null)==`string`}function Dr(e){var t=e.getAttribute?e.getAttribute(kt):null,n=e.getAttribute?e.getAttribute(At):null;return t&&n}function Or(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(M.replacementClass)}function kr(){return M.autoReplaceSvg===!0?Pr.replace:Pr[M.autoReplaceSvg]||Pr.replace}function Ar(e){return C.createElementNS(`http://www.w3.org/2000/svg`,e)}function jr(e){return C.createElement(e)}function Mr(e){var t=(arguments.length>1&&arguments[1]!==void 0?arguments[1]:{}).ceFn,n=t===void 0?e.tag===`svg`?Ar:jr:t;if(typeof e==`string`)return C.createTextNode(e);var r=n(e.tag);return Object.keys(e.attributes||[]).forEach(function(t){r.setAttribute(t,e.attributes[t])}),(e.children||[]).forEach(function(e){r.appendChild(Mr(e,{ceFn:n}))}),r}function Nr(e){var t=` ${e.outerHTML} `;return t=`${t}Font Awesome fontawesome.com `,t}var Pr={replace:function(e){var t=e[0];if(t.parentNode)if(e[1].forEach(function(e){t.parentNode.insertBefore(Mr(e),t)}),t.getAttribute(O)===null&&M.keepOriginalSource){var n=C.createComment(Nr(t));t.parentNode.replaceChild(n,t)}else t.remove()},nest:function(e){var t=e[0],n=e[1];if(~rn(t).indexOf(M.replacementClass))return Pr.replace(e);var r=RegExp(`${M.cssPrefix}-.*`);if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(` `).reduce(function(e,t){return t===M.replacementClass||t.match(r)?e.toSvg.push(t):e.toNode.push(t),e},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(` `),i.toNode.length===0?t.removeAttribute(`class`):t.setAttribute(`class`,i.toNode.join(` `))}var a=n.map(function(e){return R(e)}).join(`
`);t.setAttribute(O,``),t.innerHTML=a}};function Fr(e){e()}function Ir(e,t){var n=typeof t==`function`?t:Tr;if(e.length===0)n();else{var r=Fr;M.mutateApproach===Mt&&(r=S.requestAnimationFrame||Fr),r(function(){var t=kr(),r=wr.begin(`mutate`);e.map(t),r(),n()})}}var Lr=!1;function Rr(){Lr=!0}function zr(){Lr=!1}var Br=null;function Vr(e){if(le&&M.observeMutations){var t=e.treeCallback,n=t===void 0?Tr:t,r=e.nodeCallback,i=r===void 0?Tr:r,a=e.pseudoElementsCallback,o=a===void 0?Tr:a,s=e.observeMutationsRoot,c=s===void 0?C:s;Br=new le(function(e){if(!Lr){var t=B();F(e).forEach(function(e){if(e.type===`childList`&&e.addedNodes.length>0&&!Er(e.addedNodes[0])&&(M.searchPseudoElements&&o(e.target),n(e.target)),e.type===`attributes`&&e.target.parentNode&&M.searchPseudoElements&&o([e.target],!0),e.type===`attributes`&&Er(e.target)&&~Kt.indexOf(e.attributeName))if(e.attributeName===`class`&&Dr(e.target)){var r=Yn(rn(e.target)),a=r.prefix,s=r.iconName;e.target.setAttribute(kt,a||t),s&&e.target.setAttribute(At,s)}else Or(e.target)&&i(e.target)})}}),w&&Br.observe(c,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Hr(){Br&&Br.disconnect()}function Ur(e){var t=e.getAttribute(`style`),n=[];return t&&(n=t.split(`;`).reduce(function(e,t){var n=t.split(`:`),r=n[0],i=n.slice(1);return r&&i.length>0&&(e[r]=i.join(`:`).trim()),e},{})),n}function Wr(e){var t=e.getAttribute(`data-prefix`),n=e.getAttribute(`data-icon`),r=e.innerText===void 0?``:e.innerText.trim(),i=Yn(rn(e));return i.prefix||=B(),t&&n&&(i.prefix=t,i.iconName=n),i.iconName&&i.prefix?i:(i.prefix&&r.length>0&&(i.iconName=Bn(i.prefix,e.innerText)||zn(i.prefix,Cn(e.innerText))),!i.iconName&&M.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(i.iconName=e.firstChild.data),i)}function Gr(e){return F(e.attributes).reduce(function(e,t){return e.name!==`class`&&e.name!==`style`&&(e[t.name]=t.value),e},{})}function Kr(){return{iconName:null,prefix:null,transform:P,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function qr(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=Wr(e),r=n.iconName,i=n.prefix,a=n.rest,o=Gr(e),s=ir(`parseNodeAttributes`,{},e);return _({iconName:r,prefix:i,transform:P,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:a,styles:t.styleParser?Ur(e):[],attributes:o}},s)}var Jr=L.styles;function Yr(e){var t=M.autoReplaceSvg===`nest`?qr(e,{styleParser:!1}):qr(e);return~t.extra.classes.indexOf(Wt)?W(`generateLayersText`,e,t):W(`generateSvgReplacementMutation`,e,t)}function Xr(){return[].concat(y(at),y(vt))}function Zr(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!w)return Promise.resolve();var n=C.documentElement.classList,r=function(e){return n.add(`${jt}-${e}`)},i=function(e){return n.remove(`${jt}-${e}`)},a=M.autoFetchSvg?Xr():_e.concat(Object.keys(Jr));a.includes(`fa`)||a.push(`fa`);var o=[`.${Wt}:not([${O}])`].concat(a.map(function(e){return`.${e}:not([${O}])`})).join(`, `);if(o.length===0)return Promise.resolve();var s=[];try{s=F(e.querySelectorAll(o))}catch{}if(s.length>0)r(`pending`),i(`complete`);else return Promise.resolve();var c=wr.begin(`onTree`),l=s.reduce(function(e,t){try{var n=Yr(t);n&&e.push(n)}catch(e){Ft||e.name===`MissingIcon`&&console.error(e)}return e},[]);return new Promise(function(e,n){Promise.all(l).then(function(n){Ir(n,function(){r(`active`),r(`complete`),i(`pending`),typeof t==`function`&&t(),c(),e()})}).catch(function(e){c(),n(e)})})}function Qr(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Yr(e).then(function(e){e&&Ir([e],t)})}function $r(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:ar(t||{}),i=n.mask;return i&&=(i||{}).icon?i:ar(i||{}),e(r,_(_({},n),{},{mask:i}))}}var ei=function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?P:n,i=t.symbol,a=i===void 0?!1:i,o=t.mask,s=o===void 0?null:o,c=t.maskId,l=c===void 0?null:c,u=t.classes,d=u===void 0?[]:u,f=t.attributes,p=f===void 0?{}:f,m=t.styles,h=m===void 0?{}:m;if(e){var g=e.prefix,v=e.iconName,y=e.icon;return cr(_({type:`icon`},e),function(){return U(`beforeDOMElementCreation`,{iconDefinition:e,params:t}),fr({icons:{main:gr(y),mask:s?gr(s.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:v,transform:_(_({},P),r),symbol:a,maskId:l,extra:{attributes:p,styles:h,classes:d}})})}},ti={mixout:function(){return{icon:$r(ei)}},hooks:function(){return{mutationObserverCallbacks:function(e){return e.treeCallback=Zr,e.nodeCallback=Qr,e}}},provides:function(e){e.i2svg=function(e){var t=e.node,n=t===void 0?C:t,r=e.callback;return Zr(n,r===void 0?function(){}:r)},e.generateSvgReplacementMutation=function(e,t){var n=t.iconName,r=t.prefix,i=t.transform,a=t.symbol,o=t.mask,s=t.maskId,c=t.extra;return new Promise(function(t,l){Promise.all([yr(n,r),o.iconName?yr(o.iconName,o.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(o){var l=v(o,2),u=l[0],d=l[1];t([e,fr({icons:{main:u,mask:d},prefix:r,iconName:n,transform:i,symbol:a,maskId:s,extra:c,watchable:!0})])}).catch(l)})},e.generateAbstractIcon=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.transform,a=e.styles,o=sn(a);o.length>0&&(n.style=o);var s;return cn(i)&&(s=W(`generateAbstractTransformGrouping`,{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),t.push(s||r.icon),{children:t,attributes:n}}}},ni={mixout:function(){return{layer:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.classes,r=n===void 0?[]:n;return cr({type:`layer`},function(){U(`beforeDOMElementCreation`,{assembler:e,params:t});var n=[];return e(function(e){Array.isArray(e)?e.map(function(e){n=n.concat(e.abstract)}):n=n.concat(e.abstract)}),[{tag:`span`,attributes:{class:[`${M.cssPrefix}-layers`].concat(y(r)).join(` `)},children:n}]})}}}},ri={mixout:function(){return{counter:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.title,r=n===void 0?null:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return cr({type:`counter`,content:e},function(){return U(`beforeDOMElementCreation`,{content:e,params:t}),mr({content:e.toString(),title:r,extra:{attributes:s,styles:l,classes:[`${M.cssPrefix}-layers-counter`].concat(y(a))}})})}}}},ii={mixout:function(){return{text:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,r=n===void 0?P:n,i=t.classes,a=i===void 0?[]:i,o=t.attributes,s=o===void 0?{}:o,c=t.styles,l=c===void 0?{}:c;return cr({type:`text`,content:e},function(){return U(`beforeDOMElementCreation`,{content:e,params:t}),pr({content:e,transform:_(_({},P),r),extra:{attributes:s,styles:l,classes:[`${M.cssPrefix}-layers-text`].concat(y(a))}})})}}},provides:function(e){e.generateLayersText=function(e,t){var n=t.transform,r=t.extra,i=null,a=null;if(de){var o=parseInt(getComputedStyle(e).fontSize,10),s=e.getBoundingClientRect();i=s.width/o,a=s.height/o}return Promise.resolve([e,pr({content:e.innerHTML,width:i,height:a,transform:n,extra:r,watchable:!0})])}}},ai=RegExp(`"`,`ug`),oi=[1105920,1112319],si=_(_(_(_({},{FontAwesome:{normal:`fas`,400:`fas`}}),nt),Ct),lt),ci=Object.keys(si).reduce(function(e,t){return e[t.toLowerCase()]=si[t],e},{}),li=Object.keys(ci).reduce(function(e,t){var n=ci[t];return e[t]=n[900]||y(Object.entries(n))[0][1],e},{});function ui(e){return Cn(y(e.replace(ai,``))[0]||``)}function di(e){var t=e.getPropertyValue(`font-feature-settings`).includes(`ss01`),n=e.getPropertyValue(`content`).replace(ai,``),r=n.codePointAt(0),i=r>=oi[0]&&r<=oi[1],a=n.length===2?n[0]===n[1]:!1;return i||a||t}function fi(e,t){var n=e.replace(/^['"]|['"]$/g,``).toLowerCase(),r=parseInt(t),i=isNaN(r)?`normal`:r;return(ci[n]||{})[i]||li[n]}function pi(e,t){var n=`${Ot}${t.replace(`:`,`-`)}`;return new Promise(function(r,i){if(e.getAttribute(n)!==null)return r();var a=F(e.children).filter(function(e){return e.getAttribute(Dt)===t})[0],o=S.getComputedStyle(e,t),s=o.getPropertyValue(`font-family`),c=s.match(Gt),l=o.getPropertyValue(`font-weight`),u=o.getPropertyValue(`content`);if(a&&!c)return e.removeChild(a),r();if(c&&u!==`none`&&u!==``){var d=o.getPropertyValue(`content`),f=fi(s,l),p=ui(d),m=c[0].startsWith(`FontAwesome`),h=di(o),g=zn(f,p),v=g;if(m){var y=Hn(p);y.iconName&&y.prefix&&(g=y.iconName,f=y.prefix)}if(g&&!h&&(!a||a.getAttribute(kt)!==f||a.getAttribute(At)!==v)){e.setAttribute(n,v),a&&e.removeChild(a);var b=Kr(),x=b.extra;x.attributes[Dt]=t,yr(g,f).then(function(i){var a=fr(_(_({},b),{},{icons:{main:i,mask:Un()},prefix:f,iconName:v,extra:x,watchable:!0})),o=C.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t===`::before`?e.insertBefore(o,e.firstChild):e.appendChild(o),o.outerHTML=a.map(function(e){return R(e)}).join(`
`),e.removeAttribute(n),r()}).catch(i)}else r()}else r()})}function mi(e){return Promise.all([pi(e,`::before`),pi(e,`::after`)])}function hi(e){return e.parentNode!==document.head&&!~Nt.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Dt)&&(!e.parentNode||e.parentNode.tagName!==`svg`)}var gi=function(e){return!!e&&Pt.some(function(t){return e.includes(t)})},_i=function(e){if(!e)return[];var t=new Set,n=e.split(/,(?![^()]*\))/).map(function(e){return e.trim()});n=n.flatMap(function(e){return e.includes(`(`)?e:e.split(`,`).map(function(e){return e.trim()})});var r=u(n),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;if(gi(a)){var o=Pt.reduce(function(e,t){return e.replace(t,``)},a);o!==``&&o!==`*`&&t.add(o)}}}catch(e){r.e(e)}finally{r.f()}return t};function vi(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(w){var n;if(t)n=e;else if(M.searchPseudoElementsFullScan)n=e.querySelectorAll(`*`);else{var r=new Set,i=u(document.styleSheets),a;try{for(i.s();!(a=i.n()).done;){var o=a.value;try{var s=u(o.cssRules),c;try{for(s.s();!(c=s.n()).done;){var l=c.value,d=u(_i(l.selectorText)),f;try{for(d.s();!(f=d.n()).done;){var p=f.value;r.add(p)}}catch(e){d.e(e)}finally{d.f()}}}catch(e){s.e(e)}finally{s.f()}}catch(e){M.searchPseudoElementsWarnings&&console.warn(`Font Awesome: cannot parse stylesheet: ${o.href} (${e.message})
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`)}}}catch(e){i.e(e)}finally{i.f()}if(!r.size)return;var m=Array.from(r).join(`, `);try{n=e.querySelectorAll(m)}catch{}}return new Promise(function(e,t){var r=F(n).filter(hi).map(mi),i=wr.begin(`searchPseudoElements`);Rr(),Promise.all(r).then(function(){i(),zr(),e()}).catch(function(){i(),zr(),t()})})}}var yi={hooks:function(){return{mutationObserverCallbacks:function(e){return e.pseudoElementsCallback=vi,e}}},provides:function(e){e.pseudoElements2svg=function(e){var t=e.node,n=t===void 0?C:t;M.searchPseudoElements&&vi(n)}}},bi=!1,xi={mixout:function(){return{dom:{unwatch:function(){Rr(),bi=!0}}}},hooks:function(){return{bootstrap:function(){Vr(ir(`mutationObserverCallbacks`,{}))},noAuto:function(){Hr()},watch:function(e){var t=e.observeMutationsRoot;bi?zr():Vr(ir(`mutationObserverCallbacks`,{observeMutationsRoot:t}))}}}},Si=function(e){return e.toLowerCase().split(` `).reduce(function(e,t){var n=t.toLowerCase().split(`-`),r=n[0],i=n.slice(1).join(`-`);if(r&&i===`h`)return e.flipX=!0,e;if(r&&i===`v`)return e.flipY=!0,e;if(i=parseFloat(i),isNaN(i))return e;switch(r){case`grow`:e.size+=i;break;case`shrink`:e.size-=i;break;case`left`:e.x-=i;break;case`right`:e.x+=i;break;case`up`:e.y-=i;break;case`down`:e.y+=i;break;case`rotate`:e.rotate+=i;break}return e},{size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0})},Ci={mixout:function(){return{parse:{transform:function(e){return Si(e)}}}},hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-transform`);return n&&(e.transform=Si(n)),e}}},provides:function(e){e.generateAbstractTransformGrouping=function(e){var t=e.main,n=e.transform,r=e.containerWidth,i=e.iconWidth,a={outer:{transform:`translate(${r/2} 256)`},inner:{transform:`${`translate(${n.x*32}, ${n.y*32}) `} ${`scale(${n.size/16*(n.flipX?-1:1)}, ${n.size/16*(n.flipY?-1:1)}) `} ${`rotate(${n.rotate} 0 0)`}`},path:{transform:`translate(${i/2*-1} -256)`}};return{tag:`g`,attributes:_({},a.outer),children:[{tag:`g`,attributes:_({},a.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:_(_({},t.icon.attributes),a.path)}]}]}}}},wi={x:0,y:0,width:`100%`,height:`100%`};function Ti(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill=`black`),e}function Ei(e){return e.tag===`g`?e.children:[e]}rr([hn,ti,ni,ri,ii,yi,xi,Ci,{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-mask`),r=n?Yn(n.split(` `).map(function(e){return e.trim()})):Un();return r.prefix||=B(),e.mask=r,e.maskId=t.getAttribute(`data-fa-mask-id`),e}}},provides:function(e){e.generateAbstractMask=function(e){var t=e.children,n=e.attributes,r=e.main,i=e.mask,a=e.maskId,o=e.transform,s=r.width,c=r.icon,l=i.width,u=i.icon,d=ln({transform:o,containerWidth:l,iconWidth:s}),f={tag:`rect`,attributes:_(_({},wi),{},{fill:`white`})},p=c.children?{children:c.children.map(Ti)}:{},m={tag:`g`,attributes:_({},d.inner),children:[Ti(_({tag:c.tag,attributes:_(_({},c.attributes),d.path)},p))]},h={tag:`g`,attributes:_({},d.outer),children:[m]},g=`mask-${a||nn()}`,v=`clip-${a||nn()}`,y={tag:`mask`,attributes:_(_({},wi),{},{id:g,maskUnits:`userSpaceOnUse`,maskContentUnits:`userSpaceOnUse`}),children:[f,h]},b={tag:`defs`,children:[{tag:`clipPath`,attributes:{id:v},children:Ei(u)},y]};return t.push(b,{tag:`rect`,attributes:_({fill:`currentColor`,"clip-path":`url(#${v})`,mask:`url(#${g})`},wi)}),{children:t,attributes:n}}}},{provides:function(e){var t=!1;S.matchMedia&&(t=S.matchMedia(`(prefers-reduced-motion: reduce)`).matches),e.missingIconAbstract=function(){var e=[],n={fill:`currentColor`},r={attributeType:`XML`,repeatCount:`indefinite`,dur:`2s`};e.push({tag:`path`,attributes:_(_({},n),{},{d:`M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z`})});var i=_(_({},r),{},{attributeName:`opacity`}),a={tag:`circle`,attributes:_(_({},n),{},{cx:`256`,cy:`364`,r:`28`}),children:[]};return t||a.children.push({tag:`animate`,attributes:_(_({},r),{},{attributeName:`r`,values:`28;14;28;28;14;28;`})},{tag:`animate`,attributes:_(_({},i),{},{values:`1;0;1;1;0;1;`})}),e.push(a),e.push({tag:`path`,attributes:_(_({},n),{},{opacity:`1`,d:`M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z`}),children:t?[]:[{tag:`animate`,attributes:_(_({},i),{},{values:`1;0;0;0;0;1;`})}]}),t||e.push({tag:`path`,attributes:_(_({},n),{},{opacity:`0`,d:`M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z`}),children:[{tag:`animate`,attributes:_(_({},i),{},{values:`0;0;1;1;0;0;`})}]}),{tag:`g`,attributes:{class:`missing`},children:e}}}},{hooks:function(){return{parseNodeAttributes:function(e,t){var n=t.getAttribute(`data-fa-symbol`);return e.symbol=n===null?!1:n===``?!0:n,e}}}}],{mixoutsTo:G}),G.noAuto;var q=G.config;G.library,G.dom;var Di=G.parse;G.findIconDefinition,G.toHtml;var Oi=G.icon;G.layer,G.text,G.counter;var J=n();function ki(e){return e-=0,e===e}function Ai(e){return ki(e)?e:(e=e.replace(/[_-]+(.)?/g,(e,t)=>t?t.toUpperCase():``),e.charAt(0).toLowerCase()+e.slice(1))}var ji=(e,t)=>r.createElement(`stop`,{key:`${t}-${e.offset}`,offset:e.offset,stopColor:e.color,...e.opacity!==void 0&&{stopOpacity:e.opacity}});function Mi(e){return e.charAt(0).toUpperCase()+e.slice(1)}var Y=new Map,Ni=1e3;function Pi(e){if(Y.has(e))return Y.get(e);let t={},n=0,r=e.length;for(;n<r;){let i=e.indexOf(`;`,n),a=i===-1?r:i,o=e.slice(n,a).trim();if(o){let e=o.indexOf(`:`);if(e>0){let n=o.slice(0,e).trim(),r=o.slice(e+1).trim();if(n&&r){let e=Ai(n);t[e.startsWith(`webkit`)?Mi(e):e]=r}}}n=a+1}if(Y.size===Ni){let e=Y.keys().next().value;e&&Y.delete(e)}return Y.set(e,t),t}function Fi(e,t,n={}){if(typeof t==`string`)return t;let r=(t.children||[]).map(t=>{let r=t;return(`fill`in n||n.gradientFill)&&t.tag===`path`&&`fill`in t.attributes&&(r={...t,attributes:{...t.attributes,fill:void 0}}),Fi(e,r)}),i=t.attributes||{},a={};for(let[e,t]of Object.entries(i))switch(!0){case e===`class`:a.className=t;break;case e===`style`:a.style=Pi(String(t));break;case e.startsWith(`aria-`):case e.startsWith(`data-`):a[e.toLowerCase()]=t;break;default:a[Ai(e)]=t}let{style:o,role:s,"aria-label":c,gradientFill:l,...u}=n;if(o&&(a.style=a.style?{...a.style,...o}:o),s&&(a.role=s),c&&(a[`aria-label`]=c,a[`aria-hidden`]=`false`),l){a.fill=`url(#${l.id})`;let{type:t,stops:n=[],...i}=l;r.unshift(e(t===`linear`?`linearGradient`:`radialGradient`,{...i,id:l.id},n.map(ji)))}return e(t.tag,{...a,...u},...r)}var Ii=Fi.bind(null,r.createElement),Li=(e,t)=>{let n=(0,r.useId)();return e||(t?n:void 0)},Ri=class{constructor(e=`react-fontawesome`){this.enabled=!1;let t=!1;try{t=typeof process<`u`&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}};typeof process<`u`&&{}.FA_VERSION;var zi=`searchPseudoElementsFullScan`in q&&typeof q.searchPseudoElementsFullScan==`boolean`?`7.0.0`:`6.0.0`,Bi=Number.parseInt(zi)>=7,Vi=()=>Bi,X=`fa`,Z={beat:`fa-beat`,fade:`fa-fade`,beatFade:`fa-beat-fade`,bounce:`fa-bounce`,shake:`fa-shake`,spin:`fa-spin`,spinPulse:`fa-spin-pulse`,spinReverse:`fa-spin-reverse`,pulse:`fa-pulse`},Hi={left:`fa-pull-left`,right:`fa-pull-right`},Ui={90:`fa-rotate-90`,180:`fa-rotate-180`,270:`fa-rotate-270`},Wi={"2xs":`fa-2xs`,xs:`fa-xs`,sm:`fa-sm`,lg:`fa-lg`,xl:`fa-xl`,"2xl":`fa-2xl`,"1x":`fa-1x`,"2x":`fa-2x`,"3x":`fa-3x`,"4x":`fa-4x`,"5x":`fa-5x`,"6x":`fa-6x`,"7x":`fa-7x`,"8x":`fa-8x`,"9x":`fa-9x`,"10x":`fa-10x`},Q={border:`fa-border`,fixedWidth:`fa-fw`,flip:`fa-flip`,flipHorizontal:`fa-flip-horizontal`,flipVertical:`fa-flip-vertical`,inverse:`fa-inverse`,rotateBy:`fa-rotate-by`,swapOpacity:`fa-swap-opacity`,widthAuto:`fa-width-auto`},Gi={default:`fa-layers`};function Ki(e){let t=q.cssPrefix||q.familyPrefix||X;return t===X?e:e.replace(new RegExp(String.raw`(?<=^|\s)${X}-`,`g`),`${t}-`)}function qi(e){let{beat:t,fade:n,beatFade:r,bounce:i,shake:a,spin:o,spinPulse:s,spinReverse:c,pulse:l,fixedWidth:u,inverse:d,border:f,flip:p,size:m,rotation:h,pull:g,swapOpacity:_,rotateBy:v,widthAuto:y,className:b}=e,x=[];return b&&x.push(...b.split(` `)),t&&x.push(Z.beat),n&&x.push(Z.fade),r&&x.push(Z.beatFade),i&&x.push(Z.bounce),a&&x.push(Z.shake),o&&x.push(Z.spin),c&&x.push(Z.spinReverse),s&&x.push(Z.spinPulse),l&&x.push(Z.pulse),u&&x.push(Q.fixedWidth),d&&x.push(Q.inverse),f&&x.push(Q.border),p===!0&&x.push(Q.flip),(p===`horizontal`||p===`both`)&&x.push(Q.flipHorizontal),(p===`vertical`||p===`both`)&&x.push(Q.flipVertical),m!=null&&x.push(Wi[m]),h!=null&&h!==0&&x.push(Ui[h]),g!=null&&x.push(Hi[g]),_&&x.push(Q.swapOpacity),Vi()?(v&&x.push(Q.rotateBy),y&&x.push(Q.widthAuto),(q.cssPrefix||q.familyPrefix||X)===X?x:x.map(Ki)):x}var Ji=e=>typeof e==`object`&&`icon`in e&&!!e.icon;function Yi(e){if(e)return Ji(e)?e:Di.icon(e)}function Xi(e){return Object.keys(e)}var Zi=new Ri(`FontAwesomeIcon`),Qi={border:!1,className:``,mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:``,titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},$i=new Set(Object.keys(Qi)),ea=r.forwardRef((e,t)=>{let n={...Qi,...e},{icon:r,mask:i,symbol:a,title:o,titleId:s,maskId:c,transform:l}=n,u=Li(c,!!i),d=Li(s,!!o),f=Yi(r);if(!f)return Zi.error(`Icon lookup is undefined`,r),null;let p=qi(n),m=typeof l==`string`?Di.transform(l):l,h=Yi(i),g=Oi(f,{...p.length>0&&{classes:p},...m&&{transform:m},...h&&{mask:h},symbol:a,title:o,titleId:d,maskId:u});if(!g)return Zi.error(`Could not find icon`,f),null;let{abstract:_}=g,v={ref:t};for(let e of Xi(n))$i.has(e)||(v[e]=n[e]);return Ii(_[0],v)});ea.displayName=`FontAwesomeIcon`,`${Gi.default}${Q.fixedWidth}`;var ta={prefix:`fas`,iconName:`file-excel`,icon:[384,512,[],`f1c3`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM164 266.7c-7.4-11-22.3-14-33.3-6.7s-14 22.3-6.7 33.3L163.2 352 124 410.7c-7.4 11-4.4 25.9 6.7 33.3s25.9 4.4 33.3-6.7l28-42 28 42c7.4 11 22.3 14 33.3 6.7s14-22.3 6.7-33.3L220.8 352 260 293.3c7.4-11 4.4-25.9-6.7-33.3s-25.9-4.4-33.3 6.7l-28 42-28-42z`]},na={prefix:`fas`,iconName:`cloud-arrow-up`,icon:[576,512,[62338,`cloud-upload`,`cloud-upload-alt`],`f0ee`,`M144 480c-79.5 0-144-64.5-144-144 0-63.4 41-117.2 97.9-136.5-1.3-7.7-1.9-15.5-1.9-23.5 0-79.5 64.5-144 144-144 55.4 0 103.5 31.3 127.6 77.1 14.2-8.3 30.8-13.1 48.4-13.1 53 0 96 43 96 96 0 15.7-3.8 30.6-10.5 43.7 44 20.3 74.5 64.7 74.5 116.3 0 70.7-57.3 128-128 128l-304 0zM305 191c-9.4-9.4-24.6-9.4-33.9 0l-72 72c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l31-31 0 102.1c0 13.3 10.7 24 24 24s24-10.7 24-24l0-102.1 31 31c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-72-72z`]},ra={prefix:`fas`,iconName:`magnifying-glass`,icon:[512,512,[128269,`search`],`f002`,`M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z`]},ia={prefix:`fas`,iconName:`floppy-disk`,icon:[448,512,[128190,128426,`save`],`f0c7`,`M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-242.7c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32L64 32zm32 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-64zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z`]},aa={prefix:`fas`,iconName:`trash`,icon:[448,512,[],`f1f8`,`M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z`]},oa={prefix:`fas`,iconName:`folder-open`,icon:[576,512,[128194,128449,61717],`f07c`,`M56 225.6L32.4 296.2 32.4 96c0-35.3 28.7-64 64-64l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4l117.3 0c35.3 0 64 28.7 64 64l0 16-365.4 0c-41.3 0-78 26.4-91.1 65.6zM477.8 448L99 448c-32.8 0-55.9-32.1-45.5-63.2l48-144C108 221.2 126.4 208 147 208l378.8 0c32.8 0 55.9 32.1 45.5 63.2l-48 144c-6.5 19.6-24.9 32.8-45.5 32.8z`]},sa={prefix:`fas`,iconName:`chevron-right`,icon:[320,512,[9002],`f054`,`M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z`]},ca={prefix:`fas`,iconName:`database`,icon:[448,512,[],`f1c0`,`M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z`]},la={prefix:`fas`,iconName:`file-image`,icon:[384,512,[128443],`f1c5`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM92.6 448l198.8 0c15.8 0 28.6-12.8 28.6-28.6 0-7.3-2.8-14.4-7.9-19.7L215.3 297.9c-6-6.3-14.4-9.9-23.2-9.9l-.3 0c-8.8 0-17.1 3.6-23.2 9.9L71.9 399.7C66.8 405 64 412.1 64 419.4 64 435.2 76.8 448 92.6 448z`]},ua={prefix:`fas`,iconName:`folder`,icon:[512,512,[128193,128447,61716,`folder-blank`],`f07b`,`M64 448l384 0c35.3 0 64-28.7 64-64l0-240c0-35.3-28.7-64-64-64L298.7 80c-6.9 0-13.7-2.2-19.2-6.4L241.1 44.8C230 36.5 216.5 32 202.7 32L64 32C28.7 32 0 60.7 0 96L0 384c0 35.3 28.7 64 64 64z`]},da={prefix:`fas`,iconName:`circle-exclamation`,icon:[512,512,[`exclamation-circle`],`f06a`,`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`]},fa={prefix:`fas`,iconName:`link`,icon:[576,512,[128279,`chain`],`f0c1`,`M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z`]},pa={prefix:`fas`,iconName:`file`,icon:[384,512,[128196,128459,61462],`f15b`,`M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-277.5c0-17-6.7-33.3-18.7-45.3L258.7 18.7C246.7 6.7 230.5 0 213.5 0L64 0zM325.5 176L232 176c-13.3 0-24-10.7-24-24L208 58.5 325.5 176z`]},ma={prefix:`fas`,iconName:`server`,icon:[448,512,[],`f233`,`M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm216 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm216 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z`]},ha={prefix:`fas`,iconName:`pen`,icon:[512,512,[128394],`f304`,`M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z`]},ga={prefix:`fas`,iconName:`rotate-right`,icon:[512,512,[`redo-alt`,`rotate-forward`],`f2f9`,`M488 192l-144 0c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l46.7-46.7c-75.3-58.6-184.3-53.3-253.5 15.9-75 75-75 196.5 0 271.5s196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c94.3-94.3 243.7-99.6 344.3-16.2L471 7c6.9-6.9 17.2-8.9 26.2-5.2S512 14.3 512 24l0 144c0 13.3-10.7 24-24 24z`]},_a={prefix:`fas`,iconName:`chevron-left`,icon:[320,512,[9001],`f053`,`M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z`]},va={prefix:`fas`,iconName:`triangle-exclamation`,icon:[512,512,[9888,`exclamation-triangle`,`warning`],`f071`,`M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`]},ya={prefix:`fas`,iconName:`folder-plus`,icon:[512,512,[],`f65e`,`M512 384c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l138.7 0c13.8 0 27.3 4.5 38.4 12.8l38.4 28.8c5.5 4.2 12.3 6.4 19.2 6.4L448 80c35.3 0 64 28.7 64 64l0 240zM256 160c-13.3 0-24 10.7-24 24l0 48-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0 0 48c0 13.3 10.7 24 24 24s24-10.7 24-24l0-48 48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-48c0-13.3-10.7-24-24-24z`]},ba={prefix:`fas`,iconName:`file-pdf`,icon:[576,512,[],`f1c1`,`M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l80 0 0-112c0-35.3 28.7-64 64-64l176 0 0-165.5c0-17-6.7-33.3-18.7-45.3L290.7 18.7C278.7 6.7 262.5 0 245.5 0L96 0zM357.5 176L264 176c-13.3 0-24-10.7-24-24L240 58.5 357.5 176zM240 380c-11 0-20 9-20 20l0 128c0 11 9 20 20 20s20-9 20-20l0-28 12 0c33.1 0 60-26.9 60-60s-26.9-60-60-60l-32 0zm32 80l-12 0 0-40 12 0c11 0 20 9 20 20s-9 20-20 20zm96-80c-11 0-20 9-20 20l0 128c0 11 9 20 20 20l32 0c28.7 0 52-23.3 52-52l0-64c0-28.7-23.3-52-52-52l-32 0zm20 128l0-88 12 0c6.6 0 12 5.4 12 12l0 64c0 6.6-5.4 12-12 12l-12 0zm88-108l0 128c0 11 9 20 20 20s20-9 20-20l0-44 28 0c11 0 20-9 20-20s-9-20-20-20l-28 0 0-24 28 0c11 0 20-9 20-20s-9-20-20-20l-48 0c-11 0-20 9-20 20z`]},xa={prefix:`fas`,iconName:`copy`,icon:[448,512,[],`f0c5`,`M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z`]},Sa={prefix:`fas`,iconName:`file-word`,icon:[384,512,[],`f1c2`,`M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM135.4 274.8c-2.9-12.9-15.7-21.1-28.6-18.2s-21.1 15.7-18.2 28.6l32 144c2.3 10.5 11.4 18.2 22.2 18.8s20.6-6.1 24-16.4l25.2-75.7 25.2 75.7c3.4 10.2 13.2 16.9 24 16.4s19.9-8.2 22.2-18.8l32-144c2.9-12.9-5.3-25.8-18.2-28.6s-25.8 5.3-28.6 18.2l-13.2 59.4-20.6-61.8c-3.3-9.8-12.4-16.4-22.8-16.4s-19.5 6.6-22.8 16.4l-20.6 61.8-13.2-59.4z`]},Ca={prefix:`fas`,iconName:`arrow-up-right-from-square`,icon:[512,512,[`external-link`],`f08e`,`M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z`]},wa={prefix:`fas`,iconName:`box-archive`,icon:[512,512,[`archive`],`f187`,`M0 64C0 46.3 14.3 32 32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64zM32 176l448 0 0 240c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-240zm152 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z`]},$={backdrop:`_backdrop_9uim2_1`,dialog:`_dialog_9uim2_12`,header:`_header_9uim2_22`,icon:`_icon_9uim2_30`,titleBlock:`_titleBlock_9uim2_46`,body:`_body_9uim2_58`,target:`_target_9uim2_62`,warning:`_warning_9uim2_71`,actions:`_actions_9uim2_78`,cancel:`_cancel_9uim2_95`,confirm:`_confirm_9uim2_100`};function Ta({isOpen:e,title:t,message:n,targetLabel:r,warning:i,confirmLabel:a=`Confirmar`,cancelLabel:o=`Cancelar`,variant:s=`default`,isLoading:c=!1,onConfirm:l,onCancel:u}){return e?(0,J.jsx)(`div`,{className:$.backdrop,role:`alertdialog`,"aria-modal":`true`,"aria-labelledby":`confirm-dialog-title`,"aria-describedby":`confirm-dialog-message`,children:(0,J.jsxs)(`div`,{className:$.dialog,children:[(0,J.jsxs)(`header`,{className:$.header,children:[(0,J.jsx)(`span`,{className:$.icon,"data-variant":s,"aria-hidden":`true`,children:(0,J.jsx)(ea,{icon:va})}),(0,J.jsxs)(`div`,{className:$.titleBlock,children:[(0,J.jsx)(`h2`,{id:`confirm-dialog-title`,children:t}),(0,J.jsx)(`p`,{id:`confirm-dialog-message`,children:n})]})]}),r||i?(0,J.jsxs)(`div`,{className:$.body,children:[r?(0,J.jsx)(`div`,{className:$.target,children:r}):null,i?(0,J.jsx)(`p`,{className:$.warning,children:i}):null]}):null,(0,J.jsxs)(`div`,{className:$.actions,children:[(0,J.jsx)(`button`,{type:`button`,className:$.cancel,onClick:u,disabled:c,children:o}),(0,J.jsx)(`button`,{type:`button`,className:$.confirm,"data-variant":s,onClick:l,disabled:c,children:c?`Procesando...`:a})]})]})}):null}var Ea=void 0,Da=void 0,Oa=10*1024*1024,ka=25*1024*1024;function Aa(){throw Error(`Falta configurar VITE_CLOUDINARY_CLOUD_NAME.`)}function ja(e){if(!e)throw Error(`No se envió ningún archivo.`);if(e.size>ka)throw Error(`El archivo excede el límite de 25 MB.`)}function Ma(e){if(!e)throw Error(`No se envió ningún archivo.`);if(!String(e.type||``).startsWith(`image/`))throw Error(`El archivo debe ser una imagen válida.`);if(e.size>Oa)throw Error(`La imagen excede el límite de 10 MB.`)}function Na(e){return(e||``).trim()||void 0}async function Pa(e,{folder:t}={}){Aa(),Ma(e);let n=new FormData;n.append(`file`,e),n.append(`upload_preset`,Da);let r=Na(t);r&&n.append(`folder`,r);let i=`https://api.cloudinary.com/v1_1/${Ea}/image/upload`,a;try{a=await fetch(i,{method:`POST`,body:n})}catch{throw Error(`No se pudo subir la imagen a Cloudinary por un problema de red.`)}let o=null;try{o=await a.json()}catch{o=null}if(!a.ok){let e=o?.error?.message||`Revisa el upload preset y la configuración de Cloudinary.`;throw Error(`Cloudinary rechazó la subida. ${e}`)}if(!o?.secure_url)throw Error(`Cloudinary no devolvió una URL usable para la imagen.`);return{url:String(o.secure_url),publicId:String(o.public_id??``),width:typeof o.width==`number`?o.width:void 0,height:typeof o.height==`number`?o.height:void 0,format:typeof o.format==`string`?o.format:void 0,bytes:typeof o.bytes==`number`?o.bytes:void 0,resourceType:typeof o.resource_type==`string`?o.resource_type:void 0,originalFilename:typeof o.original_filename==`string`?o.original_filename:void 0}}async function Fa(e,{folder:t}={}){Aa(),ja(e);let n=new FormData;n.append(`file`,e),n.append(`upload_preset`,Da);let r=Na(t);r&&n.append(`folder`,r);let i=`https://api.cloudinary.com/v1_1/${Ea}/auto/upload`,a;try{a=await fetch(i,{method:`POST`,body:n})}catch{throw Error(`No se pudo subir el archivo por un problema de red.`)}let o=null;try{o=await a.json()}catch{o=null}if(!a.ok){let e=o?.error?.message||`Revisa el upload preset y la configuración de Cloudinary.`;throw Error(`Cloudinary rechazó la subida. ${e}`)}if(!o?.secure_url)throw Error(`Cloudinary no devolvió una URL usable para el archivo.`);return{url:String(o.secure_url),publicId:String(o.public_id??``),width:typeof o.width==`number`?o.width:void 0,height:typeof o.height==`number`?o.height:void 0,format:typeof o.format==`string`?o.format:void 0,bytes:typeof o.bytes==`number`?o.bytes:void 0,resourceType:typeof o.resource_type==`string`?o.resource_type:void 0,originalFilename:typeof o.original_filename==`string`?o.original_filename:void 0}}export{ha as C,ea as D,aa as E,ra as S,ma as T,ia as _,wa as a,ya as b,da as c,ca as d,pa as f,Sa as g,ba as h,Ca as i,na as l,la as m,Pa as n,_a as o,ta as p,Ta as r,sa as s,Fa as t,xa as u,ua as v,ga as w,fa as x,oa as y};