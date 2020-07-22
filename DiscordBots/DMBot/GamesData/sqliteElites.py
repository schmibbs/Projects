import sqlite3

conn = sqlite3.connect("./DiscordBots/DMBot/GamesData/EliteAnimations.db")
c = conn.cursor()
conn.text_factory = str
# ctrl + k + c -> mass comment
# ctrl + k + u -> mass UNcomment

# c.execute("DROP TABLE EliteAnimations")
c.execute("""CREATE TABLE EliteAnimations (
        name text,
        operator text,
        count int,
        date text
        )""")

c.execute("INSERT INTO EliteAnimations VALUES ('Schmibbs', 'IQ', 21, '12/1/2020')")
conn.commit()
c.execute("SELECT * FROM EliteAnimations")
print(c.fetchall())
conn.commit()
conn.close
