/*=======================================================================
==========                     TURING MACHINE                 ===========
========================================================================*/
#include <iostream>                                                         // I will need this
#include <string>                                                           // I will need this
#include <sstream>                                                          // I will need this
#include <fstream>                                                          // I will need this
#include <vector>                                                           // I will need this
#include <map>                                                              // I will need this
#include <algorithm>                                                        // I will need this
#include <stack>                                                            // I will need this
#include <set>                                                              // I will need this
#include <list>                                                              // I will need this


using namespace std;                                                        //Sorry kids, I hate large codes

/*==================================================
===========    DEFINE A TURING MACHINE    ==========
==================================================*/
class TuringMachine{                                                        //============== MY CLASS =============
    private:                                                                //my private parts
        int NumberOfStates;                                                 //This is the states to works
        int StartState;                                                     //This is the state where the machine start
        set<int> FinalStates;                                               //This is the states that will be final

        set<char> InputAlphabet;                                            //This is the input symbols         
        set<char> TapeAlphabet;                                             //InputAlphabet is a sub set of this
        char BlankSymbol;                                                   //It's in TapeAlphablet but not InputAlphabet

        map<string, string> TransitionFn;                                   //Transtitions of the program
        list<char> InfiniteTape;                                            //Tape of the program

        list<char>::iterator TapePosition;                                  //A C++ Iterator, to save the Actual Tape Position
        int ActualState;                                                    //This should help us!

    public:                                                                 //Your methods, for you
        TuringMachine(string FileName);                                     //Lets get the info
        void ShowMeInfo();                                                  //Give me info of the Machine

        bool RunMachine(string &TestString, bool ShowIt);                   //Lets have fun!
};


/*==================================================
========    READ THE DATA AND CREATE IT   ==========
==================================================*/
TuringMachine::TuringMachine(string FileName){                              //====== THIS IS WHERE MAGIC COMES =========

    int NumFinalStates, NumInputAlphabet, NumTapeAlphabet, NumFuntions;     //Some counters
    string Garbage, Key, Actions;                                           //This will be the Garbage Collector
    char ActualSymbol;                                                      //Get the symbol

    ifstream Data(FileName.c_str());                                        //This will be my file
    Data >> Garbage;                                                        //Read only title

    // ============ STATES INFORMATION ====================    
    Data >> Garbage;                                                        // == Read Q: ===
    Data >> NumberOfStates;                                                 //Now read the numStates

    Data >> Garbage;                                                        // == Read q0: ==
    Data >> StartState;                                                     //Get the info

    Data >> Garbage;                                                        // == Read F: ==
    Data >> NumFinalStates;                                                 //The final state

    for (int i = 0, temporal; i < NumFinalStates; ++i){                     //Lets go for each number
        Data >> temporal;                                                   //Get the info
        FinalStates.insert(temporal);                                       //You are now in the Set
    }

    // ============ ALPHABELTS INFORMATION ====================
    Data >> Garbage;                                                        // == Read the Σ: ==
    Data >> NumInputAlphabet;                                               //Get the size

    for (int i = 0; i < NumInputAlphabet; ++i){                             //Lets go for each symbol
        Data >> ActualSymbol;                                               //Get the info
        InputAlphabet.insert(ActualSymbol);                                 //Save it!
    }

    Data >> Garbage;                                                        // == Read the Γ: ==
    Data >> NumTapeAlphabet;                                                //Get the size

    for (int i = 0; i < NumTapeAlphabet; ++i){                              //Lets go for each symbol
        Data >> ActualSymbol;                                               //Get the info
        TapeAlphabet.insert(ActualSymbol);                                  //Save it!
    }

    Data >> Garbage;                                                        // == Read B: ==
    Data >> BlankSymbol;                                                    //The Blanck Symbol

    // ============ TRANSITIONS INFORMATION ====================
    Data >> Garbage;                                                        // == Read the ∂: ==
    Data >> NumFuntions;                                                    //Get the size

    for (int i = 0; i < NumFuntions; ++i){                                  //For Each funtion

        Data >> Garbage;                                                    // (
        Data >> Key;                                                        // Key: qx,SymbolRead
        Data >> Garbage;                                                    // )->(
        Data >> Actions;                                                    // Actions:qx,SymbolWrite,Motion
        Data >> Garbage;                                                    // )

        TransitionFn[Key] = Actions;                                         //Save it!
    }
    Data.close();                                                           //Good bye Data :'/
}


