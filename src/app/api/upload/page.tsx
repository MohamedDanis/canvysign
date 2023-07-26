
import multer from 'multer'
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Create a new instance of Multer
const upload = multer({ dest: './uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFile = (file:any) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file.path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const filePath = path.join('./uploads/', file.originalname);
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(filePath);
          }
        });
      }
    });
  });
};


const handler = async (req:any, res:any) => {
    try {
        await upload.single('drawing')(req, res, () => {});

        if (!req.file) {
            return new NextResponse("no file",{status:400})
        }
        console.log(req.file);
        
        const filePath = await uploadFile(req.file);
        res.status(200).json({ message: 'File uploaded successfully.', filePath });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }
};

export default handler;
