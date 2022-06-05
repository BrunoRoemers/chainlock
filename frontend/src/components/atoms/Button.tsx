import { ButtonHTMLAttributes } from "react";

// exported as array for easier manipulation
export const defaultClassNames = [
  'bg-blue-600',
  'text-white',
  'px-2',
  'py-1',
  'rounded-md',
  'hover:bg-blue-500',
  'disabled:bg-gray-500'
]

interface Props extends React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

const Button = ({
  children,
  className,
  ...otherProps
}: Props) => {
  const finalClassName = className ? className : defaultClassNames.join(' ');

  return (
    <button className={finalClassName} {...otherProps}>{children}</button>
  )
}

export default Button
