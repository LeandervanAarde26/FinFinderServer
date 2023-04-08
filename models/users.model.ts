import { Prop, getModelForClass, prop, pre } from "@typegoose/typegoose";
import { NextFunction } from "express";
import { Schema } from "mongoose";
import { FishModel } from "./fish.model";

export class modelRef {
  @prop({ required: true, _id: false })
  public id!: Schema.Types.ObjectId;

  @prop({ required: true, default: 0 })
  public quantity!: number;
}

class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ _id: false, type: () => [SecurityQuestion] })
  public securityQuestions!: SecurityQuestion[];

  // @prop({ _id: false, type: () => [FishRef] })
  // public fish!: FishRef[];

  @prop({ _id: false, type: () => [Schema.Types.ObjectId] })
  public locations!: [];
}

class SecurityQuestion {
  @prop({ required: true })
  public question!: string;

  @prop({ default: "" })
  public answer!: string;
}

export const Users = getModelForClass(User);
export const Reference = getModelForClass(modelRef);
