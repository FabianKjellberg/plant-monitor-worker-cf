import { Context } from "hono";

export const testAuthHandler = async (c: Context) => {
  try {
    const userId = await c.get('userId');
    
    return c.json({message : "authenticated correctly", userId: userId},200)
  }
  catch (error) {
    console.error('Error testing auth:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
}