# PixelVault - Wallpaper Gallery

A modern wallpaper gallery application built with React and deployed on Netlify.

## Features

- Browse wallpapers by category
- Search functionality
- Sort by trending, downloads, newest, or random
- Detailed wallpaper view with download option
- Responsive design for all devices

## Deployment on Netlify

This project is configured for seamless deployment on Netlify.

### Automatic Deployment

1. Push your code to a GitHub repository
2. Log in to Netlify and click "New site from Git"
3. Select your repository
4. Use the following settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

Netlify will automatically detect the `netlify.toml` configuration file and set up the necessary redirects and serverless functions.

### Manual Deployment

To deploy manually:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build the project: `npm run build`
3. Deploy to Netlify: `netlify deploy --prod`

### Local Development with Netlify Functions

To test Netlify functions locally: `npm run netlify-dev`

## Project Structure

- `/src` - React application source code
- `/public` - Static assets
- `/netlify/functions` - Serverless functions for the API
- `netlify.toml` - Netlify configuration

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
