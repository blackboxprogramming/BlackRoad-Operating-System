import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { ServiceConfig } from "./types";

function loadServices(): ServiceConfig[] {
  const filePath = path.join(__dirname, "..", "infra", "services.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ServiceConfig[];
}

function runCommand(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32"
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function deployAll() {
  const services = loadServices();

  // Fixed order so dependencies come up first
  const order = ["core", "api", "operator", "agents", "console", "web", "docs"];

  const ordered = order
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is ServiceConfig => Boolean(s));

  for (const service of ordered) {
    console.log(
      `\n===============================\nDeploying ${service.id} (${service.name})\n===============================`
    );

    const args = [
      "railway",
      "up",
      "--project",
      service.railwayProject,
      "--service",
      service.railwayService
    ];

    try {
      await runCommand("npx", args);
      console.log(`✅ Done: ${service.id}`);
    } catch (err) {
      console.error(`❌ Failed: ${service.id}`);
      console.error(String(err));
      // Keep going to try the rest
    }
  }

  console.log("\n🏁 Deployment run finished.");
}

deployAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
