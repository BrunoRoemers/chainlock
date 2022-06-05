interface Props {
  children?: React.ReactNode
}

const FrameMessage = ({children}: Props) => {
  return (
    <div className="pt-4 text-center">{children}</div>
  )
}

export default FrameMessage
