/**
 * Matrix-style text decryption animation
 * Converts garbled text to readable content with a fast, glitchy animation
 */

const CHARSET = {
	ascii: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
	chinese: '中文字符内容显示加载中文本解密矩阵代码运算处理数据流信息传输网络连接系统启动程序执行',
	symbols: '█▓▒░╔╗╚╝║═╬┌┐└┘├┤┬┴┼◆◇★☆◈◉◎●○',
};

const getRandomChar = () => {
	const pools = [CHARSET.ascii, CHARSET.chinese, CHARSET.symbols];
	const pool = pools[Math.floor(Math.random() * pools.length)];
	return pool[Math.floor(Math.random() * pool.length)];
};

// Smooth ease-in-out-cubic: slow start, fast middle, slow end
const easeInOutCubic = (t) => {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Smoother ease-in-out-quart
const easeInOutQuart = (t) => {
	return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
};

// Ultra smooth ease-in-out-quint
const easeInOutQuint = (t) => {
	return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

const createGarbledText = (originalText) => {
	return originalText
		.split('')
		.map((char) => {
			if (char === ' ' || char === '\n') return char;
			return getRandomChar();
		})
		.join('');
};

const decryptElement = (element, duration = 1500) => {
	const originalText = element.textContent;
	const chars = originalText.split('');
	const totalChars = chars.length;
	
	// Assign random speed multiplier to each character with Gaussian-like distribution
	// More characters settle around 0.4-1.2, with some very slow ones (0.1-0.3)
	const charSpeeds = chars.map(() => {
		const rand = Math.random();
		// 20% chance of very slow characters (0.1-0.35)
		if (rand < 0.2) {
			return 0.1 + Math.random() * 0.25;
		}
		// Rest follow Gaussian distribution
		const rand1 = Math.random();
		const rand2 = Math.random();
		// Box-Muller transform for normal distribution
		const gaussian = Math.sqrt(-2 * Math.log(rand1)) * Math.cos(2 * Math.PI * rand2);
		return Math.max(0.35, Math.min(1.5, 0.8 + gaussian * 0.3));
	});
	
	// Create array of indices and shuffle them
	const indices = Array.from({ length: totalChars }, (_, i) => i);
	for (let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[indices[i], indices[j]] = [indices[j], indices[i]];
	}
	
	const startTime = performance.now();
	const animationDuration = duration;
	const decryptedChars = new Set();
	
	const animate = (currentTime) => {
		const elapsed = currentTime - startTime;
		const rawProgress = Math.min(elapsed / animationDuration, 1);
		// Use ultra-smooth easing: slow start, fast middle, slow end
		const easedProgress = easeInOutQuint(rawProgress);
		
		// For each character, check if it should be decrypted based on its speed
		for (let i = 0; i < totalChars; i++) {
			const charIndex = indices[i];
			// Apply easing to individual character progress
			const charProgress = easedProgress / charSpeeds[charIndex];
			
			if (charProgress >= 1) {
				decryptedChars.add(charIndex);
			}
		}
		
		// Build current display text
		const displayArray = chars.map((char, idx) => {
			if (decryptedChars.has(idx) || char === ' ' || char === '\n') {
				return char;
			}
			return getRandomChar();
		});
		
		element.textContent = displayArray.join('');
		
		if (rawProgress < 1) {
			requestAnimationFrame(animate);
		} else {
			element.textContent = originalText;
		}
	};
	
	requestAnimationFrame(animate);
};

const initMatrixDecrypt = () => {
	// Handle individual elements with matrix-decrypt
	const elements = document.querySelectorAll('[data-matrix-decrypt="true"]');
	elements.forEach((element) => {
		const duration = parseInt(element.dataset.matrixDuration || '1500', 10);
		decryptElement(element, duration);
	});
	
	// Handle container elements - decrypt all text nodes inside
	const containers = document.querySelectorAll('[data-matrix-decrypt-container="true"]');
	containers.forEach((container) => {
		const duration = parseInt(container.dataset.matrixDuration || '1500', 10);
		
		// Get all text nodes recursively
		const walker = document.createTreeWalker(
			container,
			NodeFilter.SHOW_TEXT,
			null,
			false
		);
		
		const textNodes = [];
		let node;
		while (node = walker.nextNode()) {
			const text = node.textContent.trim();
			if (text.length > 0) {
				textNodes.push(node);
			}
		}
		
		// Decrypt each text node
		textNodes.forEach((textNode) => {
			const span = document.createElement('span');
			span.textContent = textNode.textContent;
			textNode.parentNode.replaceChild(span, textNode);
			decryptElement(span, duration);
		});
	});
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initMatrixDecrypt, { once: true });
} else {
	initMatrixDecrypt();
}
