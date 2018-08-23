let counter: number = 0

class State {
    readonly id: number
    isFinalState: boolean
    transitions: Map<string, State>

    constructor() {
        this.id = counter++;
        this.isFinalState = false
        this.transitions = new Map()
    }
}

class AFN {

    private states: Map<number, State>
    private alphabeth: Set<string>
    private initialState: State
    private epsilonCharacter: string

    constructor(alphabeth: Set<string>) {
        this.states = new Map()
        this.alphabeth = new Set(alphabeth)
        this.initialState = null;
        this.epsilonCharacter = '\0' 
    }

    isValidSymbol(character: string): boolean {
        return this.alphabeth.has(character)
    }

    isFinalState(state: State): boolean {
        return this.states.has(state.id) && state.isFinalState
    }

    setInitialState(state: State): void {
        this.states[state.id] = state
        this.initialState = state
    }

    setFinalState(state: State): void {
        this.states[state.id] = state
        state.isFinalState = true
    }

    setEpsilonCharacter(character: string): boolean {
        if (this.alphabeth.has(character)) return false
       
        this.epsilonCharacter = character
        return true
    }
 

}



function AFN2(n, alphabeth){

    self.isAFD = function(){
        var test = true;
        for(var i = 0; i < self.n; ++i){
            for(var symbol in self.states[i].transitions){
                test = test && (symbol != self.epsilonSymbol);
                test = test && (self.states[i].transitions[symbol].length == 1);
            }
        }
        return test;
    }

    self.addTransition = function(from, symbol, to){
        if(self.validState(from) && self.validState(to) && self.validSymbol(symbol)){
            if(symbol in self.states[from].transitions){
                self.states[from].transitions[symbol].push(to);
            }else{
                self.states[from].transitions[symbol] = [to];
            }
        }
    }

    self.epsilonClosure = function(e){
        if(!self.validState(e)){
            return [];
        }
        var visited = [];
        var stack = [e];
        while(stack.length > 0){
            var u = stack.pop();
            visited.push(u);
            for(var symbol in self.states[u].transitions){
                if(symbol != self.epsilonSymbol) continue;
                var current = self.states[u].transitions[symbol];
                current.forEach(function(v){
                    if(visited.indexOf(v) == -1){
                        stack.push(v);
                    }
                });
            }
        }
        visited.sort((a, b) => a - b);
        return visited;
    }

    self.epsilonClosureSet = function(A){
        var visited = [];
        A.forEach(function(e){
            var tmp = self.epsilonClosure(e);
            tmp.forEach(function(v){
                if(visited.indexOf(v) == -1){
                    visited.push(v);
                }
            });
        });
        visited.sort((a, b) => a - b);
        return visited;
    }

    self.move = function(e, c){
        if(self.validState(e) && self.validSymbol(c) && c in self.states[e].transitions){
            return self.states[e].transitions[c].slice();
        }else{
            return [];
        }
    }

    self.moveSet = function(A, c){
        if(!self.validSymbol(c)){
            return [];
        }
        var visited = [];
        A.forEach(function(e){
            var tmp = self.move(e, c);
            tmp.forEach(function(v){
                if(visited.indexOf(v) == -1){
                    visited.push(v);
                }
            });
        });
        visited.sort((a, b) => a - b);
        return visited;
    }

    self.goTo = function(e, c){
        if(self.validSymbol(c)){
            return self.epsilonClosureSet(self.move(e, c));
        }else{
            return [];
        }
    }

    self.goToSet = function(A, c){
        if(self.validSymbol(c)){
            return self.epsilonClosureSet(self.moveSet(A, c));
        }else{
            return [];
        }
    }

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