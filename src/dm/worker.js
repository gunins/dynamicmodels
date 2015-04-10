importScripts('./require.js');

require.config({
    baseUrl: './'
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

require(['./Channel'], function (Channel) {
    var channel = new Channel({
        peers: [self],
        evts: _events
    });
    _connected = true;
});