import { useEffect, useState } from 'react';
import Head from 'next/head';
import ReactMapGL, { Popup, Marker } from 'react-map-gl';
import { BiMapPin } from 'react-icons/bi';

export default function Home() {
  const [viewport, setViewport] = useState({
    width: '420px',
    height: '420px',
    latitude: 51.3,
    longitude: -106,
    zoom: 2.46,
    // minZoom: 1,
  });

  const [field, setField] = useState({
    latitude: '',
    longitude: '',
    image: '',
  });

  const [popup, setPopUp] = useState({
    open: false,
    car: '',
    latitude: '',
    longitude: '',
  });

  const [cars, setCars] = useState([]);

  const onMarkerClick = index => {
    setPopUp({
      ...cars[index],
      open: true,
    });
  };

  useEffect(() => {
    console.log(field);
  }, [field]);

  const Markers = ({ data }) => {
    return data.map((car, index) => (
      <Marker onClick={onMarkerClick} key={index} longitude={car.longitude} latitude={car.latitude}>
        <BiMapPin onClick={e => onMarkerClick(index)} />
      </Marker>
    ));
  };

  const inputHandler = e => {
    e.preventDefault();
    let { name, value } = e.target;

    if (name === 'image') {
      if (e.target.files && e.target.files[0]) {
        setField({
          ...field,
          image: URL.createObjectURL(e.target.files[0]),
        });
      }
    } else {
      setField({
        ...field,
        [name]: parseFloat(value),
      });
    }
  };

  const saveNewCarHandler = () => {
    console.log('1');
    if (field.latitude !== '' && field.longitude && field.image !== '') {
      let newCars = [...cars];
      newCars.push(field);

      setCars(newCars);
      console.log(2);
    }
    console.log(3);
  };

  return (
    <>
      <Head>
        <title>Car Tracking App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="center">
        <div className="content-area">
          <div className="content-handler">
            <div className="input-box">
              <input
                type="text"
                name="latitude"
                placeholder="latitude (51)"
                onChange={e => inputHandler(e)}
              />
              <input
                type="text"
                name="longitude"
                placeholder="longitude (-106
                  )"
                onChange={inputHandler}
              />
              <input type="file" name="image" onChange={inputHandler} />
              <button onClick={saveNewCarHandler}>Add New Car</button>
            </div>
            <div className="counter">{cars.length}</div>
          </div>

          <div className="car-gallery"></div>
          <div className="map-area">
            <ReactMapGL
              mapStyle="mapbox://styles/mapbox/dark-v10"
              mapboxApiAccessToken={process.env.MAPBOX_KEY}
              {...viewport}
              onViewportChange={nextViewport => setViewport(nextViewport)}
            >
              <Markers data={cars} />
              {popup.open ? (
                <Popup
                  latitude={popup.latitude}
                  longitude={popup.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setPopUp({ open: false })}
                  anchor="top"
                >
                  <img src={popup.image} alt="" srcset="" />
                </Popup>
              ) : null}
            </ReactMapGL>
          </div>
        </div>
      </div>
    </>
  );
}
