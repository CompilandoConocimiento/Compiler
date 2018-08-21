/*=======================================================================
==========          AUTOMATA FINITO    DETERMINISTICO         ===========
========================================================================*/

#include <iostream>                                                         // Librerias
#include <string>                                                           // Librerias
#include <sstream>                                                          // Librerias
#include <fstream>                                                          // Librerias
#include <vector>                                                           // Librerias
#include <map>                                                              // Librerias
#include <algorithm>                                                        // Librerias


/*==================================================
========    DEFINAMOS A UN AUTOMATA       ==========
==================================================*/
typedef struct{                                                             //============= Nodo de nuestro automata ====
    int Nombre;                                                             //Numero de nodo que eres (un ID)
    std::map <char, int> FnTransicion;                                      //Guardamos una fn individual de a donde apunta
    bool EresEstadoFinal;                                                   //¿Eres el estado final?
}Estado;                                                                    //LLamare a esto Estado

class DFA{                                                                  //============== CLASE AUTOMATA =============
    private:                                                                //Mis variables, no tus variables

        std::vector<Estado> EstadosDelDFA;                                  //Es el Vector de Estados para trabajar
        short int EstadoInicial;                                            //Nos apunta a un estado inicial
        std::vector<char> Alfabeto;                                         //Y esto es nuestro alfabeto
        std::vector<int> EstadosFinales;                                    //Subconjuntos de Estados finales
        
        Estado *EstadoActual;                                               //Crea un Estado Actual
        bool ElAutomataPuedeSeguir;                                         //Nos dice si el automata aun puede llegar qfinal
        bool ElAutomataEstaEnQValido;                                       //Nos dice si estamos en un estado valido

    public:                                                                 //Tus metodos, para ti
        
        DFA(std::string nombreArchivo);                                     //Crea nuestro automata
        void InformacionDelDFA();                                           //Muestra la Tabla del Automata

        bool CorreElAutomata(char Letra, bool Muestro);                     //Mueve solo una linea al automata
        void AnalizarArchivo(char *Lectura, char *Aceptada, bool Muestra);  //Mueve todo un archivo

        void ReiniciaAutomata(){                                            //Funcion Auxiliar: Regresa el estado incial
            EstadoActual = &EstadosDelDFA[EstadoInicial];                   //Apuntamos al estado inicial
            ElAutomataPuedeSeguir = true;                                   //Suponemos que simpre tendras posibilidades
            ElAutomataEstaEnQValido = true;                                 //Suponemos que simpre tendras posibilidades
        }

        bool EstoyEnEstadoFinal(){                                          //Funcion Auxiliar: Nos dice si gano
            if(!ElAutomataPuedeSeguir) return false;                        //Sino, ya valio
            if(!ElAutomataEstaEnQValido) return false;                      //Sino, ya valio
            return EstadoActual->EresEstadoFinal;                           //Sino, dejalo elegir
        }
};


