/* ============================================================
   SP-PPT app.js — FULL FIX
   v3: Teacher-scoped classes, Firestore-safe writes, no demo,
       notif for all roles, bug fixes
   ============================================================ */

/* ===== FORCE HIDE LOADING ===== */
(function(){
  var hidden=false;
  function forceHide(){
    if(hidden)return;hidden=true;
    var l=document.getElementById('loading-screen');
    if(l){l.style.transition='opacity .3s';l.style.opacity='0';setTimeout(function(){l.style.display='none';},350);}
  }
  setTimeout(forceHide,3000);
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(forceHide,800);});}
  else{setTimeout(forceHide,800);}
  window.__forceHideLoading=forceHide;
})();

window.addEventListener('error',function(e){console.error('Global error:',e.message);if(window.__forceHideLoading)window.__forceHideLoading();showErrorBanner('Error: '+(e.message||'-'));});
window.addEventListener('unhandledrejection',function(e){console.error('Promise:',e.reason);if(window.__forceHideLoading)window.__forceHideLoading();showErrorBanner('Error: '+(e.reason&&e.reason.message?e.reason.message:String(e.reason)));});
function showErrorBanner(msg){
  try{var b=document.getElementById('error-banner');
    if(!b){b=document.createElement('div');b.id='error-banner';b.style.cssText='position:fixed;top:0;left:0;right:0;background:#dc2626;color:#fff;padding:12px 20px;font-family:sans-serif;font-size:13px;z-index:99999;display:flex;justify-content:space-between;gap:10px;';document.body.appendChild(b);}
    b.innerHTML='<span>'+msg+'</span><button onclick="this.parentNode.style.display=\'none\'" style="background:transparent;border:1px solid #fff;color:#fff;padding:4px 10px;border-radius:4px;cursor:pointer;font-size:12px;">Tutup</button>';
    b.style.display='flex';
  }catch(e){}
}

/* ===== ICON SYSTEM (SVG) ===== */
function ico(n,s){const p={
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/>',
  back:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  chart:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  school:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  checkCircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  warning:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  send:'<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock:'<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  award:'<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  personPlus:'<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  key:'<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  megaphone:'<path d="M3 11l19-9-9 19-2-8-8-2z"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  checkSquare:'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  hash:'<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
  refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  messageCircle:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  mic:'<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>'
};const sz=s==='lg'?'20px':s==='sm'?'13px':'16px';return '<svg class="ico" style="width:'+sz+';height:'+sz+'" viewBox="0 0 24 24">'+(p[n]||'')+'</svg>';}

