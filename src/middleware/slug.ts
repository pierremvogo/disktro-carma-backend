import { eq } from "drizzle-orm";
import { db } from "../db/db";
import * as schema from '../db/schema';

export class SlugMiddleware {
   
   static checkduplicatedFromArtist = async (slug: string) => {
        const slugs = await db.query.artists.findFirst({
                        where: eq(schema.artists.slug, slug),
                })
                    if (slugs){
                       return  true;
                }
           }
      
   static checkduplicatedFromCollection = async (slug: string) => {
        const slugs = await db.query.collections.findFirst({
                        where: eq(schema.collections.slug, slug),
                })
                    if (slugs){
                       return  true;
                }
           }
    static checkduplicatedFromTag = async (slug: string) => {
        const slugs = await db.query.tags.findFirst({
                        where: eq(schema.tags.slug, slug),
                })
                    if (slugs){
                       return  true;
                }
           }

     static checkduplicatedFromTrack = async (slug: string) => {
        const slugs = await db.query.tracks.findFirst({
                        where: eq(schema.tracks.slug, slug),
                })
                    if (slugs){
                       return  true;
                }
           }
    }