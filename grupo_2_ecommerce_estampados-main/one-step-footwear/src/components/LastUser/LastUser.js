import React, { useState, useEffect } from "react";
import { API_USERS } from "../../config";
import "./LastUser.css";

function LastUser() {
  const [lastUser, setLastUser] = useState(null);

  useEffect(() => {
    fetch(API_USERS)
      .then((res) => res.json())
      .then((data) => {
        const usersArray = data.users || [];
        if (usersArray.length === 0) return;
        const mostRecentDate = new Date(
          Math.max(...usersArray.map((u) => new Date(u.created_date).getTime()))
        );
        const mostRecent = usersArray.find(
          (u) => new Date(u.created_date).getTime() === mostRecentDate.getTime()
        );
        setLastUser(mostRecent);


      })
      .catch(() => setLastUser(null));
  }, []);

  return (
    <div className="last_user">
      {!lastUser ? (
        <p>Cargando...</p>
      ) : (
        <p>Último usuario registrado: {lastUser.first_name} {lastUser.last_name}.</p>
      )}
    </div>
  );
}

export default LastUser;