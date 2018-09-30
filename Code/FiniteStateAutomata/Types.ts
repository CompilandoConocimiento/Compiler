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
	Sqrt = 25,
	Abs = 26,
	ArcSin = 27,
	ArcCos = 28,
	ArcTan = 29,
	Symbol = 30,
	Or = 31,
	And = 32,
	PositiveClosure = 33,
	KleeneClosure = 34,
	OptionalClosure = 35
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
	[token.Sqrt, "Square root"],
	[token.Abs, "Absolute value"],
	[token.Symbol, "Symbol"],
	[token.Or, "Or"],
	[token.And, "And"],
	[token.PositiveClosure, "Positive closure"],
	[token.KleeneClosure, "Kleen closure"],
	[token.OptionalClosure, "Optional closure"]
])

export type productionText = Array<any>
export interface production {
	RHS: productionText,
	callback: (args: Array<any>)=>any
}