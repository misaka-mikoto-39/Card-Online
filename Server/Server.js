//Nodejs server
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

console.log("server dang chay");
var roomls = [];
		
// var findIndex = (roomls, roomid) => {
    // var result = -1
    // roomls.forEach((room, index)=>{
        // if(room.roomid === roomid){
            // result = index
        // }
    // })
    // return result
// };

io.on("connection", function(socket){
	console.log("Co nguoi ket noi " + socket.id);
	/*socket.on("client-send-color", function(data){
		console.log("server vua nhan dc: "+  data.name +  data.roomid);
		io.sockets.emit("server-send-color", data);
		console.log("server vua gui: " + data);
	});*/
	var playerProfile = {
		id: socket.id,
		name : '',
		room : ''
	}
	socket.on('client-create', function(data) {
		var roomlist=io.sockets.adapter.rooms;
		if(roomlist[data.roomid] != null){
			var msg = {
				msg: 'Room already exists !'
			}
			io.to(socket.id).emit('server-error-msg', msg);

		}else{
			socket.join(data.roomid);
			playerProfile.name = data.name;
			playerProfile.room = data.roomid;
			var playmap = [];
			var imglist = [ 0, 0, 0, 0, 0, 0, 0, 0]
			for(var i = 0; i < 4; i++){
				var line = [];
				for(var j = 0; j < 4; j++){
					var newlct ={
						img: '',
						color: '',
						status: 0
					}
					while(true){
						var randimg = Math.floor((Math.random() * 8) + 0);
						if(imglist[randimg] < 2){
							imglist[randimg]++;
							if(randimg == 0){
								newlct.img = 'apple';
								newlct.color = 'red';
							}else if(randimg == 1){
								newlct.img = 'github';
								newlct.color = '#24292e';
							}else if(randimg == 2){
								newlct.img = 'skype';
								newlct.color = '#1686D9';
							}else if(randimg == 3){
								newlct.img = 'send';
								newlct.color = '#1c7cd6';
							}else if(randimg == 4){
								newlct.img = 'cog';
								newlct.color = 'violet';
							}else if(randimg == 5){
								newlct.img = 'bluetooth';
								newlct.color = 'blue';
							}else if(randimg == 6){
								newlct.img = 'btc';
								newlct.color = 'yellow';
							}else if(randimg == 7){
								newlct.img = 'desktop';
								newlct.color = 'green';
							}/*else if(randimg == 8){
								newlct.img = 'desktop';
								newlct.color = 'red';
							} */
							break;
						}
					}
					/*var newlct2 = {
						[j] : newlct
					}*/
					line.push(newlct);
				}
				/*var lo = {
					[i] : line
				}*/
				playmap.push(line);
			}
			var newroom = {
				roomid : data.roomid,
				player1: data.name,
				player1id: socket.id,
				player1point : 0,
				player2: '',
				player2id : '',
				player2point : 0,
				playing: 1,
				map: playmap
			}
			roomls.push(newroom);
	    	//socket.nickname = data.name;
	    	console.log(data.name + ' vua tao ' + data.roomid);
	    	//console.log(roomls);
	    	console.log("map: ");
	    	roomls.forEach(function(value){
	    		if(value.roomid == data.roomid){
	    			console.log(value.map);
	    			return;
	    		}
			});
			console.log(imglist);
	    	//console.log(room);
		}
    	
  	});

  	socket.on('client-join', function(data) {
  		var roomlist=io.sockets.adapter.rooms;
		if(roomlist[data.roomid] == null){
			var msg = {
				msg: 'Room is not exists !'
			}
			io.to(socket.id).emit('server-error-msg', msg);

		}else{
			if(roomlist[data.roomid][0] === socket.id || roomlist[data.roomid][1] === socket.id ){
				var msg = {
					msg: 'You are already in this room'
				}
				io.to(socket.id).emit('server-error-msg', msg);
			}else{
				if(roomlist[data.roomid].length == 2){
					var msg = {
						msg: 'Room is full'
					}
				io.to(socket.id).emit('server-error-msg', msg);
				}else{
					socket.join(data.roomid);
					playerProfile.name = data.name;
					playerProfile.room = data.roomid;
					console.log(data.name + ' vua tham gia ' + data.roomid);
					console.log(roomlist[data.roomid]);
					roomls.forEach(function(value){
						if(value.roomid == data.roomid){
							value.player2 = data.name;
							value.player2id = socket.id;
							//console.log(value.map[0][0]);
							var roomdata = {
								roomid: value.roomid,
								player1: value.player1,
								player1point: value.player1point,
								player2: value.player2,
								player2point: value.player2point,
							}


							io.to(value.roomid).emit('server-send-room-data', roomdata);
							var play = {
								playing: 1
							};
							io.to(value.player1id).emit('server-send-playfirst-signal',play);
							io.to(value.player2id).emit('server-send-stop-signal',play);
						}
					});
				}
			}
		}
  	});



  	var imgchooselist = [];

  	socket.on('client-choose-img', function(data) {
  		console.log(playerProfile.id + 'mo hinh' + data.x +' '+data.y);
  		var imgopen;
  		roomls.forEach(function(values){
		    if(values.roomid == playerProfile.room){
		    	imgopen= values.map[data.x][data.y];
		    }
		});

  		if(imgchooselist.length == 0){
  			var newchoose = {
  				x: data.x,
  				y: data.y,
  				imgo: imgopen
  			}
  			imgchooselist.push(newchoose);
  			//send open img signal
  			io.to(playerProfile.room).emit('server-send-open-img', newchoose);
  			console.log('gui hinh 1' + newchoose.imgo.img);
  			roomls.forEach(function(values){
			    if(values.roomid == playerProfile.room){
			    	var play = {
						playing: values.playing
					};
			    	if(values.playing == 1){
						io.to(values.player1id).emit('server-send-play-signal',play);
						io.to(values.player2id).emit('server-send-stop-signal',play);
					}else if(values.playing == 2){
						io.to(values.player1id).emit('server-send-stop-signal',play);
						io.to(values.player2id).emit('server-send-play-signal',play);
					}
			    }
			});
  			
  		}else if(imgchooselist.length == 1){
  			var newchoose = {
  				x: data.x,
  				y: data.y,
  				imgo: imgopen
  			}
  			imgchooselist.push(newchoose);
  			//send open img signal
  			io.to(playerProfile.room).emit('server-send-open-img', newchoose);
  				console.log('gui hinh 2' + newchoose.imgo.img);
  			if(newchoose.imgo.img == imgchooselist[0].imgo.img){ //hinh 2 giong hinh 1	
  				roomls.forEach(function(value,index){
		    		if(value.roomid == playerProfile.room){
	    				var play = {
							playing: value.playing
						};
		    			// set diem
		    			if(value.playing == 1){
		    				value.player1point++;
		    				io.to(value.player1id).emit('server-send-play-signal',play);
		    				io.to(value.player2id).emit('server-send-stop-signal',play);
		    			}else if(value.playing == 2){
		    				value.player2point++;
		    				io.to(value.player1id).emit('server-send-stop-signal',play);
		    				io.to(value.player2id).emit('server-send-play-signal',play);
		    			}

		    			//send diem
		    			var point = {
		    				player1 : value.player1point,
		    				player2 : value.player2point
		    			}

		    			io.to(value.roomid).emit('server-send-point', point);

		    			// set map
		    			imgchooselist.forEach(function(vl){
		    				value.map[vl.x][vl.y].status = value.playing;
		    			});

		    			var wincheck = true;
		    			//kiem tra ket thuc
		    			for(var i = 0; i < value.map.length; i++){
		    				for(var j = 0; j < value.map[i].length; j++){
		    					if(value.map[i][j].status == 0){
		    						wincheck = false;
		    					}
		    				}
		    			}

		    			//neu da mo het
		    			if(wincheck == true){
		    				if(value.player1point > value.player2point){//player 1 win
		    					io.to(value.player1id).emit('server-send-win-signal');
		    					io.to(value.player2id).emit('server-send-lost-signal');
		    				}else if(value.player1point < value.player2point){//player 2 win
		    					io.to(value.player2id).emit('server-send-win-signal');
		    					io.to(value.player1id).emit('server-send-lost-signal');
		    				}else{//hoa
		    					io.to(value.roomid).emit('server-send-nowin-signal');
		    				}
		    				//xoa phong
		    				//var idx = findIndex(roomls,roomid);
							roomls.splice(index,1);
		    				console.log(roomls);
		    			}
		    			return;
		    		}
		    	});
		    	imgchooselist = [];

  			}else if(newchoose.imgo.img != imgchooselist[0].imgo.img){// hinh 2 khac hinh 1


  				var databack = {
		    		x1:imgchooselist[0].x,
		    		y1:imgchooselist[0].y,
		    		x2:imgchooselist[1].x,
		    		y2:imgchooselist[1].y
		    	}
		    	// up hinh
		    	setTimeout(function(){
		    		io.to(playerProfile.room).emit('server-send-close-img', databack)
				}, 1000);
  				//chuyen quyen choi
  				roomls.forEach(function(value){
		    		if(value.roomid == playerProfile.room){
		    			if(value.playing == 1){
		    				value.playing = 2;
		    				var play = {
								playing: 2
							};
		    				io.to(value.player2id).emit('server-send-play-signal',play);
		    				io.to(value.player1id).emit('server-send-stop-signal',play);
		    			}else if(value.playing == 2){
		    				value.playing = 1;
		    				var play = {
								playing: 1
							};
		    				io.to(value.player1id).emit('server-send-play-signal',play);
		    				io.to(value.player2id).emit('server-send-stop-signal',play);
		    			}
		    			return;
		    		}
		    	});

		    	// xoa list
		    	imgchooselist = [];
  			}
  			
  		}

  	});

  	socket.on('client-quit', function(data){
  		socket.leave(playerProfile.room);
  		console.log(playerProfile.name + "da thoat phong" + playerProfile.room);
  		var dtsend = {
  			player: playerProfile.name
  		}
  		io.to(playerProfile.room).emit('server-client-quit', dtsend);
  		console.log(io.sockets.adapter.rooms);
  	})

  	socket.on('client-leave', function(data){
  		socket.leave(playerProfile.room);
  		console.log(playerProfile.name + "da thoat phong" + playerProfile.room);
  		roomls.forEach(function(value,index){
    		if(value.roomid == playerProfile.room){
    			roomls.splice(index,1);
    		}});
  		console.log(io.sockets.adapter.rooms);
  	})

  	/*socket.on('client-cancle-create', function(data){
  		socket.leave(playerProfile.room);
  		console.log(playerProfile.name + "da thoat phong" + playerProfile.room);
  		var dtsend = {
  			player: playerProfile.name
  		}
  		io.to(playerProfile.room).emit('server-client-quit', dtsend);
  		console.log(io.sockets.adapter.rooms);
  	})*/
});