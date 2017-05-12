/*=======================================================================
==========                PDA: PUSHDOWN AUTOMATA              ===========
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

/*==================================================
===========    DEFINE A AUTOMATA      ==============
==================================================*/
class PDA{                                                                  //============== MY CLASS =============
    private:                                                                //my private parts
        std::vector<int> States;                                            //This is the states to works
        std::vector<char> Alphabet;                                         //This is the input symbols 
        std::vector<char> StackAlphabet;                                    //This is the input symbols (of stack)
        std::set<int> FinalStates;                                          //This is the states that will be final
        std::map<std::string, std::string> FnTransicion;                    //Transtitions of the program
        std::stack<char> AutomataStack;                                     //So, lets use this to store

        short int StartState;                                               //A incitial state
        char StartStack;                                                    //A incitial state fo stack

        bool ThisAutomataCanContinue;                                       //A little flag
        bool AtValidState;                                                  //A little flag
        short int ActualState;                                              //This should help us!

    public:                                                                 //Your methods, for you
        void ShowMeInfo();                                                  //Give me info
        PDA(std::string FileName);                                          //Lets get the info
        bool RunAutomata(char symbol, bool ShowIt);                         //Lets have fun!
        void AnalizeFile(char *File, char *OkFile, bool Show);              //Find string of their 

        void StartAutomata(){                                               //Just setting this right!
            ActualState = StartState;                                       //Lets have this
            ThisAutomataCanContinue = true;                                 //So, you can continue
            AtValidState = true;                                            //Because we always have I chanse

            std::stack <char> NewStack;                                     //Lets create a new stack
            AutomataStack = NewStack;                                       //Now change 
            AutomataStack.push(StartStack);                                 //Please you need to have this inside
        }

        bool ImAtFinalState(){                                              //Funcion to check if all was worth it! :)
            if(!ThisAutomataCanContinue) return false;                      //Check this please
            if(!AtValidState) return false;                                 //Check this please

            auto exist = FinalStates.find(ActualState);
            if (exist == FinalStates.end()) return false;
            return true;
        }
};


/*==================================================
========    EL AUTOMATA TODA LOS DATOS    ==========
==================================================*/
PDA::PDA(std::string FileName){                                             //============== THIS IS WHERE MAGIC COMES ====== 
    std::string garbage;                                                    //This will be the garbage collector

    int NumStates, NumFinalStates, NumSymbol, NumStackSymbol, NumFuntions;  //Some counters
    char symbol;                                                            //Get the symbol

    std::ifstream Data(FileName.c_str());                                   //This will be my file

    Data >> garbage;                                                        //Read only title
    Data >> garbage;                                                        // == Read Q: ===
    Data >> NumStates;                                                      //Now read the numStates
    States.resize(NumStates);                                               //Now resize the number of states

    Data >> garbage;                                                        // == Read q0: ==
    Data >> StartState;                                                     //get the size

    Data >> garbage;                                                        // == Read z0: ==
    Data >> StartStack;                                                     //get the size

    Data >> garbage;                                                        // == Read F: ==
    Data >> NumFinalStates;                                                 //The final state

    for (int i = 0, temporal; i < NumFinalStates; ++i){                     //lets go for each number
        Data >> temporal;                                                   // get the info
        FinalStates.insert(temporal);                                       //you are true
    }

    Data >> garbage;                                                        // == Read the Σ: ==
    Data >> NumSymbol;                                                      //get the size

    for (int i = 0; i < NumSymbol; ++i){
        Data >> symbol;                                                     // get the info
        Alphabet.push_back(symbol);                                         //save it!
    }

    Data >> garbage;                                                        // == Read the G: ==
    Data >> NumStackSymbol;                                                 //get the size

    for (int i = 0; i < NumStackSymbol; ++i){
        Data >> symbol;                                                     // get the info
        StackAlphabet.push_back(symbol);                                    //save it!
    }

    Data >> garbage;                                                        // == Read the ∂: ==
    Data >> NumFuntions;                                                    //get the size

    for (int i = 0; i < NumFuntions; ++i){                                  //for each funtion
        std::string key, action;                                            //temporal strings
        Data >> garbage;                                                    // (
        Data >> key;                                                        // qx
        Data >> garbage;                                                    // ,
        key += garbage;                                                     // qx , 
        Data >> garbage;                                                    // s
        key += garbage;                                                     // qx,s
        Data >> garbage;                                                    // ,
        key += garbage;                                                     // qx,s,
        Data >> garbage;                                                    // z
        key += garbage;                                                     // qx,s,z

        Data >> garbage;                                                    // )->(
        Data >> garbage;                                                    // qy
        action += garbage;                                                  // qy
        Data >> garbage;                                                    // ,
        action += garbage;                                                  // qy ,
        Data >> garbage;                                                    // action
        action += garbage;                                                  // qy,action
        Data >> garbage;                                                    // )

        FnTransicion[key] = action;                                         //Save it!
    }
    Data.close();                                                           //Good bye Data :'/
    StartAutomata();                                                        //Lets start the automata
}


