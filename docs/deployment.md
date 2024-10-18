# :octicons-share-android-16: Deployment

## Introduction

We now have a maintainable end-to-end solution, that no one can use -- unless they physically access our computer.

In this section, we'll see how to deploy an ML solution so that our user can consume it, without having to literally hand over our computer.

## Someone else's computer

Back to the big picture of our ML solution, we need our code to run a remote machine, i.e. _someone's_ computer. Ideally, not us.

<figure markdown="span">
  ![Image title](assets/industrialization/ml_system_design.png){ width="90%" }
  <figcaption>Big picture of our ML solution's system design</figcaption>
</figure>

So how about renting someone else's computer, hosting our code there -- now that it's shareable -- and giving our user access to that computer? 

That's where cloud computing comes in.

One way to go about it would be to go on our Azure, AWS or GCP platform and setup a ressource to host our ML solution. What these platforms provide is convenience and scalability, but that comes at a price.

A more-hands-on -- and cheaper -- way of doing this is renting a **Virtual Private Server (VPS)**[^1] and setting everything up ourselves.

[^1]: It is basically a piece of physical machine. A lot bit like a _Virtual Machine (VM)_. I really like this solution because one VPS can be used in several projects. It's like having a side-project-dedicated machine.

The internet is ripe with low-cost VPS offers. I went with Infomaniak -- a Swiss-based cloud services company -- but others exist.

<figure markdown="span">
  ![Image title](assets/deployment/infomaniak.png){ width="80%" }
  <figcaption>A side-project-dedicated machine for 3CHF/month.</figcaption>
</figure>

## Basic VPS setup

Now that we have our VPS, how do we access it?

During the renting-out process, the VPS provider -- here Infomaniak -- gave us a SSH private/public key pair.
Knowing this private key, I can authenticate myself to our remote machine and access it -- through SSH -- over the internet.

```bash title="SSH into our VPS"
ssh -i ~/<PATH_TO_VPS_PRIVATE_KEY> <USER_REMOTE_MACHINE>@<IP_REMOTE_MACHINE>
```

Amazing! Now, writing out our remote machine's IP all the time can be cumbersome. As with most VPS, its public IP is static. Hence, I can assign a subdomain[^2] to it, so that anyone -- including me -- can refer to its public IP via its subdomain.

[^2]: When you own a domain -- e.g. `arthurgassner.ch` -- you can create subdomains -- e.g. `thisisasubdomain.arthurgassner.ch` -- at your will. This can come in handy.

In practice, this means going on my domain registrar's website -- in my case _GoDaddy_ -- and _adding a new DNS record_ of Type A[^3], whose name is `thisisasubdomain` pointing to my VPS's public IP..

[^3]: More informations on DNS record types can be found [here](https://en.wikipedia.org/wiki/List_of_DNS_record_types)

<figure markdown="span">
  ![Image title](assets/deployment/ping_vps.gif){ width="100%" }
  <figcaption>Pinging our VPS via its public IP and via its subdomain.</figcaption>
</figure>

Similarly, this now mean that we can SSH into our remote machine through said subdomain.

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="100%" }
  <figcaption>Accessing our remote machine through SSH<br>via our newly-created subdomain.</figcaption>
</figure>

Now, to make things more comfortable, we can setup our VPS with productivity tools, as we would with any newly-installed machine.

## Pull the software's latest version

Great, now we have a freshly-intalled machine. How can we get our production-ready code onto it? With [Github deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys).

Deploy keys are SSH keys that grant read-only access to a single repository. 

<figure markdown="span">
  ![Image title](assets/modelling/placeholder.png){ width="100%" }
  <figcaption>Screenshot of the github deploykey interface, adding the rmeote machine's ssh key.</figcaption>
</figure>

## Containerize with Docker

Docker to run my software in a packaged, reproducible way

Screen not to have 

## Reverse Proxy

Access from the outside: caddy

## Time-triggered automation

Cron

## Conclusion
