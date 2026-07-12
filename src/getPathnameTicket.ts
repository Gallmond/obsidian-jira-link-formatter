

/**
 * Tickets are <project-key>-<issue number>
 * 
 * Where project key must:
 * - be upper case
 * - start with a letter
 * - contain only Modern Roman Alphabet (A-Z), numbers, and underscores
 */
const ticketRegex = /^\b[A-Z][A-Z0-9_]+-[0-9]+$/

/**
 * Returns the first regex matching part of the url path (starting at the end)
 * @see: https://stackoverflow.com/a/73914895
 */
const getPathnameTicket = (u: URL): string | null => {
    for (const part of u.pathname.toUpperCase().split('/').reverse()) {
        const match = part.match(ticketRegex)?.[0]
        if (typeof match === 'string') return match
    }

    return null
}

export default getPathnameTicket