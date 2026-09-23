<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FleetSection from '$lib/components/FleetSection.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import CalendarPopover from '$lib/components/CalendarPopover.svelte';
	import TimePickerField from '$lib/components/TimePickerField.svelte';
	import SelectField from '$lib/components/SelectField.svelte';
	import {
		ArrowRight,
		BadgeCheck,
		Car,
		ChevronDown,
		CircleCheck,
		Clock,
		Plane,
		Search,
		ShieldCheck,
		Star
	} from '@lucide/svelte';
	import { resolve } from '$app/paths';

	const fleetUrl = resolve('/fleet');
	const bookUrl = resolve('/book');
	const ratingIndices = [...Array(5).keys()];

	let passengers = $state('Select Passengers');
	let date = $state<Date | undefined>(undefined);
	let time = $state('Select Time');
	let vehicleType = $state('Select Vehicle');
	let pickup = $state('');
	let dropoff = $state('');

	const testimonials = [
		{
			name: 'James Mitchell',
			role: 'CEO, Mitchell & Partners',
			quote: 'Absolutely exceptional service. Our executive team was picked up in a pristine Escalade and treated like royalty. This is the only car service we use now.',
			rating: 5
		},
		{
			name: 'Sarah Chen',
			role: 'Event Planner, Luxe Events',
			quote: 'I\'ve booked SAN Transport for over 30 weddings and every single bride and groom has been thrilled. The attention to detail and punctuality is unmatched.',
			rating: 5
		},
		{
			name: 'David Ramirez',
			role: 'Frequent Flyer',
			quote: 'After a 14-hour flight, having a chauffeur waiting with a name card and cold water made all the difference. Reliable, professional, and worth every penny.',
			rating: 5
		},
		{
			name: 'Emily Tanaka',
			role: 'Marketing Director, TechFlow Inc.',
			quote: 'We use SAN Transport for all our VIP client transfers. The BMW 7 Series is always immaculate and our clients are consistently impressed. Highly recommended.',
			rating: 5
		},
		{
			name: 'Robert Greene',
			role: 'Real Estate Agent, Berkshire Hathaway',
			quote: 'First impressions matter in real estate. Arriving to property showings in a luxury vehicle from SAN Transport has directly helped me close more deals.',
			rating: 5
		},
		{
			name: 'Maria Santos',
			role: 'Mother of Three',
			quote: 'The Navigator L was perfect for our family vacation to LAX. Plenty of room for the kids and all our luggage. The driver was patient and so friendly.',
			rating: 5
		}
	];

	const features = [
		{
			icon: BadgeCheck,
			title: 'Professional Chauffeurs',
			desc: 'Highly trained, licensed professionals dedicated to your safety and comfort.'
		},
		{
			icon: Car,
			title: 'Luxury Fleet',
			desc: 'Premium vehicles maintained to the highest standards of luxury and safety.'
		},
		{
			icon: Clock,
			title: '24/7 Availability',
			desc: 'Round-the-clock service for all your transportation needs, any time, any day.'
		},
		{
			icon: CircleCheck,
			title: 'On-Time Guarantee',
			desc: 'Punctuality is our promise. We ensure you arrive on time, every time.'
		},
		{
			icon: Plane,
			title: 'Airport Specialists',
			desc: 'Expert airport transfer services with flight tracking and meet & greet options.'
		},
		{
			icon: ShieldCheck,
			title: 'Safe & Secure',
			desc: 'Your safety is paramount. Fully insured vehicles with advanced safety features.'
		}
	];

	const stats: { target: number; suffix: string; duration?: number; label: string }[] = [
		{ target: 10, suffix: '+', label: 'Years Experience' },
		{ target: 5000, suffix: '+', label: 'Happy Clients', duration: 2500 },
		{ target: 50, suffix: '+', label: 'Luxury Vehicles' },
		{ target: 24, suffix: '/7', label: 'Customer Support' }
	];

	function handleCheckAvailability(e: SubmitEvent) {
		e.preventDefault();
		window.location.href = '/book';
	}
</script>

<svelte:head><title>SAN Transport Services | Luxury Limo & Black Car Service</title></svelte:head>

