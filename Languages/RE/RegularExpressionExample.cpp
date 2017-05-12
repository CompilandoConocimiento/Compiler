/*=============================================================
==========          EXAMPLE: L((0+10)*(ε+1))           ============
==============================================================*/
#include <random>
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::random_device rd;                                      //This will create a cool random number
    std::mt19937 mt(rd());                                      //This will create a cool random number

    std::uniform_int_distribution<int> CerraduraKleen(0, 30);   //Parametros
    std::uniform_int_distribution<int> dado(0, 1);              //Parametros
    std::ofstream OutFile;

    OutFile.open ("ExampleRegularExpression.txt");              //Open the file
    OutFile << "EXAMPLE: L((0+10)*(ε+1))\n";                        //Create a File

    for (int i = 0; i < 1000; ++i){                             //Create the 50 strings
        OutFile << i << ":";                                    //Number of string
        std::string temporal = "";                              //Create this

        //Create (0+10)
        if (dado(mt) == 1) temporal += "0";                     //Option 1
        else temporal += temporal += "10";                      //Option 2

        //Crete (0+10)*
        int veces = CerraduraKleen(mt);                         //How many times
        for (int i = 0; i < veces; ++i) OutFile << temporal;    //Write it!


        //Crete (0+10)*(ε+1)
        if (dado(mt) == 1) OutFile << "1";                      //Option 1 (The other is null :p)

        OutFile << "\n";                                        //Some space
    }

    OutFile.close();
}