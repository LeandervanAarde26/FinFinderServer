import { Request, Response } from "express";
import { userBuilds } from "../models/userbuild.model";
import { FishModel } from "../models/fish.model";
import { DecorationModel } from "../models/decorations.model";
import { UtilityModel } from "../models/utilities.model";
import { TankModel } from "../models/tanks.model";

async function getAllUserBuilds(req: Request, res: Response){
    try {
        const userId = req.params.id;
        const populateAreas = {
            path: "id name imagePath Litres",
            select: "id name imagePath Litres",
          };

        const allBuilds = await userBuilds.find({userId})      .populate({
            path: "MainFish",
            select: "imagePath",
            model: FishModel,
          })
          .populate({
            path: "fish",
            populate: {
              ...populateAreas,
              model: FishModel,
            },
          })
          .populate({
            path: "decorations",
            populate: {
              ...populateAreas,
              model: DecorationModel,
            },
          })
          .populate({
            path: "utilities",
            populate: {
              ...populateAreas,
              model: UtilityModel,
            },
          })
          .populate({
            path: "tank",
            select: "Litres",
            model: TankModel,
          });

        if(!allBuilds){
            return res.status(204).json({builds: false, msg: `User with id ${userId} has no builds`});
        }

        console.log(allBuilds)
        return res.status(200).json(allBuilds)
    } catch (error) {
        
    }
}

export default {getAllUserBuilds}