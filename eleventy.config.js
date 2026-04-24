import {
	IdAttributePlugin,
	InputPathToUrlTransformPlugin,
	HtmlBasePlugin,
} from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import yaml from "js-yaml";
import pluginFilters from "./_config/filters.js";
import { execSync } from "child_process";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";
import markdownItAttrs from "markdown-it-attrs";
import pluginTOC from "eleventy-plugin-toc";
import CleanCSS from "clean-css";
import xpPlayerConfig from "./_data/xpPlayer.js";

const escapeHtml = (value = "") =>
	String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const escapeAttr = (value = "") => escapeHtml(value).replace(/`/g, "&#96;");

export default async function (eleventyConfig) {
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	eleventyConfig.addCollection("categoryList", (collectionApi) => {
		let categorySet = new Set();
		for (let item of collectionApi.getAll()) {
			let tags = item?.data?.tags;
			if (!tags) continue;
			if (typeof tags === "string") tags = [tags];
			if (!Array.isArray(tags)) continue;
			for (let tag of tags) {
				if (typeof tag === "string" && tag.startsWith("cat-")) {
					categorySet.add(tag);
				}
			}
		}
		return [...categorySet].sort((a, b) => a.localeCompare(b));
	});
	eleventyConfig
		.addPassthroughCopy({
			"./public/": "/",
		})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
	});
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
	});
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 },
	});
	let options = {
		html: true,
		breaks: true,
		linkify: true,
		permalink: true,
		typographer: true,
		permalinkClass: "direct-link",
		permalinkSymbol: "#",
	};
	let markdownLib = markdownIt(options)
		.use(markdownItAttrs)
		.use(markdownItFootnote);
	eleventyConfig.setLibrary("md", markdownLib);

	eleventyConfig.on("eleventy.after", () => {
		execSync(`npx pagefind --site _site --glob \"**/*.html\"`, {
			encoding: "utf-8",
		});
	});

	eleventyConfig.amendLibrary("md", (mdLib) => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "",
				ariaHidden: false,
			}),
			level: [1, 2, 3, 4],
			slugify: eleventyConfig.getFilter("slugify"),
		});
	});

	eleventyConfig.addPlugin(pluginTOC, {
		tags: ["h2", "h3", "h4", "h5"],
		id: "toci",
		class: "list-group",
		ul: true,
		flat: true,
		wrapper: "div",
	});

	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 4,
			},
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: {
			language: "zh-cn",
			title: "Kirishima's Blog",
			subtitle: "Just record someting",
			base: "https://blog.kirishima.dev",
			author: {
				name: "Kirishima",
			},
		},
	});

	eleventyConfig.addPlugin(pluginFilters);
	eleventyConfig.addPlugin(IdAttributePlugin, {});

	eleventyConfig.addShortcode(
		"xpPlayer",
		(src, title = "", artist = "", cover = "", lrc = "") => {
			if (!src) return "";
			const safeSrc = escapeAttr(src);
			const hasExplicitCover = Boolean(cover);
			const hasLrc = Boolean(lrc);
			const coverSrc = hasExplicitCover
				? escapeAttr(cover)
				: xpPlayerConfig.fallbackCover;
			const coverMarkup = `<div class="xp-player__cover">
			<img src="${coverSrc}" alt="${escapeAttr(title || "Audio cover")}" loading="lazy" data-cover-img>
		</div>`;
			const titleMarkup = title
				? `<div class="xp-player__title" title="${escapeAttr(title)}">${escapeHtml(title)}</div>`
				: "";
			const artistMarkup = artist
				? `<div class="xp-player__artist" title="${escapeAttr(artist)}">${escapeHtml(artist)}</div>`
				: "";
			const lrcToggleMarkup = hasLrc
				? `<button type="button" class="xp-player__lrc-toggle" aria-label="${xpPlayerConfig.labels.showLyrics}" title="${xpPlayerConfig.labels.showLyrics}">
				<span class="xp-player__lrc-icon">${xpPlayerConfig.icons.lyrics}</span>
			</button>`
				: "";
			const lrcContainerMarkup = hasLrc
				? `<div class="xp-player__lyrics" data-lrc-container>
				<div class="xp-player__lyrics-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
					<div class="xp-player__lyrics-progress-bar"></div>
				</div>
				<div class="xp-player__lyrics-scroll">
					<div class="xp-player__lyrics-content"></div>
				</div>
			</div>`
				: "";
			return `<div class="xp-player" data-xp-player data-cover-mode="${
				hasExplicitCover ? "explicit" : "auto"
			}" data-fallback-cover="${xpPlayerConfig.fallbackCover}"${hasLrc ? ` data-lrc="${escapeAttr(lrc)}"` : ""}>
			${coverMarkup}
			<div class="xp-player__panel">
				<button type="button" class="xp-player__btn" aria-label="${xpPlayerConfig.labels.playPause}">
					<span class="xp-player__icon">${xpPlayerConfig.icons.play}</span>
				</button>
				<div class="xp-player__meta">
					${titleMarkup}
					${artistMarkup}
				</div>
				<div class="xp-player__time">
					<span class="xp-player__current">${xpPlayerConfig.labels.currentTime}</span>
					<span class="xp-player__divider">/</span>
					<span class="xp-player__duration">${xpPlayerConfig.labels.duration}</span>
				</div>
				${lrcToggleMarkup}
			</div>
			<div class="xp-player__progress" role="slider" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="${xpPlayerConfig.labels.playProgress}">
				<div class="xp-player__progress-bar"><span></span></div>
			</div>
			${lrcContainerMarkup}
			<audio preload="metadata" src="${safeSrc}"></audio>
			<audio preload="none" src="${safeSrc}"></audio>
		</div>`;
		},
	);

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});
}

export const config = {
	templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data",
		output: "_site",
	},
};
