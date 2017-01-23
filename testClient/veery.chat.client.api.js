/**
 * Created by Waruna on 1/13/2017.
 */

window.SE = function (e) {
    "use strict";
    var connected = false;
    var socket = {};
    var callBack = {};

    function v(e, t) {
        var r = e[t];
        if (!r)throw t + " required";
        return r
    }

    function r(e) {
        if (!e)throw g;

        var r = v(e, "serverUrl");
        callBack = v(e, "callBackEvents");
        socket = io(r);

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
        socket = {};
        callBack = {};
        console.log("Disconnected.");
    }

    function m(e) {
        if (!e)throw g;

        var r = v(e, "to"), m = v(e, "message"), t = v(e, "type");
        if (connected) {
            // tell server to execute 'new message' and send along one parameter
            var msg = {
                to: r,
                message: m,
                type: t,
                id: uniqueId()
            }
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
        if (connected) {
            socket.emit('accept', {to: r});
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
        if (connected) {
            socket.emit('status', {presence: r});
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
                socket.emit('request', {request: 'oldmessages', from: v(e, "from"), to: v(e, "to"), id: v(e, "id")});
            }
            else if (r === "next") {
                socket.emit('request', {request: 'newmessages', from: v(e, "from"), to: v(e, "to"), id: v(e, "id")});
            }
            else if (r === "allstatus") {
                socket.emit('request', {request: 'allstatus'});
            }
            else if (r === "latestmessages") {
                socket.emit('request', {request: 'latestmessages', from: v(e, "from")});
            }
            else if (r === "pendingall") {
                socket.emit('request', {request: 'pendingall'});
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
        "request": vm,
        "seen": s,
        "typing": t,
        "acceptclient": c,
        "disconnect": d,
        "status": o,
        'typingstoped': a
    }
}();