(function(exports) {

    var module_2 = (function() {

        // elenco di metodi privati
        function init() {
            console.log('module 2 init')
        }

        // esporto i metodi pubblici
        return {
            init: init
        };
    }());

    // esporto il modulo nel namespace globale
    // exports.module_2 = exports.module_2 || module_2;

    module_2.init();

}(window));