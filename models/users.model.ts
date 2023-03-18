import { Prop, getModelForClass, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";

class SecurityQuestion{
    @prop({required: true})
    question!: string;

    @prop({required: true})
    answer!: string; 
}

class User {
    @prop({ required: true })
    public name!: string;

    @prop({required: true})
    public email!: string;


    @prop({_id: false, type: () => [SecurityQuestion]})
    securityQuestions!: SecurityQuestion[]
}

export const Users = getModelForClass(User)