import { Client } from "mtasa";

import { settings } from "#settings";

const mtaservice = new Client(
  settings.Setting["BOT-CONNECTION"].host,
  settings.Setting["BOT-CONNECTION"].port,
  settings.Setting["BOT-CONNECTION"].user,
  settings.Setting["BOT-CONNECTION"].password
);

export default mtaservice;
