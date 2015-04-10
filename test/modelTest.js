/*globals define*/
define([
    'chai',
    'dm!./models/Model',
    'dm!./models/Model2'
], function (chai, model, model2) {
    var expect = chai.expect;
    describe('Model Worker tests', function () {
        describe('getters', function () {
            it('Loaded data with timeout', function (done) {
                model.eventBus.subscribe('getData', function (data) {
                    console.log(data);
                    done();
                });
                setTimeout(function () {
                    model.eventBus.publish('getData', 'Blah');
                }.bind(this), 200);
            })

            it('Loaded data straight', function (done) {

                model2.eventBus.subscribe('getData', function (data) {
                    console.log(data);
                    done();
                });
                model2.eventBus.publish('getData', 'Blah@');
            });

        });
    });

});
