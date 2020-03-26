import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import sub from 'date-fns/sub';
import User from '../models/user.model';
import emailService from './email.service';
import PasswordResetToken from '../models/passwordResetToken.model';
import EmailVerificationToken from '../models/emailVerificationToken.model';

const resendVerificationEmail = async (email) => {
	try {
		const user = await User.findOne({ email });
		if (user) {
			const token = await ((new EmailVerificationToken({
				user: user._id,
				token: crypto.randomBytes(32).toString('hex'),
			})).save());
			await emailService.sendEmail(user.email, 'verification', { user, token });
		}
	} catch (e) {
		throw Error('Error resending verification email');
	}
};

const createUser = async (user) => {
	let userToRegister;
	if (user.password) {
		const hash = await bcrypt.hash(user.password, 8);
		userToRegister = { ...user, password: hash };
	} else {
		userToRegister = user;
	}
	await (new User(userToRegister)).save();
	return resendVerificationEmail(user.email);
};

const getUserByEmail = async (email) => {
	try {
		return await User.findOne({ email });
	} catch (e) {
		throw Error('Error while getting single user');
	}
};

const getUserById = async (id) => {
	try {
		return await User.findById(id);
	} catch (e) {
		throw Error('Error while getting single user');
	}
};

const setUserPasswordById = async (id, password) => {
	try {
		const hash = await bcrypt.hash(password, 8);
		return await User.findByIdAndUpdate(id, { password: hash });
	} catch (e) {
		throw Error('Error while setting password for single user');
	}
};

const setUserProfileById = async (id, user) => {
	try {
		return await User.findByIdAndUpdate(id, user);
	} catch (e) {
		throw Error('Error while setting profile for single user');
	}
};

const sendResetPasswordEmail = async (email) => {
	try {
		const user = await User.findOne({ email });
		if (user) {
			const token = await ((new PasswordResetToken({
				user: user._id,
				token: crypto.randomBytes(32).toString('hex'),
			})).save());
			await emailService.sendEmail(user.email, 'reset-password', { user, token });
		}
	} catch (e) {
		throw Error('Error while sending password reset email');
	}
};

const resetPassword = async (tokenString, newPassword) => {
	try {
		const token = await PasswordResetToken.findOneAndRemove({ token: tokenString });
		if (token.date && new Date(token.date).getTime() >= sub(new Date(), {
			days: 1,
		})) {
			await setUserPasswordById(token.user, newPassword);
		} else {
			throw Error('Expired token');
		}
	} catch (e) {
		throw Error('Error setting password');
	}
};

const verify = async (tokenString) => {
	try {
		const token = await EmailVerificationToken.findOneAndRemove({ token: tokenString });
		if (token.date && new Date(token.date).getTime() >= sub(new Date(), {
			days: 1,
		})) {
			await User.findByIdAndUpdate(token.user, { verified: true });
		} else {
			throw Error('Expired token');
		}
	} catch (e) {
		throw Error('Error verifying user');
	}
};

const getAllUsers = async () => User.find({});
export default {
	createUser,
	getUserByEmail,
	getUserById,
	setUserPasswordById,
	setUserProfileById,
	getAllUsers,
	sendResetPasswordEmail,
	resendVerificationEmail,
	resetPassword,
	verify,
};
