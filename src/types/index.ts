import { Document } from 'mongoose';

type TestVariant = {
    title: string;
    isCorrect: boolean;
}

export interface IChapter extends Document {
    _id: string;
    title: string;
    subdivisions: ILecture[] | ITest[];
}

export interface ILecture extends Document {
    _id: string;
    title: string;
    content: string;
    units: IUnit[];
}

export interface ITest extends Document {
    _id: string;
    title: string;
    type: string;
    variant: TestVariant[];
    units: IUnit[];
}

export interface IUnit extends Document {
    _id: string;
    title: string;
    chapter: IChapter;
    content: string;
    keywords: IKeyword[];
    connectivity: [{ unit_id: IUnit['_id'], percentage: number }];
}

export interface IKeyword extends Document {
    title: string;
    _id: string;
}

export interface IClass extends Document {
    _id: string;
    title: string;
    students: IUser[];
    courses: ICourse[];
}

export interface ICourse extends Document {
    _id: string;
    title: string;
    instructor: IUser;
    classes: IClass[];
    chapters: IChapter[];
    students: IUser[];
}

export interface IUser extends Document {
    _id?: string;
    profile_name?: string;
    profile_picture?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    progress?: number;
    class?: IClass;
    token?: string;
    class_name?: string;
}
