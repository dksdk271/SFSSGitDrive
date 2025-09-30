/* script.js - frontend logic */
const FORM_ENDPOINT = "submit_quote.php"; // posts to PHP
const WA_NUMBER = "919627051087"; // update if needed

// helper
const $ = sel => document.querySelector(sel);

// Rate calculator
const calcBtn = document.getElementById('calc-btn');
const resultBox = document.getElementById('result');
calcBtn.addEventListener('click', calculateRate);

function calculateRate(){
  const fromPin = (document.getElementById('fromPin').value || '').trim();
  const toPin = (document.getElementById('toPin').value || '').trim();
  const weight = parseFloat(document.getElementById('weight').value) || 0;
  const l = parseFloat(document.getElementById('length').value) || 0;
  const w = parseFloat(document.getElementById('width').value) || 0;
  const h = parseFloat(document.getElementById('height').value) || 0;
  if(!fromPin || !toPin || weight<=0){ resultBox.innerHTML = '<div class="small-muted">Enter valid pincodes & weight</div>'; return; }
  let volumetric = (l>0 && w>0 && h>0) ? (l*w*h)/5000 : 0;
  const charged = Math.max(weight, volumetric);
  const a = parseInt(fromPin.substring(0,3))||0;
  const b = parseInt(toPin.substring(0,3))||0;
  const diff = Math.abs(a-b);
  let ratePerKg=0, cat='';
  if(diff<20){ ratePerKg=28; cat='Local'; } else if(diff<50){ ratePerKg=40; cat='Regional'; } else { ratePerKg=110; cat='National'; }
  const total = charged*ratePerKg;
  resultBox.innerHTML = '<div style="font-size:13px;color:#ffeaa7">'+cat+'</div>'
    +'<div style="margin-top:8px">Charged Weight: <strong>'+charged.toFixed(2)+' kg</strong></div>'
    +'<div style="margin-top:6px">Rate / kg: <strong>₹'+ratePerKg+'</strong></div>'
    +'<div class="big-total">Estimated Total: ₹'+total.toFixed(2)+'</div>';
}

// Captcha
let currentCaptchaAnswer=null;
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function generateCaptcha(){
  const ops=['+','-','×']; const op=ops[randInt(0,ops.length-1)];
  let a=randInt(2,12), b=randInt(1,12); if(op==='-' && a<b) [a,b]=[b,a];
  const ans = (op==='+')? a+b : (op==='-')? a-b : a*b;
  currentCaptchaAnswer = ans;
  document.getElementById('captcha-question').innerText = 'Solve: '+a+' '+op+' '+b+' = ?';
  document.getElementById('captcha').value=''; document.getElementById('captcha-status').innerText='';
  document.getElementById('captcha').removeAttribute('data-verified');
}
generateCaptcha();
document.getElementById('check-captcha').addEventListener('click', ()=>{
  const v = document.getElementById('captcha').value.trim(); if(!v){ document.getElementById('captcha-status').style.color='orangered'; document.getElementById('captcha-status').innerText='Enter answer'; return;}
  const n = Number(v); if(isNaN(n)){ document.getElementById('captcha-status').style.color='orangered'; document.getElementById('captcha-status').innerText='Numbers only'; return;}
  if(n===currentCaptchaAnswer){ document.getElementById('captcha-status').style.color='#26a65b'; document.getElementById('captcha-status').innerText='Verified ✔ — Form ready'; document.getElementById('captcha').setAttribute('data-verified','1'); setTimeout(()=>document.getElementById('captcha').value='',350); }
  else{ document.getElementById('captcha-status').style.color='orangered'; document.getElementById('captcha-status').innerText='Incorrect — new question'; setTimeout(generateCaptcha,600); }
});

// Quote form submit -> uses classic form POST to PHP but also opens WhatsApp
document.getElementById('quote-form').addEventListener('submit', function(e){
  // ensure captcha verified
  if(document.getElementById('captcha').getAttribute('data-verified')!=='1'){ e.preventDefault(); alert('Please verify captcha first'); return; }
  // open whatsapp in new tab
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const origin = document.getElementById('origin').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const details = document.getElementById('details').value.trim();
  const waText = encodeURIComponent('New Quote Request\nName: '+name+'\nEmail: '+email+'\nOrigin: '+origin+'\nDestination: '+destination+'\nDetails: '+details);
  window.open('https://wa.me/'+WA_NUMBER+'?text='+waText, '_blank');
  // allow form to post to submit_quote.php (which will send email + save to DB)
});

