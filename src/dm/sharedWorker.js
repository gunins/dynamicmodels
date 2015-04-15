importScripts('./require.js');

require.config({
    baseUrl: '../'
});

var _peers = [],
    _evts = [],
    _connected = false,
    onConnect = function () {
    };

self.addEventListener('connect', function (e) {
    var peer = e.ports[0];

    var listener = function (e) {
        _evts.push(e);
        if (_connected) {
            peer.removeEventListener('message', listener);
        }
    };

    if (!_connected) {
        peer.addEventListener('message', listener);
    }
    onConnect(peer);

    _peers.push(peer);

    peer.start();
}.bind(this));

require(['dm/Channel'], function (Channel) {
    var channel = new Channel({
        peers: _peers,
        evts: _evts
    });

    onConnect = function (peer) {
        channel.addPeer(peer);
    }

    _connected = true;
});