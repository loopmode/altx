### 1.1.0

- Drop `promise` depdendency.

### 1.0.0

- Breaking changes: 
    - Rename `createCall` and `define` to ``callFactory` and `create`
        - Before: `createCall('myCall').define({...})`
        - After: `callFactory('myCall').create({...})`
    - Rename `createViewAction` and `define` to `handlerFactory` and `create`
        - Before: `createViewAction('myAction').define({...})`
        - After: `handlerFactory('myAction').create({...})`

- Add tests

### 0.9.6

- Create and use a default `alt` instance. Using `setAltInstance` is not required anymore.

### 0.9.5

- Execute side effects with timeout