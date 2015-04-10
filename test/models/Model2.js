/**
 * Created by guntars on 07/04/15.
 */
define(['dm/Model'], function (Model) {
    return Model.extend({
        init: function () {
            this.data = {
                a: 'Model2',
                b: 'Model34'
            }
            this.eventBus.subscribe('getData', function (val) {
                this.data.a = val;
                this.eventBus.publish('getData', this.data);
            }, this);

        }
    });
});