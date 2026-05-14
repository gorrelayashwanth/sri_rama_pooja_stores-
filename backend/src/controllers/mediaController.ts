import { Request, Response, NextFunction } from 'express';

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
        url: file.path,
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
      url: file.path,
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