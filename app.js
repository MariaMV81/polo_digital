let express = require("express");
let mysql = require("mysql2");
const { message } = require("prompt");
const app = express();

app.use("/",express.static("public"));
app.use(express.json()); //oye que cuando haya body va a ser un json

// crear conexion con mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "08886544Mj",
  database: "polo_digital",
});

// conectar con mysql
connection.connect(function (error) {
  if (error) {
    return console.error(`error: ${error.message}`);
  }

  console.log("Conectado a MySQL!!!");
});

/**
 * Funciones utiles ------------------------------------------------------------------------------------
 */

function handleSQLError(response, error, result, callback) {
  if (error) {
    response.status(400).send(`error: ${error.message}`);

    return;
  }

  callback(result);
}
/**
 * Termina Funciones Utiles ----------------------------------------------------------------------------
 */

/**
 * Endpoints para el Index. ----------------------------------------------------------------------------
 */
app.get("/carrusel", function (request, response) {
  connection.query("select * from eventos", function (error, result, fields) {
    handleSQLError(response, error, result, function (result) {
      let total = request.query.total;
      let eventos = [];

      for (let i = 0; i < total; i++) {
        eventos[i] = result[i];
      }

      response.send(eventos);
    });
  });
});

app.get("/evento/:idEvento", function (request, response) {
  const idEvento = request.params.idEvento;

  connection.query(
    `select * from eventos where id = ${idEvento}`,
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        if (result.length == 0) {
          response.send({});
        } else {
          response.send(result[0]);
        }
      });
    }
  );
});

/**
 * Termina Index---------------------------------------------------------------------------------------
 */

/**
 * Endpoints para login y registro ---------------------------------------------------------------------
 * Ejemplo URL: http://localhost:8000/login?email=isare@email.com&password=1234
 */
app.post("/login", function (request, response) {
  const email = request.body.email;
  const password = request.body.password;
  const modoNuevo = `select * from usuarios where email = '${email}' and password = '${password}'`;

  console.log(modoNuevo);

  connection.query(
    "select * from usuarios where email = '" +
      email +
      "' and password = '" +
      password +
      "'",
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        console.log(result);

        if (result.length == 0) {
          response.send({ message: "Email o password no validos" });
        } else {
          response.send({ message: "Usuario logueado" });
        }
      });
    }
  );
});

// 1. insert into usuarios
// 2. select from usuarios
// 3. insert into emplados_clientes con usuarios

app.post("/registro", function (request, response) {
  let nombre = request.body.nombre;
  let apellidos = request.body.apellidos;
  let email = request.body.email;
  let password = request.body.password;
  let clienteID = request.body.clienteID; // Asegúrate de obtener estos valores del cuerpo de la solicitud
  let dni = request.body.dni;
  let telefono = request.body.telefono;

  // 1. Insertar un nuevo usuario en la tabla usuarios
  connection.query(
    `INSERT INTO usuarios (email, password) VALUES ('${email}', '${password}')`,
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al crear el usuario");
        return;
      }

      console.log("Usuario Insertado");

      // 2. Seleccionar desde usuarios el id que hemos creado
      connection.query(
        `SELECT id FROM usuarios WHERE email = '${email}'`,
        function (error, result, fields) {
          if (error) {
            console.error(error);
            response.status(500).send("Error al obtener el ID del usuario");
            return;
          }

          const usuarioid = result[0].id;
x
          // 3. Insertar en la tabla empleados_clientes el id del nuevo usuario creado
          connection.query(
            "INSERT INTO empleados_clientes (nombre, apellidos, usuarioID, clienteID, dni, telefono) VALUES (?, ?, ?, ?, ?, ?)", //? marcador de posicion: especifica los valores que se van a insertar, en lugar de valores concretos
            [nombre, apellidos, usuarioid, clienteID, dni, telefono], //valores reales que se insertaran en esta columna se pasan como array en el segundo argumento de la función y sonn las variables que hemos declarado al principio
            function (error, result, fields) {
              if (error) {
                console.error(error);
                response
                  .status(500)
                  .send(
                    "Error al insertar en la tabla empleados_clientes: " +
                      error.message
                  );
                return;          ghvbv
              }

              console.log("Registro completado");
              response.send({ message: "registro" });
            }
          );
        }
      );
    }
  );
});

/**
 * Termina LOGIN y REGISTRO ---------------------------------------------------------------------------
 */




