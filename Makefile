lint:
	npx eslint .
lint-fix:
	npx eslint . --fix
test:
	DEBUG=page-loader
	npx jest
test-coverage:
	npm test -- --coverage --coverageProvider=v8
install:
	npm install