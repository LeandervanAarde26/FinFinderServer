import { getModelForClass, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";

class Utilities {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public imagePath!: string;

  @prop({ required: true })
  public space!: number;

  @prop({ required: true, type: () => [String] })
  public categories!: string[];
}

export const UtilityModel = getModelForClass(Utilities);
