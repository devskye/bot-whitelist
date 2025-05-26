import { GuildMember } from 'discord.js';

import { createResponder, ResponderType } from "#base";
import { res } from '#functions';

createResponder({
    customId: "modal/:arg",
    types: [ResponderType.ModalComponent], cache: "cached",
    async run(interaction,{arg}) {
        const { client,user } = interaction;
        const controller = client.WhiteListManager;
       console.log(arg);
        switch(interaction.customId.split("/")[1]){
            case"allowlist":{
                const token = interaction.fields.getTextInputValue("token");
                console.log(token);
               
                const res = await controller.allowToken(interaction,token);
                console.log("resposta",res)
                /* interaction.reply(res.success(`Token ${token} foi liberado com sucesso!`)); */
             
               
            
        }
    }
}
});