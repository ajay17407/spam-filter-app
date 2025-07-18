import React,{useState} from 'react'
import axios from 'axios'
import './index.css'


const App = () => {
  const [message,setMessage] = useState('');
  const [prediction,setPrediction] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);


  const handleSubmit = async(e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      console.log("Submitting message:");

      try{
        const response = await axios.post('http://localhost:5000/api/check-spam',{message});
        setPrediction(response.data);
      }
      catch(error)
      {
        console.error('error:',error);
        setError('Error occurred try again.')
      }
      finally{
        setLoading(false);
      }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
  <div className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/20">
    <h1 className="text-3xl font-bold text-white text-center mb-8 font-sans">
      <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Spam Detection
      </span>
    </h1>
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="px-5 py-3.5 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all text-white placeholder-gray-300"
        placeholder="Enter a message..."
      />

      <button
        type="submit"
        className={`px-5 py-3.5 text-white font-semibold rounded-xl transition-all ${
          loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
        } flex items-center justify-center gap-2 shadow-lg hover:shadow-pink-500/30`}
        disabled={loading}
      >
        {loading ? (
          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          'Predict'
        )}
      </button>
    </form>

    {error && (
      <p className="mt-6 text-red-300 text-center font-medium bg-red-900/20 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-red-800/50">
        {error}
      </p>
    )}

    {prediction && (
      <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 text-center">
        <p className="text-lg font-medium text-gray-200">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-semibold">
            Spam Probability:
          </span> {prediction.spam_probability.toFixed(2)}%
        </p>
        <p className={`mt-3 text-2xl font-bold ${prediction.isSpam ? 'text-red-400' : 'text-green-400'}`}>
          {prediction.isSpam ? 'This is Spam 🚫' : 'This is Not Spam ✅'}
        </p>
      </div>
    )}
  </div>
</div>
  );
}

export default App