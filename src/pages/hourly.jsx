function Hourly({ data }) {
  return (
    <>
      <p>Hourly page</p>
      {data && <p> {data.hourly[24].temp} </p>}
    </>
  );
}

export default Hourly;
