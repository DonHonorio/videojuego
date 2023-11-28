window.onload = function(){

  // Aquí ordeno por la fecha de Consecución

  function ordenaReconocimientoPorFecha(usuario1, usuario2){
    "04/12/2023"
    let anio1 = Number(usuario1.fechaReconocimiento.slice(6,10));
    let dia1 = Number(usuario1.fechaReconocimiento.slice(0,2));
    let mes1 = Number(usuario1.fechaReconocimiento.slice(3,5)-1);
    let anio2 = Number(usuario2.fechaReconocimiento.slice(6,10));
    let dia2 = Number(usuario2.fechaReconocimiento.slice(0,2));
    let mes2 = Number(usuario2.fechaReconocimiento.slice(3,5)-1);
    let u1 = new Date(anio1, mes1, dia1);
    let u2 = new Date(anio2, mes2, dia2);

    if(u2.getTime()>u1.getTime()) return -1;
    else if(u1.getTime()>u2.getTime()) return 1;
    else return 0;
  }

  // Creo una funcion map() que devuelve por cada objeto del array alumnosReconocidos los atributos que nos pide en el ejercicio.
  function myMapFunction(value, index, array){
    let valorDevolver = {
      nombre: value.nombre,
      numeroAlumnos: value.alumnos.length
    }
    
    return valorDevolver;
  }

  // Genero el array que pide el ejercicio, primero lo ordeno y luego le aplico un map para sacar lo que quiero de cada objeto
  const arrayOrdenado = alumnosReconocidos.toSorted(ordenaReconocimientoPorFecha).map(myMapFunction);

  console.log("Datos iniciales");
	console.table(alumnosReconocidos);
	
	console.log("Array con el nombre de reconocimiento, total alumnos y ordenado");
	console.table(arrayOrdenado);
}