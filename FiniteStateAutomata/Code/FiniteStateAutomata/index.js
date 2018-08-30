"use strict";
exports.__esModule = true;
exports.getNewID = function () {
    var counter = 0;
    return function () { return counter++; };
}();
var State = /** @class */ (function () {
    function State(id) {
        this.id = id;
        this.isFinalState = false;
        this.transitions = new Map();
    }
    return State;
}());
var FiniteStateAutomata = /** @class */ (function () {
    function FiniteStateAutomata(alphabeth) {
        this.states = new Map();
        this.alphabeth = new Set(alphabeth);
        this.initialState = 0;
        this.epsilonCharacter = '\0';
    }
    FiniteStateAutomata.prototype.addStateIfNotExist = function (id) {
        if (!this.states.has(id))
            this.states.set(id, new State(id));
    };
    FiniteStateAutomata.prototype.isValidCharacterOrEpsilon = function (character) {
        return this.alphabeth.has(character) || this.epsilonCharacter == character;
    };
    FiniteStateAutomata.prototype.isFinalState = function (id) {
        return this.states.has(id) && this.states.get(id).isFinalState;
    };
    FiniteStateAutomata.prototype.setInitialState = function (id) {
        this.addStateIfNotExist(id);
        this.initialState = id;
    };
    FiniteStateAutomata.prototype.setFinalState = function (id) {
        this.addStateIfNotExist(id);
        this.states.get(id).isFinalState = true;
    };
    FiniteStateAutomata.prototype.unsetFinalState = function (id) {
        this.addStateIfNotExist(id);
        this.states.get(id).isFinalState = false;
    };
    FiniteStateAutomata.prototype.setEpsilonCharacter = function (character) {
        if (this.alphabeth.has(character))
            return false;
        this.epsilonCharacter = character;
        return true;
    };
    FiniteStateAutomata.prototype.isAFD = function () {
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
    FiniteStateAutomata.prototype.addTransition = function (fromStateID, character, toStateID) {
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
    FiniteStateAutomata.prototype.epsilonClosure = function (id) {
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
    FiniteStateAutomata.prototype.epsilonClosureSet = function (statesIDs) {
        var _this = this;
        var visited = new Set();
        statesIDs.forEach(function (id) { return visited = new Set(visited.concat(_this.epsilonClosure(id))); });
        return visited;
    };
    FiniteStateAutomata.prototype.move = function (id, character) {
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        this.addStateIfNotExist(id);
        var stateTransitions = this.states.get(id).transitions;
        if (!stateTransitions.has(character))
            return new Set();
        return new Set(stateTransitions.get(character));
    };
    FiniteStateAutomata.prototype.moveSet = function (statesIDs, character) {
        var _this = this;
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        var visited = new Set();
        statesIDs.forEach(function (id) { return visited = new Set(visited.concat(_this.move(id, character))); });
        return visited;
    };
    FiniteStateAutomata.prototype.goTo = function (id, character) {
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        return this.epsilonClosureSet(this.move(id, character));
    };
    FiniteStateAutomata.prototype.goToSet = function (statesIDs, character) {
        if (!this.isValidCharacterOrEpsilon(character))
            return new Set();
        return this.epsilonClosureSet(this.moveSet(statesIDs, character));
    };
    FiniteStateAutomata.prototype.join = function (FSA2) {
        var _this = this;
        var newInitialStateID = exports.getNewID();
        this.addTransition(newInitialStateID, this.epsilonCharacter, this.initialState);
        this.addTransition(newInitialStateID, this.epsilonCharacter, FSA2.initialState);
        this.setInitialState(newInitialStateID);
        this.alphabeth = new Set(this.alphabeth.concat(FSA2.alphabeth));
        FSA2.states.forEach(function (state, id, _) {
            _this.states.set(id, state);
        });
        var newFinalStateID = exports.getNewID();
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState) {
                _this.addTransition(id, _this.epsilonCharacter, newFinalStateID);
                _this.unsetFinalState(id);
            }
        });
        this.setFinalState(newFinalStateID);
    };
    FiniteStateAutomata.prototype.concat = function (FSA2) {
        var _this = this;
        this.alphabeth = new Set(this.alphabeth.concat(FSA2.alphabeth));
        var uniqueFinalState = 0;
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState) {
                uniqueFinalState = id;
                _this.unsetFinalState(id);
            }
        });
        FSA2.states.forEach(function (state, id, _) {
            _this.states.set(id, state);
        });
        this.states.set(uniqueFinalState, FSA2.states.get(FSA2.initialState));
        this.states.get(uniqueFinalState).id = uniqueFinalState;
    };
    FiniteStateAutomata.prototype.positiveClosure = function () {
        var _this = this;
        var newInitialStateID = exports.getNewID();
        var newFinalStateID = exports.getNewID();
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
    FiniteStateAutomata.prototype.kleeneClosure = function () {
        var _this = this;
        this.positiveClosure();
        this.states.forEach(function (state, id, _2) {
            if (state.isFinalState)
                _this.addTransition(_this.initialState, _this.epsilonCharacter, id);
        });
    };
    FiniteStateAutomata.prototype.optionalClosure = function () {
        var _this = this;
        var newInitialStateID = exports.getNewID();
        var newFinalStateID = exports.getNewID();
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
    FiniteStateAutomata.prototype.hashSet = function (statesIDs) {
        return Array.from(statesIDs).sort(function (a, b) { return a - b; }).join(',');
    };
    FiniteStateAutomata.prototype.toAFD = function () {
        var _this = this;
        var newInitialStateID = exports.getNewID();
        var AFD = new FiniteStateAutomata(new Set(this.alphabeth));
        AFD.setInitialState(newInitialStateID);
        AFD.setEpsilonCharacter(this.epsilonCharacter);
        var initialSet = this.epsilonClosure(this.initialState);
        var pending = [initialSet];
        var mapping = new Map();
        mapping.set(this.hashSet(initialSet), newInitialStateID);
        var _loop_1 = function (i) {
            var oldStates = pending[i];
            var fromStateID = mapping.get(this_1.hashSet(oldStates));
            var finalState = false;
            oldStates.forEach(function (id) { return finalState = finalState || _this.isFinalState(id); });
            if (finalState)
                AFD.setFinalState(fromStateID);
            this_1.alphabeth.forEach(function (character) {
                var newStates = _this.goToSet(oldStates, character);
                if (newStates.size > 0) {
                    if (!mapping.has(_this.hashSet(newStates))) {
                        pending.push(newStates);
                        mapping.set(_this.hashSet(newStates), exports.getNewID());
                    }
                    var toStateID = mapping.get(_this.hashSet(newStates));
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
    FiniteStateAutomata.prototype.validateString = function (testString) {
        var _this = this;
        var PossibleStates = this.epsilonClosure(this.initialState);
        for (var i = 0; i < testString.length; i++) {
            PossibleStates = this.goToSet(PossibleStates, testString[i]);
            if (PossibleStates.size === 0)
                return false;
        }
        var finalStates = PossibleStates.slice().filter(function (id) { return _this.states.get(id).isFinalState; });
        return finalStates.length > 0;
    };
    FiniteStateAutomata.prototype.clone = function () {
        var newCopy = new FiniteStateAutomata(new Set(this.alphabeth));
        newCopy.setEpsilonCharacter(this.epsilonCharacter);
        var newIDs = new Map();
        this.states.forEach(function (state, fromID, _2) {
            if (!newIDs.has(fromID))
                newIDs.set(fromID, exports.getNewID());
            var newFromID = newIDs.get(fromID);
            state.transitions.forEach(function (toStates, character, _) {
                toStates.forEach(function (toID) {
                    if (!newIDs.has(toID))
                        newIDs.set(toID, exports.getNewID());
                    var newToID = newIDs.get(toID);
                    newCopy.addTransition(newFromID, character, newToID);
                });
            });
            if (state.isFinalState)
                newCopy.setFinalState(newFromID);
        });
        newCopy.setInitialState(newIDs.get(this.initialState));
        return newCopy;
    };
    return FiniteStateAutomata;
}());
exports.FiniteStateAutomata = FiniteStateAutomata;
function basicFSA(character) {
    var basic = new FiniteStateAutomata(new Set([character]));
    var fromStateID = exports.getNewID();
    var toStateID = exports.getNewID();
    basic.setInitialState(fromStateID);
    basic.addTransition(fromStateID, character, toStateID);
    basic.setFinalState(toStateID);
    return basic;
}
exports.basicFSA = basicFSA;
