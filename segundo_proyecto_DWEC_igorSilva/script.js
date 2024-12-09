"use strict";

let datos = "";
let celdaResaltada = null;
let dado;

let tablaBloqueada = true;
let posicionHeroe = { id: 1, linea: 1 };
let numeroTiradas = 0;

function iniciarJuego() {
    crearFormulario(); // Crear formulario para validar el nombre
    crearBotonJugar(); // Crear el botón "JUGAR"
    cargarTiradas(); // Carga el record de Tiradas
}

function crearBotonJugar() {
    let botonJugar = document.createElement("button");
    botonJugar.id = "botonJugar";
    botonJugar.innerHTML = "JUGAR";
    botonJugar.disabled = true; // Deshabilitar botón al inicio
    document.body.appendChild(botonJugar);
    
    // Evento al hacer clic en el botón "JUGAR"
    botonJugar.addEventListener("click", () => {
        if (!tablaBloqueada) {
            tirarDado();    // Si la tabla no está bloqueada, tirar el dado
        } else {
            generarTablero();   // Si está bloqueada, crear la tabla
            cargarListenerTd();
        }
    });
}

function generarTablero() {
    datos = `<table border=1px id='miTabla'>`;

    //generar las filas y celdas de la tabla
    for (let i = 1; i < 11; i++) {
        datos += `<tr id=${i}>`;

        for (let j = 1; j < 11; j++) {
            if (i === 10 && j === 10) { // Celda específica (10, 10) para el cofre del tesoro
                datos += `<td id=${j}-${i} height=30px width=30px><img src="./cofre.jpg" style="width: 30px; height: 30px;"></td>`;
            } else {
                datos += `<td id=${j}-${i} height=30px width=30px></td>`;
            }
        }
        datos += `</tr>`;
    }
    // establecer el fondo del div que contiene la tabla
    document.getElementById("div1").style.backgroundImage = "url('./mapa.png')";
    document.getElementById("div1").style.backgroundSize = "700px";
    document.getElementById("div1").style.backgroundRepeat = "no-repeat";
    document.getElementById("div1").style.backgroundPosition = "left";
    document.getElementById("div1").style.padding = "20px";

    // cierre e inserción de la tabla en el div
    datos += `</table>`;
    document.getElementById("div1").innerHTML = datos;
    alert("tienes que llevar al mago topo Gro-goroth hasta el tesoro enterrado en la esquina inferior derecha");

    mostrarDadoYBoton(); // Mostrar el dado y el botón "TIRAR DADO"

    // Ocultar el botón "CREAR TABLA"
    document.getElementById("botonJugar").style.display = "none";
}
function cargarListenerTd() {
    let mistd = document.getElementsByTagName("td");
    for (let i = 0; i < mistd.length; i++) {
        mistd[i].addEventListener("click", () => {  //evento click a cada celda
            if (!tablaBloqueada) {
                // Obtener la posición de la celda seleccionada
                let id = parseInt(mistd[i].id.split("-")[0]);
                let linea = parseInt(mistd[i].id.split("-")[1]);

                // Verificar si la celda está en las celdas resaltadas
                if (esCeldaResaltada(id, linea) && mistd[i].style.backgroundColor === "red") {
                    // Si la celda clicada no es la misma que la anterior, la marcamos
                    if (celdaResaltada !== mistd[i]) {
                        if (celdaResaltada !== null) {
                            celdaResaltada.style.backgroundColor = "transparent";// se limpia la celda anterior
                        }
                        mistd[i].style.background = "url('./mrtopo3.png') center/cover"; //se marca la celda ocupada
                        celdaResaltada = mistd[i]; // se obtiene la posición de la celda seleccionada

                        // Obtener la posición de la celda seleccionada
                        let id = parseInt(mistd[i].id.split("-")[0]);
                        let linea = parseInt(mistd[i].id.split("-")[1]);
                        moverHeroe(id, linea); //mover el heroe a la nueva celda
                    }
                }
            }
        });
    }
}

function esCeldaResaltada(id, linea) {
    let celdasMovimiento = calcularCeldasMovimiento(); //se obtiene las celdas a las que se puede mover
    for (let celda of celdasMovimiento) {
        if (celda.id === id && celda.linea === linea) {
            return true; //la celda esta resaltada
        }
    }
    return false;// la celda no esta resaltada
}

