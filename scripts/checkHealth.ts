import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ServiceConfig } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "");
const servicesPath = path.join(rootDir, "infra", "services.json");

async function loadServices(): Promise<ServiceConfig[]> {
  const data = await fs.readFile(servicesPath, "utf-8");
  return JSON.parse(data) as ServiceConfig[];
}

async function checkServiceHealth(service: ServiceConfig): Promise<string> {
  const url = `https://${service.domain}${service.healthPath}`;
  try {
    const response = await fetch(url, { method: "GET" });
    return `[OK]   ${service.id} ${response.status}`;
  } catch (error) {
    return `[FAIL] ${service.id} ${(error as Error).message}`;
  }
}

async function main(): Promise<void> {
  const services = await loadServices();
  for (const service of services) {
    const result = await checkServiceHealth(service);
    console.log(result);
  }
}

main();
