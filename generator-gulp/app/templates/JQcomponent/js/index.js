(function($){
    $.fn.<%= componentName %> = function(options){
        var defaults = {
            //this is for the default options
            //eg: color: "red",fontSize: "20px"
            //you can add your default options here
        };
        //default options
        var settings = $.extend({},defaults,options);

        this.each(function(){
            //you can add your plugin method here
            //you can operate your elems here
            var elem = $(this);
        })
        return this;
    }
})(jQuery)