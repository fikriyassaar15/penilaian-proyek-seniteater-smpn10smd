/* ============================================================
   SP-PPT EXTRAS — Checklist Hybrid + WA Logs + Broadcast
   Load SETELAH app.js
   ============================================================ */
(function(){
'use strict';
function ready(fn){if(document.readyState!=='loading'){setTimeout(fn,400);}else{document.addEventListener('DOMContentLoaded',function(){setTimeout(fn,400);});}}
ready(function(){if(typeof firebaseReady==='undefined'){console.warn('extras.js: app.js belum siap');return;}initExtras();});

function initExtras(){
  console.log('Extras.js loading...');

  /* ===== CHECKLIST DEFAULTS ===== */
  window.DEFAULT_CHECKLIST_PERSONAL = {
    pimpinan_produksi:['Rekap laporan semua divisi','Pimpin rapat produksi mingguan','Evaluasi kinerja divisi','Laporkan progres ke guru pengampu'],
    sekretaris:['Buat notulen setiap rapat','Arsipkan semua dokumen produksi','Buat jadwal latihan & distribusi','Kelola absensi rapat'],
    bendahara:['Catat semua pengeluaran dengan nota','Buat RAB awal','Laporkan keuangan mingguan','Rekap pengeluaran akhir'],
    sutradara:['Finalisasi naskah','Casting pemain','Blocking setiap adegan','Latihan gabungan penuh','Pimpin latihan rutin','Kelola absensi latihan'],
    asisten_sutradara:['Susun jadwal latihan detail','Catat arahan sutradara','Backup blocking pemain','Gantikan sutradara jika berhalangan']
  };

  window.DEFAULT_CHECKLIST_GROUP = {
    koor_publikasi:{label:'Divisi Publikasi & Dokumentasi',members:['koor_publikasi','anggota_publikasi'],items:['Desain poster pertunjukan','Publikasi di media sosial','Dokumentasi setiap latihan','Cetak tiket/program acara']},
    koor_perlengkapan:{label:'Divisi Perlengkapan & Peralatan',members:['koor_perlengkapan','anggota_perlengkapan'],items:['List kebutuhan perlengkapan','Cek stok yang ada','Koordinasi sewa/pembelian','Cek kesiapan alat sebelum tampil']},
    koor_akomodasi:{label:'Divisi Akomodasi & Transportasi',members:['koor_akomodasi','anggota_akomodasi'],items:['Urus transportasi tim','Urus konsumsi latihan & hari-H','Urus penginapan (jika perlu)','Koordinasi tamu undangan']},
    koor_panggung:{label:'Divisi Tata Pentas/Panggung',members:['koor_panggung','anggota_panggung'],items:['Desain set panggung','Bangun properti','Setting panggung hari-H','Bongkar properti pasca tampil']},
    koor_musik:{label:'Divisi Musik & Suara',members:['koor_musik','anggota_musik'],items:['Pilih musik pengiring','Latihan musik dengan pemain','Sound check final','Cek miking saat tampil']},
    koor_busana:{label:'Divisi Busana & Kostum',members:['koor_busana','anggota_busana'],items:['Desain kostum per karakter','Jahit/beli kostum','Fitting semua pemain','Perawatan kostum pasca tampil']},
    koor_rias:{label:'Divisi Rias',members:['koor_rias','anggota_rias'],items:['Desain rias per karakter','Trial makeup','Rias hari-H','Touch-up saat pertunjukan']},
    koor_cahaya:{label:'Divisi Cahaya',members:['koor_cahaya','anggota_cahaya'],items:['Desain lighting per adegan','Setup lampu','Cue lighting saat pertunjukan','Bongkar lighting']}
  };

  if(typeof window.DIVISIONS === 'undefined'){
    window.DIVISIONS = {
      produksi:{label:'Tim Produksi',roles:['pimpinan_produksi','sekretaris','bendahara','koor_publikasi','koor_perlengkapan','koor_akomodasi','anggota_publikasi','anggota_perlengkapan','anggota_akomodasi']},
      artistik:{label:'Tim Artistik',roles:['sutradara','asisten_sutradara','pemain','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya','anggota_panggung','anggota_musik','anggota_busana','anggota_rias','anggota_cahaya']}
    };
    window.getDivisionOfRole = function(role){for(var d in DIVISIONS){if(DIVISIONS[d].roles.indexOf(role)>=0)return d;}return 'produksi';};
  }

  window.getChecklist = function(cid){return DB.checklists&&DB.checklists[cid]?DB.checklists[cid]:{items:[]};};
  window.saveChecklist = function(cid,items){if(!firebaseReady)return Promise.resolve();return fb.collection('checklists').doc(cid).set({classId:cid,items:items});};

  /* ===== HOOK VIEW CLASS ===== */
  var _origViewClass=window.viewClass;
  window.viewClass=function(cid){
    _origViewClass(cid);
    var mc=document.getElementById('main-content');
    if(!mc)return;
    mc.insertAdjacentHTML('afterbegin','<div class="extras-toolbar"><button class="btn btn-primary" onclick="openChecklistManage(\''+cid+'\')">'+ico('checkSquare')+' Kelola Checklist</button><button class="btn" onclick="openWaLogs(\''+cid+'\')">'+ico('messageCircle')+' Log Komunikasi</button></div>');
  };

  /* ===== MANAGE CHECKLIST (GURU) ===== */
  window.seedDefaultChecklist=function(cid){
    if(!confirm('Isi otomatis dengan checklist standar?'))return;
    var items=[];
    Object.keys(DEFAULT_CHECKLIST_PERSONAL).forEach(function(role){
      DEFAULT_CHECKLIST_PERSONAL[role].forEach(function(name){
        items.push({id:uid(),name:name,scopeType:'personal',scopeRole:role,members:[role],editors:[role],deadline:null,done:false,doneBy:null,doneAt:null,createdAt:Date.now(),createdBy:currentUser.name});
      });
    });
    Object.keys(DEFAULT_CHECKLIST_GROUP).forEach(function(koorRole){
      var grp=DEFAULT_CHECKLIST_GROUP[koorRole];
      grp.items.forEach(function(name){
        items.push({id:uid(),name:name,scopeType:'group',scopeRole:koorRole,members:grp.members,editors:grp.members,label:grp.label,deadline:null,done:false,doneBy:null,doneAt:null,createdAt:Date.now(),createdBy:currentUser.name});
      });
    });
    saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);logActivity('checklist_seed',currentUser.name+' mengisi '+items.length+' item',{classId:cid});});
  };

  window.openChecklistManage=function(cid){
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var ch=getChecklist(cid);var items=ch.items||[];
    var h='<div class="alert alert-info">'+ico('info')+'<div>Item <b>personal</b> untuk Pimpinan/Sekretaris/Bendahara/Sutradara/Asisten. Item <b>grup</b> untuk koordinator+anggota.</div></div>';
    h+='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-primary btn-sm" onclick="openAddChecklistItem(\''+cid+'\')">'+ico('plus','sm')+' Tambah Item</button><button class="btn btn-sm" onclick="seedDefaultChecklist(\''+cid+'\')">'+ico('star','sm')+' Auto-isi Default</button><button class="btn btn-sm btn-danger" onclick="clearChecklist(\''+cid+'\')">'+ico('trash','sm')+' Hapus Semua</button></div>';
    if(items.length===0){h+='<div class="empty-state">'+ico('book','lg')+'<p>Belum ada item.</p></div>';}
    else{
      var personal=items.filter(function(x){return x.scopeType==='personal';});
      var groups=items.filter(function(x){return x.scopeType==='group';});
      var umum=items.filter(function(x){return !x.scopeType||x.scopeType==='umum';});
      if(personal.length>0){h+='<h3 style="color:var(--text-strong);margin:16px 0 10px;font-size:14px;">'+ico('user')+' Personal ('+personal.length+')</h3>';personal.forEach(function(it){h+=renderManageItem(cid,it);});}
      if(groups.length>0){h+='<h3 style="color:var(--text-strong);margin:16px 0 10px;font-size:14px;">'+ico('users')+' Grup Divisi ('+groups.length+')</h3>';groups.forEach(function(it){h+=renderManageItem(cid,it);});}
      if(umum.length>0){h+='<h3 style="color:var(--text-strong);margin:16px 0 10px;font-size:14px;">'+ico('list')+' Umum ('+umum.length+')</h3>';umum.forEach(function(it){h+=renderManageItem(cid,it);});}
    }
    openModal(ico('checkSquare')+' Kelola Checklist — '+c.name,h);
  };
  function renderManageItem(cid,it){
    var scopeLabel='';
    if(it.scopeType==='personal')scopeLabel='Personal: '+(ROLES[it.scopeRole]?ROLES[it.scopeRole].label:it.scopeRole);
    else if(it.scopeType==='group'&&DEFAULT_CHECKLIST_GROUP[it.scopeRole])scopeLabel='Grup: '+DEFAULT_CHECKLIST_GROUP[it.scopeRole].label;
    else scopeLabel='Umum';
    return '<div class="checklist-item '+(it.done?'done':'')+'"><span style="font-weight:800;color:'+(it.done?'var(--success)':'var(--text-muted)')+';">'+(it.done?ico('check','sm'):ico('target','sm'))+'</span><div class="checklist-item-text"><div><b style="font-size:11px;color:var(--primary);">'+scopeLabel+'</b></div>'+it.name+(it.doneBy?'<div class="checklist-item-meta success">Selesai: '+it.doneBy+'</div>':'')+'</div><button class="btn btn-sm" onclick="editChecklistItem(\''+cid+'\',\''+it.id+'\')">'+ico('edit','sm')+'</button><button class="btn btn-sm btn-danger" onclick="delChecklistItem(\''+cid+'\',\''+it.id+'\')">'+ico('trash','sm')+'</button></div>';
  }
  window.openAddChecklistItem=function(cid){
    var scopeOpts='<option value="personal:pimpinan_produksi">Personal: Pimpinan Produksi</option><option value="personal:sekretaris">Personal: Sekretaris</option><option value="personal:bendahara">Personal: Bendahara</option><option value="personal:sutradara">Personal: Sutradara</option><option value="personal:asisten_sutradara">Personal: Asisten Sutradara</option>';
    Object.keys(DEFAULT_CHECKLIST_GROUP).forEach(function(k){scopeOpts+='<option value="group:'+k+'">Grup: '+DEFAULT_CHECKLIST_GROUP[k].label+'</option>';});
    scopeOpts+='<option value="umum">Umum (semua)</option>';
    openModal('Tambah Item Checklist','<div class="form-group"><label>Nama Item</label><input id="cl-name"></div><div class="form-group"><label>Scope</label><select id="cl-scope">'+scopeOpts+'</select></div><div class="form-group"><label>Deadline</label><input type="date" id="cl-date"></div><button class="btn btn-primary btn-block" onclick="addChecklistItem(\''+cid+'\')">'+ico('save')+' Simpan</button>');
  };
  window.addChecklistItem=function(cid){
    var n=document.getElementById('cl-name').value.trim();
    var s=document.getElementById('cl-scope').value;
    var d=document.getElementById('cl-date').value;
    if(!n){alert('Nama wajib!');return;}
    var item={id:uid(),name:n,deadline:d||null,done:false,doneBy:null,doneAt:null,createdAt:Date.now(),createdBy:currentUser.name};
    if(s.indexOf('personal:')===0){item.scopeType='personal';item.scopeRole=s.replace('personal:','');item.members=[item.scopeRole];item.editors=[item.scopeRole];}
    else if(s.indexOf('group:')===0){var k=s.replace('group:','');item.scopeType='group';item.scopeRole=k;item.members=DEFAULT_CHECKLIST_GROUP[k].members;item.editors=DEFAULT_CHECKLIST_GROUP[k].members;item.label=DEFAULT_CHECKLIST_GROUP[k].label;}
    else{item.scopeType='umum';item.members=['*'];item.editors=['*'];}
    var ch=getChecklist(cid);var items=ch.items||[];items.push(item);
    saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);logActivity('checklist_item_add',currentUser.name+' tambah: '+n,{classId:cid});});
  };
  window.editChecklistItem=function(cid,itemId){
    var ch=getChecklist(cid);var it=(ch.items||[]).find(function(x){return x.id===itemId;});if(!it)return;
    openModal('Edit Item','<div class="form-group"><label>Nama</label><input id="cl-name" value="'+it.name.replace(/"/g,'&quot;')+'"></div><div class="form-group"><label>Deadline</label><input type="date" id="cl-date" value="'+(it.deadline||'')+'"></div><button class="btn btn-primary btn-block" onclick="updateChecklistItem(\''+cid+'\',\''+itemId+'\')">'+ico('save')+' Simpan</button>');
  };
  window.updateChecklistItem=function(cid,itemId){
    var n=document.getElementById('cl-name').value.trim();var d=document.getElementById('cl-date').value;
    if(!n){alert('Nama wajib!');return;}
    var ch=getChecklist(cid);var items=(ch.items||[]).map(function(it){if(it.id!==itemId)return it;return Object.assign({},it,{name:n,deadline:d||null});});
    saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);});
  };
  window.delChecklistItem=function(cid,itemId){if(!confirm('Hapus item ini?'))return;var ch=getChecklist(cid);var items=(ch.items||[]).filter(function(x){return x.id!==itemId;});saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);});};
  window.clearChecklist=function(cid){if(!confirm('Hapus SEMUA item checklist?'))return;saveChecklist(cid,[]).then(function(){closeModal();openChecklistManage(cid);});};

  /* ===== VIEW CHECKLIST (SISWA) ===== */
  window.openChecklistView=function(cid){
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var ch=getChecklist(cid);var items=ch.items||[];
    var total=items.length,done=items.filter(function(x){return x.done;}).length;
    var pct=total>0?Math.round(done/total*100):0;
    var h='<div class="progress-banner"><h3>'+ico('chart')+' Progres Tim — '+c.name+'</h3><div class="big-count">'+done+' / '+total+'</div><div class="pct">'+pct+'% tim</div><div class="progress-container" style="margin-top:12px;"><div class="progress-bar '+(pct===100?'complete':(pct>0?'partial':''))+'" style="width:'+pct+'%;"></div></div></div>';
    h+='<div class="alert alert-info">'+ico('info')+'<div>Semua bisa lihat. <b>Hijau</b> = bisa centang. <b>Abu</b> = hanya lihat.</div></div>';
    if(items.length===0){h+='<div class="empty-state">'+ico('book','lg')+'<p>Belum ada checklist dari guru.</p></div>';}
    else{
      ['pimpinan_produksi','sekretaris','bendahara','sutradara','asisten_sutradara'].forEach(function(role){
        var roleItems=items.filter(function(x){return x.scopeType==='personal'&&x.scopeRole===role;});
        if(roleItems.length===0)return;
        var rDone=roleItems.filter(function(x){return x.done;}).length;var rPct=Math.round(rDone/roleItems.length*100);
        var canEdit=(currentUser.role===role)||(currentUser.role==='pimpinan_produksi')||(currentUser.type==='guru');
        h+='<div class="checklist-division" style="border-left-color:'+(canEdit?'var(--success)':'var(--border-strong)')+';">';
        h+='<div class="checklist-division-header"><div class="checklist-division-title">'+(ROLES[role]?ROLES[role].label:role)+'</div><span class="checklist-progress-badge '+(rPct===100?'done':rPct>0?'partial':'')+'">'+rDone+'/'+roleItems.length+'</span></div>';
        roleItems.forEach(function(it){h+=renderViewItem(cid,it,canEdit);});
        h+='</div>';
      });
      Object.keys(DEFAULT_CHECKLIST_GROUP).forEach(function(koorRole){
        var roleItems=items.filter(function(x){return x.scopeType==='group'&&x.scopeRole===koorRole;});
        if(roleItems.length===0)return;
        var rDone=roleItems.filter(function(x){return x.done;}).length;var rPct=Math.round(rDone/roleItems.length*100);
        var grp=DEFAULT_CHECKLIST_GROUP[koorRole];
        var canEdit=(grp.members.indexOf(currentUser.role)>=0)||(currentUser.role==='pimpinan_produksi')||(currentUser.type==='guru');
        h+='<div class="checklist-division" style="border-left-color:'+(canEdit?'var(--success)':'var(--border-strong)')+';">';
        h+='<div class="checklist-division-header"><div class="checklist-division-title">'+grp.label+'</div><span class="checklist-progress-badge '+(rPct===100?'done':rPct>0?'partial':'')+'">'+rDone+'/'+roleItems.length+'</span></div>';
        roleItems.forEach(function(it){h+=renderViewItem(cid,it,canEdit);});
        h+='</div>';
      });
    }
    openModal(ico('checkSquare')+' Checklist Tim',h);
  };
  function renderViewItem(cid,it,canEdit){
    var cb='<input type="checkbox" '+(it.done?'checked':'')+' '+(canEdit?'':'disabled')+' onchange="toggleChecklistItem(\''+cid+'\',\''+it.id+'\',this.checked)">';
    return '<div class="checklist-item '+(it.done?'done':'')+'">'+cb+'<div class="checklist-item-text">'+it.name+(it.deadline?'<div class="checklist-item-meta deadline">'+ico('clock','sm')+' '+fmtDateShort(it.deadline)+'</div>':'')+(it.done&&it.doneBy?'<div class="checklist-item-meta success">'+ico('check','sm')+' '+it.doneBy+'</div>':'')+'</div></div>';
  }
  window.toggleChecklistItem=function(cid,itemId,checked){
    var ch=getChecklist(cid);var items=(ch.items||[]).map(function(it){if(it.id!==itemId)return it;return Object.assign({},it,{done:checked,doneBy:checked?currentUser.name:null,doneAt:checked?Date.now():null});});
    saveChecklist(cid,items).then(function(){
      var itemName=(ch.items.find(function(x){return x.id===itemId;})||{}).name||'';
      logActivity('checklist_update',currentUser.name+' '+(checked?'mencentang':'batal')+' "'+itemName+'"',{classId:cid,division:getDivisionOfRole(currentUser.role),role:currentUser.role});
      openChecklistView(cid);
    });
  };

  /* ===== WA LOGS ===== */
  window.openWaLogs=function(cid){
    var h='<div id="wa-logs-view"><div class="alert alert-info">'+ico('info')+'<div>Riwayat komunikasi (notifikasi & WA).</div></div><div class="action-row" style="margin-bottom:12px;"><input id="wa-log-search" class="wa-search" placeholder="Cari nama / pesan..." oninput="renderWaLogsBody()"><button class="btn btn-sm" onclick="exportWaLogs()">'+ico('download','sm')+' Export</button></div><div id="wa-logs-body"></div></div>';
    openModal(ico('messageCircle')+' Log Komunikasi',h);
    renderWaLogsBody();
  };
  window.renderWaLogsBody=function(){
    var b=document.getElementById('wa-logs-body');if(!b)return;
    var q=(document.getElementById('wa-log-search')&&document.getElementById('wa-log-search').value||'').toLowerCase();
    var logs=(DB.waLogs||[]).slice();
    if(q){logs=logs.filter(function(l){return (l.toName||'').toLowerCase().indexOf(q)>=0||(l.fromName||'').toLowerCase().indexOf(q)>=0||(l.title||'').toLowerCase().indexOf(q)>=0||(l.message||'').toLowerCase().indexOf(q)>=0;});}
    if(logs.length===0){b.innerHTML='<div class="empty-state">'+ico('send','lg')+'<p>Belum ada log.</p></div>';return;}
    var h='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Total: '+logs.length+' entri</div>';
    logs.slice(0,100).forEach(function(l){
      var chBadge=l.channel==='both'?'<span class="badge badge-channel-both">App + WA</span>':(l.channel==='wa'?'<span class="badge badge-channel-wa">WA</span>':'<span class="badge badge-channel-app">App</span>');
      var tBadge={tugas:'badge-info',instruksi:'badge-primary',info:'badge-success',urgent:'badge-danger',followup:'badge-warning',broadcast:'badge-warning'}[l.type]||'badge-gray';
      h+='<div class="wa-log-item"><div class="wa-log-header"><span class="badge '+tBadge+'">'+l.type+'</span>'+chBadge+'<span class="wa-log-time">'+fmtDate(l.createdAt)+'</span></div><div class="wa-log-title">'+l.title+'</div><div class="wa-log-meta">Dari: <b>'+l.fromName+'</b> → Ke: <b>'+l.toName+'</b>'+(l.toPhone?' <span class="wa-log-phone">'+ico('phone','sm')+' '+l.toPhone+'</span>':'')+'</div><div class="wa-log-body">'+l.message+'</div></div>';
    });
    b.innerHTML=h;
  };
  window.exportWaLogs=function(){
    var logs=DB.waLogs||[];if(logs.length===0){alert('Tidak ada log.');return;}
    var rows=[['Waktu','Dari','Ke','No. WA','Channel','Jenis','Judul','Pesan']];
    logs.forEach(function(l){rows.push([new Date(l.createdAt).toLocaleString('id-ID'),l.fromName,l.toName,l.toPhone||'-',l.channel,l.type,l.title,l.message]);});
    var ws=XLSX.utils.aoa_to_sheet(rows);ws['!cols']=[{wch:20},{wch:20},{wch:20},{wch:14},{wch:10},{wch:12},{wch:30},{wch:50}];
    var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Log');XLSX.writeFile(wb,'Log_Komunikasi_SPPPT.xlsx');
  };
  window.openWaLogsGlobal=function(){if(currentUser.type!=='guru'&&currentUser.type!=='admin'){alert('Hanya guru/admin.');return;}openWaLogs(null);};

  console.log('Extras.js siap');
}
})();
