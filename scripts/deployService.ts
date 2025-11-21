import { spawn } from "child_process";
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
