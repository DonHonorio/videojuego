window.onload = function () {
  class Personaje {
    constructor() {
      this.inicioAnimacion = null;
      this.duracionAnimacion = 5000; // Duración en milisegundos (5 segundos, por ejemplo)
    }

    iniciarAnimacion() {
      this.inicioAnimacion = performance.now();
      this.animar();
    }

    animar() {
      const tiempoActual = performance.now();
      const tiempoTranscurrido = tiempoActual - this.inicioAnimacion;

      // Calcular el progreso de la animación (valor entre 0 y 1)
      const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacion, 1);

      // Actualizar la animación (código específico de animación aquí)
      this.actualizarAnimacion(progreso);

      if (tiempoTranscurrido < this.duracionAnimacion) {
        // Continuar animación si no ha alcanzado la duración máxima
        requestAnimationFrame(() => this.animar());
      } else {
        // La animación ha terminado, realiza acciones finales si es necesario
        this.finAnimacion();
      }
    }

    actualizarAnimacion(progreso) {
      // Código para actualizar la animación según el progreso
      // Puedes cambiar las propiedades CSS, posición, etc.
      console.log("Progreso de la animación:", progreso);
    }

    finAnimacion() {
      // Acciones finales después de que la animación ha terminado
      console.log("Animación terminada");
    }
  }

  const miPersonaje = new Personaje();
  miPersonaje.iniciarAnimacion();
};

//************************************************************************************** */ //
//************************************************************************************** */ //
//************************************************************************************** */ //

window.onload = function () {
  class Personaje {
    constructor() {
      this.inicioAnimacion = null;
      this.duracionAnimacion = 1000; // Duración de animación milisegundos
      this.duracionAnimacion2 = 500;
      this.animacionEnProgreso = false;
      this.animacionEnProgreso2 = false;

      // Escuchar eventos de teclado
      window.addEventListener("keydown", (event) =>
        this.iniciarAnimacionEspecifica(event)
      );
    }

    iniciarAnimacion() {
      this.animacionEnProgreso = true;
      this.inicioAnimacion = performance.now();
      this.animar();
    }
    iniciarAnimacion2() {
      this.animacionEnProgreso2 = true;
      this.inicioAnimacion = performance.now();
      this.animar2();
    }

    animar() {
      if (this.animacionEnProgreso) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacion;
        const progreso = Math.min(
          tiempoTranscurrido / this.duracionAnimacion,
          1
        );

        // Actualizar la animación (código específico de animación aquí)
        this.actualizarAnimacion(progreso);

        if (tiempoTranscurrido < this.duracionAnimacion) {
          // Continuar animación si no ha alcanzado la duración máxima
          requestAnimationFrame(() => this.animar());
        } else {
          // La animación ha terminado
          this.finAnimacion();
        }
      }
    }
    animar2() {
      if (this.animacionEnProgreso2) {
        const tiempoActual = performance.now();
        const tiempoTranscurrido = tiempoActual - this.inicioAnimacion;
        const progreso = Math.min(
          tiempoTranscurrido / this.duracionAnimacion,
          1
        );

        // Actualizar la animación (código específico de animación aquí)
        this.actualizarAnimacion2(progreso);
        // console.log('ANIMACIÓN 2');

        if (tiempoTranscurrido < this.duracionAnimacion) {
          // Continuar animación si no ha alcanzado la duración máxima
          requestAnimationFrame(() => this.animar2());
        } else {
          // La animación ha terminado
          this.finAnimacion2();
        }
      }
    }

    actualizarAnimacion(progreso) {
      // Código para actualizar la animación según el progreso
      // Puedes cambiar las propiedades CSS, posición, etc.
      console.log("Progreso de la animación principal:", progreso);
    }
    actualizarAnimacion2(progreso) {
      // Código para actualizar la animación según el progreso
      // Puedes cambiar las propiedades CSS, posición, etc.
      console.log("Progreso de la ANIMACIÓN 2:", progreso);
    }

    finAnimacion() {
      // Acciones finales después de que la animación ha terminado
      console.log("Animación principal terminada");
      this.animacionEnProgreso = false;
    }
    finAnimacion2() {
      // Acciones finales después de que la animación ha terminado
      console.log("ANIMACIÓN 2 terminada");
      this.animacionEnProgreso2 = false;
    }

    cancelarTodasAnimaciones() {
      this.animacionEnProgreso = false;
      this.animacionEnProgreso2 = false;
    }

    iniciarAnimacionEspecifica(event) {
      // Verificar si se presiona una tecla específica (por ejemplo, la tecla "a")
      if (event.key === "a" && !this.animacionEnProgreso) {
        this.cancelarTodasAnimaciones();
        console.log('Tecla "a" presionada. Iniciando animación específica.');

        // Puedes realizar acciones adicionales antes de iniciar la animación específica

        // Iniciar animación específica
        this.iniciarAnimacion();

        // this.iniciarAnimacionEspecificaInternal();
      }
      if (event.key === "b" && !this.animacionEnProgreso2) {
        this.cancelarTodasAnimaciones();
        this.iniciarAnimacion2();
      }
    }

    iniciarAnimacionEspecificaInternal() {
      // Realiza acciones adicionales antes de iniciar la animación específica
      console.log("Animación específica iniciada");

      // Iniciar la animación específica (puedes ajustar la duración según tus necesidades)
      setTimeout(() => {
        console.log("Animación específica terminada");
      }, 3000);
    }
  }

  const miPersonaje = new Personaje();
};

