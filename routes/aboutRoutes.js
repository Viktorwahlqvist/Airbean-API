import express from 'express';
import { getContact } from '../controllers/aboutController.js';


export const aboutRouter = express.Router();
aboutRouter.get('/', getContact);
