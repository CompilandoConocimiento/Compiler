export type stateID = number

export enum token {
	Error = -1,
	EOF = 0,
	PlusSign = 1,
	MinusSign = 2,
	MultiplicationSign = 3,
	DivisionSign = 4,
	PowerSign = 5,
	OpenParenthesis = 6,
	CloseParenthesis = 7,
	Number = 10,
	PiConstant = 11,
	EConstant = 12,
	Sine = 20,
	Cosine = 21,
	Tangent = 22,
	Log = 23,
	Ln = 24,
	Sqrt = 25
}

export const tokenDescriptions: Map<token, string> = new Map([
	[token.Error, "Error"],
	[token.EOF, "End of String"],
	[token.PlusSign, "Plus sign"],
	[token.MinusSign, "Minus sign"],
	[token.MultiplicationSign, "Multiplication sign"],
	[token.DivisionSign, "Division sign"],
	[token.PowerSign, "Power sign"],
	[token.OpenParenthesis, "Opening parenthesis"],
	[token.CloseParenthesis, "Closing parenthesis"],
	[token.Number, "Number"],
	[token.PiConstant, "Pi Constant"],
	[token.EConstant, "Euler Constant"],
	[token.Sine, "Sine"],
	[token.Cosine, "Cosine"],
	[token.Tangent, "Tangent"],
	[token.Log, "Logarithm"],
	[token.Ln, "Natural Logarithm"],
	[token.Sqrt, "Square root"]
])

export type productionText = Array<token|string>
export interface production {
	text: productionText,
	callback: (args: Array<any>)=>any
}

export interface ParseInfo {
	lexemes: Array<string>,
	derivations: Array<node>
}