
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.set('verify_token', (process.env.VERIFY_TOKEN || 'TEST'));
app.set('page_access_token', (process.env.PAGE_ACCESS_TOKEN || 'NULL'));

var PAGE_ACCESS_TOKEN = 'EAAOlPqyA6G8BACwqDoewkvsQCUtimjsbIbCpl7CeuDhhABJNb20itWtBAAlTVdb8vaPQU7WXnV7Pgw41iZCvUw0nJv6lZA4JV2j1bvpZBxZBkSApXZA0fJ0gS3ckLZAS5MXIFXOKLyakZCXK2FRYacMZC139NYY5Ncfo6ZAoVEyvZALTY1XF3lF2ZCU';
//var PAGE_ACCESS_TOKEN2= 'EAAOlPqyA6G8BAKcCAY5v8sdb6Ou0etYuMVo1wFwtVSMeqpyVYVMMFoEZCWFpKvRAhFoqZAZC9cD4BfLjHAU603wBBtq0b4D7UT7ZBkIyH732vDf54ZCCmV1KuSb3bO9BvLuAGeKxj75lrYlk7v5KhkkiBtq2hFTkZD';
//var PAGE_ACCESS_TOKEN3= 'EAAOlPqyA6G8BAEDb2ZBfjMt46tvKdrOFdWEu2l7Ec8PXFgmxCMZAuZBFQ64lKsscNqHHlglnIOkWZA1u4ElEDADRjHog6YSfmZCjGaZCsqg4unCPeljoU9WSupHIWZBP531P65RHiLmLN5tvONZC3LQFe0OwJePxkDfqwDqQUrQoorQWOnBMp2SLAWsA3l42HHcZD';

var wsStr='wss://fbws.herokuapp.com';


const WebSocket = require('ws');
var ws;// = new WebSocket(wsStr, {  perMessageDeflate: false}); 

//var ws_openned=0;


function wsCreate()
{
	console.log("ws keep alive...");
	if (!ws || ws.readyState != WebSocket.OPEN)
	{
		console.log("ws creating...1");
		ws = new WebSocket(wsStr, { perMessageDeflate: false }); 
		console.log("ws creating...2");		
		
		ws.on('open', function open() {
		//ws_openned=1;
		console.log("lwFB.ChatBot Starting.");
		  ws.send('lwFB.ChatBot Starting.');
		});

		ws.on('message', function incoming(data, flags) {
		  // flags.binary will be set if a binary data is received. 
		  // flags.masked will be set if the data was masked. 
			console.log('new ws msg='+data + ' , with flags= ' + JSON.stringify(flags));
			var jData=JSON.parse(data);
			console.log('new ws msg='+jData.msg + ' , from = ' + jData.id);
			sendTextMessage(jData.id,  jData.msg.substring(0, 200));
		});
		ws.on('close', function close() {
			//ws_openned=0; 
			console.log("ws closed.");
			setTimeout(function(){ wsCreate();},1000);
		});
		console.log("ws creating...99");	
	}
}

/*function wsOpen()
{
	console.log("ws Opening...");
	if (ws.readyState != WebSocket.OPEN)
	{
		console.log("ws Opening...1");
		ws.open();
		console.log("ws Opening...2");		
	}
}*/

setInterval(function() { wsCreate();} , 5000);

app.get('/', function (req, res) {
        //res.send('It Works! Follow FB Instructions to activate.');
	console.log("Homepage");
	res.sendfile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));


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
	/* if (ws.readyState === WebSocket.OPEN)
	 {
		 console.log("ws sending...");
		 ws.send(JSON.stringify(messaging_events));	 		 
		 console.log("ws sent.");
	 }*/
     console.log(JSON.stringify(messaging_events));
            for (i = 0; i < messaging_events.length; i++) {
                event = req.body.entry[0].messaging[i];
                sender = event.sender.id;
                if (event.message && event.message.text && sender != '290317471356854') {
                    text = event.message.text;
                        console.log('New message = '+text);
                    // Your Logic Replaces the following Line
                    //sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
			
                    		sendTextMessage(sender, MessagePrepare(text).substring(0, 200));
			 if (ws.readyState === WebSocket.OPEN)
			 {
				 console.log("ws sending...");
				 ws.send(JSON.stringify(event));	 		 
				 console.log("ws sent.");
			 }
			else
			{
				setTimeout(function(){ wsOpen();},1000);
			}
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
                    //sendTextMessage(sender, "Text received, echo: "+ MessagePrepare(text).substring(0, 200));
                  sendTextComment(change_value.post_id,  change_value.message.substring(0, 200));
                     //    sendTextMessage(change_value.sender_id,  change_value.message.substring(0, 200));
                }
                   // if(event)
                   //    console.log (event.toString());
            }
               
        }
                
                
    res.sendStatus(200);
});

function MessagePrepare(text) {        
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
        return reply;
}

function sendTextMessage(sender, reply) {        
       
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
