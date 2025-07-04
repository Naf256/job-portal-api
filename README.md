# 🧰 Job Portal API

A RESTful API for a job portal application that allows **companies** to register and post job listings, while **users** can browse companies and job openings. This API serves as the backend for a job portal system and can be integrated with a frontend application or mobile app.

---

## ✨ Features

- 🔐 Company Sign-Up / Registration
- 📝 Company can create and manage job postings
- 🏢 View all registered companies
- 📄 View all job posts from a specific company
- 🔍 Search and view details of individual job posts

---

## 📚 Endpoints Overview

### 🏢 Companies

- `POST /api/register` - Register a new company
- `POST /api/login` - Login company  
- `POST /api/companys` - Create a new Profile for a company
- `GET /api/companys/:id` - Find all the posts for a company using id  
- `GET /api/companys` - Get all Companies registered on the website 

### 💼 Jobs

- `POST /api/add-jobs` - Create a new job post (company-authenticated)  
- `GET /api/all-jobs` - Get a list of all job posts  
- `GET /api/companys/jobs/:id` - Get details of a specific job post  

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Sqlite3**
- **Muttler** - for file upload handling

---

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/job-portal-api.git
   cd job-portal-api
   ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the server:

    ```bash
    npm run dev
    ```
