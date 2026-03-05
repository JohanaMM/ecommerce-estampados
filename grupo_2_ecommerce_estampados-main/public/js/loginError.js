window.addEventListener("load", function(){
    let submitButton = this.document.querySelector(".login-button")
    let emailField = this.document.querySelector("#email")
    let passwordField = this.document.querySelector("#password")
    let errorEJS = this.document.querySelector("#error-list")
    errorEJS.style.color = "crimson"
    

    let errors = []

    submitButton.addEventListener("click", function(event){
        if(emailField.value == ""){
            errors.push("Escribe tu email en el campo de email.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }else if(!emailField.value.includes(".")){
            errors.push("Debes ingresar un email válido.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
        }else if(!emailField.value.includes("@")){
            errors.push("Debes ingresar un email válido.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
        }else if(passwordField.value == ""){
            errors.push("Ingresa tu contraseña en el campo de contraseña.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
        }
    })
})