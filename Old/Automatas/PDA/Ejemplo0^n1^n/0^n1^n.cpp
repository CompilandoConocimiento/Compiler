/*=======================================================================
==========          			ACABA EN 01         	     ============
========================================================================*/

#include "../PDA.cpp"
int main(){                                                                                 	 //=== FUNCION PRINCIPAL ========
	bool Mostrar = false;
	char Decision;
	std::cout << "== 0^n 1^n ==\n\n¿Deberia mostrarte el proceso?: (S/N) ";	 //menu
	std::cin >> Decision;																		 //Veamos que dice el usr

	if(Decision == 's' || Decision == 'S') Mostrar = true;										 //Desiciones
	else Mostrar = false;																		 //Desiciones

	PDA A1("Configuracion0^n1^n.txt");                                               	 	     //Generemos un automata
    if (Mostrar) A1.ShowMeInfo();                                                         		 //Y mostremos el automata
    A1.AnalizeFile((char*)"Cadenas0^n1^n.txt", (char*)"Aceptadas0^n1^n.txt", Mostrar);   		 //Y analizamos nuestro archivo

}