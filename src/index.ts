import express, { Request, Response } from "express";
import { connectToDB, Config } from "./core";
import { analyticsRouter, authRouter } from "./routes";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors(Config.corsOptions));
app.use("/auth", authRouter);
app.use("/analytics", analyticsRouter);

app.get("/dashboard", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../src/public", "dashboard.html"));
});

app.get("/status", (req: Request, res: Response) => {
  const statuses = ["Operational", "Degraded", "Maintenance", "Offline"];

  const randomIndex = Math.floor(Math.random() * statuses.length);

  res.json({ status: statuses[randomIndex] });
});

app.get("/script.js", (req: Request, res: Response) => {
  res.type("application/javascript");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(`
const _0x112406=_0x573e;function _0x573e(_0xf295be,_0x286d70){const _0x3a4b20=_0x3a4b();return _0x573e=function(_0x573e66,_0x512a63){_0x573e66=_0x573e66-0x117;let _0x3b3ebb=_0x3a4b20[_0x573e66];return _0x3b3ebb;},_0x573e(_0xf295be,_0x286d70);}function _0x3a4b(){const _0x418775=['xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx','generateSessionId','Unknown','sessionId','log','MSIE','toString','application/json','Chrome','Linux','111666WTVdxb','MacOS','Trident/7','Firefox','182WUikea','trackPageView','debug','Safari','3351084dkkTGG','makeRequest','Windows','Desktop','HTTP\x20Error:\x20','initSession','statusText','2286072gjAXnx','127522zAVvWc','enableAutoPageView','582004RtRDGw','event','2760480SueZnh','21FzZhGr','Failed\x20to\x20track\x20','3800376lxejgh','userAgent','\x20tracked\x20successfully','Android','iOS','getOsInfo','includes','Tablet','[Analytics]','logDebug','apiUrl','page-view','replace','POST','5mTOryx'];_0x3a4b=function(){return _0x418775;};return _0x3a4b();}(function(_0x52792b,_0x23eea9){const _0x36bfb6=_0x573e,_0x3bc682=_0x52792b();while(!![]){try{const _0x18acc0=-parseInt(_0x36bfb6(0x131))/0x1+-parseInt(_0x36bfb6(0x12f))/0x2*(-parseInt(_0x36bfb6(0x134))/0x3)+-parseInt(_0x36bfb6(0x127))/0x4*(-parseInt(_0x36bfb6(0x144))/0x5)+parseInt(_0x36bfb6(0x11f))/0x6*(-parseInt(_0x36bfb6(0x123))/0x7)+-parseInt(_0x36bfb6(0x12e))/0x8+parseInt(_0x36bfb6(0x136))/0x9+parseInt(_0x36bfb6(0x133))/0xa;if(_0x18acc0===_0x23eea9)break;else _0x3bc682['push'](_0x3bc682['shift']());}catch(_0x5a297d){_0x3bc682['push'](_0x3bc682['shift']());}}}(_0x3a4b,0x99fe9));class Analytics{constructor(_0x10aafe){const _0x1b1afa=_0x573e;this[_0x1b1afa(0x140)]=_0x10aafe[_0x1b1afa(0x140)],this[_0x1b1afa(0x118)]=this['generateSessionId'](),this['debug']=_0x10aafe[_0x1b1afa(0x125)]||![],this['initSession'](),_0x10aafe[_0x1b1afa(0x130)]&&this[_0x1b1afa(0x124)]();}[_0x112406(0x146)](){const _0x464af9=_0x112406;return _0x464af9(0x145)[_0x464af9(0x142)](/[xy]/g,_0x5a6304=>{const _0x187162=_0x464af9,_0x2b720d=Math['random']()*0x10|0x0,_0x4a5bbf=_0x5a6304==='x'?_0x2b720d:_0x2b720d&0x3|0x8;return _0x4a5bbf[_0x187162(0x11b)](0x10);});}[_0x112406(0x13f)](..._0xd65cc6){const _0x1b5def=_0x112406;this[_0x1b5def(0x125)]&&console[_0x1b5def(0x119)](_0x1b5def(0x13e),..._0xd65cc6);}async[_0x112406(0x128)](_0x59fa45,_0x2b837c){const _0xdd54ba=_0x112406;try{const _0x18fd50=await fetch(this['apiUrl']+'/'+_0x59fa45,{'method':_0xdd54ba(0x143),'headers':{'Content-Type':_0xdd54ba(0x11c)},'body':JSON['stringify'](_0x2b837c)});if(!_0x18fd50['ok'])throw new Error(_0xdd54ba(0x12b)+_0x18fd50[_0xdd54ba(0x12d)]);this['logDebug'](_0x59fa45+_0xdd54ba(0x138));}catch(_0x30aab7){this[_0xdd54ba(0x13f)](_0xdd54ba(0x135)+_0x59fa45+':',_0x30aab7);throw _0x30aab7;}}async[_0x112406(0x12c)](){const _0x415e0b=_0x112406,_0x2454b6={'browser':this['getBrowserInfo'](),'os':this['getOsInfo'](),'device':this['getDeviceInfo']()};await this['makeRequest']('session',{'sessionId':this[_0x415e0b(0x118)],'deviceInfo':_0x2454b6});}async[_0x112406(0x124)](_0x39bcfc=window['location']['pathname']){const _0x28d385=_0x112406;await this[_0x28d385(0x128)](_0x28d385(0x141),{'path':_0x39bcfc,'sessionId':this[_0x28d385(0x118)],'userAgent':navigator['userAgent'],'referrer':document['referrer']});}async['trackEvent'](_0x5d350d,_0xa83106={}){const _0x2ccf5e=_0x112406;await this[_0x2ccf5e(0x128)](_0x2ccf5e(0x132),{'sessionId':this[_0x2ccf5e(0x118)],'eventType':_0x5d350d,'eventData':_0xa83106});}['getBrowserInfo'](){const _0x32216e=_0x112406,_0x222823=navigator['userAgent'];let _0xd03bfd=_0x32216e(0x117);if(_0x222823[_0x32216e(0x13c)](_0x32216e(0x122)))_0xd03bfd='Firefox';else{if(_0x222823[_0x32216e(0x13c)](_0x32216e(0x11d)))_0xd03bfd=_0x32216e(0x11d);else{if(_0x222823['includes'](_0x32216e(0x126)))_0xd03bfd=_0x32216e(0x126);else{if(_0x222823[_0x32216e(0x13c)]('Edge'))_0xd03bfd='Edge';else{if(_0x222823[_0x32216e(0x13c)](_0x32216e(0x11a))||_0x222823['includes'](_0x32216e(0x121)))_0xd03bfd='Internet\x20Explorer';}}}}return _0xd03bfd;}[_0x112406(0x13b)](){const _0x18b0f9=_0x112406,_0x2f39c5=navigator[_0x18b0f9(0x137)];let _0x2ecad9='Unknown';if(_0x2f39c5[_0x18b0f9(0x13c)](_0x18b0f9(0x129)))_0x2ecad9=_0x18b0f9(0x129);else{if(_0x2f39c5['includes']('Macintosh'))_0x2ecad9=_0x18b0f9(0x120);else{if(_0x2f39c5[_0x18b0f9(0x13c)](_0x18b0f9(0x11e)))_0x2ecad9=_0x18b0f9(0x11e);else{if(_0x2f39c5[_0x18b0f9(0x13c)](_0x18b0f9(0x139)))_0x2ecad9=_0x18b0f9(0x139);else{if(_0x2f39c5[_0x18b0f9(0x13c)]('iOS'))_0x2ecad9=_0x18b0f9(0x13a);}}}}return _0x2ecad9;}['getDeviceInfo'](){const _0x7bed18=_0x112406,_0x553f83=navigator[_0x7bed18(0x137)];let _0x14fd99=_0x7bed18(0x12a);if(_0x553f83[_0x7bed18(0x13c)]('Mobile'))_0x14fd99='Mobile';else{if(_0x553f83[_0x7bed18(0x13c)]('Tablet'))_0x14fd99=_0x7bed18(0x13d);}return _0x14fd99;}}const analytics=new Analytics({'apiUrl':'https://api.thenittettey.live/analytics','enableAutoPageView':!![],'debug':![]});window['analytics']=analytics;
  `);
});

connectToDB()
  .then(() => {
    app.listen(Config.PORT, () => {
      console.log(`Server is running on port ${Config.PORT}`);
    });
  })
  .catch((error) => {
    // clean up and exit
    console.error(error);
    process.exit(1);
  });
