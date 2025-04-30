import Spinner from './Spinner'

const Fallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Spinner loading={true} />
    </div>
  )
}

export default Fallback
