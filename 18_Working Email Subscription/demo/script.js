
    const scriptURL = 'https://script.google.com/a/stylesheets.co/macros/s/AKfycbzl3hk6JfWqMkVz8S1p5Txky_fscyNWJUCuQQHGHfVP5YLH99A/exec'
    const form = document.forms['submit-to-google-sheet']
    const loading = document.querySelector('.js-loading')
    const successMessage = document.querySelector('.js-success-message')
    const errorMessage = document.querySelector('.js-error-message')

    form.addEventListener('submit', e => {
      e.preventDefault()
      showLoadingIndicator()
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => showSuccessMessage(response))
        .catch(error => showErrorMessage(error))
    })

    function showLoadingIndicator () {
      form.classList.add('is-hidden')
      loading.classList.remove('is-hidden')
    }

    function showSuccessMessage (response) {
      console.log('Success!', response)
      setTimeout(() => {
        successMessage.classList.remove('is-hidden')
        loading.classList.add('is-hidden')
      }, 500)
    }

    function showErrorMessage (error) {
      console.error('Error!', error.message)
      setTimeout(() => {
        errorMessage.classList.remove('is-hidden')
        loading.classList.add('is-hidden')
      }, 500)
    }
  
