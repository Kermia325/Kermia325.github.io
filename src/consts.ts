// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// 集中管理站点基础信息，后续可直接在这里修改。
export const SITE_TITLE = 'Kermia 的个人博客';
export const SITE_DESCRIPTION = '记录学习、技术探索与日常生活的个人空间';
export const SITE_AUTHOR = 'Kermia';
export const MUSIC_TITLE = 'sumimi《Here, the world!》';
export const MUSIC_FILE = 'audio/here-the-world.mp3';

// 首页背景素材：填入 public 目录下的路径后会自动替换当前的渐变占位背景。
export const HOME_ARTWORK = {
	desktop: '',
	mobile: '',
};

export const NAV_ITEMS = [
	{ href: '/', label: '首页' },
	{ href: '/blog', label: '文章' },
	{ href: '/about', label: '关于' },
];
