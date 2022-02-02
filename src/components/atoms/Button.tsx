import { MouseEventHandler, ReactElement, ReactNode } from 'react'
import styles from './Button.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function Button({
  children,
  style,
  type,
  className,
  onClick,
  ...props
}: {
  children: ReactNode
  style: 'primary' | 'ghost'
  type?: 'button' | 'reset' | 'submit'
  className?: string
  onClick?: MouseEventHandler
  disabled?: boolean
}): ReactElement {
  const classes = cx(
    {
      button: true,
      primary: style === 'primary',
      ghost: style === 'ghost',
      disabled: props.disabled
    },
    className
  )

  return (
    <button className={classes} type={type} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
