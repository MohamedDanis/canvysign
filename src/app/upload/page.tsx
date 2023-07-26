"use client"
import React from 'react';
import s3 from '@/utils/s3'

const MyComponent = () => {
    const handleFileUpload = async (e:any) => {
        console.log(e);
        
        const file = e.target.files && e.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }
        console.log(file);
        

    try {
      const params = {
        Bucket: 'canvisign',
        Key: file.name,
        Body: file,
      };

      await s3.upload(params).promise();
      console.log('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
    }
     };

  return (
    <div>
      <input type="file" onChange={handleFileUpload}/>
      <input type="submit" onClick={handleFileUpload} />
    </div>
  );
};

export default MyComponent;
