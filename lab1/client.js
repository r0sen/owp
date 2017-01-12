const readline = require('readline');
const net = require('net');

var rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  }
);

const clientSocket = new net.Socket();

rl.question("Hello, enter the 'address:port'\n> ", function(answer){
  if (answer !== null){
    let addressArray = answer.toString().split(':');
    clientSocket.connect(/* port */ addressArray[1], /* address */ addressArray[0], function(){
      console.log("Ok, we have connected to "+addressArray[0]+":"+addressArray[1]+"\nType !help to open command menu");
      rl.prompt();
    });
  }

  rl.on('line', function(line){ // we wrote 'line' and got help or sent data to server
    if (line === "!help"){
      console.log("Type !quit to disconnect\nType !json to see json file\nType !count to count elements in .json file\nType !clients to get information about connected clients\nType !json?key1=value1&key2=value2 to get filtered json file\nFor example '!json?title=Freaks', '!json?id=10&price=312' or line with more than 2 keys");
      rl.prompt();
    }
    else{
      clientSocket.write(line);
      console.log("Sent: "+line);
    }
  }).on('close', function(){ // Ctrl + C to shut down
    clientSocket.destroy();
    process.exit(0);
  });

  clientSocket.on('data', function(data){
    console.log("Recd: "+ data); // what server sent to client
    rl.prompt();
  });

  clientSocket.on('end', function(){
    console.log("Connection is shut down"); // when server disable client
    clientSocket.end();
    process.exit(0);
  });

  clientSocket.on('error', function(){
    console.log("Server was crashed!");
    clientSocket.destroy();
    process.exit(0);
  });
});
