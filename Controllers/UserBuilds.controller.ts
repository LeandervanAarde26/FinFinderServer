import { Request, Response } from "express";
import { userBuilds } from "../models/userbuild.model";
import { FishModel } from "../models/fish.model";
import { DecorationModel } from "../models/decorations.model";
import { UtilityModel } from "../models/utilities.model";
import { TankModel } from "../models/tanks.model";
import { userMats } from "../models/userMaterial";
import mongoose from "mongoose";

async function getAllUserBuilds(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const populateAreas = {
      path: "id name imagePath Litres",
      select: "id name imagePath Litres",
    };

    const allBuilds = await userBuilds
      .find({ userId })
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

    if (!allBuilds) {
      return res
        .status(204)
        .json({ builds: false, msg: `User with id ${userId} has no builds` });
    }

    console.log(allBuilds);
    return res.status(200).json(allBuilds);
  } catch (error) {}
}

async function viewUserBuild(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const buildId = req.query.buildId;

    const populateAreas = {
      path: "id name imagePath Litres",
      select: "id name imagePath Litres",
    };
    // console.log('-------------------------');
    // console.log('BuildId', buildId);
    // console.log('userID', userId);
    // console.log('-------------------------');
    const userBuild = await userBuilds
      .findOne({ userId: userId, _id: buildId })
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
        select: "Litres Width Height Depth",
        model: TankModel,
      });

    interface obj {
      id: string;
      quantity: number;
    }

    const userBuild2 = await userBuilds.findOne({
      userId: userId,
      _id: buildId,
    });
    const filteredBuild: obj[] = [];
    const userMaterial: any = await userMats.findOne({ id: userId });
    const filteredUserMaterial: obj[] = [];
    let filter;

    if (userBuild2) {
      userBuild2.fish.map((i: any) => {
        filteredBuild.push({ id: i.id.toString(), quantity: i.quantity });
      });

      userMaterial.fish.map((i: any) => {
        filteredUserMaterial.push({
          id: i.id.toString(),
          quantity: i.quantity,
        });
      });

      filter = filteredUserMaterial.filter((item) =>
        filteredBuild.some((i) => i.id === item.id)
      );
    }

    if (!userBuild || !filter) {
      return res
        .status(404)
        .json({ msg: `Users build with ID ${buildId} was not found` });
    }

    return res.status(200).json({ userBuild, filter, filteredBuild });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

async function updateUserBuildMaterial(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const buildId = req.query.id;
    const ItemId = req.body.id;
    const newQuantity: number = req.body.qty;
    const newUserQuanity: number = req.body.userQty;
    const category = req.query.category;

    const userBuild = await userBuilds.findOneAndUpdate(
      { userId: userId, _id: buildId,  [`fish.id`]: ItemId },
      {
        $set: {
          [`fish.$.quantity`]: newQuantity,
        },
      }
    );

    const userMaterial = await userMats.updateOne(
      {
        id: userId,
        [`fish.id`]: ItemId,
      },
      {
        $set: { [`fish.$.quantity`]: newUserQuanity },
      }
    );

    console.log(userBuild, userMaterial);

    return res.status(200).json(userBuild);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export default { getAllUserBuilds, viewUserBuild, updateUserBuildMaterial };
