export interface EssencialToken {
	readonly name: String,
	readonly description: String,
}

export interface Token extends EssencialToken {
	readonly id: Number,
}

export interface TokenItem {
	readonly description: String,
	readonly id: Number,
}

export const DefaultTokens: Array<[String, TokenItem]> =
[
    [
        "Error", 
        {
            description: "Error token",
            id: -1,
        }
    ],
    [
        "EOF", 
        {
            description: "End of File",
            id: 0,
        }
    ]
]

export const TokenEOF = 0
export const TokenError = -1

export const getNewTokenID = function() {
    let counter: number = 1

    return function () {return counter++}
}()