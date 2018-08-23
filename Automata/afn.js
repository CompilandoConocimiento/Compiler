function state(id){
	this.id = id;
	this.finalState = false;
	this.transitions = {};
}

function transition(to, symbol){
	this.to = to;
	this.symbol = symbol;
}

function AFN(n, alphabeth){
	var self = this;
	self.states = [];
	self.n = n;
	self.alphabeth = [];
	self.initialState = 0;
	self.epsilonSymbol = '\0';

	for(var i = 0; i < self.n; ++i){
		self.states.push(new state(i));
	}

	for(var i = 0; i < alphabeth.length; ++i){
		self.alphabeth.push(alphabeth[i]);
	}

	self.adjust = function(m){
		while(self.states.length > m){
			self.states.pop();
		}
		self.n = m;
	}

	self.validState = function(s){
		return 0 <= s && s < self.n;
	}

	self.validSymbol = function(c){
		return c == self.epsilonSymbol || self.alphabeth.indexOf(c) != -1;
	}

	self.setInitialState = function(s){
		if(self.validState(s)){
			self.initialState = s;
		}
	}

	self.setFinalState = function(s){
		if(self.validState(s)){
			self.states[s].finalState = true;
		}
	}

	self.isFinalState = function(s){
		return self.validState(s) && self.states[s].finalState;
	}

	self.setEpsilonSymbol = function(s){
		self.epsilonSymbol = s;
	}

	self.isAFD = function(){
		var test = true;
		for(var i = 0; i < self.n; ++i){
			test = test && (symbol != self.epsilonSymbol);
			for(var symbol in self.states[i].transitions){
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