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

    const body = await readBody(event);
    
    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        $set: {
          name: body.name,
          phone: body.phone,
          theme: body.theme,
          notificationPreference: body.notificationPreference,
          defaultPriceDropThreshold: body.defaultPriceDropThreshold,
        },
      },
      { new: true }
    ).select('-password');

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Kullanıcı bulunamadı',
      });
    }

    return {
      success: true,
      message: 'Profil güncellendi',
      data: { user },
    };
  } catch (error: any) {
    console.error('Update profile error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Profil güncellenirken hata oluştu',
    });
  }
});
