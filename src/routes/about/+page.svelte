<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Shield, Clock, UserCheck, Car, Headphones, CheckCircle, Star, Eye, ShieldCheck } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	const homeUrl = resolve('/');
	const bookUrl = resolve('/book');

	const values = [
		{
			icon: Star,
			title: 'Our Mission',
			description: 'To provide unparalleled luxury transportation services that exceed expectations, ensuring every client experiences comfort, safety, and sophistication from pickup to destination.'
		},
		{
			icon: Eye,
			title: 'Our Vision',
			description: 'To be the most trusted and preferred luxury transportation provider, setting the standard for excellence in chauffeur services worldwide.'
		},
		{
			icon: ShieldCheck,
			title: 'Our Values',
			description: 'Excellence, integrity, reliability, and client satisfaction drive everything we do. We believe in treating every passenger like royalty.'
		}
	];

	const whyChooseUs = [
		{ icon: Shield, title: 'Unmatched Safety', description: 'Our vehicles undergo rigorous inspections and our chauffeurs are trained in advanced safety protocols.' },
		{ icon: Clock, title: 'Always On Time', description: "Punctuality is our promise. We monitor flights and traffic to ensure you're never kept waiting." },
		{ icon: UserCheck, title: 'Professional Chauffeurs', description: 'Our chauffeurs are professionally trained, licensed, and dedicated to providing exceptional service.' },
		{ icon: Car, title: 'Luxury Fleet', description: 'From executive sedans to stretch limousines, our diverse fleet caters to every need and occasion.' },
		{ icon: Headphones, title: '24/7 Support', description: 'Our dedicated support team is available around the clock to assist with any requests or changes.' },
		{ icon: CheckCircle, title: 'Fully Insured', description: 'Complete peace of mind with comprehensive insurance coverage for all passengers and vehicles.' }
	];

	const team = [
		{
			name: 'James Mitchell',
			role: 'Founder & CEO',
			description: 'With over 20 years in the transportation industry, James founded SAN Transportation Services with a vision for unmatched luxury service.'
		},
		{
			name: 'Sarah Chen',
			role: 'Operations Director',
			description: 'Sarah ensures every ride runs smoothly, overseeing fleet operations and chauffeur training programs.'
		},
		{
			name: 'Michael Torres',
			role: 'Head of Client Relations',
			description: 'Michael leads our client services team, ensuring every customer receives personalized attention.'
		},
		{
			name: 'Emily Rodriguez',
			role: 'Fleet Manager',
			description: 'Emily maintains our fleet to the highest standards, ensuring every vehicle is pristine and performance-ready.'
		}
	];

	function initials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('');
	}
</script>

<svelte:head><title>About Us | SAN Transport Services</title></svelte:head>

