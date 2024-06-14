import { NextFunction, Request, Response } from "express";
import { addNewImage, fetchImages, removeImage } from "../db/image";



export async function getimages(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await fetchImages()
        if (response) {
            res.json(response)
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}



export async function uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { url, uploadat } = req.body;
        const response = await addNewImage({ url, uploadat })
        if (response) {
            res.json({
                message: "Image uploaded successfully"
            })
        }
        return next();
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await removeImage(req.params.id)
        if (response) {
            res.json({
                code: 200,
                message: "Image deleted successfully"
            })
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Server Error"
            })
        }
        return next();
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        })
    }
}