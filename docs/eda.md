# :fontawesome-solid-vial: Exploratory Data Analysis (EDA)

Now that we have access to our data source, let's explore it.
We must ensure we have a good understanding of what the data is -- and isn't -- before we can explore modelling options.

In other words, let's dive into the **Exploratory Data Analysis (EDA)**.

## What does our data look like ?

How far back does our data go? Do we have data for every single hour? Do we have duplicates?

!!! tip Data assessement
    Identify and qualify -- in quantity and quality -- your **data sources**.

To answer these questions, let's start by fetching data for as far back as we can, and plotting it.

```python
import plotly.express as px

fig = px.line(df, x=df.index, y='Actual Load', 
              markers=True, 
              title='Lineplot of all the available Actual Load',
              labels={'index': 'Date', 'Actual Load': 'Actual Load [MW]'})
```

<iframe src="../assets/eda/actual_load_lineplot.html" width="100%" height="400"></iframe>

We can see data ranging from 2014 to 2024, with a nice -- and expected -- seasonality throughout the years.
It does seem like some days are missing -- especially in 2024.

## Empty, missing or duplicated data

### Empty data

Do does the ENTSO-E API send us empty data (`NaN`)? Let's check.

```python
import plotly.express as px

df.loc[df['Actual Load'].isna(), 'color'] = 'Missing Actual Load'
df.loc[df['Forecasted Load'].isna(), 'color'] = 'Missing Forecasted Load'

fig = px.scatter(x=df[mask].index, y=mask[mask], color=df[mask].color,
              title='Scatterplot of the missing loads (Actual & Forecasted)',
              labels={'x': 'Date', 'y': 'Whether the data is missing', 'color': ''})
```

<iframe src="../assets/eda/missing_load_lineplot.html" width="100%" height="400"></iframe>

They do send us empty data, namely:

- The actual load is empty between now and tomorrow evening. This makes sense, because these are future datetimes for which we have a forecasted load. 
- The forecasted loads is empty for 24h straight on the 24.11.2014. Looking at the full data, this corresponds to a streak of _missing_ actual loads in 2024.
- The forecasted loads is empty for 24h straight on the 31.08.2015. Likely some kind of maintenance happened on that day on the ENTSO-E's side.

### Missing data

### Duplicated data

## Seasonality

## ENTSO-E's official prediction




