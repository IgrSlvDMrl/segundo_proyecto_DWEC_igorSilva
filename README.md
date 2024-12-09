# segundo_proyecto_DWEC_igorSilva
el objetivo de este programa es un juego de tablero implementado como una SPA

funcionamiento:

1.	Inicialización:
Al cargar la página, se ejecuta la función inicio(), que crea un formulario para que el usuario ingrese su nombre, un botón para comenzar el juego y carga el número de tiradas guardadas en el almacenamiento local.
2.	Formulario de Usuario:
Se crea un formulario donde el usuario debe ingresar su nombre. El nombre debe tener al menos 4 caracteres y no puede contener números. Si el nombre es válido, se guarda en el almacenamiento local y se habilita el botón "JUGAR".
3.	Botón "JUGAR":
Al hacer clic en el botón "JUGAR", se crea el tablero de juego (una tabla HTML de 10x10). La celda en la posición (10, 10) contiene una imagen del tesoro. También se muestra un mensaje de bienvenida y se oculta el botón "JUGAR".
4.	Tirar el Dado:
Se muestra un botón "TIRAR DADO" y un contador de tiradas. Al hacer clic en este botón, se genera un número aleatorio entre 1 y 6 (simulando el lanzamiento de un dado) y se actualiza el contador de tiradas. Si el jugador está en una celda especial y saca un 6, debe volver a tirar el dado.
5.	Movimiento del Jugador:
Después de tirar el dado, se calculan las celdas a las que el jugador puede moverse (hasta 4 celdas en cualquier dirección, dependiendo del número obtenido en el dado). Estas celdas se resaltan en rojo. El jugador puede hacer clic en una celda resaltada para moverse a ella. Si el jugador llega a la celda (10, 10), se verifica si ha establecido un nuevo récord de tiradas y se muestra un mensaje de finalización del juego.
6.	Celdas Especiales:
Hay celdas especiales en el tablero (5,5), (6,5), (5,6) y (6,6). Si el jugador cae en una de estas celdas y saca un 6, debe volver a tirar el dado.
7.	Reinicio del Juego:
Al llegar al tesoro, el juego se reinicia, restableciendo la posición del jugador.
8.	Almacenamiento Local:
El programa utiliza localStorage para guardar el nombre del usuario y el número de tiradas, permitiendo que la información persista entre sesiones.
