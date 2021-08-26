require('dotenv').config();
import { singleton } from 'tsyringe';

type EnvoirmentVariables = 'DISCORD_TOKEN';

@singleton()
export class ConfigurationService {
  get(key: EnvoirmentVariables) {
    return process.env[key];
  }
}
