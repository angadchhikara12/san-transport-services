<script lang="ts">
	import { Clock } from '@lucide/svelte';
	import TimePicker from './TimePicker.svelte';

	interface Props {
		value: string;
		onChange: (time: string) => void;
		label?: string;
		required?: boolean;
		large?: boolean;
	}

	let { value, onChange, label, required = false, large = false }: Props = $props();

	let open = $state(false);
	let containerEl = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (containerEl && e.target instanceof Node && !containerEl.contains(e.target)) {
				open = false;
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	});
</script>

<div bind:this={containerEl} class="relative">
	{#if label}
		<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">
			{label}{required ? ' *' : ''}
		</label>
	{/if}
	<button
		type="button"
		class="relative w-full flex items-center min-h-[48px] py-3 pl-5 pr-11 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] cursor-pointer text-left focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none"
		class:mt-3={label}
		onclick={() => (open = !open)}
	>
		<span class:font-medium={!!value} class={value ? 'text-white' : 'text-white/50 italic'}>
			{value || 'Select time'}
		</span>
		<Clock class="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gold-accent)] pointer-events-none" />
	</button>

	{#if open}
		<div class="absolute top-full left-0 right-0 mt-2 bg-[#0D0D0D] border-2 border-[var(--gold-accent)] text-white rounded-xl z-[1001] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-4 w-auto">
			<TimePicker large={large} value={value} onChange={onChange} />
		</div>
	{/if}
</div>