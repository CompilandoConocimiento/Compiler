import {stateID} from "./Types"

export class State {
    id: stateID
    token: number
    isFinalState: boolean
    transitions: Map<string, Set<number> >

    constructor(id: stateID) {
        this.id = id
        this.isFinalState = false
        this.token = -1
        this.transitions = new Map()
    }
}

export const getNewID = function() {
    let counter: stateID = 0

    return function () {return counter++}
}()

