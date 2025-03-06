import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Bot } from "lucide-react"; // Sleek icons
import generate from "./gemini";
import va from "./assets/nova3.png";

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [assistantResponse, setAssistantResponse] = useState(
    "I'm Nova, Your Advanced Virtual Assistant"
  );

  useEffect(() => {
    if (isListening) {
      startListening();
    }
  }, [isListening]);

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setAssistantResponse("Nova is thinking...");
      const response = await generate(transcript);
      setAssistantResponse(response);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleTextSubmit = async () => {
    if (!userInput.trim()) return;
    setAssistantResponse("Nova is thinking...");
    const response = await generate(userInput);
    setAssistantResponse(response);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-black">
      {/* Avatar Animation */}
      <motion.img
        src={va}
        alt="Nova AI"
        className="h-[70vh] object-contain drop-shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Assistant Response with Animated Typing Effect */}
      <motion.div
        className="mt-4 text-lg text-gray-300 text-center max-w-2xl px-4 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Bot className="text-cyan-400 w-6 h-6 animate-bounce" />
        {assistantResponse}
      </motion.div>

      {/* Input & Send Button */}
      <div className="flex items-center gap-2 w-full max-w-md mt-6">
        <motion.input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          whileFocus={{ scale: 1.05 }}
        />
        <motion.button
          onClick={handleTextSubmit}
          className="p-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:bg-cyan-600 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Microphone Button with Dynamic Animation */}
      <motion.button
        onClick={() => setIsListening(true)}
        className={`mt-6 p-5 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center
          ${isListening ? "bg-red-500 animate-pulse" : "bg-cyan-500 hover:bg-cyan-600"}`}
        animate={{ scale: isListening ? 1.2 : 1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Mic className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

export default App;
