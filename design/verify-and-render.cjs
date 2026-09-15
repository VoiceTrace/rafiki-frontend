
const fs=require('fs'),path=require('path'),vm=require('vm');
const sharp=require('C:/Users/Qassas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
const frames=JSON.parse(fs.readFileSync(path.join(__dirname,'layout-data.json'),'utf8'));
const previews=path.join(__dirname,'wireframe-previews');fs.mkdirSync(previews,{recursive:true});
for(const s of frames)await sharp(path.join(__dirname,'wireframes',s.id+'.svg')).png().toFile(path.join(previews,s.id+'.png'));
let count=0,links=0,end='',pages=0;const nodes=new Map();
function node(type){const n={type,id:String(++count),children:[],appendChild(c){this.children.push(c);c.parent=this;},resize(w,h){if(!(w>0&&h>0))throw Error('Bad geometry');this.width=w;this.height=h;},setPluginData(){},async setReactionsAsync(r){for(const x of r)for(const a of x.actions){if(!nodes.has(a.destinationId))throw Error('Missing target');links++;}}};nodes.set(n.id,n);return n;}
const figma={async loadFontAsync(){},createPage(){pages++;return node('PAGE');},async setCurrentPageAsync(p){this.currentPage=p;},createFrame(){return node('FRAME');},createRectangle(){return node('RECTANGLE');},createText(){return node('TEXT');},notify(){},viewport:{scrollAndZoomIntoView(){}},closePlugin(s){end=s;}};
await vm.runInNewContext(fs.readFileSync(path.join(__dirname,'figma-helper','code.js'),'utf8'),{figma,console,Map,Date,Promise});
if(!end.startsWith('Created 34'))throw Error(end);
const sourceRoutes={};for(const role of ['teacher','student']){const source=fs.readFileSync(path.join(__dirname,'..','rafiqi-'+role+'.html'),'utf8');const routes=[...new Set([...source.matchAll(/data-s="([^"]+)"/g)].map(x=>x[1]))];const represented=[...new Set(frames.filter(x=>x.role===role).map(x=>x.route))];const missing=routes.filter(x=>!represented.includes(x));if(missing.length)throw Error('Missing routes '+missing);sourceRoutes[role]={count:routes.length,routes,missing};}
const report={svgScreens:frames.length,renderedPreviews:frames.length,sourceRoutes,figmaHelper:{syntax:'passed',mockApiExecution:'passed',liveFigmaExecution:'NOT RUN: Figma tools unavailable',createdPages:pages,createdNodes:count,navigationLinks:links},note:'Route coverage is verified. This is a design kit, not a functional replacement for the HTML. Forms and state changes are visual specifications; only mapped navigation has prototype links.'};
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})();

