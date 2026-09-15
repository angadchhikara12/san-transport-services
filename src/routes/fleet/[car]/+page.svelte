<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api.js';
	import Footer from '$lib/components/Footer.svelte';
	import {
		Users,
		Luggage,
		ArrowLeft,
		Fuel,
		DollarSign,
		Hash,
		Box,
		Gauge,
		Star,
		MapPin,
		Car as CarIcon
	} from '@lucide/svelte';
	import { toSlug } from '$lib/utils';
	import { resolve } from '$app/paths';

	const fleetUrl = resolve('/fleet');
	const homeUrl = resolve('/');

	interface VehicleSpecs {
		frontLegroom: string;
		rearLegroom: string;
		thirdRowLegroom: string | null;
		frontHeadroom: string;
		rearHeadroom: string;
		thirdRowHeadroom: string | null;
		cargoBehindThirdRow: string | null;
		maxCargo: string | null;
		frontTrunk: string | null;
		engine: string;
		horsepower: string;
		length: string;
		amenities: string[];
		recommendedFor: string[];
	}

	const vehicleSpecs: Record<string, VehicleSpecs> = {
		'lincoln-navigator-l': {
			frontLegroom: '43"',
			rearLegroom: '42"',
			thirdRowLegroom: '40"',
			frontHeadroom: '39"',
			rearHeadroom: '37"',
			thirdRowHeadroom: '37"',
			cargoBehindThirdRow: '37.3 cu ft',
			maxCargo: '120.2 cu ft',
			frontTrunk: null,
			engine: '3.5L Twin-Turbo V6',
			horsepower: '440 hp',
			length: '221.9"',
			amenities: ['Captain\u2019s chairs available', 'Panoramic roof', '10" touchscreen', 'Reclining 2nd row', 'Premium leather seating'],
			recommendedFor: ['Family Outings', 'Airport Transfers', 'Group Travel', 'Corporate Events']
		},
		'bmw-7-series': {
			frontLegroom: '41.2"',
			rearLegroom: '43.3"',
			thirdRowLegroom: null,
			frontHeadroom: '39.8"',
			rearHeadroom: '38.6"',
			thirdRowHeadroom: null,
			cargoBehindThirdRow: null,
			maxCargo: '19.1 cu ft',
			frontTrunk: null,
			engine: '3.0L Turbo I-6 / 4.4L Twin-Turbo V8',
			horsepower: '375–536 hp',
			length: '212.2"',
			amenities: ['Executive rear seating', 'Sky Lounge LED roof', 'Rear entertainment screens', 'Bowers & Wilkins sound', 'Heated/ventilated seats'],
			recommendedFor: ['Business Travel', 'Corporate Events', 'Date Nights', 'VIP Transfers']
		},
		'cadillac-escalade': {
			frontLegroom: '44.5"',
			rearLegroom: '41.7"',
			thirdRowLegroom: '34.9"',
			frontHeadroom: '42.3"',
			rearHeadroom: '38.9"',
			thirdRowHeadroom: '38.2"',
			cargoBehindThirdRow: '25.5 cu ft',
			maxCargo: '120.5 cu ft',
			frontTrunk: null,
			engine: '6.2L V8',
			horsepower: '420 hp',
			length: '211.9"',
			amenities: ['38" curved OLED display', 'AKG 36-speaker audio', 'Super Cruise hands-free driving', 'Night vision', 'Power-retractable running boards'],
			recommendedFor: ['Weddings', 'VIP & Executive', 'Airport Transfers', 'Special Events']
		},
		'jeep-wagoneer-l': {
			frontLegroom: '40.9"',
			rearLegroom: '42.7"',
			thirdRowLegroom: '36.6"',
			frontHeadroom: '41.3"',
			rearHeadroom: '40.0"',
			thirdRowHeadroom: '39.1"',
			cargoBehindThirdRow: '42.1 cu ft',
			maxCargo: '116.7 cu ft',
			frontTrunk: null,
			engine: '3.0L Twin-Turbo I6',
			horsepower: '420 hp',
			length: '226"',
			amenities: ['Best-in-class 3rd row legroom', 'McIntosh audio system', 'Dual panoramic sunroofs', '10.25" passenger screen', '24" wheels'],
			recommendedFor: ['Family Trips', 'Airport (Heavy Luggage)', 'Group Travel', 'Road Trips']
		},
		'rivian-r1s': {
			frontLegroom: '41.4"',
			rearLegroom: '36.6"',
			thirdRowLegroom: '32.8"',
			frontHeadroom: '41.1"',
			rearHeadroom: '39.7"',
			thirdRowHeadroom: '38.6"',
			cargoBehindThirdRow: '17.7 cu ft',
			maxCargo: '104.7 cu ft',
			frontTrunk: '11.1 cu ft',
			engine: 'Tri-Motor Electric',
			horsepower: '850+ hp',
			length: '200.8"',
			amenities: ['All-electric, 0 emissions', 'Camp Kitchen compatible', '15" center touchscreen', 'Bluetooth speakers built-in', 'OTA software updates'],
			recommendedFor: ['Eco-Friendly Rides', 'Scenic Tours', 'Corporate Sustainability', 'Tech Events']
		},
		'mercedes-s-class': {
			frontLegroom: '41.4"',
			rearLegroom: '43.8"',
			thirdRowLegroom: null,
			frontHeadroom: '42.1"',
			rearHeadroom: '39.4"',
			thirdRowHeadroom: null,
			cargoBehindThirdRow: null,
			maxCargo: '12.8 cu ft',
			frontTrunk: null,
			engine: '3.0L Turbo I6 / 4.0L Twin-Turbo V8',
			horsepower: '442–496 hp',
			length: '208.2"',
			amenities: ['Burmester 4D surround sound', 'Rear executive seats', 'MBUX Hyperscreen available', 'E-Active body control', '64-color ambient lighting'],
			recommendedFor: ['Weddings', 'Red Carpet Events', 'Executive Travel', 'Date Nights']
		}
	};

	let { params } = $props();
	const slug = params.car;

	const { data, isLoading } = useQuery(api.cars.list, {});
	const cars = $derived(data ?? []);
	const car = $derived(cars.find((c) => toSlug(c.name) === slug) ?? null);
	const specs = $derived(car ? vehicleSpecs[slug] ?? null : null);

	function objectPos(): string {
		if (!car) return 'object-center';
		const n = car.name.toLowerCase();
		if (n.includes('bmw')) return 'object-[center_75%]';
		if (n.includes('escalade')) return 'object-[center_40%]';
		if (n.includes('rivian')) return 'object-[90%_top]';
		if (n.includes('wagoneer')) return 'object-top';
		return 'object-center';
	}
