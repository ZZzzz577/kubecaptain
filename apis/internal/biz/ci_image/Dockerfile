FROM docker.io/library/golang:1.24.2 AS builder

ENV GOPROXY=https://goproxy.cn

COPY . /src
WORKDIR /src

RUN go mod download &&  \
    mkdir -p bin && \
    go build -o ./bin/server ./...

FROM docker.io/library/debian:stable-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
		ca-certificates  \
        netbase \
        buildah \
        && rm -rf /var/lib/apt/lists/ \
        && apt-get autoremove -y && apt-get autoclean -y \
        && echo 'unqualified-search-registries = ["docker.io"]' > /etc/containers/registries.conf

COPY --from=builder /src/bin /app

WORKDIR /app

CMD ["./server"]