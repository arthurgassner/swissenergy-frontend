# :material-atom: Modelling

## From business problem to modelling task

!!! quote "Charles Kettering"
    A problem well-stated is a problem half-solved


Now that we have a better understanding of our data, let's go back to our business problem, i.e.: 

!!! note "Business Problem"
    We are an energy distribution company.
    As such, we deal with the consumption of energy throughout our grid.
    We don't know how said consumption will evolve in the future, and it would help us to know.

We want -- equipped with our new understanding of the context, constraints and needs of our business -- to solve this problem.
To solve it, we first need to translate it into a _modelling task_, i.e. to formulate it in terms of input, machine learning model and output. 

There are several correct ways to do so. 
In our case, we take inspiration from the way the ENTSO-E names their own prediction, i.e -- `Day-ahead Total Load Forecast` -- and assume that they forecast the consumption between `t` and `t + 1h` using the data available a a full day before `t`.[^1]

[^1]: As I would figure out later, forecasts are usually added to the ENTSO-E website in bulk, at 05:41 in the morning. Still, we picked this approach and are sticking with it. It is interesting to note that I _assumed_ that's how they generated their predictions, and should have asked them directly via email -- as outlined in the motivation part of this writeup.

Our modelling task could then be formulated as such: 

!!! note "Modelling task"
    At time `t`, given all the load data prior to `t`, predict the load in MW at `t + 24h`

<center>
```mermaid
graph LR
  A[Prior hourly-load data] --> B[ML model] --> C[Hourly-load in 24h]
```
</center>

We wrangle the data to better represent our modelling task. That is, each row's index is now the timestamp `t`, and the target -- called `24h_later_load` -- is the actual load [MW] between `t + 24h` and `t + 24h + 1h`.

```python
from datetime import timedelta

df = df.set_index(df.index - timedelta(hours=24))
df = df.rename(columns={'Actual Load': '24h_later_load'})
df.head()
```

<figure markdown="span">
  ![Image title](assets/modelling/df_wrangling.png){ width="50%" }
  <figcaption>A data model fitting our modelling task.</figcaption>
</figure>

## Where to start

Where can we even start solving this ?

Let's stand back a little bit and think about the choice in front of us.
We're about to build some machine learning model to solve our modelling task.
We can go with an ARIMA model, a transformer-based approach, or even the latest NeurIPS paper.[^2]
Really, we have to choose how complex[^3] our first attempt at modelling should be.

[^2]: We all know that itch.
[^3]: When I talk about complexity here, I don't mean amount of parameters -- although it is usually correlated -- but complexity of the overall ML lifecycle of our approach. We are building a full-fledged solution -- along with tooling to maintain, fix and update our solution. Its complexity goes beyond how many fake-neurons our model has.

Young and freshly out-of-college, we could let our excitement win and dive straight into implementing the most complex ML-based time-series prediction model. Assuming that surely complexity and modernity are synonymous with performance. This would be a mistake, as our goal is _not_ to build the best model, but to answer the need of the business.[^4] 

[^4]: If that's what you want to do, academy/research has a higher density of such problem statements

!!! tip "There is such a thing as good-enough"
    Most industry problems have a "this is good-enough" threshold.

This "good-enough" threshold is the lowest performance that satisfies the needs of the business. It's often hard to express in hard numbers, and comes from understanding the business needs. Often, you will end up with an approximation acting as a proxy, meaning that a model performing up to that standard _should_ fulfill those needs.[^5] 

[^5]: Here we talk about performance as if it was uni-dimensional. It rarely is You should consider -- amongst other things -- the raw performance, the inference time, the ease of maintenance, the explainability, the upfront training cost and the deployment cost. 

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="100%" }
  <figcaption>PLOT MODEL COMPLEXITY vs PERFORMANCE METRIC, with good-enough threshold"</figcaption>
</figure>

Back at our initial choice, and we have either start simple or complex.

We **really** should start simple, for many reasons:

- A simple solution might place us above the "good-enough" threshold, saving us a lot of work.
- It is often difficult to know where the "good-enough" threshold should be. Building a simple approach and getting user feedback allows us to place it above or below that approach's performance.
- A simple solution is an effective benchmarking tool against which we can rank other solutions.
- A simple solution is a good sanity check that our understanding of problem and data source are sound.
- Let's assume we started with a complex solution. The cost (in time and ressource) to go onwards with it -- in terms of industrialization, deployment and maintenance -- would far outweigh the cost of _trying_ a simple solution. And if a simple solution was acceptable, then we'd go for the simple solution. Hence, even if we started from a complex approach, we'd build the simple approach _just to check_ and justify the complex approach.
- It's easier to start simple and add complexity step by step.

