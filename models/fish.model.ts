import { prop, getModelForClass } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export class Fish {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public imagePath!: string;

  @prop({ required: true })
  public temprature!: number;

  @prop({ required: true, type: () => [String] })
  public diet!: string[];

  @prop({ required: true })
  public space!: number;

  @prop({ required: true, ref: 'Fish' })
  public compatibility!: Schema.Types.ObjectId[];

  @prop({ required: true, ref: 'Fish' })
  public notCompatible!: Schema.Types.ObjectId[];

  @prop({ required: true })
  public species!: string;

  @prop({ required: true, type: () => [String] })
  public categories!: string[];
}

export const FishModel = getModelForClass(Fish);