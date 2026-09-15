<script lang="ts">
	import { ChevronUp, ChevronDown } from '@lucide/svelte';

	interface Props {
		value?: string;
		onChange?: (time: string) => void;
		large?: boolean;
	}

	let { value = '', onChange, large = false }: Props = $props();

	type Period = 'AM' | 'PM';

	let hour = $state('');
	let minute = $state('');
	let period = $state<Period>('AM');

	$effect(() => {
		const m = value.match(/^(\d{1,2}):(\d{1,2}) (AM|PM)$/);
		if (m) {
			hour = m[1];
			minute = m[2];
			period = m[3] as Period;
		}
	});

	function emit() {
		onChange?.(`${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`);
	}

	function bumpHour(dir: number) {
		const cur = parseInt(hour, 10) || 0;
		const n = dir > 0 ? (cur >= 12 ? 1 : cur + 1) : cur <= 1 ? 12 : cur - 1;
		hour = String(n);
		emit();
	}

	function bumpMinute(dir: number) {
		const cur = parseInt(minute, 10) || 0;
		minute = dir > 0 ? (cur >= 59 ? '00' : String(cur + 1)) : cur <= 0 ? '59' : String(cur - 1);
		emit();
	}

	function togglePeriod() {
		period = period === 'AM' ? 'PM' : 'AM';
		emit();
	}
</script>

<div class="flex items-center {large ? 'gap-1.5' : 'gap-1'}">
	<div class="flex flex-col items-center">
		<button type="button" class="flex {large ? 'h-6' : 'h-5'} items-center justify-center cursor-pointer" onclick={() => bumpHour(1)}>
			<ChevronUp class="text-[var(--gold-accent)] {large ? 'size-4' : 'size-3'}" />
		</button>
		<input
			type="text"
			placeholder="__"
			maxlength="2"
			bind:value={hour}
			oninput={emit}
			class="focus:border-[#DDBB5E] focus:ring-1 focus:ring-[#DDBB5E] flex items-center justify-center rounded-md border border-input bg-transparent text-center tabular-nums text-white/90 {large ? 'size-12 text-base rounded-lg' : 'size-10 text-sm'}"
		/>
		<button type="button" class="flex {large ? 'h-6' : 'h-5'} items-center justify-center cursor-pointer" onclick={() => bumpHour(-1)}>
			<ChevronDown class="text-[var(--gold-accent)] {large ? 'size-4' : 'size-3'}" />
		</button>
	</div>
	<span class="text-white/90 {large ? 'text-xl' : 'text-lg'}">:</span>
	<div class="flex flex-col items-center">
		<button type="button" class="flex {large ? 'h-6' : 'h-5'} items-center justify-center cursor-pointer" onclick={() => bumpMinute(1)}>
			<ChevronUp class="text-[var(--gold-accent)] {large ? 'size-4' : 'size-3'}" />
		</button>
		<input
			type="text"
			placeholder="__"
			maxlength="2"
			bind:value={minute}
			oninput={emit}
			class="focus:border-[#DDBB5E] focus:ring-1 focus:ring-[#DDBB5E] flex items-center justify-center rounded-md border border-input bg-transparent text-center tabular-nums text-white/90 {large ? 'size-12 text-base rounded-lg' : 'size-10 text-sm'}"
		/>
		<button type="button" class="flex {large ? 'h-6' : 'h-5'} items-center justify-center cursor-pointer" onclick={() => bumpMinute(-1)}>
			<ChevronDown class="text-[var(--gold-accent)] {large ? 'size-4' : 'size-3'}" />
		</button>
	</div>
	<div class="flex flex-col items-center">
		<button type="button" class="flex {large ? 'h-6' : 'h-5'} items-center justify-center cursor-pointer" onclick={togglePeriod}>
			<ChevronUp class="text-[var(--gold-accent)] {large ? 'size-4' : 'size-3'}" />
		</button>
		<button
			type="button"
			class="focus:border-[#DDBB5E] focus:ring-1 focus:ring-[#DDBB5E] flex items-center justify-center rounded-md border border-input bg-transparent text-center tabular-nums text-white/90 cursor-pointer hover:border-[#DDBB5E] {large ? 'size-12 text-base rounded-lg' : 'size-10 text-sm'}"
			onclick={togglePeriod}
		>
			{period}
		</button>
		<button type="button" class="flex {large ? 'h-6' : 'h-5'} items-center justify-center cursor-pointer" onclick={togglePeriod}>
			<ChevronDown class="text-[var(--gold-accent)] {large ? 'size-4' : 'size-3'}" />
		</button>
	</div>
</div>