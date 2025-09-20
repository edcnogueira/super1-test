import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { schema } from "./schema";

export type DrizzleClient = NodePgDatabase<typeof schema>;
