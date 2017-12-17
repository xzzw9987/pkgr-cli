<div align="center">
<div>
    <img width="140" src="https://raw.githubusercontent.com/xzzw9987/pkgr-cli/master/github/mixer.png"/>
</div>

<h1>Pkgr</h1>
</div>

Pkgr is a blazing fast, and zero-configuration module bundler for web browser.  
## Features  
* 😀 Bundle anything as entry (such as js, html, css).
* ⚡  Blazing fast speed compared with webpack or parcel.
* 🛠 **Everything can be a module**, automatically transform asset using babel, postcss without any configuration.
* ☕  Built-in **hot module replacement** save your precious time when re-compiling the code.
* 🏗 Generate scaffold by only few steps.

## Install  
Use your favourite package manager, npm or yarn  
Install globally:  
```
yarn global add pkgr-cli
```  

or you can install within local project:  
```
yarn add pkgr-cli -D
```

## Usage
Generate scaffold:
```
pkgr-cli init
``` 
and then develop your project:  
```
cd YourProject && yarn && yarn start
```  
After developing, build your project:  
```
yarn build
```  
Open your browser and happy coding !😗

## Motivation  
Webpack's configuration is always hard to be understood. There are so many loaders & plugins you should use to get things work, and lots of obscure concepts. The most bad part is that the documentation is not so detailed if we want to write some plugins by our own.  
So the idea of writing a module bundler just came out. The bundler itself should omit huge configuration file, be tiny and fully-featured, and focus on html which is the real entry of web apps.Pkgr has better performance, and it needs nearly zero configuration to help you getting rid of complicated config work. 

## Community  
Meet problems? Or just want to say something ?  
Welcome to open an issue !  

## License
MIT   
