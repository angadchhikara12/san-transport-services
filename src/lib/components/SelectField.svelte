<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	interface Props {
		value: string;
		options: string[];
		placeholder?: string;
		required?: boolean;
		compact?: boolean;
		onChange: (value: string) => void;
	}

	let { value, options, placeholder = 'Select', required = false, compact = false, onChange }: Props = $props();

	let isOpen = $state(false);
	let highlightedIndex = $state(-1);
	let containerEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!isOpen) return;
		function handleClick(e: MouseEvent) {
			if (containerEl && e.target instanceof Node && !containerEl.contains(e.target)) {
				isOpen = false;
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	});

	function openWithHighlight() {
		isOpen = !isOpen;
		highlightedIndex = value ? Math.max(options.indexOf(value), 0) : 0;
	}

	function selectOption(option: string) {
		onChange(option);
		isOpen = false;
	}

	function rowClass(option: string, i: number): string {
		const compactRow = compact ? 'px-4 py-2 text-[0.9rem] hover:pl-6' : 'px-5 py-3 text-[0.95rem] hover:pl-[30px]';
		const active = option === value || (i === highlightedIndex && option !== value);
		return `w-full text-left text-white cursor-pointer transition-all duration-300 border-l-[3px] border-l-transparent rounded-lg hover:bg-[rgba(221,186,94,0.1)] hover:border-l-[var(--gold-accent)] hover:text-[var(--gold-accent)] ${compactRow} ${active ? `bg-[rgba(221,186,94,0.15)] border-l-[var(--gold-accent)] text-[var(--gold-accent)] ${compact ? 'pl-6' : 'pl-[30px]'} font-medium` : ''}`;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
				e.preventDefault();
				openWithHighlight();
			}
			return;
		}
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				highlightedIndex = (highlightedIndex + 1) % options.length;
				break;
			case 'ArrowUp':
				e.preventDefault();
				highlightedIndex = (highlightedIndex - 1 + options.length) % options.length;
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (highlightedIndex >= 0 && options[highlightedIndex]) {
					selectOption(options[highlightedIndex]);
				}
				break;
			case 'Escape':
				isOpen = false;
				break;
		}
	}
</script>

<div bind:this={containerEl} class="relative" onkeydown={handleKeydown}>
	{#if required}
		<select
			required
			value={value}
			tabindex="-1"
			aria-hidden="true"
			class="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer pointer-events-none"
		>
			<option value="">{placeholder}</option>
			{#each options as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</select>
	{/if}

	<button
		type="button"
		onclick={openWithHighlight}
		class:border-[var(--gold-accent)]={isOpen}
		class:bg-[rgba(13,13,13,0.95)]={isOpen}
		class:shadow-[0_0_0_5px_rgba(221,186,94,0.2)]={isOpen}
		class:-translate-y-[3px]={isOpen}
		class:text-white={value}
class:font-medium={value}
		class="w-full min-h-[48px] flex items-center justify-between px-5 pr-[50px] bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] cursor-pointer text-left {value ? 'text-white' : 'text-white/50 italic'}"
	>
		<span>{value || placeholder}</span>
		<ChevronDown
			class="absolute right-5 w-5 h-5 text-[var(--gold-accent)] pointer-events-none transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
		/>
	</button>

	{#if isOpen}
		<div class="absolute top-[calc(100%+8px)] bg-gradient-to-br from-[rgba(26,26,26,0.98)] to-[rgba(13,13,13,0.98)] backdrop-blur-[20px] border-2 border-[var(--gold-accent)] rounded-[15px] shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(221,186,94,0.1)] overflow-hidden z-[1000] p-2 animate-[dropdownOpen_0.3s_cubic-bezier(0.4,0,0.2,1)] {compact ? 'left-0 w-64 max-w-full' : 'left-0 right-0'}">
			<div class="overflow-y-auto overflow-x-hidden {compact ? 'max-h-[140px]' : 'max-h-[300px]'} mr-1 pr-1">
				{#each options as option, i (option)}
					<button
						type="button"
						class={rowClass(option, i)}
						onclick={() => selectOption(option)}
						onmouseenter={() => (highlightedIndex = i)}
					>
						{option}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes dropdownOpen {
		from {
			opacity: 0;
			transform: translateY(-15px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>