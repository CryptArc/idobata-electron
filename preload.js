(function(){
  var onMessageCreated = function(session, store) {
    return function(data) {
      // TODO need to persist configuration changed…
      var mode = window.idobataElectron.notificationMode || 'never';
      var notify = false;

      if (mode == 'all') {
        notify = true;
      } else if (mode == 'mention') {
        mentions = data.message.mentions
        user = session.user.id

        if (data.message.mentions.indexOf(parseInt(session.user.id)) >= 0) {
          notify = true;
        }
      }

      if (notify) {
        var title = data.message.senderName;

        new Notification(title, {
          body: data.message.bodyPlain,
          icon: data.message.senderIconUrl
        });
      };
    }
  };

  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;
    var pusher  = container.lookup('pusher:main');
    var session = container.lookup('service:session');
    var store   = container.lookup('store:main');

    pusher.bind('message:created', onMessageCreated(session, store));
  });
})();
