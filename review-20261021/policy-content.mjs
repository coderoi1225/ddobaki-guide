export function policySection(source,kind){
 const titles={terms:'# 1. 이용약관',privacy:'# 2. 개인정보 처리방침'};
 const title=titles[kind];
 if(!title)throw Error('Unknown policy');
 const lines=source.split(/\r?\n/),start=lines.indexOf(title);
 if(start<0)throw Error('Missing policy');
 let end=lines.findIndex((line,index)=>index>start&&/^# \d+\. /.test(line));
 if(end<0)end=lines.length;
 const section=lines.slice(start+1,end).join('\n').trim();
 if(!section)throw Error('Empty policy');
 return section;
}
