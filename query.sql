.header on
.mode column

INSERT INTO jobs (id, title, experience, location, description, salary, company_id) VALUES 
(1, 'Software Engineer', '2+ years', 'New York, NY', 'Develop and maintain web applications using modern frameworks.', '$80,000 - $100,000', 2),
(2, 'Product Manager', '5+ years', 'San Francisco, CA', 'Lead product development from ideation to launch, working closely with cross-functional teams.', '$120,000 - $150,000', 1),
(3, 'Data Analyst', '+ years', 'Remote', 'Analyze data to drive business insights and decision-making.', '$70,000 - $90,000', 1),
(4, 'UX Designer', '3+ years', 'Austin, TX', 'Design user-centered interfaces and conduct usability testing.', '$90,000 - $110,000', 1);

select * from jobs;
