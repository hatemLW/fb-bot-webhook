var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.json());

//app.set('port', (process.env.APPSETTING_PORT || 5000));
//app.set('verify_token', (process.env.APPSETTING_VERIFY_TOKEN || 'TEST'));
//app.set('page_access_token', (process.env.APPSETTING_PAGE_ACCESS_TOKEN || 'NULL'));

//app.set('port',  5000);
//app.set('verify_token', 'TEST');
//app.set('page_access_token', ('EAAOlPqyA6G8BACwqDoewkvsQCUtimjsbIbCpl7CeuDhhABJNb20itWtBAAlTVdb8vaPQU7WXnV7Pgw41iZCvUw0nJv6lZA4JV2j1bvpZBxZBkSApXZA0fJ0gS3ckLZAS5MXIFXOKLyakZCXK2FRYacMZC139NYY5Ncfo6ZAoVEyvZALTY1XF3lF2ZCU'));
var FB_PORT = 5000;
//app.set('port', (FB_PORT || 5000));

app.set('port', (process.env.PORT || 5000));
//app.set('verify_token', (process.env.VERIFY_TOKEN || 'TEST'));
//app.set('page_access_token', (process.env.PAGE_ACCESS_TOKEN || 'NULL'));


var PAGE_ACCESS_TOKEN = 'EAAOlPqyA6G8BACwqDoewkvsQCUtimjsbIbCpl7CeuDhhABJNb20itWtBAAlTVdb8vaPQU7WXnV7Pgw41iZCvUw0nJv6lZA4JV2j1bvpZBxZBkSApXZA0fJ0gS3ckLZAS5MXIFXOKLyakZCXK2FRYacMZC139NYY5Ncfo6ZAoVEyvZALTY1XF3lF2ZCU';


app.get('/', function (req, res) {
        res.send('It Works! Follow FB Instructions to activate.');
        console.log('new request!');
});

app.get('/webhook', function (req, res) {
        //if (req.query['hub.verify_token'] === app.get('verify_token')) {
        if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {           
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.post('/webhook/', function (req, res) {
        console.log('new msg!');
    console.log (req.body);
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
                console.log('msg = '+text);
            // Your Logic Replaces the following Line
            //sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
            sendTextMessage(sender,  text.substring(0, 200));
        }
            if(event)
               console.log (event.toString());
    }
    res.sendStatus(200);
});

function sendTextMessage(sender, text) {
        
        var reply="";
        text=text.toString().trim();
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

app.listen(FB_PORT, function() {
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
  console.log("Message data: ", event.message);
}
