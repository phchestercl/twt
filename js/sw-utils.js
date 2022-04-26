//Archivo Auxiliar del ServiceWorker
function actualizaCacheDinamico(dynamicCache,request,response){
    console.log('Entro a la funcion actualizaCacheDinamico')
    if(response.ok){
        console.log(`Response ok`)
        caches.open(dynamicCache).then( cache => {
            cache.put(request,response.clone())
            return response.clone()
        })
    } else {
        console.log(response)
        return response
    }
}