(()=>{var a={};a.id=35,a.ids=[35],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},22840:(a,b,c)=>{Promise.resolve().then(c.bind(c,83711))},23512:(a,b,c)=>{Promise.resolve().then(c.bind(c,53525))},26713:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/is-bot")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},32862:(a,b,c)=>{"use strict";c.r(b),c.d(b,{GlobalError:()=>E.a,__next_app__:()=>K,handler:()=>M,pages:()=>J,routeModule:()=>L,tree:()=>I});var d=c(49754),e=c(9117),f=c(46595),g=c(32324),h=c(39326),i=c(38928),j=c(20175),k=c(12),l=c(54290),m=c(12696),n=c(52574),o=c(82802),p=c(77533),q=c(45229),r=c(32822),s=c(261),t=c(26453),u=c(52474),v=c(26713),w=c(51356),x=c(62685),y=c(36225),z=c(63446),A=c(2762),B=c(45742),C=c(86439),D=c(81170),E=c.n(D),F=c(62506),G=c(91203),H={};for(let a in F)0>["default","tree","pages","GlobalError","__next_app__","routeModule","handler"].indexOf(a)&&(H[a]=()=>F[a]);c.d(b,H);let I={children:["",{children:["tin-tuc",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(c.bind(c,83711)),"C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\tin-tuc\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(c.bind(c,16953)),"C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\layout.tsx"],"global-error":[()=>Promise.resolve().then(c.t.bind(c,81170,23)),"next/dist/client/components/builtin/global-error.js"],"not-found":[()=>Promise.resolve().then(c.t.bind(c,87028,23)),"next/dist/client/components/builtin/not-found.js"],forbidden:[()=>Promise.resolve().then(c.t.bind(c,90461,23)),"next/dist/client/components/builtin/forbidden.js"],unauthorized:[()=>Promise.resolve().then(c.t.bind(c,32768,23)),"next/dist/client/components/builtin/unauthorized.js"]}]}.children,J=["C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\tin-tuc\\page.tsx"],K={require:c,loadChunk:()=>Promise.resolve()},L=new d.AppPageRouteModule({definition:{kind:e.RouteKind.APP_PAGE,page:"/tin-tuc/page",pathname:"/tin-tuc",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:I},distDir:".next",relativeProjectDir:""});async function M(a,b,d){var D;let H="/tin-tuc/page";"/index"===H&&(H="/");let N=(0,h.getRequestMeta)(a,"postponed"),O=(0,h.getRequestMeta)(a,"minimalMode"),P=await L.prepare(a,b,{srcPage:H,multiZoneDraftMode:!1});if(!P)return b.statusCode=400,b.end("Bad Request"),null==d.waitUntil||d.waitUntil.call(d,Promise.resolve()),null;let{buildId:Q,query:R,params:S,parsedUrl:T,pageIsDynamic:U,buildManifest:V,nextFontManifest:W,reactLoadableManifest:X,serverActionsManifest:Y,clientReferenceManifest:Z,subresourceIntegrityManifest:$,prerenderManifest:_,isDraftMode:aa,resolvedPathname:ab,revalidateOnlyGenerated:ac,routerServerContext:ad,nextConfig:ae,interceptionRoutePatterns:af}=P,ag=T.pathname||"/",ah=(0,s.normalizeAppPath)(H),{isOnDemandRevalidate:ai}=P,aj=L.match(ag,_),ak=!!_.routes[ab],al=!!(aj||ak||_.routes[ah]),am=a.headers["user-agent"]||"",an=(0,v.getBotType)(am),ao=(0,q.isHtmlBotRequest)(a),ap=(0,h.getRequestMeta)(a,"isPrefetchRSCRequest")??"1"===a.headers[u.NEXT_ROUTER_PREFETCH_HEADER],aq=(0,h.getRequestMeta)(a,"isRSCRequest")??(0,n.f)(a.headers[u.RSC_HEADER]),ar=(0,t.getIsPossibleServerAction)(a),as=(0,m.checkIsAppPPREnabled)(ae.experimental.ppr)&&(null==(D=_.routes[ah]??_.dynamicRoutes[ah])?void 0:D.renderingMode)==="PARTIALLY_STATIC",at=!1,au=!1,av=as?N:void 0,aw=as&&aq&&!ap,ax=(0,h.getRequestMeta)(a,"segmentPrefetchRSCRequest"),ay=!am||(0,q.shouldServeStreamingMetadata)(am,ae.htmlLimitedBots);ao&&as&&(al=!1,ay=!1);let az=!0===L.isDev||!al||"string"==typeof N||aw,aA=ao&&as,aB=null;aa||!al||az||ar||av||aw||(aB=ab);let aC=aB;!aC&&L.isDev&&(aC=ab),L.isDev||aa||!al||!aq||aw||(0,k.d)(a.headers);let aD={...F,tree:I,pages:J,GlobalError:E(),handler:M,routeModule:L,__next_app__:K};Y&&Z&&(0,p.setReferenceManifestsSingleton)({page:H,clientReferenceManifest:Z,serverActionsManifest:Y,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:Y})});let aE=a.method||"GET",aF=(0,g.getTracer)(),aG=aF.getActiveScopeSpan();try{let f=L.getVaryHeader(ab,af);b.setHeader("Vary",f);let k=async(c,d)=>{let e=new l.NodeNextRequest(a),f=new l.NodeNextResponse(b);return L.render(e,f,d).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=aF.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==i.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${aE} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${aE} ${a.url}`)})},m=async({span:e,postponed:f,fallbackRouteParams:g})=>{let i={query:R,params:S,page:ah,sharedContext:{buildId:Q},serverComponentsHmrCache:(0,h.getRequestMeta)(a,"serverComponentsHmrCache"),fallbackRouteParams:g,renderOpts:{App:()=>null,Document:()=>null,pageConfig:{},ComponentMod:aD,Component:(0,j.T)(aD),params:S,routeModule:L,page:H,postponed:f,shouldWaitOnAllReady:aA,serveStreamingMetadata:ay,supportsDynamicResponse:"string"==typeof f||az,buildManifest:V,nextFontManifest:W,reactLoadableManifest:X,subresourceIntegrityManifest:$,serverActionsManifest:Y,clientReferenceManifest:Z,setIsrStatus:null==ad?void 0:ad.setIsrStatus,dir:c(33873).join(process.cwd(),L.relativeProjectDir),isDraftMode:aa,isRevalidate:al&&!f&&!aw,botType:an,isOnDemandRevalidate:ai,isPossibleServerAction:ar,assetPrefix:ae.assetPrefix,nextConfigOutput:ae.output,crossOrigin:ae.crossOrigin,trailingSlash:ae.trailingSlash,previewProps:_.preview,deploymentId:ae.deploymentId,enableTainting:ae.experimental.taint,htmlLimitedBots:ae.htmlLimitedBots,devtoolSegmentExplorer:ae.experimental.devtoolSegmentExplorer,reactMaxHeadersLength:ae.reactMaxHeadersLength,multiZoneDraftMode:!1,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:ae.experimental.cacheLife,basePath:ae.basePath,serverActions:ae.experimental.serverActions,...at?{nextExport:!0,supportsDynamicResponse:!1,isStaticGeneration:!0,isRevalidate:!0,isDebugDynamicAccesses:at}:{},experimental:{isRoutePPREnabled:as,expireTime:ae.expireTime,staleTimes:ae.experimental.staleTimes,cacheComponents:!!ae.experimental.cacheComponents,clientSegmentCache:!!ae.experimental.clientSegmentCache,clientParamParsing:!!ae.experimental.clientParamParsing,dynamicOnHover:!!ae.experimental.dynamicOnHover,inlineCss:!!ae.experimental.inlineCss,authInterrupts:!!ae.experimental.authInterrupts,clientTraceMetadata:ae.experimental.clientTraceMetadata||[]},waitUntil:d.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:()=>{},onInstrumentationRequestError:(b,c,d)=>L.onRequestError(a,b,d,ad),err:(0,h.getRequestMeta)(a,"invokeError"),dev:L.isDev}},l=await k(e,i),{metadata:m}=l,{cacheControl:n,headers:o={},fetchTags:p}=m;if(p&&(o[z.NEXT_CACHE_TAGS_HEADER]=p),a.fetchMetrics=m.fetchMetrics,al&&(null==n?void 0:n.revalidate)===0&&!L.isDev&&!as){let a=m.staticBailoutInfo,b=Object.defineProperty(Error(`Page changed from static to dynamic at runtime ${ab}${(null==a?void 0:a.description)?`, reason: ${a.description}`:""}
see more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`),"__NEXT_ERROR_CODE",{value:"E132",enumerable:!1,configurable:!0});if(null==a?void 0:a.stack){let c=a.stack;b.stack=b.message+c.substring(c.indexOf("\n"))}throw b}return{value:{kind:w.CachedRouteKind.APP_PAGE,html:l,headers:o,rscData:m.flightData,postponed:m.postponed,status:m.statusCode,segmentData:m.segmentData},cacheControl:n}},n=async({hasResolved:c,previousCacheEntry:f,isRevalidating:g,span:i})=>{let j,k=!1===L.isDev,l=c||b.writableEnded;if(ai&&ac&&!f&&!O)return(null==ad?void 0:ad.render404)?await ad.render404(a,b):(b.statusCode=404,b.end("This page could not be found")),null;if(aj&&(j=(0,x.parseFallbackField)(aj.fallback)),j===x.FallbackMode.PRERENDER&&(0,v.isBot)(am)&&(!as||ao)&&(j=x.FallbackMode.BLOCKING_STATIC_RENDER),(null==f?void 0:f.isStale)===-1&&(ai=!0),ai&&(j!==x.FallbackMode.NOT_FOUND||f)&&(j=x.FallbackMode.BLOCKING_STATIC_RENDER),!O&&j!==x.FallbackMode.BLOCKING_STATIC_RENDER&&aC&&!l&&!aa&&U&&(k||!ak)){let b;if((k||aj)&&j===x.FallbackMode.NOT_FOUND)throw new C.NoFallbackError;if(as&&!aq){let c="string"==typeof(null==aj?void 0:aj.fallback)?aj.fallback:k?ah:null;if(b=await L.handleResponse({cacheKey:c,req:a,nextConfig:ae,routeKind:e.RouteKind.APP_PAGE,isFallback:!0,prerenderManifest:_,isRoutePPREnabled:as,responseGenerator:async()=>m({span:i,postponed:void 0,fallbackRouteParams:k||au?(0,o.u)(ah):null}),waitUntil:d.waitUntil}),null===b)return null;if(b)return delete b.cacheControl,b}}let n=ai||g||!av?void 0:av;if(at&&void 0!==n)return{cacheControl:{revalidate:1,expire:void 0},value:{kind:w.CachedRouteKind.PAGES,html:y.default.EMPTY,pageData:{},headers:void 0,status:void 0}};let p=U&&as&&((0,h.getRequestMeta)(a,"renderFallbackShell")||au)?(0,o.u)(ag):null;return m({span:i,postponed:n,fallbackRouteParams:p})},p=async c=>{var f,g,i,j,k;let l,o=await L.handleResponse({cacheKey:aB,responseGenerator:a=>n({span:c,...a}),routeKind:e.RouteKind.APP_PAGE,isOnDemandRevalidate:ai,isRoutePPREnabled:as,req:a,nextConfig:ae,prerenderManifest:_,waitUntil:d.waitUntil});if(aa&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate"),L.isDev&&b.setHeader("Cache-Control","no-store, must-revalidate"),!o){if(aB)throw Object.defineProperty(Error("invariant: cache entry required but not generated"),"__NEXT_ERROR_CODE",{value:"E62",enumerable:!1,configurable:!0});return null}if((null==(f=o.value)?void 0:f.kind)!==w.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant app-page handler received invalid cache entry ${null==(i=o.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E707",enumerable:!1,configurable:!0});let p="string"==typeof o.value.postponed;al&&!aw&&(!p||ap)&&(O||b.setHeader("x-nextjs-cache",ai?"REVALIDATED":o.isMiss?"MISS":o.isStale?"STALE":"HIT"),b.setHeader(u.NEXT_IS_PRERENDER_HEADER,"1"));let{value:q}=o;if(av)l={revalidate:0,expire:void 0};else if(O&&aq&&!ap&&as)l={revalidate:0,expire:void 0};else if(!L.isDev)if(aa)l={revalidate:0,expire:void 0};else if(al){if(o.cacheControl)if("number"==typeof o.cacheControl.revalidate){if(o.cacheControl.revalidate<1)throw Object.defineProperty(Error(`Invalid revalidate configuration provided: ${o.cacheControl.revalidate} < 1`),"__NEXT_ERROR_CODE",{value:"E22",enumerable:!1,configurable:!0});l={revalidate:o.cacheControl.revalidate,expire:(null==(j=o.cacheControl)?void 0:j.expire)??ae.expireTime}}else l={revalidate:z.CACHE_ONE_YEAR,expire:void 0}}else b.getHeader("Cache-Control")||(l={revalidate:0,expire:void 0});if(o.cacheControl=l,"string"==typeof ax&&(null==q?void 0:q.kind)===w.CachedRouteKind.APP_PAGE&&q.segmentData){b.setHeader(u.NEXT_DID_POSTPONE_HEADER,"2");let c=null==(k=q.headers)?void 0:k[z.NEXT_CACHE_TAGS_HEADER];O&&al&&c&&"string"==typeof c&&b.setHeader(z.NEXT_CACHE_TAGS_HEADER,c);let d=q.segmentData.get(ax);return void 0!==d?(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:y.default.fromStatic(d,u.RSC_CONTENT_TYPE_HEADER),cacheControl:o.cacheControl}):(b.statusCode=204,(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:y.default.EMPTY,cacheControl:o.cacheControl}))}let r=(0,h.getRequestMeta)(a,"onCacheEntry");if(r&&await r({...o,value:{...o.value,kind:"PAGE"}},{url:(0,h.getRequestMeta)(a,"initURL")}))return null;if(p&&av)throw Object.defineProperty(Error("Invariant: postponed state should not be present on a resume request"),"__NEXT_ERROR_CODE",{value:"E396",enumerable:!1,configurable:!0});if(q.headers){let a={...q.headers};for(let[c,d]of(O&&al||delete a[z.NEXT_CACHE_TAGS_HEADER],Object.entries(a)))if(void 0!==d)if(Array.isArray(d))for(let a of d)b.appendHeader(c,a);else"number"==typeof d&&(d=d.toString()),b.appendHeader(c,d)}let s=null==(g=q.headers)?void 0:g[z.NEXT_CACHE_TAGS_HEADER];if(O&&al&&s&&"string"==typeof s&&b.setHeader(z.NEXT_CACHE_TAGS_HEADER,s),!q.status||aq&&as||(b.statusCode=q.status),!O&&q.status&&G.RedirectStatusCode[q.status]&&aq&&(b.statusCode=200),p&&b.setHeader(u.NEXT_DID_POSTPONE_HEADER,"1"),aq&&!aa){if(void 0===q.rscData){if(q.postponed)throw Object.defineProperty(Error("Invariant: Expected postponed to be undefined"),"__NEXT_ERROR_CODE",{value:"E372",enumerable:!1,configurable:!0});return(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:q.html,cacheControl:aw?{revalidate:0,expire:void 0}:o.cacheControl})}return(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:y.default.fromStatic(q.rscData,u.RSC_CONTENT_TYPE_HEADER),cacheControl:o.cacheControl})}let t=q.html;if(!p||O||aq)return(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:t,cacheControl:o.cacheControl});if(at)return t.push(new ReadableStream({start(a){a.enqueue(A.ENCODED_TAGS.CLOSED.BODY_AND_HTML),a.close()}})),(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:t,cacheControl:{revalidate:0,expire:void 0}});let v=new TransformStream;return t.push(v.readable),m({span:c,postponed:q.postponed,fallbackRouteParams:null}).then(async a=>{var b,c;if(!a)throw Object.defineProperty(Error("Invariant: expected a result to be returned"),"__NEXT_ERROR_CODE",{value:"E463",enumerable:!1,configurable:!0});if((null==(b=a.value)?void 0:b.kind)!==w.CachedRouteKind.APP_PAGE)throw Object.defineProperty(Error(`Invariant: expected a page response, got ${null==(c=a.value)?void 0:c.kind}`),"__NEXT_ERROR_CODE",{value:"E305",enumerable:!1,configurable:!0});await a.value.html.pipeTo(v.writable)}).catch(a=>{v.writable.abort(a).catch(a=>{console.error("couldn't abort transformer",a)})}),(0,B.sendRenderResult)({req:a,res:b,generateEtags:ae.generateEtags,poweredByHeader:ae.poweredByHeader,result:t,cacheControl:{revalidate:0,expire:void 0}})};if(!aG)return await aF.withPropagatedContext(a.headers,()=>aF.trace(i.BaseServerSpan.handleRequest,{spanName:`${aE} ${a.url}`,kind:g.SpanKind.SERVER,attributes:{"http.method":aE,"http.target":a.url}},p));await p(aG)}catch(b){throw b instanceof C.NoFallbackError||await L.onRequestError(a,b,{routerKind:"App Router",routePath:H,routeType:"render",revalidateReason:(0,f.c)({isRevalidate:al,isOnDemandRevalidate:ai})},ad),b}}},33873:a=>{"use strict";a.exports=require("path")},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},53525:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>m});var d=c(21124),e=c(38301),f=c(9773),g=c(17834),h=c(56044);c(44227);var i=c(72360),j=c.n(i);let k=[{title:"B\xed quyết nấu cơm ni\xeau chuẩn vị cung đ\xecnh",date:"24 Th\xe1ng 8, 2026",category:"Mẹo nh\xe0 bếp",image:"/images/banner1.jpg"},{title:"Gạo ST25 tiếp tục khẳng định vị thế tr\xean trường quốc tế",date:"15 Th\xe1ng 8, 2026",category:"Tin tức",image:"/images/rice-landscape.png"},{title:"C\xe1ch ph\xe2n biệt gạo sạch tự nhi\xean v\xe0 gạo pha trộn",date:"02 Th\xe1ng 8, 2026",category:"Sức khỏe",image:"/images/hero-rice.png"},{title:"Chương tr\xecnh ưu đ\xe3i m\xf9a Vu Lan b\xe1o hiếu",date:"28 Th\xe1ng 7, 2026",category:"Khuyến m\xe3i",image:"/images/banner1.jpg"},{title:"Kh\xe1m ph\xe1 v\xf9ng nguy\xean liệu l\xfaa t\xf4m độc đ\xe1o",date:"10 Th\xe1ng 7, 2026",category:"C\xe2u chuyện",image:"/images/rice-landscape.png"},{title:"Gạo lứt v\xe0 những c\xf4ng dụng tuyệt vời cho v\xf3c d\xe1ng",date:"05 Th\xe1ng 7, 2026",category:"Sức khỏe",image:"/images/hero-rice.png"}],l=({children:a})=>(0,d.jsx)("span",{className:"icon",children:a});function m(){let[a,b]=(0,e.useState)(!1),[c,i]=(0,e.useState)(null),[m,n]=(0,e.useState)(!1),[o,p]=(0,e.useState)(0),[q,r]=(0,e.useState)(!1),[s,t]=(0,e.useState)(!1);return(0,d.jsxs)("main",{className:`site ${j().pageRoot}`,children:[(0,d.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        .site {
          color: #f8f6ee;
          background: linear-gradient(180deg, #0b1e18 0%, #112d20 36%, #0b1d16 100%);
          font-family: Inter, sans-serif;
          min-height: 100vh;
        }

        .topbar {
          height: 42px;
          display: block;
          overflow: hidden;
          width: 100%;
          padding: 0;
          border-bottom: 1px solid rgba(255,255,255,.12);
          background: rgba(6, 25, 18, 0.92);
        }

        .topbar-track {
          display: flex;
          width: max-content;
          animation: topbar-marquee 18s linear infinite;
        }

        .topbar-track > div {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 70px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,.88);
        }

        .topbar > div:nth-child(2) { justify-self: center; }
        .topbar > div:nth-child(3) { justify-self: end; }

        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          font-size: 12px;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(96%, 1400px);
          margin: 20px auto 0;
          padding: 16px 28px;
          border: 1px solid rgba(216,180,90,.35);
          border-radius: 30px;
          background: rgba(10, 28, 20, 0.7);
          backdrop-filter: blur(14px);
          box-shadow: 0 12px 32px rgba(0,0,0,.18);
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
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(216,180,90,.3), rgba(17,41,27,.8));
          font-size: 22px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.08;
        }

        .logo-text strong {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .logo-text small {
          color: rgba(255,255,255,.72);
          font-size: 0.64rem;
          letter-spacing: 0.04em;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 34px;
          margin: 0 auto;
        }

        .nav a {
          color: rgba(255,255,255,.88);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 0 8px;
          border-bottom: 2px solid transparent;
          transition: color .25s ease, border-color .25s ease;
        }

        .nav a.active,
        .nav a:hover {
          color: #f0ce69;
          border-color: #f0ce69;
        }

        .search {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 260px;
          height: 42px;
          padding: 0 14px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          background: rgba(255,255,255,.05);
        }

        .search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #fff;
          font-size: 0.78rem;
        }

        .search input::placeholder {
          color: rgba(255,255,255,.54);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mini-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(216,180,90,.28);
          border-radius: 50%;
          background: rgba(216,180,90,.08);
          color: #f5d87d;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .mini-btn span {
          position: absolute;
          right: -5px;
          top: -4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #d7b45d;
          color: #0d1d17;
          font-size: 0.62rem;
          font-weight: 800;
        }

        .user-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 12px 0 8px;
          border: 1px solid rgba(216,180,90,.4);
          border-radius: 12px;
          background: rgba(216,180,90,.1);
          color: #f6d783;
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
        }

        .user-pill .avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d7b45d, #715718);
          color: #101d17;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .news-hero {
          padding: 86px 0 38px;
          background: radial-gradient(circle at 50% 10%, rgba(216,180,90,.18), transparent 34%);
        }

        .news-hero-inner {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          text-align: center;
        }

        .eyebrow {
          display: inline-block;
          padding-bottom: 8px;
          border-bottom: 2px solid #d7b45d;
          color: #d7b45d;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .news-hero h1 {
          margin-top: 26px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3.2rem, 5vw, 6rem);
          line-height: 0.92;
          letter-spacing: 0.04em;
          color: #f8f6ee;
        }

        .news-hero p {
          width: min(620px, 90%);
          margin: 18px auto 0;
          color: rgba(255,255,255,.72);
          font-size: 1rem;
          line-height: 1.7;
        }

        .news-container {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 8px 0 90px;
        }

        .featured-story {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 34px;
          padding: 28px;
          border: 1px solid rgba(216,180,90,.25);
          border-radius: 28px;
          background: rgba(8, 25, 18, .72);
          box-shadow: 0 18px 50px rgba(0,0,0,.22);
        }

        .featured-image {
          min-height: 420px;
          border-radius: 22px;
          background: url('/images/rice-landscape.png') center/cover no-repeat;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
        }

        .featured-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(216,180,90,.12);
          border: 1px solid rgba(216,180,90,.3);
          color: #f0ce69;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .featured-copy h2 {
          margin-top: 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.6rem, 4vw, 3.7rem);
          line-height: 1.04;
          color: #fff;
        }

        .featured-copy p {
          margin-top: 18px;
          color: rgba(255,255,255,.73);
          font-size: 1rem;
          line-height: 1.8;
        }

        .post-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 24px;
          color: rgba(255,255,255,.6);
          font-size: 0.82rem;
        }

        .gold-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 24px;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #d7b45d, #f0ce69);
          color: #10251a;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 12px 26px rgba(215,180,93,.25);
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          margin-top: 48px;
        }

        .news-card {
          overflow: hidden;
          border: 1px solid rgba(216,180,90,.18);
          border-radius: 22px;
          background: rgba(9, 24, 18, .7);
          transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }

        .news-card:hover {
          transform: translateY(-8px);
          border-color: rgba(216,180,90,.38);
          box-shadow: 0 20px 32px rgba(0,0,0,.2);
        }

        .news-card-image {
          height: 220px;
          background-size: cover;
          background-position: center;
        }

        .news-card-body {
          padding: 22px 20px 24px;
        }

        .news-card h3 {
          margin-top: 14px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.8rem, 2vw, 2.4rem);
          line-height: 1.09;
          color: #fff;
        }

        .news-card p {
          margin-top: 12px;
          color: rgba(255,255,255,.64);
          font-size: 0.92rem;
          line-height: 1.7;
        }

        .news-card .meta {
          margin-top: 18px;
          color: rgba(255,255,255,.58);
          font-size: 0.77rem;
        }

        .newsletter {
          margin-top: 68px;
          padding: 52px 32px;
          border: 1px solid rgba(216,180,90,.2);
          border-radius: 26px;
          background: linear-gradient(135deg, rgba(216,180,90,.1), rgba(18,36,28,.9));
          text-align: center;
        }

        .newsletter h2 {
          margin-bottom: 14px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          color: #fff;
        }

        .newsletter p {
          width: min(560px, 100%);
          margin: 0 auto;
          color: rgba(255,255,255,.7);
          line-height: 1.7;
        }

        .newsletter-form {
          display: flex;
          align-items: center;
          gap: 12px;
          width: min(520px, 100%);
          margin: 26px auto 0;
        }

        .newsletter-form input {
          flex: 1;
          height: 52px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          background: rgba(11,18,15,.5);
          color: #fff;
          padding: 0 18px;
          font-size: 0.96rem;
          outline: none;
        }

        .newsletter-form input::placeholder {
          color: rgba(255,255,255,.45);
        }

        .newsletter-form button {
          height: 52px;
          border: none;
          border-radius: 999px;
          padding: 0 26px;
          background: linear-gradient(135deg, #d7b45d, #f0ce69);
          color: #10251a;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .footer {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.3fr;
          gap: 28px;
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
          padding: 40px 0 80px;
          border-top: 1px solid rgba(255,255,255,.08);
          color: rgba(255,255,255,.7);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer h3 {
          margin-bottom: 16px;
          color: #fff;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .footer a,
        .footer p {
          display: block;
          margin-bottom: 10px;
          color: rgba(255,255,255,.72);
          text-decoration: none;
          font-size: 0.94rem;
          line-height: 1.8;
        }

        @media (max-width: 980px) {
          .header {
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
          }

          .nav {
            order: 3;
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .featured-story {
            grid-template-columns: 1fr;
          }

          .news-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .topbar {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .topbar > div:nth-child(2),
          .topbar > div:nth-child(3) {
            justify-self: center;
          }

          .header {
            padding: 14px 16px;
          }

          .search {
            width: 100%;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .news-grid {
            grid-template-columns: 1fr;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form button {
            width: 100%;
          }

          .footer {
            grid-template-columns: 1fr;
          }
        }

        .site > .header {
          position: relative;
          top: auto;
          width: 93%;
          height: 78px;
          margin: auto;
          padding: 0 24px;
          justify-content: initial;
          border-radius: 25px;
          background: rgba(17, 34, 24, .55);
        }

        .site > .header .logo {
          min-width: 255px;
          gap: 0;
        }

        .site > .header .logo-mark {
          width: 51px;
          height: 51px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(205, 170, 74, .35), rgba(17, 38, 24, .8));
          font-size: 27px;
        }

        .site > .header .logo-text {
          line-height: normal;
          margin-left: 11px;
        }

        .site > .header .logo-text strong {
          font: 600 24px "Cormorant Garamond";
          letter-spacing: .5px;
        }

        .site > .header .logo-text small {
          font: italic 13px "Cormorant Garamond";
          letter-spacing: normal;
        }

        .site > .header .nav {
          gap: 38px;
          margin: 0;
        }

        .site > .header .nav a {
          height: 100%;
          padding: 0;
          border-bottom: 0;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: normal;
        }

        .site > .header .nav a.active {
          border-bottom: 0;
        }

        .site > .header .nav a.active:after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 13px;
          height: 2px;
          background: var(--gold);
        }

        .site > .header .search {
          width: min(390px, 28vw);
          height: 44px;
          margin-left: auto;
          padding: 0 15px;
          border-color: rgba(255, 255, 255, .25);
          background: rgba(255, 255, 255, .04);
        }

        .site > .header .mini-btn {
          width: 34px;
          height: 34px;
          border-color: rgba(221, 211, 163, .3);
          background: transparent;
          font-size: 17px;
        }
      `}}),(0,d.jsx)("div",{className:"topbar",children:(0,d.jsxs)("div",{className:"topbar-track",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)(l,{children:"\uD83D\uDE9A"})," Giao h\xe0ng to\xe0n quốc"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(l,{children:"\uD83D\uDEE1"})," Kiểm tra h\xe0ng trước khi thanh to\xe1n"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(l,{children:"♧"})," Tư vấn 24/7: 1900 1234"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(l,{children:"\uD83D\uDE9A"})," Giao h\xe0ng to\xe0n quốc"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(l,{children:"\uD83D\uDEE1"})," Kiểm tra h\xe0ng trước khi thanh to\xe1n"]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(l,{children:"♧"})," Tư vấn 24/7: 1900 1234"]})]})}),(0,d.jsx)(h.A,{active:"news"}),(0,d.jsx)("section",{className:"news-hero",children:(0,d.jsxs)("div",{className:"news-hero-inner",children:[(0,d.jsx)("span",{className:"eyebrow",children:"Cập nhật mới nhất"}),(0,d.jsx)("h1",{children:"Tin tức"}),(0,d.jsx)("p",{children:"Đ\xf3n đọc những c\xe2u chuyện, b\xed quyết v\xe0 th\xf4ng tin mới nhất từ Gạo Ngon để mỗi bữa cơm của bạn lu\xf4n trọn vẹn v\xe0 đầy \xfd nghĩa."})]})}),(0,d.jsxs)("section",{className:"news-container",children:[(0,d.jsxs)("article",{className:"featured-story",children:[(0,d.jsx)("div",{className:"featured-image","aria-label":"H\xecnh ảnh b\xe0i viết nổi bật"}),(0,d.jsxs)("div",{className:"featured-copy",children:[(0,d.jsx)("span",{className:"tag",children:"M\xf9a vụ mới"}),(0,d.jsx)("h2",{children:"Khởi động m\xf9a gặt 2026: N\xe2ng tầm hạt gạo Việt Nam l\xean chuẩn quốc tế"}),(0,d.jsx)("p",{children:"Với quy tr\xecnh chọn lọc, sấy kh\xf4 v\xe0 bảo quản hiện đại, Gạo Ngon tiếp tục mang tới hạt gạo dẻo thơm, ngọt tự nhi\xean, giữ trọn hương vị cho từng bữa ăn gia đ\xecnh."}),(0,d.jsxs)("div",{className:"post-meta",children:[(0,d.jsx)("span",{children:"26 Th\xe1ng 8, 2026"}),(0,d.jsx)("button",{type:"button",className:"gold-button",children:"Đọc b\xe0i viết →"})]})]})]}),(0,d.jsx)("div",{className:"news-grid",children:k.map((a,b)=>(0,d.jsxs)("article",{className:"news-card",children:[(0,d.jsx)("div",{className:"news-card-image",style:{backgroundImage:`url('${a.image}')`}}),(0,d.jsxs)("div",{className:"news-card-body",children:[(0,d.jsx)("span",{className:"tag",children:a.category}),(0,d.jsx)("h3",{children:a.title}),(0,d.jsx)("p",{children:"Kh\xe1m ph\xe1 c\xe2u chuyện v\xe0 lợi \xedch thực tế để bạn hiểu r\xf5 hơn về loại gạo m\xe0 gia đ\xecnh đang d\xf9ng mỗi ng\xe0y."}),(0,d.jsx)("div",{className:"meta",children:a.date})]})]},`${a.title}-${b}`))}),(0,d.jsxs)("div",{className:"newsletter",children:[(0,d.jsx)("h2",{children:"Đăng k\xfd nhận bản tin"}),(0,d.jsx)("p",{children:"Nhận ưu đ\xe3i hấp dẫn, tin tức mới nhất v\xe0 những g\xf3c nh\xecn th\xfa vị về gạo Việt ngay trong hộp thư của bạn."}),(0,d.jsxs)("form",{className:"newsletter-form",onSubmit:a=>a.preventDefault(),children:[(0,d.jsx)("input",{type:"email",placeholder:"Nhập email của bạn...","aria-label":"Email",required:!0}),(0,d.jsx)("button",{type:"submit",children:"Đăng k\xfd"})]})]})]}),(0,d.jsx)(g.A,{}),(0,d.jsx)(f.A,{open:a,onClose:()=>b(!1),onSuccess:a=>{i(a),b(!1)}})]})}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},72360:a=>{a.exports={pageRoot:"page_pageRoot__2EZkC"}},83711:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>d});let d=(0,c(97954).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\aithi\\\\Downloads\\\\gao-ngon-nextjs\\\\app\\\\tin-tuc\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\aithi\\Downloads\\gao-ngon-nextjs\\app\\tin-tuc\\page.tsx","default")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")}};var b=require("../../webpack-runtime.js");b.C(a);var c=b.X(0,[833,648,283],()=>b(b.s=32862));module.exports=c})();