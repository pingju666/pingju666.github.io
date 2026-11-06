// 打字速度测试 v2 - 优化版
(function() {
  'use strict';
  var display = document.getElementById('type-text');
  var input = document.getElementById('type-input');
  if (!display || !input) return;
  var texts = [
    '在C++中，智能指针是管理动态内存的重要工具。std::unique_ptr提供独占所有权语义，当指针离开作用域时自动释放所指向的对象。std::shared_ptr则通过引用计数实现共享所有权，最后一个shared_ptr销毁时才会释放内存。',
    '网络编程中，Socket是进程间通信的端点。TCP提供面向连接的可靠传输，通过三次握手建立连接，四次挥手断开连接。而UDP是无连接的不可靠传输协议，适用于对实时性要求高的场景。',
    'Linux系统中，进程是资源分配的基本单位，线程是CPU调度的基本单位。进程间通信可以通过管道、消息队列、共享内存、信号量等方式实现。多线程编程需要注意线程安全和竞态条件。',
    '数据结构是计算机存储和组织数据的方式。数组在内存中连续存储，支持随机访问。链表通过指针连接节点，插入删除效率高。哈希表通过散列函数实现快速查找，平均时间复杂度为O(1)。',
    '在Web开发中，JavaScript是一种解释型的高级编程语言。闭包是JavaScript的重要特性，它允许函数访问其外部函数作用域中的变量。Promise和async/await使异步编程更加优雅。',
    'Python以其简洁的语法和丰富的生态系统著称。列表推导式可以优雅地创建列表，装饰器可以在不修改原函数的情况下扩展功能，生成器则可以高效地处理大量数据的迭代。'
  ];
  var currentText, startTime, timer, typed, errors, totalTyped, finished;
  function pickText() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    renderText();
    reset();
  }
  function renderText() {
    display.innerHTML = '';
    currentText.split('').forEach(function(ch, i) {
      var span = document.createElement('span');
      span.textContent = ch;
      span.className = 'type-char';
      span.id = 'char-'+i;
      span.style.cssText = 'padding:1px 2px;border-radius:3px;transition:all 0.1s;color:var(--text-muted)';
      display.appendChild(span);
    });
    display.style.cssText = 'background:rgba(91,140,133,0.06);padding:18px 20px;border-radius:12px;font-size:1.15em;line-height:2.2;margin:15px 0;min-height:100px;border:1px solid rgba(91,140,133,0.12);text-align:left;letter-spacing:0.5px';
    var progress = document.getElementById('type-progress');
    if (progress) progress.style.width = '0%';
  }
  function reset() {
    input.value = '';
    startTime = null; typed = 0; errors = 0; totalTyped = 0; finished = false;
    clearInterval(timer);
    document.getElementById('type-wpm').textContent = '0';
    document.getElementById('type-accuracy').textContent = '100%';
    document.getElementById('type-time').textContent = '0s';
  }
  function update() {
    if (finished) return;
    if (!startTime) {
      startTime = Date.now();
      timer = setInterval(function() {
        var elapsed = Math.floor((Date.now()-startTime)/1000);
        document.getElementById('type-time').textContent = elapsed+'s';
        if (elapsed > 0) {
          var wpm = Math.round(typed / 5 / (elapsed/60));
          document.getElementById('type-wpm').textContent = wpm;
        }
      }, 1000);
    }
    var val = input.value;
    totalTyped++;
    errors = 0;
    var chars = display.querySelectorAll('.type-char');
    for (var i = 0; i < chars.length; i++) {
      if (i < val.length) {
        if (val[i] === currentText[i]) {
          chars[i].style.background = 'rgba(91,140,133,0.2)';
          chars[i].style.color = '#2D3844';
          chars[i].style.fontWeight = '600';
        } else {
          chars[i].style.background = 'rgba(201,138,138,0.35)';
          chars[i].style.color = '#c0392b';
          chars[i].style.fontWeight = '600';
          errors++;
        }
      } else {
        chars[i].style.background = '';
        chars[i].style.color = 'var(--text-muted)';
        chars[i].style.fontWeight = 'normal';
      }
    }
    // 光标高亮
    if (val.length < chars.length) {
      chars[val.length].style.borderLeft = '2px solid var(--primary-color)';
    }
    typed = val.length;
    var accuracy = totalTyped > 0 ? Math.round((totalTyped-errors)/totalTyped*100) : 100;
    document.getElementById('type-accuracy').textContent = accuracy+'%';
    var progress = document.getElementById('type-progress');
    if (progress) progress.style.width = Math.round(val.length/currentText.length*100)+'%';
    if (val.length >= currentText.length) {
      finished = true;
      clearInterval(timer);
      var elapsed = Math.floor((Date.now()-startTime)/1000);
      var wpm = elapsed > 0 ? Math.round(typed/5/(elapsed/60)) : 0;
      var rank = wpm >= 80 ? '🏆 王者' : wpm >= 60 ? '🥇 钻石' : wpm >= 40 ? '🥈 白金' : wpm >= 20 ? '🥉 黄金' : '💪 青铜';
      var bestWpm = parseInt(localStorage.getItem('typing_best') || '0');
      var isNew = wpm > bestWpm;
      if (isNew) localStorage.setItem('typing_best', wpm);
      setTimeout(function() {
        alert('测试完成！\n速度: '+wpm+' WPM\n准确率: '+accuracy+'%\n用时: '+elapsed+'秒\n段位: '+rank+(isNew?'\n🎉 新纪录！':'\n历史最佳: '+bestWpm+' WPM'));
      }, 100);
    }
  }
  input.addEventListener('input', update);
  document.getElementById('type-new').addEventListener('click', function() { pickText(); input.focus(); });
  document.getElementById('type-reset').addEventListener('click', function() { reset(); renderText(); input.focus(); });
  pickText();
})();
