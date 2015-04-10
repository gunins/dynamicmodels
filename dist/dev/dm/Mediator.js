define(function () {

    function Mediator(channel) {
        this._channel = channel;
        this._handlers = {};
    };

    Mediator.prototype.subscribe = function (message, cb, context) {
        var scope, channel;
        message = message.split(':');

        if (message[1] === undefined) {
            scope = '_';
        } else {
            scope = message[1];
        }
        channel = message[0];

        this._handlers[scope] = this._handlers[scope] || {};
        this._handlers[scope][channel] = this._handlers[scope][channel] || [];
        var handler = this._handlers[scope][channel];
        var fn = cb.bind(context || this);
        handler.push(fn);
        return {
            remove: function () {
                handler.splice(handler.indexOf(fn), 1);
            }
        }
    };
    Mediator.prototype.publish = function (resp) {
        if (this._channel !== undefined && this._channel.postMessage !== undefined) {
            var data = {
                name: resp,
                data: Array.prototype.slice.call(arguments, 1)
            };
            this._channel.postMessage(data);
        }
    };
    Mediator.prototype.listen = function (resp) {
        var scope, channel, message,
            args = Array.prototype.slice.call(arguments, 1);

        message = resp.split(':');

        if (message[1] === undefined) {
            scope = '_';
        } else {
            scope = message[1];
        }
        channel = message[0];

        if (this._handlers[scope] !== undefined && this._handlers[scope][channel] !== undefined) {

            var handlers = this._handlers[scope][channel];
            handlers.forEach(function (handler) {
                handler.apply(null, args);
            });
        }
    };

    return Mediator;
})
;