import {learningSource} from './journey-model.mjs';
export function parentObservation(value){const label=({clear:'또렷하게 들렸어요',different:'조금 다르게 들렸어요',quiet:'아직 말하지 않았어요',unsure:'잘 모르겠어요'})[value];return label?{value,label}:null;}
export function preparationTheme(name){if(name==='warm-white')return {...preparationTheme('warm'),button:'#BF4936',buttonText:'#FFFFFF'};return name==='warm'?{accent:'#F46F53',ink:'#3B2722',paper:'#FFF8F0',font:'Jua'}:{accent:'#3966A7',ink:'#26364B',paper:'#FFF8F0',font:'system'};}
export function onboardingRoute(state){return ({'resume-guide':'slide-2','resume-voice':'voice','resume-child':'handoff',complete:'home'})[state]||'slides';}
export function preparationAssets(catalog){
 const cards=catalog.days.flatMap(d=>d.cards),apple=cards.find(c=>c.content_id==='D03-W01'&&c.word==='사과'),bear=cards.find(c=>c.content_id==='D05-W01'&&c.word==='곰');
 if(!apple||!bear?.word_image_file)throw Error('Canonical preparation assets missing');
 return {word:apple.word,female:learningSource(apple,'female','normal','word'),male:learningSource(apple,'male','normal','word'),previewSlow:{female:learningSource(apple,'female','slow','word'),male:learningSource(apple,'male','slow','word')},picture:'assets/learning-final-v1/'+bear.word_image_file};
}
