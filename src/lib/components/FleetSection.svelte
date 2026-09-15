<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api.js';
	import { Users, Luggage, Car as CarIcon } from '@lucide/svelte';
	import { toSlug } from '$lib/utils';
	import { resolve } from '$app/paths';

	const { data, isLoading } = useQuery(api.cars.list, {});
	const vehicles = $derived(data ?? []);
	const cars = $derived(
		vehicles.map((v) => ({ ...v, href: resolve('/fleet/[car]', { car: toSlug(v.name) }) }))
	);

	function objectPos(name: string): string {
		const n = name.toLowerCase();
		if (n.includes('bmw')) return 'object-[center_80%]';
		if (n.includes('escalade')) return 'object-[center_65%]';
		if (n.includes('rivian')) return 'object-[90%_top]';
		if (n.includes('wagoneer')) return 'object-top';
		return 'object-center';
	}
</script>

<section class="relative py-[120px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
	<div class="absolute top-0 left-[-10%] w-[120%] h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
	<div class="max-w-[1400px] mx-auto px-5 relative z-[1]">
		<div class="text-center mb-[60px] max-w-[800px] mx-auto">
			<span class="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-[25px] font-semibold">
				Our Fleet
			</span>
			<h2 class="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5">
				Premium <span class="text-[var(--gold-accent)]">Vehicles</span>
			</h2>
			<p class="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
				Explore our fleet of luxury vehicles, each maintained to the highest standards.
			</p>
		</div>
		{#if isLoading}
			<div class="text-center py-20">
				<div class="w-10 h-10 border-2 border-[var(--gold-accent)] border-t-transparent rounded-full animate-spin mx-auto" />
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
{#each cars as vehicle (vehicle.name)}
				<a href={vehicle.href} class="group flex">
						<div class="w-full flex flex-col bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] overflow-hidden border border-[rgba(212,175,55,0.2)] transition-all duration-500 relative hover:-translate-y-[15px] hover:scale-[1.02] hover:border-[var(--gold-accent)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)]">
							<div class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold-accent)] via-[var(--gold-light)] to-[var(--gold-accent)] scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
							<div class="relative h-[280px] overflow-hidden">
								{#if vehicle.image}
									<img
										src={vehicle.image}
										alt={vehicle.name}
										class={`w-full h-full object-cover transition-all duration-800 brightness-90 contrast-[1.1] group-hover:scale-[1.15] group-hover:brightness-110 group-hover:contrast-[1.15] ${objectPos(vehicle.name)}`}
									/>
								{:else}
									<div class="w-full h-full bg-gradient-to-br from-[#262626] to-[#111111] flex items-center justify-center">
										<CarIcon class="w-16 h-16 text-[var(--gold-accent)] opacity-60" />
									</div>
								{/if}
							</div>
							<div class="p-[35px] relative flex-1 flex flex-col">
								<h3 class="text-white text-[1.6rem] mb-3.5 font-semibold">{vehicle.name}</h3>
								<div class="flex gap-5 mb-5 flex-wrap">
									<div class="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] bg-[rgba(212,175,55,0.1)] px-3 py-1.5 rounded-[20px] border border-[rgba(212,175,55,0.2)]">
										<Users class="w-4 h-4 text-[var(--gold-accent)]" />
										<span>{vehicle.passenger_cap} Passengers</span>
									</div>
									<div class="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] bg-[rgba(212,175,55,0.1)] px-3 py-1.5 rounded-[20px] border border-[rgba(212,175,55,0.2)]">
										<Luggage class="w-4 h-4 text-[var(--gold-accent)]" />
										<span>{vehicle.luggage_cap} Bags</span>
									</div>
								</div>
								<p class="text-[var(--soft-gray)] text-[1rem] leading-[1.7] mb-6">{vehicle.description}</p>
								<div class="flex justify-between items-center pt-6 border-t border-[rgba(212,175,55,0.1)] mt-auto">
									<div class="text-[var(--soft-gray)] text-[0.9rem]">
										From <span class="text-[var(--gold-accent)] text-[1.4rem] font-bold">${vehicle.vehicle_rate}</span>/mile
									</div>
									<span class="inline-block border-2 border-[var(--gold-accent)] bg-transparent text-[var(--gold-accent)] px-6 py-2.5 rounded-full text-[0.75rem] font-semibold uppercase tracking-[1px] transition-all duration-400 group-hover:bg-[var(--gold-accent)] group-hover:text-[#0D0D0D] group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]">
										View Details
									</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>