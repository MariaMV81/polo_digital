let express = require("express");
let mysql = require("mysql2");
const app = express();

app.use(express.static("public"));

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

app.get("/carrusel", function (request, response) {
  connection.query("select * from eventos", function (error, result, fields) {
    if (error) {
      response.status(400).send(`error: ${error.message}`);

      return;
    }

    let total = 3;
    let eventos = [];

    for (let i = 0; i < total; i++) {
      eventos[i] = result[i];
    }

    response.send(eventos);
  });
});

app.get("/registro", function (request, response) {
  connection.query(
    "insert into usuarios values()",
    function (error, result, fields) {
      if (error) {
        response.status(400).send(`error: ${error.message}`);

        return;
      }

      response.send(result);
    }
  );
});

/**
 *  Ejemplo URL: http://localhost:8000/login?email=maria@gmail.com&password=1234
 */

app.get("/login", function (request, response) {
  const email = request.query.email;
  const password = request.query.password;

  connection.query(
    `select * fron usuarios where email = "${email}" and password = "${password}"`,
    function (error, result, fields) {
      if (error) {
        response.status(400).send(`error: ${error.message}`);

        return;
      }

      if (result.length == 0) {
        response.send({ message: "Email o password no valido" });
      } else {
        response.send({ message: "Usuario logueado" });
      }
    }
  );
});

app.listen(8000, function () {
  console.log("Server up and running!!!");
});
