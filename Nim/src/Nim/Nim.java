package Nim;

import javax.swing.JOptionPane;

/**
 * Class that creates a pile and uses the Player interface to manipulate
 * the amount of marbles in the pile.
 * @author Schmibbs
 */
public class Nim 
{
    private final int PLAYER_AMT = 2;
    private Player[] player;
    private boolean flag = true;
    
    /**
     * Creates an array of n players where the first user is always a human.
     */
    public Nim()
    {
        player = new Player[PLAYER_AMT];
    }
    
    /**
     * Prompt that asks what kind of opponent the user wants to play against.
     * @return the type of player as a string
     */
    private String startPrompt()
    {
        String opponent;

        opponent = JOptionPane.showInputDialog("Do you want to play against"
                + " a smart or a dumb computer?");
        
        return opponent;
    }
    
    /**
     * Prompt that asks the user if they want to go first
     * @return true if the user answers yes or y
     */
    private boolean whosOnFirst()
    {
        String response;
        response = JOptionPane.showInputDialog("Do you want to go first?");
        
        if (response.equalsIgnoreCase("yes") || response.equalsIgnoreCase("y"))
        {
            return true;
        }
        return false;
    }
    
    /**
     * Method that checks if the amount of marbles to be withdrawn if legal
     * @param amt amount to be tested
     * @return true if legal
     */
    private boolean rule(int amt)
    {
        if (amt > Pile.getSize()/2)
        {
            return false;
        }
        return true;
    }
    
    /**
     * Asks the user if they want to play another game
     * @return response as a string
     */
    public static String contMessage()
    {
        String message = JOptionPane.showInputDialog("Do you want to continue?");
        return message;
    }
    
    /**
     * creates a human player
     */
    public void humanPlayer()
    {
        player[0] = new Human();
    }
    /**
     * Asks the user what type of player they want to play against and then 
     * generates the opponent
     */
    public void opponentType()
    {
        if (startPrompt().equalsIgnoreCase("smart"))
        {
            player[1] = new GodTier();  //creates the perfect player
        }
        else
        {
            player[1] = new TrashTier();//creates a dumb player
        }
    }
    
    /**
     * Method that plays the game when the user wants to go first
     */
    private void humanFirst()
    {
        if (Pile.loss() && flag)
         {
             System.out.println(player[0].getName() + " has lost!" +
                                "\n=========================\n");
             flag = false;
         }
         else
         {
            int y = player[0].move();

            while (y > (Pile.getSize()/2))
            {
                String punkBuster = JOptionPane.showInputDialog
                                    ("You cannot take over half the pile!!");
                 
                while (Integer.parseInt(punkBuster) <= 0)
                {
                    punkBuster = JOptionPane.showInputDialog
                                        ("You must take at least one marble!!");
                }
                y = Integer.parseInt(punkBuster);                        
            }
            Pile.move(y);
            System.out.println(player[0].toString() + y + " marbles\n"); 
         } 
    }
    
    /**
     * Method lets the human play when the user wants to go second
     */
    private void humanSecond()
    {
        if (Pile.loss() && flag)
        {
            System.out.println(player[0].getName() + " has lost!" +
                                "\n=========================\n");
            flag = false;
        }
        else
        {
            if (flag) //prevents printing the loss message for the winner
            {
                int y = player[0].move();

                while (y > (Pile.getSize()/2))
                {
                    String  punkBuster = JOptionPane.showInputDialog
                                    ("You cannot take over half the pile!!");
                    while (Integer.parseInt(punkBuster) <= 0)
                    {
                            punkBuster = JOptionPane.showInputDialog
                                    ("You must take at least one marble!!");
                    }
                    y = Integer.parseInt(punkBuster);                        
                }
                Pile.move(y);
                System.out.println(player[0].toString() + y + " marbles\n");
            } 
        }
    }
    
    /**
     * Method that plays the game when the user wants the robot to go first
     */
    private void robotFirst()
    {
        if (Pile.loss() && flag)
        {
             System.out.println(player[1].getName() + " has lost!" +
                                "\n=========================\n");
             flag = false;
        }
        
        else if (player[1].getName().contains("Rain")) //checks for smart plr
        {
            int x = 0;
            int z;
            while (x <= (Pile.getSize()/2))
            {
                x = player[1].move();
            }
            z = (Pile.getSize()+1) - x;
            
            //The following sees if the pile is (2^n) -1 and 
            //takes only one if it is
            if ((Pile.getSize() + 1) == (2 * x))
            {
                z = 1;
            }
            Pile.move(z);

            System.out.println(player[1].toString() + z + " marbles\n");
            player[1].moveReset();
        }

        else
        {
            int x = player[1].move();
            while (x > (Pile.getSize()/2))
            {
                x = player[1].move();
            }
            Pile.move(x);
            System.out.println(player[1].toString() + x + " marbles\n");
        }
    }
    
    /**
     * Method lets the robot play when the user wants to go first
     */
    private void robotSecond()
    {
        if (Pile.loss() && flag)
        {
             System.out.println(player[1].getName() + " has lost!" + 
                                "\n=========================\n");
             flag = false;
        }
        
        else
        {
            if (flag)   //prevents printing the loss message for the winner
            {  
                if (player[1].getName().contains("Rain")) //checks for smart plr
                {
                    int x = 0;
                    int z;
                    while (x <= (Pile.getSize()/2))
                    {
                        x = player[1].move();
                    }
                    z = (Pile.getSize()+1) - x;
                    
                    //The following sees if the pile is (2^n) -1 and 
                    //takes only one if it is
                    if ((Pile.getSize() + 1) == (2 * x))
                    {
                        z = 1;
                    }
                    Pile.move(z);
                    
                    System.out.println(player[1].toString() + z + " marbles\n");
                    player[1].moveReset();
                }
                
                else
                {
                int x = player[1].move();
                while (x > (Pile.getSize()/2))
                {
                    x = player[1].move();
                }
                Pile.move(x);
                System.out.println(player[1].toString() + x + " marbles\n");
                }
            }
        } 
    }

    /**
     * Method that conducts the game
     */
    public void play()
    {
        //opponentType();                 //asks who the user will play against
        
        Pile oMarbles = new Pile();     //generates a new pile of marbles

        if (whosOnFirst())
        {
        while (oMarbles.getSize() > 0 && flag)
            {
                System.out.println(oMarbles.toString());
                humanFirst();
                
                System.out.println(oMarbles.toString());
                robotSecond();
            }
        }

        else
        {
            while (oMarbles.getSize() > 0 && flag)
            {
                System.out.println(oMarbles.toString());
                robotFirst();
                
                System.out.println(oMarbles.toString());
                humanSecond();
            } 
        }
    }   
}
//===============================End of Nim Class===============================
