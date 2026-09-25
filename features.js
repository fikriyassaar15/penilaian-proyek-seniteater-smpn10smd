/* ============================================================
   SP-PPT features.js — 15 FITUR BARU
   Load SETELAH app.js & extras.js
   ============================================================ */
(function(){
'use strict';

/* ============================================================
   1. PROFANITY FILTER
   ============================================================ */
var BAD_WORDS=['anjing','anjg','anjir','bangsat','bajingan','kontol','kntl','memek','mmk','pepek','pler','peler','titit','tai','tahi','kampang','kampret','bego','bodoh','goblok','gblk','idiot','tolol','dungu','sinting','gila','setan','babi','monyet','kunyuk','jancok','jancuk','cok','bacot','bacod','ngehe','ngentot','entot','ngewe','ewe','sange','bokep','asu','bedebah','brengsek','laknat','keparat','sialan','celaka','parah','mampus','matikau','kimak','pukimak','bispak','lonte','pelacur','sundal','jablay','perek','bencong','banci','homo','lesbi'];

function containsProfanity(text){
  if(!text) return false;
  var t=' '+String(text).toLowerCase().replace(/[^a-z0-9\s]/g,' ')+' ';
  for(var i=0;i<BAD_WORDS.length;i++){
    var w=BAD_WORDS[i];
    if(t.indexOf(' '+w+' ')>=0) return true;
    /* cek juga pola dengan karakter berulang */
    var re=new RegExp('\\b'+w.replace(/(.)/g,'$1+')+'\\b','i');
    if(re.test(t)) return true;
  }
  return false;
}
function sanitizeText(text){
  if(!text) return '';
  var t=String(text);
  BAD_WORDS.forEach(function(w){
    var re=new RegExp('\\b'+w.replace(/(.)/g,'$1+')+'\\b','gi');
    t=t.replace(re,'***');
  });
  return t;
}
window.containsProfanity=containsProfanity;
window.sanitizeText=sanitizeText;

/* ============================================================
   2. HOOK: Aktivitas Terbaru — Filter per-user
   ============================================================ */
function filterActivitiesForUser(logs,user){
  if(!user) return [];
  if(user.type==='admin') return logs;
  if(user.type==='guru'){
    /* Guru: hanya log dari kelas yang ia miliki */
    var myIds=(typeof myClasses==='function'?myClasses().map(function(c){return c.id;}):[]);
    return logs.filter(function(l){return !l.classId||myIds.indexOf(l.classId)>=0;});
  }
  if(user.type==='siswa'){
    /* Siswa: hanya log yang melibatkan dia (pengirim/penerima) atau umum kelasnya */
    return logs.filter(function(l){
      if(l.classId && l.classId!==user.classId) return false;
      /* Log oleh dia sendiri */
      if(l.userId===user.studentId) return true;
      /* Log yang menargetkan dia */
      if(l.meta && l.meta.recipientIds && l.meta.recipientIds.indexOf(user.studentId)>=0) return true;
      if(l.meta && l.meta.toId===user.studentId) return true;
      /* Log umum kelas (broadcast ke 'all') */
      if(l.type==='broadcast' && l.meta && l.meta.toAll) return true;
      /* Log aktivitas umum kelas (register, class_create, dll) */
      if(['class_create','checklist_item_add','checklist_seed','meeting_create'].indexOf(l.type)>=0) return true;
      return false;
    });
  }
  return logs;
}
window.filterActivitiesForUser=filterActivitiesForUser;

/* Override renderActivityFeed supaya filter konsisten */
var _origRAF=window.renderActivityFeed;
if(typeof _origRAF==='function'){
  window.renderActivityFeed=function(role){
    var logs=filterActivitiesForUser(window.DB.activityLogs||[],window.currentUser);
    logs=logs.slice(0,10);
    if(logs.length===0) return '';
    var h='<div class="card card-accent amber" style="margin-top:20px;"><h3>'+ico('activity')+' Aktivitas Terbaru</h3><div class="activity-feed">';
    logs.forEach(function(l){
      var iconName='info';
      if(l.type==='student_register')iconName='user';
      else if(l.type==='broadcast')iconName='megaphone';
      else if(l.type==='task_done')iconName='check';
      else if(l.type==='checklist_update')iconName='checkSquare';
      else if(l.type==='meeting_create')iconName='calendar';
      else if(l.type==='eval_submit')iconName='star';
      else if(l.type==='checklist_item_add')iconName='plus';
      else if(l.type==='meeting_attend')iconName='check';
      else if(l.type==='aduan')iconName='alert';
      else if(l.type==='notulensi')iconName='book';
      else if(l.type==='keuangan')iconName='chart';
      else if(l.type==='feedback')iconName='messageCircle';
      h+='<div class="activity-item"><div class="activity-icon">'+ico(iconName,'sm')+'</div><div class="activity-content"><div class="activity-msg">'+l.message+'</div><div class="activity-meta"><b>'+l.userName+'</b> · '+fmtDate(l.createdAt)+'</div></div></div>';
    });
    h+='</div></div>';
    return h;
  };
}

/* ============================================================
   3. HOOK: Broadcast — Validasi profanity + Feedback button
   ============================================================ */
var _origSendBroadcast=window.sendBroadcast;
if(typeof _origSendBroadcast==='function'){
  window.sendBroadcast=function(){
    var ti=(document.getElementById('bc-title')||{}).value||'';
    var m=(document.getElementById('bc-message')||{}).value||'';
    if(containsProfanity(ti)||containsProfanity(m)){
      alert('❌ Pesan mengandung kata tidak senonoh.\n\nMohon gunakan bahasa yang sopan.');
      return;
    }
    document.getElementById('bc-title').value=sanitizeText(ti);
    document.getElementById('bc-message').value=sanitizeText(m);
    return _origSendBroadcast.apply(this,arguments);
  };
}

/* Cek permission feedback (koordinator+ boleh kirim feedback penuh) */
function canGiveFeedback(){
  if(!window.currentUser) return false;
  if(window.currentUser.type==='guru') return true;
  if(window.currentUser.type!=='siswa') return false;
  var allowed=['pimpinan_produksi','sutradara','asisten_sutradara','sekretaris','bendahara',
    'koor_publikasi','koor_perlengkapan','koor_akomodasi',
    'koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya'];
  return allowed.indexOf(window.currentUser.role)>=0;
}
function canGiveSimpleFeedback(){
  if(!window.currentUser) return false;
  if(window.currentUser.type==='guru') return true;
  if(window.currentUser.type!=='siswa') return false;
  return ['pemain','anggota_publikasi','anggota_perlengkapan','anggota_akomodasi',
    'anggota_panggung','anggota_musik','anggota_busana','anggota_rias','anggota_cahaya'].indexOf(window.currentUser.role)>=0;
}
window.canGiveFeedback=canGiveFeedback;
window.canGiveSimpleFeedback=canGiveSimpleFeedback;

/* Kirim feedback dari siswa */
window.openFeedbackModal=function(notifId){
  var n=(window.DB.notifications||[]).find(function(x){return x.id===notifId;});
  if(!n){alert('Notifikasi tidak ditemukan');return;}
  if(!canGiveFeedback()&&!canGiveSimpleFeedback()){alert('Anda tidak berhak memberi umpan balik.');return;}
  var simple=!canGiveFeedback();
  var h='<div class="alert alert-info">'+ico('messageCircle')+'<div>Umpan balik untuk: <b>'+n.title+'</b>'+(simple?'<br><small>Umpan balik sederhana (setuju/pertanyaan).</small>':'')+'</div></div>';
  if(simple){
    h+='<div class="form-group"><label>Jenis</label><select id="fb-type"><option value="terima">Sudah saya terima & pahami</option><option value="tanya">Ada yang ingin saya tanyakan</option><option value="kendala">Saya mengalami kendala</option></select></div>';
    h+='<div class="form-group"><label>Catatan (opsional)</label><textarea id="fb-msg" rows="3" placeholder="Tulis catatan singkat..."></textarea></div>';
  } else {
    h+='<div class="form-group"><label>Jenis</label><select id="fb-type"><option value="terima">Sudah diterima</option><option value="disposisi">Diteruskan ke tim</option><option value="kendala">Kendala</option><option value="usulan">Usulan perubahan</option><option value="selesai">Sudah selesai ditindaklanjuti</option></select></div>';
    h+='<div class="form-group"><label>Umpan Balik</label><textarea id="fb-msg" rows="4" placeholder="Tulis umpan balik lengkap..."></textarea></div>';
  }
  h+='<button class="btn btn-primary btn-block" onclick="sendFeedback(\''+notifId+'\')">'+ico('send')+' Kirim Umpan Balik</button>';
  openModal('Umpan Balik',h);
};
window.sendFeedback=function(notifId){
  var n=(window.DB.notifications||[]).find(function(x){return x.id===notifId;});
  if(!n){alert('Notifikasi tidak ditemukan');return;}
  var t=document.getElementById('fb-type').value;
  var m=(document.getElementById('fb-msg').value||'').trim();
  if(containsProfanity(m)){alert('❌ Pesan mengandung kata tidak senonoh.');return;}
  m=sanitizeText(m);
  var notif={
    id:uid(),classId:n.classId,
    fromId:currentUser.studentId,fromName:currentUser.name,
    fromType:'siswa',fromRole:currentUser.role||'',
    toId:n.fromId||'guru',type:'info',
    title:'Umpan Balik dari '+currentUser.name,
    message:'['+t+'] '+(m||'(tanpa catatan)')+'\n\nRe: '+n.title,
    createdAt:Date.now(),readBy:[],doneBy:[]
  };
  fbAddNotif(notif);
  logActivity('feedback',currentUser.name+' memberi umpan balik: '+t,{classId:n.classId,role:currentUser.role||''});
  closeModal();
  alert('✅ Umpan balik terkirim!');
};

/* ============================================================
   4. HOOK: Notif panel — tambah tombol Umpan Balik
   ============================================================ */
var _origRenderNotifPanel=window.renderNotifPanel;
if(typeof _origRenderNotifPanel==='function'){
  window.renderNotifPanel=function(){
    _origRenderNotifPanel();
    /* Tambahkan tombol feedback di setiap notif-item */
    var items=document.querySelectorAll('#notif-panel-body .notif-item');
    if(!items.length) return;
    var my=window.DB.notifications||[];
    items.forEach(function(el){
      var btn=el.querySelector('.notif-actions');
      if(!btn) return;
      /* Cari notif ID lewat onclick existing */
      var firstAction=btn.querySelector('button[onclick]');
      if(!firstAction) return;
      var m=firstAction.getAttribute('onclick').match(/markNotifRead\('([^']+)'\)/);
      if(!m) return;
      var nid=m[1];
      if((canGiveFeedback()||canGiveSimpleFeedback())&&!el.querySelector('.btn-feedback')){
        var b=document.createElement('button');
        b.className='btn btn-sm btn-ghost btn-feedback';
        b.innerHTML=ico('messageCircle')+' Umpan Balik';
        b.onclick=function(){openFeedbackModal(nid);};
        btn.appendChild(b);
      }
    });
  };
}

/* ============================================================
   5. HOOK: GURU — Aktivitas per kelas
   ============================================================ */
var _origRenderGuru=window.renderGuruDashboard;
if(typeof _origRenderGuru==='function'){
  window.renderGuruDashboard=function(){
    _origRenderGuru();
    /* Sisipkan filter kelas untuk aktivitas */
    var mc=document.getElementById('main-content');
    if(!mc) return;
    /* Pindahkan activity feed ke bawah + wrap dengan filter */
    var feed=mc.querySelector('.activity-feed');
    if(!feed) return;
    var wrap=feed.closest('.card');
    if(!wrap) return;
    if(wrap.querySelector('.act-filter')) return;
    var f=document.createElement('div');
    f.className='act-filter';
    f.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;';
    f.innerHTML='<select class="wa-search" id="act-class-filter" style="flex:1;min-width:140px;" onchange="filterActivityByClass(this.value)">'+
      '<option value="">Semua Kelas</option>'+
      window.myClasses().map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('')+
    '</select>';
    wrap.insertBefore(f,feed);
  };
}
window.filterActivityByClass=function(cid){
  /* Implementasi sederhana: highlight class */
  document.querySelectorAll('.activity-item').forEach(function(el){el.style.display='';});
  if(!cid) return;
  /* Filter di sisi klien (activity log tidak menyimpan classId di DOM) */
  alert('Filter kelas: '+(cid?DB.classes.find(function(c){return c.id===cid;}).name:'Semua'));
};

/* ============================================================
   6. ABSENSI DENGAN DEADLINE (untuk rapat & latihan)
   ============================================================ */
window.openCreateMeetingModalFull=function(presetType){
  if(currentUser.type!=='guru'&&currentUser.type!=='admin'){
    /* Cek peran siswa */
    var t=presetType||'rapat';
    if(t==='rapat'&&!['pimpinan_produksi','sekretaris'].includes(currentUser.role)){
      alert('Hanya Pimpinan Produksi & Sekretaris yang dapat membuat absen rapat.');return;
    }
    if(t==='latihan'&&!['sutradara','asisten_sutradara'].includes(currentUser.role)){
      alert('Hanya Sutradara & Asisten Sutradara yang dapat membuat absen latihan.');return;
    }
  }
  var list=(currentUser.type==='admin')?DB.classes:myClasses();
  if(list.length===0){alert('Belum ada kelas.');return;}
  var opts=list.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('');
  openModal('Buat Sesi Absensi',
    '<div class="form-group"><label>Judul Sesi</label><input id="mt-title" placeholder="Contoh: Latihan Rutin #1"></div>'+
    '<div class="form-group"><label>Kelas</label><select id="mt-class">'+opts+'</select></div>'+
    '<div class="form-group"><label>Jenis</label><select id="mt-type"><option value="rapat"'+(presetType==='rapat'?' selected':'')+'>Rapat</option><option value="latihan"'+(presetType==='latihan'?' selected':'')+'>Latihan</option><option value="gladi">Gladi Resik</option></select></div>'+
    '<div class="form-group"><label>Tanggal</label><input type="date" id="mt-date" value="'+new Date().toISOString().split('T')[0]+'"></div>'+
    '<div class="form-group"><label>Absen Dibuka (jam)</label><input type="time" id="mt-open" value="06:00"></div>'+
    '<div class="form-group"><label>Absen Ditutup (jam)</label><input type="time" id="mt-close" value="23:59"></div>'+
    '<div class="alert alert-info">'+ico('info')+'<div>Siswa hanya bisa mengisi absen pada rentang waktu tersebut.</div></div>'+
    '<button class="btn btn-primary btn-block" onclick="createMeetingFull()">'+ico('save')+' Buat</button>'
  );
};
window.createMeetingFull=function(){
  var ti=(document.getElementById('mt-title').value||'').trim();
  var cid=document.getElementById('mt-class').value;
  var ty=document.getElementById('mt-type').value;
  var dt=document.getElementById('mt-date').value;
  var op=document.getElementById('mt-open').value;
  var cl=document.getElementById('mt-close').value;
  if(!ti){alert('Judul wajib!');return;}
  if(containsProfanity(ti)){alert('Judul mengandung kata tidak senonoh.');return;}
  var id=uid();
  var m={
    id:id,title:sanitizeText(ti),classId:cid,type:ty,date:dt,
    openTime:op,closeTime:cl,
    records:{},createdAt:Date.now(),createdBy:currentUser.name,creatorRole:currentUser.role||currentUser.type
  };
  fb.collection('meetings').doc(id).set(sanitizeFirestore(m)).then(function(){
    closeModal();openMeetingList();logActivity('meeting_create',currentUser.name+' buat sesi: '+ti,{classId:cid});
    /* Notifikasi ke semua siswa */
    fbAddNotif({id:uid(),classId:cid,fromId:currentUser.studentId||'guru',fromName:currentUser.name,fromType:currentUser.type,fromRole:currentUser.role||'',toId:'all',type:'info',title:'Absensi Dibuka: '+ti,message:'Silakan isi absensi "'+ti+'" pada '+dt+' pukul '+op+' - '+cl+'.',createdAt:Date.now(),readBy:[],doneBy:[]});
  });
};

/* Siswa: isi absen sendiri dengan cek deadline */
window.openSelfAttendance=function(mid){
  var m=window.DB.meetings[mid];if(!m){alert('Sesi tidak ditemukan');return;}
  if(m.classId!==currentUser.classId){alert('Sesi bukan untuk kelas Anda');return;}
  /* Cek rentang waktu */
  var now=new Date();
  var todayStr=now.toISOString().split('T')[0];
  if(m.date!==todayStr){
    /* Cek apakah masih dalam rentang (misal deadline keesokan hari) */
  }
  var curTime=now.toTimeString().substring(0,5);
  if(m.openTime && m.closeTime && curTime<m.openTime){
    alert('Absen belum dibuka. Dibuka pukul '+m.openTime);return;
  }
  if(m.openTime && m.closeTime && curTime>m.closeTime){
    alert('Absen sudah ditutup pukul '+m.closeTime);return;
  }
  var existing=m.records&&m.records[currentUser.studentId];
  if(existing){
    if(!confirm('Anda sudah absen sebagai "'+existing+'". Ubah?')) return;
  }
  var h='<div class="alert alert-info">'+ico('info')+'<div><b>'+m.title+'</b> · '+m.date+'<br>Rentang: '+m.openTime+' - '+m.closeTime+'</div></div>';
  h+='<div class="form-group"><label>Status Kehadiran</label><div class="radio-group">';
  ['hadir','izin','sakit','telat'].forEach(function(opt){
    var lbl={hadir:'Hadir',izin:'Izin',sakit:'Sakit',telat:'Telat'}[opt];
    h+='<label><input type="radio" name="self_att" value="'+opt+'" '+(existing===opt?'checked':'')+'> '+lbl+'</label>';
  });
  h+='</div></div>';
  h+='<div class="form-group"><label>Keterangan (opsional)</label><textarea id="self_note" rows="2" placeholder="Contoh: izin karena sakit"></textarea></div>';
  h+='<button class="btn btn-primary btn-block" onclick="submitSelfAttendance(\''+mid+'\')">'+ico('save')+' Kirim Absen</button>';
  openModal('Absensi: '+m.title,h);
};
window.submitSelfAttendance=function(mid){
  var sel=document.querySelector('input[name="self_att"]:checked');
  if(!sel){alert('Pilih status kehadiran!');return;}
  var note=(document.getElementById('self_note').value||'').trim();
  if(containsProfanity(note)){alert('Catatan mengandung kata tidak senonoh.');return;}
  var m=window.DB.meetings[mid];
  if(!m.records) m.records={};
  m.records[currentUser.studentId]=sel.value;
  if(note) m.records[currentUser.studentId+'_note']=sanitizeText(note);
  fb.collection('meetings').doc(mid).update(sanitizeFirestore({records:m.records})).then(function(){
    alert('✅ Absen tersimpan!');
    closeModal();
    logActivity('meeting_attend',currentUser.name+' absen sebagai '+sel.value,{classId:m.classId,role:currentUser.role||''});
    if(currentUser.type==='siswa') renderSiswaDashboard();
  });
};

/* Tombol self attendance di dashboard siswa */
var _origSiswa=window.renderSiswaDashboard;
if(typeof _origSiswa==='function'){
  window.renderSiswaDashboard=function(){
    _origSiswa();
    var mc=document.getElementById('main-content');
    if(!mc||!currentUser||currentUser.type!=='siswa') return;
    /* Cari meeting aktif hari ini */
    var today=new Date().toISOString().split('T')[0];
    var meetings=Object.values(window.DB.meetings||{}).filter(function(m){
      return m.classId===currentUser.classId && m.date===today;
    });
    if(meetings.length===0) return;
    var h='<div class="action-row" style="margin-bottom:12px;">';
    meetings.forEach(function(m){
      var filled=m.records&&m.records[currentUser.studentId];
      h+='<button class="btn '+(filled?'':'btn-primary')+'" onclick="openSelfAttendance(\''+m.id+'\')">'+
        ico('calendar')+' '+(filled?'✓ ':'')+'Absen: '+m.title+'</button>';
    });
    h+='</div>';
    mc.insertAdjacentHTML('afterbegin',h);
  };
}

/* ============================================================
   7. DEADLINE per tim (Pimpro & Sutradara)
   ============================================================ */
window.openTimelineDeadlineModal=function(team){
  if(!currentUser||currentUser.type!=='siswa'){alert('Hanya siswa.');return;}
  if(team==='produksi'&&currentUser.role!=='pimpinan_produksi'){
    alert('Hanya Pimpinan Produksi yang dapat mengatur deadline tim produksi.');return;
  }
  if(team==='artistik'&&currentUser.role!=='sutradara'){
    alert('Hanya Sutradara yang dapat mengatur deadline tim artistik.');return;
  }
  var cid=currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  if(!c){alert('Kelas tidak ditemukan');return;}
  var members=c.students.filter(function(s){
    return getDivisionOfRole(s.role)===team;
  });
  var h='<div class="alert alert-info">'+ico('info')+'<div>Berikan deadline ke anggota <b>'+DIVISIONS[team].label+'</b>.</div></div>';
  h+='<div class="form-group"><label>Untuk Anggota</label><select id="dl-target" multiple size="6" class="wa-search" style="height:auto;">';
  members.forEach(function(m){
    h+='<option value="'+m.id+'">'+m.name+' — '+((ROLES[m.role]||{}).label||m.role)+'</option>';
  });
  h+='</select><small class="hint">Tahan Ctrl/Cmd untuk pilih banyak</small></div>';
  h+='<div class="form-group"><label>Judul / Tugas</label><input id="dl-title" placeholder="Contoh: Selesaikan properti adegan 3"></div>';
  h+='<div class="form-group"><label>Deskripsi</label><textarea id="dl-msg" rows="3"></textarea></div>';
  h+='<div class="form-group"><label>Deadline</label><input type="date" id="dl-date"></div>';
  h+='<button class="btn btn-primary btn-block" onclick="sendTimelineDeadline(\''+team+'\')">'+ico('send')+' Kirim Deadline</button>';
  openModal('Atur Deadline',h);
};
window.sendTimelineDeadline=function(team){
  var sel=document.getElementById('dl-target');
  var tids=Array.from(sel.selectedOptions).map(function(o){return o.value;});
  if(tids.length===0){alert('Pilih minimal 1 anggota');return;}
  var ti=(document.getElementById('dl-title').value||'').trim();
  var m=(document.getElementById('dl-msg').value||'').trim();
  var d=document.getElementById('dl-date').value;
  if(!ti){alert('Judul wajib');return;}
  if(containsProfanity(ti)||containsProfanity(m)){alert('Kata tidak senonoh terdeteksi.');return;}
  ti=sanitizeText(ti);m=sanitizeText(m);
  var cid=currentUser.classId;
  fbAddNotif({
    id:uid(),classId:cid,fromId:currentUser.studentId,fromName:currentUser.name,
    fromType:'siswa',fromRole:currentUser.role,
    toId:'some',recipientIds:tids,
    type:'tugas',title:'[Deadline] '+ti,
    message:m+(d?'\n\nDeadline: '+d:'')+'\n\nDari: '+currentUser.name,
    createdAt:Date.now(),readBy:[],doneBy:[]
  });
  logActivity('deadline',currentUser.name+' atur deadline "'+ti+'" untuk '+tids.length+' anggota',{classId:cid,role:currentUser.role||''});
  closeModal();
  alert('✅ Deadline terkirim ke '+tids.length+' anggota');
};

/* ============================================================
   8. BENDAHARA — Keuangan
   ============================================================ */
window.openKeuanganModal=function(){
  if(!currentUser||currentUser.role!=='bendahara'){alert('Hanya Bendahara.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_keuangan_'+cid)||'{"transaksi":[],"rab":[]}');
  var h='<div class="alert alert-info">'+ico('info')+'<div>Catat pemasukan, pengeluaran, dan RAB per divisi.</div></div>';
  h+='<div class="action-row" style="margin-bottom:12px;">';
  h+='<button class="btn btn-sm btn-success" onclick="openAddTransaksi(\'masuk\')">'+ico('plus')+' Pemasukan</button>';
  h+='<button class="btn btn-sm btn-danger" onclick="openAddTransaksi(\'keluar\')">'+ico('plus')+' Pengeluaran</button>';
  h+='<button class="btn btn-sm btn-primary" onclick="openAddRAB()">'+ico('plus')+' RAB Divisi</button>';
  h+='<button class="btn btn-sm" onclick="exportKeuanganDocx()">'+ico('download')+' Export DOCX</button>';
  h+='</div>';
  /* Hitung total */
  var masuk=0,keluar=0;
  data.transaksi.forEach(function(t){if(t.type==='masuk')masuk+=t.amount;else keluar+=t.amount;});
  h+='<div class="progress-banner"><h3>'+ico('chart')+' Ringkasan Keuangan</h3>';
  h+='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-top:10px;">';
  h+='<div class="summary-item done"><div class="stat-label">Pemasukan</div><div class="stat-value">Rp '+masuk.toLocaleString('id-ID')+'</div></div>';
  h+='<div class="summary-item partial"><div class="stat-label">Pengeluaran</div><div class="stat-value">Rp '+keluar.toLocaleString('id-ID')+'</div></div>';
  h+='<div class="summary-item"><div class="stat-label">Saldo</div><div class="stat-value">Rp '+(masuk-keluar).toLocaleString('id-ID')+'</div></div>';
  h+='</div></div>';
  /* RAB */
  if(data.rab.length>0){
    h+='<h3 style="margin:16px 0 8px;font-size:14px;">RAB Divisi</h3>';
    h+='<div class="table-wrap"><table><thead><tr><th>Divisi</th><th>Item</th><th>Jumlah</th><th>Aksi</th></tr></thead><tbody>';
    data.rab.forEach(function(r,i){
      h+='<tr><td>'+r.division+'</td><td>'+r.item+'</td><td>Rp '+(r.amount||0).toLocaleString('id-ID')+'</td><td><button class="btn btn-sm btn-danger" onclick="delRAB('+i+')">'+ico('trash','sm')+'</button></td></tr>';
    });
    h+='</tbody></table></div>';
  }
  /* Transaksi */
  if(data.transaksi.length>0){
    h+='<h3 style="margin:16px 0 8px;font-size:14px;">Riwayat Transaksi</h3>';
    h+='<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Jenis</th><th>Kategori</th><th>Jumlah</th><th>Catatan</th><th>Aksi</th></tr></thead><tbody>';
    data.transaksi.slice().reverse().forEach(function(t){
      var i=data.transaksi.indexOf(t);
      h+='<tr><td>'+t.date+'</td><td><span class="badge '+(t.type==='masuk'?'badge-success':'badge-danger')+'">'+t.type+'</span></td><td>'+t.category+'</td><td>Rp '+(t.amount||0).toLocaleString('id-ID')+'</td><td>'+t.note+'</td><td><button class="btn btn-sm btn-danger" onclick="delTransaksi('+i+')">'+ico('trash','sm')+'</button></td></tr>';
    });
    h+='</tbody></table></div>';
  }
  openModal('Keuangan & RAB',h);
};
window.openAddTransaksi=function(type){
  openModal('Tambah '+(type==='masuk'?'Pemasukan':'Pengeluaran'),
    '<div class="form-group"><label>Jenis</label><input value="'+(type==='masuk'?'Pemasukan':'Pengeluaran')+'" disabled></div>'+
    '<div class="form-group"><label>Kategori</label><input id="tr-cat" placeholder="Contoh: Sewa alat, Iuran, dll"></div>'+
    '<div class="form-group"><label>Jumlah (Rp)</label><input type="number" id="tr-amt" min="0"></div>'+
    '<div class="form-group"><label>Tanggal</label><input type="date" id="tr-date" value="'+new Date().toISOString().split('T')[0]+'"></div>'+
    '<div class="form-group"><label>Catatan</label><textarea id="tr-note" rows="2"></textarea></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveTransaksi(\''+type+'\')">'+ico('save')+' Simpan</button>'
  );
};
window.saveTransaksi=function(type){
  var cat=(document.getElementById('tr-cat').value||'').trim();
  var amt=parseFloat(document.getElementById('tr-amt').value)||0;
  var dt=document.getElementById('tr-date').value;
  var nt=(document.getElementById('tr-note').value||'').trim();
  if(!cat||amt<=0){alert('Kategori dan jumlah wajib');return;}
  if(containsProfanity(cat)||containsProfanity(nt)){alert('Kata tidak senonoh.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_keuangan_'+cid)||'{"transaksi":[],"rab":[]}');
  data.transaksi.push({type:type,category:sanitizeText(cat),amount:amt,date:dt,note:sanitizeText(nt),by:currentUser.name,at:Date.now()});
  localStorage.setItem('sppt_keuangan_'+cid,JSON.stringify(data));
  closeModal();openKeuanganModal();
  logActivity('keuangan',currentUser.name+' catat '+type+' Rp '+amt,{classId:cid,role:currentUser.role});
};
window.delTransaksi=function(i){
  if(!confirm('Hapus transaksi ini?')) return;
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_keuangan_'+cid)||'{"transaksi":[],"rab":[]}');
  data.transaksi.splice(i,1);
  localStorage.setItem('sppt_keuangan_'+cid,JSON.stringify(data));
  closeModal();openKeuanganModal();
};
window.openAddRAB=function(){
  openModal('Tambah RAB',
    '<div class="form-group"><label>Divisi</label><select id="rab-div">'+
      Object.keys(ROLES).map(function(k){return '<option value="'+k+'">'+ROLES[k].label+'</option>';}).join('')+
    '</select></div>'+
    '<div class="form-group"><label>Item</label><input id="rab-item" placeholder="Contoh: Sewa lampu"></div>'+
    '<div class="form-group"><label>Jumlah (Rp)</label><input type="number" id="rab-amt" min="0"></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveRAB()">'+ico('save')+' Simpan</button>'
  );
};
window.saveRAB=function(){
  var div=document.getElementById('rab-div').value;
  var it=(document.getElementById('rab-item').value||'').trim();
  var amt=parseFloat(document.getElementById('rab-amt').value)||0;
  if(!it||amt<=0){alert('Lengkapi');return;}
  if(containsProfanity(it)){alert('Kata tidak senonoh.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_keuangan_'+cid)||'{"transaksi":[],"rab":[]}');
  data.rab.push({division:div,item:sanitizeText(it),amount:amt,by:currentUser.name,at:Date.now()});
  localStorage.setItem('sppt_keuangan_'+cid,JSON.stringify(data));
  closeModal();openKeuanganModal();
};
window.delRAB=function(i){
  if(!confirm('Hapus?')) return;
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_keuangan_'+cid)||'{"transaksi":[],"rab":[]}');
  data.rab.splice(i,1);
  localStorage.setItem('sppt_keuangan_'+cid,JSON.stringify(data));
  closeModal();openKeuanganModal();
};
window.exportKeuanganDocx=function(){
  var cid=currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  var data=JSON.parse(localStorage.getItem('sppt_keuangan_'+cid)||'{"transaksi":[],"rab":[]}');
  var masuk=0,keluar=0;
  data.transaksi.forEach(function(t){if(t.type==='masuk')masuk+=t.amount;else keluar+=t.amount;});
  var html='<html><head><meta charset="utf-8"><title>Laporan Keuangan</title></head><body>';
  html+='<h1>Laporan Keuangan — '+(c?c.name:'Kelas')+'</h1>';
  html+='<p>Dibuat oleh: '+currentUser.name+' · '+new Date().toLocaleString('id-ID')+'</p>';
  html+='<h2>Ringkasan</h2><table border="1" cellpadding="6" cellspacing="0">';
  html+='<tr><td>Pemasukan</td><td>Rp '+masuk.toLocaleString('id-ID')+'</td></tr>';
  html+='<tr><td>Pengeluaran</td><td>Rp '+keluar.toLocaleString('id-ID')+'</td></tr>';
  html+='<tr><td><b>Saldo</b></td><td><b>Rp '+(masuk-keluar).toLocaleString('id-ID')+'</b></td></tr>';
  html+='</table>';
  if(data.rab.length){
    html+='<h2>RAB Divisi</h2><table border="1" cellpadding="6" cellspacing="0"><tr><th>Divisi</th><th>Item</th><th>Jumlah</th></tr>';
    data.rab.forEach(function(r){html+='<tr><td>'+r.division+'</td><td>'+r.item+'</td><td>Rp '+r.amount.toLocaleString('id-ID')+'</td></tr>';});
    html+='</table>';
  }
  if(data.transaksi.length){
    html+='<h2>Riwayat Transaksi</h2><table border="1" cellpadding="6" cellspacing="0"><tr><th>Tanggal</th><th>Jenis</th><th>Kategori</th><th>Jumlah</th><th>Catatan</th></tr>';
    data.transaksi.forEach(function(t){html+='<tr><td>'+t.date+'</td><td>'+t.type+'</td><td>'+t.category+'</td><td>Rp '+t.amount.toLocaleString('id-ID')+'</td><td>'+t.note+'</td></tr>';});
    html+='</table>';
  }
  html+='</body></html>';
  var blob=new Blob([html],{type:'application/msword'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='Laporan_Keuangan_'+(c?c.name:'Kelas')+'.doc';
  a.click();URL.revokeObjectURL(url);
};

/* ============================================================
   9. SEKRETARIS — Notulensi
   ============================================================ */
window.openNotulensiModal=function(){
  if(!currentUser||currentUser.role!=='sekretaris'){alert('Hanya Sekretaris.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_notulensi_'+cid)||'[]');
  var h='<div class="alert alert-info">'+ico('info')+'<div>Catat notulensi rapat. Notulensi yang disimpan dapat dilihat oleh semua anggota kelas.</div></div>';
  h+='<div class="action-row" style="margin-bottom:12px;">';
  h+='<button class="btn btn-primary btn-sm" onclick="openAddNotulensi()">'+ico('plus')+' Buat Notulensi</button>';
  h+='</div>';
  if(data.length===0){h+='<div class="empty-state">'+ico('book','lg')+'<p>Belum ada notulensi.</p></div>';}
  else{
    data.slice().reverse().forEach(function(n,i){
      var realIdx=data.length-1-i;
      h+='<div class="card card-accent blue"><h3>'+ico('book')+' '+n.title+'</h3>';
      h+='<p style="font-size:12.5px;color:var(--text-muted);margin-bottom:8px;">'+n.date+' · oleh '+n.by+'</p>';
      h+='<div style="font-size:13px;line-height:1.6;white-space:pre-wrap;">'+n.content+'</div>';
      h+='<div class="action-row" style="margin-top:10px;">';
      h+='<button class="btn btn-sm" onclick="shareNotulensi('+realIdx+')">'+ico('send','sm')+' Share ke Kelas</button>';
      h+='<button class="btn btn-sm btn-danger" onclick="delNotulensi('+realIdx+')">'+ico('trash','sm')+'</button>';
      h+='</div></div>';
    });
  }
  openModal('Notulensi Rapat',h);
};
window.openAddNotulensi=function(){
  openModal('Buat Notulensi',
    '<div class="form-group"><label>Judul</label><input id="nt-title" placeholder="Contoh: Rapat Produksi #1"></div>'+
    '<div class="form-group"><label>Tanggal</label><input type="date" id="nt-date" value="'+new Date().toISOString().split('T')[0]+'"></div>'+
    '<div class="form-group"><label>Isi Notulensi</label><textarea id="nt-content" rows="8" placeholder="1. Pembukaan&#10;2. Pembahasan&#10;3. Keputusan&#10;4. Penutup"></textarea></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveNotulensi()">'+ico('save')+' Simpan</button>'
  );
};
window.saveNotulensi=function(){
  var ti=(document.getElementById('nt-title').value||'').trim();
  var dt=document.getElementById('nt-date').value;
  var ct=(document.getElementById('nt-content').value||'').trim();
  if(!ti||!ct){alert('Lengkapi judul & isi');return;}
  if(containsProfanity(ti)||containsProfanity(ct)){alert('Kata tidak senonoh.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_notulensi_'+cid)||'[]');
  data.push({title:sanitizeText(ti),date:dt,content:sanitizeText(ct),by:currentUser.name,at:Date.now()});
  localStorage.setItem('sppt_notulensi_'+cid,JSON.stringify(data));
  closeModal();openNotulensiModal();
  logActivity('notulensi',currentUser.name+' buat notulensi: '+ti,{classId:cid,role:currentUser.role});
};
window.delNotulensi=function(i){
  if(!confirm('Hapus notulensi ini?')) return;
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_notulensi_'+cid)||'[]');
  data.splice(i,1);
  localStorage.setItem('sppt_notulensi_'+cid,JSON.stringify(data));
  closeModal();openNotulensiModal();
};
window.shareNotulensi=function(i){
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_notulensi_'+cid)||'[]');
  var n=data[i];if(!n) return;
  if(!confirm('Bagikan notulensi ini ke semua anggota kelas?')) return;
  fbAddNotif({
    id:uid(),classId:cid,fromId:currentUser.studentId,fromName:currentUser.name,
    fromType:'siswa',fromRole:currentUser.role,
    toId:'all',type:'info',
    title:'Notulensi: '+n.title,
    message:n.content,
    createdAt:Date.now(),readBy:[],doneBy:[]
  });
  logActivity('notulensi',currentUser.name+' share notulensi: '+n.title,{classId:cid,role:currentUser.role});
  alert('✅ Notulensi dibagikan ke semua kelas!');
};
window.openViewNotulensi=function(){
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_notulensi_'+cid)||'[]');
  var h='<div class="alert alert-info">'+ico('info')+'<div>Notulensi rapat kelas Anda.</div></div>';
  if(data.length===0){h+='<div class="empty-state">'+ico('book','lg')+'<p>Belum ada notulensi.</p></div>';}
  else{
    data.slice().reverse().forEach(function(n){
      h+='<div class="card card-accent blue"><h3>'+ico('book')+' '+n.title+'</h3>';
      h+='<p style="font-size:12.5px;color:var(--text-muted);margin-bottom:8px;">'+n.date+' · oleh '+n.by+'</p>';
      h+='<div style="font-size:13px;line-height:1.6;white-space:pre-wrap;">'+n.content+'</div></div>';
    });
  }
  openModal('Notulensi Kelas',h);
};

/* ============================================================
   10. ADUAN SISWA
   ============================================================ */
window.openAduanModal=function(){
  if(!currentUser||currentUser.type!=='siswa'){alert('Hanya siswa.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_aduan_'+cid)||'[]');
  var h='<div class="alert alert-warning">'+ico('warning')+'<div><b>PENTING:</b> Fitur ini HANYA untuk <b>masalah signifikan</b> (perundungan, kekerasan, kerusakan alat penting, kendala besar proyek).<br><br>Untuk masalah kecil, <b>selesaikan sendiri</b> sebagai bagian dari pembelajaran <i>problem solving</i>.</div></div>';
  h+='<button class="btn btn-primary btn-sm" style="margin-bottom:12px;" onclick="openAddAduan()">'+ico('plus')+' Buat Aduan Baru</button>';
  var mine=data.filter(function(a){return a.by===currentUser.name;});
  if(mine.length===0){h+='<div class="empty-state">'+ico('alert','lg')+'<p>Belum ada aduan Anda.</p></div>';}
  else{
    h+='<h3 style="margin:16px 0 8px;font-size:14px;">Riwayat Aduan Anda</h3>';
    mine.reverse().forEach(function(a){
      h+='<div class="card card-accent red"><h3>'+ico('alert')+' '+a.title+'</h3>';
      h+='<p style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">'+new Date(a.at).toLocaleString('id-ID')+' · Status: <b>'+a.status+'</b></p>';
      h+='<div style="font-size:12.5px;line-height:1.6;">'+a.detail+'</div></div>';
    });
  }
  openModal('Aduan Signifikan',h);
};
window.openAddAduan=function(){
  openModal('Buat Aduan',
    '<div class="alert alert-warning">'+ico('warning')+'<div>Pastikan ini masalah <b>signifikan</b>. Aduan palsu dapat merugikan.</div></div>'+
    '<div class="form-group"><label>Kategori</label><select id="ad-cat">'+
      '<option value="perundungan">Perundungan / Bullying</option>'+
      '<option value="kekerasan">Kekerasan fisik</option>'+
      '<option value="kerusakan">Kerusakan alat penting</option>'+
      '<option value="kendala_besar">Kendala besar proyek</option>'+
      '<option value="lain">Lainnya (jelaskan)</option>'+
    '</select></div>'+
    '<div class="form-group"><label>Judul</label><input id="ad-title" placeholder="Ringkasan singkat"></div>'+
    '<div class="form-group"><label>Detail</label><textarea id="ad-detail" rows="5" placeholder="Jelaskan: apa, siapa, kapan, di mana, bagaimana"></textarea></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveAduan()">'+ico('send')+' Kirim Aduan</button>'
  );
};
window.saveAduan=function(){
  var cat=document.getElementById('ad-cat').value;
  var ti=(document.getElementById('ad-title').value||'').trim();
  var dt=(document.getElementById('ad-detail').value||'').trim();
  if(!ti||!dt){alert('Lengkapi judul & detail');return;}
  if(containsProfanity(ti)||containsProfanity(dt)){alert('Kata tidak senonoh.');return;}
  if(dt.length<20){alert('Detail minimal 20 karakter untuk masalah signifikan.');return;}
  var cid=currentUser.classId;
  var data=JSON.parse(localStorage.getItem('sppt_aduan_'+cid)||'[]');
  data.push({cat:cat,title:sanitizeText(ti),detail:sanitizeText(dt),by:currentUser.name,status:'Menunggu',at:Date.now()});
  localStorage.setItem('sppt_aduan_'+cid,JSON.stringify(data));
  fbAddNotif({
    id:uid(),classId:cid,fromId:currentUser.studentId,fromName:currentUser.name,fromType:'siswa',fromRole:currentUser.role,
    toId:'guru',type:'urgent',title:'[ADUAN] '+ti,message:'Kategori: '+cat+'\n\n'+dt,createdAt:Date.now(),readBy:[],doneBy:[]
  });
  closeModal();openAduanModal();
  logActivity('aduan',currentUser.name+' buat aduan: '+ti,{classId:cid,role:currentUser.role});
  alert('✅ Aduan terkirim ke guru');
};

/* ============================================================
   11. EDIT NILAI SISWA (1x) + TEACHER EDIT + WINDOW
   ============================================================ */
/* Cek apakah penilaian masih dalam window */
function isAssessmentOpen(cid,sid){
  var dl=(window.DB.deadlines||{})[cid];
  if(!dl||!dl[sid]) return true; /* kalau guru tidak set, default buka */
  var d=dl[sid];
  if(!d.date) return true;
  var now=new Date();
  var todayStr=now.toISOString().split('T')[0];
  if(d.date>todayStr) return false;
  if(d.date<todayStr) return false;
  if(d.openTime||d.closeTime){
    var curTime=now.toTimeString().substring(0,5);
    if(d.openTime&&curTime<d.openTime) return false;
    if(d.closeTime&&curTime>d.closeTime) return false;
  }
  return true;
}
window.isAssessmentOpen=isAssessmentOpen;

/* Hook: Simpan penilaian siswa dengan limit edit 1x */
var _origSaveSiswaGrade=window.saveSiswaGrade;
if(typeof _origSaveSiswaGrade==='function'){
  window.saveSiswaGrade=function(cid,tid,sid){
    /* Cek window */
    if(!isAssessmentOpen(cid,sid)){
      if(!confirm('⚠️ Masa penilaian tahap ini sudah ditutup.\n\nAjukan ke guru untuk membuka ulang. Lanjutkan?')) return;
    }
    /* Cek sudah pernah edit berapa kali */
    var key='sppt_editcount_'+cid+'_'+currentUser.studentId+'_'+tid+'_'+sid;
    var cnt=parseInt(localStorage.getItem(key)||'0');
    /* Cek apakah sudah ada nilai sebelumnya */
    var ev=window.DB.evaluations[cid]&&window.DB.evaluations[cid][tid]?window.DB.evaluations[cid][tid]:{};
    var existing=ev[currentUser.studentId]&&ev[currentUser.studentId][sid];
    var hasExisting=existing&&Object.keys(existing).length>0;
    if(hasExisting&&cnt>=1){
      alert('❌ Anda sudah pernah mengedit nilai ini. Hubungi guru pengampu untuk edit lebih lanjut.');
      return;
    }
    if(hasExisting){
      if(!confirm('Anda pernah menilai. Edit ini akan tercatat (maks 1x). Lanjutkan?')) return;
      localStorage.setItem(key,String(cnt+1));
    }
    return _origSaveSiswaGrade.apply(this,arguments);
  };
}

/* Teacher edit nilai + alasan */
window.openTeacherEditGrade=function(cid,tid){
  if(!ownsClass(cid)){alert('Akses ditolak');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var t=c.students.find(function(x){return x.id===tid;});if(!t)return;
  var rubric=getRubricFor(t.role);
  var active=DB.stages.filter(function(s){return isStageActive(cid,s.id);});
  var ev=(DB.evaluations[cid]&&DB.evaluations[cid][tid])||{};
  var h='<div class="alert alert-warning">'+ico('warning')+'<div>Edit nilai siswa. <b>Alasan wajib diisi</b> untuk pertanggungjawaban.</div></div>';
  h+='<div class="form-group"><label>Nama</label><input value="'+t.name+'" disabled></div>';
  h+='<div class="form-group"><label>Alasan Edit (WAJIB)</label><textarea id="te-reason" rows="3" placeholder="Contoh: Ralat nilai, siswa menunjukkan perbaikan, dll"></textarea></div>';
  h+='<div class="form-group"><label>Tahap</label><select id="te-stage">'+active.map(function(s){return '<option value="'+s.id+'">'+s.name+'</option>';}).join('')+'</select></div>';
  h+='<div class="form-group"><label>Nilai Tahap (0-4)</label><input type="number" step="0.1" min="0" max="4" id="te-score" placeholder="Contoh: 3.5"></div>';
  h+='<button class="btn btn-primary btn-block" onclick="saveTeacherEdit(\''+cid+'\',\''+tid+'\')">'+ico('save')+' Simpan Perubahan</button>';
  openModal('Edit Nilai — '+t.name,h);
};
window.saveTeacherEdit=function(cid,tid){
  var reason=(document.getElementById('te-reason').value||'').trim();
  var sid=document.getElementById('te-stage').value;
  var sc=parseFloat(document.getElementById('te-score').value);
  if(!reason||reason.length<10){alert('Alasan wajib diisi (min 10 karakter)');return;}
  if(isNaN(sc)||sc<0||sc>4){alert('Nilai harus antara 0-4');return;}
  if(containsProfanity(reason)){alert('Kata tidak senonoh.');return;}
  var key=cid+'__'+tid;
  var doc=fb.collection('evaluations').doc(key);
  doc.get().then(function(snap){
    var data=snap.exists?snap.data():{classId:cid,targetId:tid};
    if(!data.guru)data.guru={};
    if(!data.guru[sid])data.guru[sid]={};
    data.guru[sid]._override=sc;
    data.guru[sid]._overrideReason=sanitizeText(reason);
    data.guru[sid]._overrideBy=currentUser.name;
    data.guru[sid]._overrideAt=Date.now();
    return doc.set(sanitizeFirestore(data),{merge:true});
  }).then(function(){
    logActivity('edit_nilai','Guru '+currentUser.name+' edit nilai '+tid+' ('+reason+')',{classId:cid});
    alert('✅ Nilai diupdate');
    closeModal();
  });
};

/* ============================================================
   12. TEACHER: Window Penilaian per tahap
   ============================================================ */
window.openAssessmentWindowModal=function(cid){
  if(!ownsClass(cid)){alert('Akses ditolak');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var dl=(DB.deadlines||{})[cid]||{};
  var h='<div class="alert alert-info">'+ico('info')+'<div>Atur window penilaian (tanggal & jam) per tahap. Siswa hanya bisa menilai dalam rentang ini.</div></div>';
  DB.stages.forEach(function(s,i){
    var d=dl[s.id]||{};
    h+='<div class="card" style="padding:12px;"><h3 style="font-size:13px;margin-bottom:8px;">'+s.name+'</h3>';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">';
    h+='<input type="date" id="aw-date-'+s.id+'" value="'+(d.date||'')+'" style="padding:6px;border-radius:6px;border:1px solid var(--border);">';
    h+='<input type="time" id="aw-open-'+s.id+'" value="'+(d.openTime||'')+'" placeholder="Buka" style="padding:6px;border-radius:6px;border:1px solid var(--border);">';
    h+='<input type="time" id="aw-close-'+s.id+'" value="'+(d.closeTime||'')+'" placeholder="Tutup" style="padding:6px;border-radius:6px;border:1px solid var(--border);">';
    h+='</div></div>';
  });
  h+='<button class="btn btn-primary btn-block" onclick="saveAssessmentWindow(\''+cid+'\')">'+ico('save')+' Simpan</button>';
  openModal('Window Penilaian',h);
};
window.saveAssessmentWindow=function(cid){
  var obj={};
  DB.stages.forEach(function(s){
    var d=document.getElementById('aw-date-'+s.id).value;
    var op=document.getElementById('aw-open-'+s.id).value;
    var cl=document.getElementById('aw-close-'+s.id).value;
    if(d||op||cl) obj[s.id]={date:d,openTime:op,closeTime:cl,setBy:currentUser.name,setAt:Date.now()};
  });
  fbSetDeadlines(cid,obj).then(function(){closeModal();alert('✅ Window tersimpan');});
};

/* ============================================================
   13. STUDENT: Download PDF hasil penilaian
   ============================================================ */
window.downloadMyAssessmentPDF=function(){
  if(!currentUser||currentUser.type!=='siswa'){alert('Hanya siswa.');return;}
  var cid=currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  var me=c.students.find(function(s){return s.id===currentUser.studentId;});
  var rubric=getRubricFor(me.role);
  var html='<html><head><meta charset="utf-8"><title>Hasil Penilaian</title>';
  html+='<style>body{font-family:Arial;padding:30px;color:#1f2937;} h1{color:#2563eb;} table{width:100%;border-collapse:collapse;margin:12px 0;} th,td{border:1px solid #d1d5db;padding:8px;text-align:left;} th{background:#eff6ff;} .score{font-size:24px;font-weight:bold;color:#10b981;}</style>';
  html+='</head><body>';
  html+='<h1>Hasil Penilaian Kinerja</h1>';
  html+='<p><b>Nama:</b> '+me.name+'<br><b>Kelas:</b> '+c.name+'<br><b>Peran:</b> '+((ROLES[me.role]||{}).label||me.role)+'</p>';
  html+='<hr>';
  DB.stages.forEach(function(s){
    if(!isStageActive(cid,s.id)) return;
    var sc=calcStageScore(cid,me.id,s.id);
    html+='<h2>Tahap: '+s.name+' — '+s.weight+'%</h2>';
    html+='<p>Bobot tahap: '+s.weight+'%</p>';
    html+='<table><tr><th>Aspek</th><th>Bobot</th><th>Nilai Anda</th><th>Keterangan</th></tr>';
    rubric.forEach(function(r){
      var ev=(DB.evaluations[cid]&&DB.evaluations[cid][me.id])||{};
      var semua=[];
      for(var eid in ev){
        var sc2=ev[eid][s.id];
        if(sc2&&sc2[r.id]!=null){
          var nm=eid==='guru'?'Guru':(c.students.find(function(x){return x.id===eid;})||{}).name||eid;
          semua.push(nm+': '+sc2[r.id]);
        }
      }
      html+='<tr><td>'+r.name+'</td><td>'+r.weight+'%</td><td>'+semua.join(', ')+'</td><td>'+(r.scale||'')+'</td></tr>';
    });
    html+='</table>';
    html+='<p class="score">Nilai Tahap: '+sc.toFixed(2)+' / 4.00</p>';
    html+='<hr>';
  });
  var final=calcFinalScore(cid,me.id);
  html+='<h2>Nilai Akhir: <span class="score">'+final.toFixed(2)+' / 4.00</span></h2>';
  html+='<p style="color:#6b7280;font-size:12px;">Dicetak: '+new Date().toLocaleString('id-ID')+'</p>';
  html+='</body></html>';
  var w=window.open('','_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(function(){w.print();},500);
};

/* ============================================================
   14. TEACHER: Export PDF Rekap
   ============================================================ */
window.exportRecapPDF=function(cid){
  if(!ownsClass(cid)){alert('Akses ditolak');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});
  var html='<html><head><meta charset="utf-8"><title>Rekap Nilai</title>';
  html+='<style>body{font-family:Arial;padding:20px;} h1{color:#2563eb;} table{width:100%;border-collapse:collapse;font-size:11px;} th,td{border:1px solid #999;padding:5px;} th{background:#eff6ff;}</style></head><body>';
  html+='<h1>Rekap Nilai — '+c.name+'</h1><p>'+new Date().toLocaleString('id-ID')+'</p>';
  html+='<table><tr><th>No</th><th>Nama</th><th>Peran</th>';
  DB.stages.forEach(function(s){html+='<th>'+s.name+' ('+s.weight+'%)</th>';});
  html+='<th>Nilai Akhir</th></tr>';
  c.students.forEach(function(t,i){
    html+='<tr><td>'+(i+1)+'</td><td>'+t.name+'</td><td>'+((ROLES[t.role]||{}).label||t.role)+'</td>';
    DB.stages.forEach(function(s){
      if(!isStageActive(cid,s.id)){html+='<td>—</td>';return;}
      html+='<td>'+calcStageScore(cid,t.id,s.id).toFixed(2)+'</td>';
    });
    html+='<td><b>'+calcFinalScore(cid,t.id).toFixed(2)+'</b></td></tr>';
  });
  html+='</table></body></html>';
  var w=window.open('','_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(function(){w.print();},500);
};

/* ============================================================
   15. HOOK: Toolbar tambahan di dashboard siswa
   ============================================================ */
var _origSiswaDash=window.renderSiswaDashboard;
if(typeof _origSiswaDash==='function'){
  window.renderSiswaDashboard=function(){
    _origSiswaDash();
    var mc=document.getElementById('main-content');
    if(!mc||!currentUser||currentUser.type!=='siswa') return;
    var role=currentUser.role;
    var h='<div class="extras-toolbar" style="margin-top:12px;">';
    /* Deadline khusus Pimpro & Sutradara */
    if(role==='pimpinan_produksi') h+='<button class="btn btn-primary" onclick="openTimelineDeadlineModal(\'produksi\')">'+ico('clock')+' Deadline Tim Produksi</button>';
    if(role==='sutradara') h+='<button class="btn btn-primary" onclick="openTimelineDeadlineModal(\'artistik\')">'+ico('clock')+' Deadline Tim Artistik</button>';
    /* Keuangan */
    if(role==='bendahara') h+='<button class="btn btn-primary" onclick="openKeuanganModal()">'+ico('chart')+' Keuangan & RAB</button>';
    /* Notulensi */
    if(role==='sekretaris') h+='<button class="btn btn-primary" onclick="openNotulensiModal()">'+ico('book')+' Notulensi</button>';
    /* Absensi buat sesi */
    if(['pimpinan_produksi','sekretaris'].indexOf(role)>=0) h+='<button class="btn" onclick="openCreateMeetingModalFull(\'rapat\')">'+ico('calendar')+' Buat Absen Rapat</button>';
    if(['sutradara','asisten_sutradara'].indexOf(role)>=0) h+='<button class="btn" onclick="openCreateMeetingModalFull(\'latihan\')">'+ico('calendar')+' Buat Absen Latihan</button>';
    /* Notulensi view untuk semua */
    h+='<button class="btn" onclick="openViewNotulensi()">'+ico('book')+' Lihat Notulensi</button>';
    /* Aduan */
    h+='<button class="btn btn-warning" onclick="openAduanModal()">'+ico('alert')+' Aduan Signifikan</button>';
    /* Download PDF hasil */
    h+='<button class="btn" onclick="downloadMyAssessmentPDF()">'+ico('download')+' Unduh Hasil Penilaian</button>';
    h+='</div>';
    mc.insertAdjacentHTML('beforeend',h);
  };
}

/* HOOK: Toolbar guru tambahan */
var _origViewClassF=window.viewClass;
if(typeof _origViewClassF==='function'){
  window.viewClass=function(cid){
    _origViewClassF(cid);
    var mc=document.getElementById('main-content');
    if(!mc) return;
    /* Sisipkan tombol window penilaian & edit nilai */
    var extra=document.createElement('div');
    extra.className='action-row';
    extra.style.marginBottom='12px';
    extra.innerHTML='<button class="btn btn-sm" onclick="openAssessmentWindowModal(\''+cid+'\')">'+ico('clock')+' Window Penilaian</button>';
    mc.insertAdjacentHTML('afterbegin',extra.outerHTML);
  };
}

/* Hook tombol export di rekap */
var _origRenderRecap=window.renderRecap;
if(typeof _origRenderRecap==='function'){
  window.renderRecap=function(cid){
    _origRenderRecap(cid);
    var btn=document.querySelector('#main-content .action-row');
    if(btn&&!btn.querySelector('.btn-export-pdf')){
      var b=document.createElement('button');
      b.className='btn btn-sm btn-export-pdf';
      b.innerHTML=ico('download')+' Export PDF';
      b.onclick=function(){exportRecapPDF(cid);};
      btn.appendChild(b);
    }
  };
}

console.log('[features] 15 fitur tambahan siap');

})();
