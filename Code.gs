/**
 * 일감호 CVM 설문 → Google Sheets 저장
 * 1) Google Spreadsheet에서 확장 프로그램 > Apps Script를 열어 이 파일 전체를 붙여 넣습니다.
 * 2) 필요하다면 SHEET_NAME 수정 후 웹 앱으로 배포하세요.
 * 3) 설문 페이지 config.js에 /exec URL을 넣습니다.
 * 별도 개인정보를 기록하지 않으며, 저장 확인용 무작위 ID로 중복 제출을 방지합니다.
 */
const SHEET_NAME='responses';
const HEADERS=[
 'received_at','response_id','schema_version','bid_version','bid1','bid2','answer1','answer2','response_pattern',
 'visit_freq','purpose_transit','purpose_walk','purpose_rest','purpose_scenery','purpose_event','purpose_never','purpose_other','visit_purpose_other',
 'quality_percep','pollution_algae','pollution_odor','pollution_debris','zero_wtp','refusal_reason','refusal_other',
 'improve_need','env_1','env_2','attach_1','attach_2','project_trust',
 'year','college','residence','monthly_expense','scholarship','tuition_burden','scenario_years','payment_count'
];
const BIDS={A:[1000,500,2000],B:[3000,1500,6000],C:[5000,2500,10000],D:[7000,3500,14000]};
function num(v,min,max){const n=Number(v);return Number.isInteger(n)&&n>=min&&n<=max?n:null;}
function shortText(s,n){return String(s||'').slice(0,n).replace(/^[=+@\-\t\r]/,'\'$&');}
function validate_(d){
 if(!d||typeof d!=='object'||!BIDS[d.bid_version])throw Error('Invalid bid version');
 if(!/^[a-f0-9-]{20,80}$/i.test(String(d.response_id)))throw Error('Invalid response ID');
 const expected=BIDS[d.bid_version];if(d.bid1!==expected[0]||num(d.answer1,0,1)===null||num(d.answer2,0,1)===null)throw Error('Invalid first bid/answer');
 if(d.bid2!==(d.answer1===1?expected[2]:expected[1]))throw Error('Invalid second bid');
 if(d.response_pattern!==(d.answer1===1?'Y':'N')+(d.answer2===1?'Y':'N'))throw Error('Invalid answer pattern');
 for(const [k,min,max] of [['visit_freq',1,5],['quality_percep',1,6],['pollution_algae',1,6],['pollution_odor',1,6],['pollution_debris',1,6],['improve_need',1,6],['env_1',1,5],['env_2',1,5],['attach_1',1,5],['attach_2',1,5],['project_trust',1,6],['year',1,5],['college',1,5],['residence',1,5],['monthly_expense',1,7],['scholarship',1,4],['tuition_burden',1,6]]){if(num(d[k],min,max)===null)throw Error('Missing '+k);}
 if(!Array.isArray(d.visit_purpose)||!d.visit_purpose.length||d.visit_purpose.some(v=>num(v,1,7)===null))throw Error('Invalid purpose');
 if(d.visit_purpose.includes(6)&&d.visit_purpose.length!==1)throw Error('Exclusive purpose conflict');
 if((d.visit_freq===1)!==d.visit_purpose.includes(6))throw Error('Visit/purpose conflict');
 if(d.visit_purpose.includes(7)&&!String(d.visit_purpose_other||'').trim())throw Error('Missing other purpose');
 if(d.answer1===0&&d.answer2===0){if(num(d.zero_wtp,1,3)===null||num(d.refusal_reason,1,8)===null)throw Error('Missing refusal detail');if(d.refusal_reason===8&&!String(d.refusal_other||'').trim())throw Error('Missing other refusal');}
 if(d.scenario_years!==3||d.payment_count!==1)throw Error('Scenario mismatch');
}
function sheet_(){const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('No active spreadsheet');let sheet=ss.getSheetByName(SHEET_NAME);if(!sheet)sheet=ss.insertSheet(SHEET_NAME);if(sheet.getLastRow()===0){sheet.appendRow(HEADERS);sheet.setFrozenRows(1);}return sheet;}
function save_(d){validate_(d);const lock=LockService.getScriptLock();lock.waitLock(20000);try{const sheet=sheet_();const last=sheet.getLastRow();if(last>=2){const ids=sheet.getRange(2,2,last-1,1).createTextFinder(String(d.response_id)).matchEntireCell(true).findNext();if(ids)return;}const ps=d.visit_purpose;const row=[new Date(),shortText(d.response_id,90),shortText(d.schema_version,12),d.bid_version,d.bid1,d.bid2,d.answer1,d.answer2,d.response_pattern,d.visit_freq,...[1,2,3,4,5,6,7].map(i=>ps.includes(i)?1:0),shortText(d.visit_purpose_other,120),d.quality_percep,d.pollution_algae,d.pollution_odor,d.pollution_debris,d.answer1===0&&d.answer2===0?d.zero_wtp:'',d.answer1===0&&d.answer2===0?d.refusal_reason:'',shortText(d.refusal_other,250),d.improve_need,d.env_1,d.env_2,d.attach_1,d.attach_2,d.project_trust,d.year,d.college,d.residence,d.monthly_expense,d.scholarship,d.tuition_burden,d.scenario_years,d.payment_count];if(row.length!==HEADERS.length)throw Error('Column mismatch');sheet.appendRow(row);}finally{lock.releaseLock();}}
function responseHtml_(id,ok){const payload=JSON.stringify({source:'ILGAM_SURVEY_BACKEND',response_id:id,ok:ok});return HtmlService.createHtmlOutput('<!doctype html><html><head><meta charset="utf-8"></head><body><script>try{window.top.postMessage('+payload+',"*");}catch(e){}</script><p>제출 처리 결과가 상위 화면으로 전송되었습니다.</p></body></html>').setTitle('설문 저장 결과');}
function doPost(e){let id='';try{if(!e||!e.parameter||!e.parameter.payload)throw Error('Missing payload');const d=JSON.parse(e.parameter.payload);id=String(d.response_id||'');save_(d);return responseHtml_(id,true);}catch(err){console.error(err);return responseHtml_(id,false);}}
function doGet(){return HtmlService.createHtmlOutput('일감호 설문 응답 수집 엔드포인트입니다. 설문 페이지에서 POST로 전송하세요.');}
