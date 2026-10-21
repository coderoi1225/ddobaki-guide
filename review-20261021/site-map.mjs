const messages=['함께 보고, 듣고, 말해요.','들려주고, 기다려 주세요.','평가 대신, 응원해 주세요.'];
const onboardingSummary=document.querySelector('.node[href="#b"] small');if(onboardingSummary)onboardingSummary.innerHTML='그림 안내 3장<br>목소리 선택 → 아이 초대';
document.getElementById('slides').innerHTML=messages.map((s,i)=>`<div class="screen"><b>B0${i+1}</b><span>${s}<small>합성 실사 그림+짧은 문구+다음. 부모 참여·기다림·지지의 3장 구성.</small></span></div>`).join('')+['B04','B05'].map(id=>`<div class="screen"><b>${id}</b><span>기존안 · 현재 3장으로 통합<small>별도 화면 없음. 기존 자료는 보존하며 목소리 선택은 B06으로 이어집니다.</small></span></div>`).join('');
const scene=(page,scene,slot=0)=>`journey-all.html?page=${page}&scene=${scene}&slot=${slot}`;
const targets={
 A01:['brand-assemble-v1.html'],A02:[scene('entry','login')],A04:['a04-preview.html'],A05:['a05-preview.html'],
 ...Object.fromEntries(messages.map((_,i)=>[`B0${i+1}`,[scene('entry',`preparation-slide-${i}`)]])),
 B06:[scene('entry','preparation-voice')],B07:[scene('entry','preparation-handoff')],
 C01:[scene('observe','intro')],C02:[scene('observe','intro'),'관찰 시작에서 보기 · 기록 후 그림 진입'],C03:[scene('observe','intro'),'관찰 시작에서 보기 · 그림 뒤 반응 선택'],C04:[scene('observe','intro'),'관찰 시작에서 보기 · 12문항 뒤 확인·수정'],C05:[scene('observe','summary')],C06:[scene('observe','age')],C07:[scene('observe','start')],
 D01:[scene('travel','world')],D02:[scene('home','map')],D03:['content-journey.html?day=1#intro','도입 영상 검토본 보기'],D04:[scene('travel','arrival')],
 'E01–05':[scene('travel','words')],E06:[scene('travel','sentences')],E07:[scene('travel','outro')],E08:[scene('travel','book')],E09:[scene('travel','review')],
 F01:[scene('observe','again')],'F02–03':[scene('observe','again'),'재관찰 안내에서 보기 · 시작 후 같은 12그림'],F04:[scene('observe','compare')],F05:['content-journey.html?day=14#outro','14일 결말 영상 검토본 보기']
};
const pending={A03:['entry-review.html','계정 입력 검토실'], 'A-오류':['entry-review.html','오류 시나리오 검토실'],'B-선택':['onboarding-warm-review.html','온보딩에서 선택 가이드 확인'],보조:['journey-all.html','통합 검토실']};
for(const row of document.querySelectorAll('.screen'))if(row.querySelector('b')?.textContent.trim()==='B06')row.querySelector('span').innerHTML='아이가 원하는 목소리를 선택하게 해주세요.<small>합성 여성·남성 얼굴을 눌러 느린 정본 사과 음원 미리듣기 → 다음. 학습 기본 속도와 부모 설정은 변경하지 않습니다.</small>';
for(const row of document.querySelectorAll('.screen'))if(row.querySelector('b')?.textContent.trim()==='B07')row.querySelector('span').innerHTML='아이의 말소리를 알아봐요.<small>12그림·부모 반응·14일 뒤 비교를 짧게 안내 → 시작하기로 첫 그림. 진단 아님·나중에 선택 유지.</small>';
for(const row of document.querySelectorAll('.screen')){
 const id=row.querySelector('b')?.textContent.trim(),target=targets[id],fallback=pending[id];
 if(!target&&!fallback)continue;
 if(target){const link=document.createElement('a');link.className='screen-link';link.href=target[0];link.target='_blank';link.rel='noopener';link.setAttribute('aria-label',`${id} ${target[1]||'화면 바로 보기'}`);while(row.firstChild)link.append(row.firstChild);row.append(link);const cue=document.createElement('small');cue.className='open-cue';cue.textContent=target[1]||'화면 바로 보기 ↗';link.querySelector('span').append(cue);}
 else{const note=document.createElement('small');note.className='open-cue';note.textContent='직접 보기 준비 중 · ';const link=document.createElement('a');link.href=fallback[0];link.target='_blank';link.rel='noopener';link.textContent=fallback[1]+' ↗';note.append(link);row.querySelector('span').append(note);}
}
fetch('journey-catalog.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(c=>{document.getElementById('days').innerHTML=c.days.map(d=>`<tr><td>${d.day}일차</td><td><a href="content-journey.html?day=${d.day}#today" target="_blank" rel="noopener">${d.theme} ↗</a></td><td><a href="content-journey.html?day=${d.day}#intro" target="_blank" rel="noopener">도입</a> · <a href="content-journey.html?day=${d.day}#lessons" target="_blank" rel="noopener">5단어·문장</a> · <a href="content-journey.html?day=${d.day}#outro" target="_blank" rel="noopener">결말</a></td><td>${d.day<=2?`<a href="journey-all.html?page=travel&scene=words&day=${d.day}" target="_blank" rel="noopener">학습 화면 ↗</a>`:'통합 연결 대기 · 자료 검토만 가능'}</td></tr>`).join('');}).catch(()=>{document.getElementById('days').innerHTML='<tr><td colspan="4">목록을 불러오지 못했습니다. 현재 정본 카탈로그를 확인해 주세요.</td></tr>';});
