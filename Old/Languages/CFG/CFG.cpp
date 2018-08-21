/*=======================================================================
==========                CFG: CONTEXT FREE GRAMMAR             =========
========================================================================*/
#include <iostream>                                                         // I will need this
#include <string>                                                           // I will need this
#include <sstream>                                                          // I will need this
#include <fstream>                                                          // I will need this
#include <vector>                                                           // I will need this
#include <map>                                                              // I will need this
#include <algorithm>                                                        // I will need this
#include <stack>                                                            // I will need this
#include <ctime> 
#include <set>                                                              // I will need this

using namespace std;

/*==================================================
=======    DEFINE A CONTEXT FREE GRAMMAR   =========
==================================================*/
class CFG{                                                                  //============== MY CLASS ======================
    private:                                                                //my private parts
        set<char> Terminals;                                                //Terminal Alphabelt
        set<char> Variables;                                                //Variables 

        char StartSymbol;                                                   //StartSymbol

        map<char, vector<string>> Production;                               //Production Symbol

    public:                                                                 //Your methods, for you

        void ShowMeInfo();                                                  //Give me info
        CFG(string FileName);                                               //Lets get the info
        
        string CreateString(bool ShowIt);                                   //Start Recursion
        string CreateString(string Data, bool ShowIt);                      //Start Recursion

        void SomeStringsinFile(bool ShowIt);                                //Create something in File
};

/*==================================================
========          GET ALL THE DATA        ==========
==================================================*/
CFG::CFG(string FileName){                                                  //============== THIS IS WHERE MAGIC COMES ====== 
    string garbage, action;                                                 //This will be the garbage collector

    int NumTerminals, NumVariables, NumFuntions, NumDuplicates;             //Some counters
    char ActualSymbol;                                                      //Get the symbol

    ifstream Data(FileName.c_str());                                        //This will be my file

    Data >> garbage;                                                        //Read only title
    Data >> garbage;                                                        // == Read t: ===
    Data >> NumTerminals;                                                   //Now read the NumTerminals

    for (int i = 0; i < NumTerminals; ++i){                                 //For each terminal
        Data >> ActualSymbol;                                               //Get it!
        Terminals.insert(ActualSymbol);                                     //Insert it!
    }

    Data >> garbage;                                                        // == Read t: ===
    Data >> NumVariables;                                                   //Now read the NumTerminals

    for (int i = 0; i < NumVariables; ++i){                                 //For each terminal
        Data >> ActualSymbol;                                               //Get it!
        Variables.insert(ActualSymbol);                                     //Insert it!
    }

    Data >> garbage;                                                        // == Read V0: ==
    Data >> StartSymbol;                                                    //get the size

    Data >> garbage;                                                        // == Read the ∂: ==
    Data >> NumFuntions;                                                    //get the size

    for (int i = 0; i < NumFuntions; ++i){                                  //For each funtion
        Data >> NumDuplicates;                                              //Get me if the are more than one rule
        vector<string> Rules;                                               //Get a vector for rules
        for (int j = 0; j < NumDuplicates; ++j, ++i){                       //For each rules
            Data >> ActualSymbol;                                           //Get char
            Data >> garbage;                                                //Get the symbol "->"
            Data >> action;                                                 //Get the action rule
            Rules.push_back(action);                                        //Add to rules
        }
        Production[ActualSymbol] = Rules;                                   //Add to production
    }
    Data.close();                                                           //Good bye Data :'/
}

/*==================================================
========   SHOW ME THE INFO OF THE CFG    ==========
==================================================*/
void CFG::ShowMeInfo(){                                                     //============= SHOW THE INFO ==================
    cout << "\n=====  INFO OF THE CFG  ========";                           //Welcome message

    cout << "\n\nT  (Terminals): " << Terminals.size() << "\n";             //Show it! 
    for (const auto& x : Terminals) cout << " * " << x << "\n";             //All states

    cout << "\n\nV  (Variables): " << Variables.size() << "\n";             //Show it! 
    for (const char& x : Variables){                                        //For each variable
        if ( x == StartSymbol) cout << " * " << x << "  <- StartSymbol \n"; //If you are start symbol
        else cout << " * " << x << "\n";                                    //All states   
    }

    cout<<"\n\nP (Production / Derivation): ";                              //Show it! 
    for (const auto& GroupRules : Production){                              //For each variable
        cout << "\n" << GroupRules.first << " -> \n";                       //Show it
        for (const auto& Rule : GroupRules.second)                          //For each rule
            cout << "     " << Rule << "\n";                                //Write it!
    }
}


/*==================================================
======      IMPORTANT FUNCION FOR GFC   ============
==================================================*/
string CFG::CreateString(bool ShowIt){                                      //============ START A RECURSION ================
    cout << "\n\n\n === CREATE STRING ====\n";                              //Message
    string StartSymbolString(1, StartSymbol);                               //Create a initial string

    return CreateString(StartSymbolString, ShowIt);                         //Recursion
}

string CFG::CreateString(string Data, bool ShowIt){                         //============ THE ACTUAL FUNCTION ==============
    if (Data.length() > 1000) return ":(";                                  //Some security

    string message;                                                         //Create a message
    
    bool UseRule = false;                                                   //we have use a replace
    for (const char& Variable : Variables){                                 //For each Variable
        message += ("[Data: " + Data + "] ");                               //Get the data
        
        for (const char& Symbol : Data){                                    //For each symbol in the data
            if (Symbol == Variable){                                        //If we found a variable
                UseRule = true;                                             //Use a Rule

                auto Rules = Production[Variable];                          //Get the rule
                auto Rule = Rules[rand()%Rules.size()];                     //Get a random rule
                message += "[Rule: ";                                       //Message
                message += Symbol;                                          //Message
                message += " -> " + Rule + "] ";                            //Message

                vector<int> PlaceVariables;                                 //Store the places
                for (int i = 0; i < Data.length(); ++i)                     //Find it!
                    if (Data[i] == Variable) PlaceVariables.push_back(i);   //Store it!

                int Place = PlaceVariables[rand() % PlaceVariables.size()]; //Select random

                if (Rule == "epsilon") Data.erase(Place,1);                 //Special case
                else Data.replace(Place, 1, Rule);                          //Normal case

                message += "[" + Data + "]\n";                              //Show the new one
                break;                                                      //Try for new variable
            }   
        }        
    }

    if (UseRule) {                                                          //If we are not last
        cout << message;                                                    //Itermediare State, show it!                    
        //getchar();                                                        //SPECIAL CASE, SEE CASE BY CASE
    }                                           
    else return Data;                                                       //Else, return the String
    
    return CreateString(Data, ShowIt);                                      //Continue recurstion!
}

void CFG::SomeStringsinFile(bool ShowIt){                                   //=========== CREATE A NEW FILE AND STRINGS ======
    ofstream OutFile;                                                       //This will be the stream
    OutFile.open("StringExamples.txt", ofstream::out | ofstream::trunc);    //Open and erase it!
    OutFile.close();                                                        //Delate all !

    OutFile.open ("StringExamples.txt");                                    //Open the file

    OutFile << "EXAMPLES: \n";                                              //Create a File
    for (int i = 0; i < 50; ++i)                                            //Create the 50 strings
        OutFile << (i+1) << ":" << CreateString(true) << "\n";              //Some space
    
    OutFile.close();
}
