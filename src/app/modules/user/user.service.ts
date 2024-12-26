// src/modules/user/service.ts
import { IUser, UserRole } from './user.interface';
import User from './user.model';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';

// Function to register user
const registerUser = async (userData: IUser) => {

  // Validate the role (must be either 'customer' or 'vendor')
  if (![UserRole.CUSTOMER, UserRole.VENDOR].includes(userData.role)) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Invalid role. Only Customer and Vendor are allowed.');
  }

  // Check if the user already exists by email
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(StatusCodes.NOT_ACCEPTABLE, 'Email is already registered');
  }

  // Create the user
  const user = new User(userData);

  // Save the user to the database
  await user.save();

  return user;
};

const getAllUser = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(
    User.find(),
    query,
  )
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await UserQuery.modelQuery;
  const meta = await UserQuery.countTotal();
  return {
    result,
    meta,
  };
};



export const UserServices = {
  registerUser,
  getAllUser,
}
