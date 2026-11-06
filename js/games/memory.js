// 记忆翻牌游戏 v2 - 优化版
(function() {
  'use strict';
  var board = document.getElementById('mem-board');
  if (!board) return;
  var emojis = ['🌸','🎋','🎐','🏮','🍵','🖌️','📜','🎭','🦋','🌙','⭐','🌊'];
  var cards, flipped, matched, moves, timer, seconds, lock, pairs, difficulty, bestTime;
  difficulty = 'easy';
  function getBestTime() {
    return parseInt(localStorage.getItem('memory_best_'+difficulty) || '9999');
  }
  function init() {
    var count = difficulty === 'easy' ? 8 : 12;
    var pool = emojis.slice(0, count);
    cards = pool.concat(pool).sort(function(){ return Math.random()-0.5; });
    flipped = []; matched = 0; moves = 0; seconds = 0; lock = false; pairs = count;
    document.getElementById('mem-moves').textContent = '0';
    document.getElementById('mem-time').textContent = '0s';
    document.getElementById('mem-pairs').textContent = '0/' + pairs;
    clearInterval(timer);
    timer = setInterval(function(){ seconds++; document.getElementById('mem-time').textContent = seconds+'s'; }, 1000);
    render();
  }
  function render() {
    board.innerHTML = '';
    board.style.cssText = 'display:grid;grid-template-columns:repeat('+(difficulty==='easy'?4:6)+',1fr);gap:10px;max-width:'+(difficulty==='easy'?'400px':'520px')+';margin:15px auto';
    cards.forEach(function(emoji, i) {
      var card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.index = i;
      card.style.cssText = 'aspect-ratio:1;cursor:pointer;perspective:800px;user-select:none';
      var inner = document.createElement('div');
      inner.className = 'mem-card-inner';
      inner.style.cssText = 'width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      var front = document.createElement('div');
      front.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(135deg,#5B8C85,#3D6B66);color:#fff;font-size:1.8em;backface-visibility:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.15)';
      front.textContent = '?';
      var back = document.createElement('div');
      back.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:12px;background:linear-gradient(135deg,#F7F3EB,#E8E0D4);font-size:2.2em;backface-visibility:hidden;transform:rotateY(180deg);box-shadow:0 3px 10px rgba(0,0,0,0.1)';
      back.textContent = emoji;
      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
      card.addEventListener('click', function() { flipCard(i, card, inner); });
      card.addEventListener('mouseenter', function() {
        if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
          card.style.transform = 'translateY(-3px)';
        }
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
      board.appendChild(card);
    });
  }
  function flipCard(i, card, inner) {
    if (lock || flipped.length >= 2 || flipped.some(function(f){return f.i===i;}) || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    inner.style.transform = 'rotateY(180deg)';
    flipped.push({i:i, card:card, inner:inner});
    if (flipped.length === 2) {
      moves++;
      document.getElementById('mem-moves').textContent = moves;
      lock = true;
      if (cards[flipped[0].i] === cards[flipped[1].i]) {
        setTimeout(function() {
          flipped.forEach(function(f) {
            f.card.classList.add('matched');
            f.card.classList.remove('flipped');
            f.inner.style.opacity = '0.65';
            f.inner.style.transform = 'rotateY(180deg) scale(0.92)';
          });
          matched++;
          document.getElementById('mem-pairs').textContent = matched+'/'+pairs;
          flipped = []; lock = false;
          if (matched === pairs) {
            clearInterval(timer);
            var best = getBestTime();
            if (seconds < best) {
              localStorage.setItem('memory_best_'+difficulty, seconds);
              setTimeout(function() {
                alert('🎉 恭喜通关！\n步数: '+moves+'\n用时: '+seconds+'秒\n🏆 新纪录！');
              }, 300);
            } else {
              setTimeout(function() {
                alert('🎉 恭喜通关！\n步数: '+moves+'\n用时: '+seconds+'秒\n最佳记录: '+best+'秒');
              }, 300);
            }
          }
        }, 350);
      } else {
        setTimeout(function() {
          flipped.forEach(function(f) {
            f.card.classList.remove('flipped');
            f.inner.style.transform = 'rotateY(0deg)';
          });
          flipped = []; lock = false;
        }, 700);
      }
    }
  }
  document.getElementById('mem-new').addEventListener('click', init);
  document.getElementById('mem-easy').addEventListener('click', function() {
    difficulty = 'easy';
    this.classList.add('active');
    document.getElementById('mem-hard').classList.remove('active');
    init();
  });
  document.getElementById('mem-hard').addEventListener('click', function() {
    difficulty = 'hard';
    this.classList.add('active');
    document.getElementById('mem-easy').classList.remove('active');
    init();
  });
  init();
})();
