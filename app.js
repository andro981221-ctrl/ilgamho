(()=>{
'use strict';
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];const cfg=window.SURVEY_CONFIG||{};
const BIDSETS=[{code:'A',low:500,first:1000,high:2000},{code:'B',low:1500,first:3000,high:6000},{code:'C',low:2500,first:5000,high:10000},{code:'D',low:3500,first:7000,high:14000}];
const key='ilgam_bid_v2';let stored=sessionStorage.getItem(key);let choice=stored===null?NaN:Number(stored);if(!Number.isInteger(choice)||choice<0||choice>3){const a=new Uint32Array(1);crypto.getRandomValues(a);choice=a[0]%4;sessionStorage.setItem(key,String(choice));}
const bid=BIDSETS[choice];let current=0,submitting=false,done=false;let submissionToken='';
function format(n){return n.toLocaleString('ko-KR')+'원';}
function renderRadios(target,name,options){const el=$(target);el.innerHTML='';options.forEach(([v,t])=>{const label=document.createElement('label');label.className='choice';const inp=document.createElement('input');inp.type='radio';inp.name=name;inp.value=String(v);const span=document.createElement('span');span.textContent=t;label.append(inp,span);el.append(label);});}
function renderChecks(target,name,options){const el=$(target);options.forEach(([v,t])=>{const label=document.createElement('label');label.className='choice';const inp=document.createElement('input');inp.type='checkbox';inp.name=name;inp.value=String(v);const span=document.createElement('span');span.textContent=t;label.append(inp,span);el.append(label);});}
function renderScale(target,name,title,unknown){const block=document.createElement('div');block.className='scale-group';let heading=document.createElement('p');heading.className='scale-name';heading.textContent=title;block.append(heading);const row=document.createElement('div');row.className='scale-options';const names=['전혀 없음','드물게','가끔','자주','매우 자주'];const likert=['전혀 동의하지 않음','동의하지 않음','보통','동의함','매우 동의함'];let arr=unknown==='pollution'?names:likert;arr.forEach((text,i)=>{const lab=document.createElement('label');lab.className='choice';const inp=document.createElement('input');inp.type='radio';inp.name=name;inp.value=String(i+1);const span=document.createElement('span');span.textContent=`${i+1}. ${text}`;lab.append(inp,span);row.append(lab);});if(unknown){const lab=document.createElement('label');lab.className='choice';const inp=document.createElement('input');inp.type='radio';inp.name=name;inp.value='6';const span=document.createElement('span');span.textContent=unknown==='pollution'?'6. 관찰할 기회 없음 / 기억나지 않음':'6. 잘 모르겠음';lab.append(inp,span);row.append(lab);}block.append(row);$(target).append(block);}
function selected(name){return document.querySelector(`[name="${name}"]:checked`)?.value||'';}
function selections(name){return $$(`[name="${name}"]:checked`).map(x=>x.value);}
renderRadios('#visitFreqChoices','visit_freq',[[1,'방문하거나 지나간 적 없음'],[2,'월 1~2회'],[3,'주 1~2회'],[4,'주 3~4회'],[5,'주 5회 이상']]);
renderChecks('#visitPurposeChoices','visit_purpose',[[1,'수업이나 학교시설 이용을 위한 통행'],[2,'산책 또는 운동'],[3,'휴식 또는 대화'],[4,'경관 감상 또는 사진 촬영'],[5,'동아리·행사 등 학교 활동'],[6,'최근 1개월 동안 방문하거나 지나간 적 없음'],[7,'기타']]);
renderRadios('#qualityChoices','quality_percep',[[1,'매우 나쁨'],[2,'나쁨'],[3,'보통'],[4,'좋음'],[5,'매우 좋음'],[6,'잘 모르겠음']]);
[['pollution_algae','녹조 또는 물의 변색'],['pollution_odor','불쾌한 냄새'],['pollution_debris','물 위에 떠 있는 쓰레기나 부유물']].forEach(a=>renderScale('#pollutionGroups',...a,'pollution'));
renderRadios('#zeroWtpChoices','zero_wtp',[[1,'예, 더 적은 금액이라면 납부할 의사가 있습니다.'],[2,'아니오, 0원을 초과하는 금액은 납부할 의사가 없습니다.'],[3,'잘 모르겠습니다.']]);
renderRadios('#refusalChoices','refusal_reason',[[1,'수질개선의 필요성을 크게 느끼지 못해서'],[2,'경제적으로 추가 비용을 부담하기 어려워서'],[3,'수질개선보다 다른 지출을 우선하고 싶어서'],[4,'기존 학교 예산이나 정화기금을 활용해야 한다고 생각해서'],[5,'학생에게 별도의 부담금을 부과하는 방식에 반대해서'],[6,'부담금을 납부해도 수질개선 효과가 나타날지 확신하기 어려워서'],[7,'학교의 부담금 관리 및 집행을 신뢰하기 어려워서'],[8,'기타']]);
renderRadios('#needChoices','improve_need',[[1,'전혀 필요하지 않다'],[2,'별로 필요하지 않다'],[3,'보통이다'],[4,'필요하다'],[5,'매우 필요하다'],[6,'잘 모르겠다']]);
renderScale('#environmentGroups','env_1','환경을 보전하는 것은 우리 사회의 중요한 과제이다.');renderScale('#environmentGroups','env_2','환경문제는 일상생활에서 중요하게 고려할 필요가 있다.');
renderScale('#attachmentGroups','attach_1','일감호는 나에게 개인적으로 의미 있는 장소이다.');renderScale('#attachmentGroups','attach_2','나는 일감호에 정서적인 애착을 느낀다.');
renderRadios('#trustChoices','project_trust',[[1,'전혀 신뢰하지 않는다'],[2,'신뢰하지 않는다'],[3,'보통이다'],[4,'신뢰한다'],[5,'매우 신뢰한다'],[6,'잘 모르겠다']]);
renderRadios('#yearChoices','year',[[1,'1학년'],[2,'2학년'],[3,'3학년'],[4,'4학년'],[5,'5학년 이상']]);
renderRadios('#collegeChoices','college',[[1,'인문·사회계열'],[2,'자연과학계열'],[3,'공학계열'],[4,'예체능계열'],[5,'기타 또는 분류가 어려움']]);
renderRadios('#residenceChoices','residence',[[1,'교내 기숙사'],[2,'학교 인근 자취·하숙'],[3,'서울시 내 통학'],[4,'경기도·인천 등 수도권에서 통학'],[5,'기타']]);
renderRadios('#expenseChoices','monthly_expense',[[1,'10만 원 미만'],[2,'10만 원 이상~20만 원 미만'],[3,'20만 원 이상~30만 원 미만'],[4,'30만 원 이상~50만 원 미만'],[5,'50만 원 이상~70만 원 미만'],[6,'70만 원 이상'],[7,'잘 모르겠음 / 응답하고 싶지 않음']]);
renderRadios('#scholarshipChoices','scholarship',[[1,'장학금을 받지 않음'],[2,'수업료 일부 감면'],[3,'수업료 전액 감면'],[4,'잘 모르겠음 / 응답하고 싶지 않음']]);
renderRadios('#burdenChoices','tuition_burden',[[1,'전혀 부담되지 않는다'],[2,'별로 부담되지 않는다'],[3,'보통이다'],[4,'부담된다'],[5,'매우 부담된다'],[6,'잘 모르겠다 / 응답하고 싶지 않다']]);
$('#billBid').textContent=format(bid.first);$('#billTotal').textContent=format(2650000+bid.first);$('#firstBidText').textContent=format(bid.first);
if(cfg.contactEmail){$('#contactEmail').textContent=cfg.contactEmail;}
function clearRadios(name){$$(`[name="${name}"]`).forEach(x=>x.checked=false);}
function updateAnswer(){const a=selected('answer1');$('#secondBidBlock').hidden=!a;if(a){const amount=a==='1'?bid.high:bid.low;$('#secondBidQuestion').textContent=`C1-${a==='1'?'1':'2'}. 동일한 사업을 위해 부담금이 ${format(amount)}이라면 납부하시겠습니까?`;}else{clearRadios('answer2');}updateNN();}
function updateNN(){const nn=selected('answer1')==='0'&&selected('answer2')==='0';$('#noNoBlock').hidden=!nn;if(!nn){clearRadios('zero_wtp');clearRadios('refusal_reason');$('#refusalOther').value='';$('#refusalOtherWrap').hidden=true;}}
$$('[name="answer1"]').forEach(x=>x.addEventListener('change',()=>{clearRadios('answer2');updateAnswer();}));$$('[name="answer2"]').forEach(x=>x.addEventListener('change',updateNN));
$('#visitFreqChoices').addEventListener('change',()=>{const none=selected('visit_freq')==='1';const checks=$$('[name="visit_purpose"]');checks.forEach(x=>{if(none)x.checked=x.value==='6';else if(x.value==='6')x.checked=false;});});
$('#visitPurposeChoices').addEventListener('change',e=>{const t=e.target;if(t?.name!=='visit_purpose')return;if(t.value==='6'&&t.checked){$$('[name="visit_purpose"]').forEach(x=>{if(x!==t)x.checked=false;});$$('[name="visit_freq"]').forEach(x=>x.checked=x.value==='1');}else if(t.checked){const none=$('[name="visit_purpose"][value="6"]');if(none)none.checked=false; if(selected('visit_freq')==='1')clearRadios('visit_freq');}$('#purposeOtherWrap').hidden=!selections('visit_purpose').includes('7');});
$('#refusalChoices').addEventListener('change',()=>$('#refusalOtherWrap').hidden=selected('refusal_reason')!=='8');
const labels=['연구 안내','조사 대상 및 일감호 이용','가상 사업 및 지불의사','환경 인식 및 개인 특성','최종 확인'];
function showStep(n){current=n;$$('.step').forEach((e,i)=>e.classList.toggle('active',i===n));$('#stepLabel').textContent=labels[n];$('#progressText').textContent=`${n+1} / 5`;$('#progressFill').style.width=((n+1)*20)+'%';$('#backBtn').hidden=n===0;$('#nextBtn').textContent=n===4?'응답 제출': '다음 →';if(n===4)updateReview();window.scrollTo({top:0,behavior:'instant'});}
function warn(msg){alert(msg);}
function requires(names){for(const [name,display] of names){if(!selected(name)){warn(`${display} 문항에 응답해 주세요.`);const el=$(`[name="${name}"]`);el?.focus();return false;}}return true;}
function validate(n){if(n===0){if(!selected('consent'))return warn('참여 동의 여부를 선택해 주세요.'),false;if(selected('consent')==='no'){terminate('동의하지 않음을 선택하셨습니다. 설문은 제출되지 않았습니다.');return false;}return true;}
if(n===1){if(!selected('eligible'))return warn('A1 문항에 응답해 주세요.'),false;if(selected('eligible')==='no'){terminate('조사 대상에 해당하지 않아 설문을 종료합니다. 응답은 저장되지 않았습니다.');return false;}if(!requires([['visit_freq','B1'],['quality_percep','B3'],['pollution_algae','B4 녹조'],['pollution_odor','B4 냄새'],['pollution_debris','B4 부유물']]))return false;if(!selections('visit_purpose').length)return warn('B2 이용 목적을 선택해 주세요.'),false;if(selections('visit_purpose').includes('7')&&!$('#purposeOther').value.trim())return warn('B2 기타 내용을 입력해 주세요.'),false;if(selected('visit_freq')==='1'&&!(selections('visit_purpose').length===1&&selections('visit_purpose')[0]==='6'))return warn('B1 방문 없음 응답과 B2 선택지가 일치하지 않습니다.'),false;if(selected('visit_freq')!=='1'&&selections('visit_purpose').includes('6'))return warn('B1과 B2의 방문 여부가 일치하지 않습니다.'),false;return true;}
if(n===2){if(!requires([['answer1','C1'],['answer2','C1 후속 질문']]))return false;if(selected('answer1')==='0'&&selected('answer2')==='0'){if(!requires([['zero_wtp','C1-3'],['refusal_reason','C1-4']]))return false;if(selected('refusal_reason')==='8'&&!$('#refusalOther').value.trim())return warn('C1-4 기타 이유를 입력해 주세요.'),false;}return true;}
if(n===3)return requires([['improve_need','D1'],['env_1','D2 첫 번째 항목'],['env_2','D2 두 번째 항목'],['attach_1','D3 첫 번째 항목'],['attach_2','D3 두 번째 항목'],['project_trust','D4'],['year','E1'],['college','E2'],['residence','E3'],['monthly_expense','E4'],['scholarship','E5'],['tuition_burden','E6']]);if(n===4)return $('#confirmSubmission').checked||(warn('제출 확인에 동의해 주세요.'),false);return true;}
function updateReview(){const a=selected('answer1');const b=selected('answer2');const code=(a==='1'?'Y':'N')+(b==='1'?'Y':'N');$('#reviewSummary').innerHTML=`<div>응답자: <strong>서울캠퍼스 학부 재학생</strong></div><div>설문 유형: <strong>${bid.code}</strong></div><div>최초 제시금액: <strong>${format(bid.first)}</strong></div><div>후속 제시금액: <strong>${format(a==='1'?bid.high:bid.low)}</strong></div><div>응답 유형: <strong>${code}</strong></div><div>납부 횟수: <strong>1회</strong> · 가상 효과 유지기간: <strong>3년</strong></div>`;}
function data(){const a=selected('answer1'),b=selected('answer2');const out={schema_version:'1.0',response_id:submissionToken,bid_version:bid.code,bid1:bid.first,bid2:a==='1'?bid.high:bid.low,answer1:+a,answer2:+b,response_pattern:(a==='1'?'Y':'N')+(b==='1'?'Y':'N'),visit_freq:+selected('visit_freq'),visit_purpose:selections('visit_purpose').map(Number),visit_purpose_other:$('#purposeOther').value.trim(),quality_percep:+selected('quality_percep'),pollution_algae:+selected('pollution_algae'),pollution_odor:+selected('pollution_odor'),pollution_debris:+selected('pollution_debris'),zero_wtp:a==='0'&&b==='0'?+selected('zero_wtp'):'',refusal_reason:a==='0'&&b==='0'?+selected('refusal_reason'):'',refusal_other:$('#refusalOther').value.trim(),improve_need:+selected('improve_need'),env_1:+selected('env_1'),env_2:+selected('env_2'),attach_1:+selected('attach_1'),attach_2:+selected('attach_2'),project_trust:+selected('project_trust'),year:+selected('year'),college:+selected('college'),residence:+selected('residence'),monthly_expense:+selected('monthly_expense'),scholarship:+selected('scholarship'),tuition_burden:+selected('tuition_burden'),scenario_years:3,payment_count:1};return out;}
function terminate(msg){done=true;$('#surveyForm').hidden=true;$('#navigation').hidden=true;$('.progress-wrap').hidden=true;$('#endScreen').hidden=false;$('#endIcon').textContent='—';$('#endTitle').textContent='설문이 종료되었습니다';$('#endMessage').textContent=msg;}
function success(){submitting=false;done=true;sessionStorage.removeItem(key);$('#surveyForm').hidden=true;$('#navigation').hidden=true;$('.progress-wrap').hidden=true;$('#endScreen').hidden=false;$('#endIcon').textContent='✓';$('#endTitle').textContent='응답이 저장되었습니다';$('#endMessage').textContent='설문에 참여해 주셔서 감사합니다. 구글 스프레드시트에서 응답 저장이 확인되었습니다.';$('#rafflePanel').hidden=false;window.scrollTo({top:0,behavior:'smooth'});}
// Google Apps Script의 HTML 응답은 sandbox iframe 내에서 실행될 수 있어 상위 페이지에
// postMessage가 도달하지 않는 경우가 있습니다. 저장된 응답 UUID를 JSONP로 재확인합니다.
let verifyTimer=null,verifyCount=0,verifyBusy=false;
function verifyStored(){
 if(done||!submitting||verifyBusy||!submissionToken)return;
 verifyBusy=true;
 const cb='ilgamConfirm_'+String(Date.now())+'_'+String(++verifyCount);
 const script=document.createElement('script');
 let finished=false;
 const cleanup=()=>{if(finished)return;finished=true;verifyBusy=false;delete window[cb];script.remove();};
 window[cb]=result=>{cleanup();if(result&&result.saved===true)success();};
 script.onerror=cleanup;
 const url=(cfg.scriptUrl||'').trim();
 script.src=url+'?action=status&response_id='+encodeURIComponent(submissionToken)+'&callback='+encodeURIComponent(cb);
 document.head.append(script);
 window.setTimeout(cleanup,6000);
}
function submit(){
 if(submitting)return;const url=(cfg.scriptUrl||'').trim();
 if(!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(url)){$('#submissionNote').textContent='아직 응답 저장 주소가 연결되지 않았습니다. 관리자에게 알려주세요.';return;}
 submitting=true;$('#nextBtn').disabled=true;$('#nextBtn').textContent='저장 확인 중…';$('#submissionNote').textContent='응답을 전송하고 구글 스프레드시트의 저장 여부를 확인하는 중입니다.';
 submissionToken=submissionToken||(crypto.randomUUID?crypto.randomUUID():[...crypto.getRandomValues(new Uint32Array(4))].join('-'));
 const frame=$('#submissionFrame');
 frame.addEventListener('load',()=>{if(submitting&&!done)window.setTimeout(verifyStored,500);},{once:true});
 const form=document.createElement('form');form.method='POST';form.action=url;form.target='submissionFrame';form.style.display='none';
 const field=document.createElement('input');field.type='hidden';field.name='payload';field.value=JSON.stringify(data());form.append(field);document.body.append(form);form.submit();form.remove();
 // 응답 확인 요청이 느릴 수 있어 일정 간격으로 재확인하되 제출을 재전송하지는 않습니다.
 [3000,6500,11000,16500].forEach(ms=>window.setTimeout(verifyStored,ms));
 window.setTimeout(()=>{if(!done&&submitting){
   submitting=false;$('#nextBtn').disabled=false;$('#nextBtn').textContent='저장 여부 다시 확인';
   $('#submissionNote').textContent='서버에서 저장 여부를 확인하지 못했습니다. 응답이 이미 저장되었을 수 있으니 다시 제출하지 마세요. 아래 버튼으로 저장 여부를 조회할 수 있습니다.';
 }},23000);
}
// 재확인 버튼은 재전송이 아닌 상태 조회를 수행. 확인된 경우에만 완료 화면으로 이동.
function recheck(){
 if(done||submitting)return;
 submitting=true;$('#nextBtn').disabled=true;$('#nextBtn').textContent='확인 중…';
 $('#submissionNote').textContent='기존 응답의 저장 여부만 다시 확인합니다. 새로 제출하지 않습니다.';
 verifyStored();window.setTimeout(()=>{if(!done&&submitting){submitting=false;$('#nextBtn').disabled=false;$('#nextBtn').textContent='저장 여부 다시 확인';$('#submissionNote').textContent='저장 확인에 실패했습니다. 연구자에게 문의해 주세요. 응답 제출을 반복하지 마세요.';}},7000);
}
window.addEventListener('message',event=>{if(!submitting||done)return;try{const origin=new URL(event.origin).hostname;if(!(origin==='script.google.com'||origin==='script.googleusercontent.com'||origin.endsWith('.googleusercontent.com')))return;}catch{return;}const v=event.data;if(!v||v.source!=='ILGAM_SURVEY_BACKEND'||v.response_id!==submissionToken)return;if(v.ok===true){success();}else{$('#submissionNote').textContent='저장 서버가 오류를 반환했습니다. 다시 제출하지 말고 관리자에게 문의해 주세요.';}});
$('#nextBtn').addEventListener('click',()=>{if(done||submitting||!validate(current))return;if(current===4){if(submissionToken)recheck();else submit();}else showStep(current+1);});$('#backBtn').addEventListener('click',()=>{if(!submitting&&current>0)showStep(current-1);});showStep(0);
})();
