
export  function ServicePost( {service} ) {
  return (
    <div>
          <h1>{service.user}</h1>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
          <h3>Price: {service.price}</h3>
          <h3>Availability: {service.aviliability ? "Available" : "Not Available"}</h3>
          <h4>Location: {service.location}</h4>
          {service.image && <img src={service.image} alt={service.title} />}
          <h4>Category: {service.category}</h4>
          <h4>Subcategory: {service.subcategory}</h4>
          <hr />
    </div>
  )
}
