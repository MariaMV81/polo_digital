const host = "http://localhost:8000";

function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email,password);

    fetch(`${host}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: email, password: password})
    }).then(function(response){
        return response.json()
    }).then (function(json){
        console.log(json);

        alert(json.message);

        if (json.message === "Usuario logueado") {
          window.location.href = "/index.html";
        }
    }).catch(function(error){
        console.log(error);
    })
}

function registro() {
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const dni = document.getElementById("dni").value;
  const razon_social = document.getElementById("razon_social").value;
  const email = document.getElementById("emailr").value;
  const password = document.getElementById("passwordr").value;
  const repetirPassword = document.getElementById("passwordrr").value;
  console.log(nombre, apellidos, dni, razon_social, email, password);
 
   if (password !== repetirPassword) {
     alert("Las contraseñas no coinciden" );
   } else {
     alert("Usuario registrado correctamente");
   

  fetch(`${host}/registro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      apellidos: apellidos,
      dni: dni,
      razon_social: razon_social,
      email: email,
      password: password,
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
}