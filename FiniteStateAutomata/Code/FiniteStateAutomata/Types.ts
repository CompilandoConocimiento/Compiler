export type stateID = number

export enum token {
	Error = -1,
	EOF = 0,
	PlusSign = 1,
	MinusSign = 2,
	MultiplicationSign = 3,
	DivisionSign = 4,
	OpenParenthesis = 5,
	CloseParenthesis = 6,
	Number = 10
}

export const tokenDescriptions: Map<token, string> = new Map([
	[token.Error, "Error"],
	[token.EOF, "End of String"],
	[token.PlusSign, "Plus sign"],
	[token.MinusSign, "Minus sign"],
	[token.MultiplicationSign, "Multiplication sign"],
	[token.DivisionSign, "Division sign"],
	[token.OpenParenthesis, "Opening parenthesis"],
	[token.CloseParenthesis, "Closing parenthesis"],
	[token.Number, "Number"]
])

export type production = Array<token|string>
