define("dm/Mediator",[],function(){function t(t){this._channel=t,this._handlers={}}return t.prototype.subscribe=function(t,e,n){var i,s;t=t.split(":"),i=void 0===t[1]?"_":t[1],s=t[0],this._handlers[i]=this._handlers[i]||{},this._handlers[i][s]=this._handlers[i][s]||[];var o=this._handlers[i][s],r=e.bind(n||this);return o.push(r),{remove:function(){o.splice(o.indexOf(r),1)}}},t.prototype.publish=function(t){if(void 0!==this._channel&&void 0!==this._channel.postMessage){var e={name:t,data:Array.prototype.slice.call(arguments,1)};this._channel.postMessage(e)}},t.prototype.listen=function(t){var e,n,i,s=Array.prototype.slice.call(arguments,1);if(i=t.split(":"),e=void 0===i[1]?"_":i[1],n=i[0],void 0!==this._handlers[e]&&void 0!==this._handlers[e][n]){var o=this._handlers[e][n];o.forEach(function(t){t.apply(null,s)})}},t}),define("dm/Channel",["./Mediator"],function(t){"use strict";function e(e){this.context=this.setContext(),this.eventBus=this.context.eventBus=new t(this),this._peers=[],this.models={},this.eventBus.subscribe("loadModel",this.loadModel.bind(this)),e&&this.connect(e)}return e.prototype.setContext=function(){return{}},e.prototype.addPeers=function(t){t.forEach(function(t){this.addPeer(t)}.bind(this))},e.prototype.addPeer=function(t){this._peers.push(t)},e.prototype.connect=function(t){t&&t.peers&&this.addPeers(t.peers),t&&t.evts&&this.fireMessages(t.evts),this._peers.forEach(function(t){this.listenMessage(t)}.bind(this))},e.prototype.listenMessage=function(t){t.addEventListener("message",function(t){this.fireMessage(t)}.bind(this))},e.prototype.fireMessage=function(t){var e=t.data;void 0!==e.name&&this.eventBus.listen.apply(this.eventBus,[e.name].concat(e.data))},e.prototype.fireMessages=function(t){for(;t.length>0;)this.fireMessage(t[0]),t.shift()},e.prototype.postMessage=function(t){this._peers.forEach(function(e){e.postMessage(t)}.bind(this))},e.prototype.loadModel=function(t){void 0===this.models[t.name]&&(this.models[t.name]="pending",require(t.config,["require",t.name],function(e,n){var i=new n({name:t.name,appContext:this.context});this.models[t.name]=i,this.eventBus.publish("modelReady",t.name)}.bind(this)))},e}),define("dm/ModelMediator",[],function(){"use strict";function t(t){t=t||{},this.mediator=t.mediator,this.name=t.name,this._ready=!1,this.onHold=[]}return t.prototype.subscribe=function(t,e,n){return this.mediator.subscribe(this.name+":"+t,e,n)},t.prototype.publish=function(){this._ready?this.callEvents.apply(this,arguments):this.onHold.push(arguments)},t.prototype.callEvents=function(t){var e=this.mediator,n=Array.prototype.slice.call(arguments,1);e.publish.apply(e,[this.name+":"+t].concat(n))},t.prototype.ready=function(){if(this.onHold.length>0)for(;this.onHold.length>0;)this.callEvents.apply(this,this.onHold[0]),this.onHold.shift();this._ready=!0},t}),define("dm/utils",[],function(){function t(t){var e=typeof t;if(!("function"===e||"object"===e&&t))return t;for(var n,i,s=1,o=arguments.length;o>s;s++){n=arguments[s];for(i in n)t[i]=n[i]}return t}function e(e,n){var i,s=this;i=e&&null!=e&&hasOwnProperty.call(e,"constructor")?e.constructor:function(){return s.apply(this,arguments)},t(i,s,n);var o=function(){this.constructor=i};return o.prototype=s.prototype,i.prototype=new o,e&&t(i.prototype,e),i.__super__=s.prototype,i}function n(t){return"[object String]"===toString.call(t)}function i(t){var e=typeof t;return"function"===e||"object"===e&&!!t}function s(t){return"[object Array]"===toString.call(t)}return{fnExtend:e,extend:t,isString:n,isObject:i,isArray:s}}),define("dm/Model",["./ModelMediator","./utils"],function(t,e){"use strict";function n(e){var e=e||{};this.context=e.appContext?e.appContext:{},this.context={eventBus:e.eventBus},this.name=e.name,this.eventBus=new t({mediator:this.context.eventBus,name:this.name}),this.data={},this.init.apply(this,arguments),this.eventBus.ready()}return n.prototype.init=function(){},n.extend=e.fnExtend,n});