define("dm/Mediator",[],function(){function e(e){this._channel=e,this._handlers={}}return e.prototype.subscribe=function(e,t,n){var r,i;e=e.split(":"),r=void 0===e[1]?"_":e[1],i=e[0],this._handlers[r]=this._handlers[r]||{},this._handlers[r][i]=this._handlers[r][i]||[];var o=this._handlers[r][i],s=t.bind(n||this);return o.push(s),{remove:function(){o.splice(o.indexOf(s),1)}}},e.prototype.publish=function(e){if(void 0!==this._channel&&void 0!==this._channel.postMessage){var t={name:e,data:Array.prototype.slice.call(arguments,1)};this._channel.postMessage(t)}},e.prototype.listen=function(e){var t,n,r,i=Array.prototype.slice.call(arguments,1);if(r=e.split(":"),t=void 0===r[1]?"_":r[1],n=r[0],void 0!==this._handlers[t]&&void 0!==this._handlers[t][n]){var o=this._handlers[t][n];o.forEach(function(e){e.apply(null,i)})}},e}),define("dm/ModelMediator",[],function(){"use strict";function e(e){e=e||{},this.mediator=e.mediator,this.name=e.name,this._ready=!1,this.onHold=[]}return e.prototype.subscribe=function(e,t,n){return this.mediator.subscribe(this.name+":"+e,t,n)},e.prototype.publish=function(){this._ready?this.callEvents.apply(this,arguments):this.onHold.push(arguments)},e.prototype.callEvents=function(e){var t=this.mediator,n=Array.prototype.slice.call(arguments,1);t.publish.apply(t,[this.name+":"+e].concat(n))},e.prototype.ready=function(){if(this.onHold.length>0)for(;this.onHold.length>0;)this.callEvents.apply(this,this.onHold[0]),this.onHold.shift();this._ready=!0},e}),define("dm/Getter",["./ModelMediator"],function(e){"use strict";function t(t){t=t||{},this.name=t.name,this.context={eventBus:t.eventBus},this.eventBus=new e({mediator:this.context.eventBus,name:this.name})}return t.prototype.ready=function(){this.eventBus.ready()},t}),define("dm/Manager",["./Mediator","./Getter"],function(e,t){function n(t){this._channel=t,this.eventBus=new e(t),this._models={},this.listenMessage(t),this.eventBus.subscribe("modelReady",this.modelReady.bind(this))}return n.prototype.addModel=function(e){this.eventBus.publish("loadModel",e);var n=new t({name:e.name,eventBus:this.eventBus});return this._models[e.name]=n,n},n.prototype.modelReady=function(e){void 0!==this._models[e]&&this._models[e].ready()},n.prototype.listenMessage=function(e){e.addEventListener("message",function(e){this.fireMessage(e)}.bind(this))},n.prototype.fireMessage=function(e){var t=e.data;void 0!==t.name&&this.eventBus.listen.apply(this.eventBus,[t.name].concat(t.data))},n}),define("dm/utils",[],function(){function e(e){var t=typeof e;if(!("function"===t||"object"===t&&e))return e;for(var n,r,i=1,o=arguments.length;o>i;i++){n=arguments[i];for(r in n)e[r]=n[r]}return e}function t(t,n){var r,i=this;r=t&&null!=t&&hasOwnProperty.call(t,"constructor")?t.constructor:function(){return i.apply(this,arguments)},e(r,i,n);var o=function(){this.constructor=r};return o.prototype=i.prototype,r.prototype=new o,t&&e(r.prototype,t),r.__super__=i.prototype,r}function n(e){return"[object String]"===toString.call(e)}function r(e){var t=typeof e;return"function"===t||"object"===t&&!!e}function i(e){return"[object Array]"===toString.call(e)}return{fnExtend:t,extend:e,isString:n,isObject:r,isArray:i}}),define("dm/parser",["./Manager","./utils"],function(e,t){var n=!1,r=!1;return{load:function(i,o,s,a){if(a.isBuild)return void s();if(void 0===a.name)throw"App Name has to be defined";if(!n&&!r)if(void 0!==window.SharedWorker)n=new SharedWorker(require.toUrl("dm/sharedWorker.js"),a.name||"my-shared-scope"),n.port.start(),r=new e(n.port);else{if(void 0===window.Worker)throw console.log("WEB WORKERS ARE NOT SUPPORTED"),"Web Workers are not supported!";n=new Worker(require.toUrl("dm/worker.js")),r=new e(n)}var d=o.toUrl("dm").replace(/\.\.\//g,""),u=(d.match(/\//g)||[]).length,l="./";if(u>0)for(var h=0;u>h;h++)l+="../";var c=r.addModel({name:i,config:t.extend({},a,{baseUrl:l+a.name+"/"+a.baseUrl.replace("./","").replace(a.name,"")})});s(c)}}});