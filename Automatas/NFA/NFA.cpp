/*=======================================================================
==========          AUTOMATA FINITO NO DETERMINISTICO         ===========
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
    std::vector <std::pair<char,int> > FnTransicion;                        //Guardamos una fn individual de a donde apunta
    bool EresEstadoFinal;                                                   //¿Eres el estado final?
}Estado;                                                                    //LLamare a esto Estado

class NFA{                                                                  //============== CLASE AUTOMATA =============
    private:                                                                //Mis variables, no tus variables
        std::vector<Estado> EstadosDelNFA;                                  //Es el Vector de Estados para trabajar
        short int EstadoInicial;                                            //Nos apunta a un estado inicial
        std::vector<char> Alfabeto;                                         //Y esto es nuestro alfabeto
        std::vector<int> EstadosFinales;                                    //Subconjuntos de Estados finales

        std::vector <Estado> EstadosVivosNFA;                               //Aqui tendremos los estados vivos del NFA
        bool ElAutomataPuedeSeguir;                                         //Nos dice si el automata aun puede llegar qfinal
        bool ElAutomataEstaEnQValido;                                       //Nos dice si estamos en un estado valido



    public:                                                                 //Tus metodos, para ti
        NFA(std::string nombreArchivo);                                     //Crea nuestro automata
        void InformacionDelNFA();                                           //Muestra la Tabla del Automata
        bool CorreElAutomata(std::string Palabra, bool Muestro);            //Ponemos al automata a trabaja
        bool CorreElAutomata(char Letra, bool Muestro);                     //Mueve solo una linea al automata
        void AnalizarArchivo(char *Lectura, char *Aceptada, bool Muestra);  //Mueve todo un archivo

        void ReiniciaAutomata(){                                            //Funcion Auxiliar: Regresa el estado incial
            ElAutomataPuedeSeguir = true;                                   //Suponemos que simpre tendras posibilidades
            ElAutomataEstaEnQValido = true;                                 //Suponemos que simpre tendras posibilidades
            EstadosVivosNFA.clear();                                        //Saquemos las cosas del vector
            EstadosVivosNFA.push_back(EstadosDelNFA[EstadoInicial]);        //Y añadamos el {qo}
        }

        bool ElAutomataPuedeLlegarAEstadoFinal(){                           //Funcion Auxiliar: Obtener Estado
            if (!ElAutomataPuedeSeguir) return false;                       //Sino, ya valio
            return true;                                                    //Veamos eso
        }

        bool EstoyEnEstadoFinal(){                                          //Funcion Auxiliar: Nos dice si gano
            if(!ElAutomataPuedeSeguir) return false;                        //Sino, ya valio

            for (int i = 0; i < EstadosVivosNFA.size(); i++){               //Al final de todo mostremos para cada estado vivo
                for (int j = 0; j < EstadosFinales.size(); j++){            //Revisemos con los los estados finales
                    if(EstadosVivosNFA[i].Nombre == EstadosFinales[j])      //Si nuestro estado es del conjunto de los finales
                        return true;                                        //Entonces si que paso el automata :)
                }
            }
            return false;
        }
};


/*==================================================
========    EL AUTOMATA TODA LOS DATOS    ==========
==================================================*/
NFA::NFA(std::string nombreArchivo){                                        //============== ES DONDE SALE LA MAGIA======= 
    std::string basura;                                                     //Este sera el recolector de basura del txt
    int NumeroDeEstados, numDeFinales, numSimbolos, temporal;               //Algunas variables necesarias
    char letra;                                                             //Algunas variables necesarias

    std::ifstream EntradaDeDatos(nombreArchivo.c_str());                    //Este sera el archivo de la informacion
    EntradaDeDatos >> basura;                                               //Leemos el titulo del archivo y lo ignoramos

    EntradaDeDatos >> basura;                                               // == Leemos Q: ===
    EntradaDeDatos >> NumeroDeEstados;                                      //Leemos el numero de estado
    EstadosDelNFA.resize(NumeroDeEstados);                                  //Numero de Estados
    std::vector<bool> EstadosFinalesCubeta(NumeroDeEstados, false);         //Nuestros booleanos

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
        EstadosDelNFA[i].Nombre = EstadoActual;                             //Y le damos un nombre
        EstadosDelNFA[i].EresEstadoFinal = EstadosFinalesCubeta[i];         //Y guardamos ahora si si es un estado final

        char letraQueLeo;                                                   //Veamos la direccion
        int sigEstado;  

        while(true){
            EntradaDeDatos >> letraQueLeo;                                  //Vemos que letra leemos
            if(letraQueLeo == '=') break;                                   //Si es esta corremos
            EntradaDeDatos >> sigEstado;                                    //Y guardamos el numero

            char a = letraQueLeo; int b = sigEstado;                        //solo por tamaño
            EstadosDelNFA[i].FnTransicion.push_back(std::make_pair(a,b));   //Creamos un push back
        }
        EntradaDeDatos >> letraQueLeo;                                      //Leemos el otro = que esta
    }

    ReiniciaAutomata();
}