<div class="bg-[#0D0D0D] min-h-screen">
	<Navbar />

	<!-- Hero Section -->
	<section class="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">
		<div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image:url('/logo.jpeg'); background-position:center 55%" />
		<div class="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/15 via-[#0D0D0D]/20 to-[#0D0D0D]/70 z-[2]" />
		<div class="relative z-[3] text-center max-w-[700px] w-[calc(100%-160px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<div class="inline-block px-4 py-1.5 border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.65rem] tracking-[3px] uppercase mb-5 font-medium backdrop-blur-[10px] bg-[rgba(221,186,94,0.08)]">
				Luxury Transportation
			</div>
			<h1 class="text-white text-[clamp(1.8rem,4vw,3rem)] mb-3.5 leading-[1.2] font-bold tracking-[-0.5px]">
				Luxury Limo &amp; Black Car Service Across<br /><span class="text-[var(--gold-accent)]">California</span>
			</h1>
			<p class="text-[var(--soft-gray)] text-[clamp(0.85rem,1.2vw,1rem)] max-w-[480px] mx-auto mb-7 font-light leading-relaxed">
				Premium chauffeur services for airport transfers, corporate travel, weddings, and special events across California.
			</p>
			<div class="flex gap-3.5 justify-center flex-wrap items-center">
