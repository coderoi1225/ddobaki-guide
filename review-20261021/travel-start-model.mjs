export function nextTravelState(state,event){return ({'world:ended':'map','world:skip':'map','map:depart':'arrival','arrival:explore':'learning'})[state+':'+event]||state;}
export function nextDayStage(stage,slot,event){if(stage==='words'&&event==='next')return slot<4?{stage,slot:slot+1}:{stage:'sentences',slot};const next=({'sentences:next':'outro','outro:ended':'book','outro:skip':'book','book:next':'review'})[stage+':'+event];return {stage:next||stage,slot};}
export function worldControl({paused,ended}){return {label:ended?'다시 보기':paused?'이야기 보기':'잠깐 멈추기',action:paused?'play':'pause'};}
