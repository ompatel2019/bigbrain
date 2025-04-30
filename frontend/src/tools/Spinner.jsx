import { HashLoader } from 'react-spinners'

const Spinner = ({ loading }) => {
  return (
    <div className="flex items-center justify-center">
      <HashLoader
        color="#4338ca"
        loading={loading}
        size={50}
      />
    </div>
  )
}

export default Spinner
