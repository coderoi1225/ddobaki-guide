export function validateLogin(email,password){
 const errors={};
 if(!email.trim())errors.email='이메일을 입력해 주세요.';
 else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))errors.email='이메일 주소를 확인해 주세요.';
 if(!password)errors.password='비밀번호를 입력해 주세요.';
 return errors;
}
export function destination(saved){return ({child:{id:'S03B',title:'아이 정보부터 이어가요',body:'애칭과 태어난 해·달을 입력하는 화면으로 연결됩니다.'},consent:{id:'S03C',title:'약속과 동의부터 이어가요',body:'이미 입력한 정보를 다시 묻지 않고 동의 화면으로 연결됩니다.'},voice:{id:'P01',title:'여행을 준비해요',body:'프로그램 안내 뒤 부모가 소리와 목소리를 준비합니다.'},home:{id:'D02',title:'하던 여행을 이어가요',body:'홈의 여행지도에서 오늘 정거장을 확인합니다.'}})[saved]||{id:'P01',title:'여행을 준비해요',body:'프로그램 안내 뒤 부모가 소리와 목소리를 준비합니다.'};}
export function failure(type){return ({credentials:{message:'이메일과 비밀번호를 다시 확인해 주세요.',help:'비밀번호가 기억나지 않으면 아래에서 찾을 수 있어요.'},network:{message:'연결이 끊겼어요. 인터넷 연결을 확인해 주세요.',help:'연결한 뒤 비밀번호를 다시 입력해 주세요.'},server:{message:'지금은 연결이 원활하지 않아요. 잠시 뒤 다시 로그인해 주세요.',help:'입력한 이메일은 그대로 두었어요.'},limited:{message:'시도가 많아 잠시 쉬어야 해요.',help:'잠시 뒤 다시 시도하거나 비밀번호 찾기를 이용해 주세요.'}})[type]||{message:'연결을 마치지 못했어요.',help:'잠시 뒤 다시 로그인해 주세요.'};}
