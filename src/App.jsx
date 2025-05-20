import { useEffect, useRef, useState } from 'react'
import './styles/App.css'

function App() {
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [currentTime, setCurrentTime] = useState(sessionTime * 60);
  const [startStop, setStartStop] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const beepAudio = useRef(null);

  const changeBtn = (id) =>{
    if(id){
    document.getElementById(id).classList.add("active");
    if(id === "start_stop-icon"){
      if(startStop){
        document.getElementById(id).classList.remove("active")
      }
    }
    else{
      setTimeout(()=>document.getElementById(id).classList.remove("active"), 200);
    }
  }
  }

  const reset = () =>{
    setBreakTime(5);
    setSessionTime(25);
    setCurrentTime(60 * 25);
    setStartStop(false);
    setIsBreakTime(false)
    if(beepAudio){
      beepAudio.current.pause();
      beepAudio.current.currentTime = 0;
    }
  }
  const breakTimer = (bool) => {
    if(!startStop){
    !bool ?
    setBreakTime(breakTime => Math.max(1, breakTime - 1)) : 
    setBreakTime(breakTime => Math.min(60, breakTime + 1));
    }
  }
  const sessionTimer = (bool) => {
    if(!startStop){
    !bool ?
    setSessionTime(sessionTime => Math.max(1, sessionTime - 1)) : 
    setSessionTime(sessionTime => Math.min(60, sessionTime + 1));
    }
  }


  useEffect(()=>{
    if(!startStop){
      setCurrentTime(sessionTime * 60);
    }
  }, [sessionTime]);

  const startStopFun = () =>{
    setStartStop(!startStop);
  }

  useEffect(()=>{
    let interval = null;
    
    if(startStop){
      interval = setInterval(()=>{
        setCurrentTime((time)=>{
          if (time === 0){
            if(isBreakTime){
              setCurrentTime(sessionTime * 60);
              setIsBreakTime(false);
              if(beepAudio.current){
                beepAudio.current.play();
              }
            }
            else{
              setCurrentTime(breakTime * 60);
              setIsBreakTime(true);
              if(beepAudio.current){
                beepAudio.current.play();
              }
            }
            return breakTime * 60;
          }
          return time - 1
        });
      }, 1000);
    }
    
    return () => {
      if(interval){
      clearInterval(interval)
      }
    };
    
  }, [startStop, sessionTime, breakTime, isBreakTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSecs = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")} `
  }
  return (
    <main id="main">

    <h1 id="title">25+5 Clock</h1>

      <div id="break-session-div" className="d-flex flex-column flex-md-row container justify-content-around">

        <div id="break-section" className="col-12 col-md-4">
          <h1 id="break-label" className="col-12">Break length</h1>
          <button id="break-increment" className="col-3" onClick={()=>{breakTimer(true), changeBtn("break-increment-icon")}}>
            <i id="break-increment-icon" className="bi bi-chevron-compact-up"></i></button>
            <h2 id="break-length" className="col-12">{breakTime}</h2>
          <button id="break-decrement" className="col-3" onClick={()=>{breakTimer(false), changeBtn("break-decrement-icon")}}>
            <i id="break-decrement-icon" className="bi bi-chevron-compact-down"></i></button>
        </div>

        <div id="session-section" className="col-12 col-md-4 ">
          <h1 id="session-label">Session length</h1>
          <button id="session-increment" className="col-3" onClick={()=>{sessionTimer(true), changeBtn("session-increment-icon")}}>
            <i id="session-increment-icon" className="bi bi-chevron-compact-up"></i></button>
            <h2 id="session-length" className="col-12">{sessionTime}</h2>
          <button id="session-decrement" className="col-3" onClick={()=>{sessionTimer(false), changeBtn("session-decrement-icon")}}>
            <i id="session-decrement-icon"  className="bi bi-chevron-compact-down"></i></button>
        </div>

      </div>

      <div className="container">
      
        <div id="timer-section" className="container col-12 col-md-6">
          <h1 id="timer-label" className="col-12">{isBreakTime ? "Break":"Session"}</h1>
          <h1 id="time-left" className="col-12">{formatTime(currentTime)}</h1>
          <button id="start_stop" className="col-2 justify-content-around" onClick={()=>{startStopFun(), changeBtn("start_stop-icon")}}>
            <i id="start_stop-icon" className="bi bi-skip-start"></i></button>
          <button id="reset" className="col-2" onClick={()=>{reset(), changeBtn("reset-icon")}}>
            <i id="reset-icon" className="bi bi-arrow-clockwise"></i></button>
        </div>

      </div>

    <audio src="./sounds/Beep.mp3" id="beep" ref={beepAudio}></audio>
    </main>
  )
}

export default App
