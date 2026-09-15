<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const sections = [
		{
			title: 'Bookings',
			items: [
				'All bookings are confirmed subject to vehicle availability and chauffeur assignment upon final quote.',
				'Reservation times are estimates and may be adjusted based on traffic, weather, and other conditions beyond our control.',
				'You agree to provide accurate contact and trip information when making a reservation.'
			]
		},
		{
			title: 'Cancellations & Refunds',
			items: [
				'Cancellations made 24 hours or more before the scheduled pickup receive a full refund.',
				'Cancellations within 24 hours may incur a cancellation fee of up to the full trip amount.',
				'No-shows are billed in full. If you are delayed, please contact us so we can coordinate with your chauffeur.'
			]
		},
		{
			title: 'Fares & Payment',
			items: [
				'Final pricing is provided in your confirmation and may vary based on distance, duration, fuel surcharges, and standard gratuity.',
				'Payment is processed securely at the time of booking through our payment provider.',
				'Additional stops or significant changes to the itinerary may result in adjusted charges, quoted before pickup whenever possible.'
			]
		},
		{
			title: 'Conduct & Responsibilities',
			items: [
				'All passengers must comply with applicable laws, including seatbelt requirements and occupancy limits.',
				'Smoking, alcohol, and illegal substances are prohibited inside our vehicles.',
				'Any damage to the vehicle caused by a passenger will be billed to the customer.'
			]
		}
	];
</script>

<svelte:head><title>Terms of Service | SAN Transport Services</title></svelte:head>

<div class="bg-[#0D0D0D] min-h-screen">
	<Navbar />

	<section class="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
		<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
		<div class="max-w-6xl mx-auto px-5 relative z-[1]">
			<h1 class="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
				Terms of <span class="text-[var(--gold-accent)]">Service</span>
			</h1>
			<p class="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
				These terms govern your use of our booking services and transportation. By booking with SAN Transport Services, you agree to them.
			</p>
		</div>
	</section>

	<section class="py-[100px] bg-[#0D0D0D]">
		<div class="max-w-4xl mx-auto px-5">
			<p class="text-[var(--soft-gray)] leading-[1.8] mb-10">
				Last updated: {new Date().getFullYear()}.
			</p>
			<div class="flex flex-col gap-8">
				{#each sections as s (s.title)}
					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[35px]">
						<h2 class="text-white text-[1.4rem] mb-4 font-[family-name:var(--font-playfair)]">{s.title}</h2>
						<ul class="flex flex-col gap-3">
							{#each s.items as item (item)}
								<li class="flex items-start gap-3 text-[var(--soft-gray)] leading-[1.7]">
									<span class="text-[var(--gold-accent)] mt-1.5 shrink-0">•</span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<div class="bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[35px] mt-8">
				<h2 class="text-white text-[1.4rem] mb-3 font-[family-name:var(--font-playfair)]">Contact Us</h2>
				<p class="text-[var(--soft-gray)] leading-[1.7]">
					Questions about these terms? Reach us at
					<a href="mailto:info@sants.us" class="text-[var(--gold-accent)] hover:underline no-underline">info@sants.us</a> or
					<a href="tel:+12345679992" class="text-[var(--gold-accent)] hover:underline no-underline">+1 (234) 567-9992</a>.
				</p>
			</div>
		</div>
	</section>

	<Footer />
</div>