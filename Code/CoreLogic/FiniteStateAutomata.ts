import {tokenID, TokenJSON, TokenDefault} from "./Token"
import {State, getNewStateID, stateID, StateJSON} from "./State"
import {Network, DataSet} from 'vis';
import { AVLSet, AVLMap, intComp, stringComp } from "../avl/avl";

export type Automata = FiniteStateAutomata

export interface AutomataJSON {
    name: string,
    alphabeth: Array<string>,
    initialState: number,
    states: Array<StateJSON>
}

export interface serializedAutomata {
    Tokens: Array<TokenJSON>
    Automatas: Array<AutomataJSON>
}
/*  @class  FiniteStateAutomata 
    
    @method constructor(): Set states, alphabeth, initialState, epsilonCharacter and name.
    @method getName(): Obtains the name of the finite State Automata
    @method setName(): Change the name of the finite state automata
    @method addStateIfNotExist(): Adds a new state
*/
export class FiniteStateAutomata {

    states: AVLMap<stateID, State>
    alphabeth: AVLSet<string>
    initialState: stateID
    epsilonCharacter: string
    name: string
/*
@method constructor()
        Set states, alphabeth, initialState, epsilonCharacter,name.
            @param {Set<string>} alphabeth
            @return FiniteStateAutomata
*/
    constructor(alphabeth: Array<string>) {
        this.states = new AVLMap<stateID, State>(intComp)
        this.alphabeth = new AVLSet(stringComp, alphabeth)
        this.initialState = 0
        this.epsilonCharacter = '\0'
        this.name = ""
    }
/*@method getName():
        Obtains the name of the finite State Automata
            @param {void}
            @return {string} name
            */
    getName(): string {
        return this.name
    }
/*@method setName():
        Change the name of the finite state automata
            @param {string} name
            @return {void}
            */
    setName(name: string): void {
        this.name = name
    }
/*@method addStateIfNotExist()
        Adds a new state only if this state dont exist
        @param {stateID} id
        @return {void}
        */
    private addStateIfNotExist(id: stateID): void {
        if (!this.states.has(id))
            this.states.set(id, new State(id))
    }
/*@method isValidCharacterOrEpsilon()
        Checks if the character is a valid character or epsilon
        @param {string} character
        @return {boolean} 
        	true if is a valida character or epsilon OR 
        	false if isn't a valid character or epsilon.
 */
    isValidCharacterOrEpsilon(character: string): boolean {
        return (
            State.specialTransitions.has(character) || 
            this.alphabeth.has(character) || 
            this.epsilonCharacter == character
        )
    }
/*@method isFinalState()
        @param {stateID} is
        @return {boolean}
        	true
        	false
 */
    isFinalState(id: stateID): boolean {
        this.addStateIfNotExist(id)
        return this.states.has(id) && this.states.get(id)!.isFinalState
    }
/*@method setInitialState()
    Add the state if it does not exist and set it as the initial state.
    @param {stateID} id
    @return {void}
*/
    setInitialState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.initialState = id
    }
/*@method setFinalState()
     Add the state if it does not exist and set it as a final state.
     @param {stateID} id
     @return {void}
     */
    setFinalState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.states.get(id)!.isFinalState = true
    }
/*@method unsetFinalState()
     Add the state if it does not exist and unset it as a final state.
     @param {stateID} id
     @return {void}
     */
    unsetFinalState(id: stateID): void {
        this.addStateIfNotExist(id)
        this.states.get(id)!.isFinalState = false
    }
/*@ method setFinalToken()
    For each state set the state token to automataToken
    @param tokenID automataToken
    @return void 
    */
    setFinalToken(automataToken: tokenID): void {
        this.states.forEach( state => {
            if (state.isFinalState) state.token = automataToken
        })
    }
/*@method setEpsilonCharacter()
    Set the epsilon character 
    @param string character
    @return false if it already exists or true if set the character to epsilonCharacter  */
    setEpsilonCharacter(character: string): boolean {
        if (this.alphabeth.has(character)) return false
       
        this.epsilonCharacter = character
        return true
    }
