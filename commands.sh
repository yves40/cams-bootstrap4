#---------------------------------------------------------------------------------------------------------------
#   Jun 04 2019   Initial  
#   Jun 26 2019   Try to industrialize the Vue, Express, node, webpack, setup process
#   Jun 28 2019   WIP on MEVNTemplate
#---------------------------------------------------------------------------------------------------------------
#   Latest script here
#---------------------------------------------------------------------------------------------------------------
npm install -g @vue/cli # Ensure the vue cli tool is available
npm install -g @vue/cli-init
#------------------------------------------------------------------------------------ Create a vue application
vue init webpack-simple MEVNTemplate
cd MEVNTemplate
npm install # Set up all downloaded packages
npm run dev # Test the app : Should display a default vue in the browser
#------------------------------------------------------------------------------------ Init a git repos
# Note that /dist and /node_modules are automatically placed in .gitignore
git init
#------------------------------------------------------------------------------------ add pm2 for process management : Installed globally
npm install pm2 -g
npm install pm2@latest -g
#------------------------------------------------------------------------------------ Now time to add Express
npm install express --save
#------------------------------------------------------------------------------------ Create an app.js file to check express
# The app.js file 
  var express = require('express');
  var app = express();
  app.get('/api', (req, res) => {
    res.json({message: 'Welcome to the Server'});
  });
  app.listen(8081, ()=>{
    console.log('API listening on port 8081');
  });
#------------------------------------------------------------------------------------ Quick check with pm2 
pm2 start app.js
#------------------------------------------------------------------------------------ Add cross-env
npm install --save cross-env
#------------------------------------------------------------------------------------ Also integrated in npm script
# Look @ package.json script section
npm run startserver


#---------------------------------------------------------------------------------------------------------------
#   C O D E     R E S E R V O I R
#---------------------------------------------------------------------------------------------------------------
# git init ( Will be done by vue create )
# npm init ( Will be done by vue create )
# Install Vue cli
npm install -g @vue/cli
# Create a vue app
vue create sandbox3
# Install other packages I will use
npm i --save bcryptjs express express-session mongoose passport passport-local axios vee-validate vue vue-router vuex 
npm i --save webpack webpack-cli
npm i --save vuetify
# Additional packages for Vue and png  webpack deployment 
npm i --save style-loader css-loader vue-loader url-loader
# Add this line in package.json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "start": "webpack"
  },
# 
npm install express --save