<a href={fleetUrl} class="inline-flex items-center gap-2.5 px-6 py-3 text-[0.8rem] font-semibold tracking-[1px] uppercase rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
				Explore Fleet <ArrowRight class="w-4 h-4" />
			</a>
			<a href={bookUrl} class="inline-flex items-center gap-2.5 px-6 py-3 text-[0.8rem] font-semibold tracking-[1px] uppercase rounded-lg border-2 border-[var(--gold-accent)] text-white bg-transparent no-underline transition-all duration-400 hover:bg-[var(--gold-accent)]/10">
					Book Now
				</a>
			</div>
		</div>
		<div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2">
			<span class="text-[0.7rem] text-[var(--soft-gray)] uppercase tracking-[2px]">Scroll to Explore</span>
			<ChevronDown class="w-3.5 h-3.5 text-[var(--gold-accent)] animate-bounce" />
		</div>
	</section>

	<!-- Quick Booking Section -->
	<section class="relative py-[120px] bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] overflow-hidden">
		<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-50" />
		<div class="max-w-[1400px] mx-auto px-5 relative z-[1]">
			<h2 class="text-white text-center text-[clamp(2rem,4vw,3rem)] mb-10">
				Quick <span class="text-[var(--gold-accent)]">Booking</span>
			</h2>
			<div class="bg-[rgba(26,26,26,0.95)] backdrop-blur-[30px] rounded-[25px] p-[50px] border border-[rgba(212,175,55,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative">
				<div class="absolute top-0 left-0 right-0 h-[3px] rounded-t-[25px] bg-gradient-to-r from-[var(--gold-accent)] via-[var(--gold-light)] to-[var(--gold-accent)] opacity-80" />
				<form class="grid grid-cols-1 md:grid-cols-3 gap-6" onsubmit={handleCheckAvailability}>
					<div class="flex flex-col gap-2.5">
						<label class="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Pickup Address</label>
						<input
							type="text"
							bind:value={pickup}
							placeholder="Enter pickup location"
							class="w-full h-12 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-xl text-white text-[0.95rem] px-5 py-3 outline-none placeholder:text-[var(--soft-gray)] backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)] focus:-translate-y-0.5"
						/>
					</div>
					<div class="flex flex-col gap-2.5">
						<label class="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Dropoff Address</label>
						<input
							type="text"
							bind:value={dropoff}
							placeholder="Enter dropoff location"
							class="w-full h-12 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-xl text-white text-[0.95rem] px-5 py-3 outline-none placeholder:text-[var(--soft-gray)] backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)] focus:bg-[rgba(13,13,13,0.95)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)] focus:-translate-y-0.5"
						/>
					</div>
					<div class="flex flex-col gap-2.5">
						<label class="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Date</label>
						<div class="relative h-12">
							<CalendarPopover compact value={date} onChange={(d) => (date = d)} />
						</div>
					</div>
					<div class="flex flex-col gap-2.5">
						<label class="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Time</label>
						<div class="relative h-12">
							<TimePickerField value={time} onChange={(t) => (time = t)} />
						</div>
					</div>
					<div class="flex flex-col gap-2.5">
						<label class="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Passengers</label>
						<SelectField
							compact
							value={passengers}
							onChange={(v) => (passengers = v)}
							options={['1 Passenger', '2 Passengers', '3 Passengers', '4 Passengers', '5 Passengers', '6 Passengers', '6+ Passengers']}
						/>
					</div>
					<div class="flex flex-col gap-2.5">
						<label class="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Vehicle Type</label>
						<SelectField
							compact
							value={vehicleType}
							onChange={(v) => (vehicleType = v)}
							options={['Sedan', 'SUV', 'Stretch Limo', 'Executive', 'Exclusive']}
						/>
					</div>
					<div class="col-span-full flex justify-center mt-5">
						<button type="submit" class="inline-flex items-center gap-2 min-w-[220px] h-[56px] text-[0.95rem] px-9 py-4 rounded-[6px] cursor-pointer bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] font-semibold uppercase tracking-[1px] border-none transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]">
							<Search class="w-4 h-4" /> Check Availability
						</button>
					</div>
				</form>
			</div>
		</div>
	</section>

	<!-- Why Choose Us -->
	<section class="relative py-[100px] bg-[#1A1A1A]">
		<div class="max-w-[1400px] mx-auto px-5">
			<div class="text-center mb-[60px] max-w-[800px] mx-auto">
				<span class="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-[25px] font-semibold">
					Why Choose Us
				</span>
				<h2 class="text-white text-[clamp(2.5rem,5vw,3.5rem)] mb-5">
					Experience the <span class="text-[var(--gold-accent)]">Difference</span>
				</h2>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
				{#each features as f (f.title)}
					<div class="bg-[#0D0D0D] py-10 px-7.5 rounded-xl text-center border border-[rgba(212,175,55,0.1)] transition-[all_0.4s_cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden group hover:border-[var(--gold-accent)] hover:-translate-y-2.5">
						<div class="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
						<div class="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[rgba(212,175,55,0.1)] rounded-full text-[var(--gold-accent)] transition-[all_0.4s_cubic-bezier(0.4,0,0.2,1)] group-hover:bg-[var(--gold-accent)] group-hover:text-[#0D0D0D] group-hover:scale-110">
							<svelte:component this={f.icon} class="w-8 h-8" />
						</div>
						<h3 class="text-white text-[1.4rem] mb-3.5">{f.title}</h3>
						<p class="text-[var(--soft-gray)] leading-[1.7]">{f.desc}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="relative py-20 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] overflow-hidden">
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none" />
		<div class="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 relative z-[1]">
			{#each stats as s (s.label)}
				<StatCard target={s.target} suffix={s.suffix} duration={s.duration ?? 2000} label={s.label} />
			{/each}
		</div>
	</section>

	<!-- Testimonials -->
	<section class="py-[100px] bg-[#0D0D0D]">
		<div class="max-w-[1400px] mx-auto px-5">
			<div class="text-center mb-[60px] max-w-[800px] mx-auto">
				<span class="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-[25px] font-semibold">
					Testimonials
				</span>
				<h2 class="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5">
					What Our <span class="text-[var(--gold-accent)]">Clients</span> Say
				</h2>
				<p class="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
					Trusted by hundreds of satisfied clients across California for premium transportation services.
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5">
				{#each testimonials as t (t.name)}
					<div class="bg-[#1A1A1A] p-[35px] rounded-[15px] border border-[rgba(212,175,55,0.1)] relative transition-[all_0.4s_cubic-bezier(0.4,0,0.2,1)] hover:border-[var(--gold-accent)] hover:-translate-y-1.5">
						<div class="absolute top-5 left-6 text-[4rem] text-[var(--gold-accent)] opacity-20 leading-none">&ldquo;</div>
						<p class="text-white italic leading-[1.7] mb-6 relative z-[1] text-[0.95rem]">{t.quote}</p>
						<div class="flex gap-1 mb-5">
							{#each ratingIndices as i (i)}
								<Star class="w-4 h-4 fill-[var(--gold-accent)] text-[var(--gold-accent)]" />
							{/each}
						</div>
						<div class="flex items-center gap-3.5">
							<div>
								<h4 class="text-white mb-1">{t.name}</h4>
								<p class="text-[var(--gold-accent)] text-[0.9rem]">{t.role}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Our Fleet -->
	<FleetSection />

	<!-- CTA Banner -->
	<section class="relative py-[100px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] overflow-hidden">
		<div class="max-w-4xl mx-auto px-5 text-center relative z-[1]">
			<h2 class="text-white text-[clamp(2.5rem,5vw,4rem)] mb-6 leading-[1.2]">
				Ready to Experience <span class="text-[var(--gold-accent)]">Excellence</span>?
			</h2>
			<p class="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
				Book your luxury ride today and discover the difference that premium service makes.
			</p>
			<a href={bookUrl} class="inline-flex items-center gap-2.5 px-11 py-[18px] text-[1.1rem] font-semibold tracking-[1px] rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-[3px] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)]">
				<Car class="w-5 h-5" /> Reserve Your Ride
			</a>
		</div>
	</section>

	<Footer />
</div>