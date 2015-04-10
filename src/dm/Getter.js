/*globals define*/
define(['./ModelMediator'], function (ModelMediator) {
    'use strict';
    function Getter(options) {
        options = options || {};
        this.name = options.name;
        this.context = {
            eventBus: options.eventBus
        }
        this.eventBus = new ModelMediator({
            mediator: this.context.eventBus,
            name: this.name
        });
    }
    Getter.prototype.ready = function () {
      this.eventBus.ready();
    };

    return Getter;
});