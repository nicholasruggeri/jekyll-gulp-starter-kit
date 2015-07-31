(function(exports) {

    var module_1 = (function() {

        function init() {
            console.log('module 1 init')
        }

        return {
            init: init
        };
    }());

    module_1.init();

}(window));