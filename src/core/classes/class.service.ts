import { Class } from './class.model';
import { Course } from '../courses/course.model';
import { User } from '../users/user.model';
import { IUser, ICourse, IClass } from '../../types';

interface IStudent extends IUser {
    role: 'student'
}

interface IClassService {
    create: {
        title: string;
        students: IStudent[];
        courses: ICourse[];
    },
    update: {
        id: string;
        data: IClass;
    },
    getOne: {
        id: string;
    }
}

class ClassService {
    async create({ title, students, courses }: IClassService['create']) {
        const candidate = await Class.findOne({ title }).exec();
        if ( candidate ) {
            return {
                status: 409,
                body: { message: 'Current class name busy.' }
            };
        }

        const newClass = new Class({ title, students, courses });

        await Course.updateMany(
            {
                _id: {
                    $in: newClass.courses.map((student) => student._id)
                }
            },
            {
                $push: { courses: newClass._id }
            }
        ).exec();

        await User.updateMany(
            {
                _id: {
                    $in: newClass.students.map((student) => student._id)
                }
            },
            {
                class: newClass._id
            }
        ).exec();

        await newClass.save();

        return { status: 201, body: newClass };
    }

    async update({ id, data }: IClassService['update']) {
        const candidate = await Class.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        ).exec();

        if ( !candidate ) {
            return { status: 404, body: { msg: 'Class does not exist' } };
        }

        await Course.updateMany(
            { _id: { $in: candidate.courses.map((student) => student._id) } },
            { $push: { courses: candidate._id } }
        ).exec();
        await User.updateMany(
            { _id: { $in: candidate.students.map((student) => student._id) } },
            { $push: { students: candidate._id } }
        ).exec();

        return { status: 200, body: candidate };
    }

    async getAll() {
        const classes = await Class.find().exec();

        return { status: 200, body: classes }
    }

    async getOne({ id }: IClassService['getOne']) {
        const candidate = await Class.findOne({ _id: id })
                                     .populate('students').exec();
        if ( !candidate ) {
            return { status: 404, body: { message: 'Class does not exist' } };
        }
        return { status: 200, body: candidate };
    }

    async remove({ id }: IClassService['getOne']) {
        await Class.deleteOne({ _id: id }).exec();
        return { status: 200, body: { success: true } }
    }
}

export default new ClassService();