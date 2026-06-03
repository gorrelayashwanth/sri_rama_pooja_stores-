import { Request, Response, NextFunction } from 'express';

const getFileUrl = (file: any) => {
  if (!file.path) return '';
  const isUrl = file.path.startsWith('http://') || file.path.startsWith('https://');
  return isUrl ? file.path : `/uploads/${file.filename}`;
};

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.file as any;
    
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: getFileUrl(file),
        publicId: file.filename
      }
    });
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const images = files.map(file => ({
      url: getFileUrl(file),
      publicId: file.filename
    }));

    res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      data: images
    });
  } catch (error) {
    next(error);
  }
};