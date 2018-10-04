export const TokenDefault = -2
export const TokenEOF = 0
export const TokenError = -1

export type tokenID = number

export interface Token {
	readonly name: string,
	readonly description: string,
}

export interface TokenJSON extends Token {
	readonly id: tokenID,
}

export interface TokenItem {
	readonly description: string,
	readonly id: tokenID,
}

export const DefaultTokens: Map<string, TokenItem> = new Map([
    [
        "Default", 
        {
            description: "Default token",
            id: TokenDefault,
        }
    ],
    [
        "Error", 
        {
            description: "Error token",
            id: TokenError,
        }
    ],
    [
        "EOF", 
        {
            description: "End of File",
            id: TokenEOF,
        }
    ]
])

export const getNewTokenID = function() {
    let counter: number = 1

    return function () {return counter++}
}()