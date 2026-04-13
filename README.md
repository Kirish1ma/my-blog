# 11ty Long Reads

+ Adam DJ brett
+ [https://adamdjbrett.com](https://adamdjbrett.com)
+ [info@adamdjbrett.com](mailto:info@adamdjbrett.com)

---

# 標籤封裝

## IMG標籤
範例
```html
<div class="img-photo">
	<img src="https://i.postimg.cc/2Sq5dLvJ/IMG-2943.jpg" alt="IMG-2943.JPG" loading="lazy">
	<p class="img-photo__caption">拍於月光最柔和的夜晚 · 以此紀念我與小鎮</p>
</div>
```

使用 `img-photo` 類別來包裝圖片方塊，使用 `img-photo__caption` 類別來包裝圖片底部標題。

## A標籤
範例
```html
<h1 class="link-section-title">友鏈 / Link</h1>
<div class="link-stack">
  <a href="https://kirish1ma.github.io/">一個奇怪的「後現代」網站(廢棄)</a>
  <a href="https://dontalk.org/">Dontalk - 緘默</a>
</div>
```

使用 `link-section-title` 類別來設定標題，使用 `link-stack` 類別來包裝跳轉按鈕。

## XPPlayer 音樂播放器
<!-- 公共說明文件 -->
<!-- {% include "partials/xpplayer-readme.njk" %} -->

範例
```html
{# 完全使用外部链接 #}
{% xpPlayer 
  "https://example.com/music/song.mp3", 
  "歌曲名", 
  "艺术家", 
  "https://example.com/covers/album.jpg", 
  "https://example.com/lyrics/song.lrc" 
%}

{# 混合使用（本地 + 外部） #}
{% xpPlayer 
  "https://cdn.example.com/audio/song.mp3", 
  "歌曲名", 
  "艺术家", 
  "/media/audio/local-cover.jpg", 
  "https://lrc-api.com/lyrics/123.lrc" 
%}
{% xpPlayer "/media/audio/檔案名.mp3", "檔案標題", "檔案作者", "/media/audio/檔案封面.jpg", "/media/audio/檔案歌詞.lrc" %}
```

使用 `xpPlayer` 類別來包裝音樂播放器，參數分別為音樂路徑、音樂名稱、音樂作者、音樂封面、音樂歌詞路徑。
