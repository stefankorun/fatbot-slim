import * as dotenv from 'dotenv';
dotenv.config();
import { singleton } from 'tsyringe';

type EnvironmentVariables =
  | 'NODE_ENV'
  | 'SENTRY_DNS'
  | 'DISCORD_TOKEN'
  | 'DISCORD_PREFIX'
  | 'YOUTUBE_API_KEY';

@singleton()
export class ConfigurationService {
  get(key: EnvironmentVariables) {
    return process.env[key];
  }
}
