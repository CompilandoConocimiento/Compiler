/*=======================================================================
==========                      PROTOCOLO                      ==========
========================================================================*/
#include "../DFA.cpp"
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <unistd.h>



int main(){                                                                                     //=== FUNCION PRINCIPAL ========
    bool Mostrar;
    char Decision;
    std::cout << "== Bienvenidos a Protocolo ==\n\n¿Deberia mostrarte el proceso?: (S/N) ";       //menu
    std::cin >> Decision;                                                                       //Veamos que dice el usr

    if(Decision == 's' || Decision == 'S') Mostrar = true;                                      //Desiciones
    else Mostrar = false;                                                                       //Desiciones

    DFA A1("ConfiguracionProtocolo.txt");                                                       //Generemos un automata
    if (Mostrar) A1.InformacionDelDFA();                                                        //Y mostremos el automata

    srand(time(NULL));


                                     

    do{
        fclose(fopen("CadenasProtocolo.txt", "w"));                          
        std::cout << "\n\nGenerando las cadenas Aleatorias";
        usleep(1000000);

        std::ofstream CadenasRandom("CadenasProtocolo.txt");

        for (int i = 0; i < 50; i++){
            std::string cadena;
            for (int j = 0; j < 8; j++){
                int letra = rand() % 12;
                if(letra<6) cadena += '1';
                else cadena += '0';
            }
            CadenasRandom << cadena << "\n";
        }
        CadenasRandom.close();

        A1.AnalizarArchivo((char*)"CadenasProtocolo.txt", (char*)"AceptadasProtocolo.txt", Mostrar);
    }
    while(rand()%2 == 0);
    



}