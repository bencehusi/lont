# Konstruktor Web

This is a [Next.js](https://nextjs.org/) project.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Getting Started

To run the dev command you'll concurrently and local-ssl-proxy. This is necessary to be able to serve on localhost through https, so we can use StoryBlok preview during development.

See more: https://www.npmjs.com/package/concurrently

Make sure you're in your project folder

```bash
cd konstruktor-front-end
```

Before starting the dev server, create local certificates (if they wouldn't exist already):

1. Install mkcert globally

```bash
brew install mkcert
# or
choco install mkcert
```

2. Run the mkcert insallations cripts

```bash
mkcert -install
```

3. Create the necessary keys in your project folder for localhost

```bash
mkcert localhost
```

4. Then you can start the dev server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3010](http://localhost:3010) with your browser to see the result.

## This site is deployed on Vercel

On each push to the git repo, the deployment runs automatically.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## How to add a new site?

To make a separate website (e.g.: under a different domain name) you have to create a new deployment.

You can do that via Vercel by setting up a new project or on your own server [Next.js deployment documentation](https://nextjs.org/docs/deployment).

This action will require to rebuild the code. In Vercel you can just easily click "Redeploy" once you did the following points:

### 1) Make sure to set up these environment variables:

- SITE_DEPLOYMENT_NAME: an arbitrary name of your new deployment (e.g.: if the domain will be konstruktor.hu, you can name it konstruktor-hu).
- SITE_DOMAIN: the hostname of where you will deploy the website (DO NOT include www)
- ACTIVE_LANGUAGES: a comma separated value of two letter ISO codes your site will support (e.g.: en,de,hu)
- DEFAULT_LANGUAGE: the two letter iso string of the language that'll be the default (meaning all url-s will be root URL-s for this language, without the language code)

### 2) Create the necessary folders in Storyblok

- Create a folder in your project root with the same name as your SITE_DEPLOYMENT_NAME
- Add a folder named after the two letter ISO string of a language (e.g., en for English, de for German, etc)
- Add the home page of this language folder and check the "root" option
- Add a WebsiteGlobals content type with the slug of "globals" to the language folder - this entity holds the links for the navbar and every piece of content for the footer
- From here you can start adding pages as you would normally do

## How to add a new language for a deployment?

This action will require to rebuild the code. In Vercel you can just easily click "Redeploy" once you did the following points:

- Add the two letter ISO code of the new language to the ACTIVE_LANGUAGES anvironment variable
- In Storyblok, under the deployment folder (e.g., konstruktor-hu) create a folder named after the two letter ISO string of a language (e.g., en for English, de for German, etc)
- Add the home page of this language folder and check the "root" option
- Add a WebsiteGlobals content type with the slug of "globals" to the language folder - this entity holds the links for the navbar and every piece of content for the footer
- From here you can start adding pages as you would normally do

## How to add blog/projects/jobs?

For each of these collection-types there are two content types:

- a Home (e.g., BlogHome, ProjectHome, etc) content type that will collect all the "Post" content types from under the folder
- a Post (e.g., BlogPost, etc) content type that server as the post and will be picked up and listed by the Home content type

1. Create a folder you want your collection to reside (e.g., blog)
2. Add a Home content type (e.g., BlogHome) and check the "root" option
3. You can start adding Post content types and they will be listed on the root URL (e.g., /blog)

## Stripe

### Dev info

To listen to webhooks run the Stripe CLI

`stripe listen --forward-to localhost:3000/api/webhooks`
