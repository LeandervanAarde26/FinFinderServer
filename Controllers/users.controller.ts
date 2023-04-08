import { Users } from "../models/users.model";
import express, { Express, Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import { FishModel } from "../models/fish.model";
import { Reference } from "../models/users.model";
import { MaterialReference, userMats } from "../models/userMaterial";
import { DecorationModel } from "../models/decorations.model";
import { UtilityModel } from "../models/utilities.model";
import { KeyObject } from "tls";
import { KeyObjectType } from "crypto";
import { TankModel } from "../models/tanks.model";
import { preBuilds } from "../models/prebuilds.model";


async function getUsers(req: Request, res: Response) {
    const userId = req.params.id;
    try {
        const user = await Users.findById(userId)
        return res.status(200).json(user ?? { error: 'Fault in route, please try again later' })
    } catch (error) {
        return res.status(500).json({ error: 'There was a server error' })
    }
}

async function addUser(req: Request, res: Response) {
    try {
        const { Username, Email, Questions } = req.body;

        const existingUser = await Users.findOne({ email: Email });
        const allFish = await FishModel.find();
        const decorations = await DecorationModel.find();
        const utils = await UtilityModel.find()
        const tanks = await TankModel.find();

        const userUtilities = await Promise.all(utils.map(async (i) => {
            return await Reference.create({ id: i._id, quantity: 0 });
        }));

        const userDecorations = await Promise.all(decorations.map(async (i) => {
            return await Reference.create({ id: i._id, quantity: 0 });
        }));

        const userFish = await Promise.all(allFish.map(async (i) => {
            return await Reference.create({ id: i._id, quantity: 0 });
        }));

        const userTanks = await Promise.all(tanks.map(async (i) => {
            return await Reference.create({ id: i._id, quantity: 0 });
        }));


        if (!existingUser) {
            const newUser = new Users({
                name: Username,
                email: Email,
                securityQuestions: [
                    {
                        question: Questions[0].question,
                        answer: Questions[0].answer
                    },
                    {
                        question: Questions[1].question,
                        answer: Questions[1].answer
                    },
                    {
                        question: Questions[2].question,
                        answer: Questions[2].answer
                    }
                ],
            });
            const userMaterials = new userMats({
                id: newUser._id,
                fish: userFish,
                decorations: userDecorations,
                utilities: userUtilities,
                tanks: userTanks
            });
            
            const savedUser = await newUser.save()
            const savedMaterial = await userMaterials.save();
            // const user
            return res.status(200).json({ user: savedUser, materials: savedMaterial, status: true })
        } else {
            return res.status(409).json({ error: 'User already exists on database', status: true })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error', status: true })
    }
}


async function getUserMaterials(req: Request, res: Response) {
    try {
        const userId = req.params.id
        const user = await Users.findById(userId);
        const populateAreas = {
            path: 'id name imagePath Litres',
            select: 'id name imagePath Litres'
        }
        if (!user) {
            return res.status(400).json({ msg: "Bad request" })
        }
        const userMaterials = await userMats.find({ id: userId }).populate({
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
            path: 'tanks',
            populate: {
                ...populateAreas,
                model: TankModel,
            },
        });

        console.log(userMaterials)

        const returnData = userMaterials.map((i) => {
            return {
                _id: i._id,
                fish: i.fish.map((j: any) => { return { _id: j.id._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity } }),
                decorations: i.decorations.map((j: any) => { return { _id: j.id._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity } }),
                utilities: i.utilities.map((j: any) => { return { _id: j.id._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity } }),
                tanks: i.tanks.map((j: any) => { return { _id: j.id._id, name: j.id.Litres + " L tank", imagePath: j.id.imagePath, quantity: j.quantity } })
            }
        })

        console.log(returnData[0].tanks)
        if (!userMaterials) {
            return res.status(400).json({ msg: "Bad request" })
        }
        return res.status(200).json(returnData[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' })
    }
}

async function getUserMaterial(req: Request, res: Response) {
    try {
        const item = req.query.itemId;
        const userId = req.params.id;
        const category= req.query.category;

        let userMaterial: any;
        let compatibleFish: any;
        let foundInBuilds: any;


        switch(category){
            case "fish":
                 userMaterial = await userMats.aggregate([
                    {$match: {id: new mongoose.Types.ObjectId(userId) }},
                    {$project: { _id: 0 , [`${category}`]: 1}},
                    {$unwind: `$${category}`},
                    {$lookup: {from: `${category}`, localField: `${category}.id`, foreignField: '_id', as: 'item'}},
                    {$unwind: '$item'},
                    {$match: {[`${category}.id`]: new mongoose.Types.ObjectId(item as string)}},
                    {$project: {[`${category}.id`]: 1, [`${category}.quantity`]: 1, "item.diet": 1, "item.space": 1, "item.imagePath": 1, "item.temprature": 1, "item.name": 1}}
              ]);

              compatibleFish = await FishModel.findById(item).populate([
                {
                    path: 'compatibility',
                    populate: { path: 'name', select: 'name' },
                    select: '-compatibility',
                },
                {
                    path: 'notCompatible',
                    populate: { path: 'name', select: 'name' },
                    select: '-notCompatible',
                },
            ]
            );
              break;

            case "decorations":
                 userMaterial = await userMats.aggregate([
                    {$match: {id: new mongoose.Types.ObjectId(userId) }},
                    {$project: { _id: 0 , [`${category}`]: 1}},
                    {$unwind: `$${category}`},
                    {$lookup: {from: `${category}`, localField: `${category}.id`, foreignField: '_id', as: 'item'}},
                    {$unwind: '$item'},
                    {$match: {[`${category}.id`]: new mongoose.Types.ObjectId(item as string)}},
                    // {$project: {[`${category}.id`]: 1, [`${category}.quantity`]: 1}}
              ]);
              foundInBuilds = await preBuilds.find({"decorations.id": item})
              break;
              
            case "utilities":
                 userMaterial = await userMats.aggregate([
                    {$match: {id: new mongoose.Types.ObjectId(userId) }},
                    {$project: { _id: 0 , [`${category}`]: 1}},
                    {$unwind: `$${category}`},
                    {$lookup: {from: `${category}`, localField: `${category}.id`, foreignField: '_id', as: 'item'}},
                    {$unwind: '$item'},
                    {$match: {[`${category}.id`]: new mongoose.Types.ObjectId(item as string)}},
                    // {$project: {[`${category}.id`]: 1, [`${category}.quantity`]: 1}}

                  
              ]);
              foundInBuilds = await preBuilds.find({"utilities.id": item}).populate({
                path: 'MainFish',
                select: 'imagePath',
                model: FishModel
            });
              console.log(foundInBuilds)
              break;
              case "tanks":
                userMaterial = await userMats.aggregate([
                   {$match: {id: new mongoose.Types.ObjectId(userId) }},
                   {$project: { _id: 0 , [`${category}`]: 1}},
                   {$unwind: `$${category}`},
                   {$lookup: {from: `${category}`, localField: `${category}.id`, foreignField: '_id', as: 'item'}},
                   {$unwind: '$item'},
                   {$match: {[`${category}.id`]: new mongoose.Types.ObjectId(item as string)}},     
             ]);
             foundInBuilds = await preBuilds.find({"tank": item}).populate({
                path: 'MainFish',
                select: 'imagePath',
                model: FishModel
            });
             break;
        }
        if (!userMaterial) {
            return res.status(404).json({ msg: `user with ${userId} does not exist` })
        }

        switch(category){
            case 'fish': 
            return res.status(200).json({mat: userMaterial[0], compat: compatibleFish.compatibility, nonCompat: compatibleFish.notCompatible });
            break;
            default:
                return res.status(200).json({mat: userMaterial[0], builds: foundInBuilds})

        }
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error, msg: 'Internal server error' })
    }
}
async function getQuestions(req: Request, res: Response) {
    try {
        const Email = req.params.email;
        const random = (arr: any) => {
            return arr[Math.floor((Math.random() * arr.length))]
        }
        const userQuery = await Users.find({ email: Email }).select(['securityQuestions']);

        if (!userQuery) {
            return res.status(409).json({ msg: 'User does not exist on database', status: false });
        }
        const question = random(userQuery[0].securityQuestions)
        console.log(userQuery)
        return res.status(200).json({ user: userQuery[0]._id, question: question, status: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' })
    }
}

async function udpateQuantity(req: Request, res: Response) {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const itemId = new mongoose.Types.ObjectId(req.body.itemId);
        const category = req.body.category;
        const amount: number = req.body.amount < 0 ? 0 : req.body.amount;

        const userMaterial = await userMats.updateOne({
            id: userId,
            [`${category}.id`]: itemId
        }, {
            $set: { [`${category}.$.quantity`]: amount }
        });

        console.log(itemId)
        if (!userMaterial) {
            return res.status(404).send({ msg: `Usermaterials with userId ${userId} was not found` });
        }
        return res.status(200).send(userMaterial)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

export default { getUsers, addUser, getUserMaterials, getUserMaterial, getQuestions, udpateQuantity, }