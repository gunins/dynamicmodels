/*globals define*/
define([
    'chai',
    'dm/parser!./models/Model',
    'dm/parser!./models/Model2'
], function (chai, model, model2) {
    var expect = chai.expect;

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    var ModelId = guidGenerator();
    describe('Model Worker tests', function () {
        describe('getters', function () {
            it('Loaded data with timeout', function (done) {
                model.eventBus.subscribe('getData', function (data) {
                    if (data.id == ModelId) {
                        expect(data).to.deep.equal({a: "Blah", b: 2, id: ModelId})
                        console.log(data);
                    }
                    done();
                });
                setTimeout(function () {
                    model.eventBus.publish('getData', 'Blah', {id: ModelId});
                }.bind(this), 200);
            })

            it('Loaded data straight', function (done) {

                model2.eventBus.subscribe('getData', function (data) {
                    expect(data).to.deep.equal({a: "Blah@", b: "Model34"})

                    console.log(data);
                    done();
                });
                model2.eventBus.publish('getData', 'Blah@');
            });

        });
    });

});
