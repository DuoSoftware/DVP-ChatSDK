'use strict';

(function () {
    window.onload = function () {
        document.getElementById("hopchat").style.display = 'none';
        document.getElementById("main").style.display = 'none';
        document.getElementById("logchat").style.display = '';


    };
})();

var $btn_join = document.getElementById('btnJoin'),
    $btn_connecting = document.getElementById('btnJoin');

var elementAction = function () {

    return {
        joinFormDisable: function () {
            $btn_join.classList.add('display-none');
            $btn_join.classList.remove('display-block');
        },
        joinConnectingLoading: function () {
            $btn_connecting.classList.add('display-block');
            $btn_connecting.classList.remove('display-none');
        },
        joinFormEnable: function () {
            //clear all chat
            document.getElementById("ndht").innerHTML = "";

            //change agent online mode
            document.getElementById("agentState").classList.remove('chat-online-agent');
            document.getElementById("agentState").classList.add('chat-offline-agent');

            $btn_connecting.classList.add('display-none');
            $btn_connecting.classList.remove('display-block');
            $btn_join.classList.add('display-block');
            $btn_join.classList.remove('display-none');

            document.getElementById("hopchat").style.display = 'none';
            document.getElementById("main").style.display = 'none';
            document.getElementById("logchat").style.display = '';

            var agentimgElement = document.getElementById("agentimg");
            var agentImgOnline = document.getElementById("agentImgOnline");
            agentimgElement.src = 'assets/img/profileAvatar.png';
            agentImgOnline.src = 'assets/img/profileAvatar.png';
            agentImgOnline.style.display = 'none';

            var agentElement = document.getElementById("agent");
            agentElement.innerText = 'connecting...';
            agentElement.classList.add("connecting");
            agentElement.classList.remove("online");

            var error_msg_body = document.getElementById("errorMsgBody");
            error_msg_body.style.display = '';

        },
        inti_load: function () {
            if (document.getElementById('chatBody'))
                document.getElementById('chatBody').style.display = 'none';
        }
    }
}();

elementAction.inti_load();

//open join form inside the chat panel
console.log('customer js loaded..');

function base64url(source) {
    var encodedSource = null;
    // Encode in classical base64
    encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
}

function getJsonWebToken(config) {
    var header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);

    /*------------------------*/

    var d = new Date();
    d.setDate(d.getDate() + 1);

    var data = {
        session_id: config.session_id,
        iss: config.name,
        iat: d,
        company: config.company,
        tenant: config.tenant,
        contact: config.address,
        channel: 'chat',
        jti: config.name,
        attributes: config.attributes, //  ["60"],
        priority: "0",
        name: config.name
    };

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);

    /*---------------------*/
    var signature = encodedHeader + "." + encodedData;
    signature = CryptoJS.HmacSHA256(signature, config.secret);
    signature = base64url(signature);

    return encodedHeader + "." + encodedData + "." + signature;
}