/*==================================================
========   MOSTRAMOS INFORMACION DEL NFA  ==========
==================================================*/
void NFA::InformacionDelNFA(){                                              //======= VAMOS A MOSTRAR A NUESTRO AUTOMATA =======
    std::cout<<"\n=====  INFORMACION DEL NFA  ========";                    //Mensaje de bienvenida
    int NumeroDeEstados = EstadosDelNFA.size();                             //Solo por tamaño

    std::cout<<"\n\nQ  (Cantidad/Conjunto de Estados): "<< NumeroDeEstados; //Y lo mostramos por pantalla
    std::cout<<"\n\nq0 (Estado Inicial): q"<<EstadoInicial;                 //Y lo mostramos por pantalla

    std::cout<<"\n\nF  (Estados Finales): "<<EstadosFinales.size()<<"\n";   //Y lo mostramos por pantalla    
    for (int i = 0; i < EstadosFinales.size(); i++)                         //Y para cada uno 
        std::cout<<" - q"<<EstadosFinales[i]<<"\n";                         //Lo mostramos

    std::cout<<"\nΣ  (Alfabeto): \n";                                       //Y lo mostramos por pantalla 
    std::cout<<" "<<Alfabeto[0];                                            //Lo mostramos
    for (int i = 1; i < Alfabeto.size(); i++) std::cout<<", "<<Alfabeto[i]; //Lo mostramos por pantalla

    for (int i = 0, temporal; i < EstadosDelNFA.size(); i++){               //Para cada elemento del automata
        std::cout<<"\n\n == Estado "<<i<<": ===\n";                         //Muestro un mensajito

        for (int j = 0; j < EstadosDelNFA[i].FnTransicion.size(); ++j){     //Para cada funcion que tengo registro
            char temporal = EstadosDelNFA[i].FnTransicion[j].first;         //Simplemente tenian un nombre muy largo
            int apuntador = EstadosDelNFA[i].FnTransicion[j].second;        //Simplemente tenian un nombre muy largo
            std::cout<<" (q"<<i<<",'"<<temporal<<"') = q"<<apuntador<<"\n"; //Mostramos por pantalla 
        }
    }
}


