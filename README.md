# Autokorjaamo-Backend-Projekti
Ryhmä/Soolo 21

Backend projekti koulua varten. Tarkoituksena luoda autokorjaamolle varaus API ja simppelit kotisivut. Asiakas pääsee varaamaan palvelun kalenterista.

## Features
- Asiakas voi
    - Varata ajan autokorjaamolle: palvelu, mekaanikko ja ajankohta on valittavissa
    - Pääsee katsomaan varausta, kirjautumalla sähköpostilla ja ajanvarauksen koodilla

- Admin voi
    - Kirjautua sisään admin tunnuksilla (koulua varten nämä on kovakoodattu index.js tiedostoon, muuten olisi env tiedostossa piilossa)
    - Tarkastella kaikkia ajanvarauksia
    - Muokata tai poistaa varauksia

## Setup & Run

1. **Clone repo**  
   ```bash
   git clone 
   cd

2. **Install dependencies**
    ```bash
    npm install express mongoose express-session express-handlebars @handlebars/allow-prototype-access handlebars uuid doten

3. **Lisää MongoDB yhteys**
    ```bash
    .env tiedostoon
    URI=<MongoDB connection string>

4. **Run the app**
    ```bash
    npm start

## Made with
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Handlebars](https://img.shields.io/badge/Handlebars-%23000000?style=for-the-badge&logo=Handlebars.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
