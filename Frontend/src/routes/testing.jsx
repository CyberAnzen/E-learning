import React from "react";
import Usefetch from "../hooks/Usefetch";

const Testing = () => {
  const { Data, error, loading } = Usefetch(
    "classification/sidebar/685e8efc37d146b7013e307e"
  );
console.log("rendered")
  return (
    <section className="min-h-screen p-4">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div>{JSON.stringify(Data)}</div>
    </section>
  );
};

export default Testing;
