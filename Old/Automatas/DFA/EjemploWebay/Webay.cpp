/*=======================================================================
==========          			TERMINA EN ING          	 ============
========================================================================*/
#include "../DFA.cpp"

int main(){                                                                                 	//=== FUNCION PRINCIPAL ========
	bool Mostrar;
	char Decision;
	std::cout << "== Bienvenidos a Termina ING ==\n\n¿Deberia mostrarte el proceso?: (S/N) ";	//menu
	std::cin >> Decision;																		//Veamos que dice el usr

	if(Decision == 's' || Decision == 'S') Mostrar = true;										//Desiciones
	else Mostrar = false;																		//Desiciones

    DFA A1("ConfiguracionWebay.txt");                                      						//Generemos un automata
    if (Mostrar) A1.InformacionDelDFA();                                                       	//Y mostremos el automata
    A1.AnalizarArchivo((char*)"CadenasWebay.txt", (char*)"AceptadasWebay.txt", Mostrar);			//Y analizamos nuestro archivo  
}