<div class="bg-[#0D0D0D] min-h-screen">
	<Navbar />

	<!-- Hero -->
	<section class="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
		<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
		<div class="max-w-6xl mx-auto px-5 relative z-[1]">
			<h1 class="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
				About <span class="text-[var(--gold-accent)]">Us</span>
			</h1>
			<p class="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
				Discover the story behind San Francisco&apos;s premier luxury transportation service and our commitment to excellence.
			</p>
			<div class="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] mt-4">
				<a href={homeUrl} class="hover:text-[var(--gold-accent)] transition-colors no-underline">Home</a>
				<span>/</span>
				<span class="text-[var(--gold-accent)]">About</span>
			</div>
		</div>
	</section>

	<!-- Our Story -->
	<section class="py-[100px] bg-[#0D0D0D]">
		<div class="max-w-[1400px] mx-auto px-5">
			<div class="max-w-3xl mx-auto">
				<div class="text-center mb-10">
					<span class="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-[25px] font-semibold">
						Our Story
					</span>
					<h2 class="text-white text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-playfair)]">
						Founded in <span class="text-[var(--gold-accent)]">2010</span>
					</h2>
				</div>
				<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[40px]">
					<p class="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9] mb-5">
						SAN Transportation Services began with a simple vision: to redefine luxury transportation in San Francisco. What started as a small fleet of three vehicles has grown into one of the most respected luxury transportation services in the Bay Area.
					</p>
					<p class="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9] mb-5">
						Our founder, inspired by the elegance of European chauffeur services, set out to create an experience that combines world-class comfort with impeccable reliability.
					</p>
					<p class="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9] mb-5">
						Over the years, we&apos;ve had the privilege of serving thousands of clients, from Fortune 500 executives to couples on their wedding day. Each journey has reinforced our commitment to excellence and our passion for creating memorable experiences.
					</p>
					<p class="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9]">
						Today, SAN Transportation Services stands as a testament to what happens when luxury meets dedication. We continue to invest in our fleet, our people, and our technology to ensure every ride exceeds expectations.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Mission / Vision / Values -->
	<section class="py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
		<div class="max-w-[1400px] mx-auto px-5">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-7.5">
				{#each values as v (v.title)}
					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[35px] text-center transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group">
						<div class="w-16 h-16 mx-auto mb-5 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center text-[var(--gold-accent)] transition-all duration-400 group-hover:bg-[var(--gold-accent)] group-hover:text-[#0D0D0D] group-hover:scale-110">
							<svelte:component this={v.icon} class="w-7 h-7" />
						</div>
						<h3 class="text-white text-[1.3rem] mb-3 font-semibold">{v.title}</h3>
						<p class="text-[var(--soft-gray)] leading-[1.7] text-[0.95rem]">{v.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Why Choose Us -->
	<section class="py-[100px] bg-[#0D0D0D]">
		<div class="max-w-[1400px] mx-auto px-5">
			<div class="text-center mb-12 max-w-[800px] mx-auto">
				<span class="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-[25px] font-semibold">
					Why Choose Us
				</span>
				<h2 class="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
					Why Choose <span class="text-[var(--gold-accent)]">SAN Transportation</span>
				</h2>
				<p class="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
					Experience the difference that sets us apart from the rest.
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5">
				{#each whyChooseUs as item (item.title)}
					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[35px] transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group">
						<div class="w-14 h-14 mb-5 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] rounded-full flex items-center justify-center transition-transform duration-400 group-hover:scale-110">
							<item.icon class="w-6 h-6 text-[#0D0D0D]" />
						</div>
						<h3 class="text-white text-[1.2rem] mb-2.5 font-semibold">{item.title}</h3>
						<p class="text-[var(--soft-gray)] leading-[1.7] text-[0.95rem]">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Meet Our Team -->
	<section class="py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
		<div class="max-w-[1400px] mx-auto px-5">
			<div class="text-center mb-12 max-w-[800px] mx-auto">
				<span class="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-[25px] font-semibold">
					Our Team
				</span>
				<h2 class="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
					Meet Our <span class="text-[var(--gold-accent)]">Team</span>
				</h2>
				<p class="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
					The dedicated professionals behind every exceptional journey.
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7.5">
				{#each team as member (member.name)}
					<div class="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] overflow-hidden transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group">
						<div class="h-[220px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] flex items-center justify-center">
							<div class="w-20 h-20 rounded-full bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center">
								<span class="text-[var(--gold-accent)] text-2xl font-[family-name:var(--font-playfair)] font-bold">
									{initials(member.name)}
								</span>
							</div>
						</div>
						<div class="p-[25px]">
							<h3 class="text-white text-[1.1rem] mb-1 font-semibold">{member.name}</h3>
							<p class="text-[var(--gold-accent)] text-[0.85rem] mb-3">{member.role}</p>
							<p class="text-[var(--soft-gray)] text-[0.9rem] leading-[1.6]">{member.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Banner -->
	<section class="relative py-[100px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] overflow-hidden">
		<div class="max-w-4xl mx-auto px-5 text-center relative z-[1]">
			<h2 class="text-white text-[clamp(2rem,4vw,3rem)] mb-5 font-[family-name:var(--font-playfair)]">
				Ready to Experience the <span class="text-[var(--gold-accent)]">Difference</span>?
			</h2>
			<p class="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
				Join thousands of satisfied clients who trust SAN Transportation Services for their luxury transportation needs.
			</p>
			<a href={bookUrl} class="inline-flex items-center gap-2.5 px-11 py-[18px] text-[1.1rem] font-semibold tracking-[1px] rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-[3px] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)]">
				Book Your Ride
			</a>
		</div>
	</section>

	<Footer />
</div>