/* ============================================================
   SP-PPT features2.js — 9 FITUR TAMBAHAN v2
   Load SETELAH features.js
   ============================================================ */
(function(){
'use strict';

if(typeof firebaseReady==='undefined'||!firebaseReady){
  console.warn('[features2] Firebase belum siap, tunggu...');
}

/* ============================================================
   FITUR 1: ADMIN — Tambah No. Telp pada data Guru
   ============================================================ */

/* Override modal tambah guru */
window.openAddTeacherModal=function(){
  openModal('Tambah Guru',
    '<div class="form-group"><label>Nama Lengkap</label><input id="t-name" placeholder="Contoh: Fikri Yassaar Arrazaq, S.Sn."></div>'+
    '<div class="form-group"><label>Email</label><input type="email" id="t-email" placeholder="nama@guru.smp.belajar.id"></div>'+
    '<div class="form-group"><label>No. WhatsApp Aktif</label><input type="tel" id="t-phone" placeholder="08123456789"><small class="hint">Wajib — untuk fitur aduan & komunikasi siswa</small></div>'+
    '<div class="form-group pw-toggle"><label>Password</label><input type="password" id="t-password" placeholder="Min 6 karakter"><button class="toggle-btn" onclick="togglePw(\'t-password\',this)" type="button">👁</button></div>'+
    '<button class="btn btn-primary btn-block" onclick="addTeacherV2()">'+ico('save')+' Simpan</button>'
  );
};

window.addTeacherV2=function(){
  var n=(document.getElementById('t-name').value||'').trim();
  var e=(document.getElementById('t-email').value||'').trim().toLowerCase();
  var ph=(document.getElementById('t-phone').value||'').replace(/\D/g,'');
  var p=document.getElementById('t-password').value;
  if(!n||!e||!p||!ph){alert('Lengkapi semua field termasuk No. WA!');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){alert('Email tidak valid');return;}
  if(ph.length<10||ph.length>15){alert('No. WA tidak valid (10-15 digit)');return;}
  if(p.length<6){alert('Password minimal 6 karakter');return;}
  if(DB.teachers.some(function(t){return t.email&&t.email.toLowerCase()===e;})){alert('Email sudah terdaftar!');return;}
  fbSetTeacher({name:n,email:e,phone:ph,password:p});
  closeModal();
  alert('✅ Guru ditambahkan!');
};

/* Override modal edit guru */
window.openEditTeacherModal=function(email){
  var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===email.toLowerCase();});
  if(!t) return;
  openModal('Edit Guru',
    '<div class="form-group"><label>Nama</label><input id="t-name" value="'+String(t.name).replace(/"/g,'&quot;')+'"></div>'+
    '<div class="form-group"><label>Email</label><input type="email" id="t-email" value="'+t.email+'"></div>'+
    '<div class="form-group"><label>No. WhatsApp</label><input type="tel" id="t-phone" value="'+(t.phone||'')+'" placeholder="08123456789"></div>'+
    '<div class="form-group pw-toggle"><label>Password (kosongkan jika tidak diubah)</label><input type="password" id="t-password"><button class="toggle-btn" onclick="togglePw(\'t-password\',this)" type="button">👁</button></div>'+
    '<button class="btn btn-primary btn-block" onclick="updateTeacherV2(\''+email+'\')">'+ico('save')+' Simpan</button>'
  );
};

window.updateTeacherV2=function(oldEmail){
  var n=(document.getElementById('t-name').value||'').trim();
  var e=(document.getElementById('t-email').value||'').trim().toLowerCase();
  var ph=(document.getElementById('t-phone').value||'').replace(/\D/g,'');
  var p=document.getElementById('t-password').value;
  if(!n||!e){alert('Nama & email wajib');return;}
  if(ph&&(ph.length<10||ph.length>15)){alert('No. WA tidak valid');return;}
  if(p&&p.length<6){alert('Password min 6');return;}
  if(DB.teachers.some(function(t){return t.email.toLowerCase()===e&&t.email.toLowerCase()!==oldEmail.toLowerCase();})){alert('Email dipakai guru lain');return;}
  var t=DB.teachers.find(function(x){return x.email.toLowerCase()===oldEmail.toLowerCase();});
  var upd=Object.assign({},t,{name:n,email:e,phone:ph||''});
  if(p) upd.password=p;
  var pr=oldEmail.toLowerCase()!==e.toLowerCase()?fbDelTeacher(oldEmail):Promise.resolve();
  pr.then(function(){return fbSetTeacher(upd);}).then(function(){closeModal();alert('✅ Diperbarui!');});
};

/* Override render admin untuk tampilkan phone */
window.renderAdminDashboard=function(){
  document.getElementById('header-title-text').innerHTML=ico('settings')+' Dashboard Administrator';
  var h='<div class="alert alert-info">'+ico('shield')+'<div><b>Area Administrator</b><br>Kelola akun guru pengampu. Setiap guru <b>WAJIB</b> punya No. WA untuk fitur aduan siswa.</div></div>';
  h+='<div class="action-row" style="margin-bottom:16px;">';
  h+='<button class="btn btn-primary" onclick="openAddTeacherModal()">'+ico('personPlus')+' Tambah Guru</button>';
  h+='<button class="btn" onclick="openWaLogsGlobal()">'+ico('messageCircle')+' Log Komunikasi</button>';
  h+='<button class="btn" onclick="openActivityLog()">'+ico('activity')+' Aktivitas</button>';
  h+='</div>';
  h+='<h3 style="color:var(--text-strong);margin-bottom:14px;font-size:15px;font-weight:700;">'+ico('users')+' Daftar Guru ('+DB.teachers.length+')</h3>';
  if(DB.teachers.length===0){h+='<div class="empty-state">'+ico('users','lg')+'<p>Belum ada guru.</p></div>';}
  DB.teachers.forEach(function(t){
    var isD=DEFAULT_TEACHERS.some(function(d){return d.email.toLowerCase()===t.email.toLowerCase();});
    var phoneBadge = t.phone
      ? '<span class="badge badge-success">'+ico('phone','sm')+' '+t.phone+'</span>'
      : '<span class="badge badge-danger">'+ico('warning','sm')+' Belum ada No. WA</span>';
    h+='<div class="teacher-list-item"><div class="info">'+ico('user','lg')+'<div><strong>'+t.name+'</strong><small>'+t.email+'</small><div style="margin-top:4px;">'+phoneBadge+'</div></div></div><div class="action-row">'+(isD?'<span class="badge badge-primary">'+ico('shield')+' Utama</span>':'<button class="btn btn-sm" onclick="openEditTeacherModal(\''+t.email+'\')">'+ico('edit')+'</button><button class="btn btn-sm btn-danger" onclick="deleteTeacher(\''+t.email+'\')">'+ico('trash')+'</button>')+'</div></div>';
  });
  /* Ringkasan kelas */
  h+='<h3 style="color:var(--text-strong);margin:20px 0 12px;font-size:15px;font-weight:700;">'+ico('school')+' Kelas Terdaftar</h3>';
  if(DB.classes.length===0){h+='<div class="empty-state">'+ico('school','lg')+'<p>Belum ada kelas.</p></div>';}
  else{
    h+='<div class="table-wrap"><table><thead><tr><th>Kelas</th><th>Kode</th><th>Pemilik (Guru)</th><th>Siswa</th></tr></thead><tbody>';
    DB.classes.forEach(function(c){
      h+='<tr><td><b>'+c.name+'</b></td><td><code>'+c.code+'</code></td><td>'+(c.teacherEmail||'<span class="badge badge-warning">Belum terassign</span>')+'</td><td>'+((c.students||[]).length)+'</td></tr>';
    });
    h+='</tbody></table></div>';
  }
  h+=renderActivityFeed('admin');
  document.getElementById('main-content').innerHTML=h;
  updateNotifBadge();
};

/* ============================================================
   FITUR 2: ADUAN → LANGSUNG WA GURU
   ============================================================ */
window.openAduanModal=function(){
  if(!currentUser||currentUser.type!=='siswa'){alert('Hanya siswa.');return;}
  var cid=currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  if(!c){alert('Kelas tidak ditemukan.');return;}
  var guruEmail=c.teacherEmail;
  var guru=DB.teachers.find(function(t){return t.email&&t.email.toLowerCase()===String(guruEmail||'').toLowerCase();});
  var data=JSON.parse(localStorage.getItem('sppt_aduan_'+cid)||'[]');

  var h='<div class="alert alert-warning">'+ico('warning')+'<div><b>PENTING:</b> Fitur ini HANYA untuk masalah <b>signifikan</b> (perundungan, kekerasan, kerusakan alat penting, kendala besar proyek).<br><br>Untuk masalah kecil, selesaikan sendiri sebagai pembelajaran <i>problem solving</i>.</div></div>';

  if(!guru||!guru.phone){
    h+='<div class="alert alert-danger">'+ico('alert')+'<div><b>Guru pengampu belum mengisi No. WA.</b><br>Hubungi admin untuk melengkapi data guru.</div></div>';
  }

  h+='<button class="btn btn-primary btn-sm" style="margin-bottom:12px;" onclick="openAddAduanWA()">'+ico('plus')+' Buat Aduan Baru</button>';
  var mine=data.filter(function(a){return a.by===currentUser.name;});
  if(mine.length===0){h+='<div class="empty-state">'+ico('alert','lg')+'<p>Belum ada aduan Anda.</p></div>';}
  else{
    h+='<h3 style="margin:16px 0 8px;font-size:14px;">Riwayat Aduan Anda</h3>';
    mine.slice().reverse().forEach(function(a){
      h+='<div class="card card-accent red"><h3>'+ico('alert')+' '+a.title+'</h3>';
      h+='<p style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">'+new Date(a.at).toLocaleString('id-ID')+' · Kategori: <b>'+a.cat+'</b></p>';
      h+='<div style="font-size:12.5px;line-height:1.6;">'+a.detail+'</div></div>';
    });
  }
  openModal('Aduan Signifikan',h);
};

window.openAddAduanWA=function(){
  var cid=currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  var guruEmail=c?c.teacherEmail:'';
  var guru=DB.teachers.find(function(t){return t.email&&t.email.toLowerCase()===String(guruEmail||'').toLowerCase();});
  if(!guru||!guru.phone){
    alert('❌ Guru pengampu belum mengisi No. WA.\n\nSilakan hubungi admin untuk melengkapi data guru.');
    return;
  }
  openModal('Buat Aduan',
    '<div class="alert alert-warning">'+ico('warning')+'<div>Aduan akan dibuka di <b>WhatsApp</b> menuju guru pengampu: <b>'+guru.name+'</b> ('+guru.phone+').</div></div>'+
    '<div class="form-group"><label>Kategori</label><select id="ad-cat">'+
      '<option value="Perundungan / Bullying">Perundungan / Bullying</option>'+
      '<option value="Kekerasan fisik">Kekerasan fisik</option>'+
      '<option value="Kerusakan alat penting">Kerusakan alat penting</option>'+
      '<option value="Kendala besar proyek">Kendala besar proyek</option>'+
      '<option value="Lainnya">Lainnya (jelaskan di detail)</option>'+
    '</select></div>'+
    '<div class="form-group"><label>Judul Singkat</label><input id="ad-title" placeholder="Ringkasan singkat masalah"></div>'+
    '<div class="form-group"><label>Detail Kronologi</label><textarea id="ad-detail" rows="6" placeholder="Jelaskan: apa, siapa, kapan, di mana, bagaimana"></textarea><small class="hint">Minimal 20 karakter untuk masalah signifikan.</small></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveAduanWA()">'+ico('send')+' Kirim Aduan via WhatsApp</button>'
  );
};

window.saveAduanWA=function(){
  var cat=document.getElementById('ad-cat').value;
  var ti=(document.getElementById('ad-title').value||'').trim();
  var dt=(document.getElementById('ad-detail').value||'').trim();
  if(!ti||!dt){alert('Lengkapi judul & detail');return;}
  if(containsProfanity(ti)||containsProfanity(dt)){alert('❌ Kata tidak senonoh terdeteksi.');return;}
  if(dt.length<20){alert('Detail minimal 20 karakter untuk masalah signifikan.');return;}

  var cid=currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  var guru=DB.teachers.find(function(t){return t.email&&t.email.toLowerCase()===String(c.teacherEmail||'').toLowerCase();});
  if(!guru||!guru.phone){alert('Guru belum ada No. WA');return;}

  /* Simpan riwayat lokal */
  var data=JSON.parse(localStorage.getItem('sppt_aduan_'+cid)||'[]');
  data.push({cat:cat,title:sanitizeText(ti),detail:sanitizeText(dt),by:currentUser.name,at:Date.now()});
  localStorage.setItem('sppt_aduan_'+cid,JSON.stringify(data));

  /* Buka WhatsApp dengan template */
  var phone=String(guru.phone).replace(/\D/g,'');
  if(phone.charAt(0)==='0') phone='62'+phone.substring(1);
  if(phone.substring(0,2)!=='62') phone='62'+phone;

  var msg='Mohon maaf pak/bu saya izin menyampaikan aduan.\n\n'+
    'Nama: '+currentUser.name+'\n'+
    'Kelas: '+(c?c.name:'-')+'\n'+
    'Kategori: '+cat+'\n'+
    'Judul: '+ti+'\n\n'+
    'Aduan:\n'+dt+'\n\n'+
    'Terima kasih pak/bu atas respon dan bimbingannya.';

  window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank');

  /* Notif internal ke guru */
  fbAddNotif({
    id:uid(),classId:cid,fromId:currentUser.studentId,fromName:currentUser.name,fromType:'siswa',fromRole:currentUser.role,
    toId:'guru',type:'urgent',title:'[ADUAN] '+ti,message:'Kategori: '+cat+'\n\n'+dt,createdAt:Date.now(),readBy:[],doneBy:[]
  });

  logActivity('aduan',currentUser.name+' buat aduan: '+ti,{classId:cid,role:currentUser.role});
  closeModal();
  alert('✅ Aduan terkirim via WhatsApp ke guru pengampu.');
};

/* ============================================================
   FITUR 3: LOG AKTIVITAS — Filter per kelas / semua kelas
   ============================================================ */
window.openActivityLog=function(){
  var h='<div class="alert alert-info">'+ico('info')+'<div>Riwayat aktivitas sistem. Filter per kelas atau semua kelas.</div></div>';
  if(currentUser.type==='guru'||currentUser.type==='admin'){
    var list=currentUser.type==='admin'?DB.classes:myClasses();
    h+='<div class="form-group"><label>Filter Kelas</label><select id="act-filter-class" onchange="renderActivityLogBody()">'+
      '<option value="">-- Semua Kelas --</option>'+
      list.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('')+
    '</select></div>';
  }
  h+='<div id="activity-log-body"></div>';
  openModal(ico('activity')+' Log Aktivitas',h);
  renderActivityLogBody();
};

window.renderActivityLogBody=function(){
  var b=document.getElementById('activity-log-body');if(!b) return;
  var cid=(document.getElementById('act-filter-class')||{}).value||'';
  var logs=(DB.activityLogs||[]).slice(0,300);

  /* Filter by role */
  if(currentUser.type==='guru'){
    var myIds=myClasses().map(function(c){return c.id;});
    logs=logs.filter(function(l){return !l.classId||myIds.indexOf(l.classId)>=0;});
  } else if(currentUser.type==='siswa'){
    logs=filterActivitiesForUser(logs,currentUser);
  }
  /* Filter by kelas (admin/guru) */
  if(cid){
    logs=logs.filter(function(l){return l.classId===cid;});
  }
  if(logs.length===0){b.innerHTML='<div class="empty-state">'+ico('activity','lg')+'<p>Belum ada aktivitas.</p></div>';return;}

  var h='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Total: '+logs.length+' entri</div>';
  h+='<div class="activity-feed">';
  logs.forEach(function(l){
    var cls=l.classId?(DB.classes.find(function(c){return c.id===l.classId;})||{}).name:'';
    h+='<div class="activity-item"><div class="activity-icon">'+ico('activity','sm')+'</div><div class="activity-content"><div class="activity-msg">'+l.message+'</div><div class="activity-meta"><b>'+l.userName+'</b> · '+fmtDate(l.createdAt)+(cls?' · <span class="badge badge-gray">'+cls+'</span>':'')+' · <span class="badge badge-gray">'+l.type+'</span></div></div></div>';
  });
  h+='</div>';
  b.innerHTML=h;
};

/* ============================================================
   FITUR 4: Buat Sesi Absen — Jenis kegiatan manual / rekomendasi
   ============================================================ */
var JENIS_KEGIATAN_RAPAT=['Rapat Koordinasi','Rapat Evaluasi','Rapat Produksi','Rapat Persiapan','Rapat Pasca Produksi','Rapat Anggaran','Rapat Publikasi','Rapat Teknis'];
var JENIS_KEGIATAN_LATIHAN=['Latihan Rutin','Latihan Blocking','Latihan Dialog','Latihan Musik','Latihan Koreografi','Gladi Kotor','Gladi Bersih','Latihan Rias','Latihan Kostum','Sound Check','Lighting Check'];

window.openCreateMeetingModalFull=function(presetType){
  if(currentUser.type!=='guru'&&currentUser.type!=='admin'){
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
  var jenisRec=JENIS_KEGIATAN_RAPAT.concat(JENIS_KEGIATAN_LATIHAN);
  var dl=jenisRec.map(function(j){return '<option value="'+j+'">';}).join('');
  openModal('Buat Sesi Absensi',
    '<div class="form-group"><label>Judul Sesi</label><input id="mt-title" placeholder="Contoh: Latihan Rutin #1"></div>'+
    '<div class="form-group"><label>Kelas</label><select id="mt-class">'+opts+'</select></div>'+
    '<div class="form-group"><label>Jenis Kegiatan</label>'+
      '<input id="mt-type-custom" list="mt-jenis-list" placeholder="Ketik manual atau pilih dari rekomendasi">'+
      '<datalist id="mt-jenis-list">'+dl+'</datalist>'+
      '<small class="hint">Bisa diketik manual atau pilih dari daftar rekomendasi.</small>'+
    '</div>'+
    '<div class="form-group"><label>Kategori Sesi</label><select id="mt-type"><option value="rapat"'+(presetType==='rapat'?' selected':'')+'>Rapat</option><option value="latihan"'+(presetType==='latihan'?' selected':'')+'>Latihan</option><option value="gladi">Gladi Resik</option></select></div>'+
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
  var tyCustom=(document.getElementById('mt-type-custom').value||'').trim();
  var dt=document.getElementById('mt-date').value;
  var op=document.getElementById('mt-open').value;
  var cl=document.getElementById('mt-close').value;
  if(!ti){alert('Judul wajib!');return;}
  if(containsProfanity(ti)||containsProfanity(tyCustom)){alert('Judul mengandung kata tidak senonoh.');return;}
  var id=uid();
  var m={
    id:id,title:sanitizeText(ti),classId:cid,type:ty,jenis:sanitizeText(tyCustom)||ty,date:dt,
    openTime:op,closeTime:cl,
    records:{},createdAt:Date.now(),createdBy:currentUser.name,creatorRole:currentUser.role||currentUser.type
  };
  fb.collection('meetings').doc(id).set(sanitizeFirestore(m)).then(function(){
    closeModal();openMeetingList();logActivity('meeting_create',currentUser.name+' buat sesi: '+ti,{classId:cid});
    fbAddNotif({id:uid(),classId:cid,fromId:currentUser.studentId||'guru',fromName:currentUser.name,fromType:currentUser.type,fromRole:currentUser.role||'',toId:'all',type:'info',title:'Absensi Dibuka: '+ti,message:'Jenis: '+(tyCustom||ty)+'\nSilakan isi absensi pada '+dt+' pukul '+op+' - '+cl+'.',createdAt:Date.now(),readBy:[],doneBy:[]});
  });
};

/* ============================================================
   FITUR 5: LOG KOMUNIKASI — Filter per kelas / semua kelas
   ============================================================ */
window.openWaLogsGlobal=function(){
  var h='<div class="alert alert-info">'+ico('info')+'<div>Riwayat semua komunikasi (notifikasi & WA). Filter per kelas.</div></div>';
  if(currentUser.type==='guru'||currentUser.type==='admin'){
    var list=currentUser.type==='admin'?DB.classes:myClasses();
    h+='<div class="form-group"><label>Filter Kelas</label><select id="wa-filter-class" onchange="renderWaLogsBody()">'+
      '<option value="">-- Semua Kelas --</option>'+
      list.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('')+
    '</select></div>';
  }
  h+='<div class="action-row" style="margin-bottom:12px;">'+
    '<input id="wa-log-search" class="wa-search" placeholder="Cari..." oninput="renderWaLogsBody()" style="flex:1;">'+
    '<button class="btn btn-sm" onclick="exportWaLogs()">'+ico('download','sm')+' Export</button>'+
  '</div>';
  h+='<div id="wa-logs-body"></div>';
  openModal('Log Komunikasi',h);
  renderWaLogsBody();
};

window.renderWaLogsBody=function(){
  var b=document.getElementById('wa-logs-body');if(!b) return;
  var q=(document.getElementById('wa-log-search')&&document.getElementById('wa-log-search').value||'').toLowerCase();
  var filterCid=(document.getElementById('wa-filter-class')||{}).value||'';
  var logs=(DB.waLogs||[]).slice();

  /* Filter role */
  if(currentUser.type==='guru'){
    var myIds=myClasses().map(function(c){return c.id;});
    logs=logs.filter(function(l){return !l.classId||myIds.indexOf(l.classId)>=0;});
  }
  /* Filter kelas */
  if(filterCid){
    logs=logs.filter(function(l){return l.classId===filterCid;});
  }
  if(q){
    logs=logs.filter(function(l){
      return (l.toName||'').toLowerCase().indexOf(q)>=0||
             (l.fromName||'').toLowerCase().indexOf(q)>=0||
             (l.title||'').toLowerCase().indexOf(q)>=0||
             (l.message||'').toLowerCase().indexOf(q)>=0;
    });
  }
  if(logs.length===0){b.innerHTML='<div class="empty-state">'+ico('send','lg')+'<p>Belum ada log.</p></div>';return;}
  var h='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Total: '+logs.length+' entri</div>';
  logs.slice(0,200).forEach(function(l){
    var chB=l.channel==='both'?'<span class="badge badge-channel-both">App + WA</span>':(l.channel==='wa'?'<span class="badge badge-channel-wa">WA</span>':'<span class="badge badge-channel-app">App</span>');
    var tB=({tugas:'badge-info',instruksi:'badge-primary',info:'badge-success',urgent:'badge-danger',followup:'badge-warning',broadcast:'badge-primary'})[l.type]||'badge-gray';
    var cls=l.classId?(DB.classes.find(function(c){return c.id===l.classId;})||{}).name:'';
    h+='<div class="wa-log-item"><div class="wa-log-header"><span class="badge '+tB+'">'+l.type+'</span>'+chB+(cls?'<span class="badge badge-gray">'+cls+'</span>':'')+'<span class="wa-log-time">'+fmtDate(l.createdAt)+'</span></div><div class="wa-log-title">'+l.title+'</div><div class="wa-log-meta">Dari: <b>'+l.fromName+'</b> → Ke: <b>'+l.toName+'</b>'+(l.toPhone?' <span class="wa-log-phone">'+ico('phone','sm')+' '+l.toPhone+'</span>':'')+'</div><div class="wa-log-body">'+l.message+'</div></div>';
  });
  b.innerHTML=h;
};

/* ============================================================
   FITUR 7: REKAP NILAI — Pilih per tahap / gabungan / semua
   ============================================================ */
window.renderRecap=function(cid){
  if(!ownsClass(cid)){alert('Akses ditolak');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c) return;
  document.getElementById('header-title-text').innerHTML=ico('chart')+' Rekap — '+c.name;

  var h='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-sm" onclick="viewClass(\''+cid+'\')">'+ico('back')+' Kembali</button></div>';
  h+='<div class="alert alert-info">'+ico('info')+'<div>Pilih tahap yang ingin ditampilkan/diunduh. Bisa satu tahap, beberapa tahap (gabungan), atau semua tahap.</div></div>';

  /* Pilihan tahap */
  h+='<div class="card card-accent blue"><h3>'+ico('layers')+' Pilih Tahap</h3>';
  h+='<div class="action-row" style="margin-bottom:10px;">';
  h+='<button class="btn btn-sm" onclick="selectAllStages(true)">Pilih Semua</button>';
  h+='<button class="btn btn-sm" onclick="selectAllStages(false)">Kosongkan</button>';
  h+='</div>';
  h+='<div style="display:flex;flex-direction:column;gap:6px;">';
  DB.stages.forEach(function(s){
    var active=isStageActive(cid,s.id);
    h+='<label class="tpl-item" style="cursor:pointer;">'+
      '<input type="checkbox" class="recap-stage-cb" value="'+s.id+'" '+(active?'checked':'disabled')+'>'+
      '<span>'+s.name+' ('+s.weight+'%)'+(active?'':' <span class="badge badge-gray">Tidak aktif</span>')+'</span>'+
    '</label>';
  });
  h+='</div></div>';

  /* Tombol unduh */
  h+='<div class="action-row" style="margin:12px 0;">';
  h+='<button class="btn btn-primary" onclick="exportRecapFiltered(\''+cid+'\',\'xlsx\')">'+ico('download')+' Unduh XLSX</button>';
  h+='<button class="btn btn-success" onclick="exportRecapFiltered(\''+cid+'\',\'pdf\')">'+ico('download')+' Unduh PDF</button>';
  h+='<button class="btn" onclick="printRecapFiltered(\''+cid+'\')">'+ico('chart')+' Tampilkan Tabel</button>';
  h+='</div>';

  /* Preview tabel */
  h+='<div id="recap-table-wrap"></div>';
  document.getElementById('main-content').innerHTML=h;
  renderRecapTable(cid);
  updateNotifBadge();
};

window.selectAllStages=function(checked){
  document.querySelectorAll('.recap-stage-cb:not(:disabled)').forEach(function(cb){cb.checked=checked;});
  var cid=(currentUser&&currentUser.type==='guru')?document.querySelector('#main-content [onclick*="viewClass"]'):null;
  /* Ambil cid dari konteks — cari tombol export yang punya cid */
  var btn=document.querySelector('#main-content [onclick*="exportRecapFiltered"]');
  if(btn){
    var m=btn.getAttribute('onclick').match(/exportRecapFiltered\('([^']+)'/);
    if(m){renderRecapTable(m[1]);}
  }
};

function getSelectedStages(cid){
  var cbs=document.querySelectorAll('.recap-stage-cb:checked');
  var ids=[];
  cbs.forEach(function(cb){ids.push(cb.value);});
  return ids;
}

window.renderRecapTable=function(cid){
  var wrap=document.getElementById('recap-table-wrap');if(!wrap) return;
  var c=DB.classes.find(function(x){return x.id===cid;});
  var selected=getSelectedStages(cid);
  if(selected.length===0){wrap.innerHTML='<div class="alert alert-warning">'+ico('warning')+'<div>Pilih minimal 1 tahap.</div></div>';return;}

  var h='<div class="table-wrap"><table><thead><tr><th>No</th><th>Nama</th><th>Peran</th>';
  DB.stages.forEach(function(s){if(selected.indexOf(s.id)>=0)h+='<th>'+s.name+'<br><small>('+s.weight+'%)</small></th>';});
  h+='<th>Nilai Akhir*</th></tr></thead><tbody>';
  c.students.forEach(function(t,i){
    h+='<tr><td>'+(i+1)+'</td><td><b>'+t.name+'</b></td><td><span class="badge '+((ROLES[t.role]||{}).team==='produksi'?'badge-info':'badge-warning')+'">'+((ROLES[t.role]||{}).label||t.role)+'</span></td>';
    DB.stages.forEach(function(s){
      if(selected.indexOf(s.id)<0) return;
      var sc=calcStageScore(cid,t.id,s.id);
      var color=sc>=3.5?'badge-success':sc>=2.5?'badge-info':sc>=1.5?'badge-warning':'badge-danger';
      h+='<td><span class="badge '+color+'">'+sc.toFixed(2)+'</span></td>';
    });
    var f=calcFinalScore(cid,t.id);
    h+='<td><b style="color:var(--primary);">'+f.toFixed(2)+'</b></td></tr>';
  });
  h+='</tbody></table></div>';
  h+='<p style="font-size:11.5px;color:var(--text-muted);margin-top:8px;">*Nilai akhir dihitung dari seluruh tahap aktif.</p>';
  wrap.innerHTML=h;
};

window.exportRecapFiltered=function(cid,format){
  var c=DB.classes.find(function(x){return x.id===cid;});
  var selected=getSelectedStages(cid);
  if(selected.length===0){alert('Pilih minimal 1 tahap.');return;}

  if(format==='xlsx'){
    var header=['No','Nama','Email','Peran'];
    DB.stages.forEach(function(s){if(selected.indexOf(s.id)>=0)header.push(s.name+' ('+s.weight+'%)');});
    header.push('Nilai Akhir');
    var rows=[header];
    c.students.forEach(function(t,i){
      var r=[i+1,t.name,t.email||'-',((ROLES[t.role]||{}).label||t.role)];
      DB.stages.forEach(function(s){if(selected.indexOf(s.id)>=0)r.push(calcStageScore(cid,t.id,s.id).toFixed(2));});
      r.push(calcFinalScore(cid,t.id).toFixed(2));
      rows.push(r);
    });
    var ws=XLSX.utils.aoa_to_sheet(rows);
    ws['!cols']=header.map(function(){return {wch:18};});
    var wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Rekap');
    XLSX.writeFile(wb,'Rekap_'+c.name+'_'+selected.length+'tahap.xlsx');
    logActivity('export',currentUser.name+' unduh rekap XLSX '+selected.length+' tahap',{classId:cid});
  } else if(format==='pdf'){
    var html='<html><head><meta charset="utf-8"><title>Rekap Nilai</title>';
    html+='<style>body{font-family:Arial;padding:20px;} h1{color:#2563eb;} table{width:100%;border-collapse:collapse;font-size:11px;} th,td{border:1px solid #999;padding:5px;text-align:left;} th{background:#eff6ff;}</style></head><body>';
    html+='<h1>Rekap Nilai — '+c.name+'</h1>';
    html+='<p>'+new Date().toLocaleString('id-ID')+' · Guru: '+currentUser.name+'</p>';
    html+='<table><tr><th>No</th><th>Nama</th><th>Peran</th>';
    DB.stages.forEach(function(s){if(selected.indexOf(s.id)>=0)html+='<th>'+s.name+'</th>';});
    html+='<th>Nilai Akhir</th></tr>';
    c.students.forEach(function(t,i){
      html+='<tr><td>'+(i+1)+'</td><td>'+t.name+'</td><td>'+((ROLES[t.role]||{}).label||t.role)+'</td>';
      DB.stages.forEach(function(s){if(selected.indexOf(s.id)>=0)html+='<td>'+calcStageScore(cid,t.id,s.id).toFixed(2)+'</td>';});
      html+='<td><b>'+calcFinalScore(cid,t.id).toFixed(2)+'</b></td></tr>';
    });
    html+='</table></body></html>';
    var w=window.open('','_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(function(){w.print();},400);
    logActivity('export',currentUser.name+' unduh rekap PDF '+selected.length+' tahap',{classId:cid});
  }
};

window.printRecapFiltered=function(cid){
  renderRecapTable(cid);
  var wrap=document.getElementById('recap-table-wrap');
  if(wrap) wrap.scrollIntoView({behavior:'smooth'});
};

/* ============================================================
   FITUR 8: GURU — Pengaturan Akun
   ============================================================ */
window.openGuruProfile=function(){
  if(!currentUser||currentUser.type!=='guru'){alert('Hanya guru.');return;}
  var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===currentUser.email.toLowerCase();});
  if(!t){alert('Data guru tidak ditemukan');return;}
  openModal('Pengaturan Akun',
    '<div class="alert alert-info">'+ico('info')+'<div>Perbarui profil Anda. Email tidak dapat diubah (hubungi admin).</div></div>'+
    '<div class="form-group"><label>Nama Lengkap</label><input id="gp-name" value="'+String(t.name).replace(/"/g,'&quot;')+'"></div>'+
    '<div class="form-group"><label>Email (tidak dapat diubah)</label><input value="'+t.email+'" disabled></div>'+
    '<div class="form-group"><label>No. WhatsApp</label><input type="tel" id="gp-phone" value="'+(t.phone||'')+'" placeholder="08123456789"><small class="hint">Digunakan siswa untuk aduan & komunikasi.</small></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveGuruProfile()">'+ico('save')+' Simpan Perubahan</button>'+
    '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">'+
      '<h4 style="font-size:13px;margin-bottom:8px;">Ubah Password</h4>'+
      '<div class="form-group pw-toggle"><label>Password Lama</label><input type="password" id="gp-old"><button class="toggle-btn" onclick="togglePw(\'gp-old\',this)" type="button">👁</button></div>'+
      '<div class="form-group pw-toggle"><label>Password Baru</label><input type="password" id="gp-new"><button class="toggle-btn" onclick="togglePw(\'gp-new\',this)" type="button">👁</button></div>'+
      '<div class="form-group pw-toggle"><label>Konfirmasi Password Baru</label><input type="password" id="gp-confirm"><button class="toggle-btn" onclick="togglePw(\'gp-confirm\',this)" type="button">👁</button></div>'+
      '<button class="btn btn-warning btn-block" onclick="saveGuruPassword()">'+ico('key')+' Ubah Password</button>'+
    '</div>'
  );
};

window.saveGuruProfile=function(){
  var n=(document.getElementById('gp-name').value||'').trim();
  var ph=(document.getElementById('gp-phone').value||'').replace(/\D/g,'');
  if(!n){alert('Nama wajib');return;}
  if(ph&&(ph.length<10||ph.length>15)){alert('No. WA tidak valid (10-15 digit)');return;}
  var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===currentUser.email.toLowerCase();});
  if(!t){alert('Data tidak ditemukan');return;}
  fbSetTeacher(Object.assign({},t,{name:n,phone:ph}));
  currentUser.name=n;
  if(window.saveSession) saveSession();
  closeModal();
  alert('✅ Profil diperbarui!');
  if(typeof renderGuruDashboard==='function') renderGuruDashboard();
};

window.saveGuruPassword=function(){
  var o=document.getElementById('gp-old').value;
  var n=document.getElementById('gp-new').value;
  var cf=document.getElementById('gp-confirm').value;
  if(!o||!n||!cf){alert('Lengkapi');return;}
  if(n.length<6){alert('Min 6 karakter');return;}
  if(n!==cf){alert('Konfirmasi tidak cocok');return;}
  var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===currentUser.email.toLowerCase();});
  if(!t||t.password!==o){alert('Password lama salah');return;}
  fbSetTeacher(Object.assign({},t,{password:n}));
  closeModal();
  alert('✅ Password diubah!');
};