!!! tip "Please"
    Start simple[^6]
				

[^6]: I am _by far_ not the first person to make that point -- with KISS being one example of it -- but it's so easy to forget that I think it's important to hammer it in.

Wonderful, let's say we listened and started with a simple approach -- a _dummy baseline_. Unfortunately, the user is not satisfied -- i.e. the business need is not answered.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="100%" }
  <figcaption>TODO PLOT MODEL COMPLEXITY vs PERFORMANCE METRIC with good-enough threshold, and a simple datapoint under the threshold</figcaption>
</figure>

From that point on, we can add complexity step-by-step, till we -- hopefully -- surpasses the "good-enough" threshold.

As we try different approaches, we should be mindful that we are facing a performance upper-bound.

!!! tip "Performance upper-bound"
    Most prediction problems have a performance upper-bound.							 

That is, there is _usually_ some amount of randomness when predicting the future from a given set of observations. A direct consequence of that is that regardless of how good your model is, you will not be able to perfectly predict the future.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="100%" }
  <figcaption>PLOT MODEL COMPLEXITY vs PERFORMANCE METRCI, adding horizontal line for "highest-possible score".</figcaption>
</figure>

All you can do is hope that this upper-bound is above the "good-enough" threshold.
Akin to the "good-enough" threshold, this upper-bound is rarely available to us. 
What we can do is measure the human-level performance on that task, which would give us a lower-bound to that upper-bound.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="100%" }
  <figcaption>TODO PLOT MODEL COMPLEXITY vs PERFORMANCE METRCI, adding horizontal line for human-performance</figcaption>
</figure>

Now that we've talked extensively about where to start, let's actually start modelling.

## Dummy Baseline 

Back to our wrangled dataset:

<figure markdown="span">
  ![Image title](assets/modelling/df_wrangling.png){ width="50%" }
  <figcaption>Our data model.</figcaption>
</figure>

We'll start with the following dummy baseline:

!!! note "Dummy baseline"
    Predict that the hourly-load at time `t + 24h` is yesterday hourly-load at the same hour, i.e. the hourly-load at time `t - 24h` [^7]

[^7]: Why not directly use the hourly-load at time `t`? Because as per the modelling task, we only know the historic load _up to_ time `t`, and hence cannot use the load between `t` and `t + 1h` to build our forecast.

```python
from datetime import timedelta
from sklearn.metrics import mean_absolute_percentage_error
import plotly.express as px

# Enrich the data with the 24h_ago_load
df = df.asfreq('h') # Enforce an hourly frequency
df['24h_ago_load'] = df['24h_later_load'].shift(48)

# Only consider the last year
with_load_latest_ts = df[~df['24h_later_load'].isna()].index.max() 
df = df[df.index >= with_load_latest_ts - timedelta(days=365)]

# Build y_true and y_pred
df = df.dropna()
y_true = df['24h_later_load']
y_pred = df['24h_ago_load']
print(f'MAPE over the last year: {mean_absolute_percentage_error(y_true, y_pred) * 100:.2f}%') 
# MAPE over the last year: 8.97%

# Plot the last month
df = df[df.index >= df.index.max() - timedelta(days=30)]

fig = px.line(
    df, x=df.index, y=['24h_later_load', '24h_ago_load'], 
    title='Actual load and dummy forecast over the last month',
    labels={'index': 'Date', 'value': 'Load [MW]', 'variable': ''}
)

fig.for_each_trace(lambda t: t.update(name={'24h_later_load': 'Actual load', '24h_ago_load': 'Dummy forecast'}[t.name]))
```

Approaching our problem like this yields the following results over the past year:

<center>

| MAPE [%] (past 30 days)   | Model                          |
| ------------------------- | :----------------------------- |
| 10.8                      | ENTSO-E forecast               |
| 8.97                      | Dummy baseline                 |

</center>

<iframe src="../assets/modelling/dummy_forecast_lineplot.html" width="100%" height="400"></iframe>

Now, that's surprising -- I'd have expected our dummy forecast to be worse than the official one. It is likely they are relying on less informations than us to forecast the future loads.[^1] Still, we can work off this baseline to further improve our approach.

## Time-serie forecasting as a regression

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="300" }
  <figcaption>TODO RESHAPING THE DATA TO FIT A REGRESSION TASK</figcaption>
</figure>

## Back-testing 

motivation for backtesting

!!! tip "Foreward split"
    foreward split 

## Leveraging past-load's statistics

## Conclusion

We now have a model performing at a satisfactory standard. We can move onto the next challenge: making our solution available to the user.