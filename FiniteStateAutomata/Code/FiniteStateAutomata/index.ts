type stateID = number

export const getNewID = function() {
    let counter: stateID = 0

    return function () {return counter++}
}()

class State {
    id: number
    isFinalState: boolean
    transitions: Map<string, Set<number> >

    constructor(id: stateID) {
        this.id = id
        this.isFinalState = false
        this.transitions = new Map()
    }
}

export class FiniteStateAutomata {

    states: Map<stateID, State>
    alphabeth: Set<string>
    initialState: stateID
    epsilonCharacter: string

    constructor(alphabeth: Set<string>) {
        this.states = new Map()
        this.alphabeth = new Set(alphabeth)
        this.initialState = 0
        this.epsilonCharacter = '\0'
    }

    private addStateIfNotExist(id: stateID): void {
        if (!this.states.has(id))
            this.states.set(id, new State(id))
    }

    isValidCharacterOrEpsilon(character: string): boolean {
        return this.alphabeth.has(character) || this.epsilonCharacter == character
    }

    isFinalState(id: stateID): boolean {
        return this.states.has(id) && this.states.get(id).isFinalState
    }

    setInitialState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.initialState = id
    }

    setFinalState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.states.get(id).isFinalState = true
    }

    unsetFinalState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.states.get(id).isFinalState = false
    }

    setEpsilonCharacter(character: string): boolean {
        if (this.alphabeth.has(character)) return false
       
        this.epsilonCharacter = character
        return true
    }

    isAFD (): boolean {
        let isStillPossible: boolean = true
        this.states.forEach( (fromState, _1, _2) => {
            fromState.transitions.forEach((toStates, character, _) => {
                const step = character !== this.epsilonCharacter && toStates.size === 1
                isStillPossible = isStillPossible && step
            })
        })

        return isStillPossible
    }   
    
    addTransition(fromStateID: stateID, character: string, toStateID: stateID): boolean {
        if (!this.isValidCharacterOrEpsilon(character)) return false
        this.addStateIfNotExist(fromStateID)
        this.addStateIfNotExist(toStateID)

        const stateTransitions = this.states.get(fromStateID).transitions

        if (stateTransitions.has(character)) stateTransitions.get(character).add(toStateID)
        else stateTransitions.set(character, new Set([toStateID]))

        return true
    }

    epsilonClosure (id: stateID): Set<number> {
        this.addStateIfNotExist(id)

        const visited: Set<number> = new Set()
        const stack: Array<number> = [id]

        while (stack.length > 0) {
            const actualStateId = stack.pop()
            visited.add(actualStateId)

            const actualState: State = this.states.get(actualStateId)

            actualState.transitions.forEach((toStatesId, character, _) => {
                if (character == this.epsilonCharacter) {
                    toStatesId.forEach( toStateID => {
                        if (!visited.has(toStateID)) stack.push(toStateID)
                    })
                }
            })

        }
        
        return visited
    }

    epsilonClosureSet(statesIDs: Set<stateID>): Set<stateID>  {
        let visited: Set<stateID> = new Set()
        statesIDs.forEach(
            id => visited = new Set([...visited, ...this.epsilonClosure(id)])
        )
        
        return visited
    }

    move(id: stateID, character: string): Set<stateID> {
        if (!this.isValidCharacterOrEpsilon(character)) return new Set()
        this.addStateIfNotExist(id)

        const stateTransitions = this.states.get(id).transitions
        if (!stateTransitions.has(character)) return new Set()

        return new Set(stateTransitions.get(character))
    }

    moveSet(statesIDs: Set<stateID>, character: string): Set<stateID>  {
        if (!this.isValidCharacterOrEpsilon(character)) return new Set()

        let visited: Set<stateID> = new Set()
        statesIDs.forEach(
            id => visited = new Set([...visited, ...this.move(id, character)])
        )
        
        return visited
    }

    goTo(id: stateID, character: string): Set<stateID> {
        if (!this.isValidCharacterOrEpsilon(character)) return new Set()

        return this.epsilonClosureSet(this.move(id, character))
    }

    goToSet(statesIDs: Set<stateID>, character: string): Set<stateID> {
        if (!this.isValidCharacterOrEpsilon(character)) return new Set()

        return this.epsilonClosureSet(this.moveSet(statesIDs, character))
    }


    join(FSA2: FiniteStateAutomata): void {
        const newInitialStateID: stateID = getNewID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)
        this.addTransition(newInitialStateID, this.epsilonCharacter, FSA2.initialState)
        this.setInitialState(newInitialStateID)
        this.alphabeth = new Set([...this.alphabeth, ...FSA2.alphabeth])

        FSA2.states.forEach( (state, id, _) => {
            this.states.set(id, state)
        })

        const newFinalStateID: stateID = getNewID()
        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        this.setFinalState(newFinalStateID)
    }

    concat(FSA2: FiniteStateAutomata): void {
        this.alphabeth = new Set([...this.alphabeth, ...FSA2.alphabeth])

        let uniqueFinalState: stateID = 0;
        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                uniqueFinalState = id
                this.unsetFinalState(id)
            }
        })

        FSA2.states.forEach( (state, id, _) => {
            this.states.set(id, state)
        })

        this.states.set(uniqueFinalState, FSA2.states.get(FSA2.initialState))
        this.states.get(uniqueFinalState).id = uniqueFinalState
    }

    positiveClosure(): void {
        const newInitialStateID: stateID = getNewID()
        const newFinalStateID: stateID = getNewID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)

        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, this.initialState)
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })

        this.setInitialState(newInitialStateID)
        this.setFinalState(newFinalStateID)
    }

    kleeneClosure(): void {
        this.positiveClosure()

        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState)
                this.addTransition(this.initialState, this.epsilonCharacter, id)
        })
    }

    optionalClosure(): void {
        const newInitialStateID: stateID = getNewID()
        const newFinalStateID: stateID = getNewID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)

        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        
        this.addTransition(newInitialStateID, this.epsilonCharacter, newFinalStateID)
        this.setInitialState(newInitialStateID)
        this.setFinalState(newFinalStateID)
    }


    private hashSet(statesIDs: Set<stateID>): string {
        return Array.from(statesIDs).sort((a, b) => a - b).join(',')
    }

    toAFD(): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewID()
        const AFD = new FiniteStateAutomata(new Set(this.alphabeth))
        AFD.setInitialState(newInitialStateID)
        AFD.setEpsilonCharacter(this.epsilonCharacter)

        const initialSet: Set<stateID> = this.epsilonClosure(this.initialState)
        const pending: Array<Set<stateID>> = [initialSet]
        const mapping: Map<string, stateID> = new Map()
        mapping.set(this.hashSet(initialSet), newInitialStateID)

        for (let i = 0; i < pending.length; ++i) {
            const oldStates: Set<stateID> = pending[i]
            const fromStateID: stateID = mapping.get(this.hashSet(oldStates))
            let finalState: boolean = false

            oldStates.forEach(
                id => finalState = finalState || this.isFinalState(id)
            )
            if (finalState) AFD.setFinalState(fromStateID)

            this.alphabeth.forEach(character =>{
                const newStates: Set<stateID> = this.goToSet(oldStates, character)
                if (newStates.size > 0) {
                    if (!mapping.has(this.hashSet(newStates))) {
                        pending.push(newStates)
                        mapping.set(this.hashSet(newStates), getNewID())
                    }
                    const toStateID = mapping.get(this.hashSet(newStates))
                    AFD.addTransition(fromStateID, character, toStateID)
                }
            })
        }

        return AFD
    }

    validateString(testString: string): boolean {
        let PossibleStates: Set<stateID> = this.epsilonClosure(this.initialState)

        for (let i = 0; i < testString.length; i++) {
            PossibleStates = this.goToSet(PossibleStates, testString[i])
            if (PossibleStates.size === 0) return false
        }

        const finalStates = [...PossibleStates].filter(id => this.states.get(id).isFinalState)
        
        return finalStates.length > 0
    }

    clone(): FiniteStateAutomata {
        const newCopy = new FiniteStateAutomata(new Set(this.alphabeth))
        newCopy.setEpsilonCharacter(this.epsilonCharacter)
        const newIDs: Map<stateID, stateID> = new Map()

        this.states.forEach( (state, fromID, _2) => {
            if (!newIDs.has(fromID)) newIDs.set(fromID, getNewID())
            const newFromID: stateID = newIDs.get(fromID)
            state.transitions.forEach((toStates, character, _) => {
                toStates.forEach(toID => {
                    if (!newIDs.has(toID)) newIDs.set(toID, getNewID())
                    const newToID: stateID = newIDs.get(toID)
                    newCopy.addTransition(newFromID, character, newToID)
                })
            })
            if (state.isFinalState) newCopy.setFinalState(newFromID)
        })

        newCopy.setInitialState(newIDs.get(this.initialState))

        return newCopy
    }
}

export function basicFSA(character: string): FiniteStateAutomata {
    const basic = new FiniteStateAutomata(new Set([character]))
    const fromStateID: stateID = getNewID()
    const toStateID: stateID = getNewID()

    basic.setInitialState(fromStateID)
    basic.addTransition(fromStateID, character, toStateID)
    basic.setFinalState(toStateID)

    return basic
}
