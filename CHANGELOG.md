### 1.4.4

-   Add `persistenceClear` method to `PersistableStore` (via `bindStorage`)

### 1.4.4

-   Guard against undefined window object (SSR)

### 1.4.3

-   Upgrade @loopmode/events 1.0.5 (SSR)

### 1.4.2

-   Do not create store methods for the "name" field
-   Add withDecorators for usage without decorator syntax

### 1.4.0

-   New store decorator: `decorators/bindStorage`
-   ImmutableStore: Accept options object in constructor
-   ImmutableStore: Accept options.env to check for `NODE_ENV==='development'` and refresh alt devtools

### 1.2.1

-   Add eslint+prettier setup, fix formatting
-   Refresh devtool upon store instantiation

### 1.2.0

-   Add `createAction` for single actions
-   Add readme from NISV project
-   Add hosted documentation

### 1.1.0

-   Drop `promise` depdendency.

### 1.0.0

-   Breaking changes:

    -   Rename `createCall` and `define` to ``callFactory`and`create`
        -   Before: `createCall('myCall').define({...})`
        -   After: `callFactory('myCall').create({...})`
    -   Rename `createViewAction` and `define` to `handlerFactory` and `create`
        -   Before: `createViewAction('myAction').define({...})`
        -   After: `handlerFactory('myAction').create({...})`

-   Add tests

### 0.9.6

-   Create and use a default `alt` instance. Using `setAltInstance` is not required anymore.

### 0.9.5

-   Execute side effects with timeout
