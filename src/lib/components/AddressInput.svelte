<script lang="ts">
	interface Suggestion {
		display_name: string;
		lat: string;
		lon: string;
	}

	interface Props {
		label: string;
		value: string;
		onSelect: (address: string, lat: number, lng: number) => void;
		iconColor: string;
		placeholder: string;
		required?: boolean;
		removable?: boolean;
		onRemove?: () => void;
		stopNumber?: number;
	}

	let {
		label,
		value,
		onSelect,
		iconColor,
		placeholder,
		required = false,
		removable = false,
		onRemove,
		stopNumber
	}: Props = $props();

	let input = $state(value);
	let suggestions = $state<Suggestion[]>([]);
	let open = $state(false);
	let loading = $state(false);
	let wrapperEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);
	let dropdownEl = $state<HTMLDivElement | null>(null);
	let dropdownPos = $state<{ top: number; left: number; width: number } | null>(null);
	let debounced = $state(value);
	let syncedValue = $state(value);

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	$effect(() => {
		if (value !== syncedValue) {
			syncedValue = value;
			input = value;
		}
	});

	$effect(() => {
		const current = input;
		const t = setTimeout(() => (debounced = current), 350);
		return () => clearTimeout(t);
	});

	$effect(() => {
		if (debounced.length < 1) {
			suggestions = [];
			return;
		}
		let cancelled = false;
		loading = true;
		geocodeAddress(debounced).then((result) => {
			if (!cancelled) {
				suggestions = result;
				loading = false;
			}
		});
		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		function handleClick(e: MouseEvent) {
			if (
				wrapperEl &&
				dropdownEl &&
				e.target instanceof Node &&
				!wrapperEl.contains(e.target) &&
				!dropdownEl.contains(e.target)
			) {
				open = false;
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	});

	$effect(() => {
		if (!open || suggestions.length === 0 || !inputEl) return;
		const el = inputEl;
		const update = () => {
			const rect = el.getBoundingClientRect();
			dropdownPos = { top: rect.bottom + 8, left: rect.left, width: rect.width };
		};
		update();
		window.addEventListener('resize', update);
		window.addEventListener('scroll', update, true);
		return () => {
			window.removeEventListener('resize', update);
			window.removeEventListener('scroll', update, true);
		};
	});

	async function geocodeAddress(query: string): Promise<Suggestion[]> {
		if (!query || query.length < 1) return [];
		const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
		if (!res.ok) return [];
		const data: Suggestion[] = await res.json();
		return data;
	}

	function handleSelect(s: Suggestion) {
		input = s.display_name;
		onSelect(s.display_name, parseFloat(s.lat), parseFloat(s.lon));
		open = false;
		suggestions = [];
	}
</script>

<div bind:this={wrapperEl} class="relative">
	<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1.5px]">
		{label}{required ? ' *' : ''}
	</label>
	<div class="relative mt-2">
		{#if stopNumber !== undefined}
			<div
				class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] flex items-center justify-center text-[11px] font-bold text-[#0D0D0D]"
			>
				{stopNumber}
			</div>
		{:else}
			<div class="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={iconColor ? `background:${iconColor}` : ''} />
		{/if}
		<input
			type="text"
			bind:this={inputEl}
			required={required}
			bind:value={input}
			oninput={() => (open = true)}
			onfocus={(e) => {
				open = e.currentTarget.value === '' ? false : true;
			}}
			placeholder={placeholder}
			class="w-full py-3 pl-10 pr-10 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-300 placeholder:text-white/40 placeholder:italic focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(221,186,94,0.2)] focus:-translate-y-[2px] focus:outline-none"
		/>
		{#if loading}
			<div class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--gold-accent)] border-t-transparent rounded-full animate-spin" />
		{:else if !loading && removable && onRemove}
			<button
				type="button"
				class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(239,68,68,0.3)] hover:border-[rgba(239,68,68,0.6)]"
				onclick={onRemove}
				aria-label="Remove stop"
			>
				<svg class="w-3 h-3 text-red-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
					<path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>
	{#if open && suggestions.length > 0 && dropdownPos}
		<div
			bind:this={dropdownEl}
			use:portal
			class="bg-gradient-to-br from-[rgba(26,26,26,0.98)] to-[rgba(13,13,13,0.98)] border-2 border-[var(--gold-accent)] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-h-[220px] overflow-y-auto z-[10000] p-2"
			style={`position:fixed; top:${dropdownPos.top}px; left:${dropdownPos.left}px; width:${dropdownPos.width}px;`}
		>
			{#each suggestions as s (s.lat + s.lon)}
				<button
					type="button"
					class="w-full text-left px-4 py-3 text-white/90 text-[0.85rem] cursor-pointer transition-all duration-200 rounded-lg hover:bg-[rgba(221,186,94,0.12)] hover:text-[var(--gold-accent)] border-l-[3px] border-l-transparent hover:border-l-[var(--gold-accent)]"
					onclick={() => handleSelect(s)}
				>
					{s.display_name}
				</button>
			{/each}
		</div>
	{/if}
</div>