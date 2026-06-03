import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Message } from '../messages/message.entity';

const entities = [User, Ticket, Message];

/** Neon and other cloud Postgres require SSL. */
const neonSsl = {
  rejectUnauthorized: false,
};

function shouldUseSsl(config: ConfigService, host: string): boolean {
  const explicit = config.get<string>('DB_SSL');
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;
  return host.includes('neon.tech') || host.includes('neon.db');
}

function sharedOptions(config: ConfigService): Pick<
  TypeOrmModuleOptions,
  'entities' | 'autoLoadEntities' | 'synchronize'
> {
  return {
    entities,
    autoLoadEntities: true,
    synchronize: config.get('DB_SYNCHRONIZE', 'true') === 'true',
  };
}

/**
 * TypeORM config for local PostgreSQL (DB_*) or Neon via DATABASE_URL.
 */
export function buildTypeOrmConfig(
  config: ConfigService,
): TypeOrmModuleOptions {
  const databaseUrl = config.get<string>('DATABASE_URL');

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      ssl: neonSsl,
      extra: { ssl: neonSsl },
      ...sharedOptions(config),
    };
  }

  const host = config.get('DB_HOST', 'localhost');

  return {
    type: 'postgres',
    host,
    port: parseInt(config.get('DB_PORT', '5432'), 10),
    username: config.get('DB_USERNAME', 'postgres'),
    password: config.get('DB_PASSWORD', ''),
    database: config.get('DB_DATABASE', 'supporthub'),
    ...(shouldUseSsl(config, host) ? { ssl: neonSsl, extra: { ssl: neonSsl } } : {}),
    ...sharedOptions(config),
  };
}