/* ===== THEME ===== */
const THEME_KEY='sppt_theme';
function setTheme(m){localStorage.setItem(THEME_KEY,m);applyTheme(m);document.querySelectorAll('.theme-toggle button').forEach(function(b){b.classList.toggle('active',b.dataset.theme===m);});}
function applyTheme(m){var a=m;if(m==='auto')a=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',a);}
function initTheme(){var s=localStorage.getItem(THEME_KEY)||'auto';applyTheme(s);document.querySelectorAll('.theme-toggle button').forEach(function(b){b.classList.toggle('active',b.dataset.theme===s);});}

/* ===== NAV ===== */
function showLoginPage(){document.getElementById('loading-screen').classList.add('hidden');document.getElementById('login-screen').classList.remove('hidden');document.getElementById('register-screen').classList.add('hidden');document.getElementById('app-container').classList.add('hidden');if(window.__forceHideLoading)window.__forceHideLoading();}
function showRegisterPage(){document.getElementById('loading-screen').classList.add('hidden');document.getElementById('login-screen').classList.add('hidden');document.getElementById('register-screen').classList.remove('hidden');document.getElementById('app-container').classList.add('hidden');refreshDaftarRoles();}
function switchLoginTab(t){['guru','siswa','admin'].forEach(function(x){var tb=document.getElementById('tab-login-'+x),fm=document.getElementById('form-login-'+x);if(tb)tb.classList.toggle('active',x===t);if(fm)fm.classList.toggle('hidden',x!==t);});}
function togglePw(id,b){var i=document.getElementById(id);i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🚫';}

/* ===== CONFIG ===== */
const ADMIN_ACCOUNT={email:'fikri.yassaar15@guru.smp.belajar.id',password:'#Smpn10smd',name:'Fikri Yassaar Arrazaq, S.Sn. (Admin)'};
const DEFAULT_TEACHERS=[{email:'fikri.yassaar15@guru.smp.belajar.id',password:'#Smpn10smd',name:'Fikri Yassaar Arrazaq, S.Sn.'}];
const DEFAULT_STUDENT_PASSWORD='#Smpn10smd';

/* [FIX #3] DEMO DATA DIHAPUS — tidak ada seedAllDemoData */

const DEFAULT_STAGES=[
  {id:'stage1',name:'Perencanaan',subtitle:'Pra-Produksi',description:'Penyusunan konsep, jadwal, RAB, dan pembagian tugas.',weight:20,longDesc:'Tahap perencanaan sebelum latihan dimulai.'},
  {id:'stage2',name:'Pelaksanaan',subtitle:'Produksi & Latihan',description:'Latihan rutin, eksekusi tugas, dan koordinasi tim.',weight:35,longDesc:'Tahap terlama dalam proyek. Termasuk absensi 15%.'},
  {id:'stage3',name:'Pertunjukan',subtitle:'Show Time',description:'Penampilan panggung pada hari-H pertunjukan.',weight:35,longDesc:'Hari puncak!'},
  {id:'stage4',name:'Evaluasi',subtitle:'Pasca-Produksi',description:'Laporan, dokumentasi, dan refleksi akhir.',weight:10,longDesc:'Tahap akhir setelah pertunjukan.'}
];
const ROLES={
  pimpinan_produksi:{label:'Pimpinan Produksi',team:'produksi'},sekretaris:{label:'Sekretaris',team:'produksi'},bendahara:{label:'Bendahara',team:'produksi'},
  koor_publikasi:{label:'Koor. Publikasi & Dokumentasi',team:'produksi'},koor_perlengkapan:{label:'Koor. Perlengkapan & Peralatan',team:'produksi'},koor_akomodasi:{label:'Koor. Akomodasi & Transportasi',team:'produksi'},
  anggota_publikasi:{label:'Anggota Publikasi',team:'produksi'},anggota_perlengkapan:{label:'Anggota Perlengkapan',team:'produksi'},anggota_akomodasi:{label:'Anggota Akomodasi',team:'produksi'},
  sutradara:{label:'Sutradara',team:'artistik'},asisten_sutradara:{label:'Asisten Sutradara',team:'artistik'},pemain:{label:'Pemain / Aktor',team:'artistik'},
  koor_panggung:{label:'Koor. Tata Pentas/Panggung',team:'artistik'},koor_musik:{label:'Koor. Musik & Suara',team:'artistik'},koor_busana:{label:'Koor. Busana & Kostum',team:'artistik'},koor_rias:{label:'Koor. Rias',team:'artistik'},koor_cahaya:{label:'Koor. Cahaya',team:'artistik'},
  anggota_panggung:{label:'Anggota Panggung',team:'artistik'},anggota_musik:{label:'Anggota Musik',team:'artistik'},anggota_busana:{label:'Anggota Busana',team:'artistik'},anggota_rias:{label:'Anggota Rias',team:'artistik'},anggota_cahaya:{label:'Anggota Cahaya',team:'artistik'}
};
const RUBRICS={
  pimpinan_produksi:[{id:'pp1',name:'Perencanaan & Pengelolaan Produksi',desc:'Rencana sangat detail',weight:20,scale:'4=Sebelum deadline · 3=Tepat · 2=Mundur · 1=Gagal'},{id:'pp2',name:'Seleksi & Pengaturan Tim',desc:'Penempatan sesuai kemampuan',weight:15,scale:'4=100% pas · 3=Sesuai · 2=Salah tempat · 1=Asal'},{id:'pp3',name:'Manajemen Anggaran',desc:'Efisien, transparan',weight:15,scale:'4=Efisien · 3=Sesuai · 2=Kurang rapi · 1=Tidak jelas'},{id:'pp4',name:'Koordinasi Lintas Divisi',desc:'Produksi & Artistik harmonis',weight:20,scale:'4=Harmonis · 3=Baik · 2=Kaku · 1=Tidak ada'},{id:'pp5',name:'Penyelesaian Masalah',desc:'Solusi cepat & tepat',weight:15,scale:'4=Cepat · 3=Cepat · 2=Lambat · 1=Tidak mampu'},{id:'pp6',name:'Evaluasi & Pelaporan',desc:'Laporan lengkap',weight:15,scale:'4=Lengkap · 3=Lengkap · 2=Kurang · 1=Tidak ada'}],
  sekretaris:[{id:'sk1',name:'Dokumentasi & Arsip',desc:'Arsip rapi & lengkap',weight:20,scale:'4=Rapi & lengkap · 3=Rapi · 2=Berantakan · 1=Hilang'},{id:'sk2',name:'Penjadwalan',desc:'Jadwal jauh hari',weight:20,scale:'4=Jauh hari · 3=Tepat · 2=Mendadak · 1=Tidak ada'},{id:'sk3',name:'Korespondensi & Komunikasi',desc:'Informasi jelas',weight:20,scale:'4=Jelas · 3=Tepat · 2=Terlambat · 1=Salah'},{id:'sk4',name:'Administrasi Anggaran',desc:'Sangat teliti',weight:15,scale:'4=Sangat teliti · 3=Sesuai · 2=Kurang · 1=Tidak'},{id:'sk5',name:'Penyusunan Laporan',desc:'Laporan sangat rapi',weight:25,scale:'4=H+1 rapi · 3=H+3 · 2=H+7 · 1=Tidak ada'}],
  bendahara:[{id:'bd1',name:'Pencatatan Transaksi',desc:'Detail & real-time',weight:25,scale:'4=Detail · 3=Ada nota · 2=Kurang · 1=Tidak ada'},{id:'bd2',name:'Pengelolaan Keuangan',desc:'Transparan & efisien',weight:25,scale:'4=Transparan · 3=Sesuai · 2=Kurang · 1=Tidak jelas'},{id:'bd3',name:'Perencanaan Anggaran (RAB)',desc:'Realistis & detail',weight:20,scale:'4=Realistis · 3=Realistis · 2=Revisi · 1=Tidak ada'},{id:'bd4',name:'Pelaporan Keuangan',desc:'Akurat & tepat waktu',weight:30,scale:'4=Mingguan · 3=Akhir · 2=Terlambat · 1=Tidak ada'}],
  koor_produksi:[{id:'kp1',name:'Penyediaan Kebutuhan Divisi',desc:'Lengkap sebelum deadline',weight:30,scale:'4=Sebelum · 3=Tepat · 2=Telat · 1=Tidak ada'},{id:'kp2',name:'Pengelolaan Anggota',desc:'Anggota maksimal',weight:25,scale:'4=Maksimal · 3=Sesuai · 2=Diperintah · 1=Tidak terkontrol'},{id:'kp3',name:'Koordinasi Teknis',desc:'Sangat lancar',weight:25,scale:'4=Lancar · 3=Baik · 2=Kaku · 1=Tidak ada'},{id:'kp4',name:'Pelaporan Kinerja',desc:'Detail & tepat waktu',weight:20,scale:'4=Detail · 3=Tepat · 2=Terlambat · 1=Tidak ada'}],
  sutradara:[{id:'sr1',name:'Pengembangan Konsep',desc:'Sangat unik & mendalam',weight:20,scale:'4=Unik · 3=Jelas · 2=Biasa · 1=Tidak ada'},{id:'sr2',name:'Casting / Pemilihan Pemain',desc:'100% pas',weight:15,scale:'4=100% pas · 3=Sesuai · 2=Kurang pas · 1=Asal'},{id:'sr3',name:'Pengarahan Pemain',desc:'Blocking sempurna',weight:25,scale:'4=Sempurna · 3=Baik · 2=Lupa · 1=Tidak mampu'},{id:'sr4',name:'Koordinasi Artistik',desc:'Semua elemen menyatu',weight:20,scale:'4=Menyatu · 3=Selaras · 2=Kurang · 1=Berantakan'},{id:'sr5',name:'Rekayasa Emosi & Atmosfer',desc:'Sangat dramatis',weight:20,scale:'4=Dramatis · 3=Baik · 2=Datar · 1=Tidak ada'}],
  asisten_sutradara:[{id:'as1',name:'Koordinasi & Logistik',desc:'Logistik siap',weight:20,scale:'4=Siap · 3=Tepat · 2=Telat · 1=Tidak siap'},{id:'as2',name:'Pencatatan',desc:'Catatan lengkap',weight:15,scale:'4=Lengkap · 3=Baik · 2=Kurang · 1=Tidak ada'},{id:'as3',name:'Koordinasi dengan Pemain',desc:'Komunikasi efektif',weight:20,scale:'4=Efektif · 3=Baik · 2=Kurang · 1=Tidak ada'},{id:'as4',name:'Bantu Koordinasi Teknis',desc:'Proaktif membantu',weight:20,scale:'4=Proaktif · 3=Diminta · 2=Kurang · 1=Tidak'},{id:'as5',name:'Mengatur Latihan Kelompok',desc:'Mampu memimpin',weight:15,scale:'4=Mampu · 3=Mampu · 2=Ragu · 1=Tidak bisa'},{id:'as6',name:'Backup Sutradara',desc:'Siap menggantikan',weight:10,scale:'4=Siap · 3=Siap · 2=Kurang · 1=Tidak bisa'}],
  pemain:[{id:'pm1',name:'Penguasaan Naskah',desc:'Hafal 100%',weight:25,scale:'4=Hafal · 3=Hafal · 2=Lupa · 1=Tidak hafal'},{id:'pm2',name:'Ekspresi & Emosi',desc:'Mendalam',weight:25,scale:'4=Mendalam · 3=Sesuai · 2=Datar · 1=Tidak ada'},{id:'pm3',name:'Blocking & Posisi',desc:'Sangat presisi',weight:20,scale:'4=Presisi · 3=Sesuai · 2=Sering salah · 1=Tidak ikut'},{id:'pm4',name:'Kerja Sama Antar Pemain',desc:'Natural',weight:15,scale:'4=Natural · 3=Baik · 2=Kurang · 1=Tidak peduli'},{id:'pm5',name:'Konsistensi Latihan',desc:'100% hadir',weight:15,scale:'4=100% · 3=Disiplin · 2=Telat · 1=Absen'}],
  koor_artistik:[{id:'ka1',name:'Desain & Konsep',desc:'Sangat kreatif',weight:25,scale:'4=Kreatif · 3=Baik · 2=Biasa · 1=Tidak ada'},{id:'ka2',name:'Eksekusi Teknis',desc:'Rapi & sebelum deadline',weight:30,scale:'4=Rapi · 3=Tepat · 2=Terlambat · 1=Berantakan'},{id:'ka3',name:'Koordinasi dengan Tim',desc:'Komunikatif',weight:25,scale:'4=Proaktif · 3=Baik · 2=Kurang · 1=Tidak ada'},{id:'ka4',name:'Pengelolaan Anggota',desc:'Anggota maksimal',weight:20,scale:'4=Maksimal · 3=Sesuai · 2=Diperintah · 1=Tidak terkontrol'}],
  anggota:[{id:'ag1',name:'Penyelesaian Tugas',desc:'Selesai sebelum deadline',weight:30,scale:'4=Sebelum · 3=Tepat · 2=Terlambat · 1=Tidak selesai'},{id:'ag2',name:'Kualitas Kerja',desc:'Teliti & rapi',weight:25,scale:'4=Melebihi · 3=Baik · 2=Kurang · 1=Berantakan'},{id:'ag3',name:'Kerja Sama Tim',desc:'Proaktif membantu',weight:25,scale:'4=Proaktif · 3=Baik · 2=Disuruh · 1=Tidak mau'},{id:'ag4',name:'Inisiatif',desc:'Aktif membantu',weight:10,scale:'4=Aktif · 3=Sesekali · 2=Pasif · 1=Tidak ada'},{id:'ag5',name:'Kedisiplinan',desc:'100% hadir',weight:10,scale:'4=100% · 3=Jarang absen · 2=Telat · 1=Sering absen'}]
};
function getRubricFor(r){if(r==='pimpinan_produksi')return RUBRICS.pimpinan_produksi;if(r==='sekretaris')return RUBRICS.sekretaris;if(r==='bendahara')return RUBRICS.bendahara;if(r==='sutradara')return RUBRICS.sutradara;if(r==='asisten_sutradara')return RUBRICS.asisten_sutradara;if(r==='pemain')return RUBRICS.pemain;if(['koor_publikasi','koor_perlengkapan','koor_akomodasi'].indexOf(r)>=0)return RUBRICS.koor_produksi;if(['koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya'].indexOf(r)>=0)return RUBRICS.koor_artistik;return RUBRICS.anggota;}
function getEvaluatorRoles(t){var m={pimpinan_produksi:['guru','sutradara','sekretaris','bendahara','asisten_sutradara','koor_publikasi','koor_perlengkapan','koor_akomodasi','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya'],sutradara:['guru','pimpinan_produksi','asisten_sutradara','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya','pemain'],sekretaris:['pimpinan_produksi'],bendahara:['pimpinan_produksi'],asisten_sutradara:['sutradara','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya'],koor_publikasi:['pimpinan_produksi','anggota_publikasi'],koor_perlengkapan:['pimpinan_produksi','anggota_perlengkapan'],koor_akomodasi:['pimpinan_produksi','anggota_akomodasi'],koor_panggung:['sutradara','asisten_sutradara','anggota_panggung'],koor_musik:['sutradara','asisten_sutradara','anggota_musik'],koor_busana:['sutradara','asisten_sutradara','anggota_busana'],koor_rias:['sutradara','asisten_sutradara','anggota_rias'],koor_cahaya:['sutradara','asisten_sutradara','anggota_cahaya'],pemain:['sutradara','asisten_sutradara','pemain'],anggota_publikasi:['koor_publikasi','anggota_publikasi'],anggota_perlengkapan:['koor_perlengkapan','anggota_perlengkapan'],anggota_akomodasi:['koor_akomodasi','anggota_akomodasi'],anggota_panggung:['koor_panggung','anggota_panggung'],anggota_musik:['koor_musik','anggota_musik'],anggota_busana:['koor_busana','anggota_busana'],anggota_rias:['koor_rias','anggota_rias'],anggota_cahaya:['koor_cahaya','anggota_cahaya']};return m[t]||[];}
function canEvaluate(e,t){return getEvaluatorRoles(t).indexOf(e)>=0;}
function canGuruEvaluate(t){return ['pimpinan_produksi','sutradara'].indexOf(t)>=0;}
var KETUA_ROLES=['pimpinan_produksi','sutradara'];

/* ===== DIVISIONS ===== */
const DIVISIONS={
  produksi:{label:'Tim Produksi',roles:['pimpinan_produksi','sekretaris','bendahara','koor_publikasi','koor_perlengkapan','koor_akomodasi','anggota_publikasi','anggota_perlengkapan','anggota_akomodasi']},
  artistik:{label:'Tim Artistik',roles:['sutradara','asisten_sutradara','pemain','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya','anggota_panggung','anggota_musik','anggota_busana','anggota_rias','anggota_cahaya']}
};
function getDivisionOfRole(role){for(var d in DIVISIONS){if(DIVISIONS[d].roles.indexOf(role)>=0)return d;}return 'produksi';}
window.DIVISIONS=DIVISIONS;
window.getDivisionOfRole=getDivisionOfRole;

/* ===== FIREBASE INIT ===== */
var firebaseReady=false, fb=null, firebaseError='';
try{
  if(typeof firebase==='undefined'){firebaseError='Firebase SDK tidak termuat';throw new Error(firebaseError);}
  var cfg=window.FIREBASE_CONFIG;
  if(!cfg||!cfg.apiKey||cfg.apiKey.indexOf('GANTI')>=0){firebaseError='Firebase config belum diisi di index.html';throw new Error(firebaseError);}
  if(!firebase.apps.length)firebase.initializeApp(cfg);
  fb=firebase.firestore();
  try{fb.enablePersistence({synchronizeTabs:true}).catch(function(){});}catch(e){}
  firebaseReady=true;
  console.log('Firebase ready');
}catch(e){console.error('Firebase init:',e.message);firebaseError=e.message||'Firebase gagal inisialisasi';}

function uid(){return 'id_'+Math.random().toString(36).substr(2,9)+Date.now().toString(36);}
function genClassCode(n){var c=(n||'KLS').replace(/[^A-Z0-9]/gi,'').toUpperCase().substring(0,4);return c+'-'+Math.floor(1000+Math.random()*9000);}

/* ============================================================
   [FIX #2] SANITIZE — buang semua `undefined` sebelum kirim ke Firestore
   ============================================================ */
function sanitizeFirestore(obj){
  if(obj===undefined) return null;
  if(obj===null) return null;
  if(typeof obj!=='object') return obj;
  if(Array.isArray(obj)) return obj.map(function(v){return sanitizeFirestore(v);}).filter(function(v){return v!==undefined;});
  var clean={};
  for(var k in obj){
    if(!Object.prototype.hasOwnProperty.call(obj,k)) continue;
    var v=obj[k];
    if(v===undefined) continue; // ← KUNCI FIX: buang field undefined
    var cv=sanitizeFirestore(v);
    if(cv!==undefined) clean[k]=cv;
  }
  return clean;
}

/* ===== DB STATE ===== */
var DB={teachers:[],classes:[],evaluations:{},deadlines:{},activeStages:{},notifications:[],stages:JSON.parse(JSON.stringify(DEFAULT_STAGES)),checklists:{},waLogs:[],meetings:{},activityLogs:[]};
var currentUser=null;
var unsubs=[];
var resetCodes={};

/* ===== FIRESTORE WRITE HELPERS (dengan sanitize) ===== */
function fbSetTeacher(t){if(!firebaseReady)return Promise.resolve();return fb.collection('teachers').doc(t.email.toLowerCase()).set(sanitizeFirestore(t),{merge:true});}
function fbDelTeacher(email){if(!firebaseReady)return Promise.resolve();return fb.collection('teachers').doc(email.toLowerCase()).delete();}
function fbSetClass(c){if(!firebaseReady)return Promise.resolve();var o=Object.assign({},c);delete o._id;return fb.collection('classes').doc(c.id).set(sanitizeFirestore(o),{merge:false});}
function fbSetEval(cid,tid,data){if(!firebaseReady)return Promise.resolve();var o={classId:cid,targetId:tid};for(var k in data)o[k]=data[k];return fb.collection('evaluations').doc(cid+'__'+tid).set(sanitizeFirestore(o),{merge:false});}
function fbSetDeadlines(cid,data){if(!firebaseReady)return Promise.resolve();var o={classId:cid};for(var k in data)o[k]=data[k];return fb.collection('deadlines').doc(cid).set(sanitizeFirestore(o),{merge:false});}
function fbSetActiveStages(cid,data){if(!firebaseReady)return Promise.resolve();var o={classId:cid};for(var k in data)o[k]=data[k];return fb.collection('activeStages').doc(cid).set(sanitizeFirestore(o),{merge:false});}
function fbAddNotif(n){if(!firebaseReady)return Promise.resolve();return fb.collection('notifications').doc(n.id).set(sanitizeFirestore(n));}
function fbDelNotif(id){if(!firebaseReady)return Promise.resolve();return fb.collection('notifications').doc(id).delete();}
function fbSetStages(stages){if(!firebaseReady)return Promise.resolve();return fb.collection('config').doc('stages').set(sanitizeFirestore({stages:stages}));}
function fbAddActivity(a){if(!firebaseReady)return Promise.resolve();return fb.collection('activity_logs').doc(a.id).set(sanitizeFirestore(a));}

/* ===== SESSION ===== */
const SESSION_KEY='sppt_session';
function saveSession(){if(!currentUser)return;try{localStorage.setItem(SESSION_KEY,JSON.stringify({type:currentUser.type,email:currentUser.email||'',name:currentUser.name||'',classId:currentUser.classId||'',studentId:currentUser.studentId||'',role:currentUser.role||'',phone:currentUser.phone||''}));}catch(e){}}
function clearSession(){try{localStorage.removeItem(SESSION_KEY);}catch(e){}}
function getSession(){try{var s=localStorage.getItem(SESSION_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}

/* ============================================================
   [FIX #1] myClasses — filter kelas sesuai pemilik (guru)
   ============================================================ */
function myClasses(){
  if(!currentUser) return [];
  if(currentUser.type==='admin') return DB.classes.slice();
  if(currentUser.type==='guru'){
    var email=String(currentUser.email||'').toLowerCase();
    return DB.classes.filter(function(c){
      return c.teacherEmail && String(c.teacherEmail).toLowerCase()===email;
    });
  }
  if(currentUser.type==='siswa'){
    return DB.classes.filter(function(c){return c.id===currentUser.classId;});
  }
  return [];
}
function ownsClass(cid){
  if(!currentUser) return false;
  if(currentUser.type==='admin') return true;
  if(currentUser.type==='guru'){
    var c=DB.classes.find(function(x){return x.id===cid;});
    return !!(c && c.teacherEmail && String(c.teacherEmail).toLowerCase()===String(currentUser.email||'').toLowerCase());
  }
  if(currentUser.type==='siswa') return currentUser.classId===cid;
  return false;
}
window.myClasses=myClasses;
window.ownsClass=ownsClass;

/* ===== REALTIME SUBSCRIBE ===== */
function debouncedRender(){
  if(window._renderTimer)clearTimeout(window._renderTimer);
  window._renderTimer=setTimeout(function(){
    window._renderTimer=null;
    if(!currentUser)return;
    try{
      if(currentUser.type==='guru')renderGuruDashboard();
      else if(currentUser.type==='siswa')renderSiswaDashboard();
      else if(currentUser.type==='admin')renderAdminDashboard();
    }catch(e){console.error('Render:',e);}
  },350);
}

function logActivity(type,message,meta){
  /* [FIX #2] meta di-sanitize sebelum disimpan */
  var safeMeta = sanitizeFirestore(meta||{});
  var a={
    id:uid(),
    type:type||'info',
    message:message||'',
    meta:safeMeta,
    classId:(currentUser&&currentUser.classId)||(safeMeta&&safeMeta.classId)||'',
    userId:(currentUser&&(currentUser.studentId||currentUser.email))||'system',
    userName:currentUser?currentUser.name:'System',
    createdAt:Date.now()
  };
  fbAddActivity(a);
}

function subscribeAll(){
  if(!firebaseReady)return;

  unsubs.push(fb.collection('teachers').onSnapshot(function(snap){
    DB.teachers=snap.docs.map(function(d){return d.data();});
    if(DB.teachers.length===0){DEFAULT_TEACHERS.forEach(function(t){fbSetTeacher(t);});}
    if(currentUser&&currentUser.type==='admin')debouncedRender();
  },function(e){console.error('teachers:',e.message);}));

  /* [FIX #3] Tidak ada seeding demo kelas */
  unsubs.push(fb.collection('classes').onSnapshot(function(snap){
    DB.classes=snap.docs.map(function(d){var o=d.data();o.id=d.id;return o;});
    refreshClassDropdown();
    if(currentUser&&currentUser.type==='siswa'){
      var c=DB.classes.find(function(x){return x.id===currentUser.classId;});
      if(c){var s=c.students.find(function(x){return x.id===currentUser.studentId;});if(s){currentUser.name=s.name;currentUser.role=s.role;}}
    }
    if(currentUser)debouncedRender();
  },function(e){console.error('classes:',e.message);}));

  unsubs.push(fb.collection('evaluations').onSnapshot(function(snap){
    var ev={};
    snap.docs.forEach(function(d){
      var dt=d.data(),cid=dt.classId,tid=dt.targetId;
      if(!cid||!tid)return;
      ev[cid]=ev[cid]||{};ev[cid][tid]=ev[cid][tid]||{};
      for(var k in dt){if(k==='classId'||k==='targetId')continue;ev[cid][tid][k]=dt[k];}
    });
    DB.evaluations=ev;if(currentUser)debouncedRender();
  },function(e){console.error('evaluations:',e.message);}));

  unsubs.push(fb.collection('deadlines').onSnapshot(function(snap){
    var dl={};
    snap.docs.forEach(function(d){var dt=d.data(),cid=dt.classId||d.id,obj={};for(var k in dt){if(k!=='classId')obj[k]=dt[k];}dl[cid]=obj;});
    DB.deadlines=dl;if(currentUser)debouncedRender();
  },function(e){console.error('deadlines:',e.message);}));

  unsubs.push(fb.collection('activeStages').onSnapshot(function(snap){
    var a={};
    snap.docs.forEach(function(d){var dt=d.data(),cid=dt.classId||d.id,obj={};for(var k in dt){if(k!=='classId')obj[k]=dt[k];}a[cid]=obj;});
    DB.activeStages=a;if(currentUser)debouncedRender();
  },function(e){console.error('activeStages:',e.message);}));

  unsubs.push(fb.collection('notifications').orderBy('createdAt','desc').limit(100).onSnapshot(function(snap){
    DB.notifications=snap.docs.map(function(d){return d.data();});
    if(currentUser){
      updateNotifBadge();
      var np=document.getElementById('notif-panel');
      if(np&&np.classList.contains('open'))renderNotifPanel();
      debouncedRender();
    }
  },function(e){console.error('notifications:',e.message);}));

  unsubs.push(fb.collection('config').doc('stages').onSnapshot(function(doc){
    if(doc.exists&&doc.data().stages){DB.stages=doc.data().stages;}else{fbSetStages(DB.stages);}
    if(currentUser)debouncedRender();
  },function(e){console.error('config:',e.message);}));

  unsubs.push(fb.collection('checklists').onSnapshot(function(snap){
    var ch={};
    snap.docs.forEach(function(d){var dt=d.data();ch[dt.classId||d.id]={items:dt.items||[]};});
    DB.checklists=ch;if(currentUser)debouncedRender();
  },function(e){console.error('checklists:',e.message);}));

  unsubs.push(fb.collection('wa_logs').orderBy('createdAt','desc').limit(200).onSnapshot(function(snap){
    DB.waLogs=snap.docs.map(function(d){return d.data();});
    if(currentUser&&currentUser.type==='guru'&&document.getElementById('wa-logs-view')){renderWaLogsBody();}
  },function(e){console.error('wa_logs:',e.message);}));

  unsubs.push(fb.collection('meetings').orderBy('createdAt','desc').limit(200).onSnapshot(function(snap){
    var m={};
    snap.docs.forEach(function(d){m[d.id]=Object.assign({id:d.id},d.data());});
    DB.meetings=m;if(currentUser)debouncedRender();
  },function(e){console.error('meetings:',e.message);}));

  unsubs.push(fb.collection('activity_logs').orderBy('createdAt','desc').limit(200).onSnapshot(function(snap){
    DB.activityLogs=snap.docs.map(function(d){return Object.assign({id:d.id},d.data());});
    if(currentUser)debouncedRender();
  },function(e){console.error('activity_logs:',e.message);}));
}

/* ===== UTILITIES ===== */
function getStage(id){return DB.stages.find(function(s){return s.id===id;});}
function getTotalWeight(){return DB.stages.reduce(function(s,x){return s+Number(x.weight||0);},0)||1;}
function isStageActive(c,s){return DB.activeStages[c]&&DB.activeStages[c][s]===true;}
function fmtDate(ts){return new Date(ts).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function fmtDateShort(s){if(!s)return '-';return new Date(s).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});}
function isOverdue(s){if(!s)return false;var d=new Date(s);d.setHours(23,59,59,999);return Date.now()>d.getTime();}
function getDeadline(c,s){return DB.deadlines[c]&&DB.deadlines[c][s]?DB.deadlines[c][s]:null;}
function isStageDoneFor(c,t,e,s){var x=DB.evaluations[c]&&DB.evaluations[c][t]&&DB.evaluations[c][t][e]&&DB.evaluations[c][t][e][s];return x&&Object.keys(x).length>0;}
function getProgressForTarget(c,t,e){var a=DB.stages.filter(function(s){return isStageActive(c,s.id);});var d=0;a.forEach(function(s){if(isStageDoneFor(c,t,e,s.id))d++;});return{done:d,total:a.length};}
function getOverallProgress(c,e){
  var cls=DB.classes.find(function(x){return x.id===c;});if(!cls)return{done:0,total:0,pct:0,byStage:{},targetCount:0,activeStageCount:0};
  var me=cls.students.find(function(s){return s.id===e;});if(!me)return{done:0,total:0,pct:0,byStage:{},targetCount:0,activeStageCount:0};
  var targets=cls.students.filter(function(s){return s.id!==me.id&&canEvaluate(me.role,s.role);});
  var active=DB.stages.filter(function(s){return isStageActive(c,s.id);});
  var total=targets.length*active.length,done=0,byStage={};
  DB.stages.forEach(function(s){byStage[s.id]={done:0,total:isStageActive(c,s.id)?targets.length:0,active:isStageActive(c,s.id),name:s.name};});
  targets.forEach(function(t){active.forEach(function(s){if(isStageDoneFor(c,t.id,e,s.id)){done++;byStage[s.id].done++;}});});
  return{done:done,total:total,pct:total>0?Math.round(done/total*100):0,byStage:byStage,targetCount:targets.length,activeStageCount:active.length};
}
function hasUserAssessed(c,t,e){var v=DB.evaluations[c]&&DB.evaluations[c][t]&&DB.evaluations[c][t][e];return v&&Object.keys(v).length>0;}
function countAssessors(c,t){var v=DB.evaluations[c]&&DB.evaluations[c][t];if(!v)return 0;var n=0;for(var k in v){if(Object.keys(v[k]).length>0)n++;}return n;}

/* ============================================================
   [FIX #1 + #4] NOTIFICATIONS — filter per guru + tampil utk semua role
   ============================================================ */
function getNotifsFor(u){
  if(!u)return[];
  if(u.type==='siswa'){
    return DB.notifications.filter(function(n){return n.classId===u.classId&&(n.toId===u.studentId||n.toId==='all');});
  }
  if(u.type==='guru'){
    /* [FIX #1] hanya notifikasi dari kelas milik guru ini */
    var myIds=myClasses().map(function(c){return c.id;});
    return DB.notifications.filter(function(n){
      if(!n.classId) return false;
      return myIds.indexOf(n.classId)>=0;
    });
  }
  if(u.type==='admin'){
    /* Admin melihat semua notifikasi */
    return DB.notifications.slice();
  }
  return[];
}
function getUserKey(){if(!currentUser)return null;if(currentUser.type==='siswa')return currentUser.studentId;if(currentUser.type==='guru')return 'guru:'+String(currentUser.email||'').toLowerCase();return 'admin';}
function getUnreadCount(){return getNotifsFor(currentUser).filter(function(n){return !(n.readBy&&n.readBy.indexOf(getUserKey())>=0);}).length;}
function updateNotifBadge(){
  var b=document.getElementById('notif-btn'),bd=document.getElementById('notif-badge');
  if(!b||!bd)return;
  /* [FIX #4] Semua role (siswa/guru/admin) menampilkan tombol notifikasi */
  if(!currentUser){b.classList.add('hidden');return;}
  b.classList.remove('hidden');
  var u=getUnreadCount();
  if(u>0){bd.classList.remove('hidden');bd.textContent=u;}
  else{bd.classList.add('hidden');}
}
function openNotifPanel(){document.getElementById('notif-panel').classList.add('open');document.getElementById('notif-backdrop').classList.add('open');renderNotifPanel();}
function closeNotifPanel(){document.getElementById('notif-panel').classList.remove('open');document.getElementById('notif-backdrop').classList.remove('open');}
function renderNotifPanel(){
  var b=document.getElementById('notif-panel-body');
  var m=getNotifsFor(currentUser).sort(function(a,b){return b.createdAt-a.createdAt;});
  if(m.length===0){b.innerHTML='<div class="notif-empty">'+ico('bell','lg')+'<p style="margin-top:10px">Belum ada notifikasi</p></div>';return;}
  var uk=getUserKey(),h='';
  m.forEach(function(n){
    var r=n.readBy&&n.readBy.indexOf(uk)>=0,t=n.type||'info';
    var tl={tugas:'Tugas',instruksi:'Instruksi',info:'Info',urgent:'Penting'}[t]||'Info';
    var tc={tugas:'notif-type-tugas',instruksi:'notif-type-instruksi',info:'notif-type-info',urgent:'notif-type-urgent'}[t]||'notif-type-info';
    h+='<div class="notif-item '+(r?'':'unread')+'"><div class="notif-header"><span class="notif-type '+tc+'">'+tl+'</span><span class="notif-time">'+fmtDate(n.createdAt)+'</span></div><div class="notif-title">'+(n.title||'Notifikasi')+'</div><div class="notif-from">Dari: <b>'+(n.fromName||'Guru')+'</b></div><div class="notif-msg">'+n.message+'</div><div class="notif-actions">'+(!r?'<button class="btn btn-sm btn-ghost" onclick="markNotifRead(\''+n.id+'\')">'+ico('check')+' Dibaca</button>':'<span class="badge badge-success">'+ico('check')+' Dibaca</span>')+(currentUser.type==='siswa'&&t==='tugas'?'<button class="btn btn-sm btn-ghost" onclick="markTaskDone(\''+n.id+'\')">'+ico('checkSquare')+' '+(n.doneBy&&n.doneBy.indexOf(uk)>=0?'Selesai':'Tandai')+'</button>':'')+'<button class="btn btn-sm btn-ghost" onclick="deleteNotif(\''+n.id+'\')">'+ico('trash')+'</button></div></div>';
  });
  b.innerHTML=h;
}
function markNotifRead(id){var n=DB.notifications.find(function(x){return x.id===id;});if(!n)return;var uk=getUserKey(),rb=n.readBy||[];if(rb.indexOf(uk)<0)rb.push(uk);fbAddNotif(Object.assign({},n,{readBy:rb}));}
function markTaskDone(id){var n=DB.notifications.find(function(x){return x.id===id;});if(!n)return;var uk=getUserKey(),db=n.doneBy||[];if(db.indexOf(uk)<0){db.push(uk);fbAddNotif(Object.assign({},n,{doneBy:db}));logActivity('task_done',currentUser.name+' menandai tugas selesai: '+n.title,{classId:currentUser.classId});alert('Ditandai selesai!');}}
function deleteNotif(id){if(!confirm('Hapus?'))return;fbDelNotif(id);}

/* ===== LOGIN/REGISTER ===== */
function refreshClassDropdown(){
  var s=document.getElementById('siswa-kelas');if(!s)return;
  s.innerHTML='<option value="">-- Pilih Kelas --</option>';
  DB.classes.forEach(function(c){s.innerHTML+='<option value="'+c.id+'">'+c.name+'</option>';});
}
function refreshDaftarRoles(){
  var s=document.getElementById('daftar-role');if(!s)return;
  var o='<option value="">-- Pilih Peran --</option><optgroup label="— Tim Produksi —">';
  ['pimpinan_produksi','sekretaris','bendahara','koor_publikasi','koor_perlengkapan','koor_akomodasi','anggota_publikasi','anggota_perlengkapan','anggota_akomodasi'].forEach(function(k){o+='<option value="'+k+'">'+ROLES[k].label+'</option>';});
  o+='</optgroup><optgroup label="— Tim Artistik —">';
  ['sutradara','asisten_sutradara','pemain','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya','anggota_panggung','anggota_musik','anggota_busana','anggota_rias','anggota_cahaya'].forEach(function(k){o+='<option value="'+k+'">'+ROLES[k].label+'</option>';});
  o+='</optgroup>';s.innerHTML=o;
}

function loginGuru(){
  var e=document.getElementById('guru-email').value.trim().toLowerCase();
  var p=document.getElementById('guru-password').value;
  var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===e&&x.password===p;});
  if(t){currentUser={type:'guru',email:t.email,name:t.name};saveSession();showApp();}
  else alert('Email atau password salah!');
}
function loginSiswa(){
  var cid=document.getElementById('siswa-kelas').value;
  var idInput=document.getElementById('siswa-email').value.trim();
  var p=document.getElementById('siswa-password').value;
  if(!cid||!idInput||!p){alert('Lengkapi!');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});
  if(!c){alert('Kelas tidak ditemukan!');return;}
  var isEmail=idInput.indexOf('@')>=0,emailLower=idInput.toLowerCase(),phoneClean=idInput.replace(/\D/g,'');
  var s=c.students.find(function(x){
    if(x.password!==p)return false;
    if(isEmail)return x.email&&x.email.toLowerCase()===emailLower;
    return x.phone&&x.phone.replace(/\D/g,'')===phoneClean;
  });
  if(!s){alert('Email/WA atau password salah!');return;}
  currentUser={type:'siswa',classId:cid,studentId:s.id,name:s.name,role:s.role,phone:s.phone||''};
  saveSession();showApp();
}
function loginAdmin(){
  var e=document.getElementById('admin-email').value.trim().toLowerCase();
  var p=document.getElementById('admin-password').value;
  if(e===ADMIN_ACCOUNT.email.toLowerCase()&&p===ADMIN_ACCOUNT.password){
    currentUser={type:'admin',email:ADMIN_ACCOUNT.email,name:ADMIN_ACCOUNT.name};
    saveSession();showApp();
  } else alert('Email atau password admin salah!');
}

