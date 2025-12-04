import { connectDB } from '../../utils/db';
import { User } from '../../models/User';
import { generateToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Email ve şifre gereklidir',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Email veya şifre hatalı',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: 'Email veya şifre hatalı',
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      success: true,
      message: 'Giriş başarılı',
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
    console.error('Login error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Giriş sırasında bir hata oluştu',
    });
  }
});
