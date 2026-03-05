import React from "react";
import './LastUser.css'
import { useState, useEffect } from 'react';


function LastUser() {


  const [lastUser, setLastUser] = useState([]);
  
  useEffect(function(){
    console.log('%cse montó el componente LastUser en LastUser', 'color: green');
    fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(data => {


      let usersArray = data.users
      let mostRecentDateU = new Date(Math.max.apply(null, usersArray.map( element => {
        return new Date(element.created_date);
      })));


      let mostRecentUser = usersArray.filter( element => {
        let d = new Date( element.created_date );
        return d.getTime() === mostRecentDateU.getTime();
     })[0];

      
      setLastUser(mostRecentUser)


    })
    .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    console.log('%cse actualizó el componente LastUser en LastUser', 'color: yellow');
  }, [lastUser])

  useEffect(() => {
    return() => console.log('%cse desmontó el componente LastUser en LastUser', 'color: red')
  },[])
     

	return(
        <>
            <div className="last_user">
                { LastUser === '' && <p>Cargando...</p> }
                <p>Ultimo usuario registrado: {lastUser.first_name} {lastUser.last_name}.</p>
            </div>
        </>
	);
}

export default LastUser;