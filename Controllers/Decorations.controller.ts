import { DecorationModel } from "../models/decorations.model";
import express, { Express, query, Request, Response } from 'express';
import mongoose from 'mongoose';

async function addDecoration(req: Request, res: Response){
    try {
        const {Name, imagePath, Space, Category } = req.body;
        const existingDecoration = await DecorationModel.findOne({name: Name});

        console.log(req.body)

        if(existingDecoration){
            return res.status(409).json({err: `Decoration with name ${Name} already exists in database.`})
        }

        const newMaterial = new DecorationModel({
            name: Name,
            imagePath: imagePath,
            space: Space,
            categories: Category
        });

        const savedDecoration = await newMaterial.save();
        return res.status(200).json({msg: `New Decoration ${savedDecoration.name} added`})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'There was a server error'})
    }

}

async function getDecorations(req: Request, res: Response){
    try {
        const decorations = await DecorationModel.find();
        if(!decorations){
            return res.status(404).json({msg: 'Decorations not found, please add'});
        }

        return res.status(200).json(decorations)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'There was a server error'})
    }
}

export default {addDecoration, getDecorations};