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

function send_message() {
    var message = {
        'message': $text_msg.value,
        'type': "text"
    };
    var o = SE.sendmessagetocompany(message);
}

var OnMessage = function (o) {
    DisplayMessage(o.from, o.id, o.message, 'in');
};

function send_acknowledgment(to, id) {
    var t = {
        to: to,
        id: id
    };
    SE.seen(t);
}

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
    OnChatStatus: OnChatStatus
};

var oldmessages = function (requester, from, to, id, who) {
    SE.request({type: 'previous', requester: requester, from: from, to: to, id: id, who: who});
};


var latestmessages = function (requester, from, who) {
    SE.request({type: 'latestmessages', from: from, who: who});
};


var newmessages = function (requester, from, who) {
    SE.request({type: 'next', from: from, to: to, id: id, who: who});
};


var status = function (presence, presence_type) {
    SE.status({presence: presence, presence_type: presence_type});
};