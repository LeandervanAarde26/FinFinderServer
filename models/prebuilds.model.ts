import { prop, getModelForClass } from "@typegoose/typegoose";
import { Schema } from "mongoose";

export class MaterialReference {
  @prop({ required: true, _id: false, ref: "Fish" })
  public id!: Schema.Types.ObjectId;

  @prop({ required: true, default: 0 })
  public quantity!: number;

  @prop({ required: true, default: false })
  public craftable!: boolean;
}

class PreBuilds {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public MainFish!: Schema.Types.ObjectId;

  @prop({ required: true, _id: false })
  public tank!: Schema.Types.ObjectId;

  @prop({ _id: false, type: () => [MaterialReference] })
  public fish!: MaterialReference[];

  @prop({ _id: false, type: () => [MaterialReference] })
  public decorations!: MaterialReference[];

  @prop({ _id: false, type: () => [MaterialReference] })
  public utilities!: MaterialReference[];

  @prop({ _id: false })
  public remainingSpace!: number;
}

export const preBuilds = getModelForClass(PreBuilds);
