# Galutine praktine uzduotis

Uzduotis studentams kurie mokesi HTML, CSS, Javascript, Express, Mysql, React, Tailwind.

Jums reikes sukurti Skelbimu sistema kuri leis vartotojams skelbti skelbimus, perziureti skelbimus, redaguoti skelbimus, trinti skelbimus.

Projekta suskirstysime i 3 dalis:

1. Frontend
2. Backend
3. Duomenu baze

Dirbsite su siais resursais:

- skelbimai
- miestai
- kategorijos
- vartotojais

## Backend

Backend dalis bus kuriama naudojant Express.js, Mysql.

1. Sukurti duomenu bazes lenteles
2. Sukurti JSON REST API
3. Sukurti CRUD operacijas

### Duomenu bazes lenteles

1. Skelbimai

   - id
   - title
   - main_image_url
   - description
   - price
   - phone
   - type (sell, buy, rent)
   - town_id
   - user_id
   - category_id
   - created_at
   - is_published

2. Miestai

   - id
   - name
   - population
   - area

3. Vartotojai

   - id
   - name
   - email
   - password
   - avatar_url
   - created_at

4. Kateogrijos

   - id
   - name

   Sukure lenteles i miestu ir kategoriju lenteles irasykite bent po 5 irasus. Tai padare sukurkite bent bent 2 vartotojus ir 5 skelbimus.

### JSON REST API

#### Skelbimu Routes

1. GET /api/ads - grazina visus skelbimus
2. GET /api/ads/:id - grazina viena skelbima
3. POST /api/ads - sukuria nauja skelbima
4. DELETE /api/ads/:id - istrina skelbima (is_published = false)

#### Autentifikacijos Routes

1. POST /api/auth/register - registruoja nauja vartotoja
2. POST /api/auth/login - prisijungia vartotoja
   Slaptazodziai turetu buti saugomi hashuotu formatu. Brcypt arba kitu biblioteku pagalba.
3. PUT /api/auth/user/:id - atnaujina vartotojo informacija

#### Miestu Routes

1. GET /api/towns - grazina visus miestus
2. GET /api/towns/:id - grazina viena miesta
3. POST /api/towns - sukuria nauja miesta
4. DELETE /api/towns/:id - istrina miesta

#### Kategoriju Routes

1. GET /api/categories - grazina visus kategorijas

#### 404 Routes

Bet koks kitas route turetu grazinti 404 statusa json formatu.

### Middleware

1. Post, Put requestu validacijai sukurkite middleware. Tikriname ar visi laukai yra uzpildyti ir ar jie atitinka reikalavimus. Jei nepavyks su middleware, galite naudoti paprasta if salyga.

---

## Frontend

Frontend dalis bus kuriamas naudojant React.js su vite. Marsrutizacija bus naudojama su react router versija 6. Formu validacijai rekomentuojama(nebutina) naudoti Formik ar panasia biblioteka. Stilizavimas galima visias musu perziuretais budais, iskyrus bootrap (ir kitas biblotekas su is anksto aprasytais komponentais). Galite naudoti Css, Scss, Tailwind, Styled Components, module css ir pan. React galite rasyti su javascript arba typescript.

### Navigacija

Sukurti navigacija kuri leist naviguoti i visus puslapius bei bus matoma ar vartotojas prisijunges ar ne.
Navigacija privalo buti pilnai prisitaikanti prie ekrano dydzio ir mobilioje versijoje turetu buti iskvieciama mygtuko paspaudimu.

### Puslapiai

#### 1. Pradinis puslapis - url - /

- Skelbimu sarasas. Kiekvienas skelbimas turi mygtuka skaityti daugiau. Mygtukas turi vesti i skelbimo puslapi. Skelbimu sarasas turetu buti rikiuojamas pagal naujausius skelbimus. Prisijungusio vartotojo skebimai atvaizduojami kitokiu stiliumi.
- Miestu korteliu sarasas
- Kategoriju sarasas
- filtrai

#### 2. Individualaus Skelbimo puslapis (paspaudus ant skelbimo) - url - /skelbimas/:id

