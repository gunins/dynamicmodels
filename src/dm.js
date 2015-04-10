define(['./dm/Manager', './dm/utils'], function (Manager, utils) {
    var worker = false,
        manager = false;

    return {
        load: function (name, req, onLoad, config) {
            if (config.isBuild) {
                //don't do anything if this is a build, can't inline a web worker
                onLoad();
                return;
            }
            if (config.name === undefined) {
                throw('App Name has to be defined');
            }
            if (!worker && !manager) {
                if (window.SharedWorker !== undefined) {
                    worker = new SharedWorker(require.toUrl('dm/sharedWorker.js'), config.name || 'my-shared-scope');
                    worker.port.start();
                    manager = new Manager(worker.port);
                } else if (window.Worker !== undefined) {
                    worker = new Worker(require.toUrl('dm/worker.js'));
                    manager = new Manager(worker);
                } else {
                    console.log('WEB WORKERS ARE NOT SUPPORTED');
                    throw ('Web Workers are not supported!')
                }
            }
            var rootUrl = req.toUrl('dm').replace(/\.\.\//g, ''),
                count = (rootUrl.match(/\//g) || []).length,
                root = './';

            if (count > 0) {
                for (var a = 0; a < count; a++) {
                    root += '../';
                }

            }
            var model = manager.addModel({
                name: name,
                config: utils.extend({}, config, {
                        baseUrl: root + config.name + '/' + config.baseUrl.replace('./', '').replace(config.name, '')
                    }
                )
            });

            onLoad(model)

        }
    };
});