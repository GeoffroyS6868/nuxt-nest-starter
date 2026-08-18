/**
 * MikroORM entity registry — single manifest for CLI and runtime.
 *
 * Layout convention:
 * - Feature barrels (`*.entities.ts`) for domains with multiple related entities.
 * - Single `*.entity.ts` files for standalone entities.
 *
 * Datetime conventions (schema `.type()`):
 * - `timestamptz` — instants (createdAt, updatedAt)
 * - `date` — calendar-only fields
 */
import { UserSchema } from "./user/domain/user.entity";

export const mikroOrmEntities = [UserSchema];
