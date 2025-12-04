import { connectDB } from '../../utils/db';
import { User } from '../../models/User';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const authHeader = getHeader(event, 'authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Kimlik doğrulama gerekli',
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      throw createError({
        statusCode: 401,
        message: 'Geçersiz token',
      });
    }

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Kullanıcı bulunamadı',
      });
    }

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          theme: user.theme,
          notificationPreference: user.notificationPreference,
          defaultPriceDropThreshold: user.defaultPriceDropThreshold,
        },
      },
    };
  } catch (error: any) {
    console.error('Get user error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Kullanıcı bilgileri alınırken hata oluştu',
    });
  }
});
