export type stateID = number

export enum token {
	PlusSign = 1,
	MinusSign = 2,
	MultiplicationSign = 3,
	DivisionSign = 4,
	OpenParenthesis = 5,
	CloseParenthesis = 6,
	Number = 10
}

export interface TokenInfo {
    token: token,
    position: number,
}

export type production = Array<token|string>
