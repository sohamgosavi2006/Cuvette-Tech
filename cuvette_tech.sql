
SELECT * FROM users_data

-- To Change Table Name
ALTER TABLE jobs RENAME TO tech_jobs;
-- To remove Table / specific id from Table
DROP TABLE jobs
DELETE FROM users_data
WHERE name = 'Soham'

CREATE TABLE users_data(
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(100) ,
	email VARCHAR(100) NOT NULL,
	password VARCHAR(100) NOT NULL
);

INSERT INTO users_data
VALUES
(101,'Soham','sohamgosavi06@gmail.com','testing')



SELECT * FROM tech_jobs

CREATE TABLE tech_jobs (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(100) NOT NULL,
    work_mode VARCHAR(50) NOT NULL CHECK (work_mode IN ('Onsite', 'Remote', 'Hybrid')),
    technologies TEXT[] NOT NULL,
    job_offer VARCHAR(50) NOT NULL,
    salary_min NUMERIC(10,2) NOT NULL,
    salary_max NUMERIC(10,2) NOT NULL,
    start_date DATE NOT NULL,
    openings INT NOT NULL CHECK (openings >= 1),
    experience_range VARCHAR(50) NOT NULL,
    probation_duration INT NOT NULL CHECK (probation_duration >= 0),
    applicants INT NOT NULL CHECK (applicants >= 0),
    application_deadline DATE NOT NULL,
    posted_days_ago INT NOT NULL CHECK (posted_days_ago >= 0),
    high_applicants BOOLEAN NOT NULL,
    linkedin_url TEXT NOT NULL CHECK (linkedin_url LIKE 'https://www.linkedin.com/%'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tech_jobs (
    company_name, location, work_mode, technologies, job_offer, salary_min, salary_max, 
    start_date, openings, experience_range, probation_duration, applicants, 
    application_deadline, posted_days_ago, high_applicants, linkedin_url
) VALUES
('Google', 'Bangalore, India', 'Onsite', ARRAY['React.js', 'Redux'], 'Software Engineer', 12.0, 18.0, '2025-04-01', 3, '2-5 years', 6, 250, '2025-04-10', 2, TRUE, 'https://www.linkedin.com/jobs/view/123456789/'),
('Amazon', 'Hyderabad, India', 'Remote', ARRAY['Node.js', 'Express'], 'Backend Developer', 8.0, 12.0, '2025-04-05', 2, '1-4 years', 3, 180, '2025-04-12', 3, TRUE, 'https://www.linkedin.com/jobs/view/987654321/'),
('Microsoft', 'Pune, India', 'Hybrid', ARRAY['Angular', 'TypeScript'], 'Frontend Developer', 10.0, 15.0, '2025-04-02', 4, '3-6 years', 6, 300, '2025-04-15', 1, TRUE, 'https://www.linkedin.com/jobs/view/1122334455/'),
('Facebook', 'Mumbai, India', 'Onsite', ARRAY['Vue.js', 'GraphQL'], 'Full Stack Developer', 14.0, 20.0, '2025-04-07', 1, '4-7 years', 4, 150, '2025-04-18', 5, FALSE, 'https://www.linkedin.com/jobs/view/5566778899/'),
('Netflix', 'Chennai, India', 'Remote', ARRAY['Python', 'Django'], 'Python Developer', 9.0, 14.0, '2025-04-03', 5, '1-5 years', 3, 200, '2025-04-14', 2, TRUE, 'https://www.linkedin.com/jobs/view/6677889900/'),
('Tesla', 'Delhi, India', 'Onsite', ARRAY['React Native', 'Expo'], 'Mobile App Developer', 11.0, 16.0, '2025-04-08', 2, '2-6 years', 5, 220, '2025-04-17', 4, FALSE, 'https://www.linkedin.com/jobs/view/7788990011/'),
('Apple', 'Kolkata, India', 'Hybrid', ARRAY['Swift', 'iOS Development'], 'iOS Developer', 13.0, 19.0, '2025-04-06', 3, '3-7 years', 6, 180, '2025-04-19', 3, TRUE, 'https://www.linkedin.com/jobs/view/8899001122/'),
('Adobe', 'Ahmedabad, India', 'Remote', ARRAY['PHP', 'Laravel'], 'PHP Developer', 7.0, 11.0, '2025-04-04', 2, '0-3 years', 2, 140, '2025-04-11', 6, FALSE, 'https://www.linkedin.com/jobs/view/9900112233/'),
('Spotify', 'Bangalore, India', 'Onsite', ARRAY['Go', 'Microservices'], 'Go Developer', 10.0, 14.0, '2025-04-09', 1, '2-5 years', 3, 230, '2025-04-16', 5, TRUE, 'https://www.linkedin.com/jobs/view/1011223344/'),
('IBM', 'Hyderabad, India', 'Hybrid', ARRAY['Java', 'Spring Boot'], 'Java Developer', 9.0, 13.0, '2025-04-10', 4, '1-4 years', 4, 270, '2025-04-20', 1, FALSE, 'https://www.linkedin.com/jobs/view/1122334455/');

SELECT * FROM other_jobs

CREATE TABLE other_jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    company_logo VARCHAR(255),
    location VARCHAR(100),
    work_mode VARCHAR(50) NOT NULL,
    salary_min INT,
    salary_max INT,
    experience_range VARCHAR(50),
    skills VARCHAR(255)
);

INSERT INTO other_jobs (title, company_name, company_logo, location, work_mode, salary_min, salary_max, experience_range, skills) VALUES
('Python Developer', 'Wipro', 'https://www.wipro.com/content/dam/nexus/images/wipro-logo.png', 'Pune', 'In-Office', 4, 7, '0-2', 'Python, Django'),
('Frontend Developer', 'TCS', 'https://www.tcs.com/content/dam/tcs/images/logo/tcs-logo.png', 'Mumbai', 'Remote', 3, 6, '1-3', 'React, JavaScript'),
('Data Analyst', 'Infosys', 'https://www.infosys.com/content/dam/infosys-web/en/global-resource/images/infosys-logo.png', 'Bangalore', 'Hybrid', 5, 8, '0-1', 'SQL, Python'),
('Backend Developer', 'HCL', 'https://www.hcltech.com/sites/default/files/hcl_technologies_logo.png', 'Chennai', 'In-Office', 4, 6, '2-4', 'Node.js, Express'),
('UI/UX Designer', 'Accenture', 'https://www.accenture.com/content/dam/accenture/final/accenture-com/images/accenture-logo.png', 'Hyderabad', 'Remote', 3, 5, '0-2', 'Figma, Adobe XD'),
('Machine Learning Intern', 'Cognizant', 'https://www.cognizant.com/content/dam/cognizant/en_us/images/logos/cognizant-logo.png', 'Delhi', 'Hybrid', 5, 9, '1-2', 'Python, TensorFlow'),
('Full Stack Developer', 'Tech Mahindra', 'https://www.techmahindra.com/sites/default/files/techmahindra-logo.png', 'Noida', 'In-Office', 4, 7, '0-3', 'MERN Stack'),
('Cloud Engineer', 'IBM', 'https://www.ibm.com/brand/experience-guides/developer/8f4e5b5d-8a8e-4d1e-8a3e-8e4e5b5d8a8e/logo/ibm-logo.png', 'Kolkata', 'Remote', 6, 10, '2-5', 'AWS, Azure'),
('DevOps Intern', 'Capgemini', 'https://www.capgemini.com/wp-content/uploads/2021/07/Capgemini-logo.png', 'Pune', 'Hybrid', 4, 8, '0-1', 'Docker, Kubernetes'),
('Software Engineer', 'Deloitte', 'https://www2.deloitte.com/content/dam/Deloitte/global/Images/deloitte-logo.png', 'Gurgaon', 'In-Office', 5, 7, '1-3', 'Java, Spring Boot');
