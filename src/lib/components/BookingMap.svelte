<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { setWorkerUrl } from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
	import '@maplibre/maplibre-gl-leaflet';
	import AddressInput from './AddressInput.svelte';

	type LatLng = { lat: number; lng: number };

	export interface Stop {
		id: number;
		address: string;
		lat: number;
		lng: number;
	}

	interface Props {
		pickupLocation: string;
		dropoffLocation: string;
		onPickupSelect: (address: string, lat: number, lng: number) => void;
		onDropoffSelect: (address: string, lat: number, lng: number) => void;
		sameDropoff: boolean;
		onToggleSameDropoff: () => void;
		stops: Stop[];
		onAddStop: () => void;
		onRemoveStop: (id: number) => void;
		onStopSelect: (id: number, address: string, lat: number, lng: number) => void;
		onRouteInfo?: (distanceMeters: number, durationSeconds: number) => void;
	}

	let {
		pickupLocation,
		dropoffLocation,
		onPickupSelect,
		onDropoffSelect,
		sameDropoff,
		onToggleSameDropoff,
		stops,
		onAddStop,
		onRemoveStop,
		onStopSelect,
		onRouteInfo
	}: Props = $props();

	const GOLDEN_GATE: LatLng = { lat: 37.8199, lng: -122.4783 };

	let mapEl = $state<HTMLDivElement | null>(null);
	let mapReady = $state(false);
	let map: L.Map | null = null;

	let pickupCoords = $state<LatLng | null>(null);
	let dropoffCoords = $state<LatLng | null>(null);
	let stopCoordsMap = new SvelteMap<number, LatLng>();
	let routeCoords = $state<[number, number][]>([]);

	let markerLayer: L.LayerGroup | null = null;
	let routeLayer: L.Polyline | null = null;

	function makeGoldPinIcon(n: number) {
		return L.divIcon({
			className: '',
			html: `<div style="width:30px;height:30px;background:linear-gradient(135deg,#f9e18b,#ddba5e);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(221,186,94,0.6);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#0D0D0D">${n}</div>`,
			iconSize: [30, 30],
			iconAnchor: [15, 30],
			popupAnchor: [0, -32]
		});
	}

	const greenIcon = L.divIcon({
		className: '',
		html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#22c55e,#16a34a);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;background:#fff;border-radius:50%"></div></div>`,
		iconSize: [28, 28],
		iconAnchor: [14, 28],
		popupAnchor: [0, -30]
	});

	const redIcon = L.divIcon({
		className: '',
		html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#ef4444,#dc2626);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;background:#fff;border-radius:50%"></div></div>`,
		iconSize: [28, 28],
		iconAnchor: [14, 28],
		popupAnchor: [0, -30]
	});

	onMount(() => {
		if (!mapEl) return;
		setWorkerUrl(maplibreWorkerUrl);
		map = L.map(mapEl, {
			center: [GOLDEN_GATE.lat, GOLDEN_GATE.lng],
			zoom: 12,
			scrollWheelZoom: false
		});
		map.setView([GOLDEN_GATE.lat, GOLDEN_GATE.lng], 12);
		L.maplibreGL({
			style: 'https://tiles.openfreemap.org/styles/dark'
		}).addTo(map);
		markerLayer = L.layerGroup().addTo(map);
		mapReady = true;
		return () => {
			map?.remove();
			map = null;
			markerLayer = null;
			routeLayer = null;
			mapReady = false;
		};
	});

	$effect(() => {
		if (sameDropoff) {
			if (dropoffCoords || routeCoords.length || stopCoordsMap.size) {
				dropoffCoords = null;
				stopCoordsMap.clear();
				routeCoords = [];
			}
		}
	});

	const stopCoords = $derived(
		stops.map((s) => stopCoordsMap.get(s.id)).filter((c): c is LatLng => !!c)
	);

	$effect(() => {
		if (!mapReady || !map) return;
		const allPts: L.LatLngExpression[] = [];
		if (pickupCoords) allPts.push([pickupCoords.lat, pickupCoords.lng]);
		for (const c of stopCoords) allPts.push([c.lat, c.lng]);
		if (dropoffCoords) allPts.push([dropoffCoords.lat, dropoffCoords.lng]);
		if (allPts.length >= 2) {
			if (routeCoords.length > 0) {
				for (const c of routeCoords) allPts.push(c);
			}
			map.fitBounds(L.latLngBounds(allPts), { padding: [4, 4], animate: true });
		} else if (pickupCoords) {
			map.flyTo([pickupCoords.lat, pickupCoords.lng], 15, { duration: 1 });
		}
	});

	$effect(() => {
		if (!mapReady || !map || !markerLayer) return;
		const layer: L.LayerGroup = markerLayer;
		layer.clearLayers();
		if (pickupCoords) {
			L.marker([pickupCoords.lat, pickupCoords.lng], { icon: greenIcon })
				.bindPopup('Pickup')
				.addTo(layer);
		}
		stops.forEach((s, i) => {
			const coords = stopCoordsMap.get(s.id);
			if (!coords) return;
			L.marker([coords.lat, coords.lng], { icon: makeGoldPinIcon(i + 1) })
				.bindPopup(`Stop ${i + 1}`)
				.addTo(layer);
		});
		if (dropoffCoords) {
			L.marker([dropoffCoords.lat, dropoffCoords.lng], { icon: redIcon })
				.bindPopup('Drop-off')
				.addTo(layer);
		}
	});

	$effect(() => {
		if (!mapReady || !map) return;
		if (routeLayer) {
			map.removeLayer(routeLayer);
			routeLayer = null;
		}
		if (routeCoords.length > 0) {
			routeLayer = L.polyline(routeCoords, { color: '#ddba5e', weight: 5, opacity: 0.9 }).addTo(map);
		}
	});

	$effect(() => {
		const waypoints: LatLng[] = [];
		if (pickupCoords) waypoints.push(pickupCoords);
		for (const s of stops) {
			const coords = stopCoordsMap.get(s.id);
			if (coords) waypoints.push(coords);
		}
		if (dropoffCoords) waypoints.push(dropoffCoords);

		if (waypoints.length >= 2) {
			let cancelled = false;
			fetchRoute(waypoints).then((result) => {
				if (cancelled) return;
				if (result) {
					routeCoords = result.coords;
					onRouteInfo?.(result.distance, result.duration);
				}
			});
			return () => {
				cancelled = true;
			};
		} else {
			routeCoords = [];
			onRouteInfo?.(0, 0);
		}
	});

	async function fetchRoute(waypoints: LatLng[]): Promise<{ coords: [number, number][]; distance: number; duration: number } | null> {
		if (waypoints.length < 2) return null;
		try {
			const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
			const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
			const res = await fetch(url);
			if (!res.ok) return null;
			const data = await res.json();
			if (data.routes?.length) {
				const path: [number, number][] = data.routes[0].geometry.coordinates.map(
					(c: [number, number]) => [c[1], c[0]] as [number, number]
				);
				return { coords: path, distance: data.routes[0].distance, duration: data.routes[0].duration };
			}
		} catch {
			/* ignore */
		}
		return null;
	}

	function handlePickupSelect(address: string, lat: number, lng: number) {
		pickupCoords = { lat, lng };
		onPickupSelect(address, lat, lng);
	}

	function handleDropoffSelect(address: string, lat: number, lng: number) {
		dropoffCoords = { lat, lng };
		onDropoffSelect(address, lat, lng);
	}

	function handleStopSelect(id: number, address: string, lat: number, lng: number) {
		stopCoordsMap.set(id, { lat, lng });
		onStopSelect(id, address, lat, lng);
	}

	function handleRemoveStop(id: number) {
		stopCoordsMap.delete(id);
		onRemoveStop(id);
	}
