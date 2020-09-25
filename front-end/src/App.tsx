import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { RootState } from './modules';
import './App.css';



import {
  predict,
} from './modules/base';



const width = 140;
const height = 140;

const App = () => {

  const dispatch = useDispatch();

  const {
    result,
    error,
  } = useSelector(
    (state: RootState) => ({
      result: state.base.result,
      error: state.base.error,
    })
  );

  
  let pos = {
    drawable: false,
    X: -1,
    Y: -1
  };


  const canvasRef: any = createRef();
  const boundedCanvasRef: any = createRef();
  const mnistCanvasRef: any = createRef();

  const [ctx, setCtx] = useState<any>();
  const [boundedCtx, setBoundedCtx] = useState<any>();
  const [mnistCtx, setMnistCtx] = useState<any>();
  
  const [data, setData] = useState<any>({
    labels: ['0', '1', '2', '3', '4', '5', '6', '7','8','9'],
    datasets: [
      {
        // label: 'My First dataset',
        // backgroundColor: 'rgba(255,99,132,0.2)',
        // borderColor: 'rgba(255,99,132,1)',
        // borderWidth: 1,
        // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        // hoverBorderColor: 'rgba(255,99,132,1)',
        data: result.predictions[0]
      }
    ]
  })

  useEffect(()=>{
    if(canvasRef.current){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      setCtx(ctx);
      setMnistCtx(mnistCanvasRef.current.getContext('2d'));
      setBoundedCtx(boundedCanvasRef.current.getContext('2d'));
      
      canvas.addEventListener('mousedown', (e: any)=>{
        ctx.beginPath();
        pos = { drawable: true, ...getPosition(e) }
        ctx.moveTo(pos.X, pos.Y);
      });

      canvas.addEventListener('mousemove', (e: any)=>{
        if (pos.drawable) {
          pos = { ...pos, ...getPosition(e)};
          ctx.lineTo(pos.X, pos.Y);
          ctx.stroke();
        }
      });

      canvas.addEventListener('mouseup', (e: any)=>{
        pos = {drawable: false, X: -1, Y: -1};
      });

      canvas.addEventListener('mouseout', (e: any)=>{
        pos = {drawable: false, X: -1, Y: -1};
      });
    }
  },[]);


  useEffect(()=>{
    setData({
      ...data,
      datasets: [{
        ...data.datasets[0],
        data: result.predictions[0]
      }]
    })
    
  },[result]);


  // useEffect(()=>{
  //   console.log(result, error);

  // },[result, error]);


  const getPosition = (e: any) => {
    return { X: e.offsetX, Y: e.offsetY };
  }


  const getBoundingRectable = (img: number[][], threshold = 0.01) => {
    const rows = img.length;
    const columns= img[0].length;

    let minX = columns;
    let minY = rows;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        if (img[y][x] > 1 -  threshold) {
          if (minX > x) minX = x;
          if (maxX < x) maxX = x;
          if (minY > y) minY = y;
          if (maxY < y) maxY = y;
        }
      }
    }
    return { minY, minX, maxY, maxX };
  }
  

  const onPredict = () => {
    
      
      if( ctx ) {
        const imageData = ctx.getImageData(0, 0, width, height);
        
        const pixels: number[][] = [[]];

        let h=0;
        let w=0;
        
        for(let i=0,n=height * width * 4; i < n; i+=4){
          const r = imageData.data[i];
          const g = imageData.data[i+1];
          const b = imageData.data[i+2];
          const a = imageData.data[i+3];

          if (w >= width){
            w = 0;
            h++;
            pixels[h] = [];
          }

          pixels[h].push(Math.round( a * 100) / 100);
          w++;
        }

        const boundingRectangle = getBoundingRectable(pixels)
        

        boundedCtx.drawImage(ctx.canvas, 0, 0);
        boundedCtx.beginPath();
        boundedCtx.lineWidth= '1';
        boundedCtx.strokeStyle= 'red';
        boundedCtx.rect(
          boundingRectangle.minX,
          boundingRectangle.minY,
          Math.abs(boundingRectangle.minX - boundingRectangle.maxX),
          Math.abs(boundingRectangle.minY - boundingRectangle.maxY),
        ); 
        boundedCtx.stroke();
        

        
        const brW = boundingRectangle.maxX + 1 - boundingRectangle.minX;
        const brH = boundingRectangle.maxY + 1 - boundingRectangle.minY;
        const scalingFactor = 20 / Math.max(brW, brH);

        console.log(mnistCtx)
        const img = mnistCtx.createImageData(100, 100);
        for (var i = img.data.length; --i >= 0; )
          img.data[i] = 0;
        mnistCtx.putImageData(img, 100, 100);

        // Reset the tranforms
        mnistCtx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Clear the canvas.
        // mnistCtx.clearRect(0, 0, 28, 28);
        // mnistCtx.lineWidth= '1';
        // mnistCtx.strokeStyle= 'green';
        // mnistCtx.rect(4, 4, 20, 20); 
        // mnistCtx.stroke();

        mnistCtx.translate(
          -brW * scalingFactor / 2,
          -brH * scalingFactor / 2
        );
        mnistCtx.translate(
          mnistCtx.canvas.width / 2,
          mnistCtx.canvas.height / 2
        );
        mnistCtx.translate(
          -Math.min(boundingRectangle.minX, boundingRectangle.maxX) * scalingFactor,
          -Math.min(boundingRectangle.minY, boundingRectangle.maxY) * scalingFactor
        );
        mnistCtx.scale(scalingFactor, scalingFactor);
        
        // mnistCtx.translate(scaledCtx.width / 2, scaledCtx.height / 2);
        // mnistCtx.scale(scaleX, scaleY);
        // mnistCtx.translate(-scaledCtx.width/2, -scaledCtx.height /2);
        // mnistCtx.clearRect(0, 0, 28, 28);
        mnistCtx.drawImage(ctx.canvas, 0, 0);




        
        const data = mnistCtx.getImageData(0, 0, 28, 28).data;
        const instances : number[] = [];

        for(let i=0,n=784 * 4;i<n;i+=4){
          instances.push( data[i+3] / 255.0);
        }
        console.log(instances)
        
        dispatch(predict.request({instances: instances}));
      }
    
    
    
    
    
    // dispatch(preict)
  }

  
  return (
    <div className="App">
      
      <canvas ref={canvasRef} width={width} height={height} style={{border: '1px solid black'}}></canvas>
      <canvas ref={boundedCanvasRef} width={width} height={height} style={{border: '1px solid black'}}></canvas>
      <canvas ref={mnistCanvasRef} width={28} height={28} style={{border: '1px solid black'}}></canvas>


      <button onClick={onPredict}>Predict</button>
      <div>
        <Bar
          data={data}
          width={400}
          height={300}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
}

export default App;
