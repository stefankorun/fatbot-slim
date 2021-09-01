require('dotenv').config();
import { singleton } from 'tsyringe';

type EnvoirmentVariables =
  | 'DISCORD_TOKEN'
  | 'DISCORD_PREFIX'
  | 'YOUTUBE_API_KEY';

@singleton()
export class ConfigurationService {
  get(key: EnvoirmentVariables) {
    return process.env[key];
  }
}
