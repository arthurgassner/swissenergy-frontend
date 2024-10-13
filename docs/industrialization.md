# :fontawesome-solid-industry: Industrialization

We now have a working model, performing at an acceptable level. Our goal is to bring it to the user.

Which begs the question: How does our user want to consume our solution? 

The way the ML model will be consumed educates us on how we should deploy it. 
The way we deploy our model will heavily influence how we will productionalize our ML pipeline.
Hence, it is a good idea to know as early as possible. 

!!! tip "Need educates deployment"
    The needs of the user will dictates how we should deploy the model, not the other way around.

    An unused ML solution is a failed ML solution.

In our case, since the data is published hourly by the ENTSO-E, we would like to

- Fetch the fresh data every hour
- Train and test the model on the latest data every hour
- Forecast the load for the next 24h
- Have the latest forecast available to the user, whenever they'd like[^1]

[^1]: This is called _offline inference_.

To answer those needs, we propose the following ML system design: 

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="50%" }
  <figcaption>Deployment architecture</figcaption>
</figure>

Now another facet of bringing an ML solution to a user is that we now need to have confidence that our code is maintainable, shareable, and reproducible.

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
As such, we will talk about upping the maintainability of our code.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="50%" }
  <figcaption>A bunch fo .ipynb ==> a bunch of .py, with a git repo, tests, CI/CD</figcaption>
</figure>

## Up the maintainability

So far, we were basically experimenting, which allowed for some leeway in terms of coding practices for the sake of speed.
Now, let's look over some tools to make your code more maintainable.[^2]

[^2]: Some of these tools might feel like common sense to some people, but I prefer to highlight the obvious than be confusing.

### Version Control

I use `git` and `Github` for any project from the very beginning. 
It allows me to treat my last commit as a "at this point it was working" state, and to have my code remotely saved, were anything to happen to my computer.

### Productivity tools

Developping on Linux, I interact with the terminal _a lot_. To make this whole process more comfortable, I highly-recommend several tools:

- `zsh` with [`oh-my-zsh`](https://ohmyz.sh), [`zsh-autosuggestions`](https://github.com/zsh-users/zsh-autosuggestions), [`zsh-syntax-highlighting`](https://github.com/zsh-users/zsh-syntax-highlighting) and [`fzf`](https://github.com/junegunn/fzf)

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="50%" }
  <figcaption>A confortable terminal session, thanks to <code>oh-my-zsh</code> and others</figcaption>
</figure>

- [`terminator`](https://gnome-terminator.org) allows for several terminal sessions within one terminal

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="50%" }
  <figcaption>Several terminal sessions in one terminal, thanks to <code>terminator</code></figcaption>
</figure>

### Virtual environment

A given Python project will call for a specific Python version with specific libraries.
To compartimentalize all the Python libraries used in a given project, use a **virtual environment**.

!!! tip "Use a virtual environment"
    I use `conda`, but others exist.

### Use a `requirements.txt`

So far, we've been `pip install`ing needed libraries willy-nilly. 
That is not very reproducible, and hence we should write a file to centralize the needed libraries -- versionned -- that our project relies on, i.e. the `requirements.txt`

### From notebooks to `.py`

Jupyter notebooks (`.ipynb`) -- while great for experimentation -- are hard to test and run non-interactively. 
Hence, we move away from them, and start implementing our ML pipeline in `.py`.

### Code quality

There is no easy way to measure the "quality" of a codebase.
Below are a few non-exhaustive list of guidelines I follow to write readable code.

- Write docstrings and comments

    !!! tip "Docstrings"
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
That's were tests come in.

Unit test, integration tests, ...
CICD, github actions