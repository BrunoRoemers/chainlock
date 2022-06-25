interface Props {
  children?: React.ReactNode
}

const FrameMessage = ({children}: Props) => {
  return (
    <div className="pt-4">{children}</div>
  )
}

export default FrameMessage
