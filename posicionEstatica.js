window.onload = function () {

	// CONSTANTES
	const LIMITE_DERECHA = document.getElementById('miCanvas').width;
	const LIMITE_IZQUIERDA = 0;
	const LIMITE_ARRIBA = 0;
	const LIMITE_ABAJO = 657;        //valor fijo por temas de diseño

	const ANCHURA_PJ_CANVAS = 53;   //anchura definitiva que ocupa el personaje en el lienzo
	const ALTURA_PJ_CANVAS = 107;	  //altura definitiva que ocupa el personaje en el lienzo

	// variables de teclas
	const TECLA_ARRIBA = 38;
	const TECLA_ABAJO = 40;
	const TECLA_IZQUIERDA = 37;
	const TECLA_DERECHA = 39;
	const TECLA_ESPACIO = 32;
	const TECLA_T = 84;

	// SKIN PERSONAJES
	let Sagat = {
		posicionX: 5,
		posicionY: 23,
		tamanioX: 53,
		tamanioY: 107,
		url: "./img/SagatStreetFighterIZQ.png"
	}

	let Ken = {
		posicionX: 5,
		posicionY: 17,
		tamanioX: 45,
		tamanioY: 82,
		url: "./img/KenStreetFighter.png"
	}

	// METODOLOGÍA DE posicionAnimación
	// 0 = Estático en el Sitio
	// 1 = Caminando
	// 2 = Puñetazo

	let skinPersonaje = Ken;
	let arrayAnimacionPersonaje = [[[skinPersonaje.posicionX, skinPersonaje.posicionY],[54,18],[104,17],[153,16]]]; // Posiciones del sprite donde recortar cada imagen
	let skinEnemigo = Sagat;
	let arrayAnimacionEnemigo = [[[skinEnemigo.posicionX, skinEnemigo.posicionY],[64,24],[123,27],[182,24]]];  

	// DECLARACIÓN DE VARIABLES
	let x = 110;        																// posición inicial x del PERSONAJE
	let y = LIMITE_ABAJO - ALTURA_PJ_CANVAS;      // posición inicial y del PERSONAJE

	let enemigo_x = 190;        																// posición inicial x del PERSONAJE
	let enemigo_y = LIMITE_ABAJO - ALTURA_PJ_CANVAS;      // posición inicial y del PERSONAJE


	let canvas;     // variable que referencia al elemento canvas del html
	let ctx;        // contexto de trabajo
	let id1, id2;   // id de la animación

	// objeto de variables de teclas presionadas (booleanas)
	let teclasPresionadas = {
		derecha: false,
		izquierda: false,
		arriba: false,
		abajo: false,
		espacio: false,
		letraT: false
	}


	let posicionDeLaAnimacionPersonaje = 0;   // posicion en el array para elegir las distintas partes de una animación concreta del Personaje
	let posicionDeLaAnimacionEnemigo = 0;   // posicion en el array para elegir las distintas partes de una animación concreta del Enemigo
	let AnimacionPersonaje = 0; // posicion en el array para elegir que animacion hacer en el Personaje
	let AnimacionEnemigo = 0; // posicion en el array para elegir que animacion hacer en el Enemigo

	let posicion = 0;
	let posicionAnimacion = 0;

	let miPersonaje;
	let miEnemigo;
	let imagen; //imagen del Personaje
	let imagen2; //imagen del Enemigo

	// OBJETO DEL PERSONAJE
	function Personaje(x, y, skin, arrayAnimacion) {

		this.x = x;
		this.y = y;
		this.animacionPersonajes = arrayAnimacion; //[[[skin.posicionX, skin.posicionY]]]; // Posiciones del sprite donde recortar cada imagen
		this.velocidad = 5;
		this.tamanioX = skin.tamanioX;
		this.tamanioY = skin.tamanioY;

	}

	// OBJETO DEL ENEMIGO
	function Enemigo(x, y) {
		this.x = x;
		this.y = y;
		this.animacionPersonajes = [[[skinEnemigo.posicionX, skinEnemigo.posicionY]]];
		this.velocidad = 1;
		this.tamanioX = skinEnemigo.tamanioX;
		this.tamanioY = skinEnemigo.tamanioY;
	}

	// METODOS DEL PERSONAJE

	Personaje.prototype.generaPosicionArribaDerecha = function () {
		this.x = this.x + this.velocidad;
		this.y = this.y - this.velocidad;


	}

	Personaje.prototype.generaPosicionArribaIzquierda = function () {
		this.x = this.x - this.velocidad;
		this.y = this.y - this.velocidad;
	}

	Personaje.prototype.generaPosicionDerecha = function () {

		this.x = this.x + this.velocidad;

		if (this.x > LIMITE_DERECHA - ANCHURA_PJ_CANVAS) {

			// If at edge, reset ship position and set flag.
			this.x = LIMITE_DERECHA - ANCHURA_PJ_CANVAS;
		}
	}

	Personaje.prototype.generaPosicionIzquierda = function () {

		this.x = this.x - this.velocidad;

		if (this.x < LIMITE_IZQUIERDA) {

			// If at edge, reset ship position and set flag.
			this.x = LIMITE_IZQUIERDA;
		}
	}

	Personaje.prototype.generaPosicionArriba = function () {

		this.y = this.y - this.velocidad;

		if (this.y < LIMITE_ARRIBA) {

			// If at edge, reset ship position and set flag.
			this.y = LIMITE_ARRIBA;
		}
	}

	Personaje.prototype.generaPosicionAbajo = function () {

		this.y = this.y + this.velocidad;

		if (this.y > LIMITE_ABAJO - ALTURA_PJ_CANVAS) {

			// If at edge, reset ship position and set flag.
			this.y = LIMITE_ABAJO - ALTURA_PJ_CANVAS;
		}
	}

	// PINTAR cualquier personaje o enemigo
	Personaje.prototype.pintarPlayer = function () {
		ctx.drawImage(this.imagen, // Imagen completa con todos los Personaje (Sprite)
			this.animacionPersonajes[posicionAnimacion][posicion][0],    // Posicion X del sprite donde se encuentra el Personaje que voy a recortar del sprite para dibujar
			this.animacionPersonajes[posicionAnimacion][posicion][1],	  // Posicion Y del sprite donde se encuentra el Personaje que voy a recortar del sprite para dibujar
			this.tamanioX, 		    // Tamaño X del Personaje que voy a recortar para dibujar
			this.tamanioY,	        // Tamaño Y del Personaje que voy a recortar para dibujar
			this.x,                // Posicion x de pantalla donde voy a dibujar el Personaje recortado
			this.y,				            // Posicion y de pantalla donde voy a dibujar el Personaje recortado
			ANCHURA_PJ_CANVAS, ALTURA_PJ_CANVAS);
			// this.tamanioX,		    // Tamaño X del Personaje que voy a dibujar
			// this.tamanioY);         // Tamaño Y del Personaje que voy a dibujar					  

	}

	// FUNCION QUE DETECTA LAS COLISIONES

	function detectarColision() {
		if ((miPersonaje.x < miEnemigo.x + miEnemigo.tamanioX) &&
			(miPersonaje.x + miPersonaje.tamanioX > miEnemigo.x) &&
			(miPersonaje.y < miEnemigo.y + miEnemigo.tamanioY) &&
			(miPersonaje.y + miPersonaje.tamanioY > miEnemigo.y)
		) {
			return true;
		}
		return false;
	}

	function actualizaPosicionPersonaje() {
		// ESTAS LINEAS LAS DEJO COMENTADAS POR SI TENGO QUE HACER ALGUNA ANIMACIÓN

		// if (teclasPresionadas.derecha && teclasPresionadas.arriba || teclasPresionadas.izquierda && teclasPresionadas.arriba) {
		// 	if (teclasPresionadas.derecha && teclasPresionadas.arriba) {
		// 		miPersonaje.generaPosicionArribaDerecha();
		// 	}
		// 	if (teclasPresionadas.izquierda && teclasPresionadas.arriba) {
		// 		miPersonaje.generaPosicionArribaIzquierda();
		// 	}
		// 	// posicionAnimacion = 4;
		// } else {

		if (teclasPresionadas.arriba || teclasPresionadas.abajo || teclasPresionadas.derecha || teclasPresionadas.izquierda){
			if (teclasPresionadas.derecha) {

				miPersonaje.generaPosicionDerecha();
				// posicionAnimacion = 0;

			}
			if (teclasPresionadas.izquierda) {

				miPersonaje.generaPosicionIzquierda();
				// posicionAnimacion = 2;

			}
			if (teclasPresionadas.arriba) {

				miPersonaje.generaPosicionArriba();
				// posicionAnimacion = 3;

			}
			if (teclasPresionadas.abajo) {

				miPersonaje.generaPosicionAbajo();
				// posicionAnimacion = 1;

			}
		} else {
			posicionAnimacion = 0;
		}

		// }
	}

	// ****************************************************************
	// *****   MAIN DEL VIDEOJUEGO                            		 *****
	// ****************************************************************

	function pintarJuego() {

		// borramos el canvas
		ctx.clearRect(0, 0, 1800, 800);

		miEnemigo.pintarPlayer();

		// Pintamos al personaje
		miPersonaje.pintarPlayer();

		if (detectarColision()) {
			clearInterval(id1);
			clearInterval(id2);
		}

		actualizaPosicionPersonaje();

	}

	// FUNCION que devuelve 1 y 2 consecutivamente (para hacer animaciones)

	function abreCierraBoca() {

		posicion = (posicion + 1) % 4;  // Cargará posiciones 0 y 1 del array
	}

	function activaMovimiento(evt) {

		switch (evt.keyCode) {


			// Right arrow.
			case TECLA_DERECHA:
				teclasPresionadas.derecha = true;
				break;
			// Left arrow.
			case TECLA_IZQUIERDA:
				teclasPresionadas.izquierda = true;
				break;
			case TECLA_ABAJO:
				teclasPresionadas.abajo = true;
				break;
			case TECLA_ARRIBA:
				teclasPresionadas.arriba = true;
				break;

			case TECLA_ESPACIO:
				teclasPresionadas.espacio = true;
				break;

			case TECLA_T:
				teclasPresionadas.letraT = true;
				break;


		}
	}

	function desactivaMovimiento(evt) {

		switch (evt.keyCode) {


			// Right arrow 
			case TECLA_DERECHA:
				teclasPresionadas.derecha = false;
				break;
			// Left arrow.
			case TECLA_IZQUIERDA:
				teclasPresionadas.izquierda = false;
				break;
			case TECLA_ABAJO:
				teclasPresionadas.abajo = false;
				break;
			case TECLA_ARRIBA:
				teclasPresionadas.arriba = false;
				break;

			case TECLA_ESPACIO:
				teclasPresionadas.espacio = false;
				break;

			case TECLA_T:
				teclasPresionadas.letraT = false;
				break;

		}

	}

	document.addEventListener("keydown", activaMovimiento, false);
	document.addEventListener("keyup", desactivaMovimiento, false);

	// localizamos el canvas
	canvas = document.getElementById("miCanvas");

	// Generamos el contexto de trabajo
	ctx = canvas.getContext("2d");
	
	miPersonaje = new Personaje(x, y, skinPersonaje, arrayAnimacionPersonaje);
	miEnemigo = new Personaje(enemigo_x, enemigo_y, skinEnemigo, arrayAnimacionEnemigo);

	imagen = new Image();
	imagen.src = skinPersonaje.url;
	miPersonaje.imagen = imagen;
	imagen2 = new Image();
	imagen2.src = skinEnemigo.url;
	miEnemigo.imagen = imagen2;


	// Lanzamos la animación PRINCIPAL
	id1 = setInterval(pintarJuego, 1000 / 60);

	// Animación encargada de abrir y cerra la boca
	id2 = setInterval(abreCierraBoca, 1000/8);


}


