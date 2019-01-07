# DVP-ChatSDK

Facetone Chat SDK
SDK : https://github.com/DuoSoftware/DVP-ChatSDK/blob/Development/veery.chat.client.api.js

Dependency : https://cdn.socket.io/socket.io-1.4.5.js or
https://github.com/DuoSoftware/DVP-ChatSDK/blob/Development/socket.io-1.4.5.js

•	Method List
o	authenticate
o	init
o	sendmessage
o	sendmessagetocompany
o	request
o	seen
o	typing
o	acceptclient
o	disconnect
o	sessionend
o	status
o	typingstoped
o	uniqueId

•	Programing with Facetone Chat SDK
o	Initializing the engine
This is the first function to call to initialize the chat engine. You have to use Call back events in order to receive notifications for changes.
SE.init({
    serverUrl:'http://externalipmessagingservice.app.veery.cloud/', 
    callBackEvents: callBackEvents
});

var callBackEvents = {
    OnConnected: OnConnected,
    OnEcho: OnEcho,
    OnEvent: OnEvent,
    OnStatus: OnStatus,
    OnMessage: OnMessage, 
    OnSeen: OnSeen,
    OnTyping: OnTyping,
    OnTypingstoped: OnTypingstoped,
    OnDisconnect: OnDisconnect,
    OnClient: OnClient,
    OnExistingclient: OnExistingclient,
    OnSessionend: OnSessionend,
    OnLeft: OnLeft,
    OnAccept: OnAccept,   
    OnError: OnError,
	OnOldMessages: OnOldMessages,
    OnLatestMessage: OnLatestMessage,
    OnPending: OnPending,
    OnChatStatus: OnChatStatus };

o	OnEcho *
o	OnEvent *
o	OnStatus
	Receive all status updates 
o	OnMessage
	Receive message from Agent
var OnMessage = function (o) {
    DisplayMessage(o.from, o.id, o.message, 'in');
};
	
o	OnSeen
	Message read by other party 
o	OnTyping
	Client/agent typing message
o	OnTypingstoped
	Client/agent stop typing
o	OnDisconnect
	Connection lost 
o	OnClient *
o	OnAccept *
o	OnAgent *
o	OnSessionend 
	Session ended by other party 
o	OnExistingclient *
o	OnLeft
	Other party left from chat
o	OnError
	Fire if an error occurs. 

 		* optional(no need to implement)

o	Register/login
Registering on the server is required to send messages.
var OnConnected = function () {
    
    SE.authenticate({
        success: function (data) {
            console.log("authenticated..............");
        },
        error: function (data) {
            console.log("authenticate error..............");
        },
        token: token
    });
};

token : JWT TOKEN
o	Disconnect Chat
var disconnect = function () {
    SE.disconnect();
};

o	Send Message 
function send_message(msg) {
    var message = {
        'message': msg,
        'type': "text"
    };
    var o = SE.sendmessagetocompany(message);
}

o	Send message read acknowledgment
function send_acknowledgment(to, id) {
    var t = {
        to: to,
        id: id
    };
    SE.seen(t);
}

o	Request method
	You can request oldmessages, latestmessages
var oldmessages = function (requester, from, to, id, who) {
    SE.request({type: 'previous', requester: requester, from: from, to: to, id: id, who: who});
};


var latestmessages = function (requester, from, who) {
    SE.request({type: 'latestmessages', from: from, who: who});
};



 
