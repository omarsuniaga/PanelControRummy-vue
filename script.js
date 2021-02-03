var vm = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data:{
    inicio:'',
    id: "",
    quien:'',
    estado: false,
    editar: true,
    numRonda:0,        //contador de partidas
    numPartida:0,       //fecha inicio partida
    time: "",                 //duracion de la partida
    indice : 0,               //indice de cada jugador
    rj: 30,                   //tiempo del cronometro
    h: 0,                     //hora global
    m: 0,                     //minuto global
    s: 0,  
    partida:[],
    jugadores:[],
    global:[],
    marcador:[],
    ronda:[
        {
            hora:"",       
            fecha:"",       //fecha inicio partida
            marcador:"",       
            jugador:[],
            duracion:0,            //Duracion de la partida
            numTurnos:0,
            ganador:'',             //ganador de la Partida
        }
    ],
},
  mounted: function () {
      if(localStorage.getItem('jugadores')){
          this.jugadores=JSON.parse(localStorage.getItem('jugadores'))
          this.partida=(JSON.parse(localStorage.getItem('partida')))
          this.record();
        //   console.log(this.global)
        //   console.log(this.winner)
      }else{
          this.jugadores=[]
        }
  },
  methods: {
    record(){
        // let marcador = [];
        for (let i = 0; i < this.partida.length; i++) {
            this.marcador = this.partida[i].marcador;
        }

        return console.log(this.marcador)
    },
    edicion(){
        (this.editar===false)? this.editar=true :this.editar=false;
       return 
    },
    guardarJugador(){ 
        return localStorage.setItem('jugadores',JSON.stringify(this.jugadores))
    },
    guardarPartida(){ 
        localStorage.setItem('partida',JSON.stringify(this.partida))
        localStorage.setItem('global',JSON.stringify(this.global))
    },

    add(){
        let random = ()=>Math.floor(Math.random() * (250 - 1)) + 1;
        let color = `rgb(${random()},${random()},${random()})`
        let avatar='avatars/default-avatar.png';
        let omar = ['Omar','Omar Suniaga', 'omar', 'omar suniaga', 'omar eduardo', 'Omar Eduardo'];
        let mare = ['Mare','mare','Marelvys','marelvys','Marelvys Suniaga','marelvys suniaga','marelvys teresa','Marelvys Teresa'];
        let jenny =['Jenny','jenny','Jennifer','jennifer','Jennifer Villalba','jennifer villalba'];
        let ysa =  ['Ysa','ysa','Ysabella','ysabella','Ysabella Brito','ysabella brito'];
        let ronald=['Ronald','ronald','Ronald Brito','ronald brito','Ronald B','Ronald brito','ronald Brito'];
        let nombre = prompt('Escribe tu nombre','');
        if(nombre){
            omar.find(element => {
                 if(element === nombre)
                return avatar = "avatars/omar-avatar.png";
            });
            mare.find(element => {
                if(element === nombre)
                return avatar = "avatars/mare-avatar.png";
            });
            jenny.find(element => {
                if(element === nombre)
                return avatar = "avatars/jenny-avatar.png";
            });
            ysa.find(element => {
                if(element === nombre)
                return avatar = "avatars/ysabella-avatar.png";
            });
            ronald.find(element => {
                if(element === nombre)
                return avatar = "avatars/ronald-avatar.png";
            });

            if(nombre.trim()==='' || nombre === NaN){
                return alert('Debe agregar un nombre');
            }else{   
                // let avatar = "avatars/"+nombre+"-avatar.png";
                this.jugadores.push({
                id:Date.now(),
                nombre:nombre, 
                puntos:0, 
                historialPuntos:[], 
                historialVelocidad:[], 
                rangoVelocidad:0,
                categoriaVelocidad:"", 
                avatar:avatar,
                color:color
                })
            }
        }else{
            return
        }
        this.guardarJugador();
    },
    eliminar(id){
        let eliminados = this.jugadores.filter((item)=>item.id !== id)
        this.jugadores=eliminados;
        this.guardarJugador();
    },
    agregarPuntosManual(id){
        for(item in this.jugadores){
            if(this.jugadores[item].id===id){
                this.jugadores[item].historialPuntos.push(this.jugadores[item].puntos);
            }
        }
        this.guardarJugador()
    },
    agregarPuntos(){
        for (item in this.jugadores) {
            let nombre = this.jugadores[item].nombre;
            let puntosAcc = parseInt(this.jugadores[item].puntos);//forma antigua
            let puntos = prompt('Agregar puntos de '+nombre);
            (puntos===''|| puntos===null)
            ? NaN
            : puntos=parseInt(puntos);
            this.jugadores[item].puntos=puntosAcc+puntos;
            this.jugadores[item].historialPuntos.push(puntos);
            (this.jugadores[item].puntos>=500)? this.finPartida() : NaN;
        }
        // console.log(this.jugadores);
        this.guardarJugador()
    },
    velocidad (array){
        let historialVelocidad = array;
        let velocidadTotal = historialVelocidad.reduce((a,b)=>a+b,0);//Sumas de arrays
        let total = Math.fround(velocidadTotal/array.length);
        (total> 0 && total <= 5)?this.jugadores[this.indice].velocidad ="✨💪Muy Rapido✨🏃💨":
             (total > 5 && total <= 10)?this.jugadores[this.indice].velocidad ="💪Rapido⭐":
                (total > 10 && total <= 15)?this.jugadores[this.indice].velocidad ="Moderado🏃‍":
                    (total > 15 && total <= 20)?this.jugadores[this.indice].velocidad ="Lento🚶"
                    :this.jugadores[this.indice].velocidad ="🐢Muy Lento";
        return this.jugadores[this.indice].rangoVelocidad = total;
        // console.log(total);
    },
    ganador(){
        let winner=[];
        let loser=[];
        
        for(item in this.jugadores){
            winner.push({
                jugador:this.jugadores[item].nombre,
                puntos:this.jugadores[item].puntos
            })
        }
        winner.sort(function(a,b){
                if (a.puntos < b.puntos) {
                return -1;
            };
        })
        this.ronda[this.numRonda].ganador=winner[0];
        for(let i = 1; i < winner.length; i++){
            loser.push(winner[i])
        }
        this.ronda[this.numRonda].perdedores=loser;
        this.ronda[this.numRonda].marcador=winner;
        this.guardarPartida();
},
    resetear(){
        for(item in this.jugadores){
            this.jugadores[item].puntos=0
        }
    },

    finPartida(){
        this.numPartida++
        this.global.push(this.partida[this.numPartida])
        this.ronda=[],
        this.guardarPartida();
        this.h=0;this.m=0;this.s=0;
        for (item in this.jugadores) {
            this.jugadores[item].puntos=0;
            this.jugadores[item].historialPuntos=0;
            this.jugadores[item].historialVelocidad=0;
    }   
        // this.numTurnos=0;
        this.numRonda=0;
        // console.log(partida);
        // console.log(this.jugadores);
    },

    play() {
        this.editar=true
        if(this.jugadores.length > 0){
            let hoy = new Date;
            this.estado = true;
            this.ronda[this.numRonda].fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
            this.ronda[this.numRonda].hora  = hoy.getHours()+":"+hoy.getMinutes()+":"+hoy.getSeconds();
            this.escribir();
        }else{
            return alert("No puede empezar partida sin jugadores")
        }
    },
    
    escribir() {
        this.inicio = Date.now();
        if(this.indice===this.jugadores.length){
            //si es igual al total de jugadores, lo mandamos al inicio o sea, al primer jugador
            this.indice=0;
            // this.partida.numRonda++
        }
        this.quien = this.jugadores[this.indice].nombre;
        // console.log("turno de ",this.jugadores[this.indice].nombre);
       // console.log('entre a escribir');
        let hAux, mAux, sAux;
        let miliseg = 0,
        seg = this.rj,
        color = "green";
        const degToRoad = (degree) => {
        let factor = Math.PI / 180;
        return factor * degree;
        };
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
            ctx.lineWidth = 10; //Linea circular
            ctx.lineCap = "round"; //puntas de la linea redondeada
            ctx.shadowBlur = 10; //Sombra de la linea
            
            const renderTime = () => {
            ctx.shadowColor = color; //degradado
            ctx.strokeStyle = color; //Color de la linea
            miliseg++;
            if (miliseg > 99) {
                this.s++
                seg--;
                miliseg = 0;
                // console.log(seg);
            }
            if (seg < 30 && seg >= 25 ) {color = "green"} 
            else if (seg <= 15 && seg >= 6) {color = "orange"}
            else if (seg <= 5  && seg >=0) {color = "red"} 
            else if (seg === -1) 
            {
                alert("Acepta para continuar");
                seg = 30;
        color = "green";
        }
        if (this.s > 59) {
        this.m++;this.s = 0;}
        if (this.m > 59) {this.h++;this.m = 0;}
        (this.h > 24)?this.h = 0 : NaN;
        (this.s < 10)?sAux = "0" + this.s :sAux = this.s;
        (this.m < 10)?mAux = "0" + this.m :mAux = this.m;
        (this.h < 10)?hAux = "0" + this.h :hAux = this.h;
        let newSconds = seg - miliseg / 100;
        //background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 300, 300);
        //seconds
        ctx.beginPath();
        // ctx.arc(x,y,grosor,inicio,fin));
        ctx.arc(150, 150, 80, degToRoad(270), degToRoad(newSconds * 12 - 90));
        ctx.stroke();
        //date
        ctx.fillStyle = color;
        ctx.font = "24px Arial";
        ctx.fillText(seg, 137, 155);
        return this.time = `${hAux}:${mAux}:${sAux}`;
      };
      this.id = setInterval(renderTime, 10);
    },
    Reiniciar() {
        clearInterval(this.id);
        this.rj=30;
        let turnoFin= Date.now();
        let diff = (turnoFin - this.inicio )/1000; 
        console.log(diff);
        this.jugadores[this.indice].historialVelocidad.push(diff);
        this.velocidad(this.jugadores[this.indice].historialVelocidad)
        this.guardarJugador();
        this.ronda[this.numRonda].numTurnos++;
        this.indice++//Jugadores+1
        this.escribir()
    },
    Detener() {
        if(this.estado===false){
            alert('debes iniciar una partida')
        }else
        {
            clearInterval(this.id);
            this.estado=false;
            this.rj=30;
            let turnoFin= Date.now();
            let diff = (turnoFin - this.inicio)/1000; 
            this.jugadores[this.indice].historialVelocidad.push(diff);
            this.velocidad(this.jugadores[this.indice].historialVelocidad)
            this.ronda[this.numRonda].duracion=this.time; 
            this.guardarJugador();
            alert('Agrega los puntos')
            this.agregarPuntos();
            this.ganador()
            this.ronda[this.numRonda].jugador=this.jugadores;
            this.partida.push(this.ronda[this.numRonda])
            // this.numRonda++;
            console.log(this.partida);
            this.guardarPartida()
        }
    },
    
},
});
