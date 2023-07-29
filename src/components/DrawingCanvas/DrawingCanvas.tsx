import React, { useState, useRef, forwardRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva'
import s3 from '@/utils/s3'
import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from 'uuid';
import supabase from '@/utils/supabase';

const DrawingCanvas = ({ sendDataToParent }: any) => {
  const [lines, setLines] = useState<any>([]);
  const [isDrawing, setIsDrawing] = useState<any>(false);
  const stageRef = useRef<Konva.Stage>(null);
  const [startDate, setStartDate] = useState<any>(new Date());

  const formattedDate = startDate.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-');

  // Now `formattedDate` will be in ddmmyyyy format

  const [name, setName] = useState<string>('')
  const [signname, setSignName] = useState<any>('')
  const [datatoparent, Setdatatoparent] = useState(true)


  const handleSave = () => {
    setTimeout(() => {
      handleImage();
    }, 2000);


  }

  const handleNameEvents = (e: any) => {
    ;
    setName(e.target.value)
    nameHelper()

  }
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

  const nameHelper = () => {
    //Used to generate random name for the signature
    const min = 1;
    const max = 1000;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    setSignName(`signd${randomNum}`)
    console.log(signname, 1234567);

  }
  const handleImage = async () => {

    //Used to convert the canvas to image

    if (!stageRef.current) return false; // add null check
    const uri = await stageRef.current.toDataURL();
    console.log(stageRef.current, 'stageRef.current');
    if (stageRef.current !== null) {
      console.log(true);

    } else {
      console.log(false);

    }



    const byteString = atob(uri.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], 'image.png', { type: 'image/png' });
    console.log(file);
    try {

      const { data, error } = await supabase
        .from('signdata')
        .insert({ name: name, Date: formattedDate, signName: signname })


    } catch (err) {
      console.log(err);
    }


    // Used to upload the image to s3 bucket

    try {
      const min = 1;
      const max = 100;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

      await s3.upload({
        Bucket: 'canvisign',
        Key: signname,
        Body: file,
      }).promise();
      console.log('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
    }

    Setdatatoparent(false)
    sendDataToParent(datatoparent);

  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col mb-3'>
        <label htmlFor="">Name</label>
        <input type="text" required  onChange={handleNameEvents} className='border-2 border-neutral-800 rounded-md py-2 px-4' />
      </div>
      <div className='flex flex-col mb-3'>
        <label htmlFor="">Date</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className='border-2 border-neutral-800 rounded-md py-2 px-4' />
      </div>
      <div>
        <label htmlFor="">Signature</label>

        <Stage
          ref={stageRef}
          width={395}
          height={300}
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
      </div>

      <button onClick={handleImage}
        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500  mt-4"
      >Save Signature</button>

    </div>
  );
}

export default DrawingCanvas;