/*==================================================
========    EL AUTOMATA TODA LOS DATOS    ==========
==================================================*/
DFA::DFA(std::string nombreArchivo){                                        //============== ES DONDE SALE LA MAGIA======= 
    std::string basura;                                                     //Este sera el recolector de basura del txt
    int NumeroDeEstados, numDeFinales, numSimbolos, temporal;               //Algunas variables necesarias
    char letra;                                                             //Algunas variables necesarias

    std::ifstream EntradaDeDatos(nombreArchivo.c_str());                    //Este sera el archivo de la informacion
    EntradaDeDatos >> basura;                                               //Leemos el titulo del archivo y lo ignoramos

    EntradaDeDatos >> basura;                                               // == Leemos Q: ===
    EntradaDeDatos >> NumeroDeEstados;                                      //Leemos el numero de estado
    EstadosDelDFA.resize(NumeroDeEstados);                                  //Numero de Estados
    std::vector<bool> EstadosFinalesCubeta(NumeroDeEstados, false);

    EntradaDeDatos >> basura;                                               // == Leemos el q0: ==
    EntradaDeDatos >> EstadoInicial;                                        //Y lo apuntamos aqui

    EntradaDeDatos >> basura;                                               // == Leemos el F: ==
    EntradaDeDatos >> numDeFinales;                                         //Y lo apuntamos aqui

    for (int i = 0, temporal; i < numDeFinales; i++){                       //Leamos cada final
        EntradaDeDatos >> temporal;                                         //Y lo vamos guardando
        EstadosFinalesCubeta[temporal] = true;                              //Y lo cambiamos a true
        EstadosFinales.push_back(temporal);                                 //Guardando
    }

    EntradaDeDatos >> basura;                                               // == Leemos el Σ: ==
    EntradaDeDatos >> numSimbolos;                                          //Y lo apuntamos aqui

    for (int i = 0 ; i < numSimbolos; i++){                                 //Leamos cada letra
        EntradaDeDatos >> letra;                                            //Y lo vamos guardando
        Alfabeto.push_back(letra);                                          //Guardando
    }

    EntradaDeDatos >> basura >> basura;                                     // == Leemos el ∂: ==
    for (int i = 0, EstadoActual; i < NumeroDeEstados; i++){                //Leamos cada final
        EntradaDeDatos >> EstadoActual;                                     //Y guardemos en que estado estamos
        EstadosDelDFA[i].Nombre = EstadoActual;                             //Y le damos un nombre
        EstadosDelDFA[i].EresEstadoFinal = EstadosFinalesCubeta[i];         //Y guardamos ahora si si es un estado final

        char letraQueLeo;                                                   //Veamos la direccion
        int sigEstado;  

        for (int j = 0; j < Alfabeto.size(); j++)                           //Para cada letra del alfabeto                 
            EstadosDelDFA[i].FnTransicion[Alfabeto[j]] = EstadoInicial;     //Supongamos que apuntan al origen

        while(true){
            EntradaDeDatos >> letraQueLeo;                                  //Vemos que letra leemos
            if(letraQueLeo == '=') break;                                   //Si es esta corremos
            EntradaDeDatos >> sigEstado;                                    //Y guardamos el numero

            EstadosDelDFA[i].FnTransicion[letraQueLeo] = sigEstado;         //Y le decimos ahora a donde apunta        
        }
        EntradaDeDatos >> letraQueLeo;                                      //Leemos el otro = que esta
    }
    ReiniciaAutomata();
}


/*==================================================
========   MOSTRAMOS INFORMACION DEL DFA  ==========
==================================================*/
void DFA::InformacionDelDFA(){                                              //======= VAMOS A MOSTRAR A NUESTRO AUTOMATA =======
    std::cout<<"\n=====  INFORMACION DEL DFA  ========";                    //Mensaje de bienvenida


    std::cout<<"\n\nQ  (Cantidad de Estados): "<< EstadosDelDFA.size();     //Y lo mostramos por pantalla
    std::cout<<"\n\nq0 (Estado Inicial): q"<<EstadoInicial;                 //Y lo mostramos por pantalla

    std::cout<<"\n\nF  (Estados Finales): "<<EstadosFinales.size()<<"\n";   //Y lo mostramos por pantalla    
    for (int i = 0; i < EstadosFinales.size(); i++)                         //Y para cada uno 
        std::cout<<" - q"<<EstadosFinales[i]<<"\n";                         //Lo mostramos

    std::cout<<"\nΣ  (Alfabeto): \n";                                       //Y lo mostramos por pantalla 
    std::cout<<" "<<Alfabeto[0];                                            //Lo mostramos
    for (int i = 1; i < Alfabeto.size(); i++) std::cout<<", "<<Alfabeto[i]; //Lo mostramos por pantalla

    for (int i = 0, temporal; i < EstadosDelDFA.size(); i++){               //Para cada elemento del automata
        std::cout<<"\n\n == Estado "<<i<<": ===\n";                         //Muestro un mensajito

        for (int j = 0, apuntador; j < Alfabeto.size(); ++j){               //Para cada letra
            char temporal = Alfabeto[j];                                    //Vamos a probar con a, b, c..
            apuntador=EstadosDelDFA[i].FnTransicion.find(temporal)->second; //Vamos a ver a donde apuntas
            std::cout<<" (q"<<i<<",'"<<temporal<<"') = q"<<apuntador<<"\n"; //Mostramos por pantalla 
        }
    }
}