/*==================================================
===    SHOW ME THE INFO OF THE TURING MACHINE    ===
==================================================*/
void TuringMachine::ShowMeInfo(){                                           //======= SHOW THE INFO ====================
    cout << "\n=====  INFO OF THE TURING MACHINE  ========";                //Welcome message

    cout << "\n\nQ  (States): " << NumberOfStates;                          //Show it!
    cout << "\n\nq0 (Initial State): q" << StartState;                      //Show it!

    cout << "\n\nF  (Final States): " << FinalStates.size() << "\n";        //Show it! 
    for (auto x : FinalStates) cout << " - q" << x << "\n";                 //All states

    cout << "\n\nΣ  (InputAlphabet): " << InputAlphabet.size() << "\n";     //Show it! 
    for (auto x : InputAlphabet) cout << " - " << x << "\n";                //Show it! 

    cout << "\n\nΓ  (TapeAlphabet): " << TapeAlphabet.size() << "\n";       //Show it! 
    for (auto x : TapeAlphabet) cout << " - " << x << "\n";                 //Show it! 
    
    cout << "\n\nB  (BlankSymbol): " << BlankSymbol;                        //Show it!

    cout << "\n\n∂  (Transtition Funtions): " << TransitionFn.size()<<"\n"; //Show it! 
    for (auto x : TransitionFn)                                             //Travel to 
        cout << " - " << "∂(" << x.first << ") -> (" << x.second << ")\n";  //All states
}



/*===========================================================
======          LETS CHECK THE TURING MACHINE       =========
===========================================================*/
bool TuringMachine::RunMachine(string &TestString, bool ShowIt){            //======= THIS IS THE GOOD PART !! =========

    list<char>::iterator Auxiliar;                                          //An auxiliar iterator to search at list
    char ReadingSymbol, Direction, WritingSymbol;                           //Some chars that will be useful
    string Key, Actions;                                                    //Some String that will tell us what to do
  
    InfiniteTape = list<char>(TestString.begin(), TestString.end());        //Now we have a new list

    bool ValidString = false;                                               //Supose that we are not a Valid string
    ActualState = StartState;                                               //Lets have this
    TapePosition = InfiniteTape.begin();                                    //Start the reading at the most left value


    if (ShowIt) cout << "\n\n\n==== TURING MACHINE RUNNING ======\n\n";     //Some cool message
    while (true){                                                           // ===== TURING MACHINE RUNNING =======
        ReadingSymbol = *TapePosition;                                      //This is our reading symbol
        Key = "q" + to_string(ActualState) + "," + ReadingSymbol;           //Create a Key to search if we have a function    

        if (TransitionFn.find(Key) == TransitionFn.end()){                  //Now, try to find it!

            if (FinalStates.find(ActualState) != FinalStates.end())         //So... maybe we are at an final state
                ValidString = true;                                         //Check if we are at a Final Start
            else ValidString = false;                                       //So we failed, thats sad :(
            break;                                                          //Anyway, no more work to d0
        }           

        Actions = TransitionFn[Key];                                        //Tell me what to do

        if (ShowIt){                                                        //So if you want to see how we are going
            cout << "∂(" << Key << ") -> (" << Actions << ")\tTape:";       //Show what we are doing
            
            Auxiliar = InfiniteTape.begin();                                //Start the iterator
            for (;Auxiliar != InfiniteTape.end(); ++Auxiliar){              //For each element of the list
                if (Auxiliar == TapePosition)                               //If we are at the reading point
                    cout << " [" << *Auxiliar << "]";                       //Just a different notation
                else cout << ' ' << *Auxiliar;                              //If not, all normal
            }

            cout << "\n";                                                   //Get me some space
        }

        Direction = Actions.back();                                         //Get me the direction
        Actions.pop_back(); Actions.pop_back();                             //Remove used information
        WritingSymbol = Actions.back();                                     //Get me what I wil write
        Actions.pop_back(); Actions.pop_back();                             //Remove used information
        Actions.erase(Actions.begin(),Actions.begin()+1);                   //Remove q
        ActualState = atoi(Actions.c_str());                                //Get me the next state to jump 

        *TapePosition = WritingSymbol;                                      //Now change the list value

        if (Direction == 'L'){                                              //Moving to the Left  <- <- <-
            if (TapePosition == InfiniteTape.begin())                       //If we need more Blank spaces
                InfiniteTape.push_front(BlankSymbol);                       //Create a new one
            --TapePosition;                                                 //And move the iterator
        } 

        if (Direction == 'R'){                                              //Moving to the Left  -> -> ->
            if (TapePosition == ++InfiniteTape.end())                       //Safetly check if we are at the end                 
                InfiniteTape.push_back(BlankSymbol);                        //So we can add a new blank symbol
            ++TapePosition;                                                 //And move the iterator
        }
    }

    if (ValidString && ShowIt)                                              //Finally
        cout << "\n\n" << TestString << " is a ValidString :D\n";           //Celebrate

    return ValidString;                                                     //So if you need this info
}




