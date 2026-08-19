import {Router} from "express"
import { Request, Response } from "express";
import { prisma } from "../config/prisma";


const router = Router();

router.get("/",async( _req: Request, res: Response)=>{
    try {
        await prisma.$queryRaw`SELECT 1`;
        
        return res.status(200).json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        return res.status(500).json({
          status: "error",
          database: "disconnected",
          timestamp: new Date().toISOString(),
        });
    }
})

export default router