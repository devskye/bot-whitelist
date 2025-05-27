import { createEmbed } from "@magicyan/discord"

export const question =(question:string)=>{

    const embead = createEmbed({
        title:"Pergunta",
        description:question
    })

    return {embeds:[embead]}

}