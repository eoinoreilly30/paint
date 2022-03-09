# Grid Paint
A website for everyone to interact with a grid of colours

### Development
Tailwind CSS:
```
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```
### Production
Build
```
docker build -t eoinoreilly30/grid-paint:latest -f docker/Dockerfile .
```
Run
```
docker run --name grid-paint -p 3000:3000 eoinoreilly30/grid-paint:latest
```
