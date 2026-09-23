<script lang="ts">
	import { Bell } from '@lucide/svelte';
	import NotificationPanel from './NotificationPanel.svelte';
	import { resolve } from '$app/paths';

	let scrolled = $state(false);
	let mobileOpen = $state(false);
	let notificationOpen = $state(false);

	$effect(() => {
		function onScroll() {
			scrolled = window.scrollY > 50;
		}
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	});

	const home = resolve('/');
	const book = resolve('/book');

	const links = [
		{ href: home, label: 'Home' },
		{ href: resolve('/fleet'), label: 'Fleet' },
		{ href: resolve('/services'), label: 'Services' },
		{ href: resolve('/special'), label: 'Special' },
		{ href: resolve('/about'), label: 'About' },
		{ href: resolve('/contact'), label: 'Contact' }
	];
</script>

<nav
	class:shadow-[0_2px_20px_rgba(0,0,0,0.3)]={scrolled}
	class:backdrop-blur-[20px]={scrolled}
	style="background:{scrolled ? 'rgba(13,13,13,0.98)' : '#0D0D0D'}"
	class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
>
	<div class="max-w-[1400px] mx-auto px-5 flex justify-between items-center h-18">
		<a href={home} class="flex items-end gap-3 no-underline">
			<img src="/logo.jpeg" alt="Logo" width={40} height={40} class="w-15 h-11 object-contain" />
			<p class="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
				<span class="text-3xl font-[family-name:var(--font-playfair)]">SAN </span><span class="text-3xl text-[var(--gold-accent)] font-[family-name:var(--font-playfair)]">T</span><span class="text-[var(--gold-accent)]">ransport </span><span class="text-3xl text-[var(--gold-accent)] font-[family-name:var(--font-playfair)]">S</span><span class="text-[var(--gold-accent)]">ervices</span>
			</p>
		</a>

		<div class="hidden lg:flex items-center gap-10">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-4">
			<button
				type="button"
				onclick={() => (notificationOpen = true)}
				class="relative p-2 rounded-full transition-colors hover:bg-white/5 cursor-pointer"
			>
				<Bell class="w-5 h-5 text-white" />
			</button>
			<a href={book} class="hidden lg:inline-flex">
				<span class="inline-block bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] px-5 py-2.5 rounded-[5px] font-bold uppercase tracking-[1.1px] text-[0.85rem] leading-none no-underline transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
					Book Now
				</span>
			</a>
			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				class="lg:hidden flex flex-col gap-1.5 z-[1001] cursor-pointer bg-transparent border-none p-1"
			>
				<span class:rotate-45={mobileOpen} class:translate-x-[8px]={mobileOpen} class:translate-y-[8px]={mobileOpen} class="w-7 h-0.5 bg-white transition-all duration-300" />
				<span class:opacity-0={mobileOpen} class="w-7 h-0.5 bg-white transition-all duration-300" />
				<span class:-rotate-45={mobileOpen} class:translate-x-[8px]={mobileOpen} class:-translate-y-[8px]={mobileOpen} class="w-7 h-0.5 bg-white transition-all duration-300" />
			</button>
		</div>
	</div>
</nav>

<div
	class:right-0={mobileOpen}
	class:right-[-100%]={!mobileOpen}
	class="fixed top-0 right-0 w-[80%] max-w-[400px] h-screen bg-[#0D0D0D] z-[999] transition-[right] duration-300 pt-20 px-10 overflow-y-auto"
>
	<div class="flex flex-col gap-5">
		{#each links as link (link.href)}
			<a
				href={link.href}
				onclick={() => (mobileOpen = false)}
				class="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors"
			>
				{link.label}
			</a>
		{/each}
		<a
			href={book}
			onclick={() => (mobileOpen = false)}
			class="mt-2 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] px-6 py-3 rounded-2xl text-center font-bold uppercase tracking-[1.1px] text-sm no-underline hover:text-[#0D0D0D]"
		>
			Book Now
		</a>
	</div>
</div>

{#if mobileOpen}
	<div class="fixed inset-0 bg-black/50 z-[998]" onclick={() => (mobileOpen = false)} />
{/if}

<NotificationPanel open={notificationOpen} onClose={() => (notificationOpen = false)} />