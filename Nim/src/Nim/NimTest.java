package Nim;

/**
 *
 * @author Schmibbs
 */
public class NimTest {
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        /*
        create player objects
        the nim object
        call play method
        ask user if they want to play again
        */
        String cont = "yes";
        
        while (cont.equalsIgnoreCase("yes"))
        {
           Nim newGame = new Nim();
           newGame.humanPlayer();
           newGame.opponentType();
           newGame.play();
           cont = Nim.contMessage();
        } 
    }
}
//============================End of Test Class=================================