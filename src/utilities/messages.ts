import { Message } from "discord.js";
import clean from 'unzalgo';

function getValues(context: Message): object {
    return {
        user: context.author.tag
    }
}

/* Checks if a message is NSFW or not */
export function isBadMessage(message: string, blacklist: string[]) {
    /* Remove zalgo from the message */
    message = clean(message.toLowerCase(), {detectionThreshold: 0});

    /* Remove any letters that are repeated twice or more */
    const strippedMessage = message.replace(/(.)\1{1,}/gm, "$1");

    for (const blacklistedWord of blacklist) {
        if (
            strippedMessage.includes(blacklistedWord) 
            || message.includes(blacklistedWord)
        ) return true;
    }

    return false;
}

/* Replaces all the variables in a message with their values */
export function replaceValues(message: string, context: Message): string {
    let values = getValues(context);

    for (const [k, v] of Object.entries(values)) {
        message = message.replace(`{${k}}`, v);
    }

    return message
}
