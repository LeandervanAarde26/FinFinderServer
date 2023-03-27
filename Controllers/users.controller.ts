import { Users } from "../models/users.model";
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { FishModel } from "../models/fish.model";
import { Reference } from "../models/users.model";
import { MaterialReference, userMats } from "../models/userMaterial";
import { DecorationModel } from "../models/decorations.model";
import { UtilityModel } from "../models/utilities.model";


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

        const userUtilities = await Promise.all(utils.map(async (i) => {
            return await Reference.create({ id: i._id, quantity: 0 });
        })); 

        const userDecorations = await Promise.all(decorations.map(async (i) => {
            return await Reference.create({ id: i._id, quantity: 0 });
        }));

        const userFish = await Promise.all(allFish.map(async (i) => {
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
                utilities: userUtilities
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
            path: 'id name imagePath',
            select: 'name imagePath'
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
        }) ;



        const returnData = userMaterials.map((i) => {
            return {
                _id: i._id,
                fish: i.fish.map((j: any) => { return { _id: j.id._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity } }),
                decorations: i.decorations.map((j: any) => { return { _id: j.id._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity } }),
                utilities: i.utilities.map((j: any) => { return { _id: j._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity } })
            }
        })
        if (!userMaterials) {
            return res.status(400).json({ msg: "Bad request" })
        }
        return res.status(200).json(returnData[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' })
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
        return res.status(200).json({user: userQuery[0]._id, question: question, status: true})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' })
    }
}
export default { getUsers, addUser, getUserMaterials, getQuestions }