import {getModelForClass, prop, pre } from "@typegoose/typegoose";

import { Schema } from "mongoose";


 export class MaterialReference {
    @prop({ required: true,  _id: false, ref: 'Fish' })
    public id!: Schema.Types.ObjectId;
  
    @prop({ required: true, default: 0 })
    public quantity!: number;
  }
  

class UserMaterial {

    @prop({ required: true,  _id: false })
    public id!: Schema.Types.ObjectId;

    @prop({ _id: false, type: () => [MaterialReference],  })
    public fish!: MaterialReference[];

    @prop({ _id: false, type: () => [MaterialReference] })
    public decorations!: MaterialReference[];

    // @prop({ _id: false, type: () => [MaterialReference] })
    // public utilities!: MaterialReference[];
}


export const userMats = getModelForClass(UserMaterial)
export const userMaterialsRef = getModelForClass(MaterialReference)


