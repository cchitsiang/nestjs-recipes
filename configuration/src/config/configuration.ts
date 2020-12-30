import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import merge from 'lodash.merge';
import { join } from 'path';

const YAML_DEFAULT_CONFIG_FILENAME = 'default.yaml';
const YAML_CUSTOM_ENV_VARS_FILENAME = 'custom-environment-variables.yaml';

export function substituteEnvVars(config) {
  for (const key of Object.keys(config)) {
    const value = config[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      if ('__name' in value && '__format' in value) {
        if (value['__format'] === 'boolean') {
          const envValue = process.env[value['__name']];
          config[key] = envValue === 'true' || envValue === '1';
        }
      } else {
        substituteEnvVars(value);
      }
    } else if (value !== undefined) {
      config[key] = process.env[value];
    }
  }
  return config;
}

export default () => {
  const defaultConfig = yaml.load(
    readFileSync(join(__dirname, YAML_DEFAULT_CONFIG_FILENAME), 'utf8'),
  );
  const overrideConfig = yaml.load(
    readFileSync(join(__dirname, YAML_CUSTOM_ENV_VARS_FILENAME), 'utf8'),
  );
  return merge(defaultConfig, substituteEnvVars(overrideConfig));
};
