// "use strict";

const Stomp = require('stompjs');

const Gossip = {};

Gossip.client = function(url, user) {
  console.log(url)
  console.log(user)
  let that;
  const ws = Stomp.client(url);
  console.log(ws)

  const destSendChat = "/app/chat";
  // const destSendWhisper = "/app/whisper";

  that = {
    user: user
  };

  that.connect = function(token) {
    const headers = {
      'token': token,
      'username': that.user.username,
      'avatar': that.user.avatar
    };
    return new Promise((resolve, reject) => ws.connect(headers, function(frame) {
      console.log(frame)
      resolve();
    }, function(error) {
      reject(error);
    }));
  };

  that.onreceive = function(message) {
    alert(message);
  };

  that.sendMessage = function(message) {
    console.log(that.channelKey);
    ws.send(destSendChat, {}, JSON.stringify({
      message: message.message,
      custom_type: message.custom_type,
      data: message.data,
      message_type: "MESSAGE",
      channel_key: that.channelKey,
      user: {
        id: that.user.id,
        username: that.user.username,
        avatar: null
      }
    }));
  };

  that.sendWhisperMessage = function(message) {

  };

  that.join = function(channelKey, receiveCallback) {
    that.channelKey = channelKey;
    that.destChat = "/topic/chat/" + channelKey;
    // that.destWhisper = "/topic/dm/" + channelKey + "/user/" + that.user.id;

    ws.subscribe(that.destChat, function(message) {
      var recv = JSON.parse(message.body);
      receiveCallback(recv);
    });

    // ws.subscribe(that.destWhisper, function(message) {});
  };

  that.leave = function() {
    if (that.destChat) {
      ws.unsubscribe(that.destChat)
    }

    if (that.destWhisper) {
      ws.unsubscribe(that.destWhisper)
    }
  };

  that.disconnect = function() {
    this.ws.disconnect();
  };

  return that;
};

export default Gossip
