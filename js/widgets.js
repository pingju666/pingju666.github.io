// 趣味组件集合 - 每日推荐 + 阅读统计 + 纪念日倒计时
(function() {
  'use strict';
  // 每日随机推荐文章
  function initRandomArticle() {
    var aside = document.querySelector('#aside-content');
    if (!aside) return;
    var articles = document.querySelectorAll('#recent-posts .recent-post-item a[href]');
    if (!articles.length) return;
    var links = [];
    articles.forEach(function(a) { links.push({ href: a.getAttribute('href'), title: a.textContent.trim() }); });
    if (!links.length) return;
    var today = new Date().toDateString();
    var seed = 0;
    for (var i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    var pick = links[seed % links.length];
    var card = document.createElement('div');
    card.className = 'card-widget widget-random';
    card.innerHTML = '<div class="item-headline"><i class="fas fa-dice"></i><span>每日推荐</span></div>' +
      '<div class="random-content"><a href="' + pick.href + '">' + pick.title + '</a>' +
      '<p class="random-tip">今日缘分之作，点开看看吧~</p></div>';
    aside.appendChild(card);
  }
  // 阅读时间统计
  function initReadStats() {
    var content = document.querySelector('#post .article-content, #post .markdown-body, .article-container');
    if (!content) return;
    var text = content.textContent || '';
    var charCount = text.replace(/\s/g, '').length;
    var readTime = Math.max(1, Math.round(charCount / 500));
    var meta = document.querySelector('.post-meta');
    if (meta) {
      var span = document.createElement('span');
      span.className = 'read-stats';
      span.innerHTML = ' <i class="fas fa-clock"></i> 约' + readTime + '分钟 ' + charCount + '字';
      span.style.cssText = 'color:var(--text-muted);font-size:0.85em;margin-left:8px';
      meta.appendChild(span);
    }
  }
  // 纪念日倒计时
  function initCountdown() {
    var aside = document.querySelector('#aside-content');
    if (!aside) return;
    var now = new Date();
    var year = now.getFullYear();
    // 固定公历节日（每年日期相同）
    var solarDates = [
      { name: '元旦', month: 1, day: 1 },
      { name: '情人节', month: 2, day: 14 },
      { name: '劳动节', month: 5, day: 1 },
      { name: '国庆节', month: 10, day: 1 },
      { name: '圣诞节', month: 12, day: 25 }
    ];
    // 农历节日的公历日期对照表（每年不同，跨年后请补充新年份）
    var lunarDates = {
      2026: { '春节': [2, 17], '端午节': [6, 19], '七夕': [8, 19], '中秋节': [9, 25] },
      2027: { '春节': [2, 6], '端午节': [6, 9], '七夕': [8, 8], '中秋节': [9, 15] },
      2028: { '春节': [1, 26], '端午节': [5, 28], '七夕': [8, 26], '中秋节': [10, 3] }
    };
    var candidates = [];
    for (var y = year; y <= year + 1; y++) {
      solarDates.forEach(function (d) {
        candidates.push({ name: d.name, date: new Date(y, d.month - 1, d.day) });
      });
      var lunar = lunarDates[y];
      if (lunar) {
        Object.keys(lunar).forEach(function (name) {
          candidates.push({ name: name, date: new Date(y, lunar[name][0] - 1, lunar[name][1]) });
        });
      }
    }
    var next = null;
    candidates.forEach(function (item) {
      var diff = Math.ceil((item.date - now) / 86400000);
      if (diff >= 0 && (!next || diff < next.diff)) next = { name: item.name, diff: diff };
    });
    if (!next) return;
    var card = document.createElement('div');
    card.className = 'card-widget widget-countdown';
    card.innerHTML = '<div class="item-headline"><i class="fas fa-calendar-alt"></i><span>倒计时</span></div>' +
      '<div class="countdown-content"><div class="countdown-number">' + next.diff + '</div>' +
      '<div class="countdown-label">天后迎来' + next.name + '</div></div>';
    aside.appendChild(card);
  }
  document.addEventListener('DOMContentLoaded', function() {
    initRandomArticle();
    initReadStats();
    initCountdown();
  });
})();
