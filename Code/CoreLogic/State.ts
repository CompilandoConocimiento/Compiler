import {tokenID, TokenDefault} from "./Token";
import { AVLMap, AVLSet, stringComp, intComp } from "../avl/avl";

export type stateID = number

export const metaCharacters = {
    Digit: String.raw`\d`,
    Letter: String.raw`\w`,
    Symbol: String.raw`\W`
}

window["metaCharacters"] = metaCharacters

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
    transitions: AVLMap<string, AVLSet<stateID>>

    static specialTransitions: AVLMap<string, string> = new AVLMap<string, string>(stringComp, [
        ...range(48, 57, metaCharacters.Digit),
        ...range(65, 90, metaCharacters.Letter),
        ...range(97, 122, metaCharacters.Letter),
        ..."°¬¿¡!$%^_~-=`{}[]:\";'<>,./ ".split("").map(w => [w, metaCharacters.Symbol])
    ])

    constructor(id: stateID) {
        this.id = id
        this.isFinalState = false
        this.token = TokenDefault
        this.transitions = new AVLMap<string, AVLSet<stateID>>(stringComp)
        this.transitions.has = function(character: string): boolean {
            return AVLMap.prototype.has.call(this, character) ||
                (
                    State.specialTransitions.has(character) && 
                    AVLMap.prototype.has.call(this, State.specialTransitions.get(character)!)
                )
        }

        this.transitions.get = function(character: string): AVLSet<stateID> {
            if (AVLMap.prototype.has.call(this, character)) return AVLMap.prototype.get.call(this, character)!
            if (State.specialTransitions.has(character)) {
                let newChar: string = State.specialTransitions.get(character)!
                return AVLMap.prototype.get.call(this, newChar)!
            }
            return new AVLSet<stateID>(intComp)
        }
    }
}