- Visa Skelbimo informacija
- Skelbimo paveiksleliai. Pagrindinis paveikslelis paimamas is duomenu bazes. Isikelkite 5 papildomus ivairius paveikslelius ir atvaizuokite karuseleje pagrindini + papildomi paveiksleliai. Karuselej galite naudoti Swiper.js arba bet kokia kita karusele biblioteka arba sukurti savo karusele.
- Skelbimo istrinimas (tik prisijungusiems vartotojams kurie sukure skelbima)

#### 3. Login puslapis - url - /login

Forma leidzianti prisijungti vartotojui su email ir password

#### 4. Register puslapis - url - /register

Forma leidzianti registruoti nauja vartotoja su name, email, password, password_confirmation, avatar_url

#### 5. Skelbimo kurimo puslapis (tik prisijungusiems vartotojams) - url - /skelbimas/sukurti

Forma leidzianti sukurti nauja skelbima su title, description, price, phone, type, town, category.

Category ir town turetu buti select input ar kitaip apibrezti visus miestus ir kategorijas aprasytus duomenu bazeje.

#### 6. Vartotojo puslapis ( tik prisijungusiems vartotojams ) - url - /user/:id

- Vartotojo informacija su forma kuria galima atnaujinti vartotojo varda ir paveiksleli

- Vartotojo skelbimai. Skelbimu sarasas kurie priklauso vartotojui. Kiekvienas skelbimas turi mygtuka istrinti ir skaityti daugiau.

#### 7. 404 puslapis

- Jei vartotojas ivede netinkama url turetu buti atvaizduotas 404 puslapis.

#### 8. Miestai puslapis - url - /towns

- Miestu sarasas korteliu pavidalu. Kiekviena miesta paspaudus turetu buti atidarytas miesto puslapis.

#### 9. Miesto puslapis - url - /town/:id

- Miesto informacija
- Miesto skelbimai. Skelbimu sarasas kurie priklauso miestui. Kiekvienas skelbimas turi mygtuka skaityti daugiau.

### React struktura ir komponentai

- Vienas komponentas turetu buti viename faile, su mazom isimtimis.
- Turetu buti bent keletas UI komponentu (pvz. Button, Input, Select, Modal, Card, Form, Alert ir pan.)
- pasikartojantis html kodas turetu buti iskeliamas i atskirus komponentus ir/arba generuojamas ciklo pabalba.
- Stengtis laikyts react geru praktiku.
- Prisijungus, istrynus skebima ar kitoki veiksma atlikus vykdome automatini perejima i kita atitinkama puslapi.

### Apsaugoti routes

- Apsaugoti routes kurie turi buti pasiekiami tik prisijungusiems vartotojams.
- Routes pasiekiamumas turi buti logiskas. Pvz. vartotojas negali pasiekti login puslapi jei jis jau prisijunges. Vartotojas negali pasiekti user/:id puslapi jei jis nera prisijunges. ir pan.

### Formos

- Visi formu ivesties laukai turetu buti validuojami ir atvaizduojamos klaidos po jais ar bendrai.
- validacijos is backend turi buti atvaizduojamos vartotojui.

### Bendra aplikacijos state

Informacija kuri bus bendra visoje aplikacijoje turi buti sprendziama su React Context arba Redux. (pvz. prisijungusio vartotojo informacija, busena.)

### Filtrai pagr psl

- Filtravimas pagal miesta, kategorija, tipa, kaina
- Skelbimu paieska pagal pavadinima
- Skelbimu rikiavimas pagal naujausius, pigiausius, brangiausius, seniausius, miesta, kategorija, tipa.

Visi filtrai turetu buti atvaizduojami ir veikti be puslapio persikrovimo. Filtruoti galite tiek frontende tiek backende. Filtravimas su paieska ir rikiavimu arba veikia kartu arba ijungus viena isjungiame kita ir tai matosi vartotojui.

### Bendra isvaizda

Dizainas turetu buti grazus, modernus, patogus vartotojui, lengvai suprantamas, prisitaikantis bent i 3 ekrano dydzius (mobilus - nuo 350px , plansetes - nuo 768px , desktopas - nuo 1024px). Apribokite ploti ir super platiems ekranams ties daugiau kaip 1500px. Tie kam sunkiau sekasi funkciniai dalykai, daugiau darbo idekite i atvaizdavima ir taip pasigerinkite pazymi.
