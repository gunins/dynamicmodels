/*globals define*/
/**
 * Created by guntars on 07/04/15.
 */
define(['./ModelMediator', './utils'], function (ModelMediator, utils) {
    'use strict';
    function Model(options) {
        var options = options || {};
        if (options.appContext) {
            this.context = options.appContext;
        } else {
            this.context = {};
        }
        this.context = {
            eventBus: options.eventBus
        }
        this.name = options.name;

        this.eventBus = new ModelMediator({
            mediator: this.context.eventBus,
            name: this.name
        })

        this.data = {};
        this.init.apply(this, arguments);
        this.eventBus.ready();

    }

    Model.prototype.init = function () {

    }

    Model.extend = utils.fnExtend;

    return Model;
});