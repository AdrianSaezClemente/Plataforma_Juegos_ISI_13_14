// Publicaciones de las colecciones
Meteor.publish('messages', function(){
	return Messages.find({}, {sort: {time:-1}});
});
Meteor.publish('partidas',function(){
	return Partidas.find({},{nombre:1, jugadores:1,opciones:1});
});

Meteor.methods({
	//  Cada vez que se quiera almacenar un movimiento de una partida se llamará 
	//  a esta funcion. Se comprueba que se el judgador que inicia el momimiento
	//  está autorizado (está en la lista de jugadores), despues se almacena la 
	//  jugada en la lista de jugadas de la partida.
	RegistrarMovimiento : function(id_partida,jugador,movimiento){
		console.log("Registrar Movimientos");
		var id = Partidas.findOne({id:id_partida})._id;
		//if(jugadorpermitido)
		Partidas.update(id,{$push:{jugadas:movimiento}});
	},

	// Esta función devueiemQfx9dLJxDn6EsPlve el ultimo movimiento jugado en la partida
	// AUN NO ESTA CLARO si cualquiera puede mirar el ultimo movimiento
	// o debe estar en alguna de las listas de jugadores (usuarios, 
	// jugadores de partida o invitados a partida).
	UltimoMovimiento : function(id_partida){
		console.log("Ultimo Movimiento");
		//if(jugadorpermitido)?
		var jugadas = Partidas.findOne({id:id_partida}).jugadas;
		return jugadas[jugadas.length-1];
	},


	// Devuelve el jugador AL QUE LE TOCA dando un identificador de partida
	// Si es el primer turno devuelve un jugador aleatorio de la lista de jugadores.
	// El jugador al que le toca es EL SIGUIENTE al que ha jugado la ultima jugada,
	// en la lista de jugadores según el orden en el que están almacenados en el array
	// de jugadores
	VerTurno : function(id_partida){
		console.log("VerTurno");
	// 	if(jugadorpermitido)?
		var partida = Partidas.findOne({id:id_partida}).jugadas;
		if (partida.jugadas.length()){
			return partida.jugadores[(partida.jugadores.indexOf(partida.jugadas[jugadas.length-1].jugador)+1)%partida.jugadores.length];
		}else{
			return(partida.jugadores[Math.floor(Math.random()*partida.jugadores.length)]);
		}
	},


	// Mete una nueva partida en el servidor. Devuelve un identificador
	// de partida UNICO no coincidente con el idenificador foráneo al que 
	// el cliente debe suscribirse en su Deps.autorun().
	// Jugadores es un array con el identificador de cada jugador (nombre?)
	// Opciones es un map con las opciones que se quieran pasar a la partida.
	// Invitados es un array con los jugadores que observan la partida.
	// Nombre es un nombre que le quieras dar a la partida.
	SuscribirPartida : function(jugadores,opciones,invitados,nombre){
		console.log("SubscribirPartida");
	// 	if(permitido)?
		var id =GetSeq();
		Partidas.insert({
			id:id,
			nombre:nombre,
			jugadores: jugadores,
			invitados: [],
			opciones: opciones,
			empezada:false,
			jugadas:[]
		})
		var sid = "__Partida."+id.toString();
		Meteor.publish(sid,function(){
			return Partidas.find({id:id},{nombre:1, jugadores:1,invitados:1,opciones:1,jugadas:1});
		})
		
		return sid;
	}
})


var GetSeq = function(){
	var lst = Partidas.find({},{sort:{id:1}}).fetch();
	for (var i=0; i<lst.length-1;i++){
		if (Number(lst[i].id)+1 != Number(lst[i+1].id)){
			var val = Number(lst[i].id)+1;
			return val;		// Gap!!
		}
	}
	var val= lst.length==0 ? 0 : lst[lst.length-1].id+1;
	return val;				//Not Gap. Return the last+1 or 0 if no Games.
};