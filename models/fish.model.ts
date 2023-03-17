import { prop, getModelForClass } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

class Fish {
  @prop({ required: true,  type: () => [Schema.Types.ObjectId] })
  public _id!: Schema.Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public imagePath!: string;

  @prop({ required: true })
  public temprature!: number;

  @prop({ required: true,  type: () => [String] })
  public diet!: string[];

  @prop({ required: true })
  public space!: number;

  @prop({ required: true,  type: () => [Schema.Types.ObjectId] })
  public compatibility!: [Schema.Types.ObjectId];

  @prop({ required: true,  type: () => [Schema.Types.ObjectId] })
  public notCompatible!: [Schema.Types.ObjectId];

  @prop({ required: true })
  public species!: string;

  @prop({ required: true, type: () => [String] })
  public categories!: string[];
}

export const FishModel = getModelForClass(Fish);