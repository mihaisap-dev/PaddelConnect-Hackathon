#  Padel Connect - Hackathon MVP

Padel Connect este o platformă completă pentru pasionații de padel, creată pentru a facilita rezervarea terenurilor și gestionarea cluburilor sportive. Proiectul a fost dezvoltat ca un MVP funcțional în cadrul unui Hackathon.

---

##  Funcționalități Principale
- **Vizualizare Cluburi:** Listă completă cu cluburile de padel, rating-uri și prețuri medii.
- **Detalii Club & Terenuri:** Informații specifice despre locație, facilități și terenuri disponibile.
- **Sistem de Rezervări:** Utilizatorii pot selecta terenul și intervalul orar dorit.
- **Dashboard Manager:** Interfață dedicată pentru administratorii de cluburi (Adăugare/Editare cluburi).
- **Profil Utilizator:** Gestionarea informațiilor personale și istoricul rezervărilor ("My Bookings").

---

##  Tehnologii Utilizate
- **Backend:** Django 4.2, Django REST Framework, PostgreSQL.
- **Frontend:** React.js, React Router, Tailwind CSS, Axios.
- **Bază de date:** PostgreSQL (Local Development).

---

##  Ghid de Instalare și Configurare Locală

Urmați pașii de mai jos pentru a configura mediul de dezvoltare și a rula aplicația.

### 1. Clonarea Proiectului
bash
git clone [https://github.com/mihaisap-dev/PaddelConnect-Hackathon](https://github.com/mihaisap-dev/PaddelConnect-Hackathon)
cd padel-hackathon

### 2. Configurare Backend (Django)
-cd backend

#### Crearea și activarea mediului virtual
-python3 -m venv venv
-source venv/bin/activate  # Pe Windows: venv\Scripts\activate

#### Instalarea dependențelor necesare
-pip install -r requirements.txt

#### Configurarea bazei de date (PostgreSQL)
#### Asigurați-vă că datele de conectare din settings.py coincid cu cele locale
-python manage.py migrate

#### Crearea unui cont de administrator (Opțional)
-python manage.py createsuperuser

#### Pornirea serverului de dezvoltare
-python manage.py runserver
-Serverul va fi accesibil la: http://127.0.0.1:8000/

### 3. Configurare Frontend (React)
-cd frontend

####Instalarea pachetelor Node.js
-npm install

#### Pornirea aplicației React
-npm start

---

## Administrare și API Reference
-**Admin Panel:** Interfața de administrare este disponibilă la http://127.0.0.1:8000/admin/.

-**Endpoint-uri API:** Datele sunt servite sub prefixul /api/ (ex: /api/clubs/, /api/bookings/).
