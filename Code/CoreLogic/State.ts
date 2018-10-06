import {tokenID, TokenDefault} from "./Token";

export type stateID = number

export const metaCharacters = {
    Digit: String.raw`\d`,
    Letter: String.raw`\w`,
    Symbol: String.raw`\W`
}

export interface StateJSON {
    id: stateID,
    token?: tokenID,
    isFinalState: boolean,
    transitions: Array<[string, Array<stateID>]>
}

export const getNewStateID = function() {
    let counter: stateID = 0

    return function () {return counter++}
}()

const range: (start: number, end: number, char: string) => any 
= (start, end, char) => Array.from({length: (end - start + 1)}, (_, k) => [String.fromCharCode(k + start), char])

/*
    State Class
    Constructor of states with an id type stateID(number), a token type tokenID(number), a boolean isFinalState, 
    and a map for transcitions.
    specialTransitions is a map with the digits in utf8, and uppercase and lowercaswe characters.
*/
export class State {
    id: stateID
    token: tokenID
    isFinalState: boolean
    transitions: Map<string, Set<stateID> >

    static specialTransitions: Map<string, string> = new Map([
        ...range(48, 57, metaCharacters.Digit),
        ...range(65, 90, metaCharacters.Letter),
        ...range(97, 122, metaCharacters.Letter),
        ..."°¬¿¡!$%^_~-=`{}[]:\";'<>,./ ".split("").map(w => [w, metaCharacters.Symbol])
    ])

    constructor(id: stateID) {
        this.id = id
        this.isFinalState = false
        this.token = TokenDefault
        this.transitions = new Map()
        this.transitions.has = function(character: string): boolean {
            return Map.prototype.has.call(this, character) ||
                (
                    State.specialTransitions.has(character) && 
                    Map.prototype.has.call(this, State.specialTransitions.get(character)!)
                )
        }

        this.transitions.get = function(character: string): Set<stateID> {
            if (Map.prototype.has.call(this, character)) return Map.prototype.get.call(this, character)!
            if (State.specialTransitions.has(character)) {
                let newChar: string = State.specialTransitions.get(character)!
                return Map.prototype.get.call(this, newChar)!
            }
            return new Set()
        }
    }
}

