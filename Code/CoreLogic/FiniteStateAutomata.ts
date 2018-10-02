import {State, getNewStateID, stateID, StateDeterministicJSON} from "./State"

export type automataToken = number
export type Automata = FiniteStateAutomata

export interface AutomataJSON {
    name: String,
    alphabeth: Array<string>,
    initialState: number,
    states: Array<StateDeterministicJSON>
}

export class FiniteStateAutomata {

    states: Map<stateID, State>
    alphabeth: Set<string>
    initialState: stateID
    epsilonCharacter: string
    name: string

    constructor(alphabeth: Set<string>) {
        this.states = new Map()
        this.alphabeth = new Set(alphabeth)
        this.initialState = 0
        this.epsilonCharacter = '\0'
        this.name = ""
    }

    getName(): string {
        return this.name
    }

    setName(name: string): void {
        this.name = name
    }

    private addStateIfNotExist(id: stateID): void {
        if (!this.states.has(id))
            this.states.set(id, new State(id))
    }

    isValidCharacterOrEpsilon(character: string): boolean {
        return (
            State.specialTransitions.has(character) || 
            this.alphabeth.has(character) || 
            this.epsilonCharacter == character
        )
    }

    isFinalState(id: stateID): boolean {
        this.addStateIfNotExist(id)
        return this.states.has(id) && this.states.get(id)!.isFinalState
    }

