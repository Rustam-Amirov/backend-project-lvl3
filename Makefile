lint:
	npx eslint .
lint-fix:
	npx eslint . --fix
test:
	DEBUG=axios npx jest
test-coverage:
	npm test -- --coverage --coverageProvider=v8
install:
	npm install