function registerSiswa(){
  var code=document.getElementById('daftar-code').value.trim().toUpperCase();
  var name=document.getElementById('daftar-name').value.trim();
  var email=document.getElementById('daftar-email').value.trim().toLowerCase();
  var pw=document.getElementById('daftar-password').value;
  var cf=document.getElementById('daftar-confirm').value;
  var phoneEl=document.getElementById('daftar-phone');var phone=phoneEl?phoneEl.value.replace(/\D/g,''):'';
  var role=document.getElementById('daftar-role').value;
  if(!code||!name||!email||!pw||!cf||!role){alert('Lengkapi!');return;}
  if(!phone){alert('No. WA wajib!');return;}
  if(phone.length<10||phone.length>15){alert('Format WA tidak valid!');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Email tidak valid!');return;}
  if(pw.length<6){alert('Min 6!');return;}
  if(pw!==cf){alert('Konfirmasi tidak cocok!');return;}
  var cls=DB.classes.find(function(c){return c.code===code;});
  if(!cls){alert('Kode Kelas tidak valid!');return;}
  var dupEmail=false;DB.classes.forEach(function(c){if(c.students.some(function(s){return s.email&&s.email.toLowerCase()===email;}))dupEmail=true;});
  if(dupEmail){alert('Email terdaftar!');return;}
  var dupPhone=false;DB.classes.forEach(function(c){if(c.students.some(function(s){return s.phone&&s.phone===phone;}))dupPhone=true;});
  if(dupPhone){alert('No. WA terdaftar!');return;}
  var ns={id:uid(),name:name,email:email,phone:phone,password:pw,role:role,registeredAt:Date.now()};
  var newStudents=cls.students.concat([ns]);
  fbSetClass(Object.assign({},cls,{students:newStudents})).then(function(){
    fbAddNotif({
      id:uid(),classId:cls.id,fromId:ns.id,fromName:name,fromType:'siswa',
      toId:'guru',type:'info',title:'Siswa Baru',
      message:name+' ('+(ROLES[role]?ROLES[role].label:role)+') mendaftar di '+cls.name,
      createdAt:Date.now(),readBy:[],doneBy:[]
    });
    logActivity('student_register',name+' mendaftar sebagai '+(ROLES[role]?ROLES[role].label:role),{classId:cls.id});
    alert('Berhasil!\n\nNama: '+name+'\nKelas: '+cls.name);
    ['daftar-code','daftar-name','daftar-email','daftar-password','daftar-confirm','daftar-role','daftar-phone'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
    document.getElementById('siswa-kelas').value=cls.id;
    document.getElementById('siswa-email').value=email;
    showLoginPage();switchLoginTab('siswa');
  });
}

function logout(){
  currentUser=null;clearSession();
  document.getElementById('app-container').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('register-screen').classList.add('hidden');
  ['guru-email','guru-password','siswa-email','siswa-password','admin-email','admin-password'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});
  closeNotifPanel();refreshClassDropdown();switchLoginTab('guru');
}

function showApp(){
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('register-screen').classList.add('hidden');
  document.getElementById('app-container').classList.remove('hidden');
  document.getElementById('btn-change-pw').style.display=currentUser.type==='admin'?'none':'inline-flex';
  var l='';
  if(currentUser.type==='guru')l=ico('user')+' <span>'+currentUser.name+' — <b>Guru Pengampu</b></span>';
  else if(currentUser.type==='admin')l=ico('shield')+' <span>'+currentUser.name+' — <b>Administrator</b></span>';
  else{var c=DB.classes.find(function(x){return x.id===currentUser.classId;});l=ico('user')+' <span>'+currentUser.name+' — <b>'+(ROLES[currentUser.role]?ROLES[currentUser.role].label:currentUser.role)+'</b> — <b>Kelas '+(c?c.name:'-')+'</b></span>';}
  document.getElementById('user-info').innerHTML=l;
  updateNotifBadge();
  if(currentUser.type==='guru')renderGuruDashboard();
  else if(currentUser.type==='admin')renderAdminDashboard();
  else renderSiswaDashboard();
  if(window.__forceHideLoading)window.__forceHideLoading();
}

/* ===== LUPA PW / UBAH PW ===== */
var currentResetEmail=null;
function openForgotPassword(t){var l=t==='guru'?'Guru':'Siswa';openModal('Lupa Password '+l,'<div class="alert alert-info">'+ico('info')+'<div>Masukkan email terdaftar. Kode ditampilkan (demo).</div></div><div id="lupa-step1"><div class="form-group"><label>Email</label><input type="email" id="lupa-email"></div><button class="btn btn-primary btn-block" onclick="sendResetCode()">'+ico('send')+' Kirim Kode</button></div><div id="lupa-step2" class="hidden"><div class="alert alert-success">'+ico('checkCircle')+'<div>Kode terkirim!</div></div><div class="form-group"><label>Kode</label><input type="text" id="lupa-code" maxlength="6" style="text-align:center;font-size:20px;letter-spacing:.4em;"></div><div class="form-group pw-toggle"><label>Password Baru</label><input type="password" id="lupa-newpw"><button class="toggle-btn" onclick="togglePw(\'lupa-newpw\',this)" type="button">👁</button></div><div class="form-group pw-toggle"><label>Konfirmasi</label><input type="password" id="lupa-confirmpw"><button class="toggle-btn" onclick="togglePw(\'lupa-confirmpw\',this)" type="button">👁</button></div><button class="btn btn-primary btn-block" onclick="resetPassword()">'+ico('key')+' Reset</button></div>');}
function sendResetCode(){var e=document.getElementById('lupa-email').value.trim().toLowerCase();if(!e){alert('Masukkan email!');return;}var isG=DB.teachers.find(function(t){return t.email&&t.email.toLowerCase()===e;}),isS=false;DB.classes.forEach(function(c){if(c.students.some(function(s){return s.email&&s.email.toLowerCase()===e;}))isS=true;});if(!isG&&!isS){alert('Email tidak terdaftar!');return;}var code=Math.floor(100000+Math.random()*900000).toString();currentResetEmail=e;resetCodes[e]={code:code,expires:Date.now()+15*60*1000};alert('DEMO\nKode: '+code);document.getElementById('lupa-step1').classList.add('hidden');document.getElementById('lupa-step2').classList.remove('hidden');}
function resetPassword(){var c=document.getElementById('lupa-code').value.trim(),n=document.getElementById('lupa-newpw').value,cf=document.getElementById('lupa-confirmpw').value;if(!c||!n||!cf){alert('Lengkapi!');return;}if(n.length<6){alert('Min 6!');return;}if(n!==cf){alert('Konfirmasi tidak cocok!');return;}var s=resetCodes[currentResetEmail];if(!s||Date.now()>s.expires){alert('Kode kedaluwarsa!');return;}if(s.code!==c){alert('Kode salah!');return;}var t=DB.teachers.find(function(t){return t.email&&t.email.toLowerCase()===currentResetEmail;});if(t){fbSetTeacher(Object.assign({},t,{password:n}));}else{var u=false;DB.classes.forEach(function(cls){var st=cls.students.find(function(x){return x.email&&x.email.toLowerCase()===currentResetEmail;});if(st){st.password=n;fbSetClass(cls);u=true;}});if(!u){alert('Gagal!');return;}}delete resetCodes[currentResetEmail];alert('Password direset!');closeModal();}
function openChangePassword(){openModal('Ubah Password','<div class="form-group pw-toggle"><label>Password Lama</label><input type="password" id="cp-old"><button class="toggle-btn" onclick="togglePw(\'cp-old\',this)" type="button">👁</button></div><div class="form-group pw-toggle"><label>Password Baru</label><input type="password" id="cp-new"><button class="toggle-btn" onclick="togglePw(\'cp-new\',this)" type="button">👁</button></div><div class="form-group pw-toggle"><label>Konfirmasi</label><input type="password" id="cp-confirm"><button class="toggle-btn" onclick="togglePw(\'cp-confirm\',this)" type="button">👁</button></div><button class="btn btn-primary btn-block" onclick="saveChangePassword()">'+ico('save')+' Simpan</button>');}
function saveChangePassword(){var o=document.getElementById('cp-old').value,n=document.getElementById('cp-new').value,c=document.getElementById('cp-confirm').value;if(!o||!n||!c){alert('Lengkapi!');return;}if(n.length<6){alert('Min 6!');return;}if(n!==c){alert('Konfirmasi tidak cocok!');return;}if(currentUser.type==='guru'){var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===currentUser.email.toLowerCase();});if(!t||t.password!==o){alert('Password lama salah!');return;}fbSetTeacher(Object.assign({},t,{password:n}));}else if(currentUser.type==='siswa'){var cls=DB.classes.find(function(c){return c.id===currentUser.classId;});var s=cls.students.find(function(x){return x.id===currentUser.studentId;});if(!s||s.password!==o){alert('Password lama salah!');return;}s.password=n;fbSetClass(cls);}closeModal();alert('Password diubah!');}

/* ===== MODAL ===== */
function openModal(t,b){document.getElementById('modal-title').innerHTML=t;document.getElementById('modal-body').innerHTML=b;document.getElementById('modal').classList.remove('hidden');}
function closeModal(){document.getElementById('modal').classList.add('hidden');}

/* ============================================================
   [FIX #4] ADMIN DASHBOARD — notif icon tetap muncul
   ============================================================ */
