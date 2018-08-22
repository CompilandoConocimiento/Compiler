#include <iostream>       
#include <vector>     
#include <map>     

using namespace std;

template <class id, class symbol>
struct state {                          
    id name; 
    map<id, symbol> transtition;
    bool isFinalState;              
};

template <class id, class symbol>
class FiniteStateAutomata {
    using state = state<id, symbol>;

    private:
        vector<state> states;
        state *initialState;
        set<symbol> alphabelt;

    public:
        FiniteStateAutomata(vector<state> states, state* initialState, set<symbol> alphabelt) {
            this.states = states;
            this.states = states;
        }
};


int main () {
    
    using u_int = unsigned int;
    using symbol = char;

    auto a = state<u_int, symbol>()


    return 0;
}