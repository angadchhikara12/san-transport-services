<script lang="ts">
	import { onMount } from 'svelte';
	import { useQuery } from 'convex-svelte';
	import type { Component } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Shield, CheckCircle, Headphones, XCircle, Car, User, MapPin, Sparkles, ListChecks } from '@lucide/svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import CalendarPopover from '$lib/components/CalendarPopover.svelte';
	import TimePickerField from '$lib/components/TimePickerField.svelte';
	import type { Stop } from '$lib/components/BookingMap.svelte';
	import { api } from '../../convex/_generated/api.js';
	import { formatDate, money, formatDuration } from '$lib/utils';
	import { resolve } from '$app/paths';

	interface BookingMapProps {
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

	const homeUrl = resolve('/');
	const fleetUrl = resolve('/fleet');

	const serviceTypes = ['Airport Pickup', 'Airport Drop-off', 'Hourly Chauffeur', 'Point to Point', 'Wedding Service', 'Corporate Event', 'Special Event', 'City Tour'];
	const passengerOptions = ['1 Passenger', '2 Passengers', '3 Passengers', '4 Passengers', '5 Passengers', '6 Passengers', '7-10 Passengers', '10+ Passengers'];
	const luggageOptions = ['No Luggage', '1-2 Bags', '3-4 Bags', '5+ Bags'];
	const stepLabels = ['Trip Details', 'Vehicle', 'Personal Info', 'Review & Pay'];

	let step = $state(1);
	const { data } = useQuery(api.cars.list, {});
	const vehicles = $derived(data ?? []);

	let BookingMapComp = $state<Component<BookingMapProps> | null>(null);

	onMount(async () => {
		const mod = await import('$lib/components/BookingMap.svelte');
		BookingMapComp = mod.default;
	});

	let serviceType = $state('');
	let pickupDate = $state<Date | undefined>(undefined);
	let pickupTime = $state('');
	let pickupLocation = $state('');
	let dropoffLocation = $state('');
	let sameDropoff = $state(true);
	let stops = $state<Stop[]>([]);
	let distanceMeters = $state(0);
	let durationSeconds = $state(0);
	let nextStopId = $state(1);
	let accessible = $state(false);
	let childSeat = $state(false);
	let childSeatType = $state('');
	let childSeatCount = $state('');
	let passengers = $state('');
	let luggage = $state('');
	let specialRequests = $state('');
	let selectedVehicle = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let company = $state('');
	let roundTrip = $state(false);
	let agreeTerms = $state(false);
	let submitting = $state(false);
	let submitted = $state(false);
	let bookingCode = $state('');
	let submitError = $state('');
	let paymentSuccess = $state(false);
	let transactionId = $state('');
	let processingPayment = $state(false);
	let paymentError = $state('');

	const vehicle = $derived(vehicles.find((v) => v.name === selectedVehicle) ?? null);
	const vehicleRate = $derived(vehicle?.vehicle_rate ?? '3.50');

	const rate = $derived(parseFloat(vehicleRate) || 0);
	const distMiles = $derived(distanceMeters / 1609.344);
	const mileageCost = $derived(rate * distMiles);
	const fuelPct = $derived(parseFloat(vehicle?.fuel_surcharge ?? '10'));
	const gratuityPct = $derived(parseFloat(vehicle?.standard_gratuity ?? '18'));
	const fuelSurcharge = $derived((mileageCost * fuelPct) / 100);
	const gratuity = $derived((mileageCost * gratuityPct) / 100);
	const totalQuote = $derived(mileageCost + fuelSurcharge + gratuity);
	const priceRows = $derived([
		['Distance', distanceMeters ? `${distMiles.toFixed(1)} mi` : '—'],
		['Est. Time', formatDuration(durationSeconds)],
		['Mileage Rate', `${money(rate)}/mi`],
		['Mileage Cost', money(distMiles ? mileageCost : 0)],
		[`Fuel Surcharge (${fuelPct.toFixed(1)}%)`, money(distMiles ? fuelSurcharge : 0)],
		[`Standard Gratuity (${gratuityPct.toFixed(1)}%)`, money(distMiles ? gratuity : 0)]
	]);

	function addStop() {
		const id = nextStopId++;
		stops = [...stops, { id, address: '', lat: 0, lng: 0 }];
	}

	function removeStop(id: number) {
		stops = stops.filter((s) => s.id !== id);
	}

	function updateStop(id: number, address: string, lat: number, lng: number) {
		stops = stops.map((s) => (s.id === id ? { ...s, address, lat, lng } : s));
	}

	function toggleSameDropoff() {
		sameDropoff = !sameDropoff;
		if (!sameDropoff) {
			dropoffLocation = '';
			stops = [];
		}
	}

	function progressCircleClass(i: number): string {
		if (step > i + 1) {
			return 'bg-[var(--gold-accent)] text-white border-3 border-[var(--gold-accent)]';
		}
		if (step === i + 1) {
			return 'bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-white border-3 border-[var(--gold-accent)] shadow-[0_8px_30px_rgba(221,186,94,0.4)] scale-110';
		}
		return 'bg-[rgba(26,26,26,0.9)] border-3 border-[rgba(221,186,94,0.3)] text-[var(--soft-gray)]';
	}

	function stepTextClass(i: number): string {
		return step === i + 1 ? 'text-[var(--gold-accent)] font-semibold -translate-y-0.5' : 'text-[var(--soft-gray)]';
	}

	function vehicleCardClass(name: string): string {
		if (selectedVehicle === name) {
			return 'border-[var(--gold-accent)] bg-gradient-to-br from-[rgba(221,186,94,0.1)] to-[rgba(13,13,13,0.9)] shadow-[0_15px_40px_rgba(221,186,94,0.4)]';
		}
		return 'border-[rgba(221,186,94,0.3)] hover:border-[var(--gold-accent)] hover:shadow-[0_15px_40px_rgba(221,186,94,0.3)] hover:-translate-y-[5px]';
	}

	function canNext() {
		if (step === 1) return !!serviceType && !!pickupDate && !!pickupTime && !!pickupLocation && (sameDropoff || !!dropoffLocation) && !!passengers;
		if (step === 2) return !!selectedVehicle;
		if (step === 3) return !!firstName && !!lastName && !!email && agreeTerms;
		if (step === 4) return true;
		return true;
	}

	async function handleSubmit() {
		submitting = true;
		submitError = '';
		try {
			const dateStr = pickupDate
				? `${pickupDate.getFullYear()}-${String(pickupDate.getMonth() + 1).padStart(2, '0')}-${String(pickupDate.getDate()).padStart(2, '0')}`
				: '';
			const timeStr = pickupTime.length === 5 ? `${pickupTime}:00` : pickupTime;

			const res = await fetch('/api/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service_type: serviceType,
					pickup_date: dateStr,
					pickup_time: timeStr,
					pickup_location: pickupLocation,
					dropoff_location: sameDropoff ? pickupLocation : dropoffLocation,
					passengers,
					luggage,
					special_requests: specialRequests,
					vehicle: selectedVehicle,
					first_name: firstName,
					last_name: lastName,
					email,
					phone,
					company,
					price_quote: Math.round(totalQuote * 100) / 100,
					helcim_transaction_id: transactionId
				})
			});
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Failed to submit booking');
			}
			const result = await res.json();
			bookingCode = result.booking.booking_code;
			submitted = true;
		} catch (err) {
			submitError = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}

	function loadHelcimScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (document.getElementById('helcimpayjs-script')) {
				resolve();
				return;
			}
			const script = document.createElement('script');
			script.id = 'helcimpayjs-script';
			script.src = 'https://secure.helcim.app/helcim-pay/services/start.js';
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load HelcimPay.js'));
			document.head.appendChild(script);
		});
	}

	async function initPayment() {
		paymentError = '';
		processingPayment = true;
		try {
			await loadHelcimScript();
			const res = await fetch('/api/helcim/initialize', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: Math.round(totalQuote * 100) / 100,
					currency: 'USD',
					customerName: `${firstName} ${lastName}`.trim() || 'Guest',
					customerEmail: email
				})
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || `Payment initialization failed (${res.status})`);
			}
			const data = await res.json();

			const helcimPayJsIdentifierKey = 'helcim-pay-js-' + data.checkoutToken;

			function handleHelcimEvent(event: MessageEvent) {
				if (event.data?.eventName === helcimPayJsIdentifierKey) {
					if (event.data.eventStatus === 'SUCCESS') {
						const txData = typeof event.data.eventMessage === 'string' ? JSON.parse(event.data.eventMessage) : event.data.eventMessage;
						const txId = txData?.data?.data?.transactionId || txData?.transactionId || '';
						transactionId = txId;
						paymentSuccess = true;
						paymentError = '';
						const w = window as unknown as { removeHelcimPayIframe?: () => void };
						try {
							w.removeHelcimPayIframe?.();
						} catch {
							/* ignore */
						}
					} else if (event.data.eventStatus === 'ABORTED') {
						paymentError = 'Payment was declined. Please try again.';
					} else if (event.data.eventStatus === 'HIDE') {
						if (!paymentSuccess) paymentError = 'Payment modal was closed. Please try again.';
					}
					processingPayment = false;
					window.removeEventListener('message', handleHelcimEvent);
				}
			}

			window.addEventListener('message', handleHelcimEvent);
			const w = window as unknown as { appendHelcimPayIframe?: (token: string) => void };
			try {
				w.appendHelcimPayIframe?.(data.checkoutToken);
			} catch {
				/* ignore */
			}
		} catch (err) {
			paymentError = err instanceof Error ? err.message : 'Payment initialization failed.';
			processingPayment = false;
		}
	}
