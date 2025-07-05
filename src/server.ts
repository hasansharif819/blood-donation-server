import { Server } from "http";
import app from "./app";
import config from "./config";
import { initSocket } from "./utils/socket";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
  initSocket(server);
}

main();
