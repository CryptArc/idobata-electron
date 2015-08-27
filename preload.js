(function(){
  window.addEventListener('ready.idobata', function(e) {
    var container = e.detail.container;
    var pusher  = container.lookup('pusher:main');
    var session = container.lookup('service:session');
    var store   = container.lookup('service:store');

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
      var message = data.message

      // XXX 設定ファイルから読み込む
      var mode = window.idobataElectron.notificationMode || 'never';

      if (isNotify(mode, message.mentions)) {
        var title = data.message.sender_name;

        new Notification(title, {
          body: data.message.body_plain,
          icon: data.message.sender_icon_url
        });
      };
    }
  };
})();
