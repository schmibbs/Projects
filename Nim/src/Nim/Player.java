package Nim;

/**
 * interface that will move the marbles to and from a bowl
 * @author Schmibbs
 */
public interface Player {
    int move();        //returns the number of marbles taken
    void moveReset();  //resets the accumulator for the smart player
    String getName();  //returns the players name
}
//========================End of Player Interface===============================