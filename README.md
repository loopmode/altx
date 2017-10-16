# altx

Flux framework developed for the NISV client, built on top of (alt)[http://alt.js.org/].
It extends alt by adding a couple of concepts.

[![docs](https://doc.esdoc.org/github.com/loopmode/altx/badge.svg)](https://doc.esdoc.org/github.com/loopmode/altx/)

## Calls

One of these concepts are calls.  
A call provides a way to define an asynchronous procedure, like fetching data from the server or sending data to it.

A call automatically creates alt actions and hanlders and groups them together in a single place.

```

    import {callFactory} from '@xailabs/altx';
    import Immutable from 'immutable';
    import Api from 'api';

    export default callFactory('loadUsers', {namespace: 'users'}).create({
        dataSource: {
            remote: () => Api.get(Api.endpoints.USERS)
        },
        reducers: {
            loading(state) {
                return state.setIn(['pending', 'loadUsers'], true);
            },
            error(state) {
                return state.setIn(['pending', 'loadUsers'], false);
            },
            success(state, payload) {
                return state
                    .setIn(['pending', 'loadUsers'], false)
                    .set('users', Immutable.fromJS(payload.items));
            }
        }
    });

```

The call creates three actions: 

- The `users:loadUsers.loading` action is dispatched when the request is made
- The `users:loadUsers.success` action is dispatched when a response with status code below 400 is received
- The `users:loadUsers.error` action is dispatched when a response with status code above 400 was reiceved

The actions are namespaced so they don't collide globally, but "inside the call" we simply speak of `loading` or `success` in the short form.  
The namespace should, by convention, be the name of the responsible store, but it's really just used by the developer, for debugging or understanding logs.  

If you need to access the generated actions manually, which is not very common, you'd import the call and access them using its `actions` property:

```

    import loadUsers from 'calls/loadUsers';

    // manually dispatching the action:
    loadUsers.actions.success(payload);

    // the generated name 'users:loadUsers.success' is available per UPPERCASE notation
    actionListeners.addActionListener(loadUsers.actions.SUCCESS, (payload) => {...});

```

Additionally, the call creates three handler methods on the store and binds them to the actions. Each handler uses the reducer defined in the call and sets its result as the next state. Something like:

```

    @bind(loadUsers.actions.loading)
    _loadUsers_loading(payload) {
        const nextState = loadUsers.reducers.loading(this.state, payload);
        this.setState(nextState);
    }
    @bind(loadUsers.actions.success)
    _loadUsers_success(payload) {
        const nextState = loadUsers.reducers.success(this.state, payload);
        this.setState(nextState);
    }
    @bind(loadUsers.actions.error)
    _loadUsers_error(payload) {
        const nextState = loadUsers.reducers.error(this.state, payload);
        this.setState(nextState);
    }

```

Each of those methods automatically 


## Migrating a "call" to altx

This is a changelog of a migration. The functionality loads favourite folders from the server and was previously spread across three files: Action names were defined in `FavActions.js`, data fetching was defined in `FavSource.js` and data handling was defined in the store itself, `FavStore.js`.  
There was a manual handling of pending state, and components were listening for a flag `isLoadingFolders` directly on the store state.
This was changed to the call convention of using `setIn(['pending', 'callName'], true)`, however the components only had to change their binding from `isLoadingFolders` to `pending.loadFolders as isLoadingFolders`. Due to the flexible decorator syntax, no further changes were needed inside components.

Note that most of the change is just removing stuff. The entire functionality is replaced by the couple of lines at the end of the diff.

```

    diff --git a/src/app/components/FavDialogs/FavFolderSelect.jsx b/src/app/components/FavDialogs/FavFolderSelect.jsx
    index 151e788..f2a82de 100644
    --- a/src/app/components/FavDialogs/FavFolderSelect.jsx
    +++ b/src/app/components/FavDialogs/FavFolderSelect.jsx
    @@ -15,7 +15,7 @@ import {injectIntl, intlShape, defineMessages, FormattedMessage} from 'react-int
     
     const StoreConnection = connect([ {
         store: FavStore,
    -    props: ['folders', 'isLoadingFolders', 'recentlyUsedFolder']
    +    props: ['folders', 'pending.loadFolders as isLoadingFolders', 'recentlyUsedFolder']
     }]);
     
     const messages = defineMessages({
    diff --git a/src/app/routes/user/routes/favourites/components/folders/FavFoldersPage.jsx b/src/app/routes/user/routes/favourites/components/folders/FavFoldersPage.jsx
    index cc68e72..8d71f44 100644
    --- a/src/app/routes/user/routes/favourites/components/folders/FavFoldersPage.jsx
    +++ b/src/app/routes/user/routes/favourites/components/folders/FavFoldersPage.jsx
    @@ -26,7 +26,7 @@ const messages = defineMessages({
     const Stateful = connect([
         {
             store: FavStore,
    -        props: ['folders', 'isLoadingFolders', 'favs']
    +        props: ['folders', 'pending.loadFolders as isLoadingFolders', 'favs']
         }
     ]);
     
    diff --git a/src/stores/favourites/FavActions.js b/src/stores/favourites/FavActions.js
    index b80521e..e46956b 100644
    --- a/src/stores/favourites/FavActions.js
    +++ b/src/stores/favourites/FavActions.js
    @@ -5,10 +5,6 @@ export default alt.generateActions(
         'handleFolderError',
         'handleItemError',
     
    -    'loadingFolders',
    -    'handleFolders',
    -    'handleFoldersError',
    -
         'loadingFavs',
         'handleFavs',
     
    diff --git a/src/stores/favourites/FavSource.js b/src/stores/favourites/FavSource.js
    index e5ac3b9..0722ac5 100644
    --- a/src/stores/favourites/FavSource.js
    +++ b/src/stores/favourites/FavSource.js
    @@ -2,15 +2,6 @@ import FavActions from './FavActions';
     import Api from 'api';
     
     export default {
    -    // Fetch all available folders
    -    loadFolders() {
    -        return {
    -            loading: FavActions.loadingFolders,
    -            success: FavActions.handleFolders,
    -            error: FavActions.handleFolderError,
    -            remote: (state, options) => Api.get(`${Api.endpoints.FAVOURITES_FOLDERS}?fields=+createdAt,+modifiedAt&sort=name`, null, options)
    -        };
    -    },
         // Fetch all favs in a folder
         loadFavs() {
             return {
    diff --git a/src/stores/favourites/FavStore.js b/src/stores/favourites/FavStore.js
    index 65ff114..b8c62ec 100644
    --- a/src/stores/favourites/FavStore.js
    +++ b/src/stores/favourites/FavStore.js
    @@ -16,15 +16,13 @@ class FavStore extends ImmutableStore {
     
         constructor() {
             super({
    -            isLoadingFolders: false,
                 folders: [],
                 favs: [],
                 isLoadingFavs: false,
                 recentlyUsedFolder: null,
                 folderError: null,
                 itemError: null,
                 pending: {}
             });
             this.exportPublicMethods({
    @@ -40,21 +38,6 @@ class FavStore extends ImmutableStore {
     
         //====================================================================
         //
    -    // LOAD FOLDERS
    -    //
    -    //====================================================================
    -
    -    @bind(FavActions.loadingFolders)
    -    loadingFolders() {
    -        this.change({isLoadingFolders: true});
    -    }
    -    @bind(FavActions.handleFolders)
    -    handleFolders(payload) {
    -        this.change({isLoadingFolders: false, folders: payload.items});
    -    }
    -
    -    //====================================================================
    -    //
         // LOAD FAVS
         //
         //====================================================================
    @@ -118,21 +101,9 @@ class FavStore extends ImmutableStore {
             this.change({favs: favs.delete(deletedIndex)});
         }
     
    -    //====================================================================
    -    //
    -    // ERRORS
    -    //
    -    //====================================================================
    -
    -
    -    @bind(FavActions.handleFolderError)
    -    handleFolderError(folderError) {
    -        this.change({folderError, isLoadingFolders: false, isLoadingFavs: false});
    -        console.error('error getting fav folder: ', folderError);
    -    }
         @bind(FavActions.handleItemError)
         handleItemError(itemError) {
    -        this.change({itemError, isLoadingFavs: false, isLoadingFolders: false});
    +        this.change({itemError, isLoadingFavs: false});
             console.error('error getting fav item: ', itemError);
         }
     }
    diff --git a/src/stores/favourites/calls/index.js b/src/stores/favourites/calls/index.js
    index 66f8a2c..3673c8e 100644
    --- a/src/stores/favourites/calls/index.js
    +++ b/src/stores/favourites/calls/index.js
    @@ -1,6 +1,7 @@
     import {getSources} from '@xailabs/altx';
     const calls = [
         require('./loadActions').default,
    +    require('./loadFolders').default,
     ];
     export default calls;
     
    diff --git a/src/stores/favourites/calls/loadFolders.js b/src/stores/favourites/calls/loadFolders.js
    new file mode 100644
    index 0000000..8e61168
    --- /dev/null
    +++ b/src/stores/favourites/calls/loadFolders.js
    @@ -0,0 +1,22 @@
    +import {callFactory} from '@xailabs/altx';
    +import Api from 'api';
    +import Immutable from 'immutable';
    +/**
    + * loads all fav folders of the current user
    + */
    +export default callFactory('loadFolders', {namespace: 'favs'}).create({
    +    dataSource: {
    +        remote: (state, options) => Api.get(`${Api.endpoints.FAVOURITES_FOLDERS}?fields=+createdAt,+modifiedAt&sort=name`, null, options)
    +    },
    +    reducers: {
    +        loading: (state) => state.setIn(['pending', 'loadFolders'], true),
    +        error: (state) => state.setIn(['pending', 'loadFolders'], false),
    +
    +        success(state, payload) {
    +            return state
    +                .setIn(['pending', 'loadFolders'], false)
    +                .set('folders', Immutable.fromJS(payload.items));
    +        }
    +    }
    +});
    +

```
