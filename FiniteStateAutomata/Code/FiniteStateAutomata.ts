type stateID = number;

class State {
    readonly id: number
    isFinalState: boolean
    transitions: Map<string, Set<number> >

    constructor(id: stateID) {
        this.id = id;
        this.isFinalState = false
        this.transitions = new Map()
    }
}

class AFN {

    private states: Map<stateID, State>
    private alphabeth: Set<string>
    private initialState: stateID
    private epsilonCharacter: string

    constructor(alphabeth: Set<string>) {
        this.states = new Map()
        this.alphabeth = new Set(alphabeth)
        this.initialState = 0;
        this.epsilonCharacter = '\0' 
    }

    private addStateIfNotExist(id: stateID): void {
        if (!this.states.has(id))
            this.states.set(id, new State(id))
    }

    isValidCharacter(character: string): boolean {
        return this.alphabeth.has(character)
    }

    isValidCharacterOrEpsilon(character: string): boolean {
        return this.isValidCharacter(character) || this.epsilonCharacter == character
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

        const toState = this.states.get(toStateID)
        const stateTransitions = this.states.get(fromStateID).transitions

        if (stateTransitions.has(character)) stateTransitions.get(character).add(toState.id)
        else stateTransitions.set(character, new Set([toState.id]))

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
                    toStatesId.forEach( toStateId => {
                        if (!visited.has(toStateId)) stack.push(toStateId)
                    })
                }
            })

        }
        
        return visited
    }

    epsilonClosureSet(statesIDs: Set<stateID>): Set<stateID>  {

        let visited: Set<stateID> = new Set()
        statesIDs.forEach(
            stateID => visited = new Set([...visited, ...this.epsilonClosure(stateID)])
        )
        
        return visited
    }

    move(id: stateID, character: string): Set<stateID> {
        if (!this.isValidCharacter(character)) return new Set()
        this.addStateIfNotExist(id)

        const stateTransitions = this.states.get(id).transitions
        if (!stateTransitions.has(character)) return new Set()

        return new Set(stateTransitions.get(character))
    }

    moveSet(statesIDs: Set<stateID>, character: string): Set<stateID>  {
        if (!this.isValidCharacter(character)) return new Set()

        let visited: Set<stateID> = new Set()
        statesIDs.forEach(
            stateID => visited = new Set([...visited, ...this.move(stateID, character)])
        )
        
        return visited
    }

    goTo(id: stateID, character: string): Set<stateID> {
        if (!this.isValidCharacter(character)) return new Set()

        return this.epsilonClosureSet(this.move(id, character))
    }

    goToSet(statesIDs: Set<stateID>, character: string): Set<stateID> {
        if (!this.isValidCharacter(character)) return new Set()

        return this.epsilonClosureSet(this.moveSet(statesIDs, character))
    }
}


/*
function AFN2(n, alphabeth){

    self.toAFD = function(){
        var AFD = new AFN(1 << self.n, self.alphabeth.slice());
        var count = 0;
        AFD.setInitialState(0);
        AFD.setEpsilonSymbol(self.epsilonSymbol);
        var initSet = self.epsilonClosure(self.initialState);
        var Q = [initSet];
        var mapeo = {};
        mapeo[initSet] = count++;
        for(var i = 0; i < Q.length; ++i){
            var oldStates = Q[i];
            var from = mapeo[oldStates];
            var finalState = false;
            oldStates.forEach(function(e){
                finalState = finalState || self.isFinalState(e);
            });
            if(finalState) AFD.setFinalState(from);
            self.alphabeth.forEach(function(c){
                var newStates = self.goToSet(oldStates, c);
                if(newStates.length > 0){
                    if(!(newStates in mapeo)){
                        Q.push(newStates);
                        mapeo[newStates] = count++;
                    }
                    var to = mapeo[newStates];
                    AFD.addTransition(from, c, to);
                }
            });
        }
        AFD.adjust(count);
        return AFD;
    }

    self.validateString = function(str){
        var S = self.epsilonClosure(self.initialState);
        for(var i = 0; i < str.length; ++i){
            S = self.goToSet(S, str[i]);
        }
        var test = false;
        S.forEach(function(e){
            if(self.isFinalState(e)){
                test = true;
            }
        });
        return test;
    }
}

function basicAFN(s){
    var basic = new AFN(2, [s]);
    basic.addTransition(0, s, 1);
    basic.setFinalState(1);
    return basic;
}

*/