import { FishModel } from "../models/fish.model";
import express, { Express, query, Request, Response } from "express";
import mongoose from "mongoose";

async function getAllFish(req: Request, res: Response) {
  try {
    const fish = await FishModel.find();
    return res
      .status(200)
      .json(fish ?? { error: "Fault in route, please try again later" });
  } catch (error) {
    return res.status(500).json({ error: "There was a server error" });
  }
}

async function getById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const individualFish = await FishModel.findById(id).populate([
      {
        path: "compatibility",
        populate: { path: "name", select: "name" },
        select: "-compatibility",
      },
      {
        path: "notCompatible",
        populate: { path: "name", select: "name" },
        select: "-notCompatible",
      },
    ]);
    return res
      .status(200)
      .json(
        individualFish ?? {
          error: `Fish with ID ${id} does not exist or cannot be found`,
        }
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "There was a server error" });
  }
}

async function getCompat(req: Request, res: Response) {
  try {
    let id = req.params.id;
    let compat: string[] = [
      "Insert Fish names in this array that are compatible.",
    ];
    let noncompat: string[] = [
      "Insert Fish names in this array that are compatible.",
    ];
    const Can = await FishModel.find({ name: { $in: compat } }).select("_id");
    const Cant = await FishModel.find({ name: { $in: noncompat } }).select(
      "_id"
    );
    const Fish = await FishModel.updateOne(
      { _id: id },
      { $push: { compatibility: Can, notCompatible: Cant } }
    );
    return res.status(200).json({ can: Can, Cant: Cant, fish: Fish });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

export default { getAllFish, getById, getCompat };

//Note:
// 1. This controllers only purpose is to add to the fish collection, this wil not be used in the front end of any application until the fish are addable from users
