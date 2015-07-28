var socket = io.connect(serverPath+'status');
  socket.on('rpiConnectionsUpdated', function (data) {
  	console.log(data);
    $.each(data, function( key, value ) {
      if (value == true){
      	console.log("true here");
      	$("#"+key+" .onlineStatus").html("online");
      	$("#"+key+" .statusBackground").addClass("bg-success").removeClass("bg-danger");
      } else { 
      	console.log("false here");
      	$("#"+key+" .onlineStatus").html("offline");
      	$("#"+key+" .statusBackground").addClass("bg-danger").removeClass("bg-success");
      }
	 });
  });
  