/* Tambahkan tombol di dashboard guru */
var _origGuruDash=window.renderGuruDashboard;
if(typeof _origGuruDash==='function'){
  window.renderGuruDashboard=function(){
    _origGuruDash();
    var mc=document.getElementById('main-content');
    if(!mc) return;
    /* Tambah tombol di action-row pertama */
    var ar=mc.querySelector('.action-row');
    if(ar&&!ar.querySelector('.btn-profile')){
      var b=document.createElement('button');
      b.className='btn btn-profile';
      b.innerHTML=ico('user')+' Profil Saya';
      b.onclick=function(){openGuruProfile();};
      ar.appendChild(b);
    }
    /* Cek apakah guru sudah punya No. WA */
    var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===currentUser.email.toLowerCase();});
    if(t&&!t.phone){
      mc.insertAdjacentHTML('afterbegin','<div class="alert alert-danger">'+ico('warning')+'<div><b>PENTING:</b> Anda belum mengisi <b>No. WhatsApp</b>. Siswa tidak dapat mengirim aduan. <button class="link" onclick="openGuruProfile()">Isi sekarang →</button></div></div>');
    }
  };
}

/* ============================================================
   FITUR 9: SUTRADARA — Unggah Naskah
   ============================================================ */
window.openNaskahModal=function(){
  if(!currentUser||currentUser.type!=='siswa'){alert('Hanya siswa.');return;}
  var cid=currentUser.classId;
  var docRef=fb.collection('scripts').doc(cid);
  docRef.get().then(function(snap){
    var data=snap.exists?snap.data():null;
    renderNaskahModal(cid,data);
  }).catch(function(e){
    console.error(e);
    renderNaskahModal(cid,null);
  });
};

