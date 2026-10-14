import {ROUTES,ACTIONS,applyAction,normalizeChoices,safeRoute,choiceLabels} from './core.js?v=4';
import {renderScreen} from './views.js?v=4';
const STORAGE='pitwall.v1.choices';
let choices=[null,null,null];
try{choices=normalizeChoices(JSON.parse(localStorage.getItem(STORAGE)));}catch{}
const app=document.getElementById('app');
let toastTimer;
let pending=choices.slice();
function toast(message){document.getElementById('toast').textContent=message;clearTimeout(toastTimer);toastTimer=setTimeout(()=>document.getElementById('toast').textContent='',3500);}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(choices));}catch{}}
function go(route){const next=safeRoute(route,choices);if(location.hash!=='#'+next)location.hash=next;else render();}
function render(options={}){
 const oldScroll=app.scrollTop;
 const route=safeRoute(location.hash.slice(1)||'home',choices);
 if(location.hash!=='#'+route)history.replaceState(null,'','#'+route);
 app.innerHTML=renderScreen(route,route.startsWith('choice')?pending:choices);
 for(const button of app.querySelectorAll('button[data-select]'))button.addEventListener('click',()=>{pending[Number(button.dataset.question)]=button.dataset.select;render({preserveScroll:true});app.querySelector('[data-select=\"'+button.dataset.select+'\"]')?.focus({preventScroll:true});});
 for(const card of app.querySelectorAll('[data-choice]'))card.addEventListener('click',event=>{if(event.target.closest('button'))return;card.querySelector('button[data-select]').click();});
 for(const button of app.querySelectorAll('button[data-action]'))button.addEventListener('click',()=>{
  const next=applyAction(choices,button.dataset.action);if(!next)return;choices=next.choices;pending=choices.slice();persist();go(next.route);
 });
 for(const button of app.querySelectorAll('button[data-go]'))button.addEventListener('click',()=>go(button.dataset.go));
 if(route==='share'){
  document.getElementById('save-image').onclick=saveImage;
  document.getElementById('share-link').onclick=share;
 }
 document.title=(route==='home'?'\u8fd9\u4e00\u5708\uff0c\u7531\u4f60\u51b3\u5b9a':route==='summary'?'\u6211\u7684\u7b56\u7565\u8bb0\u5f55':route==='share'?'\u6211\u7684\u4e09\u6b21\u7b56\u7565\u9009\u62e9':'F1 \u8fdb\u7ad9\u7b56\u7565\u6311\u6218')+' \u00b7 PIT WALL';
 app.scrollTo(0,options.preserveScroll?oldScroll:0);if(!options.preserveScroll)app.focus({preventScroll:true});
}
async function share(){
 const url=location.origin+location.pathname+'#home';
 const text='\u8fd9\u4e00\u5708\uff0c\u7531\u4f60\u51b3\u5b9a\u3002\u6211\u7684\u4e09\u6b21\u9009\u62e9\uff1a'+choiceLabels(choices).join('\u3001')+'\u3002\u6362\u6210\u4f60\uff0c\u4f1a\u600e\u4e48\u9009\uff1f';
 try{
  if(navigator.share){await navigator.share({title:'\u8fd9\u4e00\u5708\uff0c\u7531\u4f60\u51b3\u5b9a',text,url});return;}
  if(navigator.clipboard){await navigator.clipboard.writeText(text+'\n'+url);toast('\u6311\u6218\u94fe\u63a5\u5df2\u590d\u5236');return;}
  const input=document.createElement('textarea');input.value=text+'\n'+url;document.body.append(input);input.select();
  const copied=document.execCommand('copy');input.remove();toast(copied?'\u6311\u6218\u94fe\u63a5\u5df2\u590d\u5236':'\u53ef\u4ece\u6d4f\u89c8\u5668\u5730\u5740\u680f\u590d\u5236\u94fe\u63a5');
 }catch(error){if(error.name!=='AbortError')toast('\u5206\u4eab\u672a\u5b8c\u6210\uff0c\u53ef\u4ece\u6d4f\u89c8\u5668\u5730\u5740\u680f\u590d\u5236\u94fe\u63a5');}
}
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});}
async function saveImage(){
 const button=document.getElementById('save-image');button.disabled=true;button.textContent='\u6b63\u5728\u751f\u6210\u2026';
 try{
  await document.fonts.ready;await document.fonts.load('700 14px Formula1');
  const canvas=document.createElement('canvas');canvas.width=1179;canvas.height=2556;const c=canvas.getContext('2d');c.scale(3,3);
  c.fillStyle='#f8f5f0';c.fillRect(0,0,393,852);c.fillStyle='#e83f36';c.font='700 14px Formula1,Arial,sans-serif';c.fillText('PIT WALL / MY CALLS',24,40);
  c.fillStyle='#30333d';c.font='700 34px "PingFang SC","Microsoft YaHei",sans-serif';c.fillText('\u6211\u7684\u4e09\u6b21',24,105);c.fillText('\u7b56\u7565\u9009\u62e9',24,156);
  c.font='700 24px "PingFang SC","Microsoft YaHei",sans-serif';choiceLabels(choices).forEach((x,i)=>c.fillText(String(i+1).padStart(2,'0')+'  '+x,24,220+i*36));
  c.fillStyle='#e83f36';c.font='700 36px "PingFang SC","Microsoft YaHei",sans-serif';c.fillText('\u6362\u6210\u4f60\uff0c',24,389);c.fillText('\u4f1a\u600e\u4e48\u9009\uff1f',24,443);
  c.fillStyle='#626672';c.font='12px "PingFang SC","Microsoft YaHei",sans-serif';c.fillText('\u7b56\u7565\u53d6\u51b3\u4e8e\u6761\u4ef6\uff0c\u4e0d\u8bbe\u7b80\u5355\u5bf9\u9519\u3002',24,506);
  c.fillStyle='#b9b9b9';for(let y=0;y<2;y++)for(let x=0;x<18;x++)if((x+y)%2===0)c.fillRect(x*16,800+y*16,16,16);c.fillStyle='#e83f36';c.fillRect(279,829,90,2);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('image');
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PIT-WALL-\u6211\u7684\u7b56\u7565.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('\u5206\u4eab\u56fe\u5df2\u751f\u6210\uff0c\u53ef\u5728\u4e0b\u8f7d\u8bb0\u5f55\u4e2d\u67e5\u770b');
 }catch{toast('\u56fe\u7247\u751f\u6210\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u6216\u622a\u5c4f\u4fdd\u5b58');}
 finally{button.disabled=false;button.textContent='\u4fdd\u5b58\u5206\u4eab\u56fe';}
}
window.addEventListener('hashchange',render);render();
