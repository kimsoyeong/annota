import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./Firebase-setup";
import { doc, setDoc, collection, getDocs } from "firebase/firestore/lite";

function App() {
  const [label, setLabel] = useState(0);
  const [onOff, setOnOff] = useState(0);
  const [timeKST, setTimeKST] = useState("KST");
  const [timeUTC, setTimeUTC] = useState("UTC/GMT");
  const [timestamp, setTimestamp] = useState(0);

  const [logs, setLogs] = useState([]);

  function onClickLabel(l) {
    setLabel(l);
  }

  function onClickOnOff(o) {
    setOnOff(o);
  }

  async function getData() {
    const dataRef = collection(db, "data");
    const dataSnapshot = await getDocs(dataRef);

    var tmp = [];
    // var tmp = "";
    dataSnapshot.docs.map((doc) => {
      tmp.push(doc.data());
      // var d = doc.data();
      // tmp += `${d.timestamp},${d.activity},${d.onoff}\n`;
    });

    setLogs(tmp);
  }

  const classLabels = {
    0: "Walking",
    1: "Running",
    2: "Sitting",
    3: "Standing",
    4: "Upstairs",
    5: "Downstairs",
  };

  async function setData() {
    await setDoc(doc(db, "data", timeKST), {
      timestamp: timestamp,
      activity: label,
      onoff: onOff,
    });
  }

  function onSubmit() {
    setData();
    alert(`Uploaded [${classLabels[label]}] ${onOff ? "Stop" : "Start"}`);
  }

  function onGetData() {
    getData();
  }

  function getCurrentTime() {
    const date = new Date();

    const year = String(date.getFullYear()).padStart(4, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    setTimeKST(`${year}${month}${day}${hour}${minute}${second}`);
    setTimeUTC(date.toUTCString());
    setTimestamp(parseInt(date.getTime() / 1000));
  }

  function copy2Clipboard() {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    var tmp = "";
    logs.map(
      (log, i) => (tmp += `${log.timestamp},${log.activity},${log.onoff}\n`)
    );
    textarea.value = tmp;
    textarea.select();

    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  useEffect(() => {
    setInterval(getCurrentTime, 1000);
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h2>ANNOTATOR</h2>
        <p className="time">{timeKST}</p>
        <p className="time">{timeUTC}</p>
        <p className="time">{timestamp}</p>
      </div>
      <div className="options">
        <table>
          <tbody>
            <tr>
              <td>
                <button
                  className="btn"
                  style={{
                    backgroundColor: label === 0 ? "#F178B6" : "#EDEDED",
                  }}
                  onClick={() => onClickLabel(0)}
                >
                  Walking
                </button>
              </td>
              <td>
                <button
                  className="btn"
                  style={{
                    backgroundColor: label === 1 ? "#7879F1" : "#EDEDED",
                  }}
                  onClick={() => onClickLabel(1)}
                >
                  Running
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  className="btn"
                  style={{
                    backgroundColor: label === 2 ? "#F1CF78" : "#EDEDED",
                  }}
                  onClick={() => onClickLabel(2)}
                >
                  Sitting
                </button>
              </td>
              <td>
                <button
                  className="btn"
                  style={{
                    backgroundColor: label === 3 ? "#5ADB8E" : "#EDEDED",
                  }}
                  onClick={() => onClickLabel(3)}
                >
                  Standing
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  className="btn"
                  style={{
                    backgroundColor: label === 4 ? "#BC78F1" : "#EDEDED",
                  }}
                  onClick={() => onClickLabel(4)}
                >
                  Upstairs
                </button>
              </td>
              <td>
                <button
                  className="btn"
                  style={{
                    backgroundColor: label === 5 ? "#F17878" : "#EDEDED",
                  }}
                  onClick={() => onClickLabel(5)}
                >
                  Downstairs
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="options2">
        <table>
          <tbody>
            <tr>
              <td>
                <button
                  className="btn-onoff"
                  style={{
                    backgroundColor: onOff === 0 ? "#007FFF" : "#EDEDED",
                  }}
                  onClick={() => onClickOnOff(0)}
                >
                  START
                </button>
              </td>
              <td>
                <button
                  className="btn-onoff"
                  style={{
                    backgroundColor: onOff === 1 ? "#007FFF" : "#EDEDED",
                  }}
                  onClick={() => onClickOnOff(1)}
                >
                  STOP
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button className="btn-submit" onClick={onSubmit}>
          SUBMIT
        </button>
        <button
          className="btn-submit"
          style={{ backgroundColor: "#ed5151" }}
          onClick={onGetData}
        >
          GET DATA
        </button>
      </div>
      {logs.length > 0 && (
        <div className="box-logs">
          <button className="btn-close" onClick={() => setLogs([])}>
            CLOSE
          </button>
          <p style={{ fontWeight: "bold" }}>timestamp, activity, onoff</p>
          <div>
            {logs.slice(0, Math.min(10, logs.length)).map((log, i) => (
              <p key={i}>
                {log.timestamp},{log.activity},{log.onoff}
              </p>
            ))}
          </div>
          <button
            className="btn-submit"
            style={{
              backgroundColor: "#ed5151",
              width: "280px",
              height: "30px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
            onClick={copy2Clipboard}
          >
            COPY TO CLIPBOARD
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