</script>

<svelte:head><title>{car ? `${car.name} | SAN Transport Services` : 'Vehicle | SAN Transport Services'}</title></svelte:head>

{#if isLoading}
	<div class="bg-[#0D0D0D] min-h-screen flex items-center justify-center">
		<p class="text-[var(--gold-accent)] text-xl">Loading...</p>
	</div>
{:else if !car}
	<div class="bg-[#0D0D0D] min-h-screen flex flex-col items-center justify-center gap-4">
		<p class="text-white text-xl">Vehicle not found.</p>
		<a href={fleetUrl} class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-lg font-semibold no-underline">Back to Fleet</a>
	</div>
{:else}
	<div class="bg-[#0D0D0D] min-h-screen">
		<nav class="bg-[#0D0D0D] border-b border-[rgba(212,175,55,0.1)] px-5 py-4">
			<div class="max-w-6xl mx-auto flex justify-between items-center">
				<a href={homeUrl} class="flex items-center gap-2 no-underline">
					<img src="/logo.jpeg" alt="Logo" width={40} height={40} class="w-9 h-9 object-contain" />
					<span class="font-bold text-white text-lg">SAN <span class="text-[var(--gold-accent)]">Transport Services</span></span>
				</a>
				<a href={fleetUrl} class="inline-flex items-center gap-2 text-[var(--gold-accent)] hover:underline text-[0.95rem] no-underline">
					<ArrowLeft class="w-4 h-4" /> Back to Fleet
				</a>
			</div>
		</nav>

		<div class="max-w-6xl mx-auto py-10 px-5">
			<div class="flex flex-col md:flex-row gap-10 items-center">
				<div class="w-100 h-100 rounded-[20px] overflow-hidden border border-[rgba(212,175,55,0.2)] mx-auto md:mx-0 shrink-0 relative">
					{#if car.image}
						<img
							src={car.image}
							alt={car.name}
							class={`w-full h-full object-cover ${objectPos()}`}
						/>
					{:else}
						<div class="w-full h-full bg-gradient-to-br from-[#262626] to-[#111111] flex items-center justify-center">
							<CarIcon class="w-24 h-24 text-[var(--gold-accent)] opacity-60" />
						</div>
					{/if}
				</div>

				<div class="w-full md:w-1/2 flex flex-col gap-5">
					<div class="flex items-center gap-3">
						<h1 class="text-white text-4xl font-bold">{car.name}</h1>
						{#if car.category}
							<span class="text-[0.8rem] text-[var(--gold-accent)] border border-[var(--gold-accent)] rounded-[25px] px-3 py-1">{car.category}</span>
						{/if}
					</div>

					<p class="text-[var(--soft-gray)] text-lg leading-relaxed">{car.description}</p>

					<div class="flex gap-8 text-[var(--soft-gray)]">
						<div class="flex items-center gap-2">
							<Users class="w-5 h-5 text-[var(--gold-accent)]" />
							<span>{car.passenger_cap} Passengers</span>
						</div>
						<div class="flex items-center gap-2">
							<Luggage class="w-5 h-5 text-[var(--gold-accent)]" />
							<span>{car.luggage_cap} Bags</span>
						</div>
					</div>

					<div class="flex items-center gap-4">
						<span class="text-[0.9rem] px-3 py-1 rounded-full {car.isAvailable ? 'bg-[rgba(34,197,94,0.2)] text-green-400' : 'bg-[rgba(239,68,68,0.2)] text-red-400'}">
							{car.isAvailable ? 'Available Now' : 'Currently Unavailable'}
						</span>
					</div>

					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] p-5 border border-[rgba(212,175,55,0.2)] mt-2">
						<div class="flex flex-col gap-3">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-[var(--soft-gray)]">
									<DollarSign class="w-4 h-4 text-[var(--gold-accent)]" />
									<span>Vehicle Rate</span>
								</div>
								<span class="text-white font-bold">${car.vehicle_rate}/mile</span>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-[var(--soft-gray)]">
									<Fuel class="w-4 h-4 text-[var(--gold-accent)]" />
									<span>Fuel Surcharge</span>
								</div>
								<span class="text-white font-bold">${car.fuel_surcharge}</span>
							</div>
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2 text-[var(--soft-gray)]">
									<DollarSign class="w-4 h-4 text-[var(--gold-accent)]" />
									<span>Standard Gratuity</span>
								</div>
								<span class="text-white font-bold">{car.standard_gratuity}%</span>
							</div>
							{#if car.vin_number}
								<div class="flex items-center justify-between pt-2 border-t border-[rgba(212,175,55,0.3)]">
									<div class="flex items-center gap-2 text-[var(--soft-gray)]">
										<Hash class="w-4 h-4 text-[var(--gold-accent)]" />
										<span>VIN</span>
									</div>
									<span class="text-[var(--soft-gray)] text-[0.9rem]">{car.vin_number}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			{#if specs}
				<div class="mt-16">
					<h2 class="text-white text-3xl font-bold mb-8">
						Vehicle <span class="text-[var(--gold-accent)]">Specifications</span>
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden">
							<div class="py-5 px-6 flex flex-col gap-1">
								<h3 class="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-2 flex items-center gap-2">
									<Users class="w-4 h-4" /> Passenger Space
								</h3>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Front Legroom</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.frontLegroom}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Rear Legroom</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.rearLegroom}</span>
								</div>
								{#if specs.thirdRowLegroom}
									<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
										<span class="text-[var(--soft-gray)] text-[0.9rem]">3rd Row Legroom</span>
										<span class="text-white font-medium text-[0.9rem]">{specs.thirdRowLegroom}</span>
									</div>
								{/if}
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Front Headroom</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.frontHeadroom}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Rear Headroom</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.rearHeadroom}</span>
								</div>
								{#if specs.thirdRowHeadroom}
									<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
										<span class="text-[var(--soft-gray)] text-[0.9rem]">3rd Row Headroom</span>
										<span class="text-white font-medium text-[0.9rem]">{specs.thirdRowHeadroom}</span>
									</div>
								{/if}
							</div>
						</div>

						<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden">
							<div class="py-5 px-6 flex flex-col gap-1">
								<h3 class="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-2 flex items-center gap-2">
									<Box class="w-4 h-4" /> Cargo & Dimensions
								</h3>
								{#if specs.cargoBehindThirdRow}
									<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
										<span class="text-[var(--soft-gray)] text-[0.9rem]">Cargo (Behind 3rd Row)</span>
										<span class="text-white font-medium text-[0.9rem]">{specs.cargoBehindThirdRow}</span>
									</div>
								{/if}
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Max Cargo</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.maxCargo ?? '—'}</span>
								</div>
								{#if specs.frontTrunk}
									<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
										<span class="text-[var(--soft-gray)] text-[0.9rem]">Front Trunk (Frunk)</span>
										<span class="text-white font-medium text-[0.9rem]">{specs.frontTrunk}</span>
									</div>
								{/if}
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Vehicle Length</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.length}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Luggage Capacity</span>
									<span class="text-white font-medium text-[0.9rem]">{car.luggage_cap} bags</span>
								</div>
							</div>
						</div>

						<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden">
							<div class="py-5 px-6 flex flex-col gap-1">
								<h3 class="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-2 flex items-center gap-2">
									<Gauge class="w-4 h-4" /> Performance
								</h3>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Engine</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.engine}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Horsepower</span>
									<span class="text-white font-medium text-[0.9rem]">{specs.horsepower}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Rate per Mile</span>
									<span class="text-white font-medium text-[0.9rem]">${car.vehicle_rate}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Fuel Surcharge</span>
									<span class="text-white font-medium text-[0.9rem]">${car.fuel_surcharge}</span>
								</div>
								<div class="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
									<span class="text-[var(--soft-gray)] text-[0.9rem]">Standard Gratuity</span>
									<span class="text-white font-medium text-[0.9rem]">{car.standard_gratuity}%</span>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] mt-6 py-5 px-6">
						<h3 class="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-3 flex items-center gap-2">
							<Star class="w-4 h-4" /> Key Amenities
						</h3>
						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
							{#each specs.amenities as amenity (amenity)}
								<div class="bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-lg px-3 py-2 text-white/80 text-[0.9rem] text-center">{amenity}</div>
							{/each}
						</div>
					</div>

					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] mt-6 py-5 px-6">
						<h3 class="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-3 flex items-center gap-2">
							<MapPin class="w-4 h-4" /> Recommended For
						</h3>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
							{#each specs.recommendedFor as usecase (usecase)}
								<div class="bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-lg px-3 py-2 text-white/80 text-[0.9rem] text-center">{usecase}</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
		<Footer />
	</div>
{/if}