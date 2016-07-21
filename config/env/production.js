module.exports = {
    pgConnectionString: process.env.DATABASE_URL,
    pgPoolSettings: {
        database:'fitness',
        host: 'dokku-postgres-fitness',
        username:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        port: 5432,
        max: 30,
        min:4,
        idleTimeoutMillis: 1000
    }
};
