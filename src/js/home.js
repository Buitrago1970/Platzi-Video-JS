
//metodo usado para jQuery

  // $.ajax('https://randomuser.me/api/psdopsdf', {
  //   method: 'GET',
  //   success: function(data){
  //     console.log(data)
  //   },
  //   error: function(error){
  //     console.log(error)
  //   }
  // })
//javaScript puro

//se hace una funcion asincrona y se usa los parentesis para llamar a la funcion automaticamente *API*
(async function loud(){

    //selectores (DOM)
    const $form = document.getElementById('form')
    const $home = document.getElementById('home')
    const $featuringContainer = document.getElementById('featuring')
    //modal
    const $overlay = document.getElementById('overlay')
    const $modal = document.getElementById('modal')
    const $hideModal = document.getElementById('hide-modal')
    //documentos del modal
    const $h1Modal = $modal.querySelector('h1')
    const $imgModal = $modal.querySelector('img')
    const $ModalDescription = $modal.querySelector('p')

    //base de la API
    BASE_API = 'https://yts.mx/api/v2/'
    randomUser_API = 'https://randomuser.me/api/?exc=info,registered,timezone,nat&results=5'
  //otra funcion asincrona para conseguir los datos, se le pasa la url

   $form.addEventListener('submit', async(event) =>{
     //funcionan para detener la recarga de la pagina
    event.preventDefault()
     //agregamos una clase al home, cambia el home para buscar la pelicula
     $home.classList.add('search-active')
     //funcion de js para crear un img 
     const $loader = document.createElement('img')
     setAtributes($loader,{
       src:'src/images/loader.gif',
       heigth:50,
       width:50
     })
     //se muestra el louder (gif de carga) 
     $featuringContainer.append($loader);
     //FormData va a abstraerr todos los valores de los elementos del formulario que cuenten con un atributo 'name' asignado y los va a setear en un objeto de tipo FormData.
     const data = new FormData($form);
     //destructuracion de objetos === promise.data.movies
     try {
      const{
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API}list_movies.json?&query_term=${data.get('name')}`)
      const HTMLString = createTemplate(pelis[0])
      $featuringContainer.innerHTML = HTMLString
     } catch (error) {
       $loader.remove
       $home.classList.remove('search-active')
       setTimeout(function(){ alert(error.message); }, 100);
     }
   })
    async function cacheExist(category){
      const listName = `${category}List`
      const cacheList = window.localStorage.getItem(listName)
      if(cacheList){
        return JSON.parse(cacheList)
      }
      const {data:{movies:data}} = await getData(`${BASE_API}list_movies.json?genre=${category}`)
      window.localStorage.setItem(listName, JSON.stringify(data))
      return data
    }

  //guarda los datos en una constante, contenendores de genero de peliculas, llamdo a funcion renderMovieList  
  //peticion usuarios
  const {results:friendsList} = await getData(randomUser_API)
  const $friendsContainer = document.getElementById('friendsList')
  renderFriendList(friendsList, $friendsContainer)

  const {data:{movies:MyPlayList}} = await getData(`${BASE_API}movie_suggestions.json?movie_id=1`)
  const $MyPlayListContainer = document.getElementById('MyPlaylist')
  renderMyPlayList(MyPlayList, $MyPlayListContainer)
  renderMyPlayList(MyPlayList, $MyPlayListContainer)

  const actionList = await cacheExist('action')
  const $actionContainer = document.getElementById('action')
  renderMovieList(actionList, $actionContainer, 'action')

  const dramaList = await cacheExist('drama')
  const $dramaContainer = document.getElementById('drama')
  renderMovieList(dramaList, $dramaContainer, 'drama')

  const animationList = await cacheExist('animation')
  const $animationContainer = document.getElementById('animation')
  renderMovieList(animationList, $animationContainer, 'animation' )


  async function getData(url){
    //obtine la respuesta
    const response = await fetch(url)
    //obtine los datos
    const data = await response.json()
    if(data.data && data.data.movie_count > 0){
       return data;
     }else if(data.results){
       return data
     }
     throw new Error('no se encontro ningun resultado :(')
    //retorna los datos
  }
  function renderMyPlayList(list,$container){
    $container.children[0].remove()
    list.forEach((data) =>{
        const HTMLString = MyPlayListTemplate(data)
        const dataElement = createTemplates(HTMLString)
        $container.append(dataElement)
    })
  }
  function MyPlayListTemplate(data){
    return(
      `<li class="myPlaylist-item" data-id="${data.id}" data-category="${data.genres[0]}">
      <a href="#">
        <span>
          ${data.title}
        </span>
      </a>
    </li>`
    )

  }
  function userTemplate (data){
    return(
      `<li class="playlistFriends-item" data-id="${data.login.uuid}">
              <a href="#">
                 <img src="${data.picture.thumbnail}">
                <span>
                ${data.name.first} ${data.name.last}
                </span>              
              </a>
      </li>`
    )
  }
  function userDescriptionTemplate(data){
    return(
      `<ul class="userDescriptionTemplate"> 
      <li id='dataModalAge'><span class="dataModalField">age</span> : <span>${data.dob.age}</span></li>
      <li id='dataModalGender'><span class="dataModalField">gender</span> : <span>${data.gender}</span></li>
      <li id='dataModalEmail'><span class="dataModalField">Email</span> : <span>${data.email}</span></li>
      <li id='dataModalCity'><span class="dataModalField">location</span> : <span>${data.location.city}</span></li>
      <li id='dataModalUuid'><span class="dataModalField">uuid</span> : <span>${data.login.uuid}</span></li>
    </ul>`
    )
  }
  function encontrarUser(list,id){
    return list.find( element => element.login.uuid == id)
  }
  function renderFriendList(list,$container){
    $container.children[0].remove()
    list.forEach((data) =>{
        const HTMLString = userTemplate(data)
        const dataElement = createTemplates(HTMLString)
        $container.append(dataElement)
        addEventClick(dataElement)
    })
  }
  //render movie
   function setAtributes($element,attributes){
    for(const attribute in attributes){
      $element.setAttribute(attribute, attributes[attribute])
    }
  }
  function createTemplate(peli){
    return(
      `<div class="featuring">
          <div class="featuring-image">
            <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${peli.title}</p>
          </div>
      </div>`
    )
  }
  //templates
  function videoItemTemplate(movie,category){
    return(
          `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
            <div class="primaryPlaylistItem-image">
              <img src="${movie.medium_cover_image}">
            </div>
            <h4 class="primaryPlaylistItem-title">
              ${movie.title}
            </h4>
          </div>`
    )
}
  //hace el html
  function createTemplates(HTMLString){
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = HTMLString
    return html.body.children[0]
  }
  //funcion para dar evento de click a cada una de las peliculas
  function addEventClick($element){
    $element.addEventListener('click', () => {
      showModal($element)
    })
  }
  //pinta los datos del api en nuestro html
  function renderMovieList(list, $container,category){
    //removemos cualquier objeto que este en el container (gif de carga) que esta en el HTML
      $container.children[0].remove();
      //ciclo que se va a repetir por el numero de peliculas (forEach)
      //movie es cada pelicula que esta en el list
      list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category)
      const movieElement = createTemplates(HTMLString)
      $container.append(movieElement)
      //.append es un metodo para mostrar datos html
      addEventClick(movieElement)
      //funcion para escuchar el click (pasamos todas las peliculas)
    })
  }
  function encontrarId(list, id){
    //usando el metodo .find encontramos la pelicula y retornamos
    return list.find((element) => element.id === id)
  }
  function buscarId (id, category){
    //buscamos por categoria
    switch (category) {
      case 'action':
        //retornamos la pelicula ya encontrada llamando a la funcion 
        return encontrarId(actionList, id)
      case 'drama':
        return encontrarId(dramaList, id)
        case 'animation':
          return encontrarId(animationList, id)
    }
  }
  function showModal($element){
    //pone el fondo gris
    debugger
    $overlay.classList.add('active')
    //animacion de donde viene el modal
    $modal.style.animation = 'modalIn .8s forwards'
    //guardamos id y comvertimos a numero
    const id = parseInt($element.dataset.id, 10) 
    //guardamos categoria
    const uuid = $element.dataset.id
    const category = $element.dataset.category
    //guardamos la informacion de la pelicula llamndo a la funcion buscraID
    try {
      const data = buscarId(id, category)
      //usando el metodo .textContent remplazamos el titulo de la pelicula
      $h1Modal.textContent = data.title
      //usando la funcion setAttribute cambiamos la imagen
      $imgModal.setAttribute('src', data.medium_cover_image)
      //cambiamos la descripcion de la pelicula jaja xd
      $ModalDescription.textContent = data.description_full
    } catch (error) {
      const data = encontrarUser(friendsList,uuid)
      $h1Modal.textContent = data.name.first + data.name.last
      $imgModal.setAttribute('src', data.picture.large)
      $ModalDescription.textContent = null
      //renderizado del modal para el usuario
      const HTMLString = userDescriptionTemplate(data)
      const userElement = createTemplates(HTMLString)
      $ModalDescription.append(userElement)
    }
  }
  //funcion para esconder el modal
  $hideModal.addEventListener('click',() => {
    if($ModalDescription.children[0]){
      $ModalDescription.children[0].remove()
    }
    $overlay.classList.remove('active')
    $modal.style.animation = 'modalOut .8s forwards'
  })
})()

      