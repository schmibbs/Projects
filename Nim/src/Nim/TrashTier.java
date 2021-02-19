package Nim;
import java.util.Random;

/**
 * dumb AI player that will randomly remove marbles from the bowl
 * that is at least one but no more than half the marbles in the bowl
 * @author Schmibbs
 */
public class TrashTier implements Player
{ 
    private Random rng = new Random();
    private int num = 0;
    private int amt = rng.nextInt();
    
    /**
     * creates a dumb player. The counter is used if the user wishes to 
     * create multiple dumb players
     */
    public TrashTier() 
    {
        num ++;
    }
    
    /**
     * generates a random number of marbles to remove from the pile.
     * @return the amount of random marbles to remove
     */
    public int move()
    {
        amt = rng.nextInt(100) + 1;
        return amt;
    }
    
    /**
     * The name of the dumb player
     * @return The name of the dumb player
     */
    public String getName()
    {
        if (num > 1)
        {
            return "Simple Jack #" + num;
        }
        return "Simple Jack";
    }
    
    public void moveReset() {}; //only used by the perfect player
    
    /**
     * Prints the dumb players name and "has removed". The Nim class is 
     * used to complete the statement
     * @return Dumb player's name, has removed... 
     */
    public String toString()
    {
        return getName() + " has removed ";
    }
}
//=========================End of TrashTier Class===============================