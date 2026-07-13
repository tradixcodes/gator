import { setUser, readConfig } from "./config.js";

function main() {
  setUser("Tradix");

  const config = readConfig();
  console.log(config);
}

main();