</script>

<svelte:head><title>Book Your Ride | SAN Transport Services</title></svelte:head>

<div class="bg-[#0D0D0D] min-h-screen">
	<Navbar />

	<section class="relative pt-[180px] pb-[100px] bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-center">
		<div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent" />
		<div class="max-w-6xl mx-auto px-5 relative z-[1]">
			<h1 class="text-white text-[clamp(2.5rem,5vw,4rem)] mb-[15px] font-[family-name:var(--font-playfair)]">
				Book Your <span class="text-[var(--gold-accent)]">Ride</span>
			</h1>
			<p class="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
				Reserve your luxury transportation in minutes with our easy online booking system.
			</p>
			<div class="flex justify-center gap-2.5 mt-5 text-[0.9rem]">
				<a href={homeUrl} class="text-[var(--soft-gray)] hover:text-[var(--gold-accent)] transition-colors no-underline">Home</a>
				<span class="text-[var(--gold-accent)]">/</span>
				<span class="text-[var(--gold-accent)]">Booking</span>
			</div>
		</div>
	</section>

	<section class="py-10 bg-[#0D0D0D]">
		<div class="max-w-[900px] mx-auto px-5">
			<div class="bg-gradient-to-br from-[rgba(26,26,26,0.95)] to-[rgba(13,13,13,0.95)] backdrop-blur-[30px] rounded-[25px] p-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] border-2 border-[rgba(221,186,94,0.2)] relative">

				{#if submitted}
					<div class="text-center py-10">
						<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(221,186,94,0.1)] border-2 border-[var(--gold-accent)] flex items-center justify-center">
							<CheckCircle class="w-10 h-10 text-[var(--gold-accent)]" />
						</div>
						<h2 class="text-white text-[2rem] font-[family-name:var(--font-playfair)] mb-4">Booking Confirmed!</h2>
						<p class="text-[var(--soft-gray)] text-[1.05rem] max-w-[500px] mx-auto mb-3">
							Thank you, {firstName}. Your booking has been submitted successfully.
						</p>
						<p class="text-white text-[1.1rem] font-semibold mb-3">
							Booking Code: <span class="text-[var(--gold-accent)]">{bookingCode}</span>
						</p>
						<p class="text-[var(--soft-gray)] text-[0.95rem] max-w-[500px] mx-auto mb-8">
							A confirmation email will be sent to <span class="text-[var(--gold-accent)]">{email}</span>. Our team will contact you within 2 hours to confirm availability and provide a final quote.
						</p>
						<div class="flex justify-center gap-4">
