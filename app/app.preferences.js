(function() {
    'use strict';

    angular.
    module('tetris').
    factory('preferences', tetrisPreferencesFactory);

    function tetrisPreferencesFactory() {
        return {
            columns: 20,
            rows: 20,
            speed: 1000
        };
    }
})();
