function baterPonto() {
  const status = document.getElementById("status");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      status.innerHTML = `
        <p>Ponto registrado!</p>
        <p>Latitude: ${position.coords.latitude}</p>
        <p>Longitude: ${position.coords.longitude}</p>
        <p>Horário: ${new Date().toLocaleString()}</p>
      `;
    });
  } else {
    status.innerHTML = "Geolocalização não suportada.";
  }
}
