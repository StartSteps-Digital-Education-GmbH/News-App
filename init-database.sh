#!/bin/bash
set -e

# Connect to the default database 'postgres' and create the required databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE news_app_db;
    CREATE DATABASE news_app_test;
EOSQL
