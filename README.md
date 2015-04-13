## Dynamic Models [![Build Status](https://api.travis-ci.org/gunins/urlmanager.svg?branch=master)](https://travis-ci.org/gunins/dynamicmodels)

Requirejs plugin for managing communication between Workers and browser

## Why "Dynamic Models"

Dynamic Models simplify messaging between Browser and web workers. There is support for shared workers, and fallback to web workers, if shared workers not supported.

## Prerequisites

You need to install [**nodejs**](http://nodejs.org/) and **grunt CLI** globally `npm -g install grunt-cli`

Also [**Requirejs**](http://requirejs.org/) knowledge. 

## Installation

Using npm

    npm install dynamic-models

Using Bower

    bower install dynamic-models

## Usage

To use it need add path in require.config.

#### For node_modules

    paths:{
        ...
        'dm': '../node_modules/dynamic-models/dist/prod/dm'
        ...
    }
    
#### For bower_components

    paths:{
        ...
        'dm': '../bower_components/dynamic-models/dist/prod/dm'
        ...
    }

#### Defining a model

Just Extend Model Class
    
    define(['dm/Model'], function (Model) {
        return Model.extend({
            init: function () {
                this.data = {
                    a: 0,
                    b: 2
                }
                this.eventBus.publish('getData', this.data);
                this.eventBus.subscribe('setData', function(data) {
                    this.data = data
                }, this);
                
                this.localEventBus.subscribe('setModelData', function (data) {
                    this.data = data;
                },{},this);
            }
        });
    });

In a Model, you have access to eventBus, which are proxy between messaging. You can subscribe and publish messages.
Init is a constructor. in a Models also available `localEventBus` wich allow to communicate between models.
    
    
#### Use in modules    

Requirejs plugin will return model eventBus.

    define([
        'dm!./PathToModel'
        ], function(model){
            model.eventBus.subscribe('getData', function (data) {
                console.log(data);
            });
            
            model.eventBus.publish('getData', {
                a:5,
                b:10
            });
        });
        
Messaging, allows only Objects, not functions. (because concept of Workers).



