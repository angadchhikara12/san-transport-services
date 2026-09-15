import { mutation } from "./_generated/server";

export const clearTestRows = mutation({
  args: {},
  handler: async (ctx) => {
    let deleted = 0;
    for (const table of ["bookings", "contacts"] as const) {
      const rows = await ctx.db.query(table).collect();
      for (const doc of rows) {
        if (doc.email === "test@example.com") {
          await ctx.db.delete(doc._id);
          deleted++;
        }
      }
    }
    return { deleted };
  },
});