function renderAdminDashboard(){
  document.getElementById('header-title-text').innerHTML=ico('settings')+' Dashboard Administrator';
  var h='<div class="alert alert-info">'+ico('shield')+'<div><b>Area Administrator</b><br>Kelola akun guru pengampu.</div></div>';
  h+='<div class="action-row" style="margin-bottom:16px;">';
  h+='<button class="btn btn-primary" onclick="openAddTeacherModal()">'+ico('personPlus')+' Tambah Guru</button>';
  h+='<button class="btn" onclick="openWaLogsGlobal()">'+ico('messageCircle')+' Log Komunikasi</button>';
  h+='<button class="btn" onclick="openActivityLog()">'+ico('activity')+' Aktivitas</button>';
  h+='</div>';
  h+='<h3 style="color:var(--text-strong);margin-bottom:14px;font-size:15px;font-weight:700;">'+ico('users')+' Daftar Guru ('+DB.teachers.length+')</h3>';
  if(DB.teachers.length===0){h+='<div class="empty-state">'+ico('users','lg')+'<p>Belum ada guru.</p></div>';}
  DB.teachers.forEach(function(t){
    var isD=DEFAULT_TEACHERS.some(function(d){return d.email.toLowerCase()===t.email.toLowerCase();});
    h+='<div class="teacher-list-item"><div class="info">'+ico('user','lg')+'<div><strong>'+t.name+'</strong><small>'+t.email+'</small></div></div><div class="action-row">'+(isD?'<span class="badge badge-primary">'+ico('shield')+' Utama</span>':'<button class="btn btn-sm" onclick="openEditTeacherModal(\''+t.email+'\')">'+ico('edit')+'</button><button class="btn btn-sm btn-danger" onclick="deleteTeacher(\''+t.email+'\')">'+ico('trash')+'</button>')+'</div></div>';
  });
  /* Ringkasan kelas per guru */
  h+='<h3 style="color:var(--text-strong);margin:20px 0 12px;font-size:15px;font-weight:700;">'+ico('school')+' Kelas Terdaftar</h3>';
  if(DB.classes.length===0){h+='<div class="empty-state">'+ico('school','lg')+'<p>Belum ada kelas.</p></div>';}
  else{
    h+='<div class="table-wrap"><table><thead><tr><th>Kelas</th><th>Kode</th><th>Pemilik (Guru)</th><th>Siswa</th></tr></thead><tbody>';
    DB.classes.forEach(function(c){
      h+='<tr><td><b>'+c.name+'</b></td><td><code>'+c.code+'</code></td><td>'+(c.teacherEmail||'<span class="badge badge-warning">Belum terassign</span>')+'</td><td>'+(c.students?c.students.length:0)+'</td></tr>';
    });
    h+='</tbody></table></div>';
  }
  h+=renderActivityFeed('admin');
  document.getElementById('main-content').innerHTML=h;
  updateNotifBadge();
}
function openAddTeacherModal(){openModal('Tambah Guru','<div class="form-group"><label>Nama</label><input id="t-name"></div><div class="form-group"><label>Email</label><input type="email" id="t-email"></div><div class="form-group pw-toggle"><label>Password</label><input type="password" id="t-password"><button class="toggle-btn" onclick="togglePw(\'t-password\',this)" type="button">👁</button></div><button class="btn btn-primary btn-block" onclick="addTeacher()">'+ico('save')+' Simpan</button>');}
function addTeacher(){var n=document.getElementById('t-name').value.trim(),e=document.getElementById('t-email').value.trim().toLowerCase(),p=document.getElementById('t-password').value;if(!n||!e||!p){alert('Lengkapi!');return;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){alert('Email invalid!');return;}if(p.length<6){alert('Min 6!');return;}if(DB.teachers.some(function(t){return t.email.toLowerCase()===e;})){alert('Email terdaftar!');return;}fbSetTeacher({name:n,email:e,password:p});closeModal();alert('Ditambahkan!');}
function openEditTeacherModal(email){var t=DB.teachers.find(function(x){return x.email.toLowerCase()===email.toLowerCase();});if(!t)return;openModal('Edit Guru','<div class="form-group"><label>Nama</label><input id="t-name" value="'+t.name+'"></div><div class="form-group"><label>Email</label><input type="email" id="t-email" value="'+t.email+'"></div><div class="form-group pw-toggle"><label>Password (kosongkan jika tidak diubah)</label><input type="password" id="t-password"><button class="toggle-btn" onclick="togglePw(\'t-password\',this)" type="button">👁</button></div><button class="btn btn-primary btn-block" onclick="updateTeacher(\''+email+'\')">'+ico('save')+' Simpan</button>');}
function updateTeacher(oldEmail){var n=document.getElementById('t-name').value.trim(),e=document.getElementById('t-email').value.trim().toLowerCase(),p=document.getElementById('t-password').value;if(!n||!e){alert('Lengkapi!');return;}if(DB.teachers.some(function(t){return t.email.toLowerCase()===e&&t.email.toLowerCase()!==oldEmail.toLowerCase();})){alert('Email dipakai!');return;}if(p&&p.length<6){alert('Min 6!');return;}var t=DB.teachers.find(function(x){return x.email.toLowerCase()===oldEmail.toLowerCase();});var upd=Object.assign({},t,{name:n,email:e});if(p)upd.password=p;var pr=oldEmail.toLowerCase()!==e.toLowerCase()?fbDelTeacher(oldEmail):Promise.resolve();pr.then(function(){return fbSetTeacher(upd);}).then(function(){closeModal();alert('Diperbarui!');});}
function deleteTeacher(email){if(!confirm('Hapus?'))return;fbDelTeacher(email);}

/* ============================================================
   [FIX #1] GURU DASHBOARD — hanya kelas milik guru ini
   ============================================================ */
function renderGuruDashboard(){
  document.getElementById('header-title-text').innerHTML=ico('settings')+' Dashboard Guru Pengampu';
  var mine=myClasses();
  var h='<div class="action-row" style="margin-bottom:16px;">'+
    '<button class="btn btn-primary" onclick="openAddClassModal()">'+ico('plus')+' Tambah Kelas</button>'+
    '<button class="btn" onclick="renderStageManagement()">'+ico('layers')+' Kelola Tahapan</button>'+
    '<button class="btn" onclick="openBroadcastModal()">'+ico('megaphone')+' Broadcast</button>'+
    '<button class="btn" onclick="openWaLogsGlobal()">'+ico('messageCircle')+' Log Komunikasi</button>'+
    '<button class="btn" onclick="openActivityLog()">'+ico('activity')+' Aktivitas</button>'+
    '<button class="btn" onclick="openMeetingList()">'+ico('calendar')+' Absensi</button>'+
  '</div>';
  h+='<div class="alert alert-info">'+ico('info')+'<div>Anda login sebagai <b>'+currentUser.name+'</b>. Hanya kelas yang <b>Anda buat</b> yang tampil di sini.</div></div>';
  h+='<h3 style="color:var(--text-strong);margin-bottom:14px;font-size:15px;font-weight:700;">'+ico('school')+' Kelas Saya ('+mine.length+')</h3>';
  if(mine.length===0){
    h+='<div class="empty-state">'+ico('school','lg')+'<p>Belum ada kelas. Klik <b>+ Tambah Kelas</b> untuk mulai.</p></div>';
  } else {
    h+='<div class="grid">';
    mine.forEach(function(c){
      var ac=DB.stages.filter(function(s){return isStageActive(c.id,s.id);}).length;
      h+='<div class="card card-accent blue" style="cursor:pointer" onclick="viewClass(\''+c.id+'\')"><h3>'+ico('school')+' '+c.name+'</h3><p style="color:var(--text-muted);font-size:13px;margin-bottom:8px;">'+((c.students||[]).length)+' siswa</p><div style="font-size:11.5px;margin-bottom:6px;">Kode: <b style="color:var(--primary);letter-spacing:.15em;font-family:monospace;">'+c.code+'</b></div><div style="font-size:11.5px;color:var(--text-muted);">Aktivasi: <b style="color:var(--primary);">'+ac+'/'+DB.stages.length+' tahap</b></div><div class="action-row" style="margin-top:12px;"><button class="btn btn-sm" onclick="event.stopPropagation();viewClass(\''+c.id+'\')">'+ico('edit')+' Kelola</button><button class="btn btn-sm btn-danger" onclick="event.stopPropagation();deleteClass(\''+c.id+'\')">'+ico('trash')+'</button></div></div>';
    });
    h+='</div>';
  }
  h+=renderActivityFeed('guru');
  document.getElementById('main-content').innerHTML=h;
  updateNotifBadge();
}

/* ===== ACTIVITY FEED ===== */
function renderActivityFeed(role){
  var logs=DB.activityLogs||[];
  if(role==='guru'&&currentUser){
    var myIds=myClasses().map(function(c){return c.id;});
    logs=logs.filter(function(l){return !l.classId || myIds.indexOf(l.classId)>=0;});
  }
  if(role==='siswa'&&currentUser&&currentUser.type==='siswa'){
    var myDiv=getDivisionOfRole(currentUser.role);
    logs=logs.filter(function(l){
      if(l.classId && l.classId!==currentUser.classId) return false;
      if(!l.meta)return true;
      var lDiv=l.meta.division;
      if(!lDiv&&l.meta.role)lDiv=getDivisionOfRole(l.meta.role);
      return !lDiv || lDiv===myDiv || l.userId===currentUser.studentId;
    });
  }
  logs=logs.slice(0,10);
  if(logs.length===0)return '';
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
    h+='<div class="activity-item"><div class="activity-icon">'+ico(iconName,'sm')+'</div><div class="activity-content"><div class="activity-msg">'+l.message+'</div><div class="activity-meta"><b>'+l.userName+'</b> · '+fmtDate(l.createdAt)+'</div></div></div>';
  });
  h+='</div></div>';
  return h;
}
function openActivityLog(){
  var logs=(DB.activityLogs||[]).slice(0,200);
  if(currentUser&&currentUser.type==='guru'){
    var myIds=myClasses().map(function(c){return c.id;});
    logs=logs.filter(function(l){return !l.classId || myIds.indexOf(l.classId)>=0;});
  }
  var h='<div class="alert alert-info">'+ico('info')+'<div>Riwayat aktivitas sistem.</div></div>';
  if(logs.length===0){h+='<div class="empty-state">'+ico('activity','lg')+'<p>Belum ada aktivitas.</p></div>';}
  else{
    h+='<div class="activity-feed">';
    logs.forEach(function(l){h+='<div class="activity-item"><div class="activity-icon">'+ico('activity','sm')+'</div><div class="activity-content"><div class="activity-msg">'+l.message+'</div><div class="activity-meta"><b>'+l.userName+'</b> · '+fmtDate(l.createdAt)+' · <span class="badge badge-gray">'+l.type+'</span></div></div></div>';});
    h+='</div>';
  }
  openModal(ico('activity')+' Log Aktivitas',h);
}

/* ===== BROADCAST ===== */
function canSendBroadcast(){if(!currentUser)return false;if(currentUser.type==='guru')return true;if(currentUser.type==='admin')return true;if(currentUser.type==='siswa')return ['pimpinan_produksi','sutradara'].indexOf(currentUser.role)>=0;return false;}

window.openBroadcastModal=function(presetClassId){
  try{
    if(!canSendBroadcast()){alert('Tidak punya akses.');return;}
    var classList=[];
    if(currentUser.type==='siswa'){
      var tgt=DB.classes.find(function(c){return c.id===currentUser.classId;});
      if(!tgt){alert('Kelas tidak ditemukan.');return;}
      classList=[tgt];
    } else if(currentUser.type==='guru'){
      classList=myClasses();
    } else {
      classList=DB.classes.slice();
    }
    if(classList.length===0){alert('Belum ada kelas.');return;}
    var classOptions=classList.map(function(c){return '<option value="'+c.id+'">'+c.name+' ('+((c.students||[]).length)+' siswa)</option>';}).join('');
    if(presetClassId)classOptions=classOptions.replace('value="'+presetClassId+'"','value="'+presetClassId+'" selected');
    openModal(ico('megaphone')+' Broadcast',
      '<div class="alert alert-info">'+ico('info')+'<div>Kirim pengumuman ke <b>semua</b> atau <b>beberapa</b> siswa.</div></div>'+
      '<div class="form-group"><label>Kelas</label><select id="bc-class" onchange="updateBroadcastTargets()">'+classOptions+'</select></div>'+
      '<div class="form-group"><label>Jenis</label><select id="bc-type"><option value="tugas">Tugas</option><option value="instruksi">Instruksi</option><option value="info">Info</option><option value="urgent">Penting</option></select></div>'+
      '<div class="form-group"><label>Judul</label><input id="bc-title"></div>'+
      '<div class="form-group"><label>Pesan</label><textarea id="bc-message" rows="4"></textarea></div>'+
      '<div class="form-group"><label>Kirim via</label><select id="bc-channel"><option value="app">Hanya notifikasi</option><option value="both">Notifikasi + WhatsApp</option><option value="wa">Hanya WhatsApp</option></select></div>'+
      '<div class="form-group"><label>Penerima</label><div style="display:flex;gap:12px;margin-bottom:8px;flex-wrap:wrap;"><label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer;"><input type="radio" name="bc-recipient-mode" value="all" checked onchange="updateBroadcastTargets()"> Semua siswa</label><label style="display:flex;align-items:center;gap:6px;font-size:12.5px;cursor:pointer;"><input type="radio" name="bc-recipient-mode" value="some" onchange="updateBroadcastTargets()"> Pilih beberapa</label></div><div id="bc-target-list"></div></div>'+
      '<button class="btn btn-primary btn-block btn-lg" onclick="sendBroadcast()">'+ico('send')+' Kirim Sekarang</button>'
    );
    setTimeout(function(){try{updateBroadcastTargets();}catch(e){console.error('Init broadcast:',e);}},150);
  }catch(e){console.error('openBroadcastModal:',e);alert('Error: '+e.message);}
};
window.updateBroadcastTargets=function(){
  try{
    var el=document.getElementById('bc-class');if(!el)return;
    var cid=el.value;
    var r=document.querySelector('input[name="bc-recipient-mode"]:checked');
    var mode=r?r.value:'all';
    var box=document.getElementById('bc-target-list');if(!box)return;
    if(!cid){box.innerHTML='';return;}
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c){box.innerHTML='';return;}
    if(mode==='all'){
      var wp=(c.students||[]).filter(function(s){return s.phone;}).length;
      box.innerHTML='<div style="padding:12px;background:var(--primary-soft);border-radius:8px;font-size:13px;color:var(--primary-dark);"><b>'+((c.students||[]).length)+' siswa</b> akan menerima pesan. <br><small>'+wp+' siswa punya no. WA</small></div>';
    } else {
      if((c.students||[]).length===0){box.innerHTML='';return;}
      var html='<div class="fu-target-list">';
      (c.students||[]).forEach(function(s){
        html+='<label class="fu-target-item"><input type="checkbox" class="bc-target" value="'+s.id+'" data-name="'+String(s.name).replace(/"/g,'&quot;')+'" data-phone="'+(s.phone||'')+'" data-role="'+s.role+'" checked><span class="fu-target-name">'+s.name+'</span><span class="fu-target-role">— '+((ROLES[s.role]&&ROLES[s.role].label)||s.role)+'</span>'+(s.phone?'<span class="fu-target-phone has-phone">'+ico('phone','sm')+' '+s.phone+'</span>':'<span class="fu-target-phone no-phone">tanpa WA</span>')+'</label>';
      });
      html+='</div><div style="margin-top:6px;display:flex;gap:6px;"><button class="btn btn-sm" type="button" onclick="document.querySelectorAll(\'.bc-target\').forEach(function(c){c.checked=true;})">Pilih Semua</button><button class="btn btn-sm" type="button" onclick="document.querySelectorAll(\'.bc-target\').forEach(function(c){c.checked=false;})">Kosongkan</button></div>';
      box.innerHTML=html;
    }
  }catch(e){console.error('updateBroadcastTargets:',e);}
};
window.sendBroadcast=function(){
  try{
    if(!canSendBroadcast()){alert('Tidak punya akses.');return;}
    var cid=document.getElementById('bc-class').value;
    var t=document.getElementById('bc-type').value;
    var ti=document.getElementById('bc-title').value.trim();
    var m=document.getElementById('bc-message').value.trim();
    var ch=document.getElementById('bc-channel').value;
    var mode=(document.querySelector('input[name="bc-recipient-mode"]:checked')||{}).value||'all';
    if(!ti||!m){alert('Lengkapi!');return;}
    var c=DB.classes.find(function(x){return x.id===cid;});if(!c){alert('Kelas tidak ada!');return;}
    if(currentUser.type==='guru' && !ownsClass(cid)){alert('Anda tidak berhak mengirim ke kelas ini.');return;}
    var recipients=[];
    if(mode==='all'){recipients=(c.students||[]).map(function(s){return {id:s.id,name:s.name,phone:s.phone||'',role:s.role};});}
    else{var boxes=document.querySelectorAll('.bc-target:checked');if(boxes.length===0){alert('Pilih penerima!');return;}boxes.forEach(function(b){recipients.push({id:b.value,name:b.getAttribute('data-name'),phone:b.getAttribute('data-phone')||'',role:b.getAttribute('data-role')||''});});}
    if(recipients.length===0){alert('Tidak ada penerima!');return;}
    var senderId=currentUser.type==='guru'?'guru':(currentUser.type==='admin'?'admin':currentUser.studentId);
    var senderName=currentUser.name;
    var senderRole=currentUser.role||currentUser.type||'';

    if(ch==='app'||ch==='both'){
      fbAddNotif({
        id:uid(),classId:cid,fromId:senderId,fromName:senderName,
        fromType:currentUser.type,fromRole:senderRole,
        toId:mode==='all'?'all':String(recipients.length)+' penerima',
        type:t,title:ti,message:m,createdAt:Date.now(),readBy:[],doneBy:[]
      });
    }
    var waRecipients=recipients.filter(function(r){return r.phone;});
    if(ch==='wa'||ch==='both'){
      if(waRecipients.length===0){alert('Tidak ada penerima dengan no. WA!');return;}
      waRecipients.forEach(function(rec){
        if(firebaseReady){
          fb.collection('wa_logs').doc(uid()).set(sanitizeFirestore({
            id:uid(),classId:cid,
            fromId:senderId,fromName:senderName,fromType:currentUser.type,fromRole:senderRole,
            toId:rec.id,toName:rec.name,toRole:rec.role||'',toPhone:rec.phone,
            channel:ch,type:'broadcast',title:ti,message:m,
            createdAt:Date.now(),createdBy:senderName
          }));
        }
      });
      logActivity('broadcast',senderName+' kirim broadcast "'+ti+'" ke '+recipients.length+' siswa',
        {classId:cid,division:currentUser.role?getDivisionOfRole(currentUser.role):'',role:currentUser.role||''});
      closeModal();
      showWaSendPanel(waRecipients,ti,m,senderName);
    } else {
      logActivity('broadcast',senderName+' kirim broadcast "'+ti+'"',
        {classId:cid,division:currentUser.role?getDivisionOfRole(currentUser.role):'',role:currentUser.role||''});
      closeModal();
      alert('Broadcast terkirim ke '+recipients.length+' siswa!');
    }
  }catch(e){console.error('sendBroadcast:',e);alert('Error: '+e.message);}
};
function showWaSendPanel(recipients,title,message,senderName){
  var h='<div class="alert alert-info">'+ico('info')+'<div><b>Kirim via WhatsApp</b><br>Klik tombol per penerima, atau <b>Buka Semua Berurutan</b> (jeda 1 detik).</div></div>';
  h+='<div class="action-row" style="margin-bottom:12px;"><button class="btn btn-sm btn-primary" onclick="openAllWaTabs()">'+ico('send','sm')+' Buka Semua Berurutan</button><button class="btn btn-sm" onclick="copyWaAllMessages()">'+ico('copy','sm')+' Copy Semua</button><span class="badge badge-warning" style="align-self:center;">'+recipients.length+' penerima</span></div>';
  h+='<div class="wa-send-list">';
  recipients.forEach(function(r,i){h+='<div class="wa-send-item"><div class="wa-send-info"><b>'+r.name+'</b> <span style="color:var(--success);font-size:11.5px;">'+ico('phone','sm')+' '+r.phone+'</span></div><button class="btn btn-sm btn-success" onclick="openSingleWa('+i+')">'+ico('send','sm')+' Buka WA</button><span class="wa-send-status" id="wa-status-'+i+'"></span></div>';});
  h+='</div>';
  h+='<div style="margin-top:16px;padding:12px;background:var(--surface);border-radius:8px;font-size:12px;color:var(--text-muted);line-height:1.6;"><b>'+ico('info','sm')+' Catatan:</b><br>• WhatsApp Web harus sudah login<br>• Setelah tab terbuka, klik tombol <b>Send</b><br>• Pesan otomatis tersimpan di Log Komunikasi</div>';
  h+='<button class="btn btn-primary btn-block" style="margin-top:12px;" onclick="closeModal()">Selesai</button>';
  window.__waRecipients=recipients;window.__waTitle=title;window.__waMessage=message;window.__waSender=senderName;
  openModal(ico('send')+' Kirim via WhatsApp',h);
}
function openSingleWa(i){
  var r=window.__waRecipients[i];if(!r)return;
  var phone=r.phone.replace(/\D/g,'');
  if(phone.charAt(0)==='0')phone='62'+phone.substring(1);
  if(phone.substring(0,2)!=='62')phone='62'+phone;
  var msg='*SP-PPT — SMP Negeri 10 Samarinda*\n_'+window.__waTitle+'_\n\nYth. *'+r.name+'*\n\n'+window.__waMessage+'\n\n—\nDari: '+window.__waSender+'\nWaktu: '+new Date().toLocaleString('id-ID');
  window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank');
  var st=document.getElementById('wa-status-'+i);if(st)st.innerHTML='<span class="badge badge-success">'+ico('check','sm')+' Dibuka</span>';
}
function openAllWaTabs(){
  var rs=window.__waRecipients||[];if(rs.length===0)return;
  if(!confirm('Buka '+rs.length+' tab WhatsApp?'))return;
  var i=0;
  function next(){if(i>=rs.length){alert('Selesai.');return;}openSingleWa(i);i++;setTimeout(next,1000);}
  next();
}
function copyWaAllMessages(){
  var rs=window.__waRecipients||[];
  var txt='=== PENERIMA & PESAN ===\n\n';
  rs.forEach(function(r,i){txt+=(i+1)+'. '+r.name+'\n   WA: '+r.phone+'\n   Pesan:\n   *'+window.__waTitle+'*\n\n   Yth. '+r.name+',\n\n   '+window.__waMessage+'\n\n   — '+window.__waSender+'\n\n---\n\n';});
  if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){alert('Disalin!');});}else{prompt('Copy:',txt);}
}