/*==================================================
========   SHOW ME THE INFO OF THE PDA    ==========
==================================================*/
void PDA::ShowMeInfo(){                                                     //======= SHOW THE INFO =======
    std::cout<<"\n=====  INFO OF THE PDA  ========";                        //Welcome message
    int NumStates = States.size();                                          //Just a temporal variable

    std::cout<<"\n\nQ  (States): "<< NumStates;                             //Show it!

    std::cout<<"\n\nq0 (Initial State): q"<<StartState;                     //Show it!

    std::cout<<"\n\nz0 (Initial Stack): "<<StartStack;                      //Show it!

    std::cout<<"\n\nF  (Final States): "<<FinalStates.size()<<"\n";         //Show it! 
    for (const auto& x : FinalStates) std::cout<<" - q"<<x<<"\n";           //All states

    std::cout<<"\n\nΣ  (Alphabet): "<<Alphabet.size()<<"\n";                //Show it! 
    std::cout<<" "<<Alphabet[0];                                            //Show it! , the 1rst
    for (int i = 1; i < Alphabet.size(); i++) std::cout<<", "<<Alphabet[i]; //Show it! 

    std::cout<<"\n\nG  (Stack Alphabet): "<<StackAlphabet.size()<<"\n";     //Show it! 
    std::cout<<" "<<StackAlphabet[0];                                       //Show it! , the 1rst
    for (int i = 1; i < StackAlphabet.size(); i++)                          //Show it! 
        std::cout<<", "<<StackAlphabet[i];                                  //Show it!

    std::cout<<"\n\n∂  (Transtition Funtions): "<<FnTransicion.size()<<"\n";//Show it! 
    for (const auto& x : FnTransicion)                                      //Travel to 
        std::cout<<" - "<<x.first<<" = "<<x.second<<"\n";                   //All states
}



/*===========================================================
======  LET'S RUN ONLY ONE LETTER IN THE AUTOMATA   =========
===========================================================*/
bool PDA::RunAutomata(char symbol, bool ShowIt){                            //============= THIS IS THE GOOD PART !! ========== 
    if (!AtValidState) return false;                                        //We almost do it!

    if(!(std::find(Alphabet.begin(),Alphabet.end(),symbol)!=Alphabet.end()))//If there are no symbols
        {AtValidState = false; return false;}

    std::string action, key = "q";                                          //Now start a key 
    key+=(std::to_string(ActualState)+","+symbol+","+AutomataStack.top());  //Create the key for the funtion 

    auto exists = FnTransicion.find(key);                                   //How much I love auto <3
    if (exists == FnTransicion.end()){AtValidState = false; return false;}  //All is ok?

    action = FnTransicion[key];                                             //We have now the action that we want to do
    
    if (ShowIt) std::cout << "∂(" <<key << ") = " << action ;               //show me this

    char StackAction = action.back();                                       //get me the actions of the stack
    
    action.pop_back();                                                      //remove the stackaction
    action.pop_back();                                                      //remove ,
    action.erase (action.begin(),action.begin()+1);                         //remove q
    ActualState = atoi(action.c_str());                                     //get me the next state to jump 
    
    if (StackAction == '*') AutomataStack.pop();                            //if we call this you mean to pop an element
    else AutomataStack.push(StackAction);                                   //else you tell me what to push

    if (ShowIt){                                                            //Optional: Remove it if you dont want it!
        std::cout << "\t\tStack at this moment: ";                          //Now, lets have a copy Stack
        std::stack<char> CopyStack = AutomataStack;                         //This is the copy stack
        while (!CopyStack.empty()){                                         //So for eache element of the stack
            char TemporalSymbol = CopyStack.top(); CopyStack.pop();         //This should be more easy, im stupid
            std::cout << "[" << TemporalSymbol << "]" ;                     //Show it!
        }
    }

    std:: cout << "\n";
    return true;                                                            //Todo bien
}



