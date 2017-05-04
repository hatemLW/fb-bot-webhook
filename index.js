//'use strict';
//var WebSocketServer = require("ws").server
//var socketIO = require('socket.io');
//const express = require('express');
//var WebSocketServer = require("ws").Server; // WS
//var http = require("http"); // WS
//var path = require('path'); // WS

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');


//var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
//var changeCase = require('change-case');

app.use(bodyParser.json());


var port =  5551; // WS
/*app.use(express.static(__dirname + "/")); // WS
var server = http.createServer(app); // WS
console.log("http server creating on %d", port) // WS
server.listen(port); // WS

var wss = new WebSocketServer({server: server}); // WS
console.log("websocket server created"); // WS

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
});*/ 
// WS



//const PORT = process.env.PORT || 3000;
const PORT = 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server: server, path: "/ws" });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);



//app.set('port', (process.env.APPSETTING_PORT || 5000));
//app.set('verify_token', (process.env.APPSETTING_VERIFY_TOKEN || 'TEST'));
//app.set('page_access_token', (process.env.APPSETTING_PAGE_ACCESS_TOKEN || 'NULL'));

//app.set('port',  5000);
//app.set('verify_token', 'TEST');
//app.set('page_access_token', ('EAAOlPqyA6G8BACwqDoewkvsQCUtimjsbIbCpl7CeuDhhABJNb20itWtBAAlTVdb8vaPQU7WXnV7Pgw41iZCvUw0nJv6lZA4JV2j1bvpZBxZBkSApXZA0fJ0gS3ckLZAS5MXIFXOKLyakZCXK2FRYacMZC139NYY5Ncfo6ZAoVEyvZALTY1XF3lF2ZCU'));
//var FB_PORT = 5000;
//app.set('port', (FB_PORT || 5000));

app.set('port', (process.env.PORT || 5000));
app.set('verify_token', (process.env.VERIFY_TOKEN || 'TEST'));
app.set('page_access_token', (process.env.PAGE_ACCESS_TOKEN || 'NULL'));


var PAGE_ACCESS_TOKEN = 'EAAOlPqyA6G8BACwqDoewkvsQCUtimjsbIbCpl7CeuDhhABJNb20itWtBAAlTVdb8vaPQU7WXnV7Pgw41iZCvUw0nJv6lZA4JV2j1bvpZBxZBkSApXZA0fJ0gS3ckLZAS5MXIFXOKLyakZCXK2FRYacMZC139NYY5Ncfo6ZAoVEyvZALTY1XF3lF2ZCU';
var PAGE_ACCESS_TOKEN2= 'EAAOlPqyA6G8BAKcCAY5v8sdb6Ou0etYuMVo1wFwtVSMeqpyVYVMMFoEZCWFpKvRAhFoqZAZC9cD4BfLjHAU603wBBtq0b4D7UT7ZBkIyH732vDf54ZCCmV1KuSb3bO9BvLuAGeKxj75lrYlk7v5KhkkiBtq2hFTkZD';
var PAGE_ACCESS_TOKEN3= 'EAAOlPqyA6G8BAEDb2ZBfjMt46tvKdrOFdWEu2l7Ec8PXFgmxCMZAuZBFQ64lKsscNqHHlglnIOkWZA1u4ElEDADRjHog6YSfmZCjGaZCsqg4unCPeljoU9WSupHIWZBP531P65RHiLmLN5tvONZC3LQFe0OwJePxkDfqwDqQUrQoorQWOnBMp2SLAWsA3l42HHcZD';



app.get('/', function (req, res) {
        //res.send('It Works! Follow FB Instructions to activate.');
	res.send("<html><body><script>	console.log(location.origin);var HOST = location.origin.replace(/^http/, 'ws');	  console.log(HOST);var ws = new WebSocket(HOST+'/ws'); </script>  </body></html>"        );
	console.log('new request!');
	var host = req.get('host');
  console.log(host);
	var origin = req.get('origin');
 // var HOST = location.origin.replace(/^http/, 'ws');
	  console.log(origin);
});

app.get('/webhook', function (req, res) {
        //if (req.query['hub.verify_token'] === app.get('verify_token')) {
        if (req.query['hub.verify_token'] === app.get('verify_token')) {           
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.post('/webhook/', function (req, res) {
      //  console.log('new msg!');
        
    // console.log(req.body);
         if(req.body.entry[0].messaging){
                // console.log('messaging_events:...');
   var messaging_events = req.body.entry[0].messaging;
     console.log(JSON.stringify(messaging_events));
            for (i = 0; i < messaging_events.length; i++) {
                event = req.body.entry[0].messaging[i];
                sender = event.sender.id;
                if (event.message && event.message.text) {
                    text = event.message.text;
                        console.log('New message = '+text);
                    // Your Logic Replaces the following Line
                    //sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
                    sendTextMessage(sender,  text.substring(0, 200)); 
                }
                   // if(event)
                   //    console.log (event.toString());
            }
        }
        else if(req.body.entry[0].changes){
                page_changes=req.body.entry[0].changes;
                console.log(JSON.stringify(page_changes));
                 for (i = 0; i < page_changes.length; i++) {
                change_field = page_changes[i].field;
                change_value = page_changes[i].value;
                if (change_value  && change_value.item  && change_value.message  && change_value.sender_name  ) {
                   
                        console.log('New ' + change_value.item + ' =' + change_value.message);
                         console.log('from ' + change_value.sender_name);
                    // Your Logic Replaces the following Line
                    //sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
                  // sendTextComment(change_value.post_id,  change_value.message.substring(0, 200));
                        sendTextMessage(change_value.sender_id,  change_value.message.substring(0, 200));
                }
                   // if(event)
                   //    console.log (event.toString());
            }
               
        }
                
                
    res.sendStatus(200);
});

function sendTextMessage(sender, text) {        
        var reply="";
        //text=changeCase.lowerCase( text.toString().trim());
        text= text.toString().trim().toLowerCase();        
        
        if(text.toString().trim() === "hi")
        {  reply="Welcome!";}
        else if(text.toString().trim() === "help")
        {reply="At your service!";}
        else if(text.toString().trim() === "test")
        {        reply="Under construction!";}
        else if(text.toString().trim() === "bye")
        {reply="Have a nice day!";}
        else
        {reply='Unknown command! try ( hi, help, test, or bye).';}
        console.log('sendTextMessage: ' + sender + ' , ' + reply);
    messageData = {
        text:reply
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendTextComment(object_id, text) {        
        var reply="";
        //text=changeCase.lowerCase( text.toString().trim());
        text= text.toString().trim().toLowerCase();        
        
        if(text.toString().trim() === "hi")
        {  reply="Welcome!";}
        else if(text.toString().trim() === "help")
        {reply="At your service!";}
        else if(text.toString().trim() === "test")
        {        reply="Under construction!";}
        else if(text.toString().trim() === "bye")
        {reply="Have a nice day!";}
        else
        {
           //reply='Unknown command! try ( hi, help, test, or bye).';
           reply='Thanks for contacting LogicsWare. Please, go to private chat.';
        }
        
    messageData = {
        message:reply
    }
    request({
        url: 'https://graph.facebook.com/v2.6/'+ object_id +'/comments',
        //url: 'https://graph.facebook.com/v2.6/me/feed?message='+
        //reply +'&access_token='+PAGE_ACCESS_TOKEN,
        qs: {access_token:PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            message: reply,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  //console.log("Message data: ", event.message);
}
