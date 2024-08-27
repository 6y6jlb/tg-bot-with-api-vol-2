import { USER_ID_ENUM } from '../user.const';

export const getUserIdTypeById = (id: string | number): USER_ID_ENUM => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof id === 'string' && emailRegex.test(id)) {
    return USER_ID_ENUM.EMAIL;
  }

  const mongoIdRegex = /^[a-f\d]{24}$/i;
  if (typeof id === 'string' && mongoIdRegex.test(id)) {
    return USER_ID_ENUM.MONGO_ID;
  }

  if (typeof id === 'number' || !isNaN(Number(id))) {
    return USER_ID_ENUM.TELEGRAM_ID;
  }

  throw new Error('Wrong user id type, :' + id);
};

export const getIdAndTypeFromData = (data: { [key: string]: any }) => {
  let userId = null;
  let idType = null;

  if (data.id || data._id) {
    userId = data.id || data._id;
    idType = USER_ID_ENUM.MONGO_ID;
  } else if (data.telegram_id) {
    userId = data.telegram_id;
    idType = USER_ID_ENUM.TELEGRAM_ID;
  } else if (data.email) {
    userId = data.email;
    idType = USER_ID_ENUM.EMAIL;
  }

  if (userId && idType) {
    return { userId, idType };
  }

  throw new Error('User with this data does not exist!');
};