function renderNaskahModal(cid,data){
  var canEdit=(currentUser.role==='sutradara');
  var h='<div class="alert alert-info">'+ico('book')+'<div><b>Naskah Pertunjukan</b><br>Naskah diunggah oleh Sutradara. Semua anggota kelas dapat membaca & mengunduhnya.</div></div>';
  if(!data){
    h+='<div class="empty-state">'+ico('book','lg')+'<p>Belum ada naskah yang diunggah.'+(canEdit?'<br>Klik tombol di bawah untuk mengunggah.':'')+'</p></div>';
    if(canEdit) h+='<button class="btn btn-primary btn-block" onclick="openUploadNaskah()">'+ico('upload')+' Unggah Naskah</button>';
  } else {
    h+='<div class="card card-accent blue">';
    h+='<h3>'+ico('book')+' '+data.title+'</h3>';
    h+='<p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Diunggah: '+fmtDate(data.uploadedAt)+' · oleh '+data.uploadedBy+'</p>';
    h+='<div style="max-height:340px;overflow-y:auto;background:var(--surface);padding:12px;border-radius:8px;font-family:monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;word-break:break-word;">'+String(data.content).replace(/</g,'&lt;')+'</div>';
    h+='<div class="action-row" style="margin-top:12px;">';
    h+='<button class="btn btn-success btn-sm" onclick="downloadNaskah(\''+cid+'\')">'+ico('download','sm')+' Unduh Naskah</button>';
    if(canEdit){
      h+='<button class="btn btn-sm" onclick="openUploadNaskah(true)">'+ico('edit','sm')+' Ganti Naskah</button>';
      h+='<button class="btn btn-sm btn-danger" onclick="deleteNaskah(\''+cid+'\')">'+ico('trash','sm')+' Hapus</button>';
    }
    h+='</div></div>';
  }
  openModal('Naskah Pertunjukan',h);
}

