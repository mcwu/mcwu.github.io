function AppMeasurement_Module_AudienceManagement(d){var a=this;a.s=d;var b=window;b.s_c_in||(b.s_c_il=[],b.s_c_in=0);a._il=b.s_c_il;a._in=b.s_c_in;a._il[a._in]=a;b.s_c_in++;a._c="s_m";a.setup=function(c){b.DIL&&c&&(c.disableDefaultRequest=!0,c.disableScriptAttachment=!0,c.disableCORS=!0,c.secureDataCollection=!1,a.instance=b.DIL.create(c),a.tools=b.DIL.tools)};a.isReady=function(){return a.instance?!0:!1};a.getEventCallConfigParams=function(){return a.instance&&a.instance.api&&a.instance.api.getEventCallConfigParams?
a.instance.api.getEventCallConfigParams():{}};a.passData=function(b){a.instance&&a.instance.api&&a.instance.api.passData&&a.instance.api.passData(b)}}
"function"!==typeof window.DIL&&(window.DIL=function(c,f){var k=[],g,w;c!==Object(c)&&(c={});var u,l,D,N,A,y,E,F,O,P,G,B,z;u=c.partner;l=c.containerNSID;D=!!c.disableDestinationPublishingIframe;N=c.iframeAkamaiHTTPS;A=c.mappings;y=c.uuidCookie;E=!0===c.enableErrorReporting;F=c.visitorService;O=c.declaredId;P=!0===c.delayAllUntilWindowLoad;G=!0===c.disableIDSyncs;B="undefined"===typeof c.secureDataCollection||!0===c.secureDataCollection;z="boolean"===typeof c.isCoopSafe?c.isCoopSafe:null;var Q,L,H,
R,S;Q=!0===c.disableDefaultRequest;L=c.afterResultForDefaultRequest;H=c.dpIframeSrc;R=c.visitorConstructor;S=!0===c.disableCORS;E&&DIL.errorModule.activate();E=!0===window._dil_unit_tests;(g=f)&&k.push(g+"");if(!u||"string"!==typeof u)return g="DIL partner is invalid or not specified in initConfig",DIL.errorModule.handleError({name:"error",message:g,filename:"dil.js"}),Error(g);g="DIL containerNSID is invalid or not specified in initConfig, setting to default of 0";if(l||"number"===typeof l)l=parseInt(l,
10),!isNaN(l)&&0<=l&&(g="");g&&(l=0,k.push(g),g="");w=DIL.getDil(u,l);if(w instanceof DIL&&w.api.getPartner()===u&&w.api.getContainerNSID()===l)return w;if(this instanceof DIL)DIL.registerDil(this,u,l);else return new DIL(c,"DIL was not instantiated with the 'new' operator, returning a valid instance with partner = "+u+" and containerNSID = "+l);var t={IS_HTTPS:B||"https:"===document.location.protocol,MILLIS_PER_DAY:864E5,DIL_COOKIE_NAME:"AAMC_"+encodeURIComponent(u)+"_"+l,FIRST_PARTY_SYNCS:"AMSYNCS",
FIRST_PARTY_SYNCS_ON_PAGE:"AMSYNCSOP",REGION:"REGION",SIX_MONTHS_IN_MINUTES:259200,IE_VERSION:function(){if(document.documentMode)return document.documentMode;for(var a=7;4<a;a--){var b=document.createElement("div");b.innerHTML="\x3c!--[if IE "+a+"]><span></span><![endif]--\x3e";if(b.getElementsByTagName("span").length)return a}return null}()};t.IS_IE_LESS_THAN_10="number"===typeof t.IE_VERSION&&10>t.IE_VERSION;var M={stuffed:{}},m={},p={firingQueue:[],fired:[],firing:!1,sent:[],errored:[],reservedKeys:{sids:!0,
pdata:!0,logdata:!0,callback:!0,postCallbackFn:!0,useImageRequest:!0},firstRequestHasFired:!1,abortRequests:!1,num_of_cors_responses:0,num_of_cors_errors:0,corsErrorSources:[],num_of_img_responses:0,num_of_img_errors:0,platformParams:{d_nsid:l+"",d_rtbd:"json",d_jsonv:DIL.jsonVersion+"",d_dst:"1"},nonModStatsParams:{d_rtbd:!0,d_dst:!0,d_cts:!0,d_rs:!0},modStatsParams:null,adms:{TIME_TO_CATCH_ALL_REQUESTS_RELEASE:2E3,calledBack:!1,mid:null,noVisitorAPI:!1,VisitorAPI:null,instance:null,releaseType:"no VisitorAPI",
isOptedOut:!0,isOptedOutCallbackCalled:!1,admsProcessingStarted:!1,process:function(a){try{if(!this.admsProcessingStarted){this.admsProcessingStarted=!0;var b=this,e,d,h,n;if("function"===typeof a&&"function"===typeof a.getInstance){if(F===Object(F)&&(e=F.namespace)&&"string"===typeof e)d=a.getInstance(e,{idSyncContainerID:l});else{this.releaseType="no namespace";this.releaseRequests();return}if(d===Object(d)&&d instanceof a&&"function"===typeof d.isAllowed&&"function"===typeof d.getMarketingCloudVisitorID&&
"function"===typeof d.getCustomerIDs&&"function"===typeof d.isOptedOut){this.VisitorAPI=a;if(!d.isAllowed()){this.releaseType="VisitorAPI not allowed";this.releaseRequests();return}this.instance=d;h=function(a){"VisitorAPI"!==b.releaseType&&(b.mid=a,b.releaseType="VisitorAPI",b.releaseRequests())};n=d.getMarketingCloudVisitorID(h);if("string"===typeof n&&n.length){h(n);return}setTimeout(function(){"VisitorAPI"!==b.releaseType&&(b.releaseType="timeout",b.releaseRequests())},this.getLoadTimeout());
return}this.releaseType="invalid instance"}else this.noVisitorAPI=!0;this.releaseRequests()}}catch(c){this.releaseRequests()}},releaseRequests:function(){this.calledBack=!0;p.registerRequest()},getMarketingCloudVisitorID:function(){return this.instance?this.instance.getMarketingCloudVisitorID():null},getMIDQueryString:function(){var a=r.isPopulatedString,b=this.getMarketingCloudVisitorID();a(this.mid)&&this.mid===b||(this.mid=b);return a(this.mid)?"d_mid="+this.mid+"&":""},getCustomerIDs:function(){return this.instance?
this.instance.getCustomerIDs():null},getCustomerIDsQueryString:function(a){if(a===Object(a)){var b="",e=[],d=[],h,n;for(h in a)a.hasOwnProperty(h)&&(d[0]=h,n=a[h],n===Object(n)&&(d[1]=n.id||"",d[2]=n.authState||0,e.push(d),d=[]));if(d=e.length)for(a=0;a<d;a++)b+="&d_cid_ic="+q.encodeAndBuildRequest(e[a],"%01");return b}return""},getIsOptedOut:function(){this.instance?this.instance.isOptedOut([this,this.isOptedOutCallback],this.VisitorAPI.OptOut.GLOBAL,!0):(this.isOptedOut=!1,this.isOptedOutCallbackCalled=
!0)},isOptedOutCallback:function(a){this.isOptedOut=a;this.isOptedOutCallbackCalled=!0;p.registerRequest()},getLoadTimeout:function(){var a=this.instance;if(a){if("function"===typeof a.getLoadTimeout)return a.getLoadTimeout();if("undefined"!==typeof a.loadTimeout)return a.loadTimeout}return this.TIME_TO_CATCH_ALL_REQUESTS_RELEASE}},declaredId:{declaredId:{init:null,request:null},declaredIdCombos:{},setDeclaredId:function(a,b){var e=r.isPopulatedString,d=encodeURIComponent;if(a===Object(a)&&e(b)){var h=
a.dpid,n=a.dpuuid,c=null;if(e(h)&&e(n)){c=d(h)+"$"+d(n);if(!0===this.declaredIdCombos[c])return"setDeclaredId: combo exists for type '"+b+"'";this.declaredIdCombos[c]=!0;this.declaredId[b]={dpid:h,dpuuid:n};return"setDeclaredId: succeeded for type '"+b+"'"}}return"setDeclaredId: failed for type '"+b+"'"},getDeclaredIdQueryString:function(){var a=this.declaredId.request,b=this.declaredId.init,e=encodeURIComponent,d="";null!==a?d="&d_dpid="+e(a.dpid)+"&d_dpuuid="+e(a.dpuuid):null!==b&&(d="&d_dpid="+
e(b.dpid)+"&d_dpuuid="+e(b.dpuuid));return d}},registerRequest:function(a){var b=this.firingQueue;a===Object(a)&&b.push(a);this.firing||!b.length||P&&!DIL.windowLoaded||(this.adms.isOptedOutCallbackCalled||this.adms.getIsOptedOut(),this.adms.calledBack&&!this.adms.isOptedOut&&this.adms.isOptedOutCallbackCalled&&(this.adms.isOptedOutCallbackCalled=!1,a=b.shift(),a.src=a.src.replace(/demdex.net\/event\?d_nsid=/,"demdex.net/event?"+this.adms.getMIDQueryString()+"d_nsid="),r.isPopulatedString(a.corsPostData)&&
(a.corsPostData=a.corsPostData.replace(/^d_nsid=/,this.adms.getMIDQueryString()+"d_nsid=")),C.fireRequest(a),this.firstRequestHasFired||"script"!==a.tag&&"cors"!==a.tag||(this.firstRequestHasFired=!0)))},processVisitorAPI:function(){this.adms.process(R||window.Visitor)},getCoopQueryString:function(){var a="";!0===z?a="&d_coop_safe=1":!1===z&&(a="&d_coop_unsafe=1");return a}};B=function(){var a="http://fast.",b="?d_nsid="+l+"#"+encodeURIComponent(document.location.href);if("string"===typeof H&&H.length)return H+
b;t.IS_HTTPS&&(a=!0===N?"https://fast.":"https://");return a+u+".demdex.net/dest5.html"+b};var v={MAX_SYNCS_LENGTH:649,id:"destination_publishing_iframe_"+u+"_"+l,url:B(),onPagePixels:[],iframeHost:null,getIframeHost:function(a){if("string"===typeof a){var b=a.split("/");if(3<=b.length)return b[0]+"//"+b[2];k.push("getIframeHost: url is malformed: "+a);return a}},iframe:null,iframeHasLoaded:!1,sendingMessages:!1,messages:[],messagesPosted:[],messagesReceived:[],ibsDeleted:[],jsonForComparison:[],
jsonDuplicates:[],jsonWaiting:[],jsonProcessed:[],canSetThirdPartyCookies:!0,receivedThirdPartyCookiesNotification:!1,newIframeCreated:null,iframeIdChanged:!1,originalIframeHasLoadedAlready:null,regionChanged:!1,timesRegionChanged:0,attachIframe:function(){function a(){d=document.createElement("iframe");d.sandbox="allow-scripts allow-same-origin";d.title="Adobe ID Syncing iFrame";d.id=e.id;d.name=e.id+"_name";d.style.cssText="display: none; width: 0; height: 0;";d.src=e.url;e.newIframeCreated=!0;
b();document.body.appendChild(d)}function b(){d.addEventListener("load",function(){d.className="aamIframeLoaded";e.iframeHasLoaded=!0;e.requestToProcess()})}if(!t.IS_IE_LESS_THAN_10){var e=this,d=document.getElementById(this.id);d?"IFRAME"!==d.nodeName?(this.id+="_2",this.iframeIdChanged=!0,a()):(this.newIframeCreated=!1,"aamIframeLoaded"!==d.className?(this.originalIframeHasLoadedAlready=!1,b()):(this.iframeHasLoaded=this.originalIframeHasLoadedAlready=!0,this.iframe=d,this.requestToProcess())):
a();this.iframe=d}},requestToProcess:function(a,b){function e(){d.jsonForComparison.push(a);d.jsonWaiting.push([a,b])}var d=this,h,n;h=p.adms.instance;a===Object(a)&&h===Object(h)&&h.idSyncContainerID===l&&(v.ibsDeleted.push(a.ibs),delete a.ibs);if(a&&!r.isEmptyObject(a))if(h=JSON.stringify(a.ibs||[]),n=JSON.stringify(a.dests||[]),this.jsonForComparison.length){var c=!1,f,g,k;f=0;for(g=this.jsonForComparison.length;f<g;f++)if(k=this.jsonForComparison[f],h===JSON.stringify(k.ibs||[])&&n===JSON.stringify(k.dests||
[])){c=!0;break}c?this.jsonDuplicates.push(a):e()}else e();this.receivedThirdPartyCookiesNotification&&this.jsonWaiting.length&&(h=this.jsonWaiting.shift(),!1===this.newIframeCreated&&delete h[0].ibs,this.process(h[0],h[1]),this.requestToProcess());this.iframeHasLoaded&&this.messages.length&&!this.sendingMessages&&(this.sendingMessages=!0,this.sendMessages())},checkIfRegionChanged:function(a){var b=q.getDilCookieField(t.REGION);null!==b&&"undefined"!==typeof a.dcs_region&&parseInt(b,10)!==a.dcs_region&&
(this.regionChanged=!0,this.timesRegionChanged++,q.setDilCookieField(t.FIRST_PARTY_SYNCS_ON_PAGE,""),q.setDilCookieField(t.FIRST_PARTY_SYNCS,""));"undefined"!==typeof a.dcs_region&&q.setDilCookieField(t.REGION,a.dcs_region)},processSyncOnPage:function(a){var b,e,d;if((b=a.ibs)&&b instanceof Array&&(e=b.length))for(a=0;a<e;a++)d=b[a],d.syncOnPage&&this.checkFirstPartyCookie(d,"","syncOnPage")},process:function(a,b){var e=encodeURIComponent,d,h,n,c,f,g;b===Object(b)&&(g=q.encodeAndBuildRequest(["",
b.dpid||"",b.dpuuid||""],","));if((d=a.dests)&&d instanceof Array&&(h=d.length))for(n=0;n<h;n++)c=d[n],f=[e("dests"),e(c.id||""),e(c.y||""),e(c.c||"")],this.addMessage(f.join("|"));if((d=a.ibs)&&d instanceof Array&&(h=d.length))for(n=0;n<h;n++)c=d[n],f=[e("ibs"),e(c.id||""),e(c.tag||""),q.encodeAndBuildRequest(c.url||[],","),e(c.ttl||""),"",g,c.fireURLSync?"true":"false"],c.syncOnPage||(this.canSetThirdPartyCookies?this.addMessage(f.join("|")):c.fireURLSync&&this.checkFirstPartyCookie(c,f.join("|")));
this.jsonProcessed.push(a)},checkFirstPartyCookie:function(a,b,e){var d=(e="syncOnPage"===e?!0:!1)?t.FIRST_PARTY_SYNCS_ON_PAGE:t.FIRST_PARTY_SYNCS,h=this.getOnPageSyncData(d),c=!1,f=!1,g=Math.ceil((new Date).getTime()/t.MILLIS_PER_DAY);h?(h=h.split("*"),f=this.pruneSyncData(h,a.id,g),c=f.dataPresent,f=f.dataValid,c&&f||this.fireSync(e,a,b,h,d,g)):(h=[],this.fireSync(e,a,b,h,d,g))},getOnPageSyncData:function(a){var b=p.adms.instance;return b&&"function"===typeof b.idSyncGetOnPageSyncInfo?b.idSyncGetOnPageSyncInfo():
q.getDilCookieField(a)},pruneSyncData:function(a,b,e){var d=!1,h=!1,c,f,g;if(a instanceof Array)for(f=0;f<a.length;f++)c=a[f],g=parseInt(c.split("-")[1],10),c.match("^"+b+"-")?(d=!0,e<g?h=!0:(a.splice(f,1),f--)):e>=g&&(a.splice(f,1),f--);return{dataPresent:d,dataValid:h}},manageSyncsSize:function(a){if(a.join("*").length>this.MAX_SYNCS_LENGTH)for(a.sort(function(a,e){return parseInt(a.split("-")[1],10)-parseInt(e.split("-")[1],10)});a.join("*").length>this.MAX_SYNCS_LENGTH;)a.shift()},fireSync:function(a,
b,e,d,h,c){function f(a,b,d,e){return function(){g.onPagePixels[a]=null;var h=g.getOnPageSyncData(d),c=[];if(h){var h=h.split("*"),n,f,k;n=0;for(f=h.length;n<f;n++)k=h[n],k.match("^"+b.id+"-")||c.push(k)}g.setSyncTrackingData(c,b,d,e)}}var g=this;if(a){if("img"===b.tag){a=b.url;e=t.IS_HTTPS?"https:":"http:";var k,p,q;d=0;for(k=a.length;d<k;d++){p=a[d];q=/^\/\//.test(p);var l=new Image;l.addEventListener("load",f(this.onPagePixels.length,b,h,c));l.src=(q?e:"")+p;this.onPagePixels.push(l)}}}else this.addMessage(e),
this.setSyncTrackingData(d,b,h,c)},addMessage:function(a){this.messages.push(a)},setSyncTrackingData:function(a,b,e,d){a.push(b.id+"-"+(d+Math.ceil(b.ttl/60/24)));this.manageSyncsSize(a);q.setDilCookieField(e,a.join("*"))},sendMessages:function(){var a="",b=encodeURIComponent;this.regionChanged&&(a=b("---destpub-clear-dextp---"),this.regionChanged=!1);this.messages.length&&(a=a+b("---destpub-combined---")+this.messages.join("%01"),this.postMessage(a),this.messages=[]);this.sendingMessages=!1},postMessage:function(a){DIL.xd.postMessage(a,
this.url,this.iframe.contentWindow);this.messagesPosted.push(a)},receiveMessage:function(a){var b=/^---destpub-to-parent---/;"string"===typeof a&&b.test(a)&&(b=a.replace(b,"").split("|"),"canSetThirdPartyCookies"===b[0]&&(this.canSetThirdPartyCookies="true"===b[1]?!0:!1,this.receivedThirdPartyCookiesNotification=!0,this.requestToProcess()),this.messagesReceived.push(a))}},J={traits:function(a){r.isValidPdata(a)&&(m.sids instanceof Array||(m.sids=[]),q.extendArray(m.sids,a));return this},pixels:function(a){r.isValidPdata(a)&&
(m.pdata instanceof Array||(m.pdata=[]),q.extendArray(m.pdata,a));return this},logs:function(a){r.isValidLogdata(a)&&(m.logdata!==Object(m.logdata)&&(m.logdata={}),q.extendObject(m.logdata,a));return this},customQueryParams:function(a){r.isEmptyObject(a)||q.extendObject(m,a,p.reservedKeys);return this},signals:function(a,b){var e,d=a;if(!r.isEmptyObject(d)){if(b&&"string"===typeof b)for(e in d={},a)a.hasOwnProperty(e)&&(d[b+e]=a[e]);q.extendObject(m,d,p.reservedKeys)}return this},declaredId:function(a){p.declaredId.setDeclaredId(a,
"request");return this},result:function(a){"function"===typeof a&&(m.callback=a);return this},afterResult:function(a){"function"===typeof a&&(m.postCallbackFn=a);return this},useImageRequest:function(){m.useImageRequest=!0;return this},clearData:function(){m={};return this},submit:function(){C.submitRequest(m);m={};return this},getPartner:function(){return u},getContainerNSID:function(){return l},getEventLog:function(){return k},getState:function(){var a={},b={};q.extendObject(a,p,{registerRequest:!0});
q.extendObject(b,v,{attachIframe:!0,requestToProcess:!0,process:!0,sendMessages:!0});return{initConfig:c,pendingRequest:m,otherRequestInfo:a,destinationPublishingInfo:b}},idSync:function(a){if(G)return"Error: id syncs have been disabled";if(a!==Object(a)||"string"!==typeof a.dpid||!a.dpid.length)return"Error: config or config.dpid is empty";if("string"!==typeof a.url||!a.url.length)return"Error: config.url is empty";var b=a.url,e=a.minutesToLive,d=encodeURIComponent,h=v,c,b=b.replace(/^https:/,"").replace(/^http:/,
"");if("undefined"===typeof e)e=20160;else if(e=parseInt(e,10),isNaN(e)||0>=e)return"Error: config.minutesToLive needs to be a positive number";c=q.encodeAndBuildRequest(["",a.dpid,a.dpuuid||""],",");a=["ibs",d(a.dpid),"img",d(b),e,"",c];h.addMessage(a.join("|"));p.firstRequestHasFired&&h.requestToProcess();return"Successfully queued"},aamIdSync:function(a){if(G)return"Error: id syncs have been disabled";if(a!==Object(a)||"string"!==typeof a.dpuuid||!a.dpuuid.length)return"Error: config or config.dpuuid is empty";
a.url="//dpm.demdex.net/ibs:dpid="+a.dpid+"&dpuuid="+a.dpuuid;return this.idSync(a)},passData:function(a){if(r.isEmptyObject(a))return"Error: json is empty or not an object";v.ibsDeleted.push(a.ibs);delete a.ibs;C.defaultCallback(a);return a},getPlatformParams:function(){return p.platformParams},getEventCallConfigParams:function(){var a=p,b=a.modStatsParams,e=a.platformParams,d;if(!b){b={};for(d in e)e.hasOwnProperty(d)&&!a.nonModStatsParams[d]&&(b[d.replace(/^d_/,"")]=e[d]);!0===z?b.coop_safe=1:
!1===z&&(b.coop_unsafe=1);a.modStatsParams=b}return b},setAsCoopSafe:function(){z=!0;return this},setAsCoopUnsafe:function(){z=!1;return this}},C={corsMetadata:function(){var a="none",b=!0;"undefined"!==typeof XMLHttpRequest&&XMLHttpRequest===Object(XMLHttpRequest)&&("withCredentials"in new XMLHttpRequest?a="XMLHttpRequest":(new Function("/*@cc_on return /^10/.test(@_jscript_version) @*/"))()?a="XMLHttpRequest":"undefined"!==typeof XDomainRequest&&XDomainRequest===Object(XDomainRequest)&&(b=!1),0<
Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")&&(b=!1));return{corsType:a,corsCookiesEnabled:b}}(),getCORSInstance:function(){return"none"===this.corsMetadata.corsType?null:new window[this.corsMetadata.corsType]},submitRequest:function(a){p.registerRequest(C.createQueuedRequest(a));return!0},createQueuedRequest:function(a){var b=a.callback,e="img",d,h;if(!r.isEmptyObject(A)){var c;for(d in A)A.hasOwnProperty(d)&&(h=A[d],null==h||""===h||!(d in a)||h in a||h in p.reservedKeys||
(c=a[d],null!=c&&""!==c&&(a[h]=c)))}r.isValidPdata(a.sids)||(a.sids=[]);r.isValidPdata(a.pdata)||(a.pdata=[]);r.isValidLogdata(a.logdata)||(a.logdata={});a.logdataArray=q.convertObjectToKeyValuePairs(a.logdata,"=",!0);a.logdataArray.push("_ts="+(new Date).getTime());"function"!==typeof b&&(b=this.defaultCallback);d=this.makeRequestSrcData(a);(h=this.getCORSInstance())&&!0!==a.useImageRequest&&(e="cors");return{tag:e,src:d.src,corsSrc:d.corsSrc,callbackFn:b,postCallbackFn:a.postCallbackFn,useImageRequest:!!a.useImageRequest,
requestData:a,corsInstance:h,corsPostData:d.corsPostData}},defaultCallback:function(a,b){v.checkIfRegionChanged(a);v.processSyncOnPage(a);var e,d,h,c,f,g,k,l,m;if((e=a.stuff)&&e instanceof Array&&(d=e.length))for(h=0;h<d;h++)if((c=e[h])&&c===Object(c)){f=c.cn;g=c.cv;k=c.ttl;if("undefined"===typeof k||""===k)k=Math.floor(q.getMaxCookieExpiresInMinutes()/60/24);l=c.dmn||"."+document.domain.replace(/^www\./,"");m=c.type;f&&(g||"number"===typeof g)&&("var"!==m&&(k=parseInt(k,10))&&!isNaN(k)&&q.setCookie(f,
g,1440*k,"/",l,!1),M.stuffed[f]=g)}e=a.uuid;r.isPopulatedString(e)&&!r.isEmptyObject(y)&&(d=y.path,"string"===typeof d&&d.length||(d="/"),h=parseInt(y.days,10),isNaN(h)&&(h=100),q.setCookie(y.name||"aam_did",e,1440*h,d,y.domain||"."+document.domain.replace(/^www\./,""),!0===y.secure));D||p.abortRequests||v.requestToProcess(a,b)},makeRequestSrcData:function(a){a.sids=r.removeEmptyArrayValues(a.sids||[]);a.pdata=r.removeEmptyArrayValues(a.pdata||[]);var b=p,e=b.platformParams,d=q.encodeAndBuildRequest(a.sids,
","),c=q.encodeAndBuildRequest(a.pdata,","),f=(a.logdataArray||[]).join("&");delete a.logdataArray;var g=t.IS_HTTPS?"https://":"http://",k=b.declaredId.getDeclaredIdQueryString(),l=b.adms.instance?b.adms.getCustomerIDsQueryString(b.adms.getCustomerIDs()):"",m=[],x,v,I,w;for(x in a)if(!(x in b.reservedKeys)&&a.hasOwnProperty(x))if(v=a[x],x=encodeURIComponent(x),v instanceof Array)for(I=0,w=v.length;I<w;I++)m.push(x+"="+encodeURIComponent(v[I]));else m.push(x+"="+encodeURIComponent(v));a=m.length?"&"+
m.join("&"):"";b="d_nsid="+e.d_nsid+b.getCoopQueryString()+k+l+(d.length?"&d_sid="+d:"")+(c.length?"&d_px="+c:"")+(f.length?"&d_ld="+encodeURIComponent(f):"");e="&d_rtbd="+e.d_rtbd+"&d_jsonv="+e.d_jsonv+"&d_dst="+e.d_dst;g=g+u+".demdex.net/event";c=d=g+"?"+b+e+a;2048<d.length&&(d=d.substring(0,2048).substring(0,d.lastIndexOf("&")));return{corsSrc:g+"?_ts="+(new Date).getTime(),src:d,originalSrc:c,corsPostData:b+e+a,isDeclaredIdCall:""!==k}},fireRequest:function(a){if("img"===a.tag)this.fireImage(a);
else{var b=p.declaredId,b=b.declaredId.request||b.declaredId.init||{};this.fireCORS(a,{dpid:b.dpid||"",dpuuid:b.dpuuid||""})}},fireImage:function(a){var b=p,e,d;b.abortRequests||(b.firing=!0,e=new Image(0,0),b.sent.push(a),e.onload=function(){b.firing=!1;b.fired.push(a);b.num_of_img_responses++;b.registerRequest()},d=function(d){g="imgAbortOrErrorHandler received the event of type "+d.type;k.push(g);b.abortRequests=!0;b.firing=!1;b.errored.push(a);b.num_of_img_errors++;b.registerRequest()},e.addEventListener("error",
d),e.addEventListener("abort",d),e.src=a.src)},fireCORS:function(a,b){var e=this,d=p,c=this.corsMetadata.corsType,f=a.corsSrc,l=a.corsInstance,q=a.corsPostData,m=a.postCallbackFn,r="function"===typeof m;if(!d.abortRequests&&!S){d.firing=!0;try{l.open("post",f,!0),"XMLHttpRequest"===c&&(l.withCredentials=!0,l.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),l.onreadystatechange=function(){if(4===this.readyState&&200===this.status)a:{var c;try{if(c=JSON.parse(this.responseText),
c!==Object(c)){e.handleCORSError(a,b,"Response is not JSON");break a}}catch(h){e.handleCORSError(a,b,"Error parsing response as JSON");break a}G&&(v.ibsDeleted.push(c.ibs),delete c.ibs);try{var f=a.callbackFn;d.firing=!1;d.fired.push(a);d.num_of_cors_responses++;f(c,b);r&&m(c,b)}catch(h){h.message="DIL handleCORSResponse caught error with message "+h.message;g=h.message;k.push(g);h.filename=h.filename||"dil.js";h.partner=u;DIL.errorModule.handleError(h);try{f({error:h.name+"|"+h.message},b),r&&m({error:h.name+
"|"+h.message},b)}catch(n){}}finally{d.registerRequest()}}}),l.onerror=function(){e.handleCORSError(a,b,"onerror")},l.ontimeout=function(){e.handleCORSError(a,b,"ontimeout")},l.send(q)}catch(t){this.handleCORSError(a,b,"try-catch")}d.sent.push(a);d.declaredId.declaredId.request=null}},handleCORSError:function(a,b,e){p.num_of_cors_errors++;p.corsErrorSources.push(e)},handleRequestError:function(a,b){var e=p;k.push(a);e.abortRequests=!0;e.firing=!1;e.errored.push(b);e.registerRequest()}},r={isValidPdata:function(a){return a instanceof
Array&&this.removeEmptyArrayValues(a).length?!0:!1},isValidLogdata:function(a){return!this.isEmptyObject(a)},isEmptyObject:function(a){if(a!==Object(a))return!0;for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},removeEmptyArrayValues:function(a){for(var b=0,e=a.length,d,c=[],b=0;b<e;b++)d=a[b],"undefined"!==typeof d&&null!==d&&""!==d&&c.push(d);return c},isPopulatedString:function(a){return"string"===typeof a&&a.length}},q={convertObjectToKeyValuePairs:function(a,b,e){var d=[],c,f;b||(b="=");
for(c in a)a.hasOwnProperty(c)&&(f=a[c],"undefined"!==typeof f&&null!==f&&""!==f&&d.push(c+b+(e?encodeURIComponent(f):f)));return d},encodeAndBuildRequest:function(a,b){return a.map(function(a){return encodeURIComponent(a)}).join(b)},getCookie:function(a){a+="=";var b=document.cookie.split(";"),e,d,c;e=0;for(d=b.length;e<d;e++){for(c=b[e];" "===c.charAt(0);)c=c.substring(1,c.length);if(0===c.indexOf(a))return decodeURIComponent(c.substring(a.length,c.length))}return null},setCookie:function(a,b,e,
d,c,f){var g=new Date;e&&(e*=6E4);document.cookie=a+"="+encodeURIComponent(b)+(e?";expires="+(new Date(g.getTime()+e)).toUTCString():"")+(d?";path="+d:"")+(c?";domain="+c:"")+(f?";secure":"")},extendArray:function(a,b){return a instanceof Array&&b instanceof Array?(Array.prototype.push.apply(a,b),!0):!1},extendObject:function(a,b,e){var d;if(a===Object(a)&&b===Object(b)){for(d in b)!b.hasOwnProperty(d)||!r.isEmptyObject(e)&&d in e||(a[d]=b[d]);return!0}return!1},getMaxCookieExpiresInMinutes:function(){return t.SIX_MONTHS_IN_MINUTES},
getCookieField:function(a,b){var e=this.getCookie(a),d=decodeURIComponent;if("string"===typeof e){var e=e.split("|"),c,f;c=0;for(f=e.length-1;c<f;c++)if(d(e[c])===b)return d(e[c+1])}return null},getDilCookieField:function(a){return this.getCookieField(t.DIL_COOKIE_NAME,a)},setCookieField:function(a,b,c){var d=this.getCookie(a),f=!1,g=encodeURIComponent;b=g(b);c=g(c);if("string"===typeof d){var d=d.split("|"),k,g=0;for(k=d.length-1;g<k;g++)if(d[g]===b){d[g+1]=c;f=!0;break}f||(g=d.length,d[g]=b,d[g+
1]=c)}else d=[b,c];this.setCookie(a,d.join("|"),this.getMaxCookieExpiresInMinutes(),"/",this.getDomain(),!1)},setDilCookieField:function(a,b){return this.setCookieField(t.DIL_COOKIE_NAME,a,b)},getDomain:function(a){!a&&window.location&&(a=window.location.hostname);if(a)if(/^[0-9.]+$/.test(a))a="";else{var b=a.split("."),c=b.length-1,d=c-1;1<c&&2>=b[c].length&&(2===b[c-1].length||0>",DOMAIN_2_CHAR_EXCEPTIONS,".indexOf(","+b[c]+","))&&d--;if(0<d)for(a="";c>=d;)a=b[c]+(a?".":"")+a,c--}return a},replaceMethodsWithFunction:function(a,
b){var c;if(a===Object(a)&&"function"===typeof b)for(c in a)a.hasOwnProperty(c)&&"function"===typeof a[c]&&(a[c]=b)}};"error"===u&&0===l&&window.addEventListener("load",function(){DIL.windowLoaded=!0});var T=!1,K=function(){T||(T=!0,p.registerRequest(),U(),D||p.abortRequests||v.attachIframe())},U=function(){D||setTimeout(function(){Q||p.firstRequestHasFired||("function"===typeof L?J.afterResult(L).submit():J.submit())},DIL.constants.TIME_TO_DEFAULT_REQUEST)};w=document;"error"!==u&&(DIL.windowLoaded?
K():"complete"!==w.readyState&&"loaded"!==w.readyState?window.addEventListener("load",function(){DIL.windowLoaded=!0;K()}):(DIL.windowLoaded=!0,K()));if("error"!==u)try{DIL.xd.receiveMessage(function(a){v.receiveMessage(a.data)},v.getIframeHost(v.url))}catch(a){}p.declaredId.setDeclaredId(O,"init");p.processVisitorAPI();t.IS_IE_LESS_THAN_10&&q.replaceMethodsWithFunction(J,function(){return this});this.api=J;this.getStuffedVariable=function(a){var b=M.stuffed[a];b||"number"===typeof b||(b=q.getCookie(a))||
"number"===typeof b||(b="");return b};this.validators=r;this.helpers=q;this.constants=t;this.log=k;E&&(this.pendingRequest=m,this.requestController=p,this.setDestinationPublishingUrl=B,this.destinationPublishing=v,this.requestProcs=C,this.variables=M,this.callWindowLoadFunctions=K)},DIL.extendStaticPropertiesAndMethods=function(c){var f;if(c===Object(c))for(f in c)c.hasOwnProperty(f)&&(this[f]=c[f])},DIL.extendStaticPropertiesAndMethods({version:"7.0",jsonVersion:1,constants:{TIME_TO_DEFAULT_REQUEST:50},
variables:{scriptNodeList:document.getElementsByTagName("script")},windowLoaded:!1,dils:{},isAddedPostWindowLoad:function(c){this.windowLoaded="function"===typeof c?!!c():"boolean"===typeof c?c:!0},create:function(c){try{return new DIL(c)}catch(f){throw Error("Error in attempt to create DIL instance with DIL.create(): "+f.message);}},registerDil:function(c,f,k){f=f+"$"+k;f in this.dils||(this.dils[f]=c)},getDil:function(c,f){var k;"string"!==typeof c&&(c="");f||(f=0);k=c+"$"+f;return k in this.dils?
this.dils[k]:Error("The DIL instance with partner = "+c+" and containerNSID = "+f+" was not found")},dexGetQSVars:function(c,f,k){f=this.getDil(f,k);return f instanceof this?f.getStuffedVariable(c):""},xd:{postMessage:function(c,f,k){f&&k.postMessage(c,f.replace(/([^:]+:\/\/[^\/]+).*/,"$1"))},receiveMessage:function(c,f){var k;try{c&&(k=function(g){if("string"===typeof f&&g.origin!==f||"[object Function]"===Object.prototype.toString.call(f)&&!1===f(g.origin))return!1;c(g)}),window[c?"addEventListener":
"removeEventListener"]("message",k,!1)}catch(g){}}}}),DIL.errorModule=function(){var c=DIL.create({partner:"error",containerNSID:0,disableDestinationPublishingIframe:!0}),f={harvestererror:14138,destpuberror:14139,dpmerror:14140,generalerror:14137,error:14137,noerrortypedefined:15021,evalerror:15016,rangeerror:15017,referenceerror:15018,typeerror:15019,urierror:15020},k=!1;return{activate:function(){k=!0},handleError:function(g){if(!k)return"DIL error module has not been activated";g!==Object(g)&&
(g={});var w=g.name?(g.name+"").toLowerCase():"",u=[];g={name:w,filename:g.filename?g.filename+"":"",partner:g.partner?g.partner+"":"no_partner",site:g.site?g.site+"":document.location.href,message:g.message?g.message+"":""};u.push(w in f?f[w]:f.noerrortypedefined);c.api.pixels(u).logs(g).useImageRequest().submit();return"DIL error report sent"},pixelMap:f}}(),DIL.tools={},DIL.modules={helpers:{handleModuleError:function(c,f,k){var g="";f=f||"Error caught in DIL module/submodule: ";c===Object(c)?
g=f+(c.message||"err has no message"):(g=f+"err is not a valid object",c={});c.message=g;k instanceof DIL&&(c.partner=k.api.getPartner());DIL.errorModule.handleError(c);return this.errorMessage=g}}});
