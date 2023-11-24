
// //código de las teclas
// const TECLA_R = 82;

// //DISPARADOR TECLADO
// document.addEventListener('keydown', function(tecla)){
//     let codigoTecla = tecla.keyCode;
//     console.log()
// }

function detectarCombinacionTeclas(teclas, tiempoLimite) {
    let teclasPresionadas = [];
    let tiempoInicio;
  
    function reiniciar() {
      teclasPresionadas = [];
      tiempoInicio = undefined;
    }
  
    window.addEventListener('keydown', function(event) {
      const teclaPresionada = event.key.toLowerCase();
      
      if (!tiempoInicio) {
        tiempoInicio = new Date().getTime();
      }
  
      teclasPresionadas.push(teclaPresionada);
  
      // Verificar si la combinación actual coincide con la combinación deseada
      if (teclasPresionadas.join('+') === teclas.join('+')) {
        console.log('¡Combinación de teclas detectada!');
        reiniciar();
      }
  
      // Verificar si se excede el tiempo límite
      if (new Date().getTime() - tiempoInicio > tiempoLimite) {
        reiniciar();
      }
    });
  }
  
  // Ejemplo de uso: Detectar la combinación "Ctrl + Alt + T" en un plazo de 5 segundos
  detectarCombinacionTeclas(['r', 'r'], 500);
  