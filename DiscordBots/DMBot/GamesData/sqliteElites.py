import sqlite3

class sqliteElite:
        
        conn = sqlite3.connect("./DiscordBots/DMBot/GamesData/EliteAnimations.db")
        c = conn.cursor()
        conn.text_factory = str # converts from unicode text to UTC-8 code (no u preceding string results)


        # creates a table with four attributes (name, operator, date): text and count: int
        def createTable():
                c.execute("""CREATE TABLE EliteAnimations (
                        name text,
                        operator text,
                        count int,
                        date text
                        )""")
                conn.commit()

        # inserts a value into the table. Contains an internal debug flag that can be set for testing
        def insert(name, operator, count, date):
                debug = true
                if (debug):
                        name = 'schmibbs'
                        operator = 'doc'
                        count = 21
                        date = '12/1/2020'
                c.execute("INSERT INTO EliteAnimations VALUES ('" + name + "', '" + operator + "', " + count + ", '" + date + "')")
                conn.commit()
        
        # drops the table from memory
        def dropTable():
                c.execute("DROP TABLE EliteAnimations")
                conn.commit()

        # shows what is stored in the table so far
        def printResults():
                c.execute("SELECT * FROM EliteAnimations")
                print(c.fetchall())

        conn.close
