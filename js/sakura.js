// 樱花飘落效果 - 替代canvas_nest
(function() {
  'use strict';
  if (window.innerWidth < 768) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.createElement('canvas');
  canvas.id = 'sakura-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;opacity:0.6';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var W, H, petals = [];
  var PETAL_COUNT = 25;
  var colors = ['#C98A8A','#E2C288','#D4A0A0','#F0C8C8','#B87333'];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  function Petal() { this.reset(true); }
  Petal.prototype.reset = function(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : -20;
    this.size = Math.random() * 12 + 6;
    this.speedY = Math.random() * 1 + 0.3;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = Math.random() * 0.02 - 0.01;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.3;
    this.sway = Math.random() * 2;
    this.swaySpeed = Math.random() * 0.02 + 0.005;
  };
  Petal.prototype.update = function() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.sway) * 0.3;
    this.sway += this.swaySpeed;
    this.rot += this.rotSpeed;
    if (this.y > H + 20) this.reset(false);
    if (this.x > W + 20) this.x = -20;
    if (this.x < -20) this.x = W + 20;
  };
  Petal.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size/2, -this.size/2, this.size, 0, 0, this.size);
    ctx.bezierCurveTo(-this.size, 0, -this.size/2, -this.size/2, 0, 0);
    ctx.fill();
    ctx.restore();
  };
  for (var i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());
  function animate() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < petals.length; i++) { petals[i].update(); petals[i].draw(); }
    rafId = requestAnimationFrame(animate);
  }
  // 页面不可见时暂停动画，节省 CPU
  var rafId = null;
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  });
  rafId = requestAnimationFrame(animate);
})();
