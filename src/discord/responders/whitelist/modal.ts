import { createResponder, ResponderType } from "#base";
import { res, res as responderRes } from '#functions'; // Renomeado para evitar conflito com 'res' da variável de resultado

createResponder({
    customId: "modal/:arg",
    types: [ResponderType.ModalComponent],
    cache: "cached",
    async run(interaction, { arg }) {
      
        const { client, user } = interaction;
        const controller = client.WhiteListManager; 

        switch (arg) {
            case "allowlist": {
                const token = interaction.fields.getTextInputValue("token");
              
                const result = await controller.allowToken(user, token);
                console.log("Resultado da operação allowToken:", result);
                
              
                if (result.success) {
                     interaction.reply(
                        res.success("Token permitido com sucesso!", {ephemeral: true})
                      
                    );
                    return;
                } else {
                    interaction.reply(res.danger(result.message, {ephemeral: true}));
                  return;
                } 
               
            }
        }
            
        
    }
});