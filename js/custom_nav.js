// 自定义导航点击事件处理
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var siteDataSection = document.querySelector('.site-data');
    if (siteDataSection) {
      var dataItems = siteDataSection.querySelectorAll('a');
      dataItems.forEach(function(item) {
        item.style.display = 'block';
        item.style.padding = '8px 0';
        item.style.textDecoration = 'none';
        item.style.transition = 'color 0.3s ease';
      });
    }

    var headlines = document.querySelectorAll('.headline');
    headlines.forEach(function(headline) {
      var text = headline.textContent.trim();
      var targetUrl = '';
      if (text === '文章') targetUrl = '/archives/';
      else if (text === '标签') targetUrl = '/tags/';
      else if (text === '分类') targetUrl = '/categories/';

      if (targetUrl) {
        headline.style.cursor = 'pointer';
        headline.addEventListener('click', function() {
          window.location.href = targetUrl;
        });
        headline.style.transition = 'color 0.3s ease';
      }
    });
  });
})();
