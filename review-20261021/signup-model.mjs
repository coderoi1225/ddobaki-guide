import {validateLogin} from './entry-model.mjs';
export function validateAccount(email,password,confirmation){
 const errors=validateLogin(email,password);
 if(password&&Array.from(password).length<8)errors.password='비밀번호는 8자 이상 입력해 주세요.';
 if(!confirmation)errors.confirmation='비밀번호를 한 번 더 입력해 주세요.';
 else if(password!==confirmation)errors.confirmation='비밀번호가 서로 달라요.';
 return errors;
}
export function validateChild(d,today){
 const errors={},nickname=String(d.nickname||'').trim(),year=Number(d.year),month=Number(d.month);
 if(!nickname)errors.nickname='아이 이름을 입력해 주세요.';
 else if(Array.from(nickname).length>8)errors.nickname='아이 이름은 8자 이내로 입력해 주세요.';
 if(!Number.isInteger(year)||year<1900||year>today.year)errors.year='태어난 해를 골라 주세요.';
 if(!Number.isInteger(month)||month<1||month>12)errors.month='태어난 달을 골라 주세요.';
 else if(year===today.year&&month>today.month)errors.month='아직 오지 않은 달이에요. 다시 골라 주세요.';
 return errors;
}
export const canContinue=c=>c.child===true&&c.terms===true;
export function validateChildDate(d,today){const errors={};const name=String(d.nickname||'').trim();if(!name)errors.nickname='아이 이름을 입력해 주세요.';else if(Array.from(name).length>8)errors.nickname='아이 이름은 8자 이내로 입력해 주세요.';const raw=String(d.birthDate||'');const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);if(!match)errors.birthDate='생년월일을 입력해 주세요.';else{const [y,m,day]=match.slice(1).map(Number),date=new Date(Date.UTC(y,m-1,day));if(y<1900||date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==day)errors.birthDate='생년월일을 확인해 주세요.';else if(raw>`${today.year}-${String(today.month).padStart(2,'0')}-${String(today.day).padStart(2,'0')}`)errors.birthDate='미래 날짜는 입력할 수 없어요.';}return errors;}
