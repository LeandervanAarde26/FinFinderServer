import { Users } from "../models/users.model";
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import { FishModel } from "../models/fish.model";
import { Fishie } from "../models/users.model";
import { userMats } from "../models/userMaterial";


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
        const { name, email, questions, answers } = req.body;
        const existingUser = await Users.findOne({ email: email });
        const allFish = await FishModel.find();
        const userFish = await Promise.all(allFish.map(async (i) => {
            return await Fishie.create({ id: i._id, quantity: 0 });
        }));
        if (!existingUser) {
            const newUser = new Users({
                name: name,
                email: email,
                securityQuestions: [
                    {
                        question: questions[0],
                        answer: answers[0]
                    },
                    {
                        question: questions[1],
                        answer: answers[1]
                    },
                    {
                        question: questions[2],
                        answer: answers[2]
                    }
                ],
                // fish: userFish
            });

            const userMaterials = new userMats({
                id: newUser._id,
                fish: userFish
            })
            const savedUser = await newUser.save()
            const savedMaterial = await userMaterials.save();
            // const user
            return res.status(200).json({ user: savedUser, materials: savedMaterial })
        } else {
            return res.status(409).json({ error: 'User already exists on database' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' })

    }
}


async function getUserMaterials(req: Request, res: Response) {

    try {
        const userId = req.params.id
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(400).json({ msg: "Bad request" })
        }

        const userMaterials = await userMats.find({ id: userId }).populate({
            path: 'fish',
            populate: {
                path: 'id name imagePath',
                model: FishModel,
                select: 'name imagePath'

            }
        });

        const returnData = userMaterials.map((i) => { return {
            _id: i._id ,
            fish: i.fish.map((j: any) => {return { _id: j.id._id, name: j.id.name, imagePath: j.id.imagePath, quantity: j.quantity}}),
        }})

        console.log(returnData)

        console.log(userMaterials)
 

        if (!userMaterials) {
            return res.status(400).json({ msg: "Bad request" })
        }

        return res.status(200).json(returnData[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'There was a server error' })
    }


}

export default { getUsers, addUser, getUserMaterials }