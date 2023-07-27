import React, { useState, useRef, forwardRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva'
import s3 from '@/utils/s3'
import DatePicker from "react-datepicker";

const DrawingCanvas = React.forwardRef((props, ref) => {
  const [lines, setLines] = useState<any>([]);
  const [isDrawing, setIsDrawing] = useState<any>(false);
  const stageRef = useRef<Konva.Stage>(null);
  const [startDate, setStartDate] = useState<any>(new Date());

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.evt;
    setLines([...lines, { points: [offsetX, offsetY] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.evt;
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([offsetX, offsetY]);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };


  const handleSave = async () => {
    if (!stageRef.current) return; // add null check
    const uri = stageRef.current.toDataURL();
    const byteString = atob(uri.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], 'image.png', { type: 'image/png' });
    console.log(file);
    // to s3 upload
    const min = 1;
    const max = 100;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    try {
      const params = {
        Bucket: 'canvisign',
        Key: `signd${randomNum}`,
        Body: file,
      };
      await s3.upload(params).promise();
      console.log('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
    }

  }

  return (
    <div className='flex flex-col'>
      
        {/* <label htmlFor="">Name</label>
        <input type="text" className='border-2 border-neutral-800 rounded-md py-2 px-4' />
        <label htmlFor="">Date</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className='border-2 border-neutral-800 rounded-md py-2 px-4' />
        <label htmlFor="">Signature</label> */}
     
      <Stage
        ref={stageRef}
        width={300}
        height={250}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className='border-2 border-neutral-800'
      >
        <Layer>
          {lines.map((line: any, i: any) => (
            <Line key={i} points={line.points} stroke="black" strokeWidth={5} />
          ))}
        </Layer>
      </Stage>

      <button onClick={handleSave}
        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500  mt-4"
      >Save Drawing</button>
      
    </div>
  );
});

export default DrawingCanvas;
