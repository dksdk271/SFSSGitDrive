
// Basic interactive JS for calculator, tracking (localStorage demo) and quote form

function calculateRate(){
  const from = document.getElementById('fromP').value.trim();
  const to = document.getElementById('toP').value.trim();
  const weight = parseFloat(document.getElementById('weight').value) || 0;
  const L = parseFloat(document.getElementById('L').value) || 0;
  const W = parseFloat(document.getElementById('W').value) || 0;
  const H = parseFloat(document.getElementById('H').value) || 0;

  // Simple rule-based estimate to give instant quote feel
  let distanceFactor = 1;
  if(from && to && from[0] !== to[0]) distanceFactor = 1.5;
  let volumetric = (L*W*H)/5000; // volumetric weight
  let chargeable = Math.max(weight, volumetric, 0.5);
  let base = 50; // base charge
  let perKg = 25; // per kg
  let est = (base + perKg * chargeable) * distanceFactor;
  est = Math.round(est);

  document.getElementById('rateResult').innerText = "Estimated Charge: ₹" + est + " (Chargeable wt: " + chargeable.toFixed(2) + " kg)";
}

function trackAWB(){
  const awb = document.getElementById('awb').value.trim();
  if(!awb){ alert('Enter AWB'); return; }
  const data = JSON.parse(localStorage.getItem('sfss_tracking')||'{}');
  const entry = data[awb];
  if(!entry){
    document.getElementById('trackResult').innerText = "No tracking data for " + awb + ". If you are owner, use Admin panel to add an entry.";
  } else {
    document.getElementById('trackResult').innerText = "AWB: " + awb + " — Status: " + entry.status + (entry.note? " — Note: "+entry.note : "");
  }
}

function adminAdd(){
  const awb = document.getElementById('adminAwb').value.trim();
  const status = document.getElementById('adminStatus').value;
  const note = document.getElementById('adminNote').value;
  if(!awb){ alert('Enter AWB'); return; }
  const data = JSON.parse(localStorage.getItem('sfss_tracking')||'{}');
  data[awb] = {status: status, note: note, updated: new Date().toISOString()};
  localStorage.setItem('sfss_tracking', JSON.stringify(data));
  alert('Saved locally ✔️');
}

// Quote form: opens WhatsApp and sends an email (mailto) for owner's attention
function sendQuote(){
  const name = document.getElementById('qName').value.trim();
  const email = document.getElementById('qEmail').value.trim();
  const from = document.getElementById('qFrom').value.trim();
  const to = document.getElementById('qTo').value.trim();
  const details = document.getElementById('qDetails').value.trim();
  if(!name || !email || !from || !to){ document.getElementById('quoteMessage').innerText = 'Please fill required fields.'; return; }
  const text = `SFSS Quote Request:%0AName: ${name}%0AEmail: ${email}%0AFrom: ${from}%0ATo: ${to}%0ADetails: ${details}`;
  // Open WhatsApp for instant reply
  const wa = 'https://wa.me/919627051087?text=' + encodeURIComponent(text);
  window.open(wa, '_blank');
  // Also open mailto for record
  const subject = encodeURIComponent('SFSS Quote Request from ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nFrom: ${from}\nTo: ${to}\nDetails: ${details}`);
  window.open('mailto:dksdk271@gmail.com?subject=' + subject + '&body=' + body);
  document.getElementById('quoteMessage').innerText = 'Quote request opened in WhatsApp & email. We reply quickly on WhatsApp.';
}

/* Small UX: allow Enter to track */
document.addEventListener('keydown', function(e){
  if(e.key === 'Enter'){
    const active = document.activeElement;
    if(active && active.id === 'awb') trackAWB();
  }
});
