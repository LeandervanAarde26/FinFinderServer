import { UtilityModel } from "../models/utilities.model";
import { Express, query, Request, Response } from "express";

async function addUtility(req: Request, res: Response){
    try {
        const {Name, imagePath, Space, Category } = req.body;
        const existingUtility = await UtilityModel.findOne({name: Name});

        console.log(req.body)

        if(existingUtility){
            return res.status(409).json({err: `Utility with name ${Name} already exists in database.`})
        }

        const newMaterial = new UtilityModel({
            name: Name,
            imagePath: imagePath,
            space: Space,
            categories: Category
        });

        const savedUtility = await newMaterial.save();
        return res.status(200).json({msg: `New Decoration ${savedUtility.name} added`})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'There was a server error'})
    }
}

async function getUtilities(req: Request, res: Response){
    try {
        const utilities = await UtilityModel.find();

        if(!utilities){
            return res.status(404).json({msg: 'Utilities not found, please add'});
        }

        return res.status(200).json(utilities);
    } catch (error) {
        console.log(error);
        return res.status(500).json({err: error})
    }
}

async function getById(req: Request, res: Response){
    const id = req.params.id;
    try {
        const individualUtil = await UtilityModel.findById(id);
        if(!individualUtil){
            return res.status(404).json({error: 'Utility was not found, please try again'});
        }
        return res.status(200).json(individualUtil ?? {error: `Utility with ${id} was not found.`})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'There was a server error'})
    }
}

export default {addUtility, getUtilities, getById}