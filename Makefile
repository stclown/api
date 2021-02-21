APP_CONTAINER=graphql

.DEFAULT_GOAL := help

# Colors
BLACK     := $(shell tput -Txterm setaf 0)
GREEN     := $(shell tput -Txterm setaf 2)
WHITE     := $(shell tput -Txterm setaf 7)
YELLOW    := $(shell tput -Txterm setaf 3)
YELLOW_BG := $(shell tput -Txterm setab 3)
RED_BG    := $(shell tput -Txterm setab 1)
RESET     := $(shell tput -Txterm sgr0)

.PHONY: build
build: clean ##@app Build and start the application
	@docker-compose up --build -d

start: check-containers-created ##@app Start development environment (build is required first)
	@docker-compose start

.PHONY: stop
stop: check-containers-created ##@app Stop development environment
	@docker-compose stop

.PHONY: restart
restart: check-containers-created ##@app Restart development environment
	@docker-compose restart

.PHONY: clean
clean: ##@app Stop and remove containers and networks created by 'build'
	@docker-compose down --remove-orphans

.PHONY: shell
shell: ##@app Open shell
	@docker-compose exec $(APP_CONTAINER) sh

.PHONY: logs
logs: ##@app Attach to output from web container
	@docker-compose logs --tail 100 -f $(APP_CONTAINER)

.PHONY: check-containers-created
check-containers-created:
ifeq ($(shell docker-compose ps -q),)
	$(error $(RED_BG)Containers not created. Run "make build" first$(RESET))
endif

# Add help text after each target name starting with '##'
# A category can be added with @category
HELP_FUNC = \
    %help; \
    while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
    print "usage: make [target]\n\n"; \
    for (sort keys %help) { \
    print "${WHITE}$$_:${RESET}\n"; \
    for (@{$$help{$$_}}) { \
    $$sep = " " x (32 - length $$_->[0]); \
    print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
    }; \
    print "\n"; }

.PHONY: help
help: ##@help Show this help.
	@perl -e '$(HELP_FUNC)' $(MAKEFILE_LIST)
