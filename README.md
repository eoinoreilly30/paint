# Grid Paint
A website for everyone to interact with a grid of colours

### Production
Build
```
docker build -t eoinoreilly30/grid-paint:latest -f docker/Dockerfile .
```
Run
```
docker run --name grid-paint -p 3000:3000 -v /var/lib/api-ssl:/ssl eoinoreilly30/grid-paint:latest
```
