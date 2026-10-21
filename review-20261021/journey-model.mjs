const pad=n=>String(n).padStart(2,'0');
export function learningSource(row,gender='male',speed='normal',kind='word'){
 if(!['male','female'].includes(gender)||!['normal','slow'].includes(speed)||!['word','sentence'].includes(kind))throw Error('Unknown audio selection');
 const key=`${gender}_${kind}_audio_${speed==='slow'?'075':'095'}_file`;
 if(!row[key])throw Error('Missing canonical audio: '+key);
 return 'assets/learning-final-v1/'+row[key];
}
export function daySequence(day){
 if(!Number.isInteger(day)||day<1||day>14)throw Error('Day out of range');
 return ['intro',...Array.from({length:5},(_,i)=>`D${pad(day)}-W${pad(i+1)}`),'outro'];
}
export function makeCatalog(input){
 if(input.length!==70||new Set(input.map(x=>x.content_id)).size!==70)throw Error('Expected 70 distinct canonical cards');
 const rows=[...input].sort((a,b)=>Number(a.day)-Number(b.day)||Number(a.slot)-Number(b.slot));
 for(let i=0;i<rows.length;i++){const r=rows[i],day=Math.floor(i/5)+1,slot=i%5+1;if(Number(r.day)!==day||Number(r.slot)!==slot||r.content_id!==`D${pad(day)}-W${pad(slot)}`)throw Error('Canonical order mismatch');}
 const clip=(folder,name,silent='silent',guide='preview')=>({silent:`assets/${folder}/${name}-${silent}.mp4`,guide:`assets/${folder}/${name}-${guide}.mp4`});
 return {version:'2026-10-18-integrated-review-v1',learningPlaybackRate:1,defaultSpeed:'normal',male:'Achird',female:'Zephyr',
  branding:{silent:'assets/polish-v1/branding-silent.mp4',guide:'assets/polish-v1/branding-cue-preview.mp4'},
  world:{silent:'assets/world-v1/world-no-voice.mp4',guide:'assets/world-v1/world-preview.mp4'},
  days:Array.from({length:14},(_,i)=>{const day=i+1,id=`D${pad(day)}`,cards=rows.filter(r=>Number(r.day)===day);
   let intro=day===1?clip('day1-story-v1','intro'):clip(day<=4?'day234-v1':day<=8?'day5678-v1':day<=10?'day910-v1':'day1114-v1',id+'-IN');
   if([2,3,7].includes(day))intro=clip('polish-v1',id+'-IN');
   const outro=clip(day<=10?'polish-v1':'day1114-v1',id+'-OUT');
   return {day,theme:cards[0].theme,cards,intro,outro,sequence:daySequence(day)};
  })};
}
