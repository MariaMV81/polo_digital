const host = "http://localhost:8000";

/**
 * El evento "load" ejecuta el código JS cuando el HTML se carga completamente.
 */

window.addEventListener("load", function (event) {
  fetch(`${host}/mobiliario`) //Se realiza una solicitud al servidor para obtener la información de clientes. Utiliza la función fetch, que devuelve una promesa que resuelve en la respuesta del servidor.
    .then(function (response) {
      // se verifica la respuesta y se convierte a formato JSON.
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      //se trabaja con los datos JSON recibidos.
      const containerDiv = document.getElementById("listado-mobiliario"); // Manipulación del DOM para mostrar la lista de mobiliario: Se obtiene el elemento HTML con el id listado-mobiliario y se modifica su contenido para mostrar una lista de mobilirio y botones asociados.
      containerDiv.innerHTML = "<ul>";
      for (let i = 0; i < json.length; i++) {
          containerDiv.innerHTML += `<li><b>${json[i].nombre}</b> </li><button onClick ="listadoClick(${json[i].id})">+ info</button>`;
        } 
      

      containerDiv.innerHTML += "</ul>";
      /* Se crea una lista (<ul>) y se añade un elemento de lista (<li>) por cada mobiliario, con un botón para mostrar información adicional (+ info).
        Se utiliza el evento onClick en el botón para llamar a la función listadoClick con el id del mobiliario como argumento.*/

      if (json[0].nombre == "onclick") {
        containerDiv.innerHTML += `<li>${json[0]}</li>`;
      }
    })
    .catch(function (error) {
      console.log(error); // Se agrega un bloque catch para manejar errores en caso de que la solicitud al servidor falle.
    });
});

/**
 * FUNCION PARA TRAER TODO EL LISTADO DE CLIENTES------------------------------------------------------------------------------------------------------------------------------------------
 */
function listadoClick(id) {
  fetch(`${host}/mobiliario/${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      console.log("Respuesta del servidor:", json);

      const containerDiv = document.getElementById("listado-mobiliario");

      if (json && json.nombre && json.referencia && json.tipo && json.estado) {
        // Rellenar los campos del formulario de modificar clientes
        document.getElementById("idMobiliarioModificar").value = json.id;
        document.getElementById("nombrem").value = json.nombre;
        document.getElementById("referenciam").value = json.referencia;
        document.getElementById("tipom").value = json.tipo;
        document.getElementById("estadom").value = json.estado;

        // Ocultar el formulario de registro de clientes
        document.getElementById("formulario-registro-mobiliario").hidden = true;

        // Mostrar el formulario de modificar clientes
        document.getElementById(
          "formulario-modificar-mobiliario"
        ).hidden = false;
        containerDiv.innerHTML = `<h2>Modificar Mobiliario: <b>${json.nombre}</b></h2><br><button onclick="volverClick()">regresar</button> `;
        console.log(json);
      } else {
        console.error(`Elemento no válido en la respuesta del servidor`);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function volverClick() {
  window.location.href = "http://localhost:8000/html/mobiliario.html";
}

/**
 * FUNCION REGISTRAR NUEVO MOBILIARIO--------------------------------------------------------------------------------------------------------------------------------------------------
 */

function registroMobiliario() {
  const nombre = document.getElementById("nombre").value;
  const referencia = document.getElementById("referencia").value;
  const tipo = document.getElementById("tipo").value;
  const estado = document.getElementById("estado").value;

  console.log(nombre, referencia, tipo, estado);

  fetch(`${host}/mobiliario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      referencia: referencia,
      tipo: tipo,
      estado: estado,
    }),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      alert(json.message);
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**
 * FUNCION MODIFICAR DATOS DEL CLIENTE----------------------------------------------------------------------------------------------------------------------------------------------------
 */

function modificarMobiliario(id) {
  const nombre = document.getElementById("nombrem").value;
  const referencia = document.getElementById("referenciam").value;
  const tipo = document.getElementById("tipom").value;
  const estado = document.getElementById("estadom").value;

  const idMobiliario = document.getElementById("idMobiliarioModificar").value;
  console.log("ID del mobiliario a modificar:", idMobiliario);

  fetch(`${host}/mobiliario/${idMobiliario}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      referencia: referencia,
      tipo: tipo,
      estado: estado,
    }),
  })
    .then((response) => {
      console.log("Respuesta del servidor:", response);
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((json) => {
      console.log(json);
      alert(json.message);
    })
    .catch((error) => {
      console.error(
        "Se produjo un error durante la modificación del mobiliario:",
        error
      );
    });
}