/*isDFA()
    @param void
    @return isStillPossible */
    isDFA (): boolean {
        let isStillPossible: boolean = true
        this.states.forEach( (fromState, _) => {
            fromState.transitions.forEach((toStates, character) => {
                const step = character !== this.epsilonCharacter && toStates.size() === 1
                isStillPossible = isStillPossible && step
            })
        })

        return isStillPossible
    }   
/*addTransition()
    Add a new transition in the state.
    @param stateID fromStateID, string character, stateID toStateID
    @return false if its not possible to create the transition
            true if the transition was created */    
    addTransition(fromStateID: stateID, character: string, toStateID: stateID): boolean {
        if (!this.isValidCharacterOrEpsilon(character)) return false
        this.addStateIfNotExist(fromStateID)
        this.addStateIfNotExist(toStateID)

        const stateTransitions = this.states.get(fromStateID)!.transitions

        if (stateTransitions.has(character)) stateTransitions.get(character)!.add(toStateID)
        else stateTransitions.set(character, new AVLSet(intComp, [toStateID]))

        return true
    }
/*epsilonClosure()
    Create the epsilon closure of the finite state automata:
    Given a state M of NFA, we define ϵ-closure(M) to be the set with the state M and the 
    states that you can reach only with ϵ transitions
    @param stateID id
    @return Set<number> visited */
    epsilonClosure (statesIDs: AVLSet<stateID>): AVLSet<stateID> {
        let self = this
        const visited: AVLSet<stateID> = new AVLSet(intComp)
        
        let dfs: (actualStateId: stateID) => void = function(actualStateId: stateID): void{
            visited.add(actualStateId)
            self.states.get(actualStateId)!.transitions.forEach((toStatesId, character) => {
                if (character == self.epsilonCharacter) {
                    toStatesId.forEach( toStateID => {
                        if (!visited.has(toStateID)) dfs(toStateID)
                    })
                }
            })
        }

        statesIDs.forEach(id => {
            this.addStateIfNotExist(id)
            if(!visited.has(id)) dfs(id)
        })
        
        return visited
    }

    move(statesIDs: AVLSet<stateID>, character: string): AVLSet<stateID>  {
        if (!this.isValidCharacterOrEpsilon(character)) return new AVLSet(intComp)

        let visited: AVLSet<stateID> = new AVLSet(intComp)
        statesIDs.forEach(id => {
            this.addStateIfNotExist(id)
            const stateTransitions = this.states.get(id)!.transitions
            if (stateTransitions.has(character))
                visited.join(stateTransitions.get(character)!)
        })
        
        return visited
    }

    goTo(statesIDs: AVLSet<stateID>, character: string): AVLSet<stateID> {
        if (!this.isValidCharacterOrEpsilon(character)) return new AVLSet(intComp)

        return this.epsilonClosure(this.move(statesIDs, character))
    }


    join(FSA2: FiniteStateAutomata): FiniteStateAutomata {
        FSA2 = FSA2.clone()
        const newInitialStateID: stateID = getNewStateID()
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState)
        this.addTransition(newInitialStateID, this.epsilonCharacter, FSA2.initialState)
        this.setInitialState(newInitialStateID)
        this.setName(`(${this.getName()} | ${FSA2.getName()})`)
        this.alphabeth.join(FSA2.alphabeth)

        FSA2.states.forEach( (state, id) => {
            this.states.set(id, state)
        })

        const newFinalStateID: stateID = getNewStateID()
        this.states.forEach( (state, id) => {
            if (state.isFinalState) {
                this.addTransition(id, this.epsilonCharacter, newFinalStateID)
                this.unsetFinalState(id)
            }
        })
        this.setFinalState(newFinalStateID)

        return this
    }

    concat(FSA2: FiniteStateAutomata): FiniteStateAutomata {
        FSA2 = FSA2.clone()
        this.setName(`(${this.getName()} & ${FSA2.getName()})`)
        this.alphabeth.join(FSA2.alphabeth)

        let uniqueFinalState: stateID = 0;
        this.states.forEach( (state, id) => {
            if (state.isFinalState) {
                uniqueFinalState = id
                this.unsetFinalState(id)
            }
        })

        FSA2.states.forEach( (state, id) => {
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

        this.states.forEach( (state, id) => {
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

        this.states.forEach( (state, id) => {
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

        this.states.forEach( (state, id) => {
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


    toDFA(): FiniteStateAutomata {
        const newInitialStateID: stateID = getNewStateID()
        const DFA = new FiniteStateAutomata(this.alphabeth.toArray())
        DFA.setInitialState(newInitialStateID)
        DFA.setEpsilonCharacter(this.epsilonCharacter)
        DFA.setName(`(Deterministic : ${this.getName()})`)

        const initialSet: AVLSet<stateID> = this.epsilonClosure(new AVLSet(intComp, [this.initialState]))
        const pending: Array<AVLSet<stateID>> = [initialSet]
        const mapping: AVLMap<AVLSet<stateID>, stateID> = new AVLMap(function(a, b){return a.compareTo(b)})
        mapping.set(initialSet, newInitialStateID)

        for (let i = 0; i < pending.length; ++i) {
            const oldStates: AVLSet<stateID> = pending[i]
            const fromStateID: stateID = mapping.get(oldStates)!
            let finalState: boolean = false
            let automataToken: tokenID = TokenDefault

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
                const newStates: AVLSet<stateID> = this.goTo(oldStates, character)
                if (newStates.size() > 0) {
                    if (!mapping.has(newStates)) {
                        pending.push(newStates)
                        mapping.set(newStates, getNewStateID())
                    }
                    const toStateID: stateID = mapping.get(newStates)!
                    DFA.addTransition(fromStateID, character, toStateID)
                }
            })
        }

        return DFA
    }

    validateString(testString: string): boolean {
        let PossibleStates: AVLSet<stateID> = this.epsilonClosure(new AVLSet(intComp, [this.initialState]))

        for (let i = 0; i < testString.length; i++) {
            PossibleStates = this.goTo(PossibleStates, testString[i])
            if (PossibleStates.size() === 0) return false
        }

        let count = 0
        PossibleStates.forEach(id => {
            if(this.states.get(id)!.isFinalState) count++
        })
        
        return count > 0
    }

    clone(): FiniteStateAutomata {
        const newCopy = new FiniteStateAutomata(this.alphabeth.toArray())
        newCopy.setEpsilonCharacter(this.epsilonCharacter)
        newCopy.setName(this.getName())
        const stateTranslator: AVLMap<stateID, stateID> = new AVLMap<stateID, stateID>(intComp)

        this.states.forEach( (_1, fromID) => {
            stateTranslator.set(fromID, getNewStateID())
        })

        this.states.forEach( (state, fromID) => {
            const newFromID: stateID = stateTranslator.get(fromID)!
            state.transitions.forEach((toStates, character) => {
                toStates.forEach(toID => {
                    const newToID: stateID = stateTranslator.get(toID)!
                    newCopy.addTransition(newFromID, character, newToID)
                })
            })
            if (state.isFinalState) {
                newCopy.setFinalState(newFromID)
                newCopy.states.get(newFromID)!.token = state.token
            }
        })

        newCopy.setInitialState(stateTranslator.get(this.initialState)!)

        return newCopy
    }

    static basicFSA(characters: string, hasMetaCharacters: boolean = true): FiniteStateAutomata {
        const basic = new FiniteStateAutomata([])
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
        FSAs = FSAs.map(fsa => fsa.clone())
        const newInitialStateID: stateID = getNewStateID()
        const newFSA = new FiniteStateAutomata([])
        newFSA.setInitialState(newInitialStateID)
        newFSA.setName(`Super join: [ ${FSAs.map(e => `[${e.getName()}]`).join(" | ")} ]`)

        FSAs.forEach( FSA => {
            newFSA.alphabeth.join(FSA.alphabeth)
            FSA.states.forEach( (state, id) => {
                newFSA.states.set(id, state)
            })
            newFSA.addTransition(newInitialStateID, newFSA.epsilonCharacter, FSA.initialState)
        })

        return newFSA
    }

    serialize(): AutomataJSON {
        const JSONAutomata: AutomataJSON = {
            alphabeth: this.alphabeth.toArray(),
            initialState: this.initialState,
            name: this.name,
            states: this.states.values().map(state => {
                const dataState: StateJSON = {
                    id: state.id,
                    isFinalState: state.isFinalState,
                    transitions: state.transitions.toArray()
                                    .map( transition => 
                                        [transition[0], transition[1].toArray()] as [string, Array<stateID>])
                }
                dataState.isFinalState = state.isFinalState
                dataState.token = state.token
                return dataState
            })
        }

        return JSONAutomata
    }

    static deserialize(JSONData: AutomataJSON): FiniteStateAutomata | null {

        try {

            const stateTranslator = new AVLMap<stateID, stateID>(intComp,
                JSONData.states
                    .map(state => [state.id, getNewStateID()] as [stateID, stateID])
            )

            const result = new FiniteStateAutomata(JSONData.alphabeth)
            result.setName(JSONData.name)
            result.setEpsilonCharacter('\0')

            JSONData.states.forEach(jsonState => {
                const fromID: stateID = jsonState.id
                const newFromID: stateID = stateTranslator.get(fromID)!
                jsonState.transitions.forEach(jsonTransition => {
                    const character: string = jsonTransition[0]
                    const toStates: Array<stateID> = jsonTransition[1]
                    toStates.forEach(toID => {
                        const newToID: stateID = stateTranslator.get(toID)!
                        result.addTransition(newFromID, character, newToID)
                    })
                })
                if(jsonState.isFinalState){
                    result.setFinalState(newFromID)
                    result.states.get(newFromID)!.token = jsonState.token!
                }
            })

            result.setInitialState(stateTranslator.get(JSONData.initialState)!)
            return result
        }
        catch (e) {
            return null
        }
        return null
    }

    graph(container: HTMLElement): Network {
        let nodes = new DataSet()
        let edges = new DataSet()
        let self = this

        let visited: AVLSet<stateID> = new AVLSet(intComp)

        let dfs: (fromStateID: stateID, level: number) => void = function(fromStateID: stateID, level: number): void {
            visited.add(fromStateID)
            let state = self.states.get(fromStateID)!
            state.transitions.forEach((toStates, character) => {
                toStates.forEach(toStateID => {
                    if(!visited.has(toStateID)){
                        nodes.add({id: toStateID, label: 'State ' + toStateID, color: {background: (toStateID == self.initialState ? 'cyan' : 'white'), border: (self.states.get(toStateID)!.isFinalState ? 'red' : 'black')}, level: level})
                    }
                    edges.add({from: fromStateID, to: toStateID, font: {multi: true}, label: '<b>' + (character == self.epsilonCharacter ? 'ε' : character) + '</b>', arrows: 'to', color: {color: 'black'}})
                    if(!visited.has(toStateID)){
                        dfs(toStateID, level + 1)
                    }
                })
            })
        }

        nodes.add({id: this.initialState, label: 'State ' + this.initialState, color: {background: 'cyan', border: (this.states.get(this.initialState)!.isFinalState ? 'red' : 'black')}, level: 0})
        dfs(this.initialState, 1)
        
        let data = {nodes: nodes, edges: edges}
        let options = {
            edges: {
                smooth:{
                    type: 'cubicBezier',
                    forceDirection: 'horizontal',
                    roundness: 0.4,
                    enabled: false,
                },
                color:{
                    inherit: false
                }
            },
            layout:{
                hierarchical: {
                    direction: 'LR'
                }
            },
            physics: false,
            clickToUse: true,
            interaction: {
                navigationButtons: true,
                keyboard: {
                    enabled: true,
                    bindToWindow: false,
                }
            }
        }
        return new Network(container, data, options)
    }
}

window["FiniteStateAutomata"] = FiniteStateAutomata
