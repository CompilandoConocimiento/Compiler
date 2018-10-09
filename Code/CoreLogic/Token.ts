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
    ],
    ["PlusSign", {description: "Plus Sign", id: 1}],
    ["MinusSign", {description: "Minus Sign", id: 2}],
    ["MultiplicationSign", {description: "Multiplication Sign", id: 3}],
    ["DivisionSign", {description: "Division Sign", id: 4}],
    ["PowerSign", {description: "Power Sign", id: 5}],
    ["OpenParenthesis", {description: "Open Parenthesis", id: 6}],
    ["CloseParenthesis", {description: "Close Parenthesis", id: 7}],
    ["Number", {description: "Number :v", id: 8}],
    ["PiConstant", {description: "Pi Constant", id: 9}],
    ["EConstant", {description: "E Constant", id: 10}],
    ["Sine", {description: "Sine", id: 11}],
    ["Cosine", {description: "Cosine", id: 12}],
    ["Tangent", {description: "Tangent", id: 13}],
    ["ArcSin", {description: "Inverse sine", id: 14}],
    ["ArcCos", {description: "Inverse cosine", id: 15}],
    ["ArcTan", {description: "Inverse tangent", id: 16}],
    ["Log", {description: "Logarithm", id: 17}],
    ["Ln", {description: "Natural Logarithm", id: 18}],
    ["Sqrt", {description: "Square root", id: 19}],
    ["Abs", {description: "Absolute value", id: 20}],
    ["Or", {description: "Or", id: 21}],
    ["And", {description: "And", id: 22}],
    ["PositiveClosure", {description: "Positive Closure", id: 23}],
    ["KleeneClosure", {description: "Kleene Closure", id: 24}],
    ["OptionalClosure", {description: "Optional Closure", id: 25}],
    ["Character", {description: "Character", id: 26}],
    ["Arrow", {description: "Arrow", id: 27}],
    ["Semicolon", {description: "Semicolon", id: 28}],
    ["Separator", {description: "Separator", id: 29}],
    ["Symbol", {description: "Symbol", id: 30}],
    ["Space", {description: "Space", id: 31}]
])

export const getNewTokenID = function() {
    let counter: number = Math.max(...Array.from(DefaultTokens.values()).map(t => t.id)) + 1

    return function () {return counter++}
}()