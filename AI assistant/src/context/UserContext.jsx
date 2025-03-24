import React, { createContext, useState } from 'react';
import run from '../gemini';

export const dataContext = createContext();

const UserContext = ({ children }) => {
  let [speaking, setspeaking] = useState(false);
  let [recogText, setrecogText] = useState("Listening..");
  let [response, setresponse] = useState(false);

  // Speak function
  function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.lang = "en-IN";
    window.speechSynthesis.speak(text_speak);
  }

  // Process AI response
  async function aiResponse(prompt) {
    let text = await run(prompt);
    let newText = text.replace(/\*\*\*|\*\*|\*/g, "").replace(/google/gi, "sanjib deka"); 
    console.log(newText);
    setrecogText(newText);
    speak(newText);
    setresponse(true);

    setTimeout(() => {
      setspeaking(false);
    }, 12000);
  }

  // Speech recognition 
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition();

  recognition.onresult = (e) => {
    let transcript = e.results[e.resultIndex][0].transcript;
    console.log(transcript);
    setrecogText(transcript);
    takeCommand(transcript.toLowerCase());
  };

  function takeCommand(Command) {
    if (Command.includes("open") && Command.includes("youtube")) {
      speak("Opening YouTube...");
      window.open("https://www.youtube.com/", "_blank");
      setrecogText("Opening YouTube...");
    } else if (Command.includes("open") && Command.includes("google")) {
      speak("Opening Google...");
      window.open("https://google.com/", "_blank");
      setrecogText("Opening Google...");
    } else if (Command.includes("open") && Command.includes("facebook")) {
      speak("Opening Facebook...");
      window.open("https://facebook.com/", "_blank");
      setrecogText("Opening Facebook...");
    } else if (Command.includes("open") && Command.includes("instagram")) {
      speak("Opening Instagram...");
      window.open("https://instagram.com/", "_blank");
      setrecogText("Opening Instagram...");
    } else if (Command.includes("open") && Command.includes("calculator")) {
      speak("Opening Calculator...");
      setrecogText("calculator://");
      window.open("https://instagram.com/", "_blank");
    } else if (Command.includes("open") && Command.includes("whatsapp")) {
      speak("Opening WhatsApp...");
      setrecogText("Opening WhatsApp...");
      // "whatsapp://" works only on mobile, so consider using WhatsApp Web
      window.open("https://web.whatsapp.com/", "_blank");
    } else if (Command.includes("time")) {
      let time = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" });
      speak(`The current time is ${time}`);
      setrecogText(`The current time is ${time}`);
    } else if (Command.includes("date")) {
      let date = new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
      speak(`Today's date is ${date}`);
      setrecogText(`Today's date is ${date}`);
    } else if (Command.includes("who are you")) {
      speak("I am a virtual assistant, created by Sanjib");
      setrecogText("I am a virtual assistant, created by Sanjib");
    } else {
      aiResponse(Command);
    }
  
    setTimeout(() => {
      setspeaking(false);
    }, 12000);
  }
  

  // dataprovider to all using context api
  let value = {
    recognition,
    speaking,
    setspeaking,
    recogText,
    setrecogText,
    response,
    setresponse,
  };

  return (
    <dataContext.Provider value={value}>
      {children}
    </dataContext.Provider>
  );
};

export default UserContext;
