const host = "http://localhost:8000"; //se establece la URL base del sevidor al que se realizarán las solicitudes

/**
 * El evento "load" ejecuta el código JS cuando el HTML se carga completamente.
 */

window.addEventListener("load", function (event) {
  fetch(`${host}/clientes`) //Se realiza una solicitud al servidor para obtener la información de clientes. Utiliza la función fetch, que devuelve una promesa que resuelve en la respuesta del servidor.
    .then(function (response) {
      // se verifica la respuesta y se convierte a formato JSON.
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      //se trabaja con los datos JSON recibidos.
      const containerDiv = document.getElementById("listado-clientes"); // Manipulación del DOM para mostrar la lista de clientes: Se obtiene el elemento HTML con el id listado-clientes y se modifica su contenido para mostrar una lista de clientes y botones asociados.
      containerDiv.innerHTML = "<ul>";
      for (let i = 0; i < json.length; i++) {
        containerDiv.innerHTML += `<li><b>${json[i].razon_social}</b> </li><button onClick ="listadoClick(${json[i].id})">+ info</button>`;
      }

      containerDiv.innerHTML += "</ul>";
     /* Se crea una lista (<ul>) y se añade un elemento de lista (<li>) por cada cliente, con un botón para mostrar información adicional (+ info).
        Se utiliza el evento onClick en el botón para llamar a la función listadoClick con el id del cliente como argumento.*/

      if (json[0].razon_social == "onclick") {
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
  fetch(`${host}/clientes/${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerDiv = document.getElementById("listado-clientes");

      // Rellenar los campos del formulario de modificar clientes
      document.getElementById("idClienteModificar").value = json[0].id;
      document.getElementById("razon_socialm").value = json[0].razon_social;
      document.getElementById("cifm").value = json[0].cif;
      document.getElementById("sectorm").value = json[0].sector;
      document.getElementById("telefonom").value = json[0].telefono;
      document.getElementById("numero_empleadosm").value =
        json[0].numero_empleados;

      // Ocultar el formulario de registro de clientes
      document.getElementById("formulario-registro-clientes").hidden = true;

      // Mostrar el formulario de modificar clientes
      document.getElementById("formulario-modificar-clientes").hidden = false;
      containerDiv.innerHTML = `<h2>Modificar Cliente: <b>${json[0].razon_social}</b></h2><br><button onclick="volverClick()">regresar</button> `;
      console.log(json);
      
   
    })
    .catch(function (error) {
      console.log(error);
    });
}

function volverClick() {
  window.location.href = "http://localhost:8000/html/clientes.html";
}



/**
 * FUNCION REGISTRAR NUEVO CLIENTE--------------------------------------------------------------------------------------------------------------------------------------------------
 */

function registroClientes() {

  const razon_social = document.getElementById("razon_social").value;
  const cif = document.getElementById("cif").value;
  const sector = document.getElementById("sector").value;
  const telefono = document.getElementById("telefono").value;
  const numero_empleados = document.getElementById("numero_empleados").value;
  


  console.log(razon_social, cif, sector, telefono, numero_empleados);

  fetch(`${host}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razon_social: razon_social,
      cif: cif,
      sector: sector,
      telefono: telefono,
      numero_empleados: numero_empleados,
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

function modificarClientes(id) {


  const razon_social = document.getElementById("razon_socialm").value;
  const cif = document.getElementById("cifm").value;
  const sector = document.getElementById("sectorm").value;
  const telefono = document.getElementById("telefonom").value;
  const numero_empleados = document.getElementById("numero_empleadosm").value;

   const idCliente = document.getElementById("idClienteModificar").value;
   console.log("ID del cliente a modificar:", idCliente);


   fetch(`${host}/clientes/${idCliente}`, {
     method: "POST", 
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       razon_social: razon_social,
       cif: cif,
       sector: sector,
       telefono: telefono,
       numero_empleados: numero_empleados,
       
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
         "Se produjo un error durante la modificación del cliente:",
         error);
     });
}



