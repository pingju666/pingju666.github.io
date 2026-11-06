// 贪吃蛇游戏 v2 - 优化版
(function() {
  'use strict';
  var canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var GRID = 20, COLS = 20, ROWS = 20;
  var snake, dir, nextDir, food, score, highScore, speed, running, paused, timer, particles, animFrame;
  highScore = parseInt(localStorage.getItem('snake_high') || '0');
  document.getElementById('snake-high').textContent = highScore;
  particles = [];
  function reset() {
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    score = 0; speed = 150; running = false; paused = false; particles = [];
    document.getElementById('snake-score').textContent = '0';
    document.getElementById('snake-speed').textContent = '1';
    spawnFood();
    draw();
  }
  function spawnFood() {
    do {
      food = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
    } while (snake.some(function(s) { return s.x===food.x && s.y===food.y; }));
  }
  function spawnParticles(x, y, color) {
    for (var i = 0; i < 8; i++) {
      particles.push({
        x: x*GRID+GRID/2, y: y*GRID+GRID/2,
        vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4,
        life: 1, color: color, size: Math.random()*4+2
      });
    }
  }
  function drawParticles() {
    particles = particles.filter(function(p) { return p.life > 0; });
    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy; p.life -= 0.03; p.size *= 0.97;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function draw() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = 'rgba(91,140,133,0.08)';
    for (var i=0;i<COLS;i++) for (var j=0;j<ROWS;j++) ctx.strokeRect(i*GRID,j*GRID,GRID,GRID);
    // 食物发光
    var glow = ctx.createRadialGradient(food.x*GRID+GRID/2, food.y*GRID+GRID/2, 2, food.x*GRID+GRID/2, food.y*GRID+GRID/2, GRID);
    glow.addColorStop(0, 'rgba(201,138,138,0.8)');
    glow.addColorStop(1, 'rgba(201,138,138,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(food.x*GRID-GRID/2, food.y*GRID-GRID/2, GRID*2, GRID*2);
    ctx.fillStyle = '#C98A8A';
    ctx.beginPath();
    ctx.arc(food.x*GRID+GRID/2, food.y*GRID+GRID/2, GRID/2-2, 0, Math.PI*2);
    ctx.fill();
    // 蛇身渐变
    snake.forEach(function(s, i) {
      var ratio = 1 - i/snake.length*0.6;
      var r = Math.round(91*ratio+40), g = Math.round(140*ratio+20), b = Math.round(133*ratio+20);
      ctx.fillStyle = i===0 ? '#5B8C85' : 'rgb('+r+','+g+','+b+')';
      ctx.shadowColor = i===0 ? 'rgba(91,140,133,0.5)' : 'transparent';
      ctx.shadowBlur = i===0 ? 8 : 0;
      var pad = i===0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(s.x*GRID+pad, s.y*GRID+pad, GRID-pad*2, GRID-pad*2, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    drawParticles();
  }
  function update() {
    if (!running || paused) return;
    dir = nextDir;
    var head = {x: snake[0].x+dir.x, y: snake[0].y+dir.y};
    if (head.x<0||head.x>=COLS||head.y<0||head.y>=ROWS||snake.some(function(s){return s.x===head.x&&s.y===head.y;})) {
      gameOver(); return;
    }
    snake.unshift(head);
    if (head.x===food.x && head.y===food.y) {
      score += 10;
      document.getElementById('snake-score').textContent = score;
      spawnParticles(food.x, food.y, '#C98A8A');
      if (score % 50 === 0 && speed > 60) {
        speed -= 10;
        document.getElementById('snake-speed').textContent = Math.round((150-speed)/10+1);
        clearInterval(timer); timer = setInterval(update, speed);
      }
      spawnFood();
    } else {
      snake.pop();
    }
    draw();
  }
  function gameOver() {
    running = false;
    clearInterval(timer);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snake_high', highScore);
      document.getElementById('snake-high').textContent = highScore;
    }
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#C98A8A';
    ctx.font = 'bold 32px "Noto Serif SC",serif';
    ctx.fillText('游戏结束', canvas.width/2, canvas.height/2-30);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText('得分: '+score, canvas.width/2, canvas.height/2+15);
    if (score >= highScore && score > 0) {
      ctx.fillStyle = '#E2C288';
      ctx.font = '16px sans-serif';
      ctx.fillText('🎉 新纪录！', canvas.width/2, canvas.height/2+45);
    }
    document.getElementById('snake-start').textContent = '再来一局';
    document.getElementById('snake-pause').disabled = true;
  }
  function start() {
    reset();
    running = true;
    document.getElementById('snake-start').textContent = '重新开始';
    document.getElementById('snake-pause').disabled = false;
    document.getElementById('snake-pause').textContent = '暂停';
    timer = setInterval(update, speed);
  }
  document.getElementById('snake-start').addEventListener('click', start);
  document.getElementById('snake-pause').addEventListener('click', function() {
    paused = !paused;
    this.textContent = paused ? '继续' : '暂停';
  });
  document.addEventListener('keydown', function(e) {
    if (!running) return;
    var key = e.key.toLowerCase();
    if ((key==='arrowup'||key==='w') && dir.y===0) nextDir = {x:0,y:-1};
    else if ((key==='arrowdown'||key==='s') && dir.y===0) nextDir = {x:0,y:1};
    else if ((key==='arrowleft'||key==='a') && dir.x===0) nextDir = {x:-1,y:0};
    else if ((key==='arrowright'||key==='d') && dir.x===0) nextDir = {x:1,y:0};
    else return;
    e.preventDefault();
  });
  var touchStart = null;
  canvas.addEventListener('touchstart', function(e) { touchStart = e.touches[0]; e.preventDefault(); });
  canvas.addEventListener('touchend', function(e) {
    if (!touchStart || !running) return;
    var dx = e.changedTouches[0].clientX - touchStart.clientX;
    var dy = e.changedTouches[0].clientY - touchStart.clientY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dir.x===0) nextDir = {x:1,y:0};
      else if (dx < 0 && dir.x===0) nextDir = {x:-1,y:0};
    } else {
      if (dy > 0 && dir.y===0) nextDir = {x:0,y:1};
      else if (dy < 0 && dir.y===0) nextDir = {x:0,y:-1};
    }
    touchStart = null;
    e.preventDefault();
  });
  reset();
})();
