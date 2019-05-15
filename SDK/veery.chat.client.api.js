/**
 * Created by Damith on 1/18/2017.
 */

agentApp.directive('chatTabDirective', function ($rootScope,$window, chatService, authService) {
        return {
            restrict: "EA",
            scope: {
                chatUser: "=",
                selectedChatUser: "=",
                loginName: "=",
                loginAvatar: "=",
                getChatRandomId: '&',
                showAutoHideChat: '&',
                chatTemplates: "="
            },
            templateUrl: 'app/views/chat/chat-view.html',
            link: function (scope, ele, attr) {


                //console.log(scope.chatTemplates);
                scope.chatUser.last_msg_recive = new Date();
                scope.uploadedFile = undefined;
                scope.userCompanyData = authService.GetCompanyInfo();
                scope.fileNameChanged = function (element) {
                    //alert("select file");

                    scope.uploadedFile = element.files[0];
                    sendFile(scope.chatUser, element.files[0])
                };

                scope.selectFile = function () {
                    $("#"+scope.file_id).click();
                };

                scope.msgObj = {};

                scope.uploadFile = undefined;

                scope.loadingOld = false;

                scope.add = function () {
                    var f = document.getElementById('file').files[0],
                        r = new FileReader();
                    r.onloadend = function (e) {
                        var data = e.target.result;
                        //send your binary data via $http or $resource or do anything else with it
                    }
                    r.readAsBinaryString(f);
                }

                scope.isTempViewer = false;

                scope.showTemplatePanel = function () {

                    scope.showTemplateModal = !scope.showTemplateModal;

                }


                scope.options = {
                    watchEmbedData: true,     // watch embed data and render on change

                    sanitizeHtml: true,      // convert html to text

                    fontSmiley: false,      // convert ascii smileys into font smileys
                    emoji: false,      // convert emojis short names into images

                    link: true,      // convert links into anchor tags
                    linkTarget: '_blank',   //_blank|_self|_parent|_top|framename

                    pdf: {
                        embed: true                 // show pdf viewer.
                    },

                    image: {
                        embed: true                // toggle embedding image after link, supports gif|jpg|jpeg|tiff|png|svg|webp.
                    },

                    audio: {
                        embed: true                 // toggle embedding audio player, supports wav|mp3|ogg
                    },

                    basicVideo: true,     // embed video player, supports ogv|webm|mp4
                    gdevAuth: 'AIzaSyCWprXMfIcPIQGf_gp-txCEBb9_IZPhRJo', // Google developer auth key for YouTube data api
                    video: {
                        embed: true,    // embed YouTube/Vimeo videos
                        width: null,     // width of embedded player
                        height: null,     // height of embedded player
                        ytTheme: 'dark',   // YouTube player theme (light/dark)
                        details: false,    // display video details (like title, description etc.)
                        thumbnailQuality: 'medium', // quality of the thumbnail low|medium|high
                        autoPlay: true     // autoplay embedded videos
                    },
                    twitchtvEmbed: false,
                    dailymotionEmbed: true,
                    tedEmbed: true,
                    dotsubEmbed: true,
                    liveleakEmbed: true,
                    ustreamEmbed: true,

                    soundCloudEmbed: true,
                    soundCloudOptions: {
                        height: 160,
                        themeColor: 'f50000',
                        autoPlay: false,
                        hideRelated: false,
                        showComments: true,
                        showUser: true,
                        showReposts: false,
                        visual: false,         // Show/hide the big preview image
                        download: false          // Show/Hide download buttons
                    },
                    spotifyEmbed: true,

                    tweetEmbed: false,        // toggle embedding tweets
                    tweetOptions: {
                        // The maximum width of a rendered Tweet in whole pixels. Must be between 220 and 550 inclusive.
                        maxWidth: 550,
                        // Toggle expanding links in Tweets to photo, video, or link previews.
                        hideMedia: false,
                        // When set to true or 1 a collapsed version of the previous Tweet in a conversation thread
                        // will not be displayed when the requested Tweet is in reply to another Tweet.
                        hideThread: false,
                        // Specifies whether the embedded Tweet should be floated left, right, or center in
                        // the page relative to the parent element.Valid values are left, right, center, and none.
                        // Defaults to none, meaning no alignment styles are specified for the Tweet.
                        align: 'none',
                        // Request returned HTML and a rendered Tweet in the specified.
                        // Supported Languages listed here (https://dev.twitter.com/web/overview/languages)
                        lang: 'en'
                    },

                    code: {
                        highlight: false,        // highlight code written in 100+ languages supported by highlight
                        // requires highlight.js (https://highlightjs.org/) as dependency.
                        lineNumbers: false        // display line numbers
                    },
                    codepenEmbed: true,
                    codepenHeight: 300,
                    jsfiddleEmbed: true,
                    jsfiddleHeight: 300,
                    jsbinEmbed: true,
                    jsbinHeight: 300,
                    plunkerEmbed: true,
                    githubgistEmbed: true,
                    ideoneEmbed: true,
                    ideoneHeight: 300
                };


                scope.watchOptions = {};
                angular.copy(scope.options, scope.watchOptions);
                scope.watchOptions.watchEmbedData = true;
                scope.progress;


                scope.msgObj.chatText = "";
                scope.chatUser.chatcount = 0;
                scope.chatUser.isChatLoding = false;
                scope.chatUser.windowMimOption = true;
                scope.chatUser.position = 0;
                scope.openNav = true;

                scope.chatWindowId = scope.getChatRandomId();
                scope.file_id = scope.chatWindowId +"file";

                scope.$on("updates", function () {
                    setUpChatWindowPosition(true);
                });

                scope.$on("opennav", function () {
                    scope.openNav = true;
                    setUpChatWindowPosition();
                });

                scope.$on("closenav", function () {
                    scope.openNav = false;
                    setUpChatWindowPosition();
                });

                //get chat body scroll event
                var minimuChatWidnow = function (currentChtW) {
                    $('#' + scope.chatWindowId).animate({
                        bottom: "-344"
                    }, 300);
                    scope.chatUser.windowMimOption = false;
                };

                var maximuChatWindow = function (currentChtW) {
                    $('#' + scope.chatWindowId).animate({
                        bottom: "0"
                    }, 300);
                    scope.chatUser.windowMimOption = true;
                    $('#' + scope.chatWindowId + " .cht-header").removeClass('rec-new-msg-blink');


                    ////////////////////////////////////////////////////////////////////////////////////

                    var pendingMessages = scope.chatUser.messageThread.filter(function (item) {

                        return item.status == 'delivered';

                    });

                    if (pendingMessages && Array.isArray(pendingMessages))
                        pendingMessages.forEach(function (msg) {

                            SE.seen({to: scope.chatUser.username, id: msg.id});
                        });

                    /////////////////////////////////////////////////////////////////////////////////////////
                };

                var msgBodyScrollFun = function () {
                    return {
                        getDivId: function () {
                            return scope.chatUser._id;
                        },
                        goToScrollDown: function () {
                            var objDiv = document.getElementById(scope.chatUser._id);
                            if (objDiv)
                                objDiv.scrollTop = objDiv.scrollHeight;
                        },
                        goToNewMsgScroller: function (msg) {
                            var objDiv = document.getElementById(msg._id);
                            $('#' + msg._id).animate({scrollTop: div_terms.top}, "slow");
                        }
                    }
                }();


                // //UI function
                var chatWindowPosition = function () {
                    if (scope.selectedChatUser.length == 1) {
                        //$('#' + scope.chatUser.username).setAttribute("style", "left:" + 18 + "%");
                    }
                };
                chatWindowPosition();

                // check Agent Console is focus or not.
                scope.focusOnTab = true;
                angular.element($window).bind('focus', function () {
                    scope.focusOnTab = true;
                    console.log('Console Focus......................');
                }).bind('blur', function () {
                    scope.focusOnTab = false;
                    console.log('Console Lost Focus......................');
                });

                scope.showChromeNotification = function (msg, duration,focusOnTab) {
                    if (!focusOnTab) {
                        showNotification(msg, duration);
                    }
                };

                var curretChatDate = moment(new Date()).format('l');
                chatService.SubscribeChat(scope.chatUser.username, function (type, message) {
                    switch (type) {
                        case 'message':
                            //msgBodyScrollFun.goToNewMsgScroller(message);
                            message.time = moment(message.time).format('hh:mm:ss a');
                            if (!scope.chatUser.windowMimOption) {
                                $('#' + scope.chatWindowId + " .cht-header").addClass('rec-new-msg-blink');
                                message.status = 'delivered';
                                var audio = new Audio('assets/sounds/chattone.mp3');
                                audio.play();
                            } else {
                                SE.seen({to: scope.chatUser.username, id: message.id});
                                message.status = 'seen';
                            }
                            scope.chatUser.messageThread.push(message);
                            console.log(scope.chatUser.messageThread);
                            scope.chatUser.last_msg_recive = new Date();
                            scope.showChromeNotification("You Received Message From " + scope.chatUser.username, 15000,scope.focusOnTab);
                            break;
                        case 'typing':
                            scope.chatUser.typing = true;
                            break;

                        case 'chatstatus':
                            //console.log(message);
                            if (message && message.lastseen) {
                                scope.chatUser.lastseen = message.lastseen;
                            }
                            break;

                        case 'typingstoped':
                            scope.chatUser.typing = false;
                            break;
                        case 'seen':
                            //console.log(message);
                            var seenMess = scope.chatUser.messageThread.filter(function (mes) {
                                return mes.id == message.id;
                            });

                            if (Array.isArray(seenMess)) {
                                seenMess.forEach(function (seeM) {
                                    ///var status = 'notdelivered'
                                    seeM.time = moment(new Date()).format('hh:mm:ss a');
                                    seeM.status = message.status;
                                });
                            }
                            break;
                        case 'latestmessages':
                            scope.chatUser.isChatLoding = true;
                            scope.chatUser.messageThread = [];

                            if (message && message.messages && message.messages.length != 0) {

                                var oldest = moment(message.messages[0].created_at);

                                message.messages.forEach(function (message, i) {
                                    message.message = message.data;
                                    message.id = message.uuid;
                                    message['time'] = moment(message.created_at).format('hh:mm:ss a');

                                    var varDate = moment(message.created_at);
                                    message['currentChatDate'] = '';

                                    if (i == 0) {
                                        message['currentChatDate'] = moment(message.created_at).format('l');
                                    }

                                    if (oldest.isBefore(varDate, 'day')) {
                                        oldest = varDate;
                                        message['currentChatDate'] = moment(message.created_at).format('l');
                                        // console.log(varDate);
                                    }


                                    scope.$apply(function () {
                                        scope.chatUser.messageThread.push(message);
                                    });
                                    if (message.status != 'seen' && message.from == scope.chatUser.username) {
                                        SE.seen({to: scope.chatUser.username, id: message.uuid});
                                    }
                                });
                                scope.chatUser.isChatLoding = false;
                                msgBodyScrollFun.goToScrollDown();
                            }

                            break;

                        case 'oldmessages':

                            if (scope.chatUser && scope.chatUser.messageThread && scope.chatUser.messageThread.length != 0
                                && message && message.messages && message.messages.length != 0) {
                                var latest = moment(scope.chatUser.messageThread[0].created_at);
                                var topMessageInList = moment(message.messages[0].created_at);

                                if (latest.isSame(topMessageInList, 'day')) {

                                    scope.chatUser.messageThread[0]['currentChatDate'] = '';

                                }


                                message.messages.forEach(function (_message) {
                                    _message.message = _message.data;
                                    _message.id = _message.uuid;


                                    var varDate = moment(_message.created_at);
                                    if (latest.isAfter(varDate, 'day')) {
                                        latest = varDate;
                                        scope.chatUser.messageThread[0]['currentChatDate'] = moment(scope.chatUser.messageThread[0].created_at).format('l');
                                        // console.log(varDate);
                                    }

                                    scope.chatUser.messageThread.unshift(_message);
                                    if (_message.status != 'seen' && _message.from == scope.chatUser.username) {
                                        SE.seen({to: scope.chatUser.username, id: _message.uuid});
                                    }
                                });

                                scope.chatUser.messageThread[0]['currentChatDate'] = moment(scope.chatUser.messageThread[0].created_at).format('l');

                                scope.loadingOld = false;
                            }

                            break;

                        case 'tags':
                            //onload tags
                            scope.tagList = message;
                            break;

                    }
                });

                //chatService.Request('latestmessages', scope.chatUser.username);
                var userType = scope.chatUser.type;
                if (!userType)
                    userType = "agent";

                chatService.LatestMessages('latestmessages', scope.chatUser.username, userType);

                chatService.Request('chatstatus', scope.chatUser.username);

                if (userType == 'client') {

                    //click event chat tags loading
                    chatService.Request('tags', scope.chatUser.username);
                }

                scope.chatUser.messageThread = [];
                //user on type
                scope.onFocusChat = function (user) {
                    SE.typing({to: scope.chatUser.username, from: scope.loginName,data:scope.chatUser});
                };

                scope.onFocusOutChat = function (user) {

                    SE.typingstoped({to: scope.chatUser.username, from: scope.loginName,data:scope.chatUser});
                };

                var sendMessage = function (user, msg) {
                    if (user) {

                        // scope.safeApply(function () {
                        //     scope.chatTxt = null;
                        // });

                        var message = {'to': user.username, 'message': msg, 'type': "text" ,'sessionId': user.sessionId};
                        var ms = SE.sendmessage(message);
                        scope.chatUser.messageThread.push(ms);
                        scope.msgObj.chatText = "";
                        SE.typingstoped({to: scope.chatUser.username, from: scope.loginName,data:user});
                        scope.chatUser.last_msg_recive = new Date();

                    }
                };

                function uploadComplete(evt) {
                    /* This event is raised when the server send back a response */
                    //alert(evt.target.responseText)

                    var responseObj = JSON.parse(evt.target.responseText);

                    var msg = baseUrls.fileService + "InternalFileService/File/Download/"
                        + scope.userCompanyData.tenant + "/" + scope.userCompanyData.company + "/" +
                        responseObj.Result + "/" + scope.uploadedFile.name;

                    var message = {
                        'to': scope.chatUser.username,
                        'message': msg,
                        'type': "link",
                        'mediaType': scope.uploadedFile.type,
                        'mediaName': scope.uploadedFile.name
                    };
                    var ms = SE.sendmessage(message);
                    scope.chatUser.messageThread.push(ms);

                    scope.uploadedFile = undefined;
                    scope.progressVisible = false;
                    scope.progress = 0;
                }

                function uploadFailed(evt) {
                    //alert("There was an error attempting to upload the file.")
                    scope.progressVisible = false;
                    scope.progress = 0;
                    scope.uploadedFile = undefined;
                }

                scope.progressVisible = false;
                function uploadCanceled(evt) {
                    scope.$apply(function () {
                        scope.progressVisible = false
                    });
                    //alert("The upload has been canceled by the user or the browser dropped the connection.")

                    scope.uploadedFile = undefined;
                }

                function uploadProgress(evt) {
                    scope.$apply(function () {
                        if (evt.lengthComputable) {
                            scope.progress = Math.round(evt.loaded * 100 / evt.total)
                        } else {
                            scope.progress = 0;
                        }
                    })
                }


                var sendFile = function (user, file) {
                    if (user) {

                        var url = baseUrls.fileService + "FileService/File/Upload";

                        //file.Category = "CHAT_ATTACHMENTS"
                        var fd = new FormData();
                        fd.append("files", file);
                        fd.append("fileCategory", "CHAT_ATTACHMENTS");

                        var xhr = new XMLHttpRequest()
                        xhr.upload.addEventListener("progress", uploadProgress, false)
                        xhr.addEventListener("load", uploadComplete, false)
                        xhr.addEventListener("error", uploadFailed, false)
                        xhr.addEventListener("abort", uploadCanceled, false)
                        xhr.open("POST", url);
                        xhr.setRequestHeader("Authorization", authService.GetToken());
                        scope.progressVisible = true;
                        xhr.send(fd);
                    }
                };

                scope.onKeyPressed = function ($event, user, msg) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        sendMessage(user, $event.target.value);
                        $event.target.value = "";
                    }
                };

                /*scope.chatObj = {
                 chatText: ""
                 }*/


                scope.updateSmilies = function (code) {

                    //console.log(code);
                    scope.msgObj.chatText += code;
                };

                scope.addChatTemplate = function (code) {
                    ////console.log(code);
                    scope.showTemplatePanel();
                    scope.msgObj.chatText += code;

                };


                scope.getMoreChats = function () {

                    //console.log('more chats');

                    if (scope.chatUser.messageThread && scope.chatUser.messageThread.length > 0) {
                        if (!scope.loadingOld) {
                            scope.loadingOld = true;

                            var userType = scope.chatUser.type;
                            if (!userType)
                                userType = "agent";

                            chatService.OldMessages(scope.chatUser.username, scope.chatUser.messageThread[0].from, scope.chatUser.messageThread[0].to,
                                scope.chatUser.messageThread[0].id, userType);
                        }
                    }
                }

                //set chat windows position
                var position = 0,
                    screenSize = 0,
                    rightNav = 0;

                /*
                 var setUpChatWindowPosition = function () {
                 if (scope.selectedChatUser.length == 1) {
                 position = 266;
                 }
                 if (scope.selectedChatUser.length == 2) {
                 position = 545;
                 }
                 if (scope.selectedChatUser.length == 3) {
                 position = 830;
                 }
                 scope.chatUser.position = position + "px";
                 };
                 */

                var setUpChatWindowPosition = function () {
                    var start = 0;
                    if (scope.openNav) {
                        start = 230;
                    }
                    position = start + scope.chatUser.index * 260 + scope.chatUser.index * 20;
                    var width = window.innerWidth ||
                        document.documentElement.clientWidth ||
                        document.body.clientWidth;

                    scope.chatUser.position = position + "px";
                    if (width <= position + 400) {
                        chatService.DelFirstUser();
                    }
                };

                //chat window option ------
                scope.closeThisChat = function (currentChtW) {

                    chatService.DelChatUser(currentChtW.username);
                    currentChtW.user_in_chat = 2;
                    scope.showAutoHideChat();
                    // $('#' + currentChtW.username).addClass('slideInRight')
                    // .removeClass('slideInLeft');
                    //reArrangeChatWindow();
                    // $('#' + currentChtW.username).animate({
                    //     bottom: "-390"
                    // });
                };


                scope.minimusChatW = function () {
                    minimuChatWidnow();
                };
                scope.maximusChatW = function () {
                    maximuChatWindow();
                };

                scope.$on('$destroy', function () {
                    console.log("destroy ");
                });


                setUpChatWindowPosition();

                /**** client to agent chat *****/
                scope.acceptClient = function (client) {

                    //delete client['messageThread'];
                    var clientObj = {};
                    clientObj.jti = client.jti;
                    clientObj.to = client.to;
                    clientObj.type = client.type;
                    clientObj.status = client.status;
                    clientObj.username = client.username;
                    clientObj._id = client._id;
                    clientObj.firstname = client.firstname;
                    clientObj.company = client.company;
                    clientObj.tenant = client.tenant;
                    clientObj.lastname = client.lastname;
                    clientObj.profile = client.profile;
                    clientObj.sessionId = client.sessionId;

                    if (client.channel) {
                        clientObj.channel = client.channel;
                    }

                    SE.acceptclient(clientObj);
                    client.isNewChat = false;

                    //chatService.LatestMessages('latestmessages', scope.chatUser.username, userType);
                };

                scope.ignoreChat = function (currentChtW) {
                    chatService.DelChatUser(currentChtW.username);
                    // chatService.DisconnectChat();
                };

                scope.openProfile = function () {
                    var notifyData = {
                        tabType: 'engagement',
                        index: scope.chatUser.jti,
                        company: scope.chatUser.company,
                        direction: 'inbound',
                        channel_from: scope.chatUser.firstname,
                        channel_to: scope.loginName,
                        channel: 'chat',
                        skill: '',
                        engagement_id: scope.chatUser.jti,
                        userProfile: undefined
                    };

                    if (scope.chatUser.name) {
                        notifyData.channel_from = scope.chatUser.firstname;
                    }

                    if (scope.chatUser.channel) {
                        notifyData.channel = scope.chatUser.channel;
                    }

                    if (scope.chatUser.contact) {
                        notifyData.raw_contact = scope.chatUser.contact;
                    }


                    //var notifyData = {
                    //    tabType: 'engagement',
                    //    index: scope.chatUser.jti,
                    //    company: scope.chatUser.company,
                    //    direction: 'inbound',
                    //    channel_from: scope.chatUser.firstname,
                    //    channel_to: scope.loginName,
                    //    channel: 'chat',
                    //    skill: '',
                    //    engagement_id: scope.chatUser.jti,
                    //    userProfile: undefined
                    //    userProfile: undefined
                    //};


                    if (scope.chatUser.session_id) {
                        notifyData.engagement_id = scope.chatUser.session_id;
                    }
                    $rootScope.$emit('openNewTab', notifyData);

                };


                //create new profile
                scope.createNewProfile = function () {
                    scope.openProfile();
                };

                //disconnect session
                scope.clientChatEndSession = function (client) {
                    if (scope.msgObj.chatText) {
                        SE.sessionend({to: client.username, message: scope.msgObj.chatText,data:client});
                        chatService.DelChatUser(client.username);
                        chatService.DelClientUser(client.username);
                    } else {
                        console.log('agent not found...');
                    }

                };


                //save tag into list
                scope.clientChatTagSession = function (client) {
                    if (scope.msgObj.chatText) {
                        SE.tag({to: client.username, message: scope.msgObj.chatText});

                        ///add tags
                        //chatService.DelChatUser(client.username);
                        //chatService.DelClientUser(client.username);
                    } else {

                        //no tag has added
                    }
                };

                scope.tagList = {"tags": []};
                scope.onKerPressAddTag = function ($event, client) {
                    var keyCode = $event.which || $event.keyCode;
                    if (keyCode === 13) {
                        if (scope.msgObj.tabTxt) {
                            SE.tag({to: client.username, message: scope.msgObj.tabTxt});
                            scope.tagList.tags.push({"data": scope.msgObj.tabTxt});
                            scope.msgObj.tabTxt = "";
                        }
                        $event.target.value = "";
                    }
                };


                scope.safeApply = function (fn) {
                    var phase = this.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };


                //chat progress bar
                scope.circleOptions = {
                    color: '#FCBB33',
                    duration: 2000,
                    easing: 'easeInOut'
                };


                //chat tag model
                scope.openChatTagView = function () {
                    scope.isOpentagPanel = !scope.isOpentagPanel;
                };

            }
        }
    }
).directive('enterSendChat', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.chatTxt = null;
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
}).directive('emptyToNull', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function (viewValue) {
                if (viewValue === "") {
                    return null;
                }
                return viewValue;
            });
        }
    };
}).directive('tempEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.tempEnter);
                });
                event.preventDefault();
            }
        });
    };
}).directive('enterAddTag', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.chatTxt = null;
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
})


agentApp.directive('emojiInitiator', function () {


    return {
        restrict: 'A',
        link: {
            post: function (scope, elem, attrs, ctrl) {


                elem.emojiPicker({
                    width: '300px',
                    height: '200px'
                });

            }
        }

    }


})
