window.onload = function(){

  // Alumno con el que hacemos la prueba
  const ALUMNO_CONCRETO = 'Daniel Rodriguez';

  // Necesito un filter() para solo mostrar los proyectos que cumplan la condición indicada:

  function filtrarProyectosPorAlumno(value){
    // Devuelve true si el ALUMNO_CONCRETO pertenece al array participantes
    return value.participantes.indexOf(ALUMNO_CONCRETO) !== -1;
  }

  // Array generado
  const arrayDatosProyectos = proyectos.filter(filtrarProyectosPorAlumno);

  console.log("Datos iniciales");
	console.table(proyectos);
	
	console.log("Datos de los proyectos en los que ha estado " + ALUMNO_CONCRETO);
	console.table(arrayDatosProyectos);

  
}