/* ============================================================
   SIM — app.js (ALL-IN-ONE)
   Firebase + Auth + Session + Core + Classes + Evaluations
   + Checklist + Absensi + Broadcast + WA Logs
   ============================================================ */

/* ---------- 1. FIREBASE IMPORTS ---------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, onSnapshot, query, orderBy, limit,
  serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ---------- 2. FIREBASE CONFIG ---------- */
/* ⚠️ GANTI DENGAN CONFIG DARI FIREBASE CONSOLE KAMU */
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "sim-app-xxxxx.firebaseapp.com",
  projectId: "sim-app-xxxxx",
  storageBucket: "sim-app-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- 3. ICONS (SVG) ---------- */
const ICONS = {
  home:['M3 12l9-9 9 9v8a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z'],
  bell:['M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9','M13.7 21a2 2 0 01-3.4 0'],
  user:['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2','M12 11a4 4 0 100-8 4 4 0 000 8'],
  users:['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2','M9 11a4 4 0 100-8 4 4 0 000 8','M23 21v-2a4 4 0 00-3-3.87','M16 3.13a4 4 0 010 7.75'],
  plus:['M12 5v14','M5 12h14'],
  trash:['M3 6h18','M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2','M19 6v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6'],
  edit:['M12 20h9','M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z'],
  check:['M20 6L9 17l-5-5'],
  x:['M18 6L6 18','M6 6l12 12'],
  book:['M4 19.5A2.5 2.5 0 016.5 17H20','M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2'],
  clip:['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2','M9 2h6v4H9z'],
  phone:['M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z'],
  chart:['M18 20V10','M12 20V4','M6 20v-6'],
  logout:['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4','M16 17l5-5-5-5','M21 12H9'],
  send:['M22 2L11 13','M22 2l-7 20-4-9-9-4 20-7z'],
  info:['M12 22a10 10 0 100-20 10 10 0 000 20','M12 16v-4','M12 8h.01'],
  star:['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'],
  eye:['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 15a3 3 0 100-6 3 3 0 000 6'],
  arrowL:['M19 12H5','M12 19l-7-7 7-7'],
  broadcast:['M4.93 4.93a10 10 0 000 14.14','M19.07 4.93a10 10 0 010 14.14','M7.76 7.76a6 6 0 000 8.48','M16.24 7.76a6 6 0 010 8.48','M12 12h.01']
};
function ico(name, size=20){
  const p = ICONS[name] || ICONS.info;
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + p.map(d=>'<path d="'+d+'"/>').join('') + '</svg>';
}

/* ---------- 4. STATE ---------- */
let DB = { users:{}, classes:{}, members:{}, evaluations:{}, notifications:{}, activities:[], broadcasts:[], waLogs:[] };
let currentUser = null;
let currentView = 'home';
let openClassId = null;
let unsubs = [];
let toastTimer = null;

const $ = id => document.getElementById(id);
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function fmtDate(ts){
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
function relTime(ts){
  const t = ts?.toDate ? ts.toDate().getTime() : ts;
  const m = Math.floor((Date.now()-t)/60000);
  if(m<1) return 'baru saja';
  if(m<60) return m+' menit lalu';
  const h = Math.floor(m/60);
  if(h<24) return h+' jam lalu';
  const d = Math.floor(h/24);
  if(d<7) return d+' hari lalu';
  return fmtDate(ts);
}
function genClassCode(){
  const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s='';
  for(let i=0;i<6;i++) s+=c[Math.floor(Math.random()*c.length)];
  return s;
}

/* ---------- 5. TOAST / MODAL ---------- */
function toast(msg, type){
  const el = $('toast'); if(!el) return;
  el.textContent = msg;
  el.className = 'toast show ' + (type||'');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.className = 'toast'; }, 2600);
}
function openModal(title, body){
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML = body;
  $('modal').classList.remove('hidden');
}
function closeModal(){
  $('modal').classList.add('hidden');
  $('modalBody').innerHTML = '';
}

/* ---------- 6. ACTIVITY / NOTIF ---------- */
async function addActivity(text){
  try{
    await addDoc(collection(db,'activities'), {
      text, by: currentUser?.uid || '-', byName: currentUser?.name || 'Sistem',
      at: serverTimestamp()
    });
  }catch(e){ console.warn('addActivity:', e); }
}
async function pushNotif(targetUid, notif){
  try{
    await addDoc(collection(db,'notifications',targetUid,'items'), {
      title: notif.title, body: notif.body || '', read: false, at: serverTimestamp()
    });
  }catch(e){ console.warn('pushNotif:', e); }
}
async function broadcastNotif(targetRole, notif){
  const targets = Object.values(DB.users).filter(u => {
    if(currentUser && u.uid === currentUser.uid) return false;
    if(targetRole === 'all') return true;
    return u.role === targetRole;
  });
  await Promise.all(targets.map(u => pushNotif(u.uid, notif)));
}
function updateBell(){
  if(!currentUser) return;
  const notifs = DB.notifications[currentUser.uid] || {};
  const unread = Object.values(notifs).filter(n=>!n.read).length;
  const badge = $('bellBadge'); if(!badge) return;
  if(unread>0){ badge.textContent = unread>99?'99+':unread; badge.classList.remove('hidden'); }
  else badge.classList.add('hidden');
}
function openNotifPanel(){
  if(!currentUser) return;
  const notifs = DB.notifications[currentUser.uid] || {};
  const list = Object.values(notifs).sort((a,b)=> (b.at?.seconds||0) - (a.at?.seconds||0));
  $('notifList').innerHTML = list.length
    ? list.map(n=>'<div class="notif-item'+(n.read?'':' unread')+'">'
        +'<div class="notif-title">'+esc(n.title)+'</div>'
        +'<div class="notif-body">'+esc(n.body||'')+'</div>'
        +'<div class="notif-time">'+relTime(n.at)+'</div></div>').join('')
    : '<div class="empty">Tidak ada notifikasi</div>';
  $('notifPanel').classList.remove('hidden');
  $('panelOverlay').classList.remove('hidden');
  Object.entries(notifs).forEach(([nid,n])=>{
    if(!n.read) updateDoc(doc(db,'notifications',currentUser.uid,'items',nid),{read:true}).catch(()=>{});
  });
}
function closeNotifPanel(){
  $('notifPanel').classList.add('hidden');
  $('panelOverlay').classList.add('hidden');
}