var OnConnected = function () {

    console.log("OnConnected..............");


    //company=103&tenant=1&veeryToken=abcdefgh
    var tok = decodeURIComponent(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURIComponent("veeryToken").replace(
        /[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    var company = decodeURIComponent(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURIComponent("company").replace(/[\.\+\*]/g,
        "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    var tenant = decodeURIComponent(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURIComponent("tenant").replace(/[\.\+\*]/g,
        "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

    var attributes = decodeURIComponent(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURIComponent("attributes").replace(/[\.\+\*]/g,
        "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    if (tok === "") {
        tok = "abcdefgh";
    }
    if (company === "") {
        company = 103;
    }
    if (tenant === "") {
        tenant = 1;
    }
    if (attributes === "" || attributes === "[]") {
        attributes = ["60"];
    }else{
        attributes = attributes.split(",")
    }

    var cData = {
        session_id: SE.uniqueId(),
        company: company,
        tenant: tenant,
        contact: "test",
        secret: tok,
        attributes: attributes,
        name: document.getElementById('chatname').value
    };


    var token = getJsonWebToken(cData); // decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent("veeryToken").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));


    SE.authenticate({
        success: function (data) {
            console.log("authenticated..............");
            //document.getElementById("hopchat").style.display = '';
            document.getElementById("main").style.display = '';
            document.getElementById("logchat").style.display = 'none';
        },
        error: function (data) {
            console.log("authenticate error..............");
        },
        token: token
    });

    var name = decodeURIComponent(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURIComponent("companyName").replace(
        /[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

    if (name) {
        //todo
        //var companyName = document.getElementById("companyName");
        //companyName.innerText = name;
    }

};

var OnEcho = function (o) {
    console.log("OnEcho..............");
};

var OnEvent = function (o) {
    console.log("OnEvent..............");
};


var OnStatus = function (o) {
    console.log("OnStatus..............--> " + JSON.stringify(o));
    //document.getElementById('presenceOth').innerText = JSON.stringify(o);

    if (o) {
        var objMedia = //document.getElementById("user");
            /*objMedia.options.length = 0;*/
            Object.keys(o).forEach(function (key, index) {
                if (key !== index.toString()) {

                    for (var i = 0; i < objMedia.options.length; i++) {
                        if (objMedia.options[i].value === key) {
                            objMedia.options[i].remove();
                        }
                    }
                    objMedia.options.add(new Option(key));

                }
            });
    }

};

var DisplayMessage = function (from, id, message, direction) {
    var usendht = document.getElementById("ndht");
    if (usendht) {
        if (direction === 'out') {
            var useDiv = document.createElement('div');
            useDiv.className = "khach";

            useDiv.innerHTML =
                '<img src="assets/img/profileAvatar.png" ' +
                ' width="25" alt="" class="img">' +
                '<div class="msg-view-wrp">' + message +
                ' <span id="' + id + '"> Sent at ' + (new Date()).toLocaleTimeString() +
                '</span> </div> ';

            usendht.appendChild(useDiv);
            useDiv.scrollIntoView();
        } else {

            var useDiv = document.createElement('div');
            useDiv.className = "admin";
            useDiv.innerHTML = '<img src=' + avatar + ' alt="" class="img"> ' +
                '<div class="msg-view-wrp">' + message +
                ' <span id="' + id + '"> Sent at ' + (new Date()).toLocaleTimeString() +
                '</span> </div> ';
            usendht.appendChild(useDiv);
            useDiv.scrollIntoView();
            seen(from, id);
        }

    }
};

var OnMessage = function (o) {
    console.log("OnMessage..............");
    //document.getElementById('typinglbl').value = "";
    //document.getElementById('newmsg').value = JSON.stringify(o);

    DisplayMessage(o.from, o.id, o.message, 'in');

};

var OnSeen = function (o) {
    console.log("OnSeen..............");
    var prvDiv = document.getElementById(o.id);
    if (prvDiv) {
        prvDiv.innerHTML = "✓ Seen at " + (new Date()).toLocaleTimeString(); // "thin dotted red"; //thick solid green DarkGoldenRod
    }

};

var OnTyping = function (o) {
    console.log("OnTyping..............--> " + JSON.stringify(o));
    document.getElementById('typing').style.display = '';

};

var OnTypingstoped = function (o) {
    console.log("OnTypingstoped..............");
    document.getElementById('typing').style.display = 'none';

};

var OnDisconnect = function (o) {
    console.log("OnDisconnect..............");
    ////document.getElementById("reconnect").style.display = '';
};

var clientInfo = {};
var OnClient = function (o) {
    console.log("OnClient..............");
    clientInfo = o;
    showhideclientconnect(true);
};

var OnError = function (o) {
    console.log("OnError..............");
};

var OnAccept = function (o) {
    console.log("OnAccept..............");
};

var avatar = '';
//aget online offline setSet


var OnAgent = function (o) {

    console.log("OnAgent..............");
    clientInfo = o;
    clientInfo.jti = o.name;

    var agentimgElement = document.getElementById("agentimg");
    var agentImgOnline = document.getElementById("agentImgOnline");
    agentimgElement.src = o.avatar;
    agentImgOnline.src = o.avatar;
    avatar = o.avatar;

    var agentElement = document.getElementById("agent");
    agentElement.innerText = o.name;
    agentElement.classList.remove("connecting");
    agentElement.classList.add("online");

    var connected_msg = document.getElementById("userMessageBody");
    var agent_state = document.getElementById("agentState");
    var error_msg_body = document.getElementById("errorMsgBody");
    var chat_body = document.getElementById("chatBody");
    var agent_state = document.getElementById("agentState");


    error_msg_body.style.display = 'none';
    chat_body.style.display = '';

    agent_state.classList.remove("chat-offline-agent");
    agent_state.classList.add("chat-online-agent");

    document.getElementById("hopchat").style.display = 'block';

    //  connected_msg.classList.remove('display-block');
    //connected_msg.classList.add('display-none');

    //change agent status ONLIE
    //agent_state.classList.remove("chat-offline-agent");
    //agent_state.classList.add("chat-online-agent ");

    //var agentElement = document.getElementById("greeting");
    //agentElement.innerText = '';

};

var OnSessionend = function (o) {
    console.log("OnSessionend..............");
};
var OnLeft = function (o) {
    console.log("OnLeft..............");
    disconnect();
};

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
    OnAccept: OnAccept,
    OnAgent: OnAgent,
    OnSessionend: OnSessionend,
    OnLeft: OnLeft,
    OnError: OnError

};

var connect = function () {
    elementAction.joinFormDisable();
    elementAction.joinConnectingLoading();
    //todo
    var $typing = document.getElementById('typing');
    document.getElementById('typing').style.display = 'none';
    SE.init({
        serverUrl: 'http://externalipmessagingservice.app.veery.cloud/',//'http://externalipmessagingservice.app.veery.cloud/' //'http://103.241.27.73:80/'
        callBackEvents: callBackEvents
    });
};


var disconnect = function () {
    SE.disconnect();


    elementAction.joinFormEnable();
};

var typing = function (event) {
    var message = {
        'to': clientInfo.jti,
        'from': clientInfo.jti
    };
    SE.typing(message);

    if (event.keyCode == 13) {
        sendMsg();
    }
};


function sendMsg() {
    var $text_msg = document.getElementById('ndc');
    var message = {
        'message': $text_msg.value,
        'type': "text"
    };
    var o = SE.sendmessagetocompany(message);

    DisplayMessage(o.to, o.id, o.message, 'out');
    $text_msg.value = '';

}

function setStatus() {
    /*var user = document.getElementById('presence');
     var message = {'presence': user.value};
     SE.status(message);*/
}

function seen(to, id) {
    var t = {
        to: to,
        id: id
    };
    SE.seen(t);
}

function request(req) {
    SE.request(req);
}

function clientconnect() {
    SE.acceptclient({
        jti: clientInfo.jti
    });
    showhideclientconnect(false);
}

function sessionend() {
    var t = {
        to: clientInfo.jti
    };
    SE.sessionend(t);
    //document.getElementById("sessionend").style.display = 'none';
}


//event on focus out
function onFocusOutChat() {
    var _obj = {
        to: clientInfo.jti
    };
    SE.typingstoped({to: _obj.to, from: _obj.to});
}

var autoLogin = function () {
    var email = decodeURIComponent(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURIComponent("email").replace(/[\.\+\*]/g,
        "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    if (email && email != "test@duo.lk") {
        document.getElementById('chatname').value = email;
        connect();
    }
};
autoLogin();