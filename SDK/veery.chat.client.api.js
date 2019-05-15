/**
 * Created by Waruna on 1/13/2017.
 */

window.SE = function (e) {
    "use strict";
    var connected = false;
    var socket = {};
    var callBack = {};
    var t;

    function v(e, t) {
        var r = e[t];
        if (!r)throw t + " required";
        return r
    }

    function r(e) {
        if (!e)throw g;

        var r = v(e, "serverUrl");
        callBack = v(e, "callBackEvents");
        socket = io.connect(r,{'forceNew':true });

        socket.on('connect', function () {

            console.log("connected");
            if (callBack.OnConnected) {
                callBack.OnConnected();
            }
            //socket.emit('authenticate', {token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiMTdmZTE4M2QtM2QyNC00NjQwLTg1NTgtNWFkNGQ5YzVlMzE1Iiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE4OTMzMDI3NTMsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NjEyOTkxNTN9.YiocvxO_cVDzH5r67-ulcDdBkjjJJDir2AeSe3jGYeA"});

        });

        socket.on('echo', function (data) {
            console.log("OnEcho");
            if (callBack.OnEcho) {
                callBack.OnEcho(data);
            }
        });


        socket.on('event', function (data) {
            console.log("event");
            if (callBack.OnEvent) {
                callBack.OnEvent(data);
            }
        });

        socket.on('status', function (data) {
            console.log("status");
            if (callBack.OnStatus) {
                callBack.OnStatus(data);
            }
        });

        socket.on('callstatus', function (data) {
            console.log("status");
            if (callBack.OnCallStatus) {
                callBack.OnCallStatus(data);
            }
        });


        socket.on('tags', function (data) {
            console.log("tags");
            if (callBack.OnTags) {
                callBack.OnTags(data);
            }
        });






        socket.on('room:event', function (data) {
            console.log("dashboard event");
            if (callBack.OnDashBoardEvent) {
                callBack.OnDashBoardEvent(data);
            }
        });


        socket.on('allcallstatus', function (data) {
            console.log("allcallstatus");
            if (callBack.OnAllCallStatus) {
                callBack.OnAllCallStatus(data);
            }
        });

        socket.on('message', function (data) {
            console.log("message");
            if (callBack.OnMessage) {
                callBack.OnMessage(data);
            }

            // socket.emit('seen',{to: data.to, uuid: data.id});

        });


        socket.on('latestmessages', function (data) {
            console.log("latestmessages");
            if (callBack.OnLatestMessage) {
                callBack.OnLatestMessage(data);
            }

            // socket.emit('seen',{to: data.to, uuid: data.id});

        });


        socket.on('oldmessages', function (data) {
            console.log("oldmessages");
            if (callBack.OnOldMessages) {
                callBack.OnOldMessages(data);
            }

            // socket.emit('seen',{to: data.to, uuid: data.id});

        });





        socket.on('chatstatus', function (data) {
            console.log("chatstatus");
            if (callBack.OnChatStatus) {
                callBack.OnChatStatus(data);
            }

            // socket.emit('seen',{to: data.to, uuid: data.id});

        });

        socket.on('seen', function (data) {
            console.log("seen");
            if (callBack.OnSeen) {
                callBack.OnSeen(data);
            }
        });

        socket.on('typing', function (data) {
            console.log("typing");
            if (callBack.OnTyping) {
                callBack.OnTyping(data);
            }
        });

        socket.on('typingstoped', function (data) {
            console.log("typingstoped");
            if (callBack.OnTypingstoped) {
                callBack.OnTypingstoped(data);
            }
        });

        socket.on('disconnect', function (data) {
            connected = false;
            console.log("disconnect");
            if (callBack.OnDisconnect) {
                callBack.OnDisconnect(data);
            }
        });

        socket.on('client', function (data) {
            console.log("client");
            if (callBack.OnClient) {
                callBack.OnClient(data);
            }
        });

        socket.on('accept', function (data) {
            console.log("accept");
            if (callBack.OnAccept) {
                callBack.OnAccept(data);
            }
        });

        socket.on('pending', function (data) {
            console.log("pending");
            if (callBack.OnPending) {
                callBack.OnPending(data);
            }
        });

        socket.on('agent', function (data) {
            console.log("agent");
            clearTimeout(t);
            if (callBack.OnAgent) {
                callBack.OnAgent(data);
            }
        });

        socket.on('connectionerror', function(data){
            console.log("connectionerror");

            if(data === "no_agent_found"){
                t = setTimeout(function(){
                    socket.emit('retryagent',{});
                }, 10000);

            }
        });

        socket.on('existingclient', function(data){
            console.log("existingclient");
            if (callBack.OnExistingclient) {
                callBack.OnExistingclient(data);
            }
        });

        socket.on('sessionend', function(data){
            console.log("sessionend");
            socket.disconnect();
            socket.close();
            if (callBack.OnSessionend) {
                callBack.OnSessionend(data);
            }
        });

        socket.on('left', function(data){
            console.log("left");
            socket.disconnect();
            socket.close();
            if (callBack.OnLeft) {
                callBack.OnLeft(data);
            }
        });

        ////////////////////////////////////////////////notification API///////////////////////////////


        socket.on('notice_message', function (data) {
            data.messageType = "notice_message";
            if (callBack.OnEvent)
                callBack.OnEvent('notice_message',data);
        });

        socket.on('notice', function (data) {
            data.messageType="notice";

            if (callBack.OnEvent)
                callBack.OnEvent('notice',data);


        });

        socket.on('ticket', function (data) {
            data.messageType = "notice";
            if (callBack.OnEvent)
                callBack.OnEvent('notice',data);
        });

        socket.on('ticket_event', function (data) {

            if (callBack.OnTickerEvent)
                callBack.OnTickerEvent('ticket_event',data);
        });

        socket.on('broadcast', function (data) {

            data.messageType = "broadcast";
            if (callBack.OnEvent)
                callBack.OnEvent('notice_message',data);
        });

        socket.on('agent_connected', function (data) {
            data.messageType = "agent_connected";
            if (callBack.OnEvent)
                callBack.OnEvent('agent_connected', data);

        });

        socket.on('agent_found', function (data) {
            //var displayMsg = "Company : " + data.Company + "<br> Company No : " + values[5] + "<br> Caller : " + values[3] + "<br> Skill : " + values[6];
            if (callBack.OnEvent)
                callBack.OnEvent('agent_found',data);
            //console.log("Agent found data " + data);
        });

        socket.on('agent_disconnected', function (data) {
            data.messageType = "agent_disconnected";
            if (callBack.OnEvent)
                callBack.OnEvent('agent_disconnected',data);

        });

        socket.on('agent_rejected', function (data) {
            data.messageType = "agent_rejected";
            if (callBack.OnEvent)
                callBack.OnEvent('agent_rejected',data);

        });

        socket.on('agent_suspended', function (data) {
            data.messageType = "agent_suspended";
            if (callBack.OnEvent)
                callBack.OnEvent('agent_suspended',data);

        });

        socket.on('transfer_ended', function (data) {
            data.messageType = "transfer_ended";
            if (callBack.OnEvent)
                callBack.OnEvent('transfer_ended',data);

        });

        socket.on('transfer_trying', function (data) {
            data.messageType = "transfer_trying";
            if (callBack.OnEvent)
                callBack.OnEvent('transfer_trying',data);

        });

        socket.on('todo_reminder', function (data) {

            if (callBack.OnEvent)
                callBack.OnEvent('todo_reminder', data);


        });

        socket.on('preview_dialer_message', function (data) {
            if (callBack.OnEvent)
                callBack.OnEvent('preview_dialer_message',data);
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////



    }

    function n(e) {
        if (!e)throw g;

        var r = v(e, "token"), m = v(e, "success"), e = v(e, "error");
        socket.emit('authenticate', {token: r});

        socket.on('unauthorized', function (msg) {
            connected = false;
            console.log("unauthorized: " + JSON.stringify(msg.data));
            e(new Error(msg.data.type));
        });

        socket.on('authenticated', function () {
            connected = true;
            m("authenticated");
            socket.emit('status', {presence: 'online'});
        });


    }

    function d() {
        connected = false;
        socket.disconnect();
        socket = {};
        callBack = {};
        console.log("Disconnected.");
    }

    function rc() {
        //connected = false;
        socket.connect();
        console.log("Reconnect....");
    }

    function m(e) {
        if (!e)throw g;

        var r = v(e, "to"), m = v(e, "message"), t = v(e, "type"),s=v(e,"sessionId");
        var mediaType= e["mediaType"];
        var mediaName= e["mediaName"];
        if (connected) {
            // tell server to execute 'new message' and send along one parameter
            var msg = {
                to: r,
                message: m,
                type: t,
                id: uniqueId(),
                mediaType: mediaType,
                mediaName: mediaName,
                sessionId : s

            };
            socket.emit('message', msg);
            
            return msg;
        } else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function cm(e) {
        if (!e)throw g;

        var m = v(e, "message"), t = v(e, "type");
        if (connected) {
            // tell server to execute 'new message' and send along one parameter
            var msg = {
                to: 'company',
                message: m,
                type: t,
                id: uniqueId()
            };
            socket.emit('message', msg);

            return msg;
        } else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function s(e) {
        if (!e)throw g;

        var r = v(e, "to"), k = v(e, "id");
        if (connected) {
            socket.emit('seen', {to: r, id: k});
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function sb(e) {
        if (!e)throw g;

        var r = v(e, "room");
        if (connected) {
            socket.emit('subscribe', {room: r});
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function ub(e) {
        if (!e)throw g;

        var r = v(e, "room");
        if (connected) {
            socket.emit('unsubscribe', {room: r});
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function t(e) {
        if (!e)throw g;

        var r = v(e, "to");
        var f = v(e, "from");
        if (connected) {
            socket.emit('typing', {
                to: r,
                from: f
            });
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function a(e) {
        if (!e)throw g;

        var r = v(e, "to");
        var f = v(e, "from");
        if (connected) {
            socket.emit('typingstoped', {
                to: r,
                from: f
            });
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function c(e) {
        if (!e)throw g;
        var r = v(e, "jti");

        var obj = e;
        obj.to = r;
        if (connected) {
            socket.emit('accept', obj);
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function o(e) {
        if (!e)throw g;
        var r = v(e, "presence");
        var d = v(e, "presence_type");
        if (connected) {
            if(d){
                socket.emit('status', {presence: r, presence_type: d});
            }else{
                socket.emit('status', {presence: r});
            }

        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }




    function se(e) {
        if (!e)throw g;
        var r = v(e, "to");
        var re = v(e, "message");
        if (connected) {
            socket.emit('sessionend', {
                to: r,
                message: re
            });
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }



    function nt(e) {
        if (!e)throw g;
        var r = v(e, "to");
        var re = v(e, "message");
        if (connected) {
            socket.emit('tag', {
                to: r,
                message: re
            });
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function vm(e) {
        if (!e)throw g;
        var r = v(e, "type");
        if (connected) {
            if (r === "previous") {
                socket.emit('request', {request: 'oldmessages',requester:  v(e, "requester"),  from: v(e, "from"), to: v(e, "to"), id: v(e, "id"), who: v(e, "who")});
            }
            else if (r === "next") {
                socket.emit('request', {request: 'newmessages', from: v(e, "from"), to: v(e, "to"), id: v(e, "id"),  who: v(e, "who")});
            }
            else if (r === "allstatus") {
                socket.emit('request', {request: 'allstatus'});
            }
            else if (r === "allcallstatus") {
                socket.emit('request', {request: 'allcallstatus'});
            }
            else if (r === "latestmessages") {
                socket.emit('request', {request: 'latestmessages', from: v(e, "from"), who: v(e, "who")});
            }
            else if (r === "tags") {
                socket.emit('request', {request: 'tags', from: v(e, "from")});
            }
            else if (r === "pendingall") {
                socket.emit('request', {request: 'pendingall'});
            }
            else if (r === "chatstatus") {
                socket.emit('request', {request: 'chatstatus', from: v(e, "from")});
            }
            else {
                if (callBack.OnError) {
                    callBack.OnError({method: "viewmessage", message: "Invalid View Type."});
                }
            }
        }
        else {
            if (callBack.OnError) {
                callBack.OnError({method: "connection", message: "Connection Lost."});
            }
        }
    }

    function uniqueId() {
        return new Date().valueOf() + "-" + Math.random().toString(36).substr(2, 16);
    }

    var g = "must pass an object";
    return {
        "authenticate": n,
        "init": r,
        "sendmessage": m,
        "sendmessagetocompany": cm,
        "request": vm,
        "seen": s,
        "typing": t,
        "acceptclient": c,
        "disconnect": d,
        "sessionend": se,
        "tag": nt,
        "status": o,
        "typingstoped": a,
        "reconnect": rc,
        "subscribe": sb,
        "unsubscribe": ub
    }
}();
