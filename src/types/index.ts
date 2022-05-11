import { Document } from 'mongoose';

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
    chapters: IChapter[];
    classes: IClass[];
    students: IUser[];
}

export interface IChapter extends Document {
    _id: string;
    title: string;
    subdivisions: SubdivisionItem[];
}

type SubdivisionItem = {
    item: ILecture | ITest;
    subdivisionType: 'lectures' | 'tests';
};

export interface ILecture extends Document {
    _id: string;
    title: string;
    fileId: string;
    units: IUnit[];
    viewable: boolean;
}

export interface ITest extends Document {
    _id: string;
    title: string;
    course: ICourse;
    chapter: IChapter;
    questions: ITestQuestion[];
}

export interface ITestQuestion extends Document {
    _id?: string;
    title: string;
    type: ITestType;
    answers: ITestAnswer[];
    units: IUnit[];
}

export interface ITestType extends Document {
    _id?: string;
    title: 'single' | 'multiple' | 'input';
}

export interface ITestAnswer extends Document {
    _id?: string;
    title: string;
    isCorrect: boolean;
}

export interface IUnit extends Document {
    _id: string;
    title: string;
    lecture: ILecture;
    chapter: IChapter;
    course: ICourse;
    content: string;
    keywords: IKeyword[];
    cohesionRate: UnitCohesionRate[];
}

type UnitCohesionRate = {
    unit: IUnit;
    rate: number;
};

export interface IKeyword extends Document {
    title: string;
    _id: string;
}
