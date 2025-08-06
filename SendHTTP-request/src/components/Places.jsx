export default function Places({ title, places, fallbackText, onSelectPlace, isloading, loadingText }) {
  console.log(places);
  return (
    <section className="places-category">
      <h2>{title}</h2>
      {isloading && <p className="fallback-text">{loadingText}</p>}
      {!isloading && places.length === 0 && <p className="fallback-text">{fallbackText}</p>}
      {!isloading && places.length > 0 && (
        <ul className="places">
          {places.map((place) => (
            <li key={place.id} className="place-item">
              <button onClick={() => onSelectPlace(place)}>
                <img src={`http://localhost:3000/${place.image.src}`} alt={place.image.alt} />
                {/* 照片 img src的获取数据方法 */}
                <h3>{place.title}</h3>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
