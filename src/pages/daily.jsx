function Daily({ data }) {
  return (
    <>
      <p>Daily page</p>
      {data && <p> {data.daily[0].humidity} </p>}
    </>
  );
}

export default Daily;
