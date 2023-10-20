# DVP-ChatSDK

2022/10/20 for setting local host and token
first set token as external-IpMessaging-typescript-migration branch in ipmessaging service..
assets/js/sdk/veery.chat.client.api.js--->line 27
accoridng to abov change ,token were replace in to
assets/js/chat-client.js--> line 536

to open html file in chat sdk -->external-ipmessaging/Demo/client/client%20copy.html

Facetone Chat SDK
SDK : https://github.com/DuoSoftware/DVP-ChatSDK/blob/Development/veery.chat.client.api.js

Dependency : https://cdn.socket.io/socket.io-1.4.5.js or
https://github.com/DuoSoftware/DVP-ChatSDK/blob/Development/socket.io-1.4.5.js

Method List
authenticate
init
sendmessage
sendmessagetocompany
request
seen
typing
acceptclient
disconnect
sessionend
status
typingstoped
uniqueId

Programing with Facetone Chat SDK
Initialize the engine
This is the first function to call in order to initialize the chat engines. You have to use an Call back events to be notified for the change
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
OnPending: OnPending, OnChatStatus: OnChatStatus
};

OnEcho _
OnEvent _
OnStatus
Receive all status updates
OnMessage
Receive message from Agent
var OnMessage = function (o) {
DisplayMessage(o.from, o.id, o.message, 'in');
};
OnSeen
Message read by other party
OnTyping
Client/agent typing message
OnTypingstoped
Client/agent stop typing
OnDisconnect
Connection lost/ chat end by other party
OnClient _
OnAccept _
OnAgent
Assign agent to chat/ chat request accepted
OnSessionend
Session ended by other party
OnExistingclient *
OnLeft
Other party left from chat
OnError
Fire if there is any error
*optional(no need to implement)

Register/login
Registering to the server is required in order to send messages.
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

Disconnect Chat
var disconnect = function () {
SE.disconnect();
};

Send Message
function send_message(msg) {
var message = {
'message': msg,
'type': "text"
};
var o = SE.sendmessagetocompany(message);
}

send message read acknowledgment
function send_acknowledgment(to, id) {
var t = {
to: to,
id: id
};
SE.seen(t);
}

Request method
You can request oldmessages, latestmessages
var oldmessages = function (requester, from, to, id, who) {
SE.request({type: 'previous', requester: requester, from: from, to: to, id: id, who: who});
};

var latestmessages = function (requester, from, who) {
SE.request({type: 'latestmessages', from: from, who: who});
};
