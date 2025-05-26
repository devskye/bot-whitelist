

import { bootstrap } from "#base";
import { WhiteListManager } from "core/WhiteList.js";
import mtaservice from "services/mta.client.js";




await bootstrap({
  meta: import.meta,
  whenReady(client) {
  
    const manager = new WhiteListManager(mtaservice);
  
    client.WhiteListManager = manager;
  },
});
