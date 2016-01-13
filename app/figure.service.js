(function() {
    'use strict';

    function figureFactory() {
        var shapes = {
            1: [
                [1, 1, 1, 1]
            ],
            2: [
                [2, null, null],
                [2, 2, 2]
            ],
            3: [
                [null, null, 3],
                [3, 3, 3]
            ],
            4: [
                [4, 4],
                [4, 4]
            ],
            5: [
                [null, 5, 5],
                [5, 5, null]
            ],
            6: [
                [null, 6, null],
                [6, 6, 6]
            ],
            7: [
                [7, 7, null],
                [null, 7, 7]
            ]
        };

        function Figure(type) {
            this.type = type;
            this.shape = shapes[type];
        }

        Figure.prototype.rotate = function() {
            var matrix = this.shape;
            var width = matrix.length;
            var height = matrix[0].length;
            var newArr = [];

            for (var i = 0; i < height; i++) {
                var tmp = [];
                for (var j = width - 1; j >= 0; j--) {
                    tmp.push(matrix[j][i]);
                }
                newArr.push(tmp);
            }

            this.shape = newArr;

            return {
                x: Math.round(height /2),
                y: Math.round(width /2)
            };
        };

        Figure.prototype.getFirstBlockShift = function() {
          var shift = 0;
            this.shape[0].some(function(value) {
                if (value === null) {
                    shift ++;
                } else {
                    return true;
                }
            });
            return shift;
        };
        return Figure;
    }

    angular.module('tetris').factory('Figure', figureFactory);
})();