/*===========================================================
========    ANALIZA UN ARCHIVO ENCONTRANDO PALABRAS    ======
===========================================================*/

void PDA::AnalizeFile(char *File, char *OkFile, bool Show){                 //============= THIS IS JUST FOR FREE JOB!! ========== 
    if(Show) std::cout << "\n\n=== THE PDA IS FINDING VALID STRINGS";       //Showing a little message
    if(Show) std::cout << " I WILL SHOW YOU THE VALID STRINGS ===\n\n";     //Showing a little message

    StartAutomata();                                                        //Lets start the automata

    char SymbolToAnalyze, SymbolToWrite;                                    //Lets have some variables to store data 
    bool StringIsOk = false, LastOneWasValid = true;                        //This will check is is a valid letter

    FILE *ReadingFile, *AuxiliarFile, *AceptFile;                           //Let this be ours readers

    fclose(fopen(OkFile, "w"));                                             //Lets start, by cleaning all
    
    ReadingFile = fopen(File, "r");                                         //Lets open our readers
    AuxiliarFile = fopen(File, "r");                                        //Lets open our readers
    AceptFile = fopen(OkFile, "a");                                         //Lets open our readers


    while(true){                                                            //We will be doomed forever :0
        SymbolToAnalyze = fgetc(ReadingFile);                               //Lets get a symbol from the File                 

        if (RunAutomata(SymbolToAnalyze, Show) == true){                    //If the Automata has recived a valid symbol
            StringIsOk = ImAtFinalState();                                  //Keep a check it's at a final state rigth now
        }
        else{                                                               //Sino acepto que la letra
            if (StringIsOk && Show){                                        //If it ended reading a valid string & at final state
                std::cout << "Valid String: '";                             //Show it!
                LastOneWasValid = true;                                     //Dont show spaces!
            } 
            else  LastOneWasValid = false;                                  //Show spaces!

            while((SymbolToWrite=getc(AuxiliarFile)) != SymbolToAnalyze){   //Lets move our 2nd pointer to catch up

                if(LastOneWasValid == false){                               //So, the last one wasnt valid
                    std::cout << "\n\n";                                    //You should have some space
                    LastOneWasValid = true;                                 //And now we are at a valid string
                }

                if(StringIsOk){                                             //And If the string was a valid string
                    if (Show) std::cout << SymbolToWrite;                   //Lets by screeen the symbol
                    fprintf(AceptFile, "%c", SymbolToWrite);                //And save it to the ok file
                }
            }
 
            if (StringIsOk){                                                //An at the end if it was a valid string
                fprintf(AceptFile, "\n");                                   //Lets save an enter at the file
                if(Show) std::cout << "'\n\n";                              //And show some spaces at screen
            }

            StartAutomata();                                                //Lets start the automata for another round
            StringIsOk = false;                                             //Suppose thata the next string wont be a valid one
            
            if(SymbolToAnalyze == EOF) break;                               //If you finished reading all the symbols ¡Go away!
        }
    }

    fclose(ReadingFile);                                                    //Close it ¡We dont want it any more!
    fclose(AuxiliarFile);                                                   //Close it ¡We dont want it any more!
    fclose(AceptFile);                                                      //Close it ¡We dont want it any more!

}

