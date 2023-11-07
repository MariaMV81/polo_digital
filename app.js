let express = require("express");
const app = express();

app.use(express.static("public"));

app.get('/hola', function(request, response){
    response.send({message: 'Holaaaaaaa'});
});

app.listen(8000, function(){
    console.log('Server up and running!!!');
});
