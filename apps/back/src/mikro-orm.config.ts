import { defineConfig } from "@mikro-orm/postgresql";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { log } from "evlog";
import * as dotenv from "dotenv";
import { getDatabasePassword } from "./common/environment/secrets";
import { AppNamingStrategy } from "./common/mikro-orm/app-naming.strategy";
import { mikroOrmEntities } from "./mikro-orm.entities";

dotenv.config();

export default defineConfig({
  entities: mikroOrmEntities,
  dbName: process.env.DB_NAME || "starter",
  user: process.env.DB_USER || "starter",
  password: getDatabasePassword(),
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5433", 10),
  namingStrategy: AppNamingStrategy,
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000,
  },
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== "production",
  logger: (message: string) => log.debug({ component: "MikroORMCLI", message }),
  schemaGenerator: {
    defaultUpdateRule: "cascade",
  },
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
    glob: "!(*.d).{js,ts}",
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    emit: "ts",
  },
});
