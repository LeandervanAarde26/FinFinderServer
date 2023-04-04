import express, { Express, query, Request, Response } from 'express';
import mongoose from 'mongoose';
import { preBuilds } from '../models/prebuilds.model';
import { FishModel } from '../models/fish.model';
import { DecorationModel } from '../models/decorations.model';
import { UtilityModel } from '../models/utilities.model';

// First add the builds

async function addBuild(req: Request, res: Response){
    try {
        // const {name, fish, decorations, utilities} = req.body;
        const {name, fish, decorations, utilities} = req.body;
        const requiredFish = await FishModel.find({name: fish})
        const requiredDecorations = await  DecorationModel.find({name: decorations});
        // const requiredUtilities = await  UtilityModel.find({name: utilities.name})
        return res.status(200).json(requiredFish)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error, msg: 'Internal Server error'})
    }
}

export default {addBuild}


// Then get the builds and their information