/* ===== STAGE MANAGEMENT ===== */
function renderStageManagement(){
  document.getElementById('header-title-text').innerHTML=ico('layers')+' Kelola Tahapan';
  var tw=getTotalWeight();
  var h='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-sm" onclick="renderGuruDashboard()">'+ico('back')+' Kembali</button><button class="btn btn-primary" onclick="openAddStageModal()">'+ico('plus')+' Tambah</button></div><div class="alert alert-info">'+ico('info')+'<div>Total bobot: <b>'+tw+'%</b> '+(tw!==100?'(ideal 100%)':'')+'</div></div>';
  DB.stages.forEach(function(s,i){h+='<div class="stage-manage-item"><div class="num">'+(i+1)+'</div><div class="info"><strong>'+s.name+(s.subtitle?' — '+s.subtitle:'')+'</strong><small>'+(s.description||'-')+'</small></div><span class="weight-tag">Bobot '+s.weight+'%</span><div class="action-row"><button class="btn btn-sm" onclick="openStageDetailModal(\''+s.id+'\',null)">'+ico('book')+'</button><button class="btn btn-sm" onclick="openEditStageModal('+i+')">'+ico('edit')+'</button><button class="btn btn-sm btn-danger" onclick="deleteStage('+i+')">'+ico('trash')+'</button></div></div>';});
  document.getElementById('main-content').innerHTML=h;updateNotifBadge();
}
function openAddStageModal(){openModal('Tambah Tahapan','<div class="form-group"><label>Nama</label><input id="st-name"></div><div class="form-group"><label>Sub-Judul</label><input id="st-subtitle"></div><div class="form-group"><label>Deskripsi</label><textarea id="st-desc" rows="2"></textarea></div><div class="form-group"><label>Deskripsi Panjang</label><textarea id="st-longdesc" rows="3"></textarea></div><div class="form-group"><label>Bobot (%)</label><input type="number" id="st-weight" min="1" max="100" value="10"></div><button class="btn btn-primary btn-block" onclick="addStage()">'+ico('save')+' Simpan</button>');}
function addStage(){var n=document.getElementById('st-name').value.trim(),su=document.getElementById('st-subtitle').value.trim(),d=document.getElementById('st-desc').value.trim(),ld=document.getElementById('st-longdesc').value.trim(),w=parseFloat(document.getElementById('st-weight').value)||0;if(!n){alert('Nama wajib!');return;}if(w<=0||w>100){alert('Bobot 1-100!');return;}var stages=DB.stages.concat([{id:uid(),name:n,subtitle:su,description:d,longDesc:ld,weight:w}]);fbSetStages(stages);closeModal();alert('Ditambahkan!');}
function openEditStageModal(i){var s=DB.stages[i];openModal('Edit Tahapan','<div class="form-group"><label>Nama</label><input id="st-name" value="'+s.name+'"></div><div class="form-group"><label>Sub-Judul</label><input id="st-subtitle" value="'+(s.subtitle||'')+'"></div><div class="form-group"><label>Deskripsi</label><textarea id="st-desc" rows="2">'+(s.description||'')+'</textarea></div><div class="form-group"><label>Deskripsi Panjang</label><textarea id="st-longdesc" rows="3">'+(s.longDesc||'')+'</textarea></div><div class="form-group"><label>Bobot (%)</label><input type="number" id="st-weight" min="1" max="100" value="'+s.weight+'"></div><button class="btn btn-primary btn-block" onclick="updateStage('+i+')">'+ico('save')+' Simpan</button>');}
function updateStage(i){var n=document.getElementById('st-name').value.trim(),su=document.getElementById('st-subtitle').value.trim(),d=document.getElementById('st-desc').value.trim(),ld=document.getElementById('st-longdesc').value.trim(),w=parseFloat(document.getElementById('st-weight').value)||0;if(!n){alert('Nama wajib!');return;}if(w<=0||w>100){alert('Bobot 1-100!');return;}var stages=DB.stages.slice();stages[i]=Object.assign({},stages[i],{name:n,subtitle:su,description:d,longDesc:ld,weight:w});fbSetStages(stages);closeModal();alert('Diperbarui!');}
function deleteStage(i){var s=DB.stages[i];if(!confirm('Hapus "'+s.name+'"?'))return;var stages=DB.stages.filter(function(_,ix){return ix!==i;});fbSetStages(stages);alert('Dihapus!');}

function openActivationModal(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var h='<div class="alert alert-warning">'+ico('warning')+'<div>Siswa hanya menilai tahapan yang AKTIF.</div></div>';
  DB.stages.forEach(function(s,i){
    var a=isStageActive(cid,s.id);
    h+='<div class="activation-item '+(a?'active':'locked')+'"><div style="width:36px;height:36px;background:'+(a?'var(--success-soft)':'var(--surface)')+';color:'+(a?'#065f46':'var(--text-muted)')+';border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;">'+(i+1)+'</div><div class="info"><strong>Tahap '+(i+1)+': '+s.name+'</strong><div style="margin-top:4px;"><span class="badge '+(a?'badge-success':'badge-gray')+'">'+(a?'AKTIF':'TERKUNCI')+'</span></div></div><label class="switch"><input type="checkbox" '+(a?'checked':'')+' onchange="toggleStageActivation(\''+cid+'\',\''+s.id+'\',this.checked)"><span class="slider"></span></label></div>';
  });
  h+='<div style="margin-top:16px;"><button class="btn btn-primary btn-block" onclick="closeModal();viewClass(\''+cid+'\')">'+ico('check')+' Selesai</button></div>';
  openModal('Aktivasi — '+c.name,h);
}
function toggleStageActivation(cid,sid,a){var cur=Object.assign({},DB.activeStages[cid]||{});cur[sid]=a;fbSetActiveStages(cid,cur).then(function(){closeModal();openActivationModal(cid);});}

function openAddClassModal(){openModal('Tambah Kelas','<div class="form-group"><label>Nama Kelas</label><input id="new-class-name" placeholder="Contoh: IX-A"><small class="hint">Kode otomatis di-generate</small></div><button class="btn btn-primary btn-block" onclick="addClass()">'+ico('save')+' Simpan</button>');}
function addClass(){
  var n=document.getElementById('new-class-name').value.trim();
  if(!n){alert('Nama wajib!');return;}
  if(DB.classes.some(function(c){return c.name.toLowerCase()===n.toLowerCase();})){alert('Kelas ada!');return;}
  var code=genClassCode(n),id=uid();
  /* [FIX #1] simpan teacherEmail sebagai pemilik */
  var data={id:id,name:n,code:code,students:[],teacherEmail:(currentUser&&currentUser.email?currentUser.email:''),teacherName:(currentUser&&currentUser.name?currentUser.name:''),createdAt:Date.now()};
  fbSetClass(data).then(function(){
    closeModal();
    logActivity('class_create','Kelas '+n+' dibuat',{classId:id});
    alert('Kelas '+n+' dibuat!\n\nKode: '+code);
  });
}

/* ===== DELETE CLASS & STUDENT ===== */
function deleteClass(cid){
  var c=DB.classes.find(function(x){return x.id===cid;});
  if(!c){alert('Kelas tidak ditemukan.');return;}
  if(!ownsClass(cid)){alert('Anda tidak berhak menghapus kelas ini.');return;}
  if(!confirm('Hapus kelas '+c.name+'?\n\nSemua data akan dihapus permanen.'))return;
  if(!firebaseReady){alert('Firebase belum siap.');return;}
  fb.collection('classes').doc(cid).delete().then(function(){
    var cleanup=[
      fb.collection('deadlines').doc(cid).delete().catch(function(e){console.warn(e.message);}),
      fb.collection('activeStages').doc(cid).delete().catch(function(e){console.warn(e.message);}),
      fb.collection('checklists').doc(cid).delete().catch(function(e){console.warn(e.message);})
    ];
    return Promise.all(cleanup);
  }).then(function(){
    return fb.collection('evaluations').where('classId','==',cid).get().then(function(snap){if(snap.size===0)return;var b=fb.batch();snap.forEach(function(d){b.delete(d.ref);});return b.commit();}).catch(function(e){console.warn(e.message);});
  }).then(function(){
    return fb.collection('notifications').where('classId','==',cid).get().then(function(snap){if(snap.size===0)return;var b=fb.batch();snap.forEach(function(d){b.delete(d.ref);});return b.commit();}).catch(function(e){console.warn(e.message);});
  }).then(function(){
    return fb.collection('meetings').where('classId','==',cid).get().then(function(snap){if(snap.size===0)return;var b=fb.batch();snap.forEach(function(d){b.delete(d.ref);});return b.commit();}).catch(function(e){console.warn(e.message);});
  }).then(function(){
    alert('Kelas "'+c.name+'" berhasil dihapus!');
  }).catch(function(err){
    console.error('Delete class error:',err);
    alert('GAGAL hapus kelas!\n\nError: '+(err.message||err));
  });
}
function deleteStudent(cid,sid){
  var c=DB.classes.find(function(x){return x.id===cid;});
  if(!c){alert('Kelas tidak ditemukan.');return;}
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var s=c.students.find(function(x){return x.id===sid;});
  if(!s){alert('Siswa tidak ditemukan.');return;}
  if(!confirm('Hapus siswa "'+s.name+'"?'))return;
  if(!firebaseReady){alert('Firebase belum siap.');return;}
  var newStudents=c.students.filter(function(x){return x.id!==sid;});
  var updated=Object.assign({},c,{students:newStudents});
  if(updated._id)delete updated._id;
  fb.collection('classes').doc(cid).set(sanitizeFirestore(updated),{merge:false}).then(function(){
    return fb.collection('evaluations').where('targetId','==',sid).get().then(function(snap){if(snap.size===0)return;var b=fb.batch();snap.forEach(function(d){b.delete(d.ref);});return b.commit();}).catch(function(e){console.warn(e.message);});
  }).then(function(){
    alert('Siswa "'+s.name+'" berhasil dihapus!');
  }).catch(function(err){
    console.error('Delete student error:',err);
    alert('GAGAL hapus siswa!\n\nError: '+(err.message||err));
  });
}
function regenerateClassCode(cid){var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;if(!ownsClass(cid)){alert('Tidak punya akses.');return;}if(!confirm('Generate kode baru?'))return;var nc=genClassCode(c.name);fbSetClass(Object.assign({},c,{code:nc})).then(function(){alert('Kode baru: '+nc);});}
function copyClassCode(cid){var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;if(navigator.clipboard){navigator.clipboard.writeText(c.code).then(function(){alert('Kode disalin!');});}else prompt('Salin:',c.code);}

