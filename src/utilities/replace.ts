import { Message } from "discord.js";

function getValues(context: Message): object {
    return {
        user: context.author.tag
    }
}

/* Replaces all the variables in a message with their values */
export function replaceValues(message: string, context: Message): string {
    let values = getValues(context);

    for (const [k, v] of Object.entries(values)) {
        message = message.replace(`{${k}}`, v);
    }

    return message
}