import { Db, MongoClient } from 'mongodb';

declare module '@/lib/mongodb' {
  export function connectToDatabase(): Promise<Db>;
} 