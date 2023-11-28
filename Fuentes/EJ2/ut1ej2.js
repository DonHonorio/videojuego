window.onload = function(){

  // No entiendo mucho este ejercicio, ya que te pide que sea de un alumno concreto.
  // Si el objeto reconocimientosAlumno fuese un array con distintos alumnos, te haría una
  // funcion de array filter() en el que te seleccionase los distintos reconocimientos de un alumno concreto.

  function ordenarPorFechaDescendente(usuario1, usuario2){
    "04/12/2023"
    let anio1 = Number(usuario1.fechaConsecucion.slice(6,10));
    let dia1 = Number(usuario1.fechaConsecucion.slice(0,2));
    let mes1 = Number(usuario1.fechaConsecucion.slice(3,5)-1);
    let anio2 = Number(usuario2.fechaConsecucion.slice(6,10));
    let dia2 = Number(usuario2.fechaConsecucion.slice(0,2));
    let mes2 = Number(usuario2.fechaConsecucion.slice(3,5)-1);
    let u1 = new Date(anio1, mes1, dia1);
    let u2 = new Date(anio2, mes2, dia2);

    if(u1.getTime()>u2.getTime()) return -1;
    else if(u2.getTime()>u1.getTime()) return 1;
    else return 0;
  }

  // Como dice genera, creo un nuevo array, a partir del array del objeto reconocimientoAlumno
  const reconocimientoOrdenado = reconocimientosAlumno.reconocimientos.toSorted(ordenarPorFechaDescendente);

  console.log("Datos reconocimiento de José García");
	console.table(reconocimientosAlumno.reconocimientos);
	
	console.log("Reconocimiento ordenado por la fecha de consecución descendente:");
	console.table(reconocimientoOrdenado);

}

// window.onload = function(){

//   let fecha = new Date();
//   console.log(fecha.getTime());
// }