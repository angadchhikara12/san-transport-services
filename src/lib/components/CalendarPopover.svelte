<script lang="ts">
	import { ChevronLeft, ChevronRight, CalendarDays } from '@lucide/svelte';

	interface Props {
		value?: Date;
		onChange: (date: Date | undefined) => void;
		label?: string;
		required?: boolean;
		compact?: boolean;
	}

	let { value = undefined, onChange, label, required = false, compact = false }: Props = $props();

	let open = $state(false);
	let containerEl = $state<HTMLDivElement | null>(null);

	const today = $derived(new Date());
	const cursor = $state(
		value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
	);

	const monthLabel = $derived(
		cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);

	const firstDayIndex = $derived(new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay());
	const daysInMonth = $derived(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate());

	const days = $derived.by(() => {
		const list: (number | null)[] = [];
		for (let i = 0; i < firstDayIndex; i++) list.push(null);
		for (let d = 1; d <= daysInMonth; d++) list.push(d);
		return list;
	});

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

	function prevMonth() {
		cursor.setMonth(cursor.getMonth() - 1, 1);
	}

	function nextMonth() {
		cursor.setMonth(cursor.getMonth() + 1, 1);
	}

	function selectDay(day: number) {
		onChange(new Date(cursor.getFullYear(), cursor.getMonth(), day));
		open = false;
	}

	function isSelected(day: number) {
		return (
			value &&
			value.getFullYear() === cursor.getFullYear() &&
			value.getMonth() === cursor.getMonth() &&
			value.getDate() === day
		);
	}

	function isToday(day: number) {
		return (
			today.getFullYear() === cursor.getFullYear() &&
			today.getMonth() === cursor.getMonth() &&
			today.getDate() === day
		);
	}
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
			{value
				? value.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})
				: 'Select date'}
		</span>
		<CalendarDays
			class="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gold-accent)] pointer-events-none"
		/>
	</button>

	{#if open}
		<div
			class="absolute top-full mt-2 bg-[#0D0D0D] border-2 border-[var(--gold-accent)] text-white rounded-xl z-[1001] shadow-[0_20px_60px_rgba(0,0,0,0.6)] select-none {compact ? 'left-0 w-64 max-w-full p-2.5' : 'left-0 right-0 p-3'}"
		>
			<div class="flex items-center justify-between mb-2 {compact ? 'mb-1.5' : ''}">
				<button
					type="button"
					class="rounded-md hover:bg-white/5 text-[var(--gold-accent)] cursor-pointer {compact ? 'p-1' : 'p-1.5'}"
					onclick={prevMonth}
				>
					<ChevronLeft class="w-4 h-4" />
				</button>
				<span class="{compact ? 'text-xs' : 'text-sm'} font-medium">{monthLabel}</span>
				<button
					type="button"
					class="rounded-md hover:bg-white/5 text-[var(--gold-accent)] cursor-pointer {compact ? 'p-1' : 'p-1.5'}"
					onclick={nextMonth}
				>
					<ChevronRight class="w-4 h-4" />
				</button>
			</div>
			<div class="grid grid-cols-7 gap-1 mb-1">
				{#each ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as d (d)}
					<div class="text-center uppercase tracking-wide text-white/40 {compact ? 'py-0.5 text-[0.65rem]' : 'py-1 text-[0.7rem]'}">{d}</div>
				{/each}
			</div>
			<div class="grid grid-cols-7 gap-1">
				{#each days as day, i (i)}
					{#if day === null}
						<div class={compact ? 'h-7' : 'h-9'} />
					{:else}
						<button
							type="button"
							class="w-full rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-white/5 {compact ? 'h-7 text-xs' : 'h-9 text-sm'} {isSelected(day) ? 'bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] font-bold' : ''} {isToday(day) && !isSelected(day) ? 'bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)]' : ''}"
							onclick={() => selectDay(day)}
						>
							{day}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>