window.openUploadNaskah=function(isEdit){
  if(currentUser.role!=='sutradara'){alert('Hanya Sutradara yang dapat mengunggah naskah.');return;}
  openModal((isEdit?'Ganti':'Unggah')+' Naskah',
    '<div class="alert alert-info">'+ico('info')+'<div>Anda dapat <b>paste teks naskah</b> langsung, atau <b>unggah file .txt</b>.</div></div>'+
    '<div class="form-group"><label>Judul Naskah</label><input id="nk-title" placeholder="Contoh: Naskah Teater Malin Kundang"></div>'+
    '<div class="form-group"><label>Isi Naskah (paste teks)</label><textarea id="nk-content" rows="12" placeholder="Paste naskah lengkap di sini..."></textarea></div>'+
    '<div class="form-group"><label>Atau Unggah File .txt</label><input type="file" id="nk-file" accept=".txt" onchange="loadNaskahFile(this)"></div>'+
    '<button class="btn btn-primary btn-block" onclick="saveNaskah()">'+ico('save')+' Simpan Naskah</button>'
  );
};

window.loadNaskahFile=function(input){
  var f=input.files[0];if(!f) return;
  var r=new FileReader();
  r.onload=function(e){
    var ta=document.getElementById('nk-content');
    if(ta) ta.value=e.target.result;
    var ti=document.getElementById('nk-title');
    if(ti && !ti.value) ti.value=f.name.replace(/\.txt$/i,'');
  };
  r.readAsText(f);
};

