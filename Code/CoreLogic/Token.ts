export interface EssencialToken {
	readonly name: String,
	readonly description: String,
}

export interface Token extends EssencialToken {
	readonly id: Number,
}

export const DefaultTokens: Array<Token> = [
    {
        name: 'Error', 
        description: "Error token",
        id: -1,
    },
    {
        name: 'EOF', 
        description: "End of File",
        id: 0,
    },
]

export const getNewTokenID = function() {
    let counter: number = 1

    return function () {return counter++}
}()