/* ---------- 7. AUTH ---------- */
async function doLogin(e){
  e.preventDefault();
  const email = $('loginEmail').value.trim().toLowerCase();
  const pass = $('loginPass').value;
  try{
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const snap = await getDoc(doc(db,'users',cred.user.uid));
    if(!snap.exists()){ toast('Profil user tidak ditemukan','error'); await signOut(auth); return; }
    currentUser = { uid: cred.user.uid, ...snap.data() };
    addActivity(currentUser.name+' masuk ke sistem');
    await attachListeners();
    showApp();
    toast('Selamat datang, '+currentUser.name,'success');
  }catch(err){
    console.error(err);
    let msg = 'Login gagal';
    if(err.code==='auth/user-not-found' || err.code==='auth/wrong-password' || err.code==='auth/invalid-credential') msg='Email atau password salah';
    else if(err.code==='auth/unauthorized-domain') msg='Domain belum diizinkan di Firebase';
    else msg = err.message || msg;
    toast(msg,'error');
  }
}
async function doRegister(e){
  e.preventDefault();
  const name = $('regName').value.trim();
  const email = $('regEmail').value.trim().toLowerCase();
  const pass = $('regPass').value;
  const role = $('regRole').value;
  const cls = $('regClass').value.trim();
  if(!name || !email || !pass) return toast('Lengkapi data','error');
  if(pass.length < 6) return toast('Password minimal 6 karakter','error');
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db,'users',cred.user.uid), {
      name, email, role,
      division: role==='guru'?'Umum':'',
      classId: '', className: cls||'',
      createdAt: serverTimestamp()
    });
    addActivity('Registrasi: '+name+' ('+role+')');
    toast('Registrasi berhasil! Silakan masuk.','success');
    await signOut(auth);
    showLogin();
  }catch(err){
    console.error(err);
    let msg = err.message || 'Registrasi gagal';
    if(err.code==='auth/email-already-in-use') msg='Email sudah terdaftar';
    if(err.code==='auth/weak-password') msg='Password terlalu lemah';
    toast(msg,'error');
  }
}
async function doLogout(){
  if(!confirm('Yakin ingin keluar?')) return;
  if(currentUser) await addActivity(currentUser.name+' keluar');
  detachListeners();
  await signOut(auth);
  currentUser = null;
  DB = { users:{}, classes:{}, members:{}, evaluations:{}, notifications:{}, activities:[], broadcasts:[], waLogs:[] };
  closeNotifPanel(); closeModal();
  showLogin();
}

/* ---------- 8. SCREEN ---------- */
function showLogin(){
  $('app').classList.add('hidden');
  $('registerScreen').classList.add('hidden');
  $('loginScreen').classList.remove('hidden');
  const lf = $('loginForm'); if(lf) lf.reset();
}
function showRegister(){
  $('app').classList.add('hidden');
  $('loginScreen').classList.add('hidden');
  $('registerScreen').classList.remove('hidden');
  const rf = $('registerForm'); if(rf) rf.reset();
}
function showApp(){
  $('loginScreen').classList.add('hidden');
  $('registerScreen').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('userName').textContent = currentUser.name;
  $('userRole').textContent = currentUser.role + (currentUser.division && currentUser.role==='guru' ? ' • '+currentUser.division : '');
  currentView = 'home';
  renderNav();
  renderView('home');
  updateBell();
}

/* ---------- 9. NAV ---------- */
function renderNav(){
  const menus = {
    admin: [
      {id:'home', label:'Dashboard', icon:'home'},
      {id:'classes', label:'Kelas', icon:'book'},
      {id:'teachers', label:'Pengguna', icon:'users'},
      {id:'activity', label:'Aktivitas', icon:'chart'}
    ],
    guru: [
      {id:'home', label:'Dashboard', icon:'home'},
      {id:'classes', label:'Kelas Saya', icon:'book'},
      {id:'broadcast', label:'Broadcast', icon:'broadcast'},
      {id:'walogs', label:'WA Log', icon:'phone'},
      {id:'activity', label:'Aktivitas', icon:'chart'}
    ],
    siswa: [
      {id:'home', label:'Dashboard', icon:'home'},
      {id:'myclasses', label:'Kelas', icon:'book'},
      {id:'grades', label:'Nilai', icon:'star'}
    ]
  };
  const list = menus[currentUser.role] || menus.siswa;
  $('mainNav').innerHTML = list.map(m =>
    '<button class="nav-btn'+(currentView===m.id?' active':'')+'" data-view="'+m.id+'">'
    + ico(m.icon,18) + '<span>'+m.label+'</span></button>'
  ).join('');
  $('mainNav').querySelectorAll('.nav-btn').forEach(b=>{
    b.onclick = ()=>{ currentView = b.dataset.view; renderNav(); renderView(currentView); };
  });
}
function renderView(view){
  const el = $('mainContent'); if(!el) return;
  const map = {
    home: renderHome, classes: renderClasses, teachers: renderTeachers,
    activity: renderActivity, broadcast: renderBroadcastPage,
    walogs: renderWALogsPage, myclasses: renderMyClasses, grades: renderGrades
  };
  const fn = map[view];
  el.innerHTML = '';
  if(typeof fn !== 'function'){ el.innerHTML = '<div class="empty">Halaman belum tersedia</div>'; return; }
  try { fn(el); } catch(e){
    console.error('renderView', view, e);
    el.innerHTML = '<div class="empty">Error: '+esc(e.message)+'</div>';
  }
}

