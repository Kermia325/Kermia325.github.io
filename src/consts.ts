// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// 集中管理站点基础信息，后续可直接在这里修改。
export const SITE_TITLE = 'Kermia 的个人博客';
export const SITE_DESCRIPTION = '记录学习、技术探索与日常生活的个人空间';
export const SITE_AUTHOR = 'Kermia';
export const MUSIC_TITLE = 'millsage《Odd Dice》';
export const MUSIC_FILE = 'audio/odd-dice.mp3';

// 首页背景素材：填入 public 目录下的路径后会自动替换当前的渐变占位背景。
export const HOME_ARTWORK = {
	desktop: '/images/millsage/stellar-hd-source.png',
	mobile: '/images/millsage/stellar-hd-source.png',
	background: '/images/millsage/stellar-hd-background.png',
	character: '/images/millsage/stellar-hd-character.png',
	width: 1920,
	height: 1144,
};

export const NAV_ITEMS = [
	{ href: '/', label: 'home' },
	{ href: '/blog', label: 'blog' },
	{ href: '/about', label: 'me' },
];
