(function(exports) {

    var module_1 = (function() {

        // elenco di metodi privati
        function init() {
            console.log('module 1 init')
        }

        // esporto i metodi pubblici
        return {
            init: init
        };
    }());

    // esporto il modulo nel namespace globale
    // exports.module_1 = exports.module_1 || module_1;

    module_1.init();

}(window));