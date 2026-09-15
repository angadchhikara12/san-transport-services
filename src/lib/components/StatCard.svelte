<script lang="ts">
	interface StatProps {
		target: number;
		suffix: string;
		duration: number;
		label: string;
	}
	let { target, suffix, duration, label }: StatProps = $props();

	let count = $state(0);
	let el = $state<HTMLElement | null>(null);

	$effect(() => {
		const element = el;
		if (!element) return;
		let started = false;
		let raf = 0;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started) {
					started = true;
					const start = performance.now();
					const tick = (now: number) => {
						const elapsed = now - start;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						count = Math.floor(eased * target);
						if (progress < 1) raf = requestAnimationFrame(tick);
					};
					raf = requestAnimationFrame(tick);
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(element);
		return () => {
			observer.disconnect();
			cancelAnimationFrame(raf);
		};
	});
</script>

<div class="text-center py-10 px-5 bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(212,175,55,0.1)] relative overflow-hidden transition-all duration-400 hover:-translate-y-2.5 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group">
	<div class="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
	<div class="text-[var(--gold-accent)] text-[clamp(3rem,5vw,4.5rem)] font-bold mb-3.5 leading-none">
		<span bind:this={el}>{count.toLocaleString()}</span>{suffix}
	</div>
	<div class="text-[var(--soft-gray)] text-[1.1rem] font-medium tracking-[1px] uppercase">{label}</div>
</div>