/* ---------- 10. HOME ---------- */
function renderHome(el){
  if(currentUser.role === 'admin') return renderAdminHome(el);
  if(currentUser.role === 'guru') return renderGuruHome(el);
  return renderSiswaHome(el);
}
function renderAdminHome(el){
  const t = Object.values(DB.users).filter(u=>u.role==='guru').length;
  const s = Object.values(DB.users).filter(u=>u.role==='siswa').length;
  const c = Object.keys(DB.classes).length;
  const a = DB.activities.length;
  el.innerHTML =
    '<div class="page-head"><div><h2>Dashboard Admin</h2>'
    +'<p class="sub">Selamat datang, '+esc(currentUser.name)+'</p></div></div>'
    +'<div class="stats-grid">'
    + statCard('users','Guru',t) + statCard('user','Siswa',s)
    + statCard('book','Kelas',c) + statCard('chart','Aktivitas',a)
    +'</div>'
    +'<div class="card"><h3>Aktivitas Terbaru</h3>'
    + '<div class="activity-list">'+renderActivityItems(DB.activities.slice(0,8))+'</div></div>';
}
function renderGuruHome(el){
  const mine = Object.values(DB.classes).filter(c=>c.teacherId===currentUser.uid);
  const set = new Set();
  mine.forEach(c => Object.keys(DB.members[c.id]||{}).forEach(u=>set.add(u)));
  const wa = DB.waLogs.filter(w=>w.from===currentUser.uid).length;
  const bc = DB.broadcasts.filter(b=>b.from===currentUser.uid).length;
  el.innerHTML =
    '<div class="page-head"><div><h2>Dashboard Guru</h2>'
    +'<p class="sub">'+esc(currentUser.name)+' • '+esc(currentUser.division||'Umum')+'</p></div></div>'
    +'<div class="stats-grid">'
    + statCard('book','Kelas Saya',mine.length) + statCard('user','Total Siswa',set.size)
    + statCard('phone','WA Terkirim',wa) + statCard('broadcast','Broadcast',bc)
    +'</div>'
    +'<div class="card"><h3>Kelas Saya</h3>'
    + (mine.length ? '<div class="class-list">'+mine.map(c=>classCard(c)).join('')+'</div>'
        : '<div class="empty">Belum ada kelas.</div>')
    +'</div>';
  bindClassCards(el);
}
function renderSiswaHome(el){
  const notifs = DB.notifications[currentUser.uid] || {};
  const unread = Object.values(notifs).filter(n=>!n.read).length;
  const mine = Object.values(DB.classes).filter(c => DB.members[c.id] && DB.members[c.id][currentUser.uid]);
  const recent = Object.values(notifs).sort((a,b)=> (b.at?.seconds||0)-(a.at?.seconds||0)).slice(0,5);
  el.innerHTML =
    '<div class="page-head"><div><h2>Dashboard Siswa</h2>'
    +'<p class="sub">'+esc(currentUser.name)+(currentUser.className?' • '+esc(currentUser.className):'')+'</p></div></div>'
    +'<div class="stats-grid">'
    + statCard('book','Kelas Diikuti',mine.length)
    + statCard('bell','Notif Baru',unread)
    +'</div>'
    +'<div class="card"><h3>Notifikasi Terbaru</h3>'
    + (recent.length
        ? '<div class="notif-list">'+recent.map(n=>'<div class="notif-item'+(n.read?'':' unread')+'">'
            +'<div class="notif-title">'+esc(n.title)+'</div>'
            +'<div class="notif-body">'+esc(n.body||'')+'</div>'
            +'<div class="notif-time">'+relTime(n.at)+'</div></div>').join('')+'</div>'
        : '<div class="empty">Belum ada notifikasi</div>')
    +'</div>'
    +'<div class="card"><h3>Kelas Saya</h3>'
    + (mine.length ? '<div class="class-list">'+mine.map(c=>classCard(c,true)).join('')+'</div>'
        : '<div class="empty">Belum terdaftar di kelas manapun</div>')
    +'</div>';
  bindClassCards(el);
}
function statCard(icon, label, value){
  return '<div class="stat-card"><div class="stat-icon">'+ico(icon,22)+'</div>'
    +'<div><div class="stat-value">'+value+'</div><div class="stat-label">'+label+'</div></div></div>';
}
function renderActivityItems(list){
  if(!list.length) return '<div class="empty">Belum ada aktivitas</div>';
  return list.map(a =>
    '<div class="activity-item"><div class="activity-dot"></div>'
    +'<div class="activity-text"><div>'+esc(a.text)+'</div>'
    +'<div class="activity-time">'+relTime(a.at)+' • '+esc(a.byName)+'</div></div></div>'
  ).join('');
}

/* ---------- 11. CLASS CARD ---------- */
function classCard(c, simple){
  const mc = Object.keys(DB.members[c.id]||{}).length;
  const canDel = !simple && currentUser.role !== 'siswa';
  return '<div class="class-card" data-id="'+c.id+'">'
    +'<div class="class-head"><div>'
      +'<div class="class-name">'+esc(c.name)+'</div>'
      +'<div class="class-meta">Kode: <code>'+esc(c.code)+'</code> • '+mc+' siswa</div>'
    +'</div><span class="badge-soft">'+esc(c.division||'-')+'</span></div>'
    +'<div class="class-actions">'
      +'<button class="btn btn-sm" data-act="view">'+ico('eye',14)+' Buka</button>'
      +(canDel ? '<button class="btn btn-sm btn-danger" data-act="del">'+ico('trash',14)+' Hapus</button>' : '')
    +'</div></div>';
}
function bindClassCards(root){
  root.querySelectorAll('.class-card').forEach(card=>{
    const id = card.dataset.id;
    card.querySelectorAll('[data-act]').forEach(btn=>{
      btn.onclick = e=>{
        e.stopPropagation();
        if(btn.dataset.act==='view') openClassDetail(id);
        else if(btn.dataset.act==='del') deleteClass(id);
      };
    });
  });
}

/* ---------- 12. CLASSES PAGE ---------- */
function renderClasses(el){
  const isAdmin = currentUser.role === 'admin';
  const list = Object.values(DB.classes).filter(c => isAdmin || c.teacherId === currentUser.uid);
  el.innerHTML =
    '<div class="page-head"><div><h2>'+(isAdmin?'Semua Kelas':'Kelas Saya')+'</h2>'
    +'<p class="sub">'+list.length+' kelas</p></div>'
    +'<button class="btn btn-primary" id="btnNewClass">'+ico('plus',16)+' Buat Kelas</button></div>'
    +'<div class="class-list">'+(list.length ? list.map(c=>classCard(c)).join('') : '<div class="empty">Belum ada kelas</div>')+'</div>';
  const nb = $('btnNewClass'); if(nb) nb.onclick = openCreateClass;
  bindClassCards(el);
}
function openCreateClass(){
  openModal('Buat Kelas Baru',
    '<form id="classForm">'
    +'<label>Nama Kelas<input id="cName" required placeholder="XI IPA 1"></label>'
    +'<label>Divisi<input id="cDiv" value="'+esc(currentUser.division||'Umum')+'"></label>'
    +'<label>Deskripsi<textarea id="cDesc"></textarea></label>'
    +'<div class="modal-actions">'
      +'<button type="button" class="btn" id="cCancel">Batal</button>'
      +'<button type="submit" class="btn btn-primary">Simpan</button>'
    +'</div></form>');
  $('cCancel').onclick = closeModal;
  $('classForm').onsubmit = async e=>{
    e.preventDefault();
    const name = $('cName').value.trim();
    const div = $('cDiv').value.trim() || 'Umum';
    const desc = $('cDesc').value.trim();
    if(!name) return toast('Nama wajib diisi','error');
    try{
      await addDoc(collection(db,'classes'), {
        name, code: genClassCode(), division: div, desc,
        teacherId: currentUser.uid, teacherName: currentUser.name,
        checklist: [], createdAt: serverTimestamp()
      });
      addActivity('Kelas baru: '+name);
      broadcastNotif('all', {title:'Kelas Baru', body:'Kelas "'+name+'" dibuat oleh '+currentUser.name});
      toast('Kelas dibuat','success');
      closeModal();
    }catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
  };
}
async function deleteClass(id){
  const c = DB.classes[id];
  if(!c) return toast('Kelas tidak ditemukan','error');
  if(currentUser.role!=='admin' && c.teacherId!==currentUser.uid) return toast('Tidak berwenang','error');
  if(!confirm('Hapus kelas "'+c.name+'"? Semua data terkait akan terhapus.')) return;
  try{
    const batch = writeBatch(db);
    const memSnap = await getDocs(collection(db,'members',id,'list'));
    memSnap.forEach(d => batch.delete(d.ref));
    const evalSnap = await getDocs(collection(db,'evaluations'));
    evalSnap.forEach(d => { if(d.id.startsWith(id+'_')) batch.delete(d.ref); });
    batch.delete(doc(db,'classes',id));
    await batch.commit();
    addActivity('Kelas dihapus: '+c.name);
    toast('Kelas dihapus','success');
    if(currentView==='classdetail'){ currentView='classes'; renderNav(); }
  }catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
}

