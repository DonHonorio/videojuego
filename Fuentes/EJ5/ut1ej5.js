window.onload = function(){

  // Tutor concreto:
  const TUTOR_CONCRETO = 'Víctor';

  // Primero filtramos que proyectos son del tutor concreto
  function filtrarProyectosPorTutor(value){
    return value.tutor === TUTOR_CONCRETO;
  }

  function contarCuantosProyectos(total, value){
    return total +1;
  }

  // Nuevo array generado
  const numeroProyectosTutorizados = [];

  // Le añadimos el tutor
  numeroProyectosTutorizados.push(TUTOR_CONCRETO);

  // Y luego el numero de proyectos
  let numeroProyectos = proyectos.filter(filtrarProyectosPorTutor).reduce(contarCuantosProyectos, 0);
  numeroProyectosTutorizados.push(numeroProyectos); 

  console.log("Datos iniciales");
	console.table(proyectos);
	
	console.log("Número de proyectos que ha tutorizado " + TUTOR_CONCRETO);
	console.table(numeroProyectosTutorizados);

}