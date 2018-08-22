#include <iostream>       
#include <vector>     
#include <map>     
#include <set>     
#include <utility>    
#include <stack>    

using namespace std;


template <class id, class symbol>
class FiniteStateAutomata {

    private:
        std::set<id> states;
        std::set<symbol> alphabelt;
        std::set<id> finalStates;
        std::map< pair<id, symbol>, set<id> > transitions;

        id initialState;
        symbol epsilon;

    public:
        FiniteStateAutomata(set<id> states, set<symbol> alphabelt) : states(states), alphabelt(alphabelt) {}

        bool addInitialState (id initialState) {
            if (states.find(initialState) == states.end()) return false;
            this->initialState = initialState;
            return true;
        }

        bool addtoFinalStates (id finalState) {
            if (states.find(initialState) == states.end()) return false;
            else finalStates.insert(finalState);
            return true;
        }

        bool addEpsilonSymbol(symbol epsilon) {
            if (alphabelt.find(epsilon) == alphabelt.end()) return false;
            
            this->epsilon = epsilon;
            return true;
        }

        bool addTransitions (id fromState, symbol element, id toState) {
            auto key = pair<id, symbol>{fromState, element};
            if (transitions.count(key) == 0) transitions[key] = set<id>{toState};
            else transitions[key].insert(toState);
        }

        bool addTransitions (id fromState, symbol element, set<id> toStates) {

            for (const auto state : toStates) 
                if (states.count(state) == 0) return false

            

        }

        set<id> getClosure(id state) {
            set<id> result;            
            stack<id> toCheck; toCheck.push(state);
            id currentElement;

            while (!toCheck.empty()) {
                currentElement = toCheck.top(); toCheck.pop();
                
                if (result.find(currentElement) == result.end()) result.insert(currentElement);
                
                if (transitions.count({currentElement, epsilon}) != 0) {
                    for (const auto& state : transitions[{currentElement, epsilon}])
                        toCheck.push(state);
                } 
            }

            return result;
        }


};


int main () {
    using u_int = unsigned int;

    FiniteStateAutomata<u_int, char> a{ 
        set<u_int>{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10},
        set<char>{'a', 'b','c', 'e'}
    };

    a.addInitialState(0);
    a.addEpsilonSymbol(0);
    a.addtoFinalStates(10);

    a.addTransitions(0, 'e', 1);
    a.addTransitions(1, 'e', 2);
    a.addTransitions(1, 'e', 4);
    a.addTransitions(2, 'a', 3);
    a.addTransitions(3, 'e', 6);
    a.addTransitions(4, 'b', 5);
    a.addTransitions(5, 'e', 6);
    a.addTransitions(6, 'e', 7);
    a.addTransitions(6, 'e', 1);
    a.addTransitions(7, 'e', 8);
    a.addTransitions(8, 'c', 9);
    a.addTransitions(9, 'e', 8);
    a.addTransitions(9, 'e', 10);

    auto x = a.getClosure(3);

    for (auto y: x) {
        cout << y << "\n";
    }

    return 0;
}