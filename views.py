import sqlite3
from flask import Blueprint, render_template, request
import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt
import pandas as pd

views = Blueprint('views', __name__)

def get_categories_from_db():
    conn = sqlite3.connect('db/database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT "Country/Region" FROM covid_data')
    countries = cursor.fetchall()
    conn.close()

    # Convert list of tuples to a set of strings
    countries_set = sorted(set(country[0] for country in countries))
    return countries_set

def read_data_from_db(db_file, table_name):
    conn = sqlite3.connect(db_file)
    df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
    conn.close()
    return df


def save_plot_to_image(df_country, selected_countries):
    plt.figure()

    for country in selected_countries:
        if country in df_country.index:
            df_country.loc[country][1:].plot(label=country)

    plt.legend()
    plt.title('Covid-19 Cases for Selected Countries')
    plt.xlabel('Date')
    plt.ylabel('Total Cases')
    plt.grid(True)

    # Save plot as a PNG file
    image_path = '../DataAnalyzeCovid-19/static/images/covid_cases_plot.png'
    plt.savefig(image_path)
    plt.close()

    return 'images/covid_cases_plot.png'



@views.route('/', methods=['GET', 'POST'])
def index():
    db_file = "db/database.db"
    table_name = "covid_data"

    # Retrieve countries for dropdown
    countries = get_categories_from_db()

    if request.method == 'POST':
        # Get selected countries from the form
        country1 = request.form.get('country1')
        country2 = request.form.get('country2')

        # Read data from DB
        df = read_data_from_db(db_file, table_name)
        df.drop(["Lat", "Long"], axis=1, inplace=True)
        df_country = df.groupby("Country/Region").sum()

        # Generate plot based on selected countries
        plot_path = save_plot_to_image(df_country, [country1, country2])

        return render_template("index.html", countries=countries, plot=plot_path)

    return render_template("index.html", countries=countries)

@views.route('/tracker', methods=['GET', 'POST'])
def tracker():
    db_file = "db/database.db"
    table_name = "covid_data"

    if request.method == 'POST':
        search_value = request.form.get('search').strip()
        df = read_data_from_db(db_file, table_name)
        df.drop(["Lat", "Long"], axis=1, inplace=True)
        df_country = df.groupby("Country/Region").sum()

        # Check if the search_value is in the index of df_country
        if search_value in df_country.index:
            search_result = search_value
        else:
            search_result = "No matches found."

        return render_template("tracker.html", search_result=search_result)

    return render_template('tracker.html', search_result=None)