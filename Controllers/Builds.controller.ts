import express, { Express, query, Request, Response } from 'express';
import mongoose, { model } from 'mongoose';
import { preBuilds } from '../models/prebuilds.model';
import { FishModel } from '../models/fish.model';
import { DecorationModel } from '../models/decorations.model';
import { UtilityModel } from '../models/utilities.model';
import { userMats } from '../models/userMaterial';
import { TankModel } from '../models/tanks.model';

// First add the builds

// async function addBuild(req: Request, res: Response){
//     try {
//         // const {name, fish, decorations, utilities} = req.body;
//         const {name, fish, decorations, utilities} = req.body;
//         const requiredFish = await FishModel.find({name: fish})
//         const requiredDecorations = await  DecorationModel.find({name: decorations});
//         // const requiredUtilities = await  UtilityModel.find({name: utilities.name})
//         return res.status(200).json(requiredFish)
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({error: error, msg: 'Internal Server error'})
//     }
// }

async function addAllBuilds(req: Request, res: Response) {
    try {
        const builds = req.body;

        if (!builds) {
            return res.status(204).json({ msg: 'no content in builds', builds })
        }
        console.log(builds);

        const insertedBuilds = await preBuilds.insertMany(builds);

        if (!insertedBuilds) {
            return res.status(404).json({ msg: `Could not insert builds, please try later` })
        }

        return res.status(200).json(insertedBuilds)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}

async function getallBuilds(req: Request, res: Response) {
    try {
        const userId = new mongoose.Types.ObjectId('642eb5ee6b9026d7574118d8');
        const populateAreas = {
            path: 'id name imagePath Litres',
            select: 'id name imagePath Litres'
        }

        const builds = await preBuilds.find().populate({
            path: 'MainFish',
            select: 'imagePath',
            model: FishModel
        }).populate({
            path: 'fish',
            populate: {
                ...populateAreas,
                model: FishModel,
            },
        }).populate({
            path: 'decorations',
            populate: {
                ...populateAreas,
                model: DecorationModel,

            },
        }).populate({
            path: 'utilities',
            populate: {
                ...populateAreas,
                model: UtilityModel,
            },
        }).populate({
            path: 'tank',
            select: 'Litres',
            model: TankModel
        })
        const user = await userMats.find({id: userId});

        
        if(!user){
            return res.status(404).json({msg: `User with ${userId} does not have inventory`})
        }
        

        if (!builds) {
            return res.status(404).json({ msg: 'no Builds were found' })
        }
        // console.log(user)

        return res.status(200).json(builds)
    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: error })
    }
}
export default { addAllBuilds, getallBuilds }


// Then get the builds and their information