/* ---------- 13. CLASS DETAIL ---------- */
function openClassDetail(classId){
  const c = DB.classes[classId];
  if(!c) return toast('Kelas tidak ditemukan','error');
  openClassId = classId;
  const el = $('mainContent');
  const isOwner = currentUser.role==='admin' || c.teacherId===currentUser.uid;
  const mc = Object.keys(DB.members[classId]||{}).length;
  el.innerHTML =
    '<div class="page-head"><div>'
      +'<button class="btn btn-sm" id="backBtn">'+ico('arrowL',14)+' Kembali</button>'
      +'<h2 style="margin-top:10px">'+esc(c.name)+'</h2>'
      +'<p class="sub">Kode: <code>'+esc(c.code)+'</code> • '+mc+' siswa • Divisi '+esc(c.division)
      +(c.desc?' • '+esc(c.desc):'')+'</p>'
    +'</div></div>'
    +'<div class="tabs" id="classTabs">'
      +'<button class="tab active" data-tab="students">Siswa</button>'
      +'<button class="tab" data-tab="evaluate">Penilaian</button>'
      +'<button class="tab" data-tab="checklist">Checklist</button>'
      +(isOwner?'<button class="tab" data-tab="broadcast">Broadcast</button>':'')
      +(isOwner?'<button class="tab" data-tab="wa">WA</button>':'')
    +'</div><div id="tabContent"></div>';
  $('mainNav').querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  $('backBtn').onclick = ()=>{
    currentView = currentUser.role==='siswa' ? 'myclasses' : 'classes';
    renderNav(); renderView(currentView);
  };
  el.querySelectorAll('.tab').forEach(t=>t.onclick = ()=>{
    el.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    renderClassTab(t.dataset.tab, classId, isOwner);
  });
  renderClassTab('students', classId, isOwner);
}
function renderClassTab(tab, classId, isOwner){
  const cont = $('tabContent'); if(!cont) return;
  if(tab==='students') return renderTabStudents(cont, classId, isOwner);
  if(tab==='evaluate') return renderTabEvaluate(cont, classId, isOwner);
  if(tab==='checklist') return renderTabChecklist(cont, classId, isOwner);
  if(tab==='broadcast') return renderTabBroadcast(cont, classId);
  if(tab==='wa') return renderTabWA(cont, classId);
}

/* ---------- 14. TAB: STUDENTS ---------- */
function renderTabStudents(el, classId, isOwner){
  const ids = Object.keys(DB.members[classId]||{});
  const rows = ids.map(sid=>{
    const u = DB.users[sid]; if(!u) return '';
    return '<tr><td>'+esc(u.name)+'</td><td>'+esc(u.email)+'</td><td>'+esc(u.className||'-')+'</td>'
      +'<td>'+(isOwner?'<button class="btn btn-sm btn-danger" data-remove="'+sid+'">'+ico('trash',12)+'</button>':'-')+'</td></tr>';
  }).join('');
  el.innerHTML =
    '<div class="card">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px">'
      +'<h3>Anggota ('+ids.length+')</h3>'
      +(isOwner?'<button class="btn btn-sm btn-primary" id="btnAddStudent">'+ico('plus',14)+' Tambah</button>':'')
    +'</div>'
    +(ids.length
      ? '<div class="table-wrap"><table><thead><tr><th>Nama</th><th>Email</th><th>Kelas</th><th>Aksi</th></tr></thead>'
        +'<tbody>'+rows+'</tbody></table></div>'
      : '<div class="empty">Belum ada siswa</div>')
    +'</div>';
  if(isOwner){
    const b = $('btnAddStudent'); if(b) b.onclick = ()=>openAddStudent(classId);
    el.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.onclick = ()=>removeStudent(classId, btn.dataset.remove);
    });
  }
}
function openAddStudent(classId){
  const reg = new Set(Object.keys(DB.members[classId]||{}));
  const cand = Object.values(DB.users).filter(u=>u.role==='siswa' && !reg.has(u.uid));
  openModal('Tambah Siswa',
    '<form id="addStudentForm">'
    +'<label>Pilih Siswa<select id="asSelect" required>'
      +'<option value="">— Pilih siswa —</option>'
      + cand.map(u=>'<option value="'+u.uid+'">'+esc(u.name)+' — '+esc(u.email)+'</option>').join('')
    +'</select></label>'
    +'<div class="modal-actions">'
      +'<button type="button" class="btn" id="asCancel">Batal</button>'
      +'<button type="submit" class="btn btn-primary">Tambah</button>'
    +'</div></form>');
  $('asCancel').onclick = closeModal;
  $('addStudentForm').onsubmit = async e=>{
    e.preventDefault();
    const sid = $('asSelect').value;
    if(!sid) return toast('Pilih siswa','error');
    try{
      await setDoc(doc(db,'members',classId,'list',sid), { joinedAt: Date.now() });
      const cls = DB.classes[classId];
      const s = DB.users[sid];
      await updateDoc(doc(db,'users',sid), { classId, className: cls.name });
      pushNotif(sid, {title:'Ditambahkan ke Kelas', body:'Anda ditambahkan ke kelas "'+cls.name+'"'});
      addActivity('Siswa '+s.name+' ditambahkan ke '+cls.name);
      toast('Siswa ditambahkan','success');
      closeModal();
    }catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
  };
}
async function removeStudent(classId, sid){
  const u = DB.users[sid]; if(!u) return;
  if(!confirm('Keluarkan '+u.name+' dari kelas ini?')) return;
  try{
    await deleteDoc(doc(db,'members',classId,'list',sid));
    await deleteDoc(doc(db,'evaluations',classId+'_'+sid)).catch(()=>{});
    await updateDoc(doc(db,'users',sid), { classId:'', className:'' }).catch(()=>{});
    addActivity('Siswa '+u.name+' dikeluarkan');
    toast('Siswa dikeluarkan','success');
  }catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
}

