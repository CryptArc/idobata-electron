(function(){
  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;
    var pusher  = container.lookup('pusher:main');
    var session = container.lookup('service:session');
    var store   = container.lookup('store:main');

    pusher.bind('message:created', onMessageCreated(session, store));
  });

  var onMessageCreated = function(session, store) {
    var isNotify = function(mode, mentions) {
      switch (mode) {
        case 'all':
          return true;
        case 'mention':
          return (mentions.indexOf(parseInt(session.user.id)) >= 0) ? true : false
        case 'never':
          return false
      }
    }

    return function(data) {
      var mode = window.idobataElectron.notificationMode || 'never';

      if (isNotify(mode, data.message.mentions)) {
        var title = data.message.senderName;

        new Notification(title, {
          body: data.message.bodyPlain,
          icon: data.message.senderIconUrl
        });
      };
    }
  };
})();
