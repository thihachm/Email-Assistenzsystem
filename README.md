# Email-Assistenzsystem

## Motivation
Creating an email assistance system for the email software Thunderbird. In the first step it should support the user in recognizing events within the email.
## Thunderbird Extension
### 1. Build
In order to use the thunderbird extension, the first step is to build it. In this project, webpack is used as a bundler to provide the best and easiest extensibility for the project.
```
cd WebExtension
npm install
npm run webpack
```
### 2. Load
Open the thunderbird app and load the newly build manifest.json from the dist folder. Temporary browser addons can be load through the addon debug option. This option can be found on the addon page in the drop-down menu that appears after clicking the cogwheel in the upper right corner.