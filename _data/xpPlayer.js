export default {
	fallbackCover: "/media/audio/no-album-art.png",
	audioPath: "/media/audio/",
	labels: {
		playPause: "播放 / 暂停",
		showLyrics: "显示/隐藏歌词",
		currentTime: "00:00",
		duration: "--:--",
		playProgress: "播放进度",
	},
	icons: {
		play: "▶",
		pause: "❚❚",
		lyrics: "☰",
	},
	// README 文档配置
	readme: {
		title: "XPPlayer 音樂播放器",
		description: "使用 `xpPlayer` 類別來包裝音樂播放器",
		exampleCode: '{% xpPlayer "/media/audio/檔案名.mp3", "檔案標題", "檔案作者", "/media/audio/檔案封面.jpg", "/media/audio/檔案歌詞.lrc" %}',
		parameters: [
			{
				name: "src",
				type: "string",
				required: true,
				description: "音樂文件路徑（相對於 `/` 根目錄）",
			},
			{
				name: "title",
				type: "string",
				required: false,
				description: "歌曲標題",
			},
			{
				name: "artist",
				type: "string",
				required: false,
				description: "藝術家名稱",
			},
			{
				name: "cover",
				type: "string",
				required: false,
				description: "封面圖片路徑；如不提供，將嘗試從 MP3 ID3 標籤自動提取",
			},
			{
				name: "lrc",
				type: "string",
				required: false,
				description: "LRC 歌詞文件路徑",
			},
		],
		features: [
			{
				title: "自動封面檢測",
				description: "如未指定封面，播放器會自動從 MP3 的 ID3 標籤中提取封面圖片",
			},
			{
				title: "LRC 歌詞支持",
				description: "支持標準 LRC 格式歌詞，帶實時同步和滾動顯示",
			},
			{
				title: "單一播放",
				description: "同時只有一個播放器在播放，切換時自動暫停其他播放器",
			},
			{
				title: "進度條交互",
				description: "點擊進度條可快速跳轉到指定位置",
			},
			{
				title: "響應式設計",
				description: "在桌面和移動設備上都能正常顯示",
			},
		],
		fileStructure: {
			path: "public/media/audio/",
			files: [
				{
					name: "no-album-art.png",
					description: "默認封面（當無法獲取時使用）",
				},
				{
					name: "song.mp3",
					description: "音樂文件",
				},
				{
					name: "song.jpg",
					description: "封面圖片",
				},
				{
					name: "song.lrc",
					description: "歌詞文件",
				},
			],
		},
		lrcFormat: {
			description: "LRC 文件應為純文本格式，每行包含時間戳和歌詞",
			example: "[00:12.00]第一句歌詞\n[00:17.20]第二句歌詞\n[00:21.10]第三句歌詞",
			timeFormat: "[MM:SS.MS]",
			timeFormatExplain: [
				{ symbol: "MM", description: "分鐘（2位數字）" },
				{ symbol: "SS", description: "秒鐘（2位數字）" },
				{ symbol: "MS", description: "毫秒（2-3位數字）" },
			],
		},
		examples: [
			{
				title: "完整示例（包含所有參數）",
				code: '{% xpPlayer "/media/audio/darlin.mp3", "Darlin\'(live)", "BENI", "/media/audio/darlin-cover.jpg", "/media/audio/darlin.lrc" %}',
			},
			{
				title: "最小示例（僅音樂文件）",
				code: '{% xpPlayer "/media/audio/song.mp3" %}',
			},
			{
				title: "帶標題和藝術家（無封面和歌詞）",
				code: '{% xpPlayer "/media/audio/song.mp3", "歌曲名稱", "藝術家名稱" %}',
			},
		],
		cssClasses: [
			{ name: ".xp-player", description: "播放器容器" },
			{ name: ".xp-player__cover", description: "封面圖片" },
			{ name: ".xp-player__panel", description: "控制面板" },
			{ name: ".xp-player__btn", description: "播放/暫停按鈕" },
			{ name: ".xp-player__progress", description: "主進度條" },
			{ name: ".xp-player__lyrics", description: "歌詞容器" },
			{ name: ".xp-player__lyric-line", description: "單行歌詞" },
		],
		accessibility: "播放器包含完整的 ARIA 標籤和語義 HTML，支持屏幕閱讀器和鍵盤導航。",
	},
};