/* ---------- 15. TAB: EVALUATE ---------- */
const CRITERIA = ['Kehadiran','Keaktifan','Tugas','Sikap','Kerjasama'];
const ATT_OPTS = [{v:'hadir',l:'H'},{v:'izin',l:'I'},{v:'sakit',l:'S'},{v:'alpa',l:'A'}];
function renderTabEvaluate(el, classId, isOwner){
  const ids = Object.keys(DB.members[classId]||{});
  if(!ids.length){ el.innerHTML = '<div class="card"><div class="empty">Tambahkan siswa dulu</div></div>'; return; }
  el.innerHTML =
    '<div class="card"><h3>Penilaian & Absensi</h3>'
    +'<p class="sub" style="margin-bottom:14px;font-size:12px;color:var(--text2)">Nilai 0-100. Absensi H/I/S/A.</p>'
    +'<div class="table-wrap"><table><thead><tr><th>Siswa</th><th>Stage</th>'
    + CRITERIA.map(c=>'<th>'+c+'</th>').join('')
    +'<th>Absensi</th><th>Aksi</th></tr></thead><tbody id="evalBody"></tbody></table></div></div>';
  const body = $('evalBody');
  body.innerHTML = ids.map(sid=>{
    const u = DB.users[sid]; if(!u) return '';
    const ev = DB.evaluations[classId+'_'+sid] || {};
    const s1 = ev.stage1?.scores || {};
    const s2 = ev.stage2?.scores || {};
    const att = ev.stage2?.attendance?.m1 || '';
    const r1 = CRITERIA.map(c=>'<td><input class="score-input" type="number" min="0" max="100" data-sid="'+sid+'" data-stage="1" data-crit="'+c+'" value="'+(s1[c]??'')+'" '+(isOwner?'':'disabled')+'></td>').join('');
    const r2 = CRITERIA.map(c=>'<td><input class="score-input" type="number" min="0" max="100" data-sid="'+sid+'" data-stage="2" data-crit="'+c+'" value="'+(s2[c]??'')+'" '+(isOwner?'':'disabled')+'></td>').join('');
    const attHTML = ATT_OPTS.map(o=>'<button class="att-btn'+(att===o.v?' on':'')+'" data-sid="'+sid+'" data-att="'+o.v+'" '+(isOwner?'':'disabled')+'>'+o.l+'</button>').join('');
    return '<tr><td rowspan="2" style="vertical-align:top"><b>'+esc(u.name)+'</b></td><td><b>1</b></td>'+r1
      +'<td rowspan="2" style="vertical-align:middle"><div class="att-btns">'+attHTML+'</div></td>'
      +'<td rowspan="2" style="vertical-align:middle">'+(isOwner?'<button class="btn btn-sm btn-primary" data-save="'+sid+'">'+ico('check',12)+'</button>':'')+'</td></tr>'
      +'<tr><td><b>2</b></td>'+r2+'</tr>';
  }).join('');
  if(!isOwner) return;
  body.querySelectorAll('.att-btn').forEach(b=>{
    b.onclick = ()=>{
      const sid = b.dataset.sid, val = b.dataset.att;
      body.querySelectorAll('.att-btn[data-sid="'+sid+'"]').forEach(x=>x.classList.toggle('on', x.dataset.att===val));
    };
  });
  body.querySelectorAll('[data-save]').forEach(btn=>{
    btn.onclick = async ()=>{
      const sid = btn.dataset.save;
      const key = classId+'_'+sid;
      const ev = DB.evaluations[key] || {};
      const s1s = {}, s2s = {};
      body.querySelectorAll('input[data-sid="'+sid+'"]').forEach(inp=>{
        const stage = inp.dataset.stage, crit = inp.dataset.crit;
        const v = inp.value === '' ? null : Number(inp.value);
        if(stage==='1') s1s[crit] = v; else s2s[crit] = v;
      });
      const attBtn = body.querySelector('.att-btn[data-sid="'+sid+'"].on');
      const att = attBtn ? attBtn.dataset.att : '';
      try{
        await setDoc(doc(db,'evaluations',key), {
          classId, studentId: sid,
          stage1: { scores: s1s },
          stage2: { scores: s2s, attendance: { m1: att } },
          checklist: ev.checklist || {},
          updatedAt: serverTimestamp(),
          updatedBy: currentUser.uid
        }, { merge: true });
        pushNotif(sid, {title:'Nilai Diperbarui', body:'Nilai Anda di '+DB.classes[classId].name+' diperbarui'});
        addActivity('Nilai '+DB.users[sid].name+' diperbarui di '+DB.classes[classId].name);
        toast('Nilai disimpan','success');
      }catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
    };
  });
}