// Admin local storage tracking (fallback)
const TRACK_KEY='sfss_tracking';
function loadTracking(){ try{ return JSON.parse(localStorage.getItem(TRACK_KEY))||{} }catch(e){ return {} } }
function saveTracking(s){ localStorage.setItem(TRACK_KEY, JSON.stringify(s)) }

function renderAdminList(){
  const list = document.getElementById('admin-list'); const store=loadTracking(); list.innerHTML=''; const keys=Object.keys(store).sort();
  if(!keys.length){ list.innerHTML='<div class="muted small">No AWB entries yet.</div>'; return; }
  keys.forEach(k=>{ const it=store[k]; const el=document.createElement('div'); el.className='admin-item'; el.innerHTML='<div><strong>'+k+'</strong><div><small>'+it.status+' — '+(it.note||'')+'</small></div></div>'; const right=document.createElement('div'); right.style.display='flex'; right.style.gap='8px'; const del=document.createElement('button'); del.className='btn ghost small'; del.textContent='Delete'; del.onclick=()=>{ if(!confirm('Delete '+k+'?'))return; delete store[k]; saveTracking(store); renderAdminList(); }; const edit=document.createElement('button'); edit.className='btn small'; edit.textContent='Edit'; edit.onclick=()=>{ document.getElementById('admin-awb').value=k; document.getElementById('admin-status').value=it.status; document.getElementById('admin-note').value=it.note||''; }; right.appendChild(edit); right.appendChild(del); el.appendChild(right); list.appendChild(el); });
}

document.getElementById('admin-add').addEventListener('click', ()=>{
  const awb=(document.getElementById('admin-awb').value||'').trim(); const status=document.getElementById('admin-status').value; const note=(document.getElementById('admin-note').value||'').trim();
  if(!awb){ alert('Enter AWB'); return; }
  const store=loadTracking(); store[awb]={status, note, updated:new Date().toISOString()}; saveTracking(store); renderAdminList(); alert('Saved '+awb);
});

document.getElementById('btn-track').addEventListener('click', ()=>{
  const awb=(document.getElementById('track-awb').value||'').trim(); const out=document.getElementById('track-result'); if(!awb){ out.innerHTML='<div class="muted small">Enter AWB to track</div>'; return; }
  const store=loadTracking(); if(!store[awb]){ out.innerHTML='<div class="muted small">No record found for <b>'+awb+'</b>.</div>'; return;}
  const it=store[awb]; out.innerHTML='<div><strong>'+awb+'</strong></div><div class="timeline-item"><strong>Status: '+it.status+'</strong><div class="time">Updated: '+new Date(it.updated).toLocaleString()+'</div><div>'+(it.note||'')+'</div></div>';
});

document.getElementById('open-admin').addEventListener('click', ()=>{
  const p = prompt('Enter admin password (default: sfssadmin):'); if(!p) return; if(p!=='sfssadmin'){ alert('Wrong password'); return; }
  document.getElementById('admin-modal').style.display='flex'; renderAdminList(); renderSampleTimeline();
});
document.getElementById('admin-close').addEventListener('click', ()=> document.getElementById('admin-modal').style.display='none');

function renderSampleTimeline(){ const c=document.getElementById('timeline-sample'); const store=loadTracking(); const keys=Object.keys(store).slice(0,6); c.innerHTML=''; if(!keys.length){ c.innerHTML='<div class="muted small">No sample tracking available. Add entries in Admin.</div>'; return; } keys.forEach(k=>{ const it=store[k]; const d=document.createElement('div'); d.className='timeline-item'; d.innerHTML='<strong>'+k+' — '+it.status+'</strong><div class="time">'+new Date(it.updated).toLocaleString()+'</div><div>'+(it.note||'')+'</div>'; c.appendChild(d); }); }

// init sample data
(function initSample(){ const s=loadTracking(); if(!Object.keys(s).length){ s['SFSS100001']={status:'Picked', note:'Picked from merchant', updated:new Date().toISOString()}; s['SFSS100002']={status:'InTransit', note:'Departed hub', updated:new Date().toISOString()}; saveTracking(s); } renderSampleTimeline(); })();
