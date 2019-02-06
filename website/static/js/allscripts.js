(function(){var k={Z:{"\u00e7":"c","\u00c7":"C","\u011f":"g","\u011e":"G","\u0131":"i","\u0130":"I","\u00f6":"o","\u00d6":"O","\u015f":"s","\u015e":"S","\u00fc":"u","\u00dc":"U"},F:"\u00e7",N:"\u00c7",H:"\u011f",P:"\u011e",J:"\u0131",R:"\u0130",K:"\u00f6",T:"\u00d6",L:"\u015f",V:"\u015e",M:"\u00fc",W:"\u00dc"};var n={};
(function(q){var p={b:function(a,b,c){if(!a||b>=c)return null;for(var e=[],d=Array(a.length),g=0;g<a.length;g++){var h=a.charAt(g),m=k.Z[h];g>=b&&g<=c&&m?(d[g]=m,e.push(g)):d[g]=h}return{text:d.join(""),changedPositions:e}},l:function(a){return a?p.b(a,0,a.length-1):null}},d={Y:function(a,b){this.start=a;this.end=b},A:function(a){this.j=a}};d.A.prototype={fa:function(a){for(var b=0;b<this.j.length;b++)if(a>=this.j[b].start&&a<=this.j[b].end)return!0;return!1}};var r=/\b((((https?|ftp|file):\/\/)|(www\.))[^\s]+)/gi;d.X=
{ea:function(a,b){var c=[];a&&a.skipURLs&&c.push(r);a=[];for(var e=0;e<c.length;e++)for(var f=c[e],g;null!=(g=f.exec(b));)a.push(new d.Y(g.index,f.lastIndex));return new d.A(a)}};d.D=!1;var m={aa:{skipURLs:!0},get:function(a,b){return a&&a.hasOwnProperty(b)?a[b]:m.aa[b]},da:function(a,b){for(var c={},e=0;e<b.length;e++)c[b[e]]=m.get(a,b[e]);return c}},l={c:k.F,C:k.N,g:k.H,G:k.P,i:k.J,I:k.R,o:k.K,O:k.T,s:k.L,S:k.V,u:k.M,U:k.W};d.ha=function(a,b,c,e){if(!d.D)throw Error("Pattern list not loaded");if(!a)return null;
0>b&&(b=0);c>a.length&&(c=a.length);for(var f=[];b<c;b++)e&&e.fa(b)||!d.la(a,b)||(a=d.ma(a,b),f.push(b));return{text:a,changedPositions:f,skippedRegions:e}};d.ma=function(a,b){var c=d.na[a.charAt(b)];return c?a.substring(0,b)+c+a.substring(b+1):a};d.la=function(a,b){var c=a.charAt(b),e=d.ga[c];e||(e=c);var f=d.f[e.toLowerCase()];a=f&&d.ka(a,b,f);return"I"==e?c==e?!a:a:c==e?a:!a};d.ka=function(a,b,c){var e=2*c.length;a=d.ja(a,b);b=0;for(var f=a.length;10>=b;){for(var g=11;g<=f;){var h=c[a.substring(b,
g)];h&&Math.abs(h)<Math.abs(e)&&(e=h);g++}b++}return 0<e};d.ja=function(a,b){for(var c="",e=!1,f=0;21>f;f++)c+=" ";c=c.substring(0,10)+"X"+c.substring(11);f=11;for(var g=b+1;f<c.length&&!e&&g<a.length;){var h=a.charAt(g);(h=d.ia[h])?(c=c.substring(0,f)+h+c.substring(f+1),f++,e=!1):e||(f++,e=!0);g++}c=c.substring(0,f);g=b;f=9;e=!1;for(g--;0<=f&&0<=g;)h=a.charAt(g),(h=d.oa[h])?(c=c.substring(0,f)+h+c.substring(f+1),f--,e=!1):e||(f--,e=!0),g--;return c};d.$=function(a,b){return(b=m.da(b,["skipURLs"]))?
d.X.ea(b,a):null};d.pa=function(a,b){if(!a)return null;var c=a.length-1;return d.a(a," "==a.charAt(c)?a.lastIndexOf(" ",c-2):a.lastIndexOf(" ",c-1),c,b)};d.v=function(a){if(!a)throw Error("Pattern list can't be null");var b={},c;for(c in l)b[l[c]]=c;d.ga=b;b={};for(c="a";"z">=c;)b[c]=c,b[c.toUpperCase()]=c,c=String.fromCharCode(c.charCodeAt(0)+1);for(var e in l)b[l[e]]=e.toLowerCase();d.ia=b;e={};for(b="a";"z">=b;)e[b]=b,e[b.toUpperCase()]=b,b=String.fromCharCode(b.charCodeAt(0)+1);for(var f in l)e[l[f]]=
f.toUpperCase();e.i="i";e.I="I";e["\u0130"]="i";e["\u0131"]="I";d.oa=e;f={};for(var g in l)f[g]=l[g],f[l[g]]=g;d.na=f;d.f={};for(var h in a){d.f[h]={};g=a[h].split("|");for(f=0;f<g.length;f++)e=g[f],b=f+1,"-"==e.charAt(0)&&(b=-b,e=e.substring(1)),d.f[h][e]=b;d.f[h].length=g.length}d.D=!0};d.a=function(a,b,c,e){return a?d.ha(a,b,c,d.$(a,e)):null};d.m=function(a,b){return a?d.a(a,0,a.length-1,b):null};q.w={l:p.l,b:p.b};q.h={v:d.v,m:d.m,a:d.a}})(n);/*


 Turkish text deasciifier and asciifier JavaScript library.
  Deasciifier code directly converted by Mustafa Emre Acer from
  Dr. Deniz Yuret's Emacs Turkish Extension: http://www.denizyuret.com/turkish
*/
window.Asciifier={asciify:n.w.l,asciifyRange:n.w.b};window.Deasciifier={init:n.h.v,deasciify:n.h.m,deasciifyRange:n.h.a};var t={};
(function(q){function p(d,l){if(!d)return d;for(var a=Array(d.length),b=0;b<d.length;b++){var c=d.charAt(b);a[b]=l[c]||c}return{text:a.join("")}}var d={"\u00e7":"&#231;","\u00c7":"&#199;","\u011f":"&#287;","\u011e":"&#286;","\u0131":"&#305;","\u0130":"&#304;","\u00f6":"&#246;","\u00d6":"&#214;","\u015f":"&#351;","\u015e":"&#350;","\u00fc":"&#252;","\u00dc":"&#220;"},r={"\u00e7":"\\u00E7","\u00c7":"\\u00C7","\u011f":"\\u011F","\u011e":"\\u011E","\u0131":"\\u0131","\u0130":"\\u0130","\u00f6":"\\u00F6","\u00d6":"\\u00D6",
"\u015f":"\\u015F","\u015e":"\\u015E","\u00fc":"\\u00FC","\u00dc":"\\u00DC"};q.B={ba:function(m){return p(m,d)},ca:function(d){return p(d,r)}}})(t);window.TurkishEncoder={encodeJS:t.B.ca,encodeHTML:t.B.ba};})();
(function(){var m="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},u="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function v(){v=function(){};u.Symbol||(u.Symbol=z)}var z=function(){var a=0;return function(b){return"jscomp_symbol_"+(b||"")+a++}}();
function C(){v();var a=u.Symbol.iterator;a||(a=u.Symbol.iterator=u.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&m(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return D(this)}});C=function(){}}function D(a){var b=0;return E(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function E(a){C();a={next:a};a[u.Symbol.iterator]=function(){return this};return a}
function F(a,b){C();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};d[Symbol.iterator]=function(){return d};return d}for(var G=u,J=["Array","prototype","keys"],K=0;K<J.length-1;K++){var L=J[K];L in G||(G[L]={});G=G[L]}var M=J[J.length-1],N=G[M],O=N?N:function(){return F(this,function(a){return a})};O!=N&&null!=O&&m(G,M,{configurable:!0,writable:!0,value:O});
window.MEA={};var R=window.MEA;function S(a,b){this.a=b;this.options=a}S.prototype={set:function(a,b){this.options[a]=b},get:function(a,b){var c=this.options[a];"undefined"==typeof c&&(c=b);"undefined"==typeof c&&this.a&&(c=this.a[a]);return c}};
function T(){this.a="tr";this.b={confirmFullTextDeasciify:{en:"Are you sure you want to convert entire text?",tr:"T\u00fcm metni \u00e7evirmek istedi\u011finizden emin misiniz?"},confirmApplyCorrectionToAll:{en:"Do you want to apply this correction to the entire text?",tr:"Bu de\u011fi\u015fikli\u011fi t\u00fcm metin \u00fczerinde uygulamak istiyor musunuz?"}}}T.prototype={};function U(a,b){b=a.b[b];var c="";b&&b[a.a]&&(c=b[a.a]);return c};(function(){jQuery.fn.Ha=jQuery.fn.css;jQuery.fn.css=function(){if(arguments.length)return jQuery.fn.Ha.apply(this,arguments);for(var a="font-family font-size font-weight font-style color text-transform text-decoration letter-spacing word-spacing line-height text-align vertical-align direction background-color background-image background-repeat background-position background-attachment opacity width height top right bottom left margin-top margin-right margin-bottom margin-left padding-top padding-right padding-bottom padding-left border-top-width border-right-width border-bottom-width border-left-width border-top-color border-right-color border-bottom-color border-left-color border-top-style border-right-style border-bottom-style border-left-style position display visibility z-index overflow-x overflow-y white-space clip float clear cursor list-style-image list-style-position list-style-type marker-offset".split(" "),
b=a.length,d={},c=0;c<b;c++)d[a[c]]=jQuery.fn.Ha.call(this,a[c]);return d};var a=null,b=null,c=null,d=!1;R.CSS={getComputedStyle:function(a,b,d){var e=d?"":0;a=document.defaultView&&document.defaultView.getComputedStyle(a,"");if(!a)return e;if(!b){d={};for(var c=0;c<a.length;c++)b=a[c],e=a.getPropertyValue(b),d[b]=e;return d}e=a.getPropertyValue(b);return e=d?e:parseInt(e,10)},kb:function(a){return"offsetHeight"in a?a.offsetHeight:this.getComputedStyle(a,"height")},Ia:function(a){return"offsetWidth"in
a?a.offsetWidth:this.getComputedStyle(a,"width")},ya:function(a,b){$(a).width(b)},xa:function(a,b){$(a).height(b)},ta:function(a){return this.va(a)+(a.offsetParent?this.ta(a.offsetParent):0)},ja:function(a){return this.ua(a)+(a.offsetParent?this.ja(a.offsetParent):0)},va:function(a){return a.offsetTop},ua:function(a){return a.offsetLeft},bc:function(a){return this.ja(a)},Zb:function(a){return this.getComputedStyle(a,"color",!0)},ca:function(a){return{top:this.ta(a),left:this.ja(a),Qa:this.va(a),Pa:this.ua(a),
width:this.Ia(a),height:this.kb(a)}},ac:function(a){return{top:this.ta(a),left:this.ja(a),Qa:this.va(a),Pa:this.ua(a),width:this.ob(a),height:this.nb(a)}},cb:function(a){for(var b=0;b<a.length;b++)this.f(a[b][0],a[b][1].join(""))},m:function(a,b){a.className=b;a.setAttribute("class",b)},addClass:function(a,b){a.className+=" "+b},w:function(a,b){for(var d in b)a.style[d]=b[d]},qb:function(a){return this.getComputedStyle(a)},Vb:function(a,b){a=this.qb(b);for(var d in a);},qa:function(a,b,d){b=jQuery(b).css();
for(var c=0;c<d.length;c++){var e=d[c];if(e){var f="*"==e[e.length-1];f&&(e=e.substring(0,e.length-1));for(var g in b)if(g==e||f&&0==g.indexOf(e))if(jQuery(a).css(g,b[g]),!f)break}}},dc:function(a,b){var d=this.getComputedStyle(a,"border-left-width"),c=this.getComputedStyle(a,"border-right-width");this.w(a,{width:b-(d+c)+"px"})},cc:function(a,b){var d=this.getComputedStyle(a,"border-left-width"),c=this.getComputedStyle(a,"border-right-width");this.w(a,{height:b-(d+c)+"px"})},ob:function(a){return jQuery(a).outerWidth()},
nb:function(a){return jQuery(a).outerHeight()},Yb:function(a){var b=this.getComputedStyle(a,"border-left-width");a=this.getComputedStyle(a,"border-right-width");return b+a},Xb:function(a){var b=this.getComputedStyle(a,"border-top-width");a=this.getComputedStyle(a,"border-bottom-width");return b+a},f:function(d,f){d=d+" { "+f+" }";try{b&&b.insertRule?b.insertRule(d,b.cssRules.length):a.styleSheet?(c.data+=d+"\n",a.styleSheet.cssText=c.nodeValue):a.innerHTML+=d+"\n"}catch(g){console.log(g)}},init:function(){if(!d){a=
document.createElement("style");var e=document.getElementsByTagName("head")[0];e?e.appendChild(a):document.body.appendChild(a);b=a.sheet;c=null;b||(c=document.createTextNode(""));d=!0}}};R.CSS.init()})();R.ma={Kb:{Jb:13,Hb:17,Tb:32,Ub:38,Ib:40},Xa:{Lb:1,Za:2},M:function(a,b,c,d){var e="on"+b.toLowerCase();a.addEventListener?a.addEventListener(b,c,d):a.attachEvent(e,c,d)},Fb:function(a,b,c){var d="on"+b.toLowerCase();a.addEventListener?a.removeEventListener(b,c):a.detachEvent(d,c)},sa:function(a){return a||window.event},Wb:function(a){a=this.sa(a);a.returnValue=!1;a.stopPropagation&&a.stopPropagation();a.preventDefault&&a.preventDefault();return!1},lb:function(a){a=this.sa(a);return a.which?a.which:
a.keyCode},Z:function(a){a=this.sa(a);var b=null;a.target?b=a.target:a.srcElement&&(b=a.srcElement);3==b.nodeType&&(b=b.parentNode);return b}};(function(){function a(a,c,d,e){this.start=a;this.end=c;this.ia=d;this.ba=e}R.Ca={P:function(b){var c;if(document.selection){var d=c=0,e,f=document.selection.createRange(),g=f.parentElement();if(f&&g==b)if(d=b.value.length,g=b.createTextRange(),g.moveToBookmark(f.getBookmark()),f=b.createTextRange(),f.collapse(!1),-1<g.compareEndPoints("StartToEnd",f)){c=d;var h=e=0}else{c=-g.moveStart("character",-d);b=b.value.replace(/\r\n/g,"\n");var q=b.length!=d;q?(e=b.slice(0,c).split("\n").length-1,c+=e):e=
0;-1<g.compareEndPoints("EndToEnd",f)||(d=-g.moveEnd("character",-d),q?(h=b.slice(0,d).split("\n").length-1,d+=h):h=0)}c=new a(c,d,c-e,d-h,!0)}else c=new a(b.selectionStart,b.selectionEnd,b.selectionStart,b.selectionEnd,!1);return c},ha:function(a,c){document.selection?(a=a.createTextRange(),a.collapse(!0),a.moveStart("character",c.ia),a.moveEnd("character",c.ba-c.ia),a.select()):(a.selectionStart=c.start,a.selectionEnd=c.end)},Bb:function(a,c){var b=this.P(a),e=b.end-b.start;a.value=a.value.substring(0,
b.start)+c+a.value.substring(b.end);c=c.length-e;0==e?(b.start+=c,b.end+=c,b.ia+=c):b.end+=c;b.ba+=c;this.ha(a,b)},fb:function(a){var b=this.P(a);0==b.end-b.start?(a.value=a.value.substring(0,b.start-1)+a.value.substring(b.end),b.start--,b.end--,b.ia--,b.ba--):(a.value=a.value.substring(0,b.start)+a.value.substring(b.end),b.end=b.start,b.ba=b.end);this.ha(a,b)}}})();"undefined"==typeof R&&(R={});
R.Ba={xb:function(a){return 32==a||13==a||188==a||190==a||191==a||189==a||50==a||186==a||56==a||57==a||48==a},fa:function(a){return" "==a||"\n"==a||"\r"==a||"."==a||","==a||";"==a||"?"==a||"!"==a||"("==a||")"==a||"<"==a||">"==a||"["==a||"]"==a||"{"==a||"}"==a||"/"==a||"\\"==a||"+"==a||"-"==a||"*"==a||"&"==a||"@"==a||":"==a||"'"==a||'"'==a||"|"==a||"~"==a||"#"==a||"%"==a||"^"==a||"="==a||"+"==a},Ma:function(a){return" "==a||"\n"==a||"\r"==a||"\t"==a},pb:function(a,b){for(;0<=b;b--)if(this.Ma(a.charAt(b)))return b;
return-1},mb:function(a,b){for(;b<a.length;b++)if(this.Ma(a.charAt(b)))return b;return-1},hb:function(a,b){for(;0<=b;b--)if(this.fa(a.charAt(b)))return b;return-1},gb:function(a,b){for(;b<a.length;b++)if(this.fa(a.charAt(b)))return b;return a.length},vb:function(a,b){return 0>=b||b>=a.length?!1:0==this.fa(a.charAt(b-1))&&0==this.fa(a.charAt(b))},Ja:function(a,b){b=this.gb(a,b);var c=0;0<b&&(c=this.hb(a,b-1));return{start:c+1,end:b}},rb:function(a,b){for(b>=a.length&&(b=a.length-1);0<=b&&this.fa(a.charAt(b));)b--;
return this.Ja(a,b)},Cb:function(a,b,c,d){return a.substring(0,b)+d+a.substring(c)},ib:function(a,b){for(var c=[],d=0;d<a.length&&d<b.length;d++)a.charAt(d)!=b.charAt(d)&&c.push(d);return c}};(function(a,b){function c(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function d(a,b){return a.start-b.start}var e=["color:white;","z-index:9;","overflow-x: hidden;","overflow-y: hidden;","background: transparent"],f=["position:absolute;","left:0;top:0;","right:0;bottom:0;"],g="box-sizing: border-box;,-moz-box-sizing: border-box;,white-space: pre-wrap;,word-wrap: break-word;,word-spacing:0;,letter-spacing:0;".split(",");a.cb([[".mea-texthl-wrap","z-index: 5;,position:absolute;,display:inline-block;,padding:0;,box-sizing: border-box;,-moz-box-sizing: border-box;".split(",")],
[".mea-texthl-mirror",[f.join(";")+";"+g.join(";")+";"+e.join(";")]],[".mea-texthl-cursor-layer",[f.join(";")+";"+g.join(";")+";"+e.join(";")]],[".mea-texthl-text",[g.join(";")+";z-index: 20;;overflow-x: hidden;;overflow-y: hidden;;background: transparent;;color:black;;position:relative;"]],[".mea-texthl-hl-span",[g.join(";")+";background: #A4FE2A;;opacity:1.0;;color:lightgreen;;padding:0; margin:0;;display:inline;"]],[".mea-texthl-hl-word",[g.join(";")+";background-color:yellow; display:inline; word-wrap:none;"]]]);
var h={da:function(a,b){a=new h.J(a);a.aa(b);a.update();return a},Ya:function(a,b){this.start=a;this.end=b},Ka:function(a,b,d){this.start=a;this.end=b;this.text=d;this.a=[];this.j=null}};h.Ka.prototype={addRange:function(a){this.a.push(a)}};h.J=function(a){this.a=a;this.B=[];this.D=-1;this.h=this.l=this.V=this.b=null;this.T={};this.X=[]};h.J.prototype={za:function(){var b=a.ca(this.a);if(b.width!=this.W.width||b.height!=this.W.height)this.W=b,this.b.style.top=b.Qa+"px",this.b.style.left=b.Pa+"px",
a.ya(this.b,b.width),a.xa(this.b,b.height),a.ya(this.h,b.width),a.xa(this.h,b.height),a.ya(this.l,b.width),a.xa(this.l,b.height)},aa:function(b){this.L=this.a.style.zIndex=20;this.options=b;this.b=document.createElement("div");a.m(this.b,"mea-texthl-wrap");a.w(this.b,{zIndex:this.L});this.options.get("resizeable",!0)&&a.w(this.a,{resize:"both"});a.qa(this.b,this.a,["background*"]);a.m(this.a,"mea-texthl-text");a.w(this.a,{background:"transparent"});this.V=document.createElement("div");a.w(this.V,
{position:"absolute",zIndex:999});this.l=document.createElement("div");a.m(this.l,"mea-texthl-mirror");a.w(this.l,{zIndex:this.L-1});this.h=document.createElement("div");a.m(this.h,"mea-texthl-cursor-layer");a.w(this.h,{visibility:"hidden",zIndex:this.L-2});b="border-left-color border-left-width border-left-style border-right-color border-right-width border-right-style border-top-color border-top-width border-top-style border-bottom-color border-bottom-width border-bottom-style padding-left padding-top padding-right padding-bottom font-family font-size font-style font-weight text-align text-decoration text-transform line-height direction vertical-align".split(" ");
a.qa(this.h,this.a,b);a.qa(this.l,this.a,b);b={"border-left-color":"white","border-right-color":"white","border-top-color":"white","border-bottom-color":"white"};a.w(this.h,b);a.w(this.l,b);this.b.appendChild(this.l);this.b.appendChild(this.h);this.a.parentNode.insertBefore(this.V,this.a);this.a.parentNode.insertBefore(this.b,this.a);this.W={};this.update()},Va:function(a){return this.T[a]},Ua:function(a,b){b=new h.Ka(a,b,this.a.value.substring(a,b));this.X.push(b);return this.T[a]=b},update:function(){this.B=
this.B.sort(d);for(var a=this.a.value,b=this.options.hiliteStyles||"",e=0,f=[],g=0;g<this.B.length;g++){var h=this.B[g];f.push(c(a.substring(e,h.start)));e=c(a.substring(h.start,h.end));f.push("<span class='mea-texthl-hl-span' style='"+b+"'>"+e+"</span>");e=h.end}0<e&&f.push(c(a.substring(e)));this.l.innerHTML=f.join("").replace(/((\r\n)|\n)/g,"<br/>");this.za()},jb:function(b,d){var e=this.a.value,f=e.substring(b,d);d=e.substring(d);b=c(e.substring(0,b))+"<span id='mea-texthilite-cursor-span' style='display:inline'>"+
c(f)+"</span>"+c(d);this.h.innerHTML=b.replace(/((\r\n)|\n)/g,"<br/>");return a.ca(document.getElementById("mea-texthilite-cursor-span"))},clear:function(){this.B=[];this.D=-1;this.X=[];this.T={}},tb:function(a,d){if(!(a>=d)){var c=new h.Ya(a,d);this.B.push(c);if(-1==this.D||d>this.D)this.D=d;d=b.pb(this.a.value,a);var e=this.Va(d+1);e?e.addRange(c):this.Ua(d+1,b.mb(this.a.value,a)).addRange(c)}},Ga:function(a){a<this.D&&(this.clear(),this.update())}};R.$a=h})(R.CSS,R.Ba);(function(a,b){a.f(".deasc-suggest-menu","position:absolute; display:none; line-height: 24px; width:auto;background: transparent;border: 0;-webkit-user-select: none; -moz-user-select: none; padding: 0; margin: 0;word-wrap:none;float:left;vertical-align:top;cursor:default;z-index:998;box-sizing: border-box;-moz-box-sizing: border-box;white-space: nowrap;outline: none; ");a.f(".deasc-suggest-menu-btn-container","display:inline-block; float:left; margin-top:2px; margin-left:3px");a.f(".deasc-suggest-menu-btn",
"background: transparent url(static/img/v2.0/button-sprite.png) 0 0;padding:0; margin:0;margin-left:2px;text-align:center; line-height:15px;vertical-align:middle;width:20px; height:20px; font-family: Tahoma; display:inline-block;border:0;cursor: pointer;font-size:0");a.f(".deasc-suggest-menu-btn-close","background-position:0 0px;");a.f(".deasc-suggest-menu-btn-close:hover","background-position:0 -20px;");a.f(".deasc-suggest-menu-btn-apply","background-position:-20px 0px;");a.f(".deasc-suggest-menu-btn-apply:hover",
"background-position:-20px -20px;");a.f(".deasc-suggest-menu-container","position:relative; display:inline-block; line-height: 24px; color:#666; cursor: default; -webkit-box-shadow: rgb(153, 153, 153) 0px 2px 5px 0px; -moz-box-shadow: 0px 2px 5px #999999; box-shadow: 0px 2px 5px #999; height: 24px; background: transparent;border-top: 1px solid #a1a1a1; -webkit-user-select: none; -moz-user-select: none; padding: 0; margin: 0;word-wrap:none;white-space:nowrap;float:left;vertical-align:top;cursor:default;outline: none; ");
a.f(".deasc-suggest-item","float:left; background: #ECE9D8; width:16px; text-align:center; text-decoration:none;margin:0; padding:0;vertical-align:top");a.f(".deasc-suggest-item-static","border-bottom: 1px solid #AEAEAE; ");a.f(".deasc-suggest-item-static-first","border-left  : 1px solid #aaa");a.f(".deasc-suggest-item-static-last","border-right : 1px solid #aaa");a.f(".deasc-suggest-item-dynamic","cursor:pointer;");a.f(".deasc-suggest-item-dynamic-subitem","border-bottom:1px solid #aaa; clear:both; display:block; box-shadow: 0px 3px 5px #999;");
a.f(".deasc-suggest-item-dynamic-subitem:hover","background: #3875C9; color:#f8f8f8;");a.f(".deasc-suggest-item-dynamic-subitem-first","border-left:1px solid #aaa");a.f(".deasc-suggest-item-dynamic-subitem-last","padding-left:1px;border-right:1px solid #aaa");a.f(".deasc-suggest-item-dynamic-subitem-bottom","border-left:1px solid #aaa; border-right:1px solid #aaa");a.f(".deasc-suggest-item-dynamic-subitem-changed","background: lightgreen;");a.f(".deasc-suggest-item-dynamic-subitem-selected","background: lightgreen; ");
var c={c:["c","\u00e7"],g:["g","\u011f"],i:["i","\u0131"],o:["o","\u00f6"],s:["s","\u015f"],u:["u","\u00fc"],C:["C","\u00c7"],G:["G","\u011e"],I:["I","\u0130"],O:["O","\u00d6"],S:["S","\u015e"],U:["U","\u00dc"],"\u00e7":["c","\u00e7"],"\u011f":["g","\u011f"],"\u0131":["i","\u0131"],"\u00f6":["o","\u00f6"],"\u015f":["s","\u015f"],"\u00fc":["u","\u00fc"],"\u00c7":["C","\u00c7"],"\u011e":["G","\u011e"],"\u0130":["I","\u0130"],"\u00d6":["O","\u00d6"],"\u015e":["S","\u015e"],"\u00dc":["U","\u00dc"]};R.Y=
{sb:function(a){for(var b=[],d=0;d<a.length;d++)c[a.charAt(d)]&&b.push({position:d,values:c[a.charAt(d)]});return 0<b.length},create:function(a,b,c){a=new this.J(a,b,c);a.init();return a}};R.Y.Aa=function(a,b){this.text=a;this.pa=b};R.Y.J=function(a,b,c){this.parentNode=a;this.l=b;this.W=c;this.j=null};R.Y.J.prototype={init:function(){this.j=document.createElement("div");this.parentNode.appendChild(this.j);a.m(this.j,"deasc-suggest-menu");this.j.setAttribute("tabindex",-1)},h:function(){for(var a=
[],b="",c=0;c<this.H.length;c++){var g=this.a[c].text;this.H.charAt(c)!=g&&a.push(c);b+=g}return{H:this.H,text:b,bb:a,reset:!1}},X:function(){return this.l({H:this.H,text:this.H,bb:[],reset:!0})},B:function(){var a=this.h();return this.W(a)},L:function(a,b,c){this.aa(a,c);return this.l(this.h())},aa:function(a,b){var c=this.a[a];this.b(c.j,c.pa,a,b)},b:function(c,e,f,g){function d(a,b,c){return function(){return r.L(a,b,c)}}function q(e,g,h){var l=document.createElement("span");a.m(l,"deasc-suggest-item deasc-suggest-item-dynamic-subitem");
h||a.addClass(l,"deasc-suggest-item-dynamic-subitem-bottom");l.innerHTML=e;c.appendChild(l);b.M(l,"click",d(f,g,e));return l}var r=this;this.a[f].text=g;c.innerHTML="";var n=q(g,0,!0);g!=this.H.charAt(f)&&a.addClass(n,"deasc-suggest-item-dynamic-subitem-changed");0==f&&a.addClass(n,"deasc-suggest-item-dynamic-subitem-first");f==this.a.length-1&&a.addClass(n,"deasc-suggest-item-dynamic-subitem-last");for(n=0;n<e.length;n++)e[n]!=g&&q(e[n],n,!1)},D:function(b,c){for(var d=0;d<c.length;d++){var e=c[d],
h=document.createElement("div");e.pa?(a.m(h,"deasc-suggest-item deasc-suggest-item-dynamic"),this.b(h,e.pa,d,e.text)):(a.m(h,"deasc-suggest-item deasc-suggest-item-static"),h.innerHTML=e.text,0==d?a.addClass(h,"deasc-suggest-item-static-first"):d==c.length-1&&a.addClass(h,"deasc-suggest-item-static-last"));c[d].j=h;b.appendChild(h)}},T:function(){function c(b,c){var d=document.createElement("input");a.m(d,"deasc-suggest-menu-btn");d.type="button";d.value=b;d.title=c;return d}var e=c("x","\u0130ptal et"),
f=c("+","T\u00fcm metne uygula");a.addClass(e,"deasc-suggest-menu-btn-close");a.addClass(f,"deasc-suggest-menu-btn-apply");var g=document.createElement("div");a.m(g,"deasc-suggest-menu-btn-container");g.appendChild(f);g.appendChild(e);this.j.appendChild(g);var h=this;b.M(e,"click",function(){return function(){return h.X()}}());b.M(f,"click",function(){return function(){return h.B()}}())},V:function(b){this.a=[];for(var d=0;d<b.length;d++){var f=b.charAt(d);this.a.push(c[f]?new R.Y.Aa(f,c[f]):new R.Y.Aa(f,
null))}b=document.createElement("div");a.m(b,"deasc-suggest-menu-container");this.D(b,this.a);this.j.appendChild(b)},show:function(b,c,f,g){this.H=g;this.j.innerHTML="";this.V(g);this.T();this.j.style.left=b+"px";this.j.style.top=c+"px";this.j.style.display="block";a.Ia(this.j)<f&&(this.j.style.width=f+"px");this.j.style.position=this.parentNode==document.body?"absolute":"relative"},hide:function(){this.j.style.display="none"},La:function(){return"block"==this.j.style.display}}})(R.CSS,R.ma);(function(a,b,c,d,e,f,g,h){function q(a,b){return function(I){if(b)return b(a,I)}}var r=[{name:"keydown",R:function(a){if(a=l.A(a))a.F(),a.update()}},{name:"keyup",R:function(a,b){b=c.lb(b);if(a=l.A(a))a.Da(),a.yb(b)}},{name:"change",R:function(a){(a=l.A(a))&&a.update()}},{name:"mousedown",R:function(a){(a=l.A(a))&&a.F()}},{name:"mouseup",R:function(a,b){a=c.Z(b);(a=l.A(a))&&(b.button==c.Xa.Za?a.F():a.Eb())}},{name:"paste",R:function(a){if(a=l.A(a))a.F(),a.update()}}],n=new T,A={Mb:!0,Qb:!0,Nb:!0,
Pb:!0,Sb:!0,Ob:!0,Rb:!0},B={Na:function(b){return a.deasciify(b)},wa:function(b,c,d){return a.deasciifyRange(b,c,d)},toString:function(){return"deasciify"}},H={Na:function(a){return b.asciify(a)},wa:function(a,c,d){return b.asciifyRange(a,c,d)},toString:function(){return"asciify"}},l={ea:{},Db:function(a){n.a=a},A:function(a){return this.ea[a]},Ra:function(a,b){this.ea[a]=b},$b:function(){return this.ea},ub:function(a){for(var b=0;b<r.length;b++){var d=r[b];c.M(a,d.name,q(a,d.R))}},da:function(a,
b){if(a&&!this.A(a))return b=new this.J(a,b),this.ub(a),b.init(),this.Ra(a,b),b},Gb:function(a){if(this.A(a)){for(var b=0;b<r.length;b++){var d=r[b];c.Fb(a,d.name,d.R)}this.Ra(a,null)}else console.log("Deasciifier already not installed for this text area")},eb:function(a){(a=this.A(a))?a.Oa(B):console.log("DeasciifyBox not installed for this text area")},ab:function(a){(a=this.A(a))?a.Oa(H):console.log("DeasciifyBox not installed for this text area")},la:function(a){var b=this.ea,c;for(c in b){var d=
b[c];d&&d.la(a)}},zb:function(a){a=a.ea;for(var b in a){var c=a[b];c&&c.la(null)}},Ab:function(a,b,c){(a=this.A(a))&&a.options.set(b,c)},J:function(a,b){this.a=a;this.options=new h(b,A);this.b=this.h=null}};l.J.prototype={init:function(){var a=document.body||document.getElementsByTagName("body")[0],b=new h({resizeable:this.options.get("resizeable",!0)});this.h=e.da(this.a,b);if(this.options.get("enable_corrections",!0)){var c=this;this.b={position:{start:0,end:0},ka:g.create(a,function(a){return c.X(a)},
function(a){return c.L(a)})}}},L:function(a){var b=U(n,"confirmApplyCorrectionToAll");if(this.b&&confirm(b)){this.F();b=a.changedPositions||[];for(var c=0;c<b.length;c++)b[c]+=this.b.position.start;a=this.T(a.H,a.text);b=b.concat(a);0<b.length&&this.l(b,!0)}return!0},T:function(a,b){var c=this.a.value;a=c.replace(new RegExp(a,"g"),b);this.D(a);return f.ib(c,a)},X:function(a){return this.b?(a.reset&&this.F(),this.V(a),!0):!1},D:function(a){var b=d.P(this.a);this.a.value=a;d.ha(this.a,b)},V:function(a){this.D(f.Cb(this.a.value,
this.b.position.start,this.b.position.end,a.text));var b=[];if(a.changedPositions)for(var c=0;c<a.changedPositions.length;c++)b.push(a.changedPositions[c]+this.b.position.start);this.l(b,!0)},l:function(a,b){if(this.h&&this.options.get("highlight",!0)&&(a&&0<a.length||b)){this.h.clear();for(b=0;b<a.length;b++){var c=a[b];this.h.tb(c,c+1)}this.h.update()}},B:function(a){a&&a.text&&(this.a.value=a.text,this.l(a.changedPositions))},F:function(){this.b&&this.b.ka&&this.b.ka.hide()},Eb:function(){if(this.h&&
this.b&&this.options.get("show_corrections",!0)){this.F();var a=d.P(this.a);if(a.start==a.end)if(a=a.start,0==f.vb(this.a.value,a))this.F();else{a=f.Ja(this.a.value,a);var b=this.a.value.substring(a.start,a.end);if(0!=g.sb(b)){var c=this.h.jb(a.start,a.end),e=c.left,h=c.top+c.height+3;c=c.width;this.b.position.start=a.start;this.b.position.end=a.end;this.b.ka.show(e,h,c,b)}}}},W:function(){var a=d.P(this.a),b=null;a.start==a.end?b=f.rb(this.a.value,a.start):b={start:a.start,end:a.end};b=B.wa(this.a.value,
b.start,b.end);this.B(b);d.ha(this.a,a)},Oa:function(a){this.b.ka&&this.F();var b=d.P(this.a);if(b.start==b.end){var c=U(n,"confirmFullTextDeasciify");if(this.options.get("fullTextConfirmation",!0)&&!confirm(c))return!1;a=a.Na(this.a.value)}else a=a.wa(this.a.value,b.start,b.end-1);this.B(a);d.ha(this.a,b);return!0},yb:function(a){if(!this.options.get("auto_convert",!0))return!1;f.xb(a)&&this.W()},aa:function(){if(this.h){var a=d.P(this.a);this.h.Ga(a.start);this.h.Ga(a.end)}},Da:function(){this.a.scrollHeight>
this.a.clientHeight&&(this.a.style.height=this.a.scrollHeight+3+36+"px");this.h&&this.h.za()},la:function(){this.h&&this.h.za()},update:function(){this.aa();this.Da()}};(function(){c.M(window,"resize",function(a){l.la(a)});setInterval(function(){l.zb(l)},500)})();R.Ta=l;l.install=l.da;l.uninstall=l.Gb;l.deasciifySelection=l.eb;l.asciifySelection=l.ab;l.setOption=l.Ab;l.setUILang=l.Db;window.DeasciifyBox=R.Ta})(window.Deasciifier,window.Asciifier,R.ma,R.Ca,R.$a,R.Ba,R.Y,S);(function(a,b,c){function d(){t.shift=!t.shift;t.caps=!t.caps;f()}function e(a){$(k.Z()).focus();b.Bb(k.Z(),a)}function f(){t.caps?(w.style.display="block",x.style.display="none"):(w.style.display="none",x.style.display="block")}function g(a){return function(){t.shift&&d();e(a)}}function h(b,d,e){var f=document.createElement("input");f.type="button";f.value=b;e&&a.addClass(f,e);d&&c.M(f,"click",d);return f}function q(b){var c=1<b.length&&"_"==b.charAt(0);b=c?b.substring(1):b;b=h(b,g(b));c&&a.w(b,
{fontWeight:"bolder"});return b}function r(b){b=p.Sa[b];var c=h(b.text,b.N);b.style&&a.w(c,b.style);b.K&&(c.title=b.K);return c}function n(){var b=document.createElement("span");a.w(b,p.Sa.empty.style);return b}function A(a){for(var b in p){var c=p[b];if(c.id&&c.id==a){k.ra=c;w=document.createElement("div");x=document.createElement("div");w.innerHTML="";x.innerHTML="";k.ga.innerHTML="";c=P(k.ra.keys.Ea);var d=P(k.ra.keys.Fa);x.appendChild(c);w.appendChild(d);k.ga.appendChild(x);k.ga.appendChild(w);
f()}}}function B(){A(y.options[y.selectedIndex].value)}function H(){c.M(y,"change",B);y.options[0]=new Option(p.oa.name,p.oa.id);y.options[1]=new Option(p.na.name,p.na.id);return y}function l(){k.hide()}function I(){var b=document.createElement("div");a.m(b,"mea-keyboard-main-controls");b.appendChild(H());var c=h("x",l,"mea-keyboard-main-btn-close");b.appendChild(c);return b}function P(b){var c=document.createElement("table");c.cellPadding=0;for(var d=c.cellSpacing=0;d<b.length;d++){var e=document.createElement("table");
e.cellPadding=0;e.cellSpacing=0;for(var f=e.insertRow(0),g=0;g<b[d].length;g++){var h=f.insertCell(g),k=b[d][g];"empty"==k?h.appendChild(n()):1==k.length||1<k.length&&"_"==k.charAt(0)?h.appendChild(q(k)):h.appendChild(r(k))}f=c.insertRow(d).insertCell(0);e.align="left";f.appendChild(e)}a.m(c,"mea-keyboard-btn-table");return c}var w=null,x=null,t={caps:!1,shift:!1},p={Sa:{tab:{text:"Tab",K:"Tab",style:{width:"32px",textAlign:"left"},N:function(){e("\t")}},backspace:{text:"\u2190",K:"Backspace",style:{width:"25px",
textAlign:"right"},N:function(){$(k.Z()).focus();b.fb(k.Z())}},caps:{text:"Caps",K:"Caps Lock",style:{width:"42px",textAlign:"left"},N:function(){t.caps=!t.caps;f()}},enter:{text:"Enter",K:"Enter",style:{width:"42px",textAlign:"right"},N:function(){e("\n")}},shift_l:{text:"Shift",K:"Shift",style:{width:"55px",textAlign:"left"},N:d},shift_r:{text:"Shift",K:"Shift",style:{width:"55px",textAlign:"right"},N:d},space:{text:"",K:"Space Bar",style:{width:"140px"},N:function(){e(" ")}},empty:{style:{visibility:"hidden",
display:"block",width:"100px"}}},oa:{id:"TR_Q",name:"T\u00fcrk\u00e7e Q",keys:{Ea:["tab q w e r t y u _\u0131 o p _\u011f _\u00fc ; backspace".split(" "),"caps a s d f g h j k l _\u015f _i : enter".split(" "),"shift_l z x c v b n m _\u00f6 _\u00e7 , . shift_r".split(" "),"\u00e2 \u00ea \u00ee \u00f4 \u00fb space".split(" ")],Fa:["tab Q W E R T Y U _I O P _\u011e _\u00dc ; backspace".split(" "),"caps A S D F G H J K L _\u015e _\u0130 : enter".split(" "),"shift_l Z X C V B N M _\u00d6 _\u00c7 , . shift_r".split(" "),
"\u00c2 \u00ca \u00ce \u00d4 \u00db space".split(" ")]}},na:{id:"TR_F",name:"T\u00fcrk\u00e7e F",keys:{Ea:["tab f g _\u011f _\u0131 o d r n h p q w x backspace".split(" "),"caps u _i e a _\u00fc t k m l y _\u015f : enter".split(" "),"shift_l j _\u00f6 v c _\u00e7 z s b , . ; shift_r".split(" "),"\u00e2 \u00ea \u00ee \u00f4 \u00fb space".split(" ")],Fa:["tab F G _\u011e _I O D R N H P Q W X backspace".split(" "),"caps U _\u0130 E A _\u00dc T K M L Y _\u015e : enter".split(" "),"shift_l J _\u00d6 V C _\u00c7 Z S B , . ; shift_r".split(" "),
"\u00c2 \u00ca \u00ce \u00d4 \u00db space".split(" ")]}}},Q=!1,k={ra:p.na,Z:function(){return this.target},da:function(b,c,d,e){this.target=b;k.v=document.createElement("div");a.m(k.v,"mea-keyboard-main");k.ga=document.createElement("div");a.m(k.ga,"mea-keyboard-layout");k.v.appendChild(I());k.v.appendChild(k.ga);e.appendChild(k.v);k.v.style.top=d.top+"px";k.v.style.left=d.left+"px";A(c||p.oa.id);Q=!0},wb:function(){return Q},position:function(a){this.v.style.top=a.top+"px";this.v.style.left=a.left+
"px"},ca:function(){return a.ca(this.v)},La:function(){return"none"!=this.v.style.display},show:function(){this.v&&(this.v.style.display="block")},hide:function(){this.v&&(this.v.style.display="none")}},y=document.createElement("select");a.f(".mea-keyboard-main","background:#EfEfEf; border:1px solid #888; box-shadow:0 0 5px #888;");a.f(".mea-keyboard-layout","");a.f(".mea-keyboard-btn-table","padding:2px 2px; ");a.f(".mea-keyboard-btn-table input","margin:1px 1px; padding:2px; cursor:pointer; width:35px;height:35px; text-align:center; border: 1px solid #333; border-radius:3px; background:-moz-linear-gradient(top,white,#DDD); background-image:-webkit-gradient(linear,0 0,0 100%,from(#fff),to(#ddd))");
a.f(".mea-keyboard-btn-table input:active","background: #888; color: white");a.f(".mea-keyboard-btn-table input:hover","box-shadow: 0px 0px 3px #888;");a.f(".mea-keyboard-main-controls","text-align:right; padding: 1px;");a.f(".mea-keyboard-main-btn-close","display:inline-block; border:1px solid #888; vertical-align:top; margin:2px 2px; width:16px; height:16px; background: url(static/img/v2.0/close_icon.png); font-size:0");R.Wa=k;k.install=k.da;k.isInstalled=k.wb;k.position=k.position;k.getDimensions=
k.ca;k.isVisible=k.La;k.show=k.show;k.hide=k.hide;window.MEA.Keyboard=R.Wa})(R.CSS,R.Ca,R.ma);})();
/** DeasciifyApp code, for using deasciifier and deasciify box in web pages.
 *
 *  Author: Mustafa Emre Acer
 *  Version: 1.0
 *  Example usage:
 *
 *    DeasciifyApp.init({
 *      "textbox": document.getElementById("txt"), // txt is the ID of the text
 * area
 *      "auto_convert": true,                      // Auto conversion while
 * typing. Optional, default is true
 *      "skip_urls": true,                         // Skip URL deasciification.
 * Optional, default is true
 *      "show_corrections":true                    // Show correction menu on
 * click. Optional, default is true
 *    });
 *
 */

var DeasciifyApp = {
  options: {},
  textBox: null,

  deasciifySelection: function(textBox) {
    DeasciifyBox.deasciifySelection(textBox);
  },

  asciifySelection: function(textBox) {
    DeasciifyBox.asciifySelection(textBox);
  },

  displayKeyboard: function(keyboardContainer) {
    if (MEA.Keyboard) {
      if (!MEA.Keyboard.isInstalled()) {
        // Install and position:
        var keyLayoutID = DeasciifyApp.options["keyboard_layout"] || "TR_Q";
        MEA.Keyboard.install(DeasciifyApp.textBox, keyLayoutID,
                             {"left": 0, "top": 0}, keyboardContainer);
        // Position the keyboard:
        var position = $(keyboardContainer).position();
        var btnKeyboard = $("#" + DeasciifyApp.options["keyboard_toggle_btn"]);
        var dimensions = MEA.Keyboard.getDimensions();
        MEA.Keyboard.position({
          "left": position.left - dimensions.width,
          "top": position.top + btnKeyboard.height() + 10
        });
      } else {
        if (MEA.Keyboard.isVisible()) {
          MEA.Keyboard.hide();
        } else {
          MEA.Keyboard.show();
        }
      }
    }
  },

  onChangeOption: function(optionName, domID) {
    if (document.getElementById(domID)) {
      var isEnabled = document.getElementById(domID).checked;
      this.options[optionName] = isEnabled;
      DeasciifyBox.setOption(this.textBox, optionName, isEnabled);
    }
  },

  init: function(options) {
    var self = this;
    // Load options.
    var defaultOptions = [
      {"name": "textbox", "value": "txt"},
      {
        "name": "auto_convert",
        "value": true,
        "domID": "deasciifyapp_auto_convert"
      },
      {"name": "skip_urls", "value": true, "domID": "deasciifyapp_skip_urls"},
      {
        "name": "show_corrections",
        "value": true,
        "domID": "deasciifyapp_show_corrections"
      },
      {"name": "keyboard_layout", "value": "TR_Q"},
      {
        "name": "keyboard_toggle_btn",
        "value": "deasciifyapp_toggle_keyboard_btn"
      }
    ];
    for (var i = 0; i < defaultOptions.length; i++) {
      var defaultOption = defaultOptions[i];
      var optionName = defaultOption["name"];
      var checkboxName = defaultOption["checkbox"];
      var defaultValue = defaultOption["value"];
      // Set option value.
      this.options[optionName] =
          (options && options.hasOwnProperty(optionName)) ?
              options[optionName] :
              defaultValue;
      // Set option ui.
      var defaultDomID = defaultOption["domID"];
      if (defaultDomID) {
        var domID = (options && options.hasOwnProperty(defaultDomID)) ?
                        options[defaultDomID] :
                        defaultDomID;
        this.options[defaultDomID] = domID;

        // Bind ui event:
        var domObj = document.getElementById(domID);
        if (domObj) {
          domObj.onchange = (function(optionName, domID) {
            return function() { self.onChangeOption(optionName, domID); }
          })(optionName, domID);
        }
      }
    }

    // Toggle keyboard button:
    var toggleKbdBtn =
        document.getElementById(this.options["keyboard_toggle_btn"]);
    if (toggleKbdBtn) {
      var that = this;
      toggleKbdBtn.onclick = function() {
        that.displayKeyboard(document.getElementById('keyboard'));
      }
    }

    // Set handlers for textbox:
    this.textBox = options["textbox"];
    if (this.textBox) {
      var options = {
        // TODO(meacer): Make sure this actually works in IE.
        "highlight": true,
        "autogrow": true,
        "auto_convert": this.options["auto_convert"],
        "show_corrections": this.options["show_corrections"]
      };
      DeasciifyBox.install(this.textBox, options);
    }
  }
};
