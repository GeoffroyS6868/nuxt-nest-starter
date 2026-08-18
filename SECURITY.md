# Security

Report vulnerabilities privately via GitHub security advisories for this repository.

Do not open a public issue for a security report.

Never commit real secrets. Local `.env` files are gitignored. Production secrets belong in Docker secrets or your host's secret store.

In production the API refuses to start if `JWT_KEY` is shorter than 32 characters or `FRONT_URL` is unset. Do not ship the values from `.env.example`.
