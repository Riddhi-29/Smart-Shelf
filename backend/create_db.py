import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

conn = psycopg2.connect(
    host='localhost',
    port=5432,
    user='postgres',
    password='postgres',
    dbname='postgres'
)
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = conn.cursor()

# Check if database exists
cur.execute("SELECT datname FROM pg_database WHERE datname='kirana'")
exists = cur.fetchone()

if exists:
    print("Database 'kirana' already exists")
else:
    cur.execute("CREATE DATABASE kirana")
    print("Database 'kirana' created successfully")

conn.close()