</script>

<div class="w-full rounded-[15px] overflow-hidden border-2 border-[rgba(221,186,94,0.3)] bg-[rgba(13,13,13,0.8)]">
	<div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] min-h-[400px]">
		<div class="h-[300px] lg:h-[420px] relative">
			<div bind:this={mapEl} class="h-full w-full z-0" style="background:#0D0D0D" />
		</div>

		<div class="p-5 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-[rgba(221,186,94,0.3)] max-h-[500px] overflow-y-auto">
			<div class="flex items-center gap-2 mb-1">
				<svg class="w-4 h-4 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
				</svg>
				<span class="text-white text-[0.9rem] font-medium">Route Details</span>
			</div>

			<AddressInput
				label="Pickup Location"
				value={pickupLocation}
				onSelect={handlePickupSelect}
				iconColor="#22c55e"
				placeholder="Enter pickup address"
				required
			/>

			<button
				type="button"
				onclick={onAddStop}
				class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[rgba(221,186,94,0.3)] bg-transparent cursor-pointer transition-all duration-300 hover:border-[var(--gold-accent)] hover:bg-[rgba(221,186,94,0.05)] group"
			>
				<div class="w-5 h-5 rounded-full border-2 border-[rgba(221,186,94,0.5)] flex items-center justify-center group-hover:border-[var(--gold-accent)] transition-colors">
					<svg class="w-3 h-3 text-[rgba(221,186,94,0.5)] group-hover:text-[var(--gold-accent)] transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
						<path stroke-linecap="round" d="M12 5v14M5 12h14" />
					</svg>
				</div>
				<span class="text-[0.85rem] text-white/50 group-hover:text-white transition-colors">Add Stop</span>
			</button>

			<button
				type="button"
				onclick={onToggleSameDropoff}
				class="flex items-center gap-3 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[rgba(221,186,94,0.25)] bg-transparent cursor-pointer transition-all duration-300 hover:border-[var(--gold-accent)] hover:bg-[rgba(221,186,94,0.05)] group"
			>
				<div
					class="w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-all duration-300"
					class:bg-[var(--gold-accent)]={!sameDropoff}
					class:border-[var(--gold-accent)]={!sameDropoff}
					class:border-[rgba(221,186,94,0.4)]={sameDropoff}
					class:bg-transparent={sameDropoff}
				>
					{#if !sameDropoff}
						<svg class="w-3 h-3 text-[#0D0D0D]" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					{/if}
				</div>
				<span class="text-[0.85rem] text-white/70 group-hover:text-white transition-colors">Different dropoff location?</span>
			</button>

			{#if !sameDropoff}
				<AddressInput
					label="Drop-off Location"
					value={dropoffLocation}
					onSelect={handleDropoffSelect}
					iconColor="#ef4444"
					placeholder="Enter destination address"
					required
				/>
			{/if}

			{#each stops as stop, i (stop.id)}
				<div class="relative">
					<AddressInput
						label={`Stop ${i + 1}`}
						value={stop.address}
						onSelect={(addr, lat, lng) => handleStopSelect(stop.id, addr, lat, lng)}
						iconColor="#ddba5e"
						placeholder="Enter stop address"
						stopNumber={i + 1}
						removable
						onRemove={() => handleRemoveStop(stop.id)}
					/>
				</div>
			{/each}

			{#if pickupCoords && dropoffCoords && routeCoords.length > 0}
				<div class="bg-[rgba(221,186,94,0.08)] border border-[rgba(221,186,94,0.2)] rounded-xl p-3 mt-auto">
					<div class="flex items-center gap-2 text-[var(--gold-accent)] text-[0.85rem] font-medium">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
						</svg>
						Route mapped
						{#if stops.length > 0}<span class="text-white/50">({stops.length} stop{stops.length !== 1 ? 's' : ''})</span>{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>