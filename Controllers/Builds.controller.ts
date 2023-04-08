import { Request, Response } from "express";
import mongoose, { model } from "mongoose";
import { preBuilds } from "../models/prebuilds.model";
import { FishModel } from "../models/fish.model";
import { DecorationModel } from "../models/decorations.model";
import { UtilityModel } from "../models/utilities.model";
import { userMats } from "../models/userMaterial";
import { TankModel } from "../models/tanks.model";

async function addAllBuilds(req: Request, res: Response) {
  try {
    const builds = req.body;

    if (!builds) {
      return res.status(204).json({ msg: "no content in builds", builds });
    }
    console.log(builds);

    const insertedBuilds = await preBuilds.insertMany(builds);

    if (!insertedBuilds) {
      return res
        .status(404)
        .json({ msg: `Could not insert builds, please try later` });
    }
    return res.status(200).json(insertedBuilds);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

async function getallBuilds(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const populateAreas = {
      path: "id name imagePath Litres",
      select: "id name imagePath Litres",
    };
    const builds = await preBuilds
      .find()
      .populate({
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
    const userMaterials = await userMats.findOne({ id: userId });
    const allBuilds = await preBuilds.find();

    interface obj {
      id: mongoose.Types.ObjectId;
      complete: boolean;
    }
    let arr: obj[] = [];

    if (userMaterials !== null) {
      for (const build of allBuilds) {
        let newObj: obj = {
          id: build._id,
          complete: true,
        };

        for (const userFish of userMaterials.fish) {
          for (const buildsFish of build.fish) {
            if (userFish.id.toString() === buildsFish.id.toString()) {
              if (userFish.quantity < buildsFish.quantity) {
                newObj.complete = false;
                break;
              }
            }
          }
        }

        for (const userDecorations of userMaterials.decorations) {
          for (const buildDecorations of build.decorations) {
            // if (!newObj.complete) {
            //     break;
            // }
            if (
              userDecorations.id.toString() === buildDecorations.id.toString()
            ) {
              if (userDecorations.quantity < buildDecorations.quantity) {
                newObj.complete = false;
                break;
              }
            }
          }
        }

        for (const userUtilities of userMaterials.utilities) {
          for (const buildUtilities of build.utilities) {
            // if (!newObj.complete) {
            //     break;
            // }
            if (userUtilities.id.toString() === buildUtilities.id.toString()) {
              if (userUtilities.quantity < buildUtilities.quantity) {
                newObj.complete = false;
                break;
              }
            }
          }
        }

        arr.push(newObj);
      }
    }
    console.log(arr);
    console.log(arr.length);

    let returnData: any = [];

    builds.forEach((build) => {
      arr.forEach((a) => {
        if (build.id.toString() === a.id.toString()) {
          let o: any = {
            imagePath: build.MainFish,
            name: build.name,
            fish: build.fish,
            decorations: build.decorations,
            utilities: build.utilities,
            tank: build.tank,
            complete: a.complete,
            _id: build._id,
          };
          returnData.push(o);
        }
      });
    });

    // console.log(returnData);

    if (!userMaterials) {
      return res
        .status(404)
        .json({ msg: `User with ${userId} does not have inventory` });
    }
    if (!builds) {
      return res.status(404).json({ msg: "no Builds were found" });
    }
    return res.status(200).json(returnData);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error: error });
  }
}

export default { addAllBuilds, getallBuilds };

// Then get the builds and their information