/* ---------- 16. TAB: CHECKLIST ---------- */
const DEFAULT_CHK = ['Mengikuti pembinaan','Aktif dalam diskusi','Menyelesaikan tugas','Hadir tepat waktu'];
function renderTabChecklist(el, classId, isOwner){
  const ids = Object.keys(DB.members[classId]||{});
  const items = (DB.classes[classId].checklist && DB.classes[classId].checklist.length) ? DB.classes[classId].checklist : DEFAULT_CHK;
  if(!ids.length){ el.innerHTML = '<div class="card"><div class="empty">Tambahkan siswa dulu</div></div>'; return; }
  el.innerHTML =
    '<div class="card">'
    +'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px">'
      +'<h3>Checklist</h3>'
      +(isOwner?'<button class="btn btn-sm btn-primary" id="btnEditChk">'+ico('edit',14)+' Edit Item</button>':'')
    +'</div>'
    +'<div class="table-wrap"><table><thead><tr><th>Siswa</th>'
      + items.map((it)=>'<th>'+esc(it)+'</th>').join('')
    +'</tr></thead><tbody>'
    + ids.map(sid=>{
        const u = DB.users[sid]; if(!u) return '';
        const ev = DB.evaluations[classId+'_'+sid] || {};
        const chk = ev.checklist || {};
        return '<tr><td>'+esc(u.name)+'</td>'
          + items.map((_,i)=>'<td><input type="checkbox" data-sid="'+sid+'" data-i="'+i+'" '
            +(chk[i]?'checked':'')+(isOwner?'':' disabled')+'></td>').join('')+'</tr>';
      }).join('')
    +'</tbody></table></div></div>';
  el.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.onchange = async ()=>{
      const sid = cb.dataset.sid, i = Number(cb.dataset.i);
      const key = classId+'_'+sid;
      const ev = DB.evaluations[key] || {};
      const chk = ev.checklist || {};
      chk[i] = cb.checked;
      try{ await setDoc(doc(db,'evaluations',key), { checklist: chk }, { merge: true }); }
      catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
    };
  });
  if(isOwner){
    const b = $('btnEditChk');
    if(b) b.onclick = ()=>{
      openModal('Edit Item Checklist',
        '<form id="chkForm"><label>Item (satu per baris)<textarea id="chkItems" style="min-height:120px">'
        + esc(items.join('\n')) +'</textarea></label>'
        +'<div class="modal-actions"><button type="button" class="btn" id="chkCancel">Batal</button>'
        +'<button type="submit" class="btn btn-primary">Simpan</button></div></form>');
      $('chkCancel').onclick = closeModal;
      $('chkForm').onsubmit = async e=>{
        e.preventDefault();
        const list = $('chkItems').value.split('\n').map(s=>s.trim()).filter(Boolean);
        try{
          await updateDoc(doc(db,'classes',classId), { checklist: list });
          closeModal(); toast('Checklist diperbarui','success');
        }catch(err){ toast('Gagal: '+err.message,'error'); }
      };
    };
  }
}

/* ---------- 17. TAB: BROADCAST ---------- */
function renderTabBroadcast(el, classId){
  const c = DB.classes[classId];
  const ids = Object.keys(DB.members[classId]||{});
  el.innerHTML =
    '<div class="card"><h3>Broadcast ke Kelas</h3>'
    +'<form id="bcForm"><label>Pesan<textarea id="bcMsg" required style="min-height:100px"></textarea></label>'
    +'<div class="modal-actions"><button type="submit" class="btn btn-primary">'+ico('send',14)+' Kirim ke '+ids.length+' Siswa</button></div>'
    +'</form></div>'
    +'<div class="card"><h3>Riwayat Broadcast</h3>'
    + (()=>{
        const logs = DB.broadcasts.filter(b=>b.classId===classId).sort((a,b)=> (b.at?.seconds||0)-(a.at?.seconds||0));
        if(!logs.length) return '<div class="empty">Belum ada broadcast</div>';
        return '<div class="notif-list">'+logs.map(b=>
          '<div class="notif-item"><div class="notif-title">'+esc(b.message.slice(0,60))+'</div>'
          +'<div class="notif-time">'+relTime(b.at)+' • oleh '+esc(b.fromName)+'</div></div>').join('')+'</div>';
      })()
    +'</div>';
  $('bcForm').onsubmit = async e=>{
    e.preventDefault();
    const msg = $('bcMsg').value.trim(); if(!msg) return;
    try{
      await addDoc(collection(db,'broadcasts'), {
        from:currentUser.uid, fromName:currentUser.name,
        classId, className:c.name, message:msg, at:serverTimestamp()
      });
      await Promise.all(ids.map(sid => pushNotif(sid, {title:'Broadcast dari '+c.name, body:msg})));
      addActivity('Broadcast ke '+c.name+': '+msg.slice(0,40));
      $('bcMsg').value = '';
      toast('Broadcast terkirim','success');
    }catch(err){ console.error(err); toast('Gagal: '+err.message,'error'); }
  };
}

/* ---------- 18. TAB: WA ---------- */
function renderTabWA(el, classId){
  const c = DB.classes[classId];
  const ids = Object.keys(DB.members[classId]||{});
  el.innerHTML =
    '<div class="card"><h3>Kirim WhatsApp</h3>'
    +'<form id="waForm"><label>Penerima<select id="waTo" required>'
      +'<option value="all">— Semua Siswa ('+ids.length+') —</option>'
      + ids.map(sid=>{ const u=DB.users[sid]; return u?'<option value="'+sid+'">'+esc(u.name)+'</option>':''; }).join('')
    +'</select></label>'
    +'<label>Pesan<textarea id="waMsg" required style="min-height:100px"></textarea></label>'
    +'<div class="modal-actions"><button type="submit" class="btn btn-primary">'+ico('phone',14)+' Buka WhatsApp</button></div></form></div>'
    +'<div class="card"><h3>Riwayat WA</h3>'
    + (()=>{
        const logs = DB.waLogs.filter(w=>w.classId===classId).sort((a,b)=> (b.at?.seconds||0)-(a.at?.seconds||0));
        if(!logs.length) return '<div class="empty">Belum ada log WA</div>';
        return '<div class="notif-list">'+logs.map(w=>
          '<div class="notif-item"><div class="notif-title">'+esc(w.toName)+'</div>'
          +'<div class="notif-body">'+esc(w.message.slice(0,80))+'</div>'
          +'<div class="notif-time">'+relTime(w.at)+'</div></div>').join('')+'</div>';
      })()
    +'</div>';
  $('waForm').onsubmit = async e=>{
    e.preventDefault();
    const to = $('waTo').value;
    const msg = $('waMsg').value.trim(); if(!msg) return;
    let targets = [];
    if(to==='all'){
      targets = ids.map(sid=>{ const u=DB.users[sid]; return u?{uid:sid,name:u.name,phone:u.phone||''}:null; }).filter(Boolean);
    }else{
      const u = DB.users[to]; if(u) targets.push({uid:to, name:u.name, phone:u.phone||''});
    }
    if(!targets.length) return toast('Tidak ada penerima','error');
    try{
      await Promise.all(targets.map(t => addDoc(collection(db,'waLogs'), {
        from:currentUser.uid, fromName:currentUser.name,
        to:t.uid, toName:t.name, phone:t.phone, message:msg,
        classId, className:c.name, at:serverTimestamp()
      })));
    }catch(err){ console.error('waLog', err); }
    targets.forEach((t,i)=>{
      const phone = (t.phone||'').replace(/\D/g,'');
      const url = phone ? 'https://wa.me/'+phone+'?text='+encodeURIComponent(msg) : 'https://wa.me/?text='+encodeURIComponent(msg);
      setTimeout(()=>window.open(url,'_blank'), i*300);
    });
    toast('WA log tersimpan','success');
    $('waMsg').value = '';
  };
}

