package Nim;

import javax.swing.JOptionPane;

/**
 * Human player that is asked on every turn, how many marbles to move and 
 * checks to make sure that they do not cheat
 * @author Schmibbs
 */
public class Human implements Player
{
    private String name = "";
    private String remove = "";
    private int amt =0;
    
    /**
     * Asks for the humans name
     */
    public Human()
    {
        name = JOptionPane.showInputDialog("Enter your name");
    }
    
    /**
     * The amount of marbles the human wishes to remove. Will print an error
     * message if they try to remove anything less than one marble
     * @return the amount of marbles to be taken
     */
    public int move()
    {
        remove = JOptionPane.showInputDialog("How many marbles " +
                                             " do you want to take");    
        
        while (Integer.parseInt(remove) <= 0)
        {
            remove = JOptionPane.showInputDialog("You must take at" +
                                                 " least 1 marble!!");
            Integer.parseInt(remove);
        }
        return Integer.parseInt(remove);
    }
    
    /**
     * Prints the name entered in the constructor
     * @return the players name
     */
    public String getName()
    {
        return name;
    }
    
    public void moveReset() {}; //only used by the perfect player
    
    /**
     * Prints the players name and "has removed". The Nim class is 
     * used to complete the statement
     * @return Human player's name, has removed... 
     */
    public String toString()
    {
        return getName() + " has removed ";
    }
}
//===========================End of Human Class=================================