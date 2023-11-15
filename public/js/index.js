const host = "http://localhost:8000";

window.addEventListener("load", function(event){
    fetch(`${host}/carrusel?total=3`)
        .then(function(response){
            console.log(response)
                return response.json();
        }).then(function(json){
            const containerDiv = document.getElementById("container");
            containerDiv.innerHTML = "<ul>";
            for ( let i = 0; i < json.length; i++){
                containerDiv.innerHTML += `<li>${json[i].nombre} / ${json[i].organizado}</li><button onClick ="carruselClick(${json[i].id})">+ info</button>`;
            }

            containerDiv.innerHTML += "</ul>";

            if (json[0].nombre == "onclick"){
              containerDiv.innerHTML += `<li>${json[0]}</li>`
            }
      
        }).catch(function(error){
                console.log(error)
        });
   
});

function carruselClick(eventosID) {
    fetch(`${host}/evento/${eventosID}`)
    .then(function(response){
        return response.json();
    }).then(function(json) {
        const containerDiv = document.getElementById("container");
        containerDiv.innerHTML = `<h2>Bienvenidos a  ${json.nombre} </h2><button onClick ="inicioClick()">regresar</button> `;
        console.log(json)
    }).catch(function(error){
        console.log(error);
    });
  
  }


  function inicioClick() {
    
    window.location.href = "http://localhost:8000";
  }