/*===========================================================
========     EJECUTA SOLO UNA LINEA DEL AUTOMATA    =========
===========================================================*/
bool NFA::CorreElAutomata(char Letra, bool Muestro){                        //============= ESTO ES LO BUENO !! ========== 

    if(ElAutomataPuedeSeguir == false) return false;                        //Si ya estas en un estado invalido, para que le hacen
    if(ElAutomataEstaEnQValido == false) return true;                       //Si ya estas en un estado invalido, para que le hacen


    std::vector<Estado> EstadosAntiguos = EstadosVivosNFA;                  //Saquemos las cosas del vector
    EstadosVivosNFA.clear();                                                //Saquemos las cosas del vector

    for (int i = 0; i < Alfabeto.size(); i++){                              //Recorremos el alfabeto
        if(Alfabeto[i] == Letra) break;                                     //Si encontre la letra dentro sal

        if(i == (Alfabeto.size()-1)){                                       //Si llegaste aqui es que no esta
            ElAutomataPuedeSeguir = false;                                  //pero obvio no puedes seguir
            return ElAutomataPuedeSeguir;                                   //bye
        }
    }

    if(Muestro){
        std::cout << "\n\nLetra Actual '"<< Letra <<"' :\n";                //Mensaje
        std::cout << " Los estados son vivos son:";                         //Mensaje
        std::cout << " q" << EstadosAntiguos[0].Nombre;                     //Vamos mostrando los estados vivos
    }

    for (int j = 1; j < EstadosAntiguos.size() && Muestro; j++)             //Si queremos mostrar mensajes
        std::cout << ", q" << EstadosAntiguos[j].Nombre;                    //Vamos mostrando los estados vivos

    for (int j = 0; j < EstadosAntiguos.size(); j++){                       //Para cada hilo o estado vivo
        Estado EstadoActual = EstadosAntiguos[j];                           //Hacemos una variable temporal por comodidad

        for (int k = 0; k < EstadoActual.FnTransicion.size(); k++){         //Veamos que nos dice la funcion delta del estado

            if(EstadoActual.FnTransicion[k].first == Letra){                //Si la funcion esta definida para ese simbolo
                char a = EstadoActual.FnTransicion[k].first;                //Hacemos variable por comodidad
                int b = EstadoActual.FnTransicion[k].second;                //Hacemos variable por comodidad

                if(Muestro){                                                //Si quieres que muestre cosas
                    std::cout << "\n (q"<<EstadoActual.Nombre;              //Mensaje
                    std::cout << ",'"<<a<<"') = "<<"q"<<b;                  //Mensaje
                }
                if(b != -1) EstadosVivosNFA.push_back(EstadosDelNFA[b]);    //Si tu b no era -1 sigue
            }
        }
    }

    if(EstadosVivosNFA.size() == 0){
        ElAutomataEstaEnQValido = false;                                    //Si hay una transicion valida
        return true;                                                        //Si hay una transicion valida
    }

    return true;                                                            //Todo bien
}


/*===========================================================
========    ANALIZA UN ARCHIVO ENCONTRANDO PALABRAS    ======
===========================================================*/

void NFA::AnalizarArchivo(char *Lectura, char *Aceptada, bool Muestra){     //============= ESTO ES LO BUENO !! ========== 
    
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
            
            if(LaCadenaPaso && Muestra) std::cout << "\n == CadenaPaso: '"; //Pero llegamos justo al final de la cadena

            while((LetraEscribir=getc(CadenaAuxiliar))!=LetraQueAnalizo){   //Mientras mi puntero vaya atras
                if(LaCadenaPaso){                                           //Y si la caden paso
                    if(Muestra) printf("%c", LetraEscribir);                //Ve mostrando cual cadena paso
                    fprintf(CadenaAceptadas, "%c", LetraEscribir);          //Guardemos en el archivo
                }
            }

            if (LaCadenaPaso){                                              //Y si la cadena paso
                fprintf(CadenaAceptadas, "\n");                             //Guardemos en el archivo
                if(Muestra) std::cout << "'==\n\n";                         //Espacios de Estilo
            }
            else                                                            //Y si no paso
                std::cout << "\n\nNo paso :(\n\n";                          //Tambien dime


            ReiniciaAutomata();                                             //Reiniciamos el automata
            LaCadenaPaso = false;                                           //Pero suponemos que no ha pasado la cadena
            
            if(LetraQueAnalizo == EOF) break;                               //Si ya llegaste al final de la cadena, sal!
        }
    }

    fclose(CadenasDeLectura);                                               //Cierras el archivo
    fclose(CadenaAuxiliar);                                                 //Cierras el archivo
    fclose(CadenaAceptadas);                                                //Cierras el archivo

}