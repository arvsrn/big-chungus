import clean from 'unzalgo';

/* Checks if a message is NSFW or not */
export function isBadMessage(message: string, blacklist: string[]) {
    /* Remove zalgo from the message */
    message = clean(message.toLowerCase(), {detectionThreshold: 0});

    /* Remove any letters that are repeated twice or more */
    let strippedWord = message.replace(/(.)\1{1,}/gm, "$1");

    const messageArray = message.split(" ");

    for (const word of messageArray) {
        for (const blacklistedWord of blacklist) {
            if (
                strippedWord.includes(blacklistedWord) 
                || message.includes(blacklistedWord)
            ) return true;
        }
    }

    return false;
}