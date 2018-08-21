#include <iostream>       
#include <vector>     
#include <map>     

using namespace std;

struct state {                          
    unsigned int id; 
    map<int, unsigned int> transtition;
    bool isFinalState;              
};

class FiniteStateAutomata {

    private:
        vector<state> states;
        state *initialState;
        vector<char> alphabelt;

    public:
        FiniteStateAutomata(
            vector<state> states, state* initialState,
            vector<char> alphabelt
        );

};