<a href={homeUrl} class="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-[var(--gold-accent)] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] transition-all duration-[400ms] hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] no-underline">
							Back to Home
						</a>
						<a href={fleetUrl} class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] transition-all duration-[400ms] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] no-underline">
								View Fleet
							</a>
						</div>
					</div>
				{:else}
					<!-- Step dropdown - mobile -->
					<div class="md:hidden mb-5">
						<SelectField
							value={`Step ${step} — ${stepLabels[step - 1]}`}
							onChange={(val) => {
								const num = parseInt(val.split(' — ')[0].replace('Step ', ''));
								if (num) step = num;
							}}
							options={stepLabels.map((s, i) => `Step ${i + 1} — ${s}`)}
						/>
					</div>

					<!-- Progress bar - desktop -->
					<div class="hidden md:flex justify-between items-center mb-14 px-6 relative">
						<div class="absolute top-[24px] left-6 right-6 h-[3px] bg-gradient-to-r from-[rgba(221,186,94,0.2)] to-[rgba(221,186,94,0.1)] rounded-sm" />
						{#each stepLabels as s, i (s)}
							<div class="relative z-[2] flex flex-col items-center gap-3 transition-all duration-[400ms]">
								<div class="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[1rem] font-bold transition-all duration-[400ms] {progressCircleClass(i)}">
									{#if step > i + 1}
										<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
									{:else}
										{i + 1}
									{/if}
								</div>
								<span class="text-[0.9rem] text-center transition-all duration-[400ms] font-medium uppercase tracking-[1px] {stepTextClass(i)}">{s}</span>
							</div>
						{/each}
					</div>

					<!-- Form content -->
					<form id="bookingForm" onsubmit={(e) => e.preventDefault()}>
						<!-- Step 1: Trip Details -->
						{#if step === 1}
							<div class="animate-[fadeIn_0.5s_ease]">
								<h2 class="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
									Trip <span class="text-[var(--gold-accent)]">Details</span>
								</h2>
								<p class="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Tell us about your journey</p>

								<div class="flex flex-col gap-6">
									<!-- Service Type -->
									<div class="flex flex-col gap-2">
										<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1.5px]">Service Type *</label>
										<SelectField value={serviceType} onChange={(v) => (serviceType = v)} options={serviceTypes} placeholder="Select service type" required />
									</div>

									<!-- Date & Time row -->
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div class="flex flex-col gap-3">
											<CalendarPopover compact value={pickupDate} onChange={(d) => (pickupDate = d)} label="Pickup Date *" />
										</div>
										<div class="flex flex-col gap-3">
											<TimePickerField large value={pickupTime} onChange={(t) => (pickupTime = t)} label="Pickup Time *" />
										</div>
									</div>

									<!-- Map -->
									{#if BookingMapComp}
										<svelte:component
											this={BookingMapComp}
											pickupLocation={pickupLocation}
											dropoffLocation={dropoffLocation}
											onPickupSelect={(addr) => (pickupLocation = addr)}
											onDropoffSelect={(addr) => (dropoffLocation = addr)}
											sameDropoff={sameDropoff}
											onToggleSameDropoff={toggleSameDropoff}
											stops={stops}
											onAddStop={addStop}
											onRemoveStop={removeStop}
											onStopSelect={updateStop}
											onRouteInfo={(d, t) => {
												distanceMeters = d;
												durationSeconds = t;
											}}
										/>
									{:else}
										<div class="w-full rounded-[15px] border-2 border-[rgba(221,186,94,0.3)] bg-[rgba(13,13,13,0.8)] min-h-[400px] flex items-center justify-center text-[var(--gold-accent)] text-[0.9rem]">
											Loading map...
										</div>
									{/if}

									<!-- Accessible Vehicle Toggle -->
									<div class="flex items-center gap-4">
										<label class="flex items-center gap-4 cursor-pointer mb-0 normal-case tracking-normal font-medium text-[0.95rem] text-white">
											<svg class="w-[1.1rem] h-[1.1rem] text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/></svg>
											<span>Accessible Vehicle Needed</span>
											<button type="button" role="switch" aria-checked={accessible} onclick={() => (accessible = !accessible)} class="relative inline-block w-[50px] h-[26px] shrink-0 rounded-[26px] transition-colors duration-300 cursor-pointer border-2 {accessible ? 'bg-[var(--gold-accent)] border-[var(--gold-accent)]' : 'bg-[rgba(13,13,13,0.8)] border-[rgba(221,186,94,0.3)]'}">
												<div class="absolute h-[18px] w-[18px] left-[2px] bottom-[2px] rounded-full transition-all duration-300 {accessible ? 'translate-x-[24px] bg-[#0D0D0D]' : 'translate-x-0 bg-[var(--soft-gray)]'}" />
											</button>
										</label>
									</div>

									<!-- Child Seat -->
									<div class="flex flex-col gap-4">
										<div class="flex items-center gap-3 flex-wrap">
											<button type="button" onclick={() => (childSeat = !childSeat)} class="inline-flex items-center gap-2 px-[22px] py-2.5 rounded-full text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 border-2 {childSeat ? 'bg-[var(--gold-accent)] border-[var(--gold-accent)] text-[#0D0D0D]' : 'bg-transparent border-[var(--gold-accent)] text-[var(--gold-accent)] hover:bg-[var(--gold-accent)]/10'}">
												<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
												{childSeat ? 'Remove Child Seat' : 'Add Child Seat'}
											</button>
										</div>
										{#if childSeat}
											<div class="bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-[15px] p-6 animate-[fadeIn_0.3s_ease]">
												<h4 class="text-[var(--gold-accent)] text-[0.9rem] font-semibold uppercase tracking-[1px] mb-4">Child Seat Details</h4>
												<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<div class="flex flex-col gap-2">
														<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1px]">Seat Type</label>
														<SelectField
															value={childSeatType}
															onChange={(v) => (childSeatType = v)}
															options={['Rear Facing (Infant)', 'Front Facing (Toddler)', 'Booster']}
															placeholder="Select type"
														/>
													</div>
													<div class="flex flex-col gap-2">
														<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1px]">How Many</label>
														<SelectField
															value={childSeatCount}
															onChange={(v) => (childSeatCount = v)}
															options={['1', '2']}
															placeholder="Select"
														/>
													</div>
												</div>
											</div>
										{/if}
									</div>

									<!-- Passengers & Luggage -->
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div class="flex flex-col gap-3">
											<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Number of Passengers *</label>
											<SelectField value={passengers} onChange={(v) => (passengers = v)} options={passengerOptions} placeholder="Select" required />
										</div>
										<div class="flex flex-col gap-3">
											<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Luggage Count</label>
											<SelectField value={luggage} onChange={(v) => (luggage = v)} options={luggageOptions} placeholder="No Luggage" />
										</div>
									</div>

									<!-- Special Requests -->
									<div class="flex flex-col gap-3">
										<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Special Requests</label>
										<textarea rows={3} bind:value={specialRequests} placeholder="Any special requirements or requests..." class="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] placeholder:text-white/50 placeholder:italic resize-y min-h-[120px] leading-[1.6] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
									</div>
								</div>
							</div>
						{/if}

						<!-- Step 2: Vehicle Selection -->
						{#if step === 2}
							<div class="animate-[fadeIn_0.5s_ease]">
								<h2 class="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
									Select Your <span class="text-[var(--gold-accent)]">Vehicle</span>
								</h2>
								<p class="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Choose from our luxury fleet</p>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-[50px]">
									{#each vehicles as v (v.name)}
										<div class="relative transition-all duration-[400ms] {!v.isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''}">
											<input type="radio" id={v.name} name="vehicle" value={v.name} bind:group={selectedVehicle} disabled={!v.isAvailable} class="absolute opacity-0" />
											<label
												for={v.name}
												class="block bg-gradient-to-br from-[rgba(26,26,26,0.9)] to-[rgba(13,13,13,0.9)] border-2 rounded-[25px] p-[35px] cursor-pointer transition-all duration-[400ms] relative overflow-hidden backdrop-blur-[15px] {vehicleCardClass(v.name)} {!v.isAvailable ? 'cursor-not-allowed' : ''}"
											>
												<div class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold-accent)] via-[var(--gold-light)] to-[var(--gold-accent)] transition-transform duration-[400ms] {selectedVehicle === v.name ? 'scale-x-100' : 'scale-x-0'}" />

												{#if v.image}
													<div class="w-full h-[200px] rounded-[15px] overflow-hidden mb-5 relative">
														<img
															src={v.image}
															alt={v.name}
															class="w-full h-full object-cover transition-all duration-[600ms] brightness-[0.8] contrast-[1.1]"
														/>
													</div>
												{/if}

												<h4 class="text-[1.5rem] mb-[15px] font-semibold transition-colors duration-300 {selectedVehicle === v.name ? 'text-[var(--gold-accent)]' : 'text-white'}">{v.name}</h4>
												<div class="flex gap-[15px] mb-[15px]">
													<span class="flex items-center gap-2 text-white/80 text-[0.9rem] bg-[rgba(221,186,94,0.15)] py-1.5 px-3 rounded-[15px] border border-[rgba(221,186,94,0.3)]">
														<svg class="w-4 h-4 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
														{v.passenger_cap} Passengers
													</span>
													<span class="flex items-center gap-2 text-white/80 text-[0.9rem] bg-[rgba(221,186,94,0.15)] py-1.5 px-3 rounded-[15px] border border-[rgba(221,186,94,0.3)]">
														<svg class="w-4 h-4 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 3h4v3h-4V3z"/></svg>
														{v.luggage_cap} Luggage
													</span>
												</div>
												<div class="text-[1.1rem] text-[var(--gold-accent)] font-bold">
													${v.vehicle_rate}/mi <span class="text-[0.75rem] font-normal text-[var(--soft-gray)] opacity-80">+ fuel surcharge</span>
												</div>
											</label>

											{#if !v.isAvailable}
												<div class="absolute top-5 right-5 bg-gradient-to-br from-[#dc3545] to-[#c82333] text-white py-2 px-4 rounded-[20px] text-[0.85rem] font-bold uppercase tracking-[1px] shadow-[0_4px_15px_rgba(220,53,69,0.4)] z-10">
													Unavailable
												</div>
											{:else if selectedVehicle === v.name}
												<div class="absolute top-5 right-5 bg-gradient-to-br from-[#28a745] to-[#218838] text-white py-2 px-4 rounded-[20px] text-[0.85rem] font-bold uppercase tracking-[1px] shadow-[0_4px_15px_rgba(40,167,69,0.4)] z-10">
													Selected
												</div>
											{:else}
												<div class="absolute top-5 right-5 bg-gradient-to-br from-[#28a745] to-[#218838] text-white py-2 px-4 rounded-[20px] text-[0.85rem] font-bold uppercase tracking-[1px] shadow-[0_4px_15px_rgba(40,167,69,0.4)] z-10">
													Available
												</div>
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Step 3: Personal Info -->
						{#if step === 3}
							<div class="animate-[fadeIn_0.5s_ease]">
								<h2 class="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
									Your <span class="text-[var(--gold-accent)]">Information</span>
								</h2>
								<p class="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Tell us about yourself</p>

								<div class="flex flex-col gap-5">
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div class="flex flex-col gap-3">
											<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">First Name *</label>
											<input required bind:value={firstName} class="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
										</div>
										<div class="flex flex-col gap-3">
											<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Last Name *</label>
											<input required bind:value={lastName} class="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
										</div>
									</div>
									<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div class="flex flex-col gap-3">
											<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Email Address *</label>
											<input required type="email" bind:value={email} class="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
										</div>
										<div class="flex flex-col gap-3">
											<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Phone Number</label>
											<input type="tel" bind:value={phone} class="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
										</div>
									</div>
									<div class="flex flex-col gap-3">
										<label class="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.95rem] uppercase tracking-[1.5px]">Company Name (Optional)</label>
										<input bind:value={company} class="w-full p-4 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] transition-all duration-[400ms] backdrop-blur-[10px] focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_5px_rgba(221,186,94,0.2)] focus:-translate-y-[3px] focus:outline-none" />
									</div>
									<div class="flex items-start gap-[15px] mb-[25px]">
										<input type="checkbox" bind:checked={roundTrip} class="w-6 h-6 mt-0.5 accent-[var(--gold-accent)] cursor-pointer" />
										<label class="cursor-pointer text-white font-normal normal-case tracking-normal leading-[1.5]">I need a round trip</label>
									</div>
									<div class="flex items-start gap-[15px] mb-[25px]">
										<input type="checkbox" bind:checked={agreeTerms} class="w-6 h-6 mt-0.5 accent-[var(--gold-accent)] cursor-pointer" />
										<label class="cursor-pointer text-white font-normal normal-case tracking-normal leading-[1.5]">
											I agree to the <span class="text-[var(--gold-accent)]">Terms &amp; Conditions</span> and <span class="text-[var(--gold-accent)]">Privacy Policy</span> *
										</label>
									</div>
								</div>
							</div>
						{/if}

						<!-- Step 4: Review & Pay -->
						{#if step === 4}
							<div class="animate-[fadeIn_0.5s_ease]">
								<h2 class="text-[1.8rem] mb-2 text-center font-[family-name:var(--font-playfair)] text-white">
									Review &amp; <span class="text-[var(--gold-accent)]">Pay</span>
								</h2>
								<p class="text-center text-[var(--soft-gray)] mb-8 text-[1rem]">Review your trip details and complete your payment</p>

								<!-- Review Summary -->
								<div class="bg-[var(--charcoal)] rounded-xl p-[30px] mb-6">
									<!-- Trip Details -->
									<div class="mb-[30px]">
										<h3 class="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
											<MapPin class="w-5 h-5" />
											Trip Details
										</h3>
										<div class="grid grid-cols-2 gap-4 text-[0.9rem]">
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Service Type</span>
												<span class="text-white font-medium">{serviceType || '-'}</span>
											</div>
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Date &amp; Time</span>
												<span class="text-white font-medium">{pickupDate ? formatDate(pickupDate) : '-'} {pickupTime}</span>
											</div>
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Pickup</span>
												<span class="text-white font-medium">{pickupLocation || '-'}</span>
											</div>
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Drop-off</span>
												<span class="text-white font-medium">{sameDropoff ? pickupLocation : dropoffLocation || '-'}</span>
											</div>
											{#each stops.filter((s) => s.address) as stop, i (stop.id)}
												<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
													<span class="text-[var(--gold-accent)]">Stop {i + 1}</span>
													<span class="text-white font-medium">{stop.address}</span>
												</div>
											{/each}
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Passengers</span>
												<span class="text-white font-medium">{passengers || '-'}</span>
											</div>
										</div>
									</div>

									<!-- Vehicle -->
									<div class="mb-[30px]">
										<h3 class="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
											<Car class="w-5 h-5" />
											Vehicle
										</h3>
										<div class="text-center py-5 bg-[rgba(212,175,55,0.1)] rounded-lg text-[var(--gold-accent)] font-semibold text-[1.1rem]">
											{selectedVehicle || '-'}
										</div>
									</div>

									<!-- Contact Information -->
									<div class="mb-[30px]">
										<h3 class="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
											<User class="w-5 h-5" />
											Contact Information
										</h3>
										<div class="grid grid-cols-2 gap-4 text-[0.9rem]">
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Name</span>
												<span class="text-white font-medium">{firstName} {lastName}</span>
											</div>
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Email</span>
												<span class="text-white font-medium">{email || '-'}</span>
											</div>
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.1)]">
												<span class="text-[var(--soft-gray)]">Phone</span>
												<span class="text-white font-medium">{phone || '-'}</span>
											</div>
										</div>
									</div>

									<!-- Extras -->
									<div class="mb-0">
										<h3 class="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.2rem] mb-5">
											<Sparkles class="w-5 h-5" />
											Extras
										</h3>
										<div class="text-[0.9rem]">
											<span class="text-[var(--soft-gray)]">Accessibility &amp; Child Seats: </span>
											<span class="text-white font-medium">
												{[accessible && 'Accessible Vehicle', childSeat && `${childSeatCount || '?'}x ${childSeatType || 'Child Seat'}`].filter(Boolean).join(', ') || 'None'}
											</span>
										</div>
									</div>
								</div>

								<!-- Price Breakdown -->
								<div class="bg-[var(--charcoal)] rounded-xl p-6 mb-6">
									<h3 class="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.1rem] mb-5 pb-3 border-b border-[rgba(212,175,55,0.2)]">
										<ListChecks class="w-5 h-5" />
										Price Breakdown
									</h3>
									<div class="flex flex-col gap-2.5 text-[0.95rem]">
										{#each priceRows as row (row[0])}
											<div class="flex justify-between py-2.5 border-b border-[rgba(212,175,55,0.08)] text-[var(--soft-gray)]">
												<span>{row[0]}</span>
												<span class="text-white">{row[1]}</span>
											</div>
										{/each}
										<div class="flex justify-between mt-2 pt-4 border-t-2 border-[var(--gold-accent)] font-bold text-[var(--gold-accent)] text-[1.15rem]">
											<span>Total</span>
											<span class="text-[1.3rem]">{money(distMiles ? totalQuote : 0)}</span>
										</div>
									</div>
								</div>

								<!-- HelcimPay.js Payment -->
								<div class="bg-[var(--charcoal)] rounded-xl p-6 mb-6">
									<h3 class="flex items-center gap-2.5 text-[var(--gold-accent)] text-[1.1rem] mb-5 pb-3 border-b border-[rgba(212,175,55,0.2)]">
										<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
										Secure Payment
									</h3>
									{#if paymentSuccess}
										<div class="flex items-center gap-3 p-4 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-xl">
											<CheckCircle class="w-5 h-5 text-green-400 shrink-0" />
											<div>
												<p class="text-green-300 font-medium text-[0.95rem]">Payment Successful</p>
												<p class="text-green-300/70 text-[0.85rem]">Transaction ID: {transactionId}</p>
											</div>
										</div>
									{:else}
										<p class="text-[var(--soft-gray)] text-[0.9rem] mb-5">
											Click below to open the secure payment modal. Your card details are handled by Helcim and never touch our servers.
										</p>
										<button type="button" onclick={initPayment} disabled={processingPayment} class="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-xl text-[1rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
											{#if processingPayment}
												<div class="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
												Processing...
											{:else}
												<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
												Pay with Card
											{/if}
										</button>
									{/if}
									{#if paymentError}
										<div class="flex items-start gap-3 mt-4 p-4 bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] rounded-xl text-[0.9rem]">
											<span class="text-red-400">{paymentError}</span>
										</div>
									{/if}
								</div>

								<!-- Summary note -->
								<div class="flex items-start gap-4 p-5 bg-[rgba(212,175,55,0.05)] rounded-lg text-[var(--soft-gray)] text-[0.95rem] leading-[1.6]">
									<svg class="w-5 h-5 text-[var(--gold-accent)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
									<p>A confirmation email will be sent to your email address. Our team will contact you within 2 hours to confirm availability and provide a final quote.</p>
								</div>

								{#if submitError}
									<div class="flex items-start gap-4 p-5 bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] rounded-lg text-[0.95rem] leading-[1.6] mt-4">
										<XCircle class="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
										<span class="text-red-300">{submitError}</span>
									</div>
								{/if}
							</div>
						{/if}
					</form>

					<!-- Navigation -->
					<div class="flex justify-between items-center mt-10 pt-[30px] border-t border-[rgba(212,175,55,0.2)]">
						{#if step > 1}
							<button type="button" onclick={() => (step = step - 1)} class="inline-flex items-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-[var(--gold-accent)] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.15)] hover:-translate-y-0.5 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] hover:shadow-[0_12px_30px_rgba(221,186,94,0.3)]">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
								Back
							</button>
						{:else}
							<div />
						{/if}
						<div class="flex gap-[15px]">
							{#if step < 4}
								<button type="button" onclick={() => (step = step + 1)} disabled={!canNext()} class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] disabled:opacity-40 disabled:cursor-not-allowed">
									Continue
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
								</button>
							{:else}
								<button type="button" onclick={handleSubmit} disabled={!paymentSuccess || submitting} class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-[400ms] shadow-[0_8px_24px_rgba(221,186,94,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
									{#if submitting}
										<div class="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
										Submitting...
									{:else}
										<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
										Confirm Booking
									{/if}
								</button>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Trust Badges -->
	<section class="py-[80px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
		<div class="max-w-[1400px] mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each [
				{ icon: Shield, title: 'Secure Booking', desc: 'Your information is protected with industry-standard encryption.' },
				{ icon: CheckCircle, title: 'Instant Confirmation', desc: 'Receive immediate booking confirmation via email.' },
				{ icon: XCircle, title: 'Free Cancellation', desc: 'Cancel up to 24 hours before pickup at no charge.' },
				{ icon: Headphones, title: '24/7 Support', desc: 'Our team is available around the clock to assist you.' }
			] as badge (badge.title)}
				<div class="flex flex-col items-center text-center gap-3 bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] p-6 transition-all duration-400 hover:border-[var(--gold-accent)]">
					<div class="w-12 h-12 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] rounded-full flex items-center justify-center">
						<badge.icon class="w-5 h-5 text-[#0D0D0D]" />
					</div>
					<h4 class="text-white font-semibold text-[0.95rem]">{badge.title}</h4>
					<p class="text-[var(--soft-gray)] text-[0.85rem] leading-[1.6]">{badge.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<Footer />
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>