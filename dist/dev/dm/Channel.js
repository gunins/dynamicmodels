/*globals define*/
define([
    './Mediator',
    './LocalMediator'
], function (Mediator, LocalMediator) {
    'use strict';
    function Channel(options) {
        this.eventBus = new Mediator(this);
        this.context = {
            eventBus: this.eventBus,
            localEventBus: new LocalMediator()
        };
        this._peers = [];
        this.models = {};
        this.eventBus.subscribe('loadModel', this.loadModel.bind(this));
        if (options) {
            this.connect(options);
        }
    }

    Channel.prototype.addPeers = function (peers) {
        peers.forEach(function (peer) {
            this.addPeer(peer);
        }.bind(this));
    };
    Channel.prototype.addPeer = function (peer) {
        this._peers.push(peer);
        this.listenMessage(peer);
    };

    Channel.prototype.connect = function (options) {
        if (options && options.peers) {
            this.addPeers(options.peers);
        }

        if (options && options.evts) {
            this.fireMessages(options.evts);
        }

    };

    Channel.prototype.listenMessage = function (port) {
        port.addEventListener('message', function (e) {
            this.fireMessage(e)
        }.bind(this));
    };

    Channel.prototype.fireMessage = function (e) {
        var resp = e.data;
        if (resp.name !== undefined) {
            this.eventBus.listen.apply(this.eventBus, [resp.name].concat(resp.data));
        }
    };
    Channel.prototype.fireMessages = function (messages) {
        while (messages.length > 0) {
            this.fireMessage(messages[0]);
            messages.shift();
        }
    };

    Channel.prototype.postMessage = function (data) {
        this._peers.forEach(function (peer) {
            peer.postMessage(data);
        }.bind(this));
    };

    Channel.prototype.loadModel = function (data) {
        if (this.models[data.name] === undefined) {
            this.models[data.name] = {};
            require(data.config,
                [
                    'require',
                    data.name
                ],
                function (req, Model) {
                    var model = new Model({
                        name: data.name,
                        context: this.context
                    });
                    this.models[data.name] = model;
                    this.eventBus.publish('modelReady', data.name);
                }.bind(this));
        } else {
            this.eventBus.publish('modelReady', data.name);
        }
    };
    return Channel;
});