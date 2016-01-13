(function() {
    'use strict';

    angular.
    module('tetris').
    controller('MainController', MainController);

    function MainController(preferences, Figure, $interval, $timeout) {
        var vm = this;
        var shift = Math.round((preferences.columns - 4) / 2);
        var current, currentPosition, game;
        var body = angular.element(document.body);
        var UP = 38,
            DOWN = 40,
            LEFT = 37,
            RIGHT = 39;

        vm.startGame = startGame;
        vm.gamespace = [];

        for(var i=0; i< preferences.rows; i++) {
            vm.gamespace[i] = new Array(preferences.columns);
        }

        function rotate() {
            var shift = current.getFirstBlockShift();
            current.rotate();
            var position = [];
            for (var row = 0; row < current.shape.length; row ++) {
                for (var block = 0; block < current.shape[row].length; block ++) {
                    if (angular.isNumber(current.shape[row][block])) {
                        position.push({
                            x: row + currentPosition[0].x,
                            y: block + currentPosition[0].y - shift
                        });
                    }
                }
            }
            if (checkAvailableDown(position) && checkAvailableLeftRight(position)) {
                move(position);
            }
        }

        function startGame() {
            vm.gameOver = false;
            vm.started = true;
            vm.score = 0;
            currentPosition = [];
            vm.gamespace = vm.gamespace.map(function(row) {
                return row.map(function() {
                    return null;
                });
            });
            appendNewFigure();
            game = $interval(moveDown, preferences.speed);
            body.bind('keydown', onKeyPress);
        }

        function onKeyPress(ev) {
            switch (ev.keyCode) {
                case UP:
                    rotate();
                    break;
                case DOWN:
                    moveDown();
                    break;
                case LEFT:
                    moveToSide(-1);
                    break;
                case RIGHT:
                    moveToSide(1);
                    break;
            }
        }

        function appendNewFigure() {
            var shape = Math.floor(Math.random() * 7) + 1;
            currentPosition = [];
            current = new Figure(shape);
            var position = [];
            for (var row = 0; row < current.shape.length; row ++) {
                for (var block = 0; block < current.shape[row].length; block ++) {
                    if (angular.isNumber(current.shape[row][block])) {
                        position.push({
                            x: row,
                            y: block + shift
                        });
                    }
                }
            }
            if (checkAvailableDown(position)) {
                move(position);
            } else {
                gameOver();
            }
        }

        function moveDown() {
            var newPosition = currentPosition.map(function(block) {
                return {
                    x: block.x + 1,
                    y: block.y
                };
            });
            if (checkAvailableDown(newPosition)) {
                move(newPosition);
            } else {
                clearLines();
                appendNewFigure();
            }
        }

        function clearLines() {
            vm.gamespace.forEach(function(row, index) {
                for (var i = 0; i < preferences.columns; i++) {
                    if (!angular.isNumber(row[i])) {
                        break;
                    }
                    if (i === preferences.columns -1) {
                        vm.gamespace.splice(index, 1);
                        vm.gamespace.unshift(new Array(preferences.columns));
                        vm.score ++;
                    }
                }
            });
        }

        function moveToSide(side) {
            var newPosition = currentPosition.map(function(block) {
                return {
                    x: block.x,
                    y: block.y + side
                };
            });
            if (checkAvailableLeftRight(newPosition)) {
                move(newPosition);
            }
        }

        function checkAvailableDown(position) {
            return position.every(function(blockPosition) {
                return blockPosition.x < preferences.rows &&
                    (!angular.isNumber(vm.gamespace[blockPosition.x][blockPosition.y]) ||
                    angular.isDefined(currentPosition.find(function(block) {
                        return block.x === blockPosition.x && block.y === blockPosition.y
                    }))
                    );
            });
        }

        function checkAvailableLeftRight(position) {
            return position.every(function(blockPosition) {
                return blockPosition.y >= 0 && blockPosition.y < preferences.columns &&
                    !angular.isNumber(vm.gamespace[blockPosition.x][blockPosition.y]) ||
                    !angular.isUndefined(currentPosition.find(function(currentBlock) {
                        return currentBlock.x === blockPosition.x && currentBlock.y === blockPosition.y;
                    }));
            });
        }

        function move(position) {
            $timeout(function() {
                currentPosition.forEach(function(block) {
                    vm.gamespace[block.x][block.y] = null;
                });
                currentPosition = position;
                currentPosition.forEach(function(block) {
                    vm.gamespace[block.x][block.y] = current.type;
                });
            });
        }

        function gameOver() {
            body.unbind('keydown', onKeyPress);
            $interval.cancel(game);
            vm.started = false;
            vm.gameOver = true;
        }
    }
})();
