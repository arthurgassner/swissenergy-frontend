#  :octicons-people-24: Problem understanding 

## Business problem

In industry, most -- if not all -- ML use-cases start with a business problem. That is, you work for a business, they have a problem, and they're turning to you because they think ML might be a way to a solution.

In our case, let's assume the business problem is a colleague coming to us saying

!!! abstract "Business Problem"
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
- `Clarify the constraints`: How much data do we have? How is the quality of that data? What does the data-gathering process look like?
- `Clarify the needs`: What is needed actually? A prediction model? How accurate? How often should it run? How far away should it predict? What is shortest path to success?
    
None of these questions are trivial, nor should they be. It is likely that it will take time and back-and-forth to answer them to a somewhat-satisfying level, if ever. Identifying early-on who would be using your ML solution -- and having them in the loop -- greatly reduces the risk of misunderstanding the business problem.

!!! tip "Talk to your users[^1]"
    Get as close as possible to the would-be users of your ML solution and **talk to them**.

[^1]: I talk about _users_ as if we were selling a SaaS; we are not, but we are building a solution **for someone**. That someone is our user. If they don't end up using our solution, we failed.

## Conclusion

With a sound understanding of our problem, we can start looking at the data sources available to us.