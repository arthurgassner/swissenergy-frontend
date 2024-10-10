# :material-lightbulb-on: Motivation

## Why am I doing this?

I wanted to have a place where I could showcase an end-to-end machine learning (ML) use-case.
Beyond the methodologies -- and tools involved -- I wanted to centralize some pieces of advice, as not to lose sight of them.
None of them should be taken as gospel -- as I am still early in my career -- nor should they be seen as set-in-stone rules; they are more like flexible guidelines to help navigate an ML use-case from start to finish.

Eventually, I stumbled upon the [Swiss Energy Dashboard](https://energiedashboard.admin.ch/strom/stromverbrauch), made available by the Swiss Federal Office of Energy (SFOE). I figured it would make for an interesting use-case dealing with real-world data.

<figure markdown="span">
  ![Image title](images/motivation/swiss-energy-dashboard.png){ width="800" }
  <figcaption>Electricity consumption plot from the Swiss Energy Dashboard</figcaption>
</figure>


## Business problem

In industry, most -- if not all -- ML use-cases start with a business problem. That is, you work for a business, they have a problem, and they're turning to you because they think ML might be a way to a solution.

In our case, let's assume the business problem is a colleague coming to us saying

!!! note "Business Problem"
    We are an energy distribution company.
    As such, we deal with the consumption of energy throughout our grid.
    We don't know how said consumption will evolve in the future, and it would help us to know.

Great, but not enough to go from. 

It's capital to better define what's going on around our problem before we start digging.
What is _the future_? How are things currently done? What happens if a prediction is wrong? Why would it be useful for us to know that future? Who would be impacted? How? What data do we have currently? Can we trust it? How far back does it go?

!!! tip "Never assume anything"
    Clarify the **context**, the **constraints**, and the **needs**.

Let's break it down.

- `Clarify the context`: Who would be impacted by these predictions? Who would use them? How would they use them?
- `Clarify the constraints`: How much data do we have? How is the quality of that data? Did something change within the data-gathering process?
- `Clarify the needs`: What is needed actually? A prediction model? How accurate? How often should it run? How far away should it predict? What is shortest path to success?
    
None of these questions are trivial, nor should they be. It is likely that it will take time and back-and-forth to answer them to a somewhat-comfortable level, if ever. Identifying early on who would be using your ML solution -- and having them in the loop -- greatly reduces the risk of misunderstanding the business problem.

!!! tip "Talk to your users[^1]"
    Get as close to the would-be users of your ML solution and **talk to them**.


[^1]: I talk about _users_ as if we were selling a SaaS; we are not, but we are building a solution **for someone**. That someone is our user. If they don't end up using our solution, we failed.