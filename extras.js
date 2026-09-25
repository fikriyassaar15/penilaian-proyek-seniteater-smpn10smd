/* ============================================================
   SP-PPT EXTRAS v3
   Checklist Divisi + Checklist Pribadi Siswa + Template Tupoksi
   + WA Logs + Follow-up + Progres Divisi
   ============================================================ */
(function(){
'use strict';

/* ============================================================
   1. ICON SYSTEM
   ============================================================ */
var ICON_PATHS={
  clipboard:'<path d="M9 4h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>',
  chat:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  megaphone:'<path d="M3 11l19-9-9 19-2-8-8-2z"/>',
  sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  chart:'<path d="M18 20V10M12 20V4M6 20v-6"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  checkCircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
  circle:'<circle cx="12" cy="12" r="10"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
  alert:'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  layers:'<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'
};

function ico2(name, size){
  var p=ICON_PATHS[name]||ICON_PATHS.info;
  var s=size||16;
  return '<svg class="ico ico-'+name+'" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+p+'</svg>';
}
window.ico2=ico2;

/* ============================================================
   2. READY WRAPPER
   ============================================================ */
function ready(fn){
  if(document.readyState!=='loading'){ setTimeout(fn, 200); }
  else { document.addEventListener('DOMContentLoaded', function(){ setTimeout(fn, 200); }); }
}
ready(function(){
  if(typeof firebaseReady==='undefined'){ console.warn('[extras] app.js belum siap'); return; }
  initExtras();
});

/* ============================================================
   3. INIT MAIN
   ============================================================ */
function initExtras(){
  console.log('[extras] Memuat modul ekstra v3...');

  /* ---------- Checklist default per divisi (dari guru) ---------- */
  window.DEFAULT_CHECKLIST={
    pimpinan_produksi:['Rekap laporan seluruh divisi','Pimpin rapat produksi mingguan','Koordinasi lintas divisi','Laporkan progres ke guru pengampu','Evaluasi kinerja koordinator'],
    sekretaris:['Buat notulen setiap rapat','Arsipkan semua dokumen produksi','Buat jadwal latihan & distribusi ke semua','Kelola absensi latihan harian','Rekap hasil keputusan rapat'],
    bendahara:['Catat semua pengeluaran dengan nota','Buat RAB awal produksi','Laporkan keuangan mingguan ke pimpinan','Kelola kas kecil & bukti bayar','Rekap laporan keuangan akhir'],
    koor_publikasi:['Desain poster pertunjukan','Publikasi di media sosial (IG/TikTok)','Dokumentasi setiap latihan','Buat teaser/trailer pertunjukan','Kelola spanduk & banner hari-H'],
    koor_perlengkapan:['List kebutuhan perlengkapan','Cek stok yang tersedia','Koordinasi sewa/pembelian alat','Labeli & simpan barang inventaris','Checklist perlengkapan hari-H'],
    koor_akomodasi:['Urus transportasi tim','Urus konsumsi latihan & hari-H','Urus penginapan (jika perlu)','Koordinasi izin & surat menyurat','Rundown akomodasi hari-H'],
    sutradara:['Finalisasi naskah','Casting pemain sesuai karakter','Blocking setiap adegan','Pimpin latihan gabungan penuh','Evaluasi hasil gladi resik'],
    asisten_sutradara:['Susun jadwal latihan detail','Catat semua arahan sutradara','Backup blocking untuk semua pemain','Koordinasi antar pemain & kru','Prompt saat gladi resik'],
    koor_panggung:['Desain set panggung','Bangun properti & backdrop','Setting panggung hari-H','Koordinasi perpindahan set','Bongkar & simpan panggung'],
    koor_musik:['Pilih musik pengiring per adegan','Latihan musik dengan pemain','Sound check final','Siapkan instrumen & sound system','Cue musik saat pertunjukan'],
    koor_busana:['Desain kostum per karakter','Jahit / beli kostum','Fitting semua pemain','Siapkan aksesoris & properti kostum','Rekap kostum per adegan'],
    koor_rias:['Desain rias per karakter','Trial makeup semua pemain','Rias hari-H','Siapkan alat rias cadangan','Touch-up antar adegan'],
    koor_cahaya:['Desain lighting per adegan','Setup lampu & dimmer','Cue lighting saat pertunjukan','Backup lampu cadangan','Rekap cue lighting final']
  };

  /* ============================================================
     [FITUR BARU] TEMPLATE CHECKLIST SISWA per TUPOKSI
     ============================================================ */
  window.STUDENT_CHECKLIST_TEMPLATES={
    pimpinan_produksi:{
      label:'Pimpinan Produksi',
      items:[
        'Menyusun struktur organisasi kepanitiaan',
        'Memimpin rapat koordinasi mingguan',
        'Mengelola timeline produksi keseluruhan',
        'Menjadi penghubung antara guru dan tim',
        'Menyelesaikan konflik antar divisi',
        'Memantau kinerja seluruh koordinator',
        'Memastikan semua divisi siap hari-H'
      ]
    },
    sutradara:{
      label:'Sutradara',
      items:[
        'Menganalisis & menafsirkan naskah',
        'Menyusun konsep pementasan (concept book)',
        'Casting pemain sesuai karakter',
        'Melatih pengucapan & intonasi pemain',
        'Menata blocking tiap adegan',
        'Memimpin gladi kotor & gladi bersih',
        'Bekerja sama dengan penata artistik'
      ]
    },
    asisten_sutradara:{
      label:'Asisten Sutradara',
      items:[
        'Menyusun jadwal latihan detail',
        'Mencatat semua arahan sutradara',
        'Menyimpan copy blocking semua adegan',
        'Mengingatkan pemain soal jadwal',
        'Menggantikan sutradara jika berhalangan',
        'Membantu mengatur properti di panggung'
      ]
    },
    sekretaris:{
      label:'Sekretaris',
      items:[
        'Membuat notulen tiap rapat',
        'Mengarsipkan dokumen penting',
        'Menyusun jadwal latihan & rapat',
        'Mengelola absensi latihan',
        'Menyiapkan surat izin & undangan',
        'Mendistribusikan informasi ke semua tim'
      ]
    },
    bendahara:{
      label:'Bendahara',
      items:[
        'Menyusun Rencana Anggaran Biaya (RAB)',
        'Mencatat semua pengeluaran + nota',
        'Mengelola kas tim dengan transparan',
        'Melaporkan keuangan mingguan',
        'Menyusun laporan akhir produksi'
      ]
    },
    koor_publikasi:{
      label:'Koor. Publikasi & Dokumentasi',
      items:[
        'Mendesain poster pertunjukan',
        'Mengelola akun media sosial pertunjukan',
        'Mendokumentasikan setiap latihan',
        'Membuat teaser/trailer pertunjukan',
        'Menyusun press release',
        'Mengatur dokumentasi hari-H'
      ]
    },
    anggota_publikasi:{
      label:'Anggota Publikasi',
      items:[
        'Membantu desain konten media sosial',
        'Mengambil foto & video latihan',
        'Mengedit hasil dokumentasi',
        'Mendistribusikan poster ke target audiens',
        'Membantu hari-H dokumentasi'
      ]
    },
    koor_perlengkapan:{
      label:'Koor. Perlengkapan & Peralatan',
      items:[
        'Mendata semua kebutuhan perlengkapan',
        'Mengecek stok yang ada',
        'Koordinasi sewa/pembelian alat',
        'Memastikan alat siap sebelum latihan',
        'Mengatur penyimpanan & inventaris',
        'Checklist perlengkapan hari-H'
      ]
    },
    anggota_perlengkapan:{
      label:'Anggota Perlengkapan',
      items:[
        'Membantu memindahkan properti',
        'Menata properti di lokasi latihan',
        'Merawat & memperbaiki alat rusak',
        'Menyiapkan konsumsi tim saat latihan',
        'Bongkar-pasang properti hari-H'
      ]
    },
    koor_akomodasi:{
      label:'Koor. Akomodasi & Transportasi',
      items:[
        'Mengatur transportasi tim',
        'Mengurus konsumsi latihan & hari-H',
        'Mengatur penginapan (jika perlu)',
        'Koordinasi izin & surat menyurat',
        'Menyusun rundown akomodasi'
      ]
    },
    anggota_akomodasi:{
      label:'Anggota Akomodasi',
      items:[
        'Membantu transportasi tim',
        'Menyiapkan konsumsi',
        'Membantu koordinasi tamu undangan',
        'Mengatur jemputan pemain',
        'Membantu rundown hari-H'
      ]
    },
    pemain:{
      label:'Pemain / Aktor',
      items:[
        'Membaca & memahami naskah',
        'Menghafal dialog karakter',
        'Latihan ekspresi & emosi karakter',
        'Menguasai blocking tiap adegan',
        'Hadir latihan tepat waktu',
        'Menjaga kondisi fisik & suara',
        'Menguasai blocking gladi bersih'
      ]
    },
    koor_panggung:{
      label:'Koor. Tata Pentas/Panggung',
      items:[
        'Mendesain set panggung',
        'Menyusun rencana properti',
        'Membangun set panggung',
        'Koordinasi perpindahan set antar adegan',
        'Setting panggung hari-H',
        'Bongkar & simpan panggung pasca tampil'
      ]
    },
    anggota_panggung:{
      label:'Anggota Panggung',
      items:[
        'Membantu membangun set panggung',
        'Menyiapkan properti per adegan',
        'Menjaga kebersihan area panggung',
        'Membantu perpindahan set saat pertunjukan',
        'Membantu bongkar panggung'
      ]
    },
    koor_musik:{
      label:'Koor. Musik & Suara',
      items:[
        'Memilih musik pengiring per adegan',
        'Melatih pemain dengan musik',
        'Mengatur sound system',
        'Sound check sebelum tampil',
        'Menjalankan cue musik saat pertunjukan'
      ]
    },
    anggota_musik:{
      label:'Anggota Musik',
      items:[
        'Melatih instrumen sendiri',
        'Latihan musik dengan pemain',
        'Membantu setup sound system',
        'Menjaga instrumen tetap siap',
        'Siap cue saat pertunjukan'
      ]
    },
    koor_busana:{
      label:'Koor. Busana & Kostum',
      items:[
        'Mendesain kostum per karakter',
        'Mencari bahan / jahit kostum',
        'Fitting semua pemain',
        'Merawat & menyimpan kostum',
        'Rekap kostum per adegan'
      ]
    },
    anggota_busana:{
      label:'Anggota Busana',
      items:[
        'Membantu jahit/menyiapkan kostum',
        'Membantu fitting pemain',
        'Menjaga kebersihan kostum',
        'Menyiapkan aksesoris',
        'Membantu kostum cepat ganti'
      ]
    },
    koor_rias:{
      label:'Koor. Rias',
      items:[
        'Mendesain rias per karakter',
        'Melakukan trial makeup',
        'Menyiapkan alat rias lengkap',
        'Rias pemain hari-H',
        'Touch-up antar adegan'
      ]
    },
    anggota_rias:{
      label:'Anggota Rias',
      items:[
        'Membantu menyiapkan alat rias',
        'Membantu rias pemain',
        'Menjaga kebersihan area rias',
        'Touch-up saat pertunjukan',
        'Merapikan alat setelah tampil'
      ]
    },
    koor_cahaya:{
      label:'Koor. Cahaya',
      items:[
        'Mendesain lighting per adegan',
        'Menyusun cue lighting',
        'Setup lampu & dimmer',
        'Menjalankan lighting saat pertunjukan',
        'Bongkar & simpan alat'
      ]
    },
    anggota_cahaya:{
      label:'Anggota Cahaya',
      items:[
        'Membantu setup lampu',
        'Membantu uji coba lighting',
        'Menjaga kabel tetap aman',
        'Siap standby saat pertunjukan',
        'Membantu bongkar lampu'
      ]
    }
  };

  /* ---------- Divisi ---------- */
  window.DIVISIONS={
    produksi:{
      label:'Tim Produksi',icon:'briefcase',
      roles:['pimpinan_produksi','sekretaris','bendahara','koor_publikasi','koor_perlengkapan','koor_akomodasi','anggota_publikasi','anggota_perlengkapan','anggota_akomodasi']
    },
    artistik:{
      label:'Tim Artistik',icon:'layers',
      roles:['sutradara','asisten_sutradara','pemain','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya','anggota_panggung','anggota_musik','anggota_busana','anggota_rias','anggota_cahaya']
    }
  };
  window.getDivisionOfRole=function(role){
    for(var div in DIVISIONS){if(DIVISIONS[div].roles.indexOf(role)>=0)return div;}
    return 'produksi';
  };

  /* ---------- WA util ---------- */
  window.WA={
    formatPhone:function(p){p=String(p||'').replace(/\D/g,'');if(!p)return '';if(p.charAt(0)==='0')p='62'+p.substring(1);if(p.substring(0,2)!=='62')p='62'+p;return p;},
    buildMessage:function(notif,recipient){
      var lines=[];
      lines.push('*SP-PPT — SMP Negeri 10 Samarinda*');
      lines.push('_Sistem Penilaian Proyek Produksi Teater_');
      lines.push('');
      lines.push('Yth. *'+recipient.name+'*');
      lines.push('('+((ROLES[recipient.role]&&ROLES[recipient.role].label)||recipient.role)+')');
      lines.push('');
      lines.push('*'+notif.title+'*');
      lines.push('');
      lines.push(notif.message);
      lines.push('');
      lines.push('—');
      lines.push('Dari: '+(notif.fromName||'Guru'));
      lines.push('Waktu: '+new Date().toLocaleString('id-ID'));
      return lines.join('\n');
    }
  };

  /* ---------- Storage helper ---------- */
  window.getChecklist=function(cid){return DB.checklists&&DB.checklists[cid]?DB.checklists[cid]:{items:[]};};
  window.saveChecklist=function(cid,items){
    if(!firebaseReady)return Promise.resolve();
    return fb.collection('checklists').doc(cid).set({classId:cid,items:items});
  };

  /* ---------- Firestore listeners ---------- */
  if(firebaseReady){
    fb.collection('checklists').onSnapshot(function(snap){
      var ch={};
      snap.docs.forEach(function(d){
        var dt=d.data();
        ch[dt.classId||d.id]={items:dt.items||[]};
      });
      DB.checklists=ch;
      if(currentUser) safeRerender();
    },function(e){console.error('[extras] checklists:',e.message);});

    fb.collection('wa_logs').orderBy('createdAt','desc').limit(200).onSnapshot(function(snap){
      DB.waLogs=snap.docs.map(function(d){return d.data();});
      if(currentUser&&currentUser.type==='guru'&&document.getElementById('wa-logs-view')) renderWaLogsBody();
    },function(e){console.error('[extras] wa_logs:',e.message);});
  }
  if(!DB.checklists) DB.checklists={};
  if(!DB.waLogs) DB.waLogs=[];

  function safeRerender(){
    try{
      if(currentUser.type==='guru') renderGuruDashboard();
      else if(currentUser.type==='siswa') renderSiswaDashboard();
    }catch(e){console.error('[extras] render:',e);}
  }

  /* ============================================================
     4. HOOK: Toolbar siswa
     ============================================================ */
  var _origRenderSiswa=window.renderSiswaDashboard;
  if(typeof _origRenderSiswa==='function'){
    window.renderSiswaDashboard=function(){
      _origRenderSiswa();
      var mc=document.getElementById('main-content');
      if(!mc||!currentUser)return;
      mc.insertAdjacentHTML('afterbegin',
        '<div class="extras-toolbar">'+
          '<button class="btn btn-primary" onclick="openStudentChecklistSelf()">'+ico2('clipboard')+' Checklist Saya</button>'+
          '<button class="btn" onclick="openStudentTemplatePicker(\''+currentUser.classId+'\')">'+ico2('book')+' Tambah dari Template Tupoksi</button>'+
          '<button class="btn" onclick="openChecklistView(\''+currentUser.classId+'\')">'+ico2('users')+' Checklist Tim</button>'+
          '<button class="btn" onclick="openDivisionProgress(\''+currentUser.classId+'\')">'+ico2('chart')+' Progres Divisi</button>'+
        '</div>'
      );
    };
  }

  /* ============================================================
     5. HOOK: Toolbar guru
     ============================================================ */
  var _origViewClass=window.viewClass;
  if(typeof _origViewClass==='function'){
    window.viewClass=function(cid){
      _origViewClass(cid);
      var mc=document.getElementById('main-content');
      if(!mc)return;
      mc.insertAdjacentHTML('afterbegin',
        '<div class="extras-toolbar">'+
          '<button class="btn btn-primary" onclick="openChecklistManage(\''+cid+'\')">'+ico2('clipboard')+' Kelola Checklist Divisi</button>'+
          '<button class="btn" onclick="openDivisionProgress(\''+cid+'\')">'+ico2('chart')+' Progres Per Divisi</button>'+
          '<button class="btn" onclick="openWaLogs(\''+cid+'\')">'+ico2('chat')+' Transkrip Log Komunikasi</button>'+
          '<button class="btn" onclick="openFollowUpPanel(\''+cid+'\')">'+ico2('megaphone')+' Kirim Follow-up</button>'+
        '</div>'
      );
    };
  }

  /* ============================================================
     6. CHECKLIST SISWA PRIBADI — fitur baru
     ============================================================ */

  /* Buka checklist pribadi siswa */
  window.openStudentChecklistSelf=function(){
    var cid=currentUser.classId;
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(it){
      return it.isPersonal && it.ownerId===currentUser.studentId;
    });

    var h='<div class="alert alert-info">'+ico2('info')+
      '<div>Ini <b>checklist pribadi Anda</b> berdasarkan tupoksi (tugas pokok & fungsi). Centang jika tugas sudah Anda selesaikan.</div></div>';

    h+='<div class="action-row" style="margin-bottom:12px;">'+
      '<button class="btn btn-primary btn-sm" onclick="openStudentTemplatePicker(\''+cid+'\')">'+ico2('book','sm')+' Tambah dari Template</button>'+
      '<button class="btn btn-sm" onclick="openAddPersonalItem(\''+cid+'\')">'+ico2('plus','sm')+' Tambah Manual</button>'+
      (items.length>0?'<button class="btn btn-sm btn-danger" onclick="clearPersonalChecklist(\''+cid+'\')">'+ico2('trash','sm')+' Hapus Semua</button>':'')+
    '</div>';

    if(items.length===0){
      h+='<div class="empty-state">'+ico2('book',40)+'<p>Belum ada item checklist pribadi.<br>Klik <b>Tambah dari Template</b> untuk mulai dari rekomendasi tupoksi peran Anda.</p></div>';
    } else {
      var total=items.length, done=items.filter(function(x){return x.done;}).length;
      var pct=total>0?Math.round(done/total*100):0;
      h+='<div class="progress-banner"><h3>'+ico2('chart',18)+' Progres Pribadi</h3>'+
        '<div class="big-count">'+done+' / '+total+' <span>selesai</span></div>'+
        '<div class="pct">'+pct+'%</div>'+
        '<div class="progress-container" style="margin-top:12px;"><div class="progress-bar '+(pct===100?'complete':pct>0?'partial':'')+'" style="width:'+pct+'%;"></div></div></div>';

      h+='<div class="checklist-role-group">';
      h+='<div class="checklist-role-label">'+ico2('target','sm')+' Checklist Pribadi — '+((ROLES[currentUser.role]||{}).label||currentUser.role)+'</div>';
      items.forEach(function(it){
        h+=renderPersonalItem(cid,it);
      });
      h+='</div>';
    }
    openModal('Checklist Pribadi',h);
  };

  function renderPersonalItem(cid,it){
    var cb='<input type="checkbox" '+(it.done?'checked':'')+' onchange="togglePersonalItem(\''+cid+'\',\''+it.id+'\',this.checked)">';
    return '<div class="checklist-item '+(it.done?'done':'')+'">'+cb+
      '<div class="checklist-item-text">'+it.name+
        (it.deadline?'<div class="checklist-item-meta deadline">'+ico2('clock',11)+' Deadline: '+fmtDateShort(it.deadline)+'</div>':'')+
        (it.done&&it.doneAt?'<div class="checklist-item-meta success">'+ico2('check',11)+' Selesai '+fmtDate(it.doneAt)+'</div>':'')+
      '</div>'+
      '<button class="btn btn-sm" onclick="editPersonalItem(\''+cid+'\',\''+it.id+'\')">'+ico2('edit',13)+'</button>'+
      '<button class="btn btn-sm btn-danger" onclick="delPersonalItem(\''+cid+'\',\''+it.id+'\')">'+ico2('trash',13)+'</button>'+
    '</div>';
  }

  /* Modal pilih template tupoksi */
  window.openStudentTemplatePicker=function(cid){
    var role=currentUser.role;
    var tpl=STUDENT_CHECKLIST_TEMPLATES[role];
    if(!tpl){alert('Template untuk peran Anda belum tersedia.');return;}

    var ch=getChecklist(cid);
    var myItems=(ch.items||[]).filter(function(it){return it.isPersonal && it.ownerId===currentUser.studentId;});
    var alreadyNames=myItems.map(function(it){return it.name.toLowerCase();});

    var h='<div class="alert alert-info">'+ico2('info')+
      '<div>Pilih item dari <b>template tupoksi</b> untuk <b>'+tpl.label+'</b>. Item yang sudah ada ditandai abu-abu.</div></div>';

    h+='<div class="action-row" style="margin-bottom:12px;">'+
      '<button class="btn btn-sm" onclick="document.querySelectorAll(\'.tpl-check:not(:disabled)\').forEach(function(c){c.checked=true;})">Pilih Semua</button>'+
      '<button class="btn btn-sm" onclick="document.querySelectorAll(\'.tpl-check\').forEach(function(c){c.checked=false;})">Kosongkan</button>'+
    '</div>';

    h+='<div class="tpl-list">';
    tpl.items.forEach(function(name,i){
      var isDup=alreadyNames.indexOf(name.toLowerCase())>=0;
      h+='<label class="tpl-item'+(isDup?' tpl-item-dup':'')+'">'+
        '<input type="checkbox" class="tpl-check" value="'+String(name).replace(/"/g,'&quot;')+'" '+(isDup?'disabled checked':'checked')+'>'+
        '<span>'+name+'</span>'+
        (isDup?'<span class="badge badge-gray">Sudah ada</span>':'')+
      '</label>';
    });
    h+='</div>';

    h+='<button class="btn btn-primary btn-block btn-lg" style="margin-top:16px;" onclick="applyTemplate(\''+cid+'\',\''+role+'\')">'+ico2('save')+' Tambahkan ke Checklist Saya</button>';

    openModal('Template Tupoksi — '+tpl.label,h);
  };

  window.applyTemplate=function(cid,role){
    var boxes=document.querySelectorAll('.tpl-check:not(:disabled):checked');
    if(boxes.length===0){alert('Pilih minimal 1 item.');return;}
    var ch=getChecklist(cid);
    var items=(ch.items||[]).slice();
    boxes.forEach(function(b){
      items.push({
        id:uid(),
        name:b.value,
        assignedRole:role,
        division:getDivisionOfRole(role),
        deadline:null,
        done:false,
        doneBy:null,
        doneAt:null,
        createdAt:Date.now(),
        createdBy:currentUser.name,
        isPersonal:true,
        ownerId:currentUser.studentId,
        ownerName:currentUser.name,
        templateKey:role
      });
    });
    saveChecklist(cid,items).then(function(){
      closeModal();
      openStudentChecklistSelf();
      alert(boxes.length+' item ditambahkan ke checklist pribadi Anda!');
    });
  };

  /* Tambah item manual */
  window.openAddPersonalItem=function(cid){
    openModal('Tambah Item Pribadi',
      '<div class="form-group"><label>Nama Item / Tugas</label><input id="pi-name" placeholder="Contoh: Latihan dialog adegan 2"></div>'+
      '<div class="form-group"><label>Deadline (opsional)</label><input type="date" id="pi-date"></div>'+
      '<button class="btn btn-primary btn-block" onclick="addPersonalItem(\''+cid+'\')">'+ico2('save')+' Simpan</button>'
    );
  };

  window.addPersonalItem=function(cid){
    var n=document.getElementById('pi-name').value.trim();
    var d=document.getElementById('pi-date').value;
    if(!n){alert('Nama wajib diisi!');return;}
    var ch=getChecklist(cid);
    var items=(ch.items||[]).slice();
    items.push({
      id:uid(),name:n,assignedRole:currentUser.role,division:getDivisionOfRole(currentUser.role),
      deadline:d||null,done:false,doneBy:null,doneAt:null,
      createdAt:Date.now(),createdBy:currentUser.name,
      isPersonal:true,ownerId:currentUser.studentId,ownerName:currentUser.name
    });
    saveChecklist(cid,items).then(function(){closeModal();openStudentChecklistSelf();});
  };

  window.editPersonalItem=function(cid,itemId){
    var ch=getChecklist(cid);
    var it=(ch.items||[]).find(function(x){return x.id===itemId && x.ownerId===currentUser.studentId;});
    if(!it)return;
    openModal('Edit Item Pribadi',
      '<div class="form-group"><label>Nama</label><input id="pi-name" value="'+String(it.name).replace(/"/g,'&quot;')+'"></div>'+
      '<div class="form-group"><label>Deadline</label><input type="date" id="pi-date" value="'+(it.deadline||'')+'"></div>'+
      '<button class="btn btn-primary btn-block" onclick="updatePersonalItem(\''+cid+'\',\''+itemId+'\')">'+ico2('save')+' Simpan</button>'
    );
  };

  window.updatePersonalItem=function(cid,itemId){
    var n=document.getElementById('pi-name').value.trim();
    var d=document.getElementById('pi-date').value;
    if(!n){alert('Nama wajib!');return;}
    var ch=getChecklist(cid);
    var items=(ch.items||[]).map(function(it){
      if(it.id!==itemId)return it;
      return Object.assign({},it,{name:n,deadline:d||null});
    });
    saveChecklist(cid,items).then(function(){closeModal();openStudentChecklistSelf();});
  };

  window.delPersonalItem=function(cid,itemId){
    if(!confirm('Hapus item ini?'))return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(x){return !(x.id===itemId && x.ownerId===currentUser.studentId);});
    saveChecklist(cid,items).then(function(){closeModal();openStudentChecklistSelf();});
  };

  window.clearPersonalChecklist=function(cid){
    if(!confirm('Hapus SEMUA item checklist pribadi Anda?'))return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(x){return !(x.isPersonal && x.ownerId===currentUser.studentId);});
    saveChecklist(cid,items).then(function(){closeModal();openStudentChecklistSelf();});
  };

  window.togglePersonalItem=function(cid,itemId,checked){
    var ch=getChecklist(cid);
    var items=(ch.items||[]).map(function(it){
      if(it.id!==itemId)return it;
      return Object.assign({},it,{
        done:checked,
        doneBy:checked?currentUser.name:null,
        doneAt:checked?Date.now():null
      });
    });
    saveChecklist(cid,items).then(function(){
      openStudentChecklistSelf();
      logActivity('checklist_update',currentUser.name+' '+(checked?'selesai':'batal')+' item pribadi',
        {classId:cid,division:getDivisionOfRole(currentUser.role),role:currentUser.role||''});
    });
  };

  /* ============================================================
     7. CHECKLIST KELAS — dikelola guru
     ============================================================ */
  window.openChecklistManage=function(cid){
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(it){return !it.isPersonal;});
    var byDiv={produksi:[],artistik:[]};
    items.forEach(function(it){
      var div=it.division||getDivisionOfRole(it.assignedRole||'umum');
      if(!byDiv[div])byDiv[div]=[];
      byDiv[div].push(it);
    });

    var h='<div class="alert alert-info">'+ico2('info')+'<div>Item checklist <b>untuk semua divisi</b>. Guru juga bisa menambahkan item pribadi siswa via template tupoksi dari sisi siswa.</div></div>';
    h+='<div class="action-row" style="margin-bottom:16px;">'+
      '<button class="btn btn-primary btn-sm" onclick="openAddChecklistItem(\''+cid+'\')">+ Tambah Item</button>'+
      '<button class="btn btn-sm" onclick="seedDefaultChecklist(\''+cid+'\')">'+ico2('sparkle')+' Auto-isi Default</button>'+
      '<button class="btn btn-sm btn-danger" onclick="clearChecklist(\''+cid+'\')">'+ico2('trash')+' Hapus Semua</button>'+
    '</div>';

    if(items.length===0){
      h+='<div class="empty-state">'+ico2('book',40)+'<p>Belum ada item checklist.</p></div>';
    } else {
      ['produksi','artistik'].forEach(function(div){
        var arr=byDiv[div]||[];
        if(arr.length===0)return;
        var divMeta=DIVISIONS[div];
        var rDone=arr.filter(function(x){return x.done;}).length;
        var pct=arr.length?Math.round(rDone/arr.length*100):0;
        h+='<div class="division-block division-'+div+'">'+
          '<div class="division-header">'+
            '<div class="division-header-left">'+ico2(divMeta.icon,20)+
              '<span class="division-header-title">'+divMeta.label+'</span>'+
              '<span class="badge badge-gray">'+arr.length+' item</span>'+
            '</div>'+
            '<span class="checklist-progress-badge '+(pct===100?'done':pct>0?'partial':'')+'">'+rDone+'/'+arr.length+' · '+pct+'%</span>'+
          '</div>'+
          '<div class="progress-container" style="margin:6px 0 12px;">'+
            '<div class="progress-bar '+(pct===100?'complete':pct>0?'partial':'')+'" style="width:'+pct+'%;"></div>'+
          '</div>';

        var byRole={};
        arr.forEach(function(it){
          var key=it.assignedRole||'umum';
          if(!byRole[key])byRole[key]=[];
          byRole[key].push(it);
        });
        Object.keys(byRole).forEach(function(role){
          var roleArr=byRole[role];
          h+='<div class="checklist-role-group">'+
            '<div class="checklist-role-label">'+
              ((ROLES[role]&&ROLES[role].label)||(role==='umum'?'Umum':role))+
              ' <span class="badge badge-gray">'+roleArr.length+'</span>'+
            '</div>';
          roleArr.forEach(function(it){
            var doneMark=it.done?ico2('checkCircle',18):ico2('circle',18);
            h+='<div class="checklist-item '+(it.done?'done':'')+'">'+
              '<span class="checklist-mark">'+doneMark+'</span>'+
              '<div class="checklist-item-text">'+it.name+
                (it.deadline?'<div class="checklist-item-meta deadline">'+ico2('clock',11)+' Deadline: '+fmtDateShort(it.deadline)+'</div>':'')+
                (it.done&&it.doneBy?'<div class="checklist-item-meta success">'+ico2('check',11)+' '+it.doneBy+' · '+fmtDate(it.doneAt||0)+'</div>':'')+
              '</div>'+
              '<button class="btn btn-sm" onclick="editChecklistItem(\''+cid+'\',\''+it.id+'\')">'+ico2('edit',13)+'</button>'+
              '<button class="btn btn-sm btn-danger" onclick="delChecklistItem(\''+cid+'\',\''+it.id+'\')">'+ico2('trash',13)+'</button>'+
            '</div>';
          });
          h+='</div>';
        });
        h+='</div>';
      });
    }
    openModal('Kelola Checklist — Kelas '+c.name,h);
  };

  window.openAddChecklistItem=function(cid){
    var rolesOpts='';
    Object.keys(ROLES).forEach(function(k){rolesOpts+='<option value="'+k+'">'+ROLES[k].label+'</option>';});
    openModal('Tambah Item Checklist',
      '<div class="form-group"><label>Nama Item / Tugas</label><input id="cl-name" placeholder="Contoh: Desain poster pertunjukan"></div>'+
      '<div class="form-group"><label>Untuk Divisi / Peran</label><select id="cl-role" onchange="syncDivisionField()"><option value="umum">-- Umum (semua) --</option>'+rolesOpts+'</select></div>'+
      '<div class="form-group"><label>Divisi</label><select id="cl-division"><option value="produksi">Tim Produksi</option><option value="artistik">Tim Artistik</option></select></div>'+
      '<div class="form-group"><label>Deadline (opsional)</label><input type="date" id="cl-date"></div>'+
      '<button class="btn btn-primary btn-block" onclick="addChecklistItem(\''+cid+'\')">'+ico2('save')+' Simpan</button>'
    );
  };

  window.syncDivisionField=function(){
    var r=document.getElementById('cl-role'),d=document.getElementById('cl-division');
    if(!r||!d)return;
    if(r.value!=='umum')d.value=getDivisionOfRole(r.value);
  };

  window.addChecklistItem=function(cid){
    var n=document.getElementById('cl-name').value.trim();
    var r=document.getElementById('cl-role').value;
    var d=document.getElementById('cl-date').value;
    var dv=document.getElementById('cl-division').value;
    if(!n){alert('Nama wajib diisi!');return;}
    var ch=getChecklist(cid);
    var items=(ch.items||[]).slice();
    items.push({
      id:uid(),name:n,assignedRole:r,division:dv,
      deadline:d||null,done:false,doneBy:null,doneAt:null,
      createdAt:Date.now(),createdBy:currentUser.name
    });
    saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);});
  };

  window.editChecklistItem=function(cid,itemId){
    var ch=getChecklist(cid);
    var it=(ch.items||[]).find(function(x){return x.id===itemId;});
    if(!it)return;
    var rolesOpts='';
    Object.keys(ROLES).forEach(function(k){rolesOpts+='<option value="'+k+'" '+(it.assignedRole===k?'selected':'')+'>'+ROLES[k].label+'</option>';});
    openModal('Edit Item',
      '<div class="form-group"><label>Nama</label><input id="cl-name" value="'+String(it.name).replace(/"/g,'&quot;')+'"></div>'+
      '<div class="form-group"><label>Peran</label><select id="cl-role" onchange="syncDivisionField()"><option value="umum" '+(it.assignedRole==='umum'?'selected':'')+'>-- Umum --</option>'+rolesOpts+'</select></div>'+
      '<div class="form-group"><label>Divisi</label><select id="cl-division"><option value="produksi" '+((it.division==='produksi')?'selected':'')+'>Tim Produksi</option><option value="artistik" '+((it.division==='artistik')?'selected':'')+'>Tim Artistik</option></select></div>'+
      '<div class="form-group"><label>Deadline</label><input type="date" id="cl-date" value="'+(it.deadline||'')+'"></div>'+
      '<button class="btn btn-primary btn-block" onclick="updateChecklistItem(\''+cid+'\',\''+itemId+'\')">'+ico2('save')+' Simpan</button>'
    );
  };

  window.updateChecklistItem=function(cid,itemId){
    var n=document.getElementById('cl-name').value.trim();
    var r=document.getElementById('cl-role').value;
    var d=document.getElementById('cl-date').value;
    var dv=document.getElementById('cl-division').value;
    if(!n){alert('Nama wajib!');return;}
    var ch=getChecklist(cid);
    var items=(ch.items||[]).map(function(it){
      if(it.id!==itemId)return it;
      return Object.assign({},it,{name:n,assignedRole:r,division:dv,deadline:d||null});
    });
    saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);});
  };

  window.delChecklistItem=function(cid,itemId){
    if(!confirm('Hapus item ini?'))return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(x){return x.id!==itemId;});
    saveChecklist(cid,items).then(function(){closeModal();openChecklistManage(cid);});
  };

  window.clearChecklist=function(cid){
    if(!confirm('Hapus SEMUA item checklist kelas (termasuk pribadi siswa)?'))return;
    saveChecklist(cid,[]).then(function(){closeModal();openChecklistManage(cid);});
  };

  window.seedDefaultChecklist=function(cid){
    if(!confirm('Isi otomatis dengan checklist standar per divisi?'))return;
    var ch=getChecklist(cid);
    var existing=(ch.items||[]).filter(function(it){return it.isPersonal;});
    var items=existing.slice();
    Object.keys(DEFAULT_CHECKLIST).forEach(function(role){
      var div=getDivisionOfRole(role);
      DEFAULT_CHECKLIST[role].forEach(function(name){
        items.push({
          id:uid(),name:name,assignedRole:role,division:div,
          deadline:null,done:false,doneBy:null,doneAt:null,
          createdAt:Date.now(),createdBy:currentUser.name
        });
      });
    });
    saveChecklist(cid,items).then(function(){
      closeModal();openChecklistManage(cid);
      alert(items.length-existing.length+' item ditambahkan.');
    });
  };

  /* ============================================================
     8. CHECKLIST VIEW (SISWA) — kelas + pribadi
     ============================================================ */
  window.openChecklistView=function(cid){
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(it){return !it.isPersonal;});
    var myRole=currentUser.role||'';
    var myDiv=getDivisionOfRole(myRole);

    var total=items.length,done=items.filter(function(x){return x.done;}).length;
    var pct=total>0?Math.round(done/total*100):0;

    var h='<div class="progress-banner"><h3>'+ico2('chart',18)+' Progres Checklist Tim — '+c.name+'</h3>'+
      '<div class="big-count">'+done+' / '+total+' <span>selesai</span></div>'+
      '<div class="pct">'+pct+'% keseluruhan</div>'+
      '<div class="progress-container" style="margin-top:12px;">'+
        '<div class="progress-bar '+(pct===100?'complete':pct>0?'partial':'')+'" style="width:'+pct+'%;"></div>'+
      '</div></div>';

    h+='<div class="alert alert-info">'+ico2('info')+
      '<div>Semua anggota bisa memantau. Hanya peran yang sesuai bisa mencentang.</div></div>';

    if(items.length===0){
      h+='<div class="empty-state">'+ico2('book',40)+'<p>Belum ada checklist dari guru.</p></div>';
    } else {
      ['produksi','artistik'].forEach(function(div){
        var arr=items.filter(function(it){var d=it.division||getDivisionOfRole(it.assignedRole||'umum');return d===div;});
        if(arr.length===0)return;
        var divMeta=DIVISIONS[div];
        var rDone=arr.filter(function(x){return x.done;}).length;
        var rPct=arr.length?Math.round(rDone/arr.length*100):0;
        var isMyDiv=(div===myDiv);
        h+='<div class="division-block division-'+div+(isMyDiv?' is-mine':'')+'">'+
          '<div class="division-header">'+
            '<div class="division-header-left">'+ico2(divMeta.icon,20)+
              '<span class="division-header-title">'+divMeta.label+'</span>'+
              (isMyDiv?'<span class="badge badge-primary">Divisi Anda</span>':'')+
            '</div>'+
            '<span class="checklist-progress-badge '+(rPct===100?'done':rPct>0?'partial':'')+'">'+rDone+'/'+arr.length+' · '+rPct+'%</span>'+
          '</div>'+
          '<div class="progress-container" style="margin:6px 0 12px;">'+
            '<div class="progress-bar '+(rPct===100?'complete':rPct>0?'partial':'')+'" style="width:'+rPct+'%;"></div>'+
          '</div>';
        var byRole={};
        arr.forEach(function(it){var key=it.assignedRole||'umum';if(!byRole[key])byRole[key]=[];byRole[key].push(it);});
        Object.keys(byRole).forEach(function(role){
          var roleArr=byRole[role];
          var roleDone=roleArr.filter(function(x){return x.done;}).length;
          var rp=Math.round(roleDone/roleArr.length*100);
          var canEdit=(role===myRole)||(role==='umum')||currentUser.type==='guru';
          h+='<div class="checklist-role-group">'+
            '<div class="checklist-role-label">'+
              ((ROLES[role]&&ROLES[role].label)||(role==='umum'?'Umum (Semua)':role))+
              ' <span class="badge badge-gray">'+roleDone+'/'+roleArr.length+'</span>'+
              (canEdit?'':' <span class="badge badge-gray">Lihat saja</span>')+
            '</div>';
          roleArr.forEach(function(it){
            var cb='<input type="checkbox" '+(it.done?'checked':'')+' '+(canEdit?'':'disabled')+' onchange="toggleChecklistItem(\''+cid+'\',\''+it.id+'\',this.checked)">';
            h+='<div class="checklist-item '+(it.done?'done':'')+'">'+cb+
              '<div class="checklist-item-text">'+it.name+
                (it.deadline?'<div class="checklist-item-meta deadline">'+ico2('clock',11)+' Deadline: '+fmtDateShort(it.deadline)+'</div>':'')+
                (it.done&&it.doneBy?'<div class="checklist-item-meta success">'+ico2('check',11)+' '+it.doneBy+' · '+fmtDate(it.doneAt||0)+'</div>':'')+
              '</div></div>';
          });
          h+='</div>';
        });
        h+='</div>';
      });
    }
    openModal('Checklist Tim',h);
  };

  window.toggleChecklistItem=function(cid,itemId,checked){
    var ch=getChecklist(cid);
    var items=(ch.items||[]).map(function(it){
      if(it.id!==itemId)return it;
      return Object.assign({},it,{done:checked,doneBy:checked?currentUser.name:null,doneAt:checked?Date.now():null});
    });
    saveChecklist(cid,items).then(function(){
      openChecklistView(cid);
      if(currentUser.type==='siswa')renderSiswaDashboard();
    });
  };

  /* ============================================================
     9. PROGRES PER DIVISI
     ============================================================ */
  window.openDivisionProgress=function(cid){
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var ch=getChecklist(cid);
    var items=(ch.items||[]).filter(function(it){return !it.isPersonal;});
    if(items.length===0){
      openModal('Progres Per Divisi','<div class="empty-state">'+ico2('book',40)+'<p>Belum ada checklist.</p></div>');
      return;
    }
    var h='<div class="alert alert-info">'+ico2('info')+'<div>Ringkasan progres tiap divisi & peran.</div></div>';
    ['produksi','artistik'].forEach(function(div){
      var arr=items.filter(function(it){var d=it.division||getDivisionOfRole(it.assignedRole||'umum');return d===div;});
      if(arr.length===0)return;
      var divMeta=DIVISIONS[div];
      var dDone=arr.filter(function(x){return x.done;}).length;
      var dPct=Math.round(dDone/arr.length*100);
      h+='<div class="division-block division-'+div+'">'+
        '<div class="division-header"><div class="division-header-left">'+ico2(divMeta.icon,22)+
          '<span class="division-header-title">'+divMeta.label+'</span></div>'+
          '<span class="checklist-progress-badge '+(dPct===100?'done':dPct>0?'partial':'')+'">'+dDone+'/'+arr.length+' · '+dPct+'%</span>'+
        '</div><div class="progress-container" style="margin:6px 0 14px;height:12px;">'+
          '<div class="progress-bar '+(dPct===100?'complete':dPct>0?'partial':'')+'" style="width:'+dPct+'%;"></div>'+
        '</div>';
      var byRole={};
      arr.forEach(function(it){var key=it.assignedRole||'umum';if(!byRole[key])byRole[key]=[];byRole[key].push(it);});
      h+='<table class="division-progress-table"><thead><tr><th>Peran</th><th>Progres</th><th>Persen</th><th>Bar</th></tr></thead><tbody>';
      Object.keys(byRole).sort().forEach(function(role){
        var roleArr=byRole[role];
        var rDone=roleArr.filter(function(x){return x.done;}).length;
        var rPct=Math.round(rDone/roleArr.length*100);
        var roleLabel=(ROLES[role]&&ROLES[role].label)||(role==='umum'?'Umum':role);
        h+='<tr><td>'+roleLabel+'</td><td><b>'+rDone+'/'+roleArr.length+'</b></td>'+
          '<td><span class="checklist-progress-badge '+(rPct===100?'done':rPct>0?'partial':'')+'">'+rPct+'%</span></td>'+
          '<td><div class="progress-container" style="margin:0;height:8px;width:120px;">'+
            '<div class="progress-bar '+(rPct===100?'complete':rPct>0?'partial':'')+'" style="width:'+rPct+'%;"></div>'+
          '</div></td></tr>';
      });
      h+='</tbody></table></div>';
    });
    openModal('Progres Per Divisi — '+c.name,h);
  };

  /* ============================================================
     10. FOLLOW-UP PANEL
     ============================================================ */
  window.canSendFollowUp=function(){
    if(!currentUser)return false;
    if(currentUser.type==='guru')return true;
    if(currentUser.type!=='siswa')return false;
    var allowed=['pimpinan_produksi','sutradara','sekretaris','bendahara','asisten_sutradara',
      'koor_publikasi','koor_perlengkapan','koor_akomodasi',
      'koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya'];
    return allowed.indexOf(currentUser.role)>=0;
  };

  window.openFollowUpPanel=function(cid){
    if(!canSendFollowUp()){alert('Hanya koordinator/pimpinan/sutradara.');return;}
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
    var targets=[];
    if(currentUser.type==='guru'){targets=c.students.slice();}
    else{
      var myRole=currentUser.role;var myDiv=getDivisionOfRole(myRole);
      c.students.forEach(function(s){
        if(s.id===currentUser.studentId)return;
        var sDiv=getDivisionOfRole(s.role);
        if(sDiv===myDiv)targets.push(s);
      });
      if(['koor_publikasi','koor_perlengkapan','koor_akomodasi','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya'].indexOf(myRole)>=0){
        c.students.forEach(function(s){
          if(targets.indexOf(s)<0 && (s.role==='pimpinan_produksi'||s.role==='sutradara'||s.role==='asisten_sutradara'))targets.push(s);
        });
      }
    }
    var checkboxes=targets.map(function(t){
      var roleLabel=(ROLES[t.role]&&ROLES[t.role].label)||t.role;
      return '<label class="fu-target-item">'+
        '<input type="checkbox" class="fu-target" value="'+t.id+'" data-name="'+String(t.name).replace(/"/g,'&quot;')+'" data-role="'+t.role+'" data-phone="'+(t.phone||'')+'" checked>'+
        '<span class="fu-target-name">'+t.name+'</span> <span class="fu-target-role">— '+roleLabel+'</span>'+
        (t.phone?'<span class="fu-target-phone has-phone">'+ico2('phone',11)+' '+t.phone+'</span>':'<span class="fu-target-phone no-phone">'+ico2('alert',11)+' tanpa no. WA</span>')+
      '</label>';
    }).join('');
    openModal('Kirim Follow-up',
      '<div class="alert alert-info">'+ico2('megaphone')+'<div>Follow-up akan terkirim sebagai notifikasi + WA.</div></div>'+
      '<div class="form-group"><label>Jenis</label><select id="fu-type"><option value="tugas">Tugas</option><option value="instruksi">Instruksi</option><option value="followup">Follow-up</option><option value="urgent">Penting</option></select></div>'+
      '<div class="form-group"><label>Judul</label><input id="fu-title"></div>'+
      '<div class="form-group"><label>Pesan</label><textarea id="fu-message" rows="4"></textarea></div>'+
      '<div class="form-group"><label>Kirim via</label><select id="fu-channel"><option value="both">Notifikasi + WA</option><option value="app">Hanya notifikasi</option><option value="wa">Hanya WA</option></select></div>'+
      '<div class="form-group"><label>Penerima ('+targets.length+')</label>'+
        '<div class="fu-target-list">'+(targets.length?checkboxes:'<div style="text-align:center;padding:20px;color:var(--text-muted);">Tidak ada target</div>')+'</div>'+
        '<div style="margin-top:6px;">'+
          '<button class="btn btn-sm" onclick="document.querySelectorAll(\'.fu-target\').forEach(function(c){c.checked=true;})">Pilih Semua</button> '+
          '<button class="btn btn-sm" onclick="document.querySelectorAll(\'.fu-target\').forEach(function(c){c.checked=false;})">Kosongkan</button>'+
        '</div>'+
      '</div>'+
      '<button class="btn btn-primary btn-block btn-lg" onclick="sendFollowUp(\''+cid+'\')">'+ico2('send')+' Kirim Sekarang</button>'
    );
  };

  window.sendFollowUp=function(cid){
    var t=document.getElementById('fu-type').value;
    var ti=document.getElementById('fu-title').value.trim();
    var m=document.getElementById('fu-message').value.trim();
    var ch=document.getElementById('fu-channel').value;
    if(!ti||!m){alert('Lengkapi judul & pesan!');return;}
    var boxes=document.querySelectorAll('.fu-target:checked');
    if(boxes.length===0){alert('Pilih minimal 1 penerima!');return;}
    var senderId=currentUser.type==='guru'?'guru':currentUser.studentId;
    var senderName=currentUser.name;
    var senderRole=currentUser.role||currentUser.type||'';
    var recipientIds=[];
    boxes.forEach(function(b){recipientIds.push(b.value);});
    if(ch==='app'||ch==='both'){
      try{
        fbAddNotif({
          id:uid(),classId:cid,fromId:senderId,fromName:senderName,fromType:currentUser.type,
          fromRole:senderRole,toId:'some',recipientIds:recipientIds,
          type:t,title:ti,message:m,createdAt:Date.now(),readBy:[],doneBy:[]
        });
      }catch(e){console.error(e);}
    }
    var count=0,skipped=0;
    boxes.forEach(function(b,idx){
      var rec={id:b.value,name:b.getAttribute('data-name'),role:b.getAttribute('data-role'),phone:b.getAttribute('data-phone')};
      var logEntry={
        id:uid(),classId:cid,
        fromId:senderId,fromName:senderName,fromType:currentUser.type,fromRole:senderRole,
        toId:rec.id,toName:rec.name,toRole:rec.role,toPhone:rec.phone,
        channel:ch,type:t,title:ti,message:m,createdAt:Date.now(),createdBy:senderName
      };
      if(firebaseReady)fb.collection('wa_logs').doc(logEntry.id).set(logEntry);
      if(ch==='wa'||ch==='both'){
        var p=WA.formatPhone(rec.phone);
        if(p){
          var msg=WA.buildMessage({title:ti,message:m,fromName:senderName},rec);
          setTimeout(function(){
            window.open('https://wa.me/'+p+'?text='+encodeURIComponent(msg),'_blank');
          },idx*350);
          count++;
        } else skipped++;
      }
    });
    closeModal();
    alert('Follow-up terkirim!\n\n• WA dibuka: '+count+' tab\n'+(skipped>0?'• Dilewati: '+skipped+'\n':'')+'\nKlik "Send" di setiap tab WhatsApp.');
  };

  /* ============================================================
     11. WA LOGS
     ============================================================ */
  window.openWaLogs=function(cid){
    var h='<div id="wa-logs-view">'+
      '<div class="alert alert-info">'+ico2('info')+'<div>Riwayat komunikasi (notifikasi + WA).</div></div>'+
      '<div class="action-row" style="margin-bottom:12px;">'+
        '<input id="wa-log-search" class="wa-search" placeholder="Cari nama / pesan..." oninput="renderWaLogsBody()">'+
        '<button class="btn btn-sm" onclick="exportWaLogs()">'+ico2('download',13)+' Export XLSX</button>'+
      '</div>'+
      '<div id="wa-logs-body"></div>'+
    '</div>';
    openModal('Transkrip Log Komunikasi',h);
    renderWaLogsBody();
  };

  window.renderWaLogsBody=function(){
    var b=document.getElementById('wa-logs-body');if(!b)return;
    var q=(document.getElementById('wa-log-search')&&document.getElementById('wa-log-search').value||'').toLowerCase();
    var logs=(DB.waLogs||[]).slice();
    if(q){
      logs=logs.filter(function(l){
        return (l.toName||'').toLowerCase().indexOf(q)>=0 ||
               (l.fromName||'').toLowerCase().indexOf(q)>=0 ||
               (l.title||'').toLowerCase().indexOf(q)>=0 ||
               (l.message||'').toLowerCase().indexOf(q)>=0;
      });
    }
    if(logs.length===0){b.innerHTML='<div class="empty-state">'+ico2('send',40)+'<p>Belum ada log.</p></div>';return;}
    var h='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Total: '+logs.length+' entri</div>';
    logs.slice(0,100).forEach(function(l){
      var chBadge=l.channel==='both'?'<span class="badge badge-channel-both">App + WA</span>':(l.channel==='wa'?'<span class="badge badge-channel-wa">WA</span>':'<span class="badge badge-channel-app">App</span>');
      var tBadgeClass=({tugas:'badge-info',instruksi:'badge-primary',info:'badge-success',urgent:'badge-danger',followup:'badge-warning'})[l.type]||'badge-gray';
      var toRoleLabel=(ROLES[l.toRole]&&ROLES[l.toRole].label)||l.toRole||'';
      h+='<div class="wa-log-item">'+
        '<div class="wa-log-header"><span class="badge '+tBadgeClass+'">'+l.type+'</span>'+chBadge+'<span class="wa-log-time">'+fmtDate(l.createdAt)+'</span></div>'+
        '<div class="wa-log-title">'+l.title+'</div>'+
        '<div class="wa-log-meta">Dari: <b>'+l.fromName+'</b> → Ke: <b>'+l.toName+'</b> ('+toRoleLabel+')'+
          (l.toPhone?' <span class="wa-log-phone">'+ico2('phone',11)+' '+l.toPhone+'</span>':'')+
        '</div>'+
        '<div class="wa-log-body">'+l.message+'</div>'+
      '</div>';
    });
    b.innerHTML=h;
  };

  window.exportWaLogs=function(){
    var logs=DB.waLogs||[];
    if(logs.length===0){alert('Tidak ada log.');return;}
    var rows=[['Waktu','Dari','Peran Pengirim','Ke','Peran Penerima','No. WA','Channel','Jenis','Judul','Pesan']];
    logs.forEach(function(l){
      rows.push([
        new Date(l.createdAt).toLocaleString('id-ID'),
        l.fromName,l.fromRole||l.fromType,
        l.toName,(ROLES[l.toRole]&&ROLES[l.toRole].label)||l.toRole||'',
        l.toPhone||'-',l.channel,l.type,l.title,l.message
      ]);
    });
    var ws=XLSX.utils.aoa_to_sheet(rows);
    ws['!cols']=[{wch:20},{wch:20},{wch:20},{wch:20},{wch:20},{wch:14},{wch:10},{wch:12},{wch:30},{wch:50}];
    var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Log');
    XLSX.writeFile(wb,'Log_Komunikasi_SPPPT.xlsx');
  };

  console.log('[extras] Modul ekstra v3 siap');
}
})();
