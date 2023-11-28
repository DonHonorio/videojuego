window.onload = function(){

  // Como dice genera, hay que crear un array nuevo a partir de proyectos
  
  function ordenarDescendePorTutor(usuario1, usuario2){
    let u1 = usuario1.tutor.toLowerCase();
    let u2 = usuario2.tutor.toLowerCase();

    if(u1>u2) return -1;
    else if(u2>u1) return 1;
    else return 0;
  }

  // El array lo dejo constante ya que lo que se modifica son sus elementos internos pero no él
  const proyectosOrdenado = proyectos.toSorted(ordenarDescendePorTutor);

  console.log("Datos iniciales");
	console.table(proyectos);
	
	console.log("Datos ordenados por TUTOR");
	console.table(proyectosOrdenado);
}