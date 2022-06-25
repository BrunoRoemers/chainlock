import { ButtonHTMLAttributes } from "react";

// exported as array for easier manipulation
export const defaultClassNames = [
  'bg-[#2b3f4a]',
  'text-white',
  'px-12',
  'py-4',
  'rounded-xl',
  'hover:scale-105',
  'disabled:bg-gray-500',
  'ease-in duration-200'
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
