import {prop, getModelForClass} from '@typegoose/typegoose';
import { Schema } from "mongoose";

export class MaterialReference {
    @prop({ required: true,  _id: false, ref: 'Fish' })
    public id!: Schema.Types.ObjectId;
  
    @prop({ required: true, default: 0 })
    public quantity!: number;
  }

class PreBuilds {

    @prop({required: true})
    public name!: string;

    @prop({ _id: false, type: () => [MaterialReference],  })
    public fish!: MaterialReference[];

    @prop({ _id: false, type: () => [MaterialReference] })
    public decorations!: MaterialReference[];

    @prop({ _id: false, type: () => [MaterialReference] })
    public utilities!: MaterialReference[];
}

export const preBuilds = getModelForClass(PreBuilds);