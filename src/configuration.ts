import { singleton } from 'tsyringe';
import config from '../.env.json';

@singleton()
export class ConfigurationService {
  config = config;

  get(key: keyof typeof config) {
    return config[key];
  }
}
