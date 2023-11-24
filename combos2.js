// CONSTANTES TECLAS

const TECLA_R = 82;




//===============================================================================================================================
//clase combo
class Combo {

    constructor(cadena){
        this.botones = cadena; //cadena con las teclas del combo
        this.indice = 0;           //botón por el que vamos dentro de la secuencia
        this.codigoBoton;      //botón pulsado actualmente

        this.tiempoPermitido = 500;     //milisegundos permitidos entre pulsaciones
        this.tiempoUltimaPulsacion;     //hora a la que se pulsó la última tecla
    }

    //Método al que se llama cuando se pulsa una tecla
    pulsada(codigo){

        let exito = false;  //indica si hemos completado el combo con éxito
        this.codigoBoton = codigo;  //guardamos el código del botón pulsado

        let hora = new Date();
        hora = hora.getTime();

        //comprobamos si la pulsación se ha hecho a tiempo
        if(hora > this.tiempoUltimaPulsacion + this.tiempoPermitido){
            this.indice = 0;
        }

        //si hay botones por revisar en el array
        if(this.indice < this.botones.length){

            //miramos si la tecla pulsada se corresponde con la que toca ahora
            if(this.botones[this.indice] === this.codigoBoton){

                //Si quedan más teclas por revisar, incrementamos el índice (avanzamos)
                if(this.indice < this.botones.length - 1){
                    this.indice++;
                }

                //Si no quedan teclas por revisar, es que hemos realizado el combo con éxito
                else {
                    exito = true;       //lo hemos conseguido
                    this.indice = 0;    //reiniciamos el índice a 0
                }

                //si el botón pulsado es erróneo, reiniciamos el índice
            } else {
                this.indice = 0;
            }
        }

        this.tiempoUltimaPulsacion = hora;  //guardamos la hora de la última pulsación

        return exito;
    }

}


// let lowKick = new Combo([TECLA_R,TECLA_R]);
// let highKick = new Combo([TECLA_R]);




// //===============================================================================================================================
// //disparador teclado
// document.addEventListener('keydown', function(tecla){
//     let codigoTecla = tecla.keyCode;

//     if( lowKick.pulsada(codigoTecla) ){
//         console.log('¡¡¡LOW KICK!!!');
//     } else if( highKick.pulsada(codigoTecla) ){
//         console.log('HIGH KICK');
//     }

// });