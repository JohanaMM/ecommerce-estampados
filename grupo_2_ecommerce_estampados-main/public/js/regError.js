window.addEventListener("load", function(){
    let nameField = this.document.querySelector("#name");
    let lastNameField = this.document.querySelector("#lastName")
    let emailField = document.querySelector("#email")
    let passwordField = document.querySelector("#password")
    let submitButton = this.document.querySelector(".reg-button")
    let errorEJS = this.document.querySelector("#error-list")
    errorEJS.style.color = "crimson";
    let errors = []


    

    submitButton.addEventListener("click", function(event){

        if(nameField.value == ""){
            errors.push("Escribe tu nombre en el campo de nombre.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault();
        }else if(nameField.value.length < 2){
            errors.push("El campo de nombre debe tener al menos 2 caractéres.")
            
            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault();
        }else if(lastNameField.value == ""){
            errors.push("Escribe tu apellido en el campo de apellido.")
            
            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
        }else if(lastNameField.value.length < 2){
            errors.push("El campo de apellido debe tener al menos 2 caractéres.")
            
            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            
            event.preventDefault();
        }else if(emailField.value == ""){
            errors.push("Escribe tu email en el campo de email.")
            
            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
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
            errors.push("Escribe tu nueva contraseña en el campo de contraseña.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
        }else if(passwordField.value.length < 8){
            errors.push("Tu nueva contraseña no debe de tener menos de 8 caractéres.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }
            
            event.preventDefault();
        }else{
            alert("Registro exitoso.")
        }
    })
})
