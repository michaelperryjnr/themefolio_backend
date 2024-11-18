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

const obfuscatedCode = `
const _0xe39681=_0x5729;function _0x5ae6(){const _0xadf1af=['debug','Direct','pathname','30060KNZdZH','Internet\x20Explorer','HTTP\x20Error:\x20','14YcvCab','[Analytics]','0.0.0.0','getBrowserInfo','Safari','xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx','422252wEuhHS','logDebug','Tablet','event','23334chLhBS','Unknown','10fGvQdT','userAgent','Trident/7','enableAutoPageView','random','Desktop','iOS','session','Mobile','analytics','Linux','getOsInfo','statusText','3744855obVZZR','sessionId','log','571272WwLOQg','10ZymCdv','referrer','stringify','generateSessionId','includes','apiUrl','json','Windows','Failed\x20to\x20fetch\x20IP\x20address:','trackPageView','https://api.thenittettey.live/analytics','664782jfordN','makeRequest','\x20tracked\x20successfully','initSession','2148400ZBMshW','MacOS','Edge','POST','https://api.ipify.org?format=json','getDeviceInfo','Firefox','location'];_0x5ae6=function(){return _0xadf1af;};return _0x5ae6();}(function(_0x1e11e9,_0x3882ba){const _0xa612c=_0x5729,_0x11a15f=_0x1e11e9();while(!![]){try{const _0x5aa46c=parseInt(_0xa612c(0xd1))/0x1+-parseInt(_0xa612c(0xa0))/0x2+parseInt(_0xa612c(0xa4))/0x3+-parseInt(_0xa612c(0xb6))/0x4*(-parseInt(_0xa612c(0xb7))/0x5)+parseInt(_0xa612c(0xc2))/0x6*(parseInt(_0xa612c(0xd4))/0x7)+parseInt(_0xa612c(0xc6))/0x8+parseInt(_0xa612c(0xb3))/0x9*(-parseInt(_0xa612c(0xa6))/0xa);if(_0x5aa46c===_0x3882ba)break;else _0x11a15f['push'](_0x11a15f['shift']());}catch(_0x3d0388){_0x11a15f['push'](_0x11a15f['shift']());}}}(_0x5ae6,0x2d81d));class Analytics{constructor(_0x3fe26e){const _0x1cdcd0=_0x5729;this['apiUrl']=_0x3fe26e['apiUrl'],this[_0x1cdcd0(0xb4)]=this[_0x1cdcd0(0xba)](),this[_0x1cdcd0(0xce)]=_0x3fe26e['debug']||![],this['initSession'](),_0x3fe26e[_0x1cdcd0(0xa9)]&&this['trackPageView']();}[_0xe39681(0xba)](){const _0x3b3b08=_0xe39681;return _0x3b3b08(0x9f)['replace'](/[xy]/g,_0x5012d8=>{const _0x554d47=_0x3b3b08,_0x9bd5ca=Math[_0x554d47(0xaa)]()*0x10|0x0,_0x58724c=_0x5012d8==='x'?_0x9bd5ca:_0x9bd5ca&0x3|0x8;return _0x58724c['toString'](0x10);});}['logDebug'](..._0x4beced){const _0x561317=_0xe39681;this['debug']&&console[_0x561317(0xb5)](_0x561317(0xd5),..._0x4beced);}async['makeRequest'](_0x636ef5,_0x2f0c13){const _0x3dfa78=_0xe39681;try{const _0x521d73=await fetch(this[_0x3dfa78(0xbc)]+'/'+_0x636ef5,{'method':_0x3dfa78(0xc9),'headers':{'Content-Type':'application/json'},'body':JSON[_0x3dfa78(0xb9)](_0x2f0c13)});if(!_0x521d73['ok'])throw new Error(_0x3dfa78(0xd3)+_0x521d73[_0x3dfa78(0xb2)]);this['logDebug'](_0x636ef5+_0x3dfa78(0xc4),_0x2f0c13);}catch(_0x2612d1){this['logDebug']('Failed\x20to\x20track\x20'+_0x636ef5+':',_0x2612d1);throw _0x2612d1;}}async[_0xe39681(0xc5)](){const _0x237ed0=_0xe39681,_0x33bb06={'browser':this[_0x237ed0(0x9d)](),'os':this[_0x237ed0(0xb1)](),'device':this[_0x237ed0(0xcb)]()};await this[_0x237ed0(0xc3)](_0x237ed0(0xad),{'sessionId':this[_0x237ed0(0xb4)],'deviceInfo':_0x33bb06});}async[_0xe39681(0xc0)](_0x184b9a=window[_0xe39681(0xcd)][_0xe39681(0xd0)]){const _0x42f0c4=_0xe39681;try{const _0x5c22bb=await this['getIpAddress'](),_0x414179=document[_0x42f0c4(0xb8)]||_0x42f0c4(0xcf);await this[_0x42f0c4(0xc3)]('page-view',{'path':_0x184b9a||'/','sessionId':this['sessionId'],'userAgent':navigator[_0x42f0c4(0xa7)]||_0x42f0c4(0xa5),'ip':_0x5c22bb,'referrer':_0x414179});}catch(_0x517e92){this['logDebug']('Error\x20tracking\x20page\x20view:',_0x517e92);}}async['trackEvent'](_0xcdaf61,_0x43fa63={}){const _0x5afad7=_0xe39681;await this[_0x5afad7(0xc3)](_0x5afad7(0xa3),{'sessionId':this[_0x5afad7(0xb4)],'eventType':_0xcdaf61,'eventData':_0x43fa63});}['getBrowserInfo'](){const _0x3979ba=_0xe39681,_0x6e0093=navigator[_0x3979ba(0xa7)];if(_0x6e0093[_0x3979ba(0xbb)](_0x3979ba(0xcc)))return'Firefox';if(_0x6e0093[_0x3979ba(0xbb)]('Chrome')&&!_0x6e0093['includes']('Edge'))return'Chrome';if(_0x6e0093[_0x3979ba(0xbb)](_0x3979ba(0x9e))&&!_0x6e0093['includes']('Chrome'))return _0x3979ba(0x9e);if(_0x6e0093['includes'](_0x3979ba(0xc8)))return _0x3979ba(0xc8);if(_0x6e0093['includes']('MSIE')||_0x6e0093[_0x3979ba(0xbb)](_0x3979ba(0xa8)))return _0x3979ba(0xd2);return'Unknown';}['getOsInfo'](){const _0x132e13=_0xe39681,_0x4db207=navigator[_0x132e13(0xa7)];if(_0x4db207['includes'](_0x132e13(0xbe)))return _0x132e13(0xbe);if(_0x4db207[_0x132e13(0xbb)](_0x132e13(0xd7)))return'MacOS';if(_0x4db207['includes']('Windows'))return'Windows';if(_0x4db207['includes']('Linux'))return'Linux';return'Unknown';}['getDeviceInfo'](){const _0x9bb81d=_0xe39681;return/Windows\sPhone/i[_0x9bb81d(0x9e)]?{type:'Mobile',name:_0x9bb81d(0x9e)}:/iPad/i[_0x9bb81d(0x9e)]?{type:_0x9bb81d(0xd0),name:_0x9bb81d(0xbe)}:/Android/i[_0x9bb81d(0x9e)]?{type:'Mobile',name:'Android'}:/iPhone/i[_0x9bb81d(0x9e)]?{type:'Mobile',name:'iOS'}:{type:'Desktop',name:'Unknown'};}['getIpAddress'](){const _0x52d5b7=_0xe39681;return fetch('https://api.ipify.org?format=json').then(_0x133d2d=>_0x133d2d[_0x52d5b7(0xa2)]()).then(_0x4352f2=>_0x4352f2['ip']).catch(()=>{this['logDebug'](_0x52d5b7(0xae));return'Unknown';});}}export default Analytics;
`;

app.get("/status", (req: Request, res: Response) => {
  const statuses = ["Operational", "Degraded", "Maintenance", "Offline"];

  const randomIndex = Math.floor(Math.random() * statuses.length);

  res.json({ status: statuses[randomIndex] });
});

app.get("/script.js", (req: Request, res: Response) => {
  res.type("application/javascript");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(obfuscatedCode);
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
