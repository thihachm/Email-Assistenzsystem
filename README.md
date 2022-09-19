# Event-Recognition System

## Motivation
Creating an email assistance system for the email software Thunderbird. In the first step it should support the user in recognizing events within the email.
## Data
To support event recognition, the first step is to search texts for common and frequent temporal patterns in sentences in order to create regular expressions from them in the next step. The following german and english datasets are being used:
### 1. CODE ALLTAG 2.0
This [dataset](https://github.com/codealltag) is a fully pseudonymized collection of emails in german language.
### 2. Enron Email Dataset
This [dataset](https://www.cs.cmu.edu/~enron/) contains data from about 150 users, mostly senior management of "Enron", organized into folders. The corpus contains a total of about 0.5M messages.

## Helper (python modules)

- generation - scrapes various sources to generate text for pattern search
- preprocessing - sanitises text
- extraction -  extracts pattern from text (NYI)

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