/* ---------- 19. ADMIN: TEACHERS ---------- */
function renderTeachers(el){
  const users = Object.values(DB.users).sort((a,b)=> (b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
  el.innerHTML =
    '<div class="page-head"><div><h2>Pengguna</h2><p class="sub">'+users.length+' akun</p></div></div>'
    +'<div class="card"><div class="table-wrap"><table><thead><tr>'
    +'<th>Nama</th><th>Email</th><th>Role</th><th>Divisi/Kelas</th><th>Terdaftar</th><th>Aksi</th>'
    +'</tr></thead><tbody>'
    + users.map(u=>
        '<tr><td>'+esc(u.name)+'</td><td>'+esc(u.email)+'</td>'
        +'<td><span class="badge-soft">'+esc(u.role)+'</span></td>'
        +'<td>'+esc(u.role==='guru'?(u.division||'-'):(u.className||'-'))+'</td>'
        +'<td>'+fmtDate(u.createdAt)+'</td>'
        +'<td><button class="btn btn-sm btn-danger" data-deluser="'+u.uid+'">'+ico('trash',12)+'</button></td></tr>'
      ).join('')
    +'</tbody></table></div></div>';
  el.querySelectorAll('[data-deluser]').forEach(b=>{
    b.onclick = async ()=>{
      const id = b.dataset.deluser;
      const u = DB.users[id]; if(!u) return;
      if(!confirm('Hapus profil '+u.name+'?')) return;
      try{
        await deleteDoc(doc(db,'users',id));
        addActivity('Profil dihapus: '+u.name);
        toast('Profil dihapus','success');
      }catch(err){ toast('Gagal: '+err.message,'error'); }
    };
  });
}

/* ---------- 20. ACTIVITY PAGE ---------- */
function renderActivity(el){
  el.innerHTML =
    '<div class="page-head"><div><h2>Aktivitas</h2><p class="sub">Log aktivitas</p></div></div>'
    +'<div class="card"><div class="activity-list">'+renderActivityItems(DB.activities)+'</div></div>';
}

/* ---------- 21. BROADCAST PAGE ---------- */
function renderBroadcastPage(el){
  el.innerHTML =
    '<div class="page-head"><div><h2>Broadcast</h2><p class="sub">Kirim pengumuman</p></div></div>'
    +'<div class="card"><h3>Broadcast Global</h3>'
    +'<form id="gBcForm"><label>Target<select id="gBcTarget">'
      +'<option value="all">Semua Pengguna</option><option value="siswa">Semua Siswa</option><option value="guru">Semua Guru</option>'
    +'</select></label>'
    +'<label>Pesan<textarea id="gBcMsg" required style="min-height:100px"></textarea></label>'
    +'<div class="modal-actions"><button type="submit" class="btn btn-primary">'+ico('broadcast',14)+' Kirim</button></div></form></div>'
    +'<div class="card"><h3>Riwayat</h3>'
    + (()=>{
        const logs = DB.broadcasts.filter(b=>b.from===currentUser.uid).sort((a,b)=> (b.at?.seconds||0)-(a.at?.seconds||0)).slice(0,30);
        if(!logs.length) return '<div class="empty">Belum ada broadcast</div>';
        return '<div class="notif-list">'+logs.map(b=>
          '<div class="notif-item"><div class="notif-title">'+esc(b.message.slice(0,70))+'</div>'
          +'<div class="notif-time">'+relTime(b.at)+(b.className?' • '+esc(b.className):' • Global')+'</div></div>').join('')+'</div>';
      })()
    +'</div>';
  $('gBcForm').onsubmit = async e=>{
    e.preventDefault();
    const target = $('gBcTarget').value;
    const msg = $('gBcMsg').value.trim(); if(!msg) return;
    try{
      await addDoc(collection(db,'broadcasts'), {
        from:currentUser.uid, fromName:currentUser.name, target, message:msg, at:serverTimestamp()
      });
      await broadcastNotif(target, {title:'Broadcast dari '+currentUser.name, body:msg});
      addActivity('Broadcast ke '+target+': '+msg.slice(0,40));
      $('gBcMsg').value = '';
      toast('Broadcast terkirim','success');
    }catch(err){ toast('Gagal: '+err.message,'error'); }
  };
}

/* ---------- 22. WA LOGS PAGE ---------- */
function renderWALogsPage(el){
  const logs = DB.waLogs.filter(w=>w.from===currentUser.uid).sort((a,b)=> (b.at?.seconds||0)-(a.at?.seconds||0));
  el.innerHTML =
    '<div class="page-head"><div><h2>WA Log</h2><p class="sub">'+logs.length+' pesan</p></div></div>'
    +'<div class="card">'
    + (logs.length
        ? '<div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Penerima</th><th>Pesan</th></tr></thead><tbody>'
          + logs.map(w=>'<tr><td>'+fmtDate(w.at)+'</td><td>'+esc(w.toName)+'</td>'
            +'<td>'+esc(w.message.slice(0,100))+'</td></tr>').join('')+'</tbody></table></div>'
        : '<div class="empty">Belum ada log WA</div>')
    +'</div>';
}

/* ---------- 23. SISWA: MY CLASSES ---------- */
function renderMyClasses(el){
  const mine = Object.values(DB.classes).filter(c => DB.members[c.id] && DB.members[c.id][currentUser.uid]);
  el.innerHTML =
    '<div class="page-head"><div><h2>Kelas Saya</h2><p class="sub">'+mine.length+' kelas</p></div></div>'
    + (mine.length ? '<div class="class-list">'+mine.map(c=>classCard(c,true)).join('')+'</div>'
        : '<div class="card"><div class="empty">Belum terdaftar di kelas manapun</div></div>');
  bindClassCards(el);
}

/* ---------- 24. SISWA: GRADES ---------- */
function renderGrades(el){
  const mine = Object.values(DB.classes).filter(c => DB.members[c.id] && DB.members[c.id][currentUser.uid]);
  if(!mine.length){
    el.innerHTML = '<div class="page-head"><div><h2>Nilai Saya</h2></div></div>'
      +'<div class="card"><div class="empty">Belum ada kelas</div></div>'; return;
  }
  const avg = arr => {
    const vs = arr.filter(v=>v!=null && !isNaN(v));
    return vs.length ? (vs.reduce((a,b)=>a+Number(b),0)/vs.length).toFixed(1) : '—';
  };
  const html = mine.map(c=>{
    const ev = DB.evaluations[c.id+'_'+currentUser.uid] || {};
    const s1 = ev.stage1?.scores || {};
    const s2 = ev.stage2?.scores || {};
    const att = ev.stage2?.attendance?.m1;
    const al = {hadir:'Hadir',izin:'Izin',sakit:'Sakit',alpa:'Alpa'}[att] || '—';
    return '<div class="card"><h3>'+esc(c.name)+'</h3>'
      +'<div class="table-wrap"><table><thead><tr><th>Stage</th>'
        + CRITERIA.map(x=>'<th>'+x+'</th>').join('')+'<th>Rata-rata</th></tr></thead><tbody>'
      +'<tr><td><b>Stage 1</b></td>'+ CRITERIA.map(x=>'<td>'+(s1[x]??'—')+'</td>').join('')
        +'<td><b>'+avg(CRITERIA.map(x=>s1[x]))+'</b></td></tr>'
      +'<tr><td><b>Stage 2</b></td>'+ CRITERIA.map(x=>'<td>'+(s2[x]??'—')+'</td>').join('')
        +'<td><b>'+avg(CRITERIA.map(x=>s2[x]))+'</b></td></tr>'
      +'</tbody></table></div>'
      +'<p style="margin-top:12px;font-size:13px;color:var(--text2)">Absensi: <b>'+al+'</b></p></div>';
  }).join('');
  el.innerHTML = '<div class="page-head"><div><h2>Nilai Saya</h2>'
    +'<p class="sub">Ringkasan penilaian</p></div></div>'+html;
}

/* ---------- 25. FIRESTORE LISTENERS ---------- */
async function attachListeners(){
  detachListeners();
  unsubs.push(onSnapshot(collection(db,'users'), snap=>{
    DB.users = {};
    snap.forEach(d => DB.users[d.id] = {uid:d.id, ...d.data()});
    renderView(currentView);
  }));
  unsubs.push(onSnapshot(collection(db,'classes'), snap=>{
    DB.classes = {};
    snap.forEach(d => DB.classes[d.id] = {id:d.id, ...d.data()});
    renderView(currentView);
    // Subscribe members per class
    Object.keys(DB.classes).forEach(cid=>{
      if(!DB.members[cid]) DB.members[cid] = {};
      unsubs.push(onSnapshot(collection(db,'members',cid,'list'), msnap=>{
        const seen = new Set();
        msnap.forEach(d => { DB.members[cid][d.id] = true; seen.add(d.id); });
        Object.keys(DB.members[cid]).forEach(k => { if(!seen.has(k)) delete DB.members[cid][k]; });
        renderView(currentView);
      }));
    });
  }));
  unsubs.push(onSnapshot(collection(db,'evaluations'), snap=>{
    DB.evaluations = {};
    snap.forEach(d => DB.evaluations[d.id] = d.data());
    renderView(currentView);
  }));
  unsubs.push(onSnapshot(collection(db,'notifications',currentUser.uid,'items'), snap=>{
    DB.notifications[currentUser.uid] = DB.notifications[currentUser.uid] || {};
    const seen = new Set();
    snap.forEach(d => { DB.notifications[currentUser.uid][d.id] = {id:d.id, ...d.data()}; seen.add(d.id); });
    Object.keys(DB.notifications[currentUser.uid]).forEach(k => { if(!seen.has(k)) delete DB.notifications[currentUser.uid][k]; });
    updateBell();
    if(currentView==='home') renderView('home');
  }));
  unsubs.push(onSnapshot(query(collection(db,'activities'), orderBy('at','desc'), limit(150)), snap=>{
    DB.activities = snap.docs.map(d => ({id:d.id, ...d.data()}));
    if(currentView==='home' || currentView==='activity') renderView(currentView);
  }));
  unsubs.push(onSnapshot(query(collection(db,'broadcasts'), orderBy('at','desc'), limit(100)), snap=>{
    DB.broadcasts = snap.docs.map(d => ({id:d.id, ...d.data()}));
    if(currentView==='broadcast') renderView(currentView);
  }));
  unsubs.push(onSnapshot(query(collection(db,'waLogs'), orderBy('at','desc'), limit(200)), snap=>{
    DB.waLogs = snap.docs.map(d => ({id:d.id, ...d.data()}));
    if(currentView==='walogs') renderView(currentView);
  }));
}
function detachListeners(){
  unsubs.forEach(u => { try{ u(); }catch(e){} });
  unsubs = [];
}

/* ---------- 26. BOOT ---------- */
onAuthStateChanged(auth, async user => {
  const loadingEl = $('loading'); if(loadingEl) loadingEl.classList.add('hidden');
  if(user){
    try{
      const snap = await getDoc(doc(db,'users',user.uid));
      if(snap.exists()){
        currentUser = {uid:user.uid, ...snap.data()};
        await attachListeners();
        showApp();
        return;
      }
    }catch(e){ console.error('boot', e); }
  }
  currentUser = null;
  showLogin();
});

/* ---------- 27. STATIC BIND ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  ['loginLogo','regLogo'].forEach(id=>{ const el=$(id); if(el) el.innerHTML = ico('clip',32); });
  const bi=$('brandIcon'); if(bi) bi.innerHTML = ico('clip',20);
  const be=$('bellIcon'); if(be) be.innerHTML = ico('bell',20);
  const lo=$('logoutIcon'); if(lo) lo.innerHTML = ico('logout',20);
  const nc=$('notifClose'); if(nc) nc.innerHTML = ico('x',18);
  const mc=$('modalClose'); if(mc) mc.innerHTML = ico('x',18);

  const lf=$('loginForm'); if(lf) lf.addEventListener('submit', doLogin);
  const rf=$('registerForm'); if(rf) rf.addEventListener('submit', doRegister);
  const tr=$('toRegister'); if(tr) tr.addEventListener('click', e=>{ e.preventDefault(); showRegister(); });
  const tl=$('toLogin'); if(tl) tl.addEventListener('click', e=>{ e.preventDefault(); showLogin(); });
  const lb=$('logoutBtn'); if(lb) lb.addEventListener('click', doLogout);
  const bb=$('bellBtn'); if(bb) bb.addEventListener('click', openNotifPanel);
  const ncl=$('notifClose'); if(ncl) ncl.addEventListener('click', closeNotifPanel);
  const po=$('panelOverlay'); if(po) po.addEventListener('click', closeNotifPanel);
  const mcl=$('modalClose'); if(mcl) mcl.addEventListener('click', closeModal);
  const md=$('modal'); if(md) md.addEventListener('click', e=>{ if(e.target.id==='modal') closeModal(); });
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){ closeModal(); closeNotifPanel(); }
  });
});
