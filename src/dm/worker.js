importScripts('./require.js');

require.config({
    baseUrl: './',
    paths: {
        'dm/Channel': './Channel'
    }
});
var _events = [],
    _connected = false;

var listener = function (e) {
    _events.push(e);
    if (_connected) {
        self.removeEventListener('message', listener);
    }
};

if (!_connected) {
    self.addEventListener('message', listener);
}

require(['dm/Channel'], function (Channel) {
    var channel = new Channel({
        peers: [self],
        evts: _events
    });
    _connected = true;
});