/**
 * Endpoints para CLIENTES-----------------------------------------------------------------------------
 */


//Realiza una consulta a la base de datos para seleccionar todos los registros de la tabla "clientes". Luego devuelve estos datos en formato
//json como respuesta al cliente que realizó la solicitud.
app.get(`/clientes`, function (request, response) {
  connection.query(`select * from clientes`, function (error, result, sield) {

    let cliente = [];
    for (let i = 0; i < result.length; i++){

      cliente[i] = result[i];
    }

    response.send(cliente);

    if (error) {
      console.error(error);
      response
        .status(500)
        .send("Error al traer la tabla clientes " );
      return;
    }
  });
  console.log("Listado de clientes en base de datos");
});



//Se uliliza para actualizar un cliente existente en la base de datos. Recibe los datos del cliente a través del cuerpo de la solicitud(razon_social...)
//y el ID del cliente a actualizar se extra de los parametros de la url(":id"). Realiza una consulta"UPDATE" en la bbdd para modificar los datos del 
//cliente con el id proporcinado
app.post("/clientes/:id", function (request, response) {
  let razon_social = request.body.razon_social;
  let cif = request.body.cif;
  let sector = request.body.sector;
  let telefono = request.body.telefono;
  let numero_empleados = request.body.numero_empleados;

  const clienteID = request.params.id;

 connection.query(
   "UPDATE clientes SET razon_social = ?, cif = ?, sector = ?, telefono = ?, numero_empleados = ? WHERE id = ?",
   [razon_social, cif, sector, telefono, numero_empleados, clienteID],
   function (error, result, field) {
     if (error) {
       console.error(error);
       response
         .status(500)
         .send(
           "Error al insertar en la tabla empleados_clientes: " + error.message
         );
       return;
     }
     response.send({message:"Actualización de cliente en la base de datos"});
   }
 );
   
  });

//Crea un nuevo cliente en la bbdd. Al igual que el anterior, recibe los datos del cliente en el cuerpo de la solicitud y el ID del cliente a través de clienteID
// Antes de realizar la inserción, verifica si ya existe un cliente con el mismo ID. Si el ID ya está en uso, devuelve un código de estado 400 indicando que ya existe 
//un cliente con ese ID. Si no hay conflictos, realiza la inserción en la base de datos y devuelve un mensaje indicando que el cliente se ha insertado correctamente
app.post("/clientes", function (request, response) {
  const razon_social = request.body.razon_social;
  const cif = request.body.cif;
  const sector = request.body.sector;
  const telefono = request.body.telefono;
  const numero_empleados = request.body.numero_empleados;


  if (
    !razon_social ||
    !cif ||
    !sector ||
    !telefono ||
    !numero_empleados 
  ) {
    return response.status(400).send("Faltan datos obligatorios");
  }

  // Verificar si ya existe un cliente con el mismo ID
  connection.query(
    `SELECT * FROM clientes WHERE razon_social = "${razon_social}"`,
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al buscar el cliente por ID");
        return;
      }

      // Si el cliente con el ID proporcionado ya existe, devolver un mensaje de error
      if (result.length > 0) {
        response.status(400).send("Ya existe un cliente con este ID");
        return;
      }

      // Insertar el nuevo cliente en la base de datos

      connection.query(
        `INSERT INTO clientes (razon_social, cif, sector, telefono, numero_empleados) VALUES ('${razon_social}', '${cif}', '${sector}', '${telefono}', '${numero_empleados}')`,
        function (error, result, fields) {
          if (error) {
            console.error(error);
            response.status(500).send("Error al crear el cliente");
            return;
          }

          console.log("Cliente Insertado");
          response
            .status(200)
            .json({ message: "Cliente insertado correctamente" });
        }
      );
    }
  );
});

//Este endpoint se utiliza para obtener información detallada de un cliente específico. Recibe el ID del cliente a través de los parámetros de la URL (:idClientes),
// realiza una consulta a la base de datos para seleccionar ese cliente en particular y devuelve los datos en formato JSON como respuesta al cliente que realizó la solicitud
/*extra*/
app.get("/clientes/:idClientes", function (request, response) {
  const idClientes = request.params.idClientes; 

  connection.query(
    `SELECT * FROM clientes WHERE id = ${idClientes}`,
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al obtener el cliente");
        return;
      }

      console.log("Datos del cliente con el ID " + idClientes + ":", result);
      response.send(result); // Enviar los datos del cliente al cliente que realiza la solicitud
    }
  );
});
  


