/*schema.sql*/
-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run once to set up all tables
-- Command: psql -U postgres -d portfolio_db -f db/schema.sql
-- ============================================================

-- ── Projects ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(150)  NOT NULL,
  description TEXT          NOT NULL,
  tech        TEXT[]        NOT NULL DEFAULT '{}',   -- array of strings
  type        VARCHAR(50)   NOT NULL CHECK (type IN ('Personal', 'Freelance', 'Paid Freelance')),
  status      VARCHAR(50)   NOT NULL CHECK (status IN ('Completed', 'Ongoing', 'Awaiting Deployment')),
  github      VARCHAR(300),
  live        VARCHAR(300),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── Skills ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  type    VARCHAR(50)  NOT NULL CHECK (type IN ('frontend', 'backend', 'mobile', 'database', 'tools')),
  level   INTEGER      NOT NULL CHECK (level BETWEEN 0 AND 100)
);

-- ── Experience ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id        SERIAL PRIMARY KEY,
  role      VARCHAR(150) NOT NULL,
  company   VARCHAR(150) NOT NULL,
  location  VARCHAR(100) NOT NULL,
  period    VARCHAR(100) NOT NULL,
  stipend   VARCHAR(50),
  points    TEXT[]       NOT NULL DEFAULT '{}'
);

-- ── Education ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id          SERIAL PRIMARY KEY,
  degree      VARCHAR(200) NOT NULL,
  institution VARCHAR(200) NOT NULL,
  year        VARCHAR(20)  NOT NULL,
  score       VARCHAR(50)  NOT NULL
);

-- ── Certifications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id     SERIAL PRIMARY KEY,
  title  VARCHAR(200) NOT NULL,
  issuer VARCHAR(150) NOT NULL,
  note   VARCHAR(200)            -- nullable — not all certs have notes
);