window.saveNaskah=function(){
  var ti=(document.getElementById('nk-title').value||'').trim();
  var ct=(document.getElementById('nk-content').value||'').trim();
  if(!ti||!ct){alert('Judul & isi naskah wajib diisi');return;}
  if(containsProfanity(ti)){alert('Judul mengandung kata tidak senonoh.');return;}
  var cid=currentUser.classId;
  var data={
    classId:cid,
    title:sanitizeText(ti),
    content:ct,
    uploadedBy:currentUser.name,
    uploadedAt:Date.now(),
    uploadedRole:currentUser.role
  };
  fb.collection('scripts').doc(cid).set(sanitizeFirestore(data)).then(function(){
    closeModal();
    alert('✅ Naskah berhasil diunggah!');
    logActivity('naskah',currentUser.name+' unggah naskah: '+ti,{classId:cid,role:currentUser.role});
    /* Notif ke kelas */
    fbAddNotif({
      id:uid(),classId:cid,fromId:currentUser.studentId,fromName:currentUser.name,fromType:'siswa',fromRole:currentUser.role,
      toId:'all',type:'info',title:'Naskah Baru: '+ti,message:'Sutradara telah mengunggah naskah. Silakan baca & unduh dari menu Naskah.',createdAt:Date.now(),readBy:[],doneBy:[]
    });
  }).catch(function(e){alert('Gagal: '+e.message);});
};

