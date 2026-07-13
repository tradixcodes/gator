import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

// writes config object to the JSON file after setting the current_user_name field
export function setUser(username: string): void {
  const config = readConfig()
  config.currentUserName = username;
  writeConfig(config);
}

// reads the JSON file and decodes the JSON string into a new Config object
export function readConfig(): Config {
  const configPath = getConfigFilePath();
  const rawData = readFileSync(configPath, "utf-8");
  const parsed: unknown = JSON.parse(rawData);
  return validateConfig(parsed);
}

// confirms the config file path
function getConfigFilePath(): string {
  const projectRoot = dirname(__dirname);
  const configPath = join(projectRoot, ".gatorconfig.json");

  if (!existsSync(configPath)) {
    throw new Error(`Config file not found at ${configPath}`)
  }

  return configPath;
}

// write to the JSON file
function writeConfig(cfg: Config): void {
  const configPath = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const jsonString = JSON.stringify(rawConfig, null, 2); // pretty print with 2-space indent
  writeFileSync(configPath, jsonString, "utf-8");
}

// used by readConfig to validate the result of the JSON.parse
function validateConfig(rawConfig: unknown): Config {
  if (typeof rawConfig !== "object" || rawConfig == null) {
    throw new Error("Config must be a JSON object")
  }

  const config = rawConfig as Record<string, unknown>;

  if (typeof config.db_url !== "string"){
    throw new Error(`Config missing or invalid "db_url" (expected string)`);
  }
  
  if (typeof config.current_user_name !== "string"){
    throw new Error(`Config missing or invalid "current_user_name" (expected string)`);
  }

  return {
    dbUrl: config.db_url,
    currentUserName: config.current_user_name,
  };
}
