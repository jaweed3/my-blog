// Scroll-reveal, built on the `fadeUpScroll` keyframe and `.is-visible` state that
// already exist in _base.scss. The hidden state is added *here* rather than in CSS so
// that the server-rendered HTML stays fully visible when JS is unavailable or
// IntersectionObserver is missing — reveal is progressive enhancement, never a
// gate on content.
//
// Usage:
//   <div use:reveal>…</div>
//   <div use:reveal={{ delay: i * 60 }}>…</div>   // stagger

interface RevealOptions {
	/** ms to wait before revealing, for staggering a list. */
	delay?: number;
	/** Fraction of the element that must be visible. */
	threshold?: number;
}

const prefersReducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	// Nothing to do: CSS already neutralises transitions, and skipping the hidden
	// state entirely avoids a flash if the media query changes mid-session.
	if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

	const { delay = 0, threshold = 0.15 } = options;

	node.classList.add('fade-in-scroll');
	if (delay) node.style.animationDelay = `${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				node.classList.add('is-visible');
				observer.unobserve(node); // reveal once, then stop watching
			}
		},
		{ threshold, rootMargin: '0px 0px -8% 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
