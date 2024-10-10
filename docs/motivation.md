# :material-lightbulb-on: Motivation

## What is the purpose of this repo ?

I wanted to have a place where I could showcase an end-to-end machine learning (ML) use-case.
Beyond the methodologies -- and tools involved -- I wanted to centralize some pieces of advices, as not to lose sight of them.

Then, I stumbled upon the [Swiss Energy Dashboard](https://energiedashboard.admin.ch/strom/stromverbrauch), made available by the Swiss Federal Office of Energy (SFOE).

<figure markdown="span">
  ![Image title](images/motivation/swiss-energy-dashboard.png){ width="800" }
  <figcaption>Electricity consumption plot from the Swiss Energy Dashboard</figcaption>
</figure>

I figured it would make for an interesting use-case dealing with real-world data.

## Business problem

In industry, most -- if not all -- ML use-cases start with a business problem. That is, you work for a business, they have a problem, and they're turning to you because they think ML might be a way to a solution.

In our case, let's assume the business problem is a colleague coming to you saying

!!! note "Business Problem"
    We are an energy distribution company.
    As such, we deal with the consumption of energy throughout our grid.
    We don't know how said consumption will evolve in the future, and it would help us to know.

Great, but not enough to go from. 

It's capital to better define what's going on around our problem before we start digging.
What is _the future_? How are things currently done? What happens if a prediction is wrong? Why would it be useful for us to know that future? Who would be impacted? How? What data do we have currently? Can we trust it? How far back does it go?

!!! tip
    **Never assume anything.**

    Clarify the **context**, the **constraints**, the **needs** and the **wants**.

    Identify and quality -- in quantity and quality -- the **data sources available**.

    Get as close to the would-be consumers of your ML solution and **talk to them**.
    