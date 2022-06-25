interface Props {
  children?: React.ReactNode 
}

const Frame = ({children}: Props) => {
  return (
    <div className="h-full align-center">
      <div className="flex items-center align-center p-0">
        <div className="pt-20">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Frame
