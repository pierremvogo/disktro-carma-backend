import { eq } from "drizzle-orm";
import { db } from "../db/db";
import * as schema from '../db/schema';

export class EmailMiddleware {
   static checkduplicated = async (email: string) => {
        const emails = await db.query.users.findFirst({
                        where: eq(schema.users.email, email),
                })
                    if (emails){
                       return  true;
                }
           }
    }