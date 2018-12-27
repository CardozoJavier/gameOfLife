
var gameOfLife = {
  // dimensiones alto y ancho del tablero
  width: prompt('Inserte numero de columnas', 0),
  height: prompt('Inserte numero de filas', 0), 
  // debería ser usada para guardar referencia a una intervalo que esta siendo jugado
  stepInterval: null, 
  // Estado del botón play/pause.
  state: false,

  createAndShowBoard: function () {

    // crea el elemento <table>
    var goltable = document.createElement("tbody");

    // Construye la Tabla HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // agrega la tabla a #board
    var board = document.getElementById('board');
    board.appendChild(goltable);
    // una vez que los elementos html son añadidos a la pagina le añadimos los eventos
    this.setupBoardEvents();
  },

  // Funcion para recorrer todo el tablero e invocar la 'iteratorFunc' para cada celda. 
  forEachCell: function (iteratorFunc) {

    for (var h=0; h < this.height; h++){
      for (var w=0; w < this.width; w++){
        var cell= document.getElementById(h + '-' + w);
        iteratorFunc(cell,h,w);
      }
    }
  },
  
  // Preset del tablero.
  setupBoardEvents: function() {

    var onCellClick = function (e) {

      for (var h=0; h<this.height; h++) {
        tablehtml += "<tr id='row+" + h + "'>";
        for (var w=0; w<this.width; w++) {
          tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
        }
        tablehtml += "</tr>";
      }
      // como setear el estilo de la celda cuando es clickeada
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
    };

    // Agregamos evento a cada celda para conmutar su estado.
    this.forEachCell(function(cell){
      cell.addEventListener("click",onCellClick)});

    // Agregamos evento a boton set.
    var setBtn = document.getElementById('reset_btn');
    setBtn.addEventListener('click', this.setRandom.bind(this));

    // Agregamos evento a boton clear.
    var clearBtn = document.getElementById ('clear_btn');
    clearBtn.addEventListener('click', this.clear.bind(this));

    // Agregamos evento a boton step.
    var step= document.getElementById('step_btn');
    step.addEventListener('click', this.step.bind(this));

    // Agregamos evento a boton play.
    var playPause= document.getElementById('play_btn');
    playPause.addEventListener('click', this.enableAutoPlay.bind(this));

  },

  // Funcion para setar aleatoriamente el tablero.
  setRandom : function(cell){
    this.forEachCell(function(cell){
      var random = Math.random();
      if (random < 0.8) {
        cell.dataset.status = "dead"
        cell.className ='dead'
      }else{
        cell.dataset.status = "alive"
      cell.className='alive'
      }
    })
  },

  // Limpiamos el tablero y vaciamos el arreglo de vecinos.
  clear: function(cell){
    this.forEachCell(function(cell){
        cell.dataset.status = "dead";
        cell.className='dead';     
    })
  },

  step: function () {

    this.forEachCell(shouldChange);
    // En esta funcion vamos a contar la cantidad de vecinos vivos para cada celda
    // y guardar el estado que deberia tener en el siguiente step.
    function shouldChange (cell,x,y){
      var vecinoVivo= 0;
      for (var i=-1; i<2; i++){
        for (var j=-1; j<2; j++){
          var vecino= document.getElementById((x+i) + '-' + (y+j));
          // Si existe vecino, es distinto de la celda actual y a la ves, está vivo, 
          // lo sumamos.
          if (vecino && vecino.dataset.status == 'alive' && cell != vecino){
            vecinoVivo++;
          }
        }
      }
      // Terminados los bucles 'for' pasamos a comprobar las condiciones para determinar 
      // el siguiente estado de la celda actual, y lo guardamos en su propiedad 'nextStatus'.
      if (cell.dataset.status == 'alive'){
        if (vecinoVivo > 3 || vecinoVivo < 2){
          cell.dataset.nextStatus= 'dead';
        }else{
          cell.dataset.nextStatus= 'alive';
        }

      }else if (cell.dataset.status == 'dead'){
        if (vecinoVivo === 3){
          cell.dataset.nextStatus= 'alive';
        }else{
          cell.dataset.nextStatus= 'dead';
        }
      }
    }

    this.forEachCell(change);
    // Funcion con la que conmutamos el estado de cada celda en base a su propiedad 'nextStatus'.
    function change(cell){
      if (cell.dataset.nextStatus == 'alive'){
        cell.dataset.status= 'alive';
        cell.className= 'alive';
      }else if (cell.dataset.nextStatus == 'dead'){
        cell.dataset.status= 'dead';
        cell.className= 'dead';
      }
    }
  },

  // Funcion para iniciar el juego de forma automatica.
  enableAutoPlay: function () {
    gameOfLife.state = !gameOfLife.state;

    if (gameOfLife.state == true){
      // En 'stepInterval' se guardará un ID que lo usaremos para invocar 'clearInterval'
      // y poder para la ejecucion de 'setInterval'.
      stepInterval= setInterval(gameOfLife.step.bind(this),500);

    }else{
      clearInterval(stepInterval);
    }    
  }

};

gameOfLife.createAndShowBoard();

