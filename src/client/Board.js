import React, { Component } from 'react';
import Websocket from 'react-websocket';
import Square from './Square.js';

class Board extends Component {

    constructor() {
        super();
        const arr = Array(8).fill(Array(8).fill(null));
        arr[0] = [null, null, null, null, null, null, null, null]
        arr[1] = [null, null, null, null, null, null, null, null]
        arr[2] = [null, null, null, null, null, null, null ,null]
        arr[3] = [null, null, null, '○', '●', null, null, null]
        arr[4] = [null, null, null, '●', '○', null, null, null]
        arr[5] = [null, null, null, null, null, null, null, null]
        arr[6] = [null, null, null, null, null, null, null, null]
        arr[7] = [null, null, null, null, null, null, null, null]
        this.state = {
            squares: arr,
            blackIsNext: true
        }
    }

    handleClick(x, y) {
        console.log("##### Board handleClick######")
        var _squares = JSON.parse(JSON.stringify(this.state.squares));
        
        var _squareX = _squares[x]
        if(_squareX[y] !== null) {
            return false
        }
        
        for(var i = 0; i < 8; i++) {
            _squares = this.calcStones(x, y, _squares, i)
        }
        //if(this.diffSquares(squares, squaresChanged)) {
        //    return false
        //}

        
        //squareX[y] = this.state.blackIsNext ? '○' : '●'
        //squares[x] = squareX
        _squareX = _squares[x]
        _squareX[y] = this.state.blackIsNext ? '○':'●'
        _squares[x] = _squareX
        if(this.diffSquares(this.state.squares, _squares)) {
            return false;
        }
        this.setState({
            squares: _squares,
            blackIsNext: !this.state.blackIsNext
        });
    }

    diffSquares(squares, squaresChanged) {
        var diffXy = []
        for(var i = 0; i < 8; i++) {
            const squareX = squares[i]
            const squareChangedX = squaresChanged[i]
            for(var j = 0; j < 8; j++) {
                if(squareX[j] !== squareChangedX[j]) {
                    
                    diffXy.push([i, j])
                }
            }
        }
        console.log(diffXy)
        return diffXy.length < 2
    }

    calcStones(x, y, squares, direction) {
        
        const stone = this.state.blackIsNext ? '○':'●'
        const anotherStone = this.state.blackIsNext ? '●':'○'
        var changeXy = []
        console.log("76 X:" + x + " Y:" + y)

        var beforeStone = null
        for(var i = 1; i <= 7; i++) {
            var _x
            var _y
            switch(direction) {
                case 0:
                    _x = x + i
                    _y = y + i
                    break;

                case 1:
                    _x = x + i
                    _y = y - i
                    break;
                case 2:
                    _x = x - i
                    _y = y + i
                    break;
                case 3:
                    _x = x - i
                    _y = y - i
                    break;
                case 4:
                    _x = x + i
                    _y = y + 0
                    break;
                case 5:
                    _x = x - i
                    _y = y + 0
                    break;
                case 6:
                    _x = x + 0
                    _y = y + i
                    break;
                case 7:
                    _x = x + 0
                    _y = y - i
                    break;
                default:
                    break;

            }
            if(_x >= 0 && _x < 8 && _y >= 0 && _y < 8) {

                const squareX = squares[_x]
                if(squareX[_y] === anotherStone) {
                    beforeStone = squareX[_y]
                } else if(squareX[_y] === stone && beforeStone === anotherStone) {
                    changeXy = [_x, _y]
                    console.log("change")
                    console.log(changeXy)
                    console.log("direction:" + direction)
                    break
                } else {
                    break
                }
            } else {
                break
            }
        }
        if(changeXy.length < 2) {
            return squares
        }

        var __x = changeXy[0]
        var __y = changeXy[1]
        while(!(__x === x && __y === y)) {
            const squareX = squares[__x]
            console.log(__y)
            console.log(__x)
            console.log(squares)
            squareX[__y] = stone
            squares[__x] = squareX
            
                //__x = __x + 1
                //__y = __y + 1
            switch(direction) {
                case 0:
                    __x = __x - 1
                    __y = __y - 1
                    break;
                case 1:
                    __x = __x - 1
                    __y = __y + 1
                    break;
                case 2:
                    __x = __x + 1
                    __y = __y - 1
                    break;

                case 3:
                    __x = __x + 1
                    __y = __y + 1
                    break;
                case 4:
                    __x = __x - 1
                    break;
                case 5:
                    __x = __x + 1
                    break;
                case 6:
                    __y = __y - 1
                    break;
                case 7:
                    __y = __y + 1
                    break;
                default:

                    break;
            }
        }
        console.log("X:" + __x + " Y:" + __y)
        return squares
        
    }


    renderSquare(x, y) {
        console.log("renderSquare")
        return <Square value={ this.state.squares[x][y]} onClick={() => this.handleClick(x, y)} />;
    }

    handleData(data) {
        let result = JSON.parse(data);
        this.setState({squares: result})
    }

    render() {
        console.log("Board render")
        const rows = [];
        for( let i = 0; i < 8; i++) {
            const row = []
            for(let j = 0; j < 8; j++) {
                row.push(this.renderSquare(i, j))
            }
            rows.push(<div className='row'>{ row }</div>)
        }
        return (
            <div id='grid'>
                {rows}
            </div>
        );
    }
}
//                 <Websocket url='ws://localhost:8888/' onMessage={this.handleData.bind(this)} />

export default Board;
