# Ideas para versión 2

- Coger todo el código actual y dejarlo en una carpeta para que quede constancia que eso es la versión 1.0 de Gypsy Pocket-Knive Rumble

Buscar librerías para mejorar la calidad del juego.

- En vez de que cada acción mueva al personaje en el eje X; que antes de pintarse se haga un recuento de la variable x y se pinte con ese valor; pj:(ejemplo con el personaje1) le pegan un puñetazo: variable_desplazamiento -= 10, se mueve hacia delante: variable_desplazamiento += 3 --> x += variable_desplazamiento
    De forma que hace que no se mueva hacia una posición del ejeX y de pronto a otro de la nada y resultando falso.

- Modularizar todo, es decir, que el código sea extremadamente fácil de modificar.
- Pintar ambos personajes con suficiente margen de forma que siempre pintas el mismo cuadrado. (hay que calcular el width y el height de todas las animaciones y quedarse con los mas grandes, de forma que cuando se pinte una animación no se tenga que desplazar la posición de pintura en el ejeX ni en el ejeY)

- Intentar añadirle un menú para seleccionar distintos personajes
- Añadir todas las animaciones.