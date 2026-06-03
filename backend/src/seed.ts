import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { Role } from './common/enums/role.enum';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.env.ADMIN_EMAIL || 'admin@supporthub.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'System Admin';

  const existing = await usersService.findByEmail(email);
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersService.create({
      name,
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    });
    console.log(`Admin user created: ${email}`);
    console.log(`Password: ${password}`);
  }

  await app.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
