window.onload = function () {
	//EXPLICACIÓN
	/**
	 *  Es un juego de lucha marcial entre dos jugadores.
	 * 
	 * He creado una única clase llamada 'Personaje', de donde instancio los dos objetos principales que son miPersonaje y miEnemigo (que son los dos peleadores)
	 * Obviamente, cada uno controlado por un jugador distinto.
	 * 
	 * El código se ve tan largo debido a que he tenido que asignarles hitbox a cada posición de cada animación que hacen (estar quitos, camninar, dar un golpe, al recibirlo)
	 * A demás, cada animación que hacen se tiene que ejecutar de forma asíncrona ya que quiero que el personaje haga algo mientras el resto del código siga funcionando.
	 * Y se ve con tanto código, ya que hay muchas funciones largas.
	 * 
	 * Las coordenadas de los sprites las guardo en un array para cada personaje. (spriteAnimationsKen y spriteAnimationsCammy)
	 * Capturo las pulsaciones de tecla con los eventos: activaMovimiento y desactivaMovimiento
	 * Y la animación que tienen que hacer según las teclas con detectarControlesPersonaje y detectarControlesEnemigo 
	 * 
	 * 				Colisiones:   
	 * Con las funciones tipo: personaje1PunchingHead -> compruebo solo que el puño de 'Personaje1' haya impactado con la cabeza de 'Personaje2'
	 * 		(aclarar que utilizo a 'Personaje1' que es 'miPersonaje' y 'Personaje2' que es 'miEnemigo'.  Es debido a que uno es el objeto y el otro no (pero debí llamarlos igual)) 
	 * Luego está la función comprobarColisiones (de las funcione más largas) que se encarga dependiendo de la colisión que se haya producido de controlarlo.
	 * 
	 * También está la funcion acabarConRival, que controla si uno de los personajes se queda sin vida que hacer.
	 * 
	 * 
	 * 			Funciones de Animaciones:
	 * Las animaciones largas (que son las que se tienen que ejecutar durante un tiempo específico) están formadas por:
	 *  - una función que prepara algunas variables y luego lanza la función concreta, llamados 'iniciarAnimacion + nombre' por ejemplo: 'iniciarAnimacionMovingPunch'.
	 *  - y la función que realiza toda la animación y más cosas: pj ejemplo: 'animarMovingPunch'.
	 * 
	 * Lo más básico de como hago las animaciones es con requestAnimationFrame (debido a que setInterval me daba problemas de sincronicidad)
	 * tengo una variable para cada animacion que es 'duracion' y lo compruebo con el tiempoTranscurrido y si no ha acabado vuelvo a llamar a la función.
	 * 						if (tiempoTranscurrido < this.duracionAnimacionMovingPunch) {
	 * 							requestAnimationFrame(() => this.animarMovingPunch(numAnimaciones));
	 * 						}
	 * 
	 * Tengo otras propiedades para cada animacion 'animacionEnProgresoMovingPunch' que son importantes a la hora de saber si se está o no realizando la animación
	 * 
	 * 			Pintar Canvas
	 * la única función que pinta el canvas es: 'dibujarNormal'
	 * 
	 * 
	 * 			Otras cosas:
	 * 
	 * Hay otra función llamada controlarEventosPrincipales, que llama a las funciones de recuperar vida y energia; y las de mostrar la barra de vida y energia
	 * 
	 * Al final hay más funciones relacionadas con el inicio y fin departida y el almacenamiento del record en localStorage.
	 * 
	 * 			Errores
	 * Uno de ellos es que debería haber creado la clase Personaje y haber creado dos más heredadas para cada uno de los peledores.
	 * 
	 * Debería haber creado más archivos javascript y haber importado funciones desde ahí.
	 * 
	 * 			Notas
	 *  Hay muchas funciones y varibles relacionadas con saltar, por existir existe, pero lo he dejado de lado ya que la complejidad del juego sería mucha y no tengo tiempo
	 * 
	 */



	// CONSTANTES
	//sirve para que las animaciones se vean a una velocidad adecuada dependiendo de los Hz del monitor
	const TASA_REFRESCO_60Hz = {
		velocidadAnimacion: 8.3,
		velocidadAnimacionSalto: 12,
		velocidadX: 2,
		vy: 9,
		weight: 0.3
	}
	const TASA_REFRESCO_144Hz = {
		velocidadAnimacion: 20,
		velocidadAnimacionSalto: 23,
		velocidadX: 1,
		vy: 5,
		weight: 0.09
	}
	const TASA_REFRESCO_ADECUADA = TASA_REFRESCO_60Hz;

	// limites
	const LIMITE_DERECHA = document.getElementById('miCanvas').width;
	const LIMITE_IZQUIERDA = 0;
	const LIMITE_ARRIBA = 0;
	const CANVAS_HEIGHT = document.getElementById('miCanvas').height;
	const LIMITE_ABAJO = CANVAS_HEIGHT - 75;        //valor fijo por temas de que es el suelo

	// localizamos distintos elementos del html
	const canvas = document.getElementById("miCanvas");
	const ctx = canvas.getContext('2d');

	const pantallaBienvenida = document.getElementById('pantallaBienvenida');
	const listaRecord = document.getElementById('listaRecord');
	const notificacionGanador = document.getElementById('notificacionGanador');
	const botonRevancha = document.getElementById('botonRevancha');

	const nombreJugador1 = document.getElementById('player1');
	const nombreJugador2 = document.getElementById('player2');

	// localizamos la caja que va a mostrar la vida de los personajes
	const vida1 = document.getElementById('vida1');
	const vida2 = document.getElementById('vida2');
	const energia1 = document.getElementById('energia1');
	const energia2 = document.getElementById('energia2');
	
	//creamos las imagenes de los luchadores
	const personajeImage = new Image();
	personajeImage.src = './img/KenStreetFighter.png';
	const enemigoImage = new Image();
	enemigoImage.src = './img/CammyStreetFighterIZQ.png';

	// inicializamos variables
	let record = [];

	/* SONIDO */
	let audioStrongHit;
	let audioJab;
	let audioBloqueo;
	let audioFierceHit;
	let audioSpinningBack;
	let audioAterrizaje;
	let audioShortHit;

	function inicialiazarSonidos(){ 
		audioStrongHit = document.getElementById('audioStrongHit');
		audioJab = document.getElementById('audioJab');
		audioBloqueo = document.getElementById('audioBloqueo');
		audioFierceHit = document.getElementById('audioFierceHit');
		audioBarrido = document.getElementById('audioBarrido');
		audioAterrizaje = document.getElementById('audioAterrizaje');
		audioShortHit = document.getElementById('audioShortHit');
	}

	const VIDA_TOTAL = 100;
	const ENERGIA_TOTAL = 100;

	//daño y energia que pueden quitar los personajes
	const danioGolpe = {
		'movingPunch': 5,
		'kick': 12,
		'lowKick': 6,
		'agachadoPunch': 4,
		'agachadoUpper': 8,
		'lowKickHead': 8,
		'agachadoBarrido': 2
	}
	const danioGolpeBloqueado = {
		'movingPunch': 2,
		'kick': 4,
		'lowKick': 3,
		'agachadoPunch': 1,
		'agachadoUpper': 5,
		'lowKickHead': 2,
		'agachadoBarrido': 0
	}
	const energiaGolpe = {
		'movingPunch': 15,
		'agachadoPunch': 10,
		'agachadoUpper': 20,
		'kick': 30,
		'lowKick': 20,
		'agachadoBarrido': 15
	}

	let gameFrame = 0; //como estoy utilizando requestAnimationFrame lo necesito

	const spriteAnimationsKen = [];
	spriteAnimationsKen['reposo'] = {
		loc: [
			{ x: 5, y: 16, width: 45, height: 83 },
			{ x: 54, y: 16, width: 45, height: 83 },
			{ x: 104, y: 16, width: 45, height: 83 },
			{ x: 153, y: 16, width: 45, height: 83 }
		]
	}
	spriteAnimationsKen['caminando'] = {
		loc: [
			{ x: 204, y: 16, width: 45, height: 83 },
			{ x: 251, y: 16, width: 45, height: 83 },
			{ x: 300, y: 16, width: 45, height: 83 },
			{ x: 350, y: 16, width: 45, height: 83 },
			{ x: 400, y: 16, width: 45, height: 83 }
		]
	}
	spriteAnimationsKen['agacharse'] = {
		loc: [
			{ x: 1159, y: 42, width: 45, height: 57 }
		]
	}
	spriteAnimationsKen['saltar'] = {
		loc: [
			{ x: 502, y: 8, width: 34, height: 91 },
			{ x: 544, y: 16, width: 30, height: 79 },
			{ x: 581, y: 18, width: 32, height: 68 },
			{ x: 618, y: 16, width: 30, height: 79 },
			{ x: 655, y: 8, width: 34, height: 91 }
		]
	}
	spriteAnimationsKen['movingPunch'] = {
		loc: [
			{ x: 169, y: 129, width: 45, height: 86 },
			{ x: 217, y: 129, width: 52, height: 86 },
			{ x: 273, y: 129, width: 73, height: 86 },
			{ x: 352, y: 129, width: 52, height: 86 },
			{ x: 410, y: 129, width: 45, height: 86 },
		]
	}
	spriteAnimationsKen['agachadoPunch'] = {
		loc: [
			{ x: 9, y: 420, width: 47, height: 54 },
			{ x: 61, y: 420, width: 62, height: 54 },
			{ x: 127, y: 420, width: 47, height: 54 }
		]
	}
	spriteAnimationsKen['agachadoUpper'] = {
		loc: [
			{ x: 401, y: 362, width: 43, height: 112 },
			{ x: 450, y: 362, width: 49, height: 112 },
			{ x: 505, y: 362, width: 44, height: 112 },
			{ x: 555, y: 362, width: 49, height: 112 },
			{ x: 610, y: 362, width: 43, height: 112 },
		]
	}
	spriteAnimationsKen['agachadoBarrido'] = {
		loc: [
			{ x: 846, y: 418, width: 49, height: 56 },
			{ x: 900, y: 418, width: 89, height: 56 },
			{ x: 993, y: 418, width: 49, height: 56 }
		]
	}
	spriteAnimationsKen['kick'] = {
		loc: [
			{ x: 5, y: 260, width: 50, height: 86 },
			{ x: 61, y: 260, width: 68, height: 86 },
			{ x: 134, y: 260, width: 50, height: 86 },
		]
	}
	spriteAnimationsKen['lowKick'] = {
		loc: [
			{ x: 498, y: 262, width: 47, height: 84 },
			{ x: 551, y: 262, width: 71, height: 84 },
			{ x: 628, y: 262, width: 47, height: 84 },
		]
	}
	spriteAnimationsKen['bloquearArriba'] = {
		loc: [
			{ x: 1211, y: 16, width: 43, height: 83 }
		]
	}
	spriteAnimationsKen['bloquearAbajo'] = {
		loc: [
			{ x: 1259, y: 37, width: 45, height: 62 }
		]
	}
	spriteAnimationsKen['faceHit'] = {
		loc: [
			{ x: 217, y: 777, width: 48, height: 83 },
			{ x: 270, y: 777, width: 53, height: 83 },
			{ x: 326, y: 777, width: 60, height: 83 },
			{ x: 391, y: 777, width: 43, height: 83 }
		]
	}
	spriteAnimationsKen['hit'] = {
		loc: [
			{ x: 5, y: 779, width: 43, height: 81 },
			{ x: 53, y: 779, width: 47, height: 81 },
			{ x: 106, y: 779, width: 49, height: 81 },
			{ x: 163, y: 779, width: 43, height: 81 }
		]
	}
	spriteAnimationsKen['agachadoHit'] = {
		loc: [
			{ x: 449, y: 798, width: 47, height: 62 }
		]
	}
	spriteAnimationsKen['stunned'] = {
		loc: [
			{ x: 1003, y: 779, width: 51, height: 81 },
			{ x: 1060, y: 779, width: 43, height: 81 },
			{ x: 1110, y: 779, width: 43, height: 81 }
		]
	}
	spriteAnimationsKen['KO'] = {
		loc: [
			{ x: 1165, y: 802, width: 45, height: 58 },
			{ x: 1218, y: 802, width: 72, height: 58 },
			{ x: 1294, y: 802, width: 75, height: 58 },
			{ x: 1373, y: 802, width: 72, height: 58 },
			{ x: 1449, y: 802, width: 75, height: 58 }
		]
	}
	spriteAnimationsKen['caida'] = {
		loc: [
			{ x: 511, y: 758, width: 47, height: 102 },
			{ x: 568, y: 758, width: 43, height: 102 },
			{ x: 618, y: 758, width: 72, height: 102 },
			{ x: 695, y: 758, width: 75, height: 102 },
			{ x: 774, y: 758, width: 52, height: 102 },
			{ x: 831, y: 758, width: 52, height: 102 },
			{ x: 889, y: 758, width: 55, height: 102 },
			{ x: 949, y: 758, width: 41, height: 102 }
		]
	}							

	const spriteAnimationsCammy = [];

	spriteAnimationsCammy['reposo'] = {
		loc: [
			{ x: 214, y: 29, width: 48, height: 84 },
			{ x: 160, y: 29, width: 48, height: 84 },
			{ x: 108, y: 29, width: 48, height: 84 },
			{ x: 55, y: 29, width: 48, height: 84 },
			{ x: 2, y: 29, width: 48, height: 84 }
		]
	}
	spriteAnimationsCammy['caminando'] = {
		loc: [
			{ x: 519, y: 26, width: 45, height: 87 },
			{ x: 471, y: 26, width: 42, height: 87 },
			{ x: 421, y: 26, width: 42, height: 87 },
			{ x: 369, y: 26, width: 46, height: 87 },
			{ x: 318, y: 26, width: 43, height: 87 },
			{ x: 269, y: 26, width: 42, height: 87 } 
		]
	}
	spriteAnimationsCammy['agacharse'] = {
		loc: [
			{ x: 1269, y: 62, width: 46, height: 51 }
		]
	}
	spriteAnimationsCammy['saltar'] = {
		loc: [
			{ x: 669, y: 11, width: 36, height: 102 },
			{ x: 711, y: 24, width: 30, height: 71 },
			{ x: 743, y: 32, width: 34, height: 49 },
			{ x: 785, y: 17, width: 32, height: 79 },
			{ x: 825, y: 8, width: 36, height: 71 }
		]
	}
	spriteAnimationsCammy['movingPunch'] = {
		loc: [
			{ x: 187, y: 131, width: 49, height: 87 },
			{ x: 241, y: 131, width: 76, height: 87 },
			{ x: 321, y: 131, width: 49, height: 87 }
		]
	}
	spriteAnimationsCammy['agachadoPunch'] = {
		loc: [
			{ x: 3, y: 487, width: 49, height: 49 },
			{ x: 56, y: 487, width: 64, height: 49 },
			{ x: 125, y: 487, width: 49, height: 49 }
		]
	}
	spriteAnimationsCammy['agachadoUpper'] = {
		loc: [
			{ x: 358, y: 460, width: 66, height: 76 },
			{ x: 429, y: 460, width: 67, height: 76 },
			{ x: 500, y: 460, width: 72, height: 76 },
			{ x: 576, y: 460, width: 66, height: 76 }
		]
	}
	spriteAnimationsCammy['agachadoBarrido'] = {
		loc: [
			{ x: 650, y: 491, width: 47, height: 45 },
			{ x: 701, y: 491, width: 66, height: 45 },
			{ x: 771, y: 491, width: 47, height: 45 }
		]
	}
	spriteAnimationsCammy['kick'] = {
		loc: [
			{ x: 7, y: 255, width: 51, height: 82 },
			{ x: 63, y: 255, width: 60, height: 82 },
			{ x: 129, y: 255, width: 51, height: 82 },
		]
	}
	spriteAnimationsCammy['lowKick'] = {
		loc: [
			{ x: 540, y: 263, width: 47, height: 74 },
			{ x: 592, y: 263, width: 43, height: 74 },
			{ x: 641, y: 263, width: 66, height: 74 },
			{ x: 714, y: 263, width: 77, height: 74 },
			{ x: 795, y: 263, width: 45, height: 74 },
		]
	}
	spriteAnimationsCammy['bloquearArriba'] = {
		loc: [
			{ x: 1199, y: 136, width: 48, height: 82 }
		]
	}
	spriteAnimationsCammy['bloquearAbajo'] = {
		loc: [
			{ x: 1250, y: 168, width: 45, height: 52 }
		]
	}
	spriteAnimationsCammy['faceHit'] = {
		loc: [
			{ x: 408, y: 896, width: 47, height: 81 },
			{ x: 464, y: 896, width: 48, height: 81 },
			{ x: 517, y: 896, width: 55, height: 81 },
			{ x: 577, y: 896, width: 48, height: 81 }
		]
	}
	spriteAnimationsCammy['hit'] = {
		loc: [
			{ x: 641, y: 887, width: 47, height: 90 },
			{ x: 695, y: 887, width: 52, height: 90 },
			{ x: 755, y: 887, width: 50, height: 90 },
			{ x: 811, y: 887, width: 47, height: 90 }
		]
	}
	spriteAnimationsCammy['agachadoHit'] = {
		loc: [
			{ x: 867, y: 921, width: 44, height: 57 }
		]
	}
	spriteAnimationsCammy['stunned'] = {
		loc: [
			{ x: 923, y: 898, width: 47, height: 79 },
			{ x: 975, y: 898, width: 47, height: 79 },
			{ x: 1027, y: 898, width: 47, height: 79 },
			{ x: 1079, y: 898, width: 47, height: 79 }
		]
	}
	spriteAnimationsCammy['KO'] = {
		loc: [
			{ x: 650, y: 1033, width: 64, height: 64 },
			{ x: 725, y: 1033, width: 75, height: 64 },
			{ x: 806, y: 1033, width: 75, height: 64 },
			{ x: 887, y: 1033, width: 75, height: 64 },
			{ x: 966, y: 1033, width: 75, height: 64 }
		]
	}
	spriteAnimationsCammy['caida'] = {
		loc: [
			{ x: 4, y: 995, width: 51, height: 107 },
			{ x: 59, y: 995, width: 63, height: 107 },
			{ x: 129, y: 995, width: 64, height: 107 },
			{ x: 198, y: 995, width: 65, height: 107 },
			{ x: 269, y: 995, width: 73, height: 107 },
			{ x: 345, y: 995, width: 54, height: 107 },
			{ x: 403, y: 995, width: 43, height: 107 },
			{ x: 450, y: 995, width: 41, height: 107 },
			{ x: 495, y: 995, width: 41, height: 107 },
			{ x: 541, y: 995, width: 41, height: 107 },
			{ x: 584, y: 995, width: 47, height: 107 }
		]
	}

	const animacionesLargas = ['saltar','movingPunch','agachadoPunch','agachadoUpper','agachadoBarrido','kick','lowKick','faceHit','hit','agachadoHit','stunned','KO','caida'];
	//las animaciones largas son aquellas que tienen una propia funcion que las inicia como puñetazo, patada...
	const animacionesNecesitaEquilibrio = ['caminando','movingPunch','agachadoUpper','kick','lowKick'];
	//las animaciones que necesitan equilibrio, se necesitan para saber cuando se pueden hacer barridos

	/* TECLAS */
	const TECLA_ARRIBA = 38;
	const TECLA_ABAJO = 40;
	const TECLA_IZQUIERDA = 37;
	const TECLA_DERECHA = 39;
	const TECLA_ESPACIO = 32;
	const TECLA_LEFT_SHIFT = 16;
	const TECLA_0 = 45;
	const TECLA_T = 84;
	const TECLA_I = 73;
	const TECLA_A = 65;
	const TECLA_S = 83;
	const TECLA_W = 87;
	const TECLA_D = 68;
	const TECLA_E = 69;
	const TECLA_R = 82;
	const TECLA_O = 79;
	const TECLA_P = 80;
	const TECLA_Q = 81;

	let teclasPresionadas = {   //objeto para controlar las letras
		derecha: false,
		izquierda: false,
		arriba: false,
		abajo: false,
		espacio: false,
		leftShift: false,
		cero: false,
		letraT: false,
		letraI: false,
		letraA: false,
		letraS: false,
		letraW: false,
		letraD: false,
		letraE: false,
		letraR: false,
		letraO: false,
		letraP: false,
		letraQ: false
	}
	function activaMovimiento(evt) {
		// console.log(evt.keyCode);
		switch (evt.keyCode) {
			case TECLA_DERECHA:
				teclasPresionadas.derecha = true;
				break;
			case TECLA_IZQUIERDA:
				teclasPresionadas.izquierda = true;
				break;
			case TECLA_ABAJO:
				teclasPresionadas.abajo = true;
				break;
			case TECLA_ARRIBA:
				teclasPresionadas.abajo = false;
				break;
			case TECLA_ESPACIO:
				teclasPresionadas.espacio = true;
				break;
			case TECLA_T:
				teclasPresionadas.letraT = true;
				break;
			case TECLA_I:
				teclasPresionadas.letraI = true;
				break;
			case TECLA_Q:
				teclasPresionadas.letraQ = true;
				break;
			case TECLA_0:
				teclasPresionadas.cero = true;
				break;
			case TECLA_A:
				teclasPresionadas.letraA = true;
				break;
			case TECLA_S:
				teclasPresionadas.letraS = true;
				break;
			case TECLA_W:
				teclasPresionadas.letraS = false;
				break;
			case TECLA_D:
				teclasPresionadas.letraD = true;
				break;
			case TECLA_E:
				teclasPresionadas.letraE = true;
				break;
			case TECLA_R:
				teclasPresionadas.letraR = true;
				break;
			case TECLA_O:
				teclasPresionadas.letraO = true;
				break;
			case TECLA_P:
				teclasPresionadas.letraP = true;
				break;
		}
	}
	function desactivaMovimiento(evt) {
		switch (evt.keyCode) {
			case TECLA_DERECHA:
				teclasPresionadas.derecha = false;
				break;
			case TECLA_IZQUIERDA:
				teclasPresionadas.izquierda = false;
				break;
			// case TECLA_ABAJO:
			// 	teclasPresionadas.abajo = false;
			// 	break;
			// case TECLA_ARRIBA:
			// 	// teclasPresionadas.arriba = false;
			// 	break;
			case TECLA_ESPACIO:
				teclasPresionadas.espacio = false;
				break;
			case TECLA_T:
				teclasPresionadas.letraT = false;
				break;
			case TECLA_Q:
				teclasPresionadas.letraQ = false;
				break;
			case TECLA_I:
				teclasPresionadas.letraI = false;
			case TECLA_0:
				teclasPresionadas.cero = false;
				break;
			case TECLA_A:
				teclasPresionadas.letraA = false;
				break;
			// case TECLA_S:
			// 	teclasPresionadas.letraS = false;
			// 	break;
			// case TECLA_W:
			// 	teclasPresionadas.letraW = false;
			// 	break;
			case TECLA_D:
				teclasPresionadas.letraD = false;
				break;
			case TECLA_E:
				teclasPresionadas.letraE = false;
				break;
			case TECLA_R:
				teclasPresionadas.letraR = false;
				break;
			case TECLA_O:
				teclasPresionadas.letraO = false;
				break;
			case TECLA_P:
				teclasPresionadas.letraP = false;
				break;
		}
	}
	document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);

	function detectarControlesPersonaje() {
		if (miPersonaje.vivo && (teclasPresionadas.letraW && miPersonaje.onGround() || teclasPresionadas.letraS && miPersonaje.onGround() || teclasPresionadas.letraD || teclasPresionadas.letraA || teclasPresionadas.letraE && !miPersonaje.seEstaEjecutandoAtaque() || teclasPresionadas.letraR && !miPersonaje.seEstaEjecutandoAtaque() || teclasPresionadas.letraT && !miPersonaje.seEstaEjecutandoAtaque() || teclasPresionadas.letraQ && miPersonaje.onGround() )){
			if ((teclasPresionadas.letraS && miPersonaje.onGround() || teclasPresionadas.letraQ && miPersonaje.onGround()) && (!miPersonaje.seEstaEjecutandoRecibirGolpe())) {
				if (teclasPresionadas.letraQ && teclasPresionadas.letraS){
					miPersonaje.generaBloquearAbajo();					
				} else if(teclasPresionadas.letraQ) {
					miPersonaje.generaBloquearArriba();
				} else if(teclasPresionadas.letraS && teclasPresionadas.letraE && !miPersonaje.seEstaEjecutandoAtaque() && (miPersonaje.energia >= energiaGolpe.agachadoPunch)) {
					miPersonaje.iniciarAnimacionAgachadoPunch();
				} else if(teclasPresionadas.letraS && teclasPresionadas.letraR && !miPersonaje.seEstaEjecutandoAtaque() && (miPersonaje.energia >= energiaGolpe.agachadoBarrido)) {
					miPersonaje.iniciarAnimacionAgachadoBarrido();
				} else if(teclasPresionadas.letraS && teclasPresionadas.letraT && !miPersonaje.seEstaEjecutandoAtaque() && (miPersonaje.energia >= energiaGolpe.agachadoPunch)) {
					miPersonaje.iniciarAnimacionAgachadoUpper(4.999);
				} else {
					miPersonaje.generaAgacharse();
				}
			} else {
				if (teclasPresionadas.letraD && !miPersonaje.animacionEnProgresoCaida) {
					miPersonaje.generaCaminarDerecha();
				}
				if (teclasPresionadas.letraA && !miPersonaje.animacionEnProgresoCaida) {
					miPersonaje.generaCaminarIzquierda();
				}
				if ((teclasPresionadas.letraW && miPersonaje.onGround()) && (!miPersonaje.seEstaEjecutandoRecibirGolpe())) {
					miPersonaje.generaSaltar();
				}
				if (!miPersonaje.seEstaEjecutandoAtaque() && (!miPersonaje.seEstaEjecutandoRecibirGolpe())){
					if (teclasPresionadas.letraE && (miPersonaje.energia >= energiaGolpe.movingPunch)) {
						miPersonaje.iniciarAnimacionMovingPunch(4.999);
					}
					if (teclasPresionadas.letraR && (miPersonaje.energia >= energiaGolpe.kick)) {	
						miPersonaje.iniciarAnimacionKick();
					}
					if (teclasPresionadas.letraT && (miPersonaje.energia >= energiaGolpe.lowKick)) {	
						miPersonaje.iniciarAnimacionLowKick(2.999, 600); //600
					}
				}
			}
		} else {
			miPersonaje.generaReposo();
			// miPersonaje.generaCaminarDerecha();
		}
	}
	function detectarControlesEnemigo() {
		if (miEnemigo.vivo && (teclasPresionadas.arriba && miEnemigo.onGround() || teclasPresionadas.abajo && miEnemigo.onGround() || teclasPresionadas.derecha || teclasPresionadas.izquierda || teclasPresionadas.letraO && !miEnemigo.seEstaEjecutandoAtaque() || teclasPresionadas.letraP && !miEnemigo.seEstaEjecutandoAtaque() || teclasPresionadas.letraI && !miEnemigo.seEstaEjecutandoAtaque() || teclasPresionadas.cero && miEnemigo.onGround())){
			if ((teclasPresionadas.abajo && miEnemigo.onGround() || teclasPresionadas.cero && miEnemigo.onGround()) && (!miEnemigo.seEstaEjecutandoRecibirGolpe())) {
				if (teclasPresionadas.cero && teclasPresionadas.abajo){   
					miEnemigo.generaBloquearAbajo();					
				} else if(teclasPresionadas.cero) {
					miEnemigo.generaBloquearArriba();
				} else if (teclasPresionadas.abajo && teclasPresionadas.letraO && !miEnemigo.seEstaEjecutandoAtaque() && (miEnemigo.energia >= energiaGolpe.agachadoPunch)) {
					miEnemigo.iniciarAnimacionAgachadoPunch();
				} else if (teclasPresionadas.abajo && teclasPresionadas.letraP && !miEnemigo.seEstaEjecutandoAtaque() && (miEnemigo.energia >= energiaGolpe.agachadoBarrido)) {
					miEnemigo.iniciarAnimacionAgachadoBarrido();
				} else if (teclasPresionadas.abajo && teclasPresionadas.letraI && !miEnemigo.seEstaEjecutandoAtaque() && (miEnemigo.energia >= energiaGolpe.agachadoPunch)) {
					miEnemigo.iniciarAnimacionAgachadoUpper(3.999);
				} else {
					miEnemigo.generaAgacharse();
				}
			} else {
				if (teclasPresionadas.derecha && !miEnemigo.animacionEnProgresoCaida) {
					miEnemigo.generaCaminarDerecha();
				}
				if (teclasPresionadas.izquierda && !miEnemigo.animacionEnProgresoCaida) {
					miEnemigo.generaCaminarIzquierda();
				}
				if ((teclasPresionadas.arriba && miEnemigo.onGround()) && (!miEnemigo.seEstaEjecutandoRecibirGolpe())) {
					miEnemigo.generaSaltar();
				}
				if (!miEnemigo.seEstaEjecutandoAtaque() && (!miEnemigo.seEstaEjecutandoRecibirGolpe())){
					if (teclasPresionadas.letraO && (miEnemigo.energia >= energiaGolpe.movingPunch)) {
						miEnemigo.iniciarAnimacionMovingPunch(2.999);
					}
					if (teclasPresionadas.letraP && (miEnemigo.energia >= energiaGolpe.kick)) {	
						miEnemigo.iniciarAnimacionKick();
					}
					if (teclasPresionadas.letraI && (miEnemigo.energia >= energiaGolpe.lowKick)) {	
						miEnemigo.iniciarAnimacionLowKick(4.999, 800); //800
					}
				}
			}
		} else {
			miEnemigo.generaReposo();
			// miEnemigo.generaCaminarIzquierda();
		}
	}


	/* COLISIONES */
	function seTropiezan() {
		let colisionEnX = (miPersonaje.hitbox.cuerpo.x < miEnemigo.hitbox.cuerpo.x + miEnemigo.hitbox.cuerpo.width) && (miPersonaje.hitbox.cuerpo.x + miPersonaje.hitbox.cuerpo.width > miEnemigo.hitbox.cuerpo.x);
		let colisionEnY = (miPersonaje.hitbox.cuerpo.y < miEnemigo.hitbox.cuerpo.y + miEnemigo.hitbox.cuerpo.height) && (miPersonaje.hitbox.cuerpo.y + miPersonaje.hitbox.cuerpo.height > miEnemigo.hitbox.cuerpo.y);
		return colisionEnX && colisionEnY;
	}
	function comprobarLimitesBordes(){
		miPersonaje.x = Math.max(miPersonaje.x, LIMITE_IZQUIERDA);
		miEnemigo.x = Math.min(miEnemigo.x, (LIMITE_DERECHA - miEnemigo.width));
	}

	function personaje1PunchingHead() {
		let lanzandoPunio = (miPersonaje.animacionEnProgresoMovingPunch && miPersonaje.position === 2);
		let colisionPunioCabezaX = (miPersonaje.hitbox.punio.x < miEnemigo.hitbox.cabeza.x + miEnemigo.hitbox.cabeza.width) && (miPersonaje.hitbox.punio.x + miPersonaje.hitbox.punio.width > miEnemigo.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miPersonaje.hitbox.punio.y < miEnemigo.hitbox.cabeza.y + miEnemigo.hitbox.cabeza.height) && (miPersonaje.hitbox.punio.y + miPersonaje.hitbox.punio.height > miEnemigo.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY);
		if (resultado) {
			//comprobamos si se está cubriendo o no
			(miEnemigo.personajeState === 'bloquearArriba') ? miEnemigo.cubierto = true : miEnemigo.cubierto = false;
		} else {
			miPersonaje.golpeConectado.punchHead = false;
		}
		return resultado;
	}
	function personaje2PunchingHead(){
		let lanzandoPunio = (miEnemigo.animacionEnProgresoMovingPunch && miEnemigo.position === 1);
		let colisionPunioCabezaX = (miEnemigo.hitbox.punio.x < miPersonaje.hitbox.cabeza.x + miPersonaje.hitbox.cabeza.width) && (miEnemigo.hitbox.punio.x + miEnemigo.hitbox.punio.width > miPersonaje.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miEnemigo.hitbox.punio.y < miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height) && (miEnemigo.hitbox.punio.y + miEnemigo.hitbox.punio.height > miPersonaje.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY)
		if (resultado)  {
			(miPersonaje.personajeState === 'bloquearArriba') ? miPersonaje.cubierto = true : miPersonaje.cubierto = false;
		} else {
			miEnemigo.golpeConectado.punchHead = false;
		}
		return resultado;
	}
	function personaje1PunchingBody(){
		let lanzandoPunio = (miPersonaje.animacionEnProgresoAgachadoPunch && miPersonaje.position === 1);
		let colisionPunioCuerpoX = (miPersonaje.hitbox.punio.x < miEnemigo.hitbox.tronco.x + miEnemigo.hitbox.tronco.width) && (miPersonaje.hitbox.punio.x + miPersonaje.hitbox.punio.width > miEnemigo.hitbox.tronco.x);;
		let colisionPunioCuerpoY = (miPersonaje.hitbox.punio.y < miEnemigo.hitbox.tronco.y + miEnemigo.hitbox.tronco.height) && (miPersonaje.hitbox.punio.y + miPersonaje.hitbox.punio.height > miEnemigo.hitbox.tronco.y);
		let resultado = (lanzandoPunio && colisionPunioCuerpoX && colisionPunioCuerpoY);
		if (!resultado) miPersonaje.golpeConectado.punchBody = false;
		return resultado;
	}
	function personaje2PunchingBody(){
		let lanzandoPunio = (miEnemigo.animacionEnProgresoAgachadoPunch && miEnemigo.position === 1);
		let colisionPunioCuerpoX = (miEnemigo.hitbox.punio.x < miPersonaje.hitbox.tronco.x + miPersonaje.hitbox.tronco.width) && (miEnemigo.hitbox.punio.x + miEnemigo.hitbox.punio.width > miPersonaje.hitbox.tronco.x);;
		let colisionPunioCuerpoY = (miEnemigo.hitbox.punio.y < miPersonaje.hitbox.tronco.y + miPersonaje.hitbox.tronco.height) && (miEnemigo.hitbox.punio.y + miEnemigo.hitbox.punio.height > miPersonaje.hitbox.tronco.y);
		let resultado = (lanzandoPunio && colisionPunioCuerpoX && colisionPunioCuerpoY)
		if (resultado) {
			(miPersonaje.personajeState === 'bloquearAbajo') ? miPersonaje.cubierto = true : miPersonaje.cubierto = false;
		} else {
			miEnemigo.golpeConectado.punchBody = false;
		}
		return resultado;
	}
	function personaje1UpperPunch() {
		let lanzandoPunio = (miPersonaje.animacionEnProgresoAgachadoUpper && miPersonaje.position === 1);
		let colisionPunioCabezaX = (miPersonaje.hitbox.punio.x < miEnemigo.hitbox.cabeza.x + miEnemigo.hitbox.cabeza.width) && (miPersonaje.hitbox.punio.x + miPersonaje.hitbox.punio.width > miEnemigo.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miPersonaje.hitbox.punio.y < miEnemigo.hitbox.cabeza.y + miEnemigo.hitbox.cabeza.height) && (miPersonaje.hitbox.punio.y + miPersonaje.hitbox.punio.height > miEnemigo.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY);
		if (!resultado) miPersonaje.golpeConectado.upperPunch = false;
		return resultado;
	}
	function personaje2UpperPunch(){
		let lanzandoPunio = (miEnemigo.animacionEnProgresoAgachadoUpper && miEnemigo.position === 2);
		let colisionPunioCabezaX = (miEnemigo.hitbox.punio.x < miPersonaje.hitbox.cabeza.x + miPersonaje.hitbox.cabeza.width) && (miEnemigo.hitbox.punio.x + miEnemigo.hitbox.punio.width > miPersonaje.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miEnemigo.hitbox.punio.y < miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height) && (miEnemigo.hitbox.punio.y + miEnemigo.hitbox.punio.height > miPersonaje.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY)
		if (!resultado) miEnemigo.golpeConectado.upperPunch = false;
		return resultado;
	}

	function personaje1KickingHead(){
		let lanzadoPatada = (miPersonaje.animacionEnProgresoKick && miPersonaje.position === 1);
		let colisionPatadaCabezaX = (miPersonaje.hitbox.patada.x < miEnemigo.hitbox.cabeza.x + miEnemigo.hitbox.cabeza.width) && (miPersonaje.hitbox.patada.x + miPersonaje.hitbox.patada.width > miEnemigo.hitbox.cabeza.x);;
		let colisionPatadaCabezaY = (miPersonaje.hitbox.patada.y < miEnemigo.hitbox.cabeza.y + miEnemigo.hitbox.cabeza.height) && (miPersonaje.hitbox.patada.y + miPersonaje.hitbox.patada.height > miEnemigo.hitbox.cabeza.y);
		let resultado = (lanzadoPatada && colisionPatadaCabezaX && colisionPatadaCabezaY);
		if (resultado) {
			(miEnemigo.personajeState === 'bloquearArriba') ? miEnemigo.cubierto = true : miEnemigo.cubierto = false;
		} else {
			miPersonaje.golpeConectado.kickHead = false;
		}
		return resultado;
	}
	function personaje2KickingHead(){
		let lanzadoPatada = (miEnemigo.animacionEnProgresoKick && miEnemigo.position === 1);
		let colisionPatadaCabezaX = (miEnemigo.hitbox.patada.x < miPersonaje.hitbox.cabeza.x + miPersonaje.hitbox.cabeza.width) && (miEnemigo.hitbox.patada.x + miEnemigo.hitbox.patada.width > miPersonaje.hitbox.cabeza.x);;
		let colisionPatadaCabezaY = (miEnemigo.hitbox.patada.y < miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height) && (miEnemigo.hitbox.patada.y + miEnemigo.hitbox.patada.height > miPersonaje.hitbox.cabeza.y);
		let resultado = (lanzadoPatada && colisionPatadaCabezaX && colisionPatadaCabezaY);
		if (resultado) {
			(miPersonaje.personajeState === 'bloquearArriba') ? miPersonaje.cubierto = true : miPersonaje.cubierto = false;
		} else {
			miEnemigo.golpeConectado.kickHead = false;
		}
		return resultado;
	}
	function personaje1KickingBody(){
		let lanzadoPatada = (miPersonaje.animacionEnProgresoLowKick && miPersonaje.position === 1);
		let colisionPatadaCuerpoX = (miPersonaje.hitbox.patada.x < miEnemigo.hitbox.tronco.x + miEnemigo.hitbox.tronco.width) && (miPersonaje.hitbox.patada.x + miPersonaje.hitbox.patada.width > miEnemigo.hitbox.tronco.x);;
		let colisionPatadaCuerpoY = (miPersonaje.hitbox.patada.y < miEnemigo.hitbox.tronco.y + miEnemigo.hitbox.tronco.height) && (miPersonaje.hitbox.patada.y + miPersonaje.hitbox.patada.height > miEnemigo.hitbox.tronco.y);
		let resultado = (lanzadoPatada && colisionPatadaCuerpoX && colisionPatadaCuerpoY);
		if (resultado) {
			(miEnemigo.personajeState === 'bloquearArriba') ? miEnemigo.cubierto = true : miEnemigo.cubierto = false;
		} else {
			miPersonaje.golpeConectado.kickBody = false;
		}
		return resultado;
	}
	function personaje2KickingBody(){
		let lanzadoPatada = (miEnemigo.animacionEnProgresoLowKick && miEnemigo.position === 3);
		let colisionPatadaCuerpoX = (miEnemigo.hitbox.patada.x < miPersonaje.hitbox.tronco.x + miPersonaje.hitbox.tronco.width) && (miEnemigo.hitbox.patada.x + miEnemigo.hitbox.patada.width > miPersonaje.hitbox.tronco.x);;
		let colisionPatadaCuerpoY = (miEnemigo.hitbox.patada.y < miPersonaje.hitbox.tronco.y + miPersonaje.hitbox.tronco.height) && (miEnemigo.hitbox.patada.y + miEnemigo.hitbox.patada.height > miPersonaje.hitbox.tronco.y);
		let resultado = (lanzadoPatada && colisionPatadaCuerpoX && colisionPatadaCuerpoY)
		if (resultado) {
			(miPersonaje.personajeState === 'bloquearArriba') ? miPersonaje.cubierto = true : miPersonaje.cubierto = false;
		} else {
			miEnemigo.golpeConectado.kickBody = false;
		}
		return resultado;
	}
	function personaje1BarridoPies(){
		let lanzadoPatada = (miPersonaje.animacionEnProgresoAgachadoBarrido && miPersonaje.position === 1);
		let colisionPatadaPiesX = (miPersonaje.hitbox.patada.x < miEnemigo.hitbox.pies.x + miEnemigo.hitbox.pies.width) && (miPersonaje.hitbox.patada.x + miPersonaje.hitbox.patada.width > miEnemigo.hitbox.pies.x);
		let colisionPatadaPiesY = (miPersonaje.hitbox.patada.y < miEnemigo.hitbox.pies.y + miEnemigo.hitbox.pies.height) && (miPersonaje.hitbox.patada.y + miPersonaje.hitbox.patada.height > miEnemigo.hitbox.pies.y);
		let resultado = (lanzadoPatada && colisionPatadaPiesX && colisionPatadaPiesY);
		if (!resultado) miPersonaje.golpeConectado.barridoBody = false;
		return resultado;
	}
	function personaje2BarridoPies(){
		let lanzadoPatada = (miEnemigo.animacionEnProgresoAgachadoBarrido && miEnemigo.position === 1);
		let colisionPatadaPiesX = (miEnemigo.hitbox.patada.x < miPersonaje.hitbox.pies.x + miPersonaje.hitbox.pies.width) && (miEnemigo.hitbox.patada.x + miEnemigo.hitbox.patada.width > miPersonaje.hitbox.pies.x);
		let colisionPatadaPiesY = (miEnemigo.hitbox.patada.y < miPersonaje.hitbox.pies.y + miPersonaje.hitbox.pies.height) && (miEnemigo.hitbox.patada.y + miEnemigo.hitbox.patada.height > miPersonaje.hitbox.pies.y);
		let resultado = (lanzadoPatada && colisionPatadaPiesX && colisionPatadaPiesY);
		if (!resultado) miEnemigo.golpeConectado.barridoBody = false;
		return resultado;
	}

	function personaje2LowKickHead(){
		let lanzadoPatada = (miEnemigo.animacionEnProgresoLowKick && miEnemigo.position === 3);
		let enemigoAgachado = (miPersonaje.personajeState === 'agacharse' || miPersonaje.personajeState === 'bloquearAbajo')
		let colisionPatadaCabezaX = (miEnemigo.hitbox.patada.x < miPersonaje.hitbox.cabeza.x + miPersonaje.hitbox.cabeza.width) && (miEnemigo.hitbox.patada.x + miEnemigo.hitbox.patada.width > miPersonaje.hitbox.cabeza.x);;
		let colisionPatadaCabezaY = (miEnemigo.hitbox.patada.y < miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height) && (miEnemigo.hitbox.patada.y + miEnemigo.hitbox.patada.height > miPersonaje.hitbox.cabeza.y);
		let resultado = (enemigoAgachado && lanzadoPatada && colisionPatadaCabezaX && colisionPatadaCabezaY)
		if (!resultado) miEnemigo.golpeConectado.lowKickHead = false;
		return resultado;
	}
	function personaje1PunchingHeadAgachado() {
		let lanzandoPunio = (miPersonaje.animacionEnProgresoAgachadoPunch && miPersonaje.position === 1);
		let colisionPunioCabezaX = (miPersonaje.hitbox.punio.x < miEnemigo.hitbox.cabeza.x + miEnemigo.hitbox.cabeza.width) && (miPersonaje.hitbox.punio.x + miPersonaje.hitbox.punio.width > miEnemigo.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miPersonaje.hitbox.punio.y < miEnemigo.hitbox.cabeza.y + miEnemigo.hitbox.cabeza.height) && (miPersonaje.hitbox.punio.y + miPersonaje.hitbox.punio.height > miEnemigo.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY);
		if (resultado) {
			(miEnemigo.personajeState === 'bloquearAbajo') ? miEnemigo.cubierto = true : miEnemigo.cubierto = false;
		} else {
			miPersonaje.golpeConectado.punchHeadAgachado = false;
		}
		return resultado;
	}

	/* Para comprobar si el rival esta muerto o no*/
	function acabarConRival(){
		if (miPersonaje.vida < 0 || miEnemigo.vida < 0){
			if (miPersonaje.vida < 0) {
				miPersonaje.iniciarAnimacionKO();
				miPersonaje.vivo = false;
			}
			if (miEnemigo.vida < 0) {
				miEnemigo.iniciarAnimacionKO();
				miEnemigo.vivo = false;
			}

			setTimeout(acabarPartida, 5000);
			return true;
		}
		return false;
	}
	function realizarAnimacionRecibirGolpe(id, animacion, valorExtra){
		//esta función comprueba si alguno de los personajes se ha quedado sin vida para acabar la partida
		if (!acabarConRival()){
			switch(animacion){
				case 'retroceso': (id === 1) ? miPersonaje.iniciarAnimacionRetroceso(valorExtra): miEnemigo.iniciarAnimacionRetroceso(valorExtra);
					break;
				case 'faceHit': (id === 1) ? miPersonaje.iniciarAnimacionFaceHit() : miEnemigo.iniciarAnimacionFaceHit() ;
					break;
				case 'agachadoHit': (id === 1) ? miPersonaje.iniciarAnimacionAgachadoHit() : miEnemigo.iniciarAnimacionAgachadoHit() ;
					break;
				case 'stunned': (id === 1) ? miPersonaje.iniciarAnimacionStunned(2.999) : miEnemigo.iniciarAnimacionStunned(3.999) ;
					break;
				case 'hit': (id === 1) ? miPersonaje.iniciarAnimacionHit() : miEnemigo.iniciarAnimacionHit() ;
					break;
				case 'caida': (id === 1) ? miPersonaje.iniciarAnimacionCaida(7.999) : miEnemigo.iniciarAnimacionCaida(10.999) ;
					break;
				default:
					break;
			}
		}
	}

	function comprobarColisiones() {

		if(seTropiezan()){
			console.log('SE TROPEZARON');
			miEnemigo.x = (miPersonaje.hitbox.cuerpo.x + miPersonaje.hitbox.cuerpo.width) - (miEnemigo.hitbox.cuerpo.x - miEnemigo.x);
			miPersonaje.x = miEnemigo.hitbox.cuerpo.x - (miPersonaje.hitbox.cuerpo.x + miPersonaje.hitbox.cuerpo.width - miPersonaje.x);
		}
		comprobarLimitesBordes();

		if(personaje1PunchingHead() && !miPersonaje.golpeConectado.punchHead){ //solo se produce el evento 1 vez, cada vez que el puño colisiona con la cabeza
			miPersonaje.golpeConectado.punchHead = true;  //se pone a true y se espera a que cuando deje de haber la colisión se ponga a false
			
			if (miEnemigo.cubierto) {
				miEnemigo.vida -= danioGolpeBloqueado.movingPunch;
				miEnemigo.cubierto = false;
				audioBloqueo.currentTime = 0;
				audioBloqueo.play();
				
				realizarAnimacionRecibirGolpe(2,'retroceso',2);
			} else {
				miEnemigo.vida -= danioGolpe.movingPunch;
				miPersonaje.puntos +=10;

				audioJab.currentTime = 0;
				audioJab.play();
				
				realizarAnimacionRecibirGolpe(2, 'faceHit');
			}
		}
		if(personaje2PunchingHead() && !miEnemigo.golpeConectado.punchHead){
			miEnemigo.golpeConectado.punchHead = true;

			if (miPersonaje.cubierto) {
				miPersonaje.vida -= danioGolpeBloqueado.movingPunch;
				miPersonaje.cubierto = false;
				
				audioBloqueo.currentTime = 0;
				audioBloqueo.play();

				realizarAnimacionRecibirGolpe(1,'retroceso',2);
			} else {
				miPersonaje.vida -= danioGolpe.movingPunch;
				miEnemigo.puntos +=10;	

				audioJab.currentTime = 0;
				audioJab.play();

				realizarAnimacionRecibirGolpe(1,'faceHit');
			}
			
		}
		if(personaje1PunchingBody() && !miPersonaje.golpeConectado.punchBody){ 
			miPersonaje.golpeConectado.punchBody = true;
			miEnemigo.vida -= danioGolpe.agachadoPunch;
			miPersonaje.puntos +=30;

			audioShortHit.currentTime = 0;
			audioShortHit.play();
			
			realizarAnimacionRecibirGolpe(2,'retroceso',4);

		}
		if(personaje2PunchingBody() && !miEnemigo.golpeConectado.punchBody){
			miEnemigo.golpeConectado.punchBody = true;
			
			//dependiendo de si personaje1 está agachado o de pie:
			if (miPersonaje.personajeState === 'agacharse' || miPersonaje.personajeState === 'bloquearAbajo'){
				if (miPersonaje.cubierto) {
					miPersonaje.vida -= danioGolpeBloqueado.agachadoPunch;
					miPersonaje.cubierto = false;

					audioBloqueo.currentTime = 0;
					audioBloqueo.play();
					
					realizarAnimacionRecibirGolpe(1,'retroceso',4);
				} else {
					miPersonaje.vida -= danioGolpe.agachadoPunch;
					miEnemigo.puntos +=30;
					audioJab.currentTime = 0;
					audioJab.play();
					
					realizarAnimacionRecibirGolpe(1,'agachadoHit');
				}
			} else {
				miPersonaje.vida -= danioGolpe.agachadoPunch;
				miEnemigo.puntos +=30;
				audioShortHit.currentTime = 0;
				audioShortHit.play();
				
				realizarAnimacionRecibirGolpe(1,'retroceso',4);
			}

		}
		if(personaje1UpperPunch() && !miPersonaje.golpeConectado.upperPunch){
			miPersonaje.golpeConectado.upperPunch = true;
			miEnemigo.vida -= danioGolpe.agachadoUpper;
			miPersonaje.puntos +=15;
			
			audioStrongHit.currentTime = 0;
			audioStrongHit.play();
			
			realizarAnimacionRecibirGolpe(2,'stunned');
		}
		if(personaje2UpperPunch() && !miEnemigo.golpeConectado.upperPunch){
			miEnemigo.golpeConectado.upperPunch = true;
			miPersonaje.vida -= danioGolpe.agachadoUpper;
			miEnemigo.puntos +=15;
			
			audioStrongHit.currentTime = 0;
			audioStrongHit.play();
			
			realizarAnimacionRecibirGolpe(1,'stunned');
		}


		if(personaje1KickingHead() && !miPersonaje.golpeConectado.kickHead){
			miPersonaje.golpeConectado.kickHead = true;

			if (miEnemigo.cubierto) {
				miEnemigo.vida -= danioGolpeBloqueado.kick;
				miEnemigo.cubierto = false;
				audioBloqueo.currentTime = 0;
				audioBloqueo.play();
				
				realizarAnimacionRecibirGolpe(2,'retroceso',7);
			} else {
				miEnemigo.vida -= danioGolpe.kick;
				miPersonaje.puntos +=20;
				audioStrongHit.currentTime = 0;
				audioStrongHit.play();
				
				realizarAnimacionRecibirGolpe(2,'stunned');
			}
			
		}
		if(personaje2KickingHead() && !miEnemigo.golpeConectado.kickHead){
			miEnemigo.golpeConectado.kickHead = true;

			if (miPersonaje.cubierto) {
				miPersonaje.vida -= danioGolpeBloqueado.kick;
				miPersonaje.cubierto = false;
				audioBloqueo.currentTime = 0;
				audioBloqueo.play();
				
				realizarAnimacionRecibirGolpe(1,'retroceso',7);
			} else {
				miPersonaje.vida -= danioGolpe.kick;
				miEnemigo.puntos +=20;
				audioStrongHit.currentTime = 0;
				audioStrongHit.play();
				
				realizarAnimacionRecibirGolpe(1,'stunned');
			}
			
		}
		if(personaje1KickingBody() && !miPersonaje.golpeConectado.kickBody){
			miPersonaje.golpeConectado.kickBody = true;

			if (miEnemigo.cubierto) {
				miEnemigo.vida -= danioGolpeBloqueado.lowKick;
				miEnemigo.cubierto = false;
				audioBloqueo.currentTime = 0;
				audioBloqueo.play();
				
				realizarAnimacionRecibirGolpe(2,'retroceso',6);
			} else {
				miEnemigo.vida -= danioGolpe.lowKick;
				miPersonaje.puntos +=7;
				audioFierceHit.currentTime = 0;
				audioFierceHit.play();
				
				miEnemigo.iniciarAnimacionHit();
				realizarAnimacionRecibirGolpe(2,'retroceso',2);
			}
			
		}
		if(personaje2KickingBody() && !miEnemigo.golpeConectado.kickBody){
			miEnemigo.golpeConectado.kickBody = true;

			if (miPersonaje.cubierto) {
				miPersonaje.vida -= danioGolpeBloqueado.lowKick;
				miPersonaje.cubierto = false;
				audioBloqueo.currentTime = 0;
				audioBloqueo.play();
				
				realizarAnimacionRecibirGolpe(1,'retroceso',6);
			} else {
				miPersonaje.vida -= danioGolpe.lowKick;
				miEnemigo.puntos +=7;
				audioFierceHit.currentTime = 0;
				audioFierceHit.play();
				
				realizarAnimacionRecibirGolpe(1,'hit');
			}
			
		}
		if(personaje1BarridoPies() && !miPersonaje.golpeConectado.barridoBody){
			miPersonaje.golpeConectado.barridoBody = true;
			miEnemigo.vida -= danioGolpe.agachadoBarrido;
			miPersonaje.puntos +=40;

			audioBarrido.currentTime = 0;
			audioBarrido.play();
			
			realizarAnimacionRecibirGolpe(2,'caida');
		}
		if(personaje2BarridoPies() && !miEnemigo.golpeConectado.barridoBody){
			miEnemigo.golpeConectado.barridoBody = true;
			miPersonaje.vida -= danioGolpe.agachadoBarrido;
			miEnemigo.puntos +=40;

			audioBarrido.currentTime = 0;
			audioBarrido.play();
			
			realizarAnimacionRecibirGolpe(1,'caida');
		}

		if(personaje2LowKickHead() && !miEnemigo.golpeConectado.lowKickHead){
			miEnemigo.golpeConectado.lowKickHead = true;
			miPersonaje.vida -= danioGolpe.lowKickHead;
			miEnemigo.puntos +=20;

			audioFierceHit.currentTime = 0;
			audioFierceHit.play();
			
			realizarAnimacionRecibirGolpe(1,'agachadoHit');
		}

		if(personaje1PunchingHeadAgachado() && !miPersonaje.golpeConectado.punchHeadAgachado){
			miPersonaje.golpeConectado.punchHeadAgachado = true; 
			if (miEnemigo.cubierto) {
				miEnemigo.vida -= danioGolpeBloqueado.movingPunch;
			   miEnemigo.cubierto = false;
			   audioBloqueo.currentTime = 0;
			   audioBloqueo.play();
			   
			   realizarAnimacionRecibirGolpe(2,'retroceso',4);
		   } else {
			   miEnemigo.vida -= danioGolpe.movingPunch;
			   miPersonaje.puntos +=20;
			   audioJab.currentTime = 0;
			   audioJab.play();
			   
			   realizarAnimacionRecibirGolpe(2,'agachadoHit');
		   }
		}
	}

	/*********************************************************************************************** */

	function asignarVidaParaMostrarPorPantalla(){
		//evito problemas en la barra de vida
		if(miPersonaje.vida < 0) miPersonaje.vida = 0;
		if(miEnemigo.vida < 0) miEnemigo.vida = 0;
		if (miPersonaje.vida > VIDA_TOTAL) miPersonaje.vida = VIDA_TOTAL;
		if (miEnemigo.vida > VIDA_TOTAL) miEnemigo.vida = VIDA_TOTAL;
		//modifico la barra de vida verde
		vida1.style.width = miPersonaje.vida + '%';
		vida2.style.width = miEnemigo.vida + '%';
	}

	function asignarEnergiaParaMostrarPorPantalla(){
		if (miPersonaje.energia < 0) miPersonaje.energia = 0;
		if (miPersonaje.energia > ENERGIA_TOTAL) miPersonaje.energia = ENERGIA_TOTAL;
		if (miEnemigo.energia < 0) miEnemigo.energia = 0;
		if (miEnemigo.energia > ENERGIA_TOTAL) miEnemigo.energia = ENERGIA_TOTAL;
		energia1.style.width = (miPersonaje.energia/ENERGIA_TOTAL) * 100 + '%';
		energia2.style.width = (miEnemigo.energia/ENERGIA_TOTAL) * 100 + '%';
	}

	function recuperarEnergia(){
		if (miPersonaje.vivo){
			let energiaRecuperacion = 0;
			switch (miPersonaje.personajeState) {
				case 'reposo':
					energiaRecuperacion = 75;
					break;
				case 'caminando':
					energiaRecuperacion = 50;
					break;
				case 'agacharse':
					energiaRecuperacion = 100;
					break;
				case 'bloquearArriba':
					energiaRecuperacion = 30;
					break;
				case 'bloquearAbajo':
					energiaRecuperacion = 50;
					break;
				default:
					energiaRecuperacion = 0;
					break;
			}
			miPersonaje.energia += energiaRecuperacion * 0.001;
		}
		if (miEnemigo.vivo){
			switch (miEnemigo.personajeState) {
				case 'reposo':
					energiaRecuperacion = 75;
					break;
				case 'caminando':
					energiaRecuperacion = 50;
					break;
				case 'agacharse':
					energiaRecuperacion = 100;
					break;
				case 'bloquearArriba':
					energiaRecuperacion = 30;
					break;
				case 'bloquearAbajo':
					energiaRecuperacion = 50;
					break;
				default:
					energiaRecuperacion = 0;
					break;
			}
			miEnemigo.energia += energiaRecuperacion * 0.001;
		}
	}

	function recuperarVida(){
		if(miPersonaje.vivo) miPersonaje.vida += 0.005;
		if(miEnemigo.vivo) miEnemigo.vida += 0.005;
	}

	function controlarEventosPrincipales() {
		asignarVidaParaMostrarPorPantalla();
		asignarEnergiaParaMostrarPorPantalla();
		recuperarEnergia();
		recuperarVida();
	}

	/*********************************************************************************************** */

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

			this.puntos = 0;				//para el record

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

			/* VARIABLES DE ANIMACIONES*/

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
			this.personajeState = 'reposo';
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
			
			this.frameX = this.spriteAnimations[this.personajeState].loc[this.position].x;
			this.frameY = this.spriteAnimations[this.personajeState].loc[this.position].y;
			this.spriteWidth = this.spriteAnimations[this.personajeState].loc[this.position].width;
			this.spriteHeight = this.spriteAnimations[this.personajeState].loc[this.position].height;
			
			this.width = this.spriteWidth;

			ctx.drawImage(this.image, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight,
				this.x, this.y, this.spriteWidth, this.spriteHeight);
		}
	}
	
	function ordenarPorPuntuacion(jugador1, jugador2){
		let j1 = jugador1.puntuacion;
		let j2 = jugador2.puntuacion;

		if (j1>j2) return -1;
		else if (j2>j1) return 1;
		else return 0;
	}
	function mostrarRecordPantalla(value){
		const li = document.createElement("li");
		listaRecord.appendChild(li);
		li.innerHTML = value.nombre + ' - ' + value.puntuacion + ' pts';
	}
	function borrarPeoresPuntuaciones(){
		if(record.length > 10){
			let cantidadBorrar = record.length - 10;
			record.splice(10, cantidadBorrar);
		}
	}
	function dibujarGanadorPantalla(){ 
		let ganador = (miPersonaje.vivo) ? document.getElementById('nombreJugador1').value : document.getElementById('nombreJugador2').value;

		notificacionGanador.innerHTML = 'GANADOR ' + ganador.toUpperCase();
		notificacionGanador.style.display = 'block';
	}

    function recuperarDatoSesion() {
		return JSON.parse(localStorage.getItem('record'));
	}
	function almacenarDatoSesion(valor) {
		localStorage.setItem('record', JSON.stringify(valor));
	}

	function restablecerValores(){
		miPersonaje.vivo = true;
		miPersonaje.vida = VIDA_TOTAL;
		miPersonaje.energia = ENERGIA_TOTAL;
		miPersonaje.personajeState = 'reposo';
		miPersonaje.position = 0;
		miPersonaje.position2 = 0;
		miPersonaje.animacionEnProgresoKO = false;
		miPersonaje.x = 20;
		
		miEnemigo.vivo = true;
		miEnemigo.vida = VIDA_TOTAL;
		miEnemigo.energia = ENERGIA_TOTAL;
		miEnemigo.personajeState = 'reposo';
		miEnemigo.position = 0;
		miEnemigo.position2 = 0;
		miEnemigo.animacionEnProgresoKO = false;
		miEnemigo.x = 630;
	}
	function asignarNombresValues() {
		nombreJugador1.innerHTML = document.getElementById('nombreJugador1').value;
		nombreJugador2.innerHTML = document.getElementById('nombreJugador2').value;
	}
	function hacerRecuentoDePuntos(id){
		let puntuacion = 0;

		if (id === 1){
			puntuacion = miPersonaje.vida + miPersonaje.puntos;
		} else {
			puntuacion = miEnemigo.vida + miEnemigo.puntos;
		}
		return Math.round(puntuacion);
	}
	function sacarMenorPuntuacion(total, value){
		if (total > value.puntuacion) return value.puntuacion;
		else return total;
	}
	function meterNuevasPuntuaciones(){
		let puntuacion1 = hacerRecuentoDePuntos(1);
		let puntuacion2 = hacerRecuentoDePuntos(2);

		record.push({
			nombre: document.getElementById('nombreJugador1').value,
			puntuacion: puntuacion1
		});
		record.push({
			nombre: document.getElementById('nombreJugador2').value,
			puntuacion: puntuacion2
		});
	}

	function asignarRecord(){
		if (recuperarDatoSesion() !== null){
			record = recuperarDatoSesion();
		} else {
			record = [];
		}
		record.sort(ordenarPorPuntuacion);
		borrarPeoresPuntuaciones();
		record.forEach(mostrarRecordPantalla);
	}

	document.getElementById('botonIniciaPartida').addEventListener('click', iniciarPartida);
	document.getElementById('botonRevancha').addEventListener('click', iniciarPartida);

	function iniciarPartida(){
		asignarNombresValues();
		inicialiazarSonidos();
		restablecerValores();

		pantallaBienvenida.style.display = 'none';
		notificacionGanador.style.display = 'none';
		botonRevancha.style.display = 'none';
		pintarJuego(0);
	}

	function acabarPartida(){
		cancelAnimationFrame(animacionId);
		dibujarGanadorPantalla();
		meterNuevasPuntuaciones();
		almacenarDatoSesion(record);
		botonRevancha.style.display = 'block';
	}

	const miPersonaje = new Personaje(personajeImage, spriteAnimationsKen, 20, 1);
	const miEnemigo = new Personaje(enemigoImage, spriteAnimationsCammy, 630, 2);


	function pintarJuego(timeStamp) {
		ctx.clearRect(0, 0, LIMITE_DERECHA, CANVAS_HEIGHT);
		
		miPersonaje.dibujarNormal();
		miEnemigo.dibujarNormal();

		console.log('animacion: '+miEnemigo.personajeState);

		detectarControlesPersonaje();
		detectarControlesEnemigo();

		comprobarColisiones();
		controlarEventosPrincipales();

		miPersonaje.AnimationFrame++; //maneja la tasa de refresco de algunas animaciones que necesitan ser iniciadas desde 0
		miEnemigo.AnimationFrame++;

		gameFrame++;				  //maneja la tasa de refresco de las animaciones normales
		animacionId = requestAnimationFrame(pintarJuego);
	}

	//asignar el record justo al cargar la partida
	asignarRecord();

	//BORRAR DATOS localStorage
	// localStorage.removeItem("record");
}