function viewClass(cid){
  if(!ownsClass(cid)){alert('Anda tidak punya akses ke kelas ini.');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var tG=c.students.filter(function(s){return canGuruEvaluate(s.role);});
  var gd=0,gt=tG.length*DB.stages.length;
  tG.forEach(function(t){DB.stages.forEach(function(s){if(DB.evaluations[cid]&&DB.evaluations[cid][t.id]&&DB.evaluations[cid][t.id]['guru']&&DB.evaluations[cid][t.id]['guru'][s.id])gd++;});});
  var ac=DB.stages.filter(function(s){return isStageActive(cid,s.id);}).length;
  var h='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-sm" onclick="renderGuruDashboard()">'+ico('back')+' Kembali</button><button class="btn btn-sm" onclick="openAddStudentModal(\''+cid+'\')">'+ico('personPlus')+' Siswa</button><button class="btn btn-sm" onclick="openImportModal(\''+cid+'\')">'+ico('upload')+' Import</button><button class="btn btn-sm" onclick="renderRecap(\''+cid+'\')">'+ico('chart')+' Rekap</button><button class="btn btn-sm" onclick="openAbsensiRekap(\''+cid+'\')">'+ico('calendar')+' Absensi</button></div>';
  h+='<div class="class-code-box"><div class="label">'+ico('hash')+' Kode Kelas</div><div class="code">'+c.code+'</div><div class="hint">Bagikan ke siswa untuk daftar mandiri</div><div class="action-row"><button class="btn btn-primary" onclick="copyClassCode(\''+cid+'\')">'+ico('copy')+' Salin</button><button class="btn" onclick="regenerateClassCode(\''+cid+'\')">'+ico('refresh')+' Generate Baru</button></div></div>';
  h+='<div class="card card-accent blue"><h3>'+ico('user')+' Penilaian Guru</h3><p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Progress: <b>'+gd+'/'+(gt||0)+'</b></p><button class="btn btn-primary" onclick="renderGuruClassGrading(\''+cid+'\')">'+ico('edit')+' Buka Penilaian</button></div>';
  h+='<div class="card card-accent green"><h3>'+ico('unlock')+' Aktivasi & Deadline</h3><p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;"><b>'+ac+'/'+DB.stages.length+' tahap aktif</b></p><div class="action-row"><button class="btn" onclick="openActivationModal(\''+cid+'\')">'+ico('settings')+' Aktivasi</button><button class="btn" onclick="openDeadlineModal(\''+cid+'\')">'+ico('calendar')+' Deadline</button><button class="btn" onclick="openBroadcastModal(\''+cid+'\')">'+ico('megaphone')+' Broadcast</button></div></div>';
  h+=renderLiniMassa(cid);
  h+='<h3 style="color:var(--text-strong);margin:20px 0 10px;font-size:15px;font-weight:700;">'+ico('school')+' Kelas '+c.name+'</h3><p style="color:var(--text-muted);font-size:13px;">'+((c.students||[]).length)+' siswa</p>';
  if((c.students||[]).length===0)h+='<div class="empty-state">'+ico('users','lg')+'<p>Belum ada siswa.</p></div>';
  else{
    h+='<div class="table-wrap"><table><thead><tr><th>No</th><th>Nama</th><th>Email</th><th>No. WA</th><th>Peran</th><th>Aksi</th></tr></thead><tbody>';
    c.students.forEach(function(s,i){
      var r=ROLES[s.role]||{label:s.role,team:'-'};
      var tc=r.team==='produksi'?'badge-info':'badge-warning';
      h+='<tr><td>'+(i+1)+'</td><td><b>'+s.name+'</b></td><td style="font-size:12px;color:var(--text-muted);">'+(s.email||'-')+'</td><td style="font-size:12px;color:'+(s.phone?'var(--success)':'var(--danger)')+';">'+(s.phone||'tanpa WA')+'</td><td><span class="badge '+tc+'">'+r.label+'</span></td><td><button class="btn btn-sm" onclick="openEditStudentModal(\''+cid+'\',\''+s.id+'\')">'+ico('edit')+'</button><button class="btn btn-sm" onclick="openResetStudentPassword(\''+cid+'\',\''+s.id+'\')">'+ico('key')+'</button><button class="btn btn-sm btn-danger" onclick="deleteStudent(\''+cid+'\',\''+s.id+'\')">'+ico('trash')+'</button></td></tr>';
    });
    h+='</tbody></table></div>';
  }
  document.getElementById('main-content').innerHTML=h;
  if(typeof window.__extrasViewClass==='function')window.__extrasViewClass(cid);
  updateNotifBadge();
}
window.viewClass = viewClass;

/* ===== DEADLINE ===== */
function openDeadlineModal(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var h='<div class="alert alert-info">'+ico('info')+'<div>Set deadline per tahapan.</div></div>';
  DB.stages.forEach(function(s,i){
    var d=(DB.deadlines[cid]&&DB.deadlines[cid][s.id])||{};
    h+='<div class="deadline-card"><div class="label">'+ico('clock')+' Tahap '+(i+1)+': '+s.name+'</div><div class="form-group" style="margin-bottom:10px;"><label style="font-size:12.5px;">Deadline</label><input type="date" id="dl-date-'+s.id+'" value="'+(d.date||'')+'"></div><div class="form-group" style="margin-bottom:0;"><label style="font-size:12.5px;">Catatan</label><input id="dl-note-'+s.id+'" value="'+(d.note||'')+'"></div></div>';
  });
  h+='<button class="btn btn-primary btn-block" onclick="saveDeadlines(\''+cid+'\')">'+ico('save')+' Simpan</button>';
  openModal('Kelola Deadline',h);
}
function saveDeadlines(cid){var obj={};DB.stages.forEach(function(s){var d=document.getElementById('dl-date-'+s.id).value,n=document.getElementById('dl-note-'+s.id).value.trim();if(d||n)obj[s.id]={date:d,note:n,setBy:currentUser.name,setAt:Date.now()};});fbSetDeadlines(cid,obj).then(function(){closeModal();alert('Disimpan!');});}

/* ===== REMINDER ===== */
function openSendReminderModal(tid,tcid){
  var cid=tcid||currentUser.classId;
  var c=DB.classes.find(function(x){return x.id===cid;});
  if(!c)return;
  var t=c.students.find(function(s){return s.id===tid;});if(!t){alert('Target tidak ditemukan!');return;}
  openModal('Kirim Pengingat','<div class="alert alert-info">'+ico('user')+'<div>Ke <b>'+t.name+'</b></div></div><div class="form-group"><label>Jenis</label><select id="rm-type"><option value="tugas">Tugas</option><option value="instruksi">Instruksi</option><option value="info">Info</option></select></div><div class="form-group"><label>Judul</label><input id="rm-title"></div><div class="form-group"><label>Pesan</label><textarea id="rm-message" rows="3"></textarea></div><button class="btn btn-primary btn-block" onclick="sendReminder(\''+tid+'\',\''+cid+'\')">'+ico('send')+' Kirim</button>');
}
function sendReminder(tid,cid){var t=document.getElementById('rm-type').value,ti=document.getElementById('rm-title').value.trim(),m=document.getElementById('rm-message').value.trim();if(!ti||!m){alert('Lengkapi!');return;}var fid=currentUser.type==='guru'?'guru':currentUser.studentId;fbAddNotif({id:uid(),classId:cid,fromId:fid,fromName:currentUser.name,fromType:currentUser.type,toId:tid,type:t,title:ti,message:m,createdAt:Date.now(),readBy:[],doneBy:[]});closeModal();alert('Terkirim!');}

/* ===== IMPORT EXCEL ===== */
function openImportModal(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  openModal('Import Excel','<div class="alert alert-info">'+ico('info')+'<div><b>Format:</b> Nama | Email | Password | Role | No. WA</div></div><div class="action-row" style="margin-bottom:14px;"><button class="btn btn-sm" onclick="downloadTemplate()">'+ico('download')+' Template</button></div><label class="file-input"><input type="file" id="excel-file" accept=".xlsx,.xls" onchange="showFileName(this)"><p>Klik untuk pilih file Excel</p><div class="filename" id="filename-display"></div></label><button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="importExcel(\''+cid+'\')">'+ico('upload')+' Import</button>');
}
function showFileName(i){var n=i.files[0]?i.files[0].name:'';document.getElementById('filename-display').textContent=n;}
function downloadTemplate(){var d=[['Nama','Email','Password','Role','No. WA'],['Ahmad Fauzi','ahmad@siswa.smp.belajar.id','#Smpn10smd','pemain','08123456789']];var ws=XLSX.utils.aoa_to_sheet(d);ws['!cols']=[{wch:25},{wch:35},{wch:15},{wch:25},{wch:15}];var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Template');XLSX.writeFile(wb,'Template_Import_Siswa.xlsx');}
function importExcel(cid){
  var f=document.getElementById('excel-file').files[0];if(!f){alert('Pilih file!');return;}
  var r=new FileReader();
  r.onload=function(e){
    try{
      var data=new Uint8Array(e.target.result);var wb=XLSX.read(data,{type:'array'});var sh=wb.Sheets[wb.SheetNames[0]];var rows=XLSX.utils.sheet_to_json(sh);
      if(rows.length===0){alert('Kosong!');return;}
      var c=DB.classes.find(function(x){return x.id===cid;});
      var ok=0,bad=[],dup=[];var ex=new Set();
      DB.classes.forEach(function(cc){cc.students.forEach(function(s){if(s.email)ex.add(s.email.toLowerCase());});});
      var newStudents=c.students.slice();
      rows.forEach(function(row,i){
        var n=(row['Nama']||row['nama']||'').toString().trim();
        var em=(row['Email']||row['email']||'').toString().trim().toLowerCase();
        var p=(row['Password']||row['password']||'').toString().trim();
        var ro=(row['Role']||row['role']||'').toString().trim().toLowerCase();
        var ph=(row['No. WA']||row['no. wa']||'').toString().replace(/\D/g,'');
        if(!n||!em||!p||!ro){bad.push('Baris '+(i+2));return;}
        if(ex.has(em)){dup.push('Baris '+(i+2));return;}
        newStudents.push({id:uid(),name:n,email:em,password:p,role:ro,phone:ph||''});ex.add(em);ok++;
      });
      fbSetClass(Object.assign({},c,{students:newStudents})).then(function(){var m='Berhasil: '+ok;if(dup.length)m+='\nDup: '+dup.length;if(bad.length)m+='\nGagal: '+bad.length;alert(m);closeModal();});
    }catch(err){alert('Error: '+err.message);}
  };
  r.readAsArrayBuffer(f);
}
function openAddStudentModal(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  openModal('Tambah Siswa','<div class="form-group"><label>Nama</label><input id="ns-name"></div><div class="form-group"><label>Email</label><input type="email" id="ns-email"></div><div class="form-group"><label>No. WhatsApp</label><input type="tel" id="ns-phone"></div><div class="form-group pw-toggle"><label>Password</label><input type="password" id="ns-pw"><button class="toggle-btn" onclick="togglePw(\'ns-pw\',this)" type="button">👁</button></div><div class="form-group"><label>Peran</label><select id="ns-role">'+buildRoleOptions()+'</select></div><button class="btn btn-primary btn-block" onclick="addStudent(\''+cid+'\')">'+ico('save')+' Simpan</button>');
}
function buildRoleOptions(sel){var o='<option value="">-- Pilih --</option><optgroup label="— Tim Produksi —">';['pimpinan_produksi','sekretaris','bendahara','koor_publikasi','koor_perlengkapan','koor_akomodasi','anggota_publikasi','anggota_perlengkapan','anggota_akomodasi'].forEach(function(k){o+='<option value="'+k+'" '+(sel===k?'selected':'')+'>'+ROLES[k].label+'</option>';});o+='</optgroup><optgroup label="— Tim Artistik —">';['sutradara','asisten_sutradara','pemain','koor_panggung','koor_musik','koor_busana','koor_rias','koor_cahaya','anggota_panggung','anggota_musik','anggota_busana','anggota_rias','anggota_cahaya'].forEach(function(k){o+='<option value="'+k+'" '+(sel===k?'selected':'')+'>'+ROLES[k].label+'</option>';});o+='</optgroup>';return o;}
function addStudent(cid){var n=document.getElementById('ns-name').value.trim(),e=document.getElementById('ns-email').value.trim().toLowerCase(),p=document.getElementById('ns-pw').value,r=document.getElementById('ns-role').value;var phEl=document.getElementById('ns-phone'),ph=phEl?phEl.value.replace(/\D/g,''):'';if(!n||!e||!p||!r){alert('Lengkapi!');return;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){alert('Email invalid!');return;}if(p.length<6){alert('Min 6!');return;}var d=false;DB.classes.forEach(function(c){if(c.students.some(function(s){return s.email&&s.email.toLowerCase()===e;}))d=true;});if(d){alert('Email terdaftar!');return;}var c=DB.classes.find(function(x){return x.id===cid;});var ns=c.students.concat([{id:uid(),name:n,email:e,password:p,role:r,phone:ph||''}]);fbSetClass(Object.assign({},c,{students:ns})).then(function(){closeModal();});}
function openEditStudentModal(cid,sid){if(!ownsClass(cid)){alert('Tidak punya akses.');return;}var c=DB.classes.find(function(x){return x.id===cid;});var s=c.students.find(function(x){return x.id===sid;});openModal('Edit Siswa','<div class="form-group"><label>Nama</label><input id="es-name" value="'+s.name+'"></div><div class="form-group"><label>Email</label><input type="email" id="es-email" value="'+(s.email||'')+'"></div><div class="form-group"><label>No. WA</label><input type="tel" id="es-phone" value="'+(s.phone||'')+'"></div><div class="form-group pw-toggle"><label>Password (kosongkan)</label><input type="password" id="es-pw"><button class="toggle-btn" onclick="togglePw(\'es-pw\',this)" type="button">👁</button></div><div class="form-group"><label>Peran</label><select id="es-role">'+buildRoleOptions(s.role)+'</select></div><button class="btn btn-primary btn-block" onclick="updateStudent(\''+cid+'\',\''+sid+'\')">'+ico('save')+' Simpan</button>');}
function updateStudent(cid,sid){var n=document.getElementById('es-name').value.trim(),e=document.getElementById('es-email').value.trim().toLowerCase(),p=document.getElementById('es-pw').value,r=document.getElementById('es-role').value;var phEl=document.getElementById('es-phone'),ph=phEl?phEl.value.replace(/\D/g,''):'';if(!n||!e){alert('Lengkapi!');return;}if(p&&p.length<6){alert('Min 6!');return;}var d=false;DB.classes.forEach(function(c){c.students.forEach(function(s){if(s.id!==sid&&s.email&&s.email.toLowerCase()===e)d=true;});});if(d){alert('Email terdaftar!');return;}var c=DB.classes.find(function(x){return x.id===cid;});var ns=c.students.map(function(s){if(s.id!==sid)return s;var u=Object.assign({},s,{name:n,email:e,role:r,phone:ph||''});if(p)u.password=p;return u;});fbSetClass(Object.assign({},c,{students:ns})).then(function(){closeModal();});}
function openResetStudentPassword(cid,sid){if(!ownsClass(cid)){alert('Tidak punya akses.');return;}var c=DB.classes.find(function(x){return x.id===cid;});var s=c.students.find(function(x){return x.id===sid;});openModal('Reset Password','<div class="alert alert-warning">'+ico('warning')+'<div>Reset <b>'+s.name+'</b>.</div></div><div class="form-group pw-toggle"><label>Password Baru</label><input type="password" id="rs-pw"><button class="toggle-btn" onclick="togglePw(\'rs-pw\',this)" type="button">👁</button></div><button class="btn btn-primary btn-block" onclick="resetStudentPassword(\''+cid+'\',\''+sid+'\')">'+ico('key')+' Reset</button>');}
function resetStudentPassword(cid,sid){var p=document.getElementById('rs-pw').value;if(!p||p.length<6){alert('Min 6!');return;}var c=DB.classes.find(function(x){return x.id===cid;});var ns=c.students.map(function(s){return s.id===sid?Object.assign({},s,{password:p}):s;});fbSetClass(Object.assign({},c,{students:ns})).then(function(){closeModal();alert('Password direset!');});}

/* ===== LINI MASSA ===== */
function renderLiniMassa(cid){
  var o=localStorage.getItem('lm_open')==='true';
  return '<details class="lini-massa" '+(o?'open':'')+' ontoggle="localStorage.setItem(\'lm_open\',this.open)"><summary><div class="lm-left"><div class="lm-icon">'+ico('layers','lg')+'</div><div class="lm-text"><h3>Lini Massa — Alur Proses Kegiatan</h3><p>Klik untuk '+(o?'menutup':'membuka')+' timeline lengkap</p></div></div><div class="lm-right"><span class="lm-badge">'+(DB.stages.length+2)+' Tahapan</span><div class="lm-chevron">▼</div></div></summary><div class="lm-body">'+renderTimelineContent(cid)+'</div></details>';
}
function renderTimelineContent(cid){
  var h='<div class="timeline">';
  h+='<div class="timeline-item done"><div class="box"><div class="header"><h4><span class="step-num">0</span>Persiapan Sistem</h4><span class="badge badge-success">'+ico('check','sm')+' Setup</span></div><div class="sub">Guru / Admin</div><div class="desc">Guru menyiapkan kelas, menambah siswa, mengatur tahapan.</div></div></div>';
  DB.stages.forEach(function(s,i){
    var a=cid?isStageActive(cid,s.id):true;
    var d=cid?getDeadline(cid,s.id):null;
    var ov=d&&a&&isOverdue(d.date);
    var st='locked',bg='<span class="badge badge-gray">'+ico('lock','sm')+' Belum dibuka</span>';
    if(a){st='active';bg=ov?'<span class="badge badge-danger">'+ico('warning','sm')+' Lewat</span>':'<span class="badge badge-success">'+ico('unlock','sm')+' Aktif</span>';}
    h+='<div class="timeline-item '+(st==='active'?'active':'')+'"><div class="box"><div class="header"><h4><span class="step-num">'+(i+1)+'</span>Tahap '+(i+1)+': '+s.name+'</h4>'+bg+'</div><div class="sub">'+s.subtitle+' · Bobot '+s.weight+'%'+(s.id==='stage2'?' (termasuk absensi 15%)':'')+'</div><div class="desc">'+(s.longDesc||s.description)+'</div>'+(d&&d.date?'<div class="detail-list"><b>Deadline:</b> '+fmtDateShort(d.date)+'</div>':'')+'<div class="meta"><button class="btn btn-sm" onclick="event.stopPropagation();openStageDetailModal(\''+s.id+'\','+(cid?"'"+cid+"'":'null')+')">'+ico('book','sm')+' Detail</button></div></div></div>';
  });
  h+='<div class="timeline-item"><div class="box"><div class="header"><h4><span class="step-num">'+(DB.stages.length+1)+'</span>Rekapitulasi Akhir</h4><span class="badge badge-primary">'+ico('settings','sm')+' Otomatis</span></div><div class="sub">Guru</div><div class="desc">Bobot: Guru 40% + Ketua 30% + Rekan 30%.</div></div></div></div>';
  return h;
}
function openStageDetailModal(sid,cid){
  var s=getStage(sid);if(!s){alert('Tidak ada!');return;}
  var i=DB.stages.findIndex(function(x){return x.id===sid;});
  var a=cid?isStageActive(cid,sid):true;
  var d=cid?getDeadline(cid,sid):null;
  var h='<div class="stage-header"><h3><span class="stage-num">'+(i+1)+'</span>Tahap '+(i+1)+': '+s.name+' — '+s.subtitle+'</h3><p>'+(s.longDesc||s.description)+'</p></div><div class="alert '+(a?'alert-success':'alert-warning')+'">'+(a?ico('unlock'):ico('lock'))+'<div><b>Status:</b> '+(a?'Aktif':'Terkunci')+(d&&d.date?' · Deadline: '+fmtDateShort(d.date):'')+' · Bobot: '+s.weight+'%</div></div>';
  openModal('Detail Tahap '+(i+1),h);
}

/* ===== KALKULASI ===== */
function calcWeightedAvg(scores,rubric){if(!scores||!rubric)return 0;var t=0,w=0;rubric.forEach(function(i){var s=scores[i.id];if(typeof s==='number'){t+=s*i.weight;w+=i.weight;}});if(w===0)return 0;return t/w;}
function calcStageScore(cid,tid,sid){
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return 0;
  var t=c.students.find(function(x){return x.id===tid;});if(!t)return 0;
  var rubric=getRubricFor(t.role);if(!rubric)return 0;
  var ev=(DB.evaluations[cid]&&DB.evaluations[cid][tid])||{};
  var guruS=null,ketuaScores=[],rekanScores=[];
  for(var eid in ev){
    var scores=ev[eid]&&ev[eid][sid];
    if(!scores||Object.keys(scores).length===0)continue;
    var avg=calcWeightedAvg(scores,rubric);
    if(eid==='guru'){guruS=avg;continue;}
    var evaluator=c.students.find(function(x){return x.id===eid;});
    if(!evaluator||evaluator.id===tid)continue;
    if(KETUA_ROLES.indexOf(evaluator.role)>=0){ketuaScores.push(avg);}
    else{rekanScores.push(avg);}
  }
  var ketuaAvg=ketuaScores.length?ketuaScores.reduce(function(a,b){return a+b;},0)/ketuaScores.length:null;
  var rekanAvg=rekanScores.length?rekanScores.reduce(function(a,b){return a+b;},0)/rekanScores.length:null;
  var parts=[],weights=[];
  if(guruS!==null){parts.push(guruS);weights.push(0.4);}
  if(ketuaAvg!==null){parts.push(ketuaAvg);weights.push(0.3);}
  if(rekanAvg!==null){parts.push(rekanAvg);weights.push(0.3);}
  if(parts.length===0)return 0;
  var totalW=weights.reduce(function(a,b){return a+b;},0);
  var sum=0;
  for(var i=0;i<parts.length;i++)sum+=parts[i]*(weights[i]/totalW);
  var att=getAttendanceFactor(cid,tid);
  if(att!==null)sum*=att;
  return Math.max(0,Math.min(4,sum));
}
function getAttendanceFactor(cid,sid){
  var att=DB.meetings?Object.keys(DB.meetings).map(function(k){return DB.meetings[k];}):[];
  var my=att.filter(function(m){return m.classId===cid;});
  if(my.length===0)return null;
  var present=0,total=0;
  my.forEach(function(m){
    var r=m.records&&m.records[sid];
    if(!r)return;
    total++;
    if(r==='hadir')present+=1;
    else if(r==='izin'||r==='sakit')present+=0.75;
    else if(r==='telat')present+=0.5;
  });
  if(total===0)return null;
  var pct=present/total;
  return 0.75+0.25*Math.min(1,Math.max(0,pct));
}
function calcFinalScore(cid,tid){
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return 0;
  var active=DB.stages.filter(function(s){return isStageActive(cid,s.id);});
  if(active.length===0)return 0;
  var totalW=active.reduce(function(a,s){return a+Number(s.weight||0);},0)||1;
  var sum=0;
  active.forEach(function(s){sum+=calcStageScore(cid,tid,s.id)*Number(s.weight||0);});
  return sum/totalW;
}

/* ===== GURU CLASS GRADING ===== */
function renderGuruClassGrading(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  document.getElementById('header-title-text').innerHTML=ico('edit')+' Penilaian — '+c.name;
  var targets=c.students.filter(function(s){return canGuruEvaluate(s.role);});
  var h='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-sm" onclick="viewClass(\''+cid+'\')">'+ico('back')+' Kembali</button></div>';
  h+='<div class="alert alert-info">'+ico('info')+'<div>Guru menilai <b>Pimpinan Produksi</b> & <b>Sutradara</b>.</div></div>';
  if(targets.length===0){h+='<div class="empty-state">'+ico('user','lg')+'<p>Belum ada target.</p></div>';}
  else{
    h+='<div class="grid">';
    targets.forEach(function(t){
      var active=DB.stages.filter(function(s){return isStageActive(cid,s.id);});
      var done=0;
      active.forEach(function(s){
        if(DB.evaluations[cid]&&DB.evaluations[cid][t.id]&&DB.evaluations[cid][t.id]['guru']&&DB.evaluations[cid][t.id]['guru'][s.id]&&Object.keys(DB.evaluations[cid][t.id]['guru'][s.id]).length>0)done++;
      });
      var pct=active.length?Math.round(done/active.length*100):0;
      var final=calcFinalScore(cid,t.id);
      h+='<div class="card card-accent blue"><h3>'+ico('user')+' '+t.name+'</h3><p style="font-size:12.5px;color:var(--text-muted);margin-bottom:10px;">'+((ROLES[t.role]||{}).label||t.role)+'</p><div class="target-progress"><div class="label">Progress</div><div class="progress-container"><div class="progress-bar '+(pct===100?'complete':'partial')+'" style="width:'+pct+'%"></div></div><div class="pct-mini">'+done+'/'+active.length+'</div></div><div class="score-display">Skor akhir <span class="value">'+final.toFixed(2)+'</span></div><button class="btn btn-primary btn-block" style="margin-top:12px;" onclick="openGradingForm(\''+cid+'\',\''+t.id+'\')">'+ico('edit')+' Nilai Sekarang</button></div>';
    });
    h+='</div>';
  }
  document.getElementById('main-content').innerHTML=h;updateNotifBadge();
}

function openGradingForm(cid,tid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var t=c.students.find(function(x){return x.id===tid;});if(!t)return;
  var rubric=getRubricFor(t.role);
  var ev=(DB.evaluations[cid]&&DB.evaluations[cid][tid])||{};
  var guruData=ev['guru']||{};
  var active=DB.stages.filter(function(s){return isStageActive(cid,s.id);});
  var h='<div class="alert alert-info">'+ico('info')+'<div>Nilai <b>'+t.name+'</b> ('+((ROLES[t.role]||{}).label||t.role)+')</div></div>';
  if(active.length===0){h+='<div class="empty-state">'+ico('lock','lg')+'<p>Tidak ada tahap aktif.</p></div>';}
  else{
    active.forEach(function(s){
      var scores=guruData[s.id]||{};
      h+='<div class="rubric-item"><h4>Tahap: '+s.name+' <span class="weight-info">'+s.weight+'%</span></h4><div class="desc">'+(s.description||'')+'</div>';
      rubric.forEach(function(r){
        var val=scores[r.id];
        h+='<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--border);"><div style="font-weight:600;color:var(--text-strong);font-size:12.5px;">'+r.name+' <span class="weight-info">'+r.weight+'%</span></div><div class="desc" style="margin-top:3px;">'+r.desc+'</div><div class="radio-group">';
        [4,3,2,1].forEach(function(v){
          var lbl={4:'Sangat Baik',3:'Baik',2:'Cukup',1:'Kurang'}[v];
          h+='<label><input type="radio" name="sc_'+s.id+'_'+r.id+'" value="'+v+'" '+(val===v?'checked':'')+' onchange="saveGradeValue(\''+cid+'\',\''+tid+'\',\''+s.id+'\',\''+r.id+'\',this.value)"> '+v+' — '+lbl+'</label>';
        });
        h+='</div></div>';
      });
      var stageAvg=calcWeightedAvg(scores,rubric);
      h+='<div class="score-display">Rata-rata tahap <span class="value">'+stageAvg.toFixed(2)+'</span></div></div>';
    });
  }
  h+='<button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="closeModal()">'+ico('check')+' Selesai</button>';
  openModal('Penilaian Guru — '+t.name,h);
}

function saveGradeValue(cid,tid,sid,rid,val){
  if(!firebaseReady)return;
  var key=cid+'__'+tid;
  var doc=fb.collection('evaluations').doc(key);
  doc.get().then(function(snap){
    var data=snap.exists?snap.data():{classId:cid,targetId:tid};
    if(!data.guru)data.guru={};
    if(!data.guru[sid])data.guru[sid]={};
    data.guru[sid][rid]=parseFloat(val);
    return doc.set(sanitizeFirestore(data),{merge:true});
  }).then(function(){
    logActivity('eval_submit',currentUser.name+' menilai '+tid+' tahap '+sid,{classId:cid,division:currentUser.role?getDivisionOfRole(currentUser.role):'guru',role:currentUser.role||''});
  }).catch(function(e){console.error('saveGrade:',e);});
}

/* ===== SISWA DASHBOARD ===== */
function renderSiswaDashboard(){
  document.getElementById('header-title-text').innerHTML=ico('user')+' Dashboard Siswa';
  var c=DB.classes.find(function(x){return x.id===currentUser.classId;});
  if(!c){document.getElementById('main-content').innerHTML='<div class="empty-state">'+ico('warning','lg')+'<p>Kelas tidak ditemukan.</p></div>';return;}
  var me=c.students.find(function(s){return s.id===currentUser.studentId;});
  if(!me){document.getElementById('main-content').innerHTML='<div class="empty-state">'+ico('warning','lg')+'<p>Data siswa tidak ditemukan.</p></div>';return;}

  var prog=getOverallProgress(c.id,me.id);
  var h='<div class="progress-banner"><h3>'+ico('chart')+' Progress Penilaian Anda</h3><div class="big-count">'+prog.done+' / '+prog.total+' <span>selesai</span></div><div class="pct">'+prog.pct+'% — Anda menilai '+prog.targetCount+' rekan</div><div class="progress-container" style="margin-top:12px;"><div class="progress-bar '+(prog.pct===100?'complete':prog.pct>0?'partial':'')+'" style="width:'+prog.pct+'%;"></div></div></div>';

  h+='<h3 style="color:var(--text-strong);margin:20px 0 12px;font-size:15px;font-weight:700;">'+ico('layers')+' Tahapan Aktif</h3>';
  var active=DB.stages.filter(function(s){return isStageActive(c.id,s.id);});
  if(active.length===0){
    h+='<div class="alert alert-warning">'+ico('lock')+'<div>Belum ada tahap dibuka guru.</div></div>';
  } else {
    h+='<div class="stage-grid">';
    active.forEach(function(s){
      var done=prog.byStage[s.id]?prog.byStage[s.id].done:0;
      var tot=prog.byStage[s.id]?prog.byStage[s.id].total:0;
      var d=getDeadline(c.id,s.id);
      var ov=d&&d.date&&isOverdue(d.date);
      h+='<div class="stage-card'+(done===tot&&tot>0?' completed':'')+'" onclick="openStudentStageGrading(\''+c.id+'\',\''+s.id+'\')"><div class="stage-num">'+(DB.stages.indexOf(s)+1)+'</div><h4>'+s.name+'</h4><p>'+(s.subtitle||s.description||'')+'</p><div class="progress '+(done===tot&&tot>0?'done':'pending')+'">'+done+'/'+tot+' dinilai</div>'+(d&&d.date?'<div class="deadline-info '+(ov?'overdue':'safe')+'">'+ico('clock','sm')+' '+fmtDateShort(d.date)+'</div>':'')+'</div>';
    });
    h+='</div>';
  }

  h+='<h3 style="color:var(--text-strong);margin:20px 0 12px;font-size:15px;font-weight:700;">'+ico('users')+' Tim Divisi Anda</h3>';
  var myDiv=getDivisionOfRole(me.role);
  h+='<p style="color:var(--text-muted);font-size:13px;margin-bottom:10px;">'+((DIVISIONS[myDiv]||{}).label||myDiv)+'</p>';
  var myDivMembers=c.students.filter(function(s){return getDivisionOfRole(s.role)===myDiv;});
  h+='<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Peran</th><th>Bisa Anda Nilai</th></tr></thead><tbody>';
  myDivMembers.forEach(function(s){
    var canMe=canEvaluate(me.role,s.role)&&s.id!==me.id;
    h+='<tr><td><b>'+s.name+'</b>'+(s.id===me.id?' <span class="badge badge-primary">Anda</span>':'')+'</td><td>'+((ROLES[s.role]||{}).label||s.role)+'</td><td>'+(canMe?'<span class="badge badge-success">'+ico('check','sm')+' Ya</span>':'<span class="badge badge-gray">Tidak</span>')+'</td></tr>';
  });
  h+='</tbody></table></div>';

  h+=renderActivityFeed('siswa');
  document.getElementById('main-content').innerHTML=h;
  updateNotifBadge();
  if(typeof window.__extrasRenderSiswa==='function')window.__extrasRenderSiswa();
}

function openStudentStageGrading(cid,sid){
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var me=c.students.find(function(s){return s.id===currentUser.studentId;});if(!me)return;
  var stage=getStage(sid);if(!stage)return;
  var targets=c.students.filter(function(s){return s.id!==me.id&&canEvaluate(me.role,s.role);});
  var h='<div class="stage-header"><h3>'+ico('layers')+' '+stage.name+'</h3><p>'+(stage.longDesc||stage.description)+'</p></div>';
  if(targets.length===0){
    h+='<div class="empty-state">'+ico('users','lg')+'<p>Tidak ada rekan yang bisa dinilai pada tahap ini.</p></div>';
  } else {
    h+='<p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">Pilih rekan untuk dinilai:</p>';
    targets.forEach(function(t){
      var ev=DB.evaluations[cid]&&DB.evaluations[cid][t.id]?DB.evaluations[cid][t.id]:{};
      var myScores=ev[me.id]&&ev[me.id][sid];
      var done=myScores&&Object.keys(myScores).length>0;
      h+='<div class="card '+(done?'card-accent green':'card-accent amber')+'"><h3>'+ico('user')+' '+t.name+' '+(done?'<span class="badge badge-success">'+ico('check','sm')+' Sudah dinilai</span>':'')+'</h3><p style="font-size:12.5px;color:var(--text-muted);margin-bottom:10px;">'+((ROLES[t.role]||{}).label||t.role)+'</p><button class="btn btn-primary btn-sm" onclick="openSiswaGradingForm(\''+cid+'\',\''+t.id+'\',\''+sid+'\')">'+ico('edit','sm')+' '+(done?'Edit Nilai':'Beri Nilai')+'</button></div>';
    });
  }
  openModal('Penilaian Tahap: '+stage.name,h);
}

function openSiswaGradingForm(cid,tid,sid){
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var me=c.students.find(function(s){return s.id===currentUser.studentId;});if(!me)return;
  var t=c.students.find(function(x){return x.id===tid;});if(!t)return;
  var stage=getStage(sid);if(!stage)return;
  var rubric=getRubricFor(t.role);
  var ev=DB.evaluations[cid]&&DB.evaluations[cid][tid]?DB.evaluations[cid][tid]:{};
  var myScores=ev[me.id]&&ev[me.id][sid]?ev[me.id][sid]:{};
  var h='<div class="alert alert-info">'+ico('info')+'<div>Menilai <b>'+t.name+'</b> — '+stage.name+'</div></div>';
  h+='<div class="rubric-item"><h4>Aspek Penilaian</h4><div class="desc">'+((ROLES[t.role]||{}).label||t.role)+'</div>';
  rubric.forEach(function(r){
    var val=myScores[r.id];
    h+='<div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--border);"><div style="font-weight:600;color:var(--text-strong);font-size:12.5px;">'+r.name+' <span class="weight-info">'+r.weight+'%</span></div><div class="desc" style="margin-top:3px;">'+r.desc+'</div>';
    if(r.scale){h+='<div class="scale-explain">'+r.scale+'</div>';}
    h+='<div class="radio-group">';
    [4,3,2,1].forEach(function(v){
      var lbl={4:'Sangat Baik',3:'Baik',2:'Cukup',1:'Kurang'}[v];
      h+='<label><input type="radio" name="ssc_'+r.id+'" value="'+v+'" '+(val===v?'checked':'')+'> '+v+' — '+lbl+'</label>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<button class="btn btn-primary btn-block btn-lg" onclick="saveSiswaGrade(\''+cid+'\',\''+t.id+'\',\''+sid+'\')">'+ico('save')+' Simpan Penilaian</button>';
  openModal('Nilai: '+t.name,h);
}

function saveSiswaGrade(cid,tid,sid){
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var t=c.students.find(function(x){return x.id===tid;});if(!t)return;
  var me=currentUser.studentId;
  var rubric=getRubricFor(t.role);
  var scores={},complete=true;
  rubric.forEach(function(r){
    var sel=document.querySelector('input[name="ssc_'+r.id+'"]:checked');
    if(!sel){complete=false;return;}
    scores[r.id]=parseFloat(sel.value);
  });
  if(!complete){alert('Lengkapi semua aspek!');return;}
  if(!firebaseReady){alert('Firebase belum siap.');return;}
  var key=cid+'__'+tid;
  var doc=fb.collection('evaluations').doc(key);
  doc.get().then(function(snap){
    var data=snap.exists?snap.data():{classId:cid,targetId:tid};
    if(!data[me])data[me]={};
    data[me][sid]=scores;
    return doc.set(sanitizeFirestore(data),{merge:true});
  }).then(function(){
    logActivity('eval_submit',currentUser.name+' menilai '+tid+' tahap '+sid,{classId:cid,division:getDivisionOfRole(currentUser.role),role:currentUser.role||''});
    alert('Penilaian tersimpan!');
    closeModal();
  }).catch(function(e){console.error('saveSiswaGrade:',e);alert('Gagal: '+e.message);});
}

/* ===== REKAP ===== */
function renderRecap(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  document.getElementById('header-title-text').innerHTML=ico('chart')+' Rekap — '+c.name;
  var h='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-sm" onclick="viewClass(\''+cid+'\')">'+ico('back')+' Kembali</button><button class="btn btn-sm" onclick="exportRecapExcel(\''+cid+'\')">'+ico('download')+' Export Excel</button></div>';
  h+='<div class="alert alert-info">'+ico('info')+'<div>Rekapitulasi nilai akhir. Bobot: Guru 40% + Ketua 30% + Rekan 30%.</div></div>';
  h+='<div class="table-wrap"><table><thead><tr><th>No</th><th>Nama</th><th>Peran</th>';
  DB.stages.forEach(function(s){h+='<th>'+s.name+'<br><small>('+s.weight+'%)</small></th>';});
  h+='<th>Nilai Akhir</th></tr></thead><tbody>';
  c.students.forEach(function(t,i){
    var final=calcFinalScore(cid,t.id);
    h+='<tr><td>'+(i+1)+'</td><td><b>'+t.name+'</b></td><td><span class="badge '+((ROLES[t.role]||{}).team==='produksi'?'badge-info':'badge-warning')+'">'+((ROLES[t.role]||{}).label||t.role)+'</span></td>';
    DB.stages.forEach(function(s){
      if(!isStageActive(cid,s.id)){h+='<td><span class="badge badge-gray">—</span></td>';return;}
      var sc=calcStageScore(cid,t.id,s.id);
      var color=sc>=3.5?'badge-success':sc>=2.5?'badge-info':sc>=1.5?'badge-warning':'badge-danger';
      h+='<td><span class="badge '+color+'">'+sc.toFixed(2)+'</span></td>';
    });
    h+='<td><b style="font-size:15px;color:var(--primary);">'+final.toFixed(2)+'</b></td></tr>';
  });
  h+='</tbody></table></div>';
  document.getElementById('main-content').innerHTML=h;updateNotifBadge();
}
function exportRecapExcel(cid){
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var header=['No','Nama','Email','Peran'];
  DB.stages.forEach(function(s){header.push(s.name+' ('+s.weight+'%)');});
  header.push('Nilai Akhir');
  var rows=[header];
  c.students.forEach(function(t,i){
    var r=[i+1,t.name,t.email||'-',((ROLES[t.role]||{}).label||t.role)];
    DB.stages.forEach(function(s){
      if(!isStageActive(cid,s.id)){r.push('—');return;}
      r.push(calcStageScore(cid,t.id,s.id).toFixed(2));
    });
    r.push(calcFinalScore(cid,t.id).toFixed(2));
    rows.push(r);
  });
  var ws=XLSX.utils.aoa_to_sheet(rows);
  var wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Rekap');
  XLSX.writeFile(wb,'Rekap_'+c.name+'.xlsx');
}

/* ===== ABSENSI ===== */
function openMeetingList(){
  var h='<div class="action-row" style="margin-bottom:16px;"><button class="btn btn-primary btn-sm" onclick="openCreateMeetingModal()">'+ico('plus')+' Buat Sesi Absensi</button></div>';
  var meetings=Object.values(DB.meetings||{}).filter(function(m){return ownsClass(m.classId);}).sort(function(a,b){return b.createdAt-a.createdAt;});
  if(meetings.length===0){h+='<div class="empty-state">'+ico('calendar','lg')+'<p>Belum ada sesi absensi.</p></div>';}
  else{
    meetings.forEach(function(m){
      var cls=DB.classes.find(function(x){return x.id===m.classId;});
      var present=0,total=cls?(cls.students||[]).length:0;
      for(var sid in m.records||{}){if(m.records[sid]==='hadir')present++;}
      h+='<div class="card card-accent blue"><h3>'+ico('calendar')+' '+m.title+'</h3><p style="font-size:12.5px;color:var(--text-muted);margin-bottom:8px;">'+(cls?cls.name:'-')+' · '+m.type+' · '+fmtDate(m.createdAt)+'</p><p style="font-size:12.5px;">Hadir: <b>'+present+'/'+total+'</b></p><div class="action-row" style="margin-top:10px;"><button class="btn btn-sm btn-primary" onclick="openMeetingAttendance(\''+m.id+'\')">'+ico('edit','sm')+' Isi Absensi</button><button class="btn btn-sm btn-danger" onclick="deleteMeeting(\''+m.id+'\')">'+ico('trash','sm')+'</button></div></div>';
    });
  }
  openModal('Absensi / Pertemuan',h);
}
function openCreateMeetingModal(){
  if(currentUser.type==='guru'||currentUser.type==='admin'){
    var list=(currentUser.type==='admin')?DB.classes:myClasses();
    if(list.length===0){alert('Belum ada kelas.');return;}
    var opts=list.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join('');
    openModal('Buat Sesi Absensi','<div class="form-group"><label>Judul</label><input id="mt-title" placeholder="Contoh: Latihan Rutin #1"></div><div class="form-group"><label>Kelas</label><select id="mt-class">'+opts+'</select></div><div class="form-group"><label>Jenis</label><select id="mt-type"><option value="latihan">Latihan</option><option value="rapat">Rapat</option><option value="gladi">Gladi Resik</option></select></div><div class="form-group"><label>Tanggal</label><input type="date" id="mt-date" value="'+new Date().toISOString().split('T')[0]+'"></div><button class="btn btn-primary btn-block" onclick="createMeeting()">'+ico('save')+' Buat</button>');
  } else alert('Hanya guru/admin yang bisa membuat sesi absensi.');
}
function createMeeting(){
  var ti=document.getElementById('mt-title').value.trim();
  var cid=document.getElementById('mt-class').value;
  var ty=document.getElementById('mt-type').value;
  var dt=document.getElementById('mt-date').value;
  if(!ti){alert('Judul wajib!');return;}
  var id=uid();
  var m={id:id,title:ti,classId:cid,type:ty,date:dt,records:{},createdAt:Date.now(),createdBy:currentUser.name};
  if(firebaseReady){fb.collection('meetings').doc(id).set(sanitizeFirestore(m)).then(function(){closeModal();openMeetingList();logActivity('meeting_create',currentUser.name+' buat sesi absensi: '+ti,{classId:cid});});}
  else{DB.meetings[id]=m;closeModal();openMeetingList();}
}
function deleteMeeting(mid){
  if(!confirm('Hapus sesi absensi ini?'))return;
  if(firebaseReady){fb.collection('meetings').doc(mid).delete().then(function(){openMeetingList();});}
  else{delete DB.meetings[mid];openMeetingList();}
}
function openMeetingAttendance(mid){
  var m=DB.meetings[mid];if(!m){alert('Sesi tidak ditemukan.');return;}
  if(!ownsClass(m.classId)){alert('Tidak punya akses.');return;}
  var c=DB.classes.find(function(x){return x.id===m.classId;});if(!c)return;
  var h='<div class="alert alert-info">'+ico('info')+'<div><b>'+m.title+'</b> · '+fmtDate(m.createdAt)+'</div></div>';
  h+='<div class="action-row" style="margin-bottom:12px;"><button class="btn btn-sm" onclick="markAllAttendance(\''+mid+'\',\'hadir\')">Hadir Semua</button><button class="btn btn-sm" onclick="markAllAttendance(\''+mid+'\',\'alpa\')">Alpa Semua</button></div>';
  h+='<div style="max-height:400px;overflow-y:auto;">';
  c.students.forEach(function(s){
    var r=m.records&&m.records[s.id]?m.records[s.id]:'';
    h+='<div style="display:flex;align-items:center;gap:10px;padding:8px;border-bottom:1px solid var(--border);flex-wrap:wrap;"><div style="flex:1;min-width:150px;"><b>'+s.name+'</b><br><small style="color:var(--text-muted);">'+((ROLES[s.role]||{}).label||s.role)+'</small></div>';
    ['hadir','izin','sakit','telat','alpa'].forEach(function(opt){
      var lbl={hadir:'Hadir',izin:'Izin',sakit:'Sakit',telat:'Telat',alpa:'Alpa'}[opt];
      var color={hadir:'success',izin:'info',sakit:'warning',telat:'warning',alpa:'danger'}[opt];
      h+='<label style="display:inline-flex;align-items:center;gap:4px;font-size:11.5px;padding:4px 8px;border-radius:6px;border:1px solid var(--border);cursor:pointer;background:'+(r===opt?'var(--'+color+'-soft)':'var(--surface)')+';"><input type="radio" name="att_'+s.id+'" value="'+opt+'" '+(r===opt?'checked':'')+' onchange="saveAttendance(\''+mid+'\',\''+s.id+'\',\''+opt+'\')"> '+lbl+'</label>';
    });
    h+='</div>';
  });
  h+='</div>';
  h+='<button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="closeModal()">Selesai</button>';
  openModal('Absensi: '+m.title,h);
}
function saveAttendance(mid,sid,status){
  if(!firebaseReady)return;
  var m=DB.meetings[mid];if(!m)return;
  if(!m.records)m.records={};
  m.records[sid]=status;
  fb.collection('meetings').doc(mid).update(sanitizeFirestore({records:m.records})).catch(function(e){console.error('saveAtt:',e);});
  logActivity('meeting_attend',currentUser.name+' menandai '+sid+' sebagai '+status,{classId:m.classId,division:currentUser.role?getDivisionOfRole(currentUser.role):'',role:currentUser.role||''});
}
function markAllAttendance(mid,status){
  var m=DB.meetings[mid];if(!m)return;
  var c=DB.classes.find(function(x){return x.id===m.classId;});if(!c)return;
  if(!m.records)m.records={};
  c.students.forEach(function(s){m.records[s.id]=status;});
  if(firebaseReady){fb.collection('meetings').doc(mid).update(sanitizeFirestore({records:m.records})).then(function(){openMeetingAttendance(mid);});}
  else openMeetingAttendance(mid);
}
function openAbsensiRekap(cid){
  if(!ownsClass(cid)){alert('Tidak punya akses.');return;}
  var c=DB.classes.find(function(x){return x.id===cid;});if(!c)return;
  var meetings=Object.values(DB.meetings||{}).filter(function(m){return m.classId===cid;});
  var h='<div class="alert alert-info">'+ico('info')+'<div>Rekap kehadiran '+meetings.length+' sesi.</div></div>';
  if(meetings.length===0){h+='<div class="empty-state">'+ico('calendar','lg')+'<p>Belum ada sesi absensi.</p></div>';}
  else{
    h+='<div class="table-wrap"><table><thead><tr><th>Nama</th>';
    meetings.forEach(function(m){h+='<th>'+m.title+'<br><small>'+fmtDateShort(m.date||m.createdAt)+'</small></th>';});
    h+='<th>Total Hadir</th></tr></thead><tbody>';
    c.students.forEach(function(s){
      var hadir=0;
      h+='<tr><td><b>'+s.name+'</b></td>';
      meetings.forEach(function(m){
        var r=m.records&&m.records[s.id]?m.records[s.id]:'-';
        if(r==='hadir')hadir++;
        var badge=r==='hadir'?'badge-success':r==='izin'?'badge-info':r==='sakit'?'badge-warning':r==='telat'?'badge-warning':r==='alpa'?'badge-danger':'badge-gray';
        h+='<td><span class="badge '+badge+'">'+r+'</span></td>';
      });
      h+='<td><b>'+hadir+'/'+meetings.length+'</b></td></tr>';
    });
    h+='</tbody></table></div>';
  }
  openModal('Rekap Absensi — '+c.name,h);
}

/* ===== WA LOGS GLOBAL ===== */
function openWaLogsGlobal(){
  var h='<div class="alert alert-info">'+ico('info')+'<div>Riwayat semua komunikasi (notifikasi & WA).</div></div>';
  h+='<div class="action-row" style="margin-bottom:12px;"><input id="wa-log-search" class="wa-search" placeholder="Cari..." oninput="renderWaLogsBody()"><button class="btn btn-sm" onclick="exportWaLogs()">'+ico('download','sm')+' Export</button></div>';
  h+='<div id="wa-logs-body"></div>';
  openModal('Log Komunikasi Global',h);
  renderWaLogsBody();
}
function renderWaLogsBody(){
  var b=document.getElementById('wa-logs-body');if(!b)return;
  var q=(document.getElementById('wa-log-search')&&document.getElementById('wa-log-search').value||'').toLowerCase();
  var logs=(DB.waLogs||[]).slice();
  /* Filter per kelas utk guru */
  if(currentUser&&currentUser.type==='guru'){
    var myIds=myClasses().map(function(c){return c.id;});
    logs=logs.filter(function(l){return !l.classId||myIds.indexOf(l.classId)>=0;});
  }
  if(q){logs=logs.filter(function(l){return (l.toName||'').toLowerCase().indexOf(q)>=0||(l.fromName||'').toLowerCase().indexOf(q)>=0||(l.title||'').toLowerCase().indexOf(q)>=0||(l.message||'').toLowerCase().indexOf(q)>=0;});}
  if(logs.length===0){b.innerHTML='<div class="empty-state">'+ico('send','lg')+'<p>Belum ada log.</p></div>';return;}
  var h='<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Total: '+logs.length+'</div>';
  logs.slice(0,100).forEach(function(l){
    var chB=l.channel==='both'?'<span class="badge badge-channel-both">App + WA</span>':(l.channel==='wa'?'<span class="badge badge-channel-wa">WA</span>':'<span class="badge badge-channel-app">App</span>');
    var tB=({tugas:'badge-info',instruksi:'badge-primary',info:'badge-success',urgent:'badge-danger',followup:'badge-warning',broadcast:'badge-primary'})[l.type]||'badge-gray';
    h+='<div class="wa-log-item"><div class="wa-log-header"><span class="badge '+tB+'">'+l.type+'</span>'+chB+'<span class="wa-log-time">'+fmtDate(l.createdAt)+'</span></div><div class="wa-log-title">'+l.title+'</div><div class="wa-log-meta">Dari: <b>'+l.fromName+'</b> → Ke: <b>'+l.toName+'</b>'+(l.toPhone?' <span class="wa-log-phone">'+ico('phone','sm')+' '+l.toPhone+'</span>':'')+'</div><div class="wa-log-body">'+l.message+'</div></div>';
  });
  b.innerHTML=h;
}
function exportWaLogs(){
  var logs=DB.waLogs||[];
  if(currentUser&&currentUser.type==='guru'){
    var myIds=myClasses().map(function(c){return c.id;});
    logs=logs.filter(function(l){return !l.classId||myIds.indexOf(l.classId)>=0;});
  }
  if(logs.length===0){alert('Tidak ada log.');return;}
  var rows=[['Waktu','Dari','Peran','Ke','Peran Penerima','No. WA','Channel','Jenis','Judul','Pesan']];
  logs.forEach(function(l){
    rows.push([new Date(l.createdAt).toLocaleString('id-ID'),l.fromName,l.fromRole||l.fromType,l.toName,(ROLES[l.toRole]||{}).label||l.toRole||'',l.toPhone||'-',l.channel,l.type,l.title,l.message]);
  });
  var ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:20},{wch:20},{wch:20},{wch:20},{wch:20},{wch:14},{wch:10},{wch:12},{wch:30},{wch:50}];
  var wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Log');
  XLSX.writeFile(wb,'Log_Komunikasi.xlsx');
}

/* ===== BOOT ===== */
function boot(){
  console.log('Boot SP-PPT...');
  initTheme();
  if(!firebaseReady){
    var t=document.getElementById('loading-text'),s=document.getElementById('loading-sub');
    if(t)t.textContent='Firebase tidak siap';
    if(s)s.textContent=firebaseError;
    setTimeout(function(){showLoginPage();},800);
    return;
  }
  subscribeAll();
  setTimeout(function(){
    var sess=getSession();
    if(sess){
      setTimeout(function(){
        if(sess.type==='guru'){
          var t=DB.teachers.find(function(x){return x.email&&x.email.toLowerCase()===String(sess.email||'').toLowerCase();});
          if(t){currentUser={type:'guru',email:t.email,name:t.name};saveSession();showApp();return;}
        }
        if(sess.type==='admin'){currentUser={type:'admin',email:sess.email,name:sess.name};saveSession();showApp();return;}
        if(sess.type==='siswa'){
          var c=DB.classes.find(function(x){return x.id===sess.classId;});
          if(c){var s=c.students.find(function(x){return x.id===sess.studentId;});if(s){currentUser={type:'siswa',classId:c.id,studentId:s.id,name:s.name,role:s.role,phone:s.phone||''};saveSession();showApp();return;}}
        }
        showLoginPage();
      },600);
    } else setTimeout(showLoginPage,600);
  },900);
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}
else boot();

/* ============================================================
   GLOBAL EXPORTS
   ============================================================ */
window.firebaseReady=firebaseReady;
window.fb=fb;
window.DB=DB;
window.ROLES=ROLES;
window.DIVISIONS=DIVISIONS;
window.RUBRICS=RUBRICS;
window.DEFAULT_STAGES=DEFAULT_STAGES;
window.uid=uid;
window.genClassCode=genClassCode;
window.getSession=getSession;
window.saveSession=saveSession;
window.clearSession=clearSession;
window.fbSetTeacher=fbSetTeacher;
window.fbDelTeacher=fbDelTeacher;
window.fbSetClass=fbSetClass;
window.fbSetEval=fbSetEval;
window.fbSetDeadlines=fbSetDeadlines;
window.fbSetActiveStages=fbSetActiveStages;
window.fbAddNotif=fbAddNotif;
window.fbDelNotif=fbDelNotif;
window.fbSetStages=fbSetStages;
window.fbAddActivity=fbAddActivity;
window.ico=ico;
window.togglePw=togglePw;
window.openModal=openModal;
window.closeModal=closeModal;
window.fmtDate=fmtDate;
window.fmtDateShort=fmtDateShort;
window.isOverdue=isOverdue;
window.getDeadline=getDeadline;
window.isStageActive=isStageActive;
window.getStage=getStage;
window.getRubricFor=getRubricFor;
window.canEvaluate=canEvaluate;
window.canGuruEvaluate=canGuruEvaluate;
window.getDivisionOfRole=getDivisionOfRole;
window.canSendBroadcast=canSendBroadcast;
window.logActivity=logActivity;
window.debouncedRender=debouncedRender;
window.getOverallProgress=getOverallProgress;
window.getProgressForTarget=getProgressForTarget;
window.isStageDoneFor=isStageDoneFor;
window.hasUserAssessed=hasUserAssessed;
window.countAssessors=countAssessors;
window.calcWeightedAvg=calcWeightedAvg;
window.calcStageScore=calcStageScore;
window.calcFinalScore=calcFinalScore;
window.getAttendanceFactor=getAttendanceFactor;
window.sanitizeFirestore=sanitizeFirestore;

/* Re-expose fungsi render */
window.renderGuruDashboard=renderGuruDashboard;
window.renderSiswaDashboard=renderSiswaDashboard;
window.renderAdminDashboard=renderAdminDashboard;
window.viewClass=viewClass;
window.renderGuruClassGrading=renderGuruClassGrading;
window.renderRecap=renderRecap;
window.renderStageManagement=renderStageManagement;
window.showLoginPage=showLoginPage;
window.showRegisterPage=showRegisterPage;
window.showApp=showApp;
window.switchLoginTab=switchLoginTab;
window.loginGuru=loginGuru;
window.loginSiswa=loginSiswa;
window.loginAdmin=loginAdmin;
window.registerSiswa=registerSiswa;
window.logout=logout;
window.setTheme=setTheme;
window.openForgotPassword=openForgotPassword;
window.openChangePassword=openChangePassword;
window.openBroadcastModal=openBroadcastModal;
window.sendBroadcast=sendBroadcast;
window.openMeetingList=openMeetingList;
window.openWaLogsGlobal=openWaLogsGlobal;
window.openActivityLog=openActivityLog;
window.openAddClassModal=openAddClassModal;
window.openAddStudentModal=openAddStudentModal;
window.openImportModal=openImportModal;
window.openActivationModal=openActivationModal;
window.openDeadlineModal=openDeadlineModal;
window.openNotifPanel=openNotifPanel;
window.closeNotifPanel=closeNotifPanel;
window.markNotifRead=markNotifRead;
window.markTaskDone=markTaskDone;
window.deleteNotif=deleteNotif;

/* ===== END app.js ===== */
