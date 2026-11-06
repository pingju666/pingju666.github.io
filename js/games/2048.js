// 2048 游戏 v2 - 优化版
(function() {
  'use strict';
  var board = document.getElementById('g2048-board');
  if (!board) return;
  var SIZE = 4, grid, score, highScore, prevGrid, prevScore;
  highScore = parseInt(localStorage.getItem('2048_high') || '0');
  document.getElementById('g2048-high').textContent = highScore;
  var COLORS = {2:'#F7F3EB',4:'#E2C288',8:'#D4A070',16:'#C98A8A',32:'#B87333',64:'#A0522D',128:'#8B7355',256:'#5B8C85',512:'#3D6B66',1024:'#2D554F',2048:'#C98A8A',4096:'#8B4513'};
  var lastMerged = {};
  function init() {
    grid = []; score = 0; prevGrid = null; prevScore = 0; lastMerged = {};
    for (var i=0;i<SIZE;i++) { grid.push([]); for (var j=0;j<SIZE;j++) grid[i].push(0); }
    addTile(); addTile();
    render();
  }
  function addTile() {
    var empty = [];
    for (var i=0;i<SIZE;i++) for (var j=0;j<SIZE;j++) if (grid[i][j]===0) empty.push({i:i,j:j});
    if (!empty.length) return;
    var pos = empty[Math.floor(Math.random()*empty.length)];
    grid[pos.i][pos.j] = Math.random() < 0.9 ? 2 : 4;
  }
  function render() {
    board.innerHTML = '';
    board.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:rgba(91,140,133,0.12);padding:10px;border-radius:14px;max-width:340px;margin:15px auto;box-shadow:inset 0 2px 8px rgba(0,0,0,0.06)';
    var maxVal = 0;
    for (var i=0;i<SIZE;i++) for (var j=0;j<SIZE;j++) {
      var val = grid[i][j];
      if (val > maxVal) maxVal = val;
      var cell = document.createElement('div');
      var isNew = lastMerged[i+'-'+j];
      var fontSize = val > 9999 ? '14px' : val > 999 ? '18px' : val > 99 ? '20px' : '26px';
      cell.style.cssText = 'aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:10px;font-size:'+fontSize+';font-weight:700;background:'+(COLORS[val]||'linear-gradient(135deg,#3D6B66,#5B8C85)')+';color:'+(val>4?'#fff':'#2D3844')+';transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);box-shadow:'+(val?'0 3px 12px rgba(0,0,0,0.12)':'none')+';transform:'+(isNew?'scale(1.1)':'scale(1)');
      cell.textContent = val || '';
      board.appendChild(cell);
    }
    lastMerged = {};
    document.getElementById('g2048-score').textContent = score;
    document.getElementById('g2048-max').textContent = maxVal;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('2048_high', highScore);
      document.getElementById('g2048-high').textContent = highScore;
    }
  }
  function slide(row) {
    var arr = row.filter(function(v){return v;});
    for (var i=0;i<arr.length-1;i++) {
      if (arr[i]===arr[i+1]) {
        arr[i]*=2;
        score+=arr[i];
        lastMerged[i+'-'+0] = true;
        arr.splice(i+1,1);
      }
    }
    while (arr.length<SIZE) arr.push(0);
    return arr;
  }
  function move(dir) {
    prevGrid = JSON.parse(JSON.stringify(grid));
    prevScore = score;
    var moved = false;
    lastMerged = {};
    if (dir==='left'||dir==='right') {
      for (var i=0;i<SIZE;i++) {
        var row = grid[i].slice();
        if (dir==='right') row.reverse();
        var before = row.slice();
        row = slide(row);
        if (dir==='right') row.reverse();
        if (row.join()!==grid[i].join()) moved = true;
        grid[i] = row;
      }
    } else {
      for (var j=0;j<SIZE;j++) {
        var col = [];
        for (var i=0;i<SIZE;i++) col.push(grid[i][j]);
        if (dir==='down') col.reverse();
        col = slide(col);
        if (dir==='down') col.reverse();
        for (var i=0;i<SIZE;i++) if (grid[i][j]!==col[i]) moved = true;
        for (var i=0;i<SIZE;i++) grid[i][j] = col[i];
      }
    }
    if (moved) {
      addTile();
      render();
      var maxNow = 0;
      for (var i=0;i<SIZE;i++) for (var j=0;j<SIZE;j++) if (grid[i][j]>maxNow) maxNow = grid[i][j];
      if (maxNow === 2048 && !localStorage.getItem('2048_won')) {
        localStorage.setItem('2048_won', '1');
        setTimeout(function() {
          board.style.animation = 'pulse 0.5s';
          alert('🎉 恭喜合成 2048！\n得分: '+score+'\n继续挑战更高分数吧！');
        }, 200);
      }
      checkGame();
    }
  }
  function checkGame() {
    for (var i=0;i<SIZE;i++) for (var j=0;j<SIZE;j++) {
      if (grid[i][j]===0) return;
      if (i<SIZE-1 && grid[i][j]===grid[i+1][j]) return;
      if (j<SIZE-1 && grid[i][j]===grid[i][j+1]) return;
    }
    setTimeout(function(){
      board.style.opacity = '0.4';
      board.style.filter = 'grayscale(0.5)';
      alert('游戏结束！\n得分: '+score+'\n最大方块: '+document.getElementById('g2048-max').textContent);
    }, 150);
  }
  document.addEventListener('keydown', function(e) {
    var key = e.key.toLowerCase();
    var dirs = {arrowup:'up',arrowdown:'down',arrowleft:'left',arrowright:'right',w:'up',s:'down',a:'left',d:'right'};
    if (dirs[key]) { e.preventDefault(); move(dirs[key]); }
  });
  var touchStart = null;
  board.addEventListener('touchstart', function(e) { touchStart = e.touches[0]; e.preventDefault(); });
  board.addEventListener('touchend', function(e) {
    if (!touchStart) return;
    var dx = e.changedTouches[0].clientX - touchStart.clientX;
    var dy = e.changedTouches[0].clientY - touchStart.clientY;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) move(dx>0?'right':'left');
      else move(dy>0?'down':'up');
    }
    touchStart = null;
    e.preventDefault();
  });
  document.getElementById('g2048-new').addEventListener('click', function() {
    board.style.opacity = '1';
    board.style.filter = 'none';
    init();
  });
  document.getElementById('g2048-undo').addEventListener('click', function() {
    if (prevGrid) { grid = prevGrid; score = prevScore; render(); prevGrid = null; }
  });
  init();
})();
