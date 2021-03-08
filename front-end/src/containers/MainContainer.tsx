import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../modules';

import Template, { Title, Contents, ButtonGroup } from '../components/Template';
import Canvas from '../components/Canvas';
import Prediction from '../components/Prediction';
import Button from '../components/Button';
import SignaturePad from 'signature_pad';

import {
  initialize,
  predict,
} from '../modules/base';

const RightIcon = styled.img.attrs({
  src: '/arrow-right.png'
})`
  height: 22px; 
`;

const width = 140;
const height = 140;


const MainContainer: React.FC = () => {

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

  const canvasRef: any = createRef();
  const boundedCanvasRef: any = createRef();
  const mnistCanvasRef: any = createRef();
  

  useEffect(()=>{
    if(canvasRef.current){
      new SignaturePad(canvasRef.current);
    }
  },[]);
  
  /**
   * 
   * @param img 
   * @param threshold 
   */
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
  



  const handlePredict = () => {
    
      const canvasCtx = canvasRef.current.getContext('2d');
      const boundedCtx = boundedCanvasRef.current.getContext('2d');
      const mnistCtx = mnistCanvasRef.current.getContext('2d');

      const imageData = canvasCtx.getImageData(0, 0, width, height);
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


      const boundingRectangle = getBoundingRectable(pixels);
      
      boundedCtx.drawImage(canvasCtx.canvas, 0, 0);
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

  
      const img = mnistCtx.createImageData(width, height);
      for (var i = img.data.length; --i >= 0; ) img.data[i] = 0;

      mnistCtx.putImageData(img, 28, 28);

      // Reset the tranforms
      mnistCtx.setTransform(1, 0, 0, 1, 0, 0);
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
      
      mnistCtx.drawImage(canvasRef.current.getContext('2d').canvas, 0, 0);

      
      const data = mnistCtx.getImageData(0, 0, 28, 28).data;
      const instances : number[] = [];

      for(let i=0,n=784 * 4;i<n;i+=4){
        instances.push( data[i+3] / 255.0);
      }
      
      dispatch(predict.request({instances: instances}));
  }



  const handleClear = () => {
    dispatch(initialize());
    const canvasCtx = canvasRef.current.getContext('2d');
    const boundedCtx = boundedCanvasRef.current.getContext('2d');
    const mnistCtx = mnistCanvasRef.current.getContext('2d');
    canvasCtx.clearRect(0, 0, width, height);
    boundedCtx.clearRect(0, 0, width, height);
    mnistCtx.clearRect(0, 0, width, height);
  }

  return(
    <Template>
      <Title>Handwritten Digit Recognition using Tensorflow Model Serving</Title>
      <Contents>
        <Canvas refer={canvasRef} width={width} height={height} title={"Drawing Board"}/>
        <RightIcon/>
        <Canvas refer={boundedCanvasRef} width={width} height={height} title={"Rect of Interest"}/>
        <RightIcon/>
        <Canvas refer={mnistCanvasRef} width={28} height={28} title={"Model Input Image"}/>
        <RightIcon/>
        <div>
          <Prediction
            result={JSON.parse(JSON.stringify(result))}
            width={300}
            height={200}
          />
        </div>
      </Contents>
      <ButtonGroup>
        <Button onClick={handlePredict} text={'Prediction'}/>
        <Button onClick={handleClear} text={'Clear'}/>
      </ButtonGroup>
    </Template>
  );
}

export default MainContainer;