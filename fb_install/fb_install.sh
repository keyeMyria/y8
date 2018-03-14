cd ../app
react-native install react-native-fbsdk@0.7.0
#react-native link react-native-fbsdk@0.6.0
cp ../fb_install/AppDelegate.m ios/app/AppDelegate.m
#curl -O https://raw.githubusercontent.com/facebook/react-native-fbsdk/master/bin/ios_setup.js
cp ../fb_install/ios_setup.js .
yarn add plist xcode adm-zip progress got fastfall pump
node ios_setup.js 264622940693926 Yactivity


yarn add eslint-config-rallycoding --dev
yarn add lodash uuid
yarn add moment
yarn add axios
yarn add redux react-redux redux-logger redux-persist redux-thunk
yarn add react-native-navigation
yarn add react-native-segmented-control-tab
yarn add react-native-loading-spinner-overlay@latest
yarn add react-native-extended-stylesheet
yarn add react-native-vector-icons
react-native link react-native-vector-icons
cp ../fb_install/.eslintrc .
