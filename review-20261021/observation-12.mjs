import {screeningItems,observationLabels} from './screening-results-model.mjs';
import {newSession,recordAnswer,recordModelAudio,finishSession,cleanStore,compareRecorded,missingPictures,recordKey} from './observation-records.mjs?v=tap1';
import {readLearningSettings} from './learning-settings.mjs';
import {groupPictures,visualComparisons,shortLabels} from './observation-visual.mjs';
import {checkpoint} from './integrated-child.mjs';
const app=document.getElementById('app'),q=new URLSearchParams(location.search);let store=cleanStore(null),storageOK=true,pictures={'짜장면':'assets/screening-supplement-v1/jjajang-v1.png','책':'assets/screening-supplement-v1/book-v1.png','머리':'assets/screening-supplement-v1/head-v1.png','썰매':'assets/screening-supplement-v1/sled-v1.png'},scene=q.get('scene')||'intro',slot=Math.max(0,Math.min(11,Number(q.get('slot'))||0)),round='baseline',loaded=false;
try{store=cleanStore(JSON.parse(sessionStorage.getItem(recordKey)));}catch{storageOK=false;}
if(scene==='again')round='followup';else if(['card','parent'].includes(scene)&&store.followup&&!store.followup.finishedAt)round='followup';
function persist(){try{sessionStorage.setItem(recordKey,JSON.stringify(store));storageOK=true;}catch{storageOK=false;}}
function active(){return store[round];}
const wordFiles={};let audio=null,audioRevision=0;
function stopAudio(){audioRevision++;if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}}
function pictureAudio(item,small=false){return `<button class="picture-audio ${small?'small':''}" id="listenPicture" aria-label="${wordFiles[item.word]?'그림 단어 듣기':'듣기 준비 중'}" ${wordFiles[item.word]?'':'disabled'}><img ${small?'class="response-picture"':''} id="picture" src="${pictures[item.word]||''}" alt="알아보기 그림"><span class="listen-mark" aria-hidden="true">${wordFiles[item.word]?'♪':'듣기 준비 중'}</span></button><p id="audioStatus" class="audio-status" role="status"></p>`;}
function bindAudio(item){bind('listenPicture',async()=>{stopAudio();const ticket=audioRevision,currentRound=round,currentSession=active(),settings=readLearningSettings(sessionStorage),file=wordFiles[item.word]?.[`${settings.gender}_word_audio_${settings.speed==='slow'?'075':'095'}_file`];if(!file)return;const player=document.createElement('audio');audio=player;player.preload='none';player.src='assets/learning-final-v1/'+file;player.addEventListener('playing',()=>{if(ticket!==audioRevision||round!==currentRound||active()?.startedAt!==currentSession?.startedAt)return;store[round]=recordModelAudio(active(),item.id,settings);persist();},{once:true});const status=document.getElementById('audioStatus');if(status)status.textContent='';try{await player.play();}catch{if(ticket===audioRevision&&status?.isConnected)status.textContent='소리를 못 들려줬어요. 다시 눌러 주세요.';}});}
window.addEventListener('pagehide',stopAudio);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAudio();});window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===parent&&e.data?.type==='journey-pause')stopAudio();});
function move(next,n=slot){stopAudio();scene=next;slot=n;if(active()&&!active().finishedAt){store[round]={...active(),slot};persist();}render();}
function shell(title){return `<div class="top"><button id="back">‹ 이전</button><img src="assets/a11-v1/logo-original-derived.png" alt="또박이"><span class="round-mark">${['card','parent'].includes(scene)?(round==='baseline'?'처음':'다시'):''}</span></div><h1 tabindex="-1">${title}</h1>${!storageOK?'<p role="alert" class="error">브라우저 보관이 막혔어요. 이동·새로고침하면 기록이 사라질 수 있어요.</p>':''}`;}
const label=v=>observationLabels[v]||'아직 살펴보지 않았어요';
function bind(id,fn){const el=document.getElementById(id);if(el)el.onclick=fn;}
function start(){if(!store.baseline)store.baseline=newSession();round='baseline';persist();move(store.baseline.finishedAt?'summary':'card',store.baseline.slot);}
function next(){if(slot===11)move('review');else move('card',slot+1);}
function resultRows(s){return screeningItems.map(x=>`<div class="row"><strong>${x.word} · ${x.sound} (${x.position})</strong><span>${missingPictures.includes(x.id)?'그림 준비 중 · 관찰하지 않음':label(s?.answers[x.id])}</span></div>`).join('');}

