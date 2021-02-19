package Nim;

/**
* perfect AI player that will always win if they are allowed to play first
* unless the number of marbles in the pile is 2^n-1 
*
* Removes the number of marbles that will allow the greatest number of 
* marbles left that is 2^n-1
* 
* ex
*    100 marbles in the bowl, the robot leaves 63 (2^7 >100 therefore, 63)
* @author Schmibbs
*/
public class GodTier implements Player
{
    private int num = 0;
    private int n = 100;
    private int i = 0;
    
    /**
     * creates a perfect player. The counter is used if the user wishes to 
     * create multiple prefect players
     */
    public GodTier()
    {
        num++;
    }
    
    /**
     * Generates powers of two to find the perfect amount of marbles to move
     * @return 2^(needed power -1)
     */
    public int move()
    {
        int x = 0;
        x = (int)Math.pow(2, i);
        i++;
        
        //x = (int)((n+1) - Math.pow(2,i-1));
        //n =-x;
        return x/2;
    }
    
    /**
     * resets the accumulator so that the move method can start from 2^0 again
     */
    public void moveReset()
    {
        i = 0;
    }
    
    /**
     * The name of the perfect player
     * @return The name of the perfect player
     */
    public String getName()
    {
        if (num > 1)
        {
            return "Rainman #" + num;
        }
        return "Rainman";
    }
    
    /**
     * Prints the players name and "has removed". The Nim class is 
     * used to complete the statement
     * @return Perfect player's name, has removed...
     */
    public String toString()
    {
        return getName() + " has removed ";
    }
}
//===========================End of GodTier Class===============================