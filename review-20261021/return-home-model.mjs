import {safeCheckpoint} from './integrated-model.mjs?v=revisit1';
export const progressKey='ddobaki-travel-progress-preview-v1';
export function cleanProgress(p){return {completed:[1,2].filter(d=>p?.completed?.includes(d)),resume:p?.resume?safeCheckpoint(p.resume):null};}
export function rememberProgress(value,position){const p=cleanProgress(value),cp=safeCheckpoint(position);if(cp.page==='home'||cp.page==='entry'&&['splash','login','preparation-home'].includes(cp.scene))return p;if(cp.page==='travel'&&cp.scene==='complete-map')return {completed:[...new Set([...p.completed,cp.day||1])].sort(),resume:null};return {...p,resume:cp};}
export function homeChoice(value){const p=cleanProgress(value);if(p.resume)return {label:'이어하기',day:p.resume.day||1,target:p.resume};const day=p.completed.length?2:1;return {label:p.completed.includes(2)?'둘째 날 다시 보기':day===2?'둘째 날 출발':'출발하기',day,target:day===2?{page:'travel',scene:'intro',slot:0,day:2}:{page:'travel',scene:'world',slot:0}};}
