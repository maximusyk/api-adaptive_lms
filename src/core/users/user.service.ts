import { User } from './user.model';
import bcrypt from 'bcrypt';
import { Class } from '../classes/class.model';

import jwt from 'jsonwebtoken';
import config from 'config';
import { IUser } from '../../types';

const jwtSecret = config.get('jwt') as string;

interface IUserService {
    login: {
        username: string;
        password: string;
    },
    create: {
        userData: IUser
    },
    getOne: {}
}

class UserService {
    async login({ username, password }: IUserService['login']) {
        const candidate = await User.findOne({ $or: [{ username: username }, { email: username }] }).exec();

        if ( !candidate ) {
            return { status: 404, body: { message: 'Current User does not exist' } };
        }

        const isPassword = bcrypt.compareSync(password, candidate.password);

        if ( !isPassword ) {
            return { status: 401, body: { message: 'Incorrect password' } }
        }

        const token = jwt.sign({ username, user_id: candidate._id, }, jwtSecret, { expiresIn: '1h' },);

        return { status: 200, body: { token, id: candidate._id } }
    };

    async create({ userData }: IUserService['create']) {
        const candidate = await User.findOne({
            username: userData.username,
            email: userData.email
        }).exec();

        if ( candidate ) {
            return { status: 409, body: { message: 'Current username/email busy' } };
        }

        const salt = bcrypt.genSaltSync(10);

        const user = new User({
            ...userData,
            password: bcrypt.hashSync(userData.password, salt)
        });

        await Class.updateOne(
            { _id: user.class },
            {
                $push: { students: user._id },
            },
        ).exec();

        await user.save();

        return { status: 201, body: user };
    }

    async update({ userData: { _id, ...restData } }: IUserService['create']) {
        console.log(_id, restData);
        const user = await User.findByIdAndUpdate(
            _id,
            {
                $set: restData,
            },
            { new: true },
        ).exec();
        return { status: 200, body: user };
    }

    async getAll() {
        const users = await User.find().populate('class').exec();

        return { status: 200, body: users };
    }

    async getOne({ userData: { _id } }: IUserService['create']) {
        const user = await User.findOne({
            _id,
        }).exec();

        if ( !user ) {
            return { status: 404, body: { messaage: 'User does not exist' } };
        }

        user.profile_picture =
            user.profile_picture[0] === '#'
                ? user.profile_picture
                : `url(${user.profile_picture})`;

        return { status: 200, body: user };
    }

    async remove({ userData: { _id } }: IUserService['create']) {
        const candidate = await User.findById(_id).exec();
        if ( !candidate ) {
            return { status: 404, body: { message: 'User does not exist' } };
        }
        if ( candidate.username === 'maksik' ) {
            return { status: 423, body: { message: 'You are not allowed to delete this user' } };
        }
        await User.deleteOne({ _id }).exec();

        return { status: 200, body: { success: true } };
    }
}

export default new UserService();