function tirarDado() {
    // Generar un número aleatorio entre 1 y 6 (incluido)
    dado = Math.floor((Math.random() * 6) + 1);
    document.getElementById("dadoImg").src = `./dado/dado${dado}.png`; // Ajusta la ruta de la imagen según sea necesario

    // Incrementar el contador de tiradas
    numeroTiradas++;
    
    // Guardar el número de tiradas en localStorage
    localStorage.setItem('numeroTiradas', numeroTiradas);

    // Mostrar el contador actualizado en el elemento HTML
    document.getElementById("numeroTiradas").innerHTML = "Tiradas: " + numeroTiradas;

    // Verificar si estás en una celda especial y has sacado un 6
    if (esCeldaEspecial() && dado === 6) {
        tablaBloqueada = true;
        alert("Estás en una celda especial y has sacado un 6. Vuelve a tirar el dado.");
        return; // Salir de la función sin continuar con el movimiento
    }

    // Desbloquear la tabla para permitir el movimiento si no estás en una celda especial y no sacaste un 6
    tablaBloqueada = false;

    // Marcar las celdas a las que se puede mover
    marcarCeldasMover();
}

function cargarTiradas() {
    // Cargar el nombre del usuario desde localStorage
    const nombreUsuarioGuardado = localStorage.getItem('nombreUsuario');
    const tiradasGuardadas = localStorage.getItem('numeroTiradas');

    if (nombreUsuarioGuardado) {
        // Si el nombre del usuario ya existe, reiniciar el contador de tiradas
        numeroTiradas = 0; // Reiniciar el contador a cero
        document.getElementById("numeroTiradas").innerHTML = "Tiradas: " + numeroTiradas;
    } else {
        // Si no hay tiradas guardadas, inicializar a 0
        numeroTiradas = 0; 
    }
}

function esCeldaEspecial() {
    // Lista de celdas especiales (5,5 6,5 5,6 6,6)
    const celdasEspeciales = [
        { id: 5, linea: 5 },
        { id: 6, linea: 5 },
        { id: 5, linea: 6 },
        { id: 6, linea: 6 }
    ];

    for (let celda of celdasEspeciales) {
        if (posicionHeroe.id === celda.id && posicionHeroe.linea === celda.linea) {
            return true; // la celda es especial
        }
    }
    return false; //la celda no es especial
}

function marcarCeldasMover() {
    // Limpiar celdas anteriores
    limpiarCeldas();

    // Calcular las celdas a las que se puede mover
    let celdasMovimiento = calcularCeldasMovimiento();

    // Marcar las celdas a las que se puede mover
    for (let celda of celdasMovimiento) {
        let celdaElement = document.getElementById(`${celda.id}-${celda.linea}`);
        if (celdaElement) {
            celdaElement.style.backgroundColor = "red";// resaltar la celda
        }
    }
}

function limpiarCeldas() {
    let mistd = document.getElementsByTagName("td"); //obtener todas las celdas
    for (let i = 0; i < mistd.length; i++) {
        mistd[i].style.background = "transparent"; //limpiar el fondo de cada celda individual
    }
}

function calcularCeldasMovimiento() {
    let movimientosPosibles = []; //array de movimientos posibles

    // Mover hacia la derecha
    if (posicionHeroe.id + dado <= 10) {
        movimientosPosibles.push({ id: posicionHeroe.id + dado, linea: posicionHeroe.linea });
    }

    // Mover hacia la izquierda
    if (posicionHeroe.id - dado >= 1) {
        movimientosPosibles.push({ id: posicionHeroe.id - dado, linea: posicionHeroe.linea });
    }

    // Mover hacia arriba
    if (posicionHeroe.linea - dado >= 1) {
        movimientosPosibles.push({ id: posicionHeroe.id, linea: posicionHeroe.linea - dado });
    }

    // Mover hacia abajo
    if (posicionHeroe.linea + dado <= 10) {
        movimientosPosibles.push({ id: posicionHeroe.id, linea: posicionHeroe.linea + dado });
    }

    return movimientosPosibles;
}

