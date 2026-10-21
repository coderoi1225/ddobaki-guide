const key='ddobaki-preview-listening-v1';
export function readLearningSettings(storage){try{const v=JSON.parse(storage.getItem(key));return {gender:['male','female'].includes(v?.gender)?v.gender:'female',speed:['normal','slow'].includes(v?.speed)?v.speed:'normal'};}catch{return {gender:'female',speed:'normal'};}}
export function writeLearningSettings(value,storage){try{storage.setItem(key,JSON.stringify({gender:['male','female'].includes(value.gender)?value.gender:'female',speed:['normal','slow'].includes(value.speed)?value.speed:'normal'}));return true;}catch{return false;}}
