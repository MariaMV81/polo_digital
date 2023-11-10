let express = require("express");
let mysql = require("mysql2");
const app = express();

app.use(express.static("public"));
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
  connection.query("select * from usuarios", function (error, result, fields) {
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
    `select * from usuarios where id = ${idEvento}`,
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
app.get("/login", function (request, response) {
  const email = request.query.email;
  const password = request.query.password;
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
          // 3. Insertar en la tabla empleados_clientes el id del nuevo usuario creado
          // connection.query(
          //   `INSERT INTO empleados_clientes (nombre, apellidos, usuarioID, clienteID, dni, telefono) VALUES ('${nombre}', '${apellidos}', '${usuarioid}', '${clienteID}', '${dni}', '${telefono}')`,
          //   function (error, result, fields) {
          //     if (error) {
          //       console.error(error);
          //       response
          //         .status(500)
          //         .send("Error al insertar en la tabla empleados_clientes");
          //       return;
          //     }

          //     console.log("Registro completado");
          //     response.send({ message: "registro" });
          //   }
          // );

          connection.query(
            "INSERT INTO empleados_clientes (nombre, apellidos, usuarioID, clienteID, dni, telefono) VALUES (?, ?, ?, ?, ?, ?)", //? marcador de posicion: especigica los valores que se van a insertar, en lugar de valores concretos
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
                return;
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
 * Termina Login y Registro ---------------------------------------------------------------------------
 */

app.listen(8000, function () {
  console.log("Server up and running!!!");
});
