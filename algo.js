class Personaje {
    constructor(image, spriteAnimations, x, id) {
        this.image = image;
        this.spriteAnimations = spriteAnimations;
        
        //identificador del personaje (personaje1 o personaje2)
        this.id = id;

        //dimensiones personaje
        this.x = x;
        this.y = LIMITE_ABAJO - 83;
        this.width;
        this.height = 83;

        //miPersonaje hitbox (se asignan los valores en el metodo asociado)
        this.hitbox = {
            cuerpo: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            cabeza: {
                x: 0,
                y: 0,
                width: 0,
                height:0
            },
            tronco: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            punio: {
                x: 0,
                y: 0,
                width: 0,
                height:0
            },
            patada: {
                x: 0,
                y: 0,
                width: 0,
                height:0
            },
            pies: {
                x: 0,
                y: 0,
                width: 0,
                height:0
            }
        };

        //variables en el sprite de cada personaje a la hora de dibujar
        this.frameX;		//corta en el sprite en eje X
        this.frameY;

        this.spriteWidth;
        this.spriteHeight;

        //atributos variados
        this.vivo = true;
        this.vida = VIDA_TOTAL;
        this.energia = ENERGIA_TOTAL;
        this.personajeState = 'reposo';
        this.position = 0;                  //posiciones de la animacion
        this.position2 = 0;					//igual que position -> para no producir problemas de sincronización

        //físicas del personaje
        this.velocidadX = 0;                 //velocidad eje X
        this.vy = 0;   						//velocidad ejeY
        this.weight = TASA_REFRESCO_ADECUADA.weight;

        //atributos de animaciones generales
        this.velocidadAnimacion = TASA_REFRESCO_ADECUADA.velocidadAnimacion;
        this.AnimationFrame = 0;   //sirve para que las animaciones empiecen desde 0
        
        //array para saber si se ha producido o no un determinado golpe
        //sirve para que cuando se produzca un golpe (colisión) no se siga contando como varios golpes sino 1 solo.
        this.golpeConectado = {
            'punchHead': false,
            'punchHeadAgachado': false,
            'upperPunch': false,
            'punchBody': false,
            'kickHead': false,
            'kickBody': false,
            'barridoBody': false,
            'lowKickHead': false
        }

        this.cubierto = false; //propiedad que define si se ha cubierto del golpe o le han impactado de lleno

        //animaciones puñetazo                
        this.inicioAnimacionMovingPunch = null;
          this.duracionAnimacionMovingPunch = 600; // Duración de animación milisegundos (600)
        this.animacionEnProgresoMovingPunch = false;
        //animaciones puñetazo agachado
        this.inicioAnimacionAgachadoPunch = null;
          this.duracionAnimacionAgachadoPunch = 300; // Duración de animación milisegundos (300)
        this.animacionEnProgresoAgachadoPunch = false;

        //animaciones patadas                
        this.inicioAnimacionKick = null;
          this.duracionAnimacionKick = 500; // Duración de animación milisegundos (500)
        this.animacionEnProgresoKick = false;
        //animaciones patadas bajas
        this.inicioAnimacionLowKick = null;
        this.animacionEnProgresoLowKick = false;

        //animaciones barrido agachado
        this.inicioAnimacionAgachadoBarrido = null;
        this.duracionAnimacionAgachadoBarrido = 600; //600
        this.animacionEnProgresoAgachadoBarrido = false;
        //animaciones upper agachado
        this.inicioAnimacionAgachadoUpper = null;
        this.duracionAnimacionAgachadoUpper = 600; // 600
        this.animacionEnProgresoAgachadoUpper = false;

        //animaciones recibir golpe en la cara (faceHit)
        this.inicioAnimacionFaceHit = null;
        this.duracionAnimacionFaceHit = 600; //600
        this.animacionEnProgresoFaceHit = false;
        //animaciones recibir golpe (hit)
        this.inicioAnimacionHit = null;
        this.duracionAnimacionHit = 600;
        this.animacionEnProgresoHit = false;
        //animaciones recibir golpe en la cara agachado (agachadoHit)
        this.inicioAnimacionAgachadoHit = null;
        this.duracionAnimacionAgachadoHit = 600; //600
        this.animacionEnProgresoAgachadoHit = false;
        //animaciones quedarse insconcinete de pie (stunned)
        this.inicioAnimacionStunned = null;
        this.duracionAnimacionStunned = 1500;
        this.animacionEnProgresoStunned = false;
        //animaciones quedarse KO (ko)
        this.inicioAnimacionKO = null;
        this.duracionAnimacionKO = 60000; //60000
        this.animacionEnProgresoKO = false;
        //animaciones caida
        this.inicioAnimacionCaida = null;
        this.duracionAnimacionCaida = 1500; //1500
        this.animacionEnProgresoCaida = false;
        //animacion de hacer retroceder
        this.inicioAnimacionRetroceso = null;
        this.duracionAnimacionRetroceso = 100;
        this.animacionEnProgresoRetroceso = false;

        //variables creadas para solucionar error del sprite que se carga en una mala posición debido a sus dimensiones.
        this.primeraVez = true;
        this.segundaVez = true;
        this.tercerVez = true;
        this.cuartaVez = true;
        this.quintaVez = true;
    }

    // devuelve booleano para saber si el personaje está realizando algún ataque
    seEstaEjecutandoAtaque(){
        let ataques = (this.animacionEnProgresoKick) || (this.animacionEnProgresoMovingPunch) || (this.animacionEnProgresoAgachadoPunch) || (this.animacionEnProgresoLowKick) || (this.animacionEnProgresoAgachadoBarrido) || (this.animacionEnProgresoAgachadoUpper);
        return ataques;
    }
    seEstaEjecutandoRecibirGolpe(){
        let golpeRecibidio = (this.animacionEnProgresoFaceHit) || (this.animacionEnProgresoHit) || (this.animacionEnProgresoAgachadoHit) || (this.animacionEnProgresoStunned) || (this.animacionEnProgresoKO) || (this.animacionEnProgresoCaida);
        return golpeRecibidio;
    }

    generaReposo() {
        if (!this.animacionEnProgresoMovingPunch && !this.animacionEnProgresoKick && !this.animacionEnProgresoAgachadoPunch && !this.animacionEnProgresoLowKick) {
            this.personajeState = 'reposo';
        }
        this.velocidadAnimacion = TASA_REFRESCO_ADECUADA.velocidadAnimacion;
        this.velocidadX = 0;
    }
    generaCaminarDerecha() {
        this.personajeState = 'caminando';
        this.velocidadAnimacion = TASA_REFRESCO_ADECUADA.velocidadAnimacion;
        this.velocidadX = TASA_REFRESCO_ADECUADA.velocidadX;
    }
    generaCaminarIzquierda() {
        this.personajeState = 'caminando';
        this.velocidadAnimacion = TASA_REFRESCO_ADECUADA.velocidadAnimacion;
        this.velocidadX = -TASA_REFRESCO_ADECUADA.velocidadX;
    }

    iniciarAnimacionMovingPunch(numAnimaciones) {
        this.animacionEnProgresoMovingPunch = true;
        this.inicioAnimacionMovingPunch = performance.now();

        (this.id === 1) ? miPersonaje.energia -= energiaGolpe.movingPunch : miEnemigo.energia -= energiaGolpe.movingPunch;
        this.animarMovingPunch(numAnimaciones);
    }

    animarMovingPunch(numAnimaciones) {
        if (this.animacionEnProgresoMovingPunch) {
          const tiempoActual = performance.now();
          const tiempoTranscurrido = tiempoActual - this.inicioAnimacionMovingPunch;
          const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionMovingPunch, 1);
         
          // Actualizar la animación (código específico de animación aquí)
          this.personajeState = 'movingPunch';
          this.position = Math.floor(progreso * numAnimaciones);
    
        // if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 0;	// esto es para hacer pruebas (eliminar)
          
          this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
          this.y = LIMITE_ABAJO - this.height;
          
          if (this.id === 1){
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+9, 
                    this.hitbox.cuerpo.y = this.y+6, 
                    this.hitbox.cuerpo.width = this.width/2.1, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.cabeza.x = this.x+18,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+7,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = null,
                    this.hitbox.pies.y = null,
                    this.hitbox.pies.width = null,
                    this.hitbox.pies.height = null
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+13, 
                    this.hitbox.cuerpo.y = this.y+6, 
                    this.hitbox.cuerpo.width = this.width/2.1, 
                    this.hitbox.cuerpo.height = this.height/1.1
                    
                    this.hitbox.cabeza.x = this.x+24,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+17,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+40,
                    this.hitbox.pies.y = this.y+73,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+24, 
                    this.hitbox.cuerpo.y = this.y+6, 
                    this.hitbox.cuerpo.width = this.width/3.7, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.punio.x = this.x+38, 
                    this.hitbox.punio.y = this.y+15, 
                    this.hitbox.punio.width = this.width/2.1, 
                    this.hitbox.punio.height = this.height/12
                    
                    this.hitbox.cabeza.x = this.x+24,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+20,
                    this.hitbox.tronco.y = this.y+16,
                    this.hitbox.tronco.width = this.width/2.9,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+39,
                    this.hitbox.pies.y = this.y+73,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 3:
                    this.hitbox.cuerpo.x = this.x+13, 
                    this.hitbox.cuerpo.y = this.y+6, 
                    this.hitbox.cuerpo.width = this.width/2.1, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.punio.x = null, 
                    this.hitbox.punio.y = null, 
                    this.hitbox.punio.width = null, 
                    this.hitbox.punio.height = null
                    
                    this.hitbox.cabeza.x = this.x+24,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+18,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2.2,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+40,
                    this.hitbox.pies.y = this.y+73,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 4:
                    this.hitbox.cuerpo.x = this.x+9, 
                    this.hitbox.cuerpo.y = this.y+6, 
                    this.hitbox.cuerpo.width = this.width/2.1, 
                    this.hitbox.cuerpo.height = this.height/1.1
                    
                    this.hitbox.cabeza.x = this.x+18,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+7,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = null,
                    this.hitbox.pies.y = null,
                    this.hitbox.pies.width = null,
                    this.hitbox.pies.height = null
                    break;
                default:
                    break;
            }
          } else {

            if(this.primeraVez && this.position === 1) {
                this.x = this.x-29;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 2) {
                this.x = this.x+29;
                this.segundaVez = false;
            }
              switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+16, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/3.1, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.cabeza.x = this.x+17,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+16,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/3.2,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+1,
                    this.hitbox.pies.y = this.y+73,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+30, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/3.1, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.punio.x = this.x+1, 
                    this.hitbox.punio.y = this.y+16, 
                    this.hitbox.punio.width = this.width/2.2, 
                    this.hitbox.punio.height = this.height/15
                    
                    this.hitbox.cabeza.x = this.x+25,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+31,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/4.4,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+73,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+16, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/3.1, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.punio.x = null, 
                    this.hitbox.punio.y = null, 
                    this.hitbox.punio.width = null, 
                    this.hitbox.punio.height = null

                    this.hitbox.cabeza.x = this.x+17,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+15,
                    this.hitbox.tronco.y = this.y+19,
                    this.hitbox.tronco.width = this.width/3,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+1,
                    this.hitbox.pies.y = this.y+73,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                default:
                    break;
            }
          }

          if (tiempoTranscurrido < this.duracionAnimacionMovingPunch) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarMovingPunch(numAnimaciones));
          } else {
            this.animacionEnProgresoMovingPunch = false;
            this.primeraVez = true;
            this.segundaVez = true;
            
          }
        }
    }

    iniciarAnimacionAgachadoPunch() {
        this.animacionEnProgresoAgachadoPunch = true;
        this.inicioAnimacionAgachadoPunch = performance.now();

        (this.id === 1) ? miPersonaje.energia -= energiaGolpe.agachadoPunch : miEnemigo.energia -= energiaGolpe.agachadoPunch;
        this.animarAgachadoPunch();
    }

    animarAgachadoPunch() {
        if (this.animacionEnProgresoAgachadoPunch) {
          const tiempoActual = performance.now();
          const tiempoTranscurrido = tiempoActual - this.inicioAnimacionAgachadoPunch;
          const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionAgachadoPunch, 1);
         
          // Actualizar la animación (código específico de animación aquí)
          this.personajeState = 'agachadoPunch';
          this.position = Math.floor(progreso * 2.999);

        //   if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        //   if (this.id === 2) this.position = 1;	// esto es para hacer pruebas (eliminar)

          this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
          this.y = LIMITE_ABAJO - this.height;

          if (this.id === 1){
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+15, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.cabeza.x = this.x+23,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+13,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/2.6,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+15, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.6, 
                    this.hitbox.cuerpo.height = this.height/1.1
                        
                    this.hitbox.punio.x = this.x+40, 
                    this.hitbox.punio.y = this.y+11, 
                    this.hitbox.punio.width = this.width/3, 
                    this.hitbox.punio.height = this.height/7.8
                    
                    this.hitbox.cabeza.x = this.x+22,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+14,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/3.2,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+15, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2, 
                    this.hitbox.cuerpo.height = this.height/1.1
                        
                    this.hitbox.punio.x = null,
                    this.hitbox.punio.y = null,
                    this.hitbox.punio.width = null,
                    this.hitbox.punio.height = null
                    
                    this.hitbox.cabeza.x = this.x+23,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+13,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/2.6,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                default:
                    break;
            }
          } else {
            
            if (this.primeraVez && this.position === 0) {
                this.x = this.x-4;
                this.primeraVez = false;	
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-15;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x+15;
                this.tercerVez = false;
            }
              switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+14, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2.7, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.cabeza.x = this.x+12,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+16,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/2.6,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+26, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2.7, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.punio.x = this.x, 
                    this.hitbox.punio.y = this.y+12, 
                    this.hitbox.punio.width = this.width/2.2, 
                    this.hitbox.punio.height = this.height/8
                    
                    this.hitbox.cabeza.x = this.x+25,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+29,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/3.5,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+14, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2.7, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.punio.x = null, 
                    this.hitbox.punio.y = null, 
                    this.hitbox.punio.width = null, 
                    this.hitbox.punio.height = null

                    this.hitbox.cabeza.x = this.x+12,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+16,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/2.6,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                default:
                    break;
            }
          }

          if (tiempoTranscurrido < this.duracionAnimacionAgachadoPunch) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarAgachadoPunch());
          } else {
            // console.log('ANIMACIÓN PUÑETAZO BAJO TERMINADA');
            if (this.id === 2) this.x = this.x+4;
            this.animacionEnProgresoAgachadoPunch = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            
          }
        }
    }

    iniciarAnimacionAgachadoBarrido() {
        this.animacionEnProgresoAgachadoBarrido = true;
        this.inicioAnimacionAgachadoBarrido = performance.now();

        (this.id === 1) ? miPersonaje.energia -= energiaGolpe.agachadoBarrido : miEnemigo.energia -= energiaGolpe.agachadoBarrido;
        this.animarAgachadoBarrido();
    }

    animarAgachadoBarrido() {
        if (this.animacionEnProgresoAgachadoBarrido) {
          const tiempoActual = performance.now();
          const tiempoTranscurrido = tiempoActual - this.inicioAnimacionAgachadoBarrido;
          const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionAgachadoBarrido, 1);
         
          // Actualizar la animación (código específico de animación aquí)
          this.personajeState = 'agachadoBarrido';
          this.position = Math.floor(progreso * 2.999);

        //   if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        //   if (this.id === 2) this.position = 0;	// esto es para hacer pruebas (eliminar)

          this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
          this.y = LIMITE_ABAJO - this.height;

          if (this.id === 1){

            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+16, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.cabeza.x = this.x+21,
                    this.hitbox.cabeza.y = this.y+1,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+17,
                    this.hitbox.tronco.y = this.y+10,
                    this.hitbox.tronco.width = this.width/2.7,
                    this.hitbox.tronco.height = this.height/1.26
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+16, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.8, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.patada.x = this.x+25, 
                    this.hitbox.patada.y = this.y+45, 
                    this.hitbox.patada.width = this.width/1.43, 
                    this.hitbox.patada.height = this.height/8

                    this.hitbox.cabeza.x = this.x+22,
                    this.hitbox.cabeza.y = this.y+10,
                    this.hitbox.cabeza.width = this.width/9,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+19,
                    this.hitbox.tronco.y = this.y+19,
                    this.hitbox.tronco.width = this.width/4.7,
                    this.hitbox.tronco.height = this.height/1.65
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+16, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.patada.x = null,
                    this.hitbox.patada.y = null,
                    this.hitbox.patada.width = null,
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x+21,
                    this.hitbox.cabeza.y = this.y+1,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+17,
                    this.hitbox.tronco.y = this.y+10,
                    this.hitbox.tronco.width = this.width/2.7,
                    this.hitbox.tronco.height = this.height/1.26
                    break;
                default:
                    break;
            }
          } else {
            
            if (this.primeraVez && this.position === 0) {
                this.x = this.x-2;
                this.primeraVez = false;	
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-20;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x+20;
                this.tercerVez = false;
            }
            
              switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+14, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.cabeza.x = this.x+10,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/5

                    this.hitbox.tronco.x = this.x+14,
                    this.hitbox.tronco.y = this.y+10,
                    this.hitbox.tronco.width = this.width/2.7,
                    this.hitbox.tronco.height = this.height/1.3
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+30, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/3, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.patada.x = this.x+5, 
                    this.hitbox.patada.y = this.y+37, 
                    this.hitbox.patada.width = this.width/1.43, 
                    this.hitbox.patada.height = this.height/8
                    
                    this.hitbox.cabeza.x = this.x+31,
                    this.hitbox.cabeza.y = this.y,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/3.8

                    this.hitbox.tronco.x = this.x+33,
                    this.hitbox.tronco.y = this.y+10,
                    this.hitbox.tronco.width = this.width/3.3,
                    this.hitbox.tronco.height = this.height/1.3
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+14, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.1

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null

                    this.hitbox.cabeza.x = this.x+10,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/5

                    this.hitbox.tronco.x = this.x+14,
                    this.hitbox.tronco.y = this.y+10,
                    this.hitbox.tronco.width = this.width/2.7,
                    this.hitbox.tronco.height = this.height/1.3
                    break;
                default:
                    break;
            }
          }

          if (tiempoTranscurrido < this.duracionAnimacionAgachadoBarrido) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarAgachadoBarrido());
          } else {
            // console.log('ANIMACIÓN PUÑETAZO BAJO TERMINADA');
            if (this.id === 2) this.x = this.x+2;
            this.animacionEnProgresoAgachadoBarrido = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            
          }
        }
    }

    iniciarAnimacionKick() {
        this.animacionEnProgresoKick = true;
        this.inicioAnimacionFaceHit = performance.now();

        (this.id === 1) ? miPersonaje.energia -= energiaGolpe.kick : miEnemigo.energia -= energiaGolpe.kick;
        this.animarKick();
    }

    animarKick() {
        if (this.animacionEnProgresoKick) {
          const tiempoActual = performance.now();
          const tiempoTranscurrido = tiempoActual - this.inicioAnimacionFaceHit;
          const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionKick, 1);
    
          // Actualizar la animación (código específico de animación aquí)
          this.personajeState = 'kick';
          this.position = Math.floor(progreso * 2.999);
    
            // if (this.id === 1) this.position = 1;	// esto es para hacer pruebas (eliminar)
            // if (this.id === 2) this.position = 1;	// esto es para hacer pruebas (eliminar)

          this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
          this.y = LIMITE_ABAJO - this.height;
            
          if (this.id === 1){

            if(this.primeraVez && this.position === 0) {
                this.x = this.x-6;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-11;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x+11;
                this.tercerVez = false;
            }
            
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+10, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2, 
                    this.hitbox.cuerpo.height = this.height/1.05
                    
                    this.hitbox.cabeza.x = this.x+8,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+13,
                    this.hitbox.tronco.y = this.y+17,
                    this.hitbox.tronco.width = this.width/2.4,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+14,
                    this.hitbox.pies.y = this.y+72,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+8, 
                    this.hitbox.cuerpo.y = this.y+3, 
                    this.hitbox.cuerpo.width = this.width/2.1, 
                    this.hitbox.cuerpo.height = this.height/1.07 

                    this.hitbox.patada.x = this.x+47, 
                    this.hitbox.patada.y = this.y+1, 
                    this.hitbox.patada.width = this.width/3.2, 
                    this.hitbox.patada.height = this.height/11

                    this.hitbox.cabeza.x = this.x-2,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+5,
                    this.hitbox.tronco.y = this.y+17,
                    this.hitbox.tronco.width = this.width/2.4,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+25,
                    this.hitbox.pies.y = this.y+72,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+10, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x+8,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+13,
                    this.hitbox.tronco.y = this.y+17,
                    this.hitbox.tronco.width = this.width/2.4,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+14,
                    this.hitbox.pies.y = this.y+72,
                    this.hitbox.pies.width = this.width/6,
                    this.hitbox.pies.height = this.height/7.8
                    break;
                default:
                    break;
            }
          } else {

            if(this.primeraVez && this.position === 1) {
                this.x = this.x-11;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 2) {
                this.x = this.x+11;
                this.segundaVez = false;
            }

            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+32, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/3.2, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.cabeza.x = this.x+34,
                this.hitbox.cabeza.y = this.y+4,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+35,
                this.hitbox.tronco.y = this.y+16,
                this.hitbox.tronco.width = this.width/5.8,
                this.hitbox.tronco.height = this.height/1.35

                this.hitbox.pies.x = this.x+30,
                this.hitbox.pies.y = this.y+64,
                this.hitbox.pies.width = this.width/6,
                this.hitbox.pies.height = this.height/5
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+28, 
                this.hitbox.cuerpo.y = this.y+4, 
                this.hitbox.cuerpo.width = this.width/2.4, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.patada.x = this.x, 
                this.hitbox.patada.y = this.y+10, 
                this.hitbox.patada.width = this.width/3.2, 
                this.hitbox.patada.height = this.height/14
                
                this.hitbox.cabeza.x = this.x+44,
                this.hitbox.cabeza.y = this.y+3,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+37,
                this.hitbox.tronco.y = this.y+16,
                this.hitbox.tronco.width = this.width/8,
                this.hitbox.tronco.height = this.height/1.3

                this.hitbox.pies.x = this.x+39,
                this.hitbox.pies.y = this.y+64,
                this.hitbox.pies.width = this.width/6,
                this.hitbox.pies.height = this.height/5
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+32, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/3.2, 
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+34,
                this.hitbox.cabeza.y = this.y+4,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+35,
                this.hitbox.tronco.y = this.y+16,
                this.hitbox.tronco.width = this.width/5.8,
                this.hitbox.tronco.height = this.height/1.35

                this.hitbox.pies.x = this.x+30,
                this.hitbox.pies.y = this.y+64,
                this.hitbox.pies.width = this.width/6,
                this.hitbox.pies.height = this.height/5
                break;
            default:
                break;
            }
          }

          if (tiempoTranscurrido < this.duracionAnimacionKick) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarKick());
          } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoKick = false;
            if (this.id === 1) this.x = this.x + 6;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
          }
        }
      }

    iniciarAnimacionFaceHit() {
        this.animacionEnProgresoFaceHit = true;
        this.inicioAnimacionFaceHit = performance.now();
        this.animarFaceHit();
    }

    animarFaceHit() {
        if (this.animacionEnProgresoFaceHit) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionFaceHit;
        const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionFaceHit, 1);
    
        // Actualizar la animación (código específico de animación aquí)
        this.personajeState = 'faceHit';
        this.position = Math.floor(progreso * 3.999);
    
        // if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 0;	// esto es para hacer pruebas (eliminar)
    
        this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
        this.y = LIMITE_ABAJO - this.height;

        if (this.id === 1){

            this.hitbox.cuerpo.x = this.x+5, 
            this.hitbox.cuerpo.y = this.y, 
            this.hitbox.cuerpo.width = this.width/2.3, 
            this.hitbox.cuerpo.height = this.height/1.1

            if(this.primeraVez && this.position === 0) {
                this.x = this.x-4;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-6;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x-7;
                this.tercerVez = false;
            }
            if(this.cuartaVez && this.position === 3) {
                this.x = this.x+17;
                this.cuartaVez = false;
            }
             
            switch(this.position){
                case 0:						
                    this.hitbox.cabeza.x = this.x+1,
                    this.hitbox.cabeza.y = this.y+6,
                    this.hitbox.cabeza.width = this.width/4,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+3,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2.55,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 1:
                    this.hitbox.patada.x = this.x+47, 
                    this.hitbox.patada.y = this.y+1, 
                    this.hitbox.patada.width = this.width/3.2, 
                    this.hitbox.patada.height = this.height/11

                    this.hitbox.cabeza.x = this.x+1,
                    this.hitbox.cabeza.y = this.y+6,
                    this.hitbox.cabeza.width = this.width/4,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+3,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2.55,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 2:
                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x+1,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+5,
                    this.hitbox.tronco.y = this.y+19,
                    this.hitbox.tronco.width = this.width/3,
                    this.hitbox.tronco.height = this.height/1.35
                    break;
                case 3:
                    this.hitbox.patada.x = this.x+47, 
                    this.hitbox.patada.y = this.y+1, 
                    this.hitbox.patada.width = this.width/3.2, 
                    this.hitbox.patada.height = this.height/11

                    this.hitbox.cabeza.x = this.x+13,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/4,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+5,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/1.35
                    break;
                default:
                    break;
            }
        } else {

            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+23, 
                this.hitbox.cuerpo.y = this.y+2, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.cabeza.x = this.x+33,
                this.hitbox.cabeza.y = this.y+2,
                this.hitbox.cabeza.width = this.width/4.8,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+18,
                this.hitbox.tronco.y = this.y+11,
                this.hitbox.tronco.width = this.width/2.5,
                this.hitbox.tronco.height = this.height/1.19
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+3, 
                this.hitbox.cuerpo.width = this.width/1.9, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.patada.x = this.x, 
                this.hitbox.patada.y = this.y+10, 
                this.hitbox.patada.width = this.width/3.2, 
                this.hitbox.patada.height = this.height/14
                
                this.hitbox.cabeza.x = this.x+37,
                this.hitbox.cabeza.y = this.y+4,
                this.hitbox.cabeza.width = this.width/4.8,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+18,
                this.hitbox.tronco.y = this.y+11,
                this.hitbox.tronco.width = this.width/2.5,
                this.hitbox.tronco.height = this.height/1.19
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+5, 
                this.hitbox.cuerpo.width = this.width/1.7, 
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+43,
                this.hitbox.cabeza.y = this.y+4,
                this.hitbox.cabeza.width = this.width/6,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+18,
                this.hitbox.tronco.y = this.y+11,
                this.hitbox.tronco.width = this.width/2.5,
                this.hitbox.tronco.height = this.height/1.19
                break;
            case 3:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+3, 
                this.hitbox.cuerpo.width = this.width/1.9, 
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+38,
                this.hitbox.cabeza.y = this.y+4,
                this.hitbox.cabeza.width = this.width/6,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+18,
                this.hitbox.tronco.y = this.y+11,
                this.hitbox.tronco.width = this.width/2.5,
                this.hitbox.tronco.height = this.height/1.19
                break;
            default:
                break;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionFaceHit) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarFaceHit());
        } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoFaceHit = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            this.cuartaVez = true;
        }
        }
    }


    iniciarAnimacionCaida(numAnimaciones) {
        this.animacionEnProgresoCaida = true;
        this.inicioAnimacionCaida = performance.now();
        this.velocidadX = 0;
        this.animarCaida(numAnimaciones);
    }

    animarCaida(numAnimaciones) {
        if (this.animacionEnProgresoCaida) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionCaida;
        const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionCaida, 1);
    
        // Actualizar la animación (código específico de animación aquí)
        this.personajeState = 'caida';
        this.position = Math.floor(progreso * numAnimaciones);
    
        // if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 0;	// esto es para hacer pruebas (eliminar)
    
        this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
        this.y = LIMITE_ABAJO - this.height;

        if (this.id === 1){

            if(this.primeraVez && this.position === 0) {
                this.x = this.x-10;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-10;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x-10;
                this.tercerVez = false;
            }
            if(this.cuartaVez && this.position === 3) {
                this.x = this.x-10;
                this.cuartaVez = false;
            }
             
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+2,
                    this.hitbox.cuerpo.y = this.y+38,
                    this.hitbox.cuerpo.width = this.width/1.15,
                    this.hitbox.cuerpo.height = this.height/2
                    
                    this.hitbox.cabeza.x = this.x+17,
                    this.hitbox.cabeza.y = this.y+38,
                    this.hitbox.cabeza.width = this.width/4.4,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+2,
                    this.hitbox.tronco.y = this.y+50,
                    this.hitbox.tronco.width = this.width/1.15,
                    this.hitbox.tronco.height = this.height/2.8
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+8,
                    this.hitbox.cuerpo.y = this.y+40,
                    this.hitbox.cuerpo.width = this.width/1.3,
                    this.hitbox.cuerpo.height = this.height/1.8
                    
                    this.hitbox.cabeza.x = this.x+8,
                    this.hitbox.cabeza.y = this.y+75,
                    this.hitbox.cabeza.width = this.width/4.4,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+18,
                    this.hitbox.tronco.y = this.y+40,
                    this.hitbox.tronco.width = this.width/1.9,
                    this.hitbox.tronco.height = this.height/1.8
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+2,
                    this.hitbox.cuerpo.y = this.y+55,
                    this.hitbox.cuerpo.width = this.width/1.25,
                    this.hitbox.cuerpo.height = this.height/2.8
                    
                    this.hitbox.cabeza.x = this.x+2,
                    this.hitbox.cabeza.y = this.y+70,
                    this.hitbox.cabeza.width = this.width/6.3,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+13,
                    this.hitbox.tronco.y = this.y+55,
                    this.hitbox.tronco.width = this.width/1.5,
                    this.hitbox.tronco.height = this.height/2.8
                    break;
                case 3:
                    this.hitbox.cuerpo.x = this.x+2,
                    this.hitbox.cuerpo.y = this.y+75,
                    this.hitbox.cuerpo.width = this.width/1.15,
                    this.hitbox.cuerpo.height = this.height/4.4
                    
                    this.hitbox.cabeza.x = this.x+1,
                    this.hitbox.cabeza.y = this.y+83,
                    this.hitbox.cabeza.width = this.width/7.5,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+10,
                    this.hitbox.tronco.y = this.y+75,
                    this.hitbox.tronco.width = this.width/1.3,
                    this.hitbox.tronco.height = this.height/4.4
                    break;
                case 4:
                    this.hitbox.cuerpo.x = this.x+7,
                    this.hitbox.cuerpo.y = this.y+55,
                    this.hitbox.cuerpo.width = this.width/2.2,
                    this.hitbox.cuerpo.height = this.height/2.4
                    
                    this.hitbox.cabeza.x = null,
                    this.hitbox.cabeza.y = null,
                    this.hitbox.cabeza.width = null,
                    this.hitbox.cabeza.height = null

                    this.hitbox.tronco.x = this.x+7,
                    this.hitbox.tronco.y = this.y+55,
                    this.hitbox.tronco.width = this.width/2.2,
                    this.hitbox.tronco.height = this.height/2.4
                    break;
                case 5:
                    this.hitbox.cuerpo.x = this.x+4
                    this.hitbox.cuerpo.y = this.y+25,
                    this.hitbox.cuerpo.width = this.width/2.5,
                    this.hitbox.cuerpo.height = this.height/1.35
                    
                    this.hitbox.cabeza.x = this.x+12,
                    this.hitbox.cabeza.y = this.y+88,
                    this.hitbox.cabeza.width = this.width/4.4,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+4,
                    this.hitbox.tronco.y = this.y+25,
                    this.hitbox.tronco.width = this.width/2.5,
                    this.hitbox.tronco.height = this.height/1.6
                    break;
                case 6:
                    this.hitbox.cuerpo.x = this.x+7,
                    this.hitbox.cuerpo.y = this.y+33,
                    this.hitbox.cuerpo.width = this.width/1.4,
                    this.hitbox.cuerpo.height = this.height/3
                    
                    this.hitbox.cabeza.x = this.x+37,
                    this.hitbox.cabeza.y = this.y+56,
                    this.hitbox.cabeza.width = this.width/6,
                    this.hitbox.cabeza.height = this.height/9

                    this.hitbox.tronco.x = this.x+7,
                    this.hitbox.tronco.y = this.y+33,
                    this.hitbox.tronco.width = this.width/1.6,
                    this.hitbox.tronco.height = this.height/4.3
                    break;
                case 7:
                    this.hitbox.cuerpo.x = this.x+8,
                    this.hitbox.cuerpo.y = this.y+9,
                    this.hitbox.cuerpo.width = this.width/1.8,
                    this.hitbox.cuerpo.height = this.height/1.6
                    
                    this.hitbox.cabeza.x = this.x+21,
                    this.hitbox.cabeza.y = this.y+9,
                    this.hitbox.cabeza.width = this.width/4.4,
                    this.hitbox.cabeza.height = this.height/8

                    this.hitbox.tronco.x = this.x+8,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/1.8,
                    this.hitbox.tronco.height = this.height/2
                    break;
                default:
                    break;
            }
        } else {
            
            if(this.primeraVez && this.position === 0) {
                this.x = this.x+10;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x+10;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x+10;
                this.tercerVez = false;
            }
            if(this.cuartaVez && this.position === 3) {
                this.x = this.x+10;
                this.cuartaVez = false;
            }
            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+18,
                this.hitbox.cuerpo.y = this.y+66,
                this.hitbox.cuerpo.width = this.width/2,
                this.hitbox.cuerpo.height = this.height/2.8
                
                this.hitbox.cabeza.x = this.x+28,
                this.hitbox.cabeza.y = this.y+66,
                this.hitbox.cabeza.width = this.width/6.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+18,
                this.hitbox.tronco.y = this.y+77,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/3.8
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+10,
                this.hitbox.cuerpo.y = this.y+65,
                this.hitbox.cuerpo.width = this.width/2,
                this.hitbox.cuerpo.height = this.height/3.5
                
                this.hitbox.cabeza.x = this.x+33,
                this.hitbox.cabeza.y = this.y+83,
                this.hitbox.cabeza.width = this.width/6.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+10,
                this.hitbox.tronco.y = this.y+65,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/5
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+22,
                this.hitbox.cuerpo.y = this.y+65,
                this.hitbox.cuerpo.width = this.width/3,
                this.hitbox.cuerpo.height = this.height/2.8
                
                this.hitbox.cabeza.x = null,
                this.hitbox.cabeza.y = null,
                this.hitbox.cabeza.width = null,
                this.hitbox.cabeza.height = null

                this.hitbox.tronco.x = this.x+22,
                this.hitbox.tronco.y = this.y+65,
                this.hitbox.tronco.width = this.width/3,
                this.hitbox.tronco.height = this.height/2.8
                break;
            case 3:
                this.hitbox.cuerpo.x = this.x+13,
                this.hitbox.cuerpo.y = this.y+85,
                this.hitbox.cuerpo.width = this.width/2,
                this.hitbox.cuerpo.height = this.height/5
                
                this.hitbox.cabeza.x = null,
                this.hitbox.cabeza.y = null,
                this.hitbox.cabeza.width = null,
                this.hitbox.cabeza.height = null

                this.hitbox.tronco.x = this.x+13,
                this.hitbox.tronco.y = this.y+85,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/5
                break;
            case 4:
                this.hitbox.cuerpo.x = this.x+25,
                this.hitbox.cuerpo.y = this.y+85,
                this.hitbox.cuerpo.width = this.width/1.5,
                this.hitbox.cuerpo.height = this.height/5.1
                
                this.hitbox.cabeza.x = this.x+61,
                this.hitbox.cabeza.y = this.y+89,
                this.hitbox.cabeza.width = this.width/6.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+25,
                this.hitbox.tronco.y = this.y+85,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/5.1
                break;
            case 5:
                this.hitbox.cuerpo.x = this.x+16,
                this.hitbox.cuerpo.y = this.y+75,
                this.hitbox.cuerpo.width = this.width/2,
                this.hitbox.cuerpo.height = this.height/3.5
                
                this.hitbox.cabeza.x = this.x+33,
                this.hitbox.cabeza.y = this.y+89,
                this.hitbox.cabeza.width = this.width/5.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+16,
                this.hitbox.tronco.y = this.y+75,
                this.hitbox.tronco.width = this.width/3.2,
                this.hitbox.tronco.height = this.height/3.5
                break;
            case 6:
                this.hitbox.cuerpo.x = this.x+13,
                this.hitbox.cuerpo.y = this.y+60,
                this.hitbox.cuerpo.width = this.width/2,
                this.hitbox.cuerpo.height = this.height/2.3
                
                this.hitbox.cabeza.x = this.x+20,
                this.hitbox.cabeza.y = this.y+91,
                this.hitbox.cabeza.width = this.width/5.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+13,
                this.hitbox.tronco.y = this.y+60,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/3
                break;
            case 7:
                this.hitbox.cuerpo.x = this.x+14,
                this.hitbox.cuerpo.y = this.y+40,
                this.hitbox.cuerpo.width = this.width/3,
                this.hitbox.cuerpo.height = this.height/2
                
                this.hitbox.cabeza.x = this.x+18,
                this.hitbox.cabeza.y = this.y+80,
                this.hitbox.cabeza.width = this.width/5.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+14,
                this.hitbox.tronco.y = this.y+40,
                this.hitbox.tronco.width = this.width/3,
                this.hitbox.tronco.height = this.height/2.5
                break;
            case 8:
                this.hitbox.cuerpo.x = this.x+13,
                this.hitbox.cuerpo.y = this.y+40,
                this.hitbox.cuerpo.width = this.width/2.9,
                this.hitbox.cuerpo.height = this.height/3
                
                this.hitbox.cabeza.x = this.x+16,
                this.hitbox.cabeza.y = this.y+55,
                this.hitbox.cabeza.width = this.width/4.6,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+13,
                this.hitbox.tronco.y = this.y+40,
                this.hitbox.tronco.width = this.width/2.9,
                this.hitbox.tronco.height = this.height/3
                break;
            case 9:
                this.hitbox.cuerpo.x = this.x+13,
                this.hitbox.cuerpo.y = this.y+20,
                this.hitbox.cuerpo.width = this.width/1.8,
                this.hitbox.cuerpo.height = this.height/2.4
                
                this.hitbox.cabeza.x = this.x+18,
                this.hitbox.cabeza.y = this.y+20,
                this.hitbox.cabeza.width = this.width/5.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+13,
                this.hitbox.tronco.y = this.y+31,
                this.hitbox.tronco.width = this.width/1.8,
                this.hitbox.tronco.height = this.height/4
                break;
            case 10:
                this.hitbox.cuerpo.x = this.x+13,
                this.hitbox.cuerpo.y = this.y+33,
                this.hitbox.cuerpo.width = this.width/2.5,
                this.hitbox.cuerpo.height = this.height/1.4
                
                this.hitbox.cabeza.x = this.x+16,
                this.hitbox.cabeza.y = this.y+33,
                this.hitbox.cabeza.width = this.width/5.5,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+13,
                this.hitbox.tronco.y = this.y+45,
                this.hitbox.tronco.width = this.width/2.5,
                this.hitbox.tronco.height = this.height/1.8
                break;
            default:
                break;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionCaida) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarCaida(numAnimaciones));
        } else {
            this.animacionEnProgresoCaida = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            this.cuartaVez = true;
        }
        }
    }


    iniciarAnimacionHit() {
        this.animacionEnProgresoHit = true;
        this.inicioAnimacionHit = performance.now();
        this.animarHit();
    }

    animarHit() {
        if (this.animacionEnProgresoHit) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionHit;
        const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionHit, 1);
    
        // Actualizar la animación (código específico de animación aquí)
        this.personajeState = 'hit';
        this.position = Math.floor(progreso * 3.999);
    
        // if (this.id === 1) this.position = 3;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 3;	// esto es para hacer pruebas (eliminar)

        this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
        this.y = LIMITE_ABAJO - this.height;

        

        if (this.id === 1){

            if(this.primeraVez && this.position === 1) {
                this.x = this.x-14;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 2) {
                this.x = this.x-12;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 3) {
                this.x = this.x+16;
                this.tercerVez = false;
            }

            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+5, 
                    this.hitbox.cuerpo.y = this.y+8, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.15
                    
                    this.hitbox.cabeza.x = this.x+13,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+3,
                    this.hitbox.tronco.y = this.y+20,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/1.4
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+5, 
                    this.hitbox.cuerpo.y = this.y+8, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.15 

                    this.hitbox.patada.x = this.x+47, 
                    this.hitbox.patada.y = this.y+1, 
                    this.hitbox.patada.width = this.width/3.2, 
                    this.hitbox.patada.height = this.height/11

                    this.hitbox.cabeza.x = this.x+15,
                    this.hitbox.cabeza.y = this.y+11,
                    this.hitbox.cabeza.width = this.width/4.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+5,
                    this.hitbox.tronco.y = this.y+24,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/1.55
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+5, 
                    this.hitbox.cuerpo.y = this.y+17, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.3

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+25,
                    this.hitbox.cabeza.width = this.width/7,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+5,
                    this.hitbox.tronco.y = this.y+38,
                    this.hitbox.tronco.width = this.width/2,
                    this.hitbox.tronco.height = this.height/2
                    break;
                case 3:
                    this.hitbox.cuerpo.x = this.x+7, 
                    this.hitbox.cuerpo.y = this.y, 
                    this.hitbox.cuerpo.width = this.width/2.3, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x+12,
                    this.hitbox.cabeza.y = this.y+1,
                    this.hitbox.cabeza.width = this.width/3.9,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+5,
                    this.hitbox.tronco.y = this.y+13,
                    this.hitbox.tronco.width = this.width/2.2,
                    this.hitbox.tronco.height = this.height/1.25
                    break;
                default:
                    break;
            }
        } else {

            if(this.primeraVez && this.position === 0) {
                this.x = this.x+4;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x+8;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x+6;
                this.tercerVez = false;
            }
            if(this.cuartaVez && this.position === 3) {
                this.x = this.x+3;
                this.cuartaVez = false;
            }

            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+12, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.2
                
                this.hitbox.cabeza.x = this.x+22,
                this.hitbox.cabeza.y = this.y+12,
                this.hitbox.cabeza.width = this.width/3.9,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+25,
                this.hitbox.tronco.y = this.y+27,
                this.hitbox.tronco.width = this.width/2.9,
                this.hitbox.tronco.height = this.height/1.25
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+18, 
                this.hitbox.cuerpo.y = this.y+15, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.3
                
                this.hitbox.patada.x = this.x, 
                this.hitbox.patada.y = this.y+10, 
                this.hitbox.patada.width = this.width/3.2, 
                this.hitbox.patada.height = this.height/14
                
                this.hitbox.cabeza.x = this.x+15,
                this.hitbox.cabeza.y = this.y+17,
                this.hitbox.cabeza.width = this.width/4.2,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+27,
                this.hitbox.tronco.y = this.y+27,
                this.hitbox.tronco.width = this.width/3.1,
                this.hitbox.tronco.height = this.height/1.5
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+18, 
                this.hitbox.cuerpo.y = this.y+15, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.3

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+14,
                this.hitbox.cabeza.y = this.y+17,
                this.hitbox.cabeza.width = this.width/4.2,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+28,
                this.hitbox.tronco.y = this.y+27,
                this.hitbox.tronco.width = this.width/3.6,
                this.hitbox.tronco.height = this.height/1.5
                break;
            case 3:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+15, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.3

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+22,
                this.hitbox.cabeza.y = this.y+12,
                this.hitbox.cabeza.width = this.width/4.2,
                this.hitbox.cabeza.height = this.height/9

                this.hitbox.tronco.x = this.x+26,
                this.hitbox.tronco.y = this.y+22,
                this.hitbox.tronco.width = this.width/3.4,
                this.hitbox.tronco.height = this.height/1.3
                break;
            default:
                break;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionHit) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarHit());
        } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoHit = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            this.cuartaVez = true;
        }
        }
    }
    


    iniciarAnimacionRetroceso(cantidadDesplazamiento = 4) {
        this.animacionEnProgresoRetroceso = true;
        this.inicioAnimacionRetroceso = performance.now();
        this.animarRetroceso(cantidadDesplazamiento);
    }

    animarRetroceso(cantidadDesplazamiento) {
        if (this.animacionEnProgresoRetroceso) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionRetroceso;
        const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionRetroceso, 1);

        let despazamiento = cantidadDesplazamiento;

        if (this.id === 1){

            if(this.primeraVez && progreso < 0.25) {
                this.x -= despazamiento;
                this.primeraVez = false;
            }
            if(this.segundaVez && (progreso >= 0.25 && progreso < 0.5)) {
                this.x -= despazamiento;
                this.segundaVez = false;
            }
            if(this.tercerVez && (progreso >= 0.5 && progreso < 0.75)) {
                this.x -= despazamiento;
                this.tercerVez = false;
            }
            if(this.cuartaVez && progreso > 0.75) {
                this.x -= despazamiento;
                this.cuartaVez = false;
            }

        } else if (!this.animacionEnProgresoMovingPunch ) {

            if(this.primeraVez && progreso < 0.25) {
                this.x += despazamiento;
                this.primeraVez = false;
            }
            if(this.segundaVez && (progreso >= 0.25 && progreso < 0.5)) {
                this.x += despazamiento;
                this.segundaVez = false;
            }
            if(this.tercerVez && (progreso >= 0.5 && progreso < 0.75)) {
                this.x += despazamiento;
                this.tercerVez = false;
            }
            if(this.cuartaVez && progreso > 0.75) {
                this.x += despazamiento;
                this.cuartaVez = false;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionHit) {
            requestAnimationFrame(() => this.animarRetroceso(cantidadDesplazamiento));
        } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoRetroceso = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            this.cuartaVez = true;
        }
        }
    }


    
    iniciarAnimacionAgachadoHit() {
        this.animacionEnProgresoAgachadoHit = true;
        this.inicioAnimacionAgachadoHit = performance.now();
        this.animarAgachadoHit();
    }

    animarAgachadoHit() {
        if (this.animacionEnProgresoAgachadoHit) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionAgachadoHit;
        const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionAgachadoHit, 1);
    
        // Actualizar la animación (código específico de animación aquí)
        this.personajeState = 'agachadoHit';
        this.position = Math.floor(progreso * 0.999);
    
        // if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 0;	// esto es para hacer pruebas (eliminar)
    
        this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
        this.y = LIMITE_ABAJO - this.height;


        if (this.id === 1){
            this.hitbox.cuerpo.x = this.x+4, 
            this.hitbox.cuerpo.y = this.y+5, 
            this.hitbox.cuerpo.width = this.width/1.5, 
            this.hitbox.cuerpo.height = this.height/1.05

            this.hitbox.cabeza.x = this.x,
            this.hitbox.cabeza.y = this.y+5,
            this.hitbox.cabeza.width = this.width/3.8,
            this.hitbox.cabeza.height = this.height/6

            this.hitbox.tronco.x = this.x+4,
            this.hitbox.tronco.y = this.y+15,
            this.hitbox.tronco.width = this.width/2.3,
            this.hitbox.tronco.height = this.height/1.19

            if(this.primeraVez) {
                this.x = this.x-6;
                this.primeraVez = false;
            }
            if(this.segundaVez) {
                this.x = this.x - 15;
                this.segundaVez = false;
            }

        } else {
            this.hitbox.cuerpo.x = this.x+9, 
            this.hitbox.cuerpo.y = this.y+5, 
            this.hitbox.cuerpo.width = this.width/2.1, 
            this.hitbox.cuerpo.height = this.height/1.05
            
            this.hitbox.cabeza.x = this.x+13
            this.hitbox.cabeza.y = this.y+5
            this.hitbox.cabeza.width = this.width/3.8
            this.hitbox.cabeza.height = this.height/6

            this.hitbox.tronco.x = this.x+14,
            this.hitbox.tronco.y = this.y+15,
            this.hitbox.tronco.width = this.width/3,
            this.hitbox.tronco.height = this.height/1.19

            if(this.primeraVez) {
                this.x = this.x+15;
                this.primeraVez = false;
            }
            if(this.segundaVez) {
                this.x = this.x + 15;
                this.segundaVez = false;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionAgachadoHit) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarAgachadoHit());
        } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoAgachadoHit = false;
            if (this.id === 1) this.x = this.x + 6;
            if (this.id === 2) this.x = this.x - 15;
            this.primeraVez = true;
            this.segundaVez = true;
        }
        }
    }

    iniciarAnimacionStunned(numAnimaciones) {
        this.animacionEnProgresoStunned = true;
        this.inicioAnimacionStunned = performance.now();
        this.animarStunned(numAnimaciones);
    }

    animarStunned(numAnimaciones) {
        if (this.animacionEnProgresoStunned) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionStunned;

        let progreso;
        // if (tiempoTranscurrido < this.duracionAnimacionStunned/3){
        // 	progreso = Math.min(tiempoTranscurrido / (this.duracionAnimacionStunned/3), 1);
        // } else if (tiempoTranscurrido < this.duracionAnimacionStunned*2/3){
        // 	progreso = Math.min((tiempoTranscurrido - (this.duracionAnimacionStunned/3)) / (this.duracionAnimacionStunned/3), 1);
        // } else {
        // 	progreso = Math.min((tiempoTranscurrido - (this.duracionAnimacionStunned*2/3)) / (this.duracionAnimacionStunned/3), 1);
        // }
        if (tiempoTranscurrido < this.duracionAnimacionStunned/2){
            progreso = Math.min(tiempoTranscurrido / (this.duracionAnimacionStunned/2), 1);
        }  else {
            progreso = Math.min((tiempoTranscurrido - (this.duracionAnimacionStunned/2)) / (this.duracionAnimacionStunned/2), 1);
        }
    
        this.personajeState = 'stunned';
        this.position = Math.floor(progreso * numAnimaciones);

        // if (this.id === 1) this.position = 2;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 3;	// esto es para hacer pruebas (eliminar)

        this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
        this.y = LIMITE_ABAJO - this.height;

        if (this.id === 1){
            if(this.primeraVez && this.position === 0) {
                this.x = this.x-6;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-11;
                this.segundaVez = false;
            }
            
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+12, 
                    this.hitbox.cuerpo.y = this.y+5, 
                    this.hitbox.cuerpo.width = this.width/1.9, 
                    this.hitbox.cuerpo.height = this.height/1.05			
                    
                    this.hitbox.cabeza.x = this.x+28,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/4.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+15,
                    this.hitbox.tronco.y = this.y+17,
                    this.hitbox.tronco.width = this.width/2.7,
                    this.hitbox.tronco.height = this.height/1.3
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+8, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/1.7, 
                    this.hitbox.cuerpo.height = this.height/1.05	

                    this.hitbox.patada.x = this.x+47, 
                    this.hitbox.patada.y = this.y+1, 
                    this.hitbox.patada.width = this.width/3.2, 
                    this.hitbox.patada.height = this.height/11

                    this.hitbox.cabeza.x = this.x+18,
                    this.hitbox.cabeza.y = this.y,
                    this.hitbox.cabeza.width = this.width/3.7,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+9,
                    this.hitbox.tronco.y = this.y+12,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.2
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+5, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/1.7, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x+10,
                    this.hitbox.cabeza.y = this.y+2,
                    this.hitbox.cabeza.width = this.width/3.7,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+7,
                    this.hitbox.tronco.y = this.y+12,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.2
                    break;
                default:
                    break;
            }
        } else {
            this.hitbox.cuerpo.x = this.x+9, 
            this.hitbox.cuerpo.y = this.y+5, 
            this.hitbox.cuerpo.width = this.width/2.1, 
            this.hitbox.cuerpo.height = this.height/1.05

            if(this.primeraVez && this.position === 0) {
                this.x = this.x+6;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x+11;
                this.segundaVez = false;
            }

            switch(this.position){
            case 0:					
                this.hitbox.cabeza.x = this.x+10,
                this.hitbox.cabeza.y = this.y+1,
                this.hitbox.cabeza.width = this.width/3.8,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+14,
                this.hitbox.tronco.y = this.y+14,
                this.hitbox.tronco.width = this.width/2.4,
                this.hitbox.tronco.height = this.height/1.2
                break;
            case 1:
                this.hitbox.patada.x = this.x, 
                this.hitbox.patada.y = this.y+10, 
                this.hitbox.patada.width = this.width/3.2, 
                this.hitbox.patada.height = this.height/14
                
                this.hitbox.cabeza.x = this.x+15,
                this.hitbox.cabeza.y = this.y+1,
                this.hitbox.cabeza.width = this.width/3.8,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+14,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/2.4,
                this.hitbox.tronco.height = this.height/1.3
                break;
            case 2:
                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+22,
                this.hitbox.cabeza.y = this.y+3,
                this.hitbox.cabeza.width = this.width/6,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+14,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/2.4,
                this.hitbox.tronco.height = this.height/1.3
                break;
            case 3:
                this.hitbox.cabeza.x = this.x+15,
                this.hitbox.cabeza.y = this.y+1,
                this.hitbox.cabeza.width = this.width/3.8,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+16,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/2.4,
                this.hitbox.tronco.height = this.height/1.3
                break;
            default:
                break;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionStunned) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarStunned(numAnimaciones));
        } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoStunned = false;
            this.primeraVez = true;
            this.segundaVez = true;
        }
        }
    }
    
    iniciarAnimacionKO() {
        this.animacionEnProgresoKO = true;
        this.inicioAnimacionKO = performance.now();
        this.animarKO();
    }

    animarKO() {
        if (this.animacionEnProgresoKO) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacionKO;
        const progreso = Math.min(tiempoTranscurrido / (this.duracionAnimacionKO/60), 1);
        // const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionKO, 1);
    
        // Actualizar la animación (código específico de animación aquí)
        this.personajeState = 'KO';
        this.position = Math.floor(progreso * 4.999);

        // if (this.id === 1) this.position = 0;	// esto es para hacer pruebas (eliminar)
        // if (this.id === 2) this.position = 0;	// esto es para hacer pruebas (eliminar)
    
        this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
        this.y = LIMITE_ABAJO - this.height;
            
        this.hitbox.tronco.x = null,
        this.hitbox.tronco.y = null,
        this.hitbox.tronco.width = null,
        this.hitbox.tronco.height = null

        if (this.id === 1){

            if(this.primeraVez && this.position === 0) {
                this.x = this.x-30;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x-30;
                this.segundaVez = false;
            }
            
            switch(this.position){ 
                case 0:
                    this.hitbox.cuerpo.x = this.x+3, 
                    this.hitbox.cuerpo.y = this.y+6, 
                    this.hitbox.cuerpo.width = this.width/1.2, 
                    this.hitbox.cuerpo.height = this.height/1.4
                    
                    this.hitbox.cabeza.x = this.x+8,
                    this.hitbox.cabeza.y = this.y+5,
                    this.hitbox.cabeza.width = this.width/4,
                    this.hitbox.cabeza.height = this.height/4.7
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x, 
                    this.hitbox.cuerpo.y = this.y+18, 
                    this.hitbox.cuerpo.width = this.width/1.2, 
                    this.hitbox.cuerpo.height = this.height/1.8 

                    this.hitbox.patada.x = this.x+47, 
                    this.hitbox.patada.y = this.y+1, 
                    this.hitbox.patada.width = this.width/3.2, 
                    this.hitbox.patada.height = this.height/11

                    this.hitbox.cabeza.x = this.x-1,
                    this.hitbox.cabeza.y = this.y+31,
                    this.hitbox.cabeza.width = this.width/6,
                    this.hitbox.cabeza.height = this.height/4.7
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x, 
                    this.hitbox.cuerpo.y = this.y+28, 
                    this.hitbox.cuerpo.width = this.width/1.2, 
                    this.hitbox.cuerpo.height = this.height/2.2

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x-1,
                    this.hitbox.cabeza.y = this.y+40,
                    this.hitbox.cabeza.width = this.width/6,
                    this.hitbox.cabeza.height = this.height/4.7
                    break;
                case 3:
                    this.hitbox.cuerpo.x = this.x, 
                    this.hitbox.cuerpo.y = this.y+18, 
                    this.hitbox.cuerpo.width = this.width/1.2, 
                    this.hitbox.cuerpo.height = this.height/1.8

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x-1,
                    this.hitbox.cabeza.y = this.y+31,
                    this.hitbox.cabeza.width = this.width/6,
                    this.hitbox.cabeza.height = this.height/4.7
                    break;
                case 4:
                    this.hitbox.cuerpo.x = this.x+3, 
                    this.hitbox.cuerpo.y = this.y+27, 
                    this.hitbox.cuerpo.width = this.width/1.2, 
                    this.hitbox.cuerpo.height = this.height/2

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                    
                    this.hitbox.cabeza.x = this.x-1,
                    this.hitbox.cabeza.y = this.y+40,
                    this.hitbox.cabeza.width = this.width/6,
                    this.hitbox.cabeza.height = this.height/4.7
                    break;
                default:
                    break;
            }
        } else {

            if(this.primeraVez && this.position === 0) {
                this.x = this.x+15;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x+15;
                this.segundaVez = false;
            }

            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+12, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/1.3, 
                this.hitbox.cuerpo.height = this.height/1.5
                
                this.hitbox.cabeza.x = this.x+55,
                this.hitbox.cabeza.y = this.y+3,
                this.hitbox.cabeza.width = this.width/7,
                this.hitbox.cabeza.height = this.height/7
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+12, 
                this.hitbox.cuerpo.y = this.y+16, 
                this.hitbox.cuerpo.width = this.width/1.2, 
                this.hitbox.cuerpo.height = this.height/2.2
                
                this.hitbox.patada.x = this.x, 
                this.hitbox.patada.y = this.y+10, 
                this.hitbox.patada.width = this.width/3.2, 
                this.hitbox.patada.height = this.height/14
                
                this.hitbox.cabeza.x = this.x+63,
                this.hitbox.cabeza.y = this.y+21,
                this.hitbox.cabeza.width = this.width/7,
                this.hitbox.cabeza.height = this.height/6
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+12, 
                this.hitbox.cuerpo.y = this.y+45, 
                this.hitbox.cuerpo.width = this.width/1.2, 
                this.hitbox.cuerpo.height = this.height/3.8

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+64,
                this.hitbox.cabeza.y = this.y+48,
                this.hitbox.cabeza.width = this.width/7,
                this.hitbox.cabeza.height = this.height/6
                break;
            case 3:
                this.hitbox.cuerpo.x = this.x+12, 
                this.hitbox.cuerpo.y = this.y+16, 
                this.hitbox.cuerpo.width = this.width/1.2, 
                this.hitbox.cuerpo.height = this.height/2.2

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+63,
                this.hitbox.cabeza.y = this.y+21,
                this.hitbox.cabeza.width = this.width/7,
                this.hitbox.cabeza.height = this.height/6
                break;
            case 4:
                this.hitbox.cuerpo.x = this.x+12, 
                this.hitbox.cuerpo.y = this.y+45, 
                this.hitbox.cuerpo.width = this.width/1.2, 
                this.hitbox.cuerpo.height = this.height/3.8

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+64,
                this.hitbox.cabeza.y = this.y+48,
                this.hitbox.cabeza.width = this.width/7,
                this.hitbox.cabeza.height = this.height/6
                break;
            default:
                break;
            }
        }

        if (tiempoTranscurrido < this.duracionAnimacionKO) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarKO());
        } else {
            // console.log('ANIMACIÓN PUÑETAZO TERMINADA');
            this.animacionEnProgresoKO = false;
            this.primeraVez = true;
            this.segundaVez = true;
        }
        }
    }

    
    iniciarAnimacionLowKick(numAnimaciones, duracionAnimacionLowKick) {
        this.animacionEnProgresoLowKick = true;
        this.inicioAnimacionLowKick = performance.now();

        (this.id === 1) ? miPersonaje.energia -= energiaGolpe.lowKick : miEnemigo.energia -= energiaGolpe.lowKick;
        this.animarLowKick(numAnimaciones, duracionAnimacionLowKick);
    }

    animarLowKick(numAnimaciones, duracionAnimacionLowKick) {
        if (this.animacionEnProgresoLowKick) {
          const tiempoActual = performance.now();
          const tiempoTranscurrido = tiempoActual - this.inicioAnimacionLowKick;
          const progreso = Math.min(tiempoTranscurrido / duracionAnimacionLowKick, 1);
    
          // Actualizar la animación (código específico de animación aquí)
          this.personajeState = 'lowKick';
          this.position = Math.floor(progreso * numAnimaciones);

            // if (this.id === 1) this.position = 1;	// esto es para hacer pruebas (eliminar)
            // if (this.id === 2) this.position = 3;	// esto es para hacer pruebas (eliminar)

          this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
          this.y = LIMITE_ABAJO - this.height;

          if (this.id === 1){
            
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+20, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2.8, 
                    this.hitbox.cuerpo.height = this.height/1.05
                        
                    this.hitbox.cabeza.x = this.x+25,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+23,
                    this.hitbox.tronco.y = this.y+16,
                    this.hitbox.tronco.width = this.width/2.85,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+72,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.5
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+28, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2.8, 
                    this.hitbox.cuerpo.height = this.height/1.05 
                        
                    this.hitbox.patada.x = this.x+50, 
                    this.hitbox.patada.y = this.y+45, 
                    this.hitbox.patada.width = this.width/3.5, 
                    this.hitbox.patada.height = this.height/5.5
                        
                    this.hitbox.cabeza.x = this.x+22,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+28,
                    this.hitbox.tronco.y = this.y+16,
                    this.hitbox.tronco.width = this.width/4.8,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+72,
                    this.hitbox.pies.width = this.width/7,
                    this.hitbox.pies.height = this.height/9.5
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+20, 
                    this.hitbox.cuerpo.y = this.y+2, 
                    this.hitbox.cuerpo.width = this.width/2.8, 
                    this.hitbox.cuerpo.height = this.height/1.05

                    this.hitbox.patada.x = null, 
                    this.hitbox.patada.y = null, 
                    this.hitbox.patada.width = null, 
                    this.hitbox.patada.height = null
                        
                    this.hitbox.cabeza.x = this.x+23,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6

                    this.hitbox.tronco.x = this.x+23,
                    this.hitbox.tronco.y = this.y+16,
                    this.hitbox.tronco.width = this.width/2.85,
                    this.hitbox.tronco.height = this.height/1.35

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+72,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.5
                    break;
                default:
                    break;
            }
          } else {

            
            if(this.primeraVez && this.position === 2) {
                this.x = this.x-21;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 3) {
                this.x = this.x-14;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 4) {
                this.x = this.x+35;
                this.tercerVez = false;
            }
        
            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+15, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/3, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.cabeza.x = this.x+17,
                this.hitbox.cabeza.y = this.y+5,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+12,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/2.4,
                this.hitbox.tronco.height = this.height/1.35

                this.hitbox.pies.x = this.x+1,
                this.hitbox.pies.y = this.y+57,
                this.hitbox.pies.width = this.width/4.8,
                this.hitbox.pies.height = this.height/5
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+15, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/3, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.cabeza.x = this.x+15,
                this.hitbox.cabeza.y = this.y+30,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+12,
                this.hitbox.tronco.y = this.y+41,
                this.hitbox.tronco.width = this.width/1.9,
                this.hitbox.tronco.height = this.height/1.35

                this.hitbox.pies.x = this.x+5,
                this.hitbox.pies.y = this.y+59,
                this.hitbox.pies.width = this.width/4.8,
                this.hitbox.pies.height = this.height/5
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+22, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/3, 
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.cabeza.x = this.x+37,
                this.hitbox.cabeza.y = this.y+30,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+20,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/4,
                this.hitbox.tronco.height = this.height/1.35

                this.hitbox.pies.x = this.x+28,
                this.hitbox.pies.y = this.y+56,
                this.hitbox.pies.width = this.width/7,
                this.hitbox.pies.height = this.height/5
                break;
            case 3:
                this.hitbox.cuerpo.x = this.x+27, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/2.7, 
                this.hitbox.cuerpo.height = this.height/1.1
                        
                this.hitbox.patada.x = this.x, 
                this.hitbox.patada.y = this.y+13, 
                this.hitbox.patada.width = this.width/4, 
                this.hitbox.patada.height = this.height/6.5
                
                this.hitbox.cabeza.x = this.x+52,
                this.hitbox.cabeza.y = this.y+30,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+32,
                this.hitbox.tronco.y = this.y+28,
                this.hitbox.tronco.width = this.width/3.8,
                this.hitbox.tronco.height = this.height/2.5

                this.hitbox.pies.x = this.x+41,
                this.hitbox.pies.y = this.y+58,
                this.hitbox.pies.width = this.width/8,
                this.hitbox.pies.height = this.height/5
                break;
            case 4:
                this.hitbox.cuerpo.x = this.x+9, 
                this.hitbox.cuerpo.y = this.y+24, 
                this.hitbox.cuerpo.width = this.width/2, 
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.patada.x = null, 
                this.hitbox.patada.y = null, 
                this.hitbox.patada.width = null, 
                this.hitbox.patada.height = null
                
                this.hitbox.cabeza.x = this.x+8,
                this.hitbox.cabeza.y = this.y+30,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+10,
                this.hitbox.tronco.y = this.y+41,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/2.5

                this.hitbox.pies.x = null,
                this.hitbox.pies.y = null,
                this.hitbox.pies.width = null,
                this.hitbox.pies.height = null
                break;
            default:
                break;
            }
          }

          if (tiempoTranscurrido < duracionAnimacionLowKick) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarLowKick(numAnimaciones, duracionAnimacionLowKick));
          } else {
            // console.log('ANIMACIÓN PATADA BAJA TERMINADA');
            this.animacionEnProgresoLowKick = false;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
          }
        }
    }
    
    iniciarAnimacionAgachadoUpper(numAnimaciones) {
        this.animacionEnProgresoAgachadoUpper = true;
        this.inicioAnimacionAgachadoUpper = performance.now();

        (this.id === 1) ? miPersonaje.energia -= energiaGolpe.agachadoUpper : miEnemigo.energia -= energiaGolpe.agachadoUpper;
        this.animarAgachadoUpper(numAnimaciones);
    }

    animarAgachadoUpper(numAnimaciones) {
        if (this.animacionEnProgresoAgachadoUpper) {
          const tiempoActual = performance.now();
          const tiempoTranscurrido = tiempoActual - this.inicioAnimacionAgachadoUpper;
          const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionAgachadoUpper, 1);
    
          // Actualizar la animación (código específico de animación aquí)
          this.personajeState = 'agachadoUpper';
          this.position = Math.floor(progreso * numAnimaciones);
    
        //   if (this.id === 1) this.position = 1;	// esto es para hacer pruebas (eliminar)
        //   if (this.id === 2) this.position = 2;	// esto es para hacer pruebas (eliminar)

          this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
          this.y = LIMITE_ABAJO - this.height;

          if (this.id === 1){

            if(this.primeraVez && this.position === 0) {
                this.x = this.x+10;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 1) {
                this.x = this.x+10;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 2) {
                this.x = this.x+5;
                this.tercerVez = false;
            }
            if(this.cuartaVez && this.position === 3) {
                this.x = this.x-5;
                this.cuartaVez = false;
            }
            if(this.quintaVez && this.position === 4) {
                this.x = this.x-10;
                this.quintaVez = false;
            }
            
            switch(this.position){
                case 0:
                    this.hitbox.cuerpo.x = this.x+10, 
                    this.hitbox.cuerpo.y = this.y+50, 
                    this.hitbox.cuerpo.width = this.width/2.2, 
                    this.hitbox.cuerpo.height = this.height/1.85
                    
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+47,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/9

                    this.hitbox.tronco.x = this.x+11,
                    this.hitbox.tronco.y = this.y+59,
                    this.hitbox.tronco.width = this.width/2.3,
                    this.hitbox.tronco.height = this.height/2.3

                    this.hitbox.pies.x = null,
                    this.hitbox.pies.y = null,
                    this.hitbox.pies.width = null,
                    this.hitbox.pies.height = null
                    break;
                case 1:
                    this.hitbox.cuerpo.x = this.x+15, 
                    this.hitbox.cuerpo.y = this.y+32, 
                    this.hitbox.cuerpo.width = this.width/2.6, 
                    this.hitbox.cuerpo.height = this.height/1.5 

                    this.hitbox.punio.x = this.x+40, 
                    this.hitbox.punio.y = this.y+32, 
                    this.hitbox.punio.width = this.width/4.9, 
                    this.hitbox.punio.height = this.height/8

                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+32,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/9

                    this.hitbox.tronco.x = this.x+15,
                    this.hitbox.tronco.y = this.y+44,
                    this.hitbox.tronco.width = this.width/2.4,
                    this.hitbox.tronco.height = this.height/1.7

                    this.hitbox.pies.x = this.x+25,
                    this.hitbox.pies.y = this.y+100,
                    this.hitbox.pies.width = this.width/4,
                    this.hitbox.pies.height = this.height/11	
                    break;
                case 2:
                    this.hitbox.cuerpo.x = this.x+22, 
                    this.hitbox.cuerpo.y = this.y+25, 
                    this.hitbox.cuerpo.width = this.width/2.4, 
                    this.hitbox.cuerpo.height = this.height/1.35 

                    this.hitbox.punio.x = this.x+33, 
                    this.hitbox.punio.y = this.y, 
                    this.hitbox.punio.width = this.width/6, 
                    this.hitbox.punio.height = this.height/6
                    
                    this.hitbox.cabeza.x = this.x+28,
                    this.hitbox.cabeza.y = this.y+25,
                    this.hitbox.cabeza.width = this.width/4.8,
                    this.hitbox.cabeza.height = this.height/9

                    this.hitbox.tronco.x = this.x+20,
                    this.hitbox.tronco.y = this.y+37,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.7

                    this.hitbox.pies.x = this.x+25,
                    this.hitbox.pies.y = this.y+99,
                    this.hitbox.pies.width = this.width/4,
                    this.hitbox.pies.height = this.height/11
                    break;
                case 3:
                    this.hitbox.cuerpo.x = this.x+15, 
                    this.hitbox.cuerpo.y = this.y+32, 
                    this.hitbox.cuerpo.width = this.width/2.6, 
                    this.hitbox.cuerpo.height = this.height/1.5 

                    this.hitbox.punio.x = this.x+40, 
                    this.hitbox.punio.y = this.y+32, 
                    this.hitbox.punio.width = this.width/4.9, 
                    this.hitbox.punio.height = this.height/8
                    
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+32,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/9

                    this.hitbox.tronco.x = this.x+15,
                    this.hitbox.tronco.y = this.y+44,
                    this.hitbox.tronco.width = this.width/2.4,
                    this.hitbox.tronco.height = this.height/1.7

                    this.hitbox.pies.x = this.x+25,
                    this.hitbox.pies.y = this.y+100,
                    this.hitbox.pies.width = this.width/4,
                    this.hitbox.pies.height = this.height/11
                    break;
                case 4:
                    this.hitbox.cuerpo.x = this.x+10, 
                    this.hitbox.cuerpo.y = this.y+50, 
                    this.hitbox.cuerpo.width = this.width/2.2, 
                    this.hitbox.cuerpo.height = this.height/1.85

                    this.hitbox.punio.x = null, 
                    this.hitbox.punio.y = null, 
                    this.hitbox.punio.width = null, 
                    this.hitbox.punio.height = null
                    
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+47,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/9

                    this.hitbox.tronco.x = null,
                    this.hitbox.tronco.y = null,
                    this.hitbox.tronco.width = null,
                    this.hitbox.tronco.height = null
                    break;
                default:
                    break;
            }
          } else {

            if(this.primeraVez && this.position === 0) {
                this.x = this.x-20;
                this.primeraVez = false;
            }
            if(this.segundaVez && this.position === 2) {
                this.x = this.x-6;
                this.segundaVez = false;
            }
            if(this.tercerVez && this.position === 3) {
                this.x = this.x+6;
                this.tercerVez = false;
            }

            switch(this.position){
            case 0:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+25, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.6
                
                this.hitbox.cabeza.x = this.x+24,
                this.hitbox.cabeza.y = this.y+22,
                this.hitbox.cabeza.width = this.width/8,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+26,
                this.hitbox.tronco.y = this.y+35,
                this.hitbox.tronco.width = this.width/4,
                this.hitbox.tronco.height = this.height/2

                this.hitbox.pies.x = null,
                this.hitbox.pies.y = null,
                this.hitbox.pies.width = null,
                this.hitbox.pies.height = null
                break;
            case 1:
                this.hitbox.cuerpo.x = this.x+18, 
                this.hitbox.cuerpo.y = this.y+20, 
                this.hitbox.cuerpo.width = this.width/2.5, 
                this.hitbox.cuerpo.height = this.height/1.4
                
                this.hitbox.cabeza.x = this.x+22,
                this.hitbox.cabeza.y = this.y+18,
                this.hitbox.cabeza.width = this.width/8,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+24,
                this.hitbox.tronco.y = this.y+31,
                this.hitbox.tronco.width = this.width/5,
                this.hitbox.tronco.height = this.height/2

                this.hitbox.pies.x = this.x+4,
                this.hitbox.pies.y = this.y+62,
                this.hitbox.pies.width = this.width/5.5,
                this.hitbox.pies.height = this.height/7
                break;
            case 2:
                this.hitbox.cuerpo.x = this.x+20, 
                this.hitbox.cuerpo.y = this.y+12, 
                this.hitbox.cuerpo.width = this.width/3.1, 
                this.hitbox.cuerpo.height = this.height/1.25

                this.hitbox.punio.x = this.x+1, 
                this.hitbox.punio.y = this.y, 
                this.hitbox.punio.width = this.width/8, 
                this.hitbox.punio.height = this.height/8
                
                this.hitbox.cabeza.x = this.x+25,
                this.hitbox.cabeza.y = this.y+12,
                this.hitbox.cabeza.width = this.width/8,
                this.hitbox.cabeza.height = this.height/8

                this.hitbox.tronco.x = this.x+24,
                this.hitbox.tronco.y = this.y+22,
                this.hitbox.tronco.width = this.width/4,
                this.hitbox.tronco.height = this.height/1.5

                this.hitbox.pies.x = this.x+10,
                this.hitbox.pies.y = this.y+62,
                this.hitbox.pies.width = this.width/5.5,
                this.hitbox.pies.height = this.height/7
                break;
            case 3:
                this.hitbox.cuerpo.x = this.x+23, 
                this.hitbox.cuerpo.y = this.y+25, 
                this.hitbox.cuerpo.width = this.width/3.1, 
                this.hitbox.cuerpo.height = this.height/1.25

                this.hitbox.punio.x = null, 
                this.hitbox.punio.y = null, 
                this.hitbox.punio.width = null, 
                this.hitbox.punio.height = null
                
                this.hitbox.cabeza.x = this.x+24,
                this.hitbox.cabeza.y = this.y+25,
                this.hitbox.cabeza.width = this.width/8,
                this.hitbox.cabeza.height = this.height/8

                this.hitbox.tronco.x = this.x+32,
                this.hitbox.tronco.y = this.y+35,
                this.hitbox.tronco.width = this.width/6,
                this.hitbox.tronco.height = this.height/1.8

                this.hitbox.pies.x = this.x+5,
                this.hitbox.pies.y = this.y+63,
                this.hitbox.pies.width = this.width/5.5,
                this.hitbox.pies.height = this.height/7
                break;
            default:
                break;
            }
          }

          if (tiempoTranscurrido < this.duracionAnimacionAgachadoUpper) {
            // Continuar animación si no ha alcanzado la duración máxima
            requestAnimationFrame(() => this.animarAgachadoUpper(numAnimaciones));
          } else {
            // console.log('ANIMACIÓN PATADA BAJA TERMINADA');
            this.animacionEnProgresoAgachadoUpper = false;
            if (this.id === 1) this.x = this.x - 10;
            if (this.id === 2) this.x = this.x + 20;
            this.primeraVez = true;
            this.segundaVez = true;
            this.tercerVez = true;
            this.cuartaVez = true;
            this.quintaVez = true;
          }
        }
    }

    generaAgacharse() {
        this.personajeState = 'agacharse';
        this.velocidadX = 0;
    }
    generaBloquearArriba() {
        this.personajeState = 'bloquearArriba';
        this.velocidadX = 0;	
    }
    generaBloquearAbajo() {
        this.personajeState = 'bloquearAbajo';
        this.velocidadX = 0;	
    }
    generaSaltar() {
        this.personajeState = 'saltar';
        this.velocidadAnimacion = TASA_REFRESCO_ADECUADA.velocidadAnimacionSalto;
        this.vy -= TASA_REFRESCO_ADECUADA.vy;
        this.AnimationFrame = 0; //para que la animación empiece desde 0
        //  RELACION entre velocidadAnimacion e vy -> velocidadAnimacion = vy * 4
        // velocidadAnimacion 20 ----  vy -= 5
        // velocidadAnimacion 40 ---- vy -= 10
    }
    salto() {
        this.y += this.vy;
        if (!this.onGround()) {
            //este condicional sirve para que puedas golpear en el aire
            if(!this.animacionEnProgresoMovingPunch && !this.animacionEnProgresoKick) { 
                this.personajeState = 'saltar';
            }
            this.velocidadAnimacion = TASA_REFRESCO_ADECUADA.velocidadAnimacionSalto;
            this.vy += this.weight;
            // console.log(this.position);
        }
        if (this.y > LIMITE_ABAJO - this.height) this.y = LIMITE_ABAJO - this.height;
    }
    onGround() {
        return this.y >= LIMITE_ABAJO - this.height;
    }


    comprobarHitBox(){
        //aquí utilizo una función de array para comprobar que no se esté realizando ninguna animación larga
        if ( !animacionesLargas.some( (value) => this.personajeState === value )){
            // position2 es igual que position -> para no crear problemas de sincronización
            this.position2 = Math.floor(gameFrame / this.velocidadAnimacion) % this.spriteAnimations[this.personajeState].loc.length;
            this.height = this.spriteAnimations[this.personajeState].loc[this.position2].height;
            this.y = LIMITE_ABAJO - this.height;
            
            //excepción porque el sprite de bloquear abajo de miEnemigo esta diseñado de forma distinta
            if (this.id === 2 && this.personajeState === 'bloquearAbajo') this.y += 2;
        }
        if (this.id === 2 && this.personajeState === 'agachadoHit') this.y += 2;
        if (this.id === 2 && this.personajeState === 'caida') this.y += 8;

        //cuando no se esté dando un puñetazo desaparece la hitbox del puño
        if (this.personajeState !== 'movingPunch' && this.personajeState !== 'agachadoPunch' && this.personajeState !== 'agachadoUpper'){
            this.hitbox.punio.x = null, 
            this.hitbox.punio.y = null, 
            this.hitbox.punio.width = null, 
            this.hitbox.punio.height = null
        }
        //cuando no se esté dando una patada desaparece la hitbox de la patada
        if (this.personajeState !== 'kick' && this.personajeState !== 'lowKick' && this.personajeState !== 'agachadoBarrido'){
            this.hitbox.patada.x = null, 
            this.hitbox.patada.y = null, 
            this.hitbox.patada.width = null, 
            this.hitbox.patada.height = null
        }
        //cuando no se esté haciendo una animaicón que necesita equilibrio la hitbox de los pies desaparece para que no se pueda caer
        if ( !animacionesNecesitaEquilibrio.some( (value) => this.personajeState === value )){
            this.hitbox.pies.x = null,
            this.hitbox.pies.y = null,
            this.hitbox.pies.width = null,
            this.hitbox.pies.height = null
        }

        if (this.id === 1){
            // this.x = 260;
            if(this.personajeState === 'reposo') {		
                this.hitbox.cuerpo.x = this.x+10,
                this.hitbox.cuerpo.y = this.y+4,
                this.hitbox.cuerpo.width = this.width/2.5,
                this.hitbox.cuerpo.height = this.height/1.1
                
                this.hitbox.cabeza.x = this.x+18,
                this.hitbox.cabeza.y = this.y+1,
                this.hitbox.cabeza.width = this.width/3.5,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+8,
                this.hitbox.tronco.y = this.y+16,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/1.3

                this.hitbox.pies.x = null,
                this.hitbox.pies.y = null,
                this.hitbox.pies.width = null,
                this.hitbox.pies.height = null

            } else if (this.personajeState === 'caminando') {
                this.hitbox.cuerpo.x = this.x+12,
                this.hitbox.cuerpo.y = this.y+4,
                this.hitbox.cuerpo.width = this.width/2.5,
                this.hitbox.cuerpo.height = this.height/1.1

                if (this.position === 0){
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+8,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6
                    
                    this.hitbox.tronco.x = this.x+9,
                    this.hitbox.tronco.y = this.y+23,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+26,
                    this.hitbox.pies.y = this.y+70,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.8
                } else if (this.position === 1){
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6
                    
                    this.hitbox.tronco.x = this.x+9,
                    this.hitbox.tronco.y = this.y+18,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+18,
                    this.hitbox.pies.y = this.y+68,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.8
                } else if (this.position === 2){
                    this.hitbox.cabeza.x = this.x+21,
                    this.hitbox.cabeza.y = this.y+1,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6
                    
                    this.hitbox.tronco.x = this.x+8,
                    this.hitbox.tronco.y = this.y+15,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+17,
                    this.hitbox.pies.y = this.y+69,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.8
                } else if (this.position === 3){
                    this.hitbox.cabeza.x = this.x+20,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6
                    
                    this.hitbox.tronco.x = this.x+8,
                    this.hitbox.tronco.y = this.y+17,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+21,
                    this.hitbox.pies.y = this.y+69,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.8
                } else if (this.position === 4){
                    this.hitbox.cabeza.x = this.x+19,
                    this.hitbox.cabeza.y = this.y+3,
                    this.hitbox.cabeza.width = this.width/3.5,
                    this.hitbox.cabeza.height = this.height/6
                    
                    this.hitbox.tronco.x = this.x+6,
                    this.hitbox.tronco.y = this.y+17,
                    this.hitbox.tronco.width = this.width/2.1,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+26,
                    this.hitbox.pies.y = this.y+70,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/7.8
                }
            } else if (this.personajeState === 'agacharse') {
                this.hitbox.cuerpo.x = this.x+15,
                this.hitbox.cuerpo.y = this.y+3,
                this.hitbox.cuerpo.width = this.width/1.9,
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.cabeza.x = this.x+23,
                this.hitbox.cabeza.y = this.y+3,
                this.hitbox.cabeza.width = this.width/3.5,
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+13,
                this.hitbox.tronco.y = this.y+13,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/1.1
            } else if (this.personajeState === 'bloquearArriba') {
                this.hitbox.cuerpo.x = this.x+8, 
                this.hitbox.cuerpo.y = this.y+1, 
                this.hitbox.cuerpo.width = this.width/2.1, 
                this.hitbox.cuerpo.height = this.height/1.05
                
                this.hitbox.cabeza.x = this.x+12,
                this.hitbox.cabeza.y = this.y+1,
                this.hitbox.cabeza.width = this.width/3.5,
                this.hitbox.cabeza.height = this.height/6
                    
                this.hitbox.tronco.x = this.x+9,
                this.hitbox.tronco.y = this.y+16,
                this.hitbox.tronco.width = this.width/2.1,
                this.hitbox.tronco.height = this.height/1.3
            } else if (this.personajeState === 'bloquearAbajo') {
                this.hitbox.cuerpo.x = this.x+9,
                this.hitbox.cuerpo.y = this.y+2,
                this.hitbox.cuerpo.width = this.width/1.8,
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.cabeza.x = this.x+12,
                this.hitbox.cabeza.y = this.y+4, 
                this.hitbox.cabeza.width = this.width/3.5, 
                this.hitbox.cabeza.height = this.height/6

                this.hitbox.tronco.x = this.x+10,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/2.3,
                this.hitbox.tronco.height = this.height/1.1
            }
        } else {
            // this.x = 300;
            if(this.personajeState === 'reposo') {
                this.hitbox.cuerpo.x = this.x+18,
                this.hitbox.cuerpo.y = this.y+2,
                this.hitbox.cuerpo.width = this.width/2.7,
                this.hitbox.cuerpo.height = this.height/1.05
                
                this.hitbox.cabeza.x = this.x+20,
                this.hitbox.cabeza.y = this.y+5,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+14,
                this.hitbox.tronco.y = this.y+18,
                this.hitbox.tronco.width = this.width/2,
                this.hitbox.tronco.height = this.height/1.3

                this.hitbox.pies.x = null,
                this.hitbox.pies.y = null,
                this.hitbox.pies.width = null,
                this.hitbox.pies.height = null

            } else if (this.personajeState === 'caminando') {
                this.hitbox.cuerpo.x = this.x+16, 
                this.hitbox.cuerpo.y = this.y+2, 
                this.hitbox.cuerpo.width = this.width/2.7, 
                this.hitbox.cuerpo.height = this.height/1.05


                if (this.position === 0){
                    this.hitbox.cabeza.x = this.x+14,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+22,
                    this.hitbox.tronco.y = this.y+21,
                    this.hitbox.tronco.width = this.width/4.7,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+14,
                    this.hitbox.pies.y = this.y+68,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5

                } else if (this.position === 1){
                    this.hitbox.cabeza.x = this.x+15,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+24,
                    this.hitbox.tronco.y = this.y+21,
                    this.hitbox.tronco.width = this.width/4.7,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+68,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+68,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5
                } else if (this.position === 2){
                    this.hitbox.cabeza.x = this.x+15,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+20,
                    this.hitbox.tronco.y = this.y+21,
                    this.hitbox.tronco.width = this.width/2.7,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+20,
                    this.hitbox.pies.y = this.y+62,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5

                } else if (this.position === 3){
                    this.hitbox.cabeza.x = this.x+15,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+20,
                    this.hitbox.tronco.y = this.y+21,
                    this.hitbox.tronco.width = this.width/2.4,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+17,
                    this.hitbox.pies.y = this.y+67,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5

                } else if (this.position === 4){
                    this.hitbox.cabeza.x = this.x+16,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+23,
                    this.hitbox.tronco.y = this.y+21,
                    this.hitbox.tronco.width = this.width/3.3,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+25,
                    this.hitbox.pies.y = this.y+67,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5
                } else if (this.position === 5){
                    this.hitbox.cabeza.x = this.x+15,
                    this.hitbox.cabeza.y = this.y+7,
                    this.hitbox.cabeza.width = this.width/5,
                    this.hitbox.cabeza.height = this.height/7

                    this.hitbox.tronco.x = this.x+23,
                    this.hitbox.tronco.y = this.y+21,
                    this.hitbox.tronco.width = this.width/3.3,
                    this.hitbox.tronco.height = this.height/1.3

                    this.hitbox.pies.x = this.x+28,
                    this.hitbox.pies.y = this.y+68,
                    this.hitbox.pies.width = this.width/4.8,
                    this.hitbox.pies.height = this.height/5.5
                }
            } else if (this.personajeState === 'agacharse') {
                this.hitbox.cuerpo.x = this.x+10,
                this.hitbox.cuerpo.y = this.y+3,
                this.hitbox.cuerpo.width = this.width/2.2,
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.cabeza.x = this.x+9,
                this.hitbox.cabeza.y = this.y+7,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+11,
                this.hitbox.tronco.y = this.y+15,
                this.hitbox.tronco.width = this.width/2.3,
                this.hitbox.tronco.height = this.height/1.1
            } else if (this.personajeState === 'bloquearArriba') {
                this.hitbox.cuerpo.x = this.x+19,
                this.hitbox.cuerpo.y = this.y+2,
                this.hitbox.cuerpo.width = this.width/2.4,
                this.hitbox.cuerpo.height = this.height/1.05

                this.hitbox.cabeza.x = this.x+24,
                this.hitbox.cabeza.y = this.y+3,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+17,
                this.hitbox.tronco.y = this.y+18,
                this.hitbox.tronco.width = this.width/2.2,
                this.hitbox.tronco.height = this.height/1.3
            } else if (this.personajeState === 'bloquearAbajo') {
                this.hitbox.cuerpo.x = this.x+10,
                this.hitbox.cuerpo.y = this.y+6,
                this.hitbox.cuerpo.width = this.width/1.7,
                this.hitbox.cuerpo.height = this.height/1.1

                this.hitbox.cabeza.x = this.x+19,
                this.hitbox.cabeza.y = this.y+11,
                this.hitbox.cabeza.width = this.width/5,
                this.hitbox.cabeza.height = this.height/7

                this.hitbox.tronco.x = this.x+21,
                this.hitbox.tronco.y = this.y+19,
                this.hitbox.tronco.width = this.width/3.4,
                this.hitbox.tronco.height = this.height/1.8
            } 
        }
    }
    iniciarAnimacionBien(){ //algunas animaciones necesitan que se empiecen desde el primer FRAME
        if(this.personajeState === 'saltar'){
            this.position = Math.floor(this.AnimationFrame / this.velocidadAnimacion) % this.spriteAnimations[this.personajeState].loc.length;
            // console.log('POSICIÓN ANIMACIÓN: '+this.position);
        } else if(!animacionesLargas.some( (value) => this.personajeState === value )) {
            this.position = Math.floor(gameFrame / this.velocidadAnimacion) % this.spriteAnimations[this.personajeState].loc.length;
        }
    }

    dibujarNormal() {
        this.x += this.velocidadX;
        this.salto();	

        this.comprobarHitBox();        //modifica 'height' e 'y' segun la animación
        this.iniciarAnimacionBien();   //iniciar animacion desde el primer frame
        
        // if(this.id === 1) {
        // 	if (this.personajeState === 'caminando') {
        // 		this.position = Loc;
        // 	} else {
        // 		this.position = 0;
        // 	}
        // 	this.x = 260;
        // }
        // if(this.id === 2) {
        // 	if (this.personajeState === 'caminando') {
        // 		this.position = Loc;
        // 	} else {
        // 		this.position = 0;
        // 	}
        // 	this.x = 300;
        // }
        this.frameX = this.spriteAnimations[this.personajeState].loc[this.position].x;
        this.frameY = this.spriteAnimations[this.personajeState].loc[this.position].y;
        this.spriteWidth = this.spriteAnimations[this.personajeState].loc[this.position].width;
        this.spriteHeight = this.spriteAnimations[this.personajeState].loc[this.position].height;
        
        // this.frameX = this.spriteAnimations[this.personajeState].loc[Loc].x;
        // this.frameY = this.spriteAnimations[this.personajeState].loc[Loc].y;
        // this.spriteWidth = this.spriteAnimations[this.personajeState].loc[Loc].width;
        // this.spriteHeight = this.spriteAnimations[this.personajeState].loc[Loc].height;
        
        this.width = this.spriteWidth;
        // this.height = this.spriteHeight;


        ctx.drawImage(this.image, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.spriteWidth, this.spriteHeight);

            
        // 	cajaAzul = '#00f8';
        // 	cajaBlanca = "#fff8";
        // 	cajaNegra = "#000";
        // ctx.fillStyle = cajaNegra;
        // if(this.id === 1) {
        // 	// ctx.fillRect(this.x+8, this.y+3, this.width/3.5, this.height/6);
        // 	ctx.fillRect(this.hitbox.cabeza.x, this.hitbox.cabeza.y, this.hitbox.cabeza.width, this.hitbox.cabeza.height);
        // 	ctx.fillStyle = cajaBlanca;
        // 	// XXXposition1 = 3;
        // 	// ctx.fillRect(this.x-1,this.y+40,this.width/6,this.height/4.7);
        // 	ctx.fillRect(this.hitbox.tronco.x, this.hitbox.tronco.y, this.hitbox.tronco.width, this.hitbox.tronco.height);
        // 	ctx.fillStyle = cajaAzul;
        // 	ctx.fillRect(this.hitbox.cuerpo.x, this.hitbox.cuerpo.y, this.hitbox.cuerpo.width, this.hitbox.cuerpo.height);
        // }

        // ctx.fillStyle = '#0008';
        // if(this.id === 2) {
        // 	// ctx.fillRect(this.x+20, this.y+5, this.width/5, this.height/7);
        // 	ctx.fillRect(this.hitbox.cabeza.x, this.hitbox.cabeza.y, this.hitbox.cabeza.width, this.hitbox.cabeza.height);
        // 	ctx.fillStyle = '#fff8';
        // 	// XXXposition2 = 0;
        // 	// ctx.fillRect(this.x+64,this.y+48,this.width/7,this.height/6);
        // 	ctx.fillRect(this.hitbox.tronco.x, this.hitbox.tronco.y, this.hitbox.tronco.width, this.hitbox.tronco.height);
        // 	ctx.fillStyle = '#00f8';
        // 	ctx.fillRect(this.hitbox.cuerpo.x, this.hitbox.cuerpo.y, this.hitbox.cuerpo.width, this.hitbox.cuerpo.height);
        // }
        
    }
}