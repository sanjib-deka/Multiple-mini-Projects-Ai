import React, { useContext, useEffect } from 'react';
import "./App.css";
import va from "./assets/nova3.png";
import { FaMicrophoneLines } from "react-icons/fa6";
import { dataContext } from './context/UserContext';
import speakingGif from './assets/speak.gif'; // ✅ Renamed to avoid conflict
import responseGif from './assets/aiVoice.gif'

const App = () => {
  let { recognition, speaking, setspeaking , recogText,setrecogText , response,setresponse} = useContext(dataContext);

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-start mt-20">
      <img id='nova' src={va} alt="Avatar" className="h-[80vh] object-contain" />
      <span className="block text-white text-2xl mt-4">
        {speaking ? "Listening..." : "I'm Nova, Your Advanced Virtual Assistant"}
      </span>

      {/* Button and Listening Animation */}
      {!speaking ? (
        <button
          onClick={() => {
            setrecogText("Listening...")
            recognition.start();
            setspeaking(true);
            setresponse(false)
          }}
          className="bg-cyan-400  text-black px-8 py-6 mt-6 rounded-lg rounded-b-xl   flex items-center gap-2 text-lg font-semibold shadow-lg 
            hover:bg-sky-500 hover:shadow-sky-600 hover:shadow-md hover:scale-105 transition duration-300 ease-in-out"
        >
         Click to speak  <FaMicrophoneLines className="text-xl" />
        </button>
      ) : (
        <div className='flex items-center justify-center flex-col'>

          {!response? <img src={speakingGif} alt="Speaking animation" className="w-16 h-16 mt-6 animate-pulse" /> : 
           <img src={responseGif} alt="Response animation" className="w-35 h-20 mt-6 animate-pulse" />}

        <p className='text-amber-50 text-xl'> {recogText}  </p>
        </div>
      )}
    </div>
  );
};

export default App;
