import bcrypt from 'bcrypt';
import { asc, eq } from 'drizzle-orm';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/db';
import * as schema from '../db/schema';
import { users } from '../db/schema';
import type { LoginUserResponse, User } from '../models';
import { env } from '../utils/config';


export class UserController {

    static  CreateUser: RequestHandler = async (req, res, next) => {
        if (!req.body) {
            res.status(400).send({
                message: `Error: User data is empty.`
              });
        }
        try {
            const hashedPassword = await bcrypt.hash(req.body.password!, 10)
            const newUserData = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                type: req.body.type,
            }
             if (!newUserData) {
                res.status(400).send({
                    message: 'Error: please all  userData are required'
                });
                }
                const result = await db
                    .insert(schema.users)
                    .values(newUserData)
                    .$returningId()

                const createdUser = result[0]
                if (!createdUser) {
                    res.status(400).send({
                        message: 'There was an error creating the user with the given email address.'
                      });
                }
                res.status(200).send({
                    data: createdUser as User, 
                    message: "Succesffuly create User"});
        } catch (err) {
            res.status(500).send({
                message: 'Internal server Error'
              });
        }
    }

    static FindUserByEmail: RequestHandler = async (req, res, next) => {
        try {
                if (req.body.email === '') {
                    res.status(400).send({
                        message: 'No user email given.'
                      });
                }
                const user = await db.query.users.findFirst({
                    where: eq(schema.users.email, req.body.email),
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        type: true,
                    },
                })
                if (!user){
                    res.status(400).send({
                        message: 'No user Found.'
                      });
                }
                res.status(200).send({
                    data: user as User, 
                    message: "Succesffuly get User By Email"});
            } catch (err) {
                console.error(err)
                res.status(500).send({
                    message: 'Internal server Error'
                  });
            }
    }

    static FindUserById: RequestHandler = async (req, res, next) => {
         try {
                if (req.body.id === null) {
                    res.status(400).send({
                        message: 'No user ID given..'
                      });
                }
                const user = await db.query.users.findFirst({
                    where: eq(schema.users.id, req.body.id),
                })
                if (!user){
                    res.status(400).send({
                        message: `No user Found with this Id: ${req.body.id}`
                      });
                }
                res.status(200).send({
                    data: user as User, 
                    message: "Succesffuly get User By Id"});
                
            } catch (err) {
                console.error(err)
                res.status(500).send({
                    message: 'Internal server Error'
                  });
            }
    }

    static FindAllUser: RequestHandler = async (req, res, next) => {
        try {
               const user = await db.query.users.findMany({
                   orderBy: [asc(users.id)],
               })
               if (!user){
                   res.status(400).send({
                       message: `No user Found`
                     });
               }
               res.status(200).send({
                   data: user as User[], 
                   message: "Succesffuly get All User"});
               
           } catch (err) {
               console.error(err)
               res.status(500).send({
                   message: 'Internal server Error'
                 });
           }
   }

    static LoginUser: RequestHandler = async (req, res, next) => {
        const response: LoginUserResponse = {
            user: null,
            token: '',
            error: false,
            message: '',
        }
              try {
                    if (req.body.email === '') {
                        res.status(400).send({
                            message: 'No user email given.'
                          });
                    }
                    const user = await db.query.users.findFirst({
                        where: eq(schema.users.email, req.body.email),
                        columns: {
                            id: true,
                            name: true,
                            email: true,
                            type: true,
                            password: true,
                        },
                    })
                    const passwordsMatch = await bcrypt.compare(
                        req.body.password,
                        user?.password ?? ''
                    )
                    if (!user || !passwordsMatch) {
                        res.status(400).send({
                            message: 'The provided email and password do not correspond to an account in our records.'
                          }); 
                    }
                    const token = jwt.sign(
                        {
                            id: user?.id,
                            email: user?.email,
                        },
                        env.JWT_PRIVATE_KEY,
                        {
                            expiresIn: '1d',
                        }
                    )
                    res.status(200).send(response);

                    if (!user){
                        res.status(400).send({
                            message: 'User not Found !'
                          }); 
                    }
                    response.user = user as User
                    response.token = token
                    response.error = false
                    response.message = 'User successfully authenticated.'
                    
                    res.status(200).send(response)

                } catch (err) {
                    res.status(500).send({
                        message: 'Internal server Error'
                      });
                }

            
    }
}
