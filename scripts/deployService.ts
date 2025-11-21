import { spawn } from "child_process";
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

function runRailwayDeploy(service: ServiceConfig): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      "up",
      "--project",
      service.railwayProject,
      "--service",
      service.railwayService,
    ];

    console.log(`\n🚀 Deploying ${service.name} (${service.id})`);
    console.log(`   Command: railway ${args.join(" ")}`);

    const child = spawn("railway", args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV ?? "production",
      },
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === null) {
        reject(new Error("Railway command terminated unexpectedly"));
        return;
      }
      console.log(`✅ Finished ${service.id} with exit code ${code}`);
      resolve(code);
    });
  });
}

export async function deployServiceById(serviceId: string): Promise<void> {
  const services = await loadServices();
  const service = services.find((entry) => entry.id === serviceId);

  if (!service) {
    console.error(`Service with id "${serviceId}" not found.`);
    console.error("Available service ids:", services.map((s) => s.id).join(", "));
    process.exitCode = 1;
    return;
  }

  try {
    const exitCode = await runRailwayDeploy(service);
    if (exitCode !== 0) {
      process.exitCode = exitCode;
    }
  } catch (error) {
    console.error(`Deployment failed for ${serviceId}:`, error);
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const serviceId = process.argv[2];
  if (!serviceId) {
    console.error("Usage: ts-node deployService.ts <serviceId>");
    process.exit(1);
  }

  await deployServiceById(serviceId);
}

main();
import * as path from "path";
import * as fs from "fs";
import { ServiceConfig } from "./types";

function loadServices(): ServiceConfig[] {
  const filePath = path.join(__dirname, "..", "infra", "services.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ServiceConfig[];
}

function deployService(serviceId: string) {
  const services = loadServices();
  const service = services.find((s) => s.id === serviceId);

  if (!service) {
    console.error(`Service "${serviceId}" not found.`);
    console.error(
      "Valid ids: " + services.map((s) => s.id).join(", ")
    );
    process.exit(1);
  }

  console.log(`\n🚀 Deploying service: ${service.name} (${service.id})`);
  console.log(
    `   Railway project: ${service.railwayProject}, service: ${service.railwayService}`
  );

  const cmd = "npx";
  const args = [
    "railway",
    "up",
    "--project",
    service.railwayProject,
    "--service",
    service.railwayService
  ];

  const child = spawn(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log(`✅ Deploy complete: ${service.id}`);
    } else {
      console.error(`❌ Deploy failed for ${service.id} (exit code ${code})`);
    }
    process.exit(code === null ? 1 : code);
  });
}

const serviceId = process.argv[2];

if (!serviceId) {
  console.error("Usage: npm run deploy:service -- <serviceId>");
  process.exit(1);
}

deployService(serviceId);
