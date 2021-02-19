package Nim;
import  java.util.Random;

/**
 *class that creates a bowl with 10 - 100 marbles, and keeps track of 
 *how many marbles are in the bowl.
 * @author Schmibbs
 */
public class Pile 
{
    private static int marbles;
    private Random rng = new Random();
    private final int MINIMUM = 10;
    private final int MAXIMUM = 100;
    private int counter =0;
    
    /**
     * creates a bowl of marbles with the minimum amount of marbles to the max
     */
    public Pile()
    {
        //marbles = 127; <-- used for testing smart robot
        marbles = rng.nextInt(MAXIMUM-MINIMUM + 1) + MINIMUM;
    }
    
    /**
     * how many marbles are in the bowl
     * @return amount of marbles in the bowl
     */
    public static int getSize()
    {
        return marbles;
    }
    
    /**
     * removes a certain number of marbles from the bowl
     * @param amt amount to be removed
     * @return the adjusted amount
     */
    public static int move(int amt)
    {
        return marbles -= amt;
    }

    /**
     * Checks to see if the following player will lose
     * @return true if the following player will lose
     */
    public static boolean loss()
    {
        if (marbles == 1)
        {
            return true;
        }
        return false;
    }
    
    /**
     * Prints how many marbles are in the bowl or a finishing message
     * @return The pile size or a game over message
     */
    public String toString()
    {
        if (loss() && counter < 1)
        {
            counter++;
            return "The game is finished!";
        }
        
        else if (counter >= 1)
        {
            // Prevents repeating the previous statement
            return "";
        }
        
        return "There are " + Integer.toString(marbles) + 
               " marbles in the bowl.";
    }
}
//============================End of Pile Class=================================
