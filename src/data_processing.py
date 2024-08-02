import os
import sqlite3
import pandas as pd

def load_csv_to_db(csv_file, db_file, table_name):
    db_folder = os.path.dirname(db_file)

    # Check and create
    if not os.path.exists(db_folder):
        os.makedirs(db_folder)
        print(f"Folder '{db_folder}' has been created.")

    # Check CSV
    if not os.path.isfile(csv_file):
        raise FileNotFoundError(f"CSV file '{csv_file}' does not exist.")

    # Read CSV and conn
    df = pd.read_csv(csv_file)
    conn = sqlite3.connect(db_file)

    # Upload data
    df.to_sql(table_name, conn, if_exists='replace', index=False)

    # Close
    conn.close()


# Paths
csv_file = '../Data/covid19_Confirmed_dataset.csv'
db_file = '../db/database.db'
table_name = 'covid_data'

# Call
load_csv_to_db(csv_file, db_file, table_name)