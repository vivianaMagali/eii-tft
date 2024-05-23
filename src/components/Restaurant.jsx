import React from "react";
import { useParams } from "react-router";

const Restaurant = () => {
  const { id } = useParams();
  return <div>Restaurant: {id}</div>;
};

export default Restaurant;
