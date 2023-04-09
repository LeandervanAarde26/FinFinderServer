import { Request, Response } from "express";
import mongoose, { model } from "mongoose";
import { preBuilds } from "../models/prebuilds.model";
import { FishModel } from "../models/fish.model";
import { DecorationModel } from "../models/decorations.model";
import { UtilityModel } from "../models/utilities.model";
import { userMats } from "../models/userMaterial";
import { TankModel } from "../models/tanks.model";
import { userBuilds } from "../models/userbuild.model";

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

async function craftBuild(req: Request, res: Response) {
  try {
    // General functions that find the users materials and find the specified build that they want to build.
    const userId = req.params.id;
    const buildId = req.query.buildId;
    const user = await userMats.findOne({ id: userId });
    const build = await preBuilds.findById(buildId);

    interface obj {
      id: string;
      quantity: number;
    }
    //If neither are found stop the route and return a message;
    if (!userId || !buildId) {
      return res.status(404).json({
        msg: `user with id ${userId} or build with id ${buildId} was not found`,
      });
    }
    //Check if they are found then start the functions;
    //variables for decorations
    const buildDecorationsArr: obj[] = [];
    const userDecorationsArr: obj[] = [];
    let DecorationFilter;
    let updatedDecorations;

    //Variables for utilities
    const buildUtilitiesArr: obj[] = [];
    const userUtilitiesArr: obj[] = [];
    let utilitiesFilter;
    let updatedUtilities;

    //variables for fish
    const buildFishArr: obj[] = [];
    const userFishArr: obj[] = [];
    let fishFilter;
    let updatedFish;

    if (build !== null && user) {
      //Logic for builds fish
      // Loop through build and user data to return only their id and quantity
      build.fish.map((i: any) => {
        buildFishArr.push({ id: i.id.toString(), quantity: i.quantity });
      });

      user.fish.map((i: any) => {
        userFishArr.push({ id: i.id.toString(), quantity: i.quantity });
      });

      //Then we filter through that to find the matching ids
      fishFilter = userFishArr.filter((fish) =>
        buildFishArr.some((buildFish) => buildFish.id === fish.id)
      );

      // Finally we loop through all that to get the new quantities
      fishFilter.forEach((item, index) => {
        item.quantity = item.quantity - buildFishArr[index].quantity;
      });

      //update values on Mongo.
      for (let quantity of fishFilter) {
        updatedFish = await userMats.updateOne(
          {
            id: userId,
            [`fish.id`]: new mongoose.Types.ObjectId(quantity.id),
          },
          {
            $set: { "fish.$.quantity": quantity.quantity },
          }
        );
      }

      console.log(fishFilter);

      //Logic for builds decorations
      // Loop through build and user data to return only their id and quantity
      build.decorations.map((i: any) => {
        buildDecorationsArr.push({ id: i.id.toString(), quantity: i.quantity });
      });

      user.decorations.map((i: any) => {
        userDecorationsArr.push({ id: i.id.toString(), quantity: i.quantity });
      });

      //Then we filter through that to find the matching ids
      DecorationFilter = userDecorationsArr.filter((decoration) =>
        buildDecorationsArr.some(
          (buildDecoration) => buildDecoration.id === decoration.id
        )
      );

      // Finally we loop through all that to get the new quantities
      DecorationFilter.forEach((item, index) => {
        item.quantity = item.quantity - buildDecorationsArr[index].quantity;
      });

      //update values on Mongo.
      for (let quantity of DecorationFilter) {
        updatedDecorations = await userMats.updateOne(
          {
            id: userId,
            [`decorations.id`]: new mongoose.Types.ObjectId(quantity.id),
          },
          {
            $set: { "decorations.$.quantity": quantity.quantity },
          }
        );
      }
      console.log(DecorationFilter);

      //Logic for builds decorations
      // Loop through build and user data to return only their id and quantity
      build.utilities.map((i: any) => {
        buildUtilitiesArr.push({ id: i.id.toString(), quantity: i.quantity });
      });

      user.utilities.map((i: any) => {
        userUtilitiesArr.push({ id: i.id.toString(), quantity: i.quantity });
      });

      //Then we filter through that to find the matching ids
      utilitiesFilter = userUtilitiesArr.filter((utility) =>
        buildUtilitiesArr.some((buildUtility) => buildUtility.id === utility.id)
      );

      // Finally we loop through all that to get the new quantities
      utilitiesFilter.forEach((item, index) => {
        item.quantity = item.quantity - buildUtilitiesArr[index].quantity;
      });

      //update values on Mongo.
      for (let quantity of utilitiesFilter) {
        updatedUtilities = await userMats.updateOne(
          {
            id: userId,
            [`utilities.id`]: new mongoose.Types.ObjectId(quantity.id),
          },
          {
            $set: { "utilities.$.quantity": quantity.quantity },
          }
        );
      }
      console.log(utilitiesFilter);
    }

    if (updatedFish && updatedUtilities && updatedDecorations) {
      const newBuild = await new userBuilds({
        userId: userId,
        name: build?.name,
        MainFish: build?.MainFish,
        tank: build?.tank,
        fish: build?.fish,
        decorations: build?.decorations,
        utilities: build?.utilities,
        remainingSpace: build?.remainingSpace,
      });

      newBuild.save();
    }
    return res
      .status(200)
      .json({ created: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

export default { addAllBuilds, getallBuilds, craftBuild };
