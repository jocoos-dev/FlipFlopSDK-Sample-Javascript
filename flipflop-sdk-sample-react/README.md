# flipflop-sample

# Get Started
## If you don't have npm
```
$ npm install -g npm@latest
```

## build and start this project
```
$ npm install && npm run start:dev
```

## below address using web browser
> If you don't have appKet & appSecret, You can get them from [FlipFlop.tv](https://flipflop.tv)
```
http://localhost:3000?appKey=${appKey}&appSecret=${appSecret}
```


# Build Step
## If you don't have docker, Install docker desktop first.
[See this site](https://www.docker.com/products/docker-desktop)

## build and deploy to dev environment
```
// build by production env with sdk build 
$ npm run build:dev-nested
or 
$ npm run build:dev
```

## Make a docker image
```
$ docker build -t dev.jocoos.com/ff-web-demo:develop .
```

## Push a docker image to docker registry
```
$ docker push dev.jocoos.com/ff-web-demo:develop
```

## Pull and delop in dev server
```
$ docker pull dev.jocoos.com/ff-web-demo:develop
$ docker rm -f ff-web-demo
$ docker run --net=host --name ff-web-demo -v /var/log/ff-web-demo/:/var/log/nginx/ -d dev.jocoos.com/ff-web-demo:develop
```

---

## build and deploy to production environment with sdk env
``` 
// build by production env with sdk build 
$ npm run build:prod-nested
or 
$ npm run build:prod
```

## Make a docker image
``` 
$ docker build -t dev.jocoos.com/ff-web-demo:prod .
```

## Push a docker image to docker registry
```
$ docker push dev.jocoos.com/ff-web-demo:prod
```

## Pull and delop in production server
```
$ docker pull dev.jocoos.com/ff-web-demo:prod
$ docker rm -f ff-web-demo
$ docker run --net=host --name ff-web-demo -v /var/log/ff-web-demo/:/var/log/nginx/ -d dev.jocoos.com/ff-web-demo:prod
```