/*===========================================================
========     EJECUTA SOLO UNA LINEA DEL AUTOMATA    =========
===========================================================*/
bool DFA::CorreElAutomata(char Letra, bool Muestro){                        //============= ESTO ES LO BUENO !! ========== 

    if(ElAutomataPuedeSeguir == false) return false;                        //Ya termino la cadena!
    

    for (int i = 0; i < Alfabeto.size(); i++){                              //Recorremos el alfabeto
        if(Alfabeto[i] == Letra) break;                                     //Si encontre la letra dentro sal

        if(i == (Alfabeto.size()-1)){                                       //Si llegaste aqui es que no esta
            ElAutomataPuedeSeguir = false;                                  //pero obvio no puedes seguir
            return ElAutomataPuedeSeguir;                                   //bye
        }
    }

    if(ElAutomataEstaEnQValido == false) return true;                       //Si ya estas en un estado invalido, para que le hacen
    
    if(EstadoActual->FnTransicion.count(Letra) == 0){                       //Si hay una transicion valida
        ElAutomataEstaEnQValido = false;                                    //Si hay una transicion valida
        return true;                                                        //Si hay una transicion valida
    }
    if (EstadoActual->FnTransicion[Letra] == -1){                               
        ElAutomataEstaEnQValido = false;                                    //Si hay una transicion valida
        return true;                                                        //Si hay una transicion valida
    }
    
    if(Muestro) std::cout<<"\n(q"<<EstadoActual->Nombre<<", '"<<Letra;      //Mensajes

    EstadoActual = &EstadosDelDFA[EstadoActual->FnTransicion[Letra]];       //Vamos al siguiente estado
    if(Muestro) std::cout<<"') = q"<<EstadoActual->Nombre;                  //Mensajes

    return true;                                                            //Todo bien
}


/*===========================================================
========    ANALIZA UN ARCHIVO ENCONTRANDO PALABRAS    ======
===========================================================*/

void DFA::AnalizarArchivo(char *Lectura, char *Aceptada, bool Muestra){     //============= ESTO ES LO BUENO !! ========== 
    
    FILE *CadenasDeLectura, *CadenaAuxiliar, *CadenaAceptadas;              //Sean nuestros lectores
    
    fclose(fopen(Aceptada, "w"));                                           //Empecemos por borrar lo que teniamos
    
    CadenasDeLectura = fopen(Lectura, "r");                                 //Abramos nuestras archivos
    CadenaAuxiliar = fopen(Lectura, "r");                                   //Abramos nuestras archivos
    CadenaAceptadas = fopen(Aceptada, "a");                                 //Abramos nuestros archivos
    
    char LetraQueAnalizo, LetraEscribir;                                    //Tengamos una letra temporal
    bool LaCadenaPaso = false;                                              //Y veamos si la cadena paso

    if(Muestra) std::cout << "\n\n=== AUTOMATA BUSCANDO CADENAS";           //Mostramos mensajito
    if(Muestra) std::cout << " VALIDAS Y MOSTRANDO ===\n\n";                //Mostramos mensajito

    while(true){                                                            //Sigamos eternamente XD
        LetraQueAnalizo = fgetc(CadenasDeLectura);                          //Leemos una letra                       

        if (CorreElAutomata(LetraQueAnalizo, Muestra) == true){             //Si acepto la letra actual
            LaCadenaPaso = EstoyEnEstadoFinal();                            //Y vemos si paso sabiendo si esta en estado final
        }
        else{                                                               //Sino acepto que la letra
            
            if(LaCadenaPaso && Muestra) std::cout << "\nCadenaPaso: '";     //Pero llegamos justo al final de la cadena

            while((LetraEscribir=getc(CadenaAuxiliar))!=LetraQueAnalizo){   //Mientras mi puntero vaya atras
                if(LaCadenaPaso){                                           //Y si la caden paso
                    if(Muestra) printf("%c", LetraEscribir);                //Ve mostrando cual cadena paso
                    fprintf(CadenaAceptadas, "%c", LetraEscribir);          //Guardemos en el archivo
                }
            }

            if (LaCadenaPaso){                                              //Y si la cadena paso
                fprintf(CadenaAceptadas, "\n");                             //Guardemos en el archivo
                if(Muestra) std::cout << "'\n";                             //Espacios de Estilo
            }

            std::cout << "\n";

            ReiniciaAutomata();                                             //Reiniciamos el automata
            LaCadenaPaso = false;                                           //Pero suponemos que no ha pasado la cadena
            
            if(LetraQueAnalizo == EOF) break;                               //Si ya llegaste al final de la cadena, sal!
        }
    }

    fclose(CadenasDeLectura);                                               //Cierras el archivo
    fclose(CadenaAuxiliar);                                                 //Cierras el archivo
    fclose(CadenaAceptadas);                                                //Cierras el archivo

}

