import { describe, test, expect } from 'vitest'
import getPathnameTicket from './getPathnameTicket'

describe('getPathnameTicket', () => {

    const validCases = [
        'T_IC-123',
        'TIC1-123',
        'TIC-123',
        // non-standard but valid
        'TIC-0123',
        'TIC-1230',
        'tic-1230',
    ]

    const invalidCases = [
        '',
        ' tic-1230',
        ' tic-1230 ',
        'tic-1230 ',
        'abc',
        'abc-',
        '-123',
        '122',
        '0tic-33',
    ]

    test.skip.for(validCases)('parses valid "%s"', (input) => {
        const url = new URL(`/some/path/${input}/cool`, 'https://example.com')
        expect(getPathnameTicket(url)).toBe(input.toUpperCase())
    })

    test.skip.for(invalidCases)('parses invalid "%s"', (input) => {
        const url = new URL(`/some/path/${input}/cool`, 'https://example.com')
        expect(getPathnameTicket(url)).toBe(null)
    })

    const urlCases = [
        'https://example.atlassian.net/browse/TIC-123',
        'https://example.atlassian.net/browse/TIC-123#anchor',
        'https://example.atlassian.net/browse/TIC-123#anchor?query=string',
        'example.atlassian.net/browse/TIC-123',
        'custom.domain.comain/weird/path/TIC-123',
        '/browse/TIC-123',
    ]
    test.only.for(urlCases)('Parses', (urlString) => {
        const userDomain = 'foo.bar.com'

        const p = urlString.startsWith('/') || urlString.startsWith('https://') || urlString.startsWith('http://')
            ? '' : 'https://'

        const newStr = `${p}${urlString}`
        const newUserDomain = `https://${userDomain}`
        console.debug({ urlString, newStr, newUserDomain })
        const u = new URL(newStr, newUserDomain)

        console.debug(u.toString())
    })
})