// //************************************************************************************** */ //
// //************************************************************************************** */ //
// //************************************************************************************** */ //

// window.onload = function(){
//   class Personaje {
//     constructor() {
//       this.inicioAnimacion = null;
//       this.duracionAnimacion = 5000; // Duración en milisegundos (5 segundos, por ejemplo)
//       this.animacionEnProgreso = false;

//       // Escuchar eventos de teclado
//       window.addEventListener('keydown', (event) => this.iniciarAnimacionEspecifica(event));
//     }

//     iniciarAnimacion() {
//       this.animacionEnProgreso = true;
//       this.inicioAnimacion = performance.now();
//       this.animar();
//     }

//     animar() {
//       if (this.animacionEnProgreso) {
//         const tiempoActual = performance.now();
//         const tiempoTranscurrido = tiempoActual - this.inicioAnimacion;
//         const progreso = Math.min(tiempoTranscurrido / this.duracionAnimacion, 1);

//         // Actualizar la animación (código específico de animación aquí)
//         this.actualizarAnimacion(progreso);

//         if (tiempoTranscurrido < this.duracionAnimacion) {
//           // Continuar animación si no ha alcanzado la duración máxima
//           requestAnimationFrame(() => this.animar());
//         } else {
//           // La animación ha terminado
//           this.finAnimacion();
//         }
//       }
//     }

//     actualizarAnimacion(progreso) {
//       // Código para actualizar la animación según el progreso
//       // Puedes cambiar las propiedades CSS, posición, etc.
//       console.log('Progreso de la animación principal:', progreso);
//     }

//     finAnimacion() {
//       // Acciones finales después de que la animación ha terminado
//       console.log('Animación principal terminada');
//       this.animacionEnProgreso = false;
//     }

//     iniciarAnimacionEspecifica(event) {
//       // Verificar si se presiona una tecla específica (por ejemplo, la tecla "a")
//       if (event.key === 'a' && this.animacionEnProgreso) {
//         console.log('Tecla "a" presionada. Deteniendo animación principal e iniciando animación específica.');

//         // Detener la animación principal
//         this.animacionEnProgreso = false;

//         // Iniciar animación específica
//         this.iniciarAnimacionEspecificaInternal();
//       }
//     }

//     iniciarAnimacionEspecificaInternal() {
//       // Realiza acciones adicionales antes de iniciar la animación específica
//       console.log('Animación específica iniciada');

//       // Puedes ajustar la duración y el código de la animación específica según tus necesidades
//       setTimeout(() => {
//         console.log('Animación específica terminada. Continuando con la animación principal.');
//         // Continuar con la animación principal
//         this.animacionEnProgreso = true;
//         this.iniciarAnimacion();
//       }, 3000);
//     }
//   }

//   const miPersonaje = new Personaje();
//   miPersonaje.iniciarAnimacion();

// }

// Comprobar la tasa de fotogramas por segundo (FPS)
window.onload = function () {
  let frameCount = 0;
  let startTime = null;

  function calculateFPS(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    frameCount++;

    if (elapsed >= 1000) {
      const fps = frameCount / (elapsed / 1000);
      console.log(`Tasa de refresco: ${fps.toFixed(2)} FPS`);
      frameCount = 0;
      startTime = timestamp;
    }

    window.requestAnimationFrame(calculateFPS);
  }

  window.requestAnimationFrame(calculateFPS);
};
