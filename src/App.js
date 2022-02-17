import React, { useRef,useState,useEffect } from 'react';
import './index.css';

function App() {
  
  const canvas = useRef(null);
  const inputRef = useRef(null)
  var array_position = []
  var random_color = ""
  var stopIn = 0
  const [ctx, setContext] = useState({});
  var startTime = 0;

  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;
    setContext(canvas.current.getContext("2d"));
    // get context of the canvas

  }, []);

  const rotateRect = (time) => {
    if(!startTime){
      startTime = time
    }
    if (parseInt(stopIn) !== 0 & parseInt(stopIn) >= (time/1000)-parseInt(startTime/1000)) {
      // clear canvas and redraw all rects
      ctx.clearRect(0,0,600,450);
      requestAnimationFrame(rotateRect);
      
    }else{
      startTime = 0
      time = 0;
    }
    if (parseInt(stopIn) !== 0){
      for(var i=0;i<array_position.length;i++){
        // draw this rect at its specified angle
        var pos =array_position[i];
        ctx.save();
        ctx.translate(pos.x+pos.w/2,pos.y+pos.h/2);
        ctx.rotate(pos.angle);
        ctx.fillStyle=pos.color;
        ctx.fillRect(-pos.w/2,-pos.h/2,pos.w,pos.h);
        ctx.restore();
    
        // increase this rect's angle for next time
        pos.angle+=(Math.PI*2)/120;
      }
    }
  }
  
  const drawFillRect = () => {
    random_color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
    array_position.push({x:Math.floor(Math.random() * 300),y:Math.floor(Math.random() * 300),w:Math.floor(Math.random() * 450),h: Math.floor(Math.random() * 600),color:random_color,angle:0})
    ctx.beginPath();
    ctx.fillStyle = array_position.slice(-1)[0].color;
    ctx.fillRect(array_position.slice(-1)[0].x,array_position.slice(-1)[0].y,array_position.slice(-1)[0].w,array_position.slice(-1)[0].h);
  }

  const changeColor = () => {
    ctx.clearRect(0,0,600,450);
    for(var i=0;i<array_position.length;i++){
      random_color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
      array_position[i].color = random_color
      ctx.beginPath();
      ctx.fillStyle = array_position[i].color
      ctx.fillRect(array_position[i].x,array_position[i].y,array_position[i].w,array_position[i].h);
    }
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  const exportToJson = e => {
    downloadFile({
      data: JSON.stringify(array_position),
      fileName: 'position.json',
      fileType: 'text/json',
    })
  }

  const handleChange = e => {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = () => {
        array_position = JSON.parse(fileReader.result);
          for(var i=0;i<array_position.length;i++){
            ctx.beginPath();
            ctx.fillStyle = array_position[i].color;
            ctx.fillRect(array_position[i].x,array_position[i].y,array_position[i].w,array_position[i].h);
          };
      };
      
    }
  
    const setuptimelimit = e => {
      if(e.length !== 0){
        stopIn = e
      }else{
        stopIn = 0
      }
    }

  return (
    <div className="App">
        <canvas ref={canvas}  onClick={() => changeColor()}></canvas>
        <button className='btn' style={{top: "140px"}} onClick={() => drawFillRect()}>Add rectangle</button>
        <hr className='greyline' style={{top: "237px"}}/>
        <p className="txt-duration">Duration :</p>
        <input className='duration-field' type="text" name="name" onChange={(event) => setuptimelimit(event.target.value)}/>
        <button className='btn' type="submit" style={{top: "340px"}} onClick={() => rotateRect(0)}>Play</button>
        <button style={{top: "420px"}} className='btn' onClick={()=> exportToJson()}>Download .json</button> 
        <input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleChange} />
        <button style={{top: "500px"}} className='btn' onClick={() => inputRef.current.click()}>Upload File</button>
    </div>
  );
}
 
export default App;