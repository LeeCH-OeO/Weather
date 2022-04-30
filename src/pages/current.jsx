function Current({ data }) {
  return (
    <>
      <p>Current page</p>
      {data && <p>現在溫度: {data.current.temp} </p>}
    </>
  );
}

export default Current;
