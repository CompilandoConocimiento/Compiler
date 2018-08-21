/*=======================================================================
==========           TURING MACHINES SELECTOR                ============
========================================================================*/

#include "../TuringMachine.cpp"										
using namespace std;

int main(){                                                                     //=== PRINCIPAL FUNCTION ========

    bool ShowIt = false;                                                        //Show it!
    char Decision;                                                              //Choose to see or not to see
    int TypeOfTuringMachine;                                                   	//Get the name of TuringMachine
    string ConfFile = ":D";                                                		//Get the name of the TuringMachine

    cout << "== SELECT A TURING MACHINE ==\n\n";								//Selector
    cout << "1)0^n1^n\n\n";                                						//Show the menu
    cin >> TypeOfTuringMachine;													//Take info!

    if (TypeOfTuringMachine == 1) ConfFile = "0^n1^n.txt";                     	//Show it!

    cout << "== SELECTOR ==\n\nShow Process?: (Y/N) ";                     		//Show the menu
    cin >> Decision;                                                       		//Lets see what choose the usr

    if (Decision == 'Y' || Decision == 'y') ShowIt = true;                      //Desiciones
    else ShowIt = false;                                                        //Desiciones

    string TestCase;
    cout << "\n\nGive me a TestString: ";
    cin >> TestCase;

    TuringMachine T1(ConfFile);                                               	//Create one
    if (ShowIt) T1.ShowMeInfo();                                                //Show info
    T1.RunMachine(TestCase, true);
}