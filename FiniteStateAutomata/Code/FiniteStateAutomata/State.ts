import {stateID} from "./Types"

export class State {
    id: stateID
    token: number
    isFinalState: boolean
    transitions: Map<string, Set<stateID> >

    static specialTransitions: Map<string, string> = new Map([
        ['0', '\\d'], ['1', '\\d'], ['2', '\\d'], ['3', '\\d'], ['4', '\\d'], ['5', '\\d'], ['6', '\\d'], ['7', '\\d'], ['8', '\\d'], ['9', '\\d'],
        ['A', '\\w'], ['B', '\\w'], ['C', '\\w'], ['D', '\\w'], ['E', '\\w'], ['F', '\\w'], ['G', '\\w'], ['H', '\\w'], ['I', '\\w'], ['J', '\\w'], ['K', '\\w'], ['L', '\\w'], ['M', '\\w'], ['N', '\\w'], ['O', '\\w'], ['P', '\\w'], ['Q', '\\w'], ['R', '\\w'], ['S', '\\w'], ['T', '\\w'], ['U', '\\w'], ['V', '\\w'], ['W', '\\w'], ['X', '\\w'], ['Y', '\\w'], ['Z', '\\w'],
        ['a', '\\w'], ['b', '\\w'], ['c', '\\w'], ['d', '\\w'], ['e', '\\w'], ['f', '\\w'], ['g', '\\w'], ['h', '\\w'], ['i', '\\w'], ['j', '\\w'], ['k', '\\w'], ['l', '\\w'], ['m', '\\w'], ['n', '\\w'], ['o', '\\w'], ['p', '\\w'], ['q', '\\w'], ['r', '\\w'], ['s', '\\w'], ['t', '\\w'], ['u', '\\w'], ['v', '\\w'], ['w', '\\w'], ['x', '\\w'], ['y', '\\w'], ['z', '\\w']
    ])

    constructor(id: stateID) {
        this.id = id
        this.isFinalState = false
        this.token = -1
        this.transitions = new Map()
        this.transitions.has = function(character: string): boolean {
            return Map.prototype.has.call(this, character) ||
                (State.specialTransitions.has(character) && Map.prototype.has.call(this, State.specialTransitions.get(character)!))
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

export const getNewID = function() {
    let counter: stateID = 0

    return function () {return counter++}
}()

