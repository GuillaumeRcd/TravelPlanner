import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

process.env.PORT = '3005';
process.env.DATABASE_URL =
  'postgresql://postgres:4bqdSKS3MoPfBVaF@db.mlyywkiirfdatyjnucvi.supabase.co:5432/';

export default config;
