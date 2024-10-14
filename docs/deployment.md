# :octicons-share-android-16: Deployment

## Introduction

We now have a maintainable end-to-end solution, that no one can use -- unless they physically access our computer.

In this section, we'll see how to deploy an ML solution so that our user can consume it, without having to literally hand over our computer.

## Someone else's computer

I don't want to give physical access to my computer to my user, so how about renting someone's computer and give our user access to that computer instead? 

That's where cloud computing comes in.

One way to address this would be to go on our Azure, AWS or GCP platform and setup a ressource to host our ML solution. What these platforms provide is convenience and scalability, but that comes at a price.

On the other end of that spectrum, we can rent a **Virtual Private Server (VPS)**.[^1]

[^1]: It is basically a piece of physical machine. A lot bit like a _Virtual Machine (VM)_.

The internet is ripe with low-cost VPS offers. I went with Infomaniak -- a Swiss-based cloud services company -- but others exist.

<figure markdown="span">
  ![Image title](assets/deployment/infomaniak.png){ width="100%" }
  <figcaption>A VPS for 3CHF/month, count me in.</figcaption>
</figure>

## Basic VPS setup

Getting into it -- SSH

Link subdomain to my VPS' IP, as it's likely static.

Install practical packages to make dealing with my vps more comfortable.

## Pull the software's latest version

Deploy keys to get my software

## Containerize with Docker

Docker to run my software in a packaged, reproducible way

Screen not to have 

## Reverse Proxy

Access from the outside: caddy

## Time-triggered automation

Cron

## Conclusion
