import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./command.js";

function main() {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);

  const args = process.argv.slice(2);

  if (args.length === 0){
    console.error("No command provided.");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  runCommand(registry, cmdName, ...cmdArgs);
}

main();
