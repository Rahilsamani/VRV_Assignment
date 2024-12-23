import { useState, useEffect } from "react";

const Track = () => {
  const [timer, setTimer] = useState(null);
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hour, setHour] = useState(0);
  const [srNo, setSrNo] = useState(0);
  const [inTime, setInTime] = useState("");
  const [timeStr, setTimeStr] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const checkAndResetData = () => {
      const today = new Date().toLocaleDateString();
      const storedDate = localStorage.getItem("lastResetDate");

      if (storedDate !== today) {
        resetAll();
        localStorage.setItem("lastResetDate", today);
      }
    };

    checkAndResetData();

    const storedData = JSON.parse(localStorage.getItem("tableData"));
    if (storedData) {
      setTableData(storedData);
      setSrNo(storedData.length);
    }

    const storedTimer = JSON.parse(localStorage.getItem("timerData"));
    if (storedTimer) {
      setSec(storedTimer.sec);
      setMin(storedTimer.min);
      setHour(storedTimer.hour);
      setIsRunning(storedTimer.isRunning);
      if (storedTimer.isRunning) {
        startTimer();
      }
    }
  }, []);

  const startTimer = async () => {
    if (!timer) {
      const today = new Date();
      setInTime(formatTime(today));

      const newTimer = setInterval(() => {
        setSec((prevSec) => {
          if (prevSec + 1 === 60) {
            setMin((prevMin) => (prevMin + 1 === 60 ? 0 : prevMin + 1));
            if (prevSec === 59 && min === 59) {
              setHour((prevHour) => prevHour + 1);
            }
            return 0;
          } else {
            return prevSec + 1;
          }
        });
      }, 1000);
      setTimer(newTimer);
      setIsRunning(true);
      saveTimerData(true);
    }
  };

  const stopTimer = async () => {
    clearInterval(timer);
    setTimer(null);
    setIsRunning(false);
    saveTimerData(false);
    insertElement();
  };

  const resetTimer = () => {
    clearInterval(timer);
    setTimer(null);
    setSec(0);
    setMin(0);
    setHour(0);
    setTimeStr("00:00:00");
    setIsRunning(false);
    localStorage.removeItem("timerData");
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const insertElement = async () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const outTime = formatTime(date);

    const newRow = {
      srNo: srNo + 1,
      date: `${day}-${month}-${year}`,
      inTime,
      outTime,
    };

    const updatedTableData = [...tableData, newRow];
    setTableData(updatedTableData);
    setSrNo((prevSrNo) => prevSrNo + 1);
  };

  const saveTimerData = (isRunning) => {
    const timerData = {
      sec,
      min,
      hour,
      isRunning,
    };
    localStorage.setItem("timerData", JSON.stringify(timerData));
  };

  const resetAll = () => {
    resetTimer();
    setTableData([]);
    setSrNo(0);
    localStorage.removeItem("tableData");
  };

  useEffect(() => {
    const secStr = sec < 10 ? "0" + sec : sec;
    const minStr = min < 10 ? "0" + min : min;
    const hourStr = hour < 10 ? "0" + hour : hour;

    setTimeStr(`${hourStr}:${minStr}:${secStr}`);
  }, [sec, min, hour]);

  useEffect(() => {
    saveTimerData(isRunning);
  }, [sec, min, hour]);

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Timer */}
      <div className="w-[65%] sm:w-[350px] flex flex-col justify-center items-center h-1/3 mt-16">
        {/* Time */}
        <div className="flex justify-center items-center text-center w-full p-5 text-[#f3f3f3] bg-[#202f5e] rounded-t-lg text-3xl">
          {timeStr}
        </div>
        {/* Buttons */}
        <div className="flex justify-center items-center gap-10 text-center p-5 bg-[#EBF4F6] rounded-b-lg w-full">
          <button
            className={`border border-black ${
              isRunning && "opacity-50"
            } rounded-sm px-2`}
            onClick={startTimer}
            disabled={isRunning}
          >
            Start
          </button>
          <button
            className={`border border-black ${
              !isRunning && "opacity-50"
            } rounded-sm px-2`}
            onClick={stopTimer}
            disabled={!isRunning}
          >
            Stop
          </button>
        </div>
      </div>
      {/* Table */}
      <table id="myTable" className="mt-16 w-11/12">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Date</th>
            <th>In Time</th>
            <th>Out Time</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.srNo}</td>
              <td>{row.date}</td>
              <td>{row.inTime}</td>
              <td>{row.outTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Track;
