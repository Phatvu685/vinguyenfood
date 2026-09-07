(()=>{var a={};a.id=635,a.ids=[635],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3560:a=>{a.exports={pageRoot:"page_pageRoot__yAmJa"}},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},20656:(a,b,c)=>{Promise.resolve().then(c.bind(c,86197))},26713:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/is-bot")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},30384:(a,b,c)=>{Promise.resolve().then(c.bind(c,93835))},33873:a=>{"use strict";a.exports=require("path")},40942:(a,b,c)=>{"use strict";c.r(b),c.d(b,{GlobalError:()=>E.a,__next_app__:()=>K,handler:()=>M,pages:()=>J,routeModule:()=>L,tree:()=>I});var d=c(49754),e=c(9117),f=c(46595),g=c(32324),h=c(39326),i=c(38928),j=c(20175),k=c(12),l=c(54290),m=c(12696),n=c(52574),o=c(82802),p=c(77533),q=c(45229),r=c(32822),s=c(261),t=c(26453),u=c(52474),v=c(26713),w=c(51356),x=c(62685),y=c(36225),z=c(63446),A=c(2762),B=c(45742),C=c(86439),D=c(81170),E=c.n(D),F=c(62506),G=c(91203),H={};for(let a in F)0>["default","tree","pages","GlobalError","__next_app__","routeModule","handler"].indexOf(a)&&(H[a]=()=>F[a]);c.d(b,H);let I={children:["",{children:["ve-chung-toi",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(c.bind(c,86197)),"C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\ve-chung-toi\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(c.bind(c,16953)),"C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\layout.tsx"],"global-error":[()=>Promise.resolve().then(c.t.bind(c,81170,23)),"next/dist/client/components/builtin/global-error.js"],"not-found":[()=>Promise.resolve().then(c.t.bind(c,87028,23)),"next/dist/client/components/builtin/not-found.js"],forbidden:[()=>Promise.resolve().then(c.t.bind(c,90461,23)),"next/dist/client/components/builtin/forbidden.js"],unauthorized:[()=>Promise.resolve().then(c.t.bind(c,32768,23)),"next/dist/client/components/builtin/unauthorized.js"]}]}.children,J=["C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\ve-chung-toi\\page.tsx"],K={require:c,loadChunk:()=>Promise.resolve()},L=new d.AppPageRouteModule({definition:{kind:e.RouteKind.APP_PAGE,page:"/ve-chung-toi/page",pathname:"/ve-chung-toi",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:I},distDir:".next",relativeProjectDir:""});async function M(a,b,d){var D;let H="/ve-chung-toi/page";"/index"===H&&(H="/");let N=(0,h.getRequestMeta)(a,"postponed"),O=(0,h.getRequestMeta)(a,"minimalMode"),P=await L.prepare(a,b,{srcPage:H,multiZoneDraftMode:!1});if(!P)return b.statusCode=400,b.end("Bad Request"),null==d.waitUntil||d.waitUntil.call(d,Promise.resolve()),null;let{buildId:Q,query:R,params:S,parsedUrl:T,pageIsDynamic:U,buildManifest:V,nextFontManifest:W,reactLoadableManifest:X,serverActionsManifest:Y,clientReferenceManifest:Z,subresourceIntegrityManifest:$,prerenderManifest:_,isDraftMode:aa,resolvedPathname:ab,revalidateOnlyGenerated:ac,routerServerContext:ad,nextConfig:ae,interceptionRoutePatterns:af}=P,ag=T.pathname||"/",ah=(0,s.normalizeAppPath)(H),{isOnDemandRevalidate:ai}=P,aj=L.match(ag,_),ak=!!_.routes[ab],al=!!(aj||ak||_.routes[ah]),am=a.headers["user-agent"]||"",an=(0,v.getBotType)(am),ao=(0,q.isHtmlBotRequest)(a),ap=(0,h.getRequestMeta)(a,"isPrefetchRSCRequest")??"1"===a.headers[u.NEXT_ROUTER_PREFETCH_HEADER],aq=(0,h.getRequestMeta)(a,"isRSCRequest")??(0,n.f)(a.headers[u.RSC_HEADER]),ar=(0,t.getIsPossibleServerAction)(a),as=(0,m.checkIsAppPPREnabled)(ae.experimental.ppr)&&(null==(D=_.routes[ah]??_.dynamicRoutes[ah])?void 0:D.renderingMode)==="PARTIALLY_STATIC",at=!1,au=!1,av=as?N:void 0,aw=as&&aq&&!ap,ax=(0,h.getRequestMeta)(a,"segmentPrefetchRSCRequest"),ay=!am||(0,q.shouldServeStreamingMetadata)(am,ae.htmlLimitedBots);ao&&as&&(al=!1,ay=!1);let az=!0===L.isDev||!al||"string"==typeof N||aw,aA=ao&&as,aB=null;aa||!al||az||ar||av||aw||(aB=ab);let aC=aB;!aC&&L.isDev&&(aC=ab),L.isDev||aa||!al||!aq||aw||(0,k.d)(a.headers);let aD={...F,tree:I,pages:J,GlobalError:E(),handler:M,routeModule:L,__next_app__:K};Y&&Z&&(0,p.setReferenceManifestsSingleton)({page:H,clientReferenceManifest:Z,serverActionsManifest:Y,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:Y})});let aE=a.method||"GET",aF=(0,g.getTracer)(),aG=aF.getActiveScopeSpan();try{let f=L.getVaryHeader(ab,af);b.setHeader("Vary",f);let k=async(c,d)=>{let e=new l.NodeNextRequest(a),f=new l.NodeNextResponse(b);return L.render(e,f,d).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=aF.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==i.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${aE} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${aE} ${a.url}`)})},m=async({span:e,postponed:f,fallbackRouteParams:g})=>{let i={query:R,params:S,page:ah,sharedContext:{buildId:Q},serverComponentsHmrCache:(0,h.getRequestMeta)(a,"serverComponentsHmrCache"),fallbackRouteParams:g,renderOpts:{App:()=>null,Document:()=>null,pageConfig:{},ComponentMod:aD,Component:(0,j.T)(aD),params:S,routeModule:L,page:H,postponed:f,shouldWaitOnAllReady:aA,serveStreamingMetadata:ay,supportsDynamicResponse:"string"==typeof f||az,buildManifest:V,nextFontManifest:W,reactLoadableManifest:X,subresourceIntegrityManifest:$,serverActionsManifest:Y,clientReferenceManifest:Z,setIsrStatus:null==ad?void 0:ad.setIsrStatus,dir:c(33873).join(process.cwd(),L.relativeProjectDir),isDraftMode:aa,isRevalidate:al&&!f&&!aw,botType:an,isOnDemandRevalidate:ai,isPossibleServerAction:ar,assetPrefix:ae.assetPrefix,nextConfigOutput:ae.output,crossOrigin:ae.crossOrigin,trailingSlash:ae.trailingSlash,previewProps:_.preview,deploymentId:ae.deploymentId,enableTainting:ae.experimental.taint,htmlLimitedBots:ae.htmlLimitedBots,devtoolSegmentExplorer:ae.experimental.devtoolSegmentExplorer,reactMaxHeadersLength:ae.reactMaxHeadersLength,multiZoneDraftMode:!1,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:ae.experimental.cacheLife,basePath:ae.basePath,serverActions:ae.experimental.serverActions,...at?{nextExport:!0,supportsDynamicResponse:!1,isStaticGeneration:!0,isRevalidate:!0,isDebugDynamicAccesses:at}:{},experimental:{isRoutePPREnabled:as,expireTime:ae.expireTime,staleTimes:ae.experimental.staleTimes,cacheComponents:!!ae.experimental.cacheComponents,clientSegmentCache:!!ae.experimental.clientSegmentCache,clientParamParsing:!!ae.experimental.clientParamParsing,dynamicOnHover:!!ae.experimental.dynamicOnHover,inlineCss:!!ae.experimental.inlineCss,authInterrupts:!!ae.experimental.authInterrupts,clientTraceMetadata:ae.experimental.clientTraceMetadata||[]},waitUntil:d.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:()=>{},onInstrumentationRequestError:(b,c,d)=>L.onRequestError(a,b,d,ad),err:(0,h.getRequestMeta)(a,"invokeError"),dev:L.isDev}},l=await k(e,i),{metadata:m}=l,{cacheControl:n,headers:o={},fetchTags:p}=m;if(p&&(o[z.NEXT_CACHE_TAGS_HEADER]=p),a.fetchMetrics=m.fetchMetrics,al&&(null==n?void 0:n.revalidate)===0&&!L.isDev&&!as){let a=m.staticBailoutInfo,b=Object.defineProperty(Error(`Page changed from static to dynamic at runtime ${ab}${(null==a?void 0:a.description)?`, reason: ${a.description}`:""}
see more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`),"__NEXT_ERROR_CODE",{value:"E132",enumerable:!1,configurable:!0});if(null==a?void 0:a.stack){let c=a.stack;b.stack=b.message+c.substring(c.indexOf("\n"))}throw b}return{value:{kind:w.CachedRouteKind.APP_PAGE,html:l,headers:o,rscData:m.flightData,postponed:m.postponed,status:m.statusCode,segmentData:m.segmentData},cacheControl:n}},n=async({hasResolved:c,previousCacheEntry:f,isRevalidating:g,span:i})=>{let j,k=!1===L.isDev,l=c||b.writableEnded;if(ai&&ac&&!f&&!O)return(null==ad?void 0:ad.render404)?await ad.render404(a,b):(b.statusCode=404,b.end("This page could not be found")),null;if(aj&&(j=(0,x.parseFallbackField)(aj.fallback)),j===x.FallbackMode.PRERENDER&&(0,v.isBot)(am)&&(!as||ao)&&(j=x.FallbackMode.BLOCKING_STATIC_RENDER),(null==f?void 0:f.isStale)===-1&&(ai=!0),ai&&(j!==x.FallbackMode.NOT_FOUND||f)&&(j=x.FallbackMode.BLOCKING_STATIC_RENDER),!O&&j!==x.FallbackMode.BLOCKING_STATIC_RENDER&&aC&&!l&&!aa&&U&&(k||!ak)){let b;if((k||aj)&&j===x.FallbackMode.NOT_FOUND)throw new C.NoFallbackError;if(as&&!aq){let c="string"==typeof(null==aj?void 0:aj.fallback)?aj.fallback:k?ah:null;if(b=await L.handleResponse({cacheKey:c,req:a,nextConfig:ae,routeKind:e.RouteKind.APP_PAGE,isFallback:!0,prerenderManifest:_,isRoutePPREnabled:as,responseGenerator:async()=>m({span:i,postponed:void 0,fallbackRouteParams:k||au?(0,o.u)(ah):null}),waitUntil:d.waitUntil}),null===b)return null;if(b)return delete b.cacheControl,b}}let n=ai||g||!av?void 0:av;if(at&&void 0!==n)return{cacheControl:{revalidate:1,expire:void 0},value:{kind:w.CachedRouteKind.PAGES,html:y.default.EMPTY,pageData:{},headers:void 0,status:void 0}};let p=U&&as&&((0,h.getRequestMeta)(a,"renderFallbackShell")||au)?(0,o.u)(ag):null;return m({span:i,postponed:n,fallbackRouteParams:p})},p=async c=>{var f,g,i,j,k;let l,o=await L.handleResponse({cacheKey:aB,responseGenerator:a=>n({span:c,...a}),routeKind:e.RouteKind.APP_PAGE,isOnDemandRevalidate:ai,isRoutePPREnabled:as,req:a,nextConfig:ae,prerenderManifest:_,waitUntil:d.waitUntil});if(aa&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate"),L.isDev&&b.setHeader("Cache-Control","no-store, must-revalidate"),!o){if(aB)throw Object.defineProperty(Error("invariant: cache entry required but not generated"),"__NEXT_ERROR_CODE",{value:"E62",enumerable:!1,configurable:!0});return null}if((null==(f=o.value)?void 0:f.kind)!==w.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant app-page handler received invalid cache entry ${null==(i=o.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E707",enumerable:!1,configurable:!0});let p="string"==typeof o.value.postponed;al&&!aw&&(!p||ap)&&(O||b.setHeader("x-nextjs-cache",ai?"REVALIDATED":o.isMiss?"MISS":o.isStale?"STALE":"HIT"),b.setHeader(u.NEXT_IS_PRERENDER_HEADER,"1"));let{value:q}=o;if(av)l={revalidate:0,expire:void 0};else if(O&&aq&&!ap&&as)l={revalidate:0,expire:void 0};else if(!L.isDev)if(aa)l={revalidate:0,expire:void 0};else if(al){if(o.cacheControl)if("number"==typeof o.cacheControl.revalidate){if(o.cacheControl.revalidate<1)throw Object.defineProperty(Error(`Invalid revalidate configuration provided: ${o.cacheControl.revalidate} < 1`),"__NEXT_ERROR_CODE",{value:"E22",enumerable:!1,configurable:!0});l={revalidate:o.cacheControl.revalidate,expire:(null==(j=o.cacheControl)?void 0:j.expire)??ae.expireTime}}else l={revalidate:z.CACHE_ONE_YEAR,expire:void 0}}else b.getHeader("Cache-Control")||(l={revalidate:0,expire:void 0});if(o.cacheControl=l,"string"==typeof ax&&(null==q?void 0:q.kind)===w.CachedRouteKind.APP_PAGE&&q.segmentData){b.setHeader(u.NEXT_DID_POSTPONE_HEADER,"2");let c=null==(k=q.headers)?void 0:k[z.NEXT_CACHE_TAGS_HEADER];O&&al&&c&&"string"==typeof c&&b.setHeader(z.NEXT_CACHE_TAGS_HEADER,c);let d=q.segmentData.get(ax);return void 0!==d?(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:y.default.fromStatic(d,u.RSC_CONTENT_TYPE_HEADER),cacheControl:o.cacheControl}):(b.statusCode=204,(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:y.default.EMPTY,cacheControl:o.cacheControl}))}let r=(0,h.getRequestMeta)(a,"onCacheEntry");if(r&&await r({...o,value:{...o.value,kind:"PAGE"}},{url:(0,h.getRequestMeta)(a,"initURL")}))return null;if(p&&av)throw Object.defineProperty(Error("Invariant: postponed state should not be present on a resume request"),"__NEXT_ERROR_CODE",{value:"E396",enumerable:!1,configurable:!0});if(q.headers){let a={...q.headers};for(let[c,d]of(O&&al||delete a[z.NEXT_CACHE_TAGS_HEADER],Object.entries(a)))if(void 0!==d)if(Array.isArray(d))for(let a of d)b.appendHeader(c,a);else"number"==typeof d&&(d=d.toString()),b.appendHeader(c,d)}let s=null==(g=q.headers)?void 0:g[z.NEXT_CACHE_TAGS_HEADER];if(O&&al&&s&&"string"==typeof s&&b.setHeader(z.NEXT_CACHE_TAGS_HEADER,s),!q.status||aq&&as||(b.statusCode=q.status),!O&&q.status&&G.RedirectStatusCode[q.status]&&aq&&(b.statusCode=200),p&&b.setHeader(u.NEXT_DID_POSTPONE_HEADER,"1"),aq&&!aa){if(void 0===q.rscData){if(q.postponed)throw Object.defineProperty(Error("Invariant: Expected postponed to be undefined"),"__NEXT_ERROR_CODE",{value:"E372",enumerable:!1,configurable:!0});return(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:q.html,cacheControl:aw?{revalidate:0,expire:void 0}:o.cacheControl})}return(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:y.default.fromStatic(q.rscData,u.RSC_CONTENT_TYPE_HEADER),cacheControl:o.cacheControl})}let t=q.html;if(!p||O||aq)return(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:t,cacheControl:o.cacheControl});if(at)return t.push(new ReadableStream({start(a){a.enqueue(A.ENCODED_TAGS.CLOSED.BODY_AND_HTML),a.close()}})),(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:t,cacheControl:{revalidate:0,expire:void 0}});let v=new TransformStream;return t.push(v.readable),m({span:c,postponed:q.postponed,fallbackRouteParams:null}).then(async a=>{var b,c;if(!a)throw Object.defineProperty(Error("Invariant: expected a result to be returned"),"__NEXT_ERROR_CODE",{value:"E463",enumerable:!1,configurable:!0});if((null==(b=a.value)?void 0:b.kind)!==w.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant: expected a page response, got ${null==(c=a.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E305",enumerable:!1,configurable:!0});await a.value.html.pipeTo(v.writable)}).catch(a=>{v.writable.abort(a).catch(a=>{console.error("couldn't abort transformer",a)})}),(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:t,cacheControl:{revalidate:0,expire:void 0}})};if(!aG)return await aF.withPropagatedContext(a.headers,()=>aF.trace(i.BaseServerSpan.handleRequest,{spanName:`${aE} ${a.url}`,kind:g.SpanKind.SERVER,attributes:{"http.method":aE,"http.target":a.url}},p));await p(aG)}catch(b){throw b instanceof C.NoFallbackError||await L.onRequestError(a,b,{routerKind:"App Router",routePath:H,routeType:"render",revalidateReason:(0,f.c)({isRevalidate:al,isOnDemandRevalidate:ai})},ad),b}}},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},86197:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>d});let d=(0,c(97954).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\aithi\\\\Downloads\\\\gao-ngon-nextjs\\\\app\\\\ve-chung-toi\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\ve-chung-toi\\page.tsx","default")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},93835:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>q});var d=c(21124),e=c(38301),f=c(9773),g=c(17834),h=c(56044);c(44227);var i=c(3560),j=c.n(i);let k=({children:a})=>(0,d.jsx)("span",{className:"icon",children:a}),l=["Mỗi hạt gạo đến tay kh\xe1ch h\xe0ng đều đi qua quy tr\xecnh chọn lọc, kiểm định v\xe0 bảo quản nghi\xeam ngặt.","Vigen Food hoạt động với tinh thần gắn kết giữa n\xf4ng d\xe2n, nh\xe0 sản xuất v\xe0 người ti\xeau d\xf9ng Việt.","Ch\xfang t\xf4i tập trung x\xe2y dựng gi\xe1 trị bền vững, từ v\xf9ng nguy\xean liệu đến bữa ăn h\xe0ng ng\xe0y."],m=[{year:"2016",title:"Khởi đầu",desc:"Bắt đầu h\xe0nh tr\xecnh chăm ch\xfat cho hạt gạo Việt bằng sự tin tưởng từ người ti\xeau d\xf9ng."},{year:"2018",title:"Ph\xe1t triển",desc:"Mở rộng chuỗi cung ứng v\xe0 n\xe2ng cao ti\xeau chuẩn chọn lọc, đ\xf3ng g\xf3i sản phẩm."},{year:"2021",title:"Mở rộng",desc:"Kết nối với c\xe1c v\xf9ng nguy\xean liệu ưu việt, tăng cường kinh nghiệm phục vụ thị trường."},{year:"2024",title:"Hiện tại",desc:"Tự tin mang hương vị gạo Việt tới nhiều gia đ\xecnh với quy tr\xecnh kiểm so\xe1t chặt chẽ."},{year:"2026",title:"Tương lai",desc:"Tiếp tục ph\xe1t triển bền vững, tạo ra gi\xe1 trị l\xe2u d\xe0i cho cộng đồng v\xe0 kh\xe1ch h\xe0ng."}],n=[{icon:"✦",title:"Tầm nh\xecn",desc:"Trở th\xe0nh thương hiệu gạo Việt đ\xe1ng tin cậy, hiện đại v\xe0 được kh\xe1ch h\xe0ng tin chọn trong từng bữa ăn."},{icon:"◎",title:"Sứ mệnh",desc:"Mang đến sản phẩm gạo chất lượng cao từ v\xf9ng nguy\xean liệu r\xf5 nguồn gốc, an to\xe0n v\xe0 bền vững."},{icon:"✧",title:"Gi\xe1 trị cốt l\xf5i",desc:"Chất lượng, minh bạch v\xe0 sự đồng h\xe0nh l\xe2u d\xe0i c\xf9ng kh\xe1ch h\xe0ng, đối t\xe1c v\xe0 cộng đồng."}],o=[{value:8,suffix:"+",label:"Năm kinh nghiệm"},{value:40,suffix:"+",label:"Sản phẩm"},{value:120,suffix:"+",label:"Đối t\xe1c"},{value:25,suffix:"k+",label:"Kh\xe1ch h\xe0ng"}],p=[{icon:"✓",title:"Chất lượng",desc:"Từng l\xf4 h\xe0ng đều được kiểm tra chặt chẽ trước khi đến tay người ti\xeau d\xf9ng."},{icon:"◌",title:"Minh bạch",desc:"Th\xf4ng tin nguồn gốc, quy tr\xecnh v\xe0 ti\xeau chuẩn sản phẩm được m\xf4 tả r\xf5 r\xe0ng v\xe0 dễ hiểu."},{icon:"♡",title:"Đồng h\xe0nh",desc:"Lu\xf4n lắng nghe phản hồi, phục vụ kh\xe1ch h\xe0ng bằng sự nhiệt t\xecnh v\xe0 chuy\xean nghiệp."},{icon:"\uD83C\uDF3F",title:"Bền vững",desc:"Hướng tới ph\xe1t triển bền vững, giữ g\xecn m\xf4i trường v\xe0 hỗ trợ cộng đồng n\xf4ng nghiệp."}];function q(){let[a,b]=(0,e.useState)(!1),[c,i]=(0,e.useState)(null),[q,r]=(0,e.useState)(!1),[s,t]=(0,e.useState)(0),[u,v]=(0,e.useState)(!1),[w,x]=(0,e.useState)(!1);return(0,d.jsxs)("main",{className:`about-page ${j().pageRoot}`,children:[(0,d.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        .about-page {
          min-height: 100vh;
          background:
            linear-gradient(180deg, rgba(13, 35, 25, 0.78), rgba(13, 35, 25, 0.78)),
            radial-gradient(circle at top, rgba(216,180,90,0.16), transparent 24%),
            linear-gradient(180deg, #0f2c1e 0%, #163c2a 22%, #174530 38%, #1d4d35 54%, #0f2d20 100%);
          color: #173524;
          font-family: Inter, sans-serif;
        }

        .about-page * { box-sizing: border-box; }

        .about-page > .topbar,
        .about-page > .header {
          color: var(--white);
        }

        .about-page > .header .nav a {
          color: rgba(255, 255, 255, .88);
        }

        .about-page > .header .search input {
          width: 100%;
          border: 0;
          outline: 0;
          color: var(--white);
          background: transparent;
          font-size: 12px;
        }

        .about-page > .header .search input::placeholder {
          color: rgba(255, 255, 255, .5);
        }

        .about-page > .header .search-icon {
          color: rgba(255, 255, 255, .72);
        }

        .about-page > .header .logo {
          min-width: 255px;
          gap: 0;
        }

        .about-page > .header .logo-mark {
          width: 51px;
          height: 51px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(205, 170, 74, .35), rgba(17, 38, 24, .8));
          font-size: 27px;
        }

        .about-page > .header .logo-text {
          line-height: normal;
          margin-left: 11px;
        }

        .about-page > .header .logo-text strong {
          font: 600 24px "Cormorant Garamond";
          letter-spacing: .5px;
        }

        .about-page > .header .logo-text small {
          color: inherit;
          font: italic 13px "Cormorant Garamond";
          letter-spacing: normal;
        }

        .reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .user-header {
          position: relative;
          z-index: 30;
          width: min(1200px, calc(100% - 32px));
          margin: 18px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          border: 1px solid rgba(221, 211, 163, 0.3);
          border-radius: 28px;
          background: rgba(9, 24, 17, 0.66);
          backdrop-filter: blur(12px);
          box-shadow: 0 18px 40px rgba(12, 19, 14, 0.18);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #fff;
          text-decoration: none;
        }

        .logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(216,180,90,0.42), rgba(17,41,27,0.8));
          border: 1px solid rgba(216,180,90,0.45);
          font-size: 24px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
        }

        .logo-text strong {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          font-weight: 700;
        }

        .logo-text small {
          color: rgba(255,255,255,0.7);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
        }

        .catalog-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .catalog-nav a {
          color: rgba(255,255,255,0.9);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 0 8px;
          border-bottom: 2px solid transparent;
          transition: color 0.25s ease, border-color 0.25s ease;
        }

        .catalog-nav a.active,
        .catalog-nav a:hover {
          color: #f1d57d;
          border-color: #f1d57d;
        }

        .header-cta {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .about-hero {
          position: relative;
          width: 100%;
          max-width: none;
          margin: 0;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: 14px;
          min-height: 760px;
          padding: 48px 72px 52px;
          background:
            linear-gradient(90deg, rgba(8, 25, 17, 0.78) 0%, rgba(9, 30, 21, 0.72) 30%, rgba(9, 30, 21, 0.58) 52%, rgba(9, 30, 21, 0.12) 100%),
            url('/images/rice-landscape.png') center center / cover no-repeat;
          border-bottom: 1px solid rgba(218, 184, 91, 0.18);
        }

        .about-hero-content {
          max-width: 520px;
          color: #f9f4eb;
          padding-left: 8px;
          padding-right: 10px;
        }

        .mini-badge,
        .section-kicker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(236, 194, 92, 0.8);
          background: rgba(236, 194, 92, 0.12);
          color: #f0cf77;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .about-hero h1 {
          margin-top: 26px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3.5rem, 6vw, 6.5rem);
          line-height: 0.86;
          color: #f5f1e8;
          letter-spacing: -0.03em;
        }

        .about-hero p {
          margin-top: 22px;
          max-width: 560px;
          font-size: 1.06rem;
          line-height: 1.8;
          color: rgba(255,255,255,0.82);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px;
          margin-top: 28px;
        }

        .primary-btn,
        .secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 26px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .primary-btn {
          background: linear-gradient(135deg, #d7b45d, #f0ce69);
          color: #10251a;
          box-shadow: 0 14px 28px rgba(215,180,93,0.28);
        }

        .secondary-btn {
          background: rgba(7, 24, 17, 0.46);
          border-color: rgba(216,180,90,0.34);
          color: #f3e7c8;
        }

        .primary-btn:hover,
        .secondary-btn:hover {
          transform: translateY(-2px);
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .hero-trust span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.82);
          font-size: 0.76rem;
          font-weight: 600;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          width: 100%;
          min-height: 620px;
          padding-right: 12px;
        }

        .hero-visual::before {
          content: "";
          position: absolute;
          right: 36px;
          bottom: 8px;
          width: min(78%, 620px);
          height: 78%;
          border-radius: 32px;
          background:
            linear-gradient(180deg, rgba(16, 41, 28, 0.12), rgba(16, 41, 28, 0.22)),
            url('/images/rice-landscape.png') center 62% / cover no-repeat;
          opacity: 0.7;
          filter: saturate(1.1);
          box-shadow: inset 0 0 0 1px rgba(216,180,90,0.15);
        }

        .hero-frame {
          position: relative;
          z-index: 1;
          width: min(100%, 680px);
          min-height: 540px;
          padding: 0;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(17, 42, 30, 0.12);
          border: 1px solid rgba(216,180,90,0.18);
          box-shadow: 0 26px 60px rgba(9, 18, 14, 0.22);
        }

        .hero-frame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12,26,20,0.02), rgba(12,26,20,0.06));
          pointer-events: none;
        }

        .hero-frame img {
          display: block;
          width: 100%;
          height: 540px;
          object-fit: contain;
          object-position: center center;
          border-radius: 28px;
          transform: none;
          margin: 0 auto;
          background: rgba(255,255,255,0.02);
        }

        .floating-card {
          position: absolute;
          right: 18px;
          bottom: 20px;
          z-index: 2;
          width: min(100%, 220px);
          margin: 0;
          padding: 18px 18px 16px;
          border-radius: 20px;
          background: rgba(10, 24, 17, 0.84);
          border: 1px solid rgba(216,180,90,0.28);
          color: #f6f0e7;
          backdrop-filter: blur(2px);
          box-shadow: 0 18px 38px rgba(0,0,0,0.22);
        }

        .floating-card strong {
          display: block;
          font-size: 1.4rem;
          color: #f0ce69;
        }

        .floating-card span {
          display: block;
          margin-top: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 0.8rem;
          line-height: 1.7;
        }

        .content-section {
          width: min(1900px, calc(100% - 40px));
          margin: 10px;
          padding: 110px 0 0;
        }

        #story {
          width: min(1900px, calc(100% - 40px));
          padding: 58px 48px 56px;
          border: 1px solid rgba(218, 184, 91, 0.18);
          border-radius: 28px;
          background: rgba(10, 29, 20, 0.34);
        }

        .section-heading {
          max-width: 720px;
          margin-bottom: 44px;
        }

        #story .section-heading {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          max-width: none;
          margin: 0 auto 48px;
          overflow: visible;
        }

        #story .section-heading h2 {
          width: 100%;
          max-width: none;
          min-width: 0;
          font-size: clamp(2.4rem, 4vw, 4.4rem);
          line-height: 1.08;
          letter-spacing: -0.04em;
          margin: 0;
          word-break: normal;
          white-space: nowrap;
        }

        .mission-section .section-heading,
        .timeline-section .section-heading {
          display: flex;
          align-items: center;
          gap: 18px;
          width: min(1800px, 100%);
          max-width: none;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .section-description {
          max-width: 100%;
          margin-top: 0;
          margin-bottom: 32px;
          color: rgba(241, 234, 214, 0.8);
          font-size: 1.02rem;
          line-height: 1.8;
        }

        .mission-section .section-description {
          max-width: 1180px;
          margin-bottom: 32px;
        }

        .section-heading h2 {
          margin-top: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.8rem, 3.8vw, 4.5rem);
          line-height: 0.98;
          letter-spacing: -0.04em;
          font-weight: 600;
          color: #f3e8d1;
        }

        #story .section-heading h2 {
          margin-top: -10px;
          font-style: normal;
        }

        .mission-section .section-heading h2,
        .timeline-section .section-heading h2 {
          margin-top: -20px;
          flex: 1 1 620px;
          min-width: 0;
          font-size: clamp(3rem, 4vw, 5rem);
          line-height: 0.92;
          letter-spacing: -0.045em;
          font-style: normal;
        }

        .story-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 40px 48px;
          align-items: stretch;
        }

        .story-visual {
          position: relative;
          min-height: 0;
        }

        .story-image-wrap .section-kicker {
          position: absolute;
          top: 18px;
          left: 18px;
          z-index: 2;
          width: fit-content;
          padding: 8px 14px;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          background: rgba(9, 24, 17, 0.72);
          backdrop-filter: blur(8px);
        }

        .story-image-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 28px;
          box-shadow: 0 24px 58px rgba(8, 17, 14, 0.24);
          border: 1px solid rgba(218, 184, 91, 0.22);
        }

        .story-image-wrap img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 45%;
        }

        .story-badges {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .story-badges span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(9, 24, 17, 0.7);
          border: 1px solid rgba(216,180,90,0.2);
          color: #f1db9d;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .story-copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          min-height: 100%;
          padding: 4px 0 2px;
        }

        .story-copy-body {
          display: grid;
          gap: 16px;
        }

        .story-copy p {
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
          font-size: 1.02rem;
        }

        .story-copy ul {
          list-style: none;
          display: grid;
          gap: 12px;
          padding: 0;
          margin: 0;
        }

        .story-copy li {
          position: relative;
          padding-left: 28px;
          color: rgba(245, 239, 219, 0.9);
          line-height: 1.75;
          font-size: 1rem;
        }

        .story-copy li::before {
          content: "✓";
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(212, 188, 96, 0.14);
          color: #f0ce69;
          font-weight: 800;
        }

        .highlight-box {
          margin-top: 8px;
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid rgba(218, 184, 91, 0.22);
          background: rgba(250, 244, 230, 0.05);
          color: #f0ce69;
          font-family: Inter, sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1.55;
        }

        .timeline {
          position: relative;
          width: min(1220px, calc(100% - 30px));
          display: grid;
          gap: 18px;
          margin: 40px auto 0;
          padding: 24px 18px 8px;
          border-radius: 28px;
          background: rgba(18, 42, 31, 0.16);
          border: 1px solid rgba(218, 184, 91, 0.14);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
        }

        .timeline:before {
          content: "";
          position: absolute;
          left: 77px;
          top: 18px;
          bottom: 18px;
          width: 2px;
          background: linear-gradient(180deg, rgba(52,83,62,0.18), rgba(215,180,93,0.7), rgba(52,83,62,0.18));
        }

        .timeline-item {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 26px;
          align-items: center;
          min-height: 116px;
        }

        .timeline-year {
          position: relative;
          z-index: 1;
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0e2a1d, #1c4a32);
          color: #f0ce69;
          font-weight: 800;
          border: 2px solid rgba(216,180,90,0.45);
          box-shadow: 0 12px 24px rgba(16, 37, 26, 0.12);
        }

        .timeline-card {
          padding: 18px 26px;
          border-radius: 20px;
          background: rgba(223, 229, 212, 0.12);
          border: 1px solid rgba(209, 177, 90, 0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .timeline-card h3 {
          margin-bottom: 8px;
          color: #f5efdf;
          font-size: 1.8rem;
          font-family: "Cormorant Garamond", serif;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .timeline-card p {
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
          font-size: 1.04rem;
        }

        .mission-section {
          position: relative;
          overflow: hidden;
          width: min(1900px, calc(100% - 40px));
          margin-top: 48px;
          padding: 58px 48px 56px;
          border: 1px solid rgba(218, 184, 91, 0.18);
          border-radius: 28px;
          background: linear-gradient(rgba(7, 30, 21, 0.84), rgba(7, 30, 21, 0.9)), url('/images/rice-landscape.png') center / cover no-repeat;
          background-attachment: fixed;
        }

        .timeline-section {
          position: relative;
          overflow: hidden;
          width: min(1900px, calc(100% - 40px));
          margin-top: 48px;
          padding: 58px 48px 56px;
          border: 1px solid rgba(218, 184, 91, 0.18);
          border-radius: 28px;
          background:
            linear-gradient(90deg, rgba(7, 30, 21, 0.9), rgba(7, 30, 21, 0.72)),
            url('/images/rice-landscape.png') center / cover no-repeat;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          margin-top: 18px;
        }

        .value-card {
          padding: 36px 28px 32px;
          border-radius: 24px;
          border: 1px solid rgba(209, 177, 90, 0.14);
          background: linear-gradient(180deg, rgba(218, 208, 170, 0.14), rgba(194, 188, 143, 0.22));
          box-shadow: 0 16px 30px rgba(17, 34, 24, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          border-color: rgba(216,180,90,0.9);
          box-shadow: 0 26px 40px rgba(17, 34, 24, 0.12);
        }

        .value-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(216,180,90,0.16), rgba(20,56,38,0.10));
          color: #f0d47d;
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .value-card h3 {
          margin-bottom: 12px;
          color: #f4e9cc;
          font-family: "Cormorant Garamond", serif;
          font-size: 2.2rem;
        }

        .value-card p {
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
        }

        .stats-section {
          margin-top: 110px;
          padding: 86px 5%;
          background: linear-gradient(135deg, #112d1e 0%, #1a3d2d 100%);
          color: #f7f3ea;
        }

        .stats-grid {
          width: min(1200px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .stat-card {
          padding: 30px 16px;
          text-align: center;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(216,180,90,0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .stat-card strong {
          display: block;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #f0ce69;
          font-weight: 800;
          line-height: 1;
        }

        .stat-card span {
          display: block;
          margin-top: 12px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .commitment-section {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 110px 0 120px;
        }

        .commitment-header {
          max-width: 900px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .commitment-header h2 {
          margin-top: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.8rem, 4vw, 4.1rem);
          color: #f3e8d1;
          line-height: 1.02;
        }

        .commitment-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .commitment-card {
          padding: 30px 22px;
          border-radius: 22px;
          background: rgba(218, 208, 170, 0.12);
          border: 1px solid rgba(209, 177, 90, 0.14);
          box-shadow: 0 14px 30px rgba(17, 34, 24, 0.05);
        }

        .commitment-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: rgba(216,180,90,0.12);
          color: #9d7a29;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .commitment-card h3 {
          margin-top: 18px;
          font-size: 1.5rem;
          color: #f4e9cc;
        }

        .commitment-card p {
          margin-top: 12px;
          color: rgba(245, 239, 219, 0.82);
          line-height: 1.8;
        }

        .footer {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 30px 0 80px;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.3fr;
          gap: 28px;
          border-top: 1px solid rgba(221, 211, 163, 0.18);
          color: rgba(245, 239, 219, 0.88);
          background: rgba(11, 25, 17, 0.38);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f5f0df;
        }

        .footer h3 {
          margin-bottom: 16px;
          color: #f0d882;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footer a,
        .footer p {
          display: block;
          margin-bottom: 10px;
          color: rgba(239, 234, 214, 0.8);
          text-decoration: none;
          line-height: 1.8;
        }

        @media (max-width: 1000px) {
          .about-hero {
            grid-template-columns: 1fr;
            padding-top: 160px;
            padding-left: 28px;
            padding-right: 28px;
          }

          #story {
            padding: 42px 28px 40px;
          }

          .mission-section {
            padding: 42px 28px 40px;
          }

          .timeline-section {
            padding: 42px 28px 40px;
          }

          .about-hero-content {
            max-width: 100%;
            padding-left: 0;
            padding-right: 0;
          }

          .hero-visual {
            justify-content: flex-start;
            padding-right: 0;
          }

          .hero-visual::before {
            right: 12px;
            width: 78%;
            height: 74%;
          }

          #story .section-heading {
            margin-bottom: 32px;
          }

          .story-layout {
            gap: 28px;
          }

          .mission-section .section-heading,
          .timeline-section .section-heading {
            display: block;
          }

          .mission-section .section-heading h2,
          .timeline-section .section-heading h2 {
            margin-top: 18px;
            font-size: clamp(2.6rem, 6vw, 4rem);
          }

          .story-layout,
          .value-grid,
          .commitment-grid,
          .stats-grid,
          .footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 700px) {
          .user-header {
            width: calc(100% - 18px);
            padding: 14px 18px;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
          }

          .catalog-nav {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px 18px;
          }

          .about-hero {
            min-height: 680px;
            padding: 140px 20px 28px;
          }

          #story {
            width: calc(100% - 20px);
            padding: 32px 20px 28px;
          }

          .mission-section {
            width: calc(100% - 20px);
            padding: 32px 20px 28px;
          }

          .timeline-section {
            width: calc(100% - 20px);
            padding: 32px 20px 28px;
          }

          .about-hero h1 {
            font-size: clamp(2.8rem, 11vw, 4.4rem);
          }

          .story-layout,
          .value-grid,
          .commitment-grid,
          .stats-grid,
          .footer {
            grid-template-columns: 1fr;
          }

          .timeline {
            width: calc(100% - 18px);
          }

          .timeline-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .timeline:before {
            left: 30px;
          }

          .timeline-year {
            margin-left: 0;
          }

          .story-visual {
            min-height: 280px;
          }

          .story-image-wrap {
            position: relative;
            inset: auto;
            min-height: 280px;
            height: 320px;
          }

          .story-image-wrap img {
            min-height: 280px;
            height: 320px;
          }

          #story .section-heading h2 {
            white-space: normal;
          }
        }
      `}}),(0,d.jsx)("div",{className:"topbar",children:(0,d.jsxs)("div",{className:"topbar-track",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)(k,{children:"\uD83D\uDE9A"})," Giao h\xe0ng to\xe0n quốc"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(k,{children:"\uD83D\uDEE1"})," Kiểm tra h\xe0ng trước khi thanh to\xe1n"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(k,{children:"♧"})," Tư vấn 24/7: 1900 1234"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(k,{children:"\uD83D\uDE9A"})," Giao h\xe0ng to\xe0n quốc"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(k,{children:"\uD83D\uDEE1"})," Kiểm tra h\xe0ng trước khi thanh to\xe1n"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(k,{children:"♧"})," Tư vấn 24/7: 1900 1234"]})]})}),(0,d.jsx)(h.A,{active:"about"}),(0,d.jsxs)("section",{className:"about-hero",children:[(0,d.jsxs)("div",{className:"about-hero-content reveal",children:[(0,d.jsx)("span",{className:"mini-badge",children:"Về ch\xfang t\xf4i"}),(0,d.jsx)("h1",{children:"Kiến tạo gi\xe1 trị từ hạt gạo Việt"}),(0,d.jsx)("p",{children:"Vigen Food l\xe0 thương hiệu gạo Việt hướng tới việc mang đến những sản phẩm chất lượng cao, gi\xe0u dinh dưỡng v\xe0 đ\xe1ng tin cậy cho từng bữa ăn của gia đ\xecnh Việt Nam."}),(0,d.jsxs)("div",{className:"hero-actions",children:[(0,d.jsx)("button",{type:"button",className:"primary-btn",onClick:()=>b(!0),children:"Kh\xe1m ph\xe1 c\xe2u chuyện"}),(0,d.jsx)("button",{type:"button",className:"secondary-btn",children:"Li\xean hệ ch\xfang t\xf4i"})]}),(0,d.jsxs)("div",{className:"hero-trust",children:[(0,d.jsx)("span",{children:"Nguy\xean liệu r\xf5 nguồn gốc"}),(0,d.jsx)("span",{children:"Chất lượng kiểm so\xe1t"}),(0,d.jsx)("span",{children:"Đồng h\xe0nh bền vững"})]})]}),(0,d.jsxs)("div",{className:"hero-visual reveal",children:[(0,d.jsx)("div",{className:"hero-frame",children:(0,d.jsx)("img",{src:"/images/vigenfood.png",alt:"Gạo Vigen Food"})}),(0,d.jsxs)("div",{className:"floating-card",children:[(0,d.jsx)("strong",{children:"100%"}),(0,d.jsx)("span",{children:"Ti\xeau chuẩn chất lượng từ nguy\xean liệu đến sản phẩm cuối c\xf9ng."})]})]})]}),(0,d.jsxs)("section",{id:"story",className:"content-section",children:[(0,d.jsx)("div",{className:"section-heading reveal",children:(0,d.jsx)("h2",{children:"Chất lượng l\xe0 nền tảng – Uy t\xedn l\xe0 cam kết."})}),(0,d.jsxs)("div",{className:"story-layout reveal",children:[(0,d.jsx)("div",{className:"story-visual",children:(0,d.jsxs)("div",{className:"story-image-wrap",children:[(0,d.jsx)("span",{className:"section-kicker",children:"C\xe2u chuyện"}),(0,d.jsx)("img",{src:"/images/rice-landscape.png",alt:"Ruộng gạo Việt"}),(0,d.jsxs)("div",{className:"story-badges",children:[(0,d.jsx)("span",{children:"Nguy\xean liệu r\xf5 r\xe0ng"}),(0,d.jsx)("span",{children:"Chất lượng kiểm so\xe1t"}),(0,d.jsx)("span",{children:"Đồng h\xe0nh bền vững"})]})]})}),(0,d.jsxs)("div",{className:"story-copy",children:[(0,d.jsxs)("div",{className:"story-copy-body",children:[(0,d.jsx)("p",{children:"Vigen Food hướng tới việc mang đến những sản phẩm gạo Việt c\xf3 chất lượng tốt nhất, đ\xe1p ứng ti\xeau chuẩn an to\xe0n v\xe0 cam kết với từng bữa ăn gia đ\xecnh."}),(0,d.jsx)("p",{children:"Ch\xfang t\xf4i gắn kết c\xe1c nguồn nguy\xean liệu, quy tr\xecnh kiểm so\xe1t v\xe0 đội ngũ chuy\xean m\xf4n để tạo ra những sản phẩm gạo an to\xe0n, gi\xe0u dinh dưỡng v\xe0 ph\xf9 hợp với nhu cầu ti\xeau d\xf9ng hiện đại của người Việt."}),(0,d.jsx)("ul",{children:l.map(a=>(0,d.jsx)("li",{children:a},a))})]}),(0,d.jsx)("div",{className:"highlight-box",children:"Từ v\xf9ng nguy\xean liệu đến bữa cơm gia đ\xecnh — kiểm so\xe1t chặt chẽ từng bước."})]})]})]}),(0,d.jsxs)("section",{className:"mission-section content-section",children:[(0,d.jsxs)("div",{className:"section-heading reveal",children:[(0,d.jsx)("span",{className:"section-kicker",children:"Sứ mệnh"}),(0,d.jsx)("h2",{children:"Đặt chất lượng l\xean h\xe0ng đầu"})]}),(0,d.jsx)("p",{className:"section-description reveal",children:"Ch\xfang t\xf4i tin rằng một bữa cơm ngon kh\xf4ng chỉ l\xe0 hạt gạo đẹp, m\xe0 c\xf2n l\xe0 sự tin tưởng từ nguồn nguy\xean liệu, quy tr\xecnh sản xuất tới niềm vui của mỗi gia đ\xecnh khi thưởng thức."}),(0,d.jsx)("div",{className:"value-grid reveal",children:n.map(a=>(0,d.jsxs)("article",{className:"value-card",children:[(0,d.jsx)("div",{className:"value-icon","aria-hidden":"true",children:a.icon}),(0,d.jsx)("h3",{children:a.title}),(0,d.jsx)("p",{children:a.desc})]},a.title))})]}),(0,d.jsxs)("section",{className:"timeline-section content-section",children:[(0,d.jsxs)("div",{className:"section-heading reveal",children:[(0,d.jsx)("span",{className:"section-kicker",children:"Lộ tr\xecnh"}),(0,d.jsx)("h2",{children:"H\xe0nh tr\xecnh ph\xe1t triển"})]}),(0,d.jsx)("div",{className:"timeline reveal",children:m.map(a=>(0,d.jsxs)("div",{className:"timeline-item",children:[(0,d.jsx)("div",{className:"timeline-year",children:a.year}),(0,d.jsxs)("div",{className:"timeline-card",children:[(0,d.jsx)("h3",{children:a.title}),(0,d.jsx)("p",{children:a.desc})]})]},a.year))})]}),(0,d.jsx)("section",{className:"stats-section reveal",children:(0,d.jsx)("div",{className:"stats-grid",children:o.map(a=>(0,d.jsxs)("div",{className:"stat-card",children:[(0,d.jsxs)("strong",{"data-target":a.value,"data-suffix":a.suffix,children:[0,a.suffix]}),(0,d.jsx)("span",{children:a.label})]},a.label))})}),(0,d.jsxs)("section",{className:"commitment-section",children:[(0,d.jsxs)("div",{className:"commitment-header reveal",children:[(0,d.jsx)("span",{className:"section-kicker",children:"Cam kết"}),(0,d.jsx)("h2",{children:"Gi\xe1 trị m\xe0 ch\xfang t\xf4i mang đến"})]}),(0,d.jsx)("div",{className:"commitment-grid reveal",children:p.map(a=>(0,d.jsxs)("article",{className:"commitment-card",children:[(0,d.jsx)("div",{className:"commitment-icon","aria-hidden":"true",children:a.icon}),(0,d.jsx)("h3",{children:a.title}),(0,d.jsx)("p",{children:a.desc})]},a.title))})]}),(0,d.jsx)(g.A,{}),(0,d.jsx)(f.A,{open:a,onClose:()=>b(!1)})]})}}};var b=require("../../webpack-runtime.js");b.C(a);var c=b.X(0,[833,648,283],()=>b(b.s=40942));module.exports=c})();