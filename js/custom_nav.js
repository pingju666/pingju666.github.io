// 自定义导航点击事件处理
(function() {
  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 直接修改所有侧边栏数据项，确保它们是可点击的链接
    const siteDataSection = document.querySelector('.site-data');
    if (siteDataSection) {
      // 获取所有包含headline的子元素
      const dataItems = siteDataSection.querySelectorAll('a');
      dataItems.forEach(function(item) {
        // 确保整个区域都是可点击的
        item.style.display = 'block';
        item.style.padding = '8px 0';
        item.style.textDecoration = 'none';
        // 添加悬停效果
        item.style.transition = 'color 0.3s ease';
      });
    }
    
    // 备用方案：直接为每个headline添加点击事件
    const headlines = document.querySelectorAll('.headline');
    headlines.forEach(function(headline) {
      const text = headline.textContent.trim();
      let targetUrl = '';
      
      if (text === '文章') {
        targetUrl = '/archives/';
      } else if (text === '标签') {
        targetUrl = '/tags/';
      } else if (text === '分类') {
        targetUrl = '/categories/';
      }
      
      if (targetUrl) {
        headline.style.cursor = 'pointer';
        headline.addEventListener('click', function() {
          window.location.href = targetUrl;
        });
        // 添加鼠标悬停效果
        headline.style.transition = 'color 0.3s ease';
      }
    });
  });
})();