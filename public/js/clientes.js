const host = "http://localhost:8000";

window.addEventListener("load", function (event) {
  fetch(`${host}/clientes`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      const containerDiv = document.getElementById("listado-clientes");
      containerDiv.innerHTML = "<ul>";
      for (let i = 0; i < json.length; i++) {
        containerDiv.innerHTML += `<li><b>${json[i].razon_social}</b> </li><button onClick ="listadoClick(${json[i].id})">+ info</button>`;
      }

      containerDiv.innerHTML += "</ul>";

      if (json[0].razon_social == "onclick") {
        containerDiv.innerHTML += `<li>${json[0]}</li>`;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

function listadoClick(id) {
  fetch(`${host}/clientes/${id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const containerDiv = document.getElementById("listado-clientes");
      containerDiv.innerHTML = `<h2>Bienvenidos a  <b>${json[0].razon_social}</b> </h2><br><li>${json[0].razon_social} / ${json[0].cif} / ${json[0].sector} / ${json[0].telefono} / ${json[0].numero_empleados} </li></br><button onClick ="volverClick()">regresar</button> `;
      console.log(json);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function volverClick() {
  window.location.href = "http://localhost:8000/html/clientes.html";
}

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


function modificarClientes() {
  const razon_social = document.getElementById("razon_social").value;
  const cif = document.getElementById("cif").value;
  const sector = document.getElementById("sector").value;
  const telefono = document.getElementById("telefono").value;
  const numero_empleados = document.getElementById("numero_empleados").value;

  console.log(razon_social, cif, sector, telefono, numero_empleados);

  fetch(`${host}/clientes/:id`, {
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