window.downloadNaskah=function(cid){
  fb.collection('scripts').doc(cid).get().then(function(snap){
    if(!snap.exists){alert('Naskah tidak ditemukan');return;}
    var d=snap.data();
    var txt='NASKAH: '+d.title+'\n'+
      'Diunggah: '+new Date(d.uploadedAt).toLocaleString('id-ID')+'\n'+
      'Oleh: '+d.uploadedBy+'\n'+
      '===========================================\n\n'+
      d.content;
    var blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;
    a.download=d.title.replace(/[^\w\s-]/g,'')+'.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
};

window.deleteNaskah=function(cid){
  if(currentUser.role!=='sutradara'){alert('Hanya Sutradara');return;}
  if(!confirm('Hapus naskah ini?')) return;
  fb.collection('scripts').doc(cid).delete().then(function(){closeModal();alert('✅ Naskah dihapus');});
};

/* Tombol Naskah di dashboard siswa */
var _origSiswaF2=window.renderSiswaDashboard;
if(typeof _origSiswaF2==='function'){
  window.renderSiswaDashboard=function(){
    _origSiswaF2();
    var mc=document.getElementById('main-content');
    if(!mc||!currentUser||currentUser.type!=='siswa') return;
    /* Tambahkan tombol Naskah ke toolbar extras (paling atas) */
    var tb=mc.querySelector('.extras-toolbar');
    if(tb&&!tb.querySelector('.btn-naskah')){
      var b=document.createElement('button');
      b.className='btn btn-naskah';
      b.innerHTML=ico('book')+' Naskah'+(currentUser.role==='sutradara'?' (Kelola)':'');
      b.onclick=function(){openNaskahModal();};
      tb.appendChild(b);
    }
    /* Tombol untuk guru juga */
  };
}

/* Tambahkan tombol Naskah untuk guru di viewClass */
var _origViewClassF2=window.viewClass;
if(typeof _origViewClassF2==='function'){
  window.viewClass=function(cid){
    _origViewClassF2(cid);
    var mc=document.getElementById('main-content');
    if(!mc) return;
    var ar=mc.querySelector('.action-row');
    if(ar&&!ar.querySelector('.btn-naskah')){
      var b=document.createElement('button');
      b.className='btn btn-sm btn-naskah';
      b.innerHTML=ico('book')+' Naskah';
      b.onclick=function(){
        fb.collection('scripts').doc(cid).get().then(function(snap){
          var data=snap.exists?snap.data():null;
          renderNaskahModalReadOnly(cid,data);
        });
      };
      ar.appendChild(b);
    }
  };
}

function renderNaskahModalReadOnly(cid,data){
  var h='<div class="alert alert-info">'+ico('book')+'<div>Naskah yang diunggah Sutradara untuk kelas ini.</div></div>';
  if(!data){h+='<div class="empty-state">'+ico('book','lg')+'<p>Belum ada naskah dari Sutradara.</p></div>';}
  else{
    h+='<div class="card card-accent blue"><h3>'+ico('book')+' '+data.title+'</h3>';
    h+='<p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Diunggah: '+fmtDate(data.uploadedAt)+' · oleh '+data.uploadedBy+'</p>';
    h+='<div style="max-height:340px;overflow-y:auto;background:var(--surface);padding:12px;border-radius:8px;font-family:monospace;font-size:12.5px;line-height:1.7;white-space:pre-wrap;">'+String(data.content).replace(/</g,'&lt;')+'</div>';
    h+='<div class="action-row" style="margin-top:12px;"><button class="btn btn-success btn-sm" onclick="downloadNaskah(\''+cid+'\')">'+ico('download','sm')+' Unduh Naskah</button></div></div>';
  }
  openModal('Naskah Pertunjukan',h);
}

console.log('[features2] 9 fitur tambahan v2 siap');

})();
