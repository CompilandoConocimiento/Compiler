/*=======================================================================
==========          		ACABA EN WEB O EN EBAY     		 ============
========================================================================*/
#include "../NFA.cpp"

int main(){                                                                                 	 //=== FUNCION PRINCIPAL ========
	bool Mostrar = false;
	char Decision;
	std::cout << "== Bienvenidos a WEBAY ==\n\n¿Deberia mostrarte el proceso?: (S/N) ";	 		 //menu
	std::cin >> Decision;																		 //Veamos que dice el usr

	if(Decision == 's' || Decision == 'S') Mostrar = true;										 //Desiciones
	else Mostrar = false;																		 //Desiciones

    NFA A1("ConfiguracionWebayNFA.txt");                                               	 	     //Generemos un automata
    if (Mostrar) A1.InformacionDelNFA();                                                         //Y mostremos el automata
    A1.AnalizarArchivo((char*)"CadenasWebayNFA.txt", (char*)"AceptadasWebayNFA.txt", Mostrar);   //Y analizamos nuestro archivo  
}