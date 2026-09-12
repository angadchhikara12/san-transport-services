import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("cars").withIndex("by_id_number").order("asc").collect();
  },
});