// Wrapper to regenerate and migrate database schema using drizzle-kit
// Usage: bun run scripts/generate.ts

async function run(cmd: string[], opts?: { cwd?: string }) {
  const proc = Bun.spawn(cmd, { cwd: opts?.cwd, stdout: "inherit", stderr: "inherit" });
  const code = await proc.exited;
  if (code !== 0) throw new Error(`Command failed: ${cmd.join(" ")}`);
}

async function main() {
  console.log("[generate] Running drizzle-kit generate...");
  await run(["bunx", "drizzle-kit", "generate"]);

  console.log("[generate] Running drizzle-kit migrate...");
  await run(["bunx", "drizzle-kit", "migrate"]);

  console.log("[generate] Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
