/* ============================================================
   fix.js — KONSOLIDASI FINAL
   A. Fix SVG ico2/ico size ('sm', 'lg', 'md', dll)
   B. Brand banner sticky di semua dashboard
   C. Auto-shrink icon di mobile
   Load PALING AKHIR setelah semua script lain
   ============================================================ */
(function(){
'use strict';

/* ============================================================
   BAGIAN A — FIX SVG SIZE STRING ('sm', 'lg', 'md', dll)
   ============================================================ */

var _origIco2 = window.ico2;
window.ico2 = function(name, size){
  var s = size;
  if(s === 'sm') s = 13;
  else if(s === 'lg') s = 20;
  else if(s === 'md') s = 16;
  else if(s === 'xs') s = 11;
  else if(typeof s !== 'number') s = 16;
  if(typeof _origIco2 === 'function') return _origIco2(name, s);
  return '<svg class="ico" width="'+s+'" height="'+s+'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';
};

var _origIco = window.ico;
if(typeof _origIco === 'function'){
  window.ico = function(name, size){
    var s = size;
    if(s === 'sm') s = '13px';
    else if(s === 'lg') s = '20px';
    else if(s === 'md') s = '16px';
    else if(typeof s === 'number') s = s+'px';
    else if(typeof s !== 'string') s = '16px';
    return _origIco(name, s);
  };
}

console.log('[fix] Bagian A — ico2 & ico size diperbaiki');


/* ============================================================
   BAGIAN B — BRAND BANNER STICKY DI SEMUA DASHBOARD
   ============================================================ */

function brandBannerHTML(){
  return '<div class="brand-banner">'+
    '<div class="brand-logos-small">'+
      '<img src="https://iili.io/nHsHgfe.png" alt="Logo Mapel" onerror="this.style.display=\'none\'">'+
      '<img src="https://iili.io/nBiviCX.png" alt="Logo SMPN 10" onerror="this.style.display=\'none\'">'+
    '</div>'+
    '<div class="brand-text-small">'+
      '<h1>Sistem Penilaian Proyek Produksi Teater</h1>'+
      '<p>SMP Negeri 10 Samarinda</p>'+
    '</div>'+
  '</div>';
}
window.brandBannerHTML = brandBannerHTML;

function injectBrand(){
  var mc = document.getElementById('main-content');
  if(!mc) return;
  if(mc.querySelector('.brand-banner')) {
    attachStickyObserver();
    return;
  }
  mc.insertAdjacentHTML('afterbegin', brandBannerHTML());
  attachStickyObserver();
}

/* Deteksi saat brand menempel di atas untuk efek shadow */
function attachStickyObserver(){
  var banner = document.querySelector('.brand-banner');
  if(!banner) return;

  /* Bersihkan listener sebelumnya */
  if(window.__bannerScroll){
    window.removeEventListener('scroll', window.__bannerScroll);
    window.__bannerScroll = null;
  }

  var onScroll = function(){
    var bannerRect = banner.getBoundingClientRect();
    var parent = banner.parentElement;
    var parentTop = parent ? parent.getBoundingClientRect().top : 0;
    /* Banner dianggap "stuck" kalau sudah menempel di atas container */
    if(bannerRect.top <= parentTop + 2){
      banner.classList.add('is-stuck');
    } else {
      banner.classList.remove('is-stuck');
    }
  };

  window.__bannerScroll = onScroll;
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});

  /* Cek sekali saat dipasang */
  setTimeout(onScroll, 100);
}
window.attachStickyObserver = attachStickyObserver;

/* Override fungsi render supaya brand selalu ada di atas */
function wrapRender(fnName){
  var _orig = window[fnName];
  if(typeof _orig !== 'function') return;
  window[fnName] = function(){
    var ret = _orig.apply(this, arguments);
    injectBrand();
    return ret;
  };
}

['renderGuruDashboard','renderSiswaDashboard','renderAdminDashboard',
 'viewClass','renderRecap','renderStageManagement'].forEach(wrapRender);

console.log('[fix] Bagian B — Brand banner sticky aktif di semua dashboard');


/* ============================================================
   BAGIAN C — AUTO-SHRINK ICON DI MOBILE
   ============================================================ */

function autoFixButtons(){
  var isMobile = window.matchMedia('(max-width: 480px)').matches;
  if(!isMobile) return;
  document.querySelectorAll('.btn svg.ico, .notif-btn svg.ico').forEach(function(svg){
    if(!svg.dataset.fixed){
      svg.dataset.fixed='1';
      svg.style.width='14px';
      svg.style.height='14px';
    }
  });
}

var _rzTimer = null;
window.addEventListener('resize', function(){
  if(_rzTimer) clearTimeout(_rzTimer);
  _rzTimer = setTimeout(autoFixButtons, 200);
});

/* Jalankan setelah modal dibuka */
var _origOpenModal = window.openModal;
if(typeof _origOpenModal === 'function'){
  window.openModal = function(){
    var ret = _origOpenModal.apply(this, arguments);
    setTimeout(autoFixButtons, 30);
    return ret;
  };
}

/* Jalankan saat pertama load */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(autoFixButtons, 800); });
} else {
  setTimeout(autoFixButtons, 800);
}

console.log('[fix] Bagian C — Auto-shrink icon mobile aktif');
console.log('[fix] Semua perbaikan selesai. Sistem siap.');

})();
