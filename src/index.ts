
import { bootstrap } from "#base";
import { WhiteListManager } from "core/WhiteList.js";




await bootstrap({
  meta: import.meta,
  whenReady(client) {
    const manager = new WhiteListManager();
  
    client.WhiteListManager = manager;
  },
});
