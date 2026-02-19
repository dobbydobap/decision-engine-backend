import { Request, Response } from 'express';
import { registerUser, loginUser, AuthSchema } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    //Validating the incoming request body using our Zod schema
    const validatedData = AuthSchema.parse(req.body);
    
    //Calling the service layer to do the heavy lifting
    const user = await registerUser(validatedData);
    
    //success response
    res.status(201).json({
      message: 'User registered successfully',
      data: user
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = AuthSchema.parse(req.body);
    const result = await loginUser(validatedData);

    res.status(200).json({
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};