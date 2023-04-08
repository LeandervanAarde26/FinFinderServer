import { getModelForClass, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";

class Tank {
  @prop({ required: true })
  public Litres!: number;

  @prop({ required: true })
  public Height!: Number;

  @prop({ required: true })
  public Width!: number;

  @prop({ required: true })
  public Depth!: number;

  @prop({ required: true })
  public imagePath!: string;
}

export const TankModel = getModelForClass(Tank);
