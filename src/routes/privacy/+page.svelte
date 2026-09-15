<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const sections = [
		{
			title: 'Information We Collect',
			items: [
				'Personal details you provide when booking: name, phone number, email address, and payment information.',
				'Trip details including pickup and drop-off locations, requested times, and any special accommodations.',
				'Usage data such as pages visited and interactions with our website to help us improve your experience.'
			]
		},
		{
			title: 'How We Use Your Information',
			items: [
				'To process and confirm your bookings and provide the requested transportation services.',
				'To communicate with you regarding your reservation, including reminders and updates.',
				'To improve our services, website, and customer experience based on aggregate usage insights.',
				'To comply with legal and regulatory requirements.'
			]
		},
		{
			title: 'Information Sharing',
			items: [
				'We do not sell your personal information to third parties.',
				'Your information is shared only with our licensed chauffeurs and operational staff as necessary to fulfill your booking.',
				'Payment information is processed by our PCI-DSS compliant payment provider and is not stored by us.'
			]
		},
		{
			title: 'Data Security',
			items: [
				'We implement industry-standard safeguards to protect your personal information, including encryption of transmitted data.',
				'Access to your information is restricted to authorized personnel who need it to perform their duties.',
				'We retain booking records only as long as necessary for business and legal purposes.'
			]
		},
		{
			title: 'Your Rights',
			items: [
				'You may request access to, correction of, or deletion of your personal information at any time.',
				'You may opt out of non-essential communications by contacting us directly.',
				'To exercise any of these rights, contact our team at info@sants.us.'
			]
		}
	];
</script>

<svelte:head><title>Privacy Policy | SAN Transport Services</title></svelte:head>

<div class="bg-[#0D0D0D] min-h-screen">
	<Navbar />

	<section class="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
		<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
		<div class="max-w-6xl mx-auto px-5 relative z-[1]">
			<h1 class="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
				Privacy <span class="text-[var(--gold-accent)]">Policy</span>
			</h1>
			<p class="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
				Your privacy matters to us. This policy explains how SAN Transport Services collects, uses, and protects your information.
			</p>
		</div>
	</section>

	<section class="py-[100px] bg-[#0D0D0D]">
		<div class="max-w-4xl mx-auto px-5">
			<p class="text-[var(--soft-gray)] leading-[1.8] mb-10">
				By using our services, you agree to the practices described in this policy. Last updated: {new Date().getFullYear()}.
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
					If you have any questions about this Privacy Policy, please contact us at
					<a href="mailto:info@sants.us" class="text-[var(--gold-accent)] hover:underline no-underline">info@sants.us</a> or call
					<a href="tel:+12345679992" class="text-[var(--gold-accent)] hover:underline no-underline">+1 (234) 567-9992</a>.
				</p>
			</div>
		</div>
	</section>

	<Footer />
</div>