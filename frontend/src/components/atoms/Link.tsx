// exported as array for easier manipulation
export const defaultClassNames = [
  'underline',
  'text-blue-600'
]

const Link = ({
  children,
  className,
  ...otherProps
}: React.HTMLProps<HTMLAnchorElement>) => {
  const finalClassName = className ? className : defaultClassNames.join(' ');

  return (
    <a className={finalClassName} {...otherProps}>{children}</a>
  )
}

export default Link
