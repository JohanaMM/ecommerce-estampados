window.addEventListener("load", function(){
    let nameField = this.document.querySelector("#name")
    let descriptionField = this.document.querySelector("#description")
    let priceField = this.document.querySelector("#price")
    let submitButton = this.document.querySelector(".form-btns-btn")
    let errorEJS = this.document.querySelector("#error-list")
    errorEJS.style.color = "crimson"
    let errors = []

    submitButton.addEventListener("click", function(event){
        if(nameField.value == ""){
            errors.push("Debes ingresar el nombre del producto.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }else if(nameField.value.length < 5){
            errors.push("El nombre del producto debe tener más de 5 caractéres.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }else if(descriptionField.value == ""){
            errors.push("Debes agregar una descripción de más de 20 caractéres.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }else if(descriptionField.value.length < 20){
            errors.push("La descripción debe tener más de 20 caractéres. Piensa en los colores y en los detalles.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }else if(priceField.value == ""){
            errors.push("Debes agregarle un precio al producto.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }else if(priceField.value < 21000){
            errors.push("El valor del producto no puede ser menor de 21.000 COP.")

            if(errors.length > 0){
                
                for(let i=0; i < errors.length; i++){
                    errorEJS.innerHTML += "<li>" + errors[i] +"</li>"
                }
                errors = []
            }

            event.preventDefault()
        }
        else{
            alert("Producto creado exitosamente.")
        }
    })
})