const rows=[
 ['곰','ㄱ','어두',42,'2세 후반 이전','첫 ‘ㄱ’ 소리가 빠지거나 다른 소리로 들리는지'],
 ['딸기','ㄸ','어두',42,'2세 후반 이전','첫 ‘ㄸ’ 소리가 다른 소리로 들리는지'],
 ['토끼','ㅌ','어두',42,'2세 후반 이전','첫 ‘ㅌ’ 소리가 빠지거나 다른 소리로 들리는지'],
 ['자동차','ㅈ','어두',60,'2세 후반 이전','첫 ‘ㅈ’ 소리가 빠지거나 다른 소리로 들리는지'],
 ['짜장면','ㅉ','어두',60,'4세 전반','첫 ‘ㅉ’ 소리가 다른 소리로 들리는지'],
 ['책','ㅊ','어두',60,'4세 전반','첫 ‘ㅊ’ 소리를 살펴보기. 받침 ‘ㄱ’은 이번 목표가 아님'],
 ['라면','ㄹ','어두',66,'첫소리 ㄹ: 5세 전반','첫 ‘ㄹ’ 소리. 받침 ㄹ과 구분'],
 ['머리','ㄹ','어중',66,'이 문항의 어중 ㄹ에 직접 적용 불가','가운데 ‘리’의 ㄹ 소리. 어두·받침과 구분'],
 ['별','ㄹ','종성',42,'받침 ㄹ: 2세 후반 이전','마지막 받침 ‘ㄹ’ 소리. 첫소리 ㄹ과 구분'],
 ['사과','ㅅ','어두',72,'첫소리 ㅅ: 5세 전반','첫 ‘ㅅ’ 소리가 빠지거나 다르게 들리는지'],
 ['썰매','ㅆ','어두',72,'첫소리 ㅆ: 5세 전반','첫 ‘ㅆ’ 소리가 다른 소리로 들리는지'],
 ['우산','ㅅ','어중',72,'이 문항의 어중 ㅅ에 직접 적용 불가','가운데 ‘산’의 ㅅ 소리. 첫소리와 구분']
];
export const firstResultSteps=[{id:'observation',title:'이렇게 들렸어요'},{id:'age-reference',title:'소리마다 때가 달라요',verified:false},{id:'start',title:'이제 함께 떠나요',action:'들려주고, 기다려 주세요.'}];
export const screeningItems=rows.map(([word,sound,position,legacyMonths,research,parent],i)=>({id:i+1,word,sound,position,legacyMonths,research,parent,expertReview:true}));
export const observationLabels={clear:'또렷하게 들렸어요',different:'다르게 들렸어요',noSpeech:'말하지 않았어요',unknownWord:'그림 이름을 몰랐어요',unsure:'잘 모르겠어요',skipped:'다음에 살펴봐요'};
export function compareObservation(before,after){if(!['clear','different'].includes(before)||!['clear','different'].includes(after))return '비교할 기록이 부족해요';return before===after?'같게 들렸어요':after==='clear'?'이번에는 또렷하게 들렸어요':'이번에는 다르게 들렸어요';}
export function compareSessions(before,after){const compatible=before&&after&&before.protocol&&before.pictureVersion&&before.protocol===after.protocol&&before.pictureVersion===after.pictureVersion;return screeningItems.map(item=>({...item,before:before?.answers?.[item.id]??null,after:after?.answers?.[item.id]??null,change:[5,6,8,11].includes(item.id)?'그림 확보 전 · 비교 보류':compatible?compareObservation(before.answers?.[item.id],after.answers?.[item.id]):'조건이 달라 비교를 보류해요'}));}
export const exampleBefore={protocol:'draft-v1',pictureVersion:'master-v1',ageMonths:54,observer:'가상 보호자 A',modelPlayed:false,answers:{1:'clear',2:'clear',3:'different',4:'clear',5:'unsure',6:'unknownWord',7:'different',8:'skipped',9:'clear',10:'different',11:'noSpeech',12:'unsure'}};
export const exampleAfter={...exampleBefore,answers:{1:'clear',2:'clear',3:'clear',4:'clear',5:'clear',6:'unsure',7:'different',8:'different',9:'different',10:'clear',11:'noSpeech',12:'clear'}};
