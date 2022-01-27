# Admin Keycloak Users with NodeJs and Express ( API )

Run postgres container

```
docker run -d --name postgres \
    -p 5432:5432 \
    -e POSTGRES_DB=keycloak \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -v ~/database/postgres:/var/lib/postgresql/data \
    --restart always postgres:latest

```

Run keycloak container

```
docker run -d --name keycloak \
    -p 8080:8080 \
    -e DB_VENDOR=postgres \
    -e DB_ADDR=postgres \
    -e DB_DATABASE=keycloak \
    -e DB_SCHEMA=public \
    -e DB_USER=postgres \
    -e DB_PASSWORD=postgres \
    -e KEYCLOAK_USER=admin \
    -e KEYCLOAK_PASSWORD=admin \
    --link postgres \
    --restart always quay.io/keycloak/keycloak:latest
```