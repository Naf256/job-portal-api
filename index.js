const path = require('path');
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.static('dist'))
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

const db = new sqlite3.Database('./data.db');

const upload = multer({ storage: multer.memoryStorage() });

app.get('/api/companys/jobs/:id', (req, res) => {
    const id = req.params.id

    const query = `
        SELECT 
            jobs.id AS job_id,
            jobs.title,
            jobs.experience,
            jobs.location,
            jobs.description,
            jobs.salary,
            jobs.deadline,
            jobs.type,
            jobs.creation_date,
            companys.id AS company_id,
            companys.name AS company_name,
            companys.logo AS company_logo,
            companys.description AS company_description,
            companys.contact_email AS company_contact_email,
            companys.contact_phone AS company_contact_phone
        FROM 
            jobs
        JOIN 
            companys ON jobs.company_id = companys.id
        WHERE
            jobs.company_id = ?
    `;
    db.all(query, [id], function(err, rows) {

        if (err) {
            return res.status(400).json({ error: 'wrong credentials' })
        }

        const jobs = rows.map(row => {
            return {
                id: row.job_id,
                title: row.title,
                experience: row.experience,
                location: row.location,
                description: row.description,
                salary: row.salary,
                deadline: row.deadline,
                type: row.type,
                creation_date: row.creation_date,
                company: {
                    id: row.company_id,
                    name: row.company_name,
                    logo: row.company_logo ? row.company_logo.toString('base64'): null,
                    description: row.company_description,
                    contactEmail: row.company_contact_email,
                    contactPhone: row.company_contact_phone,
                },
            }
        })

        return res.status(200).json(jobs);

    })
})

app.post('/api/register', (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).json({ error: 'passwords donot match' });
    }

    const query = `INSERT INTO companys (name, email, password) VALUES (?, ?, ?)`;
    db.run(query, [name, email, password], function(err) {
        if (err) {
            return res.status(400).json({ error: 'invalid credentials' })
        }

        return res.status(201).json({ id: this.lastID, name: name })
    })
})

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `SELECT * FROM companys WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'internal server error' })
        } else if (!row){
            return res.status(500).json({ error: 'invalid email or password' })
        } else {
            return res.status(200).json({ 
                id: row.id,
                name: row.name 
            })
        }
    })
})

//create a new profile for a company
app.post('/api/companys', upload.single('logo'), (req, res) => {
  const {
    name, email, password, total_post, tagline, description, contact_email, contact_phone,
  } = req.body;

  const logo = req.file ? req.file.buffer : null;

  const query = `
    INSERT INTO companys (name, email, password, logo, total_post, tagline, description, contact_email, contact_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, password, logo, total_post, tagline, description, contact_email, contact_phone], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ id: this.lastID });
  });
});


app.get('/api/companys/:id', (req, res) => {
    const id = req.params.id
    const query = `SELECT * FROM companys WHERE id = ?`

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'internal server error' })
        }

        if (!row) {
            return res.status(404).json({ error: 'not found' })
        } 

        return res.status(200).json(row)
    })
})

// Route to get all companies, including the logo
app.get('/api/companys', (req, res) => {
  const query = `SELECT id, name, email, total_post, tagline, description, contact_email, contact_phone, logo FROM companys`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const companies = rows.map((row) => {
      return {
        ...row,
        logo: row.logo ? row.logo.toString('base64') : null, // Convert the logo to base64 if it exists
      };
    });

    return res.json(companies);
  });
});





// find all jobs
app.get('/api/all-jobs', (req, res) => {
    const query = `
        SELECT 
            jobs.id AS job_id,
            jobs.title,
            jobs.experience,
            jobs.location,
            jobs.description,
            jobs.salary,
            jobs.deadline,
            jobs.type,
            jobs.creation_date,
            companys.id AS company_id,
            companys.name AS company_name,
            companys.logo AS company_logo,
            companys.description AS company_description,
            companys.contact_email AS company_contact_email,
            companys.contact_phone AS company_contact_phone
        FROM 
            jobs
        JOIN 
            companys ON jobs.company_id = companys.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Format the response
        const jobs = rows.map(row => {
            return {
                id: row.job_id,
                title: row.title,
                experience: row.experience,
                location: row.location,
                description: row.description,
                salary: row.salary,
                deadline: row.deadline,
                type: row.type,
                creation_date: row.creation_date,
                company: {
                    name: row.company_name,
                    logo: row.company_logo ? row.company_logo.toString('base64'): null,
                    description: row.company_description,
                    contactEmail: row.company_contact_email,
                    contactPhone: row.company_contact_phone,
                },
            }
        });

        return res.status(200).json(jobs);
    });
});


app.post('/api/add-jobs', (req, res) => {
    const { title, experience, location, description, salary, company_id, type, deadline, creation_date } = req.body

    const query = `
        INSERT INTO jobs (title, experience, location, description, salary, company_id, type, deadline, creation_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.run(query, [title, experience, location, description, salary, company_id, type, deadline, creation_date], function (err) {
        if (err) {
            return res.status(500).json({ error: 'internal server error' })
        }

        const query_total = `
            UPDATE companys SET total_post = companys.total_post + 1 WHERE id = ?
        `
        db.run(query_total, [company_id], function(err) {
            if (err) {
                return res.status(500).json({ error: 'internal server error' })
            }

            return res.json(201).json({ id: this.lastID })
        })
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

