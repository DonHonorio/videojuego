window.onload = function () {
	// CONSTANTES
	let x;
	let y;
	let width;
	let height;
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
	const LIMITE_ABAJO = CANVAS_HEIGHT;        //valor fijo por temas de que es el suelo

	// localizamos el canvas y el contexto del trabajo
	const canvas = document.getElementById("miCanvas");
	const ctx = canvas.getContext('2d');

	// localizamos la caja que va a mostrar la vida de los personajes
	const vida1 = document.getElementById('vida1');
	const vida2 = document.getElementById('vida2');
	const energia1 = document.getElementById('energia1');
	const energia2 = document.getElementById('energia2');

	//variables de sonidos

	let sonidoStrongHit;

	// inicializamos variables
	const VIDA_TOTAL = 2000;
	const ENERGIA_TOTAL = 100000;

	const personajeImage = new Image();
	personajeImage.src = './img/KenStreetFighter.png';
	const enemigoImage = new Image();
	enemigoImage.src = './img/CammyStreetFighterIZQ.png';

	let spriteWidthKen = 48;       //son valores iniciales del prota
	let spriteHeightKen = 83;
	let spriteWidthCammy = 48;       //son valores iniciales del enemigo
	let spriteHeightCammy = 83;  

	let gameFrame = 0;

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
			// { x: 1112, y: 23, width: 45, height: 76 },
			{ x: 1159, y: 42, width: 45, height: 57 }
		]
	}
	spriteAnimationsKen['saltar'] = {
		loc: [
			// { x: 451, y: 23, width: 45, height: 76 },
			{ x: 502, y: 8, width: 34, height: 91 },
			{ x: 544, y: 16, width: 30, height: 79 },
			{ x: 581, y: 18, width: 32, height: 68 },
			{ x: 618, y: 16, width: 30, height: 79 },
			{ x: 655, y: 8, width: 34, height: 91 }
			// ,{ x: 704, y: 23, width: 27, height: 76 },
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
			{ x: 1210, y: 16, width: 45, height: 84 }
		]
	}
	spriteAnimationsKen['bloquearAbajo'] = {
		loc: [
			{ x: 1259, y: 37, width: 45, height: 62 }
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
			{ x: 519, y: 26, width: 45, height: 87 },  //6
			{ x: 471, y: 26, width: 42, height: 87 }, //5
			{ x: 421, y: 26, width: 42, height: 87 }, //4
			{ x: 369, y: 26, width: 46, height: 87 }, //3
			{ x: 318, y: 26, width: 43, height: 87 }, //2
			{ x: 269, y: 26, width: 42, height: 87 }  //1
		]
	}
	spriteAnimationsCammy['agacharse'] = {
		loc: [
			// { x: 1112, y: 23, width: 45, height: 76 },
			{ x: 1269, y: 62, width: 46, height: 51 }
		]
	}
	spriteAnimationsCammy['saltar'] = {
		loc: [
			// { x: 451, y: 23, width: 45, height: 76 },
			{ x: 669, y: 11, width: 36, height: 102 },
			{ x: 711, y: 24, width: 30, height: 71 },
			{ x: 743, y: 32, width: 34, height: 49 },
			{ x: 785, y: 17, width: 32, height: 79 },
			{ x: 825, y: 8, width: 36, height: 71 }
			// ,{ x: 704, y: 23, width: 27, height: 76 },
		]
	}
	spriteAnimationsCammy['movingPunch'] = {
		loc: [
			// { x: 187, y: 134, width: 49, height: 84 },
			// { x: 241, y: 134, width: 76, height: 84 },
			// { x: 321, y: 134, width: 49, height: 84 }

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

			// { x: 185, y: 487, width: 49, height: 49 },
			// { x: 235, y: 487, width: 67, height: 49 },
			// { x: 306, y: 487, width: 44, height: 49 }
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
			// { x: 188, y: 239, width: 53, height: 98 },
			// { x: 246, y: 239, width: 69, height: 98 },
			// { x: 318, y: 239, width: 84, height: 98 },
			// { x: 407, y: 239, width: 69, height: 98 },
			// { x: 480, y: 239, width: 53, height: 98 },

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

	const TECLA_ARRIBA = 38;
	const TECLA_ABAJO = 40;
	const TECLA_IZQUIERDA = 37;
	const TECLA_DERECHA = 39;
	const TECLA_ESPACIO = 32;
	const TECLA_LEFT_SHIFT = 16;
	const TECLA_0 = 45;  //45 o 96
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
			// case TECLA_ARRIBA:
			// 	// teclasPresionadas.arriba = true;
			// 	break;
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
			// case TECLA_W:
			// 	teclasPresionadas.letraW = true;
			// 	break;
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
			case TECLA_ABAJO:
				teclasPresionadas.abajo = false;
				break;
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
			case TECLA_S:
				teclasPresionadas.letraS = false;
				break;
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
		if (teclasPresionadas.letraW && miPersonaje.onGround() || teclasPresionadas.letraS && miPersonaje.onGround() || teclasPresionadas.letraD || teclasPresionadas.letraA || teclasPresionadas.letraE && !miPersonaje.seEstaEjecutandoAtaque() || teclasPresionadas.letraR && !miPersonaje.seEstaEjecutandoAtaque() || teclasPresionadas.letraT && !miPersonaje.seEstaEjecutandoAtaque() || teclasPresionadas.letraQ && miPersonaje.onGround()){
			if (teclasPresionadas.letraS && miPersonaje.onGround() || teclasPresionadas.letraQ && miPersonaje.onGround()) {
				if (teclasPresionadas.letraQ && teclasPresionadas.letraS){ //
					miPersonaje.generaBloquearAbajo();					
				} else  												   //
				if(teclasPresionadas.letraQ) {
					miPersonaje.generaBloquearArriba();
				} else if(teclasPresionadas.letraS && teclasPresionadas.letraE && !miPersonaje.seEstaEjecutandoAtaque()) {
					miPersonaje.iniciarAnimacionAgachadoPunch();
				} else {
					miPersonaje.generaAgacharse();
				}
			} else {
				if (teclasPresionadas.letraD) {
					miPersonaje.generaCaminarDerecha();
				}
				if (teclasPresionadas.letraA) {
					miPersonaje.generaCaminarIzquierda();
				}
				if (teclasPresionadas.letraW && miPersonaje.onGround()) {
					miPersonaje.generaSaltar();
				}
				if (!miPersonaje.seEstaEjecutandoAtaque()){
					if (teclasPresionadas.letraE && miPersonaje.y <= 507) {
						// console.log('Tecla "espacio" presionada. Iniciando animación puñetazo.');
						miPersonaje.iniciarAnimacionMovingPunch(4.999);
					}
					if (teclasPresionadas.letraR && miPersonaje.y <= 507) {	
						// console.log('Tecla "espacio" presionada. Iniciando animación puñetazo.');
						miPersonaje.iniciarAnimacionKick();
					}
					if (teclasPresionadas.letraT && miPersonaje.y <= 507) {	
						// console.log('Tecla "espacio" presionada. Iniciando animación puñetazo.');
						miPersonaje.iniciarAnimacionLowKick(2.999);
					}
				}
			}
		} else {
			miPersonaje.generaReposo();
			// miPersonaje.generaAgacharse();
		}
	}
	function detectarControlesEnemigo() {
		if (teclasPresionadas.arriba && miEnemigo.onGround() || teclasPresionadas.abajo && miEnemigo.onGround() || teclasPresionadas.derecha || teclasPresionadas.izquierda || teclasPresionadas.letraO && !miEnemigo.seEstaEjecutandoAtaque() || teclasPresionadas.letraP && !miEnemigo.seEstaEjecutandoAtaque() || teclasPresionadas.letraI && !miEnemigo.seEstaEjecutandoAtaque() || teclasPresionadas.cero && miEnemigo.onGround()){
			if (teclasPresionadas.abajo && miEnemigo.onGround() || teclasPresionadas.cero && miEnemigo.onGround()) {
				if (teclasPresionadas.cero && teclasPresionadas.abajo){   
					miEnemigo.generaBloquearAbajo();					
				} else if(teclasPresionadas.cero) {
					miEnemigo.generaBloquearArriba();
				} else if (teclasPresionadas.abajo && teclasPresionadas.letraO && !miEnemigo.seEstaEjecutandoAtaque()) {
					miEnemigo.iniciarAnimacionAgachadoPunch();
				} else {
					miEnemigo.generaAgacharse();
				}
			} else {
				if (teclasPresionadas.derecha) {
					miEnemigo.generaCaminarDerecha();
				}
				if (teclasPresionadas.izquierda) {
					miEnemigo.generaCaminarIzquierda();
				}
				if (teclasPresionadas.arriba && miEnemigo.onGround()) {
					miEnemigo.generaSaltar();
				}
				if (!miEnemigo.seEstaEjecutandoAtaque()){
					if (teclasPresionadas.letraO && miEnemigo.y <= 507) {
						miEnemigo.iniciarAnimacionMovingPunch(2.999);
					}
					if (teclasPresionadas.letraP && miEnemigo.y <= 507) {	
						// console.log('Tecla "espacio" presionada. Iniciando animación puñetazo.');
						miEnemigo.iniciarAnimacionKick();
					}
					if (teclasPresionadas.letraI && miEnemigo.y <= 507) {	
						// console.log('Tecla "espacio" presionada. Iniciando animación puñetazo.');
						miEnemigo.iniciarAnimacionLowKick(4.999);
					}
				}
			}
		} else {
			miEnemigo.generaReposo();
			// miEnemigo.generaBloquearAbajo();
		}
	}

	function inicialiazarSonidos(){
		sonidoStrongHit = document.getElementById('audioStrongHit');
	}

	function seTropiezan() {
		let colisionEnX = (miPersonaje.hitbox.cuerpo.x < miEnemigo.hitbox.cuerpo.x + miEnemigo.hitbox.cuerpo.width) && (miPersonaje.hitbox.cuerpo.x + miPersonaje.hitbox.cuerpo.width > miEnemigo.hitbox.cuerpo.x);
		let colisionEnY = (miPersonaje.hitbox.cuerpo.y < miEnemigo.hitbox.cuerpo.y + miEnemigo.hitbox.cuerpo.height) && (miPersonaje.hitbox.cuerpo.y + miPersonaje.hitbox.cuerpo.height > miEnemigo.hitbox.cuerpo.y);
		return colisionEnX && colisionEnY;
	}
	function personaje1PunchingHead() {
		let lanzandoPunio = (miPersonaje.animacionEnProgresoMovingPunch && miPersonaje.position === 2);
		let colisionPunioCabezaX = (miPersonaje.hitbox.punio.x < miEnemigo.hitbox.cabeza.x + miEnemigo.hitbox.cabeza.width) && (miPersonaje.hitbox.punio.x + miPersonaje.hitbox.punio.width > miEnemigo.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miPersonaje.hitbox.punio.y < miEnemigo.hitbox.cabeza.y + miEnemigo.hitbox.cabeza.height) && (miPersonaje.hitbox.punio.y + miPersonaje.hitbox.punio.height > miEnemigo.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY);
		if (!resultado) miPersonaje.golpeConectado.punchHead = false;
		return resultado;
	}
	function personaje2PunchingHead(){
		let lanzandoPunio = (miEnemigo.animacionEnProgresoMovingPunch && miEnemigo.position === 1);
		let colisionPunioCabezaX = (miEnemigo.hitbox.punio.x < miPersonaje.hitbox.cabeza.x + miPersonaje.hitbox.cabeza.width) && (miEnemigo.hitbox.punio.x + miEnemigo.hitbox.punio.width > miPersonaje.hitbox.cabeza.x);;
		let colisionPunioCabezaY = (miEnemigo.hitbox.punio.y < miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height) && (miEnemigo.hitbox.punio.y + miEnemigo.hitbox.punio.height > miPersonaje.hitbox.cabeza.y);
		let resultado = (lanzandoPunio && colisionPunioCabezaX && colisionPunioCabezaY)
		if (!resultado) miEnemigo.golpeConectado.punchHead = false;
		return resultado;
	}
	function personaje1KickingHead(){
		let lanzadoPatada = (miPersonaje.animacionEnProgresoKick && miPersonaje.position === 1);
		let colisionPatadaCabezaX = (miPersonaje.hitbox.patada.x < miEnemigo.hitbox.cabeza.x + miEnemigo.hitbox.cabeza.width) && (miPersonaje.hitbox.patada.x + miPersonaje.hitbox.patada.width > miEnemigo.hitbox.cabeza.x);;
		let colisionPatadaCabezaY = (miPersonaje.hitbox.patada.y < miEnemigo.hitbox.cabeza.y + miEnemigo.hitbox.cabeza.height) && (miPersonaje.hitbox.patada.y + miPersonaje.hitbox.patada.height > miEnemigo.hitbox.cabeza.y);
		let resultado = (lanzadoPatada && colisionPatadaCabezaX && colisionPatadaCabezaY);
		if (!resultado) miPersonaje.golpeConectado.kickHead = false;
		return resultado;
	}
	function personaje2KickingHead(){
		let lanzadoPatada = (miEnemigo.animacionEnProgresoKick && miEnemigo.position === 1);
		let colisionPatadaCabezaX = (miEnemigo.hitbox.patada.x < miPersonaje.hitbox.cabeza.x + miPersonaje.hitbox.cabeza.width) && (miEnemigo.hitbox.patada.x + miEnemigo.hitbox.patada.width > miPersonaje.hitbox.cabeza.x);;
		let colisionPatadaCabezaY = (miEnemigo.hitbox.patada.y < miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height) && (miEnemigo.hitbox.patada.y + miEnemigo.hitbox.patada.height > miPersonaje.hitbox.cabeza.y);
		let resultado = (lanzadoPatada && colisionPatadaCabezaX && colisionPatadaCabezaY);
		if (!resultado) miEnemigo.golpeConectado.kickHead = false;
		return resultado;
	}
	function personaje1KickingBody(){
	}
	function personaje2KickingBody(){
	}
	function personaje1PunchingBody(){
	}
	function personaje2PunchingBody(){
	}

	function comprobarColisiones() {
		// console.log(miPersonaje.personajeState);
		// console.log('POSICIÓN Y SUPERIOR DE PUÑO: ' + (miEnemigo.hitbox.punio.y));
		// if(miPersonaje.personajeState === 'kick') {
		// 	console.log('POSICIÓN Y INFERIOR DE CABEZA PERSONAJE: ' + (miPersonaje.hitbox.cabeza.y + miPersonaje.hitbox.cabeza.height));
		// }
			

		// punto más bajo puño miPersonaje: 502 
		// punto y más bajo puño miEnemigo: 499 

		if(seTropiezan()){
			console.log('SE TROPEZARON');
			miEnemigo.x = (miPersonaje.hitbox.cuerpo.x + miPersonaje.hitbox.cuerpo.width) - (miEnemigo.hitbox.cuerpo.x - miEnemigo.x);
			miPersonaje.x = miEnemigo.hitbox.cuerpo.x - (miPersonaje.hitbox.cuerpo.x + miPersonaje.hitbox.cuerpo.width - miPersonaje.x);
		}
		
		if(personaje1PunchingHead() && !miPersonaje.golpeConectado.punchHead){ //solo se produce el evento 1 vez, cada vez que el puño colisiona con la cabeza
			miPersonaje.golpeConectado.punchHead = true;  //se pone a true y se espera a que cuando deje de haber la colisión se ponga a false
			console.log('PERSONAJE 1 HA GOLPEADO A LA CABEZA');
			sonidoStrongHit.currentTime = 0;
			sonidoStrongHit.play();
			miEnemigo.vida -= 150;
			miPersonaje.energia -= 15000;
		}
		if(personaje2PunchingHead() && !miEnemigo.golpeConectado.punchHead){
			miEnemigo.golpeConectado.punchHead = true;
			console.log('PERSONAJE 2 HA GOLPEADO A LA CABEZA');
			sonidoStrongHit.currentTime = 0;
			sonidoStrongHit.play();
			miPersonaje.vida -= 150;
			miEnemigo.energia -= 15000;
		}
		if(personaje1KickingHead() && !miPersonaje.golpeConectado.kickHead){
			miPersonaje.golpeConectado.kickHead = true;
			console.log('PERSONAJE 1 HA PATEADO A LA CABEZA');
			miEnemigo.vida -= 150;
			miPersonaje.energia -= 15000;
		}
		if(personaje2KickingHead() && !miEnemigo.golpeConectado.kickHead){
			miEnemigo.golpeConectado.kickHead = true;
			console.log('PERSONAJE 2 HA PATEADO A LA CABEZA');
			miPersonaje.vida -= 150;
			miEnemigo.energia -= 15000;
		}
	}

	/*********************************************************************************************** */

	function asignarVidaParaMostrarPorPantalla(){
		if (miPersonaje.vida < 0) miPersonaje.vida = 0;
		if (miPersonaje.vida > VIDA_TOTAL) miPersonaje.vida = VIDA_TOTAL;
		if (miEnemigo.vida < 0) miEnemigo.vida = 0;
		if (miEnemigo.vida > VIDA_TOTAL) miEnemigo.vida = VIDA_TOTAL;
		vida1.style.width = (miPersonaje.vida/VIDA_TOTAL) * 100 + '%';
		vida2.style.width = (miEnemigo.vida/VIDA_TOTAL) * 100 + '%';
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
		miPersonaje.energia += energiaRecuperacion;
		
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
		miEnemigo.energia += energiaRecuperacion;
	}

	function recuperarVida(){
		miPersonaje.vida += 0.1;
		miEnemigo.vida += 0.1;
	}

	function controlarEventosPrincipales() {
		asignarVidaParaMostrarPorPantalla();
		asignarEnergiaParaMostrarPorPantalla();
		recuperarEnergia();
		recuperarVida();
	}

	/*********************************************************************************************** */

	class Personaje {
		constructor(image, spriteAnimations, heightInicial, x, id) {
			this.image = image;
			this.spriteAnimations = spriteAnimations;
			
			//identificador del personaje (personaje1 o personaje2)
			this.id = id;

			//dimensiones personaje
			this.x = x;
			this.y = LIMITE_ABAJO - heightInicial;
			this.width;
			this.height = heightInicial;

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
				}
			};

			//variables en el sprite de cada personaje a la hora de dibujar
			this.frameX;		//corta en el sprite en eje X
			this.frameY;

			this.spriteWidth;
			this.spriteHeight;

			//atributos variados
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
				'kickHead': false
			}

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
			this.duracionAnimacionLowKick = 800;
			this.animacionEnProgresoLowKick = false;


			//variables creadas para solucionar error del sprite que se carga en una mala posición debido a sus dimensiones.
			this.primeraVez = true;
			this.segundaVez = true;
			this.tercerVez = true;
		}

		// devuelve booleano para saber si el personaje está realizando algún ataque
		seEstaEjecutandoAtaque(){
			let ataques = (this.animacionEnProgresoKick) || (this.animacionEnProgresoMovingPunch) || (this.animacionEnProgresoAgachadoPunch) || (this.animacionEnProgresoLowKick);
			return ataques;
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

			  this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
			  this.y = LIMITE_ABAJO - this.height;
			  
			  if (this.id === 1){
				switch(this.position){
					case 0:
						this.hitbox.cuerpo.x = this.x+9, 
						this.hitbox.cuerpo.y = this.y+6, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.1

						this.hitbox.cabeza.x = this.x+18,
						this.hitbox.cabeza.y = this.y+5,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 1:
						this.hitbox.cuerpo.x = this.x+17, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.05
						
						this.hitbox.cabeza.x = this.x+24,
						this.hitbox.cabeza.y = this.y+2,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 2:
						this.hitbox.cuerpo.x = this.x+22, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2.9, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.punio.x = this.x+38, 
						this.hitbox.punio.y = this.y+15, 
						this.hitbox.punio.width = this.width/2.1, 
						this.hitbox.punio.height = this.height/12
						
						this.hitbox.cabeza.x = this.x+24,
						this.hitbox.cabeza.y = this.y+2,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 3:
						this.hitbox.cuerpo.x = this.x+17, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.punio.x = null, 
						this.hitbox.punio.y = null, 
						this.hitbox.punio.width = null, 
						this.hitbox.punio.height = null
						
						this.hitbox.cabeza.x = this.x+24,
						this.hitbox.cabeza.y = this.y+2,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 4:
						this.hitbox.cuerpo.x = this.x+9, 
						this.hitbox.cuerpo.y = this.y+6, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.1
						
						this.hitbox.cabeza.x = this.x+18,
						this.hitbox.cabeza.y = this.y+5,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
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
						this.hitbox.cuerpo.x = this.x+14, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2.7, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.cabeza.x = this.x+17,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
						break;
					case 1:
						this.hitbox.cuerpo.x = this.x+25, 
						this.hitbox.cuerpo.y = this.y+4, 
						this.hitbox.cuerpo.width = this.width/3.4, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.punio.x = this.x+1, 
						this.hitbox.punio.y = this.y+16, 
						this.hitbox.punio.width = this.width/2.2, 
						this.hitbox.punio.height = this.height/15
						
						this.hitbox.cabeza.x = this.x+25,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
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

						this.hitbox.cabeza.x = this.x+17,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
						break;
					default:
						break;
				}
			  }

			  if (tiempoTranscurrido < this.duracionAnimacionMovingPunch) {
				// Continuar animación si no ha alcanzado la duración máxima
				requestAnimationFrame(() => this.animarMovingPunch(numAnimaciones));
			  } else {
				// console.log('ANIMACIÓN PUÑETAZO TERMINADA');
				this.animacionEnProgresoMovingPunch = false;
				this.primeraVez = true;
				this.segundaVez = true;
				
			  }
			}
		}

		iniciarAnimacionAgachadoPunch() {
			this.animacionEnProgresoAgachadoPunch = true;
			this.inicioAnimacionAgachadoPunch = performance.now();
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
			  console.log(progreso);
			//   console.log('posición: ' + this.position);

			  this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
			  this.y = LIMITE_ABAJO - this.height;
			  
			  if (this.id === 1){
				switch(this.position){
					case 0:
						this.hitbox.cuerpo.x = this.x+9, 
						this.hitbox.cuerpo.y = this.y+6, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.1

						this.hitbox.cabeza.x = this.x+18,
						this.hitbox.cabeza.y = this.y+5,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 1:
						this.hitbox.cuerpo.x = this.x+17, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.05
						
						this.hitbox.cabeza.x = this.x+24,
						this.hitbox.cabeza.y = this.y+2,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 2:
						this.hitbox.cuerpo.x = this.x+22, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2.9, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.punio.x = this.x+38, 
						this.hitbox.punio.y = this.y+15, 
						this.hitbox.punio.width = this.width/2.1, 
						this.hitbox.punio.height = this.height/12
						
						this.hitbox.cabeza.x = this.x+24,
						this.hitbox.cabeza.y = this.y+2,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 3:
						this.hitbox.cuerpo.x = this.x+17, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.punio.x = null, 
						this.hitbox.punio.y = null, 
						this.hitbox.punio.width = null, 
						this.hitbox.punio.height = null
						
						this.hitbox.cabeza.x = this.x+24,
						this.hitbox.cabeza.y = this.y+2,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 4:
						this.hitbox.cuerpo.x = this.x+9, 
						this.hitbox.cuerpo.y = this.y+6, 
						this.hitbox.cuerpo.width = this.width/2, 
						this.hitbox.cuerpo.height = this.height/1.1
						
						this.hitbox.cabeza.x = this.x+18,
						this.hitbox.cabeza.y = this.y+5,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
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

						this.hitbox.cabeza.x = this.x+17,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
						break;
					case 1:
						this.hitbox.cuerpo.x = this.x+25, 
						this.hitbox.cuerpo.y = this.y+4, 
						this.hitbox.cuerpo.width = this.width/3.4, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.punio.x = this.x+1, 
						this.hitbox.punio.y = this.y+16, 
						this.hitbox.punio.width = this.width/2.2, 
						this.hitbox.punio.height = this.height/15
						
						this.hitbox.cabeza.x = this.x+25,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
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

						this.hitbox.cabeza.x = this.x+17,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
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

		iniciarAnimacionKick() {
			this.animacionEnProgresoKick = true;
			this.inicioAnimacionKick = performance.now();
			this.animarKick();
		}

		animarKick() {
			if (this.animacionEnProgresoKick) {
			  const tiempoActual = performance.now();
			  const tiempoTranscurrido = tiempoActual - this.inicioAnimacionKick;
			  const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionKick, 1);
		
			  // Actualizar la animación (código específico de animación aquí)
			  this.personajeState = 'kick';
			  this.position = Math.floor(progreso * 2.999);
		
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
						this.hitbox.cuerpo.x = this.x+4, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/1.5, 
						this.hitbox.cuerpo.height = this.height/1.05
						
						this.hitbox.cabeza.x = this.x+8,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 1:
						this.hitbox.cuerpo.x = this.x+3, 
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
						break;
					case 2:
						this.hitbox.cuerpo.x = this.x+4, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/1.5, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.patada.x = null, 
						this.hitbox.patada.y = null, 
						this.hitbox.patada.width = null, 
						this.hitbox.patada.height = null
						
						this.hitbox.cabeza.x = this.x+8,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
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
					this.hitbox.cuerpo.x = this.x+30, 
					this.hitbox.cuerpo.y = this.y+1, 
					this.hitbox.cuerpo.width = this.width/3.2, 
					this.hitbox.cuerpo.height = this.height/1.1
					
					this.hitbox.cabeza.x = this.x+34,
					this.hitbox.cabeza.y = this.y+4,
					this.hitbox.cabeza.width = this.width/5,
					this.hitbox.cabeza.height = this.height/7
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
					break;
				case 2:
					this.hitbox.cuerpo.x = this.x+30, 
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

		
		iniciarAnimacionLowKick(numAnimaciones) {
			this.animacionEnProgresoLowKick = true;
			this.inicioAnimacionLowKick = performance.now();
			this.animarLowKick(numAnimaciones);
		}

		animarLowKick(numAnimaciones) {
			if (this.animacionEnProgresoLowKick) {
			  const tiempoActual = performance.now();
			  const tiempoTranscurrido = tiempoActual - this.inicioAnimacionLowKick;
			  const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacionLowKick, 1);
		
			  // Actualizar la animación (código específico de animación aquí)
			  this.personajeState = 'lowKick';
			  this.position = Math.floor(progreso * numAnimaciones);
		
			  this.height = this.spriteAnimations[this.personajeState].loc[this.position].height;
			  this.y = LIMITE_ABAJO - this.height;

			  if (this.id === 1){

				switch(this.position){
					case 0:
						this.hitbox.cuerpo.x = this.x+4, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/1.5, 
						this.hitbox.cuerpo.height = this.height/1.05
						
						this.hitbox.cabeza.x = this.x+8,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
						break;
					case 1:
						this.hitbox.cuerpo.x = this.x+3, 
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
						break;
					case 2:
						this.hitbox.cuerpo.x = this.x+4, 
						this.hitbox.cuerpo.y = this.y+2, 
						this.hitbox.cuerpo.width = this.width/1.5, 
						this.hitbox.cuerpo.height = this.height/1.05

						this.hitbox.patada.x = null, 
						this.hitbox.patada.y = null, 
						this.hitbox.patada.width = null, 
						this.hitbox.patada.height = null
						
						this.hitbox.cabeza.x = this.x+8,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
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
					this.hitbox.cuerpo.x = this.x+30, 
					this.hitbox.cuerpo.y = this.y+1, 
					this.hitbox.cuerpo.width = this.width/3.2, 
					this.hitbox.cuerpo.height = this.height/1.1
					
					this.hitbox.cabeza.x = this.x+34,
					this.hitbox.cabeza.y = this.y+4,
					this.hitbox.cabeza.width = this.width/5,
					this.hitbox.cabeza.height = this.height/7
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
					break;
				case 2:
					this.hitbox.cuerpo.x = this.x+30, 
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
					break;
				default:
					break;
				}
			  }

			  if (tiempoTranscurrido < this.duracionAnimacionLowKick) {
				// Continuar animación si no ha alcanzado la duración máxima
				requestAnimationFrame(() => this.animarLowKick(numAnimaciones));
			  } else {
				// console.log('ANIMACIÓN PATADA BAJA TERMINADA');
				this.animacionEnProgresoLowKick = false;
				this.primeraVez = true;
				this.segundaVez = true;
				this.tercerVez = true;
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
				if(this.personajeState !== 'saltar' && this.personajeState !== 'movingPunch' && this.personajeState !== 'kick' && this.personajeState !== 'agachadoPunch' && this.personajeState !== 'lowKick') {
				// position2 es igual que position -> para no crear problemas de sincronización
				this.position2 = Math.floor(gameFrame / this.velocidadAnimacion) % this.spriteAnimations[this.personajeState].loc.length;
				this.height = this.spriteAnimations[this.personajeState].loc[this.position2].height;
				this.y = LIMITE_ABAJO - this.height;

				//excepción porque el sprite de bloquear abajo de miEnemigo esta diseñado de forma distinta
				if (this.id === 2 && this.personajeState === 'bloquearAbajo') this.y += 2;
			}

			if (this.personajeState !== 'movingPunch'){
				this.hitbox.punio.x = null, 
				this.hitbox.punio.y = null, 
				this.hitbox.punio.width = null, 
				this.hitbox.punio.height = null
			}
			if (this.personajeState !== 'kick'){
				this.hitbox.patada.x = null, 
				this.hitbox.patada.y = null, 
				this.hitbox.patada.width = null, 
				this.hitbox.patada.height = null
			}

			if (this.id === 1){
				// this.x = 260;
				if(this.personajeState === 'reposo') {
					this.hitbox.cuerpo.x = this.x+8,
					this.hitbox.cuerpo.y = this.y+4,
					this.hitbox.cuerpo.width = this.width/2.1,
					this.hitbox.cuerpo.height = this.height/1.1
			
					this.hitbox.cabeza.x = this.x+14,
					this.hitbox.cabeza.y = this.y+1,
					this.hitbox.cabeza.width = this.width/3.5,
					this.hitbox.cabeza.height = this.height/6

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'caminando') {
					this.hitbox.cuerpo.x = this.x+10,
					this.hitbox.cuerpo.y = this.y+4,
					this.hitbox.cuerpo.width = this.width/2,
					this.hitbox.cuerpo.height = this.height/1.1

					if (this.position === 0){
						this.hitbox.cabeza.x = this.x+20,
						this.hitbox.cabeza.y = this.y+8,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
					} else if (this.position === 1){
						this.hitbox.cabeza.x = this.x+20,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
					} else if (this.position === 2){
						this.hitbox.cabeza.x = this.x+21,
						this.hitbox.cabeza.y = this.y+1,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
					} else if (this.position === 3){
						this.hitbox.cabeza.x = this.x+20,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
					} else if (this.position === 4){
						this.hitbox.cabeza.x = this.x+19,
						this.hitbox.cabeza.y = this.y+3,
						this.hitbox.cabeza.width = this.width/3.5,
						this.hitbox.cabeza.height = this.height/6
					}

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'agacharse') {
					this.hitbox.cuerpo.x = this.x+12,
					this.hitbox.cuerpo.y = this.y+3,
					this.hitbox.cuerpo.width = this.width/1.5,
					this.hitbox.cuerpo.height = this.height/1.1

					this.hitbox.cabeza.x = this.x+23,
					this.hitbox.cabeza.y = this.y+3,
					this.hitbox.cabeza.width = this.width/3.5,
					this.hitbox.cabeza.height = this.height/6

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'bloquearArriba') {
					this.hitbox.cuerpo.x = this.x+8, 
					this.hitbox.cuerpo.y = this.y+1, 
					this.hitbox.cuerpo.width = this.width/2.1, 
					this.hitbox.cuerpo.height = this.height/1.05
					
					this.hitbox.cabeza.x = this.x+12,
					this.hitbox.cabeza.y = this.y+1,
					this.hitbox.cabeza.width = this.width/3.5,
					this.hitbox.cabeza.height = this.height/6

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'bloquearAbajo') {
					this.hitbox.cuerpo.x = this.x+7,
					this.hitbox.cuerpo.y = this.y+2,
					this.hitbox.cuerpo.width = this.width/1.45,
					this.hitbox.cuerpo.height = this.height/1.1

					this.hitbox.cabeza.x = this.x+12,
					this.hitbox.cabeza.y = this.y+4, 
					this.hitbox.cabeza.width = this.width/3.5, 
					this.hitbox.cabeza.height = this.height/6

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				}
			} else {
				if(this.personajeState === 'reposo') {
					this.hitbox.cuerpo.x = this.x+16,
					this.hitbox.cuerpo.y = this.y+2,
					this.hitbox.cuerpo.width = this.width/2.1,
					this.hitbox.cuerpo.height = this.height/1.05
					
					this.hitbox.cabeza.x = this.x+20,
					this.hitbox.cabeza.y = this.y+5,
					this.hitbox.cabeza.width = this.width/5,
					this.hitbox.cabeza.height = this.height/7

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'caminando') {
					this.hitbox.cuerpo.x = this.x+14, 
					this.hitbox.cuerpo.y = this.y+2, 
					this.hitbox.cuerpo.width = this.width/2.1, 
					this.hitbox.cuerpo.height = this.height/1.05

					if (this.position === 0){
						this.hitbox.cabeza.x = this.x+14,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
					} else if (this.position === 1){
						this.hitbox.cabeza.x = this.x+15,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
					} else if (this.position === 2){
						this.hitbox.cabeza.x = this.x+15,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
					} else if (this.position === 3){
						this.hitbox.cabeza.x = this.x+15,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
					} else if (this.position === 4){
						this.hitbox.cabeza.x = this.x+16,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
					} else if (this.position === 5){
						this.hitbox.cabeza.x = this.x+15,
						this.hitbox.cabeza.y = this.y+7,
						this.hitbox.cabeza.width = this.width/5,
						this.hitbox.cabeza.height = this.height/7
					}

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'agacharse') {
					this.hitbox.cuerpo.x = this.x+8,
					this.hitbox.cuerpo.y = this.y+3,
					this.hitbox.cuerpo.width = this.width/1.8,
					this.hitbox.cuerpo.height = this.height/1.1

					this.hitbox.cabeza.x = this.x+9,
					this.hitbox.cabeza.y = this.y+7,
					this.hitbox.cabeza.width = this.width/5,
					this.hitbox.cabeza.height = this.height/7

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'bloquearArriba') {
					this.hitbox.cuerpo.x = this.x+16,
					this.hitbox.cuerpo.y = this.y+2,
					this.hitbox.cuerpo.width = this.width/2.1,
					this.hitbox.cuerpo.height = this.height/1.05

					this.hitbox.cabeza.x = this.x+24,
					this.hitbox.cabeza.y = this.y+6,
					this.hitbox.cabeza.width = this.width/5,
					this.hitbox.cabeza.height = this.height/7

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} else if (this.personajeState === 'bloquearAbajo') {
					this.hitbox.cuerpo.x = this.x+7,
					this.hitbox.cuerpo.y = this.y+6,
					this.hitbox.cuerpo.width = this.width/1.7,
					this.hitbox.cuerpo.height = this.height/1.1

					this.hitbox.cabeza.x = this.x+19,
					this.hitbox.cabeza.y = this.y+11,
					this.hitbox.cabeza.width = this.width/5,
					this.hitbox.cabeza.height = this.height/7

					this.hitbox.tronco.x = null,
					this.hitbox.tronco.y = null,
					this.hitbox.tronco.width = null,
					this.hitbox.tronco.height = null
				} 
			}
		}
		iniciarAnimacionBien(){ //algunas animaciones necesitan que se empiecen desde el primer FRAME
			if(this.personajeState === 'saltar'){
				this.position = Math.floor(this.AnimationFrame / this.velocidadAnimacion) % this.spriteAnimations[this.personajeState].loc.length;
				// console.log('POSICIÓN ANIMACIÓN: '+this.position);
			} else if(this.personajeState === 'movingPunch' || this.personajeState === 'kick' || this.personajeState === 'agachadoPunch' || this.personajeState === 'lowKick') {
				// console.log('POSICIÓN ANIMACIÓN: '+this.position);
			} else {
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
			// let Loc = 0;
			// if(this.id === 1) Loc = 0;
			// this.frameX = this.spriteAnimations['kick'].loc[Loc].x;
			// this.frameY = this.spriteAnimations['kick'].loc[Loc].y;
			// this.spriteWidth = this.spriteAnimations['kick'].loc[Loc].width;
			// this.spriteHeight = this.spriteAnimations['kick'].loc[Loc].height;
			
			this.width = this.spriteWidth;
			// this.height = this.spriteHeight;

			ctx.drawImage(this.image, this.frameX, this.frameY, this.spriteWidth, this.spriteHeight,
				this.x, this.y, this.spriteWidth, this.spriteHeight);

				
			// ctx.fillRect(this.x+8, this.y+4, this.width/2.1, this.height/1.1);
			
			ctx.fillStyle = "#f000";
			if(this.id === 1) {
				// ctx.fillRect(this.x+8, this.y+3, this.width/3.5, this.height/6);
				ctx.fillRect(this.hitbox.patada.x, this.hitbox.patada.y, this.hitbox.patada.width, this.hitbox.patada.height);

				ctx.fillStyle = "#fff0";
				// ctx.fillRect(this.x+8, this.y+3, this.width/3.5, this.height/6);
				ctx.fillRect(this.hitbox.cabeza.x, this.hitbox.cabeza.y, this.hitbox.cabeza.width, this.hitbox.cabeza.height);
				// console.log(this.hitbox.cuerpo.width);
			}
			ctx.fillStyle = "#f000";
			if(this.id === 2) {
				// ctx.fillRect(this.x+20, this.y+5, this.width/5, this.height/7);
				ctx.fillRect(this.hitbox.patada.x, this.hitbox.patada.y, this.hitbox.patada.width, this.hitbox.patada.height);
				ctx.fillStyle = "#fff0";
				// ctx.fillRect(this.x+25, this.y+4, this.width/3.4, this.height/1.05);
				ctx.fillRect(this.hitbox.cabeza.x, this.hitbox.cabeza.y, this.hitbox.cabeza.width, this.hitbox.cabeza.height);
				// console.log(this.hitbox.cuerpo.x);
			}
			
		}
	}

	const miPersonaje = new Personaje(personajeImage, spriteAnimationsKen, spriteHeightKen, 100, 1);
	const miEnemigo = new Personaje(enemigoImage, spriteAnimationsCammy, spriteHeightCammy, 300, 2);

	inicialiazarSonidos();

	function pintarJuego(timeStamp) {
		ctx.clearRect(0, 0, LIMITE_DERECHA, CANVAS_HEIGHT);

		miPersonaje.dibujarNormal();
		miEnemigo.dibujarNormal();

		// console.log('POSITION X: '+miEnemigo.x);
		// console.log('POSITION Y: '+this.y);
		// console.log('POSITION Y: '+miEnemigo.y);
		// console.log('ANCHURA: '+this.width);
		// console.log('ALTURA: '+this.height);
		// console.log('ALTURA: '+miEnemigo.height);
		// console.log('enemigo y: '+miEnemigo.y);
		// console.log('Y:' + miEnemigo.y);
		// console.log('LIMITE_ABAJO - ALTURA:' + (LIMITE_ABAJO - miEnemigo.height));
		// console.log('Y:' + miEnemigo.y);
		// console.log('posicion x: ' + (miEnemigo.x));

		detectarControlesPersonaje();
		detectarControlesEnemigo();

		comprobarColisiones();
		controlarEventosPrincipales();

		miPersonaje.AnimationFrame++; //maneja la tasa de refresco de algunas animaciones que necesitan ser iniciadas desde 0
		miEnemigo.AnimationFrame++;

		gameFrame++;				  //maneja la tasa de refresco de las animaciones normales
		requestAnimationFrame(pintarJuego);
	}

	pintarJuego(0);





}


/*


- TAREAS QUE REALIZAR:

* Hacer low kick de ambos personajes pero con otra tecla (T, I)
* Ponerse con las animaciones de ser golpeado y derrotado
* Crear animación patada baja agachado
* Hitbox tronco para low-kick, puño agachado y patada baja

* Solucionar hitbox del cuerpo bara que cuando se agache y levante no empuje al otro
* Hacer que al darle al botón de abajo se agache y para levantarse tenga que darle al de arriba

*/