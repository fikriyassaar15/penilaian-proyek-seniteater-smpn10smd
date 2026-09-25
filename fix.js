/* ============================================================
   fix.js — Perbaiki ico2 supaya terima size 'sm'/'lg'/'md'
   Load PALING AKHIR setelah features2.js
   ============================================================ */
(function(){
  'use strict';

  /* Simpan referensi ico2 lama */
  var _origIco2 = window.ico2;

  /* Bungkus ulang supaya konversi size string ke number */
  window.ico2 = function(name, size){
    var s = size;
    if(s === 'sm') s = 13;
    else if(s === 'lg') s = 20;
    else if(s === 'md') s = 16;
    else if(s === 'xs') s = 11;
    else if(typeof s !== 'number') s = 16;
    if(typeof _origIco2 === 'function') return _origIco2(name, s);
    /* fallback kalau ico2 tidak ada */
    return '<svg class="ico" width="'+s+'" height="'+s+'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';
  };

  /* Fix juga ico (dari app.js) kalau dipanggil dengan 'sm'/'lg' */
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

  console.log('[fix] ico2 & ico diperbaiki');
})();
