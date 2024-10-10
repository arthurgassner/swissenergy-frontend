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
In our case, we take inspiration from the way the ENTSO-E names their own prediction, i.e -- `Day-ahead Total Load Forecast` -- and assume that they forecast the consumption between `hour` and `hour + 1` using the data available a full day before `hour`.[^1]

Our modelling task could then be formulated as such: 

!!! note "Modelling task"
    At time `t`, given all the load data prior to `t`, predict the load in MW at `t + 24h`

<center>
```mermaid
graph LR
  A[Prior hourly-load data] --> B[machine learning model] --> C[Hourly-load in 24h]
```
</center>


## Where to start

Where can we even start solving this ?

Young and freshly out-of-college, we could let our excitement win and dive straight into implementing some complex[^2] ML-based time-series prediction model. We'd then measure our approach through the previously-chosen performance metric -- MAPE -- and would -- let's assume -- end up with a MAPE of 8%.

Amazing !

And now we're left to ask: Is that good ?

<figure markdown="span">
  ![Image title](images/modelling/placeholder.png){ width="300" }
  <figcaption>PLOT MODEL COMPLEXITY vs PERFORMANCE METRIC, with one data point at a "HIGHLY COMPLEX"</figcaption>
</figure>

At this point, there would be no way to know. 
What's worse is, we wouldn't even know if it's better than a simpler -- often called "dummy" -- approach. 
What we would know is that getting to that 8% cost us time and effort -- more effort than starting with a _dummy approach_. To add salt on the wound, going forward with our complex approach would cost us more ressources than it would had our approach been simple.[^3]

What would then be our next step ? Well, we would implement that "simpler" approach to see how much good all of this complexity brought us and be able to **compare**.
Being able to **compare** performances allows us to better understand the cost/benefit ratio of adding complexity to the model. 

<figure markdown="span">
  ![Image title](images/modelling/placeholder.png){ width="300" }
  <figcaption>TODO PLOT MODEL COMPLEXITY vs PERFORMANCE METRIC with two data points, one simple and one complex</figcaption>
</figure>

This brings me to my first point:

<center><h1><font size="6"><b>Start simple[^1]</b></font></h1></center>							

Let's now assume we did that. We started simple, built a _dummy baseline_ and got a great performance: a MAPE of 10%.

Amazing !

And now the same question comes back: Is that good ?

This brings me to my second point:

<center><h1><font size="6"><b>Most industry problems have a "this is good-enough" threshold.</b></font></h1></center>							
	 
<figure markdown="span">
  ![Image title](images/modelling/placeholder.png){ width="300" }
  <figcaption>TODO PLOT MODEL COMPLEXITY vs PERFORMANCE METRIC, adding horizontal line for "good-enough"</figcaption>
</figure>

In most situations, we are not doing machine learning to chase the highest ever performance at all costs;² We're solving a business problem. 
Machine learning is a tool for us to solve that problem. But at some point -- at some specific performance score -- the problem can be deemed solved, and we can move onto the next challenge: making our solution available to the user (i.e. customer, colleague, friend, ...).

It is often hard to figure out that threshold. People won't tell you "We'd like a F1 of 0.93", or "The inference time must be under 100ms while keeping the BLUE-score at 0.8". 

Figuring out what matters to the user -- inference time, prediction quality, model explainability, computation cost, ... -- can help us figure out what we should measure.

Once we know what to measure, a back-and-forth with the user², trying out different solutions as the modelling goes on, can help approximate this "good-enough threshold".

Now let's say we are trying different approaches, yielding different MAPE scores, but none of them really satisfy us. One thing to keep in my is my third point:

<center><h1><font size="6"><b>Most prediction problems have a performance upper-bound.</b></font></h1></center>							 

That is, there is _usually_ some amount of randomness when predicting the future from a given set of observations. A direct consequence of that is that regardless of how good your model is, you will not be able to perfectly predict the future.

<figure markdown="span">
  ![Image title](images/modelling/placeholder.png){ width="300" }
  <figcaption>PLOT MODEL COMPLEXITY vs PERFORMANCE METRCI, adding horizontal line for "highest-possible score".</figcaption>
</figure>

All you can do is hope that this upper-bound is above the "good-enough" threshold.
To add insult to injury, this upper-bound is rarely available to us. 
What we can do is measure the human-level performance on that task, which would give us a lower-bound to that upper-bound.

<figure markdown="span">
  ![Image title](images/modelling/placeholder.png){ width="300" }
  <figcaption>TODO PLOT MODEL COMPLEXITY vs PERFORMANCE METRCI, adding horizontal line for human-performance</figcaption>
</figure>


Now that we've talked extensively about model performances, let's move onto some actual modelling.

[^1]:
    As I would figure out later, forecasts are usually added to the ENTSO-E website in bulk, at 05:41 in the morning. Still, we picked this approach and are sticking with it. It is interesting to note that I _assumed_ that's how they generated their predictions, and should have asked them directly via email -- as outlined in the motivation part of this writeup.

[^2]: When I talk about complexity here, I don't mean amount of parameters -- although it is usually correlated -- but complexity of the overall ML lifecycle of our approach. We are building a full-fledged solution -- along with tooling to maintain, fix and update our solution. Its complexity goes beyond how many fake-neurons our model has.

[^3]: I am _by far_ not the first person to make that point -- with KISS being one example of it -- but it's so easy to forget that I think it's important to hammer it in.

¹ We all know that itch.

¹ To state the obvious: Simple approaches are _usually_ easier to develop, industrialize and deploy than complex ones.

² If that's what you want to do, academy/research has a higher density of such problem statements

³ When possible

## Dummy Baseline 

## Time-serie forecasting as a regression

<figure markdown="span">
  ![Image title](images/modelling/placeholder.png){ width="300" }
  <figcaption>TODO RESHAPING THE DATA TO FIT A REGRESSION TASK</figcaption>
</figure>

## Leveraging past-load's statistics