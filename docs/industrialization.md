# :fontawesome-solid-industry: Industrialization

We now have a working model, performing at an acceptable level. My goal is to bring it to the user.

We are facing several hurdles:

- Shareability: Let's say I way to share it to user, how can I do that ?
- Maintainability:
    - Do I have any confidence that my code works as intended ?
    - In two months, can I easily come back to it ? 
    - I'd like to have a friend help me out with some new approach he has; how can I do that ?

This chapter is about fixing this.

## Up the standard

The path to making our code maintainable and deployable is essentially about code-quality. 
Doing so requires us to go from a bunch of Jupyter Notebooks that work -- on my machine -- to a bunch of `.py`, with tests, clean code and comments.
Below are some of my favourite tools to get the job done.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="50%" }
  <figcaption>A bunch fo .ipynb ==> a bunch of .py, with a git repo, tests, CI/CD</figcaption>
</figure>

### Version control

### Code quality

### Testing

- .PY
- git, github
- precommit hooks, docstring generator, pytest, black
- CI/CD
- docker