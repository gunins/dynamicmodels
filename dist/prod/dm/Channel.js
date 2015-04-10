/*!
 * Mediator.js Library v0.9.8
 * https://github.com/ajacksified/Mediator.js
 *
 * Copyright 2013, Jack Lawson
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 *
 * For more information: http://thejacklawson.com/2011/06/mediators-for-modularized-asynchronous-programming-in-javascript/index.html
 * Project on GitHub: https://github.com/ajacksified/Mediator.js
 *
 * Last update: October 19 2013
 */

define("dm/Mediator",[],function(){function t(t){this._channel=t,this._handlers={}}return t.prototype.subscribe=function(t,e,s){var i,n;t=t.split(":"),i=void 0===t[1]?"_":t[1],n=t[0],this._handlers[i]=this._handlers[i]||{},this._handlers[i][n]=this._handlers[i][n]||[];var r=this._handlers[i][n],o=e.bind(s||this);return r.push(o),{remove:function(){r.splice(r.indexOf(o),1)}}},t.prototype.publish=function(t){if(void 0!==this._channel&&void 0!==this._channel.postMessage){var e={name:t,data:Array.prototype.slice.call(arguments,1)};this._channel.postMessage(e)}},t.prototype.listen=function(t){var e,s,i,n=Array.prototype.slice.call(arguments,1);if(i=t.split(":"),e=void 0===i[1]?"_":i[1],s=i[0],void 0!==this._handlers[e]&&void 0!==this._handlers[e][s]){var r=this._handlers[e][s];r.forEach(function(t){t.apply(null,n)})}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("dm/LocalMediator",[],function(){return t.Mediator=e(),t.Mediator}):"undefined"!=typeof exports?exports.Mediator=e():t.Mediator=e()}(this,function(){"use strict";function t(){var t=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function e(s,i,n){return this instanceof e?(this.id=t(),this.fn=s,this.options=i,this.context=n,void(this.channel=null)):new e(s,i,n)}function s(t,e){return this instanceof s?(this.namespace=t||"",this._subscribers=[],this._channels={},this._parent=e,void(this.stopped=!1)):new s(t)}function i(){return this instanceof i?void(this._channels=new s("")):new i}return e.prototype={update:function(t){t&&(this.fn=t.fn||this.fn,this.context=t.context||this.context,this.options=t.options||this.options,this.channel&&this.options&&void 0!==this.options.priority&&this.channel.setPriority(this.id,this.options.priority))}},s.prototype={addSubscriber:function(t,s,i){var n=new e(t,s,i);return s&&void 0!==s.priority?(s.priority=s.priority>>0,s.priority<0&&(s.priority=0),s.priority>=this._subscribers.length&&(s.priority=this._subscribers.length-1),this._subscribers.splice(s.priority,0,n)):this._subscribers.push(n),n.channel=this,n},stopPropagation:function(){this.stopped=!0},getSubscriber:function(t){var e=0,s=this._subscribers.length;for(s;s>e;e++)if(this._subscribers[e].id===t||this._subscribers[e].fn===t)return this._subscribers[e]},setPriority:function(t,e){var s,i,n,r,o=0,h=0;for(h=0,r=this._subscribers.length;r>h&&(this._subscribers[h].id!==t&&this._subscribers[h].fn!==t);h++)o++;s=this._subscribers[o],i=this._subscribers.slice(0,o),n=this._subscribers.slice(o+1),this._subscribers=i.concat(n),this._subscribers.splice(e,0,s)},addChannel:function(t){this._channels[t]=new s((this.namespace?this.namespace+":":"")+t,this)},hasChannel:function(t){return this._channels.hasOwnProperty(t)},returnChannel:function(t){return this._channels[t]},removeSubscriber:function(t){var e=this._subscribers.length-1;if(!t)return void(this._subscribers=[]);for(e;e>=0;e--)(this._subscribers[e].fn===t||this._subscribers[e].id===t)&&(this._subscribers[e].channel=null,this._subscribers.splice(e,1))},publish:function(t){var e,s,i,n=0,r=this._subscribers.length,o=!1;for(r;r>n;n++)o=!1,e=this._subscribers[n],this.stopped||(s=this._subscribers.length,void 0!==e.options&&"function"==typeof e.options.predicate?e.options.predicate.apply(e.context,t)&&(o=!0):o=!0),o&&(e.options&&void 0!==e.options.calls&&(e.options.calls--,e.options.calls<1&&this.removeSubscriber(e.id)),e.fn.apply(e.context,t),i=this._subscribers.length,r=i,i===s-1&&n--);this._parent&&this._parent.publish(t),this.stopped=!1}},i.prototype={getChannel:function(t,e){var s=this._channels,i=t.split(":"),n=0,r=i.length;if(""===t)return s;if(i.length>0)for(r;r>n;n++){if(!s.hasChannel(i[n])){if(e)break;s.addChannel(i[n])}s=s.returnChannel(i[n])}return s},subscribe:function(t,e,s,i){var n=this.getChannel(t||"",!1);return s=s||{},i=i||{},n.addSubscriber(e,s,i)},once:function(t,e,s,i){return s=s||{},s.calls=1,this.subscribe(t,e,s,i)},getSubscriber:function(t,e){var s=this.getChannel(e||"",!0);return s.namespace!==e?null:s.getSubscriber(t)},remove:function(t,e){var s=this.getChannel(t||"",!0);return s.namespace!==t?!1:void s.removeSubscriber(e)},publish:function(t){var e=this.getChannel(t||"",!0);if(e.namespace!==t)return null;var s=Array.prototype.slice.call(arguments,1);s.push(e),e.publish(s)}},i.prototype.on=i.prototype.subscribe,i.prototype.bind=i.prototype.subscribe,i.prototype.emit=i.prototype.publish,i.prototype.trigger=i.prototype.publish,i.prototype.off=i.prototype.remove,i.Channel=s,i.Subscriber=e,i.version="0.9.8",i}),define("dm/Channel",["./Mediator","./LocalMediator"],function(t,e){"use strict";function s(s){this.eventBus=new t(this),this.context={eventBus:this.eventBus,localEventBus:new e},this._peers=[],this.models={},this.eventBus.subscribe("loadModel",this.loadModel.bind(this)),s&&this.connect(s)}return s.prototype.addPeers=function(t){t.forEach(function(t){this.addPeer(t)}.bind(this))},s.prototype.addPeer=function(t){this._peers.push(t)},s.prototype.connect=function(t){t&&t.peers&&this.addPeers(t.peers),t&&t.evts&&this.fireMessages(t.evts),this._peers.forEach(function(t){this.listenMessage(t)}.bind(this))},s.prototype.listenMessage=function(t){t.addEventListener("message",function(t){this.fireMessage(t)}.bind(this))},s.prototype.fireMessage=function(t){var e=t.data;void 0!==e.name&&this.eventBus.listen.apply(this.eventBus,[e.name].concat(e.data))},s.prototype.fireMessages=function(t){for(;t.length>0;)this.fireMessage(t[0]),t.shift()},s.prototype.postMessage=function(t){this._peers.forEach(function(e){e.postMessage(t)}.bind(this))},s.prototype.loadModel=function(t){void 0===this.models[t.name]&&(this.models[t.name]="pending",require(t.config,["require",t.name],function(e,s){var i=new s({name:t.name,context:this.context});this.models[t.name]=i,this.eventBus.publish("modelReady",t.name)}.bind(this)))},s}),define("dm/ModelMediator",[],function(){"use strict";function t(t){t=t||{},this.mediator=t.mediator,this.name=t.name,this._ready=!1,this.onHold=[]}return t.prototype.subscribe=function(t,e,s){return this.mediator.subscribe(this.name+":"+t,e,s)},t.prototype.publish=function(){this._ready?this.callEvents.apply(this,arguments):this.onHold.push(arguments)},t.prototype.callEvents=function(t){var e=this.mediator,s=Array.prototype.slice.call(arguments,1);e.publish.apply(e,[this.name+":"+t].concat(s))},t.prototype.ready=function(){if(this.onHold.length>0)for(;this.onHold.length>0;)this.callEvents.apply(this,this.onHold[0]),this.onHold.shift();this._ready=!0},t}),define("dm/utils",[],function(){function t(t){var e=typeof t;if(!("function"===e||"object"===e&&t))return t;for(var s,i,n=1,r=arguments.length;r>n;n++){s=arguments[n];for(i in s)t[i]=s[i]}return t}function e(e,s){var i,n=this;i=e&&null!=e&&hasOwnProperty.call(e,"constructor")?e.constructor:function(){return n.apply(this,arguments)},t(i,n,s);var r=function(){this.constructor=i};return r.prototype=n.prototype,i.prototype=new r,e&&t(i.prototype,e),i.__super__=n.prototype,i}function s(t){return"[object String]"===toString.call(t)}function i(t){var e=typeof t;return"function"===e||"object"===e&&!!t}function n(t){return"[object Array]"===toString.call(t)}return{fnExtend:e,extend:t,isString:s,isObject:i,isArray:n}}),define("dm/Model",["./ModelMediator","./utils"],function(t,e){"use strict";function s(e){var e=e||{};this.context=e.context?e.context:{},this.name=e.name,this.eventBus=new t({mediator:this.context.eventBus,name:this.name}),this.data={},this.init.apply(this,arguments),this.eventBus.ready()}return s.prototype.init=function(){},s.extend=e.fnExtend,s});