/**
 * Created by guntars on 07/04/15.
 */
define(['dm/Model'], function (Model) {
    return Model.extend({
        init: function () {
            this.data = {
                a: 0,
                b: 2
            }
            this.localEventBus.subscribe('test', function (cb, data) {
                cb('Test Works again')
                console.log(data);
            });
            this.eventBus.subscribe('getData', function (val, options) {
                this.data.a = val;
                this.data.id = options.id;
                this.eventBus.publish('getData', this.data);
            }, this);

        }
    });
});