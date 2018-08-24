type stateID = number

let counter: stateID = 0

function getNewId(): stateID {
    return counter++
}

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

class AFN {

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


    join(AFN2: AFN): void {
        let newInitialStateID: stateID = getNewId()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)
        this.addTransition(newInitialStateID, this.epsilonCharacter, AFN2.initialState)
        this.setInitialState(newInitialStateID)
        this.alphabeth = new Set([...this.alphabeth, ...AFN2.alphabeth])

        AFN2.states.forEach( (state, id, _) => {
            this.states.set(id, state)
        })

        let newFinalStateID: stateID = getNewId()
        this.states.forEach( (state, id, _2) => {
            if(state.isFinalState){
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        this.setFinalState(newFinalStateID)
    }

    concat(AFN2: AFN): void {
        this.alphabeth = new Set([...this.alphabeth, ...AFN2.alphabeth])

        let uniqueFinalState: stateID = 0;
        this.states.forEach( (state, id, _2) => {
            if(state.isFinalState){
                uniqueFinalState = id
                this.unsetFinalState(id)
            }
        })

        AFN2.states.forEach( (state, id, _) => {
            this.states.set(id, state)
        })

        this.states.set(uniqueFinalState, AFN2.states.get(AFN2.initialState))
        this.states.get(uniqueFinalState).id = uniqueFinalState
    }

    positiveClosure(): void {
        let newInitialStateID: stateID = getNewId()
        let newFinalStateID: stateID = getNewId()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)

        this.states.forEach( (state, id, _2) => {
            if(state.isFinalState){
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
            if(state.isFinalState)
                this.addTransition(this.initialState, this.epsilonCharacter, id)
        })
    }

    optionalClosure(): void {
        let newInitialStateID: stateID = getNewId()
        let newFinalStateID: stateID = getNewId()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)

        this.states.forEach( (state, id, _2) => {
            if(state.isFinalState){
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        
        this.addTransition(newInitialStateID, this.epsilonCharacter, newFinalStateID)
        this.setInitialState(newInitialStateID)
        this.setFinalState(newFinalStateID)
    }


    hashSet(statesIDs: Set<stateID>): string {
        return Array.from(statesIDs).sort((a, b) => a - b).join(',')
    }

    toAFD(): AFN {
        let newInitialStateID: stateID = getNewId()
        let AFD: AFN = new AFN(new Set(this.alphabeth))
        AFD.setInitialState(newInitialStateID)
        AFD.setEpsilonCharacter(this.epsilonCharacter)

        let initialSet: Set<stateID> = this.epsilonClosure(this.initialState)
        let pending: Array<Set<stateID>> = [initialSet]
        let mapeo: Map<string, stateID> = new Map()
        mapeo.set(this.hashSet(initialSet), newInitialStateID)

        for(let i = 0; i < pending.length; ++i){
            let oldStates: Set<stateID> = pending[i]
            let fromStateID: stateID = mapeo.get(this.hashSet(oldStates))
            let finalState: boolean = false

            oldStates.forEach(
                id => finalState = finalState || this.isFinalState(id)
            )
            if(finalState) AFD.setFinalState(fromStateID)

            this.alphabeth.forEach(character =>{
                let newStates: Set<stateID> = this.goToSet(oldStates, character)
                if(newStates.size > 0){
                    if(!mapeo.has(this.hashSet(newStates))){
                        pending.push(newStates)
                        mapeo.set(this.hashSet(newStates), getNewId())
                    }
                    let toStateID = mapeo.get(this.hashSet(newStates))
                    AFD.addTransition(fromStateID, character, toStateID)
                }
            })
        }

        return AFD
    }

    validateString(str: string): boolean {
        let S: Set<stateID> = this.epsilonClosure(this.initialState)
        for(let character of str)
            S = this.goToSet(S, character)
        return (new Set([...S].filter(id => this.states.get(id).isFinalState))).size > 0
    }

    clone(): AFN {
        let newCopy: AFN = new AFN(new Set(this.alphabeth))
        newCopy.setEpsilonCharacter(this.epsilonCharacter)
        let newIDS: Map<stateID, stateID> = new Map()

        this.states.forEach( (state, fromID, _2) => {
            if(!newIDS.has(fromID)) newIDS.set(fromID, getNewId())
            let newFromID: stateID = newIDS.get(fromID)
            state.transitions.forEach((toStates, character, _) => {
                toStates.forEach(toID => {
                    if(!newIDS.has(toID)) newIDS.set(toID, getNewId())
                    let newToID: stateID = newIDS.get(toID)
                    newCopy.addTransition(newFromID, character, newToID)
                })
            })
            if(state.isFinalState) newCopy.setFinalState(newFromID)
        })

        newCopy.setInitialState(newIDS.get(this.initialState))

        return newCopy
    }
}

function basicAFN(character: string): AFN {
    let basic: AFN = new AFN(new Set([character]))
    let fromStateID: stateID = getNewId()
    let toStateID: stateID = getNewId()
    basic.setInitialState(fromStateID)
    basic.addTransition(fromStateID, character, toStateID)
    basic.setFinalState(toStateID)
    return basic;
}
