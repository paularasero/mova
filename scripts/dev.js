const { spawn } = require("node:child_process");

const commands = [
  {
    name: "server",
    command: "npm",
    args: ["--prefix", "server", "run", "dev"],
  },
  {
    name: "client",
    command: "npm",
    args: ["--prefix", "client", "run", "dev"],
  },
];

const children = new Map();
let shuttingDown = false;

function run({ name, command, args }) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  children.set(name, child);

  child.on("exit", (code, signal) => {
    children.delete(name);

    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`\n${name} stopped with ${reason}. Stopping dev stack...`);
    shutdown(code ?? 1);
  });

  return child;
}

function shutdown(exitCode = 0) {
  shuttingDown = true;

  for (const child of children.values()) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(exitCode), 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

commands.forEach(run);
