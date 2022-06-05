interface Props {
  children?: React.ReactNode 
}

const Frame = ({children}: Props) => {
  return (
    <div className="h-full flex justify-center items-center p-4">
      <div className="grow max-w-md bg-pink-100 rounded-lg p-4">
        {children}
      </div>
    </div>
  )
}

export default Frame
