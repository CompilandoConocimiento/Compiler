export type stateID = number

export const metaCharacters = {
    Digit: String.raw`\d`,
    Letter: String.raw`\w`
}

export interface StateDeterministicJSON {
    id: number,
    token?: number,
    isFinalState: boolean,
    transitions: Array<[string, number]>
}

export const getNewStateID = function() {
    let counter: stateID = 0

    return function () {return counter++}
}()

const range: (start: number, end: number, char: string) => any 
= (start, end, char) => Array.from({length: (end - start)}, (_, k) => [String.fromCharCode(k + start), char])


export class State {
    id: stateID
    token: number
    isFinalState: boolean
    transitions: Map<string, Set<stateID> >

    static specialTransitions: Map<string, string> = new Map([
        ...range(48, 57, metaCharacters.Digit),
        ...range(65, 90, metaCharacters.Letter),
        ...range(97, 122, metaCharacters.Letter)
    ])

    constructor(id: stateID) {
        this.id = id
        this.isFinalState = false
        this.token = -2
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

