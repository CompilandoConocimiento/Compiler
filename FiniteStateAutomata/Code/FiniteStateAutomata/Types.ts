export type stateID = number
export type token = number

export interface TokenInfo {
    token: token,
    position: number,
}

export type production = Array<token|string>
