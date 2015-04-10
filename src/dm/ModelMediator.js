/*globals define*/
define(function () {
    'use strict';

    function ModelMediator(options) {
        options = options || {};
        this.mediator = options.mediator;
        this.name = options.name;
        this._ready = false;
        this.onHold = [];
    }

    ModelMediator.prototype.subscribe = function (channel, cb, context) {
        return this.mediator.subscribe(this.name + ':' + channel, cb, context);
    };

    ModelMediator.prototype.publish = function (channel) {
        if (this._ready) {
            this.callEvents.apply(this, arguments);
        } else {
            this.onHold.push(arguments);
        }

    };
    ModelMediator.prototype.callEvents = function (channel) {
        var eventBus = this.mediator,
            args = Array.prototype.slice.call(arguments, 1);
        eventBus.publish.apply(eventBus, [this.name + ':' + channel].concat(args));
    };

    ModelMediator.prototype.ready = function () {
        if (this.onHold.length > 0) {
            while (this.onHold.length > 0) {
                this.callEvents.apply(this, this.onHold[0]);
                this.onHold.shift();
            }
        }
        this._ready = true;
    };
    return ModelMediator;
});