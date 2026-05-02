-- ============================================================
-- SEED DATA — mirrors all hardcoded data from the old server.js
-- Run after schema.sql
-- Command: psql -U postgres -d portfolio_db -f db/seed.sql
-- ============================================================

-- Clear existing data (safe to re-run)
TRUNCATE projects, skills, experience, education, certifications RESTART IDENTITY CASCADE;

-- ── Projects ────────────────────────────────────────────────
INSERT INTO projects (title, description, tech, type, status, github, live) VALUES
(
  'Money Manager App',
  'A personal finance management app to track income and expenses with advanced filtering, categorized transactions, and a clean Material 3 UI. Offline data persistence using Room and async tasks using Coroutines.',
  ARRAY['Kotlin', 'Jetpack Compose', 'Room', 'MVVM', 'Coroutines', 'Material 3'],
  'Personal',
  'Completed',
  'https://github.com/mddanish222/Money-Manager-app',
  NULL
),
(
  'KR Timber System',
  'Full-stack timber inventory and financial management system with secure authentication, stock tracking, expenditure management, and real-time profit/loss calculation. Deployed on Render with responsive UI.',
  ARRAY['Node.js', 'Express', 'MongoDB', 'HTML', 'CSS', 'JavaScript'],
  'Freelance',
  'Completed',
  'https://github.com/mddanish222/KR-Timber',
  'https://kr-timber.netlify.app'
),
(
  'Arsh Infrastructure',
  'Responsive project management system for a construction company featuring an admin dashboard, secure authentication, and project tracking. Fully completed, awaiting client-side deployment.',
  ARRAY['Flask', 'Python', 'PostgreSQL', 'HTML', 'CSS', 'JavaScript'],
  'Freelance',
  'Awaiting Deployment',
  NULL,
  NULL
),
(
  'Prajayoga E-Paper',
  'Digital newspaper platform with admin controls, secure login, and automated content uploads. Paid freelance project currently in active development.',
  ARRAY['Flask', 'Python', 'MariaDB', 'HTML', 'CSS', 'JavaScript'],
  'Paid Freelance',
  'Ongoing',
  NULL,
  NULL
),
(
  'QR Code Generator',
  'QR generator supporting text, URLs, and live location using qrcode.js and the browser Geolocation API.',
  ARRAY['JavaScript', 'QRCode.js', 'Geolocation API', 'HTML', 'CSS'],
  'Personal',
  'Completed',
  'https://github.com/mddanish222/QR-code-generator',
  'https://mddanish222.github.io/QR-code-generator'
);

-- ── Skills ──────────────────────────────────────────────────
INSERT INTO skills (name, type, level) VALUES
  ('HTML',            'frontend',  90),
  ('CSS',             'frontend',  85),
  ('JavaScript',      'frontend',  80),
  ('React',           'frontend',  70),
  ('Bootstrap',       'frontend',  75),
  ('SvelteKit',       'frontend',  55),
  ('Java',            'backend',   75),
  ('Python',          'backend',   80),
  ('Flask',           'backend',   70),
  ('Node.js',         'backend',   72),
  ('PHP',             'backend',   55),
  ('Kotlin',          'mobile',    75),
  ('Jetpack Compose', 'mobile',    70),
  ('MVVM',            'mobile',    68),
  ('MySQL',           'database',  80),
  ('PostgreSQL',      'database',  72),
  ('MongoDB',         'database',  70),
  ('MariaDB',         'database',  65),
  ('SQLite',          'database',  68),
  ('GitHub',          'tools',     85),
  ('VS Code',         'tools',     90),
  ('Android Studio',  'tools',     72),
  ('Netlify',         'tools',     70),
  ('Canva',           'tools',     75);

-- ── Experience ──────────────────────────────────────────────
INSERT INTO experience (role, company, location, period, stipend, points) VALUES
(
  'Full Stack Developer (Consultant)',
  'Ontum Education Pvt Ltd',
  'Bengaluru',
  'Feb 2026 – Present',
  '₹5,000/month',
  ARRAY[
    'Working on MentorAI platform with hands-on real-world software development.',
    'Contributing to web and application development using modern technologies.',
    'Gaining exposure to development lifecycle and team collaboration.'
  ]
);

-- ── Education ───────────────────────────────────────────────
INSERT INTO education (degree, institution, year, score) VALUES
  ('Bachelor of Computer Applications (BCA)', 'Seshadripuram College, Tumkur University', 'Pursuing', 'CGPA: 8.52 / 10'),
  ('PUC (Commerce)',                           'Vidyaniketan Pre-University College, Tumkur', '2023',     '91.16%'),
  ('SSLC',                                    'Vidyaniketan High School, Tumkur',             '2021',     '79.52%');

-- ── Certifications ──────────────────────────────────────────
INSERT INTO certifications (title, issuer, note) VALUES
  ('Java Full Stack Development',                      'S Spider Institute',  'ISO Certified'),
  ('R Programming for Beginners',                      'Simplilearn',         NULL),
  ('Introduction to Digital Marketing Fundamentals',   'Simplilearn',         NULL),
  ('Buildathon Certificate',                           'College Event',       '2nd Place — Web Dev Challenge'),
  ('CODE VITA Workshop',                               'College',             'C Programming'),
  ('Database Connectivity Workshop',                   'College',             'C# and MSSQL'),
  ('Warehouse Associate',                              'Atos Prayas Foundation', NULL);