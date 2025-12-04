import { connectDB } from '../../utils/db';
import { User } from '../../models/User';
import { generateToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    const { email, password, name, phone } = body;

    if (!email || !password || !name) {
      throw createError({
        statusCode: 400,
        message: 'Email, şifre ve isim gereklidir',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Bu email adresi zaten kullanılıyor',
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      phone,
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      success: true,
      message: 'Kayıt başarılı',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          theme: user.theme,
          notificationPreference: user.notificationPreference,
        },
      },
    };
  } catch (error: any) {
    console.error('Register error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Kayıt sırasında bir hata oluştu',
    });
  }
});
