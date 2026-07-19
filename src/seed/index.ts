import { connectDB } from '@/db';
import { seedUsers } from './seedUsers';
import { logger } from '@/modules/common/utils/logger';

/**
 * Main seed function
 * Connects to database and runs all seeders
 */
const seed = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Run seeders
    await seedUsers();

    logger.info('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seed();
}

export default seed;

