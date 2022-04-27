import { Course } from './course.model';
import { IClass } from '../../types';
import { User } from '../users/user.model';
import { Class } from '../classes/class.model';

interface ICourseService {
    create: {
        title: string;
        instructor: string;
        classes: IClass['_id'][];
    };
    update: {
        id: string;
        courseData?: ICourseService['create'];
    }
}

class CourseService {
    async create({ title, instructor, classes }: ICourseService['create']) {
        const candidate = await Course.findOne({ title }).exec();
        if ( candidate ) {
            return { status: 409, body: { message: 'Course title already taken' } };
        }

        const course = new Course({ title, instructor, classes });

        await User.findByIdAndUpdate(
            course.instructor,
            { $push: { courses: course._id } }
        ).exec();
        await Class.updateMany(
            {
                _id: {
                    $in: course.classes
                }
            },
            {
                $push: { courses: course._id }
            }
        ).exec();

        await course.save();

        return { status: 201, body: course };
    }

    async update({ id, courseData }: ICourseService['update']) {
        const candidate = await Course.findById(id).exec();
        if ( !candidate ) {
            return { status: 200, body: courseData };
        }

        const updatedCourse = await candidate.update(
            { $set: { ...courseData } },
            { new: true }
        ).exec();

        return { status: 200, body: updatedCourse }
    }

    async getAll() {
        const courses = await Course.find()
                                    .populate('instructor')
                                    .populate('students')
                                    .exec();

        return { status: 200, body: courses };
    }

    async getOne({ id }: ICourseService['update']) {
        const candidate = await Course.findOne({
            _id: id
        }).populate({
            path: 'chapters',
            populate: { path: 'units' }
        }).exec();
        if ( !candidate ) {
            return { status: 404, body: { message: 'Course doesn\'t exist' } }
        }

        return { status: 200, body: candidate };
    }

    async remove({ id }: ICourseService['update']) {
        const course = await Course.findByIdAndDelete(id).exec();

        if ( !course ) {
            return { status: 404, body: { message: 'Course doesn\'t exist' } }
        }

        await User.findByIdAndUpdate(course.instructor, {
            $pullAll: { courses: [course._id] }
        }).exec();
        await User.updateMany(
            { role: 'student' },
            {
                $pullAll: { courses: [course._id] }
            }
        ).exec();

        return { status: 200, body: { success: true } };
    }
}

export default new CourseService();