import { GuildMember, Permissions } from 'discord.js';

/* Returns true if a can moderate b. */
export function canModerate(a: GuildMember, b: GuildMember, permission: bigint): boolean {
    return (a.permissions.has(permission) && a.roles.highest.rawPosition > b.roles.highest.rawPosition) || a.guild.ownerId == a.id;
}