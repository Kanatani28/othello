import React, { Component } from 'react'
import classNames from 'classnames'

class Square extends Component {

    constructor(props) {
        super();
    }
    renderStone(value, isNull) {
        const isBlack = value === '●'
        const stoneClass = classNames({
            'whiteCircle' : !isBlack && !isNull,
            'blackCircle' : isBlack && !isNull
        })
        return <div className={stoneClass}></div>
    }

    render() {
        const isNull = (this.props.value === null)
        const value = this.props.value
        return (
            <button disabled={isNull ? "":"disabled"} className="square" onClick={() => this.props.onClick()}>
            {this.renderStone(value, isNull)} 
            </button>
        );
    }
}

export default Square;
