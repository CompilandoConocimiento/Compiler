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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var counter = 0;
function getNewId() {
    return counter++;
}
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
    AFN.prototype.isValidCharacterOrEpsilon = function (character) {
        return this.alphabeth.has(character) || this.epsilonCharacter == character;
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
    AFN.prototype.unsetFinalState = function (id) {
        this.addStateIfNotExist(id);
        this.states.get(id).isFinalState = false;
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
        var stateTransitions = this.states.get(fromStateID).transitions;
        if (stateTransitions.has(character))
            stateTransitions.get(character).add(toStateID);
        else
            stateTransitions.set(character, new Set([toStateID]));
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
                    toStatesId.forEach(function (toStateID) {
                        if (!visited.has(toStateID))
                            stack.push(toStateID);
                    });
                }
            });
        }
        return visited;
    };
    AFN.prototype.epsilonClosureSet = function (statesIDs) {
        var _this = this;
        var visited = new Set();
        statesIDs.forEach(function (id) { return visited = new Set(__spread(visited, _this.epsilonClosure(id))); });
        return visited;
    };
    AFN.prototype.move = function (id, character) {
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        this.addStateIfNotExist(id);
        var stateTransitions = this.states.get(id).transitions;
        if (!stateTransitions.has(character))
            return new Set();
        return new Set(stateTransitions.get(character));
    };
    AFN.prototype.moveSet = function (statesIDs, character) {
        var _this = this;
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        var visited = new Set();
        statesIDs.forEach(function (id) { return visited = new Set(__spread(visited, _this.move(id, character))); });
        return visited;
    };
    AFN.prototype.goTo = function (id, character) {
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        return this.epsilonClosureSet(this.move(id, character));
    };
    AFN.prototype.goToSet = function (statesIDs, character) {
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        return this.epsilonClosureSet(this.moveSet(statesIDs, character));
    };
    AFN.prototype.join = function (AFN2) {
        var _this = this;
        var newInitialStateID = getNewId();
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState);
        this.addTransition(newInitialStateID, this.epsilonCharacter, AFN2.initialState);
        this.setInitialState(newInitialStateID);
        this.alphabeth = new Set(__spread(this.alphabeth, AFN2.alphabeth));
        AFN2.states.forEach(function (state, id, _) {
            _this.states.set(id, state);
        });
        var newFinalStateID = getNewId();
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState) {
                _this.addTransition(id, _this.epsilonCharacter, newFinalStateID);
                _this.unsetFinalState(id);
            }
        });
        this.setFinalState(newFinalStateID);
    };
    AFN.prototype.concat = function (AFN2) {
        var _this = this;
        this.alphabeth = new Set(__spread(this.alphabeth, AFN2.alphabeth));
        var uniqueFinalState = 0;
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState) {
                uniqueFinalState = id;
                _this.unsetFinalState(id);
            }
        });
        AFN2.states.forEach(function (state, id, _) {
            _this.states.set(id, state);
        });
        this.states.set(uniqueFinalState, AFN2.states.get(AFN2.initialState));
        this.states.get(uniqueFinalState).id = uniqueFinalState;
    };
    AFN.prototype.positiveClosure = function () {
        var _this = this;
        var newInitialStateID = getNewId();
        var newFinalStateID = getNewId();
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState);
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState) {
                _this.addTransition(id, _this.epsilonCharacter, _this.initialState);
                _this.addTransition(id, _this.epsilonCharacter, newFinalStateID);
                _this.unsetFinalState(id);
            }
        });
        this.setInitialState(newInitialStateID);
        this.setFinalState(newFinalStateID);
    };
    AFN.prototype.kleeneClosure = function () {
        var _this = this;
        this.positiveClosure();
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState)
                _this.addTransition(_this.initialState, _this.epsilonCharacter, id);
        });
    };
    AFN.prototype.optionalClosure = function () {
        var _this = this;
        var newInitialStateID = getNewId();
        var newFinalStateID = getNewId();
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState);
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState) {
                _this.addTransition(id, _this.epsilonCharacter, newFinalStateID);
                _this.unsetFinalState(id);
            }
        });
        this.addTransition(newInitialStateID, this.epsilonCharacter, newFinalStateID);
        this.setInitialState(newInitialStateID);
        this.setFinalState(newFinalStateID);
    };
    AFN.prototype.hashSet = function (statesIDs) {
        return Array.from(statesIDs).sort(function (a, b) { return a - b; }).join(',');
    };
    AFN.prototype.toAFD = function () {
        var _this = this;
        var newInitialStateID = getNewId();
        var AFD = new AFN(new Set(this.alphabeth));
        AFD.setInitialState(newInitialStateID);
        AFD.setEpsilonCharacter(this.epsilonCharacter);
        var initialSet = this.epsilonClosure(this.initialState);
        var pending = [initialSet];
        var mapeo = new Map();
        mapeo.set(this.hashSet(initialSet), newInitialStateID);
        var _loop_1 = function (i) {
            var oldStates = pending[i];
            var fromStateID = mapeo.get(this_1.hashSet(oldStates));
            var finalState = false;
            oldStates.forEach(function (id) { return finalState = finalState || _this.isFinalState(id); });
            if (finalState)
                AFD.setFinalState(fromStateID);
            this_1.alphabeth.forEach(function (character) {
                var newStates = _this.goToSet(oldStates, character);
                if (newStates.size > 0) {
                    if (!mapeo.has(_this.hashSet(newStates))) {
                        pending.push(newStates);
                        mapeo.set(_this.hashSet(newStates), getNewId());
                    }
                    var toStateID = mapeo.get(_this.hashSet(newStates));
                    AFD.addTransition(fromStateID, character, toStateID);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < pending.length; ++i) {
            _loop_1(i);
        }
        return AFD;
    };
    AFN.prototype.validateString = function (str) {
        var _this = this;
        var e_1, _a;
        var S = this.epsilonClosure(this.initialState);
        try {
            for (var str_1 = __values(str), str_1_1 = str_1.next(); !str_1_1.done; str_1_1 = str_1.next()) {
                var character = str_1_1.value;
                S = this.goToSet(S, character);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (str_1_1 && !str_1_1.done && (_a = str_1["return"])) _a.call(str_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return (new Set(__spread(S).filter(function (id) { return _this.states.get(id).isFinalState; }))).size > 0;
    };
    AFN.prototype.clone = function () {
        var newCopy = new AFN(new Set(this.alphabeth));
        newCopy.setEpsilonCharacter(this.epsilonCharacter);
        var newIDS = new Map();
        this.states.forEach(function (state, fromID, _2) {
            if (!newIDS.has(fromID))
                newIDS.set(fromID, getNewId());
            var newFromID = newIDS.get(fromID);
            state.transitions.forEach(function (toStates, character, _) {
                toStates.forEach(function (toID) {
                    if (!newIDS.has(toID))
                        newIDS.set(toID, getNewId());
                    var newToID = newIDS.get(toID);
                    newCopy.addTransition(newFromID, character, newToID);
                });
            });
            if (state.isFinalState)
                newCopy.setFinalState(newFromID);
        });
        newCopy.setInitialState(newIDS.get(this.initialState));
        return newCopy;
    };
    return AFN;
}());
function basicAFN(character) {
    var basic = new AFN(new Set([character]));
    var fromStateID = getNewId();
    var toStateID = getNewId();
    basic.setInitialState(fromStateID);
    basic.addTransition(fromStateID, character, toStateID);
    basic.setFinalState(toStateID);
    return basic;
}
