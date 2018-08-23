var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var State = /** @class */ (function () {
    function State(id) {
        this.id = id;
        this.isFinalState = false;
        this.transitions = new Map();
    }
    return State;
}());
var AFN = /** @class */ (function () {
    function AFN(alphabeth) {
        this.states = new Map();
        this.alphabeth = new Set(alphabeth);
        this.initialState = 0;
        this.epsilonCharacter = '\0';
    }
    AFN.prototype.addStateIfNotExist = function (id) {
        if (!this.states.has(id))
            this.states.set(id, new State(id));
    };
    AFN.prototype.isValidCharacter = function (character) {
        return this.alphabeth.has(character);
    };
    AFN.prototype.isValidCharacterOrEpsilon = function (character) {
        return this.isValidCharacter(character) || this.epsilonCharacter == character;
    };
    AFN.prototype.isFinalState = function (id) {
        return this.states.has(id) && this.states.get(id).isFinalState;
    };
    AFN.prototype.setInitialState = function (id) {
        this.addStateIfNotExist(id);
        this.initialState = id;
    };
    AFN.prototype.setFinalState = function (id) {
        this.addStateIfNotExist(id);
        this.states.get(id).isFinalState = true;
    };
    AFN.prototype.setEpsilonCharacter = function (character) {
        if (this.alphabeth.has(character))
            return false;
        this.epsilonCharacter = character;
        return true;
    };
    AFN.prototype.isAFD = function () {
        var _this = this;
        var isStillPossible = true;
        this.states.forEach(function (fromState, _1, _2) {
            fromState.transitions.forEach(function (toStates, character, _) {
                var step = character !== _this.epsilonCharacter && toStates.size === 1;
                isStillPossible = isStillPossible && step;
            });
        });
        return isStillPossible;
    };
    AFN.prototype.addTransition = function (fromStateID, character, toStateID) {
        if (!this.isValidCharacterOrEpsilon(character))
            return false;
        this.addStateIfNotExist(fromStateID);
        this.addStateIfNotExist(toStateID);
        var toState = this.states.get(toStateID);
        var stateTransitions = this.states.get(fromStateID).transitions;
        if (stateTransitions.has(character))
            stateTransitions.get(character).add(toState.id);
        else
            stateTransitions.set(character, new Set([toState.id]));
        return true;
    };
    AFN.prototype.epsilonClosure = function (id) {
        var _this = this;
        this.addStateIfNotExist(id);
        var visited = new Set();
        var stack = [id];
        while (stack.length > 0) {
            var actualStateId = stack.pop();
            visited.add(actualStateId);
            var actualState = this.states.get(actualStateId);
            actualState.transitions.forEach(function (toStatesId, character, _) {
                if (character == _this.epsilonCharacter) {
                    toStatesId.forEach(function (toStateId) {
                        if (!visited.has(toStateId))
                            stack.push(toStateId);
                    });
                }
            });
        }
        return visited;
    };
    AFN.prototype.epsilonClosureSet = function (statesIDs) {
        var _this = this;
        var visited = new Set();
        statesIDs.forEach(function (stateID) { return visited = new Set(__spread(visited, _this.epsilonClosure(stateID))); });
        return visited;
    };
    AFN.prototype.move = function (id, character) {
        if (!this.isValidCharacter(character))
            return new Set();
        this.addStateIfNotExist(id);
        var stateTransitions = this.states.get(id).transitions;
        if (!stateTransitions.has(character))
            return new Set();
        return new Set(stateTransitions.get(character));
    };
    AFN.prototype.moveSet = function (statesIDs, character) {
        var _this = this;
        if (!this.isValidCharacter(character))
            return new Set();
        var visited = new Set();
        statesIDs.forEach(function (stateID) { return visited = new Set(__spread(visited, _this.move(stateID, character))); });
        return visited;
    };
    AFN.prototype.goTo = function (id, character) {
        if (!this.isValidCharacter(character))
            return new Set();
        return this.epsilonClosureSet(this.move(id, character));
    };
    AFN.prototype.goToSet = function (statesIDs, character) {
        if (!this.isValidCharacter(character))
            return new Set();
        return this.epsilonClosureSet(this.moveSet(statesIDs, character));
    };
    return AFN;
}());
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
