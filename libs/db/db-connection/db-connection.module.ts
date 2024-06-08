import { Module } from '@nestjs/common';
import { databaseProviders } from 'libs/db/db-connection/database.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
