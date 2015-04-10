define(['./Mediator', './Getter'], function (EventBus, Getter) {
    function Manager(channel) {
        this._channel = channel;
        this.eventBus = new EventBus(channel);
        this._models = {};
        this.listenMessage(channel)
        this.eventBus.subscribe('modelReady', this.modelReady.bind(this));
    }

    Manager.prototype.addModel = function (options) {
        this.eventBus.publish('loadModel', options);
        var getter = new Getter({
            name: options.name,
            eventBus: this.eventBus
        });
        this._models[options.name] = getter;
        return getter;
    };

    Manager.prototype.modelReady = function (name) {
        if (this._models[name] !== undefined) {
            this._models[name].ready();
        }
    };

    Manager.prototype.listenMessage = function (port) {
        port.addEventListener('message', function (e) {
            this.fireMessage(e)
        }.bind(this));
    };

    Manager.prototype.fireMessage = function (e) {
        var resp = e.data;
        if (resp.name !== undefined) {
            this.eventBus.listen.apply(this.eventBus, [resp.name].concat(resp.data));
        }
    };

    return Manager;
});