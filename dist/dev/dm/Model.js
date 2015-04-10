/*globals define*/
/**
 * Created by guntars on 07/04/15.
 */
define(['./ModelMediator', './utils'], function (ModelMediator, utils) {
    'use strict';
    function Model(options) {
        var options = options || {};
        if (options.context) {
            this.context = options.context;
        } else {
            this.context = {};
        }
        this.name = options.name;

        this.eventBus = new ModelMediator({
            mediator: this.context.eventBus,
            name: this.name
        });
        this.localEventBus = this.context.localEventBus;

        this.data = {};
        this.init.apply(this, arguments);
        this.eventBus.ready();

    }

    Model.prototype.init = function () {

    };

    Model.extend = utils.fnExtend;

    return Model;
});