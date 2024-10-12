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

We can see data ranging from 

## Duplicates and missing values

## Plot the data

## Seasonality

## ENTSO-E's official prediction




