export class MTAService {
  private mtaservice: any;

  constructor(mtaservice: any) {
    this.mtaservice = mtaservice;
  }

  async setWhitelist(userId: string, id: number): Promise<string> {
    try {
      const response = await this.mtaservice.call("cpx_discord", "setWhitelist", userId, id);
      
    /*   if (response.startsWith("ERR:")) {
        throw new Error(response);
      } */
      console.log("Response from MTA:", response);
      return response;
    } catch (error) {
      console.error("Error setting whitelist in MTA:", error);
      return "Erro ao processar a whitelist.";
    }
  }

  async removeWhitelist(id: string): Promise<string> {
    try {
      const response = await this.mtaservice.call("cpx_discord", "removeWhitelist", id);
      
      if (!response || response.startsWith("ERR:")) {
        throw new Error(response || "Erro ao remover whitelist");
      }
      
      return response;
    } catch (error) {
      console.error("Error removing whitelist from MTA:", error);
      throw error;
    }
  }
  async aprovePlayer ( userId: string, code: string){
    try {
      const response = await this.mtaservice.call("cpx_discord", "mta", userId, code)
      if (!response || response.startsWith("ERR:")) {
        throw new Error(response || "Erro ao remover whitelist");
      }
      return response;
    } catch (error) {
      console.error("Error aprove whitelist from MTA:", error);
    }
   
  }

  async removeByDiscordID(id: string): Promise<void> {
    try {
      await this.mtaservice.call("cpx_discord", "removeWhitelistByUserID", id);
    } catch (error) {
      console.error("Error removing whitelist by Discord ID:", error);
      throw error;
    }
  }
}