import { Router } from 'express';import { prisma } from '../lib/prisma.js';const router=Router();
router.get('/',async(_req,res)=>{const rows=await prisma.appSetting.findMany();res.json(Object.fromEntries(rows.map(r=>[r.key,JSON.parse(r.valueJson)])));});
router.put('/',async(req,res)=>{for(const [key,value] of Object.entries(req.body)){await prisma.appSetting.upsert({where:{key},create:{key,valueJson:JSON.stringify(value)},update:{valueJson:JSON.stringify(value)}});}res.json({ok:true});});export default router;
