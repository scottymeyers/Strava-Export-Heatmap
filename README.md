## Strava Export Heatmap

1. Obtain your Strava Data by logging into https://www.strava.com/ on Desktop. Then navigate to **Settings** > **My Account** > **Download or Delete Your Account** and select **Get Started** to create a **Download Request**.

2. Clone this project, and once you receive an email containing a link for the Strava Export, download, unzip and then copy the contents of the **activities** directory into the **activities** directory in the root of this project.

3. Run `yarn convert`, which takes all of the GPX files in the **activities** directory, converts them to JSON, and outputs them all in `public/activities.json`.

4. Run `yarn ui-build`, which bundles the frontend javascript, and outputs `public/bundle.js` and `public/bundle.js.map`.

5. Run `yarn start`, which starts an Express application listening on port `3000`.

---

<img width="2557" alt="Screen Shot 2022-01-20 at 9 12 22 PM" src="https://user-images.githubusercontent.com/969752/150453308-e8a9bda4-c6b8-4b02-8340-501551ad042e.png">
