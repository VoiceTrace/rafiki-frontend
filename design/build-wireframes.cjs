
const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'screens.json'),'utf8').replace(/^\uFEFF/,''));
const out = path.join(__dirname,'wireframes');
fs.mkdirSync(out,{recursive:true});
const P={bg:'#F7F7F5',white:'#FFFFFF',ink:'#222831',muted:'#657080',border:'#DDE1E5',orange:'#F57436',peach:'#FFF0E7',lav:'#F1EDFC',sage:'#EAF4EE'};
const navs={teacher:['Today','Teaching','Students','Resources','Connect','Insights','Rafiqi','Courses'],student:['Today','Learn','Homework','My progress','Resources','Connect','My Rafiqi']};
const destinations={teacher:{Today:'T01',Teaching:'T07',Students:'T09',Resources:'T08',Connect:'T10',Insights:'T06',Rafiqi:'T11',Courses:'T13'},student:{Today:'S01',Learn:'S02',Homework:'S08','My progress':'S12',Resources:'S10',Connect:'S09','My Rafiqi':'S11'}};
function wrap(s,w,size){const max=Math.floor(w/(size*.58));const lines=[];let line='';for(const word of s.split(/\s+/)){if(line&&line.length+word.length+1>max){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);return lines;}
function build(d){
const ops=[],links=[];let section='Shell';
function rect(x,y,w,h,fill=P.white,stroke=P.border,r=10,name='Surface'){const o={type:'rect',x,y,w,h,fill,stroke,r,name,section};ops.push(o);return o;}
function text(s,x,y,w=500,size=16,weight=400,color=P.ink,name='Text'){const lines=wrap(s,w,size);lines.forEach((line,i)=>ops.push({type:'text',text:line,x,y:y+i*(size+7),w,size,weight,color,name,section}));return lines.length*(size+7);}
function button(label,x,y,w,primary=false,target){const raw=label;label=label.replace(/\s*→\s*[TS]\d\d/,'');const o=rect(x,y,w,40,primary?P.orange:P.white,primary?P.orange:P.border,8,'Button / '+label);text(label,x+14,y+10,w-24,14,600,primary?P.white:P.ink,'Button label');const match=raw.match(/→\s*([TS]\d\d)/);if(target||match){links.push({x,y,w,h:40,target:target||(match&&match[1]),name:label,section});}return o;}
function actions(a,x,y,w){let dx=0;for(let i=0;i<a.length;i++){const clean=a[i].replace(/\s*→\s*[TS]\d\d/,'');const bw=Math.min(w,Math.max(90,clean.length*8.6+40));if(dx+bw>w){dx=0;y+=50;}button(a[i],x+dx,y,bw,i===0);dx+=bw+10;}return y+(a.length?40:0);}
rect(0,0,1440,1100,P.bg,P.bg,0,'Canvas');
rect(0,0,224,1100,P.white,P.border,0,'Sidebar');
rect(224,0,1216,80,P.white,P.border,0,'Top bar');
text('Rafiqi',28,25,170,30,800,P.orange,'Wordmark');
rect(256,20,560,40,P.bg,P.border,8,'Search field');text('Search lessons, resources, conversations…',272,30,520,14,400,P.muted);
text('AR  /  EN',1080,31,100,14,600);
text(d.role==='teacher'?'Mr. Adel':'Ahmed',1260,26,140,16,600);
text(d.role==='teacher'?'Teacher':'Grade 10',1260,48,140,12,400,P.muted);
navs[d.role].forEach((n,i)=>{section='Navigation / '+n;const y=118+i*58;if(n===d.nav)rect(16,y-8,192,44,P.peach,P.peach,8);rect(30,y+3,16,16,n===d.nav?P.orange:P.white,n===d.nav?P.orange:P.muted,4,'Navigation icon');text(n,62,y,145,16,n===d.nav?700:400,n===d.nav?P.orange:P.ink);links.push({x:16,y:y-8,w:192,h:44,target:destinations[d.role][n],name:n,section});});
section='Page heading';
text(d.id+' / '+(d.role==='teacher'?'TEACHER':'STUDENT'),256,112,1100,12,600,P.muted);
const titleH=text(d.title,256,138,1120,32,800);
text(d.subtitle,256,146+titleH,1120,16,400,P.muted);
let contentY=146+titleH+48;
if(d.tabs.length){section='Page tabs';let x=256,y=contentY;d.tabs.forEach((t,i)=>{const w=Math.max(95,t.length*8.6+40);if(x+w>1408){x=256;y+=48;}const phaseTargets=['T03','T04','T05'].includes(d.id)?['T03','T04','T05']:['S05','S06','S07'].includes(d.id)?['S05','S06','S07','S08']:d.id==='T10'?['T10','T17','T12']:d.id==='S09'?['S09','S15','S13']:null;const active=phaseTargets?phaseTargets[i]===d.id:i===0;button(t,x,y,w,active,t.includes('Locked')?undefined:phaseTargets&&phaseTargets[i]);x+=w+8;});contentY=y+66;}
const ys=[contentY,contentY],xs=[256,996],ws=[716,412];
d.cards.forEach((c,i)=>{
const col=i%2,x=xs[col],y=ys[col],w=ws[col];section=c[0];const baseIndex=ops.length;
const bg=c[1]==='hero'?P.peach:c[1]==='chat'?P.lav:P.white;
const surface=rect(x,y,w,100,bg,P.border,12,c[0]+' / Card');
let yy=y+24;yy+=text(c[0],x+24,yy,w-48,20,700);yy+=18;
if(c[1]==='chart'){for(let g=0;g<4;g++)rect(x+24,yy+g*34,w-48,1,P.border,P.border,0,'Chart grid');
const vals=[.25,.39,.34,.55,.66,.79];vals.forEach((v,j)=>{const bw=(w-80)/6;rect(x+28+j*(bw+5),yy+115-v*110,bw-9,v*110,j===5?P.orange:'#B9C6BD','none',3,'Example trend bar');});yy+=140;}
if(c[1]==='calendar'){text('Time             Mon       Tue       Wed       Thu       Fri',x+24,yy,w-48,13,600);yy+=32;for(let g=0;g<4;g++){rect(x+24,yy+g*48,w-48,1,P.border,P.border,0,'Calendar grid');}yy+=12;}
for(let j=0;j<c[2].length;j++){
const item=c[2][j];let ix=x+24,iw=w-48;
if(c[1]==='form'){yy+=text(item,ix,yy,iw,14,500,P.muted);const fieldHeight=/reasoning|Write note|Write your|Take notes|Description/.test(item)?104:38;rect(ix,yy+3,iw,fieldHeight,P.bg,P.border,6,'Field / '+item);yy+=fieldHeight+20;}
else if(c[1]==='check'||(c[1]==='question'&&d.id==='S04'&&j>0)){rect(ix,yy+2,17,17,P.white,P.border,c[1]==='question'?8:3,'Selection control');yy+=text(item,ix+29,yy,iw-29,16,400)+15;}
else if(c[1]==='metrics'){rect(ix,yy,iw,56,P.bg,'none',8,'Metric');text(item,ix+16,yy+16,iw-32,19,700,j===0?P.orange:P.ink);yy+=68;}
else if(c[1]==='table'){rect(ix,yy,iw,46,j%2?P.white:P.bg,'none',5,'Table row');yy+=text(item,ix+12,yy+12,iw-24,14,400)+26;}
else if(c[1]==='chat'){const bh=wrap(item,iw-28,16).length*23+26;rect(ix,yy,iw,bh,j%2?P.white:'#E7E0F8','none',10,'Message bubble');text(item,ix+14,yy+13,iw-28,16);yy+=bh+12;}
else{yy+=text(item,ix,yy,iw,16,c[1]==='hero'&&j===0?700:400,c[1]==='hero'?P.ink:P.muted)+15;}
}
if(c[3].length)yy=actions(c[3],x+24,yy+8,w-48);
surface.h=yy-y+24;ys[col]=yy+48;
if(!ops.slice(baseIndex+1).every(o=>o.y+(o.h||o.size+7)<=y+surface.h+1))throw Error('Card bounds: '+d.id+' '+c[0]);
});
const height=Math.max(980,Math.max(...ys)+56);ops[0].h=height;ops[1].h=height;
section='Handoff label';text('Rafiqi / '+d.id+' / Source: '+d.route+' / Wireframe · example data',256,height-42,1100,12,400,P.muted);
return {...d,width:1440,height,ops,links};
}
const built=data.map(build);
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
for(const d of built){
let s='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+d.width+'" height="'+d.height+'" viewBox="0 0 '+d.width+' '+d.height+'"><title>'+esc(d.id+' '+d.title)+'</title>';
let section='';for(const o of d.ops){if(section!==o.section){if(section)s+='</g>';section=o.section;s+='<g id="'+esc(section.replace(/[^a-zA-Z0-9-]/g,'-'))+'">';}if(o.type==='rect')s+='<rect x="'+o.x+'" y="'+o.y+'" width="'+o.w+'" height="'+o.h+'" rx="'+o.r+'" fill="'+o.fill+'" stroke="'+o.stroke+'"/>';else s+='<text x="'+o.x+'" y="'+(o.y+o.size)+'" font-family="'+(o.weight>=700?'Nunito, ':'')+'Inter, Arial, sans-serif" font-size="'+o.size+'" font-weight="'+o.weight+'" fill="'+o.color+'">'+esc(o.text)+'</text>';}
if(section)s+='</g>';
for(const l of d.links)s+='<a xlink:href="'+l.target+'.svg"><rect x="'+l.x+'" y="'+l.y+'" width="'+l.w+'" height="'+l.h+'" fill="#FFFFFF" fill-opacity="0"><title>'+esc(l.name)+'</title></rect></a>';
s+='</svg>';fs.writeFileSync(path.join(out,d.id+'.svg'),s);
}
for(const d of built){for(const o of d.ops){if(o.x<0||o.y<0||o.x+o.w>d.width+1||o.y+(o.h||o.size+7)>d.height+1)throw Error('Canvas bounds '+d.id+' '+o.name);}for(const l of d.links)if(!built.some(b=>b.id===l.target))throw Error('Missing link '+l.target);}
fs.writeFileSync(path.join(__dirname,'layout-data.json'),JSON.stringify(built));
const lines=['# Rafiqi wireframes','','34 editable SVG screens and supporting states. For native text layers and linked frames, use the Figma import helper.','','| ID | Role | Screen | Source route |','| --- | --- | --- | --- |'];
for(const d of data)lines.push('| '+d.id+' | '+d.role+' | ['+d.title+'](wireframes/'+d.id+'.svg) | '+d.route+' |');
fs.writeFileSync(path.join(__dirname,'WIREFRAMES.md'),lines.join('\n'));
console.log(JSON.stringify({screens:built.length,shapes:built.reduce((a,d)=>a+d.ops.length,0),navigationLinks:built.reduce((a,d)=>a+d.links.length,0),maxHeight:Math.max(...built.map(d=>d.height))}));