    setInitialState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.initialState = id
    }

    setFinalState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.states.get(id)!.isFinalState = true
    }

    unsetFinalState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.states.get(id)!.isFinalState = false
    }

    setFinalToken(automataToken: automataToken): void {
        this.states.forEach( state => {
            if (state.isFinalState) state.token = automataToken
        })
    }

    setEpsilonCharacter(character: string): boolean {
        if (this.alphabeth.has(character)) return false
       
        this.epsilonCharacter = character
        return true
    }

    isDFA (): boolean {
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

        const stateTransitions = this.states.get(fromStateID)!.transitions

        if (stateTransitions.has(character)) stateTransitions.get(character)!.add(toStateID)
        else stateTransitions.set(character, new Set([toStateID]))

        return true
    }

    epsilonClosure (id: stateID): Set<number> {
        this.addStateIfNotExist(id)

        const visited: Set<number> = new Set()
        const stack: Array<number> = [id]

        while (stack.length > 0) {
            const actualStateId: any = stack.pop()
            visited.add(actualStateId)

            const actualState: State = this.states.get(actualStateId)!

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

        const stateTransitions = this.states.get(id)!.transitions
        if (!stateTransitions.has(character)) return new Set()

        return new Set(stateTransitions.get(character)!)
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


    join(FSA2: FiniteStateAutomata): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewStateID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)
        this.addTransition(newInitialStateID, this.epsilonCharacter, FSA2.initialState)
        this.setInitialState(newInitialStateID)
        this.setName(`(${this.getName()} | ${FSA2.getName()})`)
        this.alphabeth = new Set([...this.alphabeth, ...FSA2.alphabeth])

        FSA2.states.forEach( (state, id, _) => {
            this.states.set(id, state)
        })

        const newFinalStateID: stateID = getNewStateID()
        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        this.setFinalState(newFinalStateID)

        return this
    }

    concat(FSA2: FiniteStateAutomata): FiniteStateAutomata {
        this.alphabeth = new Set([...this.alphabeth, ...FSA2.alphabeth])
        this.setName(`(${this.getName()} & ${FSA2.getName()})`)

        let uniqueFinalState: stateID = 0;
        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                uniqueFinalState = id
                this.unsetFinalState(id)
            }
        })

        FSA2.states.forEach( (state, id, _) => {
            if (id != FSA2.initialState) this.states.set(id, state)
        })

        this.states.set(uniqueFinalState, FSA2.states.get(FSA2.initialState)!)
        this.states.get(uniqueFinalState)!.id = uniqueFinalState

        return this
    }

    positiveClosure(): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewStateID()
        const newFinalStateID: stateID = getNewStateID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)
        this.setName(`(${this.getName()})+`)

        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, this.initialState)
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })

        this.setInitialState(newInitialStateID)
        this.setFinalState(newFinalStateID)
        
        return this
    }

    kleeneClosure(): FiniteStateAutomata {
        this.positiveClosure()
        this.setName(this.getName().substring(0, this.getName().length - 1) + "*")

        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState)
                this.addTransition(this.initialState, this.epsilonCharacter, id)
        })

        return this
    }

    optionalClosure(): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewStateID()
        const newFinalStateID: stateID = getNewStateID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)
        this.setName(`(${this.getName()})?`)


        this.states.forEach( (state, id, _2) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        
        this.addTransition(newInitialStateID, this.epsilonCharacter, newFinalStateID)
        this.setInitialState(newInitialStateID)
        this.setFinalState(newFinalStateID)

        return this
    }


    private hashSet(statesIDs: Set<stateID>): string {
        return Array.from(statesIDs).sort((a, b) => a - b).join(',')
    }

    toDFA(): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewStateID()
        const DFA = new FiniteStateAutomata(new Set(this.alphabeth))
        DFA.setInitialState(newInitialStateID)
        DFA.setEpsilonCharacter(this.epsilonCharacter)
        DFA.setName(`(Deterministic : ${this.getName()})`)

        const initialSet: Set<stateID> = this.epsilonClosure(this.initialState)
        const pending: Array<Set<stateID>> = [initialSet]
        const mapping: Map<string, stateID> = new Map()
        mapping.set(this.hashSet(initialSet), newInitialStateID)

        for (let i = 0; i < pending.length; ++i) {
            const oldStates: Set<stateID> = pending[i]
            const fromStateID: stateID = mapping.get(this.hashSet(oldStates))!
            let finalState: boolean = false
            let automataToken: automataToken = -1

            oldStates.forEach(
                id => {
                    finalState = finalState || this.isFinalState(id)
                    if (this.isFinalState(id)) automataToken = this.states.get(id)!.token
                }
            )
            if (finalState) {
                DFA.setFinalState(fromStateID)
                DFA.states.get(fromStateID)!.token = automataToken
            }

            this.alphabeth.forEach(character =>{
                const newStates: Set<stateID> = this.goToSet(oldStates, character)
                if (newStates.size > 0) {
                    if (!mapping.has(this.hashSet(newStates))) {
                        pending.push(newStates)
                        mapping.set(this.hashSet(newStates), getNewStateID())
                    }
                    const toStateID: stateID = mapping.get(this.hashSet(newStates))!
                    DFA.addTransition(fromStateID, character, toStateID)
                }
            })
        }

        return DFA
    }

    validateString(testString: string): boolean {
        let PossibleStates: Set<stateID> = this.epsilonClosure(this.initialState)

        for (let i = 0; i < testString.length; i++) {
            PossibleStates = this.goToSet(PossibleStates, testString[i])
            if (PossibleStates.size === 0) return false
        }

        const finalStates = [...PossibleStates].filter(id => this.states.get(id)!.isFinalState)
        
        return finalStates.length > 0
    }

    clone(): FiniteStateAutomata {
        const newCopy = new FiniteStateAutomata(new Set(this.alphabeth))
        newCopy.setEpsilonCharacter(this.epsilonCharacter)
        newCopy.setName(this.getName())
        const newIDs: Map<stateID, stateID> = new Map()

        this.states.forEach( (state, fromID, _2) => {
            if (!newIDs.has(fromID)) newIDs.set(fromID, getNewStateID())
            const newFromID: stateID = newIDs.get(fromID)!
            state.transitions.forEach((toStates, character, _) => {
                toStates.forEach(toID => {
                    if (!newIDs.has(toID)) newIDs.set(toID, getNewStateID())
                    const newToID: stateID = newIDs.get(toID)!
                    newCopy.addTransition(newFromID, character, newToID)
                })
            })
            if (state.isFinalState) {
                newCopy.setFinalState(newFromID)
                newCopy.states.get(newFromID)!.token = state.token
            }
        })

        newCopy.setInitialState(newIDs.get(this.initialState)!)

        return newCopy
    }

    static basicFSA(characters: string, hasMetaCharacters: boolean = true): FiniteStateAutomata {
        const basic = new FiniteStateAutomata(new Set())
        basic.setName(characters)
        let prevStateID: stateID = getNewStateID()
        let currStateID: stateID
        basic.setInitialState(prevStateID)

        for (let i = 0; i < characters.length; ++i) {
            let c = characters[i]
            if(hasMetaCharacters && c == '\\') c += characters[++i]
            basic.alphabeth.add(c)
            currStateID = getNewStateID()
            basic.addTransition(prevStateID, c, currStateID)
            prevStateID = currStateID
        }

        basic.setFinalState(prevStateID)

        return basic
    }

    static superJoin(FSAs: Array<FiniteStateAutomata>): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewStateID()
        const newFSA = new FiniteStateAutomata(new Set([]))
        newFSA.setInitialState(newInitialStateID)
        newFSA.setName(`Super join: [ ${FSAs.map(e => `[${e.getName()}]`).join(" | ")} ]`)

        FSAs.forEach( FSA => {
            newFSA.alphabeth = new Set([...newFSA.alphabeth, ...FSA.alphabeth])
            FSA.states.forEach( (state, id, _) => {
                newFSA.states.set(id, state)
            })
            newFSA.addTransition(newInitialStateID, newFSA.epsilonCharacter, FSA.initialState)
        })

        return newFSA
    }

    static createDFAFromJSON(JSONData: AutomataJSON): FiniteStateAutomata | null {

        try {

            const stateTranslator = new Map<number, number>(
                JSONData.states
                    .map(state => state.id)
                    .map(JSONNumber => [JSONNumber, getNewStateID()] as [number, number])
            )

            const States = JSONData.states.map( jsonState => {

                const newID = stateTranslator.get(jsonState.id)!

                const currentState: State = {
                    id: newID,
                    token: Number(jsonState.token),
                    isFinalState: jsonState.isFinalState,
                    transitions:  new Map(
                        jsonState.transitions.map(
                            (transition) => 
                            [transition[0], new Set<number>([stateTranslator.get(transition[1])!])] as [string, Set<number>]
                        )
                    )
                }

               return [newID, currentState] as [stateID, State]
            })

            const result = new FiniteStateAutomata(new Set(JSONData.alphabeth))
            result.name = JSONData.name as string
            result.epsilonCharacter = '\0'
            result.initialState = stateTranslator.get(JSONData.initialState)!,
            result.states = new Map<stateID, State>(States)

            return result
        }
        catch (e) {
            return null
        }
        return null
    }
}
