import React from 'react'
import { DraggableCore } from 'react-draggable'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { createCoreData, noop } from './utils'


interface Props {
  children: React.ReactNode,
  defaultPosition: {
    x: number,
    y: number,
  },
  onStart: Function
  onDrag: Function
  onStop: Function
}

interface State {
  x: number,
  y: number,
}


export default class DraggableChild extends React.Component<Props, State> {

  static defaultProps = {
    defaultPosition: { x: 0, y: 0 },
    onStart: noop,
    onDrag: noop,
    onStop: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      x: props.defaultPosition.x,
      y: props.defaultPosition.y,
    }

    this.x = props.defaultPosition.x
    this.y = props.defaultPosition.y
  }

  handleStart = (ev, b) => {
    const { x, y } = this.state
    this.lastX = b.lastX - x
    this.lastY = b.lastY - y
    this.props._start()
    this.props.onStart(ev, createCoreData(b, { x, y }))
  }

  handleDrag = (ev, b) => {
    const dragX = b.lastX - this.lastX
    const dragY = b.lastY - this.lastY
    const { x, y } = this.props._drag(dragX, dragY)
    this.setState({ x, y })

    this.props.onDrag(ev, createCoreData(b, {
      originX: dragX,
      originY: dragY,
      x,
      y,
    }))
  }

  handleStop = (ev, b) => {
    const { x, y } = this.state
    this.props._stop()
    this.props.onStop(ev, createCoreData(b, { x, y }))
  }

  render() {
    const { x, y } = this.state
    const { active, children, activeClassName } = this.props
    const style = {
      ...children.props.style,
      position: 'absolute',
      top: y,
      left: x,
    }

    const className = classNames(children.props.className, {
      [activeClassName]: active,
    })

    return (
      <DraggableCore
        grid={[1, 1]}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        onStart={this.handleStart}
        position={{ x, y }}
      >
        {React.cloneElement(this.props.children, {
          style,
          className,
          ['data-x']: x,
          ['data-y']: y,
        })}
      </DraggableCore>
    )
  }
}
