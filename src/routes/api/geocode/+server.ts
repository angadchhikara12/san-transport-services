import { json } from '@sveltejs/kit';

interface Suggestion {
	display_name: string;
	lat: string;
	lon: string;
}

interface AirportEntry {
	name: string;
	city: string;
	zip: string;
	lat: number;
	lon: number;
}

const CALIFORNIA_BBOX = {
	minLon: -124.482,
	minLat: 32.529,
	maxLon: -114.131,
	maxLat: 42.01
};

const CA_AIRPORTS: Record<string, AirportEntry> = {
	lax: { name: 'Los Angeles International Airport (LAX)', city: 'Los Angeles', zip: '90045', lat: 33.9416, lon: -118.4085 },
	sfo: { name: 'San Francisco International Airport (SFO)', city: 'San Francisco', zip: '94128', lat: 37.6213, lon: -122.379 },
	san: { name: 'San Diego International Airport (SAN)', city: 'San Diego', zip: '92101', lat: 32.7338, lon: -117.1933 },
	sna: { name: 'John Wayne Airport (SNA)', city: 'Santa Ana', zip: '92707', lat: 33.6757, lon: -117.8682 },
	oak: { name: 'Oakland International Airport (OAK)', city: 'Oakland', zip: '94621', lat: 37.7213, lon: -122.221 },
	smf: { name: 'Sacramento International Airport (SMF)', city: 'Sacramento', zip: '95837', lat: 38.6954, lon: -121.5906 },
	ont: { name: 'Ontario International Airport (ONT)', city: 'Ontario', zip: '91761', lat: 34.056, lon: -117.6012 },
	lgb: { name: 'Long Beach Airport (LGB)', city: 'Long Beach', zip: '90805', lat: 33.8177, lon: -118.1514 },
	sjc: { name: 'San Jose Mineta International Airport (SJC)', city: 'San Jose', zip: '95110', lat: 37.3626, lon: -121.929 },
	bur: { name: 'Hollywood Burbank Airport (BUR)', city: 'Burbank', zip: '91505', lat: 34.2007, lon: -118.3585 },
	psp: { name: 'Palm Springs International Airport (PSP)', city: 'Palm Springs', zip: '92262', lat: 33.8292, lon: -116.5066 },
	fat: { name: 'Fresno Yosemite International Airport (FAT)', city: 'Fresno', zip: '93727', lat: 36.7762, lon: -119.718 },
	sba: { name: 'Santa Barbara Airport (SBA)', city: 'Santa Barbara', zip: '93117', lat: 34.4262, lon: -119.8401 }
};

function toDisplayName(props: Record<string, unknown>): string {
	const name = typeof props.name === 'string' ? props.name : '';
	const street = typeof props.street === 'string' ? props.street : '';
	const housenumber = typeof props.housenumber === 'string' ? props.housenumber : '';
	const postcode = typeof props.postcode === 'string' ? props.postcode : '';
	const city = typeof props.city === 'string' ? props.city : '';

	const parts: string[] = [];
	const address = [housenumber, street].filter(Boolean).join(' ');
	if (address) parts.push(address);
	else if (name && name !== city) parts.push(name);
	if (city) parts.push(city);
	parts.push('CA');
	if (postcode) parts.push(postcode);
	return parts.join(', ');
}

function airportSuggestion(query: string): Suggestion[] | null {
	const key = query.trim().toLowerCase().replace(/\s+airport$/, '');
	const entry = CA_AIRPORTS[key];
	if (!entry) return null;
	return [{ display_name: `${entry.name}, ${entry.city}, CA, ${entry.zip}`, lat: String(entry.lat), lon: String(entry.lon) }];
}

export async function GET({ url }) {
	const q = url.searchParams.get('q')?.trim() ?? '';
	if (q.length < 1) return json([]);

	const airportHit = airportSuggestion(q);
	if (airportHit) return json(airportHit);

	const { minLon, minLat, maxLon, maxLat } = CALIFORNIA_BBOX;
	const apiUrl = `https://photon.komoot.io/api/?${new URLSearchParams({
		q,
		lang: 'en',
		limit: '8',
		bbox: `${minLon},${minLat},${maxLon},${maxLat}`
	})}`;
	try {
		const res = await fetch(apiUrl, {
			headers: { 'User-Agent': 'SANTransport/1.0' }
		});
		if (!res.ok) return json([]);
		const data = await res.json();
		const features: unknown[] = Array.isArray(data.features) ? data.features : [];

		const results: Suggestion[] = [];
		for (const f of features) {
			if (!f || typeof f !== 'object') continue;
			const feature = f as { properties?: Record<string, unknown>; geometry?: { coordinates?: number[] } };
			const props = feature.properties ?? {};
			const state = typeof props.state === 'string' ? props.state.toLowerCase() : '';
			if (state !== 'california') continue;
			const coords = feature.geometry?.coordinates;
			if (!Array.isArray(coords) || coords.length < 2) continue;
			const [lon, lat] = coords;
			if (typeof lon !== 'number' || typeof lat !== 'number') continue;
			results.push({
				display_name: toDisplayName(props),
				lat: String(lat),
				lon: String(lon)
			});
		}
		return json(results);
	} catch (err) {
		console.error('Photon geocode error:', err);
		return json([]);
	}
}