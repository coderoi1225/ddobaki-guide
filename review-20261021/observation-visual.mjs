import {screeningItems} from './screening-results-model.mjs';
import {compareRecorded} from './observation-records.mjs?v=full12';
export const shortLabels={clear:'또렷',different:'다름',noSpeech:'말 안 함',unknownWord:'이름 모름',unsure:'모르겠음',skipped:'나중에'};
export function groupPictures(answers={}){return [{kind:'clear',title:'또렷했어요',items:screeningItems.filter(x=>answers[x.id]==='clear')},{kind:'different',title:'다르게 들렸어요',items:screeningItems.filter(x=>answers[x.id]==='different')},{kind:'unseen',title:'확인 못 했어요',items:screeningItems.filter(x=>!['clear','different'].includes(answers[x.id]))}];}
export function visualComparisons(a,b){return compareRecorded(a,b).map(x=>({...x,changed:['clear','different'].includes(x.before)&&['clear','different'].includes(x.after)&&x.before!==x.after&&x.change!=='조건이 달라 비교를 보류해요'})).sort((x,y)=>Number(y.changed)-Number(x.changed)||x.id-y.id);}
