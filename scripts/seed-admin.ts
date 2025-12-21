import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 開始建立管理員帳號...');

  const email = 'admin@soloai.demo';
  const password = 'soloai2025';

  // 產生密碼雜湊
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('✅ 密碼雜湊已產生');

  // 檢查帳號是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`⚠️  帳號 ${email} 已存在，正在更新密碼...`);
    
    // 更新密碼
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    
    console.log(`✅ 帳號 ${email} 的密碼已更新`);
  } else {
    console.log(`📝 建立新帳號 ${email}...`);
    
    // 建立新帳號
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: email,
        phone: '0912-345-678',
        password: hashedPassword,
        role: UserRole.ADMIN,
        avatar: null,
        skills: ['系統管理', '顧客管理'],
        isActive: true,
      },
    });
    
    console.log(`✅ 管理員帳號已建立：`);
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - 角色: ${admin.role}`);
    console.log(`   - ID: ${admin.id}`);
  }

  console.log('🎉 管理員帳號設定完成！');
}

main()
  .catch((e) => {
    console.error('❌ 建立管理員帳號失敗：', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


