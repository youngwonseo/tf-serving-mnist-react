import React from 'react';
import { Bar } from 'react-chartjs-2';

interface PredictionProps {
  result: any;
  width: number;
  height: number;
}

const Prediction: React.FC<PredictionProps> = ({
  result,
  width,
  height
}) => {

  const options = {
    legend: {
      display:false,
    },
    scales: {
      yAxes: [{
        ticks: { 
          min: 0, 
          max: 1,
        }
      }]
    },
    animation: {
      
    }
  }

  return (
    <Bar
      data={result}
      width={width}
      height={height}
      options={options}
    />
  );
}

export default Prediction;