// 首页 Thalassa 电影感 Hero
(function () {
  'use strict';

  function initHero() {
    var header = document.getElementById('page-header');
    var film = document.querySelector('.hero-video');
    if (!header || !film || !header.classList.contains('full_page')) return;
    if (film.getAttribute('data-hero-init') === '1') return;
    film.setAttribute('data-hero-init', '1');

    var stage = document.querySelector('.hero-stage');
    var inner = document.querySelector('.hero-stage-inner');
    var tc = document.getElementById('hero-timecode');
    var bar = document.getElementById('hero-progress');
    var sound = document.getElementById('hero-sound');
    var notes = document.getElementById('hero-notes');
    var scrim = document.getElementById('hero-scrim');
    var closeBtn = document.getElementById('hero-close-notes');
    var openBtn = document.getElementById('hero-open-notes');
    var playBtn = document.getElementById('hero-play');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 影像就绪 ---------- */
    var started = false;
    function ready() {
      started = true;
      film.classList.add('is-ready');
      if (!reduce && stage) stage.classList.add('is-live');
    }
    film.addEventListener('playing', ready, { once: true });
    if (film.readyState >= 2 && !film.paused) ready();
    if (reduce) film.pause();

    /* ---------- 接缝过渡 + 时码 + 进度 ---------- */
    var FADE = 0.55, loops = 0, lastT = 0, rafId = null;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      rafId = null;
      if (!film.isConnected) return;
      if (!started) { rafId = requestAnimationFrame(tick); return; }
      if (!film.duration || !isFinite(film.duration)) { rafId = requestAnimationFrame(tick); return; }
      var d = film.duration, t = film.currentTime, op = 1;
      if (t < lastT - 0.2) loops++;
      lastT = t;
      if (loops > 0 && t < FADE) op = t / FADE;
      else if (t > d - FADE) op = (d - t) / FADE;
      film.style.opacity = Math.max(0, Math.min(1, op)).toFixed(3);
      if (tc) {
        tc.textContent = pad(Math.floor(t / 60)) + ':' + pad(Math.floor(t % 60)) + ' / ' +
                        pad(Math.floor(d / 60)) + ':' + pad(Math.floor(d % 60));
      }
      if (bar) bar.style.transform = 'scaleX(' + (t / d).toFixed(4) + ')';
      rafId = requestAnimationFrame(tick);
    }
    if (!reduce) rafId = requestAnimationFrame(tick);

    /* ---------- 声音 ---------- */
    function setSound(on) {
      film.muted = !on;
      if (!sound) return;
      sound.dataset.on = on ? '1' : '0';
      sound.setAttribute('aria-pressed', on ? 'true' : 'false');
      sound.setAttribute('aria-label', on ? '关闭声音' : '开启声音');
      var icon = sound.querySelector('i');
      if (icon) icon.className = on ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
    }
    if (sound) {
      sound.addEventListener('click', function () { setSound(film.muted); });
    }

    /* ---------- 主按钮：重播并开启声音 ---------- */
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        film.currentTime = 0;
        setSound(true);
        var p = film.play();
        if (p && p.catch) p.catch(function () {});
      });
    }

    /* ---------- 影像手记抽屉 ---------- */
    function openNotes() {
      if (!notes || !scrim) return;
      notes.classList.add('is-open');
      scrim.classList.add('is-open');
      header.classList.add('hero-notes-open');
      notes.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }
    function closeNotes() {
      if (!notes || !scrim) return;
      notes.classList.remove('is-open');
      scrim.classList.remove('is-open');
      header.classList.remove('hero-notes-open');
      notes.setAttribute('aria-hidden', 'true');
    }
    if (openBtn && notes && scrim && closeBtn) {
      openBtn.addEventListener('click', openNotes);
      closeBtn.addEventListener('click', closeNotes);
      scrim.addEventListener('click', closeNotes);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNotes();
      });
    }

    /* ---------- 指针视差 ---------- */
    if (!reduce && inner && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        var x = (e.clientX / window.innerWidth - 0.5);
        var y = (e.clientY / window.innerHeight - 0.5);
        inner.style.transform =
          'translate3d(' + (x * -16).toFixed(2) + 'px,' + (y * -10).toFixed(2) + 'px,0) scale(1.04)';
      }, { passive: true });
    }

    /* ---------- 切后台 / 滚出视口时暂停 ---------- */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        film.pause();
      } else {
        var p = film.play();
        if (p && p.catch) p.catch(function () {});
      }
    });

    if ('IntersectionObserver' in window) {
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = film.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            film.pause();
          }
        });
      }, { threshold: 0 });
      videoObserver.observe(film);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero);
  } else {
    initHero();
  }

  /* PJAX 返回首页时重新初始化 */
  window.addEventListener('pjax:success', initHero);
  window.addEventListener('pjax:complete', initHero);
})();
