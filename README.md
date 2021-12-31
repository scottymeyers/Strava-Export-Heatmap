## Strava Export Heatmap

1. Obtain your Strava Data by logging into https://www.strava.com/ on Desktop. Then navigate to **Settings** > **My Account** > **Download or Delete Your Account** and select **Get Started** to create a **Download Request**.

2. Clone this project, and once you receive an email containing a link for the Strava Export, download, unzip and then copy the contents of the **activities** directory into the **activities** directory in the root of this project.

3. Run `yarn convert`, which takes all of the GPX files in the **activities** directory, converts them to JSON, and outputs them all in `public/activities.json`.

4. Run `yarn ui-build`, which bundles the frontend javascript, and outputs `public/bundle.js` and `public/bundle.js.map`.

5. Run `yarn start`, which starts an Express application listening on port `3000`.

---

If you'd like to make modifications to the frontend javascript, you can run `yarn ui-watch`, which will run builds as it detects changes.

---

<img width="1792" alt="Screen Shot 2021-12-30 at 9 38 53 AM" src="https://user-images.githubusercontent.com/969752/147761359-de52f0f2-4a67-4333-967b-36f67c46f011.png">
