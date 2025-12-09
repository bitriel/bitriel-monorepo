# Registry configuration
REGISTRY ?= image.koompi.org/library
TAG ?= latest

# Platforms for multi-arch builds (comma-separated)
PLATFORMS ?= linux/amd64,linux/arm64

# Buildx builder name
BUILDER ?= bitriel-builder

# Image names
BACKEND_IMAGE := $(REGISTRY)/bitriel-backend:$(TAG)
WEB_IMAGE := $(REGISTRY)/bitriel-web:$(TAG)

.PHONY: help
help:
	@echo "Usage:"
	@echo "  make build                # build both images (local arch)"
	@echo "  make build-backend        # build backend (local arch)"
	@echo "  make build-web            # build web (local arch)"
	@echo "  make push                 # push both images"
	@echo "  make push-backend         # push backend"
	@echo "  make push-web             # push web"
	@echo "  make buildx               # multi-arch build+push both images"
	@echo "  make buildx-backend       # multi-arch build+push backend"
	@echo "  make buildx-web           # multi-arch build+push web"
	@echo "Variables:"
	@echo "  TAG=<tag>                 # image tag (default: latest)"
	@echo "  REGISTRY=<registry>       # registry (default: image.koompi.org/library)"
	@echo "  PLATFORMS=<list>          # default: linux/amd64,linux/arm64"
	@echo "  BUILDER=<name>            # buildx builder name (default: bitriel-builder)"

.PHONY: build build-backend build-web
build: build-backend build-web

build-backend:
	docker build -f apps/backend/Dockerfile -t $(BACKEND_IMAGE) .

build-web:
	docker build -f apps/web/Dockerfile -t $(WEB_IMAGE) .

.PHONY: push push-backend push-web
push: push-backend push-web

push-backend:
	docker push $(BACKEND_IMAGE)

push-web:
	docker push $(WEB_IMAGE)

# --- Buildx (multi-arch) ---

.PHONY: buildx buildx-backend buildx-web buildx-init

# Ensure buildx builder exists and is selected
buildx-init:
	@docker buildx inspect $(BUILDER) >/dev/null 2>&1 || docker buildx create --name $(BUILDER) --driver docker-container --use
	@docker buildx use $(BUILDER)

buildx: buildx-backend buildx-web

buildx-backend: buildx-init
	docker buildx build --platform $(PLATFORMS) -f apps/backend/Dockerfile -t $(BACKEND_IMAGE) . --push

buildx-web: buildx-init
	docker buildx build --platform $(PLATFORMS) -f apps/web/Dockerfile -t $(WEB_IMAGE) . --push

