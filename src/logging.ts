import colors from "colors";

/*  Special function that can print with color.
    The text you want to color must be surrounced by curly brackets, followed by a supported color.
        Supported colors are: `r` for red, `b` for blue, `g` for green, and `p` for purple.
    
    Example: r{Error}: An error has occured.
*/
export function log(text: string) {
    let puts = text.replace("g\{([^}]+)\}", colors.green("$1"))
        .replace(/r\{([^}]+)\}/, colors.red("$1"))
        .replace(/b\{([^}]+)\}/, colors.blue("$1"))
        .replace(/p\{([^}]+)\}/, colors.magenta("$1"));

    console.log(puts);
}
