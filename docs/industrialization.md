# :fontawesome-solid-industry: Industrialization

## Introduction 

We now have a working model, performing at an acceptable level. Our goal is to bring it to the user.

Which begs the question: How does our user want to consume our solution?[^1]

[^1]: When we first talked to our user, we sketched out a rough idea of how the solution would be consumed -- and deployed. It is important not to wait till we're at the doors of industrialization to start thinking about deployment options, they might impact the modelling options available to us. We do _not_ want to end up so far in, only to have to go back to modelling because we realized the user wants to consume their massive model on a low-power chip. 

The way the ML model will be consumed educates us on how we should deploy it. 
The way we deploy our model will heavily influence how we design our ML system, and hence how we will industrialize[^2] it.

[^2]: Also called _productionalize_.

!!! tip "User needs educate deployment strategies."
    The needs of the user will educate how we should deploy the model, not the other way around.

    An unused ML solution is a failed ML solution.

In this section, we will go over the ML system design of our solution, followed by tools and tips on how to end up with production-ready software.

## ML System Design

In our case, the user **needs** to have the latest forecast available whenever they'd like.

Since the ENTSO-E data is published hourly, this means

- Fetching the fresh data every hour.
- Training and testing the model on the latest data every hour.
- Forecasting the load for the next 24h.[^3]
- Having the latest forecast available to the user.

[^3]: This is called _offline inference_.

We propose hosting our ML solution on a remote machine, which can be access via a REST API.
The remote machine will periodically fetch the latest ENTSO-E data and train a model on them.
That model will then be used to predict the loads for the next 24h, which will be saved to disk.
Upon receiving the appropriate request through the REST API, the machine will return the latest forecast.

<figure markdown="span">
  ![Image title](assets/industrialization/ml_system_design.png){ width="75%" }
  <figcaption>System Design of our ML solution.</figcaption>
</figure>

## Production-ready software

Another facet of bringing an ML solution to a user is that we now need to have confidence that our code is maintainable, shareable, and reproducible. 

- **Maintainability**:
    - Do I have any confidence that my code works as intended?
    - In two months, can I easily come back to it? 
    - If I change some code, how do I know it is still working as intended?
- **Shareability**: 
    - Let's say I way to share it to our user; how can I do that?
    - A friend wants to help me out; how can they do that?
- **Reproducibility**: 
    - Am I confident that I can easily reproduce the results outlined previously?

All three issues are interlinked.
If you're the one maintaining the code, you're basically sharing with future you, who has to reproduce past results.

So far, we were basically experimenting, which allowed for some leeway in terms of coding practices for the sake of speed.
Now, let's look over some tools to make your code more maintainable.[^4]

[^4]: Some of these tools might feel like common sense to some people, but I prefer to highlight the obvious than be confusing.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="50%" }
  <figcaption>A bunch fo .ipynb ==> a bunch of .py, with a git repo, tests, CI/CD</figcaption>
</figure>


### Version Control

I use `git` and `Github` for any project from the very beginning. 
It allows me to treat my last commit as a "at this point it was working" state, and to have my code remotely saved, were anything to happen to my computer.

An upside of using GitHub[^5] is their [Github Actions](https://github.com/features/actions), allowing us to automate part of our workflow, and further improve the shareability of our code.

[^5]: Most `git` hosting solutions have an equivalent.

### Use `.env`

Using `git` means creating a trail of every single (commited) state that the software has been in.
It would be easy for one to hard-code sensitive -- i.e. private -- data, such as an API key or a password -- and have it saved in that trail, seemingly-forever.[^6]

[^6]: You can always edit a file's history, but it's messy.

Additionally, we might have certain variables that would depend on our environment -- developpement or production.

Using an `.env` file solves both of these issues.

!!! tip "Use `.env`"
    Private or environment-dependent variables should go in an `.env`, which you will not be commited to history.[^7]

    I use and like [`python-dotenv`](https://github.com/theskumar/python-dotenv), but alternatives exist.

[^7]: Thank you `.gitignore`

### Build REST API with `FastAPI`

link to their github
quick, automatic reloading, automattif swagger ui
show swagger ui
show a gif of running the server
flask is an alternative

### Productivity tools

Developping on Linux, I interact with the terminal _a lot_. To make this whole process more comfortable, I highly-recommend several tools:

- `zsh` with [`oh-my-zsh`](https://ohmyz.sh), [`zsh-autosuggestions`](https://github.com/zsh-users/zsh-autosuggestions), [`zsh-syntax-highlighting`](https://github.com/zsh-users/zsh-syntax-highlighting) and [`fzf`](https://github.com/junegunn/fzf)

<figure markdown="span">
  ![Image title](assets/industrialization/zsh.gif){ width="100%" }
  <figcaption>A comfortable terminal session, thanks -- amongst others -- to <code>oh-my-zsh</code></figcaption>
</figure>

- [`terminator`](https://gnome-terminator.org) allows for several terminal sessions within one terminal

<figure markdown="span">
  ![Image title](assets/industrialization/terminator.png){ width="100%" }
  <figcaption>Several terminal sessions in one terminal, thanks to <code>terminator</code></figcaption>
</figure>

### Virtual environment

A given Python project will call for a specific Python version with specific libraries.
To compartimentalize all the Python libraries used in a given project, use a **virtual environment**.

!!! tip "Use a virtual environment"
    I use `conda`, but others exist.

### Use `requirements.txt`

So far, we've been `pip install`ing needed libraries willy-nilly. 
That is not very reproducible, and hence we should write a file to centralize the needed libraries -- versionned -- that our project relies on, i.e. the `requirements.txt`

### From notebooks to `.py`

Jupyter notebooks (`.ipynb`) -- while great for experimentation -- are hard to test and run non-interactively. 
Hence, we move away from them, and start implementing our ML pipeline in `.py`.

### Code quality

There is no easy way to measure the "quality" of a codebase.
Below are a few non-exhaustive list of guidelines I follow to write readable code.

- Write docstrings and comments

    !!! tip "Write Docstrings"
        Over the years, a lot of docstring flavors saw the light of day. <br>
        Just [pick one you like](https://docs.dasch.swiss/latest/DSP-TOOLS/developers/code-quality-tools/python-docstring-formatting/) and stick to it throughout your codebase.

- Use [typehints](https://docs.python.org/3/library/typing.html)

    !!! tip "Strongly-typed docstrings in a dynamically-typed language"
        Python is dynamically-typed, meaning no types are enforced. <br>
        Still, to increase readability one should use typehints, as well as write the types in the docstring.

- Use code formatters

    !!! tip "Code formatters"
        Consistency improves readability.
        
        Code formatters automatically formats the code to follow some guidelines. <br>
        I like and use [`black`](https://github.com/psf/black) to format my code, and [`isort`](https://pycqa.github.io/isort/) to sort my imports.

- Use [pre-commit hooks](https://pre-commit.com/) to automatically apply certain code-formatting steps upon committing to `git`.

### Testing

Untested code breaks easily. What happens if in 2 months I make some change to the codebase; can I be confident I didn't break the whole thing?
That's were tests come in. To test python code, [`pytest`](https://docs.pytest.org/en/stable/) is a battle-tested solution.

## Conclusion

We now have a maintainable end-to-end solution. We can move onto deploying to our user, so that they can start using it. 