function moverHeroe(id, linea) {
    // Actualizar la posición del jugador
    posicionHeroe.id = id;
    posicionHeroe.linea = linea;

    // Comprobar si el jugador ha llegado al final
    if (id === 10 && linea === 10) {
        // Obtener el récord de tiradas
        const recordTiradas = localStorage.getItem('recordTiradas') || Infinity;

        // Comparar y actualizar el récord si es necesario
        if (numeroTiradas < recordTiradas) {
            localStorage.setItem('recordTiradas', numeroTiradas);
            alert(`¡Has llegado al final! GRO-GOROTH HA ENCONTRADO EL TESORO. Has establecido un nuevo récord de ${numeroTiradas} tiradas!`);
        } else {
            alert(`¡Has llegado al final! GRO-GOROTH HA ENCONTRADO EL TESORO. Has utilizado ${numeroTiradas} tiradas. El récord es ${recordTiradas} tiradas.`);
        }

        reiniciarJuego();
    } else {
        // Bloquear la tabla y esperar a que se tire el dado
        tablaBloqueada = true;
    }
}
function reiniciarJuego() {
    // Reiniciar variables
    posicionHeroe = { id: 1, linea: 1 };
    tablaBloqueada = true;
    limpiarCeldas();

    // Restaurar la imagen del dado a la original
    document.getElementById("dadoImg").src = "./dado/dado1.png"; 

    // Reiniciar el contador de tiradas en localStorage
    localStorage.setItem('numeroTiradas', 0); // Reiniciar el contador a cero
}
function crearDiv() {
    let miDiv = document.createElement("div");
    let miBoton = document.createElement("button");
    let miParrafo = document.createElement("p");

    miDiv.id = "div3";
    miBoton.id = "boton2";
    miParrafo.id = "parrafo";
    miBoton.innerHTML = "TIRAR DADO";
    miBoton.style = "background-color: green; height: auto; margin-top: 10px";

    miDiv.appendChild(miBoton);
    miDiv.appendChild(miParrafo);
    document.getElementsByTagName("body")[0].appendChild(miDiv);

    miBoton.addEventListener("click", () => { // Evento al hacer clic en el botón "TIRAR DADO"
        tirarDado();
    });
}

function crearFormulario() {

    // Crear el formulario
    let formulario = document.createElement("form");
    formulario.id = "formularioUsuario";

    // Crear el input para el nombre de usuario
    let inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.id = "nombreUsuario";
    inputNombre.placeholder = "Introduce tu nombre";

    // Crear el botón de enviar
    let botonEnviar = document.createElement("button");
    botonEnviar.type = "button";
    botonEnviar.id = "botonEnviar";
    botonEnviar.innerHTML = "Enviar";

    // Crear el párrafo para mostrar el mensaje de bienvenida
    let parrafoBienvenida = document.createElement("p");
    parrafoBienvenida.id = "parrafoBienvenida";

    // Añadir eventos al botón de enviar
    botonEnviar.addEventListener("click", () => {
        let nombreUsuario = inputNombre.value;

        // Validar si el nombre de usuario es válido
        if (nombreUsuario.trim() !== "") {
            if (nombreUsuario.length < 4 || /\d/.test(nombreUsuario)) {
                alert("El nombre es incorrecto. Debe tener al menos 4 caracteres y no contener números.");
            } else {
                // Guardar el nombre del usuario en localStorage
                localStorage.setItem('nombreUsuario', nombreUsuario);

                // Mostrar el mensaje de bienvenida
                parrafoBienvenida.innerHTML = `A luchar Heroe ${nombreUsuario}, tienes que ayudar al señor Gro Goroth a escapar`;

                // Habilitar el botón "Crear Tabla"
                document.getElementById("botonJugar").disabled = false;

                // Eliminar el formulario y el botón de enviar después de la validación
                formulario.remove();
                botonEnviar.remove();

                // Eliminar el input de nombre
                inputNombre.remove();

                // Eliminar el párrafo de bienvenida después de mostrarlo
                document.body.appendChild(parrafoBienvenida);
            }
        } else {
            parrafoBienvenida.innerHTML = "Por favor, introduce tu nombre.";
            document.body.appendChild(parrafoBienvenida);
        }
    });

    // Añadir elementos al formulario
    formulario.appendChild(inputNombre);
    formulario.appendChild(botonEnviar);

    // Añadir el formulario al cuerpo del documento
    document.body.appendChild(formulario);
}

function mostrarDadoYBoton() {
    // Crear el contador de tiradas
    let contadorElement = document.createElement("p");
    contadorElement.id = "numeroTiradas";
    contadorElement.innerHTML = "Tiradas: 0";

    // Crear el dado físico
    let dadoImg = document.createElement("img");
    dadoImg.id = "dadoImg";
    dadoImg.src = "./dado/dado1.png";
    dadoImg.style.width = "50px";

    // Crear el botón "TIRAR DADO"
    let botonTirarDado = document.createElement("button");
    botonTirarDado.id = "botonTirarDado";
    botonTirarDado.innerHTML = "TIRAR DADO";
    botonTirarDado.style = "background-color: green; height: auto; margin-top: 10px";

    // Agregar evento al botón "TIRAR DADO"
    botonTirarDado.addEventListener("click", () => {
        tirarDado();
    });

    // Crear un contenedor para el dado, el botón y el contador
    let divDado = document.createElement("div");
    divDado.id = "divDado";
    divDado.appendChild(contadorElement);
    divDado.appendChild(dadoImg);
    divDado.appendChild(botonTirarDado);

    // Añadir el contenedor al cuerpo del documento
    document.body.appendChild(divDado);
}

window.onload = iniciarJuego;