window.onload = function() { 

	function ordenarPorNombre(usuario1, usuario2)  {	
		
	  let c1 = usuario1.toLowerCase();
		let c2 = usuario2.toLowerCase();

		if (c1>c2) return 1;
		else if (c1<c2) return -1;
		else return 0;    
	}	

	console.log("Datos iniciales");
	console.table(usuarios);
	
	console.log("Datos ordenados por NOMBRE");
	console.table(usuarios.sort(ordenarPorNombre));
	
	
}