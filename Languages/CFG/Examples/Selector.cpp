/*=======================================================================
==========                      ACABA EN 01                  ============
========================================================================*/

#include "../CFG.cpp"
int main(){                                                                     //=== FUNCION PRINCIPAL ========
    srand(time(NULL));                                                          //Random!
    rand();                                                                     //Random!
    bool ShowIt = false;                                                        //Show it!
    char Decision;                                                              //Choose to see or not to see
    int TypeOfGFC;                                                              //Get the name of TypeOfGFC
    std::string ConfFile = ":D";                                                //Get the name of the GFC

    std::cout << "== SELECT A CFG ==\n\n1)Palindrome \t2)Naturals\t3)Equals";   //Show the menu
    std::cout << "\t4)0^n1^n \t5)If - Else\n\n";                                //Show the menu
    std::cin >> TypeOfGFC;

    if (TypeOfGFC == 1) ConfFile = "Palindrome.txt";                            //Show it!
    if (TypeOfGFC == 2) ConfFile = "Naturals.txt";                              //Show it!
    if (TypeOfGFC == 3) ConfFile = "Equal0Equal1.txt";                          //Show it!
    if (TypeOfGFC == 4) ConfFile = "0^n1^n.txt";                                //Show it!
    if (TypeOfGFC == 5) ConfFile = "HorribleExample.txt";                       //Show it!

    std::cout << "== SELECTOR ==\n\nShow Process?: (S/N) ";                     //Show the menu
    std::cin >> Decision;                                                       //Lets see what choose the usr

    if(Decision == 's' || Decision == 'S') ShowIt = true;                       //Desiciones
    else ShowIt = false;                                                        //Desiciones

    CFG A1(ConfFile);                                                           //Create one
    if (ShowIt) A1.ShowMeInfo();                                                //Show info

    A1.SomeStringsinFile(true);                                                 //Get some string into File

}
