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

    // ====== 标签页修复：从侧边栏提取标签云填充到主内容区 ======
    fillTagCloud();
  });

  // Pjax 完成后也执行（兼容 SPA 导航）
  document.addEventListener('pjax:complete', function() {
    fillTagCloud();
  });
})();

function fillTagCloud() {
  // 只在标签首页且内容为空时处理
  var path = location.pathname;
  if (path !== '/tags/' && path !== '/tags/index.html') return;

  var container = document.getElementById('article-container');
  if (!container || container.children.length > 0) return;

  // 从侧边栏 card-tag-cloud 提取已有标签数据
  var sidebarCloud = document.querySelector('.card-tag-cloud');
  if (!sidebarCloud) return;

  // 克隆侧边栏标签云到主内容区
  var cloudList = document.createElement('div');
  cloudList.className = 'tag-cloud-list text-center';
  cloudList.style.cssText = 'padding:40px 20px;line-height:2.5';

  var tags = sidebarCloud.querySelectorAll('a');
  if (tags.length === 0) return;

  tags.forEach(function(tag) {
    var clone = tag.cloneNode(true);
    clone.style.color = '#5B8C85';
    clone.style.margin = '6px 12px';
    clone.style.display = 'inline-block';
    clone.style.textDecoration = 'none';
    clone.style.transition = 'all 0.3s ease';
    clone.addEventListener('mouseenter', function() { this.style.color = '#C98A8A'; this.style.transform = 'scale(1.1'); });
    clone.addEventListener('mouseleave', function() { this.style.color = '#5B8C85'; this.style.transform = 'scale(1)'; });
    cloudList.appendChild(clone);
  });

  container.appendChild(cloudList);
}