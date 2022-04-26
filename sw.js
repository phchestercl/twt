//imports
importScripts('js/sw-utils.js')
const STATIC_CACHE='static-v1'
const INMUTABLE_CACHE='inmutable-v1'
const DYNAMIC_CACHE='dynamic-v1'
console.log('Entro en el SW')
const APP_SHEL=[
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
]
const APP_SHELL_INMUTABLE=[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    //'https://kit.fontawesome.com/7997b36988.js',
    //'css/fa/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]
self.addEventListener('install', e=>{
    console.log('Entró al install')
    const cachesStatic= caches.open(STATIC_CACHE).then(
        cache=>{
            return cache.addAll(APP_SHEL)
        }
    )
    const cacheInmutable= caches.open(INMUTABLE_CACHE)
        .then(cache=> cache.addAll(APP_SHELL_INMUTABLE))

    e.waitUntil(Promise.all([cachesStatic,cacheInmutable]))
})

self.addEventListener('activate', e =>{
    const eliminacionCachesAntiguos = caches.keys().then(keys => {
        keys.forEach(key =>{
            //
            if (key!=STATIC_CACHE && key.includes('static')){
                caches.delete(key)

            }
        })
    })

    e.waitUntil( eliminacionCachesAntiguos)
})
self.addEventListener('fetch',e=>{
    //console.log('Peticion :>> '+e.request.url)
    const respuesta=caches.match(e.request)
    .then(res=>{
        //console.log(e.request)
        //console.log(res)
        if (res){
            //console(res)
            return res
        } else {
            console.log('>>> no encontrada :'+e.request.url)
            //console.log(res)
            return fetch(e.request,/* {mode: 'no-cors'} */).then( newRes=>{
                console.log(newRes)
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            })
        }
    })
    e.respondWith(respuesta)
})

