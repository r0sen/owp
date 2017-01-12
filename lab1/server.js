const readline = require('readline');
const net = require('net');
const fs = require('fs');

var nameOfMyJson = "musicList.json";
var keys = ["title", "book", "published", "price", "id"];

var rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout
  }
);

rl.question("Enter the 'address:host' of your new server\n", function(answer){
  var addressArray = [];
  if (answer !== null){
    addressArray = answer.toString().split(':');
  }

  var clientsArray = [];
  var server = net.createServer({allowHalfOpen:true}, function(serverSocket){
    serverSocket.allowHalfOpen = true; // client must disconnect from the server
    var currentClientAddress = serverSocket.remoteAddress + ':' + serverSocket.remotePort; // get address:port of current client to write it to clientsArray
    clientsArray.push(currentClientAddress);
    console.log("We had the connection from " + currentClientAddress);

    serverSocket.on('data', function(data){
      data = data.toString().trim(); // delete spaces
      console.log("Recd: " + data);

      //commands
      switch(data){
        case '!quit':{
          serverSocket.end("Goodbye :(");
          console.log("Sent: Goodbye :(");
          break;
        }
        case '!json':{
          fs.readFile(nameOfMyJson, function(err, myJsonData){
            if (err){
              throw err;
            }
            serverSocket.write(myJsonData);
            console.log("Sent: " + myJsonData);
          });
          break;
        }
        case '!count':{
          fs.readFile(nameOfMyJson, function(err, myJsonData){
            if (err){
              throw err;
            }
            if (myJsonData !== null){
              let jsonList = JSON.parse(myJsonData);
              let count = (jsonList.length).toString();
              serverSocket.write(count);
              console.log("Sent: " + count);
            }
          });
          break;
        }
        case '!clients':{
          let clients = clientsArray.join(); // create a string with addresses
          serverSocket.write(clients);
          console.log("Sent: " + clients);
          break;
        }
        default:{
          let filter = data.split('?');
          if (filter[0] !== null && filter[1] !== null && filter[0] !== undefined && filter[1] !== undefined && filter[0] === "!json"){
            let secondPart = filter[1].split('&');
            if (secondPart[0] !== null && secondPart[0] !== undefined){
              let keysArray = [];
              let valuesArray = [];
              for (let i = 0; i < secondPart.length; i++){
                let oneKeyValue = secondPart[i].split('=');
                console.log(oneKeyValue.join()); // why?
                keysArray.push(oneKeyValue[0]);
                valuesArray.push(oneKeyValue[1]);
              }
              let correctOfKeys = true;
              for (let i =0; i < keysArray.length; i++){
                let key = keysArray[i];
                if (key !== keys[0] && key !== keys[1] && key !== keys[2] && key !== keys[3] && key !== keys[4]){ // are these fields existing in json file?
                  correctOfKeys = false;
                  break;
                }
              }
              if (correctOfKeys === true){
                fs.readFile(nameOfMyJson, function(err, myJsonData){
                  if (err){
                    throw err;
                  }
                  let jsonList = JSON.parse(myJsonData);
                  let filteredList = [];
                  for (let i = 0; i < jsonList.length; i++) {
                    let json = jsonList[i];
                    let isFilterJson = true;
                    for (let j = 0; j < keysArray.length; j++) {
                      if (json[keysArray[j]] != valuesArray[j]) { //
                        isFilterJson = false;
                        break;
                      }
                    }
                    if (isFilterJson) {
                      filteredList.push(json);
                    }
                  }
                  let jsonStr = JSON.stringify(filteredList, "", 4);
                  console.log("Sent: \n" + jsonStr);
                  serverSocket.write(jsonStr);
                });
              }
              else{
                console.log("Sent: Invalid key(s) field");
                serverSocket.write("Invalid key(s) field");
              }
            }
            else{
              console.log("Sent: Empty command after '?'");
              serverSocket.write("Empty command after '?'");
            }
          }
          else{
            console.log("Sent: Empty command");
            serverSocket.write("Empty command");
          }
          break;
        }
      }
    });

    serverSocket.on('end', function(){
      console.log("Client has disconnected (the end of connection)\n");
      let clientToDelete = serverSocket.remoteAddress + ':' + serverSocket.remotePort;
      clientsArray.splice(clientsArray.indexOf(clientToDelete), 1);
      serverSocket.end();
    });

    serverSocket.on('error', function(){
      console.log("Client has disconnected (error)\n");
      let clientToDelete = serverSocket.remoteAddress + ':' + serverSocket.remotePort;
      clientsArray.splice(clientsArray.indexOf(clientToDelete), 1);
      serverSocket.end();
    });
  });

  server.listen(addressArray[1], addressArray[0], function(){ // start the server
    console.log("Server is listening...");
  });
});
