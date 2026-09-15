import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    first_name: v.string(),
    last_name: v.string(),
    email: v.string(),
    phone_number: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contacts", {
      first_name: args.first_name,
      last_name: args.last_name || undefined,
      email: args.email,
      phone_number: args.phone_number || undefined,
      subject: args.subject || undefined,
      message: args.message,
      status: "new",
    });
    return { ok: true };
  },
});