import { mutation } from "./_generated/server";

const fleet = [
  {
    id: 1,
    name: "Lincoln Navigator L",
    image: "https://cdn.sants.us/lincoln-navigator-l.avif",
    passenger_cap: 7,
    luggage_cap: 6,
    description:
      "Full-size luxury SUV with captain's chairs, panoramic roof, and generous space for the whole family.",
    category: "SUV",
    isAvailable: false,
    vehicle_rate: "4.20",
    standard_gratuity: "18",
    fuel_surcharge: "10",
  },
  {
    id: 2,
    name: "BMW 7 Series",
    image: "https://cdn.sants.us/bmw-7-series.jpg",
    passenger_cap: 4,
    luggage_cap: 4,
    description:
      "Executive luxury sedan featuring rear executive seating, a Sky Lounge LED roof, and Bowers & Wilkins audio.",
    category: "Luxury Sedan",
    isAvailable: false,
    vehicle_rate: "3.80",
    standard_gratuity: "18",
    fuel_surcharge: "10",
  },
  {
    id: 3,
    name: "Cadillac Escalade",
    image: "https://cdn.sants.us/cadillac-escalade.avif",
    passenger_cap: 7,
    luggage_cap: 6,
    description:
      "Iconic luxury SUV with a 38-inch curved OLED display, Super Cruise, and AKG 36-speaker audio.",
    category: "SUV",
    isAvailable: false,
    vehicle_rate: "4.00",
    standard_gratuity: "18",
    fuel_surcharge: "10",
  },
  {
    id: 4,
    name: "Jeep Wagoneer L",
    image: "https://cdn.sants.us/jeep_wagoneer-l.avif",
    passenger_cap: 7,
    luggage_cap: 7,
    description:
      "Full-size SUV with best-in-class third-row legroom, McIntosh audio, and dual panoramic sunroofs.",
    category: "SUV",
    isAvailable: true,
    vehicle_rate: "4.10",
    standard_gratuity: "18",
    fuel_surcharge: "10",
  },
  {
    id: 5,
    name: "Rivian R1S",
    image: "https://cdn.sants.us/rivian-r1s.jpg",
    passenger_cap: 7,
    luggage_cap: 6,
    description:
      "All-electric luxury SUV with tri-motor performance, frunk storage, and zero emissions.",
    category: "Electric SUV",
    isAvailable: false,
    vehicle_rate: "3.90",
    standard_gratuity: "18",
    fuel_surcharge: "10",
  },
  {
    id: 6,
    name: "Mercedes S-Class",
    image: "https://cdn.sants.us/mercedes-maybach-s-class.avif",
    passenger_cap: 4,
    luggage_cap: 3,
    description:
      "Flagship luxury sedan with Burmester 4D surround sound, rear executive seats, and E-Active body control.",
    category: "Luxury Sedan",
    isAvailable: false,
    vehicle_rate: "4.50",
    standard_gratuity: "18",
    fuel_surcharge: "10",
  },
];

export const seedCars = mutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    let patched = 0;
    for (const car of fleet) {
      const existing = await ctx.db
        .query("cars")
        .withIndex("by_id_number", (q) => q.eq("id", car.id))
        .first();
      if (existing) {
        if (existing.image !== car.image || existing.isAvailable !== car.isAvailable) {
          await ctx.db.patch(existing._id, {
            image: car.image,
            isAvailable: car.isAvailable,
          });
          patched++;
        }
      } else {
        await ctx.db.insert("cars", car);
        inserted++;
      }
    }
    return { inserted, patched };
  },
});