function pictureTile(x,value){return `<figure class="result-tile"><img src="${pictures[x.word]||''}" alt="${x.word}" loading="lazy"><figcaption>${x.word}</figcaption>${value&&!['clear','different'].includes(value)?`<small>${shortLabels[value]||'미응답'}</small>`:''}</figure>`;}
function grouped(s){return groupPictures(s?.answers).filter(g=>g.items.length).map(g=>`<section class="visual-group ${g.kind}"><h2><span aria-hidden="true">${g.kind==='clear'?'≋':g.kind==='different'?'≈':'…'}</span> ${g.title}</h2><div class="tile-grid">${g.items.map(x=>pictureTile(x,s?.answers[x.id])).join('')}</div></section>`).join('');}
function dots(){return `<div class="progress-dots" role="img" aria-label="${slot+1} / 12">${Array.from({length:12},(_,n)=>`<span class="${n===slot?'current':n<slot?'past':''}"></span>`).join('')}</div>`;}
function badge(value){return `<span class="reaction-badge ${['clear','different'].includes(value)?value:'unseen'}"><span aria-hidden="true">${value==='clear'?'≋':value==='different'?'≈':'…'}</span> ${shortLabels[value]||'미응답'}</span>`;}
const resultHelp=`<details class="result-help"><summary>결과 안내</summary><p>부모님이 들은 모습이며 점수나 의학적 진단이 아니에요. 단어 모름·무응답은 발음 오류로 판단하지 않아요.</p><p>연령 기준·문항별 판단 기준은 전문가 검토 중이에요. 지금은 정상·지연 판정을 하지 않아요.</p><p>이 탭의 임시 기록이에요. 실제 14일 저장은 서버 연결 전이에요. 두 시점의 차이는 치료 효과나 전체 발음 향상을 뜻하지 않아요.</p><p>생활 속 소통이 걱정되면 언어재활 전문가와 상의해 보세요.</p></details>`;

function render(){
 if(scene==='begin'){start();return;}
 if(scene==='again'){round='followup';scene='repeat';}
 if(['card','parent','review'].includes(scene)&&!active()){scene='intro';}
 stopAudio();app.classList.remove('focus-screen','response-screen');
 const item=screeningItems[slot],s=active();
 if(scene==='intro'){
 app.innerHTML=shell('함께 그림을 볼까요?')+`<p class="intro-lead">그림을 보고, 들린 대로 골라요.</p><details><summary>부모님은 이렇게 해주세요</summary><p>먼저 이름을 알려주거나 소리를 따라 하게 하지 않아요. 들린 그대로 골라 주세요.</p><p>단어 이름을 모름·말하지 않음·잘 모르겠음은 발음 오류가 아니에요. 점수·진단을 내리지 않아요.</p></details><details id="newPictures"><summary>새로 만든 그림 4개 보기</summary><div class="new-pictures"><figure><img src="assets/screening-supplement-v1/jjajang-v1.png" alt="짜장면 그림 후보"><figcaption>짜장면</figcaption></figure><figure><img src="assets/screening-supplement-v1/book-v1.png" alt="책 그림 후보"><figcaption>책</figcaption></figure><figure><img src="assets/screening-supplement-v1/head-v1.png" alt="머리 그림 후보"><figcaption>머리</figcaption></figure><figure><img src="assets/screening-supplement-v1/sled-v1.png" alt="썰매 그림 후보"><figcaption>썰매</figcaption></figure></div><p class="fine">그림 후보 · 문항 타당성 검토 전. 아이에게 그림 이름을 먼저 알려주지는 않아요.</p></details><button class="primary" id="start">${store.baseline?.finishedAt?'첫 관찰 보기':store.baseline?'이어서 그림 보기':'그림 보기'}</button><details><summary>시연·기록 안내</summary><p>가상 반응으로 확인하세요. 이 탭에만 임시 보관하며 실제 14일 서버 저장은 아니에요. ‘처음부터’는 화면만 돌아가고 기록은 유지해요.</p></details><details><summary>시연 기록 초기화</summary><p>이 탭의 두 회차 반응만 비워요. 실제 계정 기록은 없어요.</p><button class="secondary" id="clearRecords">시연 반응 비우기</button></details>`;
 app.querySelector('details p').textContent='그림을 눌러 단어를 들을 수 있어요. 음성 도움 여부는 기록에 함께 남아요. 들린 그대로 골라 주세요.';
 bind('start',start);bind('clearRecords',()=>{if(confirm('이 탭의 첫 관찰과 재관찰 시연 반응을 비울까요?')){store=cleanStore(null);persist();round='baseline';move('intro',0);}});

 }else if(scene==='card'){
 app.classList.add('focus-screen');
 app.innerHTML=shell('그림 보기')+dots()+`<div class="picture">${pictures[item.word]?pictureAudio(item):'<p role="status">그림 불러오는 중…</p>'}</div><button class="primary" id="observe" disabled>반응 고르기</button><button class="quiet-action" id="skip">나중에</button><p id="loadStatus" class="error" role="status"></p>`;bindAudio(item);
 bind('skip',()=>{store[round]=recordAnswer(active(),item.id,'skipped');persist();next();});bind('observe',()=>move('parent'));
 const img=document.getElementById('picture');if(img){const enable=()=>{document.getElementById('observe').disabled=false;};img.onload=enable;img.onerror=()=>{document.getElementById('loadStatus').textContent='그림을 못 불러왔어요. 다시 열어 주세요.';};if(img.complete&&img.naturalWidth)enable();}else if(loaded)document.getElementById('loadStatus').textContent='그림을 못 불러왔어요.';
 }else if(scene==='parent'){
 app.classList.add('response-screen');
 const value=s.answers[item.id],extra=value&&!['clear','different'].includes(value);
 app.innerHTML=shell('어떻게 들렸나요?')+dots()+pictureAudio(item,true)+`<div class="main-choices">${['clear','different'].map(v=>`<button class="choice" data-value="${v}" aria-pressed="${value===v}">${v==='clear'?'또렷했어요':'다르게 들렸어요'}</button>`).join('')}</div><details class="other-reactions" ${extra?'open':''}><summary>다른 반응</summary>${['noSpeech','unknownWord','unsure','skipped'].map(v=>`<button class="choice compact" data-value="${v}" aria-pressed="${value===v}">${observationLabels[v]}</button>`).join('')}</details><button class="primary" id="answerNext" ${value?'':'disabled'}>${slot===11?'마치기':'다음'}</button>`;bindAudio(item);
 app.querySelectorAll('[data-value]').forEach(b=>b.onclick=()=>{store[round]=recordAnswer(active(),item.id,b.dataset.value);persist();render();});bind('answerNext',next);
 }else if(scene==='review'){
 app.innerHTML=shell('이렇게 남겼어요')+grouped(s)+`${!s.finishedAt?'<button class="primary" id="finish">기록 마치기</button>':''}<button class="quiet-action" id="edit">다시 보기</button>`;
 bind('finish',()=>{store[round]=finishSession(s);persist();move(round==='followup'?'compare':'summary');});bind('edit',()=>move('card',0));
 }else if(scene==='summary'){
 const b=store.baseline;app.innerHTML=shell('이렇게 들렸어요')+grouped(b)+`<button class="primary" id="age">다음</button>${!b?.finishedAt?'<button class="secondary" id="continue">이어서 살펴보기</button>':''}`+resultHelp;
 bind('age',()=>move('age'));bind('continue',start);
 }else if(scene==='age'){
 app.innerHTML=shell('소리마다 때가 달라요')+`<p class="notice">연령 기준 · 전문가 검토 중</p><p>아이의 속도로 함께해요.</p><button class="primary" id="travelReady">함께 시작하기</button>`;bind('travelReady',()=>move('start'));
 }else if(scene==='start'){
 app.innerHTML=shell('이제 함께 떠나요')+`<img class="start-dodo" src="assets/dodo-original-rgb-alpha-v1.png" alt="함께 떠나는 도도"><a class="primary" href="travel-start.html">여행 시작</a><details><summary>다시 알아보기</summary><button class="secondary" id="repeat">14일 후 다시 보기 · 시연</button><p class="fine">같은 그림·순서로 살펴봐요. 실제 14일 경과가 아닌 연결 시연이에요.</p></details>`;bind('repeat',()=>move('repeat'));
 }else if(scene==='repeat'){
 app.innerHTML=shell('다시 그림을 만나봐요')+`<p>같은 그림을 다시 만나요.</p><p class="notice">14일 후 화면 연결 시연<br>실제 14일이 지난 기록은 아니에요.</p><details><summary>다시 살펴보기 안내</summary><p>가능하면 같은 부모님이, 첫 반응을 보지 않고 새로 골라요. 첫 기록은 그대로 남아요. 정답을 먼저 알려주지 않아요.</p></details><button class="primary" id="startRepeat">${store.followup?.finishedAt?'비교 기록 보기':store.followup?'재관찰 이어하기':'다시 그림 보기'}</button>`;
 bind('startRepeat',()=>{round='followup';if(!store.followup)store.followup=newSession();persist();move(store.followup.finishedAt?'compare':'card',store.followup.slot);});

 }else if(scene==='compare'){
 const rows=visualComparisons(store.baseline,store.followup);
 app.innerHTML=shell('처음과 다시')+`<div class="comparison-head"><span>그림</span><span>처음</span><span>다시</span></div>${rows.map(x=>`<section class="comparison-card ${x.changed?'changed':''}" aria-label="${x.word} 비교"><figure><img src="${pictures[x.word]||''}" alt="${x.word}" loading="lazy"><figcaption>${x.word}</figcaption></figure><div>${badge(x.before)}</div><span class="comparison-arrow" aria-hidden="true">→</span><div>${badge(x.after)}</div>${!['clear','different'].includes(x.before)||!['clear','different'].includes(x.after)||x.change==='조건이 달라 비교를 보류해요'?`<small class="comparison-hold">${x.change==='조건이 달라 비교를 보류해요'?'조건 다름 · 비교 보류':'비교 보류'}</small>`:''}</section>`).join('')}<a class="primary" href="travel-start.html?scene=map">여행지도</a><button class="quiet-action" id="baseline">첫 결과</button>`+resultHelp;
 app.querySelectorAll('.comparison-card').forEach((card,i)=>{const text=rows[i].cueCondition;if(text){const note=document.createElement('small');note.className='comparison-hold';note.textContent=text;card.append(note);}});
 bind('baseline',()=>move('summary'));
 }else {scene='intro';render();return;}
 bind('back',()=>{if(scene==='card')return slot?move('card',slot-1):move(round==='followup'?'repeat':'intro');if(scene==='parent')return move('card');if(scene==='age')return move('summary');if(scene==='start')return move('age');if(scene==='summary')return move('intro');if(scene==='review')return move('card',11);if(scene==='compare')return move('repeat');if(scene==='repeat')return move('start');location.href='entry-screen.html?scene=preparation-handoff';});
 checkpoint('observe',scene,slot);app.scrollTop=0;app.querySelector('h1')?.focus({preventScroll:true});window.scrollTo(0,0);
}
render();fetch('journey-catalog.json').then(r=>{if(!r.ok)throw Error('catalog');return r.json();}).then(c=>{for(const x of c.days.flatMap(d=>d.cards)){pictures[x.word]='assets/learning-final-v1/'+x.word_image_file;wordFiles[x.word]=x;}}).catch(()=>{}).finally(()=>{loaded=true;if(['card','parent','summary','review','compare'].includes(scene))render();});