/**
 * Termina clientes -----------------------------------------------------------------------------------------------
 */




/**
 * Endpoints mobilirio -----------------------------------------------------------------------------------------------
 */

//Crea un nuevo mobiliario en la bbdd. Al igual que el anterior, recibe los datos del mobiliario en el cuerpo de la solicitud y el ID del mobiliario a través de mobiliarioID
// Antes de realizar la inserción, verifica si ya existe un mobiliario con el mismo ID. Si el ID ya está en uso, devuelve un código de estado 400 indicando que ya existe 
//un mobiliario con ese ID. Si no hay conflictos, realiza la inserción en la base de datos y devuelve un mensaje indicando que el mobiliario se ha insertado correctamente
app.post("/mobiliario", function (request, response) {
  const nombre = request.body.nombre;
  const referrencia = request.body.referencia;
  const tipo = request.body.tipo;
  const estado = request.body.estado;


  if (
    !nombre ||
    !referrencia ||
    !tipo ||
    !estado
   
  ) {
    return response.status(400).send("Faltan datos obligatorios");
  }

  // Verificar si ya existe mobiliario con el mismo ID
  connection.query(
    `SELECT * FROM mobiliario WHERE nombre = "${nombre}"`,
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al buscar el mobiliario por ID");
        return;
      }

      // Si el mobiliario con el ID proporcionado ya existe, devolver un mensaje de error
      if (result.length > 0) {
        response.status(400).send("Ya existe un mobiliario con este ID");
        return;
      }

      // Insertar el nuevo mobiliario en la base de datos

      connection.query(
        `INSERT INTO mobiliario (nombre, referencia, tipo, estado) VALUES ('${nombre}', '${referrencia}', '${tipo}', '${estado}')`,
        function (error, result, fields) {
          if (error) {
            console.error(error);
            response.status(500).send("Error al crear el mobiliario");
            return;
          }

          console.log("mobiliario Insertado");
          response
            .status(200)
            .json({ message: "mobiliario insertado correctamente" });
        }
      );
    }
  );
});

//Este endpoint se utiliza para obtener información detallada de un mobiliario específico. Recibe el ID del mobiliario a través de los parámetros de la URL (:idmobiliarios),
// realiza una consulta a la base de datos para seleccionar ese mobiliario en particular y devuelve los datos en formato JSON como respuesta al mobiliario que realizó la solicitud
/*extra*/
app.post("/mobiliario/:idMobiliario", function (request, response) {
  const idMobiliario = request.params.idMobiliario; 
  const nombre = request.body.nombre;
  const referencia = request.body.referencia;
  const tipo = request.body.tipo;
  const estado = request.body.estado;

  if (!nombre || !referencia || !tipo || !estado) {
    return response
      .status(400)
      .send("Faltan datos obligatorios en el cuerpo de la solicitud");
  }

  connection.query(
    "UPDATE mobiliario SET nombre = ?, referencia = ?, tipo = ?, estado = ? WHERE id = ?",
    [nombre, referencia, tipo, estado, idMobiliario],
    function (error, result, fields) {
      if (error) {
        console.error("Error al modificar el mobiliario:", error);
        response.status(500).send("Error al modificar el mobiliario");
        return;
      }

      console.log("Mobiliario modificado correctamente");
      response
        .status(200)
        .json({ message: "Mobiliario modificado correctamente" });
    }
  );
});



app.get("/mobiliario", function (request, response) {
  

  connection.query(
    `SELECT * FROM mobiliario `,
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al obtener el mobiliario");
        return;
      }

      console.log(
        "Lista de mobiliario",
        result
      );
      response.json(result); // Enviar los datos del mobiliario al mobiliario que realiza la solicitud
    }
  );
});

app.get("/mobiliario/:idMobiliario", function (request, response) {
  const idMobiliario = request.params.idMobiliario;

  connection.query(
    `SELECT * FROM mobiliario WHERE id = ${idMobiliario}`,
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al obtener el mobiliario detallado");
        return;
      }

      if (result.length === 0) {
        response.status(404).send("Mobiliario no encontrado");
        return;
      }

      // Enviar los datos del mobiliario detallado como JSON
      response.json(result[0]);
    }
  );
});

  
  
/**
 * Termina mobiliario -----------------------------------------------------------------------------------------------
 */

app.listen(8000, function () {
  console.log("Server up and running!!!");
});
