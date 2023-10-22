<!-- Repository Information & Links-->
<br />

![GitHub repo size](https://img.shields.io/github/repo-size/LeandervanAarde/FinFinderServer)
![GitHub watchers](https://img.shields.io/github/watchers/LeandervanAarde/FinFinder)
![GitHub language count](https://img.shields.io/github/languages/count/LeandervanAarde/FinFinderServer)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/LeandervanAarde/FinFinderServer)


<!-- LeandervanAarde/FikaClothing -->

<!-- HEADER SECTION -->
<h3 align="center" style="padding:0;margin:0;">Leander van Aarde</h3>
<h5 align="center" style="padding:0;margin:0;">200211</h5>
<h6 align="center">FinFinder | 2023</h6>
<h6 align="center"><a href="https://fin-finder-n1mzgwlgh-leandervanaarde.vercel.app/">FinFinder website backend</a> </h6>
</br>
<p align="center">

  <a href="https://github.com/LeandervanAarde/FinFinder">
    <img src="https://drive.google.com/uc?export=view&id=1QKoFlOOrMXCMDR3Mb9-ysmpokt7q64Tq" alt="Logo" width="140">
  </a>
<!-- https://drive.google.com/file/d/19JkfDgvGLzHQ1AVMvgv9rLTFR0HzJBVq/view?usp=sharing -->
  
  <h3 align="center">Fin Finder | Fish inventory management</h3>

  <p align="center">
    Find Findder is a Angular website with the aim to assist users with managing their fish and fish related inventory. The platform allows for basic CRUD functionallity including, building tanks, editing inventory and tanks, Deleting tanks and updating quantities. Lastly Fin Finder allows users to select one of the prebuilt tanks to build and start managing. 
    <br />
   <br />
   <br />
<h6 align="center"><a href="https://drive.google.com/file/d/1zIYd3Yj2wJeb64lnx9xvUwc8KE0YqRNW/view?usp=share_link">FinFinder walkthrough</a> </h6>
   <!-- INSERT UP UP -->
    ·
    <a href="https://github.com/LeandervanAarde/FinFinder/issues">Report Bug</a>
    ·
    <a href="https://github.com/LeandervanAarde/FinFinder/issues">Request Feature</a>
</p>
<!-- TABLE OF CONTENTS -->

## Table of Contents

* :tropical_fish: [About the Project](#about-the-project)
* :tropical_fish: [Project Description](#project-description)
* :tropical_fish: [Built With](#built-with)
* :tropical_fish: [Getting Started](#getting-started)
* :tropical_fish: [Prerequisites](#prerequisites)
* :tropical_fish: [How to install](#how-to-install)
* :tropical_fish: [License](#license)
* :tropical_fish: [Contact](#contact)
* :tropical_fish: [Acknowledgements](#acknowledgements)

<!--PROJECT DESCRIPTION-->
## About the Project
<!-- header image of project -->


![image10](/src/assets/Landing1.png)
### Project Description

FinFinder is a comprehensive MEAN stack project that leverages  technologies including Angular 6, Typegoose, MongoDB Atlas, and NodeJS. The project's primary objective is to empower users to efficiently manage their fish inventory and related items, providing them with the capability to effortlessly track and maintain their inventory with up-to-date information.

* [MongoDb Atlas](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [Typegoose](https://typegoose.github.io/typegoose/)

## Getting Started

To get a copied file of this repository, follow the steps below to get it installed on your local machine. 

### Prerequisites

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

## Getting Started

To get a copied file of this repository, follow the steps below to get it installed on your local machine. 

### Prerequisites

Ensure that you have the latest version of [NPM](https://www.npmjs.com/) installed on your machine. The [GitHub Desktop](https://desktop.github.com/) program will also be required.
Ensure that you have the Angular CLI installed on your local machine, you an install it by running the command 

 `npm install -g @angular/cli`

### How to install

### Installation
Here are a couple of ways to clone this repo:

1. GitHub Desktop </br>
Enter `https://github.com/LeandervanAarde/FindFinderServer.git` into the URL field and press the `Clone` button.

2. Clone Repository </br>
Run the following in the command-line to clone the project:
   ```sh
   git clone https://github.com/LeandervanAarde/FinFinderServer.git
   ```
    Open `Software` and select `File | Open...` from the menu. Select cloned directory and press `Open` button

3. Install Dependencies </br>
Run the following in the command-line to install all the required dependencies:
   ```sh
   npm install / npm i
   ```

4. To get access to the database, see contact section to add your IP and get key. 
5. Once in the App, run  ```npm run dev``` to compile in the browser.
 NOTE:   Access to the Mongo is restricted and will only be given access to upon request.
</br>
 </br>

<!-- FEATURES AND FUNCTIONALITY-->
<!-- You can add the links to all of your imagery at the bottom of the file as references -->


#### Backend implementation
<!-- stipulated the highlight you experienced with the project -->
* Users:
    * When users sign up , a document with fish, utilities and Decorations gets generated for each new user, meaning they have their own inventory to manage, this document gets placed in a collection of userMaterials that then holds the userMaterial ID, the user ID along with each items ID and quantity
    * Users set up 3 Security question and when registering and one of the random questions will be asked upon logging in to authenticate the user. 
    * Considering how the data is set up, users need to access subsections in their userMaterials document, avoiding 3 functions in this case was achieved by getting the materials category and sending it to the backend, this meant that I could use one function to access all of my data in the front end. 

* Builds:
    * Crafting builds was the most challenging part of the project, because of each user having their own inventory, I had to specify which build was craftable or not based only on the users ID , this mean taht I had to get the users Materials and the Build requirement. Looping through each of the requirement categories and user materials, I was able to match their ID's and loop through that array, checking if the quantities match or not, breaking at the first requirement that was not meat, ultimately making the tank uncraftable. By creating a new object with a complete value of true or false I was then able to manage that on the front end.  
    * Crafting builds followed the same approach for updating quantitys, although it was a lot easier than getting builds, I would still be required to loop through each category and update the quantity of the users inventory based on the craft requirements.


See the [open issues](https://github.com/LeandervanAarde/FinFinderServer/issues) for a list of proposed features (and known issues).
<!-- AUTHORS -->
## Authors

* [Leander van Aarde](https://github.com/LeandervanAarde/)

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.\

<!-- LICENSE -->
## Contact

* **leander van Aarde** -(mailto: Leander.vaonline@gmail.com) - [@instagram_handle](https://www.instagram.com/_.leander_e/) 
* **Project Link** - https://github.com/LeandervanAarde/FinFinder

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
<!-- all resources that you used and Acknowledgements here -->
* [Stack overflow](https://stackoverflow.com/)
* [Images](https://www.google.com/)
* [Images](https://www.Unsplash.com/)
* [SASS](https://sass-lang.com/)
* [Angular](https://angular.io/)
* [MongoDb Atlas](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [Typegoose](https://typegoose.github.io/typegoose/)
* [MaximilianSchwarzMuller](https://www.udemy.com/course/the-complete-guide-to-angular-2/)
