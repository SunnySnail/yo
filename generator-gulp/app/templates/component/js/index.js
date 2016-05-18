(function(name, definition){
    if(typeof define === 'function') {
        define(definition);
    }else{
        this[name] = definition();
    }
})('<%= componentName %>', function(){
    var <%= componentName %> = function(options){
        //默认参数
        var settings = {
            // this is for the plugin default arguments

        }
        for(i in settings){
            this[i] = options[i] || settings[i];
        }
        this._init();
    }
    <%= componentName %>.prototype = {
        _init: function(){
        }